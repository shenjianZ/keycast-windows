import { useEffect, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { createTranslator } from "./i18n";
import {
  initialOverlayConfig,
  readAppSettings,
  readAppVersion,
  readAutostart,
  readKeycastState,
  readOverlayConfig,
  saveAppSettings,
  saveOverlayConfig,
  syncSystemLocale,
  toggleAutostart,
  toggleKeycast,
} from "./lib/native";
import type {
  AppSettings,
  AppTheme,
  KeycastOverlayConfig,
  KeycastState,
  LocaleOverride,
} from "./lib/types";

export function useAppModel() {
  const [state, setState] = useState<KeycastState>({
    is_listening: false,
    is_overlay_visible: false,
  });
  const [config, setConfig] = useState<KeycastOverlayConfig>(initialOverlayConfig);
  const [lastText, setLastText] = useState("Ctrl + Shift + K");
  const [autostart, setAutostart] = useState(false);
  const [version, setVersion] = useState("0.1.0");
  const [locale, setLocale] = useState<"zh-CN" | "en-US">("en-US");
  const [settings, setSettings] = useState<AppSettings>({
    locale_override: null,
    listen_on_startup: false,
    theme: "light",
    global_shortcut: "Ctrl+Shift+K",
    global_shortcut_enabled: true,
  });
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const hasLoadedConfig = useRef(false);
  const hasShownToast = useRef(false);
  const localeRef = useRef(locale);
  const pendingConfigMessage = useRef("设置已更新");
  const t = createTranslator(locale);
  const notifyUpdated = (message: string) => {
    setToastMessage(message);
    setToastOpen(false);
    window.setTimeout(() => setToastOpen(true), 0);
  };

  useEffect(() => {
    void readKeycastState().then(setState);
    void readOverlayConfig().then((next) => {
      setConfig(next);
      hasLoadedConfig.current = true;
    });
    void readAutostart()
      .then(setAutostart)
      .catch(() => setAutostart(false));
    void readAppVersion()
      .then(setVersion)
      .catch(() => setVersion("0.1.0"));
    void readAppSettings()
      .then((next) => {
        setSettings(next);
        return syncSystemLocale(navigator.language);
      })
      .then((next) => setLocale(next === "zh-CN" ? "zh-CN" : "en-US"))
      .catch(() => setLocale("en-US"));
    const unlistenDisplay = listen<{ text: string }>(
      "keycast:display",
      (event) => event.payload?.text && setLastText(event.payload.text)
    );
    const unlistenState = listen<KeycastState>("keycast:state-updated", (event) => {
      if (event.payload) setState(event.payload);
    });
    const unlistenShortcut = listen<KeycastState>("keycast:shortcut-toggled", (event) => {
      if (!event.payload) return;
      setState(event.payload);
      const isZh = localeRef.current === "zh-CN";
      notifyUpdated(
        event.payload.is_listening
          ? createTranslator(isZh ? "zh-CN" : "en-US")("shortcutEnabled")
          : createTranslator(isZh ? "zh-CN" : "en-US")("shortcutDisabled")
      );
    });
    return () => {
      void unlistenDisplay.then((fn) => fn());
      void unlistenState.then((fn) => fn());
      void unlistenShortcut.then((fn) => fn());
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    localeRef.current = locale;
  }, [locale]);

  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.theme]);

  useEffect(() => {
    if (!hasLoadedConfig.current) return;
    const timer = window.setTimeout(() => {
      void saveOverlayConfig(config).then(() => {
        if (!hasShownToast.current) {
          hasShownToast.current = true;
          return;
        }
        notifyUpdated(pendingConfigMessage.current);
      });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [config]);

  useEffect(() => {
    if (!toastOpen) return;
    const timer = window.setTimeout(() => setToastOpen(false), 1600);
    return () => window.clearTimeout(timer);
  }, [toastOpen]);

  const persistLocaleOverride = async (localeOverride: LocaleOverride) => {
    const nextSettings = await saveAppSettings({ ...settings, locale_override: localeOverride });
    setSettings(nextSettings);
    const nextLocale = await syncSystemLocale(navigator.language);
    setLocale(nextLocale === "zh-CN" ? "zh-CN" : "en-US");
    notifyUpdated(createTranslator(nextLocale === "zh-CN" ? "zh-CN" : "en-US")("languageUpdated"));
  };

  const updateConfig = (updater: React.SetStateAction<KeycastOverlayConfig>, message: string) => {
    pendingConfigMessage.current = message;
    setConfig(updater);
  };

  const setNumber = (key: "x" | "y" | "combo_window_ms", value: string) => {
    setConfig((current) => ({ ...current, [key]: Number(value) || 0 }));
  };

  const setAppTheme = async (theme: AppTheme) => {
    const nextSettings = await saveAppSettings({ ...settings, theme });
    setSettings(nextSettings);
    notifyUpdated(t("themeUpdated"));
  };

  const setGlobalShortcut = async (globalShortcut: string) => {
    try {
      const nextSettings = await saveAppSettings({
        ...settings,
        global_shortcut: globalShortcut,
      });
      setSettings(nextSettings);
      notifyUpdated(t("shortcutUpdated"));
    } catch (error) {
      setSettings(await readAppSettings());
      const fallback = t("shortcutUpdateFailed");
      const message = error instanceof Error ? error.message : fallback;
      notifyUpdated(message || fallback);
    }
  };

  const setGlobalShortcutEnabled = async (globalShortcutEnabled: boolean) => {
    try {
      const nextSettings = await saveAppSettings({
        ...settings,
        global_shortcut_enabled: globalShortcutEnabled,
      });
      setSettings(nextSettings);
      notifyUpdated(t("shortcutUpdated"));
    } catch (error) {
      setSettings(await readAppSettings());
      const fallback = t("shortcutUpdateFailed");
      const message = error instanceof Error ? error.message : fallback;
      notifyUpdated(message || fallback);
    }
  };

  return {
    state,
    config,
    updateConfig,
    lastText,
    autostart,
    version,
    locale,
    settings,
    toastOpen,
    toastMessage,
    setNumber,
    setLocaleOverride: persistLocaleOverride,
    setAppTheme,
    setGlobalShortcut,
    setGlobalShortcutEnabled,
    refreshState: () => readKeycastState().then(setState),
    toggleListening: async () => {
      const nextState = await toggleKeycast(state.is_listening);
      setState(nextState);
      setSettings(
        await saveAppSettings({ ...settings, listen_on_startup: nextState.is_listening })
      );
      notifyUpdated(t("listeningUpdated"));
    },
    toggleAutostart: async () => {
      await toggleAutostart(autostart);
      setAutostart(!autostart);
      notifyUpdated(t("startupUpdated"));
    },
  };
}
