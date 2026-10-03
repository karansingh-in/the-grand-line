import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/GameShell";
import { loadState, saveState, withRev, normalizeTeamCode } from "@/lib/game";
import { pushTeam } from "@/lib/sync";

// QR target of the fully reconstructed map
export const Route = createFileRoute("/final")({
  head: () => ({ meta: [{ title: "The Map Is Complete — The Grand Line" }, { name: "description", content: "The final challenge awaits." }, { property: "og:title", content: "The Map Is Complete — The Grand Line" }, { property: "og:description", content: "The final challenge awaits." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: FinalGate,
});

function FinalGate() {
  const nav = useNavigate();
  const go = () => {
    const s = loadState();
    if (s && s.phase !== "complete") {
      const next = withRev({ ...s, phase: "final" as const, teamCode: s.teamCode || normalizeTeamCode(s.teamId) });
      saveState(next);
      pushTeam(next);
    }
    nav({ to: "/" });
  };
  return (
    <Shell>
      <div className="text-center">
        <h2 className="font-display text-4xl sm:text-5xl ink-reveal">THE MAP IS COMPLETE.</h2>
        <p className="mt-6 text-muted-foreground fade-up" style={{ animationDelay: "0.8s" }}>THE TREASURE IS WITHIN REACH.</p>
        <div className="mt-12 max-w-xs mx-auto fade-up" style={{ animationDelay: "1.4s" }}>
          <button onClick={go} className="w-full min-h-14 font-display text-sm bg-primary text-primary-foreground">FINAL CHALLENGE</button>
        </div>
      </div>
    </Shell>
  );
}
