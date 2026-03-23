import { useEffect, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { createTranslator } from "./i18n";
import { checkForAppUpdate, downloadAppUpdate, installAppUpdate } from "./lib/updater";
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
  UpdateState,
  UpdateSummary,
} from "./lib/types";

export function useAppModel() {
  const [updateState, setUpdateState] = useState<UpdateState>({
    status: "idle",
    currentVersion: "0.1.4",
    latestVersion: null,
    downloadedVersion: null,
    contentLength: null,
    downloadedBytes: 0,
    error: null,
    availableUpdate: null,
  });
  const [state, setState] = useState<KeycastState>({
    is_listening: false,
    is_overlay_visible: false,
  });
  const [config, setConfig] = useState<KeycastOverlayConfig>(initialOverlayConfig);
  const [lastText, setLastText] = useState("Ctrl + Shift + K");
  const [autostart, setAutostart] = useState(false);
  const [version, setVersion] = useState("0.1.4");
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
  const persistedConfig = useRef<string | null>(null);
  const localeRef = useRef(locale);
  const pendingConfigMessage = useRef("设置已更新");
  const pendingUpdateRef = useRef<Awaited<ReturnType<typeof checkForAppUpdate>> | null>(null);
  const t = createTranslator(locale);
  const notifyUpdated = (message: string) => {
    setToastMessage(message);
    setToastOpen(false);
    window.setTimeout(() => setToastOpen(true), 0);
  };
  const setUpdateSummary = (
    status: UpdateState["status"],
    summary: UpdateSummary | null,
    extra?: Partial<UpdateState>
  ) => {
    setUpdateState((current) => ({
      ...current,
      status,
      currentVersion: summary?.currentVersion ?? current.currentVersion,
      latestVersion: summary?.version ?? current.latestVersion,
      availableUpdate: summary,
      error: null,
      ...extra,
    }));
  };
  const resetDownloadedUpdate = () => {
    setUpdateState((current) => ({
      ...current,
      downloadedVersion: null,
      downloadedBytes: 0,
      contentLength: null,
    }));
  };
  const runUpdateCheck = async () => {
    setUpdateState((current) => ({ ...current, status: "checking", error: null }));
    const result = await checkForAppUpdate();
    pendingUpdateRef.current = result;
    if (!result) {
      resetDownloadedUpdate();
      setUpdateState((current) => ({
        ...current,
        status: "up-to-date",
        latestVersion: current.currentVersion,
        availableUpdate: null,
        error: null,
      }));
      return null;
    }
    resetDownloadedUpdate();
    setUpdateSummary("available", result.summary);
    return result;
  };
  const runUpdateDownload = async (result = pendingUpdateRef.current) => {
    if (!result) {
      const next = await runUpdateCheck();
      if (!next) return null;
      result = next;
    }
    setUpdateSummary("downloading", result.summary, {
      downloadedVersion: null,
      downloadedBytes: 0,
      contentLength: null,
    });
    await downloadAppUpdate(result.update, (event) => {
      if (event.event === "Started") {
        setUpdateState((current) => ({
          ...current,
          contentLength: event.data.contentLength ?? null,
          downloadedBytes: 0,
        }));
      }
      if (event.event === "Progress") {
        setUpdateState((current) => ({
          ...current,
          downloadedBytes: current.downloadedBytes + event.data.chunkLength,
        }));
      }
    });
    setUpdateSummary("downloaded", result.summary, {
      downloadedVersion: result.summary.version,
    });
    notifyUpdated(t("updateDownloaded"));
    return result;
  };
  const runUpdateInstall = async () => {
    const result = pendingUpdateRef.current;
    if (!result || updateState.status !== "downloaded") return;
    await installAppUpdate(result.update);
  };

  useEffect(() => {
    void readKeycastState().then(setState);
    void readOverlayConfig().then((next) => {
      setConfig(next);
      persistedConfig.current = JSON.stringify(next);
      hasLoadedConfig.current = true;
    });
    void readAutostart()
      .then(setAutostart)
      .catch(() => setAutostart(false));
    void readAppVersion()
      .then((next) => {
        setVersion(next);
        setUpdateState((current) => ({ ...current, currentVersion: next }));
      })
      .catch(() => {
        setVersion("0.1.4");
        setUpdateState((current) => ({ ...current, currentVersion: "0.1.4" }));
      });
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
    void runUpdateCheck()
      .then((result) => (result ? runUpdateDownload(result) : null))
      .catch((error) => {
        const fallback = t("updateCheckFailed");
        const message = error instanceof Error ? error.message : fallback;
        setUpdateState((current) => ({
          ...current,
          status: "error",
          error: message || fallback,
        }));
      });
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
    const snapshot = JSON.stringify(config);
    if (snapshot === persistedConfig.current) return;
    const timer = window.setTimeout(() => {
      void saveOverlayConfig(config)
        .then((saved) => {
          const savedSnapshot = JSON.stringify(saved);
          persistedConfig.current = savedSnapshot;
          if (savedSnapshot !== snapshot) {
            setConfig(saved);
          }
          if (!hasShownToast.current) {
            hasShownToast.current = true;
            return;
          }
          notifyUpdated(pendingConfigMessage.current);
        })
        .catch(async (error) => {
          const restored = await readOverlayConfig().catch(() => null);
          if (restored) {
            persistedConfig.current = JSON.stringify(restored);
            setConfig(restored);
          }
          const fallback = "保存按键屏显配置失败";
          const message = error instanceof Error ? error.message : fallback;
          notifyUpdated(message || fallback);
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

  const setNumber = (key: "x" | "y" | "combo_window_ms" | "max_consecutive_keys" | "consecutive_window_ms" | "queue_idle_timeout_ms", value: string) => {
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
  const checkForUpdates = async () => {
    try {
      const result = await runUpdateCheck();
      if (!result) notifyUpdated(t("updateLatest"));
      return result;
    } catch (error) {
      const fallback = t("updateCheckFailed");
      const message = error instanceof Error ? error.message : fallback;
      setUpdateState((current) => ({ ...current, status: "error", error: message || fallback }));
      notifyUpdated(message || fallback);
      return null;
    }
  };
  const downloadLatestUpdate = async () => {
    try {
      const result = await runUpdateDownload();
      if (!result) notifyUpdated(t("updateLatest"));
    } catch (error) {
      const fallback = t("updateDownloadFailed");
      const message = error instanceof Error ? error.message : fallback;
      setUpdateState((current) => ({ ...current, status: "error", error: message || fallback }));
      notifyUpdated(message || fallback);
    }
  };
  const installLatestUpdate = async () => {
    try {
      await runUpdateInstall();
    } catch (error) {
      const fallback = t("updateInstallFailed");
      const message = error instanceof Error ? error.message : fallback;
      setUpdateState((current) => ({ ...current, status: "error", error: message || fallback }));
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
    updateState,
    locale,
    settings,
    toastOpen,
    toastMessage,
    setNumber,
    setLocaleOverride: persistLocaleOverride,
    setAppTheme,
    checkForUpdates,
    downloadLatestUpdate,
    installLatestUpdate,
    setGlobalShortcut,
    setGlobalShortcutEnabled,
    refreshState: () => readKeycastState().then(setState),
    toggleListening: async () => {
      const nextState = await toggleKeycast(state.is_listening);
      setState(nextState);
      notifyUpdated(t("listeningUpdated"));
    },
    toggleAutostart: async () => {
      await toggleAutostart(autostart);
      setAutostart(!autostart);
      notifyUpdated(t("startupUpdated"));
    },
  };
}
