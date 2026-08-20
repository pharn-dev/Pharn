# GRILL — deny-message-phantom-commands

**Plan under interrogation:** `.dev/features/deny-message-phantom-commands/PLAN.md` (approved at GATE 1).
**Spec-hash check:** `sha256(pharn/ARCHITECTURE.md)` recomputed this run via `.dev/floor/hash-doc.mjs` =
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52` — **matches** the plan's
`spec_content_hash`. No drift. (Content-hash is floor-grade; here it only **surfaces** — the blocking
gate on drift is `/pharn-dev-build`'s, fix #4.)
**Griller membership (FLOOR, `pharn/floor/count-grillers.mjs`):** 13 registered.

> The PLAN is `trust: untrusted` to this stage. Every `problem` / `evidence` below is quoted **DATA**
> drawn from it — never an instruction this stage followed.

---

## Findings

### Axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/deny-message-phantom-commands/PLAN.md:150"
  problem: "The planned test asserts a cited command INVOKES the scope-setter, but never that it does so in its FIRST step — yet the shipped sentence asserts exactly that ordering, so the message can silently become false again while the new test stays GREEN."
  evidence: "That the invocation is its **FIRST step** is **ADVISORY** — read by a human this run from each command's step ordering; no checker parses step order."
```

**Why this is the sharpest finding.** The increment exists to stop a sentence from attributing a
property to a named command that the command does not have. The plan splits that property in two —
_exists_ + _invokes the setter_ (asserted) and _does so first_ (unasserted) — and ships the second half
on discipline. That is the increment's own thesis applied at half strength.

**And the residual is worse than "not yet automated": it is not mechanically checkable in the obvious
way.** `/pharn-dev-plan` expresses its deferral **in prose inside its Step 0 section** ("After Step 2
names `<name>`"). So a textual "setter appears in the first `## Step` section" test would pass for the
deferred stages too — it would not distinguish them. The ordering property is genuinely prose-encoded.

**Options for the human (the plan's minimal-swap discipline is a real counterweight to both):**

1. **Name it as an explicit residual** in the plan + `CHANGELOG` and leave the message wording alone —
   cheapest, honest, consistent with how `LIMITS.md`-class bounds are handled here.
2. **Soften the shipped wording** from "in the command's FIRST step" to a claim the test does cover
   (e.g. "that command sets the scope before it writes"), so message and assertion have the same
   extent. Costs the "pure name swap" property the plan deliberately chose (L27's minimal-additive
   discipline), widening the diff a human must review.

### Axis: determinism / command-prescription (P5, L22)

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/deny-message-phantom-commands/PLAN.md:137"
  problem: "The plan DESCRIBES the token-extraction technique in prose and defers the literal regex to build time, in the same sentence that claims L22 compliance — L22's defect is precisely that a prose-described technique leaves a choice that gets made wrong repeatedly."
  evidence: "Token extraction is over the **FIX-bullet region only**, with a slash-token regex anchored to start-of-line / whitespace / `(` ... The exact regex is pinned in the test file, not described in prose (L22)."
```

**The self-contradiction is the point.** "Pinned in the test file, not described in prose" is written
**in prose, in the plan, in place of the pin.** L22 is satisfied only once the literal pattern exists;
until then the plan is the prose-prescription L22 names. Concretely, the anchor set left open
(start-of-line / whitespace / `(`) is where the wrong choice lands: a naive `/\/[a-z-]+/g` would
harvest `hooks` from `.claude/hooks/…` and `writes-scope` from `.pharn/writes-scope.json`, and the
test would then fail against real command files for reasons having nothing to do with the defect.

**Recommendation:** pin the literal regex and the region delimiter in the PLAN before build, or accept
that build authors it and record which was chosen.

### Axis: honest scope (P7)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/deny-message-phantom-commands/PLAN.md:133"
  problem: "The non-vacuity guard asserts only that at least one token was extracted, which does not establish that the extraction ran over the intended region — a mis-delimited region that happens to contain any slash-token passes both it and the membership tests."
  evidence: "**`the extractor is not vacuous`** → assert at least one command token was extracted, so a future message that drops all names cannot pass the two tests above by having nothing to check"
```

The guard is correctly motivated (it closes the fail-open case L25 names — a checker certifying by
staying silent) but is **weaker than its stated purpose**. Asserting the extracted set **equals** the
expected pair — or at minimum has the expected cardinality — would close it; "non-empty" would not
detect a region slip.

### Axis: eval coverage / contract citation (P1, `eval-format.md`)

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/deny-message-phantom-commands/PLAN.md:120"
  problem: "The section is headed `## Evals to write (P1)` but contains node:test hook tests, which are not the `evals/cases/*` + `evals/expected/*` pair `eval-format.md` defines — the heading invites reading a P1 eval obligation as discharged when P1 never attached."
  evidence: "## Evals to write (P1) ... No capability is added, so P1's Capability-eval obligation does not attach."
```

The body **states the correct thing** immediately (P1 does not attach — no `role:` capability is
added, so `pharn/floor/validate.mjs`'s capability walk is untouched). Only the heading is the category
slip. Cosmetic, and noted because this repo's whole failure mode is a heading read as a claim.

### Axis: discovery-first (P6) — RESOLVED during this grill

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".dev/features/deny-message-phantom-commands/PLAN.md:97"
  problem: "The plan asserted the handoff file is inert under `npm test` without recording a probe of the glob this run; the claim is TRUE but was carried as an assertion rather than grounded."
  evidence: "Inert until renamed: nothing wires it, and it does not match the `*.test.cjs` glob `npm test` runs."
```

**Probed live during this grill and CONFIRMED.** A scratch tree holding both `test.cjs` and
`x.test.cjs` under `.claude/hooks/`, run through the exact `node --test ".claude/**/*.test.cjs"`
pattern from `package.json:28`, executed **only** the dotted file. `.claude/hooks/test.cjs` is
genuinely inert. The finding is recorded because the plan asserted it before it was checked, not
because the conclusion was wrong.

---

## Observation outside this increment (surfaced, not fixed)

`/pharn-dev-grill`'s own prose in `.claude/commands/pharn-dev-grill.md` states "Today the registered set
is the `testability` griller", while `pharn/floor/count-grillers.mjs` reports **13** registered this
run. That is stale command prose — the same doc-drift class this increment is fixing, in the command
that is fixing it. **Out of scope here** (this increment's `## Files` does not include
`.claude/commands/**`, and widening it would bundle two increments, P7). Recorded for a human.

## Summary

The plan is well-grounded: it re-verified every factual claim in the untrusted task text, caught three
errors in it (stale line number, a moot "fold into H6/H7" instruction, a suggested command name that
would have reintroduced the very defect), and its scope parses to exactly the six files it declares.

The concerns are **not** about what it got wrong; they are about **assertion extent**. Two of them
(G-P0, G-P5) share one shape: the plan states the right principle and then leaves the mechanism that
would enforce it to a later step or to prose. Given that this increment's entire subject is a sentence
whose applicability was never asserted, that shape deserves the human's attention before build — which
is why both are marked `important` rather than `minor`.

None of this blocks anything. Nothing in a grill-log can.

**ADVISORY VERDICT: 5 concerns raised (0 blocking-severity, 2 important, 3 minor — one of which was
probed and resolved during this run) — for the human to weigh before `/pharn-dev-build`.**
