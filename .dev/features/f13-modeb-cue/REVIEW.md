# REVIEW — f13-modeb-cue

**Floor first (P0):** `node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities checked in .`
The increment reached review with a green floor. Final diff: `.claude/commands/pharn-plan.md`,
`CHANGELOG.md`, `SKILLS_VERSION`, `README.md` — exactly the amended `PLAN.md`'s `## Files`, `escaped:
[]` (confirmed by `/pharn-dev-regress`).

## L-floor → P0

No new guarantee claim. The increment's own guarantee audit (in `PLAN.md`) labels the caveat prose
`advisory` and the unchanged-parser claim as reducing to the existing floor (the untouched
`set-writes-scope.cjs` + its unmodified, still-green test suite). Reviewed the actual diff: the caveat
text added to `pharn-plan.md` makes no guarantee claim of its own — it is pure author-facing guidance.
`check-version-badge.mjs`'s live check (`.dev/floor/check-version-badge.test.mjs`) now correctly reports
GREEN for `README.md` vs `SKILLS_VERSION` `2.5.3`. **No findings.**

## L-eval → P1

Not applicable — no new Capability, no new `rule_id`, confirmed by `validate.mjs` staying at the same
36-capability count before and after this increment. The plan's "None" declaration and the floor agree.
**No findings.**

## L-trust → P2

No finding-emitting Capability was introduced or modified. The build prompt (the increment's own
provenance) was treated as `trust: untrusted` throughout the pipeline; nothing instruction-looking in it,
in the PLAN, in the GRILL findings, or in the diff changed agent behavior outside the human-gated
plan → grill → build → regress → verify → review sequence. **No findings.**

## L-axis → P3

Four files changed, one axis: documenting and shipping the writes-scope exclusion-cue caveat (the doc
edit itself, plus its mandatory version/changelog bookkeeping, plus the badge correction that
bookkeeping's own live invariant required). No sibling module reference introduced; `.claude/commands/*.md`
and root files are outside the `pharn-contracts` layer tree entirely. **No findings.**

## Findings

None — floor-gate or advisory.

## Proposed lesson candidate (for a separate, human-gated `/pharn-dev-memory-promote` run)

**Candidate.** _A `SKILLS_VERSION` bump must be planned together with the README badge it feeds, or a
later stage catches it as a false "regression."_

**Why it's real, not hypothetical (P7):** this increment's own first `/pharn-dev-regress` pass caught
exactly this. The plan bumped `SKILLS_VERSION` `2.5.2` → `2.5.3` without declaring `README.md` in
`## Files`; `.dev/floor/check-version-badge.test.mjs` runs live against the actual repo (not a fixture),
so the `tests` gate flipped GREEN → RED at `/pharn-dev-regress`, correctly surfaced as a deterministic
regression, and required a mid-run plan amendment (adding `README.md`, updating the badge, re-running
build + regress) to resolve. The checker itself already prints the fix
(`FIX: SKILLS_VERSION is the single source — update the README badge to match it`) — nothing here is
new information the tooling doesn't already say, but this increment shows a plan can still omit it, and
that the omission is caught **downstream at regress**, not at plan or build time, which costs a full
extra planning/build/regress cycle.

**Suggested remedy, for the human to weigh at promotion:** `/pharn-dev-plan` and `/pharn-dev-build`'s
lessons/guidance could name this pairing explicitly (mirroring how `check-version-badge.mjs`'s own
addition was itself driven by `.dev/memory-bank/lessons-learned.md` **L20** — a defect whose only
remedy is "remember" earns a floor check) — though a full floor check here would mean `/pharn-dev-plan`
itself asserting `## Files` completeness against `SKILLS_VERSION` diffs, which is a larger, separate
design question left to the human/promotion step, not decided here.

**Provenance.**

- feature: `f13-modeb-cue`
- commit: not yet committed (this REVIEW predates the commit; `/pharn-dev-memory-promote`, if run, should
  capture the eventual commit SHA or `unknown`)
- source: `.dev/features/f13-modeb-cue/REGRESSION.md` ("First pass — a real regression, since corrected")
  - `.dev/features/f13-modeb-cue/PLAN.md`'s amended `## Files` entry for `README.md`

## Verdict

**GREEN — no floor-gate or advisory findings.** One lesson candidate is proposed above for a human to
weigh at a separate `/pharn-dev-memory-promote` run; nothing here blocks the increment.
