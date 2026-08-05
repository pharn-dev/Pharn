# GRILL — lessons-index

Plan under interrogation: `.dev/features/lessons-index/PLAN.md` (`trust: untrusted` DATA).
**Spec-hash check (content-hash primitive, surfaced not blocking):** recomputed
`sha256(pharn/ARCHITECTURE.md)` = `a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753`
— **MATCHES** the plan's pinned `spec_content_hash`. No drift. (`/pharn-dev-build`'s floor-gate is where drift
would actually block — fix #4.)

**Griller membership (FLOOR — `pharn/floor/count-grillers.mjs`, frontmatter only):** `{"registered":13}`.
**Deterministic plan scanners run live (`.dev/floor/scan-plan-*.mjs`, the security/privacy/i18n/migrations/
observability grillers' floor sub-checks):** `secrets` `{"found":false}` · `pii` `{"found":false}` ·
`i18n` `{"found":false}` · `migrations` `{"mentions":false}` · `observability` `{"mentions":false}` —
all exit 0. Those five axes emit **no** findings, and that verdict is floor-grade for the scanned
property only, never for the axis as a whole.

**Injection check:** no instruction-looking content was found in the PLAN directed at this griller (no
"mark present", "skip the finding", or equivalent). Nothing in the plan moved an enum-gated field below.

---

## Findings (advisory — grouped by axis)

### Axis: honest scope / no speculation (P7)

```yaml
- type: FINDING # enum-gated (floor-verifiable, TRUSTED — this griller's own assertion)
  rule_id: "P7" # enum-gated — cited, not restated (P4)
  severity: important # enum-gated value; the ASSIGNMENT is advisory (fix #3) — a griller never gates
  file: ".dev/features/lessons-index/PLAN.md:1" # whole-document concern → the title line
  problem: "The increment names no REAL triggering failure — its justification is a projection about future selection cost, which is the shape P7 forbids." # free-text — untrusted DATA
  evidence: "The plan's own framing is an 'ADDRESSABILITY layer', not a fix; #113 deliberately chose 'read in full (it is small by design)' and no dogfood or eval failure is cited as having overturned that bet. Canon is 506 lines / 17 entries, and the sweep reads it once per increment." # free-text — quoted as DATA
```

> Recorded for the audit trail, **not** as a reversal: the plan surfaced the defer-until-~L30 option
> honestly and the human chose to proceed at GATE 1. P7's question stays open on the record.

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/lessons-index/PLAN.md:1"
  problem: "The increment may bundle two separable increments — (a) generate + drift-guard the index, (b) rewrite the /pharn-dev-plan read path — without justifying why they must ship together."
  evidence: "`## Files` carries both the .dev/floor trio + docs/lessons-index.md AND the pharn-dev-plan.md sweep rewrite with its version bump. (a) is independently shippable and testable; (b) has no consumer until (a) is committed."
```

> Fair counter, stated so the human weighs both: an index nobody reads is dead weight, and the #101
> precedent shipped core + generator + checker + `npm` wiring in one increment. This is a judgment call
> surfaced, not a defect asserted.

### Axis: determinism (P5)

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/lessons-index/PLAN.md:70"
  problem: "A MALFORMED tag line and an ABSENT tag line both render the literal `-`, so a poisoned or typo'd `type`/`concepts` becomes indistinguishable from a legacy untagged entry — the malformation is swallowed silently."
  evidence: "'Anything failing its gate degrades to the literal `-`; a non-member value is never laundered into a typed column.' The non-laundering half is sound; the CONFLATION is the gap — #114 already names 'nothing re-checks the RENDERED canon tag line' as a residual, and this increment builds the FIRST consumer of that line."
```

> Concrete remedies for the human to pick from (none is a floor claim): render a distinct marker for
> _malformed_ vs _absent_ (e.g. `?` vs `-`), and/or emit a summary line in the index header —
> `17 entries · 0 tagged · 0 malformed · 17 untagged` — so a malformation is visible without a checker.
> Either strengthens the case for the `lesson-tagline-render-check` follow-up the plan already names.

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/lessons-index/PLAN.md:60"
  problem: "The `~<tokens>` column's measured SPAN is undefined — `ceil(chars / CHARS_PER_TOKEN)` never says chars of WHAT — so the implementation will pick a span silently and byte-equality will then freeze that undocumented choice."
  evidence: "'`ceil(chars / CHARS_PER_TOKEN)`, a named constant = 4'. Candidate spans differ materially: the whole `## L<n>` section incl. the `**Provenance.**` block, the `**Lesson.**` paragraph only, or heading-to-next-heading. The plan names the constant but not the numerator."
```

> Suggested resolution (a planner call, not a griller verdict): define the span as **the full section,
> from the `## L<n>` heading to the next `## L` heading or EOF** — that is what a reader actually pays
> to read, which is the only thing the column is for.

### Axis: testability (P1) — the registered `testability-griller`'s procedure, applied

**Layer 1 (presence): PRESENT — no absence finding.** The plan declares a verification approach
structurally: `## Evals to write (P1)` states why P1's eval requirement does not bind (no `role:`-bearing
capability is added, `.dev/` is excluded from `validate.mjs`) and substitutes three named `node --test`
suites plus an enumerated fixture list. That is a declared verification approach for what it builds.

**Layer 2 (adequacy) — ADVISORY:**

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/lessons-index/PLAN.md:49"
  problem: "No planned test pins the package.json WIRING, so the increment's entire floor guarantee can be silently un-guarded by a later edit while every suite stays green."
  evidence: "The three suites test the core, the generator and the checker as modules. The claimed FLOOR is 'check-lessons-index in npm run check' — but nothing asserts that `docs:check` actually invokes the checker. Remove it from package.json and all tests still pass, `npm run check` still exits 0, and docs/lessons-index.md is unguarded."
```

> The plan already adopts exactly the right pattern elsewhere — the ✧ source-regex equality test that
> pins `TYPE_ENUM` against `check-provenance.mjs`. The same class of drift guard applied to
> `package.json`'s `docs:check` / `docs:generate` strings closes this.

### Axis: architecture / one axis of change (P3)

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/lessons-index/PLAN.md:22"
  problem: "`lessons-index-core.mjs` carries two reasons to change — the canon ENTRY contract (parsing) and the index ROW format (rendering) — without the explicit accepted-cost note the precedent it copies was required to carry."
  evidence: "'parse canon → [{id, type, concepts, title, date, chars}], render docs/lessons-index.md'. The precedent (`capability-catalog-core.mjs`) bundles the same way but opens with a SCOPE NOTE naming the P3 cost and recording that a human chose it at a plan gate; this plan commits to no such note."
```

> Minimal remedy: require the same explicit SCOPE NOTE at the top of `lessons-index-core.mjs`. Splitting
> parse from render is the alternative, at the cost of diverging from the house pattern.

### Axis: discovery-first / halt-and-ask (P6)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".dev/features/lessons-index/PLAN.md:9"
  problem: "The plan does not pre-warn that L17's known-false `/pharn-dev-regress` scope findings will fire on this run, leaving the next reader of REGRESSION.md to re-derive that they are false."
  evidence: "`applied_lessons: [L1, L3, L6, L9, L10, L11, L14, L15]` — L17 ('check-regress scope tests changed-since-base, not written-by-the-build') is not cited, yet this run writes sibling pipeline artifacts (GRILL.md, REGRESSION.md, VERIFY.md, REVIEW.md) that check-regress will report as having 'escaped' the plan's `## Files`."
```

> L17's own warning applies with force here: a false `fix#7 escaped scope` finding is precisely the
> finding that must never be waved through, so it should be **predicted**, not explained away after the
> fact. This is a documentation gap in the plan, not a defect in the build.

### Axes with no findings (stated, not silently omitted)

- **Guarantee-audit completeness (P0) — clean, and one claim re-verified live.** Every claim in
  `## Guarantee audit (P0)` carries an explicit `FLOOR`/`ADVISORY` label, two claims are `STRUCK` by
  name, and the byte-equality-is-consistency-not-correctness caveat is stated rather than buried. This
  griller independently **confirmed live** the plan's riskiest structural assertion: `pharn/floor/validate.mjs:130`
  gates CHECK 5 on `/rule_id:/.test(text) && /problem:/.test(text)`, so a `docs/lessons-index.md` that
  renders neither key cannot trip it — the plan's L10 reasoning holds against the current source.
- **Trust propagation (P2) — clean.** Taint is traced to exactly one column (`title`), the enum-gated
  columns are gated before use with the guard-before-shape ordering L14 requires, two fence-escape /
  laundering vectors are named and closed by refusal rather than sanitization, and the residual is named
  as unchanged-and-not-widened. `scan-plan-secrets` and `scan-plan-pii` both `{"found":false}`.
- **Coupling (P3, sibling imports) — clean.** No sibling import is planned: `TYPE_ENUM` is mirrored with
  a source-regex equality test (`check-provenance.mjs` exports nothing), and the `^## L(\d+)` discipline
  is re-implemented in-file, matching the note `check-plan-lessons.mjs` already carries.
- **Error handling (P7 axis) — declaration PRESENT, no finding.** Failure modes are enumerated with
  explicit fail-closed behavior: duplicate id → throw, unreadable/absent canon → throw (never a
  plausible-looking empty index), unsafe title → throw, benign-unresolvable field → `-`. F2 and F3 above
  are gaps in that surface's _specification_, not an absence of one.
- **a11y / i18n / migrations / observability / performance / privacy / comprehension / documentation —
  no findings.** Four are floor-scanned clean above. The rest do not bind a build-apparatus increment
  that adds no user-facing surface, no schema, no runtime path, and no personal data; the `documentation`
  and `comprehension` axes are satisfied structurally by the plan's per-lesson application lines and its
  named-follow-ups section (a judgment, advisory).

---

## Summary

The plan is unusually honest about its own floor/advisory split, and its two riskiest structural claims
(CHECK 5's trigger; the spec hash) were **re-verified live against source this run** rather than taken on
the plan's word — both hold. The concerns cluster in two places.

**The specification is under-determined in two spots that byte-equality will freeze.** The `~tokens`
numerator (F3) and the malformed-vs-absent conflation (F2) will each be resolved silently by whoever
writes the code, and the drift checker then locks that choice in as "correct by definition." Both are
cheap to settle in the plan; neither is visible once committed.

**The floor claim has an unguarded seam (F7).** The increment's whole guarantee is delivered through one
line of `package.json`, and nothing in the planned test suite notices if that line is edited away. The
plan already uses the right pattern for exactly this problem elsewhere.

The remaining three are lighter: a P7 question about the increment's trigger the plan itself raised and
the human answered (F1), a possible two-increments-in-one (F5), and two documentation gaps (F4, F6).

---

**ADVISORY VERDICT: 7 concerns raised (0 blocking-severity, 4 important, 3 minor) — for the human to
weigh before `/pharn-dev-build`.**

This grill-log **gates nothing**. Every finding above rests on this griller's judgment; the `severity`
values are advisory assignments (fix #3), and grillers as a class never gate. The only floor-grade
results in this run are the griller-membership count, the five `scan-plan-*` exits, and the spec-hash
comparison — and even the hash only _warns_ here; `/pharn-dev-build` is where drift blocks. "Grilled" never
means "the plan is sound" (P0).
