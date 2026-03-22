use tauri::{AppHandle, State};

use crate::services::app_settings_service::{AppSettings, AppSettingsRuntime, AppSettingsService};
use crate::services::window_service::WindowService;

#[tauri::command]
pub async fn get_app_settings(runtime: State<'_, AppSettingsRuntime>) -> Result<AppSettings, String> {
    AppSettingsService::get(&runtime)
}

#[tauri::command]
pub async fn update_app_settings(
    app: AppHandle,
    runtime: State<'_, AppSettingsRuntime>,
    settings: AppSettings,
) -> Result<AppSettings, String> {
    let next = AppSettingsService::update(&app, &runtime, settings)?;
    WindowService::sync_tray_menu_state(&app);
    Ok(next)
}

#[tauri::command]
pub async fn sync_system_locale(
    app: AppHandle,
    runtime: State<'_, AppSettingsRuntime>,
    system_locale: String,
) -> Result<String, String> {
    let next = AppSettingsService::sync_system_locale(&runtime, &system_locale)?;
    WindowService::sync_tray_menu_state(&app);
    Ok(next)
}
