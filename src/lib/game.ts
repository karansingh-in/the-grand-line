// Game data + state helpers for The Grand Line
// Round 1 is now practical MCQ (Git/Linux, architecture/tool selection, AI/ML & data).
// Storage versioned as v2 — v1 logo states are discarded.

export type Difficulty = "easy" | "medium" | "hard";

export type PracticalQ = {
  id: string;
  category: "git" | "linux" | "arch" | "ai" | "data" | "net" | "debug";
  diff: Difficulty;
  title: string;
  body: string;
  code?: string;
  options: string[];
  answer: string;
};

export const CATEGORY_LABEL: Record<PracticalQ["category"], string> = {
  git: "GIT",
  linux: "LINUX",
  arch: "ARCHITECTURE",
  ai: "AI / ML",
  data: "DATA",
  net: "NETWORK",
  debug: "DEBUG",
};

// 36 practical questions: 12 easy / 12 medium / 12 hard.
// Each has exactly 4 options with one correct answer.
export const QUESTION_BANK: PracticalQ[] = [
  // ---------- EASY (12) ----------
  { id: "git-01", category: "git", diff: "easy", title: "Start a voyage log", body: "Which command turns the current folder into a Git repository?", options: ["git init", "git start", "git new", "git create"], answer: "git init" },
  { id: "git-02", category: "git", diff: "easy", title: "Check the waters", body: "Which command shows changed and untracked files?", options: ["git status", "git log", "git show", "git diff --staged"], answer: "git status" },
  { id: "git-03", category: "git", diff: "easy", title: "Save a checkpoint", body: "Which command stages all changes in the current directory?", options: ["git add .", "git push .", "git commit .", "git stage ."], answer: "git add ." },
  { id: "linux-01", category: "linux", diff: "easy", title: "Where is the ship?", body: "Which Linux command prints the current working directory?", options: ["pwd", "ls", "cd", "whoami"], answer: "pwd" },
  { id: "linux-02", category: "linux", diff: "easy", title: "Look around", body: "Which command lists files in the current directory?", options: ["ls", "list", "dir", "show"], answer: "ls" },
  { id: "linux-03", category: "linux", diff: "easy", title: "Move ashore", body: "Which command changes to the /maps directory?", options: ["cd /maps", "go /maps", "move /maps", "enter /maps"], answer: "cd /maps" },
  { id: "debug-01", category: "debug", diff: "easy", title: "Off by one", body: "This loop crashes on the last iteration. What is the bug?", code: "items = [10, 20, 30]\nfor i in range(4):\n    print(items[i])", options: ["range(4) goes past index 2", "print is misspelled", "list is empty", "i starts at 1"], answer: "range(4) goes past index 2" },
  { id: "arch-01", category: "arch", diff: "easy", title: "Pick the vessel", body: "You need an isolated, repeatable runtime for your app on any machine. Best choice?", options: ["Docker container", "Screenshot", "ZIP archive", "PDF manual"], answer: "Docker container" },
  { id: "data-01", category: "data", diff: "easy", title: "Query the log", body: "Which SQL statement returns all rows from the crews table?", code: "-- crews(id, name)", options: ["SELECT * FROM crews;", "GET ALL crews;", "FETCH crews;", "OPEN crews;"], answer: "SELECT * FROM crews;" },
  { id: "net-01", category: "net", diff: "easy", title: "Address of the island", body: "Which protocol translates domain names into IP addresses?", options: ["DNS", "HTTP", "FTP", "SMTP"], answer: "DNS" },
  { id: "ai-01", category: "ai", diff: "easy", title: "Teaching the parrot", body: "What is the data used to teach a machine learning model called?", options: ["Training data", "Compass data", "Anchor data", "Sail data"], answer: "Training data" },
  { id: "arch-02", category: "arch", diff: "easy", title: "Store the treasure", body: "You need flexible JSON-like documents with no fixed schema. Best fit?", options: ["MongoDB", "SQLite file lock", "CSV in email", "Plain .txt"], answer: "MongoDB" },

  // ---------- MEDIUM (12) ----------
  { id: "git-04", category: "git", diff: "medium", title: "New route", body: "Which command creates a new branch named 'treasure' and switches to it?", options: ["git checkout -b treasure", "git branch delete treasure", "git merge treasure", "git clone treasure"], answer: "git checkout -b treasure" },
  { id: "git-05", category: "git", diff: "medium", title: "Storms ahead", body: "A merge conflict means…", options: ["Two branches changed the same lines", "The internet is down", "The repo is deleted", "The branch is locked forever"], answer: "Two branches changed the same lines" },
  { id: "linux-04", category: "linux", diff: "medium", title: "Signal flags", body: "Which command shows running processes?", options: ["ps aux", "ls -procs", "show tasks", "cat procs"], answer: "ps aux" },
  { id: "linux-05", category: "linux", diff: "medium", title: "Permissions", body: "What does chmod +x run.sh do?", options: ["Makes run.sh executable", "Deletes run.sh", "Compresses run.sh", "Moves run.sh to /tmp"], answer: "Makes run.sh executable" },
  { id: "debug-02", category: "debug", diff: "medium", title: "Alias trap", body: "What does this Python code print?", code: "x = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)", options: ["[1, 2, 3, 4]", "[1, 2, 3]", "[4, 4, 4]", "Error"], answer: "[1, 2, 3, 4]" },
  { id: "debug-03", category: "debug", diff: "medium", title: "String waters", body: "What is printed?", code: "a = '7'\nb = '3'\nprint(a + b)", options: ["73", "10", "7 3", "TypeError"], answer: "73" },
  { id: "arch-03", category: "arch", diff: "medium", title: "Choose the chart", body: "You need strong relations and JOINs for crew payroll. Best choice?", options: ["PostgreSQL", "Redis cache only", "LocalStorage", "A spreadsheet screenshot"], answer: "PostgreSQL" },
  { id: "arch-04", category: "arch", diff: "medium", title: "Cache the wind", body: "You need sub-millisecond key-value caching for sessions. Best fit?", options: ["Redis", "PostgreSQL full scan", "Git LFS", "Email"], answer: "Redis" },
  { id: "net-02", category: "net", diff: "medium", title: "Harbor codes", body: "A successful GET that returns JSON should use which HTTP status?", options: ["200 OK", "404 Not Found", "500 Server Error", "301 Moved"], answer: "200 OK" },
  { id: "data-02", category: "data", diff: "medium", title: "Filter the crew", body: "Which query finds crews with bounty > 1000?", code: "SELECT * FROM crews WHERE bounty > 1000;", options: ["SELECT * FROM crews WHERE bounty > 1000;", "SELECT bounty FROM crews;", "DELETE FROM crews;", "UPDATE crews SET bounty = 0;"], answer: "SELECT * FROM crews WHERE bounty > 1000;" },
  { id: "ai-02", category: "ai", diff: "medium", title: "Test the waters", body: "Why do you split data into train and test sets?", options: ["To measure generalization on unseen data", "To make training slower", "To delete half the data", "To avoid saving the model"], answer: "To measure generalization on unseen data" },
  { id: "arch-05", category: "arch", diff: "medium", title: "Ship the fleet", body: "You must orchestrate dozens of containers across machines. Best tool?", options: ["Kubernetes", "Notepad", "FTP", "Cron only"], answer: "Kubernetes" },

  // ---------- HARD (12) ----------
  { id: "git-06", category: "git", diff: "hard", title: "Rewrite history", body: "Which command interactively rewrites the last 3 commits?", options: ["git rebase -i HEAD~3", "git reset --delete", "git push --force-all", "git clean -fd"], answer: "git rebase -i HEAD~3" },
  { id: "linux-06", category: "linux", diff: "hard", title: "Deep search", body: "Which command finds all .log files under /var and shows permission errors too?", options: ["find /var -name '*.log' 2>&1 | head", "ls /var", "cat /var/*.log", "grep -r log /"], answer: "find /var -name '*.log' 2>&1 | head" },
  { id: "debug-04", category: "debug", diff: "hard", title: "Crash site", body: "This crashes with IndexError. What is the last valid index?", code: "numbers = [1, 2, 3, 4, 5]\nfor i in range(len(numbers)):\n    print(numbers[i + 1])", options: ["3", "4", "5", "0"], answer: "3" },
  { id: "arch-06", category: "arch", diff: "hard", title: "Event storm", body: "Millions of ship telemetry events need buffering before processing. Best fit?", options: ["Kafka", "SQLite on one laptop", "Cookies", "Environment variables"], answer: "Kafka" },
  { id: "arch-07", category: "arch", diff: "hard", title: "Infra as map", body: "You want versioned, repeatable cloud infrastructure. Best approach?", options: ["Terraform", "Manual clicks in console", "Screenshots of settings", "Sticky notes"], answer: "Terraform" },
  { id: "net-03", category: "net", diff: "hard", title: "Secure channel", body: "What does TLS primarily provide for HTTPS?", options: ["Encrypted, authenticated transport", "Faster DNS only", "Larger URLs", "Free domain names"], answer: "Encrypted, authenticated transport" },
  { id: "data-03", category: "data", diff: "hard", title: "Index the chart", body: "A query on crews(name) is slow on 10M rows. Best first fix?", options: ["Add an index on name", "Delete half the rows", "SELECT * twice", "Store names as images"], answer: "Add an index on name" },
  { id: "ai-03", category: "ai", diff: "hard", title: "Overfit reef", body: "Training accuracy is 99% but test accuracy is 61%. This is…", options: ["Overfitting", "Underclocking", "Normalization", "Compiling"], answer: "Overfitting" },
  { id: "ai-04", category: "ai", diff: "hard", title: "Vector seas", body: "Embeddings are useful because they…", options: ["Encode meaning as numbers for similarity search", "Make models smaller by deleting weights", "Replace all training data", "Guarantee 100% accuracy"], answer: "Encode meaning as numbers for similarity search" },
  { id: "net-04", category: "net", diff: "hard", title: "Port authority", body: "Which port does HTTPS use by default?", options: ["443", "80", "22", "3306"], answer: "443" },
  { id: "debug-05", category: "debug", diff: "hard", title: "Race in the rigging", body: "Two threads increment a shared counter without locks and lose counts. The bug is a…", options: ["Race condition", "Syntax error", "Missing import", "Wrong filename"], answer: "Race condition" },
  { id: "arch-08", category: "arch", diff: "hard", title: "Observe the fleet", body: "You need metrics, alerts, and dashboards for services. Best pair?", options: ["Prometheus + Grafana", "Vim + cat", "ZIP + email", "FTP + telnet"], answer: "Prometheus + Grafana" },
];

export type Challenge = {
  kind: "riddle" | "output" | "debug" | "git" | "network" | "ai" | "security" | "linux" | "sql";
  title: string;
  body: string;
  code?: string;
  answer: string;
  hint?: string;
};

export const ROUND2_STEPS: Challenge[] = [
  { kind: "riddle", title: "First Log Pose", body: "I have keys but open no doors. I have space but no room. You use me to speak to machines. What am I?", answer: "keyboard" },
  { kind: "output", title: "Output Prediction", body: "What does this Python code print?", code: "x = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)", answer: "[1, 2, 3, 4]" },
  { kind: "git", title: "Git Challenge", body: "Which Git command creates a new branch named 'treasure'?", answer: "git branch treasure", hint: "git branch <name>" },
  { kind: "debug", title: "Debug the Code", body: "This loop crashes. What is the index of the last valid element?", code: "numbers = [1, 2, 3, 4, 5]\nfor i in range(len(numbers)):\n    print(numbers[i + 1])", answer: "3", hint: "len is 5, i+1 goes out of range" },
  { kind: "network", title: "Networking", body: "Which protocol translates domain names into IP addresses?", answer: "dns" },
  { kind: "output", title: "Output Prediction", body: "What is printed?", code: "a = '7'\nb = '3'\nprint(a + b)", answer: "73" },
  { kind: "security", title: "Cybersecurity", body: "Passwords should be stored using which one-way technique?", answer: "hashing", hint: "not encryption" },
  { kind: "ai", title: "AI / ML", body: "What is the name of the data used to teach a machine learning model?", answer: "training data", hint: "two words" },
  { kind: "riddle", title: "Second Log Pose", body: "The more of me you take, the more you leave behind. What am I?", answer: "steps" },
  { kind: "linux", title: "Linux Challenge", body: "Which Linux command prints the current working directory?", answer: "pwd" },
  { kind: "riddle", title: "Silent Bell", body: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "echo" },
  { kind: "output", title: "Truth on Deck", body: "What does this print?", code: "print(2 + 3 * 4)", answer: "14", hint: "multiplication first" },
  { kind: "debug", title: "Leaky Barrel", body: "This function should return the total, but returns None. What is missing?", code: "def total(xs):\n    s = 0\n    for v in xs:\n        s += v", answer: "return s", hint: "the last line" },
  { kind: "git", title: "Merge Storm", body: "Your branch is behind main. Which command brings main into your branch?", answer: "git merge main", hint: "merge ..." },
  { kind: "linux", title: "Permission Reef", body: "Which command makes deploy.sh executable?", answer: "chmod +x deploy.sh" },
  { kind: "sql", title: "Chart Query", body: "Which query lists all islands with danger above 5?", code: "SELECT * FROM islands WHERE danger > 5;", answer: "select * from islands where danger > 5" },
  { kind: "network", title: "Harbor Code", body: "Which HTTP status means the treasure was created successfully?", answer: "201", hint: "2xx, not 200" },
  { kind: "security", title: "Sealed Orders", body: "What technique scrambles a message so only a key-holder can read it?", answer: "encryption" },
  { kind: "ai", title: "Overfit Reef", body: "Training accuracy is 99% but test accuracy is 60%. What is this called?", answer: "overfitting" },
  { kind: "output", title: "Loop the Rigging", body: "How many lines does this print?", code: "for i in range(3):\n    for j in range(2):\n        print(i, j)", answer: "6" },
  { kind: "riddle", title: "Captain's Clock", body: "What has hands but cannot clap?", answer: "clock" },
  { kind: "debug", title: "Empty Chest", body: "This crashes on an empty list. Which guard fixes it?", code: "def first(xs):\n    return xs[0]", answer: "if xs", hint: "check truthiness first" },
  { kind: "network", title: "Deep Port", body: "Which port does HTTPS use by default?", answer: "443" },
  { kind: "ai", title: "Vector Sea", body: "Numbers that encode word meaning for similarity search are called…", answer: "embeddings" },
];

export const FINAL_QUESTIONS = [
  { q: "A pirate crew stores 1024 map fragments. Each round, half the fragments are lost. After how many rounds is only 1 fragment left?", a: "10" },
  { q: "In binary, what is 1010 + 0101 (answer in decimal)?", a: "15" },
  { q: "What is the time complexity of binary search on a sorted array of n elements? (answer like: O(log n))", a: "o(log n)" },
  { q: "A crew clones a repo with 3 branches and creates 2 new branches locally. How many local branches exist now? (answer as a number)", a: "5" },
  { q: "You have training accuracy 99% and test accuracy 58%. Name the problem in one word.", a: "overfitting" },
];

export type GameState = {
  teamName: string;
  teamId: string;
  teamCode: string;
  phase: "team" | "r1" | "r1done" | "r2intro" | "r2" | "final" | "complete";
  startTs: number | null;
  penaltySec: number;
  endTs: number | null;
  r1Questions: PracticalQ[];
  r1Index: number;
  r1Wrong: number;
  r1Skips: number;
  r2Index: number;
  fragments: number; // unique QR fragments collected (of 9)
  fragmentIds: number[]; // collected fragment ids — repeat scans are idempotent
  finalQ: number;
  rev: number;
  updatedAt: number;
};

const KEY = "grandline-state-v2";
const LEGACY_KEY = "grandline-state-v1";

export function normalizeTeamCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "-").slice(0, 32);
}

function isLegacyR1(q: unknown): boolean {
  return !!q && typeof q === "object" && "slug" in (q as Record<string, unknown>);
}

export function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as GameState;
      if (Array.isArray(s.r1Questions) && s.r1Questions.length > 0 && isLegacyR1(s.r1Questions[0])) {
        localStorage.removeItem(KEY);
        return null;
      }
      if (!Array.isArray(s.fragmentIds)) s.fragmentIds = [];
      return s;
    }
    if (localStorage.getItem(LEGACY_KEY)) localStorage.removeItem(LEGACY_KEY);
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

export function pickRound1(): PracticalQ[] {
  const easy = shuffle(QUESTION_BANK.filter((q) => q.diff === "easy")).slice(0, 4);
  const med = shuffle(QUESTION_BANK.filter((q) => q.diff === "medium")).slice(0, 4);
  const hard = shuffle(QUESTION_BANK.filter((q) => q.diff === "hard")).slice(0, 2);
  return shuffle([...easy, ...med, ...hard]).map((q) => ({
    ...q,
    options: shuffle(q.options),
  }));
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

export const TOTAL_FRAGMENTS = 9;

export function isValidFragmentId(id: number): boolean {
  return Number.isInteger(id) && id >= 1 && id <= TOTAL_FRAGMENTS;
}

// Idempotent fragment collection: repeat scans of the same id are no-ops.
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
