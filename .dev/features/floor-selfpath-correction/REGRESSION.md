# REGRESSION — floor-selfpath-correction

Machine report: [`regression-report.json`](./regression-report.json) (the `check-regress.mjs verdict`
output, verbatim — byte-equivalence confirmed this run).

## Base

`1db762f13f5821a7266d447aa8fb8234bcdd3662` — resolved by the deterministic state test (P5):
`git status --porcelain` was non-empty (a working-tree dogfood build), so `base = HEAD`. All of the
increment's changes are unstaged, so this base **is** the pre-build state.

## Partition

`check-regress.mjs scope` exited **0** — **no scope breach.** Every changed path is inside the
declared writes.

| partition            | count | notes                                                                            |
| -------------------- | ----- | -------------------------------------------------------------------------------- |
| `inside`             | 63    | 61 from the plan's `## Files` + `PLAN.md` / `GRILL.md`                           |
| `outside_tests`      | 20    | `.claude/hooks/*.test.cjs`, `.dev/floor/*.test.mjs`, 6 untouched `pharn/floor/*` |
| `outside_eval_pairs` | 0     | no committed eval pair lies outside the feature                                  |

`PLAN.md` and `GRILL.md` are changed-but-not-in-`## Files`. That is **not** a fix #7 breach: they
were written by `/pharn-dev-plan` and `/pharn-dev-grill` under **their own** frontmatter `writes:`
scopes, not by `/pharn-dev-build`. They are counted as declared for the partition.

## Gates — `base → head` exit codes

Gate set decided once and applied identically on both sides (a mismatch would be `inconclusive`, not
a silent pass).

| gate           | base | head | result                  |
| -------------- | ---- | ---- | ----------------------- |
| `tests`        | 0    | 0    | no flip                 |
| `validate`     | 0    | 0    | no flip                 |
| `lint`         | —    | —    | **skipped** (see below) |
| `format:check` | —    | —    | **skipped** (see below) |
| `lint:md`      | —    | —    | **skipped** (see below) |

**Style-gate skip (deterministic, P5/P7).** `inside` touches no shared style config
(`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so over the
**outside** files — byte-identical at base and head — a style flip is _provably impossible_. Skipped
on both sides, absent from both maps. This also avoids the `npm ci` cost in the baseline worktree
(`LIMITS.md §3c` analog).

## A false RED caught during capture (recorded, not hidden — L5)

The first baseline capture reported `tests: 1`. That was **not** a failing test: the capture command
used `xargs -a <file>`, a **GNU** flag that BSD `xargs` (macOS default) rejects outright, so the gate
never ran. Re-run portably as `xargs node --test < <file>`, the baseline is genuinely `0`.

This is exactly the failure class `.dev/memory-bank/lessons-learned.md` **L5** warns about (cite, not
restate, P4): a harness-level arg-passing bug produces a bogus RED, and because it would have
appeared **equally at base and head**, the comparison would have classified it `pre_existing` and
**masked** any real `tests` regression underneath. The verdict below rests on the corrected capture.

## Regressions

- `regressions[]`: **none**
- `pre_existing[]`: **none**

## Verdict (FLOOR — `check-regress.mjs verdict`, exit 0)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

The verdict is a deterministic exit-code comparison, not a judgment: no gate flipped pass→fail. The
orchestration around it (base choice, inside/outside partition, running the suite) is **advisory**.

**Honest residual (P0/P7):** `/pharn-dev-regress` catches **exactly what its suite catches — nothing
more.** This says deterministically-detectable breakage outside the feature is absent; it does **not**
say "nothing broke." For this increment the residual is unusually load-bearing: the change is largely
**comment text**, which no deterministic gate asserts on at all. A comment rewritten into nonsense
would pass every gate here. What the suite _does_ pin down is the part that matters — the mock-fs
fixture keys asserting floor-dir exclusion are compared exactly, so a fixture inversion would have
turned `tests` RED.
