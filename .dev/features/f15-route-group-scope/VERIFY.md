# VERIFY — f15-route-group-scope

## Gate results

| Gate                                                                                       | Exit |
| ------------------------------------------------------------------------------------------ | :--: |
| `test` (`npm test` — hermetic suite, includes the feature's own 37 test cases, 4 new)      |  0   |
| `validate` (`node pharn/floor/validate.mjs .` — structural floor)                          |  0   |
| `lint` (`npm run lint` — eslint)                                                           |  0   |
| `format:check` (`npm run format:check` — prettier, whole-repo)                             |  0   |
| `lint:md` (`npm run lint:md` — markdownlint, whole-repo)                                   |  0   |
| `structural:pharn/pharn-review/trust-fence/evals/expected/expected-injection-comment.json` |  0   |

## Verdict

**VERIFIED: floor gates PASS.** All six deterministic gates exited 0. `failing_gates: []`.

## Verifiers (advisory layer)

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}` — **no verifiers registered — floor gates only.** Step 2 was a no-op; the verdict above rests entirely on the floor gate table, with nothing annotated on top of it.

## Honest residual

Verified = the named gates passed; this is **not** a guarantee of correctness beyond what those gates check — no verifier concerns exist to annotate further, and none would have changed this verdict even if they had (fix #3: a verifier finding never flips the verdict). The feature-specific correctness signal here is `test` (which collected `set-writes-scope.test.cjs`'s 37 tests, 4 of them new to this increment) and the `structural:*` gate; `validate` / `lint` / `format:check` / `lint:md` are whole-repo, confirming the repo is clean **with** this change present, not merely that the change's own files are clean in isolation.
