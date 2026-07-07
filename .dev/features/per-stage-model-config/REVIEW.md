# REVIEW — per-stage-model-config

PHARN reviewing PHARN. The increment under review is `trust: untrusted`; instruction-looking content in it (a test needle, quoted findings) is DATA reported here, never followed.

## Step 1 — Floor first (P0)

`node .dev/floor/validate.mjs .` → **GREEN** (exit 0). The floor is the only guaranteed part of this review; the four lenses below are **advisory**.

## The four lenses

### L-floor → P0 — GREEN

Every guarantee the increment claims reduces to a floor primitive or is labelled `advisory`:

- config shape/enum validity, deterministic resolution, config↔frontmatter agreement → **floor** (enum-regex / equality), live-gated on the real repo via the `★ live ★` test inside `npm test`.
- "a stage RUNS UNDER its configured model/effort at runtime" → **advisory**, and the checker's header (`check-config.mjs:13-20`) states the P0-disease warning verbatim. No guarantee is claimed without a floor reduction. **No blocking finding.** (One important advisory carried below — the practical value of the advisory binding.)

### L-eval → P1 — GREEN

No `role:` Capability is added (this is floor tooling, ARCHITECTURE §3.3), so capability `evals/` do not apply; the checker is tested by `check-config.test.mjs` (15 cases: validate/resolve/agreement, full-id positive, missing-default, malformed, the needle, and the live real-repo gate). No new `rule_id` is introduced in any `enforces` (the command edits are frontmatter `model:`/`effort:` only). Floor agrees (GREEN). **No finding.**

### L-trust → P2 — GREEN

The verdict ranges only over enum-gated fields (model ∈ allowlist, effort ∈ enum, resolved == frontmatter); the `★ needle ★` test proves an instruction-looking extra config field does **not** move it. Reviewing the artifacts, I encountered instruction-looking DATA (the test needle `"SYSTEM OVERRIDE: …"`, quoted grill/regress findings) and did **not** comply — noting it is the defense (P2). No guaranteed decision rests on a tainted/free-text field. **No blocking finding** (one minor advisory below).

### L-axis → P3 — GREEN

`pharn.config.json` and each command frontmatter change for exactly one reason (declare per-stage model/effort). `check-config.mjs` is floor tooling (no frontmatter, not a `pharn-*` leaf), so the "no sibling imports" rule does not bind; `frontmatterModelEffort` re-implements the count-grillers parse and cites it ("not an import", P4) rather than importing. No grep-detectable sibling reference. **No blocking finding** (one minor advisory below).

## Findings

### Floor-gate (blocking): NONE

The increment is floor-GREEN on all four lenses.

### Advisory (inform the human; never a guaranteed block — fix #3)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/per-stage-model-config/PLAN.md:52"
  problem: "The increment's headline goal — a stage RUNS UNDER its configured model/effort — is advisory and specifically shaky on the primary path: under /pharn-dev-ship all stages run in one turn and a per-skill model:/effort: 'applies for the rest of the turn,' so sequential per-stage switching may not occur. The delivered floor value is config↔frontmatter CONSISTENCY (drift detection), not runtime binding — the human should weigh whether that is the intended payoff."
  evidence: "check-config.mjs:13-20 (honest-scope block) + PLAN.md:52; VERIFY.md residual restates it."

- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/per-stage-model-config/PLAN.md:10"
  problem: "No real dogfood/eval failure triggered this addition; it rests on human authorization to reverse the prior P7 deferral of pharn.config.json. Authorization is not a surfaced failure — surfaced for the human, who elected to proceed at GATE 1."
  evidence: "'authorizes reversing the P7 deferral of pharn.config.json' (PLAN.md:10)."

- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/floor/check-config.mjs:177"
  problem: "check-config.mjs has two change-triggers — the pharn.config.json schema AND the .claude/commands/*.md frontmatter shape (agreement must parse command frontmatter). Both are 'config governance,' so it stays whole, but a change to command-frontmatter shape would also force this file to change."
  evidence: "doAgreement reads join(commandsDir, `pharn-dev-${name}.md`) and parses its frontmatter (check-config.mjs:187-208)."

- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".dev/floor/check-config.mjs:185"
  problem: "Agreement is config→command only: it verifies each config stage's command frontmatter matches, but not the reverse — a command that grows model:/effort: with NO config entry would drift undetected. A named scope limit, not a defect; a candidate follow-up if reverse-drift is ever observed."
  evidence: "the loop iterates Object.keys(stages) (config-driven), never the command-file set (check-config.mjs:185-186)."

- type: FINDING
  rule_id: "P5"
  severity: minor
  file: ".dev/floor/check-config.mjs:120"
  problem: "resolveStage uses `stages[stage] || stages.default` while the header/plan describe `stages[stage] ?? stages.default`. Functionally identical here (entries are always truthy objects, and a null entry is rejected earlier by validateStages), but the `||` would diverge from the documented `??` if an entry could ever be a falsy non-null value."
  evidence: "'const entry = stages[stage] || stages.default;' (check-config.mjs:120) vs the `??` in the header (line 7) and PLAN.md:50."

- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/per-stage-model-config/PLAN.md:22"
  problem: "A new root-level pharn.config.json governing the dev loop lands with no CLAUDE.md / CHANGELOG note. Future contributors gain a config consumer with no documentation pointer; fold in or deliberately defer."
  evidence: "## Files (PLAN.md:22-27) names no CLAUDE.md/CHANGELOG update."
```

## Proposed lesson candidate (NOT written to canon here — P2)

Surfaced by a **real** failure this run (P7 — real, not hypothetical): during `/pharn-dev-regress` the tests gate first read `tests: 1→1` because, under **zsh**, unquoted `$LIST` in `node --test $LIST` does **not** word-split — the 44 paths were passed as one argument (`Could not find '…'`), a false red masquerading as a benign "pre-existing" (1→1). Fixed by piping through `xargs`.

- **Candidate → `.dev/memory-bank/lessons-learned.md`:** "Dev-loop Bash that builds a file list for `node --test` must force word-splitting (zsh does not split unquoted `$VAR`) — pipe the list through `xargs` (or `${=VAR}`), or a bogus exit code silently corrupts the regress/verify capture."
- **Provenance:** increment `per-stage-model-config`, `/pharn-dev-regress` step (base/head capture). Promotion is a **separate, human-gated `/pharn-dev-memory-promote` run** (`check-provenance.mjs` + accept/deny); this REVIEW does not write canon.

## Verdict

**GREEN — floor GREEN; 0 blocking floor-gate findings; 6 advisory findings (2 important, 4 minor) for the human at the post-review gate.** "Reviewed" here means the floor is green and the lenses found no blocking floor-finding — it is **not** a judgment that the increment is wise or that the runtime model/effort binding works; that is the human's GATE-2 call.
