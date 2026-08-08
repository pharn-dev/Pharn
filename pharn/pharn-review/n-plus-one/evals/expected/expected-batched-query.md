---
trust: trusted
purpose: "Expected output for case-batched-query — a true-negative. The single `db.findMany` runs AFTER the loop (the loop only collects ids), so no query-verb call is lexically inside a loop body: the scanner reports found:false and the lens emits NO finding. The empty finding array is the pass; a clean scan is NOT proof the code has no N+1."
---

# Expected — batched-query (a true-negative)

The lens must emit **no** finding — the machine-readable output is the empty array `[]`.

## Why the lens emits nothing

- `pharn/floor/scan-code-n-plus-one.mjs` reports `found:false`: the `for..of` body calls only
  `ids.push(...)` (not a query verb), and the one `db.findMany(...)` runs **after** the loop closes, at
  the top level of the function — not lexically inside any loop body. This is the batched fix, the
  correct shape.
- The lens does **not** manufacture a finding over a clean scan (mirrors `off-by-one`).

## What a clean scan does and does NOT mean (Layer-1 bound, P0)

- **Means:** no query-in-loop SHAPE the v0.1.0 scanner covers is present.
- **Does NOT mean:** the code is free of all N+1s. The scanner is narrow — a braceless statement loop, a
  `.filter`/`.reduce` iteration, a helper-wrapped query, or a cross-file fan-out would evade it. A clean
  scan is not proof of good query performance (see the lens's Guarantee audit).

## Structural (eval-format.md — cited, not restated, P4)

`expected-batched-query.json` (`skill_kind: llm`): **`structural[]` (1)** — `finding_count == 0`.
**`semantic[]` (1)** — the query runs after the loop, so no finding, advisory.
