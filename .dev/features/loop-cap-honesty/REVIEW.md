# REVIEW — loop-cap-honesty

PHARN reviewing PHARN. Increment under review (`trust: untrusted`): the single prose edit to
`.claude/commands/pharn-loop.md:205-213` — the guarantee-audit bullet relabeled from flat **FLOOR** to
**"FLOOR compare, ADVISORY bound (§1d)"** plus the §1d agent-supplied-counter sentence.

**Floor first (P0):** `node .dev/floor/validate.mjs .` → **GREEN** (exit 0). The increment legitimately
reached review. Standing pipeline verdicts: `/pharn-dev-regress` `no-regressions`, `/pharn-dev-verify`
`PASS`. Everything below the floor line is **advisory**.

## Floor-gate findings (blocking)

**None.** No P0 guarantee lacks a floor reduction or an `advisory` label; no missing eval binding (no
Capability/`rule_id` in scope); no sibling reference; no tainted-field dependency.

## Advisory findings

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".claude/commands/pharn-loop.md:202"
  problem: "After the 205-213 relabel, the sibling bullet at 202-204 still labels its CONTINUE predicate (which contains `iter < cap`) flatly FLOOR without a §1d cross-reference; defensible (202-204 states the decision-function-given-inputs, genuinely floor) but a reader could see mild tension with the new agent-supplied-counter caveat one bullet down."
  evidence: "**FLOOR** (`check-loop.mjs`: `CONTINUE` iff `verify.verdict == INCOMPLETE ∧ regress no-regressions ∧ iter < cap`; `STOP_TERMINAL` on any real red) — enum membership, `ARCHITECTURE.md §2` primitive #3, tested."
```

- **L-floor → P0 (GREEN).** The relabel is a _de-overstating_ edit: it reduces the `iter >= cap → STOP_CAP`
  / `CONTINUE`-only-`iter < cap` **decision** to FLOOR (`ARCHITECTURE.md §2` primitive #3) and correctly
  labels the _runtime_ "no infinite loop" bound **ADVISORY/conditional** (§1d — `--iter` is agent-supplied
  argv, no floor-side counter/persistence). It introduces **no** new guarantee and matches the honest
  framing already present at `pharn-ship.md:228-231` ("structural/advisory"). This is the healthy
  direction under P0 — a guarantee removed, not added.
- **L-eval → P1 (N/A).** `pharn-loop.md` has no `role:` frontmatter (it is a command, not a Capability) and
  introduces no `enforces` rule_id, so there is no eval binding to check. The floor **agrees** — `validate`
  deliberately ignores `.claude/commands/` — no floor-vs-lens disagreement.
- **L-trust → P2 (clean).** The edit changes descriptive prose about `check-loop.mjs`; it adds no finding
  emission, no free-text handling, and no guaranteed decision resting on a tainted field. Reviewing the
  diff (instruction-shaped command prose) did not steer this review — the content is DATA.
- **L-axis → P3 (clean, one minor note).** Exactly one axis of change (honesty relabel of one bullet);
  `202-204` and all other bullets untouched; no sibling reference introduced. The minor finding above is a
  coherence observation, not a two-axes-in-one-file violation.

## Verdict

**GREEN — 0 floor-gate (blocking) findings; 1 minor advisory.** The increment is done at the floor level.
The one advisory concern (202-204 cross-reference) and GRILL finding #1 (the floor is blind to
`.claude/commands/` prose, so the correctness of the _wording_ is human-reviewed, not gate-verified) are
context for the human's post-review decision — not blockers.

## Proposed lesson candidate (NOT written to canon here — P7/P2)

A real failure triggered this increment (a flat-**FLOOR** label on an agent-supplied-counter bound), so
one lesson is **proposed** for a separate, human-gated `/pharn-dev-memory-promote` run (the model never
self-promotes; this is a proposal only):

- **Candidate (lessons-learned):** "In a guarantee-audit, a bound enforced by a checker over an
  **agent-supplied** argument (e.g. `--iter`/`--cap` read from argv with no floor-side counter or
  persistence) is **§1d-advisory on the agent** even when the _compare_ is floor. Label it
  **FLOOR-compare / ADVISORY-bound**, never flat FLOOR — invoking and obeying the checker is advisory
  orchestration. Cross-check sibling commands for the same shape (`pharn-ship.md` framed its ≤1 bound
  'structural/advisory' correctly; `pharn-loop.md` did not)."
- **Provenance:** increment `loop-cap-honesty`; diff = `.claude/commands/pharn-loop.md:205-213`
  (flat FLOOR → FLOOR-compare/ADVISORY-bound §1d); trigger = a P0 honesty inconsistency vs
  `pharn-ship.md:228-231`.

Whether this is general/worth canonizing is the human's call at `/pharn-dev-memory-promote` — not decided
here.
