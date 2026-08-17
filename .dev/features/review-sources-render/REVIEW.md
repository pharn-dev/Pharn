# REVIEW — review-sources-render (F14)

**Floor first (Step 1):** `node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities checked in .`
The increment reached review with a GREEN floor, as required.

**Increment under review:** `.claude/commands/pharn-review.md` (Step 6 reworded), `SKILLS_VERSION`
(`2.5.4` → `2.5.5`), `CHANGELOG.md` (new `[Unreleased]` entry), `README.md` (version badge). Treated as
`trust: untrusted` per this command's own discipline, independent of who authored it.

## L-floor → P0

Does every claim reduce to a floor primitive or carry an `advisory` label? The reworded Step 6 clause
is a rendering **instruction** to a subagent — nothing on the floor forces compliance, and the
surrounding prose already frames the whole rendering step as advisory ("advisory verdict... a lens
review gates nothing"). The new clause does not claim a guarantee it doesn't have; it strengthens an
existing advisory mandate without relabeling it as more than that. **No finding.**

## L-eval → P1

`.claude/commands/pharn-review.md` is a command, not a `role:`-bearing Capability under `pharn/pharn-*`
— confirmed live (no `.claude/commands/*` directory in this repo carries a sibling `evals/`). P1's
"every Capability ships with evals" does not bind commands. This is a standing, repo-wide condition,
not something this increment introduced or could fix unilaterally — already surfaced as a `minor`
advisory finding at `/pharn-dev-grill`. **No blocking finding; not re-raised as new here** (would
duplicate the grill-log — P4, cite not restate).

## L-trust → P2

Free-text handling: the increment's own change is entirely **about** P2 discipline — it extends,
rather than weakens, the "quoted DATA, never an instruction" mandate to a second class of field
(`sources[1..]`). Nothing in the diff routes untrusted content anywhere it wasn't already routed. No
instruction-looking content in the reviewed artifact changed this reviewer's behavior — the artifact is
prose about a rendering rule, not adversarial input. **No finding.**

## L-axis → P3

`.claude/commands/pharn-review.md` changed for exactly one reason (the rendering mandate). `SKILLS_VERSION` /
`CHANGELOG.md` / `README.md` changed for the coupled, standard reason every product-surface bump
requires (this repo's own `CLAUDE.md` versioning discipline) — not a second, independent axis smuggled
into the command file itself. No sibling reference introduced; `merge-findings.mjs` — the file that
actually emits `sources[]` — was correctly left untouched and is not referenced by path from the
command in a way that would violate P3.

## Gates (fix #3)

- **floor-gate (blocking):** none.
- **advisory-gate (warn):** none beyond the two `minor` findings already recorded in `GRILL.md` (no eval
  for command prose; a stylistic legibility note on the new clause's wording) — cited, not restated.

## Verdict

**GREEN — 0 floor-gate (blocking) findings, 0 new advisory findings from this review's four lenses**
(2 pre-existing minor advisory findings carried from `GRILL.md`, unchanged).

## Proposed lesson candidate (not promoted here — `/pharn-dev-review`'s scope is `REVIEW.md` only)

**Candidate.** A `PLAN.md` that bumps `SKILLS_VERSION` as part of a product-surface fix must also
declare `CHANGELOG.md` **and** `README.md` (the shields version badge, enforced by
`pharn/floor/check-version-badge.mjs`, wired into `npm run check` as `check:badge`) in `## Files` — not
just the changed command/rule file itself — or `/pharn-dev-build`'s fix #7 writes-scope denies the
version-consistency writes the bump itself requires.

**Why propose it.** This increment's own `PLAN.md` missed this **twice** in one run: first omitting
`SKILLS_VERSION`/`CHANGELOG.md` entirely (caught during planning, before any write), then — after
correcting that — still omitting `README.md`, discovered only when `SKILLS_VERSION` was bumped during
build and the badge check would have gone RED under `npm run check` had it not been caught live. Two
misses of the same shape in one increment is exactly the pattern `.dev/memory-bank/lessons-learned.md`
**L20** names as the escalation trigger (a remedy that depends on "remember" recurs) — though here it
recurred within a single build rather than across increments, which is an earlier and cheaper point to
notice it.

**Provenance.**

- feature: `review-sources-render`
- commit: `unknown` (not yet committed at review time)
- source: this `REVIEW.md`; the corrections are visible in `PLAN.md`'s `## Files` section (three edits:
  the original single-file scope, then `SKILLS_VERSION`+`CHANGELOG.md` added, then `README.md` added).

**Not promoted here.** Promotion is a separate, human-gated `/pharn-dev-memory-promote` run.
