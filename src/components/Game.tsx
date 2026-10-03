import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  type GameState, loadState, saveState, resetState, newGame, elapsedSec, fmtTime,
  CATEGORY_LABEL, ROUND2_STEPS, FINAL_QUESTIONS, TOTAL_FRAGMENTS, normalizeTeamCode, withRev,
} from "@/lib/game";
import { fetchTeam, pushTeam, subscribeTeam } from "@/lib/sync";
import { Shell } from "@/components/GameShell";
import { Leaderboard } from "@/components/Leaderboard";

const btn = "w-full min-h-14 px-6 font-display text-sm uppercase bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] transition disabled:opacity-40";
const ghost = "w-full min-h-12 px-6 font-display text-xs uppercase border border-border text-muted-foreground hover:text-foreground hover:border-primary transition disabled:opacity-30";
const input = "w-full min-h-14 bg-transparent border-b-2 border-border focus:border-primary outline-none px-1 text-lg text-foreground";

export function Compass({ size = 220 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className="compass-spin text-primary opacity-30" aria-hidden>
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
      {Array.from({ length: 32 }).map((_, i) => (
        <line key={i} x1="100" y1="6" x2="100" y2={i % 4 === 0 ? 20 : 12} stroke="currentColor" strokeWidth="1" transform={`rotate(${i * 11.25} 100 100)`} />
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
    // Adopt newer remote state on reload (multi-device join).
    fetchTeam(local.teamCode).then((remote) => {
      if (remote && (remote.rev ?? 0) > (loadState()?.rev ?? 0)) {
        saveState(remote);
        setS(remote);
      }
    });
  }, []);

  // Subscribe to team channel for live sync across phones.
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
    <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b border-border bg-background/85 backdrop-blur">
      <div className="text-xs text-muted-foreground uppercase tracking-widest truncate">⚓ {s.teamName}</div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground tracking-[0.3em]">TIME</div>
          <div className="font-mono text-2xl text-primary tabular-nums">{fmtTime(elapsedSec(s))}</div>
        </div>
        <button
          onClick={onLeave}
          title="Leave this device (keeps team progress)"
          className="text-[10px] uppercase tracking-widest border border-border px-3 py-2 text-muted-foreground hover:text-foreground hover:border-primary transition"
        >
          Leave
        </button>
      </div>
    </div>
  );
}

function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"><Compass size={460} /></div>
      <p className="font-mono text-xs text-muted-foreground tracking-widest fade-up">N 0°00′ · W 0°00′</p>
      <h1 className="font-display text-primary text-lg mt-8 ink-reveal">THE GRAND LINE</h1>
      <h2 className="font-display text-5xl sm:text-7xl leading-tight mt-4 ink-reveal" style={{ animationDelay: "0.2s" }}>TECHNICAL<br />TREASURE HUNT</h2>
      <div className="mt-8 space-y-1 text-muted-foreground fade-up" style={{ animationDelay: "0.5s" }}>
        {["Navigate.", "Decode.", "Debug.", "Discover."].map((w) => <p key={w}>{w}</p>)}
      </div>
      <div className="mt-12 w-full max-w-xs fade-up" style={{ animationDelay: "0.8s" }}>
        <button className={btn} onClick={onEnter}>Enter the Grand Line</button>
      </div>
      <div className="mt-10 w-full max-w-sm fade-up" style={{ animationDelay: "1s" }}>
        <Leaderboard compact />
      </div>
    </div>
  );
}

function TeamEntry({ onStart }: { onStart: (existing: GameState) => void }) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "sailing">("idle");
  const [joinMsg, setJoinMsg] = useState("");

  if (status === "sailing") return (
    <div className="text-center ink-reveal">
      <h2 className="font-display text-3xl">YOUR JOURNEY BEGINS.</h2>
      <p className="mt-4 text-muted-foreground">{joinMsg || "The Grand Line awaits."}</p>
    </div>
  );

  return (
    <form className="fade-up space-y-8" onSubmit={async (e) => {
      e.preventDefault();
      if (!name.trim() || !id.trim() || status !== "idle") return;
      setStatus("checking");
      const code = normalizeTeamCode(id);
      // Multi-device join: if this crew code already exists, adopt its progress.
      const remote = await fetchTeam(code);
      if (remote) {
        setJoinMsg(`Welcome back, ${remote.teamName}. Syncing crew progress…`);
        setStatus("sailing");
        setTimeout(() => onStart(remote), 1200);
        return;
      }
      const fresh = newGame(name.trim(), id.trim());
      setJoinMsg("The Grand Line awaits.");
      setStatus("sailing");
      setTimeout(() => onStart(fresh), 1400);
    }}>
      <h2 className="font-display text-3xl text-center">ENTER YOUR CREW</h2>
      <label className="block"><span className="text-xs tracking-widest text-muted-foreground">TEAM NAME</span>
        <input className={input} value={name} onChange={(e) => setName(e.target.value)} required /></label>
      <label className="block"><span className="text-xs tracking-widest text-muted-foreground">TEAM ID / CREW CODE</span>
        <input className={input} value={id} onChange={(e) => setId(e.target.value)} required placeholder="e.g. STRAW-HATS-01" /></label>
      <p className="text-xs text-muted-foreground text-center">
        Teammates: enter the same crew code on your phones to sail together.
      </p>
      <button className={btn} disabled={status !== "idle"}>
        {status === "checking" ? "Finding your crew…" : "Set Sail"}
      </button>
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
    return { ...g, penaltySec: g.penaltySec + pen, r1Index: last ? g.r1Index : g.r1Index + 1, r1Wrong: 0, phase: last ? "r1done" : "r1" };
  };
  const penalty = () => setFlash((f) => f + 1);

  const choose = (opt: string) => {
    setWrongPick(null);
    if (opt === q.answer) return update((g) => next(g, 0));
    penalty();
    if (s.r1Wrong === 0) { setWrongPick(opt); update((g) => ({ ...g, penaltySec: g.penaltySec + 10, r1Wrong: 1 })); }
    else update((g) => next(g, 10));
  };
  const skip = () => { penalty(); setWrongPick(null); update((g) => ({ ...next(g, 10), r1Skips: g.r1Skips + 1 })); };

  return (
    <div key={s.r1Index} className="fade-up">
      <div className="flex justify-between text-xs tracking-widest text-muted-foreground">
        <span>ROUND 1 · {CATEGORY_LABEL[q.category]} · {q.diff.toUpperCase()}</span><span>{s.r1Index + 1} / {s.r1Questions.length}</span>
      </div>
      <div className="relative mt-6 border border-border bg-card p-5 sm:p-6">
        <h3 className="font-display text-xl">{q.title}</h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">{q.body}</p>
        {q.code && <pre className="mt-4 bg-ink text-parchment font-mono text-sm p-4 overflow-x-auto">{q.code}</pre>}
        {flash > 0 && <span key={flash} className="absolute top-3 right-3 font-mono text-accent text-lg ink-reveal">+10 SEC</span>}
      </div>
      <div className="grid grid-cols-1 gap-3 mt-6">
        {q.options.map((o) => (
          <button key={o} onClick={() => choose(o)} disabled={wrongPick === o}
            className={`min-h-14 border px-4 py-3 text-left font-mono text-sm transition active:scale-[0.99] ${wrongPick === o ? "border-destructive opacity-40" : "border-border bg-card hover:border-primary"}`}>
            <span className="mr-3 text-primary">▸</span>{o}
          </button>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button className={ghost} onClick={skip} disabled={s.r1Skips >= 2}>Skip (+10s) · {2 - s.r1Skips} left</button>
      </div>
      {s.r1Wrong === 1 && <p className="mt-3 text-center text-sm text-accent">One more attempt.</p>}
    </div>
  );
}

function Center({ kicker, title, sub, action, onAction }: { kicker?: string; title: ReactNode; sub?: string; action: string; onAction: () => void }) {
  return (
    <div className="text-center ink-reveal">
      {kicker && <p className="font-display text-primary text-sm">{kicker}</p>}
      <h2 className="font-display text-4xl sm:text-5xl mt-4 leading-tight">{title}</h2>
      {sub && <p className="mt-6 text-muted-foreground">{sub}</p>}
      <div className="mt-12 max-w-xs mx-auto"><button className={btn} onClick={onAction}>{action}</button></div>
    </div>
  );
}

function Fragments({ n }: { n: number }) {
  return (
    <div className="text-center">
      <p className="text-[10px] tracking-[0.3em] text-muted-foreground">TREASURE MAP · {n}/{TOTAL_FRAGMENTS}</p>
      <div className="mt-2 inline-grid grid-cols-9 gap-1.5">
        {Array.from({ length: TOTAL_FRAGMENTS }).map((_, i) => (
          <span key={i} className={`h-3 w-3 rotate-45 border ${i < n ? "bg-primary border-primary" : "border-border"}`} />
        ))}
      </div>
    </div>
  );
}

function Round2({ s, update }: { s: GameState; update: ReturnType<typeof useGame>["update"] }) {
  const step = ROUND2_STEPS[s.r2Index % ROUND2_STEPS.length]!;
  const [found, setFound] = useState(false);
  const [ans, setAns] = useState("");
  const [err, setErr] = useState(false);
  const isRiddle = step.kind === "riddle";

  const submit = () => {
    if (ans.trim().toLowerCase().replace(/\s+/g, " ") !== step.answer.toLowerCase()) { setErr(true); return; }
    setAns(""); setErr(false); setFound(false);
    update((g) => ({ ...g, r2Index: g.r2Index + 1 }));
  };

  return (
    <div key={s.r2Index} className="space-y-8">
      <Fragments n={s.fragments} />
      <article className="bg-parchment text-ink p-6 sm:p-8 ink-reveal shadow-2xl">
        <p className="text-[10px] tracking-[0.3em] opacity-60">SHIP LOG · ENTRY {s.r2Index + 1} · {step.kind.toUpperCase()}</p>
        <h3 className="font-display text-2xl mt-2">{step.title}</h3>
        <p className="mt-4 text-lg leading-relaxed">{step.body}</p>
        {step.code && <pre className="mt-4 bg-ink text-parchment font-mono text-sm p-4 overflow-x-auto">{step.code}</pre>}
        {step.hint && err && <p className="mt-3 text-sm italic opacity-70">Hint: {step.hint}</p>}
      </article>
      {isRiddle && !found ? (
        <button className={btn} onClick={() => setFound(true)}>I found the location</button>
      ) : (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <input className={input} placeholder={isRiddle ? "Code from the location / answer" : "Your answer"} value={ans} onChange={(e) => { setAns(e.target.value); setErr(false); }} />
          {err && <p className="text-sm text-accent">The compass disagrees. Try again.</p>}
          <button className={btn}>Submit</button>
        </form>
      )}
      <p className="text-center text-xs text-muted-foreground">Scan each QR fragment you find. Assemble the real ones to reveal the final map.</p>
    </div>
  );
}

function Final({ s, update }: { s: GameState; update: ReturnType<typeof useGame>["update"] }) {
  const q = FINAL_QUESTIONS[s.finalQ % FINAL_QUESTIONS.length]!;
  const [ans, setAns] = useState("");
  const [err, setErr] = useState(false);
  return (
    <form className="space-y-8 ink-reveal" onSubmit={(e) => {
      e.preventDefault();
      if (ans.trim().toLowerCase() !== q.a) return setErr(true);
      update((g) => ({ ...g, phase: "complete", endTs: Date.now() }));
    }}>
      <div className="text-center"><p className="font-display text-primary text-sm">FINAL CHALLENGE</p><h2 className="font-display text-5xl mt-3">THE ONE PIECE</h2></div>
      <p className="text-xl leading-relaxed text-center">{q.q}</p>
      <input className={input} value={ans} onChange={(e) => { setAns(e.target.value); setErr(false); }} placeholder="Your answer" />
      {err && <p className="text-sm text-accent text-center">Not yet, captain.</p>}
      <button className={btn}>Submit Final Answer</button>
    </form>
  );
}

function Complete({ s, onLeave }: { s: GameState; onLeave: () => void }) {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none gold-pulse"><Compass size={360} /></div>
      <h2 className="font-display text-4xl sm:text-6xl leading-tight ink-reveal">THE ONE PIECE<br />HAS BEEN FOUND.</h2>
      <p className="font-display text-primary mt-6 fade-up" style={{ animationDelay: "0.6s" }}>GRAND LINE CONQUERED.</p>
      <div className="my-10 w-48 h-px bg-primary/50" />
      <p className="text-xs tracking-[0.3em] text-muted-foreground">FINAL TIME</p>
      <p className="font-mono text-6xl text-primary tabular-nums mt-2 ink-reveal" style={{ animationDelay: "1s" }}>{fmtTime(elapsedSec(s))}</p>
      <p className="mt-2 text-xs text-muted-foreground">incl. {s.penaltySec}s penalties · {s.teamName} ({s.teamId})</p>
      <p className="mt-1 text-xs text-muted-foreground">Solved {s.r1Questions.length} trials · {s.fragments}/{TOTAL_FRAGMENTS} fragments · {s.r2Index} log entries</p>
      <div className="my-10 w-48 h-px bg-primary/50" />
      <div className="w-full max-w-sm"><Leaderboard /></div>
      <p className="mt-8 text-muted-foreground">THE JOURNEY IS COMPLETE.</p>
      <div className="mt-6 w-full max-w-xs">
        <button className={ghost} onClick={onLeave}>Leave this device</button>
        <p className="mt-2 text-[11px] text-muted-foreground">Clears only this phone. Crew progress stays synced.</p>
      </div>
    </div>
  );
}

export function Game() {
  const { s, ready, update, set, adopt } = useGame();
  const [entered, setEntered] = useState(false);
  const leaveDevice = () => {
    if (confirm("Leave this device? Your crew's progress stays saved.")) {
      set(null);
      setEntered(false);
    }
  };
  if (!ready) return <Shell><div /></Shell>;
  if (!s) return <Shell>{entered ? <TeamEntry onStart={(g) => adopt(g)} /> : <Landing onEnter={() => setEntered(true)} />}</Shell>;

  const timer = <Timer s={s} onLeave={leaveDevice} />;
  const body = (() => {
    switch (s.phase) {
      case "r1": return <Round1 s={s} update={update} />;
      case "r1done": return <Center kicker="ROUND ONE COMPLETE" title={<>YOUR CREW HAS REACHED<br />THE GRAND LINE.</>} action="Continue" onAction={() => update((g) => ({ ...g, phase: "r2intro" }))} />;
      case "r2intro": return <Center kicker="THE GRAND LINE · ROUND TWO" title="THE HUNT BEGINS." sub="Your first clue awaits." action="Reveal clue" onAction={() => update((g) => ({ ...g, phase: "r2" }))} />;
      case "r2": return <Round2 s={s} update={update} />;
      case "final": return <Final s={s} update={update} />;
      case "complete": return <Complete s={s} onLeave={leaveDevice} />;
      default: return null;
    }
  })();
  return <Shell timer={s.phase === "complete" ? undefined : timer}>{body}</Shell>;
}
