# PLAN — grill-lessons-reverify

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L1, L2, L20, L29, L30, L31, L33]
- increment: Wire the existing `pharn/floor/check-plan-lessons.mjs` into BOTH grill stages so a PLAN's
  `applied_lessons` declaration is re-verified by a stage that did not author it, and materialize the
  four-site wiring obligation set that nothing currently ranges over.
- layer(s): product `.claude/` command surface (`pharn-grill.md`, `pharn-ship.md`) + build apparatus
  (`pharn-dev-grill.md`, `pharn-dev-ship.md`, `.dev/floor/command-hygiene.test.mjs`) # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P2, P4, P5, P6, P7]

## Applied lessons

- L1 — The meta-doc sweep was run: this increment falsifies `CLAUDE.md:437` ("no downstream stage
  re-verifies the field yet"), changes the shipped `pharn-grill.md` description, and needs a CHANGELOG
  entry + `SKILLS_VERSION` bump + matching README badge. All are named in `## Files` rather than left
  to `/pharn-dev-build` to notice.
- L2 — The honesty travels with the artifact, not just this PLAN: each grill command's own body states
  what its new `check-plan-lessons` call does and does NOT guarantee (declaration-shape, never
  application), and cites only the floor op verified live this run (the checker was executed against
  three fixtures during discovery — see `## Discovery evidence`).
- L20 — The recurrence trigger is respected in the _opposite_ direction: the follow-up already names
  the remedy as wiring, so this increment does NOT invent a new floor primitive. `check-plan-lessons.mjs`
  is reused byte-for-byte; no checker code changes.
- L29 — The remedy is quantified over a set ("each grill stage re-verifies"), so the **enumeration is
  the deliverable**: a single `PLAN_LESSONS_WIRING` array with the rules iterating it, never two
  hand-written assertions. A fifth site added later inherits every rule for free.
- L30 — Every gate the new step NAMES is a gate the step INVOKES. The grill step is a pinned command
  block, never a prose bullet asking the agent to "confirm the lessons declaration is clean" — that
  mixed mode is exactly what L30 says gets skipped.
- L31 — This is a dev/product copy-pair obligation, the highest-value place to look for a dropped set.
  The enumeration therefore ranges over **all six** `check-plan-lessons` call sites (both plan stages,
  currently unpinned, plus both new grill stages, plus both ship orchestrators once G1/G2 added them),
  not only the two this increment adds. **Revised post-review:** this said "all four" through the
  build; the shipped set is six, because accepting G1/G2 made the two orchestrators call sites too.
- L33 — Two forward-looking claims EXPIRE the moment this lands and are corrected in the same
  increment: `CLAUDE.md:437`'s "no downstream stage re-verifies the field yet" and `pharn-grill.md`'s
  description asserting "the hash-chain disagreement is the ONLY deterministic stop". Derived by
  scanning for the shortest invariant substrings (`re-verifies`, `ONLY deterministic stop`), treating
  the follow-up's own wording as a lower bound to beat.

## Discovery evidence (live, this run — P6)

- `pharn/floor/check-plan-lessons.mjs` executed against three fixtures:
  `applied_lessons: none` + missing lessons file → **GREEN exit 0** (short-circuits before the read);
  `[L1]` + missing lessons file → **RED exit 1** with an actionable message naming the remedy;
  `none` + real canon → **GREEN exit 0**. A user with no `memory-bank/` is therefore unblocked, which
  is what makes the product-side wiring safe. **No checker change is needed.**
- `.claude/commands/pharn-dev-grill.md` invokes only `count-grillers.mjs` (line 126) — no lessons call.
- `.claude/commands/pharn-grill.md` invokes `check-plan-spec-agree.mjs` (line 113) — the mirror point.
- `grep check-plan-lessons .dev/floor/*.test.mjs pharn/floor/*.test.mjs` → the CALL SITES are pinned by
  nothing; only the checker's own black-box tests exist.
- `.dev/floor/command-hygiene.test.mjs:195` holds `LESSONS_SWEEP_WIRING` (4 sites, index sweep) — the
  established pattern this increment follows, and a `length === 4` assertion that must not be widened
  to cover a different obligation.
- Spec hash pinned via `node .dev/floor/hash-doc.mjs pharn/ARCHITECTURE.md`; lessons index freshness
  gate `node .dev/floor/check-lessons-index.mjs .` → **GREEN exit 0**, so the two-step sweep ran
  (selected from `docs/lessons-index.md`, then read L1, L2, L20, L29, L30, L31, L33 in full from canon).

## Files

- `.claude/commands/pharn-dev-grill.md` — add the `check-plan-lessons.mjs` invocation against
  `.dev/memory-bank/lessons-learned.md` + its exit-code branch; add the lessons path and the checker to
  `reads:`. **Named sites that go false and MUST be rewritten (G3/G4):** the `description:` at line 2
  ("ADVISORY — it surfaces concerns; it does NOT block /pharn-dev-build"), the whole
  `## Gates (fix #3) — be honest about what blocks (nothing here does)` section at line 178 ("No grill
  finding is a floor-gate … advisory end-to-end"), and the clause at line 144. **NOT** line 223 — its
  "your output gates nothing" is about free-text findings and stays true — layer: build apparatus
- `.claude/commands/pharn-grill.md` — add the same invocation against `memory-bank/lessons-learned.md`,
  mirroring the existing `check-plan-spec-agree.mjs` block at line 113; add both paths to `reads:`;
  correct the description's now-false "the hash-chain disagreement is the ONLY deterministic stop" and
  the parenthetical at line 294. **NOT** lines 159/172/273 — those are the installed-skills
  enumeration and stay true — layer: product command surface
- `.claude/commands/pharn-ship.md` — **added post-grill (G2 — functional, not doc drift).** Its Step 2
  stage 3 (line 143) reads exactly ONE exit code as the grill verdict, so the new stop would be
  invisible and `/pharn-ship` would proceed past it. Widen that verdict read to range over BOTH
  checkers, and update the guarantee-audit line at 384 — layer: product command surface
- `.claude/commands/pharn-dev-ship.md` — **added post-grill (G1).** Line 88 asserts `/pharn-dev-grill`
  is "advisory by design and gates nothing … no deterministic verdict to branch on"; correct it and
  give its Step 2 stage 2 a verdict read, mirroring `pharn-ship.md` — layer: build apparatus
- `.dev/floor/command-hygiene.test.mjs` — add `PLAN_LESSONS_WIRING` (**6** sites — 4 as originally
  scoped, plus the two orchestrators G1/G2 added) + the iterating presence/discrimination/non-vacuity
  rules — layer: build apparatus (test; never ships)
- **added post-review (REVIEW F1, blocking) — all 13 shipped grillers, enumerated one per line because
  the scope parser reads literal paths and because an enumeration is this increment's own discipline.**
  Each asserts "the grill stage's only deterministic stop is the spec→plan hash chain"; there are now
  two stops, so all **24 sites** are false. Replace the stale parenthetical justification ONLY — the
  enclosing "grillers as a class never gate" claim stays true and must not be touched (fix #3 is
  intact) — layer: product capability tree
  - `pharn/pharn-pipeline/grillers/a11y/a11y.md` (2 sites)
  - `pharn/pharn-pipeline/grillers/architecture/architecture.md` (2 sites)
  - `pharn/pharn-pipeline/grillers/comprehension/comprehension.md` (2 sites)
  - `pharn/pharn-pipeline/grillers/coupling/coupling.md` (1 site)
  - `pharn/pharn-pipeline/grillers/documentation/documentation.md` (2 sites)
  - `pharn/pharn-pipeline/grillers/error-handling/error-handling.md` (2 sites)
  - `pharn/pharn-pipeline/grillers/i18n/i18n.md` (2 sites)
  - `pharn/pharn-pipeline/grillers/migrations/migrations.md` (2 sites)
  - `pharn/pharn-pipeline/grillers/observability/observability.md` (2 sites)
  - `pharn/pharn-pipeline/grillers/performance/performance.md` (2 sites)
  - `pharn/pharn-pipeline/grillers/privacy/privacy.md` (2 sites)
  - `pharn/pharn-pipeline/grillers/security/security.md` (2 sites)
  - `pharn/pharn-pipeline/grillers/testability/testability.md` (1 site)
- `.claude/commands/pharn-loop.md` — **added post-review (REVIEW F3).** Line 334's guarantee audit
  enumerates the gated front's proceed-verdict owners and omits `check-plan-lessons`. Its Step 2
  (line 125) correctly CITES `/pharn-ship` and needs no edit — layer: product command surface
- `CLAUDE.md` — line 437's "no downstream stage re-verifies the field yet (follow-up
  `grill-lessons-reverify`)" expires; replace with what now holds — layer: repo meta
- `CHANGELOG.md` — `[Unreleased]` entry describing the change and the bump — layer: repo meta
- `SKILLS_VERSION` — 2.7.15 → **2.8.0** (OQ3, resolved: minor) — layer: product-surface version of record
- `README.md` — shields badge must equal `SKILLS_VERSION` or `.dev/floor/check-version-badge.mjs` REDs
  — layer: repo meta
- `docs/capabilities/**` + `README.md` `CURRENT-STATE` region — REGENERATED, never hand-edited, via
  `npm run docs:generate` (a Bash write outside fix #7 — L19, declared not pretended) — layer: generated

## Contracts satisfied

- `pharn/ARCHITECTURE.md §6` — the plan-artifact row's `applied_lessons` key field; this increment makes
  the field load-bearing downstream rather than self-attested. Cited, not restated (P4).
- `pharn/pharn-contracts/finding-shape.md` — unchanged; the grill's advisory findings keep their
  enum-gated / free-text split. The new stop is a floor exit code, never a finding severity.

## Evals to write (P1)

- No `role:`-bearing capability is added, so P1's evals-per-capability obligation is not triggered.
  **Corrected post-grill (G5) — the earlier reason given here was false.** `pharn-dev-grill.md` does
  carry `role: griller`, but it ships **no** evals and owes none: it lives under `.claude/commands/`,
  which `pharn/floor/validate.mjs` does not scan and which `count-grillers.mjs` deliberately excludes
  from membership, so its `role:` never registers. The 13 eval directories belong to the
  `pharn/pharn-pipeline/grillers/*` capabilities, none of which this increment touches.
- Coverage is by the enumerated wiring rules instead, each iterating `PLAN_LESSONS_WIRING`:
  - presence → each of the 6 command bodies INVOKES `check-plan-lessons.mjs` (not merely describes it)
  - discrimination (L4) → strip the invocation from the real body; the matcher must stop matching
  - per-surface path → the dev sites must cite `.dev/memory-bank/`, the product sites `memory-bank/`,
    so pasting the product line into a dev command fails instead of silently checking the wrong canon
  - non-vacuity (L34) → every named command exists on disk, and the set length is asserted, so the
    per-item rules can never certify an empty domain

## Guarantee audit (P0)

- "A PLAN's `applied_lessons` is present, well-formed, and every cited id resolves" → **floor:
  enum-regex** (`check-plan-lessons.mjs`, primitive #3). Unchanged; reused, not reimplemented.
- "The declaration is re-verified by a stage that did NOT author it" → **floor: enum-regex**, but the
  guarantee is the checker's VERDICT only. The grill stage's ACT of invoking it is **advisory**
  orchestration (two clocks) — nothing on the floor forces the prose to run.
- "The lessons were GENUINELY applied / a `none` is justified" → **advisory**, and structurally
  uncheckable here. Re-verification narrows self-attestation; it does not close the
  declaration-vs-application gap. Writing "the grill verified the lessons were applied" is the P0
  disease — **struck**.
- "Both grill stages carry the wiring" → **floor: enum-regex** over command bodies
  (`command-hygiene.test.mjs`), and the bound is the same narrow one the existing `LESSONS_SWEEP_WIRING`
  block states: it pins that the PROSE contains the invocation. It CANNOT prove a run executed it.
  "The wiring is pinned" NEVER means "the check ran".
- "A user with no `memory-bank/` is unblocked" → **floor: enum-regex** (`none` short-circuits before the
  file read — verified live this run against a missing path, exit 0).

## Trust audit (P2)

- **Input.** `PLAN.md` and both lessons files are untrusted DATA. The new verdict ranges ONLY over the
  enum-gated `applied_lessons` value (regex-gated to `none` | `[L<n>…]` before any use) and `## L<n>`
  heading MEMBERSHIP — never over either file's prose. Unchanged from the checker's existing audit.
- **Propagation.** The grill's own free-text findings keep inheriting the PLAN's untrusted tag and are
  rendered as quoted DATA in `GRILL.md`. The new floor stop is an exit code, so **no proceed/stop
  decision rests on a tainted field** — a needle in a lesson body or plan prose cannot move it, and a
  needle IN the field fails the grammar.
- **New surface, stated:** the product grill now reads a path inside the USER's repo
  (`memory-bank/lessons-learned.md`). That file is untrusted DATA and is read only for heading
  membership; its prose is never interpreted.

## Determinism audit (P5)

- Every new branch is an exit-code membership test on `check-plan-lessons.mjs` (0 → proceed, non-zero →
  stop). No LLM classification anywhere in the branch.
- Terminal fallback: the checker's own RED message names the offending field or id, and the stage halts
  to the human — never a guess, never an auto-fix of the plan's declaration.

## Open questions — RESOLVED at the halt (human-selected, P6)

- **OQ1 — Does a lessons RED BLOCK the grill, or annotate it?** → **HARD RED (block)**, mirroring the
  existing hash-chain stop at `pharn-grill.md:113`. A plan edited after planning, or citing an id that
  no longer resolves, is stale intent by the same argument. The alternative (annotate-only) was
  rejected because it would leave the declaration effectively self-attested — the exact bound this
  increment exists to remove. **Consequence for the build:** `pharn-grill.md`'s description must stop
  saying the hash-chain disagreement is the ONLY deterministic stop; there are now two.
- **OQ2 — Does the enumeration cover 2 sites or 4?** → **ALL 4 at plan time; SIX as shipped** — both
  new grill stages plus the two existing plan-stage call sites (`pharn-plan.md:254`,
  `pharn-dev-plan.md:225`), which are pinned by nothing today. Pinning only the two new sites would
  reproduce precisely the defect L29 names. The two added members are test-only apparatus coverage over
  wiring that already ships; no shipped bytes change on their account, so this does not widen the bump.
  **Revised post-review (REVIEW F5):** accepting G1/G2 made `pharn-ship.md` / `pharn-dev-ship.md` call
  sites as well, so the shipped set is **6** and `PLAN_LESSONS_WIRING.length` asserts 6. The build was
  right; this answer was not updated to match it, which is the drift F5 records.
- **OQ3 — `SKILLS_VERSION` bump size.** → **MINOR: 2.7.15 → 2.8.0.** A newly wired deterministic gate
  on a shipped command is "a newly shipped capability / checker" under CLAUDE.md's bump-size rule. The
  README shields badge must be updated in the same increment or `.dev/floor/check-version-badge.mjs`
  REDs.
- **OQ4 — Is `.dev/features/applied-lessons/PLAN.md` a site to correct?** → **NO** (assessed, not
  overlooked). Its guarantee audit scopes the claim to "**in this increment**", so it is a historical
  record that stays true and must not be rewritten. Recorded so the omission does not read as an
  oversight (L33).

## Grill dispositions (post-`/pharn-dev-grill`, human-approved revision)

`.dev/features/grill-lessons-reverify/GRILL.md` raised 6 concerns. All are dispositioned here; none was
waved through. The grill is advisory and blocked nothing — the human chose to revise.

- **G1 (blocking) — `pharn-dev-ship.md` omitted** → **ACCEPTED**, added to `## Files`.
- **G2 (blocking) — `pharn-ship.md` omitted; the new stop would be invisible to the orchestrator** →
  **ACCEPTED**, added to `## Files`. This was the finding that mattered: it is a functional gap, not
  doc drift.
- **G3 (important) — L29 applied to one member of a two-member set** → **ACCEPTED**; the
  `pharn-dev-grill.md` Files entry now names its description explicitly, symmetric with the product
  grill's.
- **G4 (important) — "state the guarantee bound in the body" too weak to reach line 178** →
  **ACCEPTED**; the Files entry now names the `## Gates (fix #3)` section and line 144 by number, and
  names line 223 as a site to LEAVE ALONE so the build does not over-sweep.
- **G5 (minor) — false "already ships evals" claim** → **ACCEPTED**; the Evals section is corrected,
  and the correct reason (outside validate's scan surface; excluded from `count-grillers` membership)
  now stands in place of the wrong one.
- **G6 (minor) — `/pharn-loop` unassessed** → **RESOLVED, no edit needed.** `/pharn-loop.md:123-129`
  runs "`/pharn-ship` Step 2 stages 1–6 … with the **same** per-stage structural verdict reads" and
  explicitly says "**Do not re-derive or restate that logic here** (P4)". It cites rather than
  restates, so fixing `pharn-ship.md` covers the loop. Recorded so the absence of a `/pharn-loop` entry
  in `## Files` reads as assessed, not overlooked.

**Build-scope note (verified live, this revision).** `set-writes-scope.cjs --from-plan` over this PLAN
parses **exactly 9 paths** — the nine `## Files` entries, no over-grant (L20's own prescribed check,
run by hand here because `plan-scope-selfcheck` is not built). `docs/capabilities/**` is correctly
absent: it is regenerated through Bash (`npm run docs:generate`), outside fix #7 by construction (L19).
**`/pharn-dev-build` must NOT pass `--allow-claude-dir`** — verified: the setter accepts this plan
without it and exits 0, because its refusal targets `.claude/settings.json` and the three hook scripts,
never command files. Passing the flag here would weaken a guard for no reason.

**Scope note (P3/P7):** the two added orchestrator files are the same axis of change, not a second one
— "the grill's lessons stop, and everything that must know about it". No new floor primitive; the
`pharn-ship.md` edit is a widening of an existing verdict read, and `pharn-dev-ship.md` is apparatus, so
the bump stays **minor** on `pharn-grill.md` + `pharn-ship.md` alone.

## Named follow-ups (P7 — named, not built)

- **`plan-scope-selfcheck`** — L20's own prescribed remedy (re-run `set-writes-scope.cjs --from-plan`
  at `/pharn-dev-plan` Step 4 and deterministically compare the parsed scope against the plan's
  `## Files`) is still unbuilt. Surfaced during this increment's lessons sweep; a separate axis of
  change, so not scoped here.
