// Helpers for the in-game QR scanner.

export type ScannedTarget = {
  path: string;
  search: Record<string, string>;
};

// Accept only same-origin game links. Returns null for anything else
// (other domains, non-URL text, empty strings).
export function parseScannedTarget(text: string, origin: string): ScannedTarget | null {
  const t = (text || "").trim();
  if (!t) return null;
  try {
    const u = new URL(t, origin);
    if (u.origin !== origin) return null;
    const search: Record<string, string> = {};
    u.searchParams.forEach((v, k) => {
      search[k] = v;
    });
    return { path: u.pathname, search };
  } catch {
    return null;
  }
}

// Routes the scanner is allowed to open inside the app.
export const SCANNABLE_PATHS = ["/", "/fragment", "/decoy", "/final", "/leaderboard"];

export function isScannablePath(path: string): boolean {
  return SCANNABLE_PATHS.includes(path);
}
