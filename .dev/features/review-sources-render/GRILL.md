# GRILL — review-sources-render (F14)

**Plan:** `.dev/features/review-sources-render/PLAN.md`. **Spec-hash check:** recomputed
`sha256(pharn/ARCHITECTURE.md)` = `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`,
matches the plan's `spec_content_hash` exactly — **no drift** (surfaced here per fix #4; the actual
block on drift belongs to `/pharn-dev-build`, not this stage).

**Grillers discovered:** `node pharn/floor/count-grillers.mjs .` → 13 registered
(`a11y, architecture, comprehension, coupling, documentation, error-handling, i18n, migrations,
observability, performance, privacy, security, testability`). Given this increment's scope — a single
prose-clause reword in one command file, no code/runtime behavior — most axes are structurally
inapplicable (no UI, no migration, no locale string, no perf path, no PII, no error path, no new
observable signal). The axes actually engaged are folded in below rather than run as 13 separate
full procedures, proportionate to the size of the change; none surfaced a finding severe enough to
warrant escalation to a full isolated pass.

## Findings

- type: FINDING
  rule_id: P1
  severity: minor
  file: ".dev/features/review-sources-render/PLAN.md:20"
  problem: "The plan declares zero evals for a behavioral change to a shipped command's rendering mandate, relying on human reading rather than a machine-checkable case."
  evidence: "'None. `/pharn-review` is a command (`role`-less, `.claude/commands/`), not a `role:`-bearing Capability under `pharn/pharn-*` — P1's eval requirement binds Capabilities, not commands...'"

  **Testability griller axis.** The plan's reasoning is correct under the current architecture (P1 binds `role:`-bearing Capabilities under `pharn/pharn-*`; `.claude/commands/*.md` carries no `evals/` convention anywhere in this repo — confirmed: no existing command directory has a sibling `evals/`). This is not a gap in the increment; it is a standing, repo-wide limit on how prose-mandate correctness in commands is verified at all (advisory: reading, not floor). Flagging `minor` for the human's awareness, not as a defect to fix in this PR.

- type: FINDING
  rule_id: P4
  severity: minor
  file: ".claude/commands/pharn-review.md:143"
  problem: "The reworded clause names 'sources[0]' explicitly inside prose that already cites the field by backtick — a reader skimming Step 6 could misread the parenthetical as a second, distinct instruction rather than a clarification of the same rendering rule already stated one sentence earlier."
  evidence: "'(not only the `sources[0]` scalar)'"

  **Comprehension griller axis.** Minor stylistic note only — the clause is grammatically unambiguous and matches the register of the rest of Step 6 (which already uses parenthetical asides). No change requested; recorded because the axis exists to surface even small legibility friction.

## No findings on

- **P0 (guarantee-audit completeness):** the plan's guarantee audit correctly labels the rendering
  mandate `advisory` (nothing on the floor forces a subagent to comply with Step 6 prose) and correctly
  identifies the actual floor guarantee in this increment as structural exclusion — `merge-findings.mjs`
  is not in `## Files`, so fix #7's writes-scope denies editing it regardless of intent. This is the
  right floor reduction, not a decorative claim.
- **P2 (trust propagation):** the plan's trust audit correctly separates the trusted `source` label
  (deterministically derived by `merge-findings.mjs`'s `sourceIdOf`, not from tainted content) from the
  untrusted `problem`/`evidence` text, and correctly notes the reworded clause widens **what is shown**,
  never **what is trusted**. No taint-boundary change.
- **P3 (one axis / no sibling imports):** one file, one reason to change (a rendering clause). No
  `reads:`/prose crossing into a sibling module.
- **P5 (determinism):** no new branch introduced; the increment is pure prose.
- **P7 (honest scope, no speculation):** triggered by a real, named defect (F14 — a second lens's
  distinct `problem` at a shared `(type, rule_id, file)` key is invisible in `REVIEW.md` today), and is
  the smallest coherent increment — it does not also touch `/pharn-dev-review` (correctly ruled out in
  the plan's Decision section: that command never calls `merge-findings.mjs`, confirmed live, so there
  is no `sources[]` structure there to under-render) and does not touch `merge-findings.mjs` itself.
- **Architecture / coupling axes:** the file stays in its existing layer (`pharn-pipeline`, product
  command); `coupling` is not applicable (a command, not a rule/capability carrying the field).
- **Security axis:** no new data flow, no new trust elevation, no new external call. The change only
  widens which already-tainted fields are rendered as quoted DATA — it does not change how they are
  rendered (still quoted, never executed).
- **Documentation axis:** the `## Versioning` section correctly identifies the live `SKILLS_VERSION`
  (`2.5.4`, re-verified this run — matches the plan's own live-discovery note) and the target (`2.5.5`,
  patch), consistent with `CLAUDE.md`'s bump-triggering set (`pharn-review.md` is a `pharn-*`,
  non-`pharn-dev-*` command → product surface → bump-triggering).
- **a11y / i18n / migrations / performance / privacy / error-handling / observability:** structurally
  inapplicable — no UI, no locale string, no schema/data migration, no perf-sensitive path, no PII, no
  new error path, no new observable signal.

## Summary

This is a small, well-scoped increment: one clause added to `/pharn-review` Step 6, no merge-contract
change, no `/pharn-dev-review` change (correctly ruled out with live evidence), a patch version bump
correctly recomputed against live `SKILLS_VERSION` (`2.5.4`, not the build prompt's assumed `2.5.1`) to
`2.5.5`. The `## Files` list was caught and corrected during planning to include `SKILLS_VERSION` and
`CHANGELOG.md` alongside the command file — without that, `/pharn-dev-build`'s fix #7 writes-scope
would have denied the version bump the plan's own `## Versioning` section requires. The two findings
above are both `minor` and advisory-only: one names a standing, repo-wide limit on testing command
prose (not specific to this increment), the other is a stylistic legibility note with no requested
change.

**ADVISORY VERDICT: 2 concerns raised (0 blocking-severity, 2 minor-severity) — for the human to weigh
before `/pharn-dev-build`. Neither blocks; the grill stage gates nothing (P0).**
