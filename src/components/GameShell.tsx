import type { ReactNode } from "react";

export function Shell({ children, timer }: { children: ReactNode; timer?: ReactNode }) {
  return (
    <main className="ocean-bg min-h-screen relative overflow-hidden">
      <div className="map-lines absolute inset-0 pointer-events-none" />
      {timer}
      <div className="relative mx-auto max-w-2xl px-5 py-10 min-h-screen flex flex-col justify-center">
        {children}
      </div>
    </main>
  );
}