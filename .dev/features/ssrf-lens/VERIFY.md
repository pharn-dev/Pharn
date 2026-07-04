# VERIFY — ssrf lens

- **Verdict (FLOOR — `.dev/floor/check-verify.mjs`):** **`PASS`** (exit 0) — every gate exit 0.
- **Spec→plan hash chain:** intact (`sha256(ARCHITECTURE.md)` == the plan's `spec_content_hash`, re-confirmed at grill + build; unchanged this run).
- **Verifiers (ADVISORY layer):** `node .dev/floor/count-verifiers.mjs .` → `{"registered":0}` — **no verifiers registered; floor gates only** (P7 — none authored speculatively).

## FLOOR layer — deterministic gates (the verdict, run once at HEAD with the feature in place)

| gate           | exit | meaning                                                                        |
| -------------- | ---- | ------------------------------------------------------------------------------ |
| `test`         | 0    | `npm test` — 348 pass / 0 fail (325 pre-existing + 23 new `scan-code-ssrf.test.mjs`) |
| `validate`     | 0    | `.dev/floor/validate.mjs .` — GREEN, 21 capabilities                             |
| `lint`         | 0    | `npm run lint` — eslint clean                                                    |
| `format:check` | 0    | `npm run format:check` — prettier clean                                          |
| `lint:md`      | 0    | `npm run lint:md` — markdownlint clean                                           |

- `failing_gates[]`: **none**
- **No `structural:<expected>` gate:** the ssrf feature ships expected `.json` fixtures but **no committed actual `findings.json`** (the isolated lens runner is deferred, P7), so — per convention — there is no per-eval structural gate for this feature (its evals are floor-checked at eval time by `check-structural.mjs`, not here). The feature's deterministic correctness signal here is `npm test` (the scanner's 23 hermetic tests) + `validate` (lens membership + the `enforces:[P2]` ↔ eval binding, fix #6). The `test`+`validate`+`lint`+`format:check`+`lint:md` set is exactly the repo's `npm run check` aggregate (L9).

> **Build-completeness conformance (transparency, P0 — measured honestly, not faked).** The first gate pass found `format:check` and `lint:md` **red** on four newly-authored files (`GRILL.md`, `REGRESSION.md`, `scan-code-ssrf.test.mjs`, `expected-fixed-host-path.md`) — the hand-written files did not match the repo's existing style gates (a build-completeness gap, not a design/scope/meaning change). A mechanical, meaning-preserving `prettier --write` was applied to those files (which also aligned the REGRESSION.md table, resolving the MD060 issue), and **all gates were then re-run** to produce the verdict above. The reformat left the line-sensitive eval-case `file_resolves` targets unchanged (verified: `case-fetch-reqquery.md:14`, `case-allowlisted-comment.md:15`, `case-fixed-host-path.md:14`). The PASS reflects the true state of the files as they will be committed.

## ADVISORY layer — verifiers

No verifiers registered — floor gates only. Step 2 is a no-op (membership → ∅); the verdict is the floor gates alone. No verifier free-text is produced, so no untrusted-DATA annotation is carried into this report.

## Honest residual (P0/P7)

**Verified = the named gates passed; this is NOT a guarantee of correctness beyond what those gates check** — a defect no test / eval / rule / lint covers is invisible to the floor verdict, and the verifier layer that might notice it is advisory (and empty today). The verdict certifies exactly: `npm test` + `validate` + `lint` + `format:check` + `lint:md` all exit 0 with the ssrf increment in place. Whether the lens is *good* is the human's call at the post-review gate.
