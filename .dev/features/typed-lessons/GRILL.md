# GRILL — typed-lessons

Plan under interrogation: `.dev/features/typed-lessons/PLAN.md` (approved at its own halt).
**Spec-hash check (content-hash primitive, surfaced not blocking):** recomputed
`sha256(pharn/ARCHITECTURE.md)` = `a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753`
— **matches** the plan's pinned `spec_content_hash`. No drift. (`/pharn-dev-build`'s fix #4 gate is where drift
would actually block; this only surfaces it early.)

**Griller membership (FLOOR — `pharn/floor/count-grillers.mjs`, enum/regex over `role: griller` frontmatter):**
`{"registered":13}`. Archetype of this repo is `lib` (stdlib-only markdown methodology, no framework),
so by deterministic `applies:` membership **3 do not apply** — `a11y` (`["ssr","spa"]`), `i18n`
(`["ssr","spa"]`), `migrations` (`["backend","ssr"]`) — and **10 ran**.

**Layer-1 floor scanners (the only deterministic content checks in this stage):**

```text
.dev/floor/scan-plan-secrets.mjs        → {"found":false,"hits":[]}     exit 0
.dev/floor/scan-plan-pii.mjs            → {"found":false,"hits":[]}     exit 0
.dev/floor/scan-plan-observability.mjs  → {"mentions":false,"hits":[]}  exit 0
```

The trust split below is honored per `pharn/pharn-contracts/finding-shape.md` (cited, not restated — P4):
`type` / `rule_id` / `severity` / `file` are **my own** enum-membership and path-resolution assertions
(trusted); `problem` / `evidence` quote the PLAN and **inherit its untrusted tag** — DATA for the human,
never instructions to `/pharn-dev-build`.

---

## Findings

### Axis: honest scope / no speculation (P7)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/typed-lessons/PLAN.md:75"
  problem: "The plan never states its P7 TRIGGER, and by its own admission the increment adds a field no consumer reads — the exact shape P7 exists to catch."
  evidence: "This increment adds the *address*; no consumer reads it yet. Both plan stages' lessons sweeps still read all lessons' full text."
```

The plan is admirably honest that the payoff is not delivered here — but honesty about the _absence of a
consumer_ is not the same as naming the _triggering failure_. P7 admits an addition only on a **real**
failure (dogfood or eval), never a forecast cost. The brief's stated motivation ("lessons have no
filterable address"; the mandatory sweep since #113 reads all lessons' full text) is a **cost observed at
design time**, not a failure that fired. There is a house precedent for exactly this and the plan does not
invoke it: **L8** records "Honest trigger (P7): the constraint was learned at design time and the sidecar
friction was AVOIDED, not hit". Ask the human to either (a) adopt L8's honest-trigger framing explicitly in
the plan and the CHANGELOG, or (b) name the concrete failure — e.g. that the #113 sweep now reads 17 full
lesson bodies per plan run — as the trigger. Silence on the trigger is the gap, not the increment itself.

### Axis: rules are the SoT; enforcers cite, never restate (P4) — architecture griller (P3) concurs

```yaml
- type: FINDING
  rule_id: "P4"
  severity: important
  file: ".dev/features/typed-lessons/PLAN.md:43"
  problem: "The type enum is written twice — as a literal array in check-provenance.mjs and as a literal alternation inside the recognizer regex in the command doc — with no agreement check, so the two can drift silently."
  evidence: "/^type: (process|contract|floor|scoping|tooling|eval) · concepts: \\[[a-z0-9-]+(?:, [a-z0-9-]+)*\\]$/"
```

`TYPE_ENUM` in `.dev/floor/check-provenance.mjs` is the SoT; the doc's recognizer restates it. Adding a
seventh member later updates the checker (tests catch it) and **silently leaves the doc's regex stale** —
and the doc's regex is precisely what the "upcoming lessons-index generator" is told to implement, so the
drift lands in the consumer. This repo already solved this shape twice: `check-config.mjs agreement`
(config ↔ command frontmatter, verified live GREEN this run) and `check-capability-catalog.mjs`
(committed ↔ recomputed bytes). Cheapest fixes, in ascending cost: write the doc's recognizer with the
enum **elided** (`<TYPE_ENUM member>`) so it cannot go stale; or add one test asserting the doc's literal
alternation equals `TYPE_ENUM.join("|")`. The second is a real floor reduction and costs ~6 lines.

### Axis: one axis of change per file (P3) — architecture + coupling grillers

```yaml
- type: FINDING
  rule_id: "P3"
  severity: important
  file: ".dev/features/typed-lessons/PLAN.md:56"
  problem: "The plan asserts in one clause that type/concepts share check-provenance.mjs's existing axis of change, but they belong to a different contract than the provenance fields the file was built for."
  evidence: "This increment widens the *validated candidate shape*, which is the same axis of change `check-provenance.mjs` already owns (P3: one reason to change)."
```

The existing fields (`target`, `provenance{feature,commit,source,date}`, `id`) are the floor reduction of
**`pharn/ARCHITECTURE.md §5`'s per-entry provenance contract** — that is the file's stated reason to change,
written into its own header. `type` / `concepts` are a **different contract**: an entry _taxonomy_ serving a
future index, with no basis in §5. Concretely: a change to the taxonomy (a seventh enum member, a 7th
concept slot) would edit this file for a reason that has nothing to do with provenance — two reasons to
change, which is the P3 test. The counter-argument is real and the brief states it (house pattern: enum
constants at the top of the checker file, not a shared config module), and a separate
`.dev/floor/check-lesson-tags.mjs` would mean `/pharn-dev-memory-promote` runs two checkers over one
candidate. **This is a genuine fork, and the plan closes it by assertion rather than argument.** Surfaced
for the human; the terminal fallback here is ask, not my judgment (P5).

### Axis: determinism / house consistency (P5)

```yaml
- type: FINDING
  rule_id: "P5"
  severity: minor
  file: ".dev/features/typed-lessons/PLAN.md:52"
  problem: "Duplicate list items are RED for concepts but GREEN-with-dedup for applied_lessons, so two floor checkers in one repo now treat the same input shape oppositely with no stated house rule."
  evidence: "Duplicates are RED (a duplicate tag is meaningless and would otherwise let one tag consume the 6-slot budget)."
```

`pharn/floor/check-plan-lessons.mjs` de-duplicates rather than refusing — pinned by a live test
(`check-plan-lessons.test.mjs:112`, "duplicates are de-duplicated, not an error: `[L1, L1]` → GREEN").
The plan's rationale for RED is sound in isolation (a duplicate would consume the 6-slot budget), and the
plan does flag the choice for pushback — this finding is the pushback. Either divergence is defensible;
what is not defensible is leaving it **unstated**, so a future reader infers a house rule that does not
exist. Ask the human to pick, and record the reason in `check-provenance.mjs`'s header either way.

### Axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/typed-lessons/PLAN.md:70"
  problem: "The guarantee line folds an advisory orchestration step (the command choosing to run the checker) into a FLOOR claim, omitting the two-clocks split the rest of the plan observes carefully."
  evidence: "→ **FLOOR** (enum-regex, primitive #3 — `check-provenance.mjs`, which `/pharn-dev-memory-promote` Step 3 runs before any write)."
```

The checker's **verdict** is floor. The command's **act** of invoking it at Step 3 is advisory prose —
nothing on the floor forces the run. So "no candidate reaches the Step-5 gate without a valid `type`" is
floor-_conditional-on_ an advisory step; the guarantee that actually holds unconditionally is narrower:
_"when `check-provenance.mjs` runs, a candidate with a non-member `type` cannot pass it."_ The plan states
this split correctly for the _rendered line_ (line 71-72) and for the _values_ (line 73-74) — this one
line is the inconsistency. Low severity precisely because the rest of the plan gets it right; flagged
because P0 wording is this repo's whole thesis, and L2 requires the honesty to travel into the durable
artifact (`check-provenance.mjs`'s header), not just the ephemeral plan.

### Axis: trust propagation / memory poisoning (P2) — security + privacy grillers

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".dev/features/typed-lessons/PLAN.md:52"
  problem: "The open concepts vocabulary is a new write-once-influence-forever surface: a shape-valid but semantically misleading tag passes the floor and lands in canon permanently, mitigated only by the Step-5 human read."
  evidence: "Vocabulary is **open** — shape-checked, never enum-checked."
```

`scan-plan-secrets` and `scan-plan-pii` are both clean, and the plan's laundering analysis is the best part
of it — it correctly identifies that promoting model-drafted fields into the enum-gated class is the
laundering vector, and closes it on grammar. The residual it does **not** name: shape-validity is not
truth. `concepts: [safe, approved, verified]` passes every check the plan specifies. Because these fields
land in **canon** — `THREAT-MODEL.md §2 #3`, silent and cumulative, no rollback signal — the poisoning
window is permanent, unlike a transient finding. The plan's mitigation ("advisory context selection, never
a guarantee") is correct and sufficient **in principle**, but it is stated only for `type`, not `concepts`,
and only in the plan. Per L2 (which this plan cites), that sentence must travel into
`pharn-dev-memory-promote.md`'s own trust audit.

### Axis: testability (P1) — testability griller

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/typed-lessons/PLAN.md:43"
  problem: "The tag-line grammar — the increment's load-bearing output per L6 — is specified only as prose in one command doc, with no executable artifact, so nothing detects drift between the Step-2/Step-6 template and the recognizer."
  evidence: "Recognizer (for the upcoming index generator; defined here, **not implemented** this increment — P7):"
```

**Layer 1 (presence) is satisfied** — a verification approach is unambiguously present: eleven named RED
cases, a GREEN case, the retained ★ P2 needle case, and the `check-plan-lessons` heading regression. Layer 2
(adequacy, advisory) surfaces one hole: everything tested is the **candidate**; the **grammar** is untested
because it has no implementation to test. That is defensible under P7 — but it means the single artifact the
next increment depends on is the one artifact with no regression surface. Cheapest partial close, if the
human wants it: assert in `check-provenance.test.mjs` that the doc's template line, rendered from the
`VALID` fixture's fields, matches the doc's own recognizer. Overlaps the P4 finding above; one fix can serve
both.

### Axis: documentation (P7)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/typed-lessons/PLAN.md:25"
  problem: "The CHANGELOG entry is scoped as `Added`, but making the two fields required is a breaking change to the candidate.json shape that the plan itself acknowledges elsewhere."
  evidence: "`CHANGELOG.md` — an `[Unreleased] → Added` entry, explicitly recording **no `SKILLS_VERSION` bump** and why — layer: repo-meta"
```

Q3 resolved the fields to **REQUIRED**, so any candidate written against the old shape now fails
`check-provenance.mjs`. `SKILLS_VERSION` correctly does not move (apparatus, per CLAUDE.md's discipline —
verified live against the bump-triggering set), but the CHANGELOG's contract is "**all** notable changes",
not "all shipped changes". The live `[Unreleased]` block already carries a `Changed — BREAKING` section
precedent. Migration is one line per candidate, so this is presentation, not substance — hence minor.

---

## Prose summary

The plan is unusually strong on the two things this repo cares most about, and I want to be specific rather
than complimentary: its **trust audit** correctly identifies that this increment _promotes model-drafted
values into the enum-gated class_ — the laundering vector itself — and closes it structurally (exact array
membership for `type`, guard-first shape for `concepts`) rather than by promise. Its **L14 application is
live, not decorative**: it caught that `/^[a-z0-9-]+$/.test("enum-gate\n")` is `true`, which is a real hole
a bare shape regex would have shipped. And its corpus ratification is the P7 discipline done properly —
`injection` dropped at 0 instances, `eval` added on 1 real instance, the human ratifying via the table.

The eight findings cluster into three genuine questions and five tightenings.

**The three questions the human should actually weigh:**

1. **The P7 trigger (P7 finding).** The plan admits no consumer reads the field yet but never names the
   triggering failure. L8 is the precedent for the honest framing; the plan should use it or name a
   concrete failure.
2. **Where the taxonomy lives (P3 finding).** `check-provenance.mjs` now serves two contracts — §5
   provenance and a new entry taxonomy. The brief's house-pattern argument and P3's one-axis test point
   opposite ways. The plan closes this by assertion; it deserves an argument or a split file.
3. **Enum duplication (P4 finding).** The enum is restated as a regex alternation in the doc with no
   agreement check — the exact drift shape this repo has already tooled against twice. A ~6-line test or
   an elided placeholder closes it, and the same fix partly closes the P1 testability hole.

**Five tightenings:** the one P0 line that folds advisory orchestration into a floor claim; the
duplicate-handling divergence from `check-plan-lessons.mjs`; the unnamed `concepts` poisoning residual;
the untested grammar; and the CHANGELOG's `Added`-vs-`BREAKING` framing.

**Not findings, recorded so their absence is deliberate:** architecture — layer placement is correct
(apparatus edits apparatus; the one product-surface touch is a `*.test.*` file, which CLAUDE.md's
discipline explicitly exempts, and the checker under it stays byte-unchanged). Coupling — clean seams;
the shared `VALID` fixture is a real coupling but the plan surfaces it and the human ratified it at Q3.
Comprehension — the WHY is captured to an unusual depth. Error-handling — the accumulating `reds[]`
pattern is preserved and the non-string guard is specified. Performance — a six-element `includes` over a
candidate file; no scaling axis exists. Observability — scanner `mentions:false`, but this builds a CLI
floor checker whose entire observability surface _is_ its RED stdout and exit code, which the plan
specifies; **no absence finding warranted**. Privacy/security — both scanners clean, no PII or secret
literal in the plan.

## Verdict

**ADVISORY VERDICT: 8 concerns raised (0 blocking, 3 important, 5 minor) — for the human to weigh before
`/pharn-dev-build`.**

This gates nothing. `/pharn-dev-grill` is advisory end-to-end: every finding above rests on my judgment,
including the severities. The only floor-grade facts in this run are the griller-membership count, the
three Layer-1 scanner results, the spec-hash match, and the writes-scope hook that pinned this file. None
of them says the plan is good — and no wording here should be read as "grill passed".
