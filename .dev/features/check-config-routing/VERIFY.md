# VERIFY — check-config-routing

Feature: `check-config-routing` (`.dev/floor/check-config.mjs` + `.dev/floor/check-config.test.mjs`).
Run once at HEAD (never in a detached worktree). Dev-pipeline spec pin (`sha256(ARCHITECTURE.md)`) was
re-verified GREEN at build (fix #4); the product-pipeline `check-plan-spec-agree` gate does not apply
to a `/pharn-dev-plan` increment.

## FLOOR layer — deterministic gates (own the verdict)

| gate         | exit | notes                                                             |
| ------------ | ---- | ----------------------------------------------------------------- |
| test         | 0    | full hermetic `node --test` suite incl. the feature's 4 new cases |
| validate     | 0    | `.dev/floor/validate.mjs .` GREEN over the product surface        |
| lint         | 0    | eslint clean                                                      |
| format:check | 0    | prettier clean (whole-repo, incl. this feature's artifacts) — L9  |
| lint:md      | 0    | markdownlint clean (whole-repo) — L9                              |

No `structural:<expected>` gate: this increment is a deterministic floor tool (not a `role:` Capability),
so it ships no `evals/expected` pair — its spec is its `*.test.mjs` suite, collected by `npm test`.

## ADVISORY layer — verifiers

no verifiers registered — floor gates only (`count-verifiers.mjs` → `{"registered":0}`). Step 2 is a
no-op; the verdict is the floor gates alone. No verifier is authored speculatively (P7).

## Verdict

VERIFIED: floor gates PASS (`check-verify.mjs` → `"PASS"`, exit 0; `failing_gates: []`).

Honest residual (P0/P7): verified = the named gates passed; this is **NOT** a guarantee of correctness
beyond what those gates check. A defect no test/eval/rule/lint covers is invisible to this verdict, and
the verifier layer that might notice it is advisory (and empty today). Verifier concerns would be
advisory help, not assurance.
