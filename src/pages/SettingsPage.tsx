import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useI18n } from "../i18n";
import type {
  AppTheme,
  KeycastOverlayConfig,
  KeycastState,
  LocaleOverride,
  UpdateState,
} from "../lib/types";
import { SettingsGroup, SettingsRow } from "../components/settings-group";
import { Sun, Moon } from "lucide-react";

const themes = [
  "text-only",
  "keycaps-dark",
  "keycaps-light",
  "broadcast-orange",
  "broadcast-green",
  "minimal-light",
  "glass-soft",
  "fresh-mint",
  "sky-card",
  "terminal",
  "neon-cyan",
  "paper-card",
] as const;
const colorPresets = [
  "#ffffff",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#38bdf8",
  "#a78bfa",
  "#f472b6",
  "#111827",
] as const;

const modifierLabels = ["Ctrl", "Shift", "Alt", "Meta"] as const;

function normalizeShortcutKey(key: string, code?: string) {
  if (code?.startsWith("Digit")) return code.slice(5);
  if (code?.startsWith("Numpad")) return code.slice(6);
  if (code?.startsWith("Key")) return code.slice(3);
  if (code === "Space") return "Space";
  if (code?.startsWith("Arrow")) return code.slice(5);
  if (key === "Control") return "Ctrl";
  if (key === "Shift") return "Shift";
  if (key === "Alt") return "Alt";
  if (key === "Meta") return "Meta";
  if (key === " ") return "Space";
  if (key.length === 1) return key.toUpperCase();
  return key[0]?.toUpperCase() + key.slice(1);
}

function buildShortcutFromEvent(event: React.KeyboardEvent<HTMLInputElement>) {
  const parts: string[] = [];
  if (event.ctrlKey) parts.push("Ctrl");
  if (event.shiftKey) parts.push("Shift");
  if (event.altKey) parts.push("Alt");
  if (event.metaKey) parts.push("Meta");
  const key = normalizeShortcutKey(event.key, event.code);
  if (!modifierLabels.includes(key as (typeof modifierLabels)[number])) {
    parts.push(key);
  }
  return parts.join("+");
}

type Props = {
  state: KeycastState;
  config: KeycastOverlayConfig;
  autostart: boolean;
  localeOverride: LocaleOverride;
  appTheme: AppTheme;
  version: string;
  updateState: UpdateState;
  globalShortcut: string;
  globalShortcutEnabled: boolean;
  updateConfig: (updater: React.SetStateAction<KeycastOverlayConfig>, message: string) => void;
  setNumber: (key: "x" | "y" | "combo_window_ms", value: string) => void;
  toggleListening: () => Promise<void>;
  toggleAutostart: () => Promise<void>;
  setLocaleOverride: (next: LocaleOverride) => Promise<void>;
  setAppTheme: (theme: AppTheme) => Promise<void>;
  checkForUpdates: () => Promise<unknown>;
  downloadLatestUpdate: () => Promise<void>;
  installLatestUpdate: () => Promise<void>;
  setGlobalShortcut: (shortcut: string) => Promise<void>;
  setGlobalShortcutEnabled: (enabled: boolean) => Promise<void>;
};

export function SettingsPage(props: Props) {
  const { locale, t } = useI18n();
  const shortcutInputRef = useRef<HTMLInputElement>(null);
  const [shortcutDraft, setShortcutDraft] = useState(props.globalShortcut);
  const [isRecordingShortcut, setIsRecordingShortcut] = useState(false);
  const updateStatusText =
    props.updateState.status === "checking"
      ? t("updateChecking")
      : props.updateState.status === "available"
        ? t("updateAvailable")
        : props.updateState.status === "downloading"
          ? t("updateDownloading")
          : props.updateState.status === "downloaded"
            ? t("updateDownloaded")
            : props.updateState.status === "up-to-date"
              ? t("updateLatest")
              : props.updateState.error ?? t("updateDesc");
  const updateActionLabel =
    props.updateState.status === "downloaded" ? t("updateInstall") : t("updateDownload");
  const updateProgress =
    props.updateState.contentLength && props.updateState.contentLength > 0
      ? Math.min(100, Math.round((props.updateState.downloadedBytes / props.updateState.contentLength) * 100))
      : null;
  const toastText = (label: string) => (locale === "zh-CN" ? `${label}已更新` : `${label} updated`);
  const setText = (key: "text_color" | "accent_color", value: string, label: string) =>
    props.updateConfig((current) => ({ ...current, [key]: value }), toastText(label));
  const setTheme = (value: string) =>
    props.updateConfig(
      (current) => ({ ...current, theme: value as KeycastOverlayConfig["theme"] }),
      toastText(t("theme"))
    );
  const saveShortcut = () => {
    const next = shortcutDraft.trim() || "Ctrl+Shift+K";
    setIsRecordingShortcut(false);
    void props.setGlobalShortcut(next);
  };
  const startShortcutRecording = () => {
    setIsRecordingShortcut(true);
    window.setTimeout(() => shortcutInputRef.current?.focus(), 0);
  };
  const cancelShortcutRecording = () => {
    setIsRecordingShortcut(false);
    setShortcutDraft(props.globalShortcut);
  };
  const handleShortcutKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.key === "Escape") {
      cancelShortcutRecording();
      return;
    }
    const next = buildShortcutFromEvent(event);
    if (!next) {
      return;
    }
    setShortcutDraft(next);
    if (
      !modifierLabels.includes(
        normalizeShortcutKey(event.key, event.code) as (typeof modifierLabels)[number]
      )
    ) {
      setIsRecordingShortcut(false);
      void props.setGlobalShortcut(next);
    }
  };
  useEffect(() => {
    setShortcutDraft(props.globalShortcut);
  }, [props.globalShortcut]);

  const colorControl = (key: "text_color" | "accent_color", value: string, label: string) => (
    <div className="flex w-[280px] flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {colorPresets.map((item) => (
          <button
            key={item}
            type="button"
            aria-label={item}
            onClick={() => setText(key, item, label)}
            className={`h-6 w-6 rounded-full border-2 ${value.toLowerCase() === item ? "border-slate-900" : "border-white ring-1 ring-slate-200"}`}
            style={{ backgroundColor: item }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          className="w-14 px-1.5 py-1"
          value={value}
          onChange={(e) => setText(key, e.target.value, label)}
        />
        <Input value={value} onChange={(e) => setText(key, e.target.value, label)} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SettingsGroup title={t("displaySection")}>
        <SettingsRow
          title={t("activeOverlay")}
          description={t("activeOverlayDesc")}
          enabled={props.state.is_listening}
          onEnabledChange={() => void props.toggleListening()}
        />
        <SettingsRow
          title={t("globalShortcutEnabled")}
          description={t("globalShortcutEnabledDesc")}
          enabled={props.globalShortcutEnabled}
          onEnabledChange={(checked) => void props.setGlobalShortcutEnabled(checked)}
        />
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 dark:bg-zinc-950">
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-900 dark:text-zinc-100">
              {t("globalShortcut")}
            </div>
            <div className="text-xs text-slate-600 dark:text-zinc-500">
              {t("globalShortcutHint")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              ref={shortcutInputRef}
              className={`w-[180px] font-mono ${isRecordingShortcut ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900" : ""}`}
              value={shortcutDraft}
              readOnly
              disabled={!props.globalShortcutEnabled}
              onMouseDown={(e) => !isRecordingShortcut && e.preventDefault()}
              onBlur={() => (isRecordingShortcut ? saveShortcut() : undefined)}
              onKeyDown={handleShortcutKeyDown}
              placeholder={
                isRecordingShortcut ? t("shortcutPressKeys") : t("shortcutClickToRecord")
              }
            />
            <Button
              type="button"
              variant={isRecordingShortcut ? "default" : "secondary"}
              size="compact"
              disabled={!props.globalShortcutEnabled}
              onClick={() =>
                isRecordingShortcut ? cancelShortcutRecording() : startShortcutRecording()
              }
            >
              {isRecordingShortcut ? t("shortcutCancelRecording") : t("shortcutStartRecording")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="compact"
              disabled={!props.globalShortcutEnabled}
              onClick={() => {
                setShortcutDraft("Ctrl+Shift+K");
                void props.setGlobalShortcut("Ctrl+Shift+K");
              }}
            >
              {t("shortcutResetDefault")}
            </Button>
          </div>
        </div>
      </SettingsGroup>
      <SettingsGroup title={t("themeSection")}>
        <SettingsRow
          title={t("theme")}
          description={t("themeDesc")}
          control={
            <Select value={props.config.theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
        <SettingsRow
          title={t("textColor")}
          description={t("textColorDesc")}
          control={colorControl("text_color", props.config.text_color, t("textColor"))}
        />
        <SettingsRow
          title={t("accentVisible")}
          description={t("accentVisibleDesc")}
          enabled={props.config.accent_visible}
          onEnabledChange={(checked) =>
            props.updateConfig(
              (current) => ({ ...current, accent_visible: checked }),
              toastText(t("accentVisible"))
            )
          }
        />
        <SettingsRow
          title={t("accentColor")}
          description={t("accentColorDesc")}
          control={colorControl("accent_color", props.config.accent_color, t("accentColor"))}
        />
      </SettingsGroup>
      <SettingsGroup title={t("positionSection")}>
        <SettingsRow
          title={t("positionX")}
          description={t("positionXDesc")}
          control={
            <Input
              className="w-[220px]"
              type="number"
              value={props.config.x}
              onChange={(e) => props.setNumber("x", e.target.value)}
            />
          }
        />
        <SettingsRow
          title={t("positionY")}
          description={t("positionYDesc")}
          control={
            <Input
              className="w-[220px]"
              type="number"
              value={props.config.y}
              onChange={(e) => props.setNumber("y", e.target.value)}
            />
          }
        />
        <SettingsRow
          title={t("comboWindow")}
          description={t("comboWindowDesc")}
          control={
            <Input
              className="w-[220px]"
              type="number"
              value={props.config.combo_window_ms}
              onChange={(e) => props.setNumber("combo_window_ms", e.target.value)}
            />
          }
        />
      </SettingsGroup>
      <SettingsGroup title={t("startupSection")}>
        <SettingsRow
          title={t("autostart")}
          description={t("autostartDesc")}
          enabled={props.autostart}
          onEnabledChange={() => void props.toggleAutostart()}
        />
      </SettingsGroup>
      <SettingsGroup title={t("updateSection")}>
        <div className="space-y-3 px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                v{props.version}
                {props.updateState.latestVersion ? ` -> v${props.updateState.latestVersion}` : ""}
              </div>
              <div className="text-sm text-slate-500 dark:text-zinc-500">{updateStatusText}</div>
              {props.updateState.status === "downloaded" ? (
                <div className="text-xs text-emerald-600 dark:text-emerald-400">
                  {t("updateReadyToInstall")}
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="compact" onClick={() => void props.checkForUpdates()}>
                {t("updateCheck")}
              </Button>
              <Button
                type="button"
                size="compact"
                disabled={props.updateState.status === "checking" || props.updateState.status === "downloading"}
                onClick={() =>
                  void (props.updateState.status === "downloaded"
                    ? props.installLatestUpdate()
                    : props.downloadLatestUpdate())
                }
              >
                {updateActionLabel}
              </Button>
            </div>
          </div>
          {updateProgress !== null ? (
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-slate-100 dark:bg-zinc-900">
                <div
                  className="h-2 rounded-full bg-sky-500 transition-[width]"
                  style={{ width: `${updateProgress}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-500">{updateProgress}%</div>
            </div>
          ) : null}
        </div>
      </SettingsGroup>
      <SettingsGroup title={t("languageSection")}>
        <SettingsRow
          title={t("language")}
          description={t("languageDesc")}
          control={
            <Select
              value={props.localeOverride ?? "system"}
              onValueChange={(value) =>
                void props.setLocaleOverride(value === "system" ? null : (value as LocaleOverride))
              }
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">{t("followSystem")}</SelectItem>
                <SelectItem value="zh-CN">简体中文</SelectItem>
                <SelectItem value="en-US">English</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      </SettingsGroup>
      <SettingsGroup title={t("appTheme")}>
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-zinc-900 dark:bg-zinc-950">
          <div className="flex flex-1 items-center gap-3">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-slate-600 dark:text-zinc-500" />
              <Moon className="h-5 w-5 text-slate-600 dark:text-zinc-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-zinc-100">
                {t("themeLight")} / {t("themeDark")}
              </div>
              <div className="text-xs text-slate-600 dark:text-zinc-500">{t("appThemeDesc")}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="compact"
              variant={props.appTheme === "light" ? "default" : "secondary"}
              onClick={() => void props.setAppTheme("light")}
            >
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                {t("themeLight")}
              </div>
            </Button>
            <Button
              type="button"
              size="compact"
              variant={props.appTheme === "dark" ? "default" : "secondary"}
              onClick={() => void props.setAppTheme("dark")}
            >
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                {t("themeDark")}
              </div>
            </Button>
          </div>
        </div>
      </SettingsGroup>
    </div>
  );
}
