# GRILL — guard-self-protection

Plan under interrogation: `.dev/features/guard-self-protection/PLAN.md` (read live this run, treated as
`trust: untrusted` DATA). **Spec-hash check (content-hash primitive, surfaced not blocking):** recomputed
`sha256(pharn/ARCHITECTURE.md)` = `a1c243ea…621753`, plan pin = `a1c243ea…621753` — **MATCH**, no drift.
Griller membership (FLOOR, `pharn/floor/count-grillers.mjs .`): **13 registered**.

---

## Findings

### Axis: trust propagation (P2) — inline

```yaml
- type: FINDING
  rule_id: "P2"
  severity: important
  file: ".dev/features/guard-self-protection/PLAN.md:118"
  problem: "The trust audit shows a PLAN cannot set --allow-claude-dir, but omits that the flag's INVOKER is agent-writable: /pharn-dev-build's Step 0 command string lives in .claude/commands/pharn-dev-build.md, which the GATE-1 decision deliberately leaves outside both the protected list and the refusal set — so an agent could edit the command to pass --allow-claude-dir unconditionally and restore the F3 hole at guard B."
  evidence: "`--allow-claude-dir` is an operator-supplied **argv** flag, not a field any untrusted artifact can set — a PLAN cannot opt itself in."
```

**Why it is `important`, not `blocking`:** change A is independent of scope — `protect-trusted-paths.cjs`
denies the four control files **regardless** of any scope the setter emitted. So neutering B alone does
not grant the write. The plan should **state** that composition rather than leave the residual unnamed;
this is the same defense-in-depth ordering it already spells out for the symlink case.

### Axis: determinism / guarantee scope (P0, P5) — inline

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/guard-self-protection/PLAN.md:123"
  problem: "The plan claims both guards test 'the same fixed four-element set', but the two predicates are not the same: change A matches path FRAGMENTS through isProtected() (===, endsWith, includes, basename) while change B is specified as exact-string membership over the raw ## Files text, which is never normalized — so `./.claude/settings.json` or an equivalent spelling evades the setter's refusal while change A still catches it."
  evidence: "Both new branches are membership tests over the **same fixed four-element set**: a path-fragment match in the hook, exact-string membership in the setter."
```

**Concrete consequence:** the evasion does **not** yield a write (`enforce-writes-scope.cjs` normalizes via
`path.resolve` and would deny the odd spelling as out-of-scope, and change A denies the control file
outright), but it defeats **decision 2's stated purpose** — "fail loudly at the setter, not proceed and hit
a wall mid-write." **Suggested build-time hardening, same file, same axis:** normalize the entry for the
**test only** (strip a leading `./`, `path.normalize`) while emitting the value unchanged — layered
**after** the existing empty-scope fail, per L14's compose-never-replace.

### Axis: testability (P1) — griller `pharn/pharn-pipeline/grillers/testability/testability.md`

**Layer 1 (presence):** a verification approach **is** present — `## Evals to write (P1)` at line 78
enumerates concrete deny/allow cases for both guards. **No absence finding.** Presence recognized.

**Layer 2 (adequacy — ADVISORY):**

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/guard-self-protection/PLAN.md:78"
  problem: "The eval section enumerates behavioural cases but declares no coverage mechanism, while the increment's acceptance requires >=90% line coverage on the two touched checkers; the repo has no `npm run coverage` script, so the measurement command is undeclared and the threshold is unowned by any gate."
  evidence: "## Evals to write (P1) — 'Hooks carry no `role:`, so their eval-equivalent is their `*.test.cjs` (the repo's established precedent).'"
```

Also unlisted, and cheap to add: a case pinning that `--allow-claude-dir` **before** the positional
`mode`/`file` args still parses (the plan names the arg-loop hazard in `## Files` but the eval list only
covers the flag's effect, not its position).

### Axis: documentation — griller `documentation`

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/guard-self-protection/PLAN.md:68"
  problem: "pharn/floor/README.md is PRODUCT surface and enumerates the protected set; this increment bumps SKILLS_VERSION, so the release would knowingly ship a product doc whose protected-file list is wrong — it is already stale (omits CODEOWNERS) and this change widens the gap."
  evidence: "`pharn/floor/README.md` — enumerates the protected set and is already stale (omits `CODEOWNERS`); it is outside this increment's approved edit set."
```

The plan handles this honestly (it is named, not hidden), and the edit-set restriction is the human's.
Surfaced so the human can consciously choose: extend the may-edit whitelist by one file, or accept
shipping a known-stale product doc under `2.3.1`.

### Axis: architecture / one-axis-of-change (P3, P7) — inline

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/guard-self-protection/PLAN.md:55"
  problem: "CLAUDE.md was added to ## Files at the GATE-1 halt over the prompt's own conditional, which discovery had evaluated to 'do not touch'; it is repo-meta prose covered by no test, so a wrong statement there ships unguarded and is caught only by human review."
  evidence: "- `CLAUDE.md` — **EDIT** (added at the GATE-1 halt, Q3)."
```

Not a P3 violation — meta-doc sync is L1's prescribed part of the same increment, not a second axis. The
concern is only that this one file's correctness rests entirely on review.

### Axis: operational completeness (P6) — inline

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/guard-self-protection/PLAN.md:1"
  problem: "The plan does not state that AFTER change B lands, this plan's own ## Files can no longer be re-scoped by the ordinary `set-writes-scope.cjs --from-plan` invocation — it names all four control paths, so every later re-scope in this run (a /pharn-dev-ship --loop iteration, or /pharn-dev-regress and /pharn-dev-verify re-setting scope for their own artifacts and then handing back) requires --allow-claude-dir."
  evidence: "'## Corrections to the supplied write procedure' addresses the bootstrap scope's contents but not its re-establishment after the setter changes."
```

This is the self-referential hazard's **second half**: the plan correctly orders the bootstrap _before_
change B, but stops there. The remedy is one sentence in the build procedure, not a design change.

### Axes with no findings against this increment

`a11y`, `i18n`, `migrations`, `performance`, `privacy`, `observability`, `comprehension`, `coupling`,
`error-handling`, `security` — these interrogate **application code** axes (rendering, locale, schema
migration, hot paths, PII, telemetry, exception flow, injection sinks). This increment adds no
application code: it widens one deterministic path denylist and adds one membership test to an existing
stdlib-only parser. Recorded as **no findings**, not as "passed" — the axes do not bind here.

---

## Prose summary

The plan is unusually well-grounded for its stage: the L3 re-audit was actually **run** (104 plans, in a
temp cwd) rather than asserted, and it changed the design — the whole-`.claude/` reading the build prompt
literally specified would have rejected 46 of 104 historical plans, which the GATE-1 halt narrowed to the
4 control files. The guarantee audit already **strikes** the two overclaims that matter most (the Bash
residual and the setter's lexical test), and the eval list routes nothing through a judge — every declared
assertion is an exit code or a file-existence check, i.e. `structural[]`-expressible.

Six concerns, and they cluster in one place: **the plan is more precise about the guards than about the
guards' surroundings.** The two predicates are described as one set when they are two different tests (P0);
the flag that opens guard B is protected against untrusted _artifacts_ but its _invoker_ is writable (P2);
and the plan's own re-scopeability after the change it makes is unaddressed (P6). None of these defeats
the increment — change A holds independently in every one of them, which is exactly the composition the
plan should say out loud rather than leave for a reader to reconstruct.

The one finding that could reasonably change the human's edit set is the `pharn/floor/README.md`
staleness: it is product surface, it is wrong today, and this release bumps the version a user reads.

## Verdict

**ADVISORY VERDICT: 6 concerns raised (0 blocking-severity, 5 important, 1 minor) — for the human to weigh
before `/pharn-dev-build`.**

This log **gates nothing** (fix #3). The deterministic backstops are unchanged and sit downstream:
`/pharn-dev-build`'s spec-hash gate (MATCH above, re-checked there), its refusal on unresolved
`## Open questions (HALT)` (this plan's are RESOLVED at the GATE-1 halt), and `pharn/floor/validate.mjs`.
No wording here means "the plan is good"; it means these questions were asked and recorded.
