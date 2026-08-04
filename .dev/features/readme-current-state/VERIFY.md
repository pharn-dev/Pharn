# VERIFY — readme-current-state

Machine report: [`verify-report.json`](./verify-report.json). The **verdict is floor-grade**
(`pharn/floor/check-verify.mjs`, an exit-code threshold: PASS iff every gate exits 0). Everything else
here — choosing the gate set, running them, writing this page — is **advisory orchestration**.

## FLOOR layer — the gates that own the verdict

| gate                                    | exit |
| --------------------------------------- | ---- |
| `test` (whole repo)                     | 0    |
| `validate` (`pharn/floor/validate.mjs`) | 0    |
| `lint` (eslint)                         | 0    |
| `format:check` (prettier)               | 0    |
| `lint:md` (markdownlint)                | 0    |
| `docs:check` (the drift guard)          | 0    |
| `structural:expected-injection-comment` | 0    |

`test` = **790 passing, 0 failing** (752 of them outside this feature). `validate` = `FLOOR: GREEN — 36
capabilities checked in .`

`docs:check` was added to the gate map for this increment — it is the gate this increment _builds_, so
verifying the increment without it would leave the new guard unverified by the very stage that certifies
it. The map is this command's **advisory** composition (`check-verify.mjs` is generic over gate keys);
nothing floor-locks `docs:check` into future runs.

### The first verify run FAILED — recorded, not hidden

The initial capture was **`verdict: FAIL`, `failing_gates: ["format:check"]`** (`check-verify.mjs` exit
1). Cause, identified rather than assumed: the single offender was
`.dev/features/readme-current-state/REGRESSION.md` — an artifact **`/pharn-dev-regress` had written
minutes earlier and never formatted**. No build output was implicated; `test`, `validate`, `lint`,
`lint:md`, `docs:check` and `structural:*` were all 0 on that run too.

The fix was to format that artifact — squarely inside `/pharn-dev-regress`'s own declared `writes:`, so
this completes that stage's output rather than reaching outside any authorized scope — and re-run the
**full** gate set. This is lesson **L9** firing exactly where L9 predicts (a style miss surfacing at
verify rather than at build). The honest note: had the offender been a _build_ file, the correct action
would have been to STOP at the FAIL and hand it to the human, not to format-and-continue.

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.
**No verifiers registered — floor gates only.** Step 2 is a no-op; no verifier finding exists, and by
construction none could have reached the verdict helper anyway (its only input is the gate→exit-code
map).

## Plan-gate reconciliation (the stale bar the grill caught)

The PLAN's `## Verification gate` still said "≥90 % line coverage on the **three new** `.mjs`" — wording
left over from a pre-GATE-1 draft; Option A creates no new `.mjs`. `GRILL.md` re-bound it to the
**three modified** `.mjs`, the strictly stronger reading. Measured
(`node --test --experimental-test-coverage`):

| file                                      | line % | funcs % |
| ----------------------------------------- | ------ | ------- |
| `.dev/floor/capability-catalog-core.mjs`  | 98.64  | 100.00  |
| `.dev/floor/check-capability-catalog.mjs` | 97.95  | 100.00  |
| `.dev/floor/gen-capability-catalog.mjs`   | 100.00 | 100.00  |

All three clear the ≥90 % bar. Numbers are measured, not the plan's phrasing.

Other plan-gate items, checked live this run:

- `npm run docs:generate` twice → second run reports `README.md current-state block already current`
  and leaves bytes identical (idempotent).
- **No count phrase the block owns appears in README prose outside the markers** — verified by grep for
  `lenses`, `grillers`, `contracts`, `capabilities`, `hooks`, `checkers`, and their bolded forms.
- `CLAUDE.md` and `CHANGELOG.md` updated; **`SKILLS_VERSION` not bumped** (unchanged at `1.1.1`).

## Verdict (FLOOR — `check-verify.mjs`, exit 0)

**VERIFIED: floor gates PASS.**

**The honest residual (P0/P7):** _verified_ = **the named gates passed** — it is **not** a guarantee of
correctness beyond what those gates check. A defect no test, eval, rule, or lint covers is invisible
here. Specifically **not** verified: that the block's enumerators are the _right_ definitions of
"a contract" / "a command" (a wrong enumerator regenerates cleanly and stays GREEN — the guarantee is
byte-equality, not truth), and that README prose **outside** the markers is true (unguarded by
construction). Verifier concerns would be advisory help, not assurance — and there are none, because
there are no verifiers.
