import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/GameShell";

export const Route = createFileRoute("/decoy")({
  head: () => ({ meta: [{ title: "Decoy Fragment - The Grand Line" }] }),
  component: () => (
    <Shell>
      <div className="mx-auto max-w-[320px] py-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
          Decoy detected
        </p>
        <h2 className="mt-4 font-display text-4xl leading-tight text-accent">
          The Marines fooled you.
        </h2>
        <div className="mx-auto mt-8 h-px w-16 bg-accent/60" />
        <p className="mt-8 text-sm leading-6 text-muted-foreground">
          This fragment does not belong to the treasure. Keep hunting.
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
