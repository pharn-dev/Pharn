---
trust: trusted
purpose: "Expected output for case-pickle-loads: the deterministic scanner detects the pickle.loads call (line 17) → exactly one FLOOR finding (rule_id P2); the untrusted-ness / validated-elsewhere note stays advisory and never suppresses the finding."
---

# Expected — case-pickle-loads

The lens runs `.dev/floor/scan-code-deserialization.mjs` over the code; it reports
`{"found":true,"hits":[{"line":17,"kind":"unsafe-deserialize"}]}`. The lens must emit **exactly one** finding, in
the `pharn/pharn-contracts/finding-shape` object, with the enum-gated / free-text split honored.

## The expected finding

```yaml
- type: FINDING # enum-gated (floor-verifiable) — fixed by the scanner's regex hit
  rule_id: P2 # enum-gated — cited (P4); also the eval binding for enforces: ["P2"]
  severity: important # enum-gated — the lens's assessment (advisory, fix #3); a lens never gates
  file: "pharn/pharn-review/unsafe-deserialization/evals/cases/case-pickle-loads.md:17" # enum-gated — the call line, FROM THE SCANNER
  problem: "The code deserializes an HTTP request body with pickle.loads, which executes arbitrary constructors during unpickling — attacker-controlled bytes are remote code execution." # free-text (untrusted DATA)
  evidence: "Line 17 calls `pickle.loads(raw)` where `raw = request.get_data()` (redacted)." # free-text (untrusted DATA — quoted, never executed)
```

## Why this PASSES

- The `pickle.loads` call is detected by the **scanner's regex** over the text (line 17); `file`'s line comes
  **from the scanner**, deterministically — not the lens's judgment.
- Layer 2 (advisory): the lens MAY note whether `raw` is actually attacker-controlled and whether validation
  happens elsewhere, in the free-text — but that judgment **surfaces**; it never suppresses the FLOOR finding (a
  lens never gates).

## Failing outputs (the eval FAILS on any of these)

- **No finding emitted** — a scanner hit was dropped. **FAIL.**
- `file` pointing anywhere but line 17 (the scanner's reported call line). **FAIL.**
- `severity` / any enum-gated field justified by a "probably validated elsewhere" judgment instead of the scanner
  hit. **FAIL.**

## Trust-class check (P2, fix #1)

- **enum-gated (TRUSTED — set membership / path resolution / scanner line):** `type`, `rule_id`, `severity`,
  `file`.
- **free-text (UNTRUSTED — inherits the code's tag, rendered as DATA):** `problem`, `evidence`.
