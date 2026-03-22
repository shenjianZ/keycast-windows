import { useEffect, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { initialOverlayConfig, readAppSettings, readAppVersion, readAutostart, readKeycastState, readOverlayConfig, saveAppSettings, saveOverlayConfig, syncSystemLocale, toggleAutostart, toggleKeycast } from "./lib/native";
import type { AppSettings, KeycastOverlayConfig, KeycastState, LocaleOverride } from "./lib/types";

export function useAppModel() {
  const [state, setState] = useState<KeycastState>({ is_listening: false, is_overlay_visible: false });
  const [config, setConfig] = useState<KeycastOverlayConfig>(initialOverlayConfig);
  const [lastText, setLastText] = useState("Ctrl + Shift + K");
  const [autostart, setAutostart] = useState(false);
  const [version, setVersion] = useState("0.1.0");
  const [locale, setLocale] = useState<"zh-CN" | "en-US">("en-US");
  const [settings, setSettings] = useState<AppSettings>({ locale_override: null, listen_on_startup: false });
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const hasLoadedConfig = useRef(false);
  const hasShownToast = useRef(false);
  const pendingConfigMessage = useRef("设置已更新");
  const notifyUpdated = (message: string) => {
    setToastMessage(message);
    setToastOpen(false);
    window.setTimeout(() => setToastOpen(true), 0);
  };

  useEffect(() => {
    void readKeycastState().then(setState);
    void readOverlayConfig().then((next) => { setConfig(next); hasLoadedConfig.current = true; });
    void readAutostart().then(setAutostart).catch(() => setAutostart(false));
    void readAppVersion().then(setVersion).catch(() => setVersion("0.1.0"));
    void readAppSettings().then((next) => {
      setSettings(next);
      return syncSystemLocale(navigator.language);
    }).then((next) => setLocale(next === "zh-CN" ? "zh-CN" : "en-US")).catch(() => setLocale("en-US"));
    const unlisten = listen<{ text: string }>("keycast:display", (event) => event.payload?.text && setLastText(event.payload.text));
    return () => { void unlisten.then((fn) => fn()); };
  }, []);

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

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
    const nextSettings = await saveAppSettings(localeOverride, settings.listen_on_startup);
    setSettings(nextSettings);
    const nextLocale = await syncSystemLocale(navigator.language);
    setLocale(nextLocale === "zh-CN" ? "zh-CN" : "en-US");
    notifyUpdated(nextLocale === "zh-CN" ? "语言已更新" : "Language updated");
  };

  const updateConfig = (updater: React.SetStateAction<KeycastOverlayConfig>, message: string) => {
    pendingConfigMessage.current = message;
    setConfig(updater);
  };

  const setNumber = (key: "x" | "y" | "combo_window_ms", value: string) => {
    setConfig((current) => ({ ...current, [key]: Number(value) || 0 }));
  };

  return {
    state, config, updateConfig, lastText, autostart, version, locale, settings, toastOpen, toastMessage,
    setNumber, setLocaleOverride: persistLocaleOverride,
    refreshState: () => readKeycastState().then(setState),
    toggleListening: async () => {
      const nextState = await toggleKeycast(state.is_listening);
      setState(nextState);
      setSettings(await saveAppSettings(settings.locale_override, nextState.is_listening));
      notifyUpdated(locale === "zh-CN" ? "按键监听已更新" : "Keyboard overlay updated");
    },
    toggleAutostart: async () => { await toggleAutostart(autostart); setAutostart(!autostart); notifyUpdated(locale === "zh-CN" ? "开机自启已更新" : "Startup updated"); },
  };
}
