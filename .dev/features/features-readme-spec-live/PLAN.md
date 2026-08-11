# PLAN — features/README.md stops calling the shipped product pipeline unbuilt

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L1, L11, L13, L18, L19, L20]
- increment: Reword the two sentences in `features/README.md` that describe the product pipeline as
  still under construction, so the guide matches the live repo where all seven stages ship.
- layer(s): none — repo-meta. No capability, no `role:` frontmatter, no node in the layer tree
  (`pharn/ARCHITECTURE.md §4`).
- constitution_refs: [P0, P6, P7]

## Applied lessons

- **L1** — ran the meta-doc sweep this increment invalidates: grepped the tree for every doc asserting a
  product stage is unbuilt. It returned the two in-scope lines plus three classes deliberately left
  alone (see `### Deliberately NOT in scope`), and settled the `CHANGELOG.md` question — L1's own
  provenance names a missing `[Unreleased]` entry as half of the defect that promoted it, so the entry
  is in `## Files` rather than left optional.
- **L11** — ran the whole-repo `npm run check` at BASELINE before scoping, so a pre-existing style red
  could not later be blamed on this increment. It is green (1302 tests, all gates pass), so any red at
  verify is this increment's.
- **L13** — this stage formats its own artifact: `prettier --write` + `markdownlint-cli2 --fix` scoped
  to this `PLAN.md` alone, before the halt.
- **L18** — the exclusion block below is a `###` HEADING (`### Deliberately NOT in scope`), never a bold
  prose intro, so `set-writes-scope.cjs --from-plan` terminates the authorized list structurally rather
  than on a prose cue it may not recognize.
- **L19** — the L13 formatters are pinned to this one artifact path, never `npm run format` (a
  repo-wide `prettier --write .` whose Bash writes escape the fix #7 gate entirely).
- **L20** — read the scope-setter's printed count as a checkable number, not decoration: Step 0 printed
  `1 path(s)`, matching the one `PLAN.md` this stage writes. The same read is owed at `/pharn-dev-build`
  Step 0, where the expected count is the number of `## Files` entries below.

## Files

- `features/README.md` — reword lines 18–20 (drop "(a later increment)" / "Until then") and lines 8–9
  ("as those stages are built"), so neither asserts the product pipeline is unbuilt — layer none
- `CHANGELOG.md` — one `## [Unreleased]` entry recording the correction, carrying **no** version bump
  (L1) — layer none

### Deliberately NOT in scope

- `SKILLS_VERSION` — **must stay at 2.5.1.** `features/README.md` is a README, and CLAUDE.md's
  discipline exempts repo-meta from the bump; the concrete bump-triggering set does not list it either.
- `pharn/floor/README.md` — verified live this run: it already reads `node pharn/floor/validate.mjs`
  (line 34) and `node pharn/floor/check-structural.mjs` (line 55). There is no `node floor/…` path left,
  so the second half of the original finding is already fixed (PR #126) and this increment must not
  touch it.
- `pharn/pharn-contracts/finding-shape.md` — line 81 says the `check-structural` wiring over emitted
  output "is increment **3c, not yet built**", which the sweep found stale (see `## Open questions`).
  Same defect class, but it is **product surface**, so correcting it bumps `SKILLS_VERSION` — a
  different axis and a separate increment (P3, P7).
- `.claude/commands/pharn-ship.md` — line 350's "`--loop` … is a **separate follow-up increment**" while
  `/pharn-loop` ships the capability under a different name. Judgment call, product surface, separate.
- `.dev/features/**` — every other sweep hit is a frozen audit artifact that was true when written.
  Rewriting history is not a staleness fix.

## Contracts satisfied

- none. This increment adds no capability, cites no `pharn-contracts` schema, and emits no finding.

## Evals to write (P1)

- none, and P1 is not engaged: P1 binds a **Capability** (a file whose frontmatter carries `role:`).
  `features/README.md` has no frontmatter and declares no `enforces` rule id, so there is no rule id
  owing an eval fixture.

## Guarantee audit (P0)

- "the edit lands only in the two declared files" → **floor: hook** (fix #7 `set-writes-scope.cjs` +
  `enforce-writes-scope.cjs`, composed with fix #2's denylist) — **narrowed, and stated:** the hook
  gates the `Write|Edit|MultiEdit` surface only, so a tool this increment runs through Bash (the L13
  formatters) writes outside it unchecked. That is why those are pinned to one artifact path each
  (L19), and the bound belongs on the claim, not only in the lessons block.
- "the repo stays style-clean and the floor stays GREEN with this in it" → **floor: enum-regex** — the
  exit codes of `npm run check` (`format:check`, `lint:md`, `lint`, `docs:check`, `node --test`) and
  `pharn/floor/validate.mjs`.
- "the reworded sentences are TRUE" → **advisory.** Nothing on the floor reads this file's prose.
  Read live this run, not inferred: `validate.mjs:120` admits a file to the capability set only when
  parsed frontmatter carries `role:`, and `validate.mjs:130` arms CHECK 5 only when the text matches
  **both** `/rule_id:/` and `/problem:/`. `features/README.md` has no frontmatter and neither marker,
  and the reword adds neither — so the file is walked (root `features/` is not in `EXCLUDE_SEGMENTS`,
  L10) yet trips no content check. The truth of the sentences rests on the live reads recorded in
  `## Open questions` — P6 evidence, not a floor reduction.
- "no `SKILLS_VERSION` bump is owed" → **advisory.** The bump-triggering set is a CLAUDE.md discipline;
  no checker computes it from a diff. `check-specified-markers.mjs` binds trusted-doc marker claims, not
  README bump eligibility.
- "the CHANGELOG entry carries no version" → **advisory** (the same discipline; nothing gates it).

## Trust audit (P2)

- The increment ingests no untrusted artifact: it reads repo-owned files and edits one of them; it
  fetches nothing and emits no finding, so no taint propagates to any output.
- The **request text** driving this increment is human-authored intent, not fetched content — but it
  was still treated as a claim to verify rather than a fact to copy (P6). Two of its premises did not
  survive: it states the repo is at `SKILLS_VERSION 2.4.6` (live: **2.5.1**), and it offers the
  `pharn/floor/README.md` half as needing confirmation (live: already fixed). Neither changes the fix;
  both are recorded so no downstream stage inherits an unverified premise.

## Determinism audit (P5)

- "is `pharn/floor/README.md` in scope?" → membership test, not judgment: grep for a `node floor/…`
  invocation. Zero matches live → excluded.
- "which paths may the build write?" → parsed deterministically by `set-writes-scope.cjs --from-plan`
  from `## Files` above; no model chooses it.
- "is the increment green?" → exit codes only (`npm run check`, `validate.mjs`).
- The one irreducible judgment — whether line 8–9's "as those stages are built" reads as stale — does
  **not** end in a guess: it is carried to the human as an open question below (the terminal fallback).

## Open questions — RESOLVED at the approval gate

**None open.** All three were put to the human as a selectable form at the plan-approval halt and
answered before any file was written; the plan was then approved as written. Recorded here so no
downstream stage reads a cleared blocker as live (`/pharn-dev-build` refuses a plan with unresolved
open questions).

1. **Line 8–9 — "as those stages are built".** My read was **stale, and the same axis**: "built" is
   what happens to PHARN, not what a user does to a stage, so the phrase dates the sentence to when the
   pipeline was unbuilt — the same premise as line 18, written at the same time. Live check: all seven
   spine stages ship as `.claude/commands/pharn-{spec,plan,grill,build,regress,verify,ship}.md`.
   **RESOLVED — reword to `as the user runs each stage`.**
2. **`CHANGELOG.md` entry.** L1 argued for it; the request called it optional.
   **RESOLVED — include it, carrying no version bump.**
3. **Sibling staleness found by the L1 sweep.** `pharn/pharn-contracts/finding-shape.md:81` calls the
   `check-structural`-over-emitted-output wiring "increment 3c, **not yet built**", but
   `/pharn-dev-eval` (`:125`) and `/pharn-verify` (`:210`) both invoke `check-structural.mjs` over an
   emitted `findings.json` today, and canon L4 records two live runs of it. Same defect class on the
   **product surface** (so: a bump). **RESOLVED — defer to a separate follow-up increment**, recorded
   in `### Deliberately NOT in scope` above.

## Grill findings folded back in (advisory — `GRILL.md` gates nothing)

`/pharn-dev-grill` raised three concerns against this plan; all three were closed here **before** build,
which is why the text above differs from the approved version in exactly these three places:

- **P6, important** — the open-questions section read as unresolved after the gate had cleared it.
  Closed by the section immediately above.
- **P6, minor** — the floor-scanner claim was inferred rather than read. Closed by reading
  `pharn/floor/validate.mjs:120` / `:130` live and citing both lines in the guarantee audit.
- **P0, minor** — a floor reduction stated without the Bash-escape narrowing the same plan names
  elsewhere. Closed by moving the bound onto the claim itself.
