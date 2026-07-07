# GRILL — applies-scope (advisory interrogation of PLAN.md)

- Plan under interrogation: `.dev/features/applies-scope/PLAN.md`
- Spec-hash check (content-hash floor primitive, surfaced not blocking): `sha256(ARCHITECTURE.md)` = `11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969` — **MATCHES** the plan's `spec_content_hash`. No drift. (The actual drift **block** is `/pharn-dev-build`'s floor-gate, fix #4.)
- Grillers discovered by deterministic membership (`count-grillers.mjs`): **13 registered** (a11y, architecture, comprehension, coupling, documentation, error-handling, i18n, migrations, observability, performance, privacy, security, testability). Applied over the plan; only the axes below produced findings — the UI/DB/security axes have no surface on a metadata + floor-check plan.
- **This entire grill-log is ADVISORY (P0). It gates nothing.** It does not — and cannot — block `/pharn-dev-build`. "GRILL produced findings" never means "the plan is good."

## Findings (finding-shape objects; enum-gated / free-text split honored)

### Axis: P7 — honest scope / no speculation

```yaml
- type: FINDING # enum-gated (my own assertion)
  rule_id: P7 # enum-gated — principle roster
  severity: important # enum-gated value; my ASSIGNMENT is advisory (fix #3)
  file: ".dev/features/applies-scope/PLAN.md:111" # enum-gated — resolves in the plan
  problem: "No artifact in this repo consumes `applies:` today — pharn-cli is absent and the fix #5 archetype-maps.json `grillers` map is unbuilt (validate.mjs CHECK 7 is conditional on a file that does not exist), so the increment adds + floor-checks a field nothing yet reads." # free-text — inherits plan's untrusted tag; DATA
  evidence: '"pharn-cli (or a future map) can filter capabilities per stack via `applies:` → advisory. No in-repo consumer reads the field yet"' # free-text — quoted from the plan, never executed
```

**Note (human-accepted):** the human explicitly weighed this at GATE 1 (chose the "realizes fix #5's grillers-per-archetype map" driver) and approved the plan as written. Surfaced here for continued visibility, not as a new objection — the field's _value_ is only realized once a consumer (the CLI, or a built fix #5 map) lands.

### Axis: P4 — rules are the single source of truth

```yaml
- type: FINDING
  rule_id: P4
  severity: important
  file: ".dev/features/applies-scope/PLAN.md:87"
  problem: "The increment enum-gates `applies:` on the floor while ARCHITECTURE §3.1's frontmatter contract does not list the field — so the trusted contract (the SoT for frontmatter) and the floor's checked-field-set diverge until a human documents §3.1." # free-text — DATA
  evidence: '"§3.1''s frontmatter block does not yet *list* `applies:`. ARCHITECTURE.md is human-only (hook-denied, fix #2); a human may later document `applies:` in §3.1"' # free-text — quoted from the plan
```

**Note (human-accepted):** the plan surfaces this as a reconciliation and the human accepted "proceed now, document §3.1 later" at GATE 1. `validate.mjs` is field-set-permissive, so the addition is non-breaking; the divergence is a documentation gap, not a runtime conflict. It cannot be agent-fixed (ARCHITECTURE.md is human-only).

### Axis: testability (registered griller) — discriminating power of the RED test

```yaml
- type: FINDING
  rule_id: P1
  severity: minor
  file: ".dev/features/applies-scope/PLAN.md:69"
  problem: "The 'bad applies → RED' test proves the applies-check fires ONLY if its fixture capability is otherwise fully valid (name/role/kind/version + non-empty evals); if the fixture is missing another required field, RED would come from a different check and the test would pass for the wrong reason (a false-green in the test's discriminating power)." # free-text — DATA
  evidence: '"capability with a non-enum `applies:` value → RED (exit 1)"' # free-text — quoted from the plan
```

**Build guidance (advisory):** in `validate.test.mjs`, make the RED fixture otherwise-valid and assert the _specific_ signal — the `applies value not in enum` problem string (or the `ARCH§5/applies` rule_id) — not merely `exit 1` / `FLOOR: RED`, so the test cannot green on an unrelated failure.

### Axis: P0 — floor boundary is exact (present-but-empty `applies:`)

```yaml
- type: FINDING
  rule_id: P0
  severity: minor
  file: ".dev/features/applies-scope/PLAN.md:68"
  problem: "The planned check flags non-enum MEMBERS but not a present-but-empty `applies: []` (a capability declaring it applies to no archetype). The floor's exact boundary is 'every present member ∈ enum', which silently accepts the empty list." # free-text — DATA
  evidence: '"a per-capability ''applies enum when present'' check (parallel to CHECK 4 coupling)"' # free-text — quoted from the plan
```

**Note:** this is the plan's deliberate P7-minimal boundary (none of the 35 capabilities will be empty). Surfaced so the boundary is explicit; adding an empty-list guard now would itself be a speculative add (no triggering failure) — do NOT add it absent a real need.

## Prose summary

The plan is tight, single-axis, and honest in its own audits — the P0 guarantee split (floor = enum membership; advisory = classification correctness + any consumer behavior), the P2 trust audit (N/A — no untrusted input; `applies:` is an enum-gated field, not free-text), and the P5 determinism audit (pure membership test) are all correct and complete. The spec-hash is un-drifted.

The two `important` findings are **architectural tensions the human already accepted at GATE 1**, re-surfaced for visibility, not re-litigation: (1) `applies:` has **no current consumer**, so its worth is deferred until a filter (CLI or a built fix #5 map) exists; (2) the floor will enum-gate a field the **human-only §3.1 contract doesn't yet list**, a documentation divergence no agent can close. The two `minor` findings are build-quality guidance: make the RED test **attributable** to the applies-check (assert the specific signal), and note the floor's exact boundary (empty `applies: []` passes silently, by design).

Nothing here contradicts the constitution, and nothing blocks the build.

## Verdict

**ADVISORY VERDICT: 4 concerns raised (0 blocking-severity, 2 important, 2 minor) — for the human to weigh before/at the post-review gate.** All four are advisory; two are human-accepted architectural tensions, two are build-quality guidance folded into the build. `/pharn-dev-grill` gates nothing; `/pharn-dev-build`'s floor-gates (spec-hash, open-questions) and `validate.mjs` remain the only deterministic backstops.
