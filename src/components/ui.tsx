import { useEffect, useState, type ReactNode } from "react";
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

/** Editorial chapter header: small numeral, kicker, display title. */
export function ChapterHead({
  numeral,
  kicker,
  title,
  className,
}: {
  numeral?: string;
  kicker: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          {kicker}
        </p>
        {numeral && (
          <span className="font-display text-sm tracking-[0.3em] text-primary" aria-hidden>
            {numeral}
          </span>
        )}
      </div>
      <h2 className="mt-3 font-display text-[32px] leading-[1.08] text-foreground sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

/** Thin gold rule with optional centered mark. */
export function ChartRule({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden>
      <div className="h-px flex-1 bg-border" />
      <div className="h-1.5 w-1.5 rotate-45 bg-primary/70" />
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

/** Numbered editorial option row for text answers. */
export function OptionRow({
  index,
  children,
  state = "idle",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  index: number;
  state?: "idle" | "wrong" | "right" | "dim";
}) {
  return (
    <button
      {...rest}
      className={cn(
        "group flex min-h-16 w-full items-center gap-4 border px-4 py-3 text-left transition active:scale-[0.99]",
        state === "idle" && "border-border bg-card hover:border-primary",
        state === "wrong" && "border-destructive/60 opacity-45",
        state === "right" && "border-primary",
        state === "dim" && "border-border opacity-50",
      )}
    >
      <span
        className={cn(
          "font-mono text-xs tabular-nums",
          state === "idle" ? "text-primary" : "text-muted-foreground",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="flex-1 text-[15px] font-medium leading-6">{children}</span>
    </button>
  );
}

/** Parchment verse card for riddles. */
export function VerseCard({
  index,
  total,
  children,
  fresh = false,
}: {
  index: number;
  total: number;
  children: ReactNode;
  fresh?: boolean;
}) {
  return (
    <div className={cn("bg-parchment p-5 text-ink shadow-2xl", fresh && "ink-reveal")}>
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-60">
        Verse {index} of {total}
      </p>
      <p className="mt-2 font-display text-[19px] leading-8">{children}</p>
    </div>
  );
}

/** Two-tap confirm button for irreversible acts (spending hints, claiming stops). */
export function ConfirmButton({
  children,
  confirmLabel,
  onConfirm,
  disabled,
  variant = "ghost",
  className,
}: {
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  disabled?: boolean;
  variant?: "ghost" | "primary";
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    setArmed(false);
  }, [children, disabled]);
  const Btn = variant === "primary" ? PrimaryButton : GhostButton;
  return (
    <Btn
      disabled={disabled}
      className={className}
      onClick={() => {
        if (disabled) return;
        if (!armed) {
          setArmed(true);
          return;
        }
        setArmed(false);
        onConfirm();
      }}
    >
      {armed ? confirmLabel : children}
    </Btn>
  );
}
