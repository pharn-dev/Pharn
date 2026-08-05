# GRILL — scanner-nested-paren-span

Plan under interrogation: `.dev/features/scanner-nested-paren-span/PLAN.md` (`trust: untrusted` — its
claims are tested, never believed). **Spec-hash check: MATCH** — recomputed
`sha256(pharn/ARCHITECTURE.md)` = `0d0dc6da61c4de6748aeab849ed1a4ecd9ff7f1d61e91d5848d7ffdaf022733d`,
equal to the plan's pinned `spec_content_hash`. No drift. (The computation is content-hash
floor-grade; **here it only surfaces** — `/pharn-dev-build`'s fix #4 gate is where drift blocks.)

Griller roster read live: `node pharn/floor/count-grillers.mjs .` → **13 registered**.

---

## Findings

### Axis: trust / security (griller: security, enforces P2)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/scanner-nested-paren-span/PLAN.md:132"
  problem: "The plan states the comment-derived false-positive residual is 'unchanged', but the widened span measurably ENLARGES it — a prose comment that spells out a NESTED sink call now registers where it previously did not."
  evidence: "Named residual, unchanged and not hidden (`LIMITS.md §2`): the scanner reads TEXT and does not distinguish code from comments, so a comment spelling out a full sink call still registers — over-flagging only, never suppression."
```

**Substantiated, not asserted.** Probed this run against the old and new `fetch` patterns:

```text
// safe: we already allow-list before fetch(normalize(base), req.query.url) is called
   old span [^)]*?                    -> false
   new span (?:[^)(]|\([^)]*\))*?     -> TRUE
```

The **injection-immunity property is NOT broken** — a comment still cannot SUPPRESS a real hit, only
over-flag — so this is honest-scope (P7), not a P2 break. But "unchanged" is wrong, and these
scanners' whole value proposition is that their headers state their bounds truthfully. The header
sentence and the plan's trust audit should say the comment FP surface **widens** with the span.

### Axis: guarantee audit (built-in, enforces P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/scanner-nested-paren-span/PLAN.md:58"
  problem: "The plan carries the word 'linear' forward from the old header, but the new span is an alternation under a quantifier — a strictly richer construct than a negated character class — and the defensible claim is 'no EXPONENTIAL backtracking', not 'linear'."
  evidence: "**ReDoS (threat surface #4):** the two alternation branches are disjoint on their first character ... so there is no ambiguous decomposition and no catastrophic backtracking."
```

The disjointness argument is **correct and sufficient to rule out catastrophic (exponential)
backtracking** — `[^)(]` excludes `(`, the other branch requires `(`, so no input has two
decompositions. That much holds. But an unanchored lazy span still retries the trailing
TAINT/SOURCE test at each start position, which is polynomial in line length — the same class as the
old `[^)]*?`, so this is **not a regression**. The finding is about _wording_: writing "linear" into
a header that a future maintainer will trust is exactly the overstatement these headers exist to
avoid. State the property that is actually proven (unambiguous decomposition → no exponential
blowup; polynomial worst case, unchanged from the previous span).

### Axis: comprehension (griller: comprehension, enforces P7)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/scanner-nested-paren-span/PLAN.md:40"
  problem: "After the fix scan-code-injection.mjs will hold TWO different span idioms — the new nested-paren span for sql/command and the untouched `[^;]*?` for html-injection — and the plan does not require the header to explain WHY they differ, leaving a future maintainer to 'fix' the inconsistency."
  evidence: "The `html-injection` pattern (injection L74) already uses `[^;]*?` and is **left exactly as is** — it is a different sink family with a different bound and is outside this axis (P3)."
```

The decision to leave `html-injection` alone is **right** (different sink family; an assignment
target has no closing paren to bound against). The gap is that the reasoning lives only in this
plan, which ships nowhere. Someone reading the built file sees two inconsistent spans and no
recorded WHY — PHARN's founding comprehension-debt failure, in the file that is meant to model the
opposite. The header should carry one sentence pinning the asymmetry.

### Axis: honest scope / limit precision (built-in, enforces P7)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/scanner-nested-paren-span/PLAN.md:81"
  problem: "The limit is phrased as 'after TWO closed nested calls f(g(h(x)))', but the actual mechanism is that the span stalls at the first `)` it cannot consume — the honest bound is 'one level of nesting', and the call-counting phrasing will mislead."
  evidence: 'a **two-level** nested case, e.g. `db.query(f(g(h(x))) + " tail")` — a *documented true-negative* asserting the honest bound'
```

Traced concretely: from `query(`, branch 2 consumes `(g(h(x))` — `\(` then `[^)]*` = `g(h(x)` then
`\)` — leaving a bare `)` that neither branch can consume, so the span stalls. The miss is caused by
**nesting depth > 1**, not by a count of calls. The test case is correct and should stay; only the
header's wording of the limit needs to be depth-based.

### Axis: testability (griller: testability, enforces P1)

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/scanner-nested-paren-span/PLAN.md:72"
  problem: "'Written and observed FAILING before the fix' is an unverifiable ordering claim — nothing in the build or verify stage can distinguish a genuinely test-first increment from tests and fix written together."
  evidence: "Per scanner, three classes, **written and observed FAILING before the fix**:"
```

Not a defect in the plan's intent, and the plan does **not** label it a guarantee — so it is not a
P0 violation. Raised so the human knows the discipline is **advisory** and rests on the agent's
compliance, not on a floor primitive. The mitigation that IS floor-grade already exists: the
false-positive guard tests fail loudly if the span over-widens, whenever they were written.

### Axes with no findings

- **architecture / coupling (P3)** — the change is confined to three sibling floor checkers that share
  no code and reference no sibling module; the layer tree is untouched. `lens-scanner-map.json`
  bindings are unchanged. Grepped this run: no prose outside the three scanners describes the `[^)]`
  bound, so the fix creates no doc drift beyond the declared `## Files`.
- **determinism (P5)** — every branch stays a membership test; the emit path and `(line, kind)` sort
  are untouched.
- **eval coverage / structural-vs-semantic (P1, `eval-format.md`)** — the plan correctly identifies
  that P1's `evals/cases` requirement binds `role:`-bearing capabilities and that this increment adds
  none; the `node --test` suites are the right regression surface. Verified live: the three lenses'
  committed eval cases contain exactly one nested-paren line (`case-fs-concat`), already-dirty and
  firing both before and after. No eval is at risk of flipping.
- **documentation (P7)** — headers, `CHANGELOG.md`, and the `SKILLS_VERSION` patch bump are all
  declared in `## Files`.
- **performance (P7)** — see the ReDoS finding above; no scaling cliff otherwise (per-line regex over
  a single file, unchanged).
- **migrations / privacy / a11y / i18n / observability / error-handling** — not applicable: no schema,
  no PII, no UI, no user-facing strings, no logging surface, and the fail-closed error path is
  untouched.

---

## Summary

The plan is unusually well-grounded: the defect was reproduced live rather than taken on the
requester's word, the proposed regex was dry-run in both directions before being planned, the two
mandatory guard tests are the right ones, and the eval-flip risk was checked against the actual
committed cases. The `html-injection` carve-out and the refusal of `[^;]*?` are both correct calls.

The concerns are concentrated in **one place: the honesty of the headers the increment writes.**
These scanners' entire claim to being FLOOR rests on their HONEST BOUND sections being true, so three
of the five findings are about bound-statements that would ship subtly wrong — a residual described
as "unchanged" that measurably widens, a "linear" claim stronger than what is proven, and a limit
phrased by call-count rather than nesting depth. None of these change the code the plan proposes;
all three change **prose the plan is already committed to rewriting**, so they cost nothing to fold
in at build time.

The fourth (the two span idioms in one file with no recorded WHY) is the one worth the most: it is
PHARN's founding failure mode reappearing inside PHARN's own floor.

**ADVISORY VERDICT: 5 concerns raised (0 blocking-severity, 3 important, 2 minor) — for the human to
weigh before /pharn-dev-build.** This grill-log gates nothing; `/pharn-dev-build`'s floor-gates and
`pharn/floor/validate.mjs` are unaffected by it.
