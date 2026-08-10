# REGRESSION — spec-hash-eol-normalize

Base: `207f4af970f95a9ad70430938482a9656aba9c4d` (working-tree dogfood — `git status --porcelain` was non-empty, so the deterministic base test resolved `base = HEAD`).
Verdict source: `pharn/floor/check-regress.mjs verdict` — exit **0**. Machine report: `.dev/features/spec-hash-eol-normalize/regression-report.json` (the helper's JSON verbatim).

## Inside / outside partition

`inside` (7 paths) matched the plan's `## Files` exactly — **`escaped: []`**, no fix #7 scope breach:

`.gitattributes` · `CHANGELOG.md` · `SKILLS_VERSION` · `pharn/floor/check-spec.mjs` · `pharn/floor/check-spec.test.mjs` · `pharn/floor/check-spec-approved.test.mjs` · `pharn/floor/check-plan-spec-agree.test.mjs`

`outside`: **57** test files, **0** eval pairs.

### L17 applied — the 11th recorded occurrence

The raw `git diff` also contained `.dev/features/spec-hash-eol-normalize/PLAN.md` and `GRILL.md`, and `check-regress.mjs scope` initially reported both as **escaped** with a blocking `P0` fix#7 finding. Both are **false**: each was written by its own stage (`/pharn-dev-plan`, `/pharn-dev-grill`) under that stage's own Step-0 writes-scope, exactly as designed. This is precisely what `.dev/memory-bank/lessons-learned.md` **L17** documents — the check asks _changed-since-base_ while reporting _written-by-the-build_, and with `base = HEAD` on a working-tree dogfood every sibling stage's artifact lands in `inside`. L17's prescribed remedy (exclude the feature's own `.dev/features/<name>/**` pipeline artifacts) was applied, after which `escaped` is empty. Recorded rather than waved through, per L17's own warning that a fail-closed blocking finding firing on the correct workflow trains the operator to ignore the one finding that must never be ignored.

**Counted, not estimated:** `grep -rl 'L17' .dev/features/*/REGRESSION.md` returns **12** files, of which `format-step-scope` explicitly records that the class did **not** fire — so this run is the **11th** occurrence where the discipline-only remedy had to be applied by hand. That count is the evidence behind this increment's proposed lesson candidate (see `REVIEW.md`), because **L20** sets the escalation trigger at the _second_ occurrence.

## Per-gate exit codes

| gate       | base | head | flip |
| ---------- | ---- | ---- | ---- |
| `tests`    | 0    | 0    | none |
| `validate` | 0    | 0    | none |

Baseline captured in an isolated `git worktree --detach` at the base SHA (removed afterwards); HEAD captured in the working tree. Identical gate-ids on both sides, so the comparison is well-formed rather than inconclusive.

**Style gates deliberately absent from BOTH maps.** `lint` / `format:check` / `lint:md` were skipped by the deterministic config-touch rule: `inside` touches no shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`). `.gitattributes` is **not** one of them — it configures git's working-tree checkout, not any formatter or linter — so over the outside files, byte-identical at base and head, a style result cannot flip. The skip also avoids an `npm ci` in the baseline worktree.

**L5 / L16 applied to the input capture.** The 57-file list was expanded through **stdin** `xargs node --test < list` — never `node --test $LIST` (under zsh an unquoted expansion is not word-split, which fabricates a false equal-on-both-sides red and masks a real tests-gate regression), and never `xargs -a` (a GNU extension that macOS/BSD `xargs` rejects outright, reaching the same failure through L5's own remedy).

## Verdict

REGRESSIONS: none — no deterministically-detectable breakage outside the feature.

`regressions: []`, `pre_existing: []`.

**The honest residual (P0/P7):** this catches **exactly what its suite catches, nothing more.** A regression no deterministic check covers — a broken behavior with no test, rule, or eval — is invisible here. The claim is "deterministically-detectable breakage outside the feature is caught," **never** "nothing broke," and never that the feature itself is good. The verdict is floor-grade because `check-regress.mjs` compared two exit-code maps; everything around it — choosing the base, partitioning inside/outside, running the suite — is advisory work that produced those inputs.

One narrowing specific to this increment: `base = HEAD` means the baseline is the pre-build commit `207f4af`, so the comparison genuinely brackets this build. But the increment's own new tests live **inside**, so they are correctly not part of the outside gate — their evidence is the build step's paired mutant run, not this stage.
