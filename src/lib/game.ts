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

export type IconQ = {
  id: string;
  techId: TechId;
  name: string;
  answer: string;
  diff: Difficulty;
  options: string[];
};

export type PracticalQ = IconQ;

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

export const QUESTION_BANK: IconQ[] = TECH_DECK.map((t) => ({
  id: t.id,
  techId: t.id,
  name: t.name,
  answer: t.name,
  diff: t.diff,
  options: [],
}));

export const CATEGORY_LABEL: Record<string, string> = {
  git: "GIT",
  linux: "LINUX",
  arch: "ARCHITECTURE",
  ai: "AI / ML",
  data: "DATA",
  net: "NETWORK",
  debug: "DEBUG",
};

export type Challenge = {
  kind: "riddle" | "output" | "debug" | "git" | "network" | "ai" | "security" | "linux" | "sql";
  title: string;
  body: string;
  code?: string;
  answer: string;
  hint?: string;
};

export const ROUND2_STEPS: Challenge[] = [
  {
    kind: "riddle",
    title: "First Log Pose",
    body: "I have keys but open no doors. I have space but no room. You use me to speak to machines. What am I?",
    answer: "keyboard",
    hint: "You are typing on one right now.",
  },
  {
    kind: "output",
    title: "Output Prediction",
    body: "What does this Python code print?",
    code: "x = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)",
    answer: "[1, 2, 3, 4]",
    hint: "y is not a copy - it points at the same list.",
  },
  {
    kind: "git",
    title: "Git Challenge",
    body: "Which Git command creates a new branch named treasure?",
    answer: "git branch treasure",
    hint: "git branch <name>",
  },
  {
    kind: "debug",
    title: "Debug the Code",
    body: "This loop crashes. What is the index of the last valid element?",
    code: "numbers = [1, 2, 3, 4, 5]\nfor i in range(len(numbers)):\n    print(numbers[i + 1])",
    answer: "3",
    hint: "len is 5, i+1 goes out of range",
  },
  {
    kind: "network",
    title: "Networking",
    body: "Which protocol translates domain names into IP addresses?",
    answer: "dns",
    hint: "Three letters - the phonebook of the internet.",
  },
  {
    kind: "output",
    title: "Output Prediction",
    body: "What is printed?",
    code: "a = 7\nb = 3\nprint(a + b)",
    answer: "73",
    hint: "Strings join, they do not add.",
  },
  {
    kind: "security",
    title: "Cybersecurity",
    body: "Passwords should be stored using which one-way technique?",
    answer: "hashing",
    hint: "not encryption",
  },
  {
    kind: "ai",
    title: "AI / ML",
    body: "What is the name of the data used to teach a machine learning model?",
    answer: "training data",
    hint: "two words",
  },
  {
    kind: "riddle",
    title: "Second Log Pose",
    body: "The more of me you take, the more you leave behind. What am I?",
    answer: "steps",
    hint: "You take them walking across campus.",
  },
  {
    kind: "linux",
    title: "Linux Challenge",
    body: "Which Linux command prints the current working directory?",
    answer: "pwd",
    hint: "Three letters: print working ...",
  },
  {
    kind: "riddle",
    title: "Silent Bell",
    body: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "echo",
    hint: "Shout in a stairwell and you will hear me.",
  },
  {
    kind: "output",
    title: "Truth on Deck",
    body: "What does this print?",
    code: "print(2 + 3 * 4)",
    answer: "14",
    hint: "multiplication first",
  },
  {
    kind: "debug",
    title: "Leaky Barrel",
    body: "This function should return the total, but returns None. What is missing?",
    code: "def total(xs):\n    s = 0\n    for v in xs:\n        s += v",
    answer: "return s",
    hint: "the last line",
  },
  {
    kind: "git",
    title: "Merge Storm",
    body: "Your branch is behind main. Which command brings main into your branch?",
    answer: "git merge main",
    hint: "merge ...",
  },
  {
    kind: "linux",
    title: "Permission Reef",
    body: "Which command makes deploy.sh executable?",
    answer: "chmod +x deploy.sh",
    hint: "chmod +x ...",
  },
  {
    kind: "sql",
    title: "Chart Query",
    body: "Which query lists all islands with danger above 5?",
    code: "SELECT * FROM islands WHERE danger > 5;",
    answer: "select * from islands where danger > 5",
    hint: "Match the query, lowercase is fine.",
  },
  {
    kind: "network",
    title: "Harbor Code",
    body: "Which HTTP status means the treasure was created successfully?",
    answer: "201",
    hint: "2xx, not 200",
  },
  {
    kind: "security",
    title: "Sealed Orders",
    body: "What technique scrambles a message so only a key-holder can read it?",
    answer: "encryption",
    hint: "Opposite of hashing - it reverses.",
  },
  {
    kind: "ai",
    title: "Overfit Reef",
    body: "Training accuracy is 99% but test accuracy is 60%. What is this called?",
    answer: "overfitting",
    hint: "Starts with over...",
  },
  {
    kind: "output",
    title: "Loop the Rigging",
    body: "How many lines does this print?",
    code: "for i in range(3):\n    for j in range(2):\n        print(i, j)",
    answer: "6",
    hint: "3 x 2.",
  },
  {
    kind: "riddle",
    title: "Captains Clock",
    body: "What has hands but cannot clap?",
    answer: "clock",
    hint: "It hangs on the wall.",
  },
  {
    kind: "debug",
    title: "Empty Chest",
    body: "This crashes on an empty list. Which guard fixes it?",
    code: "def first(xs):\n    return xs[0]",
    answer: "if xs",
    hint: "check truthiness first",
  },
  {
    kind: "network",
    title: "Deep Port",
    body: "Which port does HTTPS use by default?",
    answer: "443",
    hint: "Three digits, starts with 4.",
  },
  {
    kind: "ai",
    title: "Vector Sea",
    body: "Numbers that encode word meaning for similarity search are called...",
    answer: "embeddings",
    hint: "Starts with em...",
  },
];

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

export const MAX_HINTS = 2;

export const FRAGMENT_HINTS: Record<number, string> = {
  1: "Start where crews gather - check the notice board by the main entrance foyer.",
  2: "Where code gets quiet - the library stairwell landing, behind the fire-drill map.",
  3: "Fuel for sailors - beside the canteen counter, under the menu board.",
  4: "Push your limits - near the gym door, look for the equipment roster.",
  5: "Up the rigging - first-floor corridor pillar outside Lab 2.",
  6: "Debug in the open - the courtyard bench facing the auditorium steps.",
  7: "Signals in the noise - behind the seminar-hall speaker schedule.",
  8: "Merge point - the atrium column with club posters, eye-level.",
  9: "X marks the deck - the final board by the event help desk.",
};

export function hintKeyForStep(index: number): string {
  return `step-${index}`;
}

export function hintKeyForFragment(id: number): string {
  return `frag-${id}`;
}

export function getStepHint(index: number): string {
  const step = ROUND2_STEPS[index % ROUND2_STEPS.length];
  if (step?.hint) return step.hint;
  return "Read the clue aloud, slowly. The answer is simpler than it looks.";
}

export function getFragmentHint(id: number): string {
  return FRAGMENT_HINTS[id] ?? "Ask the help desk for the sector of this fragment.";
}

export type GameState = {
  teamName: string;
  teamId: string;
  teamCode: string;
  phase: "team" | "r1" | "r1done" | "r2intro" | "r2" | "final" | "complete";
  startTs: number | null;
  penaltySec: number;
  endTs: number | null;
  r1Questions: IconQ[];
  r1Index: number;
  r1Wrong: number;
  r1Skips: number;
  r2Index: number;
  fragments: number;
  fragmentIds: number[];
  finalQ: number;
  rev: number;
  updatedAt: number;
  hintsLeft: number;
  revealedHints: Record<string, string>;
};

const KEY = "grandline-state-v3";
const LEGACY_KEYS = ["grandline-state-v2", "grandline-state-v1"];

export function normalizeTeamCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "-").slice(0, 32);
}

function isLegacyR1(q: unknown): boolean {
  if (!q || typeof q !== "object") return false;
  const r = q as Record<string, unknown>;
  return "slug" in r || "body" in r || "title" in r;
}

function withHints(s: GameState): GameState {
  if (typeof s.hintsLeft !== "number") s.hintsLeft = MAX_HINTS;
  if (!s.revealedHints || typeof s.revealedHints !== "object") s.revealedHints = {};
  if (!Array.isArray(s.fragmentIds)) s.fragmentIds = [];
  return s;
}

export function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as GameState;
      if (!Array.isArray(s.r1Questions) || s.r1Questions.length === 0) return null;
      if (isLegacyR1(s.r1Questions[0])) {
        localStorage.removeItem(KEY);
        return null;
      }
      return withHints(s);
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

function buildIconQuestion(tech: { id: TechId; name: string; diff: Difficulty }): IconQ {
  const distract = shuffle(TECH_DECK.filter((t) => t.id !== tech.id)).slice(0, 3);
  const options = shuffle([tech.name, ...distract.map((d) => d.name)]);
  return {
    id: `icon-${tech.id}`,
    techId: tech.id,
    name: tech.name,
    answer: tech.name,
    diff: tech.diff,
    options,
  };
}

export function pickRound1(): IconQ[] {
  const easy = shuffle(TECH_DECK.filter((q) => q.diff === "easy")).slice(0, 4);
  const med = shuffle(TECH_DECK.filter((q) => q.diff === "medium")).slice(0, 4);
  const hard = shuffle(TECH_DECK.filter((q) => q.diff === "hard")).slice(0, 2);
  return shuffle([...easy, ...med, ...hard]).map(buildIconQuestion);
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
    r2Index: 0,
    fragments: 0,
    fragmentIds: [],
    finalQ: Math.floor(Math.random() * FINAL_QUESTIONS.length),
    rev: 1,
    updatedAt: now,
    hintsLeft: MAX_HINTS,
    revealedHints: {},
  };
}

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

export const TOTAL_FRAGMENTS = 9;

export function isValidFragmentId(id: number): boolean {
  return Number.isInteger(id) && id >= 1 && id <= TOTAL_FRAGMENTS;
}

export function collectFragment(
  s: GameState,
  id: number,
): { next: GameState; duplicate: boolean; valid: boolean } {
  if (!isValidFragmentId(id)) return { next: s, duplicate: false, valid: false };
  const ids = Array.isArray(s.fragmentIds) ? s.fragmentIds : [];
  if (ids.includes(id)) return { next: s, duplicate: true, valid: true };
  const nextIds = [...ids, id];
  const next = withRev({
    ...s,
    fragmentIds: nextIds,
    fragments: Math.min(TOTAL_FRAGMENTS, nextIds.length),
    teamCode: s.teamCode || normalizeTeamCode(s.teamId),
  });
  return { next, duplicate: false, valid: true };
}
