# GRILL — f13-modeb-cue

Plan under interrogation: `.dev/features/f13-modeb-cue/PLAN.md` (option A, approved by the human at
GATE 1). Spec-hash check: **MATCH** — `sha256(pharn/ARCHITECTURE.md)` recomputed live as
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`, identical to the plan's
`spec_content_hash`. No drift; `/pharn-dev-build`'s floor-gate (fix #4) will pass this check too.

Griller discovery (`node pharn/floor/count-grillers.mjs .`): 13 `role: griller` capabilities
registered (a11y, architecture, comprehension, coupling, documentation, error-handling, i18n,
migrations, observability, performance, privacy, security, testability). This increment adds no
application code (no SSR/SPA/backend surface), so the `applies: ["ssr","spa"]` (a11y, i18n) and
`applies: ["backend","ssr"]` (migrations) grillers have no target to interrogate — their axis does not
exist for a `.claude/commands/*.md` prose edit, and running them would manufacture findings against
nothing. The `applies: ["universal"]` grillers were interrogated against the plan below, keyed by the
principle each `enforces`.

## Findings

```yaml
- type: FINDING
  rule_id: "P5"
  severity: minor
  file: ".dev/features/f13-modeb-cue/PLAN.md (build-prompt provenance, not a PLAN.md line)"
  problem: "The build prompt's 'Write procedure' step for option (A) says to scope with `set-writes-scope.cjs --from-frontmatter <scratch> --allow-claude-dir` for `.claude/commands/pharn-plan.md`, but `--allow-claude-dir` is only required for CONTROL_SURFACE entries (`.claude/settings.json`, `.claude/settings.local.json`, and the three hook scripts) — `.claude/commands/pharn-plan.md` is not one of them, and the setter's header states command files are deliberately exempt from the opt-in flag."
  evidence: "'set a writes-scope with set-writes-scope.cjs --from-frontmatter <scratch> --allow-claude-dir for .claude/commands/pharn-plan.md, CHANGELOG.md, SKILLS_VERSION'"
```

Non-blocking: harmless if followed literally (the flag is simply a no-op when no CONTROL_SURFACE path
is in scope), and moot under `/pharn-dev-ship`/`/pharn-dev-build` regardless — `/pharn-dev-build`'s own
Step 0 scopes from the approved `PLAN.md`'s `## Files` via `--from-plan`, which already authorizes
exactly `.claude/commands/pharn-plan.md`, `CHANGELOG.md`, and `SKILLS_VERSION` with no flag needed.
Flagged only so the human isn't surprised if they later run the manual procedure by hand outside
`/pharn-dev-ship`.

No other findings. Specifically checked and clean:

- **P0 (guarantee-audit completeness):** every claim in the plan's Guarantee audit section either
  names a floor primitive (`check-version-badge.mjs`'s narrowed scope, `set-writes-scope.test.cjs`
  unchanged-and-green) or is explicitly labeled `advisory` (the caveat's prose guidance). Nothing reads
  as a guarantee without a reduction.
- **P1 (eval coverage):** correctly scoped as not applicable — `/pharn-plan.md` is a command doc, not a
  `role:`-bearing Capability (`pharn/ARCHITECTURE.md §3.1`), so P1's per-Capability eval requirement does
  not attach to it. No new `rule_id` is introduced by this increment for a testability griller to check
  binding on.
- **P2 (trust propagation):** correctly marked not applicable — no untrusted artifact is ingested by
  the increment's own work (the build prompt's task description contains no instruction-looking content
  beyond ordinary prose).
- **P3 (one axis of change / no sibling imports):** the three touched files (`pharn-plan.md`,
  `CHANGELOG.md`, `SKILLS_VERSION`) are one coherent change-reason (documenting a caveat + its mandatory
  version/changelog bookkeeping under this repo's own SKILLS_VERSION discipline) — not two unrelated
  reasons bundled. No sibling-module reference is introduced; a command doc is not part of the
  `pharn-contracts` layer tree.
- **P5 (determinism):** both prior open questions (option A vs B; the 2.5.1-vs-2.5.2 version-base
  discrepancy) were resolved by asking the human at GATE 1, not guessed. The plan's own remaining
  branches (which file gets which edit) are fixed, not classified.
- **P7 (honest scope / no speculation):** the plan explicitly excludes touching
  `set-writes-scope.cjs` (option B) and `pharn-dev-plan.md` (no parity edit requested by the build
  prompt) under `### Explicitly not touched`, with reasons — the smallest coherent increment, not two
  bundled. The lesson L18 citation is genuinely on-point (same code path, adjacent failure mode), not a
  padded citation.
- **Architecture/coupling axis:** no new module, no layer crossing; a `.claude/commands/*.md` edit is
  outside `pharn/ARCHITECTURE.md §4`'s capability layer tree entirely, so there is nothing to couple.
- **Security/privacy axis:** no secret, credential, or PII-shaped content is added or handled; the
  caveat text is pure process documentation.
- **Documentation/comprehension axis:** the plan's stated placement (after rule 3, before the closing
  `## Steps` sentence, in the existing "Three rules keep it parseable" blockquote) keeps the new caveat
  co-located with the rules it qualifies, and the plan separately calls out correcting the adjacent
  "only back-tick paths become the build's scope" sentence so the new caveat doesn't read as
  contradicting it — a comprehension-griller-shaped concern the plan already anticipated and handled.

## Summary

The plan is narrowly scoped, cites a genuinely relevant lesson (L18) with a substantive rather than
decorative explanation of the connection, and its guarantee audit is honest about what is advisory
(the prose caveat) versus what reduces to floor (the unchanged hook, checked by the unmodified test
suite). The single finding above is a minor discrepancy in the build prompt's own suggested
write-procedure command, not in the plan; it does not affect what `/pharn-dev-build` will actually do
under `/pharn-dev-ship`, where scope is set programmatically from the plan's `## Files`, not by hand.

**ADVISORY VERDICT: 1 concern raised (0 blocking-severity, 1 minor) — for the human to weigh before
`/pharn-dev-build`. This is advisory input, not a gate; `/pharn-dev-build`'s own floor-gates (spec-hash
re-check, fix #4; writes-scope, fix #7) are what actually enforce anything here.**
