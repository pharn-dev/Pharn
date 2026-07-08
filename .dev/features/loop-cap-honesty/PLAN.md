# PLAN — loop-cap-honesty (relabel pharn-loop's cap claim: FLOOR compare, ADVISORY bound §1d)

- spec_content_hash: 11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969 # fix #4 (full-file sha256 of ARCHITECTURE.md)
- increment: Relabel one overstated guarantee-audit claim in `.claude/commands/pharn-loop.md` — "AT MOST N floor-gated retries; no infinite loop" — from flat **FLOOR** to **FLOOR compare / ADVISORY bound (LIMITS §1d)**, matching how `pharn-ship.md:228-231` honestly frames its analogous ≤1 bound.
- layer(s): N/A — `.claude/commands/` orchestration tooling, outside the `ARCHITECTURE.md §4` layer tree; the floor (`validate.mjs`) deliberately ignores `.claude/commands/`.
- constitution_refs: [P0, P7]

## Files

- `.claude/commands/pharn-loop.md` — relabel the cap bullet (currently lines 205–206) + add one §1d-style sentence; prose only. **This path must be in the build `writes:` scope** (`.claude/**` is denied by default / fail-closed).

## The finding (why this edit — verified against live state this run, P6)

- `pharn-loop.md:205-206` labels **"`/pharn-loop` performs AT MOST N floor-gated retries; no infinite loop"** flatly as **FLOOR**.
- `check-loop.mjs:160-163` reads only the two report files (`verify-report.json`, `regression-report.json`) plus `--iter`/`--cap` **from argv** (`posInt(parsed.iter …)`). There is **no `readFileSync` of any counter, no persistence** — `iter` is entirely agent-supplied. `pharn-loop.md:143` confirms the agent owns the increment ("`iter++`, then re-read the stop").
- So the `iter >= cap` **compare** is deterministic/tested (floor), but the _runtime_ claim "no infinite loop" holds only if the agent supplies a **truthful, monotonically-incremented** `--iter`. An agent passing `--iter 1` every call gets `CONTINUE` forever (while verify stays `INCOMPLETE`) → unbounded loop.
- This is exactly `LIMITS.md §1d`'s class: _"invoking and obeying the checker is advisory orchestration, not a floor primitive."_
- `pharn-ship.md:228-231` labels its analogous ≤1 retry bound **"structural/advisory"** — `pharn-loop.md:205` does not. That inconsistency is the P0 honesty defect this increment fixes.

## Proposed replacement text (GATE-1 reviews the wording; build matches surrounding wrap + markdownlint)

Replace the single bullet at `pharn-loop.md:205-206`:

> - **"`/pharn-loop` performs AT MOST N floor-gated retries; no infinite loop"** → **FLOOR compare, ADVISORY bound (§1d).** The `iter >= cap → STOP_CAP` / `CONTINUE`-only-`iter < cap` **decision** is **FLOOR** (`check-loop.mjs`, integer threshold, tested — `ARCHITECTURE.md §2` primitive #3). But it bounds only a **truthful, agent-supplied `--iter`**: `check-loop.mjs` reads `iter` from argv and keeps **no** floor-side counter and **no** persistence, so **the cap bounds the decision, not the agent** — an agent that resets `--iter 1` each call is a **`LIMITS.md §1d` discipline gap** (invoking and obeying the checker is advisory orchestration), **not** a floor the checker can enforce. "No infinite loop" is therefore **conditional/advisory** — framed exactly as `pharn-ship.md`'s ≤1 bound is ("structural/advisory").

Scope discipline (one axis, P3/P7): the sibling bullet at `pharn-loop.md:202-204` is **not** touched — it describes the checker's _decision function_ (retryable-only / terminal-immediate given inputs), which is genuinely floor; only the _behavioral_ "no infinite loop" claim overstates.

## Contracts satisfied

- None. No `pharn-contracts` schema is involved — this is a guarantee-audit label correction in a command's prose.

## Evals to write (P1)

- None / N/A. `pharn-loop.md` is a command (no `role:` frontmatter), not a Capability — P1's eval requirement applies to Capabilities, not to orchestration commands. The floor ignores `.claude/commands/`. No code, no eval fixture, no contract changes.

## Guarantee audit (P0)

- "The `iter >= cap → STOP_CAP` / `CONTINUE`-only-`iter < cap` **decision** is deterministic and tested" → **floor: enum/threshold** (`ARCHITECTURE.md §2` primitive #3). Unchanged — still true, still floor.
- "`/pharn-loop` performs AT MOST N retries / **no infinite loop** (as actually run)" → **advisory** (`LIMITS §1d`): `--iter` is agent-supplied argv with no floor-side counter/persistence; the bound-on-the-agent is advisory orchestration, not a floor primitive. **This is the relabel** — the edit _removes_ an overstated guarantee and replaces it with the honest FLOOR-compare / ADVISORY-bound split. It adds **no** new guarantee.
- Backstop unchanged (already stated in `pharn-loop.md`): a forged/uncooperative loop still cannot fake a green stop — `/pharn-verify` + `/pharn-regress` recompute their verdicts each pass and the fix #7 writes-scope re-gates every rebuild; only the _termination_ claim is being made honest.

## Trust audit (P2)

- No untrusted artifact is ingested. The edit changes trusted command prose (`trust: trusted`); it does not alter `check-loop.mjs`'s input signature (still `{verify-report.json, regression-report.json, iter, cap}`) or any taint path. No new ingestion, no new egress. N/A beyond this.

## Determinism audit (P5)

- No branch is added or changed. The edit is documentation-only; no membership test or fallback chain is affected. N/A.

## Open questions (HALT)

- None unresolved from live state. The exact wording is proposed above for GATE-1 approval; scope (one bullet, one file, one axis) is fixed.
