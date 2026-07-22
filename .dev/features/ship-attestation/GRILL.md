# GRILL — ship-attestation (interrogation of PLAN.md)

**Plan:** `.dev/features/ship-attestation/PLAN.md` · **Spec-hash check:** MATCH
(`sha256(pharn/ARCHITECTURE.md)` == plan pin `11cd9ad5…d1d969`; no drift — surfaced, `/pharn-dev-build`
enforces). · **Griller membership (FLOOR):** 13 registered; secret-scan `scan-plan-secrets.mjs` → clean;
`scan-plan-{pii,migrations,observability,i18n}` → none. · **Nature: ADVISORY — this gates nothing.**

The plan is unusually well-rationalized (explicit guarantee audit, "attestation ≠ comprehension" called
out, every decision carries a WHY). The findings below are **refinements to fold into `/pharn-dev-build`**,
not blockers — the highest-value one (canonicalization) is a real correctness trap, not a style note.

## Findings (finding-shape; enum-gated / free-text split honored; all ADVISORY)

```yaml
- type: FINDING # enum-gated (TRUSTED — my own assertion)
  rule_id: P0 # also comprehension debt (P7): a non-obvious mechanism whose exact spec is not pinned
  severity: important # advisory assignment (fix #3) — grill gates nothing
  file: ".dev/features/ship-attestation/PLAN.md:38"
  problem: "record_hash's 'canonical serialization' is under-specified; the emitter (command prose) and verifier (check-attestation.mjs) MUST share ONE deterministic canonicalization or every valid attestation spuriously reads `stale`."
  evidence: "'recomputes record_hash over the canonical serialization of the record with the attestation key removed' — 'canonical' (key ordering, separators, unicode/number formatting) is deferred to build; the command 'computes record_hash' (line 49) by unstated means. If the two sides differ by one byte, hash never matches."
- type: FINDING
  rule_id: P2 # trust — the residual injection surface of the rendered clause
  severity: important # advisory (fix #3)
  file: ".dev/features/ship-attestation/PLAN.md:37"
  problem: "`by`'s only shape check is 'non-empty string'; without a single-line, bounded-charset handle regex, an injected multi-line/markup `by` value widens the LIMITS §2 residual in the rendered '· attested by <by>' clause and in ship-record.json."
  evidence: "'shape-checks any attestation block — by non-empty string' (line 37) + 'render the · attested by <name> … clause into SHIP.md' (line 49). `by` is untrusted human input rendered into a human/LLM-read artifact; 'non-empty' does not bound newlines or markup."
- type: FINDING
  rule_id: P5 # determinism — an ambiguous default that can silently disable the intended gate
  severity: important # advisory (fix #3)
  file: ".dev/features/ship-attestation/PLAN.md:47"
  problem: "Defaulting requireAttestation to false conflates ABSENT (intended autonomous default) with PRESENT-BUT-MALFORMED: a typo'd `ship` block (user INTENDED true) silently reads false → ship proceeds unattested, disabling the gate the user asked for."
  evidence: "'read ship.requireAttestation from pharn.config.json (default false on absent/non-true)'. Absent → false is correct (loop autonomy); a malformed/unrecognized ship block silently → false is a footgun that hides a config error."
- type: FINDING
  rule_id: P7 # documentation of a new public surface (advisory; likely covered)
  severity: minor # advisory (fix #3)
  file: ".dev/features/ship-attestation/PLAN.md:47"
  problem: "The new PUBLIC config key `ship.requireAttestation` (its default, semantics, and that true triggers a halt-and-ask) needs to be documented where a user looks; no docs/ dir exists, so command prose + CHANGELOG must carry it."
  evidence: "'add top-level ship: { requireAttestation: false }' — a user-facing config key. Plan updates CHANGELOG and the command prose, which should suffice, but confirm the key's semantics are stated, not just its default value."
```

## Prose summary

- **Canonicalization is the one to take seriously (F1).** "Content-hash" is only a guarantee if emitter and
  verifier hash _identical bytes_. Recommendation for build: pin the canonicalization in the **contract**
  (`ship-record.md`) as the SoT, and have the command compute `record_hash` via the **same code** the
  checker uses (e.g. a `check-attestation.mjs --compute` mode, or a shared writer) rather than an ad-hoc
  node one-liner — so the two can never desync. This is also comprehension debt: pin the WHY/HOW so the
  next maintainer can't guess-and-break it. **Test** the canonicalization explicitly (nested objects, key
  order, non-ASCII) toward the ≥90% target.
- **`by` regex (F2).** Tighten `by` to a single-line, bounded handle (e.g. length-capped, no control chars)
  in both the contract and the checker's shape gate. Keeps the rendered clause and the record from becoming
  a multi-line injection vector — bounds (not zeroes) the LIMITS §2 residual, consistent with the plan's own
  trust audit.
- **Absent vs malformed config (F3).** Keep absent → false (the loop-autonomy default), but treat a
  _present-but-malformed_ `ship` block as a surfaced condition (warn / ask), not a silent false — else a
  typo disables the very gate the user opted into. A deterministic membership test can distinguish "key
  absent" from "key present, wrong type."
- **Docs (F4, minor).** Ensure the command prose states `requireAttestation`'s semantics (not just the
  default), since there is no `docs/` surface.
- **What's already right (no findings):** layer placement (contract in `pharn-contracts` bottom, checker in
  product floor — P3); "no Capability → no evals" reasoning (P1, sound); the ARCHITECTURE §6 `ship-report`
  vs `ship-record` naming divergence is **already surfaced** by the plan as a human-only Open Question (not
  re-raised); the floor/advisory split (P0) is explicit and honest; scanner-clean on secrets/PII (P2).

## Verdict

**ADVISORY VERDICT: 4 concerns raised (0 blocking-severity, 3 important, 1 minor) — for the human to weigh
before `/pharn-dev-build`.** No constitution violation; nothing here blocks the build. F1 (canonicalization)
is a real correctness trap worth folding into the build; F2/F3 are honest hardening; F4 is likely already
covered. This grill-log **surfaces** concerns — it does **not** certify the plan is sound (P0).
