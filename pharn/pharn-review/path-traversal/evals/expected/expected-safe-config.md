---
trust: trusted
purpose: "Expected output for case-safe-config: the path joins only trusted parts (__dirname + a constant), so no request source reaches the sink, the scanner is clean, and the lens emits NO finding — proving the source-token discriminator keeps trusted-parts path building clean (no false positive)."
---

# Expected — case-safe-config

The lens runs `pharn/floor/scan-code-path-traversal.mjs` over the code; it reports
`{"found":false,"hits":[]}`. The path is built from `__dirname` + a constant filename — no `req.*` source
enters it — so the scanner is clean and the lens emits **no** finding.

## Expected output

**Zero findings** — an empty finding array (`finding_count == 0`).

## Why this PASSES

- No request source reaches the filesystem sink, so the **scanner's regex** does not hit; the discriminator
  (a recognized request source in the sink's argument) is what keeps trusted-parts path building CLEAN — this
  is the honest reason the scanner is not a "manufactured floor" (unlike a would-be concat-into-path scanner,
  which would fire on `path.join(__dirname, "config.json")`).
- Layer 2 (advisory): the lens MAY note in prose that a clean scan is **not** proof the code is traversal-free
  — a request value arriving via a local variable would not appear on the sink line (the Layer 1 bound).

## Failing outputs (the eval FAILS on any of these)

- **Any finding emitted** — a false positive on safe, trusted-parts path building. **FAIL.**
- A prose claim that the clean scan **proves** the code is traversal-safe (over-claim; the disease). **FAIL.**

## Trust-class check (P2, fix #1)

No finding is emitted, so no enum-gated / free-text fields are populated. The clean-scan reasoning is advisory
prose (`semantic[]`), never a floor claim that the code is safe.
