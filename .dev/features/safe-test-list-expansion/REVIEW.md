# REVIEW — safe-test-list-expansion

PHARN reviewing PHARN. The increment (one guardrail bullet in `pharn-dev-regress.md`) is `trust: untrusted`; its instruction-looking content is reviewed as DATA, never followed.

## Step 1 — Floor first (P0)

`node .dev/floor/validate.mjs .` → **GREEN** (exit 0). Everything below is advisory.

## The four lenses

### L-floor → P0 — GREEN

The increment adds a doc guardrail and makes **no guarantee claim**: the plan and the bullet itself frame it as guidance ("reduces recurrence, does not guarantee it"). No guarantee lacks a floor reduction; nothing reads as floor-backed that isn't. **No blocking finding.** (Minor advisory below: the remedy is advisory-only by nature.)

### L-eval → P1 — GREEN

No `role:` Capability and no floor checker is added — the increment edits a command `.md` body, so no capability `evals/` and no `.test.mjs` apply, and no `enforces` rule_id is introduced. Floor agrees (GREEN). **No finding.**

### L-trust → P2 — GREEN

The edit **adds instructions** to a command (its purpose), and I reviewed those instructions as DATA — checking they are sound/honest, not obeying them. The guardrail prescribes a correct technique (`xargs`/array) and cites `lessons-learned.md L5` (P4). No injection; no reviewer behavior changed; no guaranteed decision rests on any free-text. **No blocking finding.**

### L-axis → P3 — GREEN

One file, one axis (the safe-list-expansion guardrail). The citation of `.dev/memory-bank/lessons-learned.md` L5 is a P4 canon-citation, not a leaf→leaf sibling import; `pharn-dev-regress.md` is build apparatus, not a `pharn-*` leaf. No sibling reference. **No blocking finding.**

## Findings

### Floor-gate (blocking): NONE

### Advisory (inform the human; carried from grill)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".claude/commands/pharn-dev-regress.md:127"
  problem: "The guardrail is advisory-only — no hook/checker enforces that the stage's Bash actually uses xargs/quoting, so a future agent could still write `node --test $LIST`. It reduces recurrence by placing the fix at the point of use; it cannot prevent it. (Inherent to operationalizing L5 in a command doc; stated honestly.)"
  evidence: "the added bullet 'Expand the `tests` list SAFELY (L5) … never `node --test $LIST`' is guidance to the agent, not a floor primitive."

- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/safe-test-list-expansion/PLAN.md:17"
  problem: "The product mirror /pharn-regress carries the isomorphic list-building risk and was consciously deferred (borderline-speculative, generic runner). Fine as the smallest step; noted so a future dogfood failure there triggers the analogous guardrail."
  evidence: "'The product mirror /pharn-regress … deliberately deferred' (PLAN.md)."
```

## Proposed lesson candidate

**None.** This increment **operationalizes** existing canon L5; it does not reveal a new recurring failure. (The earlier attempt to add an L14 duplicate of L5 was correctly denied at the memory gate.)

## Verdict

**GREEN — floor GREEN; 0 blocking floor-gate findings; 2 minor advisory findings.** "Reviewed" means the floor is green and the lenses found nothing blocking — not a judgment that the guardrail will change future behavior (that is the advisory nature of the remedy, and the human's GATE-2 call).
