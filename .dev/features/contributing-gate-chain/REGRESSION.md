# REGRESSION — contributing-gate-chain

**Base:** `HEAD` — resolved deterministically: `git status --porcelain` was non-empty (a working-tree
dogfood build), so the baseline is the committed state and the increment is the uncommitted diff.

## Inside / outside partition

Computed by `pharn/floor/check-regress.mjs scope`, not by hand.

**Inside (the changed scope) — 4 paths:**

- `CONTRIBUTING.md` — declared in the plan's `## Files`
- `SECURITY.md` — declared in the plan's `## Files`
- `.dev/features/contributing-gate-chain/PLAN.md` — `escape_exempt` (this stage's own artifact)
- `.dev/features/contributing-gate-chain/GRILL.md` — `escape_exempt` (this stage's own artifact)

**`escaped`: `[]`** — the build wrote nothing outside its declared `## Files`. The two feature
artifacts appear in `escape_exempt` rather than as escapes, each having been written by its own stage
under that stage's own Step-0 writes-scope.

**Outside gates run:** 68 test files, `validate` (whole-repo), and 1 committed eval pair
(`expected-injection-comment` ↔ `.dev/features/trust-fence/findings.json`). Both eval-pair paths were
confirmed readable **before** any exit code was recorded, so a setup error would have failed loudly as
a setup error rather than quietly as a gate verdict.

**Style gates (`lint` / `format:check` / `lint:md`): SKIPPED, deterministically.** The skip rule fires
only when `inside` touches a shared style config (`eslint.config.mjs`, `.prettierrc.json`,
`.prettierignore`, `.markdownlint-cli2.jsonc`); this increment touches none, so over the outside files
— byte-identical at base and head — a style result cannot flip. The gates are absent from **both**
maps, keeping the gate sets identical.

## Per-gate exit codes

| gate                                    | base | head | flip |
| --------------------------------------- | ---- | ---- | ---- |
| `tests` (68 outside test files)         | 0    | 0    | none |
| `validate` (whole-repo floor)           | 0    | 0    | none |
| `structural:expected-injection-comment` | 0    | 0    | none |

`regressions[]`: **empty**. `pre_existing[]`: **empty** — the baseline was genuinely green, so no red
had to be investigated or explained away.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

`pharn/floor/check-regress.mjs verdict` returned `"verdict": "no-regressions"` at **exit 0**. The
verdict is a floor-grade comparison of captured exit codes; it was not re-decided here.

**Honest residual (P0/P7).** This catches exactly what the suite catches, nothing more. The claim is
"deterministically-detectable breakage outside the feature is caught," **never** "nothing broke" — and
it is worth stating plainly for this increment in particular: the change is **prose in two governance
docs**, and no deterministic gate in this repo reads that prose for meaning. A sentence that is now
inaccurate would pass every gate above. That the enumeration matches `package.json` was verified
separately at build time by a direct comparison; it is not something this stage's verdict covers.
