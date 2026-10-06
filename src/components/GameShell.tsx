import type { ReactNode } from "react";
import { Atmosphere } from "@/components/Atmosphere";

export function Shell({ children, timer }: { children: ReactNode; timer?: ReactNode }) {
  return (
    <main className="ocean-bg relative min-h-screen overflow-hidden">
      <div className="map-lines pointer-events-none absolute inset-0" />
      <Atmosphere />
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="vignette pointer-events-none absolute inset-0" />
      {timer}
      <div
        className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-10 pt-8 sm:pt-12"
        style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex flex-1 flex-col justify-center">{children}</div>
        <footer className="mt-12 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-muted-foreground/70">
            Hack the Hunt &middot; organized by SHAIDS
          </p>
        </footer>
      </div>
    </main>
  );
}
