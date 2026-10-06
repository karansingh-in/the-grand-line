import { describe, expect, it } from "vitest";
import {
  TECH_DECK,
  pickRound1,
  newGame,
  elapsedSec,
  normalizeTeamCode,
  withRev,
  HUNT_STOPS,
  TOTAL_STOPS,
  getStopById,
  stopIdForTeamCount,
  stopIdForTeamCode,
  isCompatibleState,
  roman,
} from "@/lib/game";

describe("Round 1 identification bank", () => {
  it("has 20 techs with easy/medium/hard coverage", () => {
    expect(TECH_DECK).toHaveLength(20);
    expect(TECH_DECK.filter((q) => q.diff === "easy").length).toBeGreaterThanOrEqual(3);
    expect(TECH_DECK.filter((q) => q.diff === "medium").length).toBeGreaterThanOrEqual(4);
    expect(TECH_DECK.filter((q) => q.diff === "hard").length).toBeGreaterThanOrEqual(3);
  });

  it("picks 10 name-the-mark trials with 4 name options each", () => {
    for (let i = 0; i < 30; i++) {
      const picked = pickRound1();
      expect(picked).toHaveLength(10);
      expect(picked.filter((q) => q.diff === "easy")).toHaveLength(3);
      expect(picked.filter((q) => q.diff === "medium")).toHaveLength(4);
      expect(picked.filter((q) => q.diff === "hard")).toHaveLength(3);
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
    const done = { ...base, endTs: start + 999_000 };
    expect(elapsedSec(done, start + 999_000)).toBe(110);
  });

  it("withRev bumps revision for sync", () => {
    const g = newGame("Crew", "CODE-1");
    const n = withRev(g);
    expect(n.rev).toBe(g.rev + 1);
  });
});

describe("fixed round 2: three verses in login order", () => {
  it("defines 3 verse-only stops", () => {
    expect(TOTAL_STOPS).toBe(3);
    expect(HUNT_STOPS).toHaveLength(3);
    expect(HUNT_STOPS.map((s) => s.id)).toEqual([1, 2, 3]);
    for (const s of HUNT_STOPS) {
      expect(s.verse.length).toBeGreaterThan(20);
      expect(getStopById(s.id).verse).toBe(s.verse);
    }
  });

  it("deals stops in registration order, wrapping after the third crew", () => {
    expect([0, 1, 2, 3, 4, 5].map(stopIdForTeamCount)).toEqual([1, 2, 3, 1, 2, 3]);
  });

  it("falls back to a stable per-code stop when offline", () => {
    expect(stopIdForTeamCode("STRAW-HATS-01")).toBe(stopIdForTeamCode("STRAW-HATS-01"));
    for (const code of ["A", "B", "C", "D", "E", "F"]) {
      expect([1, 2, 3]).toContain(stopIdForTeamCode(code));
    }
  });

  it("deals the rotated stop into new games", () => {
    expect(newGame("Crew", "C1", 2).r2Order).toEqual([2]);
    expect(newGame("Crew", "C1").r2Order).toEqual([1]);
  });

  it("roman numerals for charts", () => {
    expect([roman(1), roman(2), roman(7)]).toEqual(["I", "II", "VII"]);
  });
});

describe("remote state compatibility gate", () => {
  it("accepts fresh games", () => {
    expect(isCompatibleState(newGame("Crew", "CODE-1"))).toBe(true);
  });

  it("rejects stale shapes that used to white-screen the render tree", () => {
    const fresh = newGame("Crew", "CODE-1");
    expect(isCompatibleState(null)).toBe(false);
    expect(isCompatibleState({})).toBe(false);
    expect(isCompatibleState({ ...fresh, phase: "mystery" })).toBe(false);
    expect(
      isCompatibleState({
        ...fresh,
        r1Questions: [{ ...fresh.r1Questions[0], format: "mark-name" }],
      }),
    ).toBe(false);
    expect(isCompatibleState({ ...fresh, r2Order: [1, 2, 3] })).toBe(false);
    expect(isCompatibleState({ ...fresh, r2Found: null })).toBe(false);
  });
});
