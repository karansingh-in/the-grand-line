import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/GameShell";
import { loadState, saveState, TOTAL_FRAGMENTS, collectFragment } from "@/lib/game";
import { pushTeam } from "@/lib/sync";

export const Route = createFileRoute("/fragment")({
  validateSearch: (s: Record<string, unknown>) => ({ id: Number(s["id"]) || 0 }),
  head: () => ({ meta: [{ title: "Fragment Found - The Grand Line" }] }),
  component: Fragment,
});

function Fragment() {
  const { id } = useSearch({ from: "/fragment" });
  const [n, setN] = useState<number | null>(null);
  const [dup, setDup] = useState(false);
  useEffect(() => {
    const s = loadState();
    if (!s) return setN(-1);
    const { next, duplicate, valid } = collectFragment(s, id);
    if (!valid) return setN(-2);
    if (!duplicate) {
      saveState(next);
      pushTeam(next);
    }
    setDup(duplicate);
    setN(next.fragments);
  }, [id]);
  return (
    <Shell>
      <div className="mx-auto max-w-[320px] py-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
          Fragment recovered
        </p>
        <h2 className="mt-4 font-display text-4xl leading-tight">
          {n === -2 ? "Not part of the map." : "A piece of the map."}
        </h2>
        <div className="mx-auto mt-8 h-px w-16 bg-primary/60" />
        {n !== null && n >= 0 && (
          <p className="mt-8 font-mono text-3xl tabular-nums text-foreground">
            {n} <span className="text-muted-foreground">/ {TOTAL_FRAGMENTS}</span>
          </p>
        )}
        {dup && (
          <p className="mt-3 text-sm text-muted-foreground">
            Already in your log - no double counting.
          </p>
        )}
        {n === -1 && (
          <p className="mt-6 text-sm leading-6 text-muted-foreground">
            Register your crew first, then scan again.
          </p>
        )}
        {n === -2 && (
          <p className="mt-6 text-sm leading-6 text-muted-foreground">
            This fragment does not belong to the treasure.
          </p>
        )}
        <Link
          to="/"
          className="mt-12 inline-flex min-h-14 w-full items-center justify-center bg-primary px-8 font-display text-[13px] uppercase tracking-[0.18em] text-primary-foreground"
        >
          Return to the hunt
        </Link>
      </div>
    </Shell>
  );
}
