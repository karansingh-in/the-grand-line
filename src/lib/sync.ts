// Multi-device team sync via Supabase `teams` table.
// Falls back to local-only mode when Supabase is unavailable.
import type { GameState } from "@/lib/game";
import { elapsedSec, isCompatibleState } from "@/lib/game";

export type TeamRow = {
  team_code: string;
  team_name: string;
  state: GameState;
  phase: string;
  penalty_sec: number;
  final_time_sec: number | null;
  updated_at: string;
};

function getEnv(name: string): string | undefined {
  try {
    const v = import.meta?.env?.[name] as string | undefined;
    if (v) return v;
  } catch {
    /* noop */
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = (globalThis as any)?.process?.env?.[name] as string | undefined;
    if (p) return p;
  } catch {
    /* noop */
  }
  return undefined;
}

export function isSyncConfigured(): boolean {
  return !!(getEnv("VITE_SUPABASE_URL") && getEnv("VITE_SUPABASE_PUBLISHABLE_KEY"));
}

async function getSupabase() {
  if (!isSyncConfigured()) return null;
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    return supabase;
  } catch {
    return null;
  }
}

export function toRow(s: GameState): Omit<TeamRow, "updated_at"> {
  return {
    team_code: s.teamCode,
    team_name: s.teamName,
    state: s,
    phase: s.phase,
    penalty_sec: s.penaltySec,
    final_time_sec: s.phase === "complete" ? elapsedSec(s) : null,
  };
}

export async function pushTeam(s: GameState): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;
  try {
    const { error } = await (
      sb as never as {
        from: (t: string) => { upsert: (r: unknown) => Promise<{ error: unknown }> };
      }
    )
      .from("teams")
      .upsert(toRow(s));
    return !error;
  } catch {
    return false;
  }
}

export async function fetchTeam(teamCode: string): Promise<GameState | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await (
      sb as never as {
        from: (t: string) => {
          select: (c: string) => {
            eq: (
              col: string,
              v: string,
            ) => {
              maybeSingle: () => Promise<{ data: TeamRow | null; error: unknown }>;
            };
          };
        };
      }
    )
      .from("teams")
      .select("state")
      .eq("team_code", teamCode)
      .maybeSingle();
    if (error || !data?.state) return null;
    const state = data.state as GameState;
    // Never hand a stale-version row to the render tree (white screen). Callers
    // treat incompatible rows as absent and start fresh instead.
    return isCompatibleState(state) ? state : null;
  } catch {
    return null;
  }
}

/**
 * How many crews have registered so far. Drives the fixed verse rotation
 * (1st crew → stop 1, 2nd → stop 2, ...). Null when offline/unconfigured —
 * callers fall back to a code hash instead.
 */
export async function fetchTeamCount(): Promise<number | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const { count, error } = await (
      sb as never as {
        from: (t: string) => {
          select: (c: string, o: unknown) => Promise<{ count: number | null; error: unknown }>;
        };
      }
    )
      .from("teams")
      .select("team_code", { count: "exact", head: true });
    if (error || typeof count !== "number") return null;
    return count;
  } catch {
    return null;
  }
}

export type LeaderboardEntry = {
  team_code: string;
  team_name: string;
  final_time_sec: number;
  penalty_sec: number;
  updated_at: string;
};

export async function fetchLeaderboard(limit = 5): Promise<LeaderboardEntry[]> {
  const sb = await getSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await (
      sb as never as {
        from: (t: string) => {
          select: (c: string) => {
            eq: (
              col: string,
              v: string,
            ) => {
              order: (
                col: string,
                o: unknown,
              ) => {
                limit: (n: number) => Promise<{ data: LeaderboardEntry[] | null; error: unknown }>;
              };
            };
          };
        };
      }
    )
      .from("teams")
      .select("team_code,team_name,final_time_sec,penalty_sec,updated_at")
      .eq("phase", "complete")
      .order("final_time_sec", { ascending: true })
      .limit(limit);
    if (error || !data) return [];
    return (data as LeaderboardEntry[]).filter((r) => typeof r.final_time_sec === "number");
  } catch {
    return [];
  }
}

export async function subscribeTeam(
  teamCode: string,
  onRemote: (s: GameState) => void,
): Promise<() => void> {
  const sb = await getSupabase();
  if (!sb) return () => undefined;
  try {
    const channel = (
      sb as never as {
        channel: (n: string) => {
          on: (
            ev: string,
            f: unknown,
            cb: (p: { new: TeamRow }) => void,
          ) => { subscribe: () => void };
          subscribe: () => void;
          unsubscribe: () => void;
        };
        removeChannel: (c: unknown) => void;
      }
    ).channel(`team-${teamCode}`);
    const ch = channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "teams", filter: `team_code=eq.${teamCode}` },
      (payload) => {
        if (payload?.new?.state) onRemote(payload.new.state as GameState);
      },
    );
    ch.subscribe();
    // Polling fallback every 4s (covers environments without Realtime).
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      const remote = await fetchTeam(teamCode);
      if (remote && !cancelled) onRemote(remote);
      setTimeout(poll, 4000);
    };
    const t = setTimeout(poll, 4000);
    return () => {
      cancelled = true;
      clearTimeout(t);
      try {
        (sb as never as { removeChannel: (c: unknown) => void }).removeChannel(ch);
      } catch {
        /* noop */
      }
    };
  } catch {
    return () => undefined;
  }
}
