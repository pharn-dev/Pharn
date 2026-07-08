# VERIFY — template-mask-suppression-2

**Verdict** (owned by `.dev/floor/check-verify.mjs`, an exit-code threshold — PASS iff every gate exit 0; no LLM):

## FLOOR layer — deterministic gates (whole-repo, at HEAD)

| gate                      | exit | notes                                                                  |
| ------------------------- | ---- | ---------------------------------------------------------------------- |
| `test` (`npm test`)       | 0    | 703/703 pass — incl. the feature's 15 new ★ backtick-suppress fixtures |
| `validate` (`.dev/floor`) | 0    | GREEN — 36 capabilities                                                |
| `lint` (eslint)           | 0    | clean                                                                  |
| `format:check` (prettier) | 0    | clean (whole-repo — L9)                                                |
| `lint:md` (markdownlint)  | 0    | clean (whole-repo — L9)                                                |
| `structural:trust-fence`  | 0    | the one committed eval pair the repo ships — unaffected, still matches |

**VERIFIED: floor gates PASS.**

## ADVISORY layer — verifiers

`node .dev/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}` — **no verifiers registered — floor
gates only.** Step 2 is a no-op; the verdict is the floor gates alone (P7 — no verifier authored speculatively).

## Honest residual (P0/P7)

Verified = **the named gates passed** — nothing more. This is **not** a guarantee of correctness beyond what those
gates check: a defect no test/eval/rule/lint covers is invisible to the floor verdict, and the verifier layer that
might notice it is advisory (and empty today). The strongest correctness signal here is the feature's **own 15 ★
fixtures** — each written RED-before-GREEN (the backtick-suppress exploits were reproduced live returning
`found:false` against the unpatched scanners, then `found:true`/HIT after the `maskedForSuppression` port) — plus
the fence-robustness positives and the pinned ≥3-backtick residual bounds. That the named gates passed is a real
guarantee; "the feature is correct" is the human's call at the post-review gate.
