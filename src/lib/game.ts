export type Difficulty = "easy" | "medium" | "hard";

export type TechId =
  | "github"
  | "git"
  | "docker"
  | "kubernetes"
  | "redis"
  | "postgres"
  | "mongodb"
  | "kafka"
  | "terraform"
  | "prometheus"
  | "grafana"
  | "linux"
  | "python"
  | "nodejs"
  | "react"
  | "nginx"
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
  { id: "kafka", name: "Kafka", diff: "hard" },
  { id: "terraform", name: "Terraform", diff: "hard" },
  { id: "prometheus", name: "Prometheus", diff: "hard" },
  { id: "grafana", name: "Grafana", diff: "hard" },
  { id: "nginx", name: "Nginx", diff: "hard" },
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
  ["redis", "postgres", "mongodb", "kafka"],
  ["terraform", "prometheus", "grafana", "nginx", "aws"],
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
  /** Stable 1-based id. Hosts: keep ids, edit titles/areas/riddles freely. */
  id: number;
  title: string;
  /** Real-world place. Placeholder until hosts fill in the venue. */
  area: string;
  /** Three verses, always shown together — cryptic first, near-explicit last. */
  riddles: [string, string, string];
  /** Extra nudge, costs 1 of the team's 2 hints. */
  nudge: string;
};

export const TOTAL_STOPS = 7;

export const HUNT_STOPS: HuntStop[] = [
  {
    id: 1,
    title: "The Silent Stacks",
    area: "Library stairwell landing — hosts: set the real spot.",
    riddles: [
      "Where the loudest crews learn to whisper, and a thousand voyages sleep upright.",
      "Climb past the Gazettes of forgotten semesters; I wait where the stairs catch their breath.",
      "Behind the fire-drill map on the landing — look low, sailor.",
    ],
    nudge:
      "Ground floor of the library block. Face the stairs, check the wall frame on your right.",
  },
  {
    id: 2,
    title: "The Galley",
    area: "Canteen counter — hosts: set the real spot.",
    riddles: [
      "Sailors run on more than wind. Follow the smell of victory at noon.",
      "Where tokens change hands for fuel and the queue bends like a river.",
      "Under the menu board, beside the counter edge — the mark hides where bills are paid.",
    ],
    nudge: "Canteen serving counter. Look beneath the menu board, near the billing corner.",
  },
  {
    id: 3,
    title: "The Engine Room",
    area: "Computer lab corridor — hosts: set the real spot.",
    riddles: [
      "I hum without sleeping and dream in blue. My heart beats in gigahertz.",
      "Rows of glowing portholes, one door marked with a number the freshmen fear.",
      "The pillar outside Lab 2, at shoulder height — the mark keeps watch there.",
    ],
    nudge: "First-floor corridor outside Lab 2. Check the pillar facing the lab door.",
  },
  {
    id: 4,
    title: "The Muster Deck",
    area: "Main entrance foyer — hosts: set the real spot.",
    riddles: [
      "Every voyage begins where all feet first land, beneath the words that name this ship.",
      "Crews gather, notices flutter, the days orders are pinned for all to read.",
      "The big notice board by the main entrance — behind the top-right corner notice.",
    ],
    nudge: "Main entrance foyer notice board. Top-right corner, behind the freshest notice.",
  },
  {
    id: 5,
    title: "The Observatory",
    area: "Courtyard / open deck — hosts: set the real spot.",
    riddles: [
      "No roof, only sky. The wind reads the minutes aloud here.",
      "Stone benches face the great steps where whole batches have sat and wondered.",
      "The courtyard bench staring at the auditorium steps — run your hand along its back edge.",
    ],
    nudge: "Courtyard bench directly facing the auditorium steps. Feel along the backrest edge.",
  },
  {
    id: 6,
    title: "The Chart Room",
    area: "Seminar hall foyer — hosts: set the real spot.",
    riddles: [
      "A hundred chairs face one voice, and every whisper returns thrice.",
      "Speakers and schedules line the wall; the learned gather, the curious linger.",
      "Behind the speaker schedule outside the seminar hall — the mark sails there.",
    ],
    nudge: "Seminar-hall foyer. Behind the printed speaker schedule on the wall.",
  },
  {
    id: 7,
    title: "The Harbor Office",
    area: "Event help desk — hosts: set the real spot.",
    riddles: [
      "When lost, sailors ask the lighthouse. It answers every question except where the rum went.",
      "Banners, badges, and the calmest humans on campus — the voyage is administered here.",
      "The event help desk board — the final mark waits where you first signed in.",
    ],
    nudge: "Event help desk. Check the board where crews registered this morning.",
  },
];

export function getStopById(id: number): HuntStop {
  return HUNT_STOPS.find((s) => s.id === id) ?? HUNT_STOPS[0]!;
}

export const MAX_HINTS = 2;

export function hintKeyForStop(id: number): string {
  return `stop-${id}`;
}

export function getStopHint(id: number): string {
  return getStopById(id).nudge;
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
  /** Shuffled order of stop ids — different for every crew. */
  r2Order: number[];
  /** Position inside r2Order. */
  r2Pos: number;
  /** Stop ids already marked found. */
  r2Found: number[];
  /** Verse dealt to this crew per stop id (0, 1, or 2) — one of three, fixed at deal time. */
  r2Verses: Record<string, number>;
  finalQ: number;
  rev: number;
  updatedAt: number;
  /** Hints remaining for the whole run (shared across devices). */
  hintsLeft: number;
  /** Revealed hint nudges by stable key (`stop-N`) → text. */
  revealedHints: Record<string, string>;
};

const KEY = "grandline-state-v6";
const LEGACY_KEYS = [
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
  if (!Array.isArray(s.r2Order) || s.r2Order.length !== TOTAL_STOPS) return true;
  if (!s.r2Verses || typeof s.r2Verses !== "object") return true;
  return false;
}

const PHASES = ["team", "r1", "r1done", "r2intro", "r2", "final", "complete"] as const;

/**
 * Rejects rows saved by older app versions (or corrupt payloads) before they
 * can reach the render tree. Stale Supabase rows are the classic white screen:
 * Round 2 reads r2Verses/r2Order off whatever the server hands over.
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
  if (!Array.isArray(g["r2Order"]) || (g["r2Order"] as unknown[]).length !== TOTAL_STOPS)
    return false;
  if (!g["r2Verses"] || typeof g["r2Verses"] !== "object") return false;
  if (!Array.isArray(g["r2Found"])) return false;
  if (typeof g["hintsLeft"] !== "number") return false;
  if (!g["revealedHints"] || typeof g["revealedHints"] !== "object") return false;
  return true;
}

function withDefaults(s: GameState): GameState {
  if (typeof s.hintsLeft !== "number") s.hintsLeft = MAX_HINTS;
  if (!s.revealedHints || typeof s.revealedHints !== "object") s.revealedHints = {};
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

/** Each crew is dealt one of the three verses per shore — fixed for the whole run. */
function dealVerses(): Record<string, number> {
  return Object.fromEntries(HUNT_STOPS.map((s) => [String(s.id), Math.floor(Math.random() * 3)]));
}

/** Every crew sails a different route through the same seven shores. */
export function shuffledStopOrder(): number[] {
  return shuffle(HUNT_STOPS.map((s) => s.id));
}

export function newGame(teamName: string, teamId: string): GameState {
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
    r2Order: shuffledStopOrder(),
    r2Pos: 0,
    r2Found: [],
    r2Verses: dealVerses(),
    finalQ: Math.floor(Math.random() * FINAL_QUESTIONS.length),
    rev: 1,
    updatedAt: now,
    hintsLeft: MAX_HINTS,
    revealedHints: {},
  };
}

/** Reveal a hint nudge if the team has any left. Idempotent per key. */
export function spendHint(
  s: GameState,
  key: string,
  text: string,
): { next: GameState; ok: boolean; already: boolean } {
  if (s.revealedHints[key]) return { next: s, ok: true, already: true };
  if (s.hintsLeft <= 0) return { next: s, ok: false, already: false };
  const next = withRev({
    ...s,
    hintsLeft: s.hintsLeft - 1,
    revealedHints: { ...s.revealedHints, [key]: text },
  });
  return { next, ok: true, already: false };
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
