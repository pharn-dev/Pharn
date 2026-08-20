# VERIFY — validate-bad-target

## Floor layer — the gates that own the verdict

| gate                                    | exit |
| --------------------------------------- | ---- |
| `test`                                  | 0    |
| `validate`                              | 0    |
| `lint`                                  | 0    |
| `format:check`                          | 0    |
| `lint:md`                               | 0    |
| `structural:expected-injection-comment` | 0    |

`npm test` reports **1538 tests, 1538 pass, 0 fail** — read live this run, not asserted from a doc.
Ten of those are the target guard's own, of which four are the per-branch rules iterated over the
enumerated branch array.

`validate` is GREEN over 36 capabilities. The `structural` gate is the one committed eval pair
(`expected-injection-comment.json` ↔ `.dev/features/trust-fence/findings.json`); both paths were
confirmed readable before their exit code was recorded.

## A red on the first gate run, and what it was

**The first `lint` run in this stage exited 1**, and it is recorded here rather than quietly
overwritten. ESLint's `no-useless-assignment` flagged `let targetStat = null` in the new guard: both
the `try` and the `catch` assign, so the initializer could never be read.

It was a defect in code this run wrote, in a file the approved `## Files` authorizes, and it belonged
to **`/pharn-dev-build` Step 2b**, which requires confirming `npm run lint` clean before the floor and
which had been run as prettier + markdownlint only. The repair was to complete that build step —
`let targetStat;` — under the plan's own writes-scope, not to re-decide a verify verdict: no verify
verdict had been computed or recorded at that point. The gate table above is a full re-run afterwards,
not a patched map. `/pharn-dev-regress`'s HEAD capture was also re-run after the repair and produced a
byte-identical verdict, so `regression-report.json` remains accurate verbatim.

The gap this exposes is real and belongs to the build stage: Step 2b's format pass runs prettier and
markdownlint on the scoped paths but never runs `eslint`, while its own prose asks the operator to
"confirm `npm run lint` is clean" — a discipline-only remedy on a step that is otherwise mechanized.
It is not a finding against this increment's design; it is noted for `/pharn-dev-review`.

## Re-verification after the GATE-2 fix

The human chose **fix F1, then re-verify** at GATE 2. `REVIEW.md`'s blocking P0 finding was repaired —
the "readable directory" claims at `pharn/floor/validate.mjs:20` and `CHANGELOG.md:71` were narrowed to
what the guard actually establishes (existence + directory-ness), with the unreadable-directory
residual now named explicitly in both places alongside the valid-but-wrong-directory one.

The repair is **prose-only**: no branch, message, exit code, or test changed. Confirmed by re-running
the four target cases (`/no/such/dir` → 1, a file → 1, an empty dir → 0, `.` → 0, 36 capabilities) and
the suite (40/40 in `validate.test.mjs`). Every gate in the table above was then re-run from scratch
and returned 0 again; `check-verify.mjs` re-issued **PASS** with `failing_gates[]` empty, so
`verify-report.json` was already current and was not rewritten. `/pharn-dev-regress`'s HEAD capture was
re-run a second time and again produced a byte-identical verdict.

This time **Step 2b was run complete** — prettier, markdownlint, **and** `eslint` over the scoped
paths — which is finding F3's own remedy applied by hand. `eslint` over the scoped `.mjs` files
returned 0 before the gates were run, so the failure mode that produced the first red could not
recur silently.

## Advisory layer — verifiers

**No verifiers registered — floor gates only.** `node pharn/floor/count-verifiers.mjs .` →
`{"registered":0,"verifiers":[]}`, a deterministic frontmatter read, never a prose grep. Step 2 was a
no-op and no verifier free-text exists to quote.

## Verdict

**VERIFIED: floor gates PASS.** Computed by `node pharn/floor/check-verify.mjs` (exit **0**) —
`PASS iff every gate exit 0`, over the gate→exit-code map alone. No verifier finding could have
reached it; the helper cannot receive one.

**The honest residual (P0/P7).** Verified = the named gates passed. This is **not** a guarantee of
correctness beyond what those gates check — a defect no test, eval, rule, or lint covers is invisible
here, and verifier concerns would be advisory help, not assurance. Note also which clock owns what:
the verdict is floor-grade, but **which** gates are in the map is this stage's advisory composition —
nothing floor-locks the style gates into the set.
