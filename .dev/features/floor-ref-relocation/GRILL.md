# GRILL — floor-ref-relocation

Plan under interrogation: `.dev/features/floor-ref-relocation/PLAN.md` (`trust: untrusted` to this
stage). **Spec-hash check: MATCH** — the plan's `spec_content_hash`
`a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753` equals live
`sha256(pharn/ARCHITECTURE.md)` recomputed this run, so the plan was made against the current spec.
The computation is floor-grade (content-hash); here it only **surfaces** — `/pharn-dev-build`'s fix #4
gate is where drift blocks.

Griller membership (FLOOR, `pharn/floor/count-grillers.mjs`): **13 registered**. The axes that bear on
a path rewrite plus a floor check — architecture, coupling, testability, documentation, comprehension
— were applied inline; a11y / i18n / migrations / observability / performance / privacy / security
found no purchase on an increment that adds no user-facing surface, no data handling, and no schema
change, and are recorded as no-findings rather than padded.

## Findings

### Axis: trust propagation (P2) — the strongest concern

```yaml
- type: FINDING
  rule_id: "P2"
  severity: important
  file: ".dev/features/floor-ref-relocation/PLAN.md:113"
  problem: "The trust audit asserts a crafted filename 'cannot launder itself into type / rule_id / severity' but never names the mechanism that makes that true, so the claim reads as a promise rather than a reduction."
  evidence: "never into an enum-gated field, so a crafted filename cannot launder itself into `type` / `rule_id` / `severity`"
```

The claim is in fact **correct**, but for a reason stated only in a different section: the anchored
character class `[A-Za-z0-9._-]+` in the determinism audit (`PLAN.md:125`) is what structurally
excludes control characters, newlines and quotes from the captured basename. That is exactly the
composition **L14** prescribes — a shape regex must COMPOSE with the control-char guard, never
replace it. The plan cites L14 nowhere. Remedy: state in the trust audit that the character class
**is** the control-char guard for this field, and cite L14 in `applied_lessons`.

### Axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/floor-ref-relocation/PLAN.md:102"
  problem: "The audit narrows CHECK 8 by directory but never states its behavior when the TARGET has no pharn/floor at all, which is a silent fail-open."
  evidence: '"CHECK 8 makes the class un-repeatable" → **FLOOR, and NARROWED.** It catches a stale cite in the four canon dirs only.'
```

If `<TARGET>/pharn/floor/` is absent, every `existsSync` returns false, CHECK 8 emits nothing, and
`validate.mjs` reports GREEN. That is defensible (no floor present → no twin → nothing is
stale-by-relocation), but it is an **unstated** narrowing sitting under a sentence claiming the class
is un-repeatable. A plan that says "un-repeatable" while leaving a GREEN-on-absent-floor path
unnamed is the P0 shape this repo exists to catch. Remedy: name the state in the audit.

### Axis: determinism (P5)

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/floor-ref-relocation/PLAN.md:60"
  problem: "The transform rewrites inside JSON string values but the plan never requires re-parsing the rewritten .json files, so 'deterministic transform' is asserted rather than verified."
  evidence: "the existence-gated path rewrite ONLY (`.md` + `evals/expected/*.json`); no content changes."
```

A plain ASCII→ASCII substring swap cannot break JSON escaping, so the real risk is low — but "low
risk" is not a verification, and 36 `.json` files are machine-read downstream by the semantic judge.
Remedy: `JSON.parse` every rewritten `.json` after the transform and fail on any parse error. Cheap,
and it converts an assumption into a check.

```yaml
- type: FINDING
  rule_id: "P5"
  severity: minor
  file: ".dev/features/floor-ref-relocation/PLAN.md:5"
  problem: "The plan inherits the build prompt's idempotence requirement without stating how idempotence is measured, leaving it unfalsifiable."
  evidence: "rewrite the capability canon's stale `.dev/floor/<x>` cites to `pharn/floor/<x>` under an existence gate"
```

Remedy: define it operationally — run the transform a second time and require it to report **0**
changed files. That is the observation that proves the existence gate did not over-reach.

### Axis: eval coverage (P1) and the structural/semantic split

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/floor-ref-relocation/PLAN.md:82"
  problem: "The plan waives P1's evals obligation for CHECK 8 by asserting it is not a role-bearing capability, without citing the contract that scopes P1 that way."
  evidence: "obligation does not attach; its equivalent is `validate.test.mjs` (the file's existing convention for"
```

The reasoning is right — `pharn/ARCHITECTURE.md §3.1` makes a capability a file whose frontmatter
carries `role:`, and `validate.mjs` has none — and it matches how CHECKs 1–7 are already tested. It is
a **citation** gap, not a substance gap (P4: cite, don't restate). Separately and to the plan's
credit, the `eval-format.md` structural/semantic split genuinely does not apply here: every planned
assertion is a `node --test` exit-code comparison, so nothing is laundered into an LLM judge.

### Axis: one axis of change (P3) / honest scope (P7)

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/floor-ref-relocation/PLAN.md:5"
  problem: "The increment bundles a 322-reference bulk rewrite with a new floor check and never argues why that is one axis rather than two."
  evidence: "rewrite the capability canon's stale `.dev/floor/<x>` cites to `pharn/floor/<x>` under an existence gate, and add CHECK 8"
```

The bundling **is** defensible and the plan has the argument available without making it: **L20** says
a lesson whose only remedy is discipline recurs, and the second occurrence is the trigger to give it a
floor check. Shipping the rewrite alone would be occurrence two of the same discipline-only remedy
1.1.2 already tried. Remedy: one line in the plan making that argument explicitly, rather than leaving
a reader to infer it from the `applied_lessons` body line.

### Axes with no findings

- **Architecture / coupling.** CHECK 8 adds no cross-tree import; it lives inside the existing
  `validate.mjs` and reuses `EXCLUDE_SEGMENTS`, `finding()`, and `relative()` already in the file. The
  canon-scoping decision actually strengthens the dev/product boundary rather than crossing it.
- **Documentation / comprehension.** The plan names the meta-docs it touches (L1) and the human
  elected to record CHECK 8 in `CLAUDE.md`. The `### Written via Bash` subsection is an unusually
  honest treatment of the L19 escape.
- **Security.** The increment ingests no untrusted external artifact; the files CHECK 8 reads are
  trusted `pharn-owned` product files, read as bytes for a pattern match, never as instructions.

## Summary

The plan's **load-bearing decisions are sound and, unusually, were verified live rather than
asserted** — the canon/`pharn/floor` split was confirmed by reading all six `pharn/floor` refs, the
must-stay-`.dev` grep was re-run with word boundaries after its first form produced only
`import`-inside-`important` false positives, and the canon-scoping refinement was driven by a measured
false-positive count (9 in `CLAUDE.md`, 21 in `CHANGELOG.md`, 1 in `docs/lessons-index.md`) rather than
by the build prompt's original instruction. This stage independently re-tested the plan's riskiest
unstated assumption — that no eval **case** fixture carries a twinned cite, which would mean the
rewrite silently editing an untrusted fixture — and found **zero** such files, so that risk is closed
rather than merely unraised.

The concerns that remain are concentrated in one place: **the plan's prose is weaker than its own
engineering.** Three of the six findings (P2, P0, P1) are claims that are _true_ but stated without
the reduction or citation that makes them checkable — precisely the "written in the plan" shape P0
targets, appearing here in the plan that exists to fix an instance of it. The two P5 findings ask for
two cheap observations (re-parse the JSON, run the transform twice) that convert assumptions into
checks. None of the six requires re-scoping the increment.

One thing this stage cannot assess: whether the 322 rewritten references are individually correct.
That is what the HALT-2 diff is for, and no griller substitutes for a human reading it.

**ADVISORY VERDICT: 6 concerns raised (0 blocking-severity, 4 important, 2 minor) — for the human to
weigh before `/pharn-dev-build`.** Nothing here gates the build; every finding rests on this stage's
judgment. The deterministic backstops remain `/pharn-dev-build`'s spec-hash gate and
`pharn/floor/validate.mjs`.
