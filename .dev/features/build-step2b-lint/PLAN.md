# PLAN — Step 2b runs the third gate it names

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L12, L16, L19, L20, L22, L29]
- increment: Make `/pharn-dev-build` Step 2b RUN `eslint` over the paths it formatted, instead of naming it in a prose "confirm these are clean" line, and pin the three-gate set with a test that iterates it.
- layer(s): build apparatus (`.claude/commands/` + `.dev/floor/`); not a product capability, so no `SKILLS_VERSION` bump
- constitution_refs: [P0, P5, P7]

## Applied lessons

- L12 — This increment repairs the step L12 created. L12's prevention-at-build thesis is unchanged and still advisory; what changes is that its third gate becomes something the step DOES rather than something it ASKS for.
- L20 — The failing half's only remedy was "the agent should remember to confirm", and it failed live in the `validate-bad-target` run one stage later. A second occurrence of a discipline-only remedy is the trigger to mechanize it, not to reword it.
- L22 — The prose "Confirm `npm run lint` is clean" leaves the invocation open, which is the accumulating-defect shape L22 names. The fix pins the literal command line inside the existing block so nothing is left to choose.
- L29 — The remedy is quantified over the three gates Step 2b names, so the deliverable is the ENUMERATION: one array in the test that the assertions iterate, not an assertion authored for whichever gate was missing today.
- L16 — The new invocation is guarded against the empty-list case exactly as the markdownlint line beside it already is, because GNU `xargs` runs a command once with NO arguments on empty input and a path-less linter falls back to its own globs.
- L19 — The invocation is scoped to the paths in `.pharn/writes-scope.json`, never repo-wide, because a formatter or linter run through Bash escapes the fix #7 writes-scope entirely.

## Files

- `.claude/commands/pharn-dev-build.md` — Step 2b runs eslint over the scoped paths — layer apparatus
- `.dev/floor/command-hygiene.test.mjs` — pin the enumerated three-gate set for Step 2b — layer apparatus
- `CHANGELOG.md` — record the apparatus fix and that it carries no bump — layer root

### Deliberately NOT in scope

- `eslint --fix` — the new invocation READS. Auto-fixing lint findings is a different axis with its own risk, and the failure that triggered this increment (`no-useless-assignment`) has no autofix, so mechanizing a fixer would be the speculative half (P7).
- A `command-hygiene` rule banning a path-less `eslint`, mirroring the prettier and markdownlint rules — no run has produced that defect, so its trigger has not fired (P7). The empty-list guard below prevents authoring it here.
- The other artifact-writing stages' format blocks — they format a single named artifact rather than a parsed scope list, so the defect this fixes does not exist there.

## Contracts satisfied

- None in `pharn/pharn-contracts/`. This changes a build-apparatus command's own procedure and the test that pins it; no artifact shape any contract describes is affected.

## Evals to write (P1)

- Not applicable: no `role:`-bearing capability is added. The binding is the test file named above.
- `.dev/floor/command-hygiene.test.mjs` gains one enumerated set — `{prettier, markdownlint-cli2, eslint}` — with a membership rule iterating it, so Step 2b dropping or never gaining any member is a RED.
- The existing repo-wide-formatter rules must still pass over the edited command: the new line must not trip the `prettier --write .` / bare `markdownlint-cli2 --fix` patterns.

## Guarantee audit (P0)

- "Step 2b runs eslint over the scoped paths" → ADVISORY. Running a linter is orchestration, not a floor op — exactly as L12 labels the prettier half. Nothing on the floor forces Step 2b to execute, and an early abort skips it.
- "Step 2b's prose cannot silently lose one of the three gates it names" → FLOOR: enum/regex (primitive #3) — a membership test over the command file's text, iterated across the enumerated set.
- "the deterministic style verdict" → unchanged, and still `/pharn-dev-verify`'s `check-verify.mjs` gate map (L9). This increment moves prevention earlier; it does not move the guarantee.
- "no `SKILLS_VERSION` bump" → the three files are build apparatus and repo-meta, none in the bump-triggering product-surface set.

## Trust audit (P2)

- The scope list read by Step 2b comes from `.pharn/writes-scope.json`, written by the deterministic setter from an approved plan — not model-chosen. The new invocation consumes only those paths and an exit code; it reads no free-text and makes no branch on one.

## Determinism audit (P5)

- The only branch added is the non-empty test on the path list, a string-emptiness check. The test's membership rules are regex/substring over a fixed enumerated set. No LLM classification, so no fallback chain and no terminal "ask" is reachable.

## Known residuals

- Step 2b stays ADVISORY end to end: the pin proves the command file NAMES and RUNS three gates, never that a given run executed them. A run that skips Step 2b entirely is still caught only downstream, at `/pharn-dev-verify`.
- The pin is textual. It proves the invocation is present in the block, not that it is correct — a mistyped flag would satisfy it.

## Open questions (HALT)

- None. The remedy was specified and reviewed in `.dev/features/validate-bad-target/REVIEW.md` finding F3 during this session, and the failure that triggers it was reproduced live there.
