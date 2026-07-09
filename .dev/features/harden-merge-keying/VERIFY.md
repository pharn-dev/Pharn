# VERIFY — harden-merge-keying

Feature verified at HEAD (working tree with the increment present). Two layers, kept strictly separate:
the FLOOR gates own the verdict; the verifier layer only annotates (zero registered today).

## FLOOR layer — deterministic gates (own the verdict)

| gate                                    | exit | meaning                                                            |
| --------------------------------------- | ---- | ------------------------------------------------------------------ |
| `test`                                  | 0    | `npm test` — full hermetic suite incl. the 17 merge-findings tests |
| `validate`                              | 0    | `.dev/floor/validate.mjs .` — structural floor GREEN (36 caps)     |
| `lint`                                  | 0    | eslint clean                                                       |
| `format:check`                          | 0    | prettier clean (whole-repo)                                        |
| `lint:md`                               | 0    | markdownlint clean (whole-repo)                                    |
| `structural:expected-injection-comment` | 0    | the one committed eval pair (trust-fence) still conforms           |

**Verdict (floor — `check-verify.mjs`, exit 0): VERIFIED: floor gates PASS.** `failing_gates: []`.

## ADVISORY layer — verifiers

**No verifiers registered — floor gates only.** `node .dev/floor/count-verifiers.mjs .` →
`{"registered":0,"verifiers":[]}` (deterministic frontmatter membership, P5). Step 2 is a no-op; the
verdict is the floor gates alone. No `role: verifier` capability is authored speculatively (P7).

## Honest residual (P0/P7)

Verified = the named gates passed; this is **NOT** a guarantee of correctness beyond what those gates
check — verifier concerns are advisory help, not assurance. The feature's real correctness signal is its
own suite (the 17 `merge-findings.test.mjs` cases, including the FIX 1 / FIX 2 / secondary hardening and
the trailing-newline + determinism guards folded in from GRILL) plus the whole-repo gates above. A defect
no test/eval/rule/lint covers is invisible to this verdict. `/pharn-dev-verify` certifies only the gates it
ran; whether the increment is good or wise is the human's call at the post-review gate.
