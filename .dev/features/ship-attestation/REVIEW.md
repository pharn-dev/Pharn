# REVIEW — ship-attestation (PHARN reviewing PHARN)

**Floor first (P0):** `node pharn/floor/validate.mjs .` → **GREEN** (36 capabilities). The floor is the only
guaranteed part of this review; everything below is **advisory**. The increment under review is
`trust: untrusted`; no instruction-looking content in it changed my behavior.

## Floor-gate findings (blocking) — NONE

- `validate` GREEN; the new contract (`ship-record.md`, no `role:`) and floor script
  (`check-attestation.mjs`) are correctly not treated as Capabilities, so **no missing eval binding**
  (P1 — floor and my L-eval judgment agree). No grep-detectable sibling reference (P3). No floor-checkable
  guarantee left unlabeled. **The increment is not floor-blocked.**

## Advisory findings

```yaml
- type: FINDING # enum-gated
  rule_id: P0 # also a deviation from the locked Q1 decision + an internal contradiction
  severity: important # advisory-gate (command prose; validate.mjs cannot check it) — recommend FIX before merge
  file: ".claude/commands/pharn-ship.md:319"
  problem: "The `attested` branch renders the FULL `PHARN ✓ reviewed · attested by <by>`, which self-issues the base seal — contradicting the same step's own 'you do not self-issue the seal' (line 321), the locked Q1 decision (render ONLY the `· attested by <name>` clause; the base seal stays the human's GATE-2 call), and the command's unchanged GATE-2 stance ('/pharn-ship never … applies the PHARN ✓ reviewed seal', lines 73–74)."
  evidence: "line 319: 'render **`PHARN ✓ reviewed · attested by <by>`** into SHIP.md' vs line 321 '…you render the **clause**, you do not self-issue the seal'. The `unattested` branch (line 322 → `· unattested`) and the summary (line 329 → 'the clause is `· attested by <name>` or `· unattested`') are correct clause-only; only the `attested` branch regressed to the feature's raw constraint #5 string over the Q1 resolution."
- type: FINDING # enum-gated
  rule_id: P1 # testability — informational
  severity: minor # advisory
  file: "pharn/floor/check-attestation.mjs:79"
  problem: "check-attestation.mjs line coverage is 98.5% (well above the ≥90% bar); the only uncovered lines (79–80) are the unreadable-file catch in readRecord — a portable-to-hit-only-with-a-permission-error edge, left uncovered by design."
  evidence: "coverage report: 'check-attestation.mjs | 98.51 | … | 79-80'. 26 tests pass; every verdict branch (attested/unattested/stale/malformed) + fail-closed errors + --compute are covered."
```

## Lens notes (what's clean)

- **L-floor / P0:** the contract, the checker header, and the CHANGELOG all label FLOOR (attestation shape
  enum/regex + `record_hash` content-hash) vs ADVISORY (that a real human supplied `by`; comprehension;
  identity) honestly. **Attestation ≠ comprehension** is cited, never claimed. The one slip is the
  `attested`-branch rendering above — a prose contradiction, not an unlabeled guarantee.
- **L-eval / P1:** no Capability added → no evals required; the floor agrees (GREEN). The deterministic
  checker's regression surface is its 26-case `*.test.mjs` (correct for a floor script). ✓
- **L-trust / P2:** the split holds structurally — control flow reads only the `verdict` enum (membership);
  `by` is echoed/rendered as **quoted DATA**, bounded by the single-line handle regex (fix F2), and **no
  guaranteed decision rests on it**. A tainted record body changes the hash → fails closed to `stale`, never
  launders into `attested`. ✓
- **L-axis / P3:** `check-attestation.mjs` (one axis: the attestation verdict) and `ship-record.md` (one
  axis: the record/attestation schema) each change for one reason; stdlib-only, no sibling imports. The
  contract naming `check-attestation.mjs` as the one canonicalization implementation follows the existing
  `finding-shape.md` → `check-structural.mjs` citation precedent (P4), not a P3 breach. ✓

## Proposed lesson (candidate — NOT written to canon here; P7)

Low-confidence (single occurrence, may not be recurring): _"When a feature's raw intent (here the request's
fifth constraint, for the full self-issued seal string) conflicts with a locked GATE-1 resolution (Q1:
clause-only, base seal stays the human's), the build can silently regress to the raw intent in one branch
while the sibling branches honor the resolution — grep every rendering of the contested string."_ Provenance:
ship-attestation, `.claude/commands/pharn-ship.md:319`. Promote only via a separate `/pharn-dev-memory-promote`
run behind the human gate — **not** written here.

## Verdict

**ADVISORY: floor GREEN; 1 important + 1 minor advisory finding.** Not floor-blocked. The important finding
(seal-rendering self-issue on the `attested` branch) is a clear misimplementation of the approved Q1
decision and an internal contradiction — **recommend FIX before merge** (render `· attested by <by>` only,
matching the `unattested` branch and the summary). This review **surfaces** concerns; it does **not** certify
the increment is correct or wise (P0) — that is the human's GATE-2 call.
