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
    return (
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
        Loading legends...
      </p>
    );
  }
  if (!isSyncConfigured()) {
    return (
      <div className="border border-border px-6 py-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Top crews
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Connect Supabase to enable the live leaderboard.
        </p>
      </div>
    );
  }
  if (rows.length === 0) {
    return (
      <div className="border border-border px-6 py-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Top crews
        </p>
        <p className="mt-3 text-sm text-muted-foreground">No crew has claimed the One Piece yet.</p>
      </div>
    );
  }
  return (
    <div
      className={compact ? "border-t border-border pt-6" : "border border-border bg-card/40 p-5"}
    >
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        Top 5 crews &middot; live
      </p>
      <ol className="mt-5 space-y-4">
        {rows.map((r, i) => (
          <li key={r.team_code} className="flex items-baseline justify-between gap-4 text-sm">
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="font-mono text-xs text-primary tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="truncate font-medium">{r.team_name}</span>
            </span>
            <span className="shrink-0 font-mono tabular-nums text-foreground">
              {fmtTime(r.final_time_sec)}
              <span className="ml-2 text-[10px] text-muted-foreground">
                +{r.penalty_sec}s &middot; {fmtClock(r.updated_at)}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
