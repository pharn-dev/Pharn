# PLAN — writes-scope-lifecycle

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4, pharn/ARCHITECTURE.md
- applied_lessons: [L1, L3, L4, L7, L8, L13, L18, L19, L20, L22, L25]
- increment: Give `set-writes-scope.cjs` a `--clear` flag, add a pinned terminal cleanup step to the 17 commands that set a scope, and make the writes-scope deny message name the active scope's origin (`set_by` / `set_at`) plus the real remedy — so a finished command's scope stops silently denying ordinary work in later sessions.
- layer(s): floor / `.claude/` product surface (not a `pharn/` capability layer) # pharn/ARCHITECTURE.md §2, §4
- constitution_refs: [P0, P2, P5, P6, P7]

## Applied lessons

- **L1** — the meta-doc sweep ran. This increment changes facts asserted in `CLAUDE.md`
  (`:302` — "delete it to reset to fail-closed" becomes one of two supported resets), `SKILLS_VERSION`,
  the `README.md` shields badge (forced by `check-version-badge.mjs`), and `CHANGELOG.md`. All four are
  named in `## Files` rather than left to drift.
- **L3** — the declaration re-audit ran **before** the new lifecycle step is made routine: all 19
  `.claude/commands/*.md` were scanned live for setter invocations (anchored count, not a prose grep),
  giving 17 invokers and 2 non-invokers (`pharn-review.md`, `pharn-dev-eval.md`). The cleanup line is
  added to exactly the 17, and the new coverage test's membership rule is **conditional on invoking**,
  so the 2 non-invokers are not converted into a guaranteed failure by a rule that never applied to them.
- **L4** — the new tests are treated as **authored-to-pass until measured**. Every `--clear` assertion
  is written against behavior that does not exist yet, so the build must first measure each new test
  **failing** against the still-unpatched hooks (the rejection measurement), and only then hand the
  human the diffs. An assertion that cannot fail is worthless. Declared here because the plan's body
  relies on it in `## Open questions` resolution 2 — surfaced by `GRILL.md` (P1 finding), where a
  cited-but-undeclared lesson is a gap `check-plan-lessons.mjs` structurally cannot see.
- **L7** — `## Files` declares exactly the paths this increment writes and nothing aspirational. The two
  hook scripts are human-applied and therefore sit in the exclusion **heading**, not in the write list.
- **L8** — the setter narrows one `--target` per call and each call overwrites the scope file. `--clear`
  is designed to take **no** `--target` and to be a whole-file operation, so it composes with that
  mechanic instead of fighting it; and because each command's first-step _set_ still overwrites a
  leftover scope, a skipped cleanup degrades to today's behavior rather than to a new failure.
- **L13** — this stage formats its own artifact (`prettier` + `markdownlint-cli2 --fix` over this
  `PLAN.md` alone) before halting.
- **L18** — the exclusion block below is a real `###` **heading**, not a bold prose intro, so
  `set-writes-scope.cjs --from-plan` structurally ends the authorized list there.
- **L19** — the formatter invocations are scoped to this stage's own artifact by path; no repo-wide
  `prettier --write .` is run. The two `.patch` records are Bash-written artifacts outside the Write-tool
  gate and are **declared** in `## Files` rather than pretended to be gated.
- **L20** — this is the increment's central design decision. Part (b) as requested is a
  **discipline-only** remedy replicated across 17 files, which is precisely the shape L20 says will
  recur. It is escalated here into a deterministic check: a new test asserts that **every** command file
  containing an anchored setter invocation also contains an anchored `--clear` invocation — set
  membership, `pharn/ARCHITECTURE.md §2` primitive #3, no new floor primitive. Also applied
  mechanically: after this PLAN is written the setter is re-run `--from-plan` and its **printed path
  count is read against the declared paths** as a checkable number.
- **L22** — the cleanup step is a **pinned literal command line**, byte-identical in all 17 files
  (`node .claude/hooks/set-writes-scope.cjs --clear`), never prose describing what to run. L22's whole
  point is that a described technique gets implemented wrong repeatedly; 17 copies is the worst possible
  place to leave a choice open.
- **L25** — a rationale that lives only in the file it sits in has no reach, and 17 byte-identical
  copies are exactly the shape where no reviewer diffing them sees anything anomalous. So the
  _enforceable_ half (the L20 coverage test) carries the guarantee, and the header comment on `--clear`
  is written to name **both** failure directions it must survive — the `{"scope": []}` trap and the
  Bash-escape bound — rather than the one that happened to be noticed.

## Discovery (P6 — read live this run, never asserted from memory)

**Baseline, measured this run:** `npm run check` 0-fail (`node --test` **1455/1455**);
`node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities checked`; working tree clean at
`cd24dee`; `SKILLS_VERSION` `2.7.5`; README badge `pharn-2.7.5`.

**Correction to the task's stated repro (P6 — verified, not assumed).** `.pharn/writes-scope.json` was
**absent** at the start of this run, so the "live now" repro could not be reproduced as written; it was
reproduced by first re-creating a finished command's leftover scope. More importantly, the task's chosen
example does **not** demonstrate the defect it is offered for:

```text
scope ABSENT (fail-closed safe-set)        CHANGELOG.md            -> exit 2
scope = [".dev/features/demo-stale/SHIP.md"]  CHANGELOG.md         -> exit 2
```

`CHANGELOG.md` is a root file, and root files are outside `DEFAULT_SAFE_SET`
(`enforce-writes-scope.cjs:71`), so it is denied in **both** states — it is not evidence of "stricter
than the default". The defect is real and was reproduced with paths the safe-set actually allows:

```text
                                            scope ABSENT   scope = [SHIP.md]
.dev/features/other-feature/PLAN.md              0                2
features/some-feature/SPEC.md                    0                2
pharn/pharn-core/x.md                            0                2
```

Three paths the fail-closed default **permits** are denied by a finished command's leftover scope. That
is the defect, stated exactly.

**The deny message today** names the active scope but never says **who** set it or **when**, and none of
its three FIX bullets mentions staleness; the only reset is a trailing clause on the last line
("delete to reset"). Reproduced verbatim this run.

**Scope-file shapes — the `--clear` design fork, measured rather than reasoned:**

```text
record                              .dev/features/x/PLAN.md   features/y/SPEC.md   .pharn/scratch.txt
{"scope": []}                              2                        2                     0
{"scope": null, "cleared_at": "x"}         0                        0                     0
file ABSENT                                0                        0                     0
```

`{"scope": []}` is a **live trap**: `loadScope()` returns an empty array, which is truthy, so
`allow = [...ALWAYS]` and everything outside `.pharn/**` is denied — **stricter** than the stale scope
the flag exists to remove. `{"scope": null}` and deletion both fall back to the safe-set correctly, and
`{"scope": null}` does so with **no change to `enforce-writes-scope.cjs`** at all.

**Setter-invocation census (anchored on `^\s*node \.claude/hooks/set-writes-scope\.cjs`, not a prose
grep — L6):** 17 command files invoke the setter (9 product `pharn-*`, 8 dev `pharn-dev-*`);
`pharn-review.md` and `pharn-dev-eval.md` do not. Zero occurrences of `--clear` exist anywhere in the
repo today.

**A verified placement trap.** `/pharn-dev-memory-promote` and `/pharn-memory-promote` **write after**
their human accept/deny halt (`pharn-dev-memory-promote.md:201` Step 5 HALT → `:212` Step 6 "Write on
accept"). A cleanup step placed at the halt would clear the scope the gated canon write depends on and
the write would be **denied**. The rule is therefore "last step, after every write the command performs
— including writes after a human gate", not "at the halt".

**The task's "coordinate with H7/N1" is unresolvable from live state, and is recorded rather than
passed over (P6).** A live grep for `H6` / `H7` / `N1` across every `*.md` in this repo returns
**nothing**: these ids belong to an external audit with no artifact here, so there is no H7 or N1 change
to `denyMessage()` for this increment to coordinate **with**. The bound this leaves is stated rather
than hidden: if those fixes exist outside the repo and also edit `denyMessage()`, this increment's patch
will conflict textually with them, and the resolution is a human merge — not something this plan can
pre-empt. The patch is therefore kept **minimal and additive** inside `denyMessage()` (append a
staleness block; do not restructure the existing three FIX bullets), so a later diff has the smallest
possible surface to collide with. Surfaced by `GRILL.md` (P6 finding).

**Protection boundaries, probed live against `protect-trusted-paths.cjs`:**

```text
.claude/hooks/set-writes-scope.cjs        -> 2  (human-only)
.claude/hooks/enforce-writes-scope.cjs    -> 2  (human-only)
.claude/hooks/set-writes-scope.test.cjs   -> 0  (agent-writable)
.claude/commands/pharn-dev-plan.md        -> 0  (agent-writable)
CHANGELOG.md, SKILLS_VERSION              -> 0  (agent-writable)
```

## Files

- `.claude/hooks/set-writes-scope.test.cjs` — the `--clear` cases (clears a present scope; idempotent no-op when absent; a subsequent `enforce` allows a safe-set path and denies an out-of-set one; `--clear` refuses to combine with `--from-plan`/`--from-frontmatter`/`--target`; the `{scope: []}` trap; a non-ENOENT unlink failure) — layer floor-tests
- `.claude/hooks/writes-scope-release.test.cjs` — **added at GATE 2** — the L20 corpus invariant in its own file (declaration + ordering + the non-vacuity guard), moved out of the setter's suite so neither file carries two axes of change; the dedicated-file precedent is `.dev/floor/entry-point-guard.test.mjs` — layer floor-tests
- `.claude/hooks/enforce-writes-scope.test.cjs` — add the deny-message cases: `set_by` / `set_at` and the staleness line are present when a scope file is present; absent-scope message is unchanged; a hostile `set_by` is rendered as sanitized DATA (control chars stripped, length capped) — layer floor-tests
- `.claude/commands/pharn-spec.md` — terminal cleanup step (product) — layer product-command
- `.claude/commands/pharn-plan.md` — terminal cleanup step (product) — layer product-command
- `.claude/commands/pharn-grill.md` — terminal cleanup step (product) — layer product-command
- `.claude/commands/pharn-build.md` — terminal cleanup step (product) — layer product-command
- `.claude/commands/pharn-regress.md` — terminal cleanup step (product) — layer product-command
- `.claude/commands/pharn-verify.md` — terminal cleanup step (product) — layer product-command
- `.claude/commands/pharn-ship.md` — terminal cleanup step (product) — layer product-command
- `.claude/commands/pharn-loop.md` — terminal cleanup step (product) — layer product-command
- `.claude/commands/pharn-memory-promote.md` — terminal cleanup step, placed **after** the Step-6 canon write, not at the Step-5 halt (product) — layer product-command
- `.claude/commands/pharn-dev-plan.md` — terminal cleanup step (dev) — layer dev-command
- `.claude/commands/pharn-dev-grill.md` — terminal cleanup step (dev) — layer dev-command
- `.claude/commands/pharn-dev-build.md` — terminal cleanup step (dev) — layer dev-command
- `.claude/commands/pharn-dev-regress.md` — terminal cleanup step (dev) — layer dev-command
- `.claude/commands/pharn-dev-verify.md` — terminal cleanup step (dev) — layer dev-command
- `.claude/commands/pharn-dev-review.md` — terminal cleanup step (dev) — layer dev-command
- `.claude/commands/pharn-dev-ship.md` — terminal cleanup step (dev) — layer dev-command
- `.claude/commands/pharn-dev-memory-promote.md` — terminal cleanup step, placed **after** the Step-6 canon write, not at the Step-5 halt (dev) — layer dev-command
- `.dev/features/writes-scope-lifecycle/set-writes-scope.patch` — the unified diff adding `--clear`, recorded so the ship trail is self-contained — layer dev-artifact
- `.dev/features/writes-scope-lifecycle/enforce-writes-scope.patch` — the unified diff adding the staleness hint to `denyMessage()` — layer dev-artifact
- `SKILLS_VERSION` — `2.7.5` → `2.7.6` (patch: lifecycle-hygiene correction to product `.cjs` hook and product `pharn-*` command bytes that already shipped) — layer product-surface version
- `README.md` — the shields badge `pharn-2.7.5` → `pharn-2.7.6`, forced by `check-version-badge.mjs` (a live `npm run check` **and** `ci.yml` gate) — layer repo-meta
- `CHANGELOG.md` — one `### Fixed` entry under `[Unreleased]` recording the stale-scope defect, the three-part fix, and its honest bounds — layer repo-meta
- `CLAUDE.md` — the "Writes-scope (fix #7 — fail-closed)" section (`:302`) gains `--clear` as the supported reset alongside deletion, and the terminal-cleanup convention (L1) — layer repo-meta

### Deliberately NOT in scope

- `.claude/hooks/set-writes-scope.cjs` — **HUMAN-ONLY.** `fix #2` denies the agent at exit 2, verified
  live this run. The `--clear` change is delivered as a unified diff for a human to apply.
- `.claude/hooks/enforce-writes-scope.cjs` — **HUMAN-ONLY**, same guard, same delivery. The
  `denyMessage()` staleness hint is delivered as a unified diff.
- `.claude/settings.json` — no new hook is wired. A `SessionStart` hook that cleared the scope at every
  session start would be a **stronger** fix for the "later sessions" half of this defect than a
  discipline-only cleanup step, and it is recorded here as a named follow-up
  (`session-start-scope-clear`) rather than smuggled in: it is a second axis of change (P3), it edits the
  guards' control surface, and P7 wants the cheaper remedy measured first.
- `DEFAULT_SAFE_SET` in `enforce-writes-scope.cjs` — **not widened**, per the task. The defect is
  lifecycle hygiene plus a truthful message; widening the default would paper over it and would weaken
  fix #7's fail-closed posture for every run.
- The byte-exact `rel === SCOPE_FILE` self-guard in `enforce-writes-scope.cjs` — **stays**, untouched
  (defense in depth).
- `.claude/commands/pharn-review.md`, `.claude/commands/pharn-dev-eval.md` — the 2 commands that never
  invoke the setter. Adding a cleanup line to a command that sets no scope would be aspirational (L7).
- `pharn/CONSTITUTION.md`, `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`, `LIMITS.md` — trusted docs,
  human-only; nothing here needs them changed.
- `docs/capabilities/**` and the README `CURRENT-STATE` region — the catalog renders command **counts
  and names** (`.dev/floor/capability-catalog-core.mjs:447-448`); adding a step to a command body
  changes neither, so `docs:check` is expected to stay GREEN. Re-run `npm run docs:generate` only if it
  does not (verified at build, not assumed here).

## Contracts satisfied

- No `pharn/pharn-contracts/*` contract is amended. The change extends an existing floor hook's CLI and
  an existing hook's human-facing message, so `pharn/ARCHITECTURE.md §2` primitive #1 (hooks) and
  primitive #3 (enum/regex membership) are **cited, not restated** (P4).

## Evals to write (P1)

- **None, and the absence is reasoned, not an omission.** P1 attaches to a Capability — a `.md` file
  whose frontmatter carries a `role:`. This increment adds no `role:`-bearing file and no `rule_id`, so
  no `evals/cases/*` + `evals/expected/*` pair is owed. The hooks' regression suites are their
  `*.test.cjs` files, and the new cases listed in `## Files` are that suite's equivalent obligation.

## Guarantee audit (P0)

- **With no usable scope file present, the guard allows exactly the fail-closed default-safe-set** →
  **FLOOR: hook** (primitive #1). Measured live in the fork table above, per record shape. **This is a
  property of the READER (`enforce-writes-scope.cjs`), and the split matters:** `--clear`'s own act —
  deleting `.pharn/writes-scope.json` — is a **Bash** write that no `PreToolUse` hook gates, so
  **`--clear` itself is ADVISORY**; it merely produces the absent-file state whose consequence is floor.
  Write "absence of a scope file = the safe-set" (floor), never "`--clear` guarantees the safe-set"
  (it does not; an unrun step clears nothing). _Corrected at GATE 2 — `GRILL.md`'s first P0 finding named
  this conflation and the original line reduced the flag itself to the hook._
- **Every command that sets a scope also declares a `--clear` release step, ordered after every set** →
  **FLOOR: enum/regex** (primitive #3) via the new coverage test, whose verdict is floor-grade through
  `npm test`'s membership in `check-verify.mjs`'s gate map. **NARROWED, and this is the honest half:** it
  proves the pinned line is **present in the command's prose and correctly ordered**, never that the
  agent **ran** it. That is the same declaration-vs-application split `check-plan-lessons.mjs` already
  labels advisory. Write "every setter-invoking command declares the release step", never "every run
  releases".
- **A finished command leaves no stale scope** → **ADVISORY.** The cleanup step is agent-executed
  orchestration; nothing on the floor forces it, and an early abort, a crash, or an interrupted turn
  skips it. It degrades safely — the next command's first-step _set_ overwrites a leftover scope, which
  is exactly today's behavior — but it is not a guarantee, and the deny message must not imply it is.
- **The deny message names the stale scope's origin and the real remedy** → **ADVISORY.** It is prose
  read by a human; no gate reads it. Its **accuracy** is floor-adjacent only in that `set_by` / `set_at`
  are copied verbatim from the scope record rather than composed.
- **The echoed `set_by` / `set_at` cannot inject instructions into the reader** → **FLOOR: enum/regex**
  (primitive #3), by stripping control characters and capping length before rendering. See the trust
  audit — this is a widening the task did not name, so it is closed here rather than shipped open.
- **`SKILLS_VERSION` and the README badge agree** → **FLOOR: enum/regex**
  (`.dev/floor/check-version-badge.mjs`, wired in `npm run check` and as its own `ci.yml` step).
- **The bump is the right SemVer size, and the CHANGELOG / `CLAUDE.md` prose is true** → **ADVISORY.**
  No checker reads either; a wrong-sized bump with a matching badge stays GREEN.
- **Nothing here is a new floor primitive.** One flag is added to an existing hook CLI, one membership
  test to an existing suite (P7).

## Trust audit (P2)

- **Input:** the H6 task text is `trust: untrusted` prose. Every factual claim in it was treated as DATA
  and **re-verified live** rather than believed — which is how the `CHANGELOG.md` example and the
  "live now" framing were both found to be wrong (see `## Discovery`). No instruction inside it steers a
  gate; the proceed/stop decisions in this run rest only on exit codes.
- **New taint path this increment creates, and closes.** `denyMessage()` currently echoes `scope[]`
  verbatim; adding `set_by` / `set_at` widens what a crafted `.pharn/writes-scope.json` can push into a
  deny message. That message is returned to the **agent** as a tool result, not only shown to a human,
  so it is an injection surface. `.pharn/**` is Bash-writable and outside the `PreToolUse` gate, so the
  record's provenance is not guaranteed. Both echoed fields are therefore rendered as sanitized DATA
  (control chars stripped, length capped) and no branch anywhere reads them. Pre-existing for `scope[]`;
  not made worse, and the new fields ship closed.
- **Output taint:** none propagates into control flow. This increment's decisions are exit codes and
  path sets — enum-gated and floor-verifiable throughout.

## Determinism audit (P5)

- Every branch this increment adds is a membership test: `--clear`'s argv flag membership; the coverage
  test's anchored-pattern presence over `.claude/commands/*.md`; the enforce hook's existing glob
  membership; `check-version-badge`'s string compare. No LLM classification drives any branch.
- The terminal fallback is **ask**: the two unresolved items below are put to the human, not guessed.

## Open questions (RESOLVED at GATE 1 — recorded verbatim, not re-decided)

Both were put to the human as selectable forms at the plan halt and answered before `/pharn-dev-grill`
was invoked. They are recorded here because `/pharn-dev-build` Step 1 HALTs on an **unresolved** HALT
block, and a plan whose questions were answered off-document would read as unapproved.

1. **What does `--clear` do to `.pharn/writes-scope.json` — delete it, or write an explicit
   "no active scope" tombstone?** Both work; the measured fork table above is the evidence.
   A `{"scope": null, "cleared_by", "cleared_at"}` tombstone was the defensible alternative — it keeps
   an audit trail and also needs no `loadScope()` change — but it leaves a file whose deny message still
   reads "(none set)", so the trail has no reader. **`{"scope": []}` was not an option in either case**
   — it denies everything outside `.pharn/**`, measured above.
   - **RESOLVED — "Delete the file."** `--clear` removes `.pharn/writes-scope.json` when present and is
     an **idempotent no-op (exit 0)** when already absent. This matches the reset
     `enforce-writes-scope.cjs:148` and `CLAUDE.md:302` already document, requires **no change to
     `loadScope()`**, and reuses the absent-file path the existing 41 enforce tests already cover. The
     flag takes no `--target` and refuses to combine with `--from-plan` / `--from-frontmatter`.
2. **When does the human apply the two hook diffs?** The new `--clear` tests hard-code the post-patch
   behavior, so they **fail against the unpatched setter** — deliberately (an assertion that cannot fail
   is worthless, L4). Applying both diffs **before** `/pharn-dev-build` lets the chain run clean in one
   pass; applying them after means `/pharn-dev-verify` returns FAIL and the chain STOPs until they land.
   - **RESOLVED — "Apply before `/pharn-dev-build`."** The ordering is: `/pharn-dev-grill` (advisory) →
     the build emits the two `.patch` records and the tests → **the L4 rejection measurement is taken
     against the still-unpatched hooks while they are live** (the only cheap moment to take it) → the
     human applies both diffs by hand → the chain continues through regress / verify / review. The agent
     never writes either hook; `fix #2` denies it at exit 2, verified live this run.

## GATE-2 disposition of `GRILL.md`'s nine findings

Recorded because `/pharn-dev-review` found three of them neither addressed nor dispositioned, and a
reader cannot otherwise tell a considered rejection from an oversight. The `entry-point-guard`
increment's iteration-2 table is the precedent.

| #   | axis    | finding                                                                           | disposition                                                                                                                                |
| --- | ------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | P0      | `--clear` reduced to FLOOR, conflating the Bash delete with the reader's fallback | **FIXED at GATE 2** — the guarantee-audit entry above now splits reader-floor from flag-advisory                                           |
| 2   | P0      | coverage test blind to PLACEMENT                                                  | **FIXED in build** — a second `✧` test asserts the release line follows every set invocation                                               |
| 3   | P1      | L4 cited in the body, absent from `applied_lessons`                               | **FIXED at GATE 1** — `L4` declared, with a body line                                                                                      |
| 4   | P2      | new fields sanitized, pre-existing `scope[]` echo left raw                        | **FIXED in build** — `asData()` covers every echoed value                                                                                  |
| 5   | P5      | the test's matchers described in prose, not pinned                                | **FIXED in build** — `SET_LINE` / `CLEAR_LINE` are pinned literal regexes                                                                  |
| 6   | P6      | the task's "coordinate with H7/N1" unaddressed                                    | **FIXED at GATE 1** — recorded as an external audit absent from this repo, with the minimal-additive patch consequence stated              |
| 7   | P3      | corpus invariant housed in the setter's test file                                 | **FIXED at GATE 2** — moved to `.claude/hooks/writes-scope-release.test.cjs`                                                               |
| 8   | P0 / L2 | patches must amend the hooks' own header prose                                    | **FIXED in build** — both patch records carry a rationale header; the setter's usage block and `enforce`'s header both document the change |
| 9   | P7      | escalating to a coverage test pre-emptively                                       | **ACCEPTED, reasoning now recorded** — see below                                                                                           |

**On #9 (P7 — the reasoning the grill asked for, not merely the assertion).** P7 requires a real
failure, never a hypothetical. The triggering failure here is **not** hypothetical and **not** this
increment's own cleanup step: it is L20's recorded recurrence — L18's discipline-only remedy failed on
the very next plan that could exercise it. L20's promoted text does not say "a discipline remedy may
recur"; it says the **second occurrence is the trigger to give it a floor check**, and it names the
class ("a lesson whose only remedy is discipline"), not one instance. Part (b) as requested creates a
**new** member of exactly that class, replicated across 17 files — the largest discipline surface this
repo has. Adding the check at authoring time is therefore **applying** a promoted lesson to a
qualifying case, not speculating about a fresh one. The honest bound is stated in the guarantee audit
and repeated in every shipped copy: the check proves **declaration and ordering**, never execution.

## Follow-ups (named, not built — P7)

- **`session-start-scope-clear`** — a `SessionStart` hook that clears a leftover scope at every session
  start. A **stronger** remedy than this increment's cleanup step for the "later sessions" half of the
  defect (a mechanism, not discipline), deliberately deferred: it is a second axis of change (P3), it
  edits the guards' own control surface (`.claude/settings.json`), and P7 wants the cheaper remedy
  measured in real runs first. **Reopens when** a run is observed where the cleanup step was skipped and
  a later session hit the stale scope anyway.
- **`writes-scope-bash-escape`** — `--clear`, like every other setter invocation, is a **Bash** call, so
  it is outside the `PreToolUse` gate entirely (L19). Nothing changes that here; it is restated so the
  cleanup step is not misread as a gated operation.
