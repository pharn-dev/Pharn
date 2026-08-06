# SHIP — product-memory-promote

A thin, **advisory** roll-up of one `/pharn-dev-ship` run. It records **that the chain ran and its floor
verdicts** — nothing more.

**Intent:** `.dev/PORT-1-memory-promote.md` (moved from the repo root during the run — see the STOP below),
handed to `/pharn-dev-plan` as prose intent, not as a slug.

## Stages that ran, in order

| #   | stage                | outcome                                                               |
| --- | -------------------- | --------------------------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | `PLAN.md` written; **GATE 1** — human approved as written             |
| 2   | `/pharn-dev-grill`   | `GRILL.md` — 10 advisory concerns; gates nothing, proceeded           |
| 3   | `/pharn-dev-build`   | 8 declared files written; **STOPPED once on a RED floor** (see below) |
| 3b  | `/pharn-dev-build`   | re-run of the floor after the human cleared the RED → **GREEN**       |
| 4   | `/pharn-dev-regress` | `regression-report.json` + `REGRESSION.md`                            |
| 5   | `/pharn-dev-verify`  | `verify-report.json` + `VERIFY.md`                                    |
| 6   | `/pharn-dev-review`  | `REVIEW.md`                                                           |

**Where the run ended: GATE 2** — the post-review human decision (merge / fix / abandon).

## The structural verdicts read, verbatim

| stage                | verdict source                              | value                  |
| -------------------- | ------------------------------------------- | ---------------------- |
| `/pharn-dev-build`   | `node pharn/floor/validate.mjs .` exit code | **0** (`FLOOR: GREEN`) |
| `/pharn-dev-regress` | `regression-report.json` `.verdict`         | **`"no-regressions"`** |
| `/pharn-dev-verify`  | `verify-report.json` `.verdict`             | **`"PASS"`**           |

`/pharn-dev-verify` `failing_gates: []` over six gates — `test`, `validate`, `lint`, `format:check`,
`lint:md`, `docs:check` — each exit 0. `/pharn-dev-regress` `regressions: []`, `pre_existing: []`, base
`caf6e31a909964dda8d6babddd8cb5540eb3d550`.

`/pharn-dev-grill` and `/pharn-dev-review` have **no** structural verdict and none was invented for them
(P0, fix #3): their `severity` values are LLM-assigned and advisory. `/pharn-dev-review`'s only floor-grade
content is `validate.mjs` GREEN, already gated at stages 3 and 5.

## The one RED-verdict STOP, and how it was cleared

`/pharn-dev-build`'s floor came back **RED — 2 blocking findings**, both `P0/fix#1`, naming
`PORT-2-lessons-index.md` and `PORT-3-capability-catalog.md`. `/pharn-dev-ship` **stopped and handed to the
human**, as it must — the branch reads the exit code, never an assessment that the RED "looks unrelated".

It was diagnosed before being presented, not after: a detached worktree at `caf6e31` with no port briefs was
**GREEN**; the same worktree with **only** the three untracked briefs copied in — zero files from this
increment — reproduced the **identical two findings**. Both briefs carry `rule_id:` + `problem:` without the
enum-gated/free-text words, so they trip validate's CHECK 5. This is a live instance of the L10 asymmetry:
a root-level `.md` is on validate's scanned surface; `.dev/**` is not.

The human directed moving them; all three `PORT-*.md` were `mv`'d into `.dev/`, and the floor returned
**GREEN, exit 0**. The move fixed the class rather than the instance — `PORT-2` and `PORT-3` will not trip it
on their own runs.

## Pointers (cited, not restated — P4)

- `.dev/features/product-memory-promote/REVIEW.md` — the four advisory lenses, 5 advisory findings
  (2 important, 3 minor), 0 blocking, plus one **proposed** canon lesson (`verify-include-docs-gate`) and
  seven named follow-ups. **Read it at the gate; this file deliberately does not restate its findings.**
- `.dev/features/product-memory-promote/GRILL.md` — advisory, pre-build; gated nothing.
- `.dev/features/product-memory-promote/REGRESSION.md` — includes the five **false** `scope` "escaped"
  findings (L17 firing again) and the deterministic disproof of each.
- `.dev/features/product-memory-promote/VERIFY.md` — includes why `docs:check` was added as a sixth gate.

## Two things a reader of the verdicts alone would miss

1. **`/pharn-dev-regress`'s `scope` step exited 1 with five blocking "the build escaped its `## Files`"
   findings — all five false**, reproducing `lessons-learned.md` **L17** on the correct, designed workflow.
   They were **disproved, not waved through**: with the build's own scope active, the fix #7 hook denied a
   `Write` to each flagged path (exit 2 every time), so the build provably could not have written them.
   L17 warns that dismissing this finding is worse than not having the check — the disproof is recorded in
   `REGRESSION.md` rather than the clean re-run alone.
2. **`README.md`'s generated region reverted from outside the agent loop mid-run** (mtime `22:13:10`, later
   than every file this build wrote), turning `docs:check` RED while all five canonical verify gates stayed
   GREEN. It was regenerated **before** the baseline and head gates were captured, so both sides measured the
   same correct tree. The consequence generalizes and is the proposed lesson in `REVIEW.md`.

## What the human is deciding at this gate

Not covered by any verdict above, and stated plainly:

- **No agent has run `/pharn-memory-promote` end to end.** Its floor and hook chain were measured live in a
  staged copy of the product surface (denial at exit 2 with no scope; Step 0 narrowing to `1 path(s)` so even
  the sibling canon file stays denied; `commit: unknown` + an injected needle in the body passing GREEN;
  deny writing nothing; accept bootstrapping the file; a PLAN citing `[L1]` resolving GREEN with `[L2]` RED
  as the control), and the checker-to-checker half is now a committed test. A live command dogfood is the
  named follow-up `product-memory-promote-dogfood`.
- **This increment makes a pre-existing hole live:** `/pharn-build` derives its writes-scope from a PLAN's
  `## Files`, and no human approves a product PLAN — so a plan naming a canon path grants an **ungated**
  canon write. Inert until now because canon meant nothing on the product surface. Follow-up:
  `canon-write-denylist`.
- **`SKILLS_VERSION` 2.1.0 → 2.2.0** (minor) with a `CHANGELOG` entry, because two product-surface files
  ship: `.claude/commands/pharn-memory-promote.md` and `pharn/floor/check-provenance.mjs`.
- **Nothing is committed.** No merge, no push, no `PHARN ✓ reviewed` seal.

---

The chain ran; the named floor verdicts are as shown — **this is NOT a judgment that the increment is good
or wise; that is the human's call at the post-review gate.**
