# VERIFY — applied-lessons

## FLOOR layer — the deterministic gates (these OWN the verdict)

| gate           | exit | meaning                                                    |
| -------------- | ---- | ---------------------------------------------------------- |
| `test`         | 0    | the whole hermetic suite — **839 tests**, incl. the 25 new |
| `validate`     | 0    | the structural floor: GREEN over 36 capabilities           |
| `lint`         | 0    | eslint clean                                               |
| `format:check` | 0    | prettier clean (whole-repo — L9)                           |
| `lint:md`      | 0    | markdownlint clean (whole-repo — L9)                       |

No `structural:*` gate: this increment ships **no** eval pair. That is correct, not an omission —
`check-plan-lessons.mjs` carries no `role:` frontmatter, so it is a **floor primitive**, not a
Capability, and P1's evals obligation does not attach (the posture every existing `pharn/floor/*.mjs`
already holds). Its regression surface is the colocated `*.test.mjs`, collected by `npm test` above.

**Feature-specific evidence beyond the whole-repo gates:** `check-plan-lessons.test.mjs` runs 25 cases
at **100% line / branch / function coverage** (`node --test --experimental-test-coverage`), well above
the ≥90% bar, and includes a **dogfood** case that runs the checker against this increment's own live
`PLAN.md` and the live `.dev/memory-bank/lessons-learned.md` canon.

## VERIFIED: floor gates PASS

## ADVISORY layer — verifiers

**No verifiers registered — floor gates only.** `node pharn/floor/count-verifiers.mjs .` →
`{"registered":0,"verifiers":[]}`. Membership is a deterministic **frontmatter** read (`role: verifier`),
never a prose grep (L6). Step 2 is a no-op; the verdict is the floor gates alone, and no verifier
finding could have flipped it in any case (fix #3 — `check-verify.mjs`'s only input is the
gate→exit-code map; it cannot receive a finding).

## Honest residual (P0/P7)

**Verified = the named gates passed.** This is **NOT** a guarantee of correctness beyond what those
gates check — a defect no test, eval, rule, or lint covers is invisible to this verdict, and the
verifier layer that might notice one is advisory, not a guarantee.

Two limits worth naming for this increment specifically:

1. **The gates cannot see whether the field does its job.** They prove the checker behaves as specified
   and the repo stays green. They cannot prove that requiring `applied_lessons` will actually cause
   future plans to apply lessons — that is the increment's _thesis_, and it is unfalsifiable by any gate
   here. The first honest evidence will be whether the next few increments' declarations are truthful.
2. **The field is self-attested.** With grill re-verification deferred (Q2 → follow-up
   `grill-lessons-reverify`), the stage that writes `applied_lessons` is also the only stage that checks
   it. The floor still guarantees presence + shape + id-existence; it does not guarantee an independent
   check ran.

Only the **verdict** is floor-grade; running the gates and assembling this report is **advisory
orchestration**. Note also (two clocks, per L9) that **which** gates are in the map is this command's
advisory composition — nothing floor-locks `format:check` / `lint:md` into the set.
