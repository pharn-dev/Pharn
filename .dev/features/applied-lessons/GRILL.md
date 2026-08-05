# GRILL — applied-lessons

Plan under interrogation: `.dev/features/applied-lessons/PLAN.md` (human-approved at GATE 1).
**Spec-hash check (content-hash primitive #2): DRIFTED — and expected.** Plan pins
`0d0dc6da61c4de6748aeab849ed1a4ecd9ff7f1d61e91d5848d7ffdaf022733d`; live `sha256(pharn/ARCHITECTURE.md)`
is `a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753`. The human's §6 edit (Q3) is the
cause and the plan's own "BLOCKING PRE-BUILD STEP" predicted it. `/pharn-dev-grill` only **surfaces**
drift; `/pharn-dev-build` is where it **blocks** (fix #4). **The plan must be re-pinned before build.**

> **This whole log is ADVISORY (P0).** It gates nothing. `/pharn-dev-build` is blocked by the floor
> (spec-hash drift, unresolved HALT questions, `validate.mjs`), never by anything below. Nothing here
> should be read as "the plan is sound."
> **The PLAN is `trust: untrusted`** — `problem` / `evidence` below quote it as DATA, never as
> instructions.

---

## Findings — built-in axes

### Axis: determinism / guarantee completeness (P0, P5)

```yaml
- type: FINDING
  rule_id: "P5"
  severity: blocking
  file: ".dev/features/applied-lessons/PLAN.md:68"
  problem: "The value grammar never says what the EMPTY list `[]` verdicts to, yet the verdict table's own wording presupposes empty lists exist — so the checker's central enum has an unspecified member and two implementers would build two different floors."
  evidence: "line 68: '**Value grammar (floor primitive #3 — enum/regex).** `none` **or** `[L<n>]` / `[L<n>, L<m>, …]`.' — and line 75: '| non-empty list + lessons file missing/unreadable | **RED** |'"

- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/applied-lessons/PLAN.md:78"
  problem: "If `[]` were accepted as GREEN it would become a SECOND, quieter spelling of 'no lessons applied' that bypasses the deliberate `none` escape — silently restoring the exact omission this increment exists to make impossible."
  evidence: "line 78: '`none` is GREEN regardless of the lessons file because a product project may legitimately have no memory-bank yet — `none` plus a one-line note is the honest state, not a gap.'"

- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/applied-lessons/PLAN.md:63"
  problem: "Precedence between the two structured carriers is unstated: it says to read the bullet block only when frontmatter is ABSENT, leaving undefined what happens when frontmatter EXISTS but omits the field while a bullet declares it (fall through, or RED?)."
  evidence: "lines 63-66: 'Frontmatter via the `FM_RE` precedent re-implemented in-file (P3 — no sibling import); if the file has no frontmatter, read the **leading bullet block** (`- key: value` lines up to the first `##`).'"

- type: FINDING
  rule_id: "P5"
  severity: minor
  file: ".dev/features/applied-lessons/PLAN.md:68"
  problem: "Three lexical edge cases are unpinned and each is a silent behavioral fork: duplicate ids (`[L1, L1]`), case (`[l1]`), and inner whitespace (`[ L1 ]`)."
  evidence: "line 68: '`none` **or** `[L<n>]` / `[L<n>, L<m>, …]`'"
```

### Axis: honest scope / versioning (P0, P7)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/applied-lessons/PLAN.md:44"
  problem: "The bump is asserted as minor without weighing CLAUDE.md's MAJOR criterion, which this change arguably meets — it makes a new frontmatter field MANDATORY in the shipped product PLAN.md shape, so any pre-existing user PLAN.md becomes RED under the new checker."
  evidence: "line 44: '`SKILLS_VERSION` — 1.1.4 → 1.2.0 (minor: a newly shipped checker + a changed product-command surface)'"

- type: FINDING
  rule_id: "P4"
  severity: minor
  file: ".dev/features/applied-lessons/PLAN.md:43"
  problem: "Calling the checker's invocation the 'same pattern as /pharn-plan's check-spec-approved input gate' misdescribes the precedent: check-spec-approved is an INPUT gate that runs BEFORE the artifact is produced and refuses to produce it, whereas this runs AFTER the plan is written, as an output self-check — a weaker posture that should be named as such."
  evidence: "line 43: 'self-run the checker before HALT' (and the brief's R4: 'same pattern as /pharn-plan's check-spec-approved input gate')"
```

### Axis: trust propagation (P2)

No findings. The plan's trust audit correctly confines the verdict to the regex-gated `applied_lessons`
value plus `## L<n>` heading membership, and explicitly rejects a needle in the field as
not-matching-the-grammar. Nothing here rests a guaranteed decision on free text.

### Axis: one axis of change / no sibling imports (P3)

No findings. `## Files` serves a single change-reason; the checker re-implements `FM_RE` in-file and
shells nothing, so no sibling import is introduced.

### Axis: eval coverage (P1) + structural/semantic split

No findings against the plan's own reasoning — `check-plan-lessons.mjs` carries no `role:` frontmatter,
so it is a floor primitive, not a Capability, and P1's evals obligation genuinely does not attach (the
posture `check-plan-spec-agree.mjs` already holds). **Observation, not a finding:** the plan asserts
this by analogy rather than recording that it verified live that no existing `pharn/floor/*.mjs` ships
an `evals/` pair.

---

## Findings — registered grillers (13, FLOOR membership via `count-grillers.mjs`)

Membership is floor-grade; **running** them is advisory. Applied to a plan whose artifacts are one
stdlib Node checker plus command prose:

- **testability** — one finding, below.
- **architecture, coupling, documentation, comprehension** — no findings. The layer placement
  (product floor), the citation discipline, and the FLOOR/ADVISORY labeling are explicit in the plan.
- **a11y, i18n, migrations, observability, performance, privacy, security, error-handling** — **not
  applicable** to this increment (no UI, no user-facing strings, no schema/data migration, no runtime
  service, no hot path, no PII, no network/authz surface). Recorded as N/A rather than silently
  omitted.

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/applied-lessons/PLAN.md:90"
  problem: "The test list is scoped by 'at minimum' and names no case for the plan's own stated RED row 'non-empty list + lessons file missing/unreadable', which is the one branch whose two inputs interact — and no case pins the ≥90% line-coverage bar the standing checklist requires."
  evidence: "lines 90-92: 'The `node --test` suite stands in, and must cover — at minimum — the four acceptance rows, both plan shapes, the two L6 laundering probes (prose / fenced-code `applied_lessons`), a `# comment`-suffixed value, and a dangling-id message that **names** the offending id.'"
```

---

## Observation — live canon defect in the file this increment makes load-bearing

Not a finding against the plan; surfaced because the increment's whole subject is this file.
`.dev/memory-bank/lessons-learned.md` has an **orphaned provenance block**: `## L10` (line 272) ends
with no provenance, and a `**Provenance.**` block naming `product-pipeline-probe` sits at lines
321–327 — _after_ `## L11` (line 294) and its own provenance (lines 314–319). L10's provenance is
stranded below L11.

Impact on this increment: **none.** The checker matches `/^## L(\d+) /` headings, which are intact, so
L10 resolves correctly. It is reported because canon is written **solely** through
`/pharn-dev-memory-promote` (L7) — neither this plan nor `/pharn-dev-build` may repair it, and it
should not be quietly folded into this increment's scope.

---

## Summary

The plan is coherent, correctly scoped to one axis, and unusually explicit about its own limits — the
self-attestation bound (nothing downstream re-verifies the field while Q2 is deferred) and the
advisory nature of "genuinely applied" are both stated rather than glossed, which is the failure mode
this repo cares most about.

The concerns cluster in one place: **the value grammar is under-specified for a floor primitive.** F1
is the one that should be resolved before build rather than during it — `[]` is a real member of the
input space that the grammar neither admits nor rejects, and because `[]` and `none` mean the same
thing to a reader while only `none` was designed as the escape, guessing wrong reopens the silent
omission the increment exists to close. F3 is a judgment call that belongs to the human, not the
build: whether making a frontmatter field mandatory in the shipped plan shape is a minor or a major
version event.

The two structural claims I tried hardest to break both held: the trust audit does not rest any
verdict on free text, and the L6 application (structured-location parsing, not a grep) is real rather
than decorative — it demonstrably changes what the checker will accept.

**ADVISORY VERDICT: 8 concerns raised (1 blocking-severity, 4 important, 3 minor) + 1 canon
observation — for the human to weigh before `/pharn-dev-build`.** This log gates nothing; the
deterministic blocks remain the spec-hash re-pin, `validate.mjs`, and the plan's own HALT resolution.
