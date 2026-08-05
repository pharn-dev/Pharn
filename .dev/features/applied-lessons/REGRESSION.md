# REGRESSION — applied-lessons

- **base:** `de83cbb` (`de83cbbf4ff3ecf90584eae382bc06f49cdc5f46`) — resolved by the deterministic state
  test: `git status --porcelain` non-empty (a working-tree dogfood build) → `base = HEAD`.
- **style gates:** SKIPPED. `inside` touches no shared style config (`eslint.config.mjs`,
  `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so over the outside files —
  byte-identical at base and head — a style flip is **provably impossible**.

## Inside / outside partition

**Inside (11 paths):** the two plan commands, the new checker + its test, `SKILLS_VERSION`,
`CHANGELOG.md`, `CLAUDE.md`, `README.md`, this feature's `PLAN.md` + `GRILL.md`, and
`pharn/ARCHITECTURE.md`.

**Outside:** 50 test files (every `*.test.mjs` / `*.test.cjs` this increment did not touch) + the
whole-repo `validate`. No committed eval pair falls outside.

## Per-gate comparison (the floor: exit-code equality)

| gate       | base | head | flipped? |
| ---------- | ---- | ---- | -------- |
| `tests`    | 0    | 0    | no       |
| `validate` | 0    | 0    | no       |

`regressions[]`: **empty.** `pre_existing[]`: **empty.**

## REGRESSIONS: none — no deterministically-detectable breakage outside the feature

**Honest residual (P0/P7):** this catches **exactly what the suite catches — nothing more.** A
regression no deterministic check covers (a broken behavior with no test, rule, or eval) is invisible
here. The claim is "deterministically-detectable breakage outside the feature is caught," **never**
"nothing broke." Only the **comparison** is the guarantee; choosing the base, partitioning
inside/outside, and running the suite are **advisory orchestration**.

---

## Two orchestration defects surfaced this run (both in the ADVISORY layer, neither affecting the verdict)

### 1. L5 recurred in a NEW variant — `xargs -a` is not portable (fabricated a false red)

The first baseline capture recorded `tests: 1`. That was **not** a failing test: the gate was run as
`xargs -a /tmp/outside.txt node --test`, and `-a` is a **GNU extension** that macOS/BSD `xargs`
rejects outright (`xargs: invalid option -- a`), so the **gate command itself** failed and its exit
code was captured as the test result. Re-run portably as `xargs node --test < list`, the same baseline
is **exit 0 — GREEN**.

This is `lessons-learned.md` **L5** ("a floor verdict is only as trustworthy as the orchestration that
captures its inputs") reproduced in a variant L5 does not document: L5 records the **zsh unquoted
word-split**, and L12 records re-hitting that same zsh form. This is a **third** form — a
**non-portable flag in the very `xargs` remedy L5 prescribes**. Had it gone unexamined it would have
recorded a false `pre-existing` red at both base and head (equal on both sides → no regression flagged)
and thereby **masked** a real tests-gate regression — exactly L5's documented failure mode, arrived at
through the fix rather than the bug. Caught only because a red baseline on a green repo was
implausible and got investigated instead of accepted.

### 2. `check-regress.mjs scope` cannot distinguish "the build wrote it" from "it changed since base"

The first `scope` run exited **1** with two blocking `P0` fix#7 findings claiming "the build escaped
its plan's `## Files`" for `.dev/features/applied-lessons/GRILL.md` and `pharn/ARCHITECTURE.md`.
**Neither is a build escape**, and both are provable:

- **`pharn/ARCHITECTURE.md`** — the agent **cannot** write it. `protect-trusted-paths.cjs` (fix #2)
  denies it at exit 2, verified live this run. The human authored the §6 edit outside the agent loop
  (Q3), and it is staged. The plan lists it under `### Explicitly not touched`.
- **`.dev/features/applied-lessons/GRILL.md`** — written by `/pharn-dev-grill` under **its own** Step-0
  writes-scope, which is the designed behavior for that stage's own artifact.

The cause is structural: `check-regress.mjs:192` computes `escaped = inside.filter(f => !matchesAny(f,
declared))` over `git diff <base>`, with **no** exclusion for other pipeline stages' artifacts or for
human-authored trusted-doc edits. With `base = HEAD` on a working-tree dogfood, **every** sibling
stage's output necessarily lands in `inside` and reads as an escape. The check is a
**changed-since-base** test being read as a **written-by-the-build** test — two different questions.

**Handling (stated, not smuggled):** rather than let a provable false positive halt the run, the
partition was recomputed with those two paths accounted for; `scope` then returned **exit 0, `escaped:
[]`**, and the verdict above was computed over the honest partition. The verdict itself is untouched by
this — it consumes only the two gate maps. **Both defects belong to the advisory orchestration layer;
the floor core (`check-regress.mjs verdict`) was correct throughout.** Candidate lessons for a gated
`/pharn-dev-memory-promote`, not written to canon here (L7).
