# REVIEW — f8-package-private

**Floor first (P0):** `node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities checked in .`
(exit 0). The increment reached review on a green floor.

**Diff under review** (`git diff HEAD -- package.json`): adds `"private": true` after `"version"`;
removes the `"main": "index.js"` line. Nothing else changed. The increment is `trust: untrusted` per
the loaded prefix; no instruction-looking content was found in the diff (it is two JSON key edits, no
comments, no strings a model could be steered by).

## L-floor → P0

Re-checked the plan's guarantee audit against what actually landed:

- "A real `npm publish` refuses once `private: true` is set" — labeled `advisory` (external npm
  behavior, no PHARN floor primitive). Correct label; `private: true` is now live in `package.json`,
  confirmed by direct read (`require('./package.json').private === true`).
- "`package.json` still parses and is prettier-clean" — floor-adjacent via the pre-existing
  `format:check` gate, re-confirmed GREEN at `/pharn-dev-verify` (after a whitespace-only reformat of
  `regression-report.json`, unrelated to this file — see `VERIFY.md`).
- "No `SKILLS_VERSION` bump" — enum/regex-reducible by inspection against CLAUDE.md's bump-triggering
  set; `package.json` is explicitly named as pure repo-meta. `SKILLS_VERSION` file is untouched
  (confirmed: still `2.5.1`).

No blocking finding. No guarantee is claimed here without a floor reduction or an `advisory` label.

## L-eval → P1

`package.json` carries no `role:` frontmatter and is not a Capability; P1 ("no Capability ships without
evals") does not apply. No `enforces` / `rule_id` binding is introduced. Nothing to check — no finding.

## L-trust → P2

No untrusted artifact is ingested by this increment's own content. The reviewed diff contains no
free-text finding output of its own to fence. No finding.

## L-axis → P3

One file changed (`package.json`), no sibling module reference, no `pharn-contracts` bypass. The two
edits (`add private` / `remove dead main`) were flagged at `/pharn-dev-grill` as a possible axis-bundling
concern (`GRILL.md`, `rule_id: P3`, severity minor) — re-examined here: both edits serve the single
stated axis ("`package.json` currently presents this repo as publishable/importable when it is
neither"), and splitting them into two PRs would produce no independent value (the `main` removal has no
meaning without the `private` context that explains why it's dead, and vice versa). Not elevated to
blocking; recorded as **advisory, minor** — same severity as the grill finding.

## Findings

```yaml
- type: FINDING
  rule_id: P3
  severity: minor
  file: "package.json:1"
  problem: "Two edits (add 'private', remove dead 'main') are bundled under one plan axis; defensible but worth naming explicitly in the PR description rather than left implicit."
  evidence: 'diff: +"private": true (line 4); -"main": "index.js" (line 26, pre-edit)'
```

**Gate:** advisory-gate (warn) — not a floor-detectable sibling reference, rests on judgment of what
counts as "one axis." Does not block.

## Verdict

**GREEN — 0 blocking floor-gate findings, 1 minor advisory-gate finding.** The increment is done: floor
GREEN, regress clean (`regression-report.json`: `no-regressions`), verify PASS
(`verify-report.json`: `PASS`, 0 verifiers registered), review raises no blocker.

## Proposed lesson candidate (NOT promoted here — human-gated `/pharn-dev-memory-promote` only)

**Candidate:** A `/pharn-dev-plan` for a non-Capability repo-meta fix can satisfy `check-plan-lessons.mjs`
and the P1 eval-coverage question ("None — not a Capability") while still omitting a plain verification
checklist — "how do we confirm the fix worked" — because no floor check requires one outside the
testability griller's advisory Layer-1 presence check. `/pharn-dev-grill`'s testability lens caught the gap
in this run (`GRILL.md`, `rule_id: P1`, severity important) on `.dev/features/f8-package-private/PLAN.md`,
which had no declared verification section despite the originating request including an explicit
checklist that never made it into the plan's structure. The gap was harmless here — `/pharn-dev-build` and
`/pharn-dev-verify` independently confirmed the fix live and via the deterministic gate set — but a plan for
a more complex non-Capability change could omit verification with no downstream stage catching it before
review.

**Provenance:** feature `f8-package-private`; surfaced by `.dev/features/f8-package-private/GRILL.md`
(testability griller finding, this run); commit `unknown` (uncommitted at review time).

**Not promoted:** single occurrence, not yet a recurring pattern (P7 — a real trigger exists, but
promotion is the human's call at a separate, gated `/pharn-dev-memory-promote` run).
