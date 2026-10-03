import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/GameShell";
import { Leaderboard } from "@/components/Leaderboard";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Top Crews — The Grand Line" }] }),
  component: () => (
    <Shell>
      <div className="text-center">
        <p className="font-display text-primary text-sm">WANTED · TOP CREWS</p>
        <h2 className="font-display text-4xl mt-2">LEADERBOARD</h2>
        <div className="mt-8"><Leaderboard /></div>
        <Link to="/" className="mt-10 inline-flex min-h-14 items-center px-8 font-display text-sm bg-primary text-primary-foreground">
          RETURN TO THE HUNT
        </Link>
      </div>
    </Shell>
  ),
});
