# GRILL — `floor-selfheader-prefix`

Plan under interrogation: `.dev/features/floor-selfheader-prefix/PLAN.md` (`trust: untrusted` — its
self-claims are tested, not believed). **Spec-hash check: MATCH** — recomputed
`sha256(pharn/ARCHITECTURE.md)` = `0d0dc6da61c4de6748aeab849ed1a4ecd9ff7f1d61e91d5848d7ffdaf022733d`,
identical to the plan's pinned `spec_content_hash`. No drift (surfaced here; `/pharn-dev-build` is where
drift actually blocks — fix #4).

Griller membership (FLOOR — `pharn/floor/count-grillers.mjs`, `role:` frontmatter enum): **13 registered**.
Axes with nothing to say on a comment-normalization increment (`a11y`, `i18n`, `migrations`, `privacy`,
`performance`, `observability`, `security`, `error-handling`) returned **no findings** — recorded as
applied-and-empty, not skipped.

---

## Findings

### Axis: guarantee-audit completeness (P0, inline)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/floor-selfheader-prefix/PLAN.md:120"
  problem: "The plan grades the LEAVE-SET as uniformly FLOOR-guarded, but only the ASSERTION lines are; the input-only lines feeding status-only tests are unguarded, so a consistent rewrite of them would pass npm test silently."
  evidence: '"**\"The LEAVE-SET test data was not mutated\"** → **FLOOR: enum/regex** … so any wrong rewrite of them fails `npm test` immediately. This is the increment''s principal risk and it is genuinely floor-backed."'
```

**Verified against live test source, not inferred.** The 14 LEAVE-SET lines split into two classes:

- **Guarded (assertion lines)** — `check-regress.test.mjs:49` (`assert.deepEqual(o.outside_tests,
["floor/validate.test.mjs"])`), `:72`, `:77`, `:144`. Also `:37/:39/:41`, which are inputs but are
  paired with the exact assertion at `:49`, so a partial rewrite does fail. The plan's claim holds here.
- **UNGUARDED (input-only lines in status-only tests)** — `check-regress.test.mjs:87, 96, 98`. Line 87's
  test asserts only `r.status === 2` and `/inconclusive/`; rewriting its `--changed` / `--declared` args
  to `pharn/floor/…` leaves the glob `floor/*.test.mjs` still a glob, so the test **still exits 2 and
  still passes**. Same for 96/98. Likewise `check-ship.test.mjs:51` and `check-loop.test.mjs:63` — the
  `REGR` fixture's `regressions: ["floor/x.test.mjs"]` array content is **never asserted** (only
  `verdict` drives the branch; tests assert exit codes).

**Consequence for the P0 audit:** for those 6 lines the only protection is **condition 2 (comment-only)** —
an agent discipline, not a floor primitive. (`check-ship.test.mjs:51` / `check-loop.test.mjs:63` get a
second, genuinely deterministic shield from condition 1, since `floor/x.test.mjs` does not exist.) The
plan should say "the LEAVE-SET is **partly** floor-backed" and name the 6 unguarded lines, or the audit
reproduces in miniature the exact overstatement it corrected in the task brief.

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/floor-selfheader-prefix/PLAN.md:128"
  problem: "docs:check is listed in the guarantee audit as a floor backstop for this increment, but it ranges over generated capability/checker FILENAMES and never over comment bytes, so it cannot detect anything this increment could get wrong."
  evidence: '"**\"`npm run docs:check` stays GREEN\"** → **FLOOR: content-hash** (byte-equality, wired in `npm run check` + CI)."'
```

The gate is real and must stay green — but listing it under the audit implies it _guards this change_.
It does not. It belongs under "gates that must not break," not "floor reductions of this increment's
claims." A backstop that cannot observe the change is not a backstop for it.

### Axis: testability (griller — `pharn/pharn-pipeline/grillers/testability/testability.md`, enforces P1)

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/floor-selfheader-prefix/PLAN.md:135"
  problem: "The increment's single operative edit (check-structural.mjs:167) sits on a code path with zero test coverage, and the plan declares the gap honestly but plans no test to close it — leaving the one line that can actually change program behavior verified by reading alone."
  evidence: '"**ADVISORY, and UNGUARDED — a named residual.** Verified live: `check-structural.test.mjs` contains **zero** tests exercising the no-args path (no `run([])` call, no `usage` assertion)"'
```

The plan's honesty here is correct and P0-conformant — it corrects the task brief rather than repeating
it. But **declaring a residual is not the same as accepting it when closing it is cheap.** A ~3-line test
(`run([])` → assert `status === 1` and `assert.match(stdout, /pharn\/floor\/check-structural\.mjs/)`)
would convert this from advisory-unguarded to a genuine enum/regex floor guard, and would guard the
line permanently, not just for this PR. Whether that counts as in-scope for a header-normalization
increment or as scope creep is a judgment for the human — **surfaced, not decided.**

### Axis: honest scope / no speculation (P7, inline)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/floor-selfheader-prefix/PLAN.md:84"
  problem: "The GATE-1 decision to route the README to a separate feature also routes validate.mjs:21 there, and since validate.mjs is a product-floor checker that second feature must bump SKILLS_VERSION too — so one coherent 'floor path legibility' concern now costs two patch bumps and two rounds of install churn instead of one."
  evidence: '"Routed to a separate **\"`pharn/floor/README.md` accuracy\"** feature: L16, L21, L25, L40, L77, the stale … and alignment with `validate.mjs:21`"'
```

This is the sharpest concern in the grill, and it emerges from the GATE-1 decision itself. The
coherence argument for splitting is sound (a one-token L25 rewrite would leave the prose wrong). But the
plan's own out-of-scope list now records that the follow-up feature touches
**`pharn/floor/validate.mjs:21`** — a `pharn/floor/*.mjs` product-floor checker, squarely in CLAUDE.md's
bump-triggering set. So the sequence is `1.1.2 → 1.1.3` (this PR, comment-only) `→ 1.1.4` (README +
`validate.mjs:21`). Every installed user sees two updates whose combined user-visible effect is _comment
text accuracy_.

Three options the human may weigh (**this griller does not choose** — P5's terminal fallback is to ask):

1. **Ship as planned** — two bumps, each coherent on its own. Accepts the churn.
2. **Fold `validate.mjs:21` into THIS PR** — it is a bare-`floor/`-adjacent self-description in a checker
   header, the same class this increment normalizes; the README then follows as a pure docs PR with
   **no** bump. One bump total.
3. **Hold this PR and land both together** — one bump, one coherent "floor path legibility" story, at the
   cost of a larger diff.

Note option 2 is not a rule violation: `validate.mjs:21`'s omission of `pharn/floor/` from its own
exclusion-prose is a _content_ inaccuracy, not a `floor/<B>` prefix fix, so it falls outside the stated
4-condition rule. It would be a **deliberate scope widening**, and must be declared as such if taken.

### Axis: architecture / comprehension (grillers — enforces P3 / P7)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/floor-selfheader-prefix/PLAN.md:167"
  problem: "This PR creates a new intra-directory inconsistency it then has to explain: every checker header in pharn/floor/ will read pharn/floor/ while pharn/floor/README.md two directories up in the same folder still tells a reader to run node floor/validate.mjs."
  evidence: '"or a `pharn/floor/README.md` line deferred to the separate accuracy feature (L21, L25, L40)**; **no checker''s own header may survive**."'
```

The plan handles this correctly — the verification grep is widened to _expect_ the README hits, so the
gate stays honest rather than being quietly loosened. The residual risk is **schedule**, not logic: if the
follow-up README feature does not land, the inconsistency is permanent and this PR is its cause. Worth an
explicit commitment (or a tracking issue) at GATE 2.

### Axis: discovery / doc-vs-repo (P6, inline)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".claude/commands/pharn-dev-grill.md:0"
  problem: "The grill command's own Step 2b prose asserts a registered griller set that live state contradicts, so an agent trusting the doc over the tool would run one axis instead of thirteen."
  evidence: '"Today the registered set is the `testability` griller (`pharn/pharn-pipeline/grillers/testability/testability.md`)."'
```

`node pharn/floor/count-grillers.mjs .` reports **13** registered grillers. The doc says one. Live state won
(P6), so this run applied all 13 — but the drift is apparatus doc rot and belongs on someone's list. Not
this increment's job; recorded because the grill stage is where it surfaced. _(`file` cites the command
doc, not the plan — this finding is about the stage, not the increment under interrogation.)_

---

## Summary

The plan is unusually well-grounded for a cosmetic increment: it reads live state rather than trusting the
task brief, it **corrects** the brief on test coverage instead of repeating it, and it names its residuals
in the right P0 vocabulary. The findings above are refinements, not rejections.

Two are worth real attention before `/pharn-dev-build`:

- **P0/PLAN:120** — the LEAVE-SET is only **partly** floor-backed. Six lines
  (`check-regress.test.mjs:87/96/98`, `check-ship.test.mjs:51`, `check-loop.test.mjs:63`) are protected
  only by the comment-only rule, because their tests assert exit codes rather than the string content.
  The plan currently reads as if `npm test` catches every mistake in this class. It does not.
- **P7/PLAN:84** — the README split, though individually coherent, yields **two** `SKILLS_VERSION` patch
  bumps for one legibility concern, because the follow-up carries `validate.mjs:21` (a product-floor
  checker) with it.

Neither is a defect in the _edits_ this PR will make; both are about how the plan **describes its own
guarantees** and how the work is **sequenced**. The 23 checker rewrites, 6 test-header rewrites, and
LEAVE-SET are correctly identified — verified against live grep and live test source this run.

No hostile or instruction-looking content was found in the plan; nothing in it attempted to steer this
griller. All quoted `problem` / `evidence` text above is **DATA**, quoted for the human, never executed.

---

**ADVISORY VERDICT: 6 concerns raised (0 blocking, 3 important, 3 minor) — for the human to weigh before
`/pharn-dev-build`.**

This grill-log **gates nothing** (fix #3). It does not mean the plan is good, and it does not mean the plan
is bad; it means these six questions were asked and are now on the record. `/pharn-dev-build`'s floor-gates
(spec-hash drift, unresolved `## Open questions (HALT)`) and `pharn/floor/validate.mjs` are unaffected by
anything written here.
