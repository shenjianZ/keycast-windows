import { cn } from "../../lib/utils";

type Props = {
  open: boolean;
  message: string;
};

export function Toast({ open, message }: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition-all dark:border-zinc-800 dark:bg-black/90 dark:text-zinc-200",
        open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      )}
    >
      {message}
    </div>
  );
}
