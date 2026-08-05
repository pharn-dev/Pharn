# VERIFY — floor-selfpath-correction

Machine report: [`verify-report.json`](./verify-report.json) (the `check-verify.mjs` verdict, with the
advisory `verifiers` block merged in after the verdict was computed).

## FLOOR layer — deterministic gates (owns the verdict)

| gate           | exit | meaning                                                   |
| -------------- | ---- | --------------------------------------------------------- |
| `test`         | 0    | 793/793 pass — the hermetic suite, whole-repo             |
| `validate`     | 0    | `FLOOR: GREEN — 36 capabilities checked`                  |
| `lint`         | 0    | eslint clean                                              |
| `format:check` | 0    | prettier clean                                            |
| `lint:md`      | 0    | markdownlint clean — 775 files, 0 issues                  |
| `docs:check`   | 0    | `CATALOG: GREEN` — committed docs == recomputed, no drift |

The gate set is exactly the repo's `npm run check` aggregate
(`format:check && lint && lint:md && docs:check && test`) plus `validate`. **No `structural:*` gate:**
this increment ships no capability and therefore no committed eval pair — correctly absent from the
map rather than faked green.

**Which gates actually bind this increment.** Honest accounting, because it matters here more than
usual: `test` is what pins the rewrite — the mock-fs fixture keys asserting floor-dir exclusion are
compared **exactly**, so a fixture inversion turns it RED. `docs:check` confirms the generated docs
did not drift. `validate`, `lint`, `format:check`, `lint:md` are whole-repo hygiene. **Nothing in the
set asserts on comment text**, which is most of what changed — see the residual below.

## A FAIL-then-PASS sequence, recorded rather than overwritten

The first gate run returned **FAIL**: `test: 1`, `format:check: 1`, `lint:md: 1`.

All three traced to **one** root cause, and it was **not** in the built increment: the
`REGRESSION.md` render written moments earlier by `/pharn-dev-regress` contained a misaligned markdown
table (`MD060/table-column-style`, two errors at line 37). `format:check` and `lint:md` flagged the
file directly; `test` failed because the capability-catalog suite's
`style: a spliced README passes the repo's prettier and markdownlint unchanged` test runs
markdownlint repo-wide and inherited the same two errors.

Fixed with the project's own tooling (`prettier --write` + `markdownlint-cli2 --fix` on that one
file) — the same Step 2b formatting the build stage prescribes — and the full set re-run. The second
run is the one the verdict rests on.

Recorded here deliberately: the first result was a real FAIL of the real gates, and the fix touched a
**pipeline artifact**, never a file of the increment. Reporting only the green run would misrepresent
what happened.

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.

**No verifiers registered — floor gates only.** Step 2 is a no-op; the verdict is the floor gates
alone. No verifier free-text exists in this run, so no untrusted `problem` / `evidence` is carried
into this report (P2). Zero verifiers is the correct state under P7 — none has been triggered by a
real failure.

## Verdict (FLOOR — `check-verify.mjs`, exit 0)

**VERIFIED: floor gates PASS** — every gate in the map exited 0.

**Honest residual (P0/P7):** verified = **the named gates passed**; this is **NOT** a guarantee of
correctness beyond what those gates check. For this increment the gap is wide and worth stating
plainly: the change is overwhelmingly **comment and usage-string text**, and **no deterministic gate
in the set asserts on it**. A header rewritten into nonsense would have passed all six gates. What is
genuinely pinned is the dangerous part — the existence-gated rule could not touch a fixture key or a
`.dev/floor/`-resident path, and `test` would have gone RED if it had. Everything beyond that rests
on the VERIFY-#1 checklist pass (a human-defined review criterion, applied by inspection over all 14
survivors) and on `/pharn-dev-review` — **advisory**, not floor.
