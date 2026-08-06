# REGRESSION — product-memory-promote

**Base:** `caf6e31a909964dda8d6babddd8cb5540eb3d550` — resolved by the deterministic state test
(`git status --porcelain` non-empty → a working-tree dogfood → `base = HEAD`), not chosen.

## Inside / outside partition

**Inside (8)** — the build's declared `## Files`, byte-identical to what `set-writes-scope.cjs --from-plan`
resolved at build Step 0 (`writes-scope set: 8 path(s)`):

`.claude/commands/pharn-memory-promote.md` · `pharn/floor/check-provenance.mjs` ·
`pharn/floor/check-provenance.test.mjs` · `.dev/floor/check-provenance.test.mjs` · `SKILLS_VERSION` ·
`CHANGELOG.md` · `CLAUDE.md` · `README.md`

**Outside gates run:** `tests` (55 outside `*.test.mjs` / `*.test.cjs` files) and `validate`.
**`outside_eval_pairs`: 0** — the one committed eval pair (trust-fence) is unaffected by this increment.

**Style gates (`lint` / `format:check` / `lint:md`) deliberately SKIPPED at both base and head.** The
deterministic skip rule fires because `inside` touches **no** shared style config — checked live:
`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc` are all untouched.
Over the **outside** files, which are byte-identical at base and head, a style result cannot flip without a
shared-config change, so the skip is sound rather than an optimization gamble. They are absent from **both**
maps, so the gate sets match and the comparison stays conclusive.

## Per-gate exit codes

| gate       | base (`caf6e31`) | head (working tree) | flipped? |
| ---------- | ---------------- | ------------------- | -------- |
| `tests`    | 0                | 0                   | no       |
| `validate` | 0                | 0                   | no       |

`regressions[]`: **none** · `pre_existing[]`: **none**

## Verdict (FLOOR — `pharn/floor/check-regress.mjs verdict`, exit 0)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

The verdict is a comparison of two exit-code maps. It rests entirely on `check-regress.mjs`; no model
judgment entered it, and none could have. Everything **around** it — resolving the base, partitioning
inside/outside, running the suite, capturing the baseline — is **advisory orchestration** (the two clocks).

**The honest residual (P0/P7):** `/pharn-dev-regress` catches **exactly what its suite catches — nothing
more.** A regression no deterministic check covers is invisible here. This says "deterministically-detectable
breakage outside the feature is caught," **never** "nothing broke."

## The `scope` step fired five FALSE blocking findings — L17, reproduced exactly

The first `scope` run exited **1** with five `[blocking] P0 fix#7` "the build escaped its `## Files`"
findings. **All five are false**, and this is not a judgment call — it is
`.dev/memory-bank/lessons-learned.md` **L17** reproducing on the correct, designed workflow (cited, not
restated — P4): `scope` computes `escaped` over `git diff <base>` with **no** exclusion for other pipeline
stages' own artifacts, so with `base = HEAD` on a working-tree dogfood **every** sibling stage's output
lands in `inside`. It is a **changed-since-base** test being reported as a **written-by-the-build** test.
The increment's `PLAN.md` pre-declared this under its `## Applied lessons` L17 line, and the `GRILL.md`
carried it forward, so it was predicted before it fired.

L17 warns that waving such a finding through is worse than not having the check, because it trains the
operator to dismiss the one finding that must never be dismissed. So each was **disproved**, not dismissed:

| flagged path                                    | real author                                                                      |
| ----------------------------------------------- | -------------------------------------------------------------------------------- |
| `.dev/features/product-memory-promote/PLAN.md`  | `/pharn-dev-plan` Step 0 (`writes-scope set: 1 path(s)`) — **before** the build  |
| `.dev/features/product-memory-promote/GRILL.md` | `/pharn-dev-grill` Step 0 (`writes-scope set: 1 path(s)`) — **before** the build |
| `.dev/PORT-1-memory-promote.md`                 | `mv` from the repo root **after** the build, at the human's explicit instruction |
| `.dev/PORT-2-lessons-index.md`                  | same `mv`                                                                        |
| `.dev/PORT-3-capability-catalog.md`             | same `mv`                                                                        |

**The deterministic disproof**, run live rather than argued: with `.pharn/writes-scope.json` set to the
**build's** scope, the fix #7 hook was fed a `Write` for each flagged path and returned **exit 2 (denied)**
every time. The build could not have written them — the same class of disproof L17 itself used (the fix #2
hook denying `pharn/ARCHITECTURE.md`). Independently: immediately after the build, `git status --porcelain`
showed **exactly** the 8 declared paths and nothing else.

Applying L17's second prescribed remedy — derive "written by the build" from the build's actual scope
rather than from the diff — `scope` re-run over the true build-written set returns
`escaped: []`, `findings: 0`, **exit 0**. Both runs are recorded here rather than only the clean one.

**Not fixed here (P7, and out of this increment's `## Files`):** the defect is in `scope`'s advisory
orchestration layer, not in the verdict core, which was correct throughout. L17 remains open and this run
is a second live instance of it.

## One anomaly, investigated rather than recorded (L16)

Between this increment's `npm run docs:generate` and the regress run, `README.md` **reverted** to its `HEAD`
content (back to "Product commands — 9 / Floor checkers — 37"), and `npm run docs:check` went RED with
`README_DRIFT`. No stage of this pipeline wrote it in that window; its mtime (`22:13:10`) is **later** than
every file this build wrote (`CHANGELOG.md` 22:09:35, `CLAUDE.md` 22:09:15, `SKILLS_VERSION` 22:08:13), so
the write came from outside the agent loop. It was **regenerated** (`npm run docs:generate` → "Product
commands — 10 / Floor checkers — 38", `docs:check` exit 0) **before** the baseline and head gates were
captured, so both sides measured the same, correct tree. Recorded because a red on a provably-green repo is
a signal to investigate the harness, never to accept — and because the correction landed before the
measurement, not after it.
