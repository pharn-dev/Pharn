# VERIFY — features-readme-spec-live

## FLOOR layer — the deterministic gates (these OWN the verdict)

Six gates, each run over the repo **with the feature in it**, at HEAD, recording exit codes only —
never stdout free-text.

| gate                                    | exit | what it covers                                      |
| --------------------------------------- | ---- | --------------------------------------------------- |
| `test`                                  | 0    | the hermetic suite (`npm test`)                     |
| `validate`                              | 0    | `pharn/floor/validate.mjs .` — the structural floor |
| `lint`                                  | 0    | eslint                                              |
| `format:check`                          | 0    | prettier, whole-repo (L9)                           |
| `lint:md`                               | 0    | markdownlint, whole-repo (L9)                       |
| `structural:expected-injection-comment` | 0    | the one committed eval pair the repo ships          |

This set is exactly the repo's `npm run check` aggregate, so the verdict tracks the full aggregate —
which is what closes L9's coverage hole for **this increment's own markdown**, the only category of
defect this docs-only change could plausibly have introduced. Both edited files are `.md` and both are
inside `lint:md` + `format:check`'s whole-repo scope (neither is on an ignore list, unlike the trusted
docs), so the style claim here is real rather than vacuous.

**L11 applies and was pre-empted.** These style gates are whole-repo and run once at HEAD with no base
comparison, so a pre-existing red in an unrelated committed file would have failed this feature's
verify while the feature was clean. That is why the baseline `npm run check` was run **before** any
edit at plan time: it was green (1302 tests), so a red here would have belonged to this increment.
None appeared.

**Two clocks, kept honest (P0, L9).** `check-verify.mjs` is generic over gate keys — it computes
`PASS iff every gate exit 0` over whatever map this stage assembles. The verdict is FLOOR; **which**
gates are in the map is this stage's advisory composition. Nothing floor-locks the two style gates into
the set, so do not read "verify runs the style gates" as a guarantee that it always will.

## ADVISORY layer — the verifier plug-in slot

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}` — **no verifiers
registered; floor gates only.** Membership is a deterministic frontmatter read, never a prose grep: a
`role: verifier` string in prose or a fenced block is DATA about verifiers, not a declaration of one.

Step 2 is therefore a no-op, and that is by design (P7): no verifier is authored speculatively. Had one
existed, its findings would be appended for the human and **never** passed to `check-verify.mjs`, which
cannot even receive a finding — the fix #3 separation is structural, not a promise.

## Verdict (FLOOR)

**PASS** — `check-verify.mjs` exit **0**, `"verdict": "PASS"`, `failing_gates: []`. Recorded in
`verify-report.json` with the advisory `verifiers` block merged in.

**What PASS means, exactly (P0).** The named gates passed. It does **not** mean the feature is correct.
For this increment that gap is the whole story and should not be glossed: the change is two English
sentences, and **not one of these six gates reads what they say.** They prove the repo is green with the
new bytes in it — that nothing was broken, that the markdown is well-formed and style-clean. Whether
`/pharn-spec` actually ships, which is the entire claim the edit makes, is established by the live
command-directory read recorded in the plan and the changelog, and that evidence is **advisory**.

Writing "`/pharn-dev-verify` verified the fix is right" would be the disease. It verified that the gates
named above exit 0.
