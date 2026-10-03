import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/GameShell";

export const Route = createFileRoute("/decoy")({
  head: () => ({ meta: [{ title: "Decoy Fragment — The Grand Line" }, { name: "description", content: "A false fragment has been detected on the treasure hunt." }, { property: "og:title", content: "Decoy Fragment — The Grand Line" }, { property: "og:description", content: "A false fragment has been detected on the treasure hunt." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => (
    <Shell>
      <div className="text-center ink-reveal">
        <p className="text-6xl text-accent">☠</p>
        <h2 className="font-display text-4xl mt-4 text-accent">DECOY DETECTED</h2>
        <p className="mt-6 text-xl">The Marines fooled you.</p>
        <p className="mt-2 text-muted-foreground">This fragment does not belong to the treasure.</p>
        <Link to="/" className="mt-12 inline-flex min-h-14 items-center px-8 font-display text-sm bg-primary text-primary-foreground">RETURN TO THE HUNT</Link>
      </div>
    </Shell>
  ),
});
