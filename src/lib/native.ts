import { getVersion } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/core";
import type { AppSettings, KeycastOverlayConfig, KeycastState } from "./types";

export const initialOverlayConfig: KeycastOverlayConfig = {
  x: 24,
  y: 24,
  combo_window_ms: 500,
  theme: "text-only",
  text_color: "#111827",
  accent_visible: true,
  accent_color: "#fb923c",
  // 新增配置项默认值
  display_mode: "combo-precedence", // 默认：组合键优先
  max_consecutive_keys: 5, // 最多显示 5 个连续按键
  consecutive_window_ms: 400, // 连续按键时间窗口 400ms
  queue_idle_timeout_ms: 400, // 队列空闲超时 400ms
  show_key_count: false, // 不显示计数
  scroll_direction: "horizontal", // 横向滚动
};

export async function readKeycastState() {
  return invoke<KeycastState>("get_keycast_state");
}

export async function readOverlayConfig() {
  return invoke<KeycastOverlayConfig>("get_keycast_overlay_config");
}

export async function saveOverlayConfig(config: KeycastOverlayConfig) {
  return invoke<KeycastOverlayConfig>("update_keycast_overlay_config", {
    config,
  });
}

export async function toggleKeycast(listening: boolean) {
  await invoke(listening ? "stop_keycast" : "start_keycast");
  return readKeycastState();
}

export async function readAutostart() {
  return invoke<boolean>("plugin:autostart|is_enabled");
}

export async function toggleAutostart(enabled: boolean) {
  await invoke(enabled ? "plugin:autostart|disable" : "plugin:autostart|enable");
}

export async function readAppSettings() {
  return invoke<AppSettings>("get_app_settings");
}

export async function saveAppSettings(settings: AppSettings) {
  return invoke<AppSettings>("update_app_settings", {
    settings,
  });
}

export async function syncSystemLocale(systemLocale: string) {
  return invoke<string>("sync_system_locale", { systemLocale });
}

export async function readAppVersion() {
  return getVersion();
}
