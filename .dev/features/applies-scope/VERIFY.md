# VERIFY — applies-scope

Was `applies-scope` built **correctly**? Two layers, kept strictly separate (P0/fix #3): the **FLOOR
layer** owns the pass/fail verdict (deterministic exit-code threshold, `.dev/floor/check-verify.mjs`);
the **ADVISORY layer** (verifiers) only annotates — and today there are none.

## FLOOR layer — deterministic gates (own the verdict)

| gate                           | exit | meaning                                                        |
| ------------------------------ | ---- | -------------------------------------------------------------- |
| `test`                         | 0    | `npm test` — 663 tests incl. the feature's 2 new applies tests |
| `validate`                     | 0    | whole-repo floor GREEN (35 capabilities, applies enum-valid)   |
| `lint`                         | 0    | eslint clean                                                   |
| `format:check`                 | 0    | prettier clean (whole-repo — L9 coverage)                      |
| `lint:md`                      | 0    | markdownlint clean (whole-repo — L9 coverage)                  |
| `structural:injection-comment` | 0    | trust-fence committed eval pair (expected ↔ findings) resolves |

**Verdict:** **VERIFIED: floor gates PASS** (`check-verify.mjs` → `"PASS"`, exit 0; `failing_gates: []`).

## ADVISORY layer — verifiers

**No verifiers registered — floor gates only.** `count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.
Zero `role: verifier` capabilities exist (P7 — none authored speculatively), so Step 2 is a no-op and the
verdict is the floor gates alone. `verifiers: { registered: 0, findings: [] }`.

## Honest residual (P0/P7)

Verified = **the named gates passed** — nothing more. This is **not** a guarantee of correctness beyond
what those gates check: a defect no test / eval / rule / lint covers is invisible to the floor verdict,
and the verifier layer that might catch it is advisory and currently empty. The two GRILL `important`
findings (no current consumer of `applies:`; §3.1 doesn't yet list the field) are **not** gate failures —
they are human-accepted design tensions, outside what these deterministic gates check.

## Build-hygiene note (L9 — transparency)

The first gate run flipped `format:check` to **1**: the regress artifact `REGRESSION.md` had been written
unformatted (the `/pharn-dev-regress` stage has no Step-2b-style formatter for its own artifact, so verify's
whole-repo `format:check` caught it — exactly the L9 surprise). It was fixed with `prettier --write`
(cosmetic table alignment, content unchanged) and all six gates then passed. Candidate lesson: the
regress/verify stages could format their own pipeline artifacts before halting, as `/pharn-dev-build` Step 2b
does for build outputs.

## GATE-2 re-run

After the GATE-2 adjustments, all six FLOOR gates were re-run on the final state — every gate **0**;
**verdict `PASS`** (`check-verify.mjs`, exit 0). `verify-report.json` reflects this. The required-`applies:`
change added a "missing applies → RED" test plus `applies:` on the green fixture + `VALID_CAP`; the full
`npm test` suite passes with the new case included.
