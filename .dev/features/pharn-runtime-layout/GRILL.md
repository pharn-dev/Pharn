# GRILL — pharn-runtime-layout

Plan under interrogation: `.dev/features/pharn-runtime-layout/PLAN.md`.
Spec-hash check (content-hash floor primitive, surfaced not blocking): `sha256(ARCHITECTURE.md)` = `11cd9ad5…d1d969` **== plan pin** → **no drift**. Griller membership (FLOOR): 13 registered.

## Findings (finding-shape; enum-gated / free-text split honored — advisory)

### Axis: testability (P1) / coverage gap — the highest-value concern

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/pharn-runtime-layout/PLAN.md:88"
  problem: "Command-file path strings are NOT floor-covered: validate.mjs excludes .claude/commands and npm test never executes command markdown, so a missed path edit in a pharn-*/pharn-dev-* command passes validate + test + check yet breaks at runtime."
  evidence: "Evals-to-write lists 'validate.mjs . -> GREEN' and 'npm test' but no gate exercises the ~17 edited command files' path references."
```

### Axis: determinism (P5) / transform correctness

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/pharn-runtime-layout/PLAN.md:110"
  problem: "The 496-occurrence prefix rewrite (pharn-contracts/ -> pharn/pharn-contracts/, etc.) is non-idempotent if done naively — a second pass or an already-qualified ref yields pharn/pharn/... The plan names the risk ('guarded transform') but pins no deterministic post-check that zero double-prefixes exist."
  evidence: "'a guarded transform that never double-prefixes an already-pharn/-qualified path' — asserted as intent, not as a floor-checked assertion."
```

### Axis: documentation (P4) — stale-doc omission from ## Files

```yaml
- type: FINDING
  rule_id: "P4"
  severity: important
  file: ".dev/features/pharn-runtime-layout/PLAN.md:75"
  problem: "CLAUDE.md (and likely README.md) document the exact paths this increment moves (e.g. 'node .dev/floor/validate.mjs', the README->CONSTITUTION->ARCHITECTURE reading order, 'pharn-review/ (lenses)'), but neither appears in ## Files — they will silently go stale and mislead future runs."
  evidence: "## Files 'Not moved (deliberate)' lists CLAUDE.md/README.md as staying at root but does not schedule updating their now-wrong path references."
```

### Axis: writes-scope test coverage (fix #7)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/pharn-runtime-layout/PLAN.md:71"
  problem: "The DEFAULT_SAFE_SET port (pharn-*/** -> pharn/pharn-*/**) is a behavior change to a floor hook; the plan should require enforce-writes-scope.test.cjs to add BOTH a positive vector (pharn/pharn-review/x.md allowed by default) AND a negative vector (pharn/floor/x.mjs denied by default) so the preserved posture is proven, not assumed."
  evidence: "'update safe-set test vectors to the ported glob' — does not spell out the positive+negative pair that pins the fail-closed posture."
```

### Axis: coupling (P3) — cross-tree checker reference

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/pharn-runtime-layout/PLAN.md:69"
  problem: "check-variance.mjs (dev) reaching check-structural.mjs (product) becomes a hardcoded cross-tree relative path; ensure it resolves from the checker's own dir robustly (not from cwd) and that check-variance.test.mjs actually exercises the new location, else the edge silently rots."
  evidence: "'point at the moved product location pharn/floor/check-structural.mjs (resolve via repo-root, not here)'."
```

## Prose summary

The plan is unusually well-grounded for its size: the product/dev floor partition was traced from source (no floor checker imports another; the single cross-split spawn edge is identified and handled), the guarantee audit correctly labels relocation-correctness as advisory, and P7 is satisfied (a real dogfood failure — install pollutes the user's root — motivates it). No P0 disease (guarantee-without-floor-reduction), no trust regression, no speculation.

The concerns are execution-risk, not design-flaw. Two are worth the human's attention before build: (a) **nothing on the floor exercises command-file path strings**, so the very files with the most edits (~17 commands) have the weakest automated coverage — a targeted grep-assertion (no stale moved-path refs remain) would close it deterministically; and (b) the **496-occurrence prefix transform** needs an idempotency guard plus a post-check that no `pharn/pharn/` double-prefix exists. The documentation omission (CLAUDE.md/README.md go stale) is a real but easily-scoped gap — either fold them into `## Files` or explicitly defer with eyes open. The two minor findings (safe-set test vectors, cross-tree checker path) are cheap to honor during build.

## Verdict

ADVISORY VERDICT: 6 concerns raised (3 important, 3 minor; 0 blocking-severity) — for the human to weigh before /pharn-dev-build. This is NOT "grill passed" and NOT a judgment that the plan is sound; the deterministic backstops (validate GREEN, npm test, the writes-scope + trusted-doc hooks, the sha256 byte-identity proof) remain where they were, and the human owns the decision.
