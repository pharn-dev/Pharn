# SHIP — version-badge-pin

An **advisory** roll-up of a `/pharn-dev-ship` run. It records that the chain ran and what each stage's
floor verdict was. It is not an approval, not a "shipped", and not a `PHARN ✓ reviewed` seal.

## Stages, in order

| #   | Stage                | Outcome                                             |
| --- | -------------------- | --------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | `PLAN.md` written → **GATE 1**, human approved      |
| 2   | `/pharn-dev-grill`   | `GRILL.md` — 4 concerns, 0 blocking (gates nothing) |
| 3   | `/pharn-dev-build`   | 7 files written; floor GREEN                        |
| 4   | `/pharn-dev-regress` | `no-regressions`                                    |
| 5   | `/pharn-dev-verify`  | `PASS`                                              |
| 6   | `/pharn-dev-review`  | `REVIEW.md` — 0 floor-gate, 2 advisory              |

**Where the run ended: GATE 2.** No stage returned a non-GREEN verdict, so the chain reached the
post-review human gate rather than a RED-verdict stop.

## Structural verdicts read, verbatim

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` exit **0** (`FLOOR: GREEN — 36 capabilities
checked in .`). The two build gates also passed first: the `pharn/ARCHITECTURE.md` content-hash
  recomputed to `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`, equal to the plan's
  pin (fix #4, no drift), and the plan carried no unresolved open questions.
- **`/pharn-dev-regress`** → `regression-report.json` `.verdict` = **`"no-regressions"`**, exit 0.
  `regressions: []`, `pre_existing: []`. Outside gates `tests` / `validate` /
  `structural:expected-injection-comment` were 0 → 0. `check-regress.mjs scope` exit 0 with
  **`escaped: []`** — the build did not write outside the plan's `## Files`.
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`**, exit 0. `failing_gates: []`.
  All six gates 0: `test`, `validate`, `lint`, `format:check`, `lint:md`,
  `structural:expected-injection-comment.json`. `verifiers: { registered: 0 }` — floor gates only, and
  the advisory verifier layer is empty by design (P7), so nothing advisory could have influenced this
  number even in principle.

## Artifacts (cited, not restated — P4)

- `.dev/features/version-badge-pin/PLAN.md` — the approved intent, `applied_lessons` floor-GREEN across 13 cited ids
- `.dev/features/version-badge-pin/GRILL.md` — advisory; 2 of its findings were folded into the build before the first write
- `.dev/features/version-badge-pin/REGRESSION.md` + `regression-report.json`
- `.dev/features/version-badge-pin/VERIFY.md` + `verify-report.json`
- `.dev/features/version-badge-pin/REVIEW.md` — **read this before deciding**; it carries two advisory findings and a proposed canon lesson

## What the human is being asked to decide

`REVIEW.md` stands at **0 floor-gate findings** and **2 advisory** ones. The reviewer's own
recommendation, recorded there, is that the **important** P2 finding
(`.dev/floor/check-version-badge.mjs` prints an unsanitised badge value on the `ENUM_ERROR` path —
reproduced live, verdict unaffected) be fixed **in this increment** rather than deferred, because the
file is new and would ship carrying it. The **minor** P0 finding is a CHANGELOG headline stronger than
its own guarantee audit.

Two things were found and deliberately **not** fixed, each recorded rather than smuggled in:
`.claude/commands/pharn-dev-verify.md:100`'s subset-vs-aggregate claim (follow-up
`verify-gate-map-claim` — not in the approved `## Files`), and a factual error in canon lesson **L14**
about JavaScript's `$` anchor (proposed for a gated `/pharn-dev-memory-promote` run; canon is never
written by a build or a review).

`SKILLS_VERSION` is **untouched at 2.5.1** and no CHANGELOG version entry was added — every path this
increment writes is repo-meta or build apparatus.

## The honest line

The chain ran; the named floor verdicts are as shown. **This is NOT a judgment that the increment is
good or wise** — that is the human's call at the post-review gate. `/pharn-dev-ship` added no floor
primitive of its own: every guarantee above belongs to a sub-stage's own checker, and the act of running
the stages in order and reading their verdicts is advisory command-layer work.
