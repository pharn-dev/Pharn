# SHIP — retro-tag-legacy-lessons

A thin, **advisory** roll-up of the `/pharn-dev-ship` run. It records **that the chain ran and its floor
verdicts** — nothing more.

## Where the run ended

**GATE 2 — the post-review human gate**, reached twice: once on the initial chain, and again after a
**human-authorized fix pass** ("fix everything needs fixing"). No stage ever returned a non-GREEN
verdict, so there was no RED-verdict STOP. GATE 1 (plan approval) was satisfied before the run and was
**never re-entered** — the fix pass amended the approved plan's `## Files` and recorded the amendment;
it did not re-plan.

## Stages run, in order, with the verdict READ at each

| #   | stage                | verdict read (source)                              | pass 1                 | pass 2 (post-fix)    |
| --- | -------------------- | -------------------------------------------------- | ---------------------- | -------------------- |
| 1   | `/pharn-dev-plan`    | GATE 1 — human approval (pre-existing)             | **approved**           | _not re-entered_     |
| 2   | `/pharn-dev-grill`   | _none — advisory by design, gates nothing_         | 6 concerns, 0 blocking | —                    |
| 3   | `/pharn-dev-build`   | exit code of `node pharn/floor/validate.mjs .`     | **0** (GREEN)          | **0** (GREEN)        |
| 4   | `/pharn-dev-regress` | `regression-report.json` `.verdict`                | **`no-regressions`**   | **`no-regressions`** |
| 5   | `/pharn-dev-verify`  | `verify-report.json` `.verdict`                    | **`PASS`**             | **`PASS`**           |
| 6   | `/pharn-dev-review`  | _none — no structural verdict exists (P0, fix #3)_ | GREEN, 5 advisory      | GREEN, 1 advisory    |

**Verbatim verdict detail (final state):**

- **Build (FLOOR):** `FLOOR: GREEN — 36 capabilities checked in .`, exit `0`. The fix #4 spec-hash gate
  matched (`8f5ec002…30fb52` live == pinned). The L20 count check **re-applied rather than being
  waived**: Step 0 printed `15 path(s)` against the GATE-1 plan, and `17 path(s)` against the amended
  one.
- **Regress (FLOOR):** `verdict: "no-regressions"`, exit `0`; `regressions[]` and `pre_existing[]` both
  empty. Outside gates `tests` (64) / `validate` / `structural:…` all `0 → 0`; style gates
  deterministically skipped both sides. `scope` returned `escaped: []` **and** `escape_exempt: []` — all
  17 changed paths are declared, no fix #7 breach.
- **Verify (FLOOR):** `verdict: "PASS"`, exit `0`, `failing_gates[]` empty. Six gates all exit `0`:
  `test` (**1381/1381**), `validate`, `lint`, `format:check`, `lint:md`, `structural:…`.
  `verifiers: {registered: 0}` — floor gates only.
- **Aggregate:** `npm run check` exit `0`.

## What the fix pass changed

Four of the first review's five findings were fixed inside the (amended) `## Files`; one was declined
with reasons recorded in `PLAN.md` `## Post-review amendments`:

1. **P0** — `CHANGELOG.md` now carries the **L19 narrowing** (`docs/lessons-index.md` is a Bash write,
   never fix#7-gated) instead of claiming the build was gated outright.
2. **P0** — the guarantee-audit row now says the `type` enum **marks** a bad value rather than **gates**
   it, agreeing with its own residual row.
3. **P1 / L20** — a live-canon drift guard (`0 untagged · 0 malformed`) was added to the existing
   `.dev/floor/lessons-index-core.test.mjs`, turning the plan's advisory Step-2b grep into a `npm test`
   failure. Per **L4** it was **measured rejecting** two mutations before being trusted; canon was
   restored and verified byte-identical by SHA-256.
4. **P5** — `/pharn-dev-regress.md` now names the committed eval pair in full and prescribes a
   `test -r` pre-check, closing the asymmetry with `/pharn-dev-verify.md` that produced a live false red.
5. **P4** — both index-legend sites state the **rule** rather than narrating the retag event.

**Declined:** `REVIEW.md` F4 (`plan-shape` on L1) — a real but minor tag collision on human-ratified
canon; recorded as a decision, not dropped silently.

## Pointers (cited, not restated — P4)

- `GRILL.md` — advisory interrogation, gates nothing.
- `REGRESSION.md` + `regression-report.json` — including **two** input-capture defects found and
  corrected mid-run.
- `VERIFY.md` + `verify-report.json`
- `REVIEW.md` — 4 advisory lenses, both passes; **0 floor-gate (blocking) findings**, plus a proposed
  lesson candidate (not written to canon — that needs a separate gated promote run).

## Standing decision

**The decision is the human's.** This chain ran; the named floor verdicts are as shown. **This is NOT a
judgment that the increment is good or wise; that is the human's call at the post-review gate.**

`/pharn-dev-ship` applied no `PHARN ✓ reviewed` seal, and this file is not one. Per the guarantee audit:
running the stages in order is **advisory orchestration** — every guarantee in this run belongs to a
**sub-stage** (`validate`, `check-regress`, `check-verify`, the writes-scope hooks, the build's
spec-hash re-check). The gated chain adds **no new floor primitive**; the one floor check this increment
adds is a test in an existing suite, and it covers this repo's canon only.
