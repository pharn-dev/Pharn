# SHIP — out-of-root-deny-message

Gated `/pharn-dev-ship` run (no `--loop`). **Two passes:** the chain ran to GATE 2, the human chose
**fix**, and the verification half re-ran against the repaired tree. **Where it ended: GATE 2, pass 2** —
the human decides merge / fix / abandon.

## Pass 1 — the chain, in order

| #   | stage                | structural verdict read                         | value                     | proceed? |
| --- | -------------------- | ----------------------------------------------- | ------------------------- | -------- |
| 1   | `/pharn-dev-plan`    | GATE 1 — human approval halt                    | **Approve as written**    | yes      |
| 2   | `/pharn-dev-grill`   | none (advisory by design; gates nothing)        | 5 concerns                | yes      |
| 3   | `/pharn-dev-build`   | `node pharn/floor/validate.mjs .` **exit code** | **0** (GREEN, 36 caps)    | yes      |
| 4   | `/pharn-dev-regress` | `regression-report.json` `.verdict`             | **`no-regressions`**      | yes      |
| 5   | `/pharn-dev-verify`  | `verify-report.json` `.verdict`                 | **`PASS`**, 1481/1481     | yes      |
| 6   | `/pharn-dev-review`  | none (no structural verdict exists — fix #3)    | **BLOCKED** — 1 floor + 3 | GATE 2   |

## GATE 2 → "fix" → pass 2

The human's decision at GATE 2 was **fix**. All four findings were dispositioned, and the verification
half of the chain re-ran — **both sides re-measured, nothing carried over**:

| #   | stage                | verdict read                        | pass 1                 | pass 2                   |
| --- | -------------------- | ----------------------------------- | ---------------------- | ------------------------ |
| 4   | `/pharn-dev-regress` | `regression-report.json` `.verdict` | `no-regressions`       | **`no-regressions`**     |
| 5   | `/pharn-dev-verify`  | `verify-report.json` `.verdict`     | `PASS`, 1481/1481      | **`PASS`, 1483/1483**    |
| 6   | `/pharn-dev-review`  | none (advisory)                     | BLOCKED (1 floor-gate) | **GREEN — 0 floor-gate** |

Verbatim, pass 2:

```json
{ "verdict": "no-regressions", "regressions": [], "pre_existing": [] }
{ "verdict": "PASS", "failing_gates": [] }
```

Pass-2 `/pharn-dev-verify` gates: `test` 0 (1483/1483) · `validate` 0 · `lint` 0 · `format:check` 0 ·
`lint:md` 0 · `structural:expected-injection-comment.json` 0. Pass-2 `/pharn-dev-regress` baseline
`c7361da79a6946263b1571a5d9d9cf806cce7f5d`, 67 outside suites (set confirmed byte-identical to pass 1
before either side ran), style gates deterministically skipped and absent from **both** maps.

### Finding disposition (detail in `REVIEW.md`)

- **F1** (P0, **blocking**) — the guarantee audit claimed `floor: structural`, a fourth primitive P0 does
  not admit. **Fixed in place**, at the claim, where [[L2]] requires the honesty to live.
- **F2** (P2, important) — `blockedPath` was interpolated raw while the header asserted every echo was
  sanitized; a `file_path` carrying U+000A forged a FIX-bullet line. **Fixed in the hook** (second
  human-applied patch), header **re-derived**, two assertions added. Present at BASE, so this closes an
  **inherited** defect.
- **F3** (P2, minor) — **left OPEN, correctly.** The Bash boundary is prose and cannot become floor: the
  route it names sits outside `PreToolUse` by construction. Recorded as a named residual rather than
  papered over.
- **F4** (P0, important) — the `.patch` record was written but undeclared. **Fixed by declaring** it,
  with the after-the-fact ordering stated. Confirmed deterministically: `check-regress.mjs scope` now
  reports **one** escape where it reported two.

## Two human-applied patches, recorded

`.claude/hooks/enforce-writes-scope.cjs` is hook-protected (fix #2 denies `Write`/`Edit`/`MultiEdit`, all
three probed at exit 2) and sits on `set-writes-scope.cjs`'s `CONTROL_SURFACE`, so the agent could not
write it. Both changes were delivered as a whole-file handoff at the declared path `.claude/hooks/test.cjs`
and renamed into place by the human. Each was verified **at the real path** in a `git worktree` of this
repo before hand-off (L26) — the first pass caught two `no-useless-escape` errors that a scratchpad copy
would have skipped silently. Landed hashes: `9d64bef6…` (pass 1), `396ea124…` (pass 2), each identical to
the worktree copy that `npm run check` passed at exit 0.

## Pointers (cited, not restated — P4)

- `.dev/features/out-of-root-deny-message/REVIEW.md` — both passes; the pass-1 findings are retained in
  full with their closure evidence rather than deleted.
- `.dev/features/out-of-root-deny-message/GRILL.md` — advisory, gated nothing; 4 of its 5 concerns changed
  how the approved files were written.
- `.dev/features/out-of-root-deny-message/REGRESSION.md` — including the `scope` escape findings, recorded
  and then disproven or closed with evidence rather than waived (L17).
- `.dev/features/out-of-root-deny-message/VERIFY.md` — both L26 worktree verifications and both negative
  controls.
- `REVIEW.md` also carries **two proposed lesson candidates**. They are proposals only; nothing was
  written to `.dev/memory-bank/`, and promotion is a separate human-gated `/pharn-dev-memory-promote` run.

## What this record is, and what it is not (P0)

`/pharn-dev-ship` added **no** floor primitive. Every guarantee above belongs to a **sub-stage**:
`validate.mjs`'s exit code, `check-regress.mjs`'s comparison, `check-verify.mjs`'s threshold, and the
fix #7 hooks that pinned each stage's writes. Running the stages in order, and reading their verdicts, is
**advisory orchestration** — nothing on the floor forced the sequence, and nothing forced the re-run.

`/pharn-dev-review`'s GREEN at pass 2 is **not** a floor verdict and was not treated as one: the stage has
no structural verdict, its severities are LLM-assigned (fix #3), and a GREEN there means only that no
finding survived which reduces to something the floor can check. The `GRILL.md` / `REVIEW.md` free-text
quoted anywhere in this run was presented as **DATA**; no proceed/stop decision rested on it.

**Chain ran, twice through its verification half; the named floor verdicts are as shown — this is NOT a
judgment that the increment is good or wise; that is the human's call at the post-review gate.** No
merge, no push, no commit, and no `PHARN ✓ reviewed` seal was issued here.
