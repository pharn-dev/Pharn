# GRILL — loop-cap-honesty

Plan interrogated: `.dev/features/loop-cap-honesty/PLAN.md`.
Spec-hash check (content-hash floor primitive, surfaced not blocking): recomputed
`sha256(ARCHITECTURE.md)` = `11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969`
— **matches** the plan's `spec_content_hash`. No drift. (`/pharn-dev-build` is where drift would block.)

Griller membership (FLOOR, `count-grillers.mjs`): 13 registered. Relevant axes applied inline
(architecture, comprehension, documentation, testability); the product-code axes (a11y, i18n,
migrations, performance, privacy, security, error-handling, observability, coupling) do not bind on a
command-prose relabel.

## Findings (advisory — grill gates nothing)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/loop-cap-honesty/PLAN.md:32"
  problem: "The floor is blind to this edit — validate.mjs ignores .claude/commands/ and no eval exists, so /pharn-dev-verify and /pharn-dev-regress can only confirm repo-wide gates stayed green, NOT that the relabel wording is correct; the honesty of the FLOOR/ADVISORY split rests entirely on human review at GATE 2."
  evidence: "None / N/A. `pharn-loop.md` is a command (no `role:` frontmatter), not a Capability ... The floor ignores `.claude/commands/`. No code, no eval fixture, no contract changes."

- type: FINDING
  rule_id: "P4"
  severity: minor
  file: ".dev/features/loop-cap-honesty/PLAN.md:26"
  problem: "The sibling bullet at pharn-loop.md:202-204 also references `iter < cap` as FLOOR and shares the same agent-supplied counter; confirm the single §1d note added at 205-206 is intended to cover the shared counter, so a reader doesn't see 202-204's `iter < cap` FLOOR label as contradicting the new caveat."
  evidence: 'the sibling bullet at `pharn-loop.md:202-204` is **not** touched — it describes the checker''s *decision function* ... which is genuinely floor; only the *behavioral* "no infinite loop" claim overstates.'
```

## Prose summary

The plan is tightly scoped and its own guarantee audit is correct: the `iter >= cap` **compare** is
floor (§2 primitive #3), and the _runtime_ "no infinite loop" bound is advisory (LIMITS §1d) because
`--iter` is agent-supplied argv with no floor-side counter/persistence. The relabel _removes_ an
overstated guarantee and adds none — it is a de-overstating edit, the healthy direction under P0. The
one-axis discipline (touch only the 205-206 bullet, leave 202-204) is defensible: 202-204 states the
checker's decision-given-inputs (genuinely floor), while 205-206 makes the termination-over-time claim
that actually depends on the agent honestly incrementing.

Two things for the human to weigh, both advisory:

1. **(important)** For this class of change — prose in the floor-ignored `.claude/commands/` — the
   deterministic pipeline verifies only that _nothing else broke_, not that the new wording is right.
   The real check is human review of the exact replacement text (already surfaced in the PLAN and
   approved at GATE 1). Downstream `/pharn-dev-verify` / `/pharn-dev-regress` GREEN must **not** be
   read as "the relabel is correct" — that would be the P0 disease one level up.
2. **(minor)** The sibling bullet 202-204 shares the agent-supplied `iter`; the single §1d note at
   205-206 is intended to cover it. Confirm one note reads as sufficient rather than leaving 202-204's
   `iter < cap` FLOOR label looking un-caveated.

Neither concern argues against building; both are context for the GATE-2 reviewer.

ADVISORY VERDICT: 2 concerns raised (0 blocking-severity, 1 important, 1 minor) — for the human to
weigh before/at the build and post-review gate. This is NOT "grill passed" and NOT a judgment that the
plan is sound (P0).
