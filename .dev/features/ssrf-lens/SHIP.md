# SHIP — ssrf lens (gated `/pharn-dev-ship` roll-up)

**Advisory roll-up.** `/pharn-dev-ship` ran PHARN's build loop in order and stopped at the human gate. It adds **no
new floor primitive** — every verdict below belongs to a sub-stage's own deterministic checker. This file records
**that the chain ran and its floor verdicts**; it is **not** a "shipped", an approval, or a `PHARN ✓ reviewed`
seal.

## Stages run (in order) + where the run ended

| # | stage             | structural verdict (read verbatim)                                  | source                                    |
| - | ----------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| 1 | `/pharn-dev-plan`  | plan written + **approved (GATE 1)** — human: _Approve as written_  | (human gate; scope confirmed = scoped set) |
| 2 | `/pharn-dev-grill` | ADVISORY — 2 minor concerns, 0 blocking (gates nothing)             | `GRILL.md`                                |
| 3 | `/pharn-dev-build` | **FLOOR: `validate.mjs` exit 0** → GREEN, 20 → 21 capabilities      | `.dev/floor/validate.mjs`                 |
| 4 | `/pharn-dev-regress` | **FLOOR: `regression-report.json` `.verdict` = `no-regressions`**   | `regression-report.json`                  |
| 5 | `/pharn-dev-verify` | **FLOOR: `verify-report.json` `.verdict` = `PASS`** (5 gates exit 0) | `verify-report.json`                      |
| 6 | `/pharn-dev-review` | ADVISORY — verdict GREEN, 0 floor-gate, 2 advisory-minor            | `REVIEW.md`                               |

**The run ended at GATE 2 (post-review).** No RED-verdict STOP occurred — every floor verdict came back GREEN/clean.

## Structural verdicts read (verbatim — the proceed/stop basis, P5)

- **`/pharn-dev-build`** → `node .dev/floor/validate.mjs .` **exit 0** (`FLOOR: GREEN — 21 capabilities checked`).
- **`/pharn-dev-regress`** → `regression-report.json` `.verdict` = **`"no-regressions"`** (all outside gates
  `tests`/`validate`/`structural:trust-fence` 0→0; `regressions: []`, `pre_existing: []`). A first capture bug
  (zsh word-splitting) was caught and corrected before the verdict — see `REGRESSION.md`.
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`** (`test`/`validate`/`lint`/`format:check`/
  `lint:md` all exit 0; `failing_gates: []`; 0 verifiers). A build-completeness `prettier --write` conformance
  was applied to newly-authored files and re-measured — disclosed in `VERIFY.md`.

## Advisory stages (pointers — cited, not restated, P4)

- **`GRILL.md`** — 2 minor advisory concerns (injection-immunity phrasing; per-family scanner-test coverage),
  both folded into the build. Gates nothing.
- **`REVIEW.md`** — GREEN; 0 floor-gate (blocking) findings; 2 advisory-minor observations (the `.fetch(`
  method-name breadth; `http-request`/bare-`axios(` covered at the scanner-test layer) + **1 proposed lesson
  candidate** (the zsh multi-file `node --test` capture bug) for a separate human-gated `/pharn-dev-memory-promote`.

## What landed (the increment)

The `ssrf` lens (`pharn-review/ssrf/`, `role: lens`, `enforces:[P2]`, `coupling: agnostic`) — reads untrusted CODE
and flags a request source (`req.*`) reaching an outbound-request URL sink (`fetch`/`http(s)`/`axios`) — backed by
the deterministic floor scanner `.dev/floor/scan-code-ssrf.mjs` (+ 23 hermetic tests) and 4 eval pairs. Capability
#21. Spec-hash `11cd9ad5…d1d969` held across grill → build → verify. Nothing committed, pushed, or sealed.

## Honest close (P0)

Chain ran; the named floor verdicts are as shown — **this is NOT a judgment that the increment is good or wise;
that is the human's call at the post-review gate.** `/pharn-dev-ship` does not merge, push, or apply the
`PHARN ✓ reviewed` seal. **Decision (merge / fix / abandon) is yours.**
