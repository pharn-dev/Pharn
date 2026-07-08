# GRILL — seam-resolver plan interrogation (ADVISORY)

- Plan under interrogation: `.dev/features/seam-resolver/PLAN.md` (trust: **untrusted** to this griller — its self-claims are tested, not believed).
- Spec-hash check (content-hash primitive, surfaced not blocking): `sha256(ARCHITECTURE.md)` = `11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969` — **matches** the plan's `spec_content_hash`. No drift finding. (The real block on drift is `/pharn-dev-build`'s fix#4 gate.)
- Griller roster discovered by membership (FLOOR, `count-grillers.mjs`): **13 registered**. Relevant axes applied inline below; the rest (a11y, i18n, migrations, observability, performance, privacy, error-handling, documentation) raise **no findings** on a markdown methodology capability with no UI/runtime/data-migration surface.

## Findings

### Axis: eval coverage / testability (P1, `eval-format.md`)

```yaml
- type: FINDING
  rule_id: P1
  severity: important
  file: ".dev/features/seam-resolver/PLAN.md:36"
  problem: "The eval plan does not declare each expected's skill_kind or the structural[]/semantic[] split; and eval-format.md's four structural[] kinds are all defined over finding-shape fields (type/rule_id/severity/file), whereas a role: skill resolver emits a WALK-DECISION (a step name / ask), not a finding — so HOW each expected is checked deterministically vs by an LLM judge is unspecified, risking the whole walk-decision being laundered through a judge."
  evidence: "`seam-resolver` (skill) → the four case→expected pairs above. ... CHECK 2 (evals present) is satisfied by the non-empty cases+expected dirs."
```

Note: this does **not** threaten `validate.mjs` GREEN (CHECK 2 only requires the eval dirs be non-empty), and `enforces` is empty (CHECK 3 vacuous). It is a _quality of the eval spec_ concern: `/pharn-dev-build` should state, per expected, whether the resolver's decision is asserted `structurally` (e.g. the chosen step is a member of the step enum / equals an expected step — a floor-reducible equality) or only `semantically` (judge), so the "deterministic walk" claim is actually eval-backed rather than judge-backed.

### Axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: P0
  severity: important
  file: ".dev/features/seam-resolver/PLAN.md:40"
  problem: "The guarantee-audit HEADLINE labels 'The walk is deterministic — ordered, stop-at-first-hit, terminal ask' as floor, but the seam-config contract explicitly classifies 'The walk executed faithfully at runtime → ADVISORY' — only the config-invariant (a terminal ask is PRESENT) is floor. Line 44 does correct this, so the plan contradicts itself; the risk is the capability body inherits the line-40 headline and claims a floor guarantee over agent execution — the exact P0 disease."
  evidence: '"The walk is deterministic — ordered, stop-at-first-hit, terminal `ask`" → **floor: enum/presence**'
```

Recommendation for build: keep the split the contract already draws — _config validity / terminal-ask presence_ = **floor** (`check-seam-config.mjs`); _the walk being executed faithfully by the agent_ = **advisory**. The capability text must not read as guaranteeing its own faithful execution.

### Axis: determinism (P5)

```yaml
- type: FINDING
  rule_id: P5
  severity: minor
  file: ".dev/features/seam-resolver/PLAN.md:56"
  problem: "The determinism audit frames the model-confidence gate as 'a threshold compare' alongside genuine membership tests, but establishing whether the model is confident to modelConfidenceThreshold is irreducible model SELF-ASSESSMENT (advisory), not a deterministic membership test. Only the CONSEQUENCE (not-confident → skip → toward ask) is deterministic. Framing it as a membership test overstates its determinism."
  evidence: '"is the model confident to `modelConfidenceThreshold`" (a threshold compare, and if the model can''t establish it → treat as not-confident → skip)'
```

Recommendation for build: label the confidence gate itself **advisory** in the capability, backstopped by the deterministic skip→terminal-`ask` fallback. The honest P5 story is: the _decision to trust the model_ is advisory; the _fallback when it can't_ is deterministic and ends in `ask`.

### Axis: security / trust propagation (P2)

```yaml
- type: FINDING
  rule_id: P2
  severity: minor
  file: ".dev/features/seam-resolver/PLAN.md:52"
  problem: "The plan names fetched content at the `fetch` step as untrusted but does not state that the capability BODY must fence fetched docs as DATA (never followed as instructions). A resolver skill that reads fetched docs to 'resolve' a seam is precisely THREAT-MODEL §2's 'seam-resolver fetch fallback generates wiring = instructions that shape code' surface; the capability text must instruct the agent to treat fetched content as DATA."
  evidence: "Anything the walk *fetches* at the `fetch` step is itself untrusted ... the resolver's job here is only the **walk**"
```

Recommendation for build: the capability's `fetch`-step prose should explicitly fence fetched content as DATA (P2) — consistent with the plan's own trust posture for the config — even though pinning/content-hashing is deferred to the seam-record.

## Prose summary

The plan is **well-scoped and honest**: it correctly identifies that the config validator + contract already exist and green, scopes the smallest coherent increment (the missing `pharn-core/seam-resolver` capability + evals), routes sharing through `pharn-contracts` (no leaf→leaf, P3), and cleanly defers the two second-axis concerns (build wiring, config-in-`pharn.config.json`) — a genuine one-axis increment (P7). The trust audit (config as DATA, only enum-gated fields branched) is solid.

The concerns are all about **the build faithfully realizing the plan's own honesty**, not about the plan's direction:

1. **(important)** the eval spec doesn't say how a walk-decision is checked (structural vs judge) — the "deterministic walk" claim needs floor-reducible eval assertions, not a judge, to be more than words;
2. **(important)** a self-contradiction in the guarantee audit (line 40 headline "floor" vs line 44 "advisory") that the capability body must resolve on the _advisory_ side for agent execution;
3. **(minor)** the confidence gate is model self-assessment (advisory), not a membership test;
4. **(minor)** the `fetch`-step must fence fetched docs as DATA in the capability body.

None of these blocks the build; all are things `/pharn-dev-build` and the human reviewer should verify the built capability handles.

## Verdict

**ADVISORY VERDICT: 4 concerns raised (0 blocking, 2 important, 2 minor) — for the human to weigh before/at `/pharn-dev-build`.** This grill-log is advisory end-to-end; it gates nothing. "grill produced a GRILL.md" does **not** mean "the plan is sound" (P0) — the deterministic backstops remain `/pharn-dev-build`'s floor-gates and `validate.mjs`.
