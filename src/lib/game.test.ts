import { describe, expect, it } from "vitest";
import {
  TECH_DECK,
  QUESTION_BANK,
  pickRound1,
  newGame,
  elapsedSec,
  normalizeTeamCode,
  withRev,
  collectFragment,
  TOTAL_FRAGMENTS,
  MAX_HINTS,
  spendHint,
  hintKeyForStep,
  hintKeyForFragment,
  getStepHint,
  getFragmentHint,
  FRAGMENT_HINTS,
} from "@/lib/game";

describe("Round 1 icon bank", () => {
  it("has 20 techs with balanced difficulty", () => {
    expect(TECH_DECK).toHaveLength(20);
    expect(TECH_DECK.filter((q) => q.diff === "easy").length).toBeGreaterThanOrEqual(4);
    expect(TECH_DECK.filter((q) => q.diff === "medium").length).toBeGreaterThanOrEqual(4);
    expect(TECH_DECK.filter((q) => q.diff === "hard").length).toBeGreaterThanOrEqual(2);
    expect(QUESTION_BANK).toHaveLength(20);
  });

  it("picks 10 with 4 easy / 4 medium / 2 hard, 4 name-only options each", () => {
    for (let i = 0; i < 20; i++) {
      const picked = pickRound1();
      expect(picked).toHaveLength(10);
      expect(picked.filter((q) => q.diff === "easy")).toHaveLength(4);
      expect(picked.filter((q) => q.diff === "medium")).toHaveLength(4);
      expect(picked.filter((q) => q.diff === "hard")).toHaveLength(2);
      const ids = new Set(picked.map((q) => q.techId));
      expect(ids.size).toBe(10);
      for (const q of picked) {
        expect(q.options).toHaveLength(4);
        expect(q.options).toContain(q.answer);
        expect(q.answer).toBe(q.name);
      }
    }
  });

  it("covers github/docker/kubernetes/redis", () => {
    const ids = new Set(TECH_DECK.map((t) => t.id));
    for (const c of ["github", "docker", "kubernetes", "redis"] as const)
      expect(ids.has(c)).toBe(true);
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

describe("hints: 2 per team, any step or fragment", () => {
  it("starts with 2 hints and placeholder text for all 9 fragments", () => {
    const g = newGame("Crew", "CODE-1");
    expect(g.hintsLeft).toBe(2);
    expect(MAX_HINTS).toBe(2);
    expect(
      Object.keys(FRAGMENT_HINTS)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let id = 1; id <= 9; id++) expect(getFragmentHint(id).length).toBeGreaterThan(10);
    expect(getStepHint(0).length).toBeGreaterThan(0);
  });

  it("spends at most 2 hints, idempotent per key", () => {
    let g = newGame("Crew", "CODE-1");
    const r1 = spendHint(g, hintKeyForStep(0), getStepHint(0));
    expect(r1.ok).toBe(true);
    g = r1.next;
    expect(g.hintsLeft).toBe(1);
    const dup = spendHint(g, hintKeyForStep(0), getStepHint(0));
    expect(dup.already).toBe(true);
    expect(dup.next.hintsLeft).toBe(1);
    const r2 = spendHint(dup.next, hintKeyForFragment(4), getFragmentHint(4));
    expect(r2.ok).toBe(true);
    expect(r2.next.hintsLeft).toBe(0);
    const r3 = spendHint(r2.next, hintKeyForFragment(5), getFragmentHint(5));
    expect(r3.ok).toBe(false);
    expect(r3.next.hintsLeft).toBe(0);
  });
});
