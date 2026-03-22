import { Bug, Github, Globe, MessageSquare } from "lucide-react";
import { useI18n } from "../i18n";

type Props = { version: string };

const links = [
  { key: "home", labelZh: "主页", labelEn: "Homepage", icon: Globe, href: "#" },
  { key: "github", labelZh: "GitHub", labelEn: "GitHub", icon: Github, href: "#" },
  { key: "issue", labelZh: "报告问题", labelEn: "Report Issue", icon: Bug, href: "#" },
  { key: "discord", labelZh: "Discord", labelEn: "Discord", icon: MessageSquare, href: "#" },
] as const;

export function AboutPage({ version }: Props) {
  const { locale, t } = useI18n();

  return (
    <div className="max-w-3xl px-6 py-8">
      <h1 className="mb-8 text-[44px] font-black tracking-[-0.05em] text-slate-900">{t("navAbout")}</h1>
      <div className="flex items-start gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 ring-1 ring-slate-200">
          <div className="h-12 w-12 rounded-full bg-[radial-gradient(circle_at_30%_30%,#38bdf8,#2563eb_58%,#0f172a)]" />
        </div>
        <div className="space-y-2">
          <div className="text-[22px] font-bold text-slate-900">Keycast Windows</div>
          <div className="flex items-center gap-3">
            <span className="text-[30px] leading-none text-slate-500">v{version}</span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-slate-600">{locale === "zh-CN" ? "预览版" : "Preview"}</span>
          </div>
          <p className="max-w-lg text-sm text-slate-500">{t("aboutIntro")}</p>
        </div>
      </div>
      <div className="mt-10 space-y-4">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <a key={item.key} href={item.href} className="flex items-center gap-4 text-[18px] text-slate-700 transition-colors hover:text-slate-900">
              <Icon className="h-6 w-6 text-slate-500" />
              <span>{locale === "zh-CN" ? item.labelZh : item.labelEn}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
