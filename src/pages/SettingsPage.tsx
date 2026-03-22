import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { useI18n } from "../i18n";
import type {
    KeycastOverlayConfig,
    KeycastState,
    LocaleOverride,
} from "../lib/types";

const themes = [
    "keycaps-dark",
    "keycaps-light",
    "text-only",
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
type Props = {
    state: KeycastState;
    config: KeycastOverlayConfig;
    lastText: string;
    autostart: boolean;
    localeOverride: LocaleOverride;
    setConfig: React.Dispatch<React.SetStateAction<KeycastOverlayConfig>>;
    setNumber: (key: "x" | "y" | "combo_window_ms", value: string) => void;
    toggleListening: () => Promise<void>;
    saveConfig: () => Promise<void>;
    toggleAutostart: () => Promise<void>;
    setLocaleOverride: (next: LocaleOverride) => Promise<void>;
};

export function SettingsPage(props: Props) {
    const { t } = useI18n();
    const onTheme = (value: string) =>
        props.setConfig((current) => ({
            ...current,
            theme: value as KeycastOverlayConfig["theme"],
        }));
    const onText = (key: "text_color" | "accent_color", value: string) =>
        props.setConfig((current) => ({ ...current, [key]: value }));
    const onBool = (checked: boolean) =>
        props.setConfig((current) => ({ ...current, accent_visible: checked }));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Badge
                    variant={props.state.is_listening ? "success" : "default"}
                >
                    {props.state.is_listening
                        ? t("statusActive")
                        : t("statusIdle")}
                </Badge>
                <Button
                    size="compact"
                    className="rounded-xl"
                    onClick={() => void props.toggleListening()}
                >
                    {props.state.is_listening ? t("stop") : t("start")}
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{t("displaySection")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className="min-w-0 overflow-hidden text-ellipsis rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4 text-[24px] font-extrabold tracking-[-0.03em]"
                        style={{ color: props.config.text_color }}
                    >
                        {props.lastText}
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <Label>{t("theme")}</Label>
                            <Select
                                value={props.config.theme}
                                onValueChange={onTheme}
                            >
                                <SelectTrigger>
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
                        </div>
                        <div>
                            <Label>{t("textColor")}</Label>
                            <Input
                                type="color"
                                className="px-1.5 py-1"
                                value={props.config.text_color}
                                onChange={(e) =>
                                    onText("text_color", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label>{t("colorHex")}</Label>
                            <Input
                                value={props.config.text_color}
                                onChange={(e) =>
                                    onText("text_color", e.target.value)
                                }
                            />
                        </div>
                        <label className="flex min-h-9 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={props.config.accent_visible}
                                onChange={(e) => onBool(e.target.checked)}
                            />
                            {t("accentVisible")}
                        </label>
                        <div>
                            <Label>{t("accentColor")}</Label>
                            <Input
                                type="color"
                                className="px-1.5 py-1"
                                value={props.config.accent_color}
                                onChange={(e) =>
                                    onText("accent_color", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label>{t("accentHex")}</Label>
                            <Input
                                value={props.config.accent_color}
                                onChange={(e) =>
                                    onText("accent_color", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label>{t("positionX")}</Label>
                            <Input
                                type="number"
                                value={props.config.x}
                                onChange={(e) =>
                                    props.setNumber("x", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label>{t("positionY")}</Label>
                            <Input
                                type="number"
                                value={props.config.y}
                                onChange={(e) =>
                                    props.setNumber("y", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label>{t("comboWindow")}</Label>
                            <Input
                                type="number"
                                value={props.config.combo_window_ms}
                                onChange={(e) =>
                                    props.setNumber(
                                        "combo_window_ms",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-end">
                        <Button
                            variant="secondary"
                            size="compact"
                            className="rounded-xl"
                            onClick={() => void props.saveConfig()}
                        >
                            {t("save")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("systemSection")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                            <span className="text-sm text-slate-600">
                                {t("autostart")}
                            </span>
                            <Button
                                variant="secondary"
                                size="compact"
                                className="rounded-xl"
                                onClick={() => void props.toggleAutostart()}
                            >
                                {props.autostart
                                    ? t("autostartOn")
                                    : t("autostartOff")}
                            </Button>
                        </div>
                        <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            {t("autostartHelp")}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("language")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Select
                            value={props.localeOverride ?? "system"}
                            onValueChange={(value) =>
                                void props.setLocaleOverride(
                                    value === "system"
                                        ? null
                                        : (value as LocaleOverride),
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="system">
                                    {t("followSystem")}
                                </SelectItem>
                                <SelectItem value="zh-CN">简体中文</SelectItem>
                                <SelectItem value="en-US">English</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
