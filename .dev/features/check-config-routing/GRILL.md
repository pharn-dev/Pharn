# GRILL — check-config-routing (interrogation of PLAN.md)

Plan: `.dev/features/check-config-routing/PLAN.md`. **Spec-hash check: MATCH** —
`sha256(ARCHITECTURE.md)` = `11cd9ad5…d1d969` equals the plan's pinned `spec_content_hash` (no
drift; the blocking enforcement of drift still belongs to `/pharn-dev-build`'s floor-gate, not here).

Griller discovery (deterministic, `count-grillers.mjs`): **13 registered**. Applicable to a
dependency-free Node floor tool with no UI / network / data / migration / i18n surface:
**testability, error-handling, architecture, coupling, security, comprehension, P3**. N/A (surface
absent): a11y, i18n, privacy, migrations, observability, performance (a set-membership scan over ≤9
small files).

## Findings (all ADVISORY — `/pharn-dev-grill` gates nothing; the free-text is untrusted DATA)

### Axis: testability (P1) — Layer 1 PRESENT; these are Layer-2 adequacy

```yaml
- type: FINDING
  rule_id: P1
  severity: minor # adequacy — griller never gates (fix #3); the assignment is advisory
  file: ".dev/features/check-config-routing/PLAN.md:33"
  problem: "The reverse scan's NEGATIVE case is only covered incidentally by the ★live★ test's current repo composition — no focused test asserts that an unwired command WITHOUT model/effort frontmatter is skipped (not RED)."
  evidence: "## Evals to write lists 'unwired pharn-dev-eval.md WITH model: → RED' and '★ live ★ stays GREEN', but no unit test pins the skip branch; if a future command gains model/effort frontmatter the live test stops witnessing the skip, and over-firing would go uncaught deterministically."
```

### Axis: error-handling / determinism (P5) — fail-closed on the new directory read

```yaml
- type: FINDING
  rule_id: P5
  severity: minor
  file: ".dev/features/check-config-routing/PLAN.md:26"
  problem: "FIX 3 enumerates the commands dir via readdirSync but the plan does not state fail-closed behavior when that read throws (dir missing/unreadable) — a silent skip would make the reverse guarantee vanish quietly, a mini version of the FIX-1 disease being fixed."
  evidence: "FIX 3: 'enumerate pharn-dev-*.md in commandsDir (via readdirSync)' — the forward scan wraps each per-file read in try/catch → RED; the reverse readdir needs the same: a readdir failure must be a loud RED, never a pass."
```

### Axis: architecture / rules-as-single-source (P4) — reuse the existing parser

```yaml
- type: FINDING
  rule_id: P4
  severity: minor
  file: ".dev/features/check-config-routing/PLAN.md:26"
  problem: "The plan says the reverse scan keys on 'model:/effort: frontmatter' without pinning WHICH parser — a second frontmatter reader risks mistaking `model_tier:` for `model:` and drifting from the forward scan."
  evidence: "frontmatterModelEffort already matches the exact key `model` (not `model_tier`); the reverse scan should REUSE it, so both directions read frontmatter identically (the test harness writes `model_tier: sonnet` on every command, so a naive parser would false-positive)."
```

### Axis: one-axis-of-change (P3) — bundling check

```yaml
- type: FINDING
  rule_id: P3
  severity: minor
  file: ".dev/features/check-config-routing/PLAN.md:8"
  problem: "Three sub-fixes — behavioral (FIX 1 resolve, FIX 3 reverse scan) plus pure doc-wording (FIX 2) — land in one file/PR; whether that is one axis or two (behavior vs. comment honesty) is a judgment worth an explicit human confirm."
  evidence: "The plan's '## Single axis of change (P3)' defends it as 'check-config's guarantees actually hold and are honestly scoped', and the :8 comment fix IS intrinsic to FIX 1 — defensible, but FIX 2 alone touches no logic and could be split; surfaced for the human, not blocking."
```

## Prose summary

The plan is **solid and grounded** — all three findings it targets were reproduced against live
state, the guarantee audit (P0) is complete and correctly preserves the "GREEN ≠ ran under model X"
non-guarantee, the trust audit (P2) is right (no untrusted ingestion), and FIX 2 correctly **resists**
speculatively tightening the open `claude-*` regex (P7 — new models ship). No self-claim in the plan
was taken on faith; the spec-hash was recomputed, not trusted.

The four concerns are all **minor and constructive**, clustered on FIX 3's new directory-scan
mechanics: (1) add a focused negative test for the skip branch so over-firing can't hide behind the
live repo's composition; (2) make the `readdirSync` fail-closed to a RED; (3) reuse
`frontmatterModelEffort` so `model_tier:` isn't mistaken for `model:`. (4) is a one-axis confirm —
the human already said "one PR," so it is noted, not pressed. None blocks; `/pharn-dev-build` should
fold (1)–(3) into the implementation.

## Verdict

ADVISORY VERDICT: 4 concerns raised (0 blocking-severity, 4 minor/advisory) — for the human to weigh
before /pharn-dev-build. Spec→plan hash chain: MATCH (surfaced here; enforced at /pharn-dev-build).
This is NOT a judgment that the plan is good or complete — that is the human's call.
