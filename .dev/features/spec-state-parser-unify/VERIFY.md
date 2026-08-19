# VERIFY — spec-state-parser-unify

**VERIFIED: floor gates PASS.** `check-verify.mjs` exit 0 — the verdict is an absolute exit-code
threshold (PASS iff every gate exit 0), not a judgment.

## FLOOR layer — the deterministic gates

| gate                                      | exit |
| ----------------------------------------- | ---- |
| `test` (`npm test`, 1428 tests)           | 0    |
| `validate` (`pharn/floor/validate.mjs .`) | 0    |
| `lint`                                    | 0    |
| `format:check`                            | 0    |
| `lint:md`                                 | 0    |
| `structural:expected-injection-comment`   | 0    |

`failing_gates: []`. The set is exactly the repo's `npm run check` aggregate plus the one committed
eval pair, so this tracks the full aggregate (L9's style-gate hole closed at verify — cited, not
restated, P4).

**Two clocks, kept honest (P0).** The **verdict** is FLOOR. **Which** gates are in the map is this
stage's **ADVISORY** composition — nothing floor-locks the two style gates into the set. Do not read
"verify runs the style gates" as floor-locked.

## What the feature's own tests cover

+19 tests across three suites, all inside `npm test`'s 1428:

- `check-spec.test.mjs` (+9) — the `--state` mode: last-wins on a duplicate key, comment strip,
  empty-line-at-exit-0 on an absent field, stderr on unreadable **and** on no-frontmatter, usage,
  and non-interference with `--hash` / `--spec-id`.
- `check-spec-approved.test.mjs` (+5) — the two reproduced defects (duplicate-key fail-OPEN,
  trailing-comment false-RED), the `--state` ⟺ gate-exit **biconditional** cross-check, a **structural**
  pin that the gate's source holds no frontmatter parser, and a `★` P2 hostile-`state:`-value fixture.
- `check-plan-spec-agree.test.mjs` (+2) — both directions at the OUTERMOST consumer, three processes
  deep, with **no change to that file's source**: the delegation carries the fix.

**Mutation-proved, and honestly bounded.** Restoring the pre-fix gate fails **4 of the 5** new gate
tests. The fifth (`★`) passes against both versions **by design**: `check-spec.mjs`'s enum gate REDs
that spec one layer earlier, so it is a **trust-fence guard on the new transport**, not a
defect-killer. Stated rather than counted as a kill.

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.
**No verifiers registered — floor gates only.** Membership is a deterministic frontmatter read, never a
prose grep. No verifier was authored speculatively (P7); Step 2 is a no-op and the verdict is the floor
gates alone.

## Residual

Verified = the named gates passed; this is **NOT** a guarantee of correctness beyond what those gates
check. In particular: the gates prove the two checkers agree on the committed fixtures and that the
gate's source holds no parser, **never** that no third parser is ever re-added — that bound remains
**discipline**, stated in `check-spec-approved.mjs`'s own header. Verifier concerns would be advisory
help, not assurance; there are none to report.
