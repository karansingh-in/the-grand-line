import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Title({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        "font-display text-[34px] leading-[1.05] tracking-wide text-foreground sm:text-5xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[15px] leading-7 text-muted-foreground", className)}>{children}</p>;
}

export function PrimaryButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        "w-full min-h-14 px-6 font-display text-[13px] uppercase tracking-[0.18em]",
        "bg-primary text-primary-foreground",
        "hover:brightness-110 active:scale-[0.98] transition",
        "disabled:opacity-40 disabled:pointer-events-none",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        "w-full min-h-12 px-6 font-display text-[11px] uppercase tracking-[0.2em]",
        "border border-border text-muted-foreground",
        "hover:text-foreground hover:border-primary transition",
        "disabled:opacity-30 disabled:pointer-events-none",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("border border-border bg-card", className)}>{children}</div>;
}

export function Hairline({ className }: { className?: string }) {
  return <div className={cn("h-px w-16 bg-primary/60", className)} />;
}

export function Progress({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div
      className="h-[3px] w-full bg-muted overflow-hidden"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
    >
      <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function HintPips({ left, total = 2 }: { left: number; total?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`${left} hints left`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-2 rounded-full border",
            i < left ? "bg-primary border-primary" : "border-border",
          )}
        />
      ))}
    </span>
  );
}

export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-10 first:mt-0", className)}>{children}</div>;
}
