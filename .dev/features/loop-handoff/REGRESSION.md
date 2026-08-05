# REGRESSION — loop-handoff

**Base:** `59def15eade582f2df662ab2129d107667267790` (`feat(docs): generated lessons index…`, #115).
Resolved deterministically: `git status --porcelain` was non-empty (a working-tree dogfood build), so
`base = HEAD` per the command's Step-1 state test — not chosen.

## Inside / outside partition

`inside` (8 paths) is exactly the approved plan's `## Files`, and
`node pharn/floor/check-regress.mjs scope` exited **0** — **no fix #7 scope breach**: every changed path
the partition was given is one the plan declared.

| inside (the feature's declared scope)    |
| ---------------------------------------- |
| `pharn/pharn-contracts/loop-record.md`   |
| `pharn/floor/check-loop-record.mjs`      |
| `pharn/floor/check-loop-record.test.mjs` |
| `.claude/commands/pharn-loop.md`         |
| `CHANGELOG.md`                           |
| `CLAUDE.md`                              |
| `SKILLS_VERSION`                         |
| `README.md`                              |

**Outside:** 55 test files + `validate` (whole-repo) + 1 committed eval pair
(`expected-injection-comment.json` ↔ `.dev/features/trust-fence/findings.json`).

### L17 applied — two paths were EXCLUDED from `--changed`, deliberately and visibly

`git diff --name-only HEAD` plus untracked also returned **`.dev/features/loop-handoff/PLAN.md`** and
**`.dev/features/loop-handoff/GRILL.md`**. Both were excluded from the `--changed` list passed to
`scope`, because `check-regress.mjs scope` tests **changed-since-base**, not **written-by-the-build**
(`.dev/memory-bank/lessons-learned.md` **L17**, cited not restated — P4). With `base = HEAD` on a
working-tree dogfood, every **sibling stage's own** artifact lands in the diff, and each of these two was
written by `/pharn-dev-plan` and `/pharn-dev-grill` under **their own** Step-0 writes-scopes, by design —
so including them would have produced a **blocking, provably false** "the build escaped its `## Files`"
finding. That is the failure L17 documents: a fail-closed P0 finding that fires on the correct workflow
trains the operator to wave through the one finding that must never be waved through.

**Stated as an exclusion, not hidden:** these two paths were **not** measured for scope compliance this
run. The remedy still lives in the orchestration layer — L17's fix (exclude the feature's own
`.dev/features/<name>/**` artifacts, or derive "written by the build" from `.pharn/writes-scope.json`) is
**canon-but-unimplemented** in `.claude/commands/pharn-dev-regress.md`, so it was applied by hand here.
Follow-up: `regress-scope-question`.

## Gate results — base → head (exit codes, never stdout)

The gate set was decided once and applied identically on both sides (a mismatch would be
`inconclusive`, never a silent pass).

| gate                                    | base | head | flip |
| --------------------------------------- | ---- | ---- | ---- |
| `tests` (55 outside test files)         | 0    | 0    | none |
| `validate` (whole-repo)                 | 0    | 0    | none |
| `structural:expected-injection-comment` | 0    | 0    | none |

- **`regressions[]`:** none.
- **`pre_existing[]`:** none — the baseline was green on every gate.
- **Style gates (`lint` / `format:check` / `lint:md`) were SKIPPED, deterministically.** `inside` touches
  no shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`,
  `.markdownlint-cli2.jsonc`), so over files byte-identical at base and head a style result **cannot**
  flip — the skip is provable, not a shortcut, and the gates are absent from **both** maps. (They were
  nonetheless run at HEAD as part of `npm run check` during the build, exit 0.)
- **L5 / L16 honored in the capture:** the 55-file list was expanded through `xargs … < list` (stdin —
  portable), never `node --test $LIST` (zsh does not word-split, fabricating a false equal-sided red) and
  never `xargs -a` (a GNU-only flag BSD `xargs` rejects outright). The baseline came back green on a
  repo whose `npm run check` is green — the consistent, expected result rather than one to investigate.

## Verdict (FLOOR — `check-regress.mjs`, exit 0)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

The verdict is a comparison of captured exit codes, computed by `pharn/floor/check-regress.mjs`, with
zero LLM judgment in its core. Everything around it — resolving the base, partitioning inside/outside,
excluding the two L17 paths, running the suite — is **advisory orchestration**, and the L17 exclusion
above is the clearest instance of why that distinction matters here.

**Honest residual (P0/P7):** `/pharn-dev-regress` catches **exactly what its suite catches, and nothing
more**. A regression no deterministic check covers is invisible to it. "No regressions" means
_deterministically-detectable breakage outside the feature was not found_ — it does **not** mean nothing
broke, and it certifies the **comparison**, never the feature.

**One further honest note (L19).** `regression-report.json` was written by a Bash redirect (the command
requires it to stay the helper's `verdict` JSON **verbatim**, so no formatter and no Write-tool render
touch it). The fix #7 scope was correctly pinned to that exact path first, but the pre-write hook gates
`Write|Edit|MultiEdit` only — so the write **landed where the scope allowed without the gate enforcing
it**. Benign here, and recorded because L19's whole point is that this class of write leaves no trace
except a file in the diff nobody declared.
