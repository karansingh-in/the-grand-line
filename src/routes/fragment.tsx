import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/GameShell";
import { loadState, saveState, TOTAL_FRAGMENTS, withRev, normalizeTeamCode } from "@/lib/game";
import { pushTeam } from "@/lib/sync";

// QR target for genuine fragments: /fragment?id=1..9
export const Route = createFileRoute("/fragment")({
  validateSearch: (s: Record<string, unknown>) => ({ id: Number(s["id"]) || 0 }),
  head: () => ({ meta: [{ title: "Fragment Found — The Grand Line" }, { name: "description", content: "A map fragment has been recovered." }, { property: "og:title", content: "Fragment Found — The Grand Line" }, { property: "og:description", content: "A map fragment has been recovered." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Fragment,
});

function Fragment() {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    const s = loadState();
    if (!s) return setN(-1);
    const f = Math.min(TOTAL_FRAGMENTS, s.fragments + 1);
    const next = withRev({ ...s, fragments: f, teamCode: s.teamCode || normalizeTeamCode(s.teamId) });
    saveState(next);
    pushTeam(next);
    setN(f);
  }, []);
  return (
    <Shell>
      <div className="text-center ink-reveal">
        <p className="font-display text-primary text-sm">◆ FRAGMENT RECOVERED</p>
        <h2 className="font-display text-4xl mt-4">A PIECE OF THE MAP.</h2>
        {n !== null && n >= 0 && <p className="mt-6 font-mono text-2xl text-primary">{n} / {TOTAL_FRAGMENTS}</p>}
        {n === -1 && <p className="mt-6 text-muted-foreground">Register your crew first.</p>}
        <Link to="/" className="mt-12 inline-flex min-h-14 items-center px-8 font-display text-sm bg-primary text-primary-foreground">RETURN TO THE HUNT</Link>
      </div>
    </Shell>
  );
}
