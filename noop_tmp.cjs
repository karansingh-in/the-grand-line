const fs = require("fs");
const p = "src/components/Game.tsx";
let t = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
function rep(a, b) {
  if (!t.includes(a)) { console.error("MISSING: " + JSON.stringify(a.slice(0, 70))); process.exit(1); }
  t = t.split(a).join(b);
}
rep("  const hintKey = hintKeyForStop(stopId);\n  const revealedHint = s.revealedHints[hintKey];\n\n  const spendStopHint = () => {\n    const { next, ok } = spendHint(s, hintKey, getStopHint(stopId));\n    if (!ok) return;\n    update(() => ({ ...next, rev: next.rev }));\n  };", "  const spendStopHint = (level: 1 | 2) => {\n    const { next, ok } = spendHint(s, hintKeyForStop(stopId, level), getStopHint(stopId, level));\n    if (!ok) return;\n    update(() => ({ ...next, rev: next.rev }));\n  };");
rep("      <div className=\"mt-4\">\n        {revealedHint ? (", "XXX-NEVER-MATCH");
fs.writeFileSync(p, t);
