# SHIP — secmat-word-boundary

Gated `/pharn-dev-ship` run over the M2 task: word-boundary-anchor the crypto scanner's insecure-random
keyword set. **The run ended at GATE 2** — the full chain completed and every structural verdict came back
GREEN, so nothing STOPped it early.

## Stages, in order

| #   | stage                | structural verdict read                          | result                 |
| --- | -------------------- | ------------------------------------------------ | ---------------------- |
| 1   | `/pharn-dev-plan`    | — (**GATE 1**, human approval)                   | approved as written    |
| 2   | `/pharn-dev-grill`   | none — advisory by design, gates nothing         | 6 concerns, 0 blocking |
| 3   | `/pharn-dev-build`   | `node pharn/floor/validate.mjs .` **exit code**  | **0** (GREEN, 36 caps) |
| 4   | `/pharn-dev-regress` | `regression-report.json` `.verdict`              | **`"no-regressions"`** |
| 5   | `/pharn-dev-verify`  | `verify-report.json` `.verdict`                  | **`"PASS"`**           |
| 6   | `/pharn-dev-review`  | none — no structural verdict exists (P0, fix #3) | GREEN, 0 blocking      |

The verdicts in column 3 are **floor-grade** — each belongs to that stage's own checker. `/pharn-dev-ship`
adds **no new floor primitive**; running the stages in order and reading those verdicts is **advisory
orchestration**. `/pharn-dev-review` has no structural verdict and none was invented for it: its
`REVIEW.md` is read by the human here, not computed into a proceed/stop.

## The two human gates

- **GATE 1 (plan acceptance)** — hit at `/pharn-dev-plan`'s own halt. Two open questions were put as a
  selectable form and both answered: the garbled task fragment reads as "the same treatment already
  applied to `iv`", and plural preservation is wanted (`apiKeys` / `API_KEYS` / `api_keys` keep firing).
  The plan was **approved as written**; the resolutions are recorded in `PLAN.md` under
  `## Open questions (RESOLVED at GATE 1)`.
- **GATE 2 (post-review decision)** — **here, now, and it is the human's.** Reaching this point is
  permission to present, never to act.

## Verdicts, verbatim

```text
/pharn-dev-build     node pharn/floor/validate.mjs .   -> exit 0   "FLOOR: GREEN — 36 capabilities checked in ."
/pharn-dev-regress   regression-report.json .verdict   -> "no-regressions"   (regressions[]: [], pre_existing[]: [])
/pharn-dev-verify    verify-report.json    .verdict    -> "PASS"             (failing_gates[]: [])
```

`/pharn-dev-verify`'s six gates — `test`, `validate`, `lint`, `format:check`, `lint:md`,
`structural:expected-injection-comment.json` — were each exit 0. `verifiers.registered` is `0`, so the
advisory layer contributed nothing and could not have: `check-verify.mjs` cannot receive a finding.

## What landed

`SKILLS_VERSION` 2.7.10 → **2.7.11** (patch — a correction to bytes that already shipped), with the
`CHANGELOG.md` entry and the `README.md` badge that `check:badge` pins to it.

`pharn/floor/scan-code-crypto.mjs`'s `SECMAT` set now matches each word as an identifier **segment** via
four branches generated for **every** member — bare lowercase head, camelCase segment, ALL-CAPS segment,
snake/kebab tail — instead of an unanchored substring with a single hand-written anchor on `iv`. A
trailing plural is admitted on a continuation segment only. The suite went 26 → **48** tests, with the
word set and the branch table **iterated** rather than sampled, plus a drift pin tying the suite's copy of
the word set to the scanner's.

Both reported repros were reproduced before the change and re-run after:

```text
keys[Math.floor(Math.random() * keys.length)]   before: insecure-random   after: no finding
Fisher-Yates shuffle over `monkeys`             before: insecure-random   after: no finding
const key = Math.random().toString(36)          before: insecure-random   after: insecure-random
sessionToken = Math.random()                    before: insecure-random   after: insecure-random
```

## Pointers (cited, not restated — P4)

- `.dev/features/secmat-word-boundary/GRILL.md` — advisory; 6 concerns, 0 blocking. Three were folded in
  before the build (the `$key` lookbehind gap, the iterated branch table, the re-derived cost bound); the
  dispositions are recorded in `PLAN.md` `## Grill dispositions`.
- `.dev/features/secmat-word-boundary/REVIEW.md` — GREEN, 0 floor-gate findings, 5 advisory (1 important).
  It also records one **proposed** lesson candidate; promoting it is a separate human-gated
  `/pharn-dev-memory-promote` run, and nothing was written to canon here.
- `.dev/features/secmat-word-boundary/{REGRESSION.md,VERIFY.md}` — the human renders of stages 4 and 5.

## GATE-2 follow-up — the human decided "fix everything"

The gate was answered `fix`, so a follow-up pass dispositioned all five `REVIEW.md` findings. **Four
fixed, one deliberately left.** Every gate was re-run afterwards and the verdicts above are the
**post-fix** ones.

| #   | finding                                | disposition                                                                               |
| --- | -------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | the change is not monotone (important) | **FIXED** — both directions named in header + CHANGELOG + PLAN, and pinned by 4 new tests |
| 2   | the `ci()` claim over-scopes (minor)   | **FIXED** — the comment now separates the compensated half from the deliberate one        |
| 3   | ms figures read as a bound (minor)     | **FIXED** — labelled a dated one-machine observation; the ~1.2× ratio is the claim        |
| 4   | no `insecure-random` lens eval (minor) | **FIXED** — the eval pair is authored and `validate`-bound                                |
| 5   | drift pin reads source text (minor)    | **NOT FIXED, deliberately** — the repair would repeat the defect                          |

**Why #5 is left open.** The obvious fix is an entry-point guard so the test could import
`SECMAT_WORDS` — but that would add the guard to **one** of the 18 `scan-code-*.mjs` scanners, which is
the same "rule written for whichever member was in front of the author" this whole increment exists to
repair. Either all 18 get it as one increment, or none does here. The pin fails closed meanwhile, so
leaving it costs nothing silent.

**Scope.** Closing #4 required four paths the approved plan did not name. They were declared in
`## Files` **first** and the scope-setter re-run — the sanctioned remedy — never written-then-authorized.
`check-regress.mjs scope` re-ran clean at exit 0 over all 17 changed paths.

## Two things the human should still weigh

1. **One deviation from the approved plan's pinned shape.** Branch 1's negative lookbehind was narrowed
   from `(?<![A-Za-z0-9_$])` to `(?<![A-Za-z0-9])` after `/pharn-dev-grill` showed the `_$` bought nothing
   and made `$key` / `$token` uncompensated misses. It stayed inside the approved `## Files` and is
   recorded in `PLAN.md`, but the plan said "shape, so build has no latitude", so it is surfaced rather
   than buried.
2. **The `## Files` list was amended after GATE 1.** Four paths were added on the "fix everything"
   decision. The additions are the human's own instruction carried out, and the declare-then-write order
   was preserved — but the approved list is no longer byte-identical to the one approved at GATE 1, which
   is exactly the kind of thing that should be seen rather than assumed.

## One process defect this run produced, recorded rather than smoothed over

The first attempt at declaring those four paths put them under an `### Added at GATE 2` subheading. The
setter then reported **5 paths, not 9** — a heading ends the authorized `## Files` list. It exits 0
either way, so this surfaced only because the printed count was actually read against the list. Fixed by
moving the bullets into the same flat list. That is a third live instance of the plan-shape/count family
(L18 → L20 → L28) inside this repo, which is worth a human's attention on its own.

## Standing decision

**The chain ran; the named floor verdicts are as shown — this is NOT a judgment that the increment is
good or wise; that is the human's call at the post-review gate.** No merge, no push, no commit, and no
`PHARN ✓ reviewed` seal was applied.
