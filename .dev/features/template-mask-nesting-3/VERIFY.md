# VERIFY — template-mask-nesting-3

- **Feature:** depth-aware `maskTemplateInteriors` (Design B) across the 5 `scan-code-*` scanners + their
  tests + 5 `pharn-review/*` lens docs, plus the swallowed-exception `classify()` `${}`-delimiter strip.
- **Verdict (deterministic, `.dev/floor/check-verify.mjs`, exit 0):** **`PASS`** — every named gate exit 0.

## FLOOR layer — deterministic gates (own the verdict)

| gate                                   | exit |
| -------------------------------------- | ---- |
| test (`npm test`)                      | 0    |
| validate (`.dev/floor/validate.mjs .`) | 0    |
| lint (`eslint .`)                      | 0    |
| format:check (prettier)                | 0    |
| lint:md (markdownlint)                 | 0    |
| structural:trust-fence                 | 0    |

`failing_gates`: none. The gate set is exactly the repo's `npm run check` aggregate (test + lint +
format:check + lint:md) plus `validate` and the standing `structural:trust-fence` eval pair — so the
verdict tracks the full `npm run check` (L9). `npm test` reported **723 pass / 0 fail** (includes the
feature's own new nested-template fixtures across all five `scan-code-*.test.mjs`).

## ADVISORY layer — verifiers

**No verifiers registered — floor gates only** (`.dev/floor/count-verifiers.mjs .` →
`{"registered":0,"verifiers":[]}`). Step 2 is a no-op; the verdict is the floor gates alone. No verifier
is authored speculatively (P7).

## Verdict

**VERIFIED: floor gates PASS.**

Honest residual (P0/P7): _verified = the named gates passed; this is NOT a guarantee of correctness
beyond what those gates check — verifier concerns would be advisory help, not assurance, and none are
registered._ The feature-specific correctness signal here is the five scanners' own `*.test.mjs` (the
new nested-template immunity fixtures — including the depth-2, interpolation-code-readable, and
fail-open-unbalanced cases) collected by `npm test`, all green.
