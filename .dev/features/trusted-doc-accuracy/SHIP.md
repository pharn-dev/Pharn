# SHIP — trusted-doc-accuracy (F7)

Advisory roll-up. `/pharn-dev-ship` gated mode: the chain ran in order, and each proceed was read
from that stage's structural verdict, never from judgment.

## Stages run, in order

| #   | stage                | structural verdict read                  | value                  | proceed |
| --- | -------------------- | ---------------------------------------- | ---------------------- | ------- |
| 1   | `/pharn-dev-plan`    | — (GATE 1: human approval)               | approved as written    | ✓       |
| 2   | `/pharn-dev-grill`   | none — advisory by design, gates nothing | 7 concerns raised      | ✓       |
| 3   | `/pharn-dev-build`   | `pharn/floor/validate.mjs .` exit code   | **0** (GREEN, 36 caps) | ✓       |
| 4   | `/pharn-dev-regress` | `regression-report.json` `.verdict`      | **`no-regressions`**   | ✓       |
| 5   | `/pharn-dev-verify`  | `verify-report.json` `.verdict`          | **`PASS`** (5/5 gates) | ✓       |
| 6   | `/pharn-dev-review`  | none — no structural verdict by design   | 6 advisory findings    | GATE 2  |

**Run ended at GATE 2** — the human decides merge / fix / abandon. No RED-verdict STOP occurred.

## Verdicts, verbatim

- `/pharn-dev-build` → `node pharn/floor/validate.mjs .` → exit **0**, `FLOOR: GREEN — 36 capabilities checked in .`
- `/pharn-dev-regress` → `.verdict` = **`no-regressions`**; `regressions: []`, `pre_existing: []`;
  scope `escaped: []` with 5 paths in `escape_exempt`
- `/pharn-dev-verify` → `.verdict` = **`PASS`**; `failing_gates: []`; gates
  `test`/`validate`/`lint`/`format:check`/`lint:md` all exit 0
- aggregate `npm run check` → exit **0**

Additional floor reads this run (each owned by its own checker, not by this stage):
`check-plan-lessons.mjs` GREEN (8 ids resolve); the fix #4 spec-hash gate MATCHED at build time;
`count-grillers.mjs` 13 registered; `count-verifiers.mjs` 0 registered.

## What landed

11 edits across 4 files, plus the version and changelog:

- `pharn/ARCHITECTURE.md` (3), `THREAT-MODEL.md` (3), `LIMITS.md` (4) — applied through **Bash**, the
  GATE-1-approved path, which passes **neither** fix #2 **nor** fix #7 (declared in `PLAN.md`, L19)
- `CLAUDE.md` (1) — Edit tool, inside the fix #7 scope
- `SKILLS_VERSION` 2.5.0 → **2.5.1** (patch), `CHANGELOG.md` `[Unreleased]` entry

The ten Bash edits carried a per-edit assertion: each substitution had to match **exactly once**
across all ten before any file was written (fail-closed), then each was re-verified after writing.
10/10 both times. That check exists because `/pharn-dev-grill` raised it as a blocking-severity P6
concern; it is a real deterministic check but it is **not** part of any stage's verdict.

## Pointers (cited, not restated — P4)

- `.dev/features/trusted-doc-accuracy/REVIEW.md` — 6 advisory findings, 4 lenses, candidate lesson,
  and one withdrawn finding recorded in place rather than deleted
- `.dev/features/trusted-doc-accuracy/GRILL.md` — 7 advisory concerns (advisory; gated nothing)
- `.dev/features/trusted-doc-accuracy/VERIFY.md`, `REGRESSION.md`, `PLAN.md`

## Two things the human should carry into the decision

1. **No gate in this repo reads trusted-doc prose.** The three docs are excluded from both formatters
   and are not in `validate`'s scan tree, so the green verdicts above say nothing about whether the
   eleven annotations are _right_. Accuracy rests on the `PLAN.md` `## Discovery` verification and on
   human review.
2. **The spec pin self-invalidated.** `sha256(pharn/ARCHITECTURE.md)` moved `a1c243ea…` → `8f5ec002…`
   because the increment edits the doc the plan pins. The build checked the pin _before_ writing, so
   nothing was bypassed — but re-running this plan would now HALT as "drifted".

---

Chain ran; the named floor verdicts are as shown — this is **NOT** a judgment that the increment is
good or wise; that is the human's call at the post-review gate. No merge, no push, no
`PHARN ✓ reviewed` seal was applied.
