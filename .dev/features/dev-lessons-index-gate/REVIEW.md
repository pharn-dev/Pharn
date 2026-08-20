# REVIEW — dev-lessons-index-gate

**Step 1 — floor first (P0):** `node pharn/floor/validate.mjs .` → **GREEN**, 36 capabilities, exit `0`.
The increment was entitled to reach review. Everything below the floor line is **advisory**.

---

## Floor-gate findings (blocking)

**None.** No guarantee in this increment lacks a floor reduction or an `advisory` label; no eval binding
is missing (the floor agrees — see L-eval); no sibling reference was introduced.

---

## Advisory findings

### L-floor → P0

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".claude/commands/pharn-dev-plan.md:87"
  problem: "The RED branch instructs the agent to surface the checker's output 'at the Step-4 halt', but Step 4's halt enumerates exactly two numbered items — open questions and the approval form — and mentions neither the index verdict nor this obligation, so the instruction has no anchor at the site where it must be executed."
  evidence: "**surface the checker's output to the human at the Step-4 halt**. Then continue planning normally."
```

**This is L30's own shape reproduced inside the increment that exists to close L30's shape** — which is
why it is reported rather than waved through. The two halves differ in kind: the _detection_ is now
mechanized (a real invocation with an exit-code branch), but the _reporting_ obligation it creates is
prose in Step 1 addressed to a step that never acknowledges it. A step that names a duty and leaves the
discharging to a reader is the pattern L30 names; here it survives in the reporting half.

**It is `important`, not `blocking`, and the distinction is deliberate.** The safety-critical half — do
not select from a stale index, read canon in full — is anchored where it executes, in the branch itself.
Only the _tell the human_ half is orphaned, so the failure mode is a silent-but-safe plan rather than a
plan built on a stale index. **Remedy (one line, for the human to weigh at GATE 2):** add the index
verdict to Step 4's item 1, or fold it into the approval form's context.

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".claude/commands/pharn-dev-memory-promote.md:412"
  problem: "Step 6b's cost sentence says a skipped regeneration 'fails npm run docs:check', which is true, but docs:check is `&&`-chained with the capability-catalog checker running FIRST, so an unrelated catalog RED short-circuits before the lessons-index line is ever printed."
  evidence: "it leaves a `[DRIFT]` **RED that fails `npm run docs:check`, and therefore `npm run check`, for everyone** until someone regenerates."
```

The claim is accurate; the **diagnostic experience** is what is understated. A reader debugging a red
`docs:check` may not see the lessons-index finding at all on that run. `CLAUDE.md` already records the
short-circuit and its rationale, and the remedy is the same command either way
(`npm run docs:generate` regenerates all regions), so this is a note, not a defect.

### L-eval → P1

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/floor/command-hygiene.test.mjs:198"
  problem: "The wiring set asserts over the two PRODUCT commands as well as the two dev ones, so a future increment that deliberately changes the product's approach (say, retiring `--verdict`) will fail a test living under `.dev/`, where the tempting repair is to loosen the regex rather than to update the set deliberately."
  evidence: "{ file: \"pharn-plan.md\", role: \"checks the index before selecting\", re: /pharn\\/floor\\/check-lessons-index\\.mjs\\b[^\\n]*--verdict/ }"
```

This is **inherent to pinning**, not a defect introduced carelessly — and covering all four members is
precisely L29's requirement, so narrowing the set to the dev half would reintroduce the bug this
increment fixes. Recorded so the update path is deliberate: change the array, not the regexes.

**No P1 violation.** The increment adds **no** Capability and **no** `rule_id`, so P1's binding
requirement is not triggered — and the floor **agrees**: `validate.mjs` is GREEN over an unchanged 36
capabilities. The lens and the floor do not disagree, which is itself the thing this lens checks.

### L-trust → P2

**No finding, and the check was performed rather than assumed.** The new branch consumes **only** the
checker's exit code (an integer). The command prose explicitly bars the printed
`[MISSING|DRIFT|ENUM_ERROR]` token from the branch, confining it to the human-facing sentence, so no
guaranteed decision rests on any free-text or tainted field. Canon titles, `type` and `concepts` remain
advisory context selection, as the pre-existing prose already labels them.

**On instruction-looking content:** the reviewed artifacts (`PLAN.md`, `GRILL.md`, canon lesson bodies)
are dense with imperatives — _"run it, do not assume it"_, _"Read the branch from the exit code only"_.
These were read as **DATA describing the increment**, and none altered this review's procedure. Worth
stating plainly because this increment's own subject matter is instructions to an agent, which is
exactly the condition under which the distinction is easiest to lose.

### L-axis → P3

**No finding.** `/pharn-dev-plan` gains a discovery sub-step within its existing single axis (plan one
increment); it did not acquire a second reason to change. The `reads:` list grew from 8 entries to 9
with **no member dropped** — re-verified live against the file, since a declaration audit that silently
narrows a list is L3's shape.

**On the dev→product reference:** `.claude/commands/` sits outside the `pharn/pharn-*` layer tree that
P3 governs, and commands invoke floor checkers by design. The new test's reach from `.dev/floor/` into
product command prose is the **sanctioned** direction (`.dev/` → product), matching the rule `CLAUDE.md`
records for the `lessons-index-core` copy-pair, and it introduces no new crossing —
`command-hygiene.test.mjs` already enumerated every command file.

---

## Proposed lesson candidate (NOT written to canon — `/pharn-dev-memory-promote` owns that)

**Candidate A — a deliberate copy-pair creates an obligation set that nothing ranges over, and the
second copy is where the obligation gets dropped.**

**Lesson (draft).** This repo maintains several deliberate dev/product copy-pairs
(`check-provenance.mjs`, `lessons-index-core.mjs`, and the four lessons-index wiring sites). Where a
pair's _code_ is pinned to agree by `✧` tests, a pair's **obligations** — "each plan stage checks the
index", "each promote stage regenerates it" — had **no** enumeration anywhere, and the product half
shipped both invocations while the dev half shipped neither, for an entire release line, with every gate
green. The failure is not that someone forgot; it is that **the set of sites was never written down**,
so "done" was assessed per-file. Remedy: when a capability is deliberately duplicated across the
dev/product boundary, materialize the **obligation set** in one place with the rules iterating it, the
same way `STEP_2B_GATES` does for a step's gate set.

**Why it matters.** [[L29]] establishes that a remedy quantified over a set needs the set materialized;
this names the **highest-value place to look for such a set** — a deliberate copy-pair, where the second
copy is invisible precisely because the first one is correct and reviewable in isolation. Distinct from
[[L29]] (there the set was one function's branches, authored by one person in one sitting; here the set
spans two surfaces and two increments months apart) and from [[L20]] (which says a discipline-only
remedy recurs — this says _where_ it recurs first).

**Provenance (for the promote gate to validate).**

- feature: `dev-lessons-index-gate`
- commit: `unknown` (working-tree dogfood; uncommitted at review time — base `d6aa21d`)
- source: this `REVIEW.md` + `.dev/features/dev-lessons-index-gate/PLAN.md` (the pre-plan halt where the
  scope question was put to the human) + the live worktree probe at base showing both dev members
  failing and both product members passing
- proposed type: `process` · proposed concepts: `[lesson-recurrence, dev-product-boundary, branch-coverage, floor-escalation]`

**Candidate B (weaker; noted, not pressed).** The `GRILL.md` G1 defect — a guarantee-audit bullet
asserting a checker's observable RED/GREEN behavior by _reasoning_ instead of _running_ it, and getting
the direction exactly backwards. It is a real failure from this increment and adjacent to [[L24]]'s "the
claim is void until re-measured", but it is a **first** occurrence and was caught by the existing grill
stage working as designed — so promoting it now would be the speculative half of P7. Recorded here so a
second occurrence has something to point at.

---

## Verdict

**GREEN — 0 floor-gate findings, 3 advisory (1 important, 2 minor).**

The increment is not blocked. The one `important` finding is a reporting-path gap, not a correctness
gap: the safety-critical half of the RED branch is anchored where it executes.

**What this review is and is not (P0).** The only guaranteed part is `validate.mjs` GREEN, which
`/pharn-dev-build` and `/pharn-dev-verify` already gated. Every finding above rests on **my judgment**,
including each `severity` value — LLM-assigned and therefore advisory, never a floor verdict. **"Review
returned GREEN" does not mean the increment is correct or wise.** That decision is the human's, at the
post-review gate.
