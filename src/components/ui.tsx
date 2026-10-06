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
        "font-display text-[38px] leading-[1.02] tracking-wide text-foreground sm:text-6xl",
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
        "w-full min-h-14 px-6 font-display text-sm uppercase tracking-[0.18em] rounded-none border-2 border-primary",
        "bg-primary text-primary-foreground hard-shadow-sm",
        "hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all",
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
        "w-full min-h-12 px-6 font-display text-[11px] uppercase tracking-[0.2em] rounded-none border-2",
        "border-border bg-card/60 text-foreground hard-shadow-sm",
        "hover:border-primary hover:text-primary active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all",
        "disabled:opacity-30 disabled:pointer-events-none",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("border-2 border-border bg-card hard-shadow", className)}>{children}</div>
  );
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
          <span
            className="tilt-r inline-block border-2 border-primary bg-ink px-2 py-0.5 font-display text-sm tracking-[0.2em] text-primary"
            aria-hidden
          >
            {numeral}
          </span>
        )}
      </div>
      <h2 className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
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
        "group flex min-h-[68px] w-full items-center gap-4 rounded-none border-2 px-4 py-3 text-left transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        state === "idle" &&
          "border-border bg-card hard-shadow-sm hover:border-primary hover:bg-primary/10",
        state === "wrong" && "border-destructive/70 opacity-50",
        state === "right" && "border-primary bg-primary text-primary-foreground hard-shadow-sm",
        state === "dim" && "border-border opacity-50",
      )}
    >
      <span
        className={cn(
          "border px-1.5 py-0.5 font-mono text-xs tabular-nums",
          state === "right"
            ? "border-primary-foreground/60 text-primary-foreground"
            : "border-primary/60 text-primary",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="flex-1 text-base font-semibold leading-6">{children}</span>
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
    <div
      className={cn(
        "relative overflow-hidden rounded-none border-2 border-primary/70 bg-ink p-6 hard-shadow",
        fresh && "ink-reveal",
      )}
    >
      <div className="scanlines pointer-events-none absolute inset-0" aria-hidden />
      <p className="relative font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
        <span
          className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-primary"
          aria-hidden
        />
        Incoming transmission &middot; verse {index} of {total}
      </p>
      <p className="relative mt-3 font-mono text-[16px] leading-8 text-parchment">{children}</p>
    </div>
  );
}

/** Scrolling marquee ticker for headers. */
export function Ticker({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div
      className={cn("overflow-hidden border-y-2 border-primary bg-ink py-2", className)}
      aria-hidden
    >
      <div className="marquee-track flex w-max">
        {row.map((s, i) => (
          <span
            key={i}
            className="mx-6 font-mono text-[11px] uppercase tracking-[0.3em] text-primary"
          >
            {s} <span className="ml-12 text-hot">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Chunky stat chip. */
export function Chip({
  children,
  tone = "plain",
  className,
}: {
  children: ReactNode;
  tone?: "plain" | "hot" | "neon";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block -rotate-1 border-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] hard-shadow-sm",
        tone === "plain" && "border-primary bg-ink text-primary",
        tone === "hot" && "border-hot bg-ink text-hot",
        tone === "neon" && "border-neon bg-ink text-neon",
        className,
      )}
    >
      {children}
    </span>
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
