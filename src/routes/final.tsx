import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/GameShell";
import { loadState, saveState, withRev, normalizeTeamCode } from "@/lib/game";
import { pushTeam } from "@/lib/sync";

export const Route = createFileRoute("/final")({
  head: () => ({ meta: [{ title: "The Map Is Complete - The Grand Line" }] }),
  component: FinalGate,
});

function FinalGate() {
  const nav = useNavigate();
  const go = () => {
    const s = loadState();
    if (s && s.phase !== "complete") {
      const next = withRev({
        ...s,
        phase: "final" as const,
        teamCode: s.teamCode || normalizeTeamCode(s.teamId),
      });
      saveState(next);
      pushTeam(next);
    }
    nav({ to: "/" });
  };
  return (
    <Shell>
      <div className="mx-auto max-w-[320px] py-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
          Map complete
        </p>
        <h2 className="mt-4 font-display text-4xl leading-tight">The treasure is within reach.</h2>
        <div className="mx-auto mt-8 h-px w-16 bg-primary/60" />
        <p className="mt-8 text-sm leading-6 text-muted-foreground">
          One last trial stands between your crew and the One Piece.
        </p>
        <button
          onClick={go}
          className="mt-10 min-h-14 w-full bg-primary px-8 font-display text-[13px] uppercase tracking-[0.18em] text-primary-foreground"
        >
          Final challenge
        </button>
      </div>
    </Shell>
  );
}
