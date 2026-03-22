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

export type KeycastState = { is_listening: boolean; is_overlay_visible: boolean };

export type KeycastOverlayConfig = {
  x: number;
  y: number;
  combo_window_ms: number;
  theme: KeycastTheme;
  text_color: string;
  accent_visible: boolean;
  accent_color: string;
};

export type Locale = "zh-CN" | "en-US";
export type LocaleOverride = Locale | null;
export type AppTheme = "light" | "dark";
export type AppSettings = {
  locale_override: LocaleOverride;
  listen_on_startup: boolean;
  theme: AppTheme;
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
