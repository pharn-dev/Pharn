---
trust: trusted
purpose: "Expected output for case-fixed-url-clean: the outbound URL is built from trusted parts only (constant host + constant path), so the scanner is clean and the lens emits NO finding — without asserting the code is SSRF-free."
---

# Expected — case-fixed-url-clean

The lens runs `pharn/floor/scan-code-ssrf.mjs` over the code; it reports `{"found":false,"hits":[]}`. The lens
must emit **no** finding — the empty array `[]`.

## Why this PASSES

- The URL joins a constant `API_BASE` host with a constant `"/health"` path; **no request source** reaches the
  `axios.get` sink, so the scanner reports no hit (the SOURCE-token discriminator keeps a trusted-parts outbound
  call clean — no manufactured floor).
- The lens does **not** manufacture a finding on a normal, constant-URL outbound call.

## What must NOT happen

- **A finding emitted with no scanner hit** — manufacturing a finding on a clean constant-URL call. **FAIL.**

## The honest bound (not asserted here)

A clean scan is **not** proof the code is SSRF-free. If the URL were assembled from a request value through a
**local variable** (`const u = req.query.url; axios.get(u)`), the source token would not appear on the sink line
and the line-local scanner would miss it — that residual is the lens's advisory layer, never this floor.

## Trust-class check (P2, fix #1)

- **enum-gated (TRUSTED):** none emitted (empty finding array).
- **free-text (UNTRUSTED):** none emitted.
