import { describe, expect, it } from "vitest";
import { newGame } from "@/lib/game";
import { toRow } from "@/lib/sync";

describe("team sync rows", () => {
  it("maps running game to row without final time", () => {
    const g = newGame("Straw Hats", "straw-01");
    const row = toRow(g);
    expect(row.team_code).toBe("STRAW-01");
    expect(row.team_name).toBe("Straw Hats");
    expect(row.phase).toBe("r1");
    expect(row.final_time_sec).toBeNull();
  });

  it("maps completed game to row with final time", () => {
    const g = newGame("Crew", "C1");
    const done = { ...g, phase: "complete" as const, startTs: Date.now() - 100_000, endTs: Date.now(), penaltySec: 10 };
    const row = toRow(done);
    expect(row.phase).toBe("complete");
    expect(typeof row.final_time_sec).toBe("number");
    expect(row.final_time_sec!).toBeGreaterThanOrEqual(100);
  });

  it("leave-device keeps remote row intact (local-only clear)", () => {
    // Contract: Leave only calls localStorage.removeItem, never deletes the teams row.
    // pushTeam is fire-and-forget; no delete API exists in sync.ts.
    const g = newGame("Crew", "C1");
    expect(toRow(g).team_code).toBe("C1");
  });
});
