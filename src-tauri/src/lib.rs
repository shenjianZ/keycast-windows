use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager, Runtime, WindowEvent,
};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};

mod commands;
mod services;

use services::{
    app_settings_service::AppSettingsService,
    keycast_service::{KeycastRuntime, KeycastService},
    window_service::{TrayMenuState, WindowService},
};

const SHOW_MENU_ID: &str = "show";
const HIDE_MENU_ID: &str = "hide";
const TOGGLE_MENU_ID: &str = "toggle";
const QUIT_MENU_ID: &str = "quit";
const DEFAULT_SHORTCUT: &str = "Ctrl+Shift+K";
const AUTOSTART_ARG: &str = "--from-autostart";
const DEFAULT_UPDATER_PUBLIC_KEY: &str = "__KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY__";

fn toggle_main_window<R: Runtime>(app: &AppHandle<R>) {
    let _ = WindowService::toggle_main_window(app);
}
fn show_main_window<R: Runtime>(app: &AppHandle<R>) {
    let _ = WindowService::show_main_window(app);
}
fn hide_main_window<R: Runtime>(app: &AppHandle<R>) {
    let _ = WindowService::hide_main_window_to_tray(app);
}

fn is_launched_from_autostart() -> bool {
    std::env::args().any(|arg| arg == AUTOSTART_ARG)
}

fn toggle_keycast_listening(app: &AppHandle) {
    if let Some(runtime) = app.try_state::<KeycastRuntime>() {
        let state = KeycastService::get_state(app, &runtime);
        let result = match state.map(|current| current.is_listening) {
            Ok(true) => KeycastService::stop(app, &runtime),
            Ok(false) => KeycastService::start(app, &runtime),
            Err(err) => Err(err),
        };
        if let Ok(()) = result {
            if let Ok(next) = KeycastService::get_state(app, &runtime) {
                let _ = app.emit("keycast:shortcut-toggled", next);
            }
        } else if let Err(err) = result {
            eprintln!("切换按键监听失败: {}", err);
        }
    }
}

pub(crate) fn sync_global_shortcut(
    app: &AppHandle,
    enabled: bool,
    shortcut: Option<&str>,
) -> Result<(), String> {
    let global_shortcut = app.global_shortcut();
    global_shortcut
        .unregister_all()
        .map_err(|e| format!("注销全局快捷键失败: {}", e))?;
    if !enabled {
        return Ok(());
    }
    let next = shortcut.unwrap_or(DEFAULT_SHORTCUT).trim();
    let app_handle = app.clone();
    global_shortcut
        .on_shortcut(next, move |_handle, _shortcut, event| {
            if event.state == ShortcutState::Pressed {
                toggle_keycast_listening(&app_handle);
            }
        })
        .map_err(|e| format!("注册全局快捷键失败: {}", e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let updater_pubkey = option_env!("KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY")
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .unwrap_or(DEFAULT_UPDATER_PUBLIC_KEY);
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec![AUTOSTART_ARG]),
        ))
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(
            tauri_plugin_updater::Builder::new()
                .pubkey(updater_pubkey)
                .build(),
        )
        .on_window_event(|window, event| {
            if window.label() == "main" && matches!(event, WindowEvent::CloseRequested { .. }) {
                if let WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close();
                    let _ = WindowService::hide_main_window_to_tray(&window.app_handle());
                }
            }
        })
        .setup(|app| {
            let launched_from_autostart = is_launched_from_autostart();
            let app_settings =
                AppSettingsService::initialize(app.handle()).map_err(std::io::Error::other)?;
            let restore_listening = app_settings
                .settings
                .lock()
                .map(|settings| settings.listen_on_startup)
                .unwrap_or(false);
            let saved_shortcut = app_settings
                .settings
                .lock()
                .map(|settings| settings.global_shortcut.clone())
                .unwrap_or_else(|_| DEFAULT_SHORTCUT.to_string());
            let shortcut_enabled = app_settings
                .settings
                .lock()
                .map(|settings| settings.global_shortcut_enabled)
                .unwrap_or(true);
            let show_item = MenuItemBuilder::with_id(SHOW_MENU_ID, "显示主窗口").build(app)?;
            let hide_item = MenuItemBuilder::with_id(HIDE_MENU_ID, "隐藏窗口").build(app)?;
            let toggle_item =
                MenuItemBuilder::with_id(TOGGLE_MENU_ID, "切换显示/隐藏").build(app)?;
            let quit_item = MenuItemBuilder::with_id(QUIT_MENU_ID, "退出应用").build(app)?;
            app.manage(app_settings);
            app.manage(TrayMenuState {
                show_item: show_item.clone(),
                hide_item: hide_item.clone(),
                toggle_item: toggle_item.clone(),
                quit_item: quit_item.clone(),
            });
            let tray_menu = MenuBuilder::new(app)
                .item(&show_item)
                .item(&hide_item)
                .item(&toggle_item)
                .separator()
                .item(&quit_item)
                .build()?;
            let mut tray = TrayIconBuilder::with_id("main-tray")
                .menu(&tray_menu)
                .tooltip("Keycast Windows")
                .show_menu_on_left_click(false);
            tray = tray.on_tray_icon_event(|tray, event| {
                if let TrayIconEvent::Click {
                    button: MouseButton::Left,
                    button_state: MouseButtonState::Up,
                    ..
                } = event
                {
                    toggle_main_window(tray.app_handle());
                }
            });
            tray = tray.on_menu_event(|app, event| match event.id().as_ref() {
                SHOW_MENU_ID => show_main_window(app),
                HIDE_MENU_ID => hide_main_window(app),
                TOGGLE_MENU_ID => toggle_main_window(app),
                QUIT_MENU_ID => app.exit(0),
                _ => {}
            });
            if let Some(icon) = app.default_window_icon().cloned() {
                tray = tray.icon(icon);
            }
            tray.build(app)?;
            WindowService::sync_tray_menu_state(app.handle());
            let runtime = KeycastRuntime::default();
            if let Err(error) = KeycastService::initialize(app.handle(), &runtime) {
                return Err(std::io::Error::other(error).into());
            }
            let _ = KeycastService::prewarm_overlay_async(app.handle(), &runtime);
            app.manage(runtime);
            if restore_listening {
                let runtime = app.state::<KeycastRuntime>();
                let _ = KeycastService::start(app.handle(), &runtime);
            }
            if !launched_from_autostart {
                let _ = WindowService::show_main_window(app.handle());
            }
            if let Err(err) = sync_global_shortcut(
                app.handle(),
                shortcut_enabled,
                Some(saved_shortcut.as_str()),
            ) {
                eprintln!("注册已保存快捷键失败: {}", err);
                let _ = AppSettingsService::update(
                    app.handle(),
                    &app.state::<services::app_settings_service::AppSettingsRuntime>(),
                    services::app_settings_service::AppSettings {
                        global_shortcut_enabled: false,
                        ..AppSettingsService::get(
                            &app.state::<services::app_settings_service::AppSettingsRuntime>(),
                        )
                        .unwrap_or_default()
                    },
                );
                let _ = sync_global_shortcut(app.handle(), false, Some(saved_shortcut.as_str()));
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::app_commands::get_app_settings,
            commands::app_commands::update_app_settings,
            commands::app_commands::sync_system_locale,
            commands::keycast_commands::start_keycast,
            commands::keycast_commands::stop_keycast,
            commands::keycast_commands::get_keycast_state,
            commands::keycast_commands::get_keycast_overlay_config,
            commands::keycast_commands::prewarm_keycast_overlay,
            commands::keycast_commands::update_keycast_overlay_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
