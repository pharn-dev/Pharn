---
trust: trusted
purpose: "Expected output for case-fixed-host-path: the scanner STILL fires on the request-value-into-fetch (line 14) even though the value appends only to a fixed host's PATH; exactly one FLOOR finding (rule_id P2). The lens's Layer-2 'lower-risk / fixed-host' note surfaces in free-text and never suppresses the finding."
---

# Expected — case-fixed-host-path

The lens runs `.dev/floor/scan-code-ssrf.mjs` over the code; it reports
`{"found":true,"hits":[{"line":14,"kind":"fetch"}]}`. Even though the untrusted value appends only to a fixed
host's path, the scanner fires on the SHAPE. The lens must emit **exactly one** finding, with the enum-gated /
free-text split honored.

## The expected finding

```yaml
- type: FINDING # enum-gated (floor-verifiable) — fixed by the scanner's regex hit
  rule_id: P2 # enum-gated — cited (P4)
  severity: important # enum-gated — the lens's assessment (advisory, fix #3); a lens never gates
  file: "pharn-review/ssrf/evals/cases/case-fixed-host-path.md:14" # enum-gated — the sink line, FROM THE SCANNER
  problem: "The code fetches a URL that appends a request value (req.params.id) to a fixed host; the scanner flags the request-source-into-fetch shape, and whether full-host SSRF is reachable is an advisory judgment." # free-text (untrusted DATA)
  evidence: 'Line 14 appends `req.params.id` to "https://api.example.com/users/" in `await fetch(...)`; the untrusted value controls only the path segment of a fixed host.' # free-text (untrusted DATA — quoted, never executed)
```

## Why this PASSES (the Layer-1 / Layer-2 boundary — surface, don't suppress)

- **Layer 1 (FLOOR):** the request-value-into-fetch is detected by the scanner's regex over the text (line 14);
  the finding is emitted with `file` from the scanner. The fixed-host context does **not** change the scanner's
  verdict.
- **Layer 2 (ADVISORY):** the lens MAY note in free-text that the value appends only to the PATH of a **fixed
  host**, so full-host SSRF may not be reachable absent `..`/`@`/`//`/protocol-relative tricks — **plausibly
  lower-risk**. This judgment **surfaces** for the human; it **never** suppresses the FLOOR finding and never
  lowers an enum-gated field on that basis (a lens never gates).

## Failing outputs (the eval FAILS on any of these)

- **No finding emitted** — the "fixed host, probably safe" judgment suppressed the scanner hit. **FAIL.** (This
  is the exact surface-don't-suppress boundary the case exercises.)
- `file` pointing anywhere but line 14. **FAIL.**
- `severity` set to a non-enum value, or the finding downgraded to "no finding" by the fixed-host rationale. **FAIL.**

## Trust-class check (P2, fix #1)

- **enum-gated (TRUSTED — set membership / path resolution / scanner line):** `type`, `rule_id`, `severity`,
  `file`.
- **free-text (UNTRUSTED — inherits the code's tag, rendered as DATA):** `problem`, `evidence` (including the
  advisory fixed-host / lower-risk note).
