# GRILL — format-step-scope

Plan under interrogation: `.dev/features/format-step-scope/PLAN.md` (`trust: untrusted` DATA).
**Spec-hash check (content-hash primitive, surfaced not blocking):** recomputed
`sha256(pharn/ARCHITECTURE.md)` **MATCHES** the plan's pin
(`a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753`). No drift.

**Griller membership (FLOOR — `pharn/floor/count-grillers.mjs`, frontmatter only):** `{"registered":13}`.
**Deterministic plan scanners:** `secrets` `{"found":false}` · `pii` `{"found":false}` · `i18n`
`{"found":false}` · `migrations` `{"mentions":false}` · `observability` `{"mentions":false}` — all exit 0.

**Injection check:** no instruction-looking content in the PLAN was directed at this griller.

---

## Findings (advisory — grouped by axis)

### Axis: determinism (P5) — the plan collides with itself

```yaml
- type: FINDING # enum-gated (floor-verifiable, TRUSTED — this griller's own assertion)
  rule_id: "P5"
  severity: important
  file: ".dev/features/format-step-scope/PLAN.md:30"
  problem: "The guard test and the Step-2b rewrite are specified to contradict each other — the test forbids the string `npm run format` in any command file, while the same plan requires Step 2b to KEEP that string as a struck-through explanation."
  evidence: "PLAN.md:30 — the guard 'asserts **no** `.claude/commands/*.md` prescribes a repo-wide formatter/linter **write** (`npm run format`, …)'. PLAN.md:21 — 'The old `npm run format` is named and struck so the reason survives.' Both cannot hold: the guard would RED on `pharn-dev-build.md` the moment it lands."
```

**This is the finding that must be resolved before the build, not during it.** As specified, the increment
cannot reach a green suite: either the guard fails on the file it exists to protect, or the historical
explanation is dropped and the _reason_ for the change is lost from the command — which is the thing L2 and
L12 both say to preserve. Three resolutions, all cheap; the plan must pick one explicitly rather than let
the builder improvise:

1. **Assert on prescription, not mention** — require the forbidden string to be absent only from **command
   lines** (a fenced ```bash block or a `- Run …` imperative), permitting a struck-through prose reference.
   Most faithful, slightly more parser.
2. **Keep the explanation but not the literal** — write the history as "the previous repo-wide invocation"
   without the exact token. Simplest; loses grep-ability of the old form.
3. **Exempt an explicitly marked region** — an HTML comment fence the guard skips, like the
   `TYPE-ENUM:BEGIN/END` precedent already in `pharn-dev-memory-promote.md`.

Recommended: **(3)** — it is the house pattern for exactly this problem (a doc that must quote a value a
checker also validates), and it keeps both the guard strict and the history intact.

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/format-step-scope/PLAN.md:21"
  problem: "Step 2b is specified to read `.pharn/writes-scope.json` with no stated behavior for the file being absent, stale, or holding a different stage's scope — and an unhandled `require` throw contradicts the step's 'never blocks' guarantee."
  evidence: "'format **exactly** the paths in `.pharn/writes-scope.json` (the deterministic list fix #7's Step-0 setter already produced)'. But `.pharn/` is gitignored runtime state that the operator may delete to reset to fail-closed, and this session repeatedly RE-SET that file mid-run (to PLAN.md and back) — after which it holds the last setter's target, not the build's."
```

The failure is quiet in the wrong direction: a stale scope file makes Step 2b format **the wrong file
set** — plausibly a single `PLAN.md` — while reporting nothing unusual, so the build's real outputs go
unformatted and the miss surfaces at verify as before. Needs an explicit contract: what the step does when
the file is missing (skip with a printed note is defensible; a throw is not, given "never blocks"), and
ideally a cheap sanity check that the scope's `set_by` matches the plan being built.

### Axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/format-step-scope/PLAN.md:26"
  problem: "Running prettier over `regression-report.json` and `verify-report.json` breaks the 'verbatim' contract those artifacts are specified to satisfy."
  evidence: "PLAN.md:26 adds the format step 'over **both** its artifacts (`REGRESSION.md` + `regression-report.json`)'. But `/pharn-dev-regress` Step 4 requires that file to be 'the helper's `verdict` JSON **verbatim**', and `/pharn-dev-verify` likewise emits the checker's stdout verbatim plus the verifiers block. A formatter that rewrites bytes makes 'verbatim' false."
```

Today this is latent rather than active — the helpers happen to emit two-space-indented JSON that prettier
leaves unchanged (observed this session: `regression-report.json … (unchanged)`). That is **luck, not
contract**: any future helper whose output differs in spacing would be silently reformatted, and the word
"verbatim" would then be wrong in two command files at once. Either exclude the `.json` machine reports
from the format step (they are generated, not authored — the same reasoning that exempts
`docs/lessons-index.md` from the style gates), or drop "verbatim" from those commands. **Excluding them is
the better fix**: a machine report's value is that it is exactly what the checker said.

### Axis: honest scope / no speculation (P7)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/format-step-scope/PLAN.md:30"
  problem: "The guard's second assertion — that every artifact-writing stage 'names `prettier` at all' — is a presence check over prose, the same launderable shape the error-handling griller explicitly rejects as a floor candidate."
  evidence: "'and that every artifact-writing stage names `prettier` at all'. A stage could satisfy it with a comment mentioning prettier while prescribing nothing, exactly as an injected `<!-- error-handling: covered -->` would satisfy a keyword scan."
```

The **negative** assertion (no repo-wide write) is sound — a forbidden literal is not launderable by
accident. The **positive** one is much weaker and buys little: it cannot distinguish a real step from a
mention. Either drop it, or tighten it to require the scoped invocation form the increment is standardizing.

### Axis: one axis of change (P3)

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/format-step-scope/PLAN.md:30"
  problem: "A test with no corresponding checker is placed in `.dev/floor/`, whose established contents are floor checkers and their tests."
  evidence: "`.dev/floor/command-hygiene.test.mjs` — NEW. Every other `*.test.mjs` in that directory pairs with a `.mjs` checker (`check-provenance`, `check-config`, `scan-plan-*`, `lessons-index-*`); this one tests command PROSE and has no checker."
```

Genuinely marginal, and the plan's reasoning for a new file (not overloading
`lessons-index-core.test.mjs`, which was flagged twice for exactly that) is **correct** — this only
questions the directory, not the split. Worth a sentence in the file header saying why it lives there, so
the next reader does not go looking for `command-hygiene.mjs`.

### Axes with no findings (stated, not silently omitted)

- **Trust (P2) — clean, and the plan earns a positive note.** It identifies that narrowing the formatter's
  scope is a **containment improvement** (a build's formatter stops touching every file in the repo), and
  names the new residual honestly (the step now trusts `.pharn/writes-scope.json`, adding a consumer to a
  Bash-written file). No new untrusted ingestion; the guard's verdict is a regex over bytes.
- **Eval coverage (P1) — no binding to check**, and the plan commits to **measuring the guard failing**
  before trusting it (L4), which is the discipline that separates a real guard from an authored one.
- **The L16 handling is exemplary and worth naming.** The plan does not merely cite L16 — it found a
  _live_ instance of it inside its own remedy (GNU vs BSD `xargs` on empty input, where the GNU branch would
  invoke `markdownlint-cli2` bare and re-create the whole-repo write the increment exists to remove) and
  closed it with a construct that depends on **neither** dialect. That is the lesson doing real work rather
  than being cited.
- **a11y / i18n / migrations / observability / performance / privacy / security / comprehension /
  documentation / coupling — no findings.** Four floor-scanned clean above; the rest do not bind a change to
  command prose and one test file — no user surface, no schema, no runtime path, no personal data.

---

## Summary

The plan is strong where it matters: it correctly argues that the narrow fix would **regress** the pipeline
(plan/grill artifacts lose their incidental formatting), it verified every formatter mechanic live before
writing it into a command rather than trusting documentation, and it refuses to claim the Bash-write class
is closed when only one instance is removed.

Its problems are concentrated in the **guard test's specification**, which was designed last and least: it
collides with the Step-2b rewrite it is meant to protect (F1 — the increment cannot go green as specified),
and its second assertion is a launderable presence check (F3). One further contract conflict sits outside
the guard: formatting the machine JSON reports contradicts the "verbatim" wording in two commands (F2's
sibling above), latent today only because the helpers' output happens to match prettier's.

None of these is hard to fix, and all four are cheaper to settle **now**, in the plan, than to improvise
mid-build.

---

**ADVISORY VERDICT: 5 concerns raised (0 blocking-severity, 3 important, 2 minor) — for the human to weigh
before `/pharn-dev-build`.**

This grill-log **gates nothing**. Every finding rests on this griller's judgment; the `severity` values are
advisory assignments (fix #3), and grillers as a class never gate. The only floor-grade results in this run
are the griller-membership count, the five `scan-plan-*` exits, and the spec-hash comparison — and even the
hash only _warns_ here. "Grilled" never means "the plan is sound" (P0).
