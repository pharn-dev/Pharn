# SHIP — product-lessons-index

An **advisory** roll-up of one gated `/pharn-dev-ship` run. Entry was the intent in
`.dev/PORT-2-lessons-index.md`, not a slug and not an existing plan.

## Where the run ended

**GATE 2 — the post-review human decision.** No stage returned a RED verdict, so the chain ran end to
end and stopped where it is designed to stop: presenting to the human, who decides **merge / fix /
abandon**.

## Stages, in order, with the structural verdict read at each

| #   | stage                | verdict read (verbatim)                               | source                   | action     |
| --- | -------------------- | ----------------------------------------------------- | ------------------------ | ---------- |
| 1   | `/pharn-dev-plan`    | — (ends at its own approval halt)                     | **GATE 1**               | approved   |
| 2   | `/pharn-dev-grill`   | — (no deterministic verdict; gates nothing by design) | `GRILL.md`               | proceed    |
| 3   | `/pharn-dev-build`   | `validate.mjs` exit **0** (GREEN, 36 capabilities)    | floor exit code          | proceed    |
| 4   | `/pharn-dev-regress` | `.verdict` = **`"no-regressions"`**                   | `regression-report.json` | proceed    |
| 5   | `/pharn-dev-verify`  | `.verdict` = **`"PASS"`**, `failing_gates: []`        | `verify-report.json`     | proceed    |
| 6   | `/pharn-dev-review`  | — (no structural verdict; see below)                  | `REVIEW.md`              | **GATE 2** |

**GATE 1 was real.** `/pharn-dev-plan` halted, and before it could even scope the increment it halted a
second time on four open questions (P6) — the P7 ship-or-defer call, the index location, the drift-check
invoker, and the two-copies-vs-shared-core question. All four were answered by the human; a fifth,
clarifying question was asked when one answer was ambiguous. **The planner recommended a reasoned
deferral and the human declined it** — that is recorded in `PLAN.md` as what happened, not reframed.

**`/pharn-dev-review` has no structural verdict, and this run did not invent one.** It writes only prose
(no `findings.json`, no `check-review.mjs`), and a finding's `severity` is LLM-assigned — advisory
(fix #3). Its only floor-grade content, `validate.mjs` GREEN, was already gated at stages 3 and 5.
Counting its findings as a gate would read LLM severity as a floor verdict — the disease.

## Pointers (cited, not restated — P4)

- `.dev/features/product-lessons-index/PLAN.md` — the approved plan, its four recorded human decisions, and the guarantee audit.
- `.dev/features/product-lessons-index/GRILL.md` — advisory; 6 concerns (0 blocking-severity, 5 important, 1 minor).
- `.dev/features/product-lessons-index/REGRESSION.md` / `regression-report.json` — the machine report is the helper's JSON verbatim.
- `.dev/features/product-lessons-index/VERIFY.md` / `verify-report.json` — six floor gates, zero verifiers registered.
- `.dev/features/product-lessons-index/REVIEW.md` — **read this before deciding**: 0 floor-gate findings, 2 advisory findings, and one **proposed** lesson candidate that is deliberately **not** promoted.

## What the human should weigh at this gate

Three things this chain surfaced but cannot decide, all quoted from the artifacts as data:

1. **`/pharn-dev-grill` F1 + F5 (the design question).** The Q1 answer (`.pharn/`, a gitignored cache)
   narrowed the shipped guarantee from the dev original's "committed == recomputed" byte-equality to a
   **machine-local staleness check**. The P7 ship-over-defer decision was made under the brief's framing,
   in which that guarantee was dev-strength. Each fact is stated honestly on its own; **the coupling
   between them is the thing to re-weigh** — which is not the same as re-opening the decision.
2. **`/pharn-dev-review`'s two advisory findings.** One sentence and one word, both recommended for fix
   before merge: `/pharn-plan`'s guarantee audit now under-states its own write surface (the optional
   Bash cache-warm escapes fix #7 and is undeclared, where `/pharn-memory-promote` Step 6b declares the
   identical escape), and `check-lessons-index.mjs`'s header documents `COLD` more narrowly than it
   behaves.
3. **The proposed lesson candidate.** It is a **proposal only** — `/pharn-dev-review` declares no
   `.dev/memory-bank/**` path and cannot write canon. Promotion is a separate, human-gated
   `/pharn-dev-memory-promote` run. Its own honest trigger is a design-time near-miss, weaker than L4's
   before→fix→after cycle, and the candidate says so and names declining as a legitimate outcome.

## One thing done differently, recorded so it is not mistaken for drift

**`/pharn-dev-regress`'s `scope` check exited 1** with the blocking `P0 fix#7` "the build escaped its
`## Files`" finding, naming four paths. It was **not** waved through: all four were disproved with live
mtimes (two pre-run input briefs at 20:06:09, and this feature's own `PLAN.md` / `GRILL.md` written by
sibling stages under their own Step-0 scopes — all before the build's first write at 23:32:03). This is
the known L17 defect (a **changed-since-base** test reported as a **written-by-the-build** test), and
L17's prescribed remedy was applied, after which `scope` returned `escaped[]: []` at exit 0 over the 14
real build writes. Full disproof in `REGRESSION.md`. It is the second recorded occurrence; no new lesson
is proposed for it (a recurrence confirms L17, it does not earn a new entry).

## The honest line

**Chain ran; the named floor verdicts are as shown — this is NOT a judgment that the increment is good
or wise; that is the human's call at the post-review gate.**

`/pharn-dev-ship` added **no new floor primitive**. Every guarantee above belongs to a **sub-stage**
(`validate`, `check-regress`, `check-verify`, the writes-scope hooks, the build's spec-hash re-check).
Running the stages in order, and reading their verdicts, is **advisory orchestration**. Nothing here is a
merge, a push, or a `PHARN ✓ reviewed` seal.
