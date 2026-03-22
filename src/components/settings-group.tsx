import * as React from "react";
import { cn } from "../lib/utils";

export function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="px-1 text-sm font-semibold text-slate-500">{title}</div>
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
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
    <div className={cn("flex items-center gap-4 border-t border-slate-200/80 px-4 py-4 first:border-t-0", className)}>
      <div className="min-w-0 flex-1">
        <div className="text-base font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-sm text-slate-500">{description}</div>
      </div>
      <div className="flex items-center gap-3">
        {control}
        {onEnabledChange ? (
          <button
            type="button"
            aria-pressed={enabled}
            onClick={() => onEnabledChange(!enabled)}
            className={cn("relative h-7 w-12 rounded-full transition-colors", enabled ? "bg-sky-500" : "bg-slate-200")}
          >
            <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white transition-transform", enabled ? "left-6" : "left-1")} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
