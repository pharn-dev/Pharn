# PLAN — validate.mjs REDs on a nonexistent / non-directory target

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L18, L20, L21, L27, L28, L29]
- increment: Make `pharn/floor/validate.mjs` exit RED (non-zero) when its target path does not exist or is not a directory, instead of reporting `GREEN — 0 capabilities checked`.
- layer(s): pharn/floor (the deterministic floor; not a capability layer per pharn/ARCHITECTURE.md §4)
- constitution_refs: [P0, P5, P6, P7]

## Applied lessons

- L21 — Its rule is this increment's rule with the sign flipped: a checker must REJECT a wrongly-shaped input rather than trust its caller. There it was a directory-shaped entry fed to a file-set checker; here it is a non-directory (or absent) path fed to a directory walker. The remedy is the same class and needs no new primitive — a shape test at the entry point.
- L20 — The defect's only remedy today is discipline ("pass the right path", "check your cwd"), and it has now cost a live investigation. That is the trigger to give it a floor check rather than a reminder. This increment is that escalation.
- L27 — The new RED serves two branches (absent path, non-directory path). Each branch gets its own message that is TRUE for that branch, so no branch prints a sentence whose subject it does not match.
- L29 — L27's remedy is quantified over a set, so the deliverable is the ENUMERATION: the test file materializes both branches in one array that the shared assertions iterate, rather than an assertion authored for whichever branch was in front of me.
- L18 — This plan's exclusion block below is a `###` HEADING, not a bold prose intro, so `set-writes-scope.cjs --from-plan` bounds the authorized list structurally at `/pharn-dev-build` Step 0.
- L28 — Every `## Files` bullet below is kept on ONE line and free of exclusion-cue vocabulary, so no authorized item's wrapped continuation line can trip Boundary 2 and truncate the parsed scope.

## Files

- `pharn/floor/validate.mjs` — add the target shape guard before the capability walk — layer pharn/floor
- `pharn/floor/validate.test.mjs` — tests for both RED branches plus the valid-empty-dir GREEN — layer pharn/floor
- `SKILLS_VERSION` — patch bump 2.7.11 to 2.7.12, since a product-floor checker's bytes change — layer root
- `README.md` — update the shields version badge to agree with the bumped SKILLS_VERSION — layer root
- `CHANGELOG.md` — record the fix and the bump under Unreleased — layer root

### Deliberately NOT in scope

- `pharn/floor/README.md` — its sentence "It exits non-zero on any RED finding" stays true after this change, so no drift is created and P7 says the smallest coherent increment stops here.
- Every other floor checker that resolves a caller-supplied path — a sweep is a separate increment with its own triggering evidence (P7); this one fixes the instance reproduced live.

## Contracts satisfied

- None in `pharn/pharn-contracts/` — this increment changes a floor checker's own entry-point behavior, not an artifact shape any contract describes. The finding it emits follows `pharn/ARCHITECTURE.md §8`'s enum-gated / free-text split (cited, not restated — P4).

## Evals to write (P1)

- Not applicable: P1 binds Capabilities (`role:`-bearing markdown). `validate.mjs` is a floor checker, whose regression suite is `pharn/floor/validate.test.mjs` — the tests below are that binding.
- `validate.mjs <nonexistent path>` → exit 1, stdout matches `FLOOR: RED` and names the path verbatim.
- `validate.mjs <a file, not a dir>` → exit 1, stdout matches `FLOOR: RED` and names the path verbatim.
- `validate.mjs <valid empty dir>` → exit 0, `FLOOR: GREEN` (the legitimate empty-walk case must not RED).
- `validate.mjs .` on the real tree → exit 0, `FLOOR: GREEN` (no false RED on the repo itself).
- Both RED branches are held in ONE enumerated array the assertions iterate (L29), so a third branch added later inherits every rule.

## Guarantee audit (P0)

- "validate.mjs REDs on a target that does not exist or is not a directory" → FLOOR: enum/regex (primitive #3) — a deterministic filesystem presence + type test at the entry point, same class as `check-structural.mjs`'s path-resolution. No LLM step.
- "a GREEN from validate.mjs now means the target was a real directory that was walked" → FLOOR, NARROWED and stated: it means exactly that the path existed and was a directory. It does NOT mean the right directory was passed — a valid-but-wrong directory (a sibling repo, a parent dir) still walks to zero capabilities and still reports GREEN. That residual is unchanged by this increment and must be stated wherever the new RED is described.
- "the two RED branches are covered" → FLOOR: the assertions are deterministic tests. ADVISORY: nothing on the floor forces `npm test` to run in any given session; the deterministic invoker is CI plus `/pharn-dev-verify`'s gate map.
- "the README badge agrees with the bumped SKILLS_VERSION" → FLOOR: enum/regex, `.dev/floor/check-version-badge.mjs`, already wired into `npm run check` and as its own ci.yml step.
- "the exit code is 1, not a new value" → design choice, ADVISORY: every existing caller branches on zero vs non-zero, so this is consistency with validate's existing RED code, not a guarantee anyone reads.

## Trust audit (P2)

- `process.argv[2]` (the target path) is operator input. It is interpolated into the RED finding's free-text `problem` field and printed to stdout as DATA — never executed, never used as an instruction, and never a basis for any branch other than the deterministic presence/type test. This matches what validate.mjs already does with `TARGET` in its GREEN line.

## Determinism audit (P5)

- The new branch is `existsSync` plus `statSync(...).isDirectory()` — deterministic filesystem predicates. No LLM classification, no fallback chain, so no "ask the human" terminal step is reachable or needed here.

## Known residuals

- A valid-but-wrong directory still reports GREEN over zero capabilities. This increment removes the fabricated-GREEN-on-a-bad-PATH class only; "GREEN" still never means "the right target was passed".
- `statSync` can throw for a path that exists but is unreadable. That case falls into the non-directory branch, whose message is worded to stay true for it ("is not a readable directory"), so no branch prints an unreachable or false sentence (L27).

## Open questions (HALT)

- None. The two design choices that could have been questions were resolved from live state this run: the exit code is 1 (every caller reads zero vs non-zero; 1 is validate's existing RED code), and `README.md` is in scope because `.dev/floor/check-version-badge.mjs` REDs `npm run check` if the badge disagrees with a bumped `SKILLS_VERSION` — verified GREEN at 2.7.11 this run.
