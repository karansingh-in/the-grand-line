export type Difficulty = "easy" | "medium" | "hard";

export type TechId =
  | "github"
  | "git"
  | "docker"
  | "kubernetes"
  | "redis"
  | "postgres"
  | "mongodb"
  | "antigravity"
  | "claude"
  | "openai"
  | "perplexity"
  | "linux"
  | "python"
  | "nodejs"
  | "react"
  | "gemini"
  | "aws"
  | "vscode"
  | "npm"
  | "postman";

/** Round 1 is pure identification: see the real mark, name the tech. */
export type Round1Q = {
  id: string;
  techId: TechId;
  name: string;
  answer: string;
  diff: Difficulty;
  /** Exactly 4 tech names, shuffled, containing answer. */
  options: string[];
};

/** Back-compat aliases. */
export type IconQ = Round1Q;
export type PracticalQ = Round1Q;

export const TECH_DECK: { id: TechId; name: string; diff: Difficulty }[] = [
  { id: "github", name: "GitHub", diff: "easy" },
  { id: "git", name: "Git", diff: "easy" },
  { id: "docker", name: "Docker", diff: "easy" },
  { id: "linux", name: "Linux", diff: "easy" },
  { id: "python", name: "Python", diff: "easy" },
  { id: "vscode", name: "VS Code", diff: "easy" },
  { id: "npm", name: "npm", diff: "easy" },
  { id: "kubernetes", name: "Kubernetes", diff: "medium" },
  { id: "redis", name: "Redis", diff: "medium" },
  { id: "postgres", name: "PostgreSQL", diff: "medium" },
  { id: "mongodb", name: "MongoDB", diff: "medium" },
  { id: "nodejs", name: "Node.js", diff: "medium" },
  { id: "react", name: "React", diff: "medium" },
  { id: "postman", name: "Postman", diff: "medium" },
  { id: "antigravity", name: "Antigravity", diff: "hard" },
  { id: "claude", name: "Claude", diff: "hard" },
  { id: "openai", name: "ChatGPT", diff: "hard" },
  { id: "perplexity", name: "Perplexity", diff: "hard" },
  { id: "gemini", name: "Gemini", diff: "easy" },
  { id: "aws", name: "AWS", diff: "hard" },
];

export const TECH_NAME: Record<TechId, string> = Object.fromEntries(
  TECH_DECK.map((t) => [t.id, t.name]),
) as Record<TechId, string>;

export const TECH_BY_ID: Record<TechId, { name: string; diff: Difficulty }> = Object.fromEntries(
  TECH_DECK.map((t) => [t.id, { name: t.name, diff: t.diff }]),
) as Record<TechId, { name: string; diff: Difficulty }>;

/** Tools that look alike stay together — wrong answers sting more. */
const FAMILIES: TechId[][] = [
  ["docker", "kubernetes"],
  ["redis", "postgres", "mongodb"],
  ["aws"],
  ["openai", "claude", "perplexity", "gemini", "antigravity"],
  ["git", "github"],
  ["python", "nodejs", "react", "npm"],
  ["linux", "vscode", "postman"],
];

function familyOf(id: TechId): TechId[] {
  return FAMILIES.find((f) => f.includes(id)) ?? [];
}

function pickDistractors(techId: TechId, count: number): TechId[] {
  const same = shuffle(familyOf(techId).filter((t) => t !== techId));
  const rest = shuffle(TECH_DECK.map((t) => t.id).filter((t) => t !== techId && !same.includes(t)));
  return [...same, ...rest].slice(0, count);
}

export const FINAL_QUESTIONS = [
  {
    q: "A pirate crew stores 1024 map fragments. Each round, half the fragments are lost. After how many rounds is only 1 fragment left?",
    a: "10",
  },
  { q: "In binary, what is 1010 + 0101 (answer in decimal)?", a: "15" },
  {
    q: "What is the time complexity of binary search on a sorted array of n elements? (answer like: O(log n))",
    a: "o(log n)",
  },
  {
    q: "A crew clones a repo with 3 branches and creates 2 new branches locally. How many local branches exist now? (answer as a number)",
    a: "5",
  },
  {
    q: "You have training accuracy 99% and test accuracy 58%. Name the problem in one word.",
    a: "overfitting",
  },
];

export type HuntStop = {
  /** Stable 1-based id. */
  id: number;
  /** Internal label only — never rendered to players. */
  label: string;
  /** The verse shown to the crew dealt this stop. */
  verse: string;
};

export const TOTAL_STOPS = 3;

/**
 * Fixed rotation: the 1st crew to register is dealt Throne, the 2nd the
 * Registration desk, the 3rd the Lootbox, then it wraps. Labels stay in code
 * only — players see the verse text alone.
 */
export const HUNT_STOPS: HuntStop[] = [
  {
    id: 1,
    label: "Throne",
    verse:
      "In a system, the user with the highest privileges has the most control. Find the place associated with the highest authority.",
  },
  {
    id: 2,
    label: "Registration desk",
    verse:
      "No account, no access. No details, no entry. Find the place where a user becomes part of the system.",
  },
  {
    id: 3,
    label: "Lootbox",
    verse:
      "In gaming, rewards are often stored inside a container. Find the physical equivalent of a digital storage container.",
  },
];

export function getStopById(id: number): HuntStop {
  return HUNT_STOPS.find((s) => s.id === id) ?? HUNT_STOPS[0]!;
}

/** Sequential deal: 1st crew → stop 1, 2nd → stop 2, 3rd → stop 3, then wrap. */
export function stopIdForTeamCount(count: number): number {
  const ids = HUNT_STOPS.map((s) => s.id);
  return ids[((count % ids.length) + ids.length) % ids.length]!;
}

/** Offline fallback: stable per crew code, so re-logins on any device agree. */
export function stopIdForTeamCode(code: string): number {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) >>> 0;
  return stopIdForTeamCount(h);
}

export type GameState = {
  teamName: string;
  teamId: string;
  teamCode: string;
  phase: "team" | "r1" | "r1done" | "r2intro" | "r2" | "final" | "complete";
  startTs: number | null;
  penaltySec: number;
  endTs: number | null;
  r1Questions: Round1Q[];
  r1Index: number;
  r1Wrong: number;
  r1Skips: number;
  /** Single dealt stop id, wrapped in an array. */
  r2Order: number[];
  /** Position inside r2Order. */
  r2Pos: number;
  /** Stop ids already marked found. */
  r2Found: number[];
  finalQ: number;
  rev: number;
  updatedAt: number;
};

const KEY = "grandline-state-v8";
const LEGACY_KEYS = [
  "grandline-state-v7",
  "grandline-state-v6",
  "grandline-state-v5",
  "grandline-state-v4",
  "grandline-state-v3",
  "grandline-state-v2",
  "grandline-state-v1",
];

export function normalizeTeamCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "-").slice(0, 32);
}

function isLegacyR1(q: unknown): boolean {
  if (!q || typeof q !== "object") return true;
  const r = q as Record<string, unknown>;
  // v5 questions are bare identification: no format, no prompt, options are names.
  if ("format" in r || "prompt" in r || "body" in r || "title" in r || "slug" in r) return true;
  return false;
}

function isLegacyState(s: GameState): boolean {
  if (!Array.isArray(s.r1Questions) || s.r1Questions.length === 0) return true;
  if (isLegacyR1(s.r1Questions[0])) return true;
  if (!Array.isArray(s.r2Order) || s.r2Order.length !== 1) return true;
  return false;
}

const PHASES = ["team", "r1", "r1done", "r2intro", "r2", "final", "complete"] as const;

/**
 * Rejects rows saved by older app versions (or corrupt payloads) before they
 * can reach the render tree. Stale Supabase rows are the classic white screen:
 * Round 2 reads r2Order off whatever the server hands over.
 */
export function isCompatibleState(s: unknown): s is GameState {
  if (!s || typeof s !== "object") return false;
  const g = s as Record<string, unknown>;
  if (typeof g["teamCode"] !== "string" || (g["teamCode"] as string).length === 0) return false;
  if (
    typeof g["phase"] !== "string" ||
    !(PHASES as readonly string[]).includes(g["phase"] as string)
  )
    return false;
  if (!Array.isArray(g["r1Questions"]) || (g["r1Questions"] as unknown[]).length === 0)
    return false;
  if (isLegacyR1((g["r1Questions"] as unknown[])[0])) return false;
  if (!Array.isArray(g["r2Order"]) || (g["r2Order"] as unknown[]).length !== 1) return false;
  if (!Array.isArray(g["r2Found"])) return false;
  return true;
}

function withDefaults(s: GameState): GameState {
  if (!Array.isArray(s.r2Found)) s.r2Found = [];
  return s;
}

export function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as GameState;
      if (isLegacyState(s)) {
        localStorage.removeItem(KEY);
        return null;
      }
      return withDefaults(s);
    }
    for (const k of LEGACY_KEYS) {
      if (localStorage.getItem(k)) localStorage.removeItem(k);
    }
    return null;
  } catch {
    return null;
  }
}

export function saveState(s: GameState) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function resetState() {
  localStorage.removeItem(KEY);
}

export function withRev(g: GameState): GameState {
  return { ...g, rev: (g.rev ?? 0) + 1, updatedAt: Date.now() };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i] as T;
    a[i] = a[j] as T;
    a[j] = t;
  }
  return a;
}

/** 10 identification trials per game: 3 easy / 4 medium / 3 hard. */
export function pickRound1(): Round1Q[] {
  const diffs: Difficulty[] = [
    "easy",
    "easy",
    "easy",
    "medium",
    "medium",
    "medium",
    "medium",
    "hard",
    "hard",
    "hard",
  ];
  const used = new Set<TechId>();
  const qs = diffs.map((d) => {
    const pool = shuffle(TECH_DECK.filter((t) => t.diff === d && !used.has(t.id)));
    const tech = pool[0] ?? shuffle(TECH_DECK.filter((t) => !used.has(t.id)))[0]!;
    used.add(tech.id);
    const options = shuffle([
      tech.name,
      ...pickDistractors(tech.id, 3).map((t) => TECH_BY_ID[t]!.name),
    ]);
    return {
      id: `mark-${tech.id}`,
      techId: tech.id,
      name: tech.name,
      answer: tech.name,
      diff: tech.diff,
      options: options as [string, string, string, string],
    };
  });
  return shuffle(qs);
}

export function newGame(
  teamName: string,
  teamId: string,
  stopId: number = HUNT_STOPS[0]!.id,
): GameState {
  const now = Date.now();
  return {
    teamName,
    teamId,
    teamCode: normalizeTeamCode(teamId),
    phase: "r1",
    startTs: now,
    penaltySec: 0,
    endTs: null,
    r1Questions: pickRound1(),
    r1Index: 0,
    r1Wrong: 0,
    r1Skips: 0,
    r2Order: [stopId],
    r2Pos: 0,
    r2Found: [],
    // Fixed for every crew: hosts announce the final question offline to all teams at once.
    finalQ: 0,
    rev: 1,
    updatedAt: now,
  };
}

export function elapsedSec(s: GameState, now = Date.now()): number {
  if (!s.startTs) return 0;
  const end = s.endTs ?? now;
  return Math.max(0, Math.floor((end - s.startTs) / 1000) + s.penaltySec);
}

export function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${String(h).padStart(2, "0")}:${mm}:${ss}` : `${mm}:${ss}`;
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function roman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}
