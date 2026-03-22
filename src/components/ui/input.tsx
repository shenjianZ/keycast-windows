import * as React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-9 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus-visible:border-zinc-700",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
