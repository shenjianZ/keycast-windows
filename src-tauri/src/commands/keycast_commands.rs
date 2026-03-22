use tauri::{AppHandle, State};

use crate::services::keycast_service::{
    KeycastOverlayConfig, KeycastRuntime, KeycastService, KeycastState,
};

#[tauri::command]
pub async fn start_keycast(app: AppHandle, runtime: State<'_, KeycastRuntime>) -> Result<(), String> {
    KeycastService::start(&app, &runtime)
}

#[tauri::command]
pub async fn stop_keycast(app: AppHandle, runtime: State<'_, KeycastRuntime>) -> Result<(), String> {
    KeycastService::stop(&app, &runtime)
}

#[tauri::command]
pub async fn get_keycast_state(app: AppHandle, runtime: State<'_, KeycastRuntime>) -> Result<KeycastState, String> {
    KeycastService::get_state(&app, &runtime)
}

#[tauri::command]
pub async fn get_keycast_overlay_config(
    app: AppHandle,
    runtime: State<'_, KeycastRuntime>,
) -> Result<KeycastOverlayConfig, String> {
    KeycastService::get_overlay_config(&app, &runtime)
}

#[tauri::command]
pub async fn prewarm_keycast_overlay(app: AppHandle, runtime: State<'_, KeycastRuntime>) -> Result<(), String> {
    KeycastService::prewarm_overlay_async(&app, &runtime)
}

#[tauri::command]
pub async fn update_keycast_overlay_config(
    app: AppHandle,
    runtime: State<'_, KeycastRuntime>,
    config: KeycastOverlayConfig,
) -> Result<KeycastOverlayConfig, String> {
    KeycastService::update_overlay_config(&app, &runtime, config)
}
