# GRILL — safe-test-list-expansion (ADVISORY)

- Plan under interrogation: `.dev/features/safe-test-list-expansion/PLAN.md`
- Spec-hash check (content-hash floor primitive, surfaced): `sha256(ARCHITECTURE.md)` = `11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969` **==** the plan's pin → **no drift**.
- Griller membership (FLOOR, `count-grillers.mjs`): 13 registered, all targeting product-code plans → **N/A** to a build-apparatus command-doc edit. Relevant axes (P0/P7 honesty, scope) interrogated inline.

## Findings

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/safe-test-list-expansion/PLAN.md:31"
  problem: "The remedy is a doc note with NO floor teeth — the agent can still write `node --test $LIST` and nothing stops it, so it reduces but cannot prevent the L5 recurrence. The plan states this honestly; surfaced only so the human weighs whether an eventual lightweight floor check (grep each command's Bash for a test-runner fed an unquoted $VAR) is a worthwhile follow-up."
  evidence: "'it has no floor reduction … the agent could still write `node --test $LIST`. The note reduces recurrence … it does not guarantee it.' (PLAN.md guarantee audit)"

- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/safe-test-list-expansion/PLAN.md:15"
  problem: "The guardrail addresses THIS run's zsh symptom (word-splitting), but the deeper class is 'shell list-building for any test runner is fragile.' Scoping to pharn-dev-regress only (approved) is the right smallest step; just note the product mirror /pharn-regress carries the isomorphic risk and was consciously deferred, not overlooked."
  evidence: "'The product mirror /pharn-regress … deliberately deferred … borderline-speculative (P7)' (PLAN.md Files/Open-questions)."
```

## Prose summary

The plan is correctly scoped and honestly labelled. Its guarantee audit does the right thing — it calls the guardrail **advisory** and explicitly refuses a floor-guarantee claim, which is exactly the P0 discipline (an advisory doc note dressed as a "fix" would be the disease; this plan does not do that). P1 is correctly N/A (a command `.md` is neither a Capability nor a checker). P7 is well-served: the trigger is a **real** recurrence of L5, and the increment is the smallest coherent unit (one file; the product mirror consciously deferred). Both findings are minor and are really "eyes-open" notes, not gaps: the remedy's advisory ceiling (it guides, it cannot enforce) is inherent to operationalizing L5 in a command doc, and is stated in the plan.

## Verdict

**ADVISORY VERDICT: 2 concerns raised (0 blocking-severity, 2 minor) — for the human to weigh. Gates nothing; `/pharn-dev-build`'s floor-gates + `validate.mjs` remain the only deterministic backstops.**
