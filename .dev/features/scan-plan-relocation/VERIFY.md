# VERIFY — scan-plan-relocation (F2)

## FLOOR layer — the deterministic gates (these OWN the verdict)

| gate                                    | exit | note                                                             |
| --------------------------------------- | ---- | ---------------------------------------------------------------- |
| `test`                                  | 0    | 1143 tests, 0 fail — includes the 5 relocated suites             |
| `validate`                              | 0    | `FLOOR: GREEN — 36 capabilities checked`                         |
| `lint`                                  | 0    | eslint clean                                                     |
| `format:check`                          | 0    | prettier clean (whole-repo)                                      |
| `lint:md`                               | 0    | markdownlint clean (whole-repo)                                  |
| `structural:expected-injection-comment` | 0    | trust-fence expected ↔ `.dev/features/trust-fence/findings.json` |

The five style/test gates are whole-repo — the most honest form of "is it green with this in it" — so
PASS requires the entire repo clean, not merely the increment's files. Together `test` + `lint` +
`format:check` + `lint:md` are exactly the repo's `npm run check` aggregate, so this verdict tracks it
(**L9**). The feature-specific correctness signal is the `structural:*` gate plus the feature's own
`*.test.mjs`, which `npm test` collects — and the five relocated suites are collected at their **new**
path because the `test` script globs `pharn/**/*.test.mjs` as well as `.dev/**`, making the move
gate-neutral rather than silently dropping five suites from the run.

**Gate-set honesty (two clocks).** `check-verify.mjs` computes `PASS iff every gate exit 0` over
**whatever** map this stage assembles; that the two style gates are _in_ the map is this stage's
advisory composition, not a floor-locked fact. Do not read "verify runs the style gates" as guaranteed.

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.

**No verifiers registered — floor gates only.** Membership is a deterministic frontmatter read, never a
prose grep. Step 2 is a no-op and the verdict is the floor gates alone; no verifier free-text exists to
quote, so no untrusted DATA entered this report.

## Verdict (FLOOR — an exit-code threshold, zero LLM judgment)

**VERIFIED: floor gates PASS.** `check-verify.mjs` → `"PASS"`, `failing_gates: []`, exit **0**.

**The honest residual (P0/P7):** verified = **the named gates passed** — this is NOT a guarantee of
correctness beyond what those gates check. Verifier concerns would be advisory help, not assurance, and
there are none to report. Three limits are worth naming for this increment specifically, because they
bound exactly what the PASS above means:

1. The floor proves each relocated scanner **exists and runs** at `pharn/floor/` — spot-checked live,
   all five exit 0 on a real PLAN. It does **not** prove any griller **body** invokes it correctly, nor
   that a griller ran at all. "The scanner ships" is not "the sub-check fired."
2. The 26 hand-fixed cross-references inside `pharn/floor/` are **outside CHECK 8's scope by design** —
   there an intentional dev-reference and a stale one are byte-indistinguishable. They were verified by
   an existence test over every target before rewriting, and the diff is comment-only, but no gate
   guards them and a future stale ref landing there stays silent.
3. `git mv`, the two cite-rewrite scripts, and `npm run docs:generate` are **Bash** writes and therefore
   escape the fix #7 writes-scope entirely (**L19**). What stands in for the gate is the CHECK 8
   RED→GREEN ordering (29 → 0, every finding `P6/floor-path`), the audited diffs, and these gates —
   not the hook.
