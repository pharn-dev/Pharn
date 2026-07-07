# REVIEW — applies-scope (PHARN reviewing PHARN)

The increment under review is `trust: untrusted`. Floor first (P0), then the four principle-lenses.
Only the floor is guaranteed; every lens finding below is **advisory**.

## Step 1 — Floor (the only guaranteed part)

`node .dev/floor/validate.mjs .` → **FLOOR: GREEN — 35 capabilities checked**, exit 0. The increment
reached review with a GREEN floor. No blocking floor-finding from `validate` itself.

## Lens findings (finding-shape; enum-gated / free-text split honored)

### FLOOR-GATE (blocking) — NONE

- **L-floor → P0:** the increment's single new guarantee — "`applies:` values are archetype-enum members
  where present" — reduces to an **enum/regex** floor primitive (`validate.mjs` CHECK 4b, set-membership).
  Every non-floor claim (classification correctness; any consumer behaviour) is explicitly labeled
  **advisory** in `PLAN.md` / `GRILL.md`. No guarantee lacks a floor reduction or an advisory label.
  **Pass.**
- **L-eval → P1:** the increment adds **no** new capability and **no** new `enforces` rule_id, so no new
  eval binding is required; the new floor check is covered by two `validate.test.mjs` cases (RED
  attributable + GREEN). Floor GREEN re-confirms all 35 capabilities' existing evals are intact.
  Floor and lens agree. **Pass.**
- **L-trust → P2:** verified below (the enum-gated / free-text split holds in the new check). **Pass.**
- **L-axis → P3:** each of the 37 files changed for exactly one reason (a capability gains its
  archetype scope; the floor gains the enum check; the test gains its two cases). No `reads:` entry or
  prose sibling reference was added. **Pass.**

### ADVISORY (inform; never a guaranteed block)

```yaml
- type: FINDING
  rule_id: P2 # fix #1 — the enum-gated / free-text split
  severity: minor # advisory: a positive confirmation, not a defect
  file: ".dev/floor/validate.mjs:156"
  problem: "CHECK 4b computes its blocking decision from the enum test (a ∉ APPLIES_ENUM); the possibly-untrusted offending value appears ONLY in the free-text `problem`, exactly like the existing role/kind/coupling checks — no guaranteed decision rests on a tainted field." # free-text — DATA
  evidence: 'finding("blocking", "ARCH§5/applies", rel, `applies value not in enum: ${a}`)' # free-text — quoted
```

```yaml
- type: FINDING
  rule_id: P7
  severity: important # advisory; HUMAN-ACCEPTED at GATE 1
  file: "pharn-pipeline/grillers/security/security.md:7"
  problem: "`applies:` is now present + floor-checked on all 35 capabilities, but nothing in this repo consumes it yet (pharn-cli absent; the fix #5 archetype-maps.json `grillers` map is unbuilt) — its value is realized only when a filter lands." # free-text — DATA
  evidence: 'applies: ["universal"]' # free-text — quoted
```

```yaml
- type: FINDING
  rule_id: P4
  severity: important # advisory; HUMAN-ACCEPTED at GATE 1
  file: ".dev/floor/validate.mjs:154"
  problem: "The floor now enum-gates `applies:`, but ARCHITECTURE §3.1's frontmatter contract does not list the field — the trusted contract (SoT for frontmatter) and the floor's checked-field-set diverge until a human documents §3.1 (ARCHITECTURE.md is human-only; not agent-fixable)." # free-text — DATA
  evidence: "const applies = Array.isArray(fm.applies) ? fm.applies : fm.applies ? [fm.applies] : [];" # free-text — quoted
```

```yaml
- type: FINDING
  rule_id: P0
  severity: minor # advisory
  file: "pharn-review/ssrf/ssrf.md:7"
  problem: "The floor guarantees only that an `applies:` value is a valid enum member, NOT that the classification is semantically apt; e.g. `ssrf` (a server-side concern) is scoped `[universal]` per the approved 'all correctness/security lenses → universal' simplicity rule — precision traded for simplicity, by design, and enum-valid either way." # free-text — DATA
  evidence: 'applies: ["universal"]' # free-text — quoted
```

## Proposed lesson candidate (P7 — real, not hypothetical; NOT written to canon here)

A **real** failure surfaced this run, so per the review's feed-lessons step I **propose** (do not write)
one lesson for `.dev/memory-bank/lessons-learned.md`, to be accepted/denied by a separate human-gated
`/pharn-dev-memory-promote` run (`check-provenance` + the accept gate; the model never self-promotes, P2):

- **Candidate:** _Pipeline stages that write their own markdown artifact after `/pharn-dev-build` (`/pharn-dev-regress`
  → `REGRESSION.md`, `/pharn-dev-verify` → `VERIFY.md`, etc.) have no Step-2b-style formatter, so an unformatted
  artifact is first caught by `/pharn-dev-verify`'s whole-repo `format:check` — an L9-class surprise one stage
  downstream. Remedy: each artifact-writing stage should `prettier --write` its own artifact before
  halting, as `/pharn-dev-build` Step 2b does for build outputs._
- **Provenance:** increment `applies-scope`, this run; `REGRESSION.md` (written by `/pharn-dev-regress`) landed
  unformatted → `/pharn-dev-verify` `format:check` = 1 on the first gate pass; fixed with `prettier --write`
  (cosmetic table alignment), all six gates then GREEN. This is an extension of L9 (which today covers
  only `/pharn-dev-build`'s outputs), not a contradiction of it.

## Verdict

**GREEN — 0 floor-gate (blocking) findings.** The increment is structurally sound: floor GREEN, the new
guarantee reduces to an enum check, the enum-gated / free-text split holds in the new finding, no new
eval binding is owed, one axis per file, no sibling references. Four **advisory** findings stand — two
`important` design tensions already accepted by the human at GATE 1 (no current consumer; §3.1 not yet
documenting the field), two `minor` (a positive P2 confirmation; the classification-precision-vs-
simplicity tradeoff) — plus one proposed lesson candidate. None blocks. The merge / fix / abandon
decision is the human's (GATE 2).
