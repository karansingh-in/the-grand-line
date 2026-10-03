import { useEffect, useState } from "react";
import { fetchLeaderboard, isSyncConfigured, type LeaderboardEntry } from "@/lib/sync";
import { fmtTime } from "@/lib/game";

function fmtClock(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function Leaderboard({ compact = false }: { compact?: boolean }) {
  const [rows, setRows] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    let live = true;
    if (!isSyncConfigured()) {
      setRows([]);
      return;
    }
    fetchLeaderboard(5).then((r) => {
      if (live) setRows(r);
    });
    const id = setInterval(() => {
      fetchLeaderboard(5).then((r) => {
        if (live) setRows(r);
      });
    }, 10000);
    return () => {
      live = false;
      clearInterval(id);
    };
  }, []);

  if (rows === null) {
    return <p className="text-center text-xs text-muted-foreground tracking-widest">LOADING LEGENDS…</p>;
  }
  if (!isSyncConfigured()) {
    return (
      <div className="text-center text-xs text-muted-foreground">
        <p className="tracking-[0.3em]">TOP CREWS</p>
        <p className="mt-2">Connect Supabase to enable the live leaderboard.</p>
      </div>
    );
  }
  if (rows.length === 0) {
    return (
      <div className="text-center">
        <p className="text-[10px] tracking-[0.3em] text-muted-foreground">TOP CREWS</p>
        <p className="mt-2 text-sm text-muted-foreground">No crew has claimed the One Piece yet.</p>
      </div>
    );
  }
  return (
    <div className={compact ? "" : "border border-border bg-card/40 p-4"}>
      <p className="text-center text-[10px] tracking-[0.3em] text-muted-foreground">TOP 5 CREWS · LIVE</p>
      <ol className="mt-3 space-y-2">
        {rows.map((r, i) => (
          <li key={r.team_code} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 truncate">
              <span className="font-mono text-primary w-6">{i + 1}.</span>
              <span className="truncate font-medium">{r.team_name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">· {r.team_code}</span>
            </span>
            <span className="font-mono tabular-nums text-primary whitespace-nowrap">
              {fmtTime(r.final_time_sec)}
              <span className="ml-2 text-[10px] text-muted-foreground">+{r.penalty_sec}s · {fmtClock(r.updated_at)}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
