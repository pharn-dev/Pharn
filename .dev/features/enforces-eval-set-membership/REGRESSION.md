# REGRESSION — enforces-eval-set-membership

Base: `ab152d9af3252a0ea07c2f4a7810e8881f8c7a50` (working-tree dogfood → `base = HEAD`, resolved by the
deterministic state test, not chosen). Machine report: `regression-report.json` (the helper's `verdict`
JSON verbatim).

## Partition (computed by `check-regress.mjs scope`, not by hand)

**Inside (7 changed paths):**

| path                                                  | note                                        |
| ----------------------------------------------------- | ------------------------------------------- |
| `pharn/floor/validate.mjs`                            | declared in the plan's `## Files`           |
| `pharn/floor/validate.test.mjs`                       | declared                                    |
| `SKILLS_VERSION`                                      | declared                                    |
| `README.md`                                           | declared                                    |
| `CHANGELOG.md`                                        | declared                                    |
| `.dev/features/enforces-eval-set-membership/PLAN.md`  | `escape_exempt` — this stage's own artifact |
| `.dev/features/enforces-eval-set-membership/GRILL.md` | `escape_exempt` — this stage's own artifact |

**`escaped: []`** — the build wrote nothing outside the plan's declared `## Files`. The declared set was
taken from `set-writes-scope.cjs --from-plan`'s parse (5 paths), **not** re-grepped out of the plan: a
first attempt did grep back-ticked paths and collected **12**, sweeping in the `## Contracts satisfied`
and out-of-scope sections. That over-broad declared set would have made a real escape unreportable —
L6's "read the structured location" applied to this stage's own input.

**Outside:** 65 test files, whole-repo `validate`, 1 committed eval pair.

## Per-gate exit codes

| gate                                    | base | head | result |
| --------------------------------------- | ---- | ---- | ------ |
| `tests` (65 outside test files)         | 0    | 0    | —      |
| `validate` (whole-repo)                 | 0    | 0    | —      |
| `structural:expected-injection-comment` | 0    | 0    | —      |

The eval-pair paths were `test -r`-confirmed before their exit code was recorded (L5 / L16 / L21): an
unreadable path REDs equally at base and head and would be classified `pre_existing`, masking a real
structural-gate flip rather than reporting it. The `tests` list was expanded via the pinned
`cat … | xargs node --test` form — neither `node --test $LIST` (zsh does not word-split) nor
`xargs -a` (GNU-only), both of which fabricate an equal-at-both-ends red.

**Style gates SKIPPED** by the deterministic config-touch rule: `inside` touches none of
`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`, so a style flip
over the byte-identical outside files is provably impossible. Absent from **both** maps, so the gate
sets match and the comparison is not inconclusive. (`npm run format:check` / `lint` / `lint:md` were run
separately at HEAD during build Step 2b and are clean — that is build hygiene, not this comparison.)

`regressions: []` · `pre_existing: []`

## Verdict (FLOOR — `check-regress.mjs verdict`, exit 0)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

Honest residual (P0/P7): this catches **exactly what the suite catches, nothing more.** A breakage no
deterministic check covers is invisible to it. "No regressions" means "every outside gate that passed at
`ab152d9` still passes at HEAD" — it is not a claim that nothing broke, and it says nothing about
whether the feature itself is correct.
