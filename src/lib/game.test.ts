import { describe, expect, it } from "vitest";
import {
  TECH_DECK,
  SNIPPETS,
  SCENARIOS,
  pickRound1,
  newGame,
  elapsedSec,
  normalizeTeamCode,
  withRev,
  shuffledStopOrder,
  HUNT_STOPS,
  TOTAL_STOPS,
  getStopById,
  MAX_HINTS,
  spendHint,
  hintKeyForStop,
  getStopHint,
  roman,
} from "@/lib/game";

describe("Round 1 mixed-format bank", () => {
  it("has 20 techs with easy/medium/hard coverage", () => {
    expect(TECH_DECK).toHaveLength(20);
    expect(TECH_DECK.filter((q) => q.diff === "easy").length).toBeGreaterThanOrEqual(3);
    expect(TECH_DECK.filter((q) => q.diff === "medium").length).toBeGreaterThanOrEqual(4);
    expect(TECH_DECK.filter((q) => q.diff === "hard").length).toBeGreaterThanOrEqual(2);
  });

  it("picks 10 with 4 mark-name / 2 name-mark / 2 snippet / 2 scenario", () => {
    for (let i = 0; i < 30; i++) {
      const picked = pickRound1();
      expect(picked).toHaveLength(10);
      expect(picked.filter((q) => q.format === "mark-name")).toHaveLength(4);
      expect(picked.filter((q) => q.format === "name-mark")).toHaveLength(2);
      expect(picked.filter((q) => q.format === "snippet-tool")).toHaveLength(2);
      expect(picked.filter((q) => q.format === "scenario-tool")).toHaveLength(2);
      const ids = new Set(picked.map((q) => q.techId));
      expect(ids.size).toBe(10);
      for (const q of picked) {
        expect(q.options).toHaveLength(4);
        expect(q.options).toContain(q.answer);
      }
      for (const q of picked.filter((q) => q.format === "snippet-tool")) {
        expect(q.prompt && q.prompt.length).toBeGreaterThan(5);
      }
    }
  });

  it("covers github/docker/kubernetes/redis and has snippet/scenario banks", () => {
    const ids = new Set(TECH_DECK.map((t) => t.id));
    for (const c of ["github", "docker", "kubernetes", "redis"] as const)
      expect(ids.has(c)).toBe(true);
    expect(SNIPPETS.length).toBeGreaterThanOrEqual(8);
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(8);
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
    const done = { ...base, endTs: start + 999_000 };
    expect(elapsedSec(done, start + 999_000)).toBe(110);
  });

  it("withRev bumps revision for sync", () => {
    const g = newGame("Crew", "CODE-1");
    const n = withRev(g);
    expect(n.rev).toBe(g.rev + 1);
  });
});

describe("physical round 2: seven shores, shuffled per crew", () => {
  it("defines 7 stops with 3 riddles and a nudge each", () => {
    expect(TOTAL_STOPS).toBe(7);
    expect(HUNT_STOPS).toHaveLength(7);
    for (const s of HUNT_STOPS) {
      expect(s.riddles).toHaveLength(3);
      for (const r of s.riddles) expect(r.length).toBeGreaterThan(10);
      expect(s.nudge.length).toBeGreaterThan(10);
      expect(getStopById(s.id).title).toBe(s.title);
    }
  });

  it("deals every crew all 7 stops in a random order", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const order = shuffledStopOrder();
      expect(order).toHaveLength(7);
      expect(new Set(order).size).toBe(7);
      seen.add(order.join(","));
    }
    expect(seen.size).toBeGreaterThan(1);
    const g = newGame("Crew", "CODE-1");
    expect(g.r2Order).toHaveLength(7);
    expect(new Set(g.r2Order).size).toBe(7);
    expect(g.r2Pos).toBe(0);
    expect(g.r2Found).toEqual([]);
  });

  it("roman numerals for charts", () => {
    expect([roman(1), roman(2), roman(7)]).toEqual(["I", "II", "VII"]);
  });
});

describe("hints: 2 per team, any shore", () => {
  it("starts with 2 hints", () => {
    expect(newGame("Crew", "CODE-1").hintsLeft).toBe(2);
    expect(MAX_HINTS).toBe(2);
  });

  it("spends at most 2 hints, idempotent per stop", () => {
    let g = newGame("Crew", "CODE-1");
    const r1 = spendHint(g, hintKeyForStop(1), getStopHint(1));
    expect(r1.ok).toBe(true);
    g = r1.next;
    expect(g.hintsLeft).toBe(1);
    const dup = spendHint(g, hintKeyForStop(1), getStopHint(1));
    expect(dup.already).toBe(true);
    expect(dup.next.hintsLeft).toBe(1);
    const r2 = spendHint(dup.next, hintKeyForStop(4), getStopHint(4));
    expect(r2.ok).toBe(true);
    expect(r2.next.hintsLeft).toBe(0);
    const r3 = spendHint(r2.next, hintKeyForStop(5), getStopHint(5));
    expect(r3.ok).toBe(false);
    expect(r3.next.hintsLeft).toBe(0);
  });
});
