---
trust: trusted
purpose: "Expected output for case-array-find-in-loop — a true-negative and the VERB-PRECISION bound. An `Array.prototype.find` call sits inside the loop, but `.find` is a deliberately-excluded verb (it collides with Array/collection methods), so the scanner reports found:false and the lens emits NO finding. This proves the scanner flags a query verb in a loop, not any call in a loop."
---

# Expected — array-find-in-loop (a true-negative; the verb-precision bound)

The lens must emit **no** finding — the machine-readable output is the empty array `[]`.

## Why the lens emits nothing

- `cache.find(...)` runs inside the `for..of` loop, but `.find` is **not** in the query-verb set
  (`query`, `execute`, `findOne`, `findMany`, `findFirst`, `findUnique`, `findAll`, `aggregate`). It is
  deliberately excluded because it collides with `Array` / `Set` / `Map` methods (`arr.find`,
  `set.delete`, `map.get`) and would manufacture false positives.
- So `.dev/floor/scan-code-n-plus-one.mjs` reports `found:false` and the lens emits nothing.

## The bound this proves (P0)

The scanner is **not** a naive "any method call inside a loop" match. It flags only an unambiguous
DB/ORM query verb in a loop. Excluding the ambiguous verbs is the honest v0.1.0 trade: fewer
false positives, at the cost of missing an in-loop `.find`/`.get`/`.select`/`.delete` that really is a
DB call (a documented false-negative, a future increment — P7).

## Structural (eval-format.md — cited, not restated, P4)

`expected-array-find-in-loop.json` (`skill_kind: llm`): **`structural[]` (1)** — `finding_count == 0`.
**`semantic[]` (1)** — the in-loop call is a non-query `.find`, so no finding, advisory.
