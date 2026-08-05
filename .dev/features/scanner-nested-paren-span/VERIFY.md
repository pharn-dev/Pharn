# VERIFY — scanner-nested-paren-span

- verdict source: `pharn/floor/check-verify.mjs` — exit **0**
- machine report: `.dev/features/scanner-nested-paren-span/verify-report.json`

## FLOOR layer — the gates that OWN the verdict

| gate           | exit |
| -------------- | ---- |
| `test`         | 0    |
| `validate`     | 0    |
| `lint`         | 0    |
| `format:check` | 0    |
| `lint:md`      | 0    |

`failing_gates`: none. The set is exactly the repo's `npm run check` aggregate, so the verdict tracks
the full style surface as well as the suite (L9 — cited, not restated).

**No `structural:*` gate.** This increment ships **no** committed eval pair — it changes three existing
floor checkers and adds no `role:`-bearing capability — so by the discovery convention there is no
`structural:<expected>` gate to run. Matches `/pharn-dev-regress`, which likewise found zero outside eval
pairs. Stated rather than left as a silent absence (P7).

**VERIFIED: floor gates PASS.**

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.

**No verifiers registered — floor gates only.** Step 2 is a no-op; no advisory finding was produced,
and none could have flipped the verdict above even if it had been (fix #3 — `check-verify.mjs`'s only
input is the gate→exit-code map; it cannot receive a finding).

## What the feature's own gates actually covered

The feature-specific correctness signal here is the three scanners' `*.test.*` suites collected by
`npm test` — **814 tests, 0 failures**, up 13 from the pre-build baseline. Those 13 are the increment's
own evidence and split into three classes:

- **nested-paren detection** (11 tests) — each observed **FAILING before** the fix was applied and
  passing after: one per affected sink pattern across all three scanners, plus an interpolation variant
  each.
- **false-positive guards** (6 tests) — must stay `found:false`, and did so **both** before and after
  (they assert behavior the fix must not break): the no-semicolon `[^;]*?` over-span case, and the
  nesting-depth > 1 documented true-negative.
- **inside-a-nested-call guard** (1 test, injection) — pins the property that ruled out the
  disjoint-branch span variant.

## Honest residual (P0/P7)

**Verified = the named gates passed.** This is **NOT** a guarantee of correctness beyond what those
gates check — a defect no test, eval, rule, or lint covers is invisible to this verdict, and the
verifier layer that might have noticed it is advisory and, today, empty. Verifier concerns are advisory
help, not assurance.

Two limits specific to this increment, worth the human's attention at the ship gate:

- The scanners' **one-level nesting** bound is real and deliberate. Depth > 1 remains a miss; that is
  asserted as a documented true-negative, not fixed.
- The **span choice was settled by measurement mid-build**, not by the plan: the plan's prescribed span
  broke two pre-existing canonical tests, and the replacement was selected at a human gate. `PLAN.md`'s
  `## The change, precisely` section still shows the superseded regex — the built code and its headers
  are authoritative.
