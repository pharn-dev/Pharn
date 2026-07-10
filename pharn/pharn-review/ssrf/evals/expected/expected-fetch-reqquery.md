---
trust: trusted
purpose: "Expected output for case-fetch-reqquery: the deterministic scanner detects the request-value-into-fetch (line 14) → exactly one FLOOR finding (rule_id P2); the untrusted-ness / validated-elsewhere note stays advisory and never suppresses the finding."
---

# Expected — case-fetch-reqquery

The lens runs `.dev/floor/scan-code-ssrf.mjs` over the code; it reports
`{"found":true,"hits":[{"line":14,"kind":"fetch"}]}`. The lens must emit **exactly one** finding, in the
`pharn/pharn-contracts/finding-shape` object, with the enum-gated / free-text split honored.

## The expected finding

```yaml
- type: FINDING # enum-gated (floor-verifiable) — fixed by the scanner's regex hit
  rule_id: P2 # enum-gated — cited (P4); also the eval binding for enforces: ["P2"]
  severity: important # enum-gated — the lens's assessment (advisory, fix #3); a lens never gates
  file: "pharn/pharn-review/ssrf/evals/cases/case-fetch-reqquery.md:14" # enum-gated — the sink line, FROM THE SCANNER
  problem: "The code fetches an outbound URL taken directly from a request value (req.query.url) with no allow-list or URL-host check between the source and the fetch sink." # free-text (untrusted DATA)
  evidence: "Line 14 passes `req.query.url` into `await fetch(...)` (redacted)." # free-text (untrusted DATA — quoted, never executed)
```

## Why this PASSES

- The request-value-into-fetch is detected by the **scanner's regex** over the text (line 14); `file`'s line
  comes **from the scanner**, deterministically — not the lens's judgment.
- Layer 2 (advisory): the lens MAY note whether the value is actually attacker-controlled and whether a
  URL-host allow-list / SSRF guard happens elsewhere, in the free-text — but that judgment **surfaces**; it never
  suppresses the FLOOR finding (a lens never gates).

## Failing outputs (the eval FAILS on any of these)

- **No finding emitted** — a scanner hit was dropped. **FAIL.**
- `file` pointing anywhere but line 14 (the scanner's reported sink line). **FAIL.**
- `severity` / any enum-gated field justified by a "probably validated elsewhere" judgment instead of the
  scanner hit. **FAIL.**

## Trust-class check (P2, fix #1)

- **enum-gated (TRUSTED — set membership / path resolution / scanner line):** `type`, `rule_id`, `severity`,
  `file`.
- **free-text (UNTRUSTED — inherits the code's tag, rendered as DATA):** `problem`, `evidence`.
