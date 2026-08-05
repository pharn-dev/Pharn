# GRILL — guard-coverage

Plan under interrogation: `.dev/features/guard-coverage/PLAN.md` (`trust: untrusted` DATA).
**Spec-hash check (content-hash primitive, surfaced not blocking):** recomputed
`sha256(pharn/ARCHITECTURE.md)` = `a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753` —
**MATCHES** the plan's pin. No drift. (`/pharn-dev-build`'s floor-gate is where drift would block — fix #4.)

**Griller membership (FLOOR — `pharn/floor/count-grillers.mjs`, frontmatter only):** `{"registered":13}`.
**Deterministic plan scanners (`.dev/floor/scan-plan-*.mjs`):** `secrets` `{"found":false}` · `pii`
`{"found":false}` · `i18n` `{"found":false}` · `observability` `{"mentions":false}` · `migrations`
**`{"mentions":true}`** on `PLAN.md:46`, term `"revert"`.

> **The `migrations` hit is a false positive, and saying so is the point of reading it.** The matched
> word is in the plan's own **test procedure** — "revert the ci.yml step, confirm the suite REDs,
> restore" (the L4 measure-it-failing discipline) — not a schema change. The scanner reports **mention
> presence**, which is floor-grade for exactly that property and **not** a finding about the migrations
> axis. This increment changes no schema and has nothing to reverse.

**Injection check:** no instruction-looking content in the PLAN was directed at this griller. Nothing in
the plan moved an enum-gated field below.

---

## Findings (advisory — grouped by axis)

### Axis: discovery-first / verify before assert (P6)

```yaml
- type: FINDING # enum-gated (floor-verifiable, TRUSTED — this griller's own assertion)
  rule_id: "P6"
  severity: important
  file: ".dev/features/guard-coverage/PLAN.md:16"
  problem: "The plan's stated reason for passing `--base 0562f9e` is wrong about WHEN /pharn-dev-regress auto-detects, so a correct instruction is resting on an incorrect premise."
  evidence: "'Auto-detection would resolve `base = git merge-base HEAD origin/main = c0ca610` on this now-clean tree'. But /pharn-dev-regress runs AFTER /pharn-dev-build, which writes the plan's `## Files` — so `git status --porcelain` is NON-empty at that moment and the first branch of the state test fires: `base = HEAD` = 0562f9e. The tree is clean NOW, at plan time; it will not be clean at regress time."
```

**Why it still matters even though the action is right.** The prescribed `--base 0562f9e` and the
auto-detected base **coincide** — so the run will be correct either way. But the plan justifies the flag
with a repo-state claim that does not hold at the moment the stage executes, which is P6's exact failure
shape ("verify before assert"), and it is the kind of reasoning that stops coinciding the moment
something shifts (e.g. a build that writes nothing, leaving the tree clean and the merge-base branch
live). Fix: keep the explicit `--base`, correct the reason to "belt-and-braces — the auto-detect would
also yield 0562f9e once the build dirties the tree, but the base is too load-bearing to leave implicit."

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/guard-coverage/PLAN.md:68"
  problem: "`## Open questions (HALT)` entry 1 was ANSWERED by the human at GATE 1, but the plan still presents it as open — and /pharn-dev-build's Step 1.1 HALTs on an unresolved open question."
  evidence: "'1. The `package.json` `&&`-unbundle was selected at the scoping question and is NOT in `## Files`. … **This is the human's call at GATE 1**'. The human then approved the plan *as written*, which IS the answer — but the section reads unchanged, so the next stage cannot tell a live question from a settled one."
```

**This one has teeth for the very next stage.** `/pharn-dev-build` Step 1.1: "If it has unresolved
`## Open questions (HALT)` → **HALT**; it is not approved." A build that reads this section literally
either halts on a settled question or learns to skim the section — and the second outcome is worse,
because it trains the stage to ignore the one field that exists to stop it. Fix: record the GATE-1
resolution **inline** in the entry ("RESOLVED at GATE 1: approved as written — the unbundle stays out"),
exactly as the previous increment's plan did for its two questions.

### Axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/guard-coverage/PLAN.md:51"
  problem: "The plan's honest-limits list for the new ✧ test names only HARNESS-layer escapes and omits an IN-REPO one the test could actually have covered: the step's `if:` condition."
  evidence: "'It cannot verify GitHub actually executed the step, that the job was not skipped by an `if:` condition, or that branch protection requires the check. Those are **harness-layer** facts outside the repo'. The `if:` condition is NOT outside the repo — the live step carries `if: ${{ always() && steps.install.outcome == 'success' }}` in ci.yml:37, the same file the test reads."
```

Filing an in-repo weakness under "harness-layer, outside the repo" is a category error that makes the
residual sound more irreducible than it is. A future edit to `if: false` (or to a condition that never
holds) would leave `npm run docs:check` present in the file, the ✧ test green, and the guard dead — the
precise failure this increment exists to prevent, one level down. The honest options, either acceptable:
tighten the assertion to also pin the step's condition, or keep the single regex and **reclassify** this
escape as in-repo-and-unpinned. What must not stand is the current wording.

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/guard-coverage/PLAN.md:20"
  problem: "The increment pins the WIRING but leaves the CLAIM unpinned, so L2's failure class can recur one remove away — a future CLAUDE.md edit could re-broaden the assertion with nothing noticing."
  evidence: "`## Files` pins ci.yml with a ✧ test; CLAUDE.md is edited as prose with no corresponding guard. The defect being repaired was a DOC claiming a CI guarantee — and the repair makes the guarantee real without making the claim checkable."
```

Surfaced, not demanded: pinning doc prose is brittle and the cure can be worse. But it is worth the
human knowing that this increment closes the gap for _this_ claim, not for the _class_ of claim, and that
L2's remedy remains a `/pharn-dev-review` sub-check rather than a floor op.

### Axis: testability (P1) — the registered `testability-griller`'s procedure, applied

**Layer 1 (presence): PRESENT — no absence finding.** `## Evals to write (P1)` structurally declares a
verification approach: it explains why P1's eval obligation does not bind (no `role:`-bearing capability;
`.claude/commands/` and `.dev/` are both outside `validate.mjs`'s scan), names the one added `node --test`
guard, and — notably — **commits to measuring it failing first** (L4), which the previous increment did
for its wiring guard and which is the only thing that distinguishes a real guard from an authored one.

**Layer 2 (adequacy) — ADVISORY:** the assertion is a single regex over one string. It does not pin the
step's name, its position relative to Install, or its condition (see the P0 finding above). For a guard
whose entire job is "notice when CI stops running the checker," that is thin — though defensibly so,
since a stricter assertion is also more likely to fail on a benign workflow reformat.

### Axis: one axis of change (P3)

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/guard-coverage/PLAN.md:21"
  problem: "`lessons-index-core.test.mjs` will hold FOUR repo-integration guards while its name says it tests the core module — the file's stated axis and its actual contents have diverged."
  evidence: "'Joins the three ✧ guards already in this file (`TYPE_ENUM` equality, the `package.json` wiring, the two style-ignore entries)'. Of those three, only TYPE_ENUM concerns the core module; the other two assert repo configuration, and the new one asserts CI configuration."
```

Not a violation — `.dev/floor/` is apparatus, outside the `pharn/ARCHITECTURE.md §4` layer tree, and
keeping the ✧ family together is a real cohesion argument. Recorded because the drift is now visible in
the filename, and the cheap remedy (a section comment naming the two groups, or a sibling
`lessons-index-integration.test.mjs`) costs almost nothing if taken now rather than at guard seven.

### Axis: honest scope / no speculation (P7)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/guard-coverage/PLAN.md:23"
  problem: "The `/pharn-dev-plan` indentation repair is a cosmetic fix to an unrelated file, bundled into a guard-coverage increment."
  evidence: "'`.claude/commands/pharn-dev-plan.md` — EDIT. Repair the `markdownlint --fix` indentation regression at Step 1.4'. Nothing about it concerns CI wiring or the CLAUDE.md claim; it is carried over from the previous increment's review as an unrelated advisory finding."
```

Weak as a criticism and stated as such: it is a two-line repair of damage this pipeline itself caused
last run, in a file the increment already touches nothing else in. The counter-argument — leaving a known
prose defect in a **command** file, where indentation is the scoping cue an agent reads, is worse than a
small bundle — is at least as strong. Noted for completeness, not pressed.

### Axes with no findings (stated, not silently omitted)

- **Trust propagation (P2) — clean.** The plan correctly identifies that this increment ingests **no new
  untrusted artifact** (it reads repo-controlled workflow/config files), that the new guard's verdict
  ranges over a regex match on bytes rather than prose meaning, and that the previously-shipped index's
  taint path is unchanged. `scan-plan-secrets` and `scan-plan-pii` both `{"found":false}`.
- **Determinism (P5) — clean.** The one new branch is a regex membership test; the terminal fallback is
  routed to a human at GATE 1 (the narrowed `package.json` item) and GATE 2. No LLM classification drives
  anything.
- **Eval coverage (P1) — no binding to check.** No Capability, no `enforces`, so no `rule_id`↔eval
  binding exists; the floor will agree (`validate.mjs` never enumerates these files). The structural /
  semantic split of `eval-format.md` does not apply — the added guard is wholly deterministic, with
  nothing routed to a judge.
- **a11y / i18n / migrations / observability / performance / privacy / comprehension / documentation /
  security / coupling — no findings.** Four are floor-scanned above (with the `migrations` mention
  explained as a false positive). The rest do not bind an increment that changes one CI step, one test,
  and three documents — no user-facing surface, no schema, no runtime path, no personal data.

---

## Summary

The plan is unusually well-grounded — it was written against live reads (the CI gap confirmed by grep,
the OS targets checked before rejecting the POSIX-arithmetic remedy), it declares a lesson it
**refused** to follow blindly (L16, as the reason NOT to unbundle `docs:check`), and it states the new
guard's limits rather than selling it as complete. Three of the six concerns below are about **precision
in the plan's own honesty**, which is the right failure mode to have.

The two that should be fixed before or during the build are cheap and concrete: **the settled open
question must be marked settled** (`/pharn-dev-build` Step 1.1 reads that section as a halt condition), and
**the `if:`-condition escape must move out of the "harness-layer" bucket**, because filing an in-repo,
pinnable weakness as irreducible is the same category of overstatement this increment exists to correct.
The base-detection rationale (F1) is wrong but self-cancelling — worth fixing so it does not become
load-bearing later.

---

**ADVISORY VERDICT: 6 concerns raised (0 blocking-severity, 3 important, 3 minor) — for the human to
weigh before `/pharn-dev-build`.**

This grill-log **gates nothing**. Every finding rests on this griller's judgment; the `severity` values
are advisory assignments (fix #3), and grillers as a class never gate. The only floor-grade results in
this run are the griller-membership count, the five `scan-plan-*` exits, and the spec-hash comparison —
and even the hash only _warns_ here; `/pharn-dev-build` is where drift blocks. "Grilled" never means "the
plan is sound" (P0).
