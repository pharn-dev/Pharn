# PLAN — dev-lessons-index-gate

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L1, L6, L7, L19, L20, L22, L25, L27, L29, L30]
- increment: Backport the product side's lessons-index freshness gate to the dev side — `/pharn-dev-plan` invokes `.dev/floor/check-lessons-index.mjs` and branches on its exit code, `/pharn-dev-memory-promote` regenerates the derived index after an accepted promotion, and a materialized set in `command-hygiene.test.mjs` pins all four members so the wiring cannot silently un-wire.
- layer(s): build apparatus (`.claude/commands/` + `.dev/floor/`) — no `pharn/` layer is touched
- constitution_refs: [P0, P4, P5, P6, P7]

## Applied lessons

- **L30** — This increment's defect IS L30's shape. The dev sweep **names** the staleness condition
  ("If the index is stale or absent, fall back to reading canon in full") and **asks** the agent to
  notice it, while invoking nothing that could tell it — the pure-ASK half of a step whose other halves
  (the `hash-doc.mjs` pin, the Step-4 `check-plan-lessons.mjs` self-check) are real command blocks and
  make the step **read** as mechanized. The remedy is L30's: the gate the step names is a gate the step
  **invokes**, and the set is materialized once.
- **L29** — The remedy is quantified over a set, so the **enumeration is the deliverable**. The set is
  the four lessons-index wiring sites `{pharn-plan, pharn-dev-plan}` (read side) ∪
  `{pharn-memory-promote, pharn-dev-memory-promote}` (refresh side). Today the two **product** members
  are wired and the two **dev** members are not — "a rule applied to half its domain" verbatim. So the
  test ships as one `LESSONS_SWEEP_WIRING` array the rules **iterate**, never as assertions authored per
  member; a fifth site added later inherits every rule for free.
- **L20** — The product side shipped this remedy as **prose only** (no wiring test), and the dev half
  was then simply never written — which is the recurrence L20 predicts for a discipline-only remedy.
  Second occurrence ⇒ give it a check. The check is set membership over command prose in an **existing**
  test file, adding **no** new floor primitive and no new checker.
- **L22** — Prescribe the **literal command line**, never a described technique. Both new blocks are
  exact, copy-pasteable invocations with the wrong forms named beside them (`npm run docs:generate` is
  named and **rejected** for Step 6b, with the reason), so nothing is left to choose.
- **L19** — Canon names **this exact case**: _"regenerating `docs/lessons-index.md` after a promotion is
  a Bash write outside any declared scope; the remedy there is to **declare it**, not to pretend the
  gate covered it."_ Step 6b therefore declares the escape in its own prose and in the guarantee audit,
  rather than leaving a reader to find it in a diff.
- **L7** — `writes:` must equal exactly what the stage writes. Step 6b's target (`docs/lessons-index.md`)
  is written through **Bash**, so it is deliberately **not** added to `/pharn-dev-memory-promote`'s
  `writes:` — declaring it there would be a false claim that the pre-write hook covers it, and would
  over-declare a scope the Write tool never uses.
- **L6** — Read a structural fact from its structured location. The branch reads the checker's **exit
  code** (the structured verdict), never a grep over its printed report. The `[MISSING|DRIFT|ENUM_ERROR]`
  token shapes only the human-facing remedy sentence and is explicitly barred from the branch.
- **L27** — Reachability per branch. On `ENUM_ERROR` the remedy `npm run docs:generate` **cannot
  succeed** (the generator refuses the same invalid canon), so that branch must not print it — the
  checker already gets this right, and the command prose must not re-introduce the unreachable advice.
- **L25** — Make the rationale enforceable rather than trusting a comment to reach. The "why" lives in
  the test's materialized set, which fails, rather than only in prose a future reword can drop.
- **L1** — Meta-doc sweep: this increment changes no fact asserted in `CLAUDE.md` (which already
  describes the dev index and `docs:check`), so no meta-doc is in `## Files`. `CHANGELOG.md` gets an
  `[Unreleased]` entry; **no `SKILLS_VERSION` bump** — every file is apparatus (`pharn-dev-*` commands
  and a `*.test.mjs`), none of it ships.

## Files

- `.claude/commands/pharn-dev-plan.md` — Step 1.4: add the `.dev/floor/check-lessons-index.mjs`
  invocation + exit-code branch ahead of the existing two-step sweep; add the checker to `reads:` —
  layer: apparatus
- `.claude/commands/pharn-dev-memory-promote.md` — add `### Step 6b — Refresh the lessons index`
  after the Step-6 format block and before the final release step — layer: apparatus
- `.dev/floor/command-hygiene.test.mjs` — add the materialized `LESSONS_SWEEP_WIRING` set + the rules
  that iterate it (presence, and a discrimination test per L4) — layer: apparatus

Nothing else is written. `docs/lessons-index.md` is **not** in this list: this increment does not
promote a lesson, so the index needs no regeneration and its bytes must not move.

## Contracts satisfied

- None. This increment adds no capability and touches no `pharn/pharn-contracts/` schema — it wires an
  existing checker and an existing generator into two existing commands (P4 — the checkers' guarantees
  are **cited**, never restated in the command prose).

## Evals to write (P1)

- **Not applicable, and stated rather than skipped.** P1 binds a **Capability** (a `role:`-bearing
  `.md` under the `pharn/` tree) to `evals/cases/*` + `evals/expected/*`. This increment adds no
  capability and no `rule_id`. Its verification is the third file's tests, which run under the same
  `npm test` glob as every other apparatus suite:
  - `LESSONS_SWEEP_WIRING` presence rule → each of the four members' prose contains its required
    invocation → GREEN today for the two product members, RED today for the two dev members (the
    reproduction), GREEN for all four after the change.
  - discrimination rule (L4 — an authored assertion passes by construction) → the matcher flags a
    command body with the invocation **removed** and passes one with it present, so a future loosening
    of the regexes fails here rather than silently permitting the defect.
  - non-vacuity rule (L25's "a checker certifying by staying silent") → the set is non-empty and every
    named file exists on disk, so a renamed command cannot make the suite pass by matching nothing.

## Guarantee audit (P0)

- **"The dev lessons index matches canon when the sweep selects from it"** → **FLOOR**
  (`.dev/floor/check-lessons-index.mjs`, byte-equality over generated output; `pharn/ARCHITECTURE.md §2`
  primitive #3 on the exit code). **NARROWED, and stated:** it is **consistency, not correctness** — a
  wrong renderer regenerates cleanly and stays GREEN — and it says nothing about whether a lesson was
  read.
- **"`/pharn-dev-plan` runs the checker"** → **ADVISORY.** Nothing on the floor forces command prose to
  execute. This is the two-clocks split the command already uses for `check-plan-lessons.mjs`.
- **"`/pharn-dev-plan` DECLARES the checker invocation"** → **FLOOR** (the new test, primitive #3 —
  regex membership over command prose). This is a **vocabulary** assertion, exactly the scope
  `command-hygiene.test.mjs` already documents for its `FORBIDDEN` rules: it pins that the line is
  **present**, and **cannot** prove a run executed it, that the flags are right, or that the agent
  obeyed the branch. **"The wiring is pinned" NEVER means "the sweep was fresh."**
- **"Step 6b keeps `docs/lessons-index.md` current"** → **ADVISORY, twice over.** Running a generator is
  orchestration, not a floor op; and the write goes through **Bash**, so it is **outside** the fix #7
  writes-scope entirely (L19 — declared, not pretended). The design leans on the **safe direction**, not
  on this step: a skipped refresh leaves a stale index that the very branch added in file 1 detects, and
  the next `/pharn-dev-plan` degrades to reading canon in full.
- **"A promotion leaves the repo's committed index consistent"** → **NOT CLAIMED — the honest dev/product
  asymmetry.** The product's index is a **gitignored, disposable cache**, so its refresh completes the
  story. The dev index is a **committed** artifact guarded by `docs:check` inside `npm run check`, so
  Step 6b leaves an **uncommitted** change that a human must commit; until then `npm run check` is RED.
  That RED is **correct and desirable** (it is the committed-drift guarantee doing its job), and the
  command must say so rather than imply the refresh finished the job.
- **"The two dev commands now match the product twins"** → **ADVISORY.** The wiring is symmetric; the
  **guarantees deliberately are not** (committed byte-equality vs a machine-local staleness check), and
  the dev branch is coarser by design (see the determinism audit).

## Trust audit (P2)

- **Input.** `docs/lessons-index.md` and `.dev/memory-bank/lessons-learned.md` carry canon **free text**
  (titles, bodies) that originated in `REVIEW.md` findings — `trust: untrusted` DATA.
- **Propagation.** The added branch consumes **only the checker's exit code** (an integer). No
  proceed/fall-back decision rests on any title, `type`, or `concepts` value, and none is injected
  downstream as an instruction. Selection over the index's columns stays **advisory context selection**,
  which the existing sweep prose already labels.
- **Residual (named).** A lesson body reaching the planner is still instruction-looking text a human or
  model reads. Bounded — nothing gates on it — not zeroed.

## Determinism audit (P5)

- The new branch is a **membership test over the exit code**: `0` → the index matches canon → run the
  existing two-step sweep; **non-zero** → do not select from the index, read canon in full, say so in the
  plan, and surface the checker's output at the Step-4 halt.
- **No `--verdict` flag is added, deliberately (P7).** The product twin needs one because `NO_CANON`,
  `COLD` and `GREEN` **share exit 0**, so its exit code is ambiguous. The dev checker has no such
  ambiguity — exit 0 has exactly one meaning — so a `--verdict` flag would be an addition with no
  triggering failure.
- The printed `[MISSING|DRIFT|ENUM_ERROR]` type refines the **remedy sentence only** and is barred from
  the branch, so no gate ever parses the report's prose (L6).
- **Terminal fallback is "ask", never a guess:** a RED index degrades to reading canon in full **and**
  raising it to the human at the halt; it never blocks the plan and never silently proceeds.
- **`/pharn-dev-plan` does not regenerate.** Unlike the product's optional cache-warm on `COLD`,
  regenerating here would write a **committed** file outside this command's single-path `writes:`
  through Bash mid-plan. Regeneration belongs to `/pharn-dev-memory-promote` Step 6b or a contributor's
  `npm run docs:generate`.

## Open questions (HALT)

- **Resolved before this plan was written** (asked and answered at the pre-plan halt): whether to pin the
  wiring with a test, or stay at the two command files the task named. **Answer: add the test pin**, as
  the materialized-set form. No open questions remain.
