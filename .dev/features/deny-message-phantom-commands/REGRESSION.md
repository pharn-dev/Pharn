# REGRESSION — deny-message-phantom-commands

**Base:** `dad655dc8218dd328a6d1208d504fd977bc04ed9` (working-tree dogfood → `base = HEAD`, resolved by
the deterministic state test: `git status --porcelain` non-empty).
**Machine report:** `.dev/features/deny-message-phantom-commands/regression-report.json` (the helper's
`verdict` JSON, verbatim).

## Partition (computed by `pharn/floor/check-regress.mjs scope`, not by hand — L17/L20)

**Inside (8)** — the changed scope, every path declared in the plan's `## Files` or exempt as a
stage-written artifact:

| path                                                                     | origin             |
| ------------------------------------------------------------------------ | ------------------ |
| `.claude/hooks/enforce-writes-scope.test.cjs`                            | declared           |
| `.claude/hooks/test.cjs`                                                 | declared (handoff) |
| `.dev/features/deny-message-phantom-commands/enforce-writes-scope.patch` | declared           |
| `SKILLS_VERSION`                                                         | declared           |
| `README.md`                                                              | declared           |
| `CHANGELOG.md`                                                           | declared           |
| `.dev/features/deny-message-phantom-commands/PLAN.md`                    | `escape_exempt`    |
| `.dev/features/deny-message-phantom-commands/GRILL.md`                   | `escape_exempt`    |

**`escaped: []` — no scope breach.** The two exempt entries are this feature's own stage artifacts,
each written by its own stage under that stage's own Step-0 writes-scope; they were read from the
helper's returned `escape_exempt` rather than hand-excluded.

**Outside:** 67 test files, 1 committed eval pair, plus whole-repo `validate`.

**Style gates SKIPPED** (deterministic, P5/P7): `inside` touches none of `eslint.config.mjs`,
`.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`. Over outside files — byte-identical
at base and head — a style result can flip only when shared config changes, so the flip is provably
impossible here. Skipped on **both** sides, so the gate sets match. This also avoids the `npm ci`
baseline cost (`LIMITS.md §3c` analog).

## Per-gate comparison

| gate                                    | base | head | result |
| --------------------------------------- | ---- | ---- | ------ |
| `tests` (67 outside test files)         | 0    | 0    | stable |
| `validate` (whole-repo floor)           | 0    | 0    | stable |
| `structural:expected-injection-comment` | 0    | 0    | stable |

`regressions[]`: **empty**. `pre_existing[]`: **empty** — the baseline was green on a repo believed
green, so no harness-fabricated red was recorded as a gate verdict (L5 / L16 / L21). The eval-pair
paths were confirmed readable **before** their exit code was recorded, so a setup error could not
masquerade as a structural-gate result.

The outside-tests list was expanded with the prescribed literal form
(`cat outside-tests.txt | xargs node --test`), not `node --test $LIST` and not the GNU-only
`xargs -a` — the two forms L22 pins as fabricating an equal-at-both-sides red.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
(`check-regress.mjs verdict` exit **0**, `"verdict": "no-regressions"`.)

**The honest residual (P0/P7).** This catches **exactly what the suite catches, nothing more.** A
regression no deterministic check covers is invisible to it. The claim is "deterministically-detectable
breakage outside the feature is caught" — **not** "nothing broke", and never that the increment is good.

**One thing this stage deliberately does NOT say.** The feature's own modified test file is **inside**
the partition, so the four new tests that currently fail against the **unpatched** live hook are not an
outside gate and correctly do not appear above. That failure is real, expected, and reported at
`/pharn-dev-verify` — it is the floor telling the truth about a human-only patch that has not been
applied yet, not a regression this stage is hiding.
