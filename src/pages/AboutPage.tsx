import { Book, Bug, Github, Globe, MessageSquare, User } from "lucide-react";
import { useI18n } from "../i18n";
import type { UpdateState } from "../lib/types";

type Props = { version: string; updateState: UpdateState };
const repoUrl = "https://github.com/shenjianZ/keycast-windows";
const docsUrl = "https://keycast-windows.shenjianzlt.workers.dev/";

const links = [
  { key: "home", labelZh: "主页", labelEn: "Homepage", icon: Globe, href: repoUrl },
  { key: "docs", labelZh: "文档", labelEn: "Documentation", icon: Book, href: docsUrl },
  { key: "github", labelZh: "GitHub", labelEn: "GitHub", icon: Github, href: repoUrl },
  {
    key: "issue",
    labelZh: "报告问题",
    labelEn: "Report Issue",
    icon: Bug,
    href: `${repoUrl}/issues`,
  },
  { key: "discord", labelZh: "Discord", labelEn: "Discord", icon: MessageSquare, href: repoUrl },
] as const;

export function AboutPage({ version, updateState }: Props) {
  const { locale, t } = useI18n();
  const updateLine =
    updateState.status === "downloaded"
      ? `${t("updateDownloaded")} · v${updateState.latestVersion}`
      : updateState.status === "downloading"
        ? t("updateDownloading")
        : updateState.status === "available"
          ? `${t("updateAvailable")} · v${updateState.latestVersion}`
          : updateState.status === "up-to-date"
            ? t("updateLatest")
            : updateState.error ?? t("updateDesc");

  return (
    <div className="max-w-3xl px-8 py-8">
      <h1 className="mb-8 text-[28px] font-semibold tracking-[-0.03em] text-slate-900 dark:text-slate-100">
        {t("navAbout")}
      </h1>
      <div className="flex items-start gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 ring-1 ring-slate-200 dark:bg-sky-950 dark:ring-slate-700">
          <div className="h-12 w-12 rounded-full bg-[radial-gradient(circle_at_30%_30%,#38bdf8,#2563eb_58%,#0f172a)]" />
        </div>
        <div className="space-y-2">
          <div className="text-[18px] font-semibold text-slate-900 dark:text-slate-100">
            Keycast Windows
          </div>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
            <User className="h-3.5 w-3.5" />
            <span>by shenjianZ</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[14px] leading-none text-slate-500 dark:text-slate-400">
              v{version}
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-[12px] text-slate-600 dark:bg-slate-700 dark:text-slate-400">
              {locale === "zh-CN" ? "预览版" : "Preview"}
            </span>
          </div>
          <p className="max-w-lg text-[13px] leading-6 text-slate-500 dark:text-slate-400">
            {t("aboutIntro")}
          </p>
          <p className="max-w-lg text-[13px] leading-6 text-sky-700 dark:text-sky-300">
            {updateLine}
          </p>
        </div>
      </div>
      <div className="mt-10 space-y-4">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 text-[16px] text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            >
              <Icon className="h-5 w-5 text-slate-900 dark:text-slate-100" />
              <span>{locale === "zh-CN" ? item.labelZh : item.labelEn}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
