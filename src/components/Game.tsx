import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  type GameState,
  loadState,
  saveState,
  resetState,
  newGame,
  elapsedSec,
  fmtTime,
  ROUND2_STEPS,
  FINAL_QUESTIONS,
  TOTAL_FRAGMENTS,
  normalizeTeamCode,
  withRev,
  spendHint,
  getStepHint,
  getFragmentHint,
  hintKeyForStep,
  hintKeyForFragment,
} from "@/lib/game";
import { fetchTeam, pushTeam, subscribeTeam } from "@/lib/sync";
import { Shell } from "@/components/GameShell";
import { Leaderboard } from "@/components/Leaderboard";
import { QrScanner } from "@/components/QrScanner";
import { TechIcon } from "@/components/TechIcon";
import {
  Kicker,
  Title,
  Lede,
  PrimaryButton,
  GhostButton,
  Card,
  Hairline,
  Progress,
  HintPips,
} from "@/components/ui";

export function Compass({ size = 220 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className="compass-spin text-primary opacity-20"
      aria-hidden
    >
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 4"
      />
      {Array.from({ length: 32 }).map((_, i) => (
        <line
          key={i}
          x1="100"
          y1="6"
          x2="100"
          y2={i % 4 === 0 ? 20 : 12}
          stroke="currentColor"
          strokeWidth="1"
          transform={`rotate(${i * 11.25} 100 100)`}
        />
      ))}
      <polygon points="100,22 108,100 100,178 92,100" fill="currentColor" opacity="0.6" />
      <polygon points="22,100 100,92 178,100 100,108" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function useGame() {
  const [s, setS] = useState<GameState | null>(null);
  const [ready, setReady] = useState(false);
  const [joined, setJoined] = useState(false);
  const pushT = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const local = loadState();
    setS(local);
    setReady(true);
    if (!local) return;
    fetchTeam(local.teamCode).then((remote) => {
      if (remote && (remote.rev ?? 0) > (loadState()?.rev ?? 0)) {
        saveState(remote);
        setS(remote);
      }
    });
  }, []);

  useEffect(() => {
    if (!s?.teamCode) return;
    let cancel = false;
    let unsub: (() => void) | undefined;
    subscribeTeam(s.teamCode, (remote) => {
      if (cancel) return;
      setS((cur) => {
        if (!cur) return cur;
        if (cur.teamCode !== remote.teamCode) return cur;
        if ((remote.rev ?? 0) <= (cur.rev ?? 0)) return cur;
        saveState(remote);
        return remote;
      });
    }).then((u) => {
      unsub = u;
    });
    return () => {
      cancel = true;
      unsub?.();
    };
  }, [s?.teamCode]);

  const persist = (n: GameState) => {
    saveState(n);
    if (pushT.current) clearTimeout(pushT.current);
    pushT.current = setTimeout(() => {
      pushTeam(n);
    }, 600);
  };

  const update = (fn: (g: GameState) => GameState) =>
    setS((g) => {
      if (!g) return g;
      const n = withRev(fn(g));
      persist(n);
      return n;
    });
  const set = (n: GameState | null) => {
    if (n) persist(n);
    else {
      resetState();
      setJoined(false);
    }
    setS(n);
  };
  const adopt = (n: GameState) => {
    saveState(n);
    setS(n);
    setJoined(true);
  };
  return { s, ready, update, set, adopt, joined, setJoined };
}

function Timer({ s, onLeave }: { s: GameState; onLeave: () => void }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Time
          </p>
          <p className="font-mono text-2xl tabular-nums text-foreground">
            {fmtTime(elapsedSec(s))}
          </p>
        </div>
        <div className="text-right">
          <p className="truncate font-display text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {s.teamName}
          </p>
          <button
            onClick={onLeave}
            title="Leave this device (keeps team progress)"
            className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}

function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2">
        <Compass size={380} />
      </div>
      <div className="relative">
        <Kicker>N 0&deg;00&prime; &middot; W 0&deg;00&prime;</Kicker>
        <p className="mt-6 font-display text-[13px] uppercase tracking-[0.34em] text-primary">
          The Grand Line
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[1.02] sm:text-6xl">
          Technical
          <br />
          Treasure
          <br />
          Hunt
        </h1>
        <Hairline className="mx-auto mt-8" />
        <div className="mt-8 space-y-2 text-muted-foreground">
          <p>Navigate. Decode.</p>
          <p>Debug. Discover.</p>
        </div>
        <div className="mx-auto mt-12 w-full max-w-[280px]">
          <PrimaryButton onClick={onEnter}>Enter the Grand Line</PrimaryButton>
        </div>
        <div className="mx-auto mt-14 w-full max-w-sm">
          <Leaderboard compact />
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full min-h-14 bg-transparent border-b border-border focus:border-primary outline-none px-1 py-3 text-lg text-foreground placeholder:text-muted-foreground/60";

function TeamEntry({ onStart }: { onStart: (existing: GameState) => void }) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "sailing">("idle");
  const [joinMsg, setJoinMsg] = useState("");

  if (status === "sailing")
    return (
      <div className="py-16 text-center">
        <Kicker>Setting sail</Kicker>
        <Title className="mt-4">
          Your journey
          <br />
          begins.
        </Title>
        <Lede className="mx-auto mt-6 max-w-[280px]">{joinMsg || "The Grand Line awaits."}</Lede>
      </div>
    );

  return (
    <form
      className="mx-auto w-full max-w-[340px] py-6"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!name.trim() || !id.trim() || status !== "idle") return;
        setStatus("checking");
        const code = normalizeTeamCode(id);
        const remote = await fetchTeam(code);
        if (remote) {
          setJoinMsg(`Welcome back, ${remote.teamName}. Syncing crew progress...`);
          setStatus("sailing");
          setTimeout(() => onStart(remote), 1200);
          return;
        }
        const fresh = newGame(name.trim(), id.trim());
        setJoinMsg("The Grand Line awaits.");
        setStatus("sailing");
        setTimeout(() => onStart(fresh), 1400);
      }}
    >
      <div className="text-center">
        <Kicker>Crew manifest</Kicker>
        <Title className="mt-4">
          Enter your
          <br />
          crew
        </Title>
        <Lede className="mx-auto mt-6 max-w-[280px]">
          One crew code per team. Teammates enter the same code to sail together.
        </Lede>
      </div>
      <div className="mt-12 space-y-10">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Team name
          </span>
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Straw Hats"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Crew code
          </span>
          <input
            className={inputCls}
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            placeholder="e.g. STRAW-HATS-01"
          />
        </label>
      </div>
      <div className="mt-12">
        <PrimaryButton disabled={status !== "idle"}>
          {status === "checking" ? "Finding your crew..." : "Set Sail"}
        </PrimaryButton>
      </div>
    </form>
  );
}

function Round1({ s, update }: { s: GameState; update: ReturnType<typeof useGame>["update"] }) {
  const [flash, setFlash] = useState(0);
  const [wrongPick, setWrongPick] = useState<string | null>(null);
  const q = s.r1Questions[s.r1Index]!;

  useEffect(() => {
    const id = setInterval(() => {
      if (s.startTs && Date.now() - s.startTs > 600_000) update((g) => ({ ...g, phase: "r1done" }));
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.startTs]);

  const next = (g: GameState, pen: number): GameState => {
    const last = g.r1Index >= g.r1Questions.length - 1;
    return {
      ...g,
      penaltySec: g.penaltySec + pen,
      r1Index: last ? g.r1Index : g.r1Index + 1,
      r1Wrong: 0,
      phase: last ? "r1done" : "r1",
    };
  };
  const penalty = () => setFlash((f) => f + 1);

  const choose = (opt: string) => {
    setWrongPick(null);
    if (opt === q.answer) return update((g) => next(g, 0));
    penalty();
    if (s.r1Wrong === 0) {
      setWrongPick(opt);
      update((g) => ({ ...g, penaltySec: g.penaltySec + 10, r1Wrong: 1 }));
    } else update((g) => next(g, 10));
  };
  const skip = () => {
    penalty();
    setWrongPick(null);
    update((g) => ({ ...next(g, 10), r1Skips: g.r1Skips + 1 }));
  };

  return (
    <div key={s.r1Index} className="mx-auto w-full max-w-[380px] py-4">
      <div className="flex items-baseline justify-between">
        <Kicker>Round 01 &middot; {q.diff}</Kicker>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {s.r1Index + 1} / {s.r1Questions.length}
        </span>
      </div>
      <div className="mt-3">
        <Progress value={s.r1Index} max={s.r1Questions.length} />
      </div>

      <div className="py-10 text-center">
        <Card className="relative mx-auto flex h-56 w-56 items-center justify-center text-primary">
          <TechIcon id={q.techId} size={128} />
          {flash > 0 && (
            <span key={flash} className="absolute right-3 top-3 font-mono text-sm text-accent">
              +10s
            </span>
          )}
        </Card>
        <h3 className="mt-8 font-display text-2xl">Which tool is this?</h3>
        <p className="mt-2 text-sm text-muted-foreground">Four names. One mark. Trust your eyes.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map((o) => {
          const wrong = wrongPick === o;
          return (
            <button
              key={o}
              onClick={() => choose(o)}
              disabled={wrong}
              className={`min-h-16 border px-3 py-4 text-center text-[15px] font-medium transition active:scale-[0.98] ${wrong ? "border-destructive/60 text-muted-foreground opacity-40" : "border-border bg-card hover:border-primary"}`}
            >
              {o}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <GhostButton onClick={skip} disabled={s.r1Skips >= 2}>
          Skip +10s &middot; {2 - s.r1Skips} left
        </GhostButton>
        {s.r1Wrong === 1 && (
          <p className="mt-4 text-center text-sm text-accent">Not that one. One more attempt.</p>
        )}
        <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Wrong answers cost time
        </p>
      </div>
    </div>
  );
}

function Center({
  kicker,
  title,
  sub,
  action,
  onAction,
}: {
  kicker?: string;
  title: ReactNode;
  sub?: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="mx-auto max-w-[340px] py-16 text-center">
      {kicker && <Kicker className="text-primary">{kicker}</Kicker>}
      <Title className="mt-4">{title}</Title>
      {sub && <Lede className="mx-auto mt-6 max-w-[280px]">{sub}</Lede>}
      <Hairline className="mx-auto mt-8" />
      <div className="mt-8">
        <PrimaryButton onClick={onAction}>{action}</PrimaryButton>
      </div>
    </div>
  );
}

function Fragments({ n }: { n: number }) {
  return (
    <div className="text-center">
      <Kicker>
        Treasure map &middot; {n}/{TOTAL_FRAGMENTS}
      </Kicker>
      <div className="mt-4 inline-grid grid-cols-9 gap-2">
        {Array.from({ length: TOTAL_FRAGMENTS }).map((_, i) => (
          <span
            key={i}
            className={`h-3 w-3 rotate-45 border ${i < n ? "bg-primary border-primary" : "border-border"}`}
          />
        ))}
      </div>
    </div>
  );
}

function HintBlock({
  label,
  revealed,
  left,
  onUse,
}: {
  label: string;
  revealed?: string | undefined;
  left: number;
  onUse: () => void;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    setArmed(false);
  }, [revealed, left]);
  if (revealed) {
    return (
      <div className="border border-primary/40 bg-card p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">{label}</p>
        <p className="mt-2 text-[15px] leading-6">{revealed}</p>
      </div>
    );
  }
  return (
    <button
      onClick={() => {
        if (left <= 0) return;
        if (!armed) {
          setArmed(true);
          return;
        }
        setArmed(false);
        onUse();
      }}
      disabled={left <= 0}
      className="w-full border border-dashed border-border p-4 text-left transition hover:border-primary disabled:opacity-40"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 block text-sm text-foreground">
        {left <= 0
          ? "No hints left."
          : armed
            ? "Tap again to spend 1 hint - sure?"
            : `Stuck? Spend 1 of ${left} hints.`}
      </span>
    </button>
  );
}

function Round2({ s, update }: { s: GameState; update: ReturnType<typeof useGame>["update"] }) {
  const step = ROUND2_STEPS[s.r2Index % ROUND2_STEPS.length]!;
  const [found, setFound] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [ans, setAns] = useState("");
  const [err, setErr] = useState(false);
  const isRiddle = step.kind === "riddle";
  const stepKey = hintKeyForStep(s.r2Index);

  useEffect(() => {
    setFound(false);
    setAns("");
    setErr(false);
  }, [s.r2Index]);

  const submit = () => {
    if (ans.trim().toLowerCase().replace(/\s+/g, " ") !== step.answer.toLowerCase()) {
      setErr(true);
      return;
    }
    setAns("");
    setErr(false);
    setFound(false);
    update((g) => ({ ...g, r2Index: g.r2Index + 1 }));
  };

  const spendStepHint = () => {
    const { next, ok } = spendHint(s, stepKey, getStepHint(s.r2Index));
    if (!ok) return;
    update(() => ({ ...next, rev: next.rev }));
  };
  const spendFragHint = (id: number) => {
    const { next, ok } = spendHint(s, hintKeyForFragment(id), getFragmentHint(id));
    if (!ok) return;
    update(() => ({ ...next, rev: next.rev }));
  };

  const nextMissing = Array.from({ length: TOTAL_FRAGMENTS }, (_, i) => i + 1).filter(
    (id) => !(s.fragmentIds ?? []).includes(id),
  );

  return (
    <div key={s.r2Index} className="mx-auto w-full max-w-[400px] py-4">
      <Fragments n={s.fragments} />

      <div className="mt-8 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Hints
        </span>
        <HintPips left={s.hintsLeft} />
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        2 hints for the whole hunt. Spend them on any clue or any map fragment.
      </p>

      <article className="mt-6 bg-parchment p-6 text-ink shadow-2xl sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-60">
          Ship log &middot; entry {s.r2Index + 1} &middot; {step.kind}
        </p>
        <h3 className="mt-2 font-display text-2xl">{step.title}</h3>
        <p className="mt-4 text-[17px] leading-8">{step.body}</p>
        {step.code && (
          <pre className="mt-4 overflow-x-auto bg-ink p-4 font-mono text-sm text-parchment">
            {step.code}
          </pre>
        )}
      </article>

      <div className="mt-4">
        <HintBlock
          label="Clue hint"
          revealed={s.revealedHints[stepKey]}
          left={s.hintsLeft}
          onUse={spendStepHint}
        />
        {err && !s.revealedHints[stepKey] && (
          <p className="mt-3 text-sm text-muted-foreground">
            Wrong turn. A hint costs nothing but pride — {s.hintsLeft} left.
          </p>
        )}
      </div>

      <div className="mt-8">
        {isRiddle && !found ? (
          <PrimaryButton onClick={() => setFound(true)}>I found the location</PrimaryButton>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <input
              className={inputCls}
              placeholder={isRiddle ? "Code from the location / answer" : "Your answer"}
              value={ans}
              onChange={(e) => {
                setAns(e.target.value);
                setErr(false);
              }}
            />
            {err && <p className="text-sm text-accent">The compass disagrees. Try again.</p>}
            <PrimaryButton>Submit</PrimaryButton>
          </form>
        )}
      </div>

      <Hairline className="mx-auto mt-12" />

      <div className="mt-8">
        <Kicker>Map fragments</Kicker>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Scan each QR fragment you find.{" "}
          {nextMissing.length > 0 ? "Need a nudge on a location?" : "Map complete."}
        </p>
        <div className="mt-4 space-y-3">
          {nextMissing.slice(0, 3).map((id) => {
            const key = hintKeyForFragment(id);
            const revealed = s.revealedHints[key];
            return (
              <HintBlock
                key={id}
                label={`Fragment ${id} of ${TOTAL_FRAGMENTS}`}
                revealed={revealed}
                left={s.hintsLeft}
                onUse={() => spendFragHint(id)}
              />
            );
          })}
        </div>
        {s.fragments > 0 && (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Found: {(s.fragmentIds ?? []).sort((a, b) => a - b).join(" · ")}
          </p>
        )}
      </div>

      <div className="mt-8 space-y-3">
        <GhostButton onClick={() => setScanning(true)}>Scan QR with camera</GhostButton>
        <p className="text-center text-xs text-muted-foreground">
          Assemble the real ones to reveal the final map.
        </p>
      </div>
      {scanning && <QrScanner onClose={() => setScanning(false)} />}
    </div>
  );
}

function Final({ s, update }: { s: GameState; update: ReturnType<typeof useGame>["update"] }) {
  const q = FINAL_QUESTIONS[s.finalQ % FINAL_QUESTIONS.length]!;
  const [ans, setAns] = useState("");
  const [err, setErr] = useState(false);
  return (
    <form
      className="mx-auto w-full max-w-[340px] py-10 text-center"
      onSubmit={(e) => {
        e.preventDefault();
        if (ans.trim().toLowerCase() !== q.a) return setErr(true);
        update((g) => ({ ...g, phase: "complete", endTs: Date.now() }));
      }}
    >
      <Kicker className="text-primary">Final challenge</Kicker>
      <Title className="mt-4">
        The One
        <br />
        Piece
      </Title>
      <Hairline className="mx-auto mt-8" />
      <p className="mt-8 text-lg leading-8">{q.q}</p>
      <input
        className={`${inputCls} mt-8 text-center`}
        value={ans}
        onChange={(e) => {
          setAns(e.target.value);
          setErr(false);
        }}
        placeholder="Your answer"
      />
      {err && <p className="mt-4 text-sm text-accent">Not yet, captain.</p>}
      <div className="mt-8">
        <PrimaryButton>Submit Final Answer</PrimaryButton>
      </div>
    </form>
  );
}

function Complete({ s, onLeave }: { s: GameState; onLeave: () => void }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2">
        <Compass size={320} />
      </div>
      <div className="relative w-full max-w-[360px]">
        <Kicker className="text-primary">Grand line conquered</Kicker>
        <Title className="mt-4">The One Piece has been found.</Title>
        <Hairline className="mx-auto mt-8" />
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Final time
        </p>
        <p className="mt-2 font-mono text-6xl tabular-nums text-primary">
          {fmtTime(elapsedSec(s))}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          incl. {s.penaltySec}s penalties &middot; {s.teamName} ({s.teamId})
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Solved {s.r1Questions.length} trials &middot; {s.fragments}/{TOTAL_FRAGMENTS} fragments
          &middot; {s.r2Index} log entries
        </p>
        <Hairline className="mx-auto mt-8" />
        <div className="mt-8 w-full">
          <Leaderboard />
        </div>
        <div className="mt-10 w-full">
          <GhostButton onClick={onLeave}>Leave this device</GhostButton>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Clears only this phone. Crew progress stays synced.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Game() {
  const { s, ready, update, set, adopt } = useGame();
  const [entered, setEntered] = useState(false);
  const leaveDevice = () => {
    if (confirm("Leave this device? Your crews progress stays saved.")) {
      set(null);
      setEntered(false);
    }
  };
  if (!ready)
    return (
      <Shell>
        <div />
      </Shell>
    );
  if (!s)
    return (
      <Shell>
        {entered ? (
          <TeamEntry onStart={(g) => adopt(g)} />
        ) : (
          <Landing onEnter={() => setEntered(true)} />
        )}
      </Shell>
    );

  const timer = <Timer s={s} onLeave={leaveDevice} />;
  const body = (() => {
    switch (s.phase) {
      case "r1":
        return <Round1 s={s} update={update} />;
      case "r1done":
        return (
          <Center
            kicker="Round one complete"
            title={<>Your crew has reached the Grand Line.</>}
            action="Continue"
            onAction={() => update((g) => ({ ...g, phase: "r2intro" }))}
          />
        );
      case "r2intro":
        return (
          <Center
            kicker="The Grand Line &middot; Round two"
            title="The hunt begins."
            sub="Nine fragments. Two hints. Spend them wisely."
            action="Reveal clue"
            onAction={() => update((g) => ({ ...g, phase: "r2" }))}
          />
        );
      case "r2":
        return <Round2 s={s} update={update} />;
      case "final":
        return <Final s={s} update={update} />;
      case "complete":
        return <Complete s={s} onLeave={leaveDevice} />;
      default:
        return null;
    }
  })();
  return <Shell timer={s.phase === "complete" ? undefined : timer}>{body}</Shell>;
}
