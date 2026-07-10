# SHIP — pharn-runtime-layout (gated `/pharn-dev-ship` roll-up)

**What this is:** an advisory record that the gated chain ran and its floor verdicts. It is **not** a judgment that the increment is good or wise, and **not** a merge/ship/seal — that is the human's call at the post-review gate below.

## Stages run, in order

| #   | stage                | structural verdict read                                                     | result                                                                  |
| --- | -------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | human approval halt (**GATE 1**)                                            | Approved as written (+ human-approved amendment: CLAUDE/README fold-in) |
| 2   | `/pharn-dev-grill`   | advisory — no deterministic verdict                                         | 6 concerns (0 blocking); folded #3 into scope                           |
| 3   | `/pharn-dev-build`   | `pharn/floor/validate.mjs .` **exit 0** (GREEN)                             | proceed                                                                 |
| 4   | `/pharn-dev-regress` | `regression-report.json .verdict` = **`no-regressions`**                    | proceed                                                                 |
| 5   | `/pharn-dev-verify`  | `verify-report.json .verdict` = **`PASS`**                                  | proceed                                                                 |
| 6   | `/pharn-dev-review`  | no structural verdict (advisory lenses); floor GREEN already gated by 3 & 5 | **GATE 2**                                                              |

**Ended at: GATE 2** (post-review human decision) — not a RED-verdict STOP.

## Structural verdicts, verbatim

- `/pharn-dev-build` → `validate` exit code: **0** (GREEN, 36 capabilities).
- `/pharn-dev-regress` → `regression-report.json` `.verdict`: **`no-regressions`** (`regressions: []`, `pre_existing: []`; base `23d16b8` → head `4bcc71c`; 5 outside gates 0→0).
- `/pharn-dev-verify` → `verify-report.json` `.verdict`: **`PASS`** (6 gates all exit 0: test, validate, lint, format:check, lint:md, structural:trust-fence; 0 verifiers registered).

## What landed

The whole product surface relocated under `pharn/` — 2 trusted docs (pure `git mv`, sha256 byte-identical), the `pharn-contracts`/`pharn-core`/`pharn-pipeline`/`pharn-review` trees, and 18 product floor checkers + fixtures; 8 dev-only checkers + the `variance` fixture stayed at `.dev/floor/`. ~560 path references rewritten (guarded, zero double-prefix) across `.md` + `.json` eval files + commands + current docs + configs. Trusted-doc write-protection (fix#2) and the fail-closed writes-scope posture (fix#7, ported to `pharn/pharn-*/**`) both re-verified by hook self-tests; the fix#4 formatter-exclusion safeguard was re-pointed to the moved trusted docs.

## Pointers (cite, do not restate — P4)

- Advisory review: `.dev/features/pharn-runtime-layout/REVIEW.md` — **GREEN, 0 blocking, 4 advisory findings** + a proposed memory-bank lesson (json-rewrite coverage).
- Advisory grill: `.dev/features/pharn-runtime-layout/GRILL.md`.
- Machine reports: `regression-report.json`, `verify-report.json`.

## For the human at GATE 2 — decisions/notes surfaced (not acted on)

1. **A commit already exists.** The working tree was committed onto branch `pharn-runtime-layout` as `4bcc71c` mid-run, external to the agent's tool calls (`/pharn-dev-ship` never commits). **Post-run fixes (the ~68 `.json` eval rewrites, artifact formatting) are UNCOMMITTED** on top of `4bcc71c` — you will want to amend/commit them before opening the PR.
2. **REVIEW finding #1 (important):** the build's `.md`-only rewrite missed the `.json` eval files; verify caught it and it is fixed, but the proposed lesson is worth promoting via `/pharn-dev-memory-promote`.
3. **Deferred (agreed):** CHANGELOG + memory-bank left as point-in-time; CLAUDE.md "(root)" framing word (minor P4); THREAT-MODEL/LIMITS prose citations in product commands (pre-existing, separate increment).

---

Chain ran; the named floor verdicts are as shown — this is **NOT** a judgment that the increment is good or wise; that is the human's call at the post-review gate.
