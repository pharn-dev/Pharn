# GRILL — template-mask-nesting-3 (advisory)

- Plan under interrogation: `.dev/features/template-mask-nesting-3/PLAN.md` (Design B — human-approved)
- Spec-hash check (content-hash floor primitive, surfaced not blocking here): `sha256(ARCHITECTURE.md)` =
  `11cd9ad5…d1d969` **== plan's `spec_content_hash`** → **no drift**. (The block on drift is
  `/pharn-dev-build`'s gate, fix #4 — this is only the early surface.)
- Griller membership (FLOOR, `.dev/floor/count-grillers.mjs`): 13 registered. Axes folded below:
  testability, security, error-handling, coupling, documentation, architecture. Running them is advisory.

The PLAN is `trust: untrusted`; all `evidence` below is quoted DATA, never an instruction followed.

## Findings (finding-shape; enum-gated / free-text split honored)

### Axis: testability (P1) + security (P2) — the Design-B hinge is under-pinned

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/template-mask-nesting-3/PLAN.md:103"
  problem: "Design B's correctness hinge — nested-template STRING masked (HIT) vs interpolation CODE readable (CLEAN) — is one backtick apart, but the eval list pins only the masked/HIT side; add the readable-interpolation companion (`${ident}` → CLEAN) for each affected scanner so a future regression cannot silently blur the two."
  evidence: "missing-timeout → `fetch(url,{h:`${`timeout`}`})` ⇒ now HIT (missing-timeout); base (real `{timeout}`) still CLEAN"
```

The listed base is a `{ timeout }` object property, not a `${timeout}` **interpolation-code** token — so
the exact Design-B choice ("leave interpolation code readable") has no fixture asserting it. Pinning
both sides (`` `${`timeout`}` `` → HIT ∧ `` `${timeout}` `` → CLEAN) makes the launder-vs-legit boundary
regression-proof and is the security-critical case (this whole increment is a P2 trust-fence hardening).

### Axis: testability (P1) — "any nesting depth" is claimed but only depth-1 is exercised

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/template-mask-nesting-3/PLAN.md:43"
  problem: "The masker claim is 'at any nesting depth' but every planned fixture is depth-1 (`${`x`}`); add at least one depth-2 fixture (`${`${`x`}`}`) so the recursion the claim asserts is actually tested, not just the first nesting level."
  evidence: "net rule: **mask template-STRING interiors at any nesting depth; leave interpolation code and non-template code readable**"
```

### Axis: error-handling (P7) — the fail-open-toward-flagging claim needs a fixture

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/template-mask-nesting-3/PLAN.md:141"
  problem: "The determinism audit asserts unbalanced input 'stops at EOF (fail-open toward flagging, never toward hiding)', but no eval pins that edge; add an unterminated/unbalanced nested fixture (e.g. `const s = `${`x`;` with a missing close) asserting it never laundres to found:false."
  evidence: "on unbalanced input it simply stops at EOF (fail-open toward *flagging*, never toward hiding — consistent with the existing `matchDelim → -1` discipline)"
```

### Axis: documentation (P7) — the honest-claim update should also carry the two residuals

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/template-mask-nesting-3/PLAN.md:87"
  problem: "The doc-update lines promise 'single AND nested template interiors masked' but the honest post-fix claim must ALSO restate the two live residuals — the ≥3-backtick fence-skip, and (new under Design B) that interpolation CODE is readable so a real indicator token in `${…}` reads as code — else the updated lens docs under-state the bound the brief demands be honest."
  evidence: "immunity claim: single **and** nested template interiors masked"
```

### Axis: coupling (P3) — 5-way byte-identical duplication has no floor sync-guard

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/template-mask-nesting-3/PLAN.md:72"
  problem: "The fix must be applied identically to five byte-identical copies, and nothing on the floor keeps them in sync after the build — a future one-copy edit silently re-introduces divergence (the same duplication that let #78 port the buggy masker). Consolidation is correctly deferred (separate axis, P7), but verify byte-identity of the five maskers post-build."
  evidence: "the five copies stay byte-identical after the rewrite; folding them into a shared `scan-code` util is a separate, already-deferred axis"
```

## Summary

The plan is unusually well-grounded: the launder is reproduced live on all five scanners, the fix is
confined to the suppression-only `maskTemplateInteriors`, monotonicity (P0/P2) is preserved, the
guarantee audit correctly labels floor vs advisory, and the one behavior change (Design B flips
`null-deref.test.mjs:116`) is surfaced and human-approved rather than silent. No blocking-severity
concern survives interrogation — the spec-hash holds and the sole open question is resolved.

The five concerns are all about **hardening the test/doc surface around the chosen Design B**, not about
the approach: (1) pin the interpolation-code-readable side of the hinge, not just the masked side;
(2) actually exercise depth ≥2; (3) pin the fail-open edge; (4) keep the doc residuals honest;
(5) note the un-guarded 5-way duplication. None blocks `/pharn-dev-build`; each is a cheap strengthening
the build can fold in.

## ADVISORY VERDICT

**5 concerns raised (0 blocking-severity, 5 advisory) — for the human to weigh before /pharn-dev-build.**
This grill-log is **advisory end-to-end**: it gates nothing. The deterministic backstops remain
`/pharn-dev-build`'s floor-gates (spec-hash drift fix #4; unresolved `## Open questions (HALT)`) and
`.dev/floor/validate.mjs`. "Grill produced a GRILL.md" NEVER means "the plan is good" (P0).
