# SHIP — ship-attestation (gated `/pharn-dev-ship` roll-up)

**Where the run ended:** GATE 2 (post-review), for the human to decide **merge / fix / abandon**. No RED
floor verdict STOPped the chain. `/pharn-dev-ship` does **not** merge, push, or seal.

## Stages run, in order, with each STRUCTURAL verdict read verbatim

| stage            | artifact                 | structural verdict (FLOOR)          |
| ---------------- | ------------------------ | ----------------------------------- |
| plan (GATE 1 ✓)  | `PLAN.md`                | human-approved as written           |
| grill (advisory) | `GRILL.md`               | 4 concerns (0 blocking) — folded in |
| build            | 7 files written          | `validate.mjs` exit **0** (GREEN)   |
| regress          | `regression-report.json` | `.verdict` = **`no-regressions`**   |
| verify           | `verify-report.json`     | `.verdict` = **`PASS`**             |
| review (GATE 2)  | `REVIEW.md`              | floor GREEN; 1 important advisory   |

- **build** → `node pharn/floor/validate.mjs .` exit **0**; `npm run check` fully green (752 tests, **+26**
  new; prettier/eslint/markdownlint clean); config validate + agreement GREEN.
- **regress** → base `5c6c17b` (true fork point; auto-commits had moved HEAD mid-feature). Only feature
  files changed → outside tree byte-identical → all outside gates 0→0. `no-regressions`.
- **verify** → gates `{test, validate, lint, format:check, lint:md}` all 0; 0 verifiers (floor-only). `PASS`.

## What landed (the increment)

- `pharn/pharn-contracts/ship-record.md` — NEW contract (SoT for the record + `attestation: {by, at,
record_hash}`; FLOOR = shape + `record_hash`; ADVISORY = human-supplied `by`, comprehension; one-hasher rule).
- `pharn/floor/check-attestation.mjs` (+ `.test.mjs`) — the one new floor primitive (verify + `--compute`;
  verdict enum `attested|unattested|stale|malformed`; 98.5% coverage, 26 tests).
- `.claude/commands/pharn-ship.md` — Step 3b attestation (elicit `by` interactively, agent self-fill
  forbidden; `requireAttestation` gate with absent-vs-malformed handling; `version 0.2.0`).
- `pharn.config.json` (+`ship.requireAttestation: false`), `CHANGELOG.md`, `SKILLS_VERSION → 1.1.0`.
- Grill F1–F4 folded in (shared canonicalization, `by` regex, absent-vs-malformed config, doc'd semantics).

## Advisory artifacts (cited, not restated — P4)

- **`REVIEW.md`** — floor GREEN; **1 important** advisory finding: `.claude/commands/pharn-ship.md:319` — the
  `attested` branch renders the **full** `PHARN ✓ reviewed · attested by <by>`, self-issuing the base seal,
  contradicting its own line 321, the locked Q1 decision (clause-only), and the command's GATE-2 stance.
  **Recommended fix: render `· attested by <by>` only.** Plus 1 minor (coverage edge). See `REVIEW.md`.
- **`GRILL.md`** — 4 advisory concerns, all folded into the build.

## GATE 2 resolution (human decision)

The human chose **FIX**. Applied: `.claude/commands/pharn-ship.md` `attested` branch now renders the
**clause `· attested by <by>` only** (never the `PHARN ✓ reviewed` base seal) — consistent with the
`unattested` branch, the summary, the locked Q1 decision, and the command's GATE-2 stance. Re-verified after
the fix: `npm run check` GREEN, `check-verify` `.verdict` = **`PASS`**. (The REVIEW.md finding above is the
as-found record; this section records the resolution.)

## Honest close (P0)

Chain ran; the named floor verdicts are as shown, and the human approved the intent at GATE 1 — this is
**NOT** a judgment that the increment is good or wise; that is the human's call at the post-review gate.
`/pharn-dev-ship` added no new floor primitive (every verdict belongs to a sub-stage); the one new floor
primitive in the increment itself is `check-attestation.mjs`.
