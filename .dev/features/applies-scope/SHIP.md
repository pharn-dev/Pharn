# SHIP — applies-scope (gated chain roll-up; advisory)

`/pharn-dev-ship` ran the gated build loop in order, then the human made post-review adjustments at
GATE 2 and had them re-verified. This roll-up records **that the chain ran and its floor verdicts** — it
is **not** a self-issued "shipped", an approval, or a `PHARN ✓ reviewed` seal. `/pharn-dev-ship` adds
**no** floor primitive; every verdict below belongs to a sub-stage.

## Stages that ran, in order

| #   | stage                | structural verdict (verbatim)                                      | proceed?                |
| --- | -------------------- | ------------------------------------------------------------------ | ----------------------- |
| 1   | `/pharn-dev-plan`    | — (GATE 1: human approved "as written")                            | ✓ approved              |
| 2   | `/pharn-dev-grill`   | advisory (no verdict): 0 blocking, 2 important, 2 minor            | ✓ (grill gates nothing) |
| 3   | `/pharn-dev-build`   | `validate.mjs` exit **0** — FLOOR: GREEN (35 caps)                 | ✓ proceed               |
| 4   | `/pharn-dev-regress` | `regression-report.json` .verdict = **`no-regressions`**           | ✓ proceed               |
| 5   | `/pharn-dev-verify`  | `verify-report.json` .verdict = **`PASS`**                         | ✓ proceed               |
| 6   | `/pharn-dev-review`  | advisory (no structural verdict): **GREEN, 0 floor-gate findings** | → GATE 2                |

**Where the run ended:** at **GATE 2**, where the human chose to **adjust before committing**. No
RED-verdict STOP occurred; every gated stage came back GREEN, at run 1 and after the GATE-2 re-run.

## GATE-2 adjustments (human-directed, then re-verified)

Three refinements were applied within the (expanded) plan `## Files`, then `/pharn-dev-regress` +
`/pharn-dev-verify` were **re-run** — verdicts unchanged:

1. **DB concerns → `["backend","ssr"]`** — `migrations`, `n-plus-one` (SSR apps can own a DB).
2. **Server-only lenses → `["backend","ssr"]`** — `ssrf`, `path-traversal`, `unsafe-deserialization`
   (need a server; a pure SPA/lib cannot exhibit them). Cross-cutting lenses stay `["universal"]`.
3. **`applies:` made REQUIRED** — `validate.mjs` CHECK 4b: absent/empty → RED (subsumes the empty-`[]`
   boundary). Reverses the GATE-1 optional choice; `## Files` expanded to add `applies:` to
   `.dev/floor/test-fixtures/green/skill.md` (so the GREEN-fixture test holds) + `VALID_CAP` + a
   "missing applies → RED" test.

## The structural verdicts (verbatim — the only floor-grade content here)

- **`/pharn-dev-build`** (run 1, committed 3c087b4) → `validate.mjs` exit **0** (`FLOOR: GREEN`).
- **`/pharn-dev-regress`** (re-run, base `f245e9d`, inside 38) → **`"no-regressions"`** (every outside gate 0→0).
- **`/pharn-dev-verify`** (re-run) → **`"PASS"`** (`test`, `validate`, `lint`, `format:check`, `lint:md`, `structural:injection-comment` all 0).

## Pointers (cited, not restated — P4)

- **`REVIEW.md`** — 4-lens review, verdict GREEN, 0 floor-gate findings (+ GATE-2 addendum: 2 advisory
  findings resolved by the adjustments). **`GRILL.md`** — advisory interrogation.
- **`PLAN.md`** (GATE-2-updated `## Files` + decisions), **`REGRESSION.md`** / **`VERIFY.md`** +
  `regression-report.json` / `verify-report.json` — the per-stage artifacts and machine verdicts.

## What `/pharn-dev-ship` did NOT do

No merge, no seal, no self-approval. The first build was committed + pushed as **3c087b4** on branch
`applies-scope` (by the human/tooling); the GATE-2 refinements are a **second** commit on the same
branch (3c087b4 is pushed — never amended/force-pushed). Nothing outside the plan's `## Files` was
written by the build (fix #7 held; regress partition `escaped: []`).

---

**Chain ran; the named floor verdicts are as shown — this is NOT a judgment that the increment is good
or wise. That is the human's call.**
