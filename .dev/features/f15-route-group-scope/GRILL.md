# GRILL — f15-route-group-scope

**Plan:** `.dev/features/f15-route-group-scope/PLAN.md`
**Spec-hash check:** recomputed `sha256(pharn/ARCHITECTURE.md)` = `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52` — matches the plan's pinned `spec_content_hash`. No drift; nothing to surface here (`/pharn-dev-build`'s own gate re-verifies this at build time regardless).

**Grillers discovered:** `node pharn/floor/count-grillers.mjs .` → 13 registered (`a11y, architecture, comprehension, coupling, documentation, error-handling, i18n, migrations, observability, performance, privacy, security, testability`). Ran all 13; three (`a11y`, `i18n`, `migrations`) declare `applies: ["ssr","spa"]` / `["backend","ssr"]` and this increment is a Node CLI hook regex fix with no ssr/spa surface and no schema change — noted as **not applicable by `applies` membership**, not silently skipped.

## Findings

```yaml
- type: FINDING
  rule_id: P3
  severity: minor
  file: ".dev/features/f15-route-group-scope/PLAN.md:6"
  problem: "The plan's `layer(s)` field names `pharn-core` for a change that is NOT in the pharn-core capability tree, then says so in the same breath — a self-contradictory label for a human skimming just that line."
  evidence: "- layer(s): pharn-core (the `.claude/hooks/` deterministic tooling; not a `pharn-*` capability layer)"
```

**Architecture griller (Layer 2, advisory judgment):** `pharn-core` is a specific capability-tree directory under `pharn/pharn-core/` (`pharn/ARCHITECTURE.md §4`). `.claude/hooks/*.cjs` is build-apparatus tooling that implements the floor's hook primitive — it sits **outside** the `pharn/` capability tree entirely, alongside `.claude/commands/`. Labeling it `pharn-core` and then immediately disclaiming "not a `pharn-*` capability layer" in the same field reads as a mislabel corrected inline rather than a considered classification. This is a **plan-metadata clarity concern, not a structural fit violation** — the plan does not actually couple a leaf to a sibling, invert a layer, or reinvent a mechanism; it just picked the wrong layer name for a file class that has no `pharn-*` layer name to pick. Recommend the field read something like `layer(s): build-apparatus (.claude/hooks/ — outside the pharn/ capability tree; implements floor primitive #1)` in a future increment's plan template guidance, but this is **not worth blocking a one-line regex fix to re-approve a plan over** (P7 — proportionality).

**Coupling griller:** the four `## Files` entries (the hook, its test, `CHANGELOG.md`, `SKILLS_VERSION`) are the standard SKILLS_VERSION-discipline bundle (fix + its proof + its version record), not sibling entanglement — no finding.

**Security griller:** Layer 1 (floor) — `node pharn/floor/scan-plan-secrets.mjs PLAN.md` → `{"found":false,"hits":[]}`, clean. Layer 2 (advisory) — the increment touches a security-relevant floor guard (the writes-scope setter) but only tightens an existing regex; it introduces no new sensitive/destructive operation, no injection surface, and does not weaken `enforce-writes-scope.cjs` or `protect-trusted-paths.cjs` — no concern.

**Testability griller:** Layer 1 (floor-checkable presence) — a verification section is **present**: the plan's `## Files` names four new `node --test` cases (fix, annotation-preserved, route-group-file regression, mutant-revert) and `## Evals to write` explains why Capability-eval coverage doesn't apply to dev-tooling hooks. No absence finding. Layer 2 (advisory adequacy) — the four cases cover the fix, the preserved behavior, a regression guard, and a mutant check (proving the test can fail) — adequate for a one-line regex change; no concern.

**Error-handling griller:** considered whether tightening `\s*`→`\s+` could newly break a case that previously worked. The only behavior removed is matching **zero** spaces before the trailing paren — exactly the route-group bug pattern being fixed; every previously-intended annotation-strip (which the plan's own discovery found written with a leading space per the source comment) still matches. No new failure mode identified — no finding.

**Observability, performance, privacy, documentation, comprehension grillers:** no concerns raised. The fix is a single regex-class tightening with no new logging/metrics surface, no scale-sensitive path, no personal data, and the plan's own "Decision resolved in discovery" section already documents the _why_ (not just the _what_) for a future reader.

## Summary

One advisory, minor-severity finding: the plan's `layer(s)` field is an internally-contradictory label (names `pharn-core` then disclaims it) rather than a real structural-fit problem. No blocking-severity concern from any of the 13 registered grillers or the inline Step-2 axes. The spec→plan hash chain holds (re-verified live, matches the plan's pin). The secret scanner is clean.

**ADVISORY VERDICT: 1 concern raised (0 blocking-severity, 1 minor-severity) — for the human to weigh before `/pharn-dev-build`. This is not a pass/fail signal; `/pharn-dev-grill` gates nothing (P0). The deterministic backstops that actually gate remain `/pharn-dev-build`'s spec-hash check and `pharn/floor/validate.mjs`.**
