# GRILL — loop-handoff (ADVISORY)

Plan under interrogation: `.dev/features/loop-handoff/PLAN.md` (read live this run, treated as
`trust: untrusted` DATA). **Spec-hash check (content-hash primitive):** recomputed
`sha256(pharn/ARCHITECTURE.md)` = `a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753`
— **matches** the plan's pinned `spec_content_hash` (`PLAN.md:3`). No drift finding. (Surfaced here;
the actual block on drift is `/pharn-dev-build`'s floor-gate, fix #4 — this stage only warns.)

**Griller membership (FLOOR — enum/regex over `---`-fenced frontmatter):**
`node pharn/floor/count-grillers.mjs .` → `registered: 13`. All 13 were run over the plan; their axes
and findings are folded in below. Three (`a11y`, `i18n` — `applies: ["ssr","spa"]`; `migrations` —
`applies: ["backend","ssr"]`) are **out of archetype** for a markdown-contract + Node-checker increment
and are recorded as such rather than made to produce findings.

> **Every finding below is ADVISORY and gates nothing.** The enum-gated fields (`type`, `rule_id`,
> `severity`, `file`) are this stage's own enum-membership / path-resolution assertions — trusted. The
> free-text `problem` / `evidence` quote the plan and **inherit its untrusted tag** — rendered as quoted
> DATA, never injected into `/pharn-dev-build` as instructions. `severity` is an LLM assignment (fix #3).

---

## Axis: error handling (griller, P7) — the largest gap

```yaml
- type: FINDING # enum-gated (floor-verifiable, TRUSTED)
  rule_id: P7 # enum-gated — cited, not restated (P4)
  severity: blocking # enum-gated value; the ASSIGNMENT is advisory (fix #3) — a griller never gates
  file: ".dev/features/loop-handoff/PLAN.md:161" # enum-gated — resolves
  problem: "The plan makes `commit` a REQUIRED, shape-gated field captured by `git rev-parse HEAD`, but declares no behavior for the case where that capture FAILS — a user running /pharn-loop outside a git repo, or in a repo with an unborn HEAD (zero commits) — so the command would be forced into an unsatisfiable Step 4: the record cannot be made shape-valid and there is no declared way out."
  evidence: '"`commit` is the SHA `HEAD` resolved to, and `date` is today" → **ADVISORY.** The checker shape-gates both and never runs `git`' (PLAN.md:161-163); the only capture path named is "commit (git rev-parse HEAD)" with no failure branch anywhere in the Guarantee, Trust, or Determinism audits.
```

**What would resolve it:** decide the failure semantics **in the contract**, not at build improvisation
— either admit an explicit sentinel the shape gate accepts (e.g. `commit: unknown`, widening the field's
grammar to `^([0-9a-f]{7,40}|unknown)$` and saying plainly that `unknown` is an honest absence, not a
value), or make the checker RED and route Step 4's terminal fallback to the human (P5). Both are
legitimate; **silently having no branch is not.** This is the same "an unhandled path is an unlabeled
limit" shape P7 names, and it bites hardest for a **product** command a user runs in an arbitrary repo.

## Axis: guarantee-audit completeness (inline, P0)

```yaml
- type: FINDING
  rule_id: P0
  severity: important
  file: ".dev/features/loop-handoff/PLAN.md:144"
  problem: "The headline guarantee is stated as an unconditional FLOOR claim about the world ('After a stop, the just-written LOOP.md IS shape-valid'), while the very next bullet concedes that running the checker is ADVISORY — so the composite claim is advisory-composed-with-floor and is being presented as floor."
  evidence: '"After a stop, the **just-written** `LOOP.md` is shape-valid … → **FLOOR: enum / regex + heading membership**" (PLAN.md:144-148), immediately followed by "`/pharn-loop` **runs** the checker after writing the record" → **ADVISORY** orchestration. Nothing on the floor forces the command''s prose to invoke it" (PLAN.md:149-150).
```

**What would resolve it:** phrase the FLOOR bullet the way the live `/pharn-loop` command already
phrases its own (`pharn-loop.md:204-206`: "This `FLOOR` is the decision **given** the inputs") — the
checker's **verdict over a record handed to it** is floor; that a record is ever handed to it is
advisory orchestration. The distinction is not pedantic here: it is the difference between "the loop
cannot leave a malformed record" (false) and "a record the checker sees is malformed-detectable" (true).

## Axis: trust propagation (inline, P2) — free text can forge an enum-gated fact

```yaml
- type: FINDING
  rule_id: P2
  severity: blocking
  file: ".dev/features/loop-handoff/PLAN.md:184"
  problem: "The plan claims the checker's verdict is 'provably taint-independent' because it ranges over heading MEMBERSHIP, but a Handoff body is untrusted free text whose lines are scanned by the same heading regex — so a body containing a line that reads as `### learned` can SATISFY the membership test for a section that does not exist, letting tainted free text move a floor-verifiable assertion."
  evidence: '"**The checker''s verdict is provably taint-independent.** … it asserts the three sections **exist**, and never reads their bodies'' meaning" (PLAN.md:184-186) — but the plan nowhere constrains what a body may contain, and `### investigated` / `### learned` / `### next_steps` are exactly the strings a narrative summary of a PHARN run is most likely to contain verbatim.
```

**What would resolve it:** make the membership test unforgeable by structure rather than by hoping —
require the three subsections in a **fixed order**, require them to be the **only** `###` headings under
`## Handoff`, and **RED on a duplicate** (a second `### learned` is a malformed record, not a satisfied
one). Note the benign case is as likely as the hostile one: a `learned` body that quotes the record's own
shape would trip it. The precedent to follow is the lessons-index core, which **refuses rather than
sanitizes** a title carrying a fence-closing sequence.

## Axis: architecture + coupling (grillers, P3)

```yaml
- type: FINDING
  rule_id: P3
  severity: important
  file: ".dev/features/loop-handoff/PLAN.md:70"
  problem: "The plan repeatedly frames the new checker as 'the check-provenance analog' and reuses that file's exact COMMIT_RE / DATE_RE / control-char guard, but never states that these must be RE-IMPLEMENTED IN-FILE — leaving an import from `.dev/floor/check-provenance.mjs` as the path of least resistance, which would make a SHIPPED product-floor checker depend on the build apparatus that is stripped at packaging."
  evidence: '"`pharn/floor/check-loop-record.mjs` — NEW. Shape-only validator … Node stdlib (`fs`) only" (PLAN.md:70-71) states the dependency-freedom but not the no-cross-tree-import rule; compare `check-plan-lessons.mjs:55-56`, which says the mechanism is "re-implemented IN-FILE (no sibling import, P3)".
```

**What would resolve it:** one explicit line in the plan (and a comment in the built file) saying the
regexes and the guard are re-implemented in-file, no import from `.dev/`. The failure mode is not
stylistic: `.dev/` is excluded wholesale at packaging ("ship root minus `.dev/`"), so such an import
would be **green here and broken in every user's install** — invisible to `npm run check`.

## Axis: determinism (inline, P5)

```yaml
- type: FINDING
  rule_id: P5
  severity: important
  file: ".dev/features/loop-handoff/PLAN.md:78"
  problem: "'A RED means fix the record before ending the turn' declares a repair loop with no bound and no terminal fallback, inside the one command whose defining property is that no human sits between iterations — the exact class of unbounded autonomy that justified building check-loop.mjs in the first place."
  evidence: '"(b) Step 4 runs `check-loop-record.mjs` on the record immediately after writing it — a RED means fix the record before ending the turn" (PLAN.md:77-78); the Determinism audit adds "a record that cannot be made valid is handed to the human" (PLAN.md:208-209) without saying after how many attempts, so the two readings — bounded and unbounded — are both open.'
```

**What would resolve it:** state the bound explicitly and structurally, e.g. **at most one** re-write
attempt, then present the RED output and hand to the human — the same "≤1 is structural" framing
`/pharn-ship`'s Step 2b already uses. Note this bound is **advisory** (command prose, not a floor
counter, exactly as `--iter` is per `LIMITS.md §1d`) and should be labeled so, not sold as a guarantee.

## Axis: rules-as-SoT (inline, P4) — two findings

```yaml
- type: FINDING
  rule_id: P4
  severity: important
  file: ".dev/features/loop-handoff/PLAN.md:120"
  problem: "Three artifacts will independently restate one shape — the contract's schema, the checker's regexes, and the command's Step-4 template a model copies from — but the plan's test list contains no case pinning the COMMAND's own template against the checker, so the command can drift into emitting a record its own floor step rejects, and every test would still pass."
  evidence: '"The equivalent obligation here is a `node --test` suite, and it must include the negative cases that make the check real" (PLAN.md:119-120) — the fourteen listed cases are all author-constructed fixtures; none reads the template out of `.claude/commands/pharn-loop.md` or `pharn/pharn-contracts/loop-record.md`.'
```

```yaml
- type: FINDING
  rule_id: P4
  severity: minor
  file: ".dev/features/loop-handoff/PLAN.md:221"
  problem: 'The record''s decision enum is cited to `check-loop.mjs:38-43`, which is the file''s explanatory COMMENT block, not the source of the values — the live values are the `decision = "…"` assignments and the emitted JSON `.decision`, so the citation drifts silently the moment someone edits a comment.'
  evidence: '"The record enum is therefore `{STOP_GREEN, STOP_CAP, STOP_TERMINAL, INCONCLUSIVE}`, quoted verbatim from `check-loop.mjs:38-43`" (PLAN.md:219-221).'
```

**What would resolve the pair:** for the first, add one test in the `#114` `TYPE-ENUM` mould — extract
the template region from the command doc (or the contract) and assert the checker returns GREEN on it,
so a restatement cannot drift from its SoT. For the second, cite the **emitted** `.decision` values,
which is also what the GATE-1 copy-through now consumes — making the citation and the runtime path the
same thing.

## Axis: honest scope / no speculation (inline + comprehension griller, P7)

```yaml
- type: FINDING
  rule_id: P7
  severity: important
  file: ".dev/features/loop-handoff/PLAN.md:1"
  problem: "The plan never states its P7 trigger — whether a real dogfood or eval failure forced this increment, or whether it was identified at design time — even though the repo has an established convention of saying so explicitly, and the honest answer here appears to be the design-time one."
  evidence: 'The plan documents motivation thoroughly but carries no trigger statement; compare the live CHANGELOG convention, e.g. "**Honest trigger (P7), stated rather than hidden:** like L8 and #114, this was identified at design time — no dogfood failure forced it".'
```

**What would resolve it:** one sentence. The motivating observation (a run's synthesis dies with the
session) is real but is **not** a recorded dogfood failure of `/pharn-loop`, and P7 forbids letting a
design-time addition read as a failure-triggered one.

```yaml
- type: FINDING
  rule_id: P7
  severity: minor
  file: ".dev/features/loop-handoff/PLAN.md:74"
  problem: "The command edit bundles two separable theses — the WRITE side (Step 4 emits and validates a record) and the READ side (item c: a new `reads:` entry plus Step-1 consumption of a prior record) — which could ship as two increments, so 'the smallest coherent increment' is arguable rather than obvious."
  evidence: '"(c) add `features/<name>/LOOP.md` to `reads:` (absent today, verified live) plus a Step 1 instruction to read a prior record and quote its Handoff as untrusted DATA" (PLAN.md:78-80).'
```

**Weighing it honestly:** the read side is one frontmatter entry and a short prose step, and a
write-only increment would ship a record nothing consumes — which is arguably the _less_ coherent
split. Raised for the human to weigh, **not** pushed.

## Axis: writes-scope (inline, P2 / fix #7)

```yaml
- type: FINDING
  rule_id: P2
  severity: important
  file: ".dev/features/loop-handoff/PLAN.md:86"
  problem: "Declaring `README.md` in `## Files` grants the build Write-tool scope over the WHOLE file — including the hand-written, entirely unguarded prose outside the markers — while the generator that actually needs to touch it writes through Bash and bypasses the writes-scope hook regardless, so the declaration buys honesty (L19) at the cost of a power (L7) nothing in the increment needs."
  evidence: '"`README.md` — EDIT **inside the generated markers only**, by running `npm run docs:generate` (never by hand)" (PLAN.md:86-87) — the intent is stated in prose, but the fix #7 scope the setter derives from this line cannot express "markers only".'
```

**What would resolve it:** keep the declaration (L19's remedy is to declare a Bash write, not to hide
it) and pair it with an explicit build instruction that the **only** permitted change to `README.md` is
the generator's output, verified by re-running `npm run docs:check` — so the granted Write scope is
declared-but-unused. Worth stating that this is a **discipline** bound, not a floor one.

## Axes run with no findings (recorded, not padded)

- **testability (P1)** — presence recognized: `## Evals to write (P1)` carries fourteen concrete cases
  including the L14/L18/L6/L15 witnesses. **Layer-2 adequacy note (advisory):** the suite is strong on
  malformed input and weak on **agreement** between the three restatements — that gap is finding P4
  above, not an absence finding.
- **security (P2)** — no secret literal in the plan text; the SHA in the examples is a commit id. The
  one security-relevant concern is the heading-forgery finding above, filed under trust propagation.
- **observability (P6)** — presence recognized: the record _is_ the observability artifact, and the
  checker's GREEN/RED output is the signal. Its visibility on repeated failure folds into the P5
  finding.
- **documentation (P7)** — presence recognized: `CLAUDE.md`, `CHANGELOG.md`, the contract itself, and
  the checker's usage line are all declared surfaces.
- **comprehension (P7)** — presence recognized, strongly: the plan captures WHY throughout (the
  `## Applied lessons`, `## Decisions taken here`, and the resolved open questions). The one uncaptured
  WHY is the P7 trigger, filed above.
- **performance (P7)** — reads one markdown file per stop; no scaling axis.
- **privacy (P2)** — the Handoff persists model-authored prose into a committed artifact, but that is
  the same exposure every existing pipeline artifact already carries (`SPEC.md`, `VERIFY.md`,
  `evidence` fields). No new PII surface.
- **migrations (P7)** — out of archetype (`applies: ["backend","ssr"]`), and no persisted-data schema
  changes. Recorded because the _generalized_ question does apply and the plan answers it: the forward
  shape change carries a declared way back (legacy records stay readable; only the just-written record
  is checked).
- **a11y (P7)**, **i18n (P7)** — out of archetype (`applies: ["ssr","spa"]`); the increment builds no
  user interface and no user-facing translatable string.

---

## Summary (prose)

The plan is unusually strong on the axes this repo cares most about — the guarantee audit is itemized,
the taint split is explicit, the residual is named rather than buried, and the lessons sweep is real
work rather than citation. The concerns cluster in one place: **the plan is more precise about what it
does not guarantee than about what happens when the world does not cooperate.**

Two findings would produce a defective build if carried through unchanged. The **`git rev-parse HEAD`
failure path** (P7) makes a required field uncapturable in a legitimate user environment with no
declared way out — and this is a **product** command, so "the repo always has a HEAD" is precisely the
assumption a user's repo is entitled to violate. The **heading-forgery** hole (P2) is the more
interesting one: the plan's claim of provable taint-independence is true of the four envelope fields and
**false of the heading membership test**, because the untrusted free text and the structural markers
share one namespace — a narrative summary of a PHARN run is _exactly_ the text most likely to contain
the string `### learned`. That is fix #1's own failure mode reproduced one layer down, and the benign
case will hit before any hostile one.

The remaining seven are corrections rather than defects: a headline FLOOR claim that should be scoped
"given the inputs" (P0); an unbounded record-repair loop inside the one command with no human between
iterations (P5); no test pinning the command's template against the checker, so three restatements of
one shape can drift (P4); an enum cited to a comment block rather than to the emitted values (P4); a
missing honest-trigger statement (P7); a bundling question raised and honestly weighed (P7); and a
`README.md` scope grant that is right for L19 and loose for L7 (P2).

Nothing here contradicts the GATE-1 resolutions — minor `2.1.0`, frontmatter envelope, and
decision copy-through all survive interrogation intact, and the copy-through in fact **helps** the P4
citation finding.

**Instruction-looking content:** none. Nothing in the plan attempted to direct this stage's behavior,
suppress a finding, or set an enum-gated field. Recorded as a negative result, since its absence is
only meaningful if it was actually looked for (P2).

---

**ADVISORY VERDICT: 9 concerns raised (2 blocking-severity, 5 important, 2 minor) — for the human to
weigh before `/pharn-dev-build`.** `/pharn-dev-grill` gates nothing: every severity above is an LLM
assignment (fix #3), and this stage's only deterministic act was the spec-hash comparison, which
matched. "A grill-log was produced" never means "the plan is sound" (P0).
