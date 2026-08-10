# PLAN — regress-escape-artifacts

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4
- applied_lessons: [L1, L8, L13, L17, L18, L20]
- increment: Give L17 the deterministic floor check L20 says it has long since earned — exempt the pipeline's own audit artifacts (closed filename enum, under an explicit `--feature`) and the four hook-protected trusted docs from `check-regress.mjs scope`'s `escaped` set, reporting every exemption rather than dropping it silently.
- layer(s): `pharn/floor/` — the deterministic floor of `pharn/ARCHITECTURE.md §2` (primitive #3, enum/path membership); no capability module is touched.
- constitution_refs: [P0, P2, P4, P5, P6, P7]

## Applied lessons

- L17 — this increment IS L17's remedy. Its defect statement is implemented literally: `scope` computes `escaped` over `git diff <base>`, a **changed-since-base** test reported as a **written-by-the-build** test, so with `base = HEAD` every sibling stage's artifact reads as an escape. L17 names two remedies; only one is implementable (see the Guarantee audit).
- L20 — the trigger. L20's rule is that a lesson whose only remedy is discipline WILL recur and that **the second occurrence is the trigger to give it a floor check**. Counted live this run: `grep -rl 'L17' .dev/features/*/REGRESSION.md` returns **12** files, of which `format-step-scope` records the class _not_ firing — **11 runs** applied the exclusion by hand. The trigger is 9 occurrences past due, which is the P7-required real failure, not a hypothetical.
- L1 — meta-doc sweep: `CHANGELOG.md` + `SKILLS_VERSION` are in `## Files`. The README `CURRENT-STATE` region counts `pharn/floor/*.mjs` files (46) — this increment adds **no** checker, so the count is unchanged and no regeneration is owed.
- L8 — the setter narrows one `--target` per call; all six paths below are concrete, so the build scope comes from `## Files` via `--from-plan`, with no `--target`.
- L13 — every artifact this increment's stages write is formatted scoped to itself, never repo-wide (L19's Bash escape).
- L18 — the exclusion block below is a `###` **heading**, so `set-writes-scope.cjs --from-plan` terminates the authorized list structurally rather than on a prose-vocabulary match.

## Files

- `pharn/floor/check-regress.mjs` — the two closed exemption enums + `escape_exempt` reporting — layer `pharn/floor/`
- `pharn/floor/check-regress.test.mjs` — cases pinning both exemptions, their narrowness, and the fail-closed default — layer `pharn/floor/` (test, never shipped)
- `.claude/commands/pharn-dev-regress.md` — pass `--feature <name>` to `scope` — dev command
- `.claude/commands/pharn-regress.md` — same, product command
- `CHANGELOG.md` — one `## [Unreleased]` entry — repo-meta
- `SKILLS_VERSION` — `2.4.3` → `2.4.4` (patch) — repo-meta

### Deliberately NOT in scope

- `.claude/hooks/*` — the fix #7 guard itself is correct and unchanged; this fixes a **reporting** defect in a checker, not the guard.
- The four trusted docs — human-only, hook-denied; this increment _reads_ their paths into an enum, it never writes them.
- `.dev/memory-bank/lessons-learned.md` — L17's canon entry deserves an update noting it now has a floor check, but canon is written **only** by a human-gated `/pharn-dev-memory-promote` run (L7 — a stage that merely proposes must not hold write-scope to canon).
- Every other `pharn/floor/*` checker — a different axis.

## Contracts satisfied

- No `pharn/pharn-contracts/` contract changes shape. The emitted findings keep the `finding-shape.md` enum-gated / free-text split unchanged (cited, not restated — P4); `escape_exempt` is a new **enum-gated** field (paths only, no free text).

## Evals to write (P1)

No Capability and no `rule_id` are added, so no eval pair is owed; the obligation is the `node --test` suite:

- The live defect, as a regression test → a feature's own `PLAN.md` / `GRILL.md` in `--changed` but not `--declared`, with `--feature` given → **exit 0**, `escaped: []`, and both paths listed in `escape_exempt`.
- Narrowness → a **stray** file under the same feature directory (`notes.md`, not in the artifact enum) → still **exit 1**, still `escaped`.
- Narrowness → the same artifact filename under a **different** feature's directory → still `escaped` (the exemption is per-`--feature`, not repo-wide).
- Fail-closed → **no** `--feature` passed → the artifact is NOT exempt and still `escaped` (the exemption is opt-in, never inferred).
- Trusted docs → `pharn/ARCHITECTURE.md` changed and undeclared → exempt and reported, with **no** `--feature` needed.
- Non-regression → a genuine escape (an undeclared source file) is still a blocking `P0` finding.

## Guarantee audit (P0)

- "The pipeline's own artifacts and the trusted docs are exempt from the escape set" → **floor: enum / path membership** (primitive #3). Exact filename membership in a closed list under an exact directory prefix — no glob over the feature dir, no judgment.
- "A genuine escape is still caught" → **floor: enum / path membership**. Unchanged: the exemptions subtract two closed sets; everything else still fails `matchesAny(f, declared)`.
- "The exemption is visible" → **floor: the `escape_exempt` field is always emitted**, so a suppressed path is reported, never silently dropped. (Whether a human reads it is advisory — the point is that it is not hidden.)
- "A trusted doc in the diff was not written by the build" → **floor: hook (fix #2)** for the Write/Edit/MultiEdit surface — `protect-trusted-paths.cjs` denies those at exit 2. **NARROWED, and stated:** a Bash-tool write bypasses `PreToolUse` entirely (L19), so this is "the build could not have written it _with the Write tool_", not "no process changed it".
- "Deriving the escape set from `.pharn/writes-scope.json` instead" → **rejected as unimplementable, not as inferior.** That file is a single mutable record every stage's Step 0 overwrites; verified live that it holds the _last_ stage's scope by the time regress runs. It would need a durable per-build record that does not exist. Recorded so L17's other remedy is not silently ignored.

## Trust audit (P2)

`--feature` and `--changed` are untrusted CLI operands. They are used **only** as string prefixes and exact set members — never globbed, never compiled into a `RegExp`, never executed. The exemption cannot be widened by a crafted value: a `--feature` containing `..` or `*` produces a directory prefix that simply matches nothing, because the comparison is literal `startsWith` plus exact membership, not a glob. No free-text field is read, and the emitted `escape_exempt` carries paths only.

## Determinism audit (P5)

Every new branch is a membership test: exact filename in `PIPELINE_ARTIFACTS`, exact path in `TRUSTED_DOCS`, literal directory prefix. No classification. Absent `--feature`, the artifact exemption is simply off — the fail-closed direction.

## Open questions (HALT)

None. The design decision L17 left open (which of its two remedies) is settled by discovery, not preference: the `.pharn/writes-scope.json` route is unimplementable as stated, verified live. Recorded in the Guarantee audit rather than posed as a question.
