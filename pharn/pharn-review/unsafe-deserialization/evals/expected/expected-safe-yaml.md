---
trust: trusted
purpose: "Expected output for case-safe-yaml: the scanner is clean (yaml.safe_load + JSON.parse are safe) → the lens emits ZERO findings and does not manufacture one. Proves the SafeLoader discriminator and the JSON.parse-is-not-a-sink honesty (no false positive)."
---

# Expected — case-safe-yaml (true-negative)

The lens runs `pharn/floor/scan-code-deserialization.mjs` over the code; it reports
`{"found":false,"hits":[]}`. The lens must emit **zero** findings — an empty finding list (`[]`).

## Why this is CLEAN

- `yaml.safe_load(...)` constructs only standard scalars/containers — no arbitrary object construction — so the
  `unsafe-yaml-load` pattern (`yaml.load` **unless** `SafeLoader`) does not fire. `yaml.safe_load` is never
  matched by `yaml.load(`.
- `json.loads(...)` (Python) and `JSON.parse(...)` (JS) cannot instantiate arbitrary objects or execute code —
  they are **deliberately not** floor sinks (flagging them would be a false-positive flood and would over-claim).
- Therefore the scanner is clean and the lens emits nothing. A clean scan is **not** a proof the code is
  deserialization-safe (aliased sinks, multi-line yaml config, and a downstream unsafe merge of parsed data all
  evade the fixed line-local set) — but on THIS input there is no dangerous call to detect.

## Advisory note (surfaced, never a finding)

If the parsed `meta` were later merged into an object via `__proto__`, that would be a prototype-pollution risk —
judgment the lens MAY surface for the human. It is **not** a dangerous **call**, so it is **not** a floor finding
and must **not** be emitted as one here.

## Failing outputs (the eval FAILS on any of these)

- **Any finding emitted** — the lens manufactured a finding on safe primitives (a false positive). **FAIL.**
- Flagging `yaml.safe_load`, `json.loads`, or `JSON.parse` as a dangerous call. **FAIL** (over-claim).
