import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/GameShell";
import { loadState, saveState, TOTAL_FRAGMENTS, collectFragment } from "@/lib/game";
import { pushTeam } from "@/lib/sync";

// QR target for genuine fragments: /fragment?id=1..9
// Repeat scans of the same id are idempotent (no double counting).
export const Route = createFileRoute("/fragment")({
  validateSearch: (s: Record<string, unknown>) => ({ id: Number(s["id"]) || 0 }),
  head: () => ({ meta: [{ title: "Fragment Found — The Grand Line" }, { name: "description", content: "A map fragment has been recovered." }, { property: "og:title", content: "Fragment Found — The Grand Line" }, { property: "og:description", content: "A map fragment has been recovered." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
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
      <div className="text-center ink-reveal">
        <p className="font-display text-primary text-sm">◆ FRAGMENT RECOVERED</p>
        <h2 className="font-display text-4xl mt-4">
          {n === -2 ? "NOT PART OF THE MAP." : "A PIECE OF THE MAP."}
        </h2>
        {n !== null && n >= 0 && <p className="mt-6 font-mono text-2xl text-primary">{n} / {TOTAL_FRAGMENTS}</p>}
        {dup && <p className="mt-2 text-sm text-muted-foreground">Already in your log — no double counting.</p>}
        {n === -1 && <p className="mt-6 text-muted-foreground">Register your crew first.</p>}
        {n === -2 && <p className="mt-6 text-muted-foreground">This fragment does not belong to the treasure.</p>}
        <Link to="/" className="mt-12 inline-flex min-h-14 items-center px-8 font-display text-sm bg-primary text-primary-foreground">RETURN TO THE HUNT</Link>
      </div>
    </Shell>
  );
}
