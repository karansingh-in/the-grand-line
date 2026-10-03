import { describe, expect, it } from "vitest";
import {
  QUESTION_BANK, pickRound1, newGame, elapsedSec, normalizeTeamCode, withRev,
  collectFragment, TOTAL_FRAGMENTS,
} from "@/lib/game";

describe("Round 1 practical bank", () => {
  it("has balanced difficulty coverage", () => {
    expect(QUESTION_BANK.filter((q) => q.diff === "easy").length).toBeGreaterThanOrEqual(12);
    expect(QUESTION_BANK.filter((q) => q.diff === "medium").length).toBeGreaterThanOrEqual(12);
    expect(QUESTION_BANK.filter((q) => q.diff === "hard").length).toBeGreaterThanOrEqual(12);
    for (const q of QUESTION_BANK) {
      expect(q.options).toHaveLength(4);
      expect(q.options).toContain(q.answer);
    }
  });

  it("picks 10 with 4 easy / 4 medium / 2 hard", () => {
    for (let i = 0; i < 20; i++) {
      const picked = pickRound1();
      expect(picked).toHaveLength(10);
      expect(picked.filter((q) => q.diff === "easy")).toHaveLength(4);
      expect(picked.filter((q) => q.diff === "medium")).toHaveLength(4);
      expect(picked.filter((q) => q.diff === "hard")).toHaveLength(2);
    }
  });

  it("covers git/linux/arch/ai categories", () => {
    const cats = new Set(QUESTION_BANK.map((q) => q.category));
    for (const c of ["git", "linux", "arch", "ai"] as const) expect(cats.has(c)).toBe(true);
  });
});

describe("team codes + timer", () => {
  it("normalizes crew codes", () => {
    expect(normalizeTeamCode(" straw hats 01 ")).toBe("STRAW-HATS-01");
  });

  it("elapsed adds penalties and freezes at end", () => {
    const g = newGame("Crew", "CODE-1");
    const start = Date.now() - 60_000;
    const base = { ...g, startTs: start, penaltySec: 20, endTs: null };
    expect(elapsedSec(base, start + 60_000)).toBe(80);
    const done = { ...base, endTs: start + 90_000 };
    expect(elapsedSec(done, start + 999_000)).toBe(110);
  });

  it("withRev bumps revision for sync", () => {
    const g = newGame("Crew", "CODE-1");
    const n = withRev(g);
    expect(n.rev).toBe(g.rev + 1);
  });
});

describe("idempotent fragments", () => {
  it("counts each id once and rejects out-of-range ids", () => {
    let g = newGame("Crew", "CODE-1");
    for (let id = 1; id <= TOTAL_FRAGMENTS; id++) {
      const r = collectFragment(g, id);
      expect(r.valid).toBe(true);
      expect(r.duplicate).toBe(false);
      g = r.next;
    }
    expect(g.fragments).toBe(TOTAL_FRAGMENTS);
    const dup = collectFragment(g, 3);
    expect(dup.duplicate).toBe(true);
    expect(dup.next.fragments).toBe(TOTAL_FRAGMENTS);
    expect(dup.next.rev).toBe(g.rev);
    for (const bad of [0, -1, 10, 99]) {
      expect(collectFragment(g, bad).valid).toBe(false);
    }
  });
});
