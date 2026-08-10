# SHIP — spec-hash-eol-normalize

A roll-up of the `/pharn-dev-ship` run. **Advisory** — it records that the chain ran and what each stage's floor verdict was. It is not an approval, not a "shipped", and not a `PHARN ✓ reviewed` seal.

Branch: `fix/f5-spec-hash-eol-normalize`, off `main` at `207f4af970f95a9ad70430938482a9656aba9c4d`.

## Stages run, in order

| stage                | outcome                   | structural verdict read                                                 |
| -------------------- | ------------------------- | ----------------------------------------------------------------------- |
| `/pharn-dev-plan`    | halted at **GATE 1**      | human approved the plan as written                                      |
| `/pharn-dev-grill`   | advisory — proceeded      | no deterministic verdict; spec-hash agreed (`a1c243ea…621753`)          |
| `/pharn-dev-build`   | proceeded                 | `node pharn/floor/validate.mjs .` → **exit 0** (GREEN, 36 capabilities) |
| `/pharn-dev-regress` | proceeded                 | `regression-report.json` `.verdict` = **`no-regressions`**              |
| `/pharn-dev-verify`  | proceeded                 | `verify-report.json` `.verdict` = **`PASS`**, `failing_gates: []`       |
| `/pharn-dev-review`  | end of chain — **GATE 2** | no structural verdict by design; `REVIEW.md` is advisory prose          |

The run ended at **GATE 2**, not at a RED-verdict STOP.

## Verdicts, verbatim

- **build** → `validate` exit **0**.
- **regress** → `"verdict": "no-regressions"`; `regressions: []`, `pre_existing: []`; outside gates `tests` 0→0, `validate` 0→0 over 57 outside test files.
- **verify** → `"verdict": "PASS"`; gates `test` 0, `validate` 0, `lint` 0, `format:check` 0, `lint:md` 0; `verifiers.registered: 0`.

## Two human gates, both honored

- **GATE 1** — the plan was approved by a human before any product file was written, with two design decisions (fold breadth, `.gitattributes` breadth) settled by explicit selection rather than assumed. A third decision — whether to widen scope to two product command files over the grill's F3 — was also put to the human, who chose to leave them.
- **GATE 2** — reached now. `/pharn-dev-ship` presents; it does not merge, push, commit, or seal.

## Pointers (cited, not restated — P4)

- `.dev/features/spec-hash-eol-normalize/PLAN.md` — the approved increment, its guarantee/trust/determinism audits, and the folded-in grill dispositions.
- `.dev/features/spec-hash-eol-normalize/GRILL.md` — 8 advisory concerns, 0 blocking.
- `.dev/features/spec-hash-eol-normalize/REGRESSION.md` / `regression-report.json`.
- `.dev/features/spec-hash-eol-normalize/VERIFY.md` / `verify-report.json`.
- `.dev/features/spec-hash-eol-normalize/REVIEW.md` — **GREEN**, 0 floor-gate findings, 3 advisory; carries one proposed lesson candidate.

## What this run does and does not establish

Running the stages in order is **advisory** — nothing on the floor forces the sequence; the agent invoked each stage. Every **guarantee** in this run belongs to a sub-stage's own checker (`validate.mjs`, `check-regress.mjs`, `check-verify.mjs`, `check-plan-lessons.mjs`, and the two pre-write hooks); `/pharn-dev-ship` added no new floor primitive. The one thing fix #7 pins here is that this stage could write only `SHIP.md`.

chain ran; the named floor verdicts are as shown — this is NOT a judgment that the increment is good or wise; that is the human's call at the post-review gate.
