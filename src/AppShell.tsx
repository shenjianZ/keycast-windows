import { HashRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { Toast } from "./components/ui/toast";
import { AboutPage } from "./pages/AboutPage";
import { SettingsPage } from "./pages/SettingsPage";
import { I18nContext, createTranslator, resolveLabel } from "./i18n";
import { useAppModel } from "./use-app-model";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center rounded-2xl px-4 py-3 text-[15px] font-medium ${isActive ? "bg-stone-100 text-slate-900 dark:bg-zinc-900 dark:text-zinc-50" : "text-slate-700 hover:bg-stone-50 dark:text-zinc-400 dark:hover:bg-zinc-900"}`;

export default function AppShell() {
  const app = useAppModel();
  const locale = resolveLabel(app.settings.locale_override, app.locale);
  const t = createTranslator(locale);

  return (
    <I18nContext.Provider
      value={{
        locale,
        localeOverride: app.settings.locale_override,
        setLocaleOverride: app.setLocaleOverride,
        t,
      }}
    >
      <HashRouter>
        <div className="grid min-h-screen min-w-0 grid-cols-[150px_1fr] overflow-x-hidden">
          <aside className="border-r border-slate-200/80 bg-[#fafafa] px-2 py-5 dark:border-zinc-900 dark:bg-[#050505]">
            <div className="px-4 pb-5 text-[17px] font-semibold text-slate-900 dark:text-zinc-100">
              {t("appName")}
            </div>
            <nav className="grid gap-1 px-1">
              <NavLink to="/settings" className={navClass}>
                {t("navSettings")}
              </NavLink>
              <NavLink to="/about" className={navClass}>
                {t("navAbout")}
              </NavLink>
            </nav>
            <div className="px-4 pt-6 text-xs text-slate-400 dark:text-zinc-600">{locale}</div>
          </aside>
          <main className="min-w-0 overflow-x-hidden px-4 py-5">
            <Routes>
              <Route path="/" element={<Navigate to="/settings" replace />} />
              <Route
                path="/settings"
                element={
                  <SettingsPage
                    state={app.state}
                    config={app.config}
                    autostart={app.autostart}
                    localeOverride={app.settings.locale_override}
                    appTheme={app.settings.theme}
                    globalShortcut={app.settings.global_shortcut}
                    globalShortcutEnabled={app.settings.global_shortcut_enabled}
                    updateConfig={app.updateConfig}
                    setNumber={app.setNumber}
                    toggleListening={app.toggleListening}
                    toggleAutostart={app.toggleAutostart}
                    setLocaleOverride={app.setLocaleOverride}
                    setAppTheme={app.setAppTheme}
                    setGlobalShortcut={app.setGlobalShortcut}
                    setGlobalShortcutEnabled={app.setGlobalShortcutEnabled}
                  />
                }
              />
              <Route path="/about" element={<AboutPage version={app.version} />} />
            </Routes>
          </main>
        </div>
        <Toast open={app.toastOpen} message={app.toastMessage || t("configSaved")} />
      </HashRouter>
    </I18nContext.Provider>
  );
}
