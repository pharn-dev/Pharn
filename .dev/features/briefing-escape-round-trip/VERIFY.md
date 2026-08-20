# VERIFY — briefing-escape-round-trip

**Verdict: `PASS`** — the deterministic `pharn/floor/check-verify.mjs` output, verbatim. PASS means
**every gate below exited 0**, by an absolute threshold. Nothing else.

## FLOOR layer — the gates that own the verdict

| gate                                      | exit |
| ----------------------------------------- | ---- |
| `test` (`npm test`, whole repo)           | 0    |
| `validate` (`pharn/floor/validate.mjs .`) | 0    |
| `lint`                                    | 0    |
| `format:check`                            | 0    |
| `lint:md`                                 | 0    |
| `structural:expected-injection-comment`   | 0    |

`test` + `lint` + `format:check` + `lint:md` is exactly the repo's `npm run check` aggregate, so the
verdict tracks the full gate set (L9). `test` reports **1506 passing, 0 failing**, read live this run —
1492 at the base commit, so this increment contributes **14** new tests.

**Build completion:** all seven paths the plan's `## Files` declares exist on disk (`declared_files_absent`
is empty), so there is no INCOMPLETE condition.

## ADVISORY layer — the verifier slot

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`. Zero verifiers are authored
(P7 — none has been triggered by a real failure yet), so the advisory layer contributed nothing. Worth
restating precisely: even a verifier finding could not have moved this verdict. `check-verify.mjs`'s only
input is the gate→exit-code map — it cannot receive a finding at all (fix #3, structural rather than
disciplinary).

## The evidence that is specific to THIS increment

The whole-repo gates above answer "is the repo green with this in it". They do **not**, on their own,
demonstrate the defect is fixed — a suite can be green because the new assertions are vacuous. Two checks
were run for that, and both are recorded because neither is implied by `PASS`:

1. **The original reproduction, re-run.** The same fixture that produced `check exit=1` before the change
   produces `render exit=0 / check exit=0` after it, against sources that never changed. This fixture is
   the one artifact not authored by the reasoning that wrote the fix.
2. **Mutation testing of the new assertions.** Two mutations were applied in-repo (at the real path, so
   the repo's own config-resolving gates applied — L26) and reverted:
   - reverting the decode wiring (`readEnvelopeValue` → `clean`, i.e. the original defect) → **4 of the
     new tests fail**;
   - substituting the naive terminator test (`raw[len-2] !== "\\"`) that `/pharn-dev-grill` flagged as its
     blocking finding → **4 tests fail**, including the ✧ codec parity test.

   Both restore to 34 passing. A test suite that cannot fail on the bug it was written for is not
   evidence, and this one can.

## What `PASS` does NOT mean (P0)

It means the named gates passed — never that the increment is correct, wise, or complete.
Specifically **not** verified by any gate here: that the codec's two duplicated copies will stay in sync
(a ✧ parity **test** pins them, and a test is a regression guard, not a floor primitive — it fires only
when `node --test` runs); that the decision to duplicate rather than share was the right one; and that
the rationale comments now added to both files are accurate. Those are review and human territory.
