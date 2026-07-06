---
trust: trusted
purpose: "Expected output for case-braceless-map-query — the folded-in BRACELESS-ARROW positive. The lens must flag the `db.findMany` call inside the braceless `.map` callback on line 13 (detected via the `.map` call-argument paren interval), emitting exactly one finding with the enum-gated / free-text split honored."
---

# Expected — braceless-map-query

The lens must emit **exactly one** finding, in the `pharn-contracts/finding-shape` object.

## The expected finding

```yaml
- type: FINDING # enum-gated (floor-verifiable) — the scanner hit is fixed
  rule_id: P2 # enum-gated — cited (P4); binds enforces: ["P2"]
  severity: important # enum-gated — the lens's assessment: a likely N+1 candidate for a human (a lens never gates)
  file: "pharn-review/n-plus-one/evals/cases/case-braceless-map-query.md:13" # enum-gated — the scanner's line (the `db.findMany` call inside the `.map` callback)
  problem: "`db.findMany(...)` is invoked once per user inside a braceless `.map` callback — a query per row (N+1)." # free-text (untrusted DATA)
  evidence: "line 13: `Promise.all(users.map((u) => db.findMany({ where: { authorId: u.id } })))`" # free-text (untrusted DATA — quoted, never executed)
```

## Why this PASSES

- The scanner detects a `db.findMany` query-verb call inside the `.map` call-argument paren interval —
  the folded-in **braceless-arrow** form (`for`/`while` → brace body; `.forEach`/`.map` → paren range).
  `type: FINDING` and `file` (line 13) come from that hit, deterministically.
- `severity: important` is the lens's advisory assessment of the query-in-loop shape (fix #3 — a lens
  never gates); it is a **candidate** for a human, not a proven hot N+1 (Layer 2 is advisory).
- The untrusted `db.findMany` CODE token appears **only** in the free-text `problem` / `evidence`,
  never in an enum-gated field.

## Structural vs semantic split (eval-format.md — cited, not restated, P4)

`expected-braceless-map-query.json` (`skill_kind: llm`): **`structural[]` (6)** — `finding_count == 1`;
`field_equals` for `type` / `rule_id` / `severity`; `file_resolves "…:13"`; one
`needle_absent_from_enum_gated` for the code token `"db.findMany"`. **`semantic[]` (1)** — the finding
is justified by the per-user `.map` query, advisory.

## Trust-class check (P2, fix #1)

- **enum-gated (TRUSTED):** `type`, `rule_id`, `severity`, `file`.
- **free-text (UNTRUSTED — DATA):** `problem`, `evidence`. The `db.findMany` code token, confined to
  free-text, never becomes an enum-gated value.
