use tauri::{menu::MenuItem, AppHandle, Manager, Runtime, WebviewWindow};

use crate::services::app_settings_service::{AppSettingsRuntime, AppSettingsService};

pub struct TrayMenuState<R: Runtime> {
    pub show_item: MenuItem<R>,
    pub hide_item: MenuItem<R>,
    pub toggle_item: MenuItem<R>,
    pub quit_item: MenuItem<R>,
}

pub struct WindowService;

impl WindowService {
    fn main_window<R: Runtime>(app: &AppHandle<R>) -> Result<WebviewWindow<R>, String> {
        app.get_webview_window("main")
            .ok_or_else(|| "未找到主窗口".to_string())
    }

    pub fn sync_tray_menu_state<R: Runtime>(app: &AppHandle<R>) {
        let locale = app
            .try_state::<AppSettingsRuntime>()
            .map(|runtime| AppSettingsService::current_locale(runtime.inner()))
            .unwrap_or_else(|| "en-US".to_string());
        let Some(state) = app.try_state::<TrayMenuState<R>>() else {
            return;
        };
        let is_visible = Self::main_window(app)
            .and_then(|window| window.is_visible().map_err(|e| e.to_string()))
            .unwrap_or(false);
        let (show_text, hide_text, toggle_text, quit_text) = if locale == "zh-CN" {
            ("显示主窗口", "隐藏窗口", "切换显示/隐藏", "退出应用")
        } else {
            ("Show Window", "Hide Window", "Toggle Window", "Quit")
        };
        let _ = state.show_item.set_text(show_text);
        let _ = state.hide_item.set_text(hide_text);
        let _ = state.toggle_item.set_text(toggle_text);
        let _ = state.quit_item.set_text(quit_text);
        let _ = state.show_item.set_enabled(!is_visible);
        let _ = state.hide_item.set_enabled(is_visible);
    }

    pub fn hide_main_window_to_tray<R: Runtime>(app: &AppHandle<R>) -> Result<(), String> {
        let window = Self::main_window(app)?;
        if window.is_minimized().map_err(|e| e.to_string())? {
            window.unminimize().map_err(|e| e.to_string())?;
        }
        window.hide().map_err(|e| e.to_string())?;
        Self::sync_tray_menu_state(app);
        Ok(())
    }

    pub fn show_main_window<R: Runtime>(app: &AppHandle<R>) -> Result<(), String> {
        let window = Self::main_window(app)?;
        window.show().map_err(|e| e.to_string())?;
        window.unminimize().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
        Self::sync_tray_menu_state(app);
        Ok(())
    }

    pub fn toggle_main_window<R: Runtime>(app: &AppHandle<R>) -> Result<(), String> {
        let window = Self::main_window(app)?;
        if window.is_visible().map_err(|e| e.to_string())? {
            Self::hide_main_window_to_tray(app)
        } else {
            Self::show_main_window(app)
        }
    }
}
