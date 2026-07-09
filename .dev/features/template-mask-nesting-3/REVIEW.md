# REVIEW — template-mask-nesting-3 (PHARN reviewing PHARN)

Increment under review (`trust: untrusted`): depth-aware `maskTemplateInteriors` (Design B) across the
five `scan-code-*.mjs` scanners + their `.test.mjs` + five `pharn-review/*` lens docs, plus the
swallowed-exception `classify()` `${}`-delimiter strip.

**Standing floor verdicts (from earlier stages, presented — not recomputed here):** build floor
`GREEN`; `/pharn-dev-regress` `no-regressions`; `/pharn-dev-verify` `PASS` (test/validate/lint/format:check/lint:md/structural
all exit 0).

## Step 1 — Floor first (P0)

`node .dev/floor/validate.mjs .` → **GREEN — 36 capabilities**. The increment legitimately reached
review. (This is the only guaranteed part of this review; everything below is **advisory**.)

## The four lenses

### L-floor → P0 — GREEN (no unlabeled guarantee)

Every guarantee the increment makes reduces to a floor primitive or is labeled advisory:

- "template-STRING interiors masked at ANY nesting depth in the suppression copy" → **floor**
  (deterministic char transform, `ARCHITECTURE.md §2` primitive #3), proven by the new `.test.mjs`
  nested/depth-2 fixtures.
- "no single- OR nested-template string content can suppress a real hit" → **floor** (the transform ∧
  detection reads untouched `masked`); byte-identity of the five maskers (`md5 3911175b…`) verified.
- swallowed `classify()` strips `${}` delimiters → **floor** (regex membership), monotone-safe (only
  makes "empty" more likely — over-flag direction).
- "interpolation code is treated as code" → **advisory framing** of the existing lenient/first-use
  bound — correctly labeled in headers + lens docs, not dressed as a guarantee.

No P0 finding.

### L-eval → P1 — GREEN

The scanners are floor tools; their evals are the `*.test.mjs` suites. Every new behavior (each
scanner's nested-template launder-closed case, plus the depth-2, interpolation-code-readable companion,
and fail-open-unbalanced cases) has a fixture; the flipped `null-deref.test.mjs:116` was retargeted with
its rationale. `validate.mjs` GREEN confirms the lens `enforces↔eval` bindings are intact (none were
touched). No missing binding. No finding.

### L-trust → P2 — GREEN (this increment IS a P2 hardening)

The scanners' verdict is enum-gated (`found` / `hits.{line,kind}`); no free-text from the reviewed code
reaches it. This fix **closes** a real laundering path — attacker-controlled template-STRING text could
previously forge a suppressor via the boolean masker's nested-backtick mis-close and launder into the
enum-gated `found`/`hits`; it can no longer. The test fixtures contain instruction-looking strings
(`throw e`, `try {`, `fd.close()`, `timeout`) as DATA (scan inputs) — none altered my behavior. One
advisory residual noted below.

### L-axis → P3 — GREEN at the import level; two advisory notes

No sibling imports: each scanner is a standalone stdlib tool (only `node:` imports + self-name error
strings). The lens docs cite principles, not sibling internals. Two advisory observations below.

## Findings (floor-gate vs advisory)

**Floor-gate (blocking): none.**

**Advisory (inform; never the sole basis to block a guaranteed invariant):**

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/floor/scan-code-swallowed-exception.mjs:284"
  problem: "swallowed-exception carries two edits (the shared masker rewrite AND a classify() `${}`-delimiter strip) where the other four scanners took only the masker rewrite — defensible as one axis (both close the nested-template launder) but the classify change is scanner-specific and worth calling out."
  evidence: "if (bodyMasked.replace(/[\\s;`${}]/g, \"\") === \"\") return \"empty-catch\";"
```

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/floor/scan-code-null-deref.mjs:172"
  problem: "The masker is duplicated byte-identically across five scanners; nothing on the floor keeps the copies in sync, so a future one-copy edit silently re-drifts (the same duplication that let #78 port the buggy masker). Byte-identity (md5 3911175b…) was verified THIS build; consolidation into a shared scan-code util is correctly deferred (separate axis, P7)."
  evidence: "function maskTemplateInteriors(src) { … } — identical in all five scan-code-*.mjs"
```

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".dev/floor/scan-code-missing-timeout.mjs:65"
  problem: "Design B leaves interpolation CODE readable, so a real indicator/handler token in `${…}` (e.g. `${timeout}`, `${fd.close()}`) reads as code and can suppress — this is the existing lenient-indicator / first-use bound applied consistently to interpolation, NOT a new template-text launder (that surface stays masked). Documented honestly in the headers + lens docs; noted so the human weighs the trade the Design-B choice made."
  evidence: "interpolation CODE stays readable, so a real `${timeout}` variable reads as an indicator exactly as a bare `timeout` arg would"
```

## Proposed lesson for canon (P7 — PROPOSED here, NOT written; promote via `/pharn-dev-memory-promote`)

- **Candidate (provenance: increment `template-mask-nesting-3`, fixes the #78 residual):** _When porting
  a shared helper into more call-sites, port its ADVERSARIAL test coverage too — not just the happy
  path._ #78 ported `maskTemplateInteriors` into three more scanners and pinned only **single-backtick**
  immunity; the missing **nested-template** (`${`x`}`) fixture let the root-cause boolean-toggle bug
  survive the port. Corollary: a helper duplicated N× (no shared module) needs a byte-identity or
  consolidation guard, else the next edit re-diverges. This is a **real** recurring failure (verified
  live: launder reproduced on all five scanners at post-#78 HEAD), not hypothetical — so it clears P7.
  _Not written to canon here (scope = REVIEW.md only); a human accepts/denies it via `/pharn-dev-memory-promote`._

## Verdict

**GREEN — 0 floor-gate (blocking) findings; 3 advisory (all minor).** The increment closes the verified
nested-template suppression launder on all five scanners, preserves single-backtick immunity + the
≥3-fence residual, and updates the immunity claims honestly (single AND nested). This verdict is
**advisory**; the standing **floor** guarantees are build-GREEN / regress-clean / verify-PASS. "Review
produced a GREEN REVIEW.md" does NOT mean "the increment is good/wise" — that is the human's call at the
post-review gate (P0).
