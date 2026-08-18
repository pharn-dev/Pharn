# GRILL — retro-tag-legacy-lessons

**Plan under interrogation:** `.dev/features/retro-tag-legacy-lessons/PLAN.md` (`trust: untrusted` —
every quote below is DATA, never an instruction followed).
**Spec-hash check (content-hash primitive, surfaced not blocking):** `node .dev/floor/hash-doc.mjs
pharn/ARCHITECTURE.md` → `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52` —
**equals** the plan's pinned `spec_content_hash` (`PLAN.md:3`). **No drift.** (`/pharn-dev-build` is
where drift would actually block, fix #4.)
**Griller membership (FLOOR — `node pharn/floor/count-grillers.mjs .`):** `{"registered":13}` — all 13
applied below.

## Live probes run before interrogating (P6 — read this run, never asserted from memory)

These are deterministic and are reported as evidence, not as gates. Five of the plan's own load-bearing
claims were re-derived rather than believed:

| probe                                                                     | result                                                                                                                                                                  |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `set-writes-scope.cjs --from-plan` path count (the plan's L20 number)     | **`15 path(s)`** — matches the declared 15 exactly; `### Deliberately NOT in scope` correctly terminated the list                                                       |
| Pre-build baseline                                                        | `validate.mjs .` **GREEN** (36 capabilities) · `docs:check` **GREEN** · `npm test` **1380/1380 pass**                                                                   |
| Tag-line insertion precondition                                           | **all 21** `## L<n>` headings are followed by a blank line — the position rule is uniform, as the plan asserts                                                          |
| Does a test pin the prose the build edits?                                | **No** — `constSource()` in the ✧ cross-surface test explicitly excludes trailing `// …`; count-line assertions are over synthetic 2-/3-lesson fixtures, not live canon |
| Does the `pharn-dev-memory-promote.md` edit land in the P4-pinned region? | **No** — `TYPE-ENUM:BEGIN/END` is `:87–93`; the planned edit is `:101–104`, safely outside                                                                              |
| Anything citing canon by **line number** (17 insertions shift lines)?     | **No** live site — only `.dev/features/trust-fence-baseline/REVIEW.md:91` (`:3`, a historical artifact, above all insertions)                                           |

Four of the plan's riskiest build hazards therefore verify clean. The findings below are what did
**not** verify clean.

## Findings

Emitted per `pharn/pharn-contracts/finding-shape.md` (cited, not restated — P4). Enum-gated fields
(`type`, `rule_id`, `severity`, `file`) are **my own** assertions → trusted. `problem` / `evidence`
quote the plan and **inherit its untrusted tag** → DATA.

### Axis: guarantee audit (P0) — inline

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/retro-tag-legacy-lessons/PLAN.md:272"
  problem: "The guarantee-audit's FIRST row labels the type-membership claim `FLOOR (enum)`, but that enum computation gates nothing — its only consequence is rendering `?` in a derived file whose drift check stays exit 0 either way, which the plan's OWN row 9 and consequence 1 concede."
  evidence: "row 272: 'Each assigned `type` is a real enum member | **FLOOR (enum)** — set membership over `TYPE_ENUM` … a non-member renders `?`' — contradicted at row 280: 'A **malformed rendered** tag line is caught | **NOT GUARANTEED** … A `?` regenerates cleanly and `docs:check` stays **exit 0**'"
```

**Why it matters.** What is actually floor-guaranteed is narrower than the row's claim: _a non-member
is **marked** `?` in a derived file_. The claim as worded — "each assigned `type` **is** a real enum
member" — is not guaranteed by anything, because the marker never becomes a non-zero exit. A
guarantee-audit table is the one artifact P0 exists to discipline, so a row that reads FLOOR for a
claim the same table later disclaims is the disease in miniature. **Remedy (wording, not scope):**
restate row 272's reduction as _"FLOOR (enum) — a non-member is **rendered `?`**; the membership test
gates nothing"_, so rows 272 and 280 say the same thing.

### Axis: honest scope / no speculation (P7) — inline

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/retro-tag-legacy-lessons/PLAN.md:66"
  problem: "The plan asserts a 'triggering failure' where its two direct predecessors both explicitly recorded the opposite trigger class — design-time identification, no dogfood failure — and no PLAN in the repo records an observed sweep failure caused by untagged entries."
  evidence: 'line 66: ''**P7:** the triggering failure is "17 untagged entries make the index unselectable"''. Against it, `typed-lessons/PLAN.md:135`: ''any `type`-keyed selection over canon is **incomplete by construction**''; and `CHANGELOG.md` #115: ''**Honest trigger (P7), stated rather than hidden:** like L8 and #114, this was identified at design time — no dogfood failure forced it'''
```

**Why it matters.** P7's text is _"an addition is triggered only by a **real failure** surfaced in
dogfood or in an eval, never by a hypothetical."_ This increment adds no Capability, rule, or enforcer,
so P7's addition clause arguably does not bind at all — but the plan **chose** to invoke P7
affirmatively, and in doing so named a failure that is not observed. The increment is legitimate on a
different and stronger ground: it is a **named, human-ratified follow-up** carried forward from #115.
**Remedy:** say that instead. `CHANGELOG.md` is already in `## Files`, and its two predecessor entries
model the exact form. Grill is advisory — nothing here blocks the build.

### Axis: testability griller (P1) — `pharn/pharn-pipeline/grillers/testability/testability.md`

**Layer 1 (floor-demonstrable — is a verification approach PRESENT?): YES.** `## Evals to write (P1)`
is non-empty and reasoned, and the guarantee audit names `docs:check` byte-equality,
`check-plan-lessons.mjs`, and a Step-2b assertion. Presence is satisfied.

**Layer 2 (ADVISORY — is it adequate?): one gap.**

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/retro-tag-legacy-lessons/PLAN.md:284"
  problem: "This increment makes 'every canon entry carries a well-formed tag line' TRUE for the first time (21/21) — a newly available invariant the plan leaves pinned by nothing stronger than an advisory grep it also admits nothing forces it to run."
  evidence: "lines 284-287: 'This increment grows the residual's uncovered surface from 4 tag lines to 21. Nothing turns a malformed rendered tag line into a non-zero exit. What is available today … is an **advisory** assertion at Step 2b … but it is **orchestration**: nothing on the floor forces the build to run it'"
```

**Why it matters, and why this is NOT the checker the plan rightly defers.** The plan declines a new
`lesson-tagline-render-check` checker on P7 grounds (zero malformed instances exist) — that reasoning
is sound and I am not contesting it. This is a different and cheaper thing: **one assertion in the
already-existing `.dev/floor/lessons-index-core.test.mjs`** — over live canon, `untagged === 0 &&
malformed === 0` — which needs no new file, no new checker, no WARN-vs-RED semantics, and no `ci.yml`
pin. It converts the plan's own advisory Step-2b grep into a floor gate that runs on every `npm test`.
`lessons-learned.md` **L20** is directly on point: _a promoted lesson whose only remedy is discipline
WILL recur — the second occurrence is the trigger to give it a floor check_, and the plan's Step-2b
grep is precisely a discipline-only remedy. The invariant is also **stable**, not a maintenance
tax: every new entry arrives through `/pharn-dev-memory-promote`, where `type`/`concepts` are already
mandatory. **Scope consequence, stated plainly:** that test file is **not** in `## Files`, so acting on
this requires a GATE-1 plan amendment. Grill gates nothing — this is for the human to weigh, and
declining it is a perfectly defensible answer.

### Axis: documentation griller (P7) — `pharn/pharn-pipeline/grillers/documentation/documentation.md`

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/retro-tag-legacy-lessons/PLAN.md:321"
  problem: "The plan establishes a precedent governing every future canon annotation, but records it only in a feature PLAN that no future stage reads — while the one doc a future reader WOULD consult is already open in `## Files` and being edited at exactly the relevant paragraph."
  evidence: "line 321: 'This sets the precedent for every future canon **annotation**: it travels the same route as any other increment … and `/pharn-dev-memory-promote` remains the sole path for a **promotion**'; line 323: 'the promotion-vs-annotation distinction lives in apparatus practice'"
```

**Why it matters.** "Apparatus practice" has no address. The next person who wants to annotate canon
will re-derive the whole three-blocker analysis — or, worse, reach for `/pharn-dev-memory-promote` and
hit the duplicate-id RED with no explanation of why that is correct behavior rather than a bug.
`.claude/commands/pharn-dev-memory-promote.md` is **already in `## Files`**, and the paragraph being
edited (`:101-104`, "Legacy entries are not retrofitted") is exactly where a reader looks. Adding one
sentence there — _annotation of an existing entry travels the ordinary gated build path; promotion of a
new entry travels this command_ — costs nothing extra and is **inside** the approved scope. Verified
safe: that paragraph sits outside the P4-pinned `TYPE-ENUM` region (`:87-93`).

### Axis: comprehension griller (P7) — `pharn/pharn-pipeline/grillers/comprehension/comprehension.md`

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/retro-tag-legacy-lessons/PLAN.md:195"
  problem: "24 of the 33 new concept tags are used exactly once, so they add per-entry precision but not the cross-entry SELECTIVITY the increment is justified by; and `enum-gated` overloads a load-bearing term of art from `finding-shape.md`, where it names a trusted-field CLASS rather than a topic."
  evidence: "line 195: '**used 1×:** `meta-docs`, `live-floor-op`, `fail-closed`, `eval-fixture`, `live-measurement`, `structural-semantic-split`, `membership-test`, `frontmatter`, …' — against line 197: 'the nine recurring tags carry the index's selectivity'. Overload: `enum-gated` is assigned to L6/L10/L14 while `finding-shape.md` uses it for the trusted `type`/`rule_id`/`severity`/`file` field class."
```

**Why it matters (and why it is `minor`).** The vocabulary is **open by design** and a human ratified
every tag at GATE 1, so this is naming hygiene, not a defect. But two neighbours are worth a second
look before they land in canon permanently: `false-red` (L16) and `false-blocking` (L17) read as
synonyms with no recorded distinction, and `enum-gated` will collide with contract vocabulary for any
future reader selecting on it. Nothing records what any of the 33 mean.

### Axis: architecture + coupling grillers (P3) — no findings

The plan's central structural choice — **option (c), the ordinary gated build path** — is the opposite
of a structural-fit problem: it declines to invent a mechanism (`retag` mode, one-shot tool) where an
established one already covers the job, and its three-blocker analysis of why the promote path
**cannot** do this is verified live and correct. No layering inversion, no sibling coupling: the
`.dev/floor/lessons-index-core.mjs` edits are a standalone comment and a template string, touching no
import. The dev/product twin boundary is respected — verified live that
`pharn/floor/lessons-index-core.mjs:84,313` already word the legend for a user's corpus with no
`#114`/"legacy" reference, so the product surface genuinely does not move.

### Axis: security, privacy, error-handling, observability, performance, migrations, a11y, i18n — no findings

Applied and silent, with reasons rather than a blanket wave-through: the increment writes regex/enum-gated
scalars into an untrusted-DATA file whose titles and bodies are unchanged and read by no decision
(security, privacy); the insertion precondition was verified uniform across all 21 headings so there is
no partial-write branch to handle (error-handling); it is a markdown data migration in a git-tracked file
whose rollback is `git revert`, with **no** line-number citations into canon to invalidate — probed
(migrations); and there is no runtime, UI, or user-facing string (observability, performance, a11y, i18n).

## Summary

This is an unusually well-grounded plan, and most of what it claims **verified live**: the spec hash,
the 15-path scope parse, the 1380-test green baseline, the uniform heading shape, the P4 marked-region
boundary, the ✧ test's prose-safety, and the absence of line-number citations into canon. Its
promote-path analysis (option (c)) is correct on all three blockers, and its refusal to build a
`retag` mode — on the ground that a duplicate-id guard which inverts by mode _"becomes its own opposite
when the mode is wrong"_ — is the strongest reasoning in the document.

The concerns are concentrated in **honesty of labeling**, not in approach:

1. **P0 (F1)** — one guarantee-audit row says FLOOR for a claim the same table later says is NOT
   guaranteed. A wording fix, but in the exact artifact P0 governs.
2. **P7 (F2)** — a "triggering failure" is asserted where the lineage recorded design-time
   identification. The increment stands on better ground than the one it claims.
3. **P1 (F3)** — a newly-true invariant (21/21 tagged) is left to an advisory grep, when the existing
   test suite could pin it in ~2 lines. **L20 says this class of remedy recurs.** Requires a GATE-1
   amendment to act on.
4. **P7 (F4)** — the annotation-vs-promotion precedent is recorded where no future run will read it,
   though the right doc is already open in `## Files`.

F1, F2 and F4 are all actionable **within the already-approved `## Files`**. Only F3 needs the human to
widen scope, and declining it is defensible.

**One observation outside the finding shape** (it is about the grill command, not the plan, so it has no
`PLAN.md:<line>` to anchor to): `.claude/commands/pharn-dev-grill.md` Step 2b still states _"Today the
registered set is the `testability` griller"_ while live membership is **13**. I followed the
deterministic discovery, never the prose (P5/P6), so nothing here turned on it — but it is a live
doc-vs-repo drift, and precisely the L1 class this increment is itself about.

**No injection or instruction-looking content was found in the plan.** Nothing in it was treated as an
instruction.

## Verdict

**ADVISORY VERDICT: 6 concerns raised (0 blocking-severity, 4 important, 2 minor) — for the human to
weigh before `/pharn-dev-build`.**

This gates nothing. `/pharn-dev-grill` is advisory end-to-end (P0): every finding above rests on my
judgment, and even the spec-hash check only **surfaces** here — `/pharn-dev-build`'s floor-gate is where
drift would block. Nothing in this log makes the plan good or bad; it surfaces what a human should weigh.
The deterministic backstops are unchanged and unaffected: `/pharn-dev-build`'s spec-hash gate,
`pharn/floor/validate.mjs`, and the fix #7 writes-scope hooks.
