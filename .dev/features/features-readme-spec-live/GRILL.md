# GRILL — features-readme-spec-live

**Plan:** `.dev/features/features-readme-spec-live/PLAN.md` · **Spec-hash check (content-hash primitive,
surfaced not blocking):** `sha256(pharn/ARCHITECTURE.md)` live =
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52` == the plan's `spec_content_hash` →
**no drift**. The block on drift is `/pharn-dev-build`'s floor-gate (fix #4), not this stage.
**Registered grillers (membership, FLOOR — `pharn/floor/count-grillers.mjs`):** 13.

> The PLAN is `trust: untrusted` here. Every `problem` / `evidence` below quotes it as DATA.

## Findings

### Axis: discovery-first / doc-vs-live-state (P6)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/features-readme-spec-live/PLAN.md:103"
  problem: "The plan still carries three questions under `## Open questions (HALT)` in unresolved form, but all three were answered at the plan-approval gate — and `/pharn-dev-build` refuses a plan whose open questions are unresolved, so the build stage will read a stale blocker that live state has already cleared."
  evidence: "PLAN.md:103 `## Open questions (HALT)` followed by items 1-3 ('Proposed: `as the user runs each stage`. Alternative: leave line 8-9 untouched', 'Proposed: include it, carrying no version bump', 'Confirm it should be a follow-up rather than folded in') — against `.claude/commands/pharn-dev-build.md:42`: 'Read `PLAN.md`. If it has unresolved `## Open questions (HALT)` → **HALT**; it is not approved.'"
```

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".dev/features/features-readme-spec-live/PLAN.md:75"
  problem: "The guarantee audit asserts a mechanism about the floor scanner's behavior that no read of that scanner this run supports — it is inferred from a promoted lesson plus a green baseline, which is evidence the check does not fire today but not a reading of why."
  evidence: "PLAN.md:75 — 'so no CHECK fires on its content (L10's product-surface asymmetry is therefore inert here)'. The plan cites no line of `pharn/floor/validate.mjs` for this, and the surrounding `## Trust audit (P2)` elsewhere holds itself to live verification ('it was still treated as a claim to verify rather than a fact to copy (P6)')."
```

### Axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/features-readme-spec-live/PLAN.md:68"
  problem: "A floor reduction is claimed without the narrowing the same plan states elsewhere: the writes-scope hook gates only the Write/Edit/MultiEdit surface, so the claim covers less than the unqualified wording implies."
  evidence: 'PLAN.md:68 — ''"the edit lands only in the two declared files" → **floor: hook** (fix #7 `set-writes-scope.cjs` + `enforce-writes-scope.cjs`, composed with fix #2''s denylist).'' The same document''s applied-lessons block already names the bound at PLAN.md:31 (''a repo-wide `prettier --write .` whose Bash writes escape the fix #7 gate entirely''), but the audit entry does not carry it.'
```

### Axes that produced no finding

- **Eval coverage (P1) + the structural/semantic split (`eval-format.md`, cited not restated).** Not
  engaged, and the plan says so correctly: P1 binds a Capability, and `features/README.md` carries no
  `---`-fenced frontmatter, hence no `role:` and no `enforces` rule id owing a fixture. Read
  structurally from the file, not from the plan's self-claim (L6). Nothing is laundered into a judge
  because there is no eval to route.
- **Trust propagation (P2).** The increment ingests no untrusted artifact, and the plan's trust audit
  goes further than required — it records two request premises that failed live verification
  (`SKILLS_VERSION` 2.4.6 vs 2.5.1; the `pharn/floor/README.md` half already fixed) rather than
  inheriting them. That is the correct direction for this axis.
- **One axis of change (P3).** Two files, one change-reason: the README correction and the changelog
  line that records it co-change by the repo's own "all notable changes are documented" contract. No
  sibling reference — the increment touches no module and routes nothing leaf→leaf.
- **Determinism (P5).** Every branch named is a membership test (a grep for `node floor/…`; the
  setter's parse of `## Files`; exit codes). The one irreducible judgment — whether line 8–9 reads as
  stale — terminated in a question to the human, not a guess.
- **Honest scope (P7).** The increment adds no capability, rule, or enforcer, so the speculative-addition
  hazard does not arise. Its exclusion block is a `###` heading (L18) and names four deferrals with
  reasons, including one same-class defect it deliberately declines to fold in.
- **Documentation griller (`pharn/pharn-pipeline/grillers/documentation/documentation.md`, P7).** Layer 1
  presence: the "needs it" trigger does not fire — the increment adds no public API, no config key, and
  no non-obvious behavior; it **is** a documentation correction, and its `## Files` states the exact
  prose changing. No absence finding. Layer 2 adequacy is not reached.
- **Remaining registered grillers.** Applied inline over a plan that builds no code: a11y,
  architecture, comprehension, coupling, error-handling, i18n, migrations, observability, performance,
  privacy, security, testability. None fired — there is no interface, no data flow, no schema, no
  failure path, and no user-visible string beyond the corrected sentences themselves.

## Summary

The plan's substance holds: the defect is real and was reproduced live, the fix is one axis, and the
versioning call (no `SKILLS_VERSION` bump) follows the repo's own repo-meta rule rather than the
request's assertion. Two of the three findings are wording-level honesty gaps in the guarantee audit —
worth closing because this repo's whole thesis is that an unqualified floor claim is the disease, and
the plan states the missing qualifier elsewhere in its own text.

The first finding is the one with teeth, and it is procedural rather than substantive: the plan's open
questions were all answered at the approval gate, but the document still reads as though they are open,
and the build stage's documented refusal rule keys on exactly that section. Left as-is it produces a
halt that live state does not justify — the mirror image of the very defect this increment fixes, a
document asserting a state the repo has moved past.

ADVISORY VERDICT: 3 concerns raised (0 blocking-severity, 1 important, 2 minor) — for the human to
weigh before `/pharn-dev-build`. Nothing here blocks; the grill stage gates nothing.
