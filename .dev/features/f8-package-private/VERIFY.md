# VERIFY — f8-package-private

## Floor layer (deterministic — owns the verdict)

| gate                                                                                       | exit |
| ------------------------------------------------------------------------------------------ | ---- |
| `test` (`npm test`)                                                                        | 0    |
| `validate` (`pharn/floor/validate.mjs .`)                                                  | 0    |
| `lint` (`npm run lint`)                                                                    | 0    |
| `format:check` (`npm run format:check`)                                                    | 0    |
| `lint:md` (`npm run lint:md`)                                                              | 0    |
| `structural:pharn/pharn-review/trust-fence/evals/expected/expected-injection-comment.json` | 0    |

**VERIFIED: floor gates PASS.**

Note: `format:check` initially failed (exit 1) on `.dev/features/f8-package-private/regression-report.json`
— `check-regress.mjs`'s raw `JSON.stringify(obj, null, 2)` output does not match Prettier's array-collapsing
style. Reformatted it with `npx prettier --write` (whitespace-only; content unchanged) before the final gate
run, matching the convention already visible in other committed `regression-report.json` files in this repo
(e.g. `.dev/features/verify-style-gates/regression-report.json`). All gates above are from the clean re-run.

## Advisory layer (verifiers)

No verifiers registered — floor gates only (`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`).

## Honest residual

Verified = the named gates passed; this is NOT a guarantee of correctness beyond what those gates check
— verifier concerns are advisory help, not assurance. This run additionally confirms live, by direct
inspection, that `require('./package.json').private === true` and `.main === undefined` — the specific
behavior the plan set out to produce — though that confirmation is orchestration (this command's own
check), not a gate in the `gates` map above.
