# GRILL — validate-bad-target

Plan under interrogation: `.dev/features/validate-bad-target/PLAN.md` (`trust: untrusted`).
Spec-hash check: **AGREES** — recomputed `sha256(pharn/ARCHITECTURE.md)` =
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`, equal to the plan's pin
(`PLAN.md:3`). Surfaced only — the blocking drift gate is `/pharn-dev-build`'s (fix #4).

Griller membership (FLOOR — `pharn/floor/count-grillers.mjs`, frontmatter only): **13 registered**.
Deterministic plan scanners run: `scan-plan-{i18n,migrations,observability,pii,secrets}` — **all five
clean** (`found/mentions: false`), consistent with a floor-checker input guard that touches no user
data, no schema, and no network.

Layer-1 presence readings (no absence findings): **testability** — `## Evals to write (P1)`
(`PLAN.md:36-42`) is present and populated with five concrete cases. **error-handling** — a failure
surface is declared at `## Known residuals` (`PLAN.md:60-63`) plus the trust and determinism audits.
Both declarations are recognized as **present**; their **adequacy** is Layer-2 advisory, and that is
where the findings below live.

## Findings

### Axis: error-handling (Layer 2 — adequacy)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/validate-bad-target/PLAN.md:63"
  problem: "The plan ASSERTS how a statSync throw behaves but never SPECIFIES the try/catch that would make it behave that way, so the residual describes a build the ## Files instruction does not require."
  evidence: "`statSync` can throw for a path that exists but is unreadable. That case falls into the non-directory branch, whose message is worded to stay true for it"
```

The `## Files` instruction for the checker is one line — _"add the target shape guard before the
capability walk"_ (`PLAN.md:20`) — and the brief it came from prescribes
`statSync(TARGET).isDirectory()` bare. Written that way, a throwing `statSync` produces an **uncaught
exception and a stack trace**, not the planned RED finding. The exit code is still non-zero, so the
gate fails closed; what breaks is the plan's own claim that the case "falls into the non-directory
branch" with a true message. Either specify the `catch` in `## Files`, or drop the residual's
second sentence.

### Axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/validate-bad-target/PLAN.md:47"
  problem: "The audit line says a GREEN now means the target 'was walked', but validate.mjs's walk() swallows readdirSync errors, so a directory that passes the new guard and then cannot be read still reports GREEN over zero capabilities."
  evidence: '"a GREEN from validate.mjs now means the target was a real directory that was walked" → FLOOR, NARROWED and stated'
```

Verified live in the checker, not inferred: `walk()` at `pharn/floor/validate.mjs:57-58` catches and
returns the accumulator on any `readdirSync` failure. The guard the plan adds proves _existence_ and
_type_; it does not prove _readability_, and the walk's own swallow is what converts an unreadable
directory into a zero-capability GREEN. The plan already narrows this claim once (for a
valid-but-wrong directory) — the narrowing is simply incomplete, and "was walked" is the phrase doing
the overstating. This is the P0 axis the repo exists to police, which is why it is filed as important
rather than minor even though the fix is a wording change.

### Axis: testability (Layer 2 — adequacy)

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/validate-bad-target/PLAN.md:42"
  problem: "The plan cites L29's enumerated-set remedy but specifies only the assertions shared by both branches, omitting the per-branch distinguishing assertion L29 names as the load-bearing half."
  evidence: "Both RED branches are held in ONE enumerated array the assertions iterate (L29), so a third branch added later inherits every rule."
```

The five declared cases assert exit code, `FLOOR: RED`, and that the path is named — all of which are
**common to both branches**. A shared-array assertion over common properties cannot distinguish the
two messages, so an implementation that printed the _same_ message for both branches would satisfy
every assertion the plan names. L27's remedy, which L29 restates as the load-bearing half, is
"present in its own case **AND absent from the other**"; the absence half appears nowhere in
`## Evals to write`. The plan cites both lessons and applies them to the half that was in front of it
— the precise recurrence shape L29 was promoted to name.

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/validate-bad-target/PLAN.md:39"
  problem: "The not-a-directory case does not say where its file target comes from, and the reproduction used the checker's own path, which would couple the test to a real repo file."
  evidence: "`validate.mjs <a file, not a dir>` → exit 1, stdout matches `FLOOR: RED` and names the path verbatim."
```

`validate.test.mjs` already has a hermetic `withRepo` helper (`validate.test.mjs:34-45`) building a
scratch tree under `mkdtempSync`. Naming it here costs one line and keeps the case from depending on
a path that a later refactor could move.

## Summary

The plan is well-grounded where it matters most: the defect is reproduced live on three inputs before
planning, the scope-parse count was checked against the approved list rather than assumed, the
`SKILLS_VERSION`→README-badge coupling was discovered from the live gate instead of being missed, and
the `## Open questions (HALT)` section is genuinely empty rather than performatively so. The
`### Deliberately NOT in scope` heading is the structural form L18 requires, and it parsed correctly.

The concerns cluster on **adequacy, not presence**, and three of the four share one root: the plan
declares a two-branch design and then reasons about it as if it were one branch. That shows up as an
unspecified `catch` (the throw branch), an assertion set that cannot tell the branches apart, and a
guarantee sentence that generalizes past what the guard actually proves. None of this is a
constitution violation and none of it blocks — but the L29 finding deserves the human's attention
specifically because the plan **cites** L29, which is exactly the state L29 says is
indistinguishable from having discharged it.

One thing checked and found correct, recorded so it is not re-litigated at build: the plan's
`CHANGELOG` entry targets `## [Unreleased]`, which is live in `CHANGELOG.md:11`.

## Verdict

**ADVISORY VERDICT: 4 concerns raised (0 blocking-severity, 3 important, 1 minor) — for the human to
weigh before `/pharn-dev-build`.** This grill-log gates nothing. It is model judgment about a plan,
not a floor operation; `/pharn-dev-build` proceeds or halts on its own gates (spec-hash drift, an
unresolved `## Open questions (HALT)`, and `pharn/floor/validate.mjs`), none of which read this file.
