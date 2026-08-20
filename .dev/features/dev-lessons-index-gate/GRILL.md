# GRILL — dev-lessons-index-gate

Plan under interrogation: `.dev/features/dev-lessons-index-gate/PLAN.md`.
**Spec-hash check:** recomputed `sha256(pharn/ARCHITECTURE.md)` =
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52` — **matches** the plan's
`spec_content_hash`. No drift finding. (The computation is content-hash floor-grade; the **block** on
drift belongs to `/pharn-dev-build`, not here.)

**Griller membership (FLOOR — `node pharn/floor/count-grillers.mjs .`):** `registered: 13`. The axes
materially engaged by an apparatus / command-prose increment are **testability**, **documentation**,
**architecture**, **comprehension**, and **error-handling**; `a11y`, `i18n`, `migrations`,
`performance`, `privacy`, `security`, `coupling`, `observability` found no purchase on a plan that adds
no runtime code path, no user-facing surface, and no data flow. That set is read from the command
above, not asserted from this paragraph.

---

## Findings

### Axis: guarantee-audit completeness (P0) — inline lens

```yaml
- type: FINDING
  rule_id: "P0"
  severity: blocking
  file: ".dev/features/dev-lessons-index-gate/PLAN.md:107"
  problem: "The guarantee-audit's dev/product asymmetry bullet states the consequence of Step 6b BACKWARDS — it claims the refresh leaves `npm run check` RED, when a live probe shows the refresh is precisely what makes it GREEN; shipping this sentence into command prose would put a false claim in a trusted command."
  evidence: "Step 6b leaves an **uncommitted** change that a human must commit; until then `npm run check` is RED."
```

**Why this is blocking, and how it was established.** Not by reasoning — by running it. A synthetic
lesson was appended to a **throwaway copy** of canon outside the repo, and the checker was run on both
sides of the refresh:

| state                         | `check-lessons-index.mjs`                         | exit |
| ----------------------------- | ------------------------------------------------- | ---- |
| promotion **without** Step 6b | `RED — [DRIFT] docs/lessons-index.md`             | `1`  |
| promotion **with** Step 6b    | `GREEN — matches the index recomputed from canon` | `0`  |

The checker compares the **working tree's** `docs/lessons-index.md` against a recompute from the
**working tree's** canon. Commit status is not an input. So the two files being uncommitted-together is
irrelevant to the verdict; only their **mutual consistency** is.

The correction inverts the plan's story, and the corrected story is the more interesting one: on the
**product** side a skipped refresh degrades quietly (`STALE` → the next `/pharn-plan` reads canon in
full). On the **dev** side a skipped refresh raises a **committed-drift RED that blocks `npm run check`
for everyone until someone regenerates**. Step 6b is therefore _more_ load-bearing here, not less — the
opposite of what the plan asserted. It remains **ADVISORY** (nothing on the floor forces the run, and it
is a Bash write outside fix #7 — L19); what changes is the honest description of the failure mode.

**Suggested repair (for the human to weigh):** replace the bullet with a claim that the refresh is what
_keeps_ `docs:check` green after a promotion, that **skipping it is a loud RED rather than a quiet
degradation**, and that the human must commit canon and index **together** — a git-hygiene point, not a
gate outcome.

### Axis: determinism (P5) — inline lens

```yaml
- type: FINDING
  rule_id: "P5"
  severity: minor
  file: ".dev/features/dev-lessons-index-gate/PLAN.md:137"
  problem: "The determinism audit enumerates the index-state branches but never states what happens if the CHECKER ITSELF is unusable (deleted, unparseable, or pointed at a bad target); the behavior is in fact fail-safe, but an unstated fail-safe is indistinguishable at review time from an unconsidered one."
  evidence: "The new branch is a **membership test over the exit code**: `0` → the index matches canon → run the existing two-step sweep; **non-zero** → do not select from the index, read canon in full"
```

Verified live: `check-lessons-index.mjs` `main()` exits `1` on a missing / non-directory target, and a
throw exits non-zero, so every unusable-checker path lands in the same **read canon in full** branch as
`DRIFT`. The behavior is correct as designed; the plan should **say** so, because L25's standard is that
a rationale is trusted for the defects it does _not_ name.

### Axis: architecture / dependency direction (P3) — architecture griller

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/dev-lessons-index-gate/PLAN.md:60"
  problem: "The new wiring set iterates PRODUCT command prose (`pharn-plan.md`, `pharn-memory-promote.md`) from a test living under `.dev/floor/`; this is the allowed dependency direction and matches the file's existing behavior, but nothing in the plan records WHY it must never be relocated to `pharn/floor/`."
  evidence: "`.dev/floor/command-hygiene.test.mjs` — add the materialized `LESSONS_SWEEP_WIRING` set + the rules that iterate it"
```

Confirmed against live precedent, not memory: `command-hygiene.test.mjs` **already** enumerates all of
`.claude/commands/*.md` — product commands included — so the increment introduces no new crossing. The
direction is the sanctioned one (`.dev/` → `pharn/`), the same rule `CLAUDE.md` records for the
`lessons-index-core` copy-pair: a user's install ships `pharn/floor/` **without** `.dev/`, so a pin
placed on the product side would reference `.claude/commands/` paths that a user's repo need not have.
Worth one sentence in the test header so a future tidy-up does not "promote" it across the boundary.

### Axis: documentation / self-reference (P4) — documentation griller

```yaml
- type: FINDING
  rule_id: "P4"
  severity: minor
  file: ".dev/features/dev-lessons-index-gate/PLAN.md:28"
  problem: "The plan has command prose quote `npm run docs:generate` as a NAMED-AND-REJECTED form, which is the same doc-quotes-a-value-a-checker-validates situation the COMMAND-HYGIENE:SKIP region exists for; the quoted string trips no current FORBIDDEN rule, so this is a latent coupling rather than a live break."
  evidence: "exact, copy-pasteable invocations with the wrong forms named beside them (`npm run docs:generate` is named and **rejected** for Step 6b, with the reason)"
```

Checked live against the three `FORBIDDEN` regexes: `npm run docs:generate` matches none of them
(`/\bnpm run format(?![:\w])/` excludes it). No action required now; the note exists so that if a
`docs:generate` rule is ever added, the house pattern (the `COMMAND-HYGIENE:SKIP-BEGIN/END` markers,
already used by `pharn-dev-memory-promote.md`'s `TYPE-ENUM` block) is the reach-for, not a reworded quote.

### Axis: discovery completeness (P6) — comprehension griller

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".dev/features/dev-lessons-index-gate/PLAN.md:54"
  problem: "The Files bullet says the checker is ADDED to `/pharn-dev-plan`'s `reads:` but does not state that `docs/lessons-index.md` and the canon path REMAIN — an addition described without its surrounding invariant is how a declaration audit silently narrows a list."
  evidence: "add the checker to `reads:` — layer: apparatus"
```

This is L3's shape in miniature (re-auditing a declarative field must not drop existing members). Live
`reads:` today holds the four trusted docs, `docs/lessons-index.md`,
`.dev/memory-bank/lessons-learned.md`, `pharn/floor/check-plan-lessons.mjs`, `<target repo>` — all eight
must survive, with `.dev/floor/check-lessons-index.mjs` making nine.

---

## Summary

The plan is well-grounded on the axes that matter most for it — the lessons declaration is real (ten
entries read from canon, not selected from the index), the writes-scope parity check was run rather than
asserted, and P7 is honestly discharged on the deliberately-absent `--verdict` flag with a correct reason
(the dev checker has no exit-0 ambiguity, so a flag would be an addition with no triggering failure).

**One finding is blocking-severity and it is a P0 defect in the plan's own honesty section** — the very
class of error this repo exists to prevent, caught only because the claim was **probed instead of
reasoned about**. Left uncorrected it would have written an inverted cause-and-effect into a trusted
command file, where the next reader would inherit it as established fact (L25). The correction
strengthens the increment: it makes Step 6b's dev-side stakes _higher_ than the plan claimed.

The four remaining findings are all **minor and additive** — none contests the design, each asks the
increment to **state** something it already gets right, which is L25's standard (a rationale is trusted
for the defects it does not name) applied to this plan's own prose.

Nothing here contests the three-file scope, the exit-code branch, or the materialized-set test form.

**ADVISORY VERDICT: 5 concerns raised (1 blocking-severity, 4 minor) — for the human to weigh before
`/pharn-dev-build`.** This grill-log is advisory end-to-end and gates nothing: the `severity` values
above are LLM-assigned judgments, not floor verdicts, and `/pharn-dev-build` proceeds or halts on its own
deterministic gates (spec-hash drift, unresolved `## Open questions (HALT)`, and
`pharn/floor/validate.mjs`), never on this file.
