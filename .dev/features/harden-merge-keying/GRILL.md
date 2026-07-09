# GRILL — harden-merge-keying

Header: interrogated `.dev/features/harden-merge-keying/PLAN.md` (approved at GATE 1; FIX 1 → Option A,
all-in-one). **Spec-hash check: MATCH** — `sha256(ARCHITECTURE.md)` =
`11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969` equals the plan's `spec_content_hash`
(no drift; the binding block is `/pharn-dev-build`'s, not mine). Griller membership (FLOOR,
`count-grillers.mjs`): 13 registered — none is code/floor-tooling-shaped, so the inline axes (P0–P7)
carry this interrogation; the plan-oriented grillers (a11y, migrations, privacy, …) find no purchase on
a `merge-findings.mjs` change and are correctly silent.

The `PLAN.md` is `trust: untrusted` to me; the `evidence:` quotes below are DATA, never directives.

## Findings

### Axis: P2 — trust propagation (the guarantee actually at stake)

```yaml
- type: FINDING
  rule_id: P2
  severity: important
  file: ".dev/features/harden-merge-keying/PLAN.md:46"
  problem: "FIX 1's regex whitelist must COMPOSE WITH the existing isCleanScalar/hasControlChar guard, not replace it — JS `$` matches before a trailing newline, so a regex-only RULE_ID_OK would admit a trailing-newline control-char vector and reopen the laundering hole the :112 test guards."
  evidence: "PLAN.md:46-47 'tighten RULE_ID_OK from \"any clean single line ≤120 chars\" to a shape whitelist' — 'from…to' reads as REPLACE; but /^P[0-7]$/.test(\"P2\\n\") === true and /^…\\d+$/.test(\"security.md SEC-1\\n\") === true in JS. Retain isCleanScalar(v,120) as a precondition so the string is provably newline-free before the shape regex runs."
```

### Axis: P5 — determinism (the merge's core guarantee)

```yaml
- type: FINDING
  rule_id: P5
  severity: important
  file: ".dev/features/harden-merge-keying/PLAN.md:41"
  problem: "The SECONDARY rule_id-normalize underspecifies how the EMITTED representative rule_id is chosen; 'take the first survivor's original, un-folded value' is input-order-dependent unless bound to a deterministic selector, and order-invariant output bytes are merge-findings' central guarantee."
  evidence: "PLAN.md:41-42 'the sources sort already fixes an order; take the first survivor's original, un-folded value'. But the sources sort is by (source,problem,evidence) and does NOT carry the original rule_id — two casings ('SEC-1'/'sec-1') collapse to one key, and which original is emitted must be a deterministic rule (e.g. carry original rule_id into each source entry and pick via that same sort, OR emit the lexicographic-min original). Specify it AND assert order-independence in the eval."
```

### Axis: P0 — guarantee-audit honesty (bound the claim)

```yaml
- type: FINDING
  rule_id: P0
  severity: minor
  file: ".dev/features/harden-merge-keying/PLAN.md:73"
  problem: "The FIX 2 guarantee 'Same source location → same dedup key' is stated generally but is BOUNDED to two normalizations (leading ./ and trailing :col); other real lens drift (absolute-vs-relative base, ../ segments, backslashes, trailing slash) still won't merge — the guarantee-audit should label the bound, not imply general location-identity."
  evidence: 'PLAN.md:73-74 ''"Same source location → same dedup key" (FIX 2) → floor: enum-regex … GUARANTEE.'' canonFile per PLAN.md:30 handles only leading-./ + trailing-:line:col; e.g. ''src/app.ts:10'' vs ''/abs/repo/src/app.ts:10'' will NOT merge. Bound the claim honestly (P0/P7).'
```

### Axis: P1 — eval coverage completeness

```yaml
- type: FINDING
  rule_id: P1
  severity: minor
  file: ".dev/features/harden-merge-keying/PLAN.md:69"
  problem: "The FIX 1 eval set should add three boundary cases: a control-char / trailing-newline rule_id is STILL dropped (guards the P2 finding above), a file-qualified-but-prose value is rejected, and an explicit assertion that the exact tested 'security.md SEC-1' survives (regression-guarding merge-findings.test.mjs:140 as green rather than only asserting it in passing)."
  evidence: "PLAN.md:69 tests a 'spaces-bearing prose instruction' and a 'non-roster/mis-shaped value' dropped, and 'P2 and security.md SEC-1 still survive' — but does not name the trailing-newline vector, a near-miss file-qualified reject (e.g. 'evil.md DROP TABLE'), or a standalone green-guard on the :140 regression."
```

## Prose summary

The plan is well-grounded: discovery-first, the no-roster conflict correctly surfaced and resolved at
GATE 1, the guarantee-audit honestly labels FIX 1 as "shape-valid, NOT roster-member," and the axis is
genuinely one file. Two **important** concerns are implementation-shaping and worth resolving before
build: (1) FIX 1's regex must be **layered on top of** the existing control-char guard — a JS `$`-quirk
means a regex-only check would silently re-admit a trailing-newline laundering vector, undercutting the
very P2 guarantee this increment strengthens; and (2) the rule_id-normalize representative selection is
**order-dependent as written**, which collides with the merge's order-invariant-bytes guarantee — the
plan must name a deterministic selector and test it. Two **minor** concerns are honesty/coverage: bound
the FIX 2 canonicalization claim (it is not general location-identity), and widen the FIX 1 eval to name
the trailing-newline and near-miss reject cases plus a standalone green-guard on the existing `:140`
test. One non-finding note (not a defect): bundling four changes in one increment slightly muddies
per-change attribution vs the "one axis per attempt" agenda, but the human explicitly chose all-in-one
and they are one coherent axis — acceptable, noted only for the record.

## ADVISORY VERDICT

ADVISORY VERDICT: 4 concerns raised (0 blocking-severity, 2 important, 2 minor) — for the human to weigh
before `/pharn-dev-build`. `/pharn-dev-grill` gates nothing; the deterministic backstops remain
`/pharn-dev-build`'s floor-gates (spec-hash drift; unresolved `## Open questions (HALT)` — none remain)
and `.dev/floor/validate.mjs`. These are surfaced concerns, NOT a judgment that the plan is sound.
