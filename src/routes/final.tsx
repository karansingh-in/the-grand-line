import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/GameShell";

export const Route = createFileRoute("/final")({
  head: () => ({ meta: [{ title: "The Final Reckoning — Hack the Hunt" }] }),
  component: () => (
    <Shell>
      <div className="mx-auto max-w-[320px] py-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
          Final reckoning
        </p>
        <h2 className="mt-4 font-display text-4xl leading-tight">Claim all seven shores first.</h2>
        <div className="mx-auto mt-8 h-px w-16 bg-primary/60" />
        <p className="mt-8 text-sm leading-6 text-muted-foreground">
          The final trial opens on your crew screen once the walking chart is complete.
        </p>
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
