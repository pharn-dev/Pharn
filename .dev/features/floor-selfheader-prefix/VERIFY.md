# VERIFY — `floor-selfheader-prefix`

## FLOOR layer — the deterministic gates (these own the verdict)

| gate                                    | exit | meaning                                               |
| --------------------------------------- | ---- | ----------------------------------------------------- |
| `test`                                  | 0    | `npm test` — 793 passing, 0 failing                   |
| `validate`                              | 0    | `pharn/floor/validate.mjs .` — GREEN, 36 capabilities |
| `lint`                                  | 0    | `eslint .` clean                                      |
| `format:check`                          | 0    | `prettier --check .` clean                            |
| `lint:md`                               | 0    | `markdownlint-cli2` clean — 780 files, 0 issues       |
| `structural:expected-injection-comment` | 0    | trust-fence expected ↔ committed findings             |

Gate set assembled by this command (**advisory composition**) and reduced to a verdict by
`pharn/floor/check-verify.mjs` (**floor** — `PASS` iff every gate exit 0). The set is the repo's full
`npm run check` aggregate plus the one committed eval pair, so the verdict tracks the whole style surface
(L9 — cite, don't restate, P4).

## Two style reds, found and fixed at this stage (recorded, not hidden)

The first gate capture came back `test=1`, `format:check=1`, `lint:md=1`. **All three had one root cause,
and it was not the increment:** the `REGRESSION.md` this pipeline had just written carried a
markdown table with misaligned pipes (`MD060/table-column-style`) and non-prettier formatting. Because
`npm test` includes the repo-wide test _"style: a spliced README passes the repo's prettier and
markdownlint unchanged,"_ a malformed markdown artifact anywhere reddens the `test` gate too — hence
three reds from one defect.

Fixed by running `prettier --write` + `markdownlint-cli2 --fix` over that one file; all six gates then
returned 0. **Worth noting for the record:** `/pharn-dev-build`'s Step 2b formats the files the _plan_ names, but
`REGRESSION.md` is written **after** build by a later stage, so it never passed through that step. The
style gate at verify is what caught it — which is precisely the coverage hole L9 describes, working as
intended.

Nothing in the 14 product files changed as a result; the fix touched only the pipeline artifact.

## ADVISORY layer — verifiers

**No verifiers registered — floor gates only.**

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}` (deterministic `role: verifier`
frontmatter membership, P5 — never a prose grep). Step 2 is a no-op; no advisory findings were produced,
and none could have flipped the verdict regardless (fix #3 — `check-verify.mjs`'s only input is the
gate→exit-code map; it cannot receive a finding).

## Verdict (FLOOR — `pharn/floor/check-verify.mjs`, exit 0)

**VERIFIED: floor gates PASS.**

`verify-report.json` `.verdict`: `"PASS"` · `failing_gates`: `[]`

**Honest residual (P0/P7):** verified = **the named gates passed** — this is **NOT** a guarantee of
correctness beyond what those gates check, and verifier concerns (none here) would be advisory help, not
assurance.

For this increment that residual has a specific, named shape, consistent with `GRILL.md` and
`REGRESSION.md`: **the gates above cannot observe most of what this PR changed.** Comment text is never
executed, so 22 of the 23 checker rewrites are invisible to every gate; the one operative edit
(`check-structural.mjs`'s no-args `console.log`) sits on a path with **zero** test coverage. What the
gates genuinely prove here is the **absence of collateral damage** — nothing was broken by the edits —
plus, via the exact-string assertions in `check-regress.test.mjs`, that the LEAVE-SET mock data survived
for the lines those assertions actually cover. The correctness of the rewritten strings themselves rests
on the targeted per-file method and the verification grep, both **advisory**.
