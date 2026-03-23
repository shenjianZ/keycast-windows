export type KeycastTheme =
  | "keycaps-dark"
  | "keycaps-light"
  | "text-only"
  | "broadcast-orange"
  | "broadcast-green"
  | "minimal-light"
  | "glass-soft"
  | "fresh-mint"
  | "sky-card"
  | "terminal"
  | "neon-cyan"
  | "paper-card";

export type KeycastDisplayMode =
  | "combo-only" // 仅组合键模式（默认）
  | "single-only" // 仅单个按键模式
  | "combo-precedence" // 组合键优先（有组合键显示组合，无则显示单个）
  | "all-sequential" // 所有按键连续显示（不区分组合/单个）
  | "all-sequential-persistent" // 所有按键队列显示（无窗口，不因超时清空）
  | "smart-mixed"; // 智能混合模式

export type KeycastScrollDirection = "horizontal" | "vertical" | "fade";

export type KeycastState = { is_listening: boolean; is_overlay_visible: boolean };

export type KeycastOverlayConfig = {
  x: number;
  y: number;
  combo_window_ms: number;
  theme: KeycastTheme;
  text_color: string;
  accent_visible: boolean;
  accent_color: string;
  // 新增配置项 - 使用 kebab-case 与 Rust 保持一致
  display_mode: KeycastDisplayMode;
  max_consecutive_keys: number;
  consecutive_window_ms: number;
  queue_idle_timeout_ms: number;
  show_key_count: boolean;
  scroll_direction: KeycastScrollDirection;
};

export type Locale = "zh-CN" | "en-US";
export type LocaleOverride = Locale | null;
export type AppTheme = "light" | "dark";
export type AppSettings = {
  locale_override: LocaleOverride;
  listen_on_startup: boolean;
  theme: AppTheme;
  auto_update_enabled: boolean;
  global_shortcut: string;
  global_shortcut_enabled: boolean;
};

export type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "downloading"
  | "downloaded"
  | "up-to-date"
  | "error";

export type UpdateSummary = {
  version: string;
  currentVersion: string;
  body?: string | null;
  date?: string | null;
};

export type UpdateState = {
  status: UpdateStatus;
  currentVersion: string;
  latestVersion: string | null;
  downloadedVersion: string | null;
  contentLength: number | null;
  downloadedBytes: number;
  error: string | null;
  availableUpdate: UpdateSummary | null;
};
