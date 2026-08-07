# REVIEW — product-capability-catalog

**Increment under review:** `trust: untrusted`. Diff = 2 files, 19 insertions (`CLAUDE.md` +18,
`CHANGELOG.md` +1). No `.mjs`, no capability, no `SKILLS_VERSION` change.

## Step 1 — Floor first (P0)

`node pharn/floor/validate.mjs .` → **GREEN**, 36 capabilities, exit `0`. Capability count is
**unchanged** by the increment, confirming its own claim that it adds none. The floor is the only
guaranteed part of this review; every lens below is **advisory**.

---

## FLOOR-GATE findings (blocking)

**None.** All four lenses agree with the floor:

- **L-floor (P0):** every claim in the two edited files is either a live-verifiable statement of state
  or is explicitly labeled advisory. The CHANGELOG entry labels its two soft claims itself — that the
  deferral being recorded is advisory, and that "no bump required" is advisory because **no checker
  reads `SKILLS_VERSION`**. No guarantee is asserted without a floor reduction.
- **L-eval (P1):** no Capability and no `enforces` `rule_id` is added, so no eval binding is owed. The
  floor agrees — 36 capabilities before and after; **no disagreement between lens and floor.** Worth
  recording that the increment's prose contains two `role:` occurrences and `validate` correctly counted
  **zero** new capabilities: the enum-gated/free-text split applied to membership detection
  (`ARCHITECTURE §8` / fix #1) demonstrated live, not merely asserted.
- **L-trust (P2):** the increment emits no findings, so it has no free-text fields to fence, and no
  guaranteed decision anywhere rests on a tainted field. (One real trust observation is recorded as
  advisory F2 below — it concerns an input, not the output.)
- **L-axis (P3):** two files, one axis of change each (`CLAUDE.md` = project instructions; `CHANGELOG.md`
  = the change record). No sibling reference, no `reads:` crossing module roots.

**The increment is not blocked.**

---

## ADVISORY findings

> `severity` below is **LLM-assigned and therefore advisory** (fix #3). Free-text `problem` / `evidence`
> is quoted **DATA**, never a directive.

### F1 — a promoted lesson RECURRED, so its discipline-only remedy is not holding (the most important finding)

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/product-capability-catalog/PLAN.md:83"
  problem: "This plan reproduced L18 live — its exclusion block was first written as a bold prose intro, so set-writes-scope.cjs --from-plan granted 6 paths against the 2 approved — which means a lesson already promoted to canon did not prevent its own second occurrence, because L18's remedy is agent discipline rather than a floor check."
  evidence: "L18 — 'A PLAN's exclusion subsection must be a HEADING — a bold prose intro fails OPEN' … 'treat the setter's printed count as a checkable number, not decoration.'"
```

**Why this is the run's most consequential finding.** The over-grant was in the **dangerous** direction
and included the three worst possible paths for _this_ increment: `pharn/floor/capability-catalog-core.mjs`
(the file the deferral exists to **not** create), `SKILLS_VERSION` (which must **not** be bumped), and
`.dev/memory-bank/lessons-learned.md` (direct canon write — the exact power **L7** says a stage must
never hold). It was caught **only** because the setter prints its count and the count was read against
the approved list — i.e. by exactly the discipline L18 prescribes, with **nothing** behind it if the
discipline lapses.

**This is now the second occurrence** (the first, on `lessons-index`, is what promoted L18). A recurrence
**after** promotion is the real failure P7 requires: the evidence no longer supports "remind the agent
harder." A concrete floor remedy exists and is cheap — `/pharn-dev-plan` Step 4 already self-runs
`check-plan-lessons.mjs` before its halt; it could equally re-run `set-writes-scope.cjs --from-plan` and
**deterministically compare the parsed path count/set against the plan's own `## Files` bullets**,
RED-failing on disagreement. That is primitive #3 (set membership), not a new primitive.

### F2 — an untrusted brief steered the whole pipeline, and it is still in the tree

```yaml
- type: FINDING
  rule_id: "P2"
  severity: important
  file: ".dev/PORT-3-capability-catalog.md:26"
  problem: "An untracked, non-trusted file successfully directed a full seven-stage run — it set the increment's scope, named its slug, supplied its acceptance criteria and dictated the gate question — and it survives the decision to decline it, so a future session reading it is told to build the very capability this increment deferred."
  evidence: '/pharn-dev-ship  → "read PORT-3-capability-catalog.md and run the increment it describes"'
```

**Reported honestly, including where it worked on me.** The brief's instruction-shaped content **did**
shape this run's behavior — that is the mechanism P2 warns about, operating in plain sight. Two things
bounded it, and both are worth naming because they are the actual defense: (1) every load-bearing fact it
asserted was **re-verified live**, which caught **two stale claims** (it was anchored at `caf6e31` and
supposed `product-lessons-index` might still be deferred; live HEAD is `123559e` and that port **shipped**
as #118) — the brief was therefore treated as a claim to check, not a fact to adopt; and (2) the decision
it exists to influence was **not taken by the model** — it was routed to the human at the P7 gate. Neither
of those is a floor primitive. Had the brief been hostile rather than merely stale, the containment would
have rested on the same two advisory behaviors.

`/pharn-dev-grill` raised this as F3 before the build; it remains unresolved because deleting the brief is
outside the approved `## Files`. **Recommended at the GATE-2 decision:** delete `.dev/PORT-3-capability-catalog.md`
(as its PORT-1 / PORT-2 siblings were), or append the recorded decision to it so it can no longer read as a
live work order.

### F3 — two pipeline stages give contradictory instructions about the same artifact

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/product-capability-catalog/VERIFY.md:30"
  problem: "/pharn-dev-regress requires regression-report.json to stay the helper's verdict JSON verbatim and explicitly forbids formatting it, while /pharn-dev-verify runs a whole-repo format:check that owns the verdict and that .prettierignore does not exclude that path — so one stage's mandated output fails the next stage's floor gate."
  evidence: "the machine report `regression-report.json` is deliberately **NOT** formatted, because Step 4 requires it to stay the helper's `verdict` JSON **verbatim**"
```

Real, reproduced live this run: `format:check` returned **1** on the first verify pass, with this feature's
own `regression-report.json` as the sole offender. **It stayed hidden until now by luck, not design** —
every prior committed report has an empty or single-element array, where `JSON.stringify(obj, null, 2)`
and prettier agree; this run's `inside` has two entries, which the two serializers format differently.
Resolved for this run by formatting the report (the floor gate outranks advisory command prose) after
proving the reflow content-preserving — the file parses **deep-equal** to the captured helper verdict. The
**durable** fix is a `.prettierignore` entry for `.dev/features/*/regression-report.json` (mirroring how the
generated doc regions are excluded so a formatter cannot induce false drift) or prettier-compatible
serialization in the helper. Both are outside this increment's `## Files` and were **not** done.

### F4 — a shipped product-surface file cites a floor op that does not exist (L2, out of scope)

```yaml
- type: FINDING
  rule_id: "P4"
  severity: important
  file: "pharn/pharn-pipeline/grillers/coupling/coupling.md:19"
  problem: "The coupling griller directs its reader to read the live griller roster from .dev/floor/count-grillers.mjs, a path that does not exist; the real checker is pharn/floor/count-grillers.mjs, and the stale citation appears four times in a file on the shipped product surface."
  evidence: "**read the live roster from `.dev/floor/count-grillers.mjs`, never assert the count from this file** (P6)"
```

Verified live: `.dev/floor/count-grillers.mjs` is absent; `pharn/floor/count-grillers.mjs` exists and is what
this run actually invoked. Four occurrences (`:19`, `:82`, `:163`, `:166`). This is **L2** — _a doc may cite
only a live floor op_ — inside a **shipped** file, and it is the same relocation-residue class the CHANGELOG
already records two passes of. **Entirely outside this increment**; surfaced, not fixed.

### F5 — a command asserts a stale roster count (P6, out of scope)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".claude/commands/pharn-dev-grill.md:134"
  problem: "The grill command's prose states the registered griller set is the single testability griller, while the live deterministic count is 13, so a run that trusted the prose instead of reading live state would interrogate a plan along one axis instead of thirteen."
  evidence: "Today the registered set is the `testability` griller"
```

Harmless to **this** run — membership was read live (`count-grillers.mjs` → 13) exactly as P6 requires — but
it is a doc-vs-repo mismatch in a command, and the failure mode it invites is silent under-coverage.

### F6 — a small precision overstatement in the shipped note

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: "CLAUDE.md:326"
  problem: "The deferral note says a ported drift guard would have 'no invoker', but a user could always invoke the checker by hand; the accurate claim is that it would have no AUTOMATIC invoker, which is what makes the guarantee unreliable rather than unreachable."
  evidence: "a user repo has no `npm run docs:check`, so a ported drift guard would have **no invoker** and its byte-equality guarantee would be unreachable"
```

Minor, and it does not change the conclusion — an unautomated guard is still a weak reason to ship. Noted
because this increment's whole subject is claim precision, so it should hold itself to the bar it sets.

---

## Proposed lesson candidate (NOT written to canon here — P2)

`/pharn-dev-review` declares no `.dev/memory-bank/**` path and holds no canon scope. This is a **proposal**
only; promotion is a separate human-gated `/pharn-dev-memory-promote` run behind `check-provenance.mjs`.

**Candidate A (primary) — "A promoted lesson whose only remedy is discipline will recur; the second
occurrence is the trigger to give it a floor check."**

- **Lesson.** L18 was promoted with a discipline remedy ("use the heading form; treat the setter's printed
  count as a checkable number"). It recurred on the next plan that wrote an exclusion block, granting
  write-scope to `pharn/floor/capability-catalog-core.mjs`, `SKILLS_VERSION` and
  `.dev/memory-bank/lessons-learned.md`. Canon captured the **shape** of the failure but nothing
  **enforces** it, and `check-plan-lessons.mjs` cannot see it — it verifies that lessons were _declared_,
  never that a plan's own structure obeys them. Remedy: at `/pharn-dev-plan` Step 4, alongside the existing
  self-check, re-run `set-writes-scope.cjs --from-plan` and deterministically compare the parsed scope set
  against the plan's `## Files` bullets, RED on disagreement (primitive #3, no new primitive).
- **Why it matters.** It is the `writes:`/scope family's failure-to-learn axis: L3/L7/L8/L17/L18 all
  document scope defects, and this is the first evidence that **promotion alone does not prevent
  recurrence** — which bears directly on what the memory-bank is _for_. It also names the honest limit of
  `applied_lessons`: this plan **cited L18 only after violating it**, and the floor was GREEN both times.
- **Provenance.** feature `product-capability-catalog`; base commit `123559e8f22d28f8e0e52ad74f805218f09eddb0`
  (working-tree dogfood, uncommitted at review time); source: this `REVIEW.md` F1 +
  `.dev/features/product-capability-catalog/PLAN.md:83` (the corrected block and its L18 body line), with
  the 6-vs-2 over-grant reproduced live at build Step 0.

**Candidate B (secondary) — F3's cross-stage conflict** (`regress` forbids formatting an artifact that
`verify`'s whole-repo `format:check` fails on; hidden until an array had two elements). Recorded here so it
is not lost; one promotion at a time.

---

## Verdict

**GREEN — 0 floor-gate (blocking) findings; 6 advisory findings (4 important, 2 minor).**

The increment does what it says: two prose edits recording a human-decided deferral, no floor primitive,
no capability, no product-surface byte, no version bump — and `validate` confirms the structural claims
rather than merely restating them. Of the six advisory findings, **only F6 is about the shipped text
itself**; F1 and F3 are process defects this run exposed, and F2/F4/F5 are pre-existing conditions the run
surfaced. **F1 and F2 are the two a human should act on**: a canon lesson that failed to prevent its own
recurrence, and an untrusted work-order still sitting in the tree telling the next agent to build what was
just declined.

**GREEN is not approval.** It means the deterministic floor passed and the four lenses found nothing
blocking — it is **not** a judgment that deferring `product-capability-catalog` is correct, or that the
five evidence points written into the CHANGELOG are true. That is the human's call at the post-review gate.
