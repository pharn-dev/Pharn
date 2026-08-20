# SHIP — deny-message-phantom-commands

A thin, **advisory** roll-up of one `/pharn-dev-ship` run. It records **that the chain ran and its floor
verdicts** — nothing more.

## Where the run ended

**GATE 2 — the post-review human decision.** The chain ran to completion after one intervening
RED-verdict STOP that the human cleared by hand (below).

## Stages run, in order, with the structural verdict read at each

| #   | stage                            | verdict read (source)                       | value                                 | action     |
| --- | -------------------------------- | ------------------------------------------- | ------------------------------------- | ---------- |
| 1   | `/pharn-dev-plan`                | — (ends at its own approval halt)           | **GATE 1 — approved by the human**    | proceed    |
| 2   | `/pharn-dev-grill`               | none by design (advisory, gates nothing)    | 5 concerns, 0 blocking-severity       | proceed    |
| 3   | `/pharn-dev-build`               | `node pharn/floor/validate.mjs .` exit code | **0** (GREEN)                         | proceed    |
| 4   | `/pharn-dev-regress`             | `regression-report.json` `.verdict`         | **`no-regressions`**                  | proceed    |
| 5a  | `/pharn-dev-verify`              | `verify-report.json` `.verdict`             | **`FAIL`** (`failing_gates:["test"]`) | **STOP**   |
| —   | _human applies the hook handoff_ | — (Bash `mv`, outside `PreToolUse`)         | —                                     | resumed    |
| 5b  | `/pharn-dev-verify`              | `verify-report.json` `.verdict`             | **`PASS`** (all 6 gates exit 0)       | proceed    |
| 6   | `/pharn-dev-review`              | none by design (LLM severity is advisory)   | 1 blocking, 2 advisory                | **GATE 2** |

**Both human gates held.** GATE 1: the human approved the plan and resolved its two open questions by
selection (the exemplar pair; the handoff form). The STOP at 5a: the human applied the hook change —
the agent could not, and did not. Nothing was self-approved.

## The intervening STOP, and why it was correct

`/pharn-dev-verify` first returned `FAIL` on `test`: four tests added by this increment assert against
the **live** `.claude/hooks/enforce-writes-scope.cjs`, which is hook-protected (fix #2, probed live:
exit 2) and was still unpatched. The chain stopped and handed over.

That red was the floor reporting un-applied state, not a defect. The tests were deliberately pointed at
the live hook rather than the handoff copy, which would have shown green while the real guard still
printed phantom command names — the false-green shape `.dev/memory-bank/lessons-learned.md` **L26**
names.

**The applied file is byte-identical to what was verified.** Before handover the change was applied in a
detached `git worktree` of this repo carrying full working-tree state (`npm run check` **exit 0**,
`node --test` **1491 pass / 0 fail**); the installed hook hashes to
`sha256 5f48a7e8a843597bb505950cbf76397bafae434a7d4e0decdd77e0cfc63691d6`, identical to both the handoff
and the worktree copy the gates ran against. Verified at the real path, per L26 — never a scratchpad copy.

## Reproduce, after (P6)

A live denial from the installed guard now reads
`• If running a command (/pharn-build, /pharn-dev-build, …): …`, and
`grep -c "/build, /review" .claude/hooks/enforce-writes-scope.cjs` → **0**. The verdict is unchanged: the
probe still exits 2 and no path became writable.

## GATE 2 — presented, decided by the human, and actioned

`/pharn-dev-review` returned **BLOCKED — 1 floor-gate finding**: `CHANGELOG.md:71` claimed the new tests
catch "any future phantom or non-scope-setting name", while all five rendered only the **in-repo** branch
of `denyMessage()` — L27's own per-branch rule applied to half its domain, one increment after L27 was
promoted for the neighbouring miss in the same function. No live defect (the out-of-root branch cites no
commands — probed), but the claim was broader than its reduction.

**The human chose the fix over the narrowed sentence**, and it landed: the membership rules now iterate
`everyDenyMessage()`, a single enumeration of every branch, and the out-of-root branch asserts the other
half of L27's form (it must cite **no** command). The emptiness assertion was **mutation-tested** — an
injected `/frobnicate` is caught — rather than trusted to pass by construction (L4).

**Gates re-run after that change:** `npm run check` **exit 0**; `check-verify.mjs` **PASS**, all six
gates exit 0; `node --test` **1492 pass / 0 fail**.

A canon lesson is **proposed** in `REVIEW.md` (a per-branch rule applied from one branch is not applied)
and deliberately **not written** — promotion is a separate, human-gated `/pharn-dev-memory-promote` run.
Merge remains the human's call; this roll-up does not make it.

## Pointers (cited, not restated — P4)

- `PLAN.md` — the approved plan, incl. the named FIRST-step residual.
- `GRILL.md` — advisory; 5 concerns, 0 blocking-severity.
- `REGRESSION.md` / `regression-report.json` — `no-regressions`.
- `VERIFY.md` / `verify-report.json` — `PASS`; both passes recorded, the FAIL kept as evidence.
- `REVIEW.md` — 1 blocking + 2 advisory findings, and a proposed lesson **not** written to canon.
- `enforce-writes-scope.patch` — the human-applied diff.

## What this file is NOT

`/pharn-dev-ship` added **no new floor primitive**. Every guarantee above belongs to a **sub-stage**
(`validate`, `check-regress`, `check-verify`, the writes-scope hooks, the build's spec-hash re-check);
running the stages in order is **advisory orchestration**. This is **not** a self-issued "shipped", not
an approval, and not a `PHARN ✓ reviewed` seal.

Chain ran; the named floor verdicts are as shown — this is NOT a judgment that the increment is good or
wise; that is the human's call at the post-review gate.
