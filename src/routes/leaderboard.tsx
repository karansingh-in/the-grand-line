import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/GameShell";
import { Leaderboard } from "@/components/Leaderboard";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Top Crews - Hack the Hunt" }] }),
  component: () => (
    <Shell>
      <div className="mx-auto max-w-[360px] py-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
          Wanted &middot; top crews
        </p>
        <h2 className="mt-4 font-display text-4xl">Leaderboard</h2>
        <div className="mx-auto mt-8 h-px w-16 bg-primary/60" />
        <div className="mt-8 text-left">
          <Leaderboard />
        </div>
        <Link
          to="/"
          className="mt-10 inline-flex min-h-14 w-full items-center justify-center bg-primary px-8 font-display text-[13px] uppercase tracking-[0.18em] text-primary-foreground"
        >
          Return to the hunt
        </Link>
      </div>
    </Shell>
  ),
});
