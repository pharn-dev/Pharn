# SHIP — build-step2b-lint

Increment: make `/pharn-dev-build` Step 2b **run** the eslint gate it named, and pin the three-gate set
so a member cannot be silently dropped or left as prose.

## The chain was COMPRESSED, and that is recorded here rather than left to be inferred

A reader comparing this folder to `.dev/features/validate-bad-target/` will find four artifacts
missing. They were not forgotten; they were not run. **Stages that ran:** `/pharn-dev-plan` (→
`PLAN.md`), `/pharn-dev-build`, `/pharn-dev-verify` (→ `verify-report.json`, `VERIFY.md`), and — added
after the fact, see below — `/pharn-dev-regress` (→ `regression-report.json`, `REGRESSION.md`).
**Stages that did not:** `/pharn-dev-grill`, `/pharn-dev-review`, both **advisory** by design.

**Why, honestly.** This increment exists to repair finding **F3** of
`.dev/features/validate-bad-target/REVIEW.md`, where the defect was already reproduced live, the remedy
already named, and the human had already read it. The user's instruction — _"fix everything and promote
memory and then create pull request"_ — was taken as **GATE-1 approval** for that specific,
already-specified remedy. **That is a substitution of a human instruction for a plan halt, and it is a
weaker thing than the halt it replaces:** GATE 1 exists so the human approves the intent _as written in
the PLAN_, and here the PLAN was written after the instruction rather than before it. Anyone auditing
this increment should read `PLAN.md` knowing it was never gated in the ordinary way.

**What was NOT skipped.** The floor did not move. `PLAN.md` carries a real `spec_content_hash` and a
floor-checked `applied_lessons` (`check-plan-lessons.mjs` GREEN, 6 ids resolving in canon); the
writes-scope was set from the plan's `## Files` and parsed to exactly the 3 declared paths; the build
ran under that scope; and `/pharn-dev-verify` issued a genuine **`PASS`** over all six gates. The
compression initially cost the two **advisory** stages **and** the regress comparison; the comparison
was run afterwards and is no longer missing (below), so what the compression finally cost is
`/pharn-dev-grill` and `/pharn-dev-review` — both advisory, neither a floor verdict.

## Structural verdict

- **`/pharn-dev-regress`** → `regression-report.json` `.verdict` = **`"no-regressions"`** (`check-regress.mjs`, exit 0), base `fcf3f5b`.
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`** (`check-verify.mjs`, exit 0),
  `failing_gates[]` empty, six gates all 0. `npm test`: 1548 pass, 0 fail. Floor GREEN, 36 capabilities.

## The gap this compression left — named, then CLOSED

An earlier version of this section named the missing regress run as this increment's honest gap:
verify answers "the gates are green at HEAD", never "nothing outside the feature flipped", and a flip
is something only the comparison detects. Documenting a gap is not closing it, so the run was
performed — **`no-regressions`**, `regressions[]` and `pre_existing[]` both empty, over 66 outside test
files plus `validate` and the one committed eval pair. See `REGRESSION.md` and
`regression-report.json`.

Its base is `origin/main` (`fcf3f5b`) rather than the auto-detected `HEAD`, because HEAD on this branch
already contains the changes under test and that comparison would have been vacuous. The run is
branch-wide, which also makes it a **stricter re-check** of the `validate-bad-target` regress run —
that one was captured before these three files existed.

**Two things remain genuinely absent**, and neither is a floor verdict: `/pharn-dev-grill` and
`/pharn-dev-review`, both **advisory** stages that gate nothing. `REGRESSION.md` additionally records
one stated omission inside the run itself — the `scope` sub-check is per-increment and was answered
per-increment rather than across the branch.

## Standing decision

The decision is the human's. This file records what ran, what did not, and why — it is not a
self-issued "shipped", not an approval, and not a `PHARN ✓ reviewed` seal.

_Chain ran in compressed form; the named floor verdict is as shown — this is NOT a judgment that the
increment is good or wise, and the compression is a recorded deviation, not a precedent._
