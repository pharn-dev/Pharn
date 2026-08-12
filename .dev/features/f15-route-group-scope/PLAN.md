# PLAN — f15-route-group-scope

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52
- applied_lessons: [L19]
- increment: Fix `set-writes-scope.cjs`'s `clean()` regex so it strips only a space-separated trailing annotation (e.g. `(gated)`), not a path segment that itself ends in `)` — a Next.js route-group directory (`app/(marketing)`) was being mangled to `app/`, silently under-scoping the writes-scope guard for a common real-world layout.
- layer(s): pharn-core (the `.claude/hooks/` deterministic tooling; not a `pharn-*` capability layer)
- constitution_refs: [P0, P5, P6, P7]

## Applied lessons

- L19 — During the write procedure, `set-writes-scope.cjs` is edited via **Bash** (self-lock, F3) rather than Write/Edit, which is exactly the escape hatch L19 warns bypasses fix #7 unchecked. This plan's Bash edit is a single targeted `sed`/heredoc replacement of the one regex line — never a repo-wide command — and no formatter is invoked over anything outside the plan's own `## Files`. `npx prettier`/`markdownlint` are run only on this stage's own `PLAN.md` (per the dev-plan command's own Step-4 formatting step), never repo-wide.

## Files

- `.claude/hooks/set-writes-scope.cjs` — tighten `clean()`'s regex from `\s*\([^)]*\)\s*$` to `\s+\([^)]*\)\s*$` (edited via Bash — self-locked by `protect-trusted-paths.cjs`, F3; not a Write/Edit-tool path)
- `.claude/hooks/set-writes-scope.test.cjs` — add the fix test, the annotation-preserved test, the route-group-file regression test, and record the mutant check
- `CHANGELOG.md` — add an `[Unreleased]` entry under `### Fixed` naming the defect, the fix, and the patch bump
- `SKILLS_VERSION` — bump patch from `2.5.1` to `2.5.2`
- `README.md` — update the shields version badge from `pharn-2.5.1` to `pharn-2.5.2` (line 13), matching the `SKILLS_VERSION` bump. **Added after `/pharn-dev-regress`'s first run surfaced a real regression:** `.dev/floor/check-version-badge.test.mjs`'s live-repo self-test flipped pass→fail because the original `## Files` list bumped `SKILLS_VERSION` without also moving the badge `.dev/floor/check-version-badge.mjs` holds to agreement with it. This is a scope widening ratified by the human at that regression stop, not a silent addition — the regression report (`.dev/features/f15-route-group-scope/REGRESSION.md`) is the record of why.

## Contracts satisfied

- No `pharn-contracts` schema governs `.claude/hooks/*.cjs` directly — these are the fix #7 floor mechanism itself (`pharn/ARCHITECTURE.md §2` primitive #1, hooks), referenced by contract text (`pharn/ARCHITECTURE.md:73`, `:240`) but not schema-shaped. The correctness contract here is the existing hook's own header comment (`clean()`'s doc comment: "Strip a trailing `(annotation)`") — the fix makes the regex match that comment, it does not change the contract.

## Evals to write (P1)

- N/A — `.claude/hooks/*.cjs` are dev tooling (deterministic hooks), not `role:`-bearing Capabilities under `pharn/pharn-*`, so P1's eval-per-Capability requirement does not apply. Coverage is via `node --test` unit tests in `set-writes-scope.test.cjs` (existing convention for this file), enforced by `/pharn-dev-verify`'s `test` gate.

## Guarantee audit (P0)

- "A route-group directory entry (`app/(marketing)`) survives `clean()` intact" → floor: enum-regex (the tightened `\s+` pattern), pinned by a `node --test` case in `set-writes-scope.test.cjs`, which is itself gated by `/pharn-dev-verify`'s `test` gate (`npm run check`).
- "The documented annotation-strip (`(gated)`) still fires" → floor: enum-regex, pinned by a regression test in the same file. Narrowed and stated: no real shipped `writes:`/`## Files` entry in this repo currently exercises this path (confirmed by discovery grep across `.claude/commands/*.md` frontmatter) — the test guards against a _future_ input, not a currently-live one.
- "`set-writes-scope.cjs` was edited only via Bash, never Write/Edit" → floor: hook (`protect-trusted-paths.cjs` denies Write/Edit/MultiEdit to this file outright, confirmed live this run: exit 2). This is not something the plan can violate even if it tried — it is a structural fact about the write path.
- "The fix does not newly-RED an existing install" → advisory (a correctness argument about semver compatibility, not a floor-checked property): a route-group entry that was silently under-scoped now scopes correctly (fail-closed → correct, never the reverse), and a spaced annotation still strips identically. No floor primitive verifies backward-compatibility across installs; this is reasoned, not measured.

## Trust audit (P2)

N/A — no untrusted artifact is ingested by this increment. The fix touches the hook's own regex logic; the increment does not process a `writes:`/`## Files` declaration from an untrusted PLAN as part of building itself (the _test_ fixtures constructed for `set-writes-scope.test.cjs` are trusted, agent-authored test data, not the untrusted-input class the hook itself handles at runtime).

## Determinism audit (P5)

The fix is a single-character class change to a fixed regex (`\s*` → `\s+`) — a membership/pattern-match change, not a branch. No new branching is introduced. The decision to tighten rather than remove the paren-strip was resolved in discovery (below), not deferred to a runtime fallback.

## Decision resolved in discovery (`\s+` vs. removal)

Chose **`\s+`** (tighten, not remove), matching the build prompt's own recommendation. Evidence gathered live this run:

- `grep` across every `.claude/commands/*.md` frontmatter `writes:` block found no entry using a trailing `(annotation)` form — the only paren-containing entry (`pharn-build.md:17`) is a `<placeholder>` ending in `>`, not `)`, so `clean()`'s trailing-paren regex never matches it regardless of `\s*` vs `\s+`.
- No test in `set-writes-scope.test.cjs` exercises `clean()`'s annotation-strip today.
- So the annotation-strip is **provably unexercised by any live input in this repo** — removal would be defensible, but per the build prompt's own instruction ("do not remove without that evidence" of it being _exercised_, and recommending `\s+` regardless), `\s+` is the smaller, lower-risk change: it preserves the documented behavior for a future frontmatter `writes:` value that legitimately wants a spaced annotation, at zero cost, versus removal which would need to disclose a behavior change for no compensating benefit.

## Open questions (HALT)

None outstanding — the build prompt itself resolves scope, decision, and versioning; discovery confirmed every factual premise it makes (reproduction, self-lock, test-file being unprotected, absence of any real annotation-strip usage) against live state this run.
