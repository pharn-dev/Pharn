# VERIFY — spec-hash-eol-normalize

Verdict source: `pharn/floor/check-verify.mjs` — exit **0**. Machine report: `.dev/features/spec-hash-eol-normalize/verify-report.json` (the helper's JSON verbatim, with the advisory `verifiers` block merged in **after** the verdict was computed).

## FLOOR layer — the gates that OWN the verdict

| gate           | exit | what it covers                                                   |
| -------------- | ---- | ---------------------------------------------------------------- |
| `test`         | 0    | the whole hermetic suite, including this increment's 7 new cases |
| `validate`     | 0    | the structural floor over the product surface — 36 capabilities  |
| `lint`         | 0    | eslint, whole-repo                                               |
| `format:check` | 0    | prettier, whole-repo (L9)                                        |
| `lint:md`      | 0    | markdownlint, whole-repo (L9)                                    |

`PASS` iff every gate exits 0 — an absolute threshold, computed by the helper over the gate→exit-code map. Five gates ran; `failing_gates: []`.

**No `structural:*` gate.** This increment ships no eval pair — it adds no `role:`-bearing Capability and no `rule_id`, so there is no `<cap>/evals/expected/*.json` ↔ committed `findings.json` to range over. The gate is therefore **absent from the map** rather than passed vacuously, exactly as the empty-set convention prescribes. The feature-specific correctness signal here is instead the seven new cases collected by `npm test`.

**The gate SET is advisory composition (two clocks, L9).** `check-verify.mjs` mechanically computes `PASS iff every gate exit 0` over **whatever** map this stage assembles; that `format:check` and `lint:md` are _in_ the map is this command's orchestration choice, not a floor-locked property. Do not read "verify runs the style gates" as guaranteed by the floor.

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.

**No verifiers registered — floor gates only.** Membership is a deterministic `role:` frontmatter read, never a content grep: a `role: verifier` string in this file's prose is DATA _about_ verifiers, not a declaration _of_ one. Step 2 is a no-op and the verdict is the floor gates alone; no verifier was authored speculatively (P7).

## Feature-specific evidence (recorded, not part of the verdict)

The gates above are whole-repo. What they do **not** separately surface, recorded here for the human:

- The **mutant** runs. Removing `.replace(/\r\n/g, "\n")` from `bodyHash` kills exactly the five fold/chain cases (3 in `check-spec.test.mjs`, 1 in each wrapper suite). **That the two negative cases survive it certifies nothing on its own** — removal only NARROWS what the checker accepts, so a case that already REDs still REDs; their survival is a theorem, not evidence. The discriminating mutants are the **widening** ones, and an initial pass found both alive: `/\r\n?/g → "\n"` (the exact form the plan says it rejected) and `/\r/g → ""` each left all 38 cases green, because the lone-`\r` fixture swapped a _space_ for the `\r` and so REDs on a text difference under every fold width — it passed for a reason unrelated to the boundedness it is named for. The fixture was rewritten to place the `\r` **where a wider fold would reconstruct the pinned body**, in two variants (one per widening; no single string maps back to `BODY` under both). Re-measured: `/\r\n?/g` → **1 fail**, `/\r/g → ""` → **1 fail**, removal → **5 fail**, unmutated → **38/38**. All three mutants are now killed.
- **Line coverage on `check-spec.mjs`: 93.40%** (`node --test --experimental-test-coverage`), above the 90% bar; branch 72.00%, funcs 100.00%. Uncovered lines are the unreadable-file and usage-error paths.
- **Wrapper purity re-checked at HEAD:** `grep -c createHash` → **0** in both `check-spec-approved.mjs` and `check-plan-spec-agree.mjs`. The single-source property the fix depends on still holds after the change.

## Verdict

VERIFIED: floor gates PASS.

**The honest residual (P0/P7):** verified = **the named gates passed** — nothing more. This is not a guarantee of correctness beyond what those gates check: a defect no test, eval, rule, or lint covers is invisible to this verdict, and the verifier layer that might have noticed it is advisory and, today, empty. Concretely for this increment, the gates prove the fold behaves as specified on the cases written for it; they cannot prove the _choice_ to fold line endings out of an intent pin is the right design — that judgment is the human's at the post-verify gate. "`/pharn-dev-verify` ensures the feature is correct" would be the disease; it certifies only the gates it ran.
