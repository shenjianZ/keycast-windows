import * as React from "react";
import { cn } from "../lib/utils";

export function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="px-1 text-sm font-semibold text-slate-500 dark:text-zinc-500">{title}</div>
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:border-zinc-900 dark:bg-black/70">
        {children}
      </div>
    </section>
  );
}

export function SettingsRow({
  title,
  description,
  control,
  enabled,
  onEnabledChange,
  className,
}: {
  title: string;
  description: string;
  control?: React.ReactNode;
  enabled?: boolean;
  onEnabledChange?: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border-t border-slate-200/80 px-4 py-4 first:border-t-0 dark:border-zinc-900",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="text-base font-semibold text-slate-900 dark:text-zinc-100">{title}</div>
        <div className="mt-1 text-sm text-slate-500 dark:text-zinc-500">{description}</div>
      </div>
      <div className="flex items-center gap-3">
        {control}
        {onEnabledChange ? (
          <button
            type="button"
            aria-pressed={enabled}
            onClick={() => onEnabledChange(!enabled)}
            className={cn(
              "relative h-6 w-10 rounded-full transition-colors",
              enabled ? "bg-emerald-500 dark:bg-emerald-500" : "bg-slate-300 dark:bg-zinc-800"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform dark:bg-zinc-100",
                enabled ? "left-4.5" : "left-0.5"
              )}
            />
          </button>
        ) : null}
      </div>
    </div>
  );
}
