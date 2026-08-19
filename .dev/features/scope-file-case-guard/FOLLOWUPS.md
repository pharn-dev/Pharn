# FOLLOWUPS — post-GATE-2 fixes directed by the human

Scope declaration for the three follow-ups the human approved at GATE 2 that this stage writes
directly. **Not a PLAN** — no grill/build/verify cycle; each is a one-to-few-line correction to
**apparatus**, triggered by a defect this run reproduced live (P7: real failures, not hypotheticals).

**Apparatus only — no `SKILLS_VERSION` bump.** `CLAUDE.md`, `.prettierignore`, and the `pharn-dev-*`
commands are all outside the bump-triggering product surface enumerated in `CLAUDE.md`.

## Files

- `CLAUDE.md` — narrow hard-constraint #1's "write-protected and human-only" heading to what the guard
  delivers (`REVIEW.md`, L-trust P2, important)
- `.claude/commands/pharn-dev-regress.md` — replace the "through `xargs`" prose with a literal,
  copy-pasteable portable snippet (L16's eighth recurrence; the L20 escalation)
- `.claude/commands/pharn-dev-verify.md` — resolve the verbatim-vs-`format:check` conflict by pointing
  at the `.prettierignore` entry instead of relying on the two agreeing by accident
- `.prettierignore` — exempt the two machine reports that stages must write **verbatim**

### Deliberately NOT in scope

- `.dev/memory-bank/lessons-learned.md` and `docs/lessons-index.md` — the two lesson candidates in
  `REVIEW.md` are promoted **only** through `/pharn-dev-memory-promote`, which declares those paths in
  its **own** `writes:`, runs `check-provenance.mjs`, and halts for a human accept/deny. Declaring a
  downstream gate's target in an upstream stage's scope is precisely what **L7** forbids — it would hand
  this stage the direct canon write the promote gate exists to withhold.
- The four trusted docs, `CODEOWNERS`, and the guards' control surface — unchanged and hook-denied.

## Guarantee audit (P0)

- **The writes land only in the four declared files** → **FLOOR: hook** (fix #7).
- **`format:check` returns 0 with the reports left verbatim** → **FLOOR: the gate's own exit code**,
  measured after the change.
- **That the reworded `CLAUDE.md` heading is now accurate, and that the `xargs` snippet prevents the
  next recurrence** → **ADVISORY.** No checker reads either. The snippet removes a _choice_ that keeps
  being made wrong; it does not make the wrong choice impossible, which is why `REVIEW.md` Candidate A
  still proposes canon.
