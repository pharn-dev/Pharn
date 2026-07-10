# VERIFY — pharn-runtime-layout

## FLOOR layer — deterministic gates (owns the verdict)

| gate                       | exit | notes                                                                                 |
| -------------------------- | ---- | ------------------------------------------------------------------------------------- |
| `test`                     | 0    | full hermetic suite (726 tests) incl. moved floor + edited hook/variance tests        |
| `validate`                 | 0    | `pharn/floor/validate.mjs .` — GREEN, 36 capabilities                                 |
| `lint`                     | 0    | eslint clean                                                                          |
| `format:check`             | 0    | prettier clean (whole repo)                                                           |
| `lint:md`                  | 0    | markdownlint clean (whole repo)                                                       |
| `structural:…trust-fence…` | 0    | the one committed eval pair — 6 structural assertions pass, needle stays in free-text |

**Deterministic verdict (`pharn/floor/check-verify.mjs`, exit 0): VERIFIED — floor gates PASS.** `failing_gates: []`.

## ADVISORY layer — verifiers

`pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}` — **no verifiers registered — floor gates only.** (No verifier authored speculatively, P7.)

## What verify caught and corrected (build-completion within this increment)

The verify structural gate did its job — it surfaced gaps the earlier `validate`/`npm test` gates structurally cannot see (neither checks eval-file path resolution):

1. **The `.md`-only rewrite missed the `.json` eval-expected files.** The build's "prefix all occurrences" (OQ2) was applied via a `find -name '*.md'` pass, so ~68 `.json` eval-expected files under the moved trees kept stale `pharn-review/…` paths — including the one the standing structural gate checks. Fixed: guarded rewrite over all `.json` under the moved product trees (zero double-prefix).
2. **The standing eval's committed actual** (`.dev/features/trust-fence/findings.json`) still cited the old path; updated to `pharn/pharn-review/…` so actual↔expected agree.
3. **Regress-artifact style** (`REGRESSION.md` table) was not prettier/markdownlint-clean (the regress stage has no format step, L9); formatted.

After these, all six gates are green and the verdict is PASS.

## Honest residual (P0/P7)

Verified = **the named gates passed** — nothing more. This is NOT a guarantee the relocation is correct in any sense the suite does not encode; a defect no test/eval/rule/lint/structural-gate covers is invisible to this verdict, and the verifier layer that might notice it is empty today (advisory by construction anyway). The trusted-doc byte-identity (move-not-edit) and the fail-closed writes-scope posture are separately proven by the build's sha256 check and the hook self-tests, cited in SHIP.md.
