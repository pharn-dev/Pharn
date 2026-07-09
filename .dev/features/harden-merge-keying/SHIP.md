# SHIP — harden-merge-keying (advisory roll-up)

`/pharn-dev-ship` ran the gated build loop in order. This roll-up records **that the chain ran and its
floor verdicts** — it is NOT a judgment that the increment is good, and NOT a seal.

## Stages run, in order, and where the run ended

| stage                | structural verdict (read verbatim)                              | source                                         |
| -------------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| `/pharn-dev-plan`    | GATE 1 — human **approved as written**                          | AskUserQuestion (FIX 1 = Option A; all-in-one) |
| `/pharn-dev-grill`   | advisory — 4 concerns (0 blocking)                              | `GRILL.md` (gates nothing)                     |
| `/pharn-dev-build`   | **FLOOR**: `validate.mjs` exit **0** (GREEN)                    | 36 capabilities                                |
| `/pharn-dev-regress` | **FLOOR**: `regression-report.json .verdict` = `no-regressions` | exit 0                                         |
| `/pharn-dev-verify`  | **FLOOR**: `verify-report.json .verdict` = `PASS`               | exit 0 (6/6 gates green)                       |
| `/pharn-dev-review`  | advisory — GREEN, 0 floor-gate findings                         | `REVIEW.md` (GATE 2)                           |

**The run ended at GATE 2 (post-review).** No RED-verdict STOP occurred — every floor verdict was GREEN.

## Structural verdicts, verbatim (the only floor-grade content here)

- `/pharn-dev-build` → `node .dev/floor/validate.mjs .` exit **0** — `FLOOR: GREEN — 36 capabilities`.
- `/pharn-dev-regress` → `.dev/features/harden-merge-keying/regression-report.json` `.verdict` =
  **`no-regressions`** (all 3 outside gates 0→0; `escaped: []`, fix #7 clean; base `3c30b16`).
- `/pharn-dev-verify` → `.dev/features/harden-merge-keying/verify-report.json` `.verdict` = **`PASS`**
  (`test`, `validate`, `lint`, `format:check`, `lint:md`, `structural:expected-injection-comment` all 0;
  `failing_gates: []`; 0 verifiers registered → floor gates only).

## What landed

`.dev/floor/merge-findings.mjs` + `.dev/floor/merge-findings.test.mjs` (one axis; `escaped: []`):

- **FIX 1** — `RULE_ID_OK` now composes `isCleanScalar` (control-char guard) with a shape whitelist
  (`^P[0-7]$` | `<file>.md <ID>-<n>`, case-insensitive); a prose instruction in `rule_id` is dropped
  before keying. Shape guarantee, **not** roster membership (no roster exists — surfaced + resolved at
  GATE 1).
- **FIX 2** — `canonFile` collapses leading `./` and trailing `:col` so lens format drift → one key.
- **Secondary** — per-source `severity` carried in `sources[]`; `rule_id` trim/case-folded for the key
  with a deterministic lexicographic-min representative.
- Two `/pharn-dev-grill` **important** findings were folded into the implementation (regex-after-guard;
  order-invariant representative), each with a dedicated test. 17/17 tests green.

## Pointers (cited, not restated — P4)

- Interrogation: `.dev/features/harden-merge-keying/GRILL.md` (advisory).
- Review: `.dev/features/harden-merge-keying/REVIEW.md` (advisory; GREEN, 1 minor advisory + 1 proposed
  lesson candidate for a human-gated `/pharn-dev-memory-promote`).

## Standing decision

Chain ran; the named floor verdicts are as shown — this is **NOT** a judgment that the increment is good
or wise; that is the human's call at the post-review gate. `/pharn-dev-ship` does not merge, push, commit,
or seal.
