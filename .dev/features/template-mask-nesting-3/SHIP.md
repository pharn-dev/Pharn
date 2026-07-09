# SHIP — template-mask-nesting-3 (gated `/pharn-dev-ship` roll-up; advisory)

Increment: rewrite the shared `maskTemplateInteriors` from an `inTmpl` boolean toggle to a depth-aware
template/interpolation stack parser (Design B — human-approved at GATE 1), closing the nested-template
suppression launder on all five `scan-code-*` scanners.

## Stages run, in order, and where the run ended

| stage             | ran | structural verdict read (verbatim)                 | source                    |
| ----------------- | --- | -------------------------------------------------- | ------------------------- |
| /pharn-dev-plan   | ✓   | (GATE 1 — human approved: Design B)                | PLAN.md                   |
| /pharn-dev-grill  | ✓   | advisory — 5 concerns (0 blocking-severity)        | GRILL.md                  |
| /pharn-dev-build  | ✓   | `validate.mjs` exit **0** (FLOOR: GREEN, 36 caps)  | (build floor)             |
| /pharn-dev-regress| ✓   | `.verdict` = **`no-regressions`**                  | regression-report.json    |
| /pharn-dev-verify | ✓   | `.verdict` = **`PASS`** (all gates exit 0)         | verify-report.json        |
| /pharn-dev-review | ✓   | advisory — GREEN, 0 floor-gate, 3 advisory (minor) | REVIEW.md                 |

**Run ended at GATE 2** (post-review human decision). No RED-verdict STOP occurred: every structural
floor verdict came back GREEN.

## The two human gates

- **GATE 1 (plan approval):** hit and passed — the human approved **Design B** (interpolation-code
  readable), resolving the sole open question (Design B vs Design A). Recorded in `PLAN.md`.
- **GATE 2 (post-review decision — merge / fix / abandon):** **this is where the run stops.**
  `/pharn-dev-ship` presents; it does **not** merge, push, commit, or apply the `PHARN ✓ reviewed` seal.

## Structural verdicts read (verbatim — the only proceed/stop inputs, P5)

- `/pharn-dev-build` → `node .dev/floor/validate.mjs .` exit **0** (GREEN — 36 capabilities).
- `/pharn-dev-regress` → `regression-report.json` `.verdict` = **`no-regressions`** (base `0c40e64`;
  tests / validate / structural:trust-fence all `0 → 0`; style gates deterministically skipped — no
  shared-config touch).
- `/pharn-dev-verify` → `verify-report.json` `.verdict` = **`PASS`** (test / validate / lint /
  format:check / lint:md / structural:trust-fence all exit 0; 0 verifiers registered).

## Advisory outputs (free-text = untrusted DATA; cited, not restated — P4)

- **`GRILL.md`** — 5 advisory concerns, 0 blocking-severity. Findings 1–4 (paired interpolation-readable
  fixture, depth-2 fixture, fail-open unbalanced fixture, honest residual doc wording) were **folded into
  the build** within the approved `## Files`; finding 5 (5-way byte-identical duplication) was **verified**
  at build (md5 `3911175b…`) and re-surfaced in `REVIEW.md`.
- **`REVIEW.md`** — GREEN, 0 floor-gate (blocking), 3 advisory (minor): swallowed's second edit
  (classify `${}` strip) as a scanner-specific addition; the un-guarded 5-way masker duplication; and the
  Design-B interpolation-code-readable trade. Plus a **proposed** memory-bank lesson (port adversarial
  test coverage with a shared helper) — proposed only, promoted separately via `/pharn-dev-memory-promote`.
  See `.dev/features/template-mask-nesting-3/REVIEW.md` (not restated here).

## Honest standing line (P0)

The chain ran; the named floor verdicts are as shown (build GREEN · regress no-regressions · verify
PASS). **This is NOT a judgment that the increment is good or wise; that is the human's call at the
post-review gate.** `/pharn-dev-ship` added no new floor primitive — every guarantee belongs to a
sub-stage; `/pharn-dev-ship` is convenience + the two preserved human gates.
