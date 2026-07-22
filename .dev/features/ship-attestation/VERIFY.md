# VERIFY — ship-attestation

**VERIFIED: floor gates PASS** (`pharn/floor/check-verify.mjs` exit 0 — every gate green).

## Floor layer — deterministic gates (own the verdict)

| gate         | exit | notes                                                       |
| ------------ | ---- | ----------------------------------------------------------- |
| test         | 0    | full hermetic suite incl. the feature's own 26-case checker |
| validate     | 0    | structural floor GREEN (36 capabilities)                    |
| lint         | 0    | eslint clean                                                |
| format:check | 0    | prettier clean (whole-repo)                                 |
| lint:md      | 0    | markdownlint clean (whole-repo)                             |

- `verdict`: **PASS** · `failing_gates`: none.
- **No `structural:*` gate:** the feature ships **no** eval-actual pair — it adds a `pharn-contracts` schema
  (`ship-record.md`, no `role:`) and a floor script (`check-attestation.mjs`, not a Capability), neither of
  which carries evals (P1 N/A). Its correctness signal is the 26-case `check-attestation.test.mjs` collected
  by `npm test` (98.5% line coverage).

## Advisory layer — verifiers

**No verifiers registered — floor gates only** (`count-verifiers.mjs` → `{"registered":0}`). Step 2 is a
no-op; the verdict is the floor gates alone. No verifier is authored speculatively (P7).

## Honest residual (P0/P7)

Verified = the named gates passed; this is **NOT** a guarantee of correctness beyond what those gates check
— verifier concerns are advisory help, not assurance, and none exist yet. `test` / `validate` / `lint` /
`format:check` / `lint:md` are whole-repo granularity. The claim is "the named gates passed," never "the
feature is correct."
