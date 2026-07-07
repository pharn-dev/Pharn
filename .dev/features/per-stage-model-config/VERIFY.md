# VERIFY — per-stage-model-config

- **Verdict source:** `.dev/floor/check-verify.mjs` (FLOOR layer — `PASS iff every gate exit 0`). Machine report: `verify-report.json`.
- **Feature ships no committed eval-actual pair** (floor-tooling increment — no `role:` capability), so there is **no `structural:*` gate**; the checker itself is covered by `.dev/floor/check-config.test.mjs`, run inside the whole-repo `test` gate.

## FLOOR layer — deterministic gates (owns the verdict)

| gate         | exit | result |
| ------------ | ---- | ------ |
| test         | 0    | PASS   |
| validate     | 0    | PASS   |
| lint         | 0    | PASS   |
| format:check | 0    | PASS   |
| lint:md      | 0    | PASS   |

These are the repo's existing checks (the full `npm run check` aggregate + `validate.mjs`), whole-repo — verify PASS requires the whole repo green with the increment present. The `test` gate ran the hermetic suite including the 15 new `check-config` tests and the **live real-repo `agreement` gate** (config↔frontmatter consistency, asserted GREEN inside `npm test`).

## ADVISORY layer — verifiers

**No verifiers registered — floor gates only** (`count-verifiers.mjs` → `{"registered":0}`). Step 2 is a no-op; the verdict is the floor gates alone. No verifier is authored speculatively (P7).

## Verdict

**VERIFIED: floor gates PASS** (`check-verify.mjs` exit 0 — every named gate exit 0).

Honest residual (P0/P7): _verified = the named gates passed; this is NOT a guarantee of correctness beyond what those gates check — and specifically it does NOT verify the increment's advisory claim that a stage RUNS UNDER its configured model/effort at runtime (no deterministic gate can observe runtime model selection). Verifier concerns would be advisory help, not assurance; today there are none._
