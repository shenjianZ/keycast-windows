import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { useI18n } from "../i18n";
import type { KeycastOverlayConfig, KeycastState, LocaleOverride } from "../lib/types";
import { SettingsGroup, SettingsRow } from "../components/settings-group";

const themes = ["text-only", "keycaps-dark", "keycaps-light", "broadcast-orange", "broadcast-green", "minimal-light", "glass-soft", "fresh-mint", "sky-card", "terminal", "neon-cyan", "paper-card"] as const;
const colorPresets = ["#ffffff", "#fb923c", "#facc15", "#4ade80", "#38bdf8", "#a78bfa", "#f472b6", "#111827"] as const;
type Props = { state: KeycastState; config: KeycastOverlayConfig; autostart: boolean; localeOverride: LocaleOverride; updateConfig: (updater: React.SetStateAction<KeycastOverlayConfig>, message: string) => void; setNumber: (key: "x" | "y" | "combo_window_ms", value: string) => void; toggleListening: () => Promise<void>; toggleAutostart: () => Promise<void>; setLocaleOverride: (next: LocaleOverride) => Promise<void>; };

export function SettingsPageV2(props: Props) {
  const { locale, t } = useI18n();
  const toastText = (label: string) => locale === "zh-CN" ? `${label}已更新` : `${label} updated`;
  const setText = (key: "text_color" | "accent_color", value: string, label: string) => props.updateConfig((current) => ({ ...current, [key]: value }), toastText(label));
  const setTheme = (value: string) => props.updateConfig((current) => ({ ...current, theme: value as KeycastOverlayConfig["theme"] }), toastText(t("theme")));
  const colorControl = (key: "text_color" | "accent_color", value: string, label: string) => <div className="flex w-[280px] flex-col gap-2"><div className="flex flex-wrap gap-2">{colorPresets.map((item) => <button key={item} type="button" aria-label={item} onClick={() => setText(key, item, label)} className={`h-6 w-6 rounded-full border-2 ${value.toLowerCase() === item ? "border-slate-900" : "border-white ring-1 ring-slate-200"}`} style={{ backgroundColor: item }} />)}</div><div className="flex items-center gap-2"><Input type="color" className="w-14 px-1.5 py-1" value={value} onChange={(e) => setText(key, e.target.value, label)} /><Input value={value} onChange={(e) => setText(key, e.target.value, label)} /></div></div>;

  return (
    <div className="space-y-6">
      <SettingsGroup title={t("displaySection")}>
        <SettingsRow title={t("activeOverlay")} description={t("activeOverlayDesc")} enabled={props.state.is_listening} onEnabledChange={() => void props.toggleListening()} />
      </SettingsGroup>
      <SettingsGroup title={t("themeSection")}>
        <SettingsRow title={t("theme")} description={t("themeDesc")} control={<Select value={props.config.theme} onValueChange={setTheme}><SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger><SelectContent>{themes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>} />
        <SettingsRow title={t("textColor")} description={t("textColorDesc")} control={colorControl("text_color", props.config.text_color, t("textColor"))} />
        <SettingsRow title={t("accentVisible")} description={t("accentVisibleDesc")} enabled={props.config.accent_visible} onEnabledChange={(checked) => props.updateConfig((current) => ({ ...current, accent_visible: checked }), toastText(t("accentVisible")))} />
        <SettingsRow title={t("accentColor")} description={t("accentColorDesc")} control={colorControl("accent_color", props.config.accent_color, t("accentColor"))} />
      </SettingsGroup>
      <SettingsGroup title={t("positionSection")}>
        <SettingsRow title={t("positionX")} description={t("positionXDesc")} control={<Input className="w-[220px]" type="number" value={props.config.x} onChange={(e) => props.setNumber("x", e.target.value)} />} />
        <SettingsRow title={t("positionY")} description={t("positionYDesc")} control={<Input className="w-[220px]" type="number" value={props.config.y} onChange={(e) => props.setNumber("y", e.target.value)} />} />
        <SettingsRow title={t("comboWindow")} description={t("comboWindowDesc")} control={<Input className="w-[220px]" type="number" value={props.config.combo_window_ms} onChange={(e) => props.setNumber("combo_window_ms", e.target.value)} />} />
      </SettingsGroup>
      <SettingsGroup title={t("startupSection")}>
        <SettingsRow title={t("autostart")} description={t("autostartDesc")} enabled={props.autostart} onEnabledChange={() => void props.toggleAutostart()} />
      </SettingsGroup>
      <SettingsGroup title={t("languageSection")}>
        <SettingsRow title={t("language")} description={t("languageDesc")} control={<Select value={props.localeOverride ?? "system"} onValueChange={(value) => void props.setLocaleOverride(value === "system" ? null : value as LocaleOverride)}><SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="system">{t("followSystem")}</SelectItem><SelectItem value="zh-CN">简体中文</SelectItem><SelectItem value="en-US">English</SelectItem></SelectContent></Select>} />
      </SettingsGroup>
    </div>
  );
}
