import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  type GameState,
  loadState,
  saveState,
  resetState,
  newGame,
  elapsedSec,
  fmtTime,
  HUNT_STOPS,
  getStopById,
  getStopHint,
  hintKeyForStop,
  FINAL_QUESTIONS,
  normalizeTeamCode,
  withRev,
  spendHint,
  type TechId,
} from "@/lib/game";
import { fetchTeam, pushTeam, subscribeTeam } from "@/lib/sync";
import { Shell } from "@/components/GameShell";
import { Leaderboard } from "@/components/Leaderboard";
import { TechMark } from "@/components/TechMark";
import {
  Kicker,
  Title,
  Lede,
  PrimaryButton,
  GhostButton,
  Card,
  ChapterHead,
  ChartRule,
  OptionRow,
  VerseCard,
  ConfirmButton,
  Progress,
  HintPips,
} from "@/components/ui";

export function Compass({ size = 220 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className="compass-drift text-primary opacity-20"
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
            Elapsed
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

const TEASER: TechId[] = ["docker", "kubernetes", "python", "react"];

function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2">
        <Compass size={400} />
      </div>
      <div className="relative w-full">
        <Kicker>Organized by SHAIDS &middot; est. 2026</Kicker>
        <p className="mt-8 font-display text-[13px] uppercase tracking-[0.4em] text-primary">
          Hack the Hunt
        </p>
        <h1 className="mt-5 font-display text-[52px] leading-[1.0] sm:text-6xl">
          Hack
          <br />
          the
          <br />
          Hunt
        </h1>
        <div className="mx-auto mt-8 flex max-w-[300px] items-center justify-center gap-3">
          {TEASER.map((t) => (
            <span
              key={t}
              className="flex h-14 w-14 items-center justify-center bg-parchment shadow-xl"
            >
              <TechMark id={t} size={34} />
            </span>
          ))}
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Know your vessels
        </p>
        <ChartRule className="mx-auto mt-8 max-w-[220px]" />
        <div className="mt-8 space-y-1.5 text-[15px] text-muted-foreground">
          <p>Ten trials of craft. Seven shores on foot.</p>
          <p>One crew, one clock, two lifelines.</p>
        </div>
        <div className="mx-auto mt-12 w-full max-w-[280px]">
          <PrimaryButton onClick={onEnter}>Enter the Hunt</PrimaryButton>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Best with your crew beside you
          </p>
        </div>
        <div className="mx-auto mt-14 w-full max-w-sm text-left">
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
        <Kicker className="text-primary">Setting sail</Kicker>
        <Title className="mt-4">
          Your journey
          <br />
          begins.
        </Title>
        <Lede className="mx-auto mt-6 max-w-[280px]">{joinMsg || "The hunt awaits."}</Lede>
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
        setJoinMsg("The hunt awaits.");
        setStatus("sailing");
        setTimeout(() => onStart(fresh), 1400);
      }}
    >
      <div className="text-center">
        <ChapterHead kicker="Crew manifest" numeral="No. 0" title={<>Enter your crew</>} />
        <Lede className="mx-auto mt-6 max-w-[300px]">
          One crew code per team. Teammates enter the same code on their phones to sail the same
          waters.
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

function Specimen({
  techId,
  index,
  total,
  diff,
  flash,
}: {
  techId: TechId;
  index: number;
  total: number;
  diff: string;
  flash: number;
}) {
  return (
    <figure className="mx-auto w-full max-w-[300px]">
      <div className="chart-corners relative flex h-64 items-center justify-center bg-parchment shadow-2xl">
        <TechMark id={techId} size={148} />
        {flash > 0 && (
          <span key={flash} className="absolute right-4 top-4 font-mono text-sm text-accent">
            +10s
          </span>
        )}
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between border-b border-border pb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Exhibit Nº {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
          {diff}
        </span>
      </figcaption>
    </figure>
  );
}

function Round1({ s, update }: { s: GameState; update: ReturnType<typeof useGame>["update"] }) {
  const [flash, setFlash] = useState(0);
  const [wrongPick, setWrongPick] = useState<string | null>(null);
  const [rightPick, setRightPick] = useState<string | null>(null);
  const q = s.r1Questions[s.r1Index]!;

  useEffect(() => {
    const id = setInterval(() => {
      if (s.startTs && Date.now() - s.startTs > 600_000) update((g) => ({ ...g, phase: "r1done" }));
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.startTs]);

  useEffect(() => {
    setWrongPick(null);
    setRightPick(null);
  }, [s.r1Index]);

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
    if (rightPick) return;
    if (opt === q.answer) {
      setRightPick(opt);
      setWrongPick(null);
      setTimeout(() => {
        setRightPick(null);
        update((g) => next(g, 0));
      }, 450);
      return;
    }
    penalty();
    if (s.r1Wrong === 0) {
      setWrongPick(opt);
      update((g) => ({ ...g, penaltySec: g.penaltySec + 10, r1Wrong: 1 }));
    } else {
      update((g) => next(g, 10));
    }
  };
  const skip = () => {
    penalty();
    setWrongPick(null);
    setRightPick(null);
    update((g) => ({ ...next(g, 10), r1Skips: g.r1Skips + 1 }));
  };

  const stateOf = (o: string): "idle" | "wrong" | "right" | "dim" => {
    if (rightPick) return o === rightPick ? "right" : "dim";
    if (wrongPick === o) return "wrong";
    return "idle";
  };

  return (
    <div key={s.r1Index} className="mx-auto w-full max-w-[400px] py-4">
      <ChapterHead
        kicker="Chapter one &middot; name the mark"
        numeral={`${s.r1Index + 1} / ${s.r1Questions.length}`}
        title={<>Which tool bears this mark?</>}
      />
      <div className="mt-4">
        <Progress value={s.r1Index} max={s.r1Questions.length} />
      </div>

      <div className="py-8">
        <Specimen
          techId={q.techId}
          index={s.r1Index}
          total={s.r1Questions.length}
          diff={q.diff}
          flash={flash}
        />
      </div>

      <div className="space-y-3">
        {q.options.map((o, i) => (
          <div key={o} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <OptionRow
              index={i}
              state={stateOf(o)}
              disabled={stateOf(o) !== "idle"}
              onClick={() => choose(o)}
            >
              {o}
            </OptionRow>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <GhostButton onClick={skip} disabled={s.r1Skips >= 2 || !!rightPick}>
          Abandon trial +10s &middot; {2 - s.r1Skips} pardons left
        </GhostButton>
        {s.r1Wrong === 1 && !rightPick && (
          <p className="mt-4 text-center text-sm text-accent">
            Not that one. A single attempt remains.
          </p>
        )}
        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Every error and pardon costs the crew ten seconds
        </p>
      </div>
    </div>
  );
}

function Center({
  kicker,
  numeral,
  title,
  sub,
  action,
  onAction,
}: {
  kicker?: string;
  numeral?: string;
  title: ReactNode;
  sub?: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="mx-auto max-w-[340px] py-14 text-center">
      {kicker && <Kicker className="text-primary">{kicker}</Kicker>}
      <h2 className="mt-4 font-display text-4xl leading-[1.1] sm:text-5xl">{title}</h2>
      {numeral && (
        <p className="mt-3 font-display text-sm tracking-[0.3em] text-primary">{numeral}</p>
      )}
      {sub && <Lede className="mx-auto mt-6 max-w-[300px]">{sub}</Lede>}
      <ChartRule className="mx-auto mt-8 max-w-[200px]" />
      <div className="mt-8">
        <PrimaryButton onClick={onAction}>{action}</PrimaryButton>
      </div>
    </div>
  );
}

function Round2({ s, update }: { s: GameState; update: ReturnType<typeof useGame>["update"] }) {
  const stopId = s.r2Order[0]!;
  const stop = getStopById(stopId);
  const verseIdx = Math.min(2, Math.max(0, s.r2Verses[String(stopId)] ?? 0));
  const hintKey = hintKeyForStop(stopId);
  const revealedHint = s.revealedHints[hintKey];

  const spendStopHint = () => {
    const { next, ok } = spendHint(s, hintKey, getStopHint(stopId));
    if (!ok) return;
    update(() => ({ ...next, rev: next.rev }));
  };

  const goFinal = () => {
    update((g) => {
      const cur = g.r2Order[0]!;
      return {
        ...g,
        r2Found: g.r2Found.includes(cur) ? g.r2Found : [...g.r2Found, cur],
        phase: "final",
      };
    });
  };

  return (
    <div key={stopId} className="mx-auto w-full max-w-[400px] py-4">
      <ChapterHead
        kicker="Chapter two &middot; the walking chart"
        numeral="I / I"
        title={<>{stop.title}</>}
      />

      <div className="mt-5">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          One shore stands between you and the final
        </p>
      </div>

      <div className="mt-6">
        <VerseCard index={verseIdx + 1} total={3} fresh>
          {stop.riddles[verseIdx]!}
        </VerseCard>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          The only verse your crew was dealt — make it count
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-y border-border py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Chart notes
        </span>
        <HintPips left={s.hintsLeft} />
      </div>

      <div className="mt-4">
        {revealedHint ? (
          <Card className="border-primary/50 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              Chart note &middot; spent
            </p>
            <p className="mt-2 text-[15px] leading-7">{revealedHint}</p>
          </Card>
        ) : (
          <ConfirmButton
            confirmLabel={s.hintsLeft > 0 ? "Tap again to spend 1 note — sure?" : "No notes left"}
            onConfirm={spendStopHint}
            disabled={s.hintsLeft <= 0}
          >
            Spend a chart note ({s.hintsLeft} of 2 left)
          </ConfirmButton>
        )}
      </div>

      <ChartRule className="mx-auto mt-10 max-w-[240px]" />

      <div className="mt-8">
        <p className="text-center text-sm leading-6 text-muted-foreground">
          Stand on the shore. Breathe. Then head to the final round.
        </p>
        <div className="mt-4">
          <ConfirmButton
            variant="primary"
            confirmLabel="Tap again — to the final?"
            onConfirm={goFinal}
          >
            Head to the final round
          </ConfirmButton>
        </div>
      </div>
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
      <Kicker className="text-primary">Final reckoning</Kicker>
      <Title className="mt-4">
        The Final
        <br />
        Flag
      </Title>
      <ChartRule className="mx-auto mt-8 max-w-[200px]" />
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
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2">
        <Compass size={320} />
      </div>
      <div className="relative w-full max-w-[360px]">
        <Kicker className="text-primary">Hunt complete</Kicker>
        <Title className="mt-4">
          The flag
          <br />
          is yours.
        </Title>
        <ChartRule className="mx-auto mt-8 max-w-[220px]" />
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
          Named {s.r1Questions.length} marks &middot;{" "}
          {s.r2Found.length > 0 ? `${getStopById(s.r2Found[0]!).title} claimed` : "shore unclaimed"}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {HUNT_STOPS.map((st) => (
            <span
              key={st.id}
              title={st.title}
              className={`h-2.5 w-2.5 rotate-45 border ${s.r2Found.includes(st.id) ? "bg-primary border-primary" : "border-border"}`}
            />
          ))}
        </div>
        <ChartRule className="mx-auto mt-8 max-w-[220px]" />
        <div className="mt-8 w-full text-left">
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
            kicker="Chapter one complete"
            numeral="I / II"
            title={
              <>
                Your crew is in.
                <br />
                The hunt is on.
              </>
            }
            sub="One shore ahead, one verse. Walk it, then face the final."
            action="Begin the walk"
            onAction={() => update((g) => ({ ...g, phase: "r2intro" }))}
          />
        );
      case "r2intro":
        return (
          <Center
            kicker="Chapter two &middot; the walking chart"
            numeral="II / II"
            title={
              <>
                Seven shores.
                <br />
                One verse.
              </>
            }
            sub="Your crew is dealt a single shore and a single verse. Read it, walk it, then head straight to the final."
            action="Unroll the verse"
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
