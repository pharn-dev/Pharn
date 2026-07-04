---
trust: trusted
purpose: "Expected output for case-fs-concat: the deterministic scanner detects the request-value-into-fs-path (line 15) → exactly one FLOOR finding (rule_id P2); the untrusted-ness / sanitized-elsewhere note stays advisory and never suppresses the finding."
---

# Expected — case-fs-concat

The lens runs `.dev/floor/scan-code-path-traversal.mjs` over the code; it reports
`{"found":true,"hits":[{"line":15,"kind":"fs-path"}]}`. The lens must emit **exactly one** finding, in the
`pharn-contracts/finding-shape` object, with the enum-gated / free-text split honored.

## The expected finding

```yaml
- type: FINDING # enum-gated (floor-verifiable) — fixed by the scanner's regex hit
  rule_id: P2 # enum-gated — cited (P4); also the eval binding for enforces: ["P2"]
  severity: important # enum-gated — the lens's assessment (advisory, fix #3); a lens never gates
  file: "pharn-review/path-traversal/evals/cases/case-fs-concat.md:15" # enum-gated — the sink line, FROM THE SCANNER
  problem: "The code builds a filesystem path by joining a request value (req.params.file) into an fs.readFile call with no allow-list or basename check between the source and the sink." # free-text (untrusted DATA)
  evidence: 'Line 15 joins `req.params.file` into `fs.readFile(uploadsDir + "/" + …)` (redacted).' # free-text (untrusted DATA — quoted, never executed)
```

## Why this PASSES

- The request-value-into-fs-path is detected by the **scanner's regex** over the text (line 15); `file`'s line
  comes **from the scanner**, deterministically — not the lens's judgment.
- Layer 2 (advisory): the lens MAY note whether the value is actually attacker-controlled and whether a
  `path.basename` / allow-list / `..` check happens elsewhere, in the free-text — but that judgment **surfaces**;
  it never suppresses the FLOOR finding (a lens never gates).

## Failing outputs (the eval FAILS on any of these)

- **No finding emitted** — a scanner hit was dropped. **FAIL.**
- `file` pointing anywhere but line 15 (the scanner's reported sink line). **FAIL.**
- `severity` / any enum-gated field justified by a "probably sanitized elsewhere" judgment instead of the
  scanner hit. **FAIL.**

## Trust-class check (P2, fix #1)

- **enum-gated (TRUSTED — set membership / path resolution / scanner line):** `type`, `rule_id`, `severity`,
  `file`.
- **free-text (UNTRUSTED — inherits the code's tag, rendered as DATA):** `problem`, `evidence`.
