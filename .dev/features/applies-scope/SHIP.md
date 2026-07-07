# SHIP — applies-scope (gated chain roll-up; advisory)

`/pharn-dev-ship` ran the gated build loop in order. This roll-up records **that the chain ran and its
floor verdicts** — it is **not** a self-issued "shipped", an approval, or a `PHARN ✓ reviewed` seal.
`/pharn-dev-ship` adds **no** floor primitive; every verdict below belongs to a sub-stage.

## Stages that ran, in order

| #   | stage                | structural verdict (read verbatim)                                 | proceed?                |
| --- | -------------------- | ------------------------------------------------------------------ | ----------------------- |
| 1   | `/pharn-dev-plan`    | — (GATE 1: human approved "as written")                            | ✓ approved              |
| 2   | `/pharn-dev-grill`   | advisory (no verdict): 0 blocking, 2 imp, 2 min                    | ✓ (grill gates nothing) |
| 3   | `/pharn-dev-build`   | `validate.mjs` exit **0** — FLOOR: GREEN (35 caps)                 | ✓ proceed               |
| 4   | `/pharn-dev-regress` | `regression-report.json` .verdict = **`no-regressions`**           | ✓ proceed               |
| 5   | `/pharn-dev-verify`  | `verify-report.json` .verdict = **`PASS`**                         | ✓ proceed               |
| 6   | `/pharn-dev-review`  | advisory (no structural verdict): **GREEN, 0 floor-gate findings** | → GATE 2                |

**Where the run ended:** at **GATE 2** — the post-review human decision (merge / fix / abandon). No
RED-verdict STOP occurred; every gated stage came back GREEN.

## The structural verdicts (verbatim — the only floor-grade content here)

- **`/pharn-dev-build`** → `node .dev/floor/validate.mjs .` exit **0** (`FLOOR: GREEN — 35 capabilities checked`).
- **`/pharn-dev-regress`** → `check-regress.mjs verdict` = **`"no-regressions"`** (every outside gate 0→0; `regressions: []`).
- **`/pharn-dev-verify`** → `check-verify.mjs` = **`"PASS"`** (`test`, `validate`, `lint`, `format:check`, `lint:md`, `structural:injection-comment` all 0; `failing_gates: []`).

_(One in-flight correction, logged for honesty: `/pharn-dev-verify`'s first gate pass flipped `format:check` to 1
because the `/pharn-dev-regress` artifact `REGRESSION.md` was written unformatted; fixed with `prettier --write`
— cosmetic — and all six gates then passed. Detail in `VERIFY.md`; proposed as an L9 lesson candidate in
`REVIEW.md`.)_

## Pointers (cited, not restated — P4)

- **`.dev/features/applies-scope/REVIEW.md`** — the 4-lens review: verdict GREEN, 0 floor-gate findings,
  4 advisory findings (2 human-accepted `important` design tensions, 2 `minor`) + 1 proposed lesson.
- **`.dev/features/applies-scope/GRILL.md`** — advisory interrogation (0 blocking, 2 important, 2 minor).
- **`.dev/features/applies-scope/{PLAN,REGRESSION,VERIFY}.md`** + `{regression,verify}-report.json` — the
  per-stage artifacts and machine verdicts.

## What `/pharn-dev-ship` did NOT do

No merge, no commit, no push, no seal, no self-approval. Reaching GATE 2 is permission to **present**,
not to act. Nothing outside the plan's `## Files` was written by the build (fix #7 held; regress scope
partition `escaped: []`); each stage wrote only its own artifact under its own writes-scope.

---

**Chain ran; the named floor verdicts are as shown — this is NOT a judgment that the increment is good
or wise. That is the human's call at the post-review gate (GATE 2).**
