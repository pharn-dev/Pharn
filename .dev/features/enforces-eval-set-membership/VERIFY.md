# VERIFY — enforces-eval-set-membership

Machine report: `verify-report.json` (the helper's verdict verbatim + the advisory `verifiers` block).

## FLOOR layer — the gates that OWN the verdict

| gate                                           | exit |
| ---------------------------------------------- | ---- |
| `test` (`npm test`, whole suite)               | 0    |
| `validate` (`pharn/floor/validate.mjs .`)      | 0    |
| `lint` (eslint)                                | 0    |
| `format:check` (prettier)                      | 0    |
| `lint:md` (markdownlint)                       | 0    |
| `structural:…/expected-injection-comment.json` | 0    |

The gate set is exactly the repo's `npm run check` aggregate plus the one committed eval pair
(`pharn/pharn-review/trust-fence/evals/expected/expected-injection-comment.json` ↔
`.dev/features/trust-fence/findings.json`, both `test -r`-confirmed before their exit code was
recorded). `npm test` covers the six new `★ CHECK 3` regression tests this feature ships — that is the
feature-specific correctness signal; the rest are whole-repo.

Worth noting for the reader: `lint` was **red** mid-build and is green here for a real reason, not by
luck. The first implementation expressed the control-char guard as a regex literal, which eslint's
`no-control-regex` rejected; it now uses the same `charCodeAt` scan `pharn/floor/merge-findings.mjs`
uses. The gate caught it at build Step 2b rather than here (L12's prevention-at-build working as
designed).

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.
**No verifiers registered — floor gates only.** Membership is a deterministic frontmatter read, so the
prose in this file and in `GRILL.md` discussing verifiers registers nothing.

## Verdict (FLOOR — `check-verify.mjs`, exit 0)

**VERIFIED: floor gates PASS.**

Honest residual (P0/P7): verified = **the named gates passed**. This is NOT a guarantee of correctness
beyond what those gates check. Specifically unverified here, and worth a human's eye: whether the
`.md`-fallback path's anchored-line heuristic is the right bound (no deterministic check can answer
that), and whether the six new tests cover the shape space rather than merely the three defects that
triggered them. Verifier concerns would be advisory help, not assurance — and today there are none,
because there are no verifiers.
