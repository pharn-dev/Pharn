# SHIP — dev-lessons-index-gate

**Mode:** gated `/pharn-dev-ship` (no `--loop`). **Ended at:** GATE 2 — the post-review human decision.
No stage returned a RED verdict, so the chain ran to its end.

## Stages run, in order

| #   | stage                | structural verdict read                              | source                   |
| --- | -------------------- | ---------------------------------------------------- | ------------------------ |
| 1   | `/pharn-dev-plan`    | — (**GATE 1**: human approved as written)            | plan's own approval halt |
| 2   | `/pharn-dev-grill`   | none — advisory by design, gates nothing             | `GRILL.md`               |
| 3   | `/pharn-dev-build`   | `validate.mjs` exit **`0`** (GREEN, 36 capabilities) | floor exit code          |
| 4   | `/pharn-dev-regress` | `.verdict` = **`"no-regressions"`**                  | `regression-report.json` |
| 5   | `/pharn-dev-verify`  | `.verdict` = **`"PASS"`**, `failing_gates: []`       | `verify-report.json`     |
| 6   | `/pharn-dev-review`  | none — no structural verdict exists; not invented    | `REVIEW.md`              |

Each proceed decision was read from the named deterministic verdict. No stage was advanced on judgment.

## The verdicts, verbatim

- **build** — `FLOOR: GREEN — 36 capabilities checked in "."`, exit `0`.
- **regress** — `"verdict": "no-regressions"`, `regressions: []`, `pre_existing: []`, base
  `d6aa21dce00e2ee55af7d4a61005f8f27a71aa30`. Gates compared: `tests` `0→0`, `validate` `0→0`,
  `structural:expected-injection-comment` `0→0`. `escaped: []` — the build wrote nothing outside its
  declared `## Files`.
- **verify** — `"verdict": "PASS"`; gates `test` `0`, `validate` `0`, `lint` `0`, `format:check` `0`,
  `lint:md` `0`, `structural:expected-injection-comment` `0`; `verifiers: {registered: 0, findings: []}`.

**Additionally confirmed, and flagged as NOT a `check-verify` gate:** `npm run check` is **0-fail**,
which covers `docs:check`, `check:markers` and `check:badge` — outside the verify gate map, so it sits
here as a separate confirmation, not as part of the floor verdict. `SKILLS_VERSION` is **unchanged at
`2.7.12`**, correct for an apparatus-only increment (`pharn-dev-*` commands + a `*.test.mjs`; none ships).

## Pointers (cited, not restated — P4)

- `.dev/features/dev-lessons-index-gate/REVIEW.md` — 0 floor-gate findings, 3 advisory (1 important,
  2 minor), plus one proposed lesson candidate. **The `important` one is a real gap this chain found in
  its own output** and is the main thing for the human to weigh at GATE 2.
- `.dev/features/dev-lessons-index-gate/GRILL.md` (advisory) — 5 concerns, 1 blocking-severity. That one
  was a **P0 defect in the plan's own guarantee audit**, found by probing the checker in a throwaway repo
  rather than reasoning about it: the plan had the RED/GREEN direction inverted. The build wrote the
  corrected claim, not the plan's.
- `.dev/features/dev-lessons-index-gate/{PLAN,REGRESSION,VERIFY}.md` and the two machine reports.

## Honest note on one deviation, so it is not discovered in a diff

The approved `PLAN.md:107` carries a sentence the grill then **disproved** ("Step 6b leaves … `npm run
check` is RED"). The shipped command prose states the corrected direction — a skipped regeneration is
what turns `docs:check` RED, and running Step 6b is what keeps it GREEN. Scope, files and design are
unchanged from what the human approved; only that claim's direction differs, and it differs toward the
truth. `PLAN.md` was deliberately **not** rewritten after approval — an approved plan is a record, and
amending it post-gate would blur what the human actually approved.

## Standing decision

The chain ran; the named floor verdicts are as shown. **This is NOT a judgment that the increment is
good or wise; that is the human's call at the post-review gate.** `/pharn-dev-ship` has not merged,
pushed, committed, or applied any seal, and adds **no new floor primitive** — every guarantee above
belongs to a sub-stage (`validate`, `check-regress`, `check-verify`, the writes-scope hooks, the
build's spec-hash re-check). Running the stages in order was **advisory orchestration**.
