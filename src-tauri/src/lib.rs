use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, Runtime, WindowEvent,
};

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

fn toggle_main_window<R: Runtime>(app: &AppHandle<R>) { let _ = WindowService::toggle_main_window(app); }
fn show_main_window<R: Runtime>(app: &AppHandle<R>) { let _ = WindowService::show_main_window(app); }
fn hide_main_window<R: Runtime>(app: &AppHandle<R>) { let _ = WindowService::hide_main_window_to_tray(app); }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(tauri_plugin_autostart::MacosLauncher::LaunchAgent, None))
        .on_window_event(|window, event| {
            if window.label() == "main" && matches!(event, WindowEvent::CloseRequested { .. }) {
                if let WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close();
                    let _ = WindowService::hide_main_window_to_tray(&window.app_handle());
                }
            }
        })
        .setup(|app| {
            let app_settings = AppSettingsService::initialize(app.handle()).map_err(std::io::Error::other)?;
            let restore_listening = app_settings
                .settings
                .lock()
                .map(|settings| settings.listen_on_startup)
                .unwrap_or(false);
            let show_item = MenuItemBuilder::with_id(SHOW_MENU_ID, "显示主窗口").build(app)?;
            let hide_item = MenuItemBuilder::with_id(HIDE_MENU_ID, "隐藏窗口").build(app)?;
            let toggle_item = MenuItemBuilder::with_id(TOGGLE_MENU_ID, "切换显示/隐藏").build(app)?;
            let quit_item = MenuItemBuilder::with_id(QUIT_MENU_ID, "退出应用").build(app)?;
            app.manage(app_settings);
            app.manage(TrayMenuState {
                show_item: show_item.clone(),
                hide_item: hide_item.clone(),
                toggle_item: toggle_item.clone(),
                quit_item: quit_item.clone(),
            });
            let tray_menu = MenuBuilder::new(app).item(&show_item).item(&hide_item).item(&toggle_item).separator().item(&quit_item).build()?;
            let mut tray = TrayIconBuilder::with_id("main-tray").menu(&tray_menu).tooltip("Keycast Windows").show_menu_on_left_click(false);
            tray = tray.on_tray_icon_event(|tray, event| {
                if let TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, .. } = event {
                    toggle_main_window(tray.app_handle());
                }
            });
            tray = tray.on_menu_event(|app, event| match event.id().as_ref() {
                SHOW_MENU_ID => show_main_window(app), HIDE_MENU_ID => hide_main_window(app), TOGGLE_MENU_ID => toggle_main_window(app), QUIT_MENU_ID => app.exit(0), _ => {}
            });
            if let Some(icon) = app.default_window_icon().cloned() { tray = tray.icon(icon); }
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
            let _ = WindowService::show_main_window(app.handle());
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
