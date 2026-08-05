# REVIEW — format-step-scope

**Step 1, floor first (P0):** `node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities checked`
(exit 0). Standing sibling verdicts: `/pharn-dev-regress` `no-regressions` (base `d5cddbe`),
`/pharn-dev-verify` `PASS` (on the second gate pass — see its report). **Everything below is advisory.**

The increment under review is `trust: untrusted`.

---

## Floor-gate findings (blocking)

**None.** Every claim the increment makes is either reduced to a floor op or labeled advisory, and the two
places where it would have been easy to overclaim are labeled correctly in the artifact itself:
`command-hygiene.test.mjs`'s header states it "pins a VOCABULARY, not a behavior" and that it "does NOT
close L19's class", and the CHANGELOG entry repeats both. That labeling is what keeps the findings below
**advisory** rather than blocking — they are adequacy concerns about a guard whose limits are already
stated, not guarantees claimed without a reduction.

---

## Advisory findings (inform; never the sole basis for a block)

### L-floor → P0

```yaml
- type: FINDING # enum-gated (floor-verifiable)
  rule_id: "P0"
  severity: important
  file: ".dev/floor/command-hygiene.test.mjs:51"
  problem: "The forbidden-vocabulary regex misses near-miss spellings of the very invocation it exists to catch — `prettier --write ./` and any argument reordering pass unflagged."
  evidence: "`re: /\\bprettier\\b[^\\n]*--write(?:\\s+\\.)?\\s*$/` requires the line to END at `--write` or `--write .`. `npx prettier --write ./` has a trailing slash after the dot, so `\\s*$` fails; `npx prettier . --write` puts the path first and is caught only by the `--write`-at-end branch, which a trailing flag would break."
```

The test's honest note ("a novel spelling passes untouched") makes this **labeled, not hidden** — which is
why it is not blocking. But `./` is not a _novel_ spelling; it is the same command a shell-tab-completion
would produce, and the guard exists precisely to catch that command. Widening to
`--write\s+\.?/?\s*$` plus a path-before-flag branch costs one line and closes the plausible half of the
gap. The genuinely novel spellings (a new npm script, an alias) remain out of reach and should stay
labeled.

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/floor/command-hygiene.test.mjs:72"
  problem: "The `xargs` exemption is applied to the whole LINE, so any line mentioning xargs is skipped entirely — including one that also prescribes a repo-wide write."
  evidence: "`if (/\\bxargs\\b/.test(line)) return;` — a line such as `` `npm run format` (unlike the xargs form) `` is exempt from every forbidden pattern, not just the markdownlint one it was written for."
```

Low likelihood, and the exemption is genuinely needed (the correct scoped form and the incorrect bare form
end in the same token — a real constraint the grill did not anticipate and the implementation had to solve).
Worth narrowing to the pattern that needs it — exempt a line from the `markdownlint-cli2` rule when it
contains `xargs`, rather than exempting the line from all three rules.

### L-axis → P3 / P4

```yaml
- type: FINDING
  rule_id: "P4"
  severity: important
  file: ".claude/commands/pharn-dev-plan.md:198"
  problem: "The format-step rationale is now restated verbatim in eight command files, so changing it requires eight synchronized edits and the copies can drift apart."
  evidence: "The identical four-line paragraph — 'Scoped to **this stage's own artifact** — never a repo-wide formatter, whose writes escape the fix #7 scope through Bash (…L19, cited not restated — P4). `--ignore-unknown` keeps a non-prettier path from erroring the step. **ADVISORY** (P0)…' — appears in pharn-dev-{plan,grill,regress,verify,review,ship,memory-promote}.md."
```

**There is a real irony worth naming:** the duplicated paragraph is itself a P4 restatement, and it ends by
citing P4. The _lesson_ is cited correctly (L19 by reference, not restated) — it is the **step's own
rationale** that is copied eight times. This is the same shape as the repo's existing `TYPE-ENUM` problem
(one source of truth, restated for humans) and has the same remedy: state it once — in `CLAUDE.md`'s
conventions or a short `pharn-contracts`-style note — and have each stage cite it. Not blocking: eight
copies of four lines is a small maintenance debt, and the alternative (a cross-reference an agent must
follow mid-run) has a real cost too. Surfaced so the choice is deliberate.

### L-trust → P2

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".claude/commands/pharn-dev-memory-promote.md:242"
  problem: "The promote stage now runs prettier over the canon file it appends to, so if canon were ever not prettier-clean a promotion would silently reformat unrelated entries and attribute that churn to the promotion."
  evidence: "The added step formats `<canon-file>` — `.dev/memory-bank/lessons-learned.md`. That file is the most sensitive artifact in the repo (memory poisoning is 'write-once-influence-forever', THREAT-MODEL §2 #3), and the stage's whole design is to land exactly ONE vetted entry behind a human gate."
```

Benign today — canon is prettier-clean, so the step is a no-op (observed: the L18/L19 promotion passed
`format:check` without one). The concern is that a **gated** stage designed to make exactly one reviewed
change now carries a mechanism that could make many unreviewed ones. The human gate shows the _entry_, not
the _formatting diff_. Cheapest mitigation: have that stage format only if the file was already clean, or
simply note in the command that a non-trivial format diff at promotion time is a signal to stop and look.

**No blocking trust finding.** Checks run rather than assumed: no instruction-looking content addressed this
reviewer; no new untrusted ingestion (the guard reads command files, trusted by provenance, and its verdict
is a regex over bytes); and the increment **edits eight files that are themselves the agent instruction
surface**, so the added prose was read specifically for gate-weakening language — it contains none, and
correctly repeats that the step "never blocks" and that the deterministic gate remains verify's.

### L-eval → P1

**No finding.** No Capability, so no `rule_id`↔eval binding to check, and the floor agrees. Adequacy is
**good and unusually well-evidenced**: the guard was measured failing **twice**, neither time by
construction — once on the seven rationale lines that quoted the rejected token (a real self-collision), and
its discrimination is pinned by a companion test asserting both the rejected and accepted forms. The gap in
that companion test is F1 above: it hardcodes three rejected spellings and does not include `--write ./`.

---

## Verdict

**GREEN — 0 floor-gate findings; 4 advisory.**

The increment does what it set out to do, and it produced two pieces of evidence that it works rather than
merely claims to. `check-regress.mjs scope` returned `escaped: []` where the previous run reported an
undeclared file — the defect that became L19 does not reproduce under the fix. And `/pharn-dev-verify`'s
first pass **failed on exactly the two artifacts the GATE-1 argument predicted would lose their incidental
formatting**, which is as direct a confirmation of the wider scoping as this pipeline can produce.

The honesty discipline holds where it matters most: the increment **does not claim** to have closed L19's
class, states plainly that the guard pins a vocabulary rather than a behavior, and records that
**L19 remains true** after landing. The four advisory findings are refinements to a guard whose limits are
already labeled — not guarantees without reductions.

---

## Proposed lesson candidate (NOT written to canon — `/pharn-dev-review` holds no canon scope)

> Proposed only. Promotion is a separate, human-gated `/pharn-dev-memory-promote` run under its own scope,
> behind `check-provenance.mjs` and an explicit accept/deny. The model never self-promotes (P2).

### Candidate C — narrowing an over-broad mechanism must land whatever it was silently providing

**Lesson (draft).** When you scope down a mechanism that was doing more than it declared, first audit **what
was quietly depending on the excess**, and land replacements in the **same** increment. An over-broad step
does not only cause the defect you are fixing — it also _supplies_ behavior other steps then never needed to
implement, and that supply is invisible precisely because nothing declares it. Removing the excess without
replacing the supply converts one defect into a different, wider one.

**Why it matters (draft).** Concretely: `/pharn-dev-build`'s Step 2b ran `prettier --write .` over the whole
repo. Its **defect** was writing outside the plan's scope (L19). Its **undeclared supply** was formatting
every _other_ stage's artifacts — `PLAN.md`, `GRILL.md`, `REGRESSION.md`, `VERIFY.md`, `REVIEW.md`,
`SHIP.md` — none of which had a format step, because none had ever needed one. That is also why L13's
remedy ("extend the Step-2b discipline to every artifact-writing stage") sat **prescribed in canon and
unimplemented since 2026-07-07**: the pipeline never visibly hurt, because the over-broad step was covering
for it. Scoping Step 2b correctly and stopping there would have made every future run red
`/pharn-dev-verify` on its own PLAN and GRILL — trading a scope violation for permanent friction. Verified
live this run: `format:check` failed its first pass on exactly those two files, and only those two. The
audit question generalizes — "what currently works _only_ because this thing is too broad?" — and it applies
to any over-permissive default: a wildcard scope, a catch-all handler, a broad grant. Complements L3 (which
concerns making a declaration load-bearing) as its mirror: **L3 tightens a declaration and must re-audit
existing declarations; this tightens a behavior and must re-audit existing dependents.**

**Suggested tags (#114 shape, for the human to ratify — the floor checks shape, never aptness):**
`type: process` · `concepts: [scope-narrowing, hidden-dependency, incremental-change]`

**Provenance (draft).**

- feature: `format-step-scope`
- commit: `d5cddbe6595b67efc7cf53f86d7133b3fea05aa0` (working-tree dogfood built on this commit)
- source: `.dev/features/format-step-scope/PLAN.md` (the GATE-1 scope argument) +
  `.dev/features/format-step-scope/VERIFY.md` ("The predicted regression, observed live"), with the
  first-pass `format:check` FAIL on exactly the two predicted files as the confirmation
