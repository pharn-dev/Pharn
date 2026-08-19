# PLAN — the plan-scope exclusion cue must not fire on an item's own wrapped line

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L1, L20, L25, L26, L28]
- increment: Make `set-writes-scope.cjs --from-plan`'s head-less exclusion CUE skip an authorized item's own CONTINUATION lines, so an ordinary wrapped description can no longer truncate the parsed `## Files` scope.
- layer(s): floor / hook (`.claude/hooks/`) — the writes-scope setter, beside `pharn/ARCHITECTURE.md §2` primitive #1.
- constitution_refs: [P0, P2, P5, P6, P7]

## GATE 1 — how this increment was approved

The human's standing instruction at the previous increment's GATE 2 was **"fix everything and promote
everything, and keep going with the next fixes and promotion till everything is done"**, given after this
defect had been named to them explicitly as the next fix. That is read as the GATE-1 approval of **this**
intent, and it is recorded here rather than assumed so it can be corrected on sight. The model still did
not self-approve: the approval is the human's sentence, not the agent's judgment. Nothing else about the
gate is relaxed — the `## Open questions (HALT)` section below is empty because there are none, not
because they were skipped.

## Applied lessons

- **L28** — this increment exists **because** L28 was promoted; it is the floor-escalation half of that
  entry. The lesson names the remedy (skip an item's own continuation lines, or make the boundary
  heading-only) and this plan takes the first, narrower option.
- **L20** — L28's remedy would otherwise reduce to "authors should avoid ordinary vocabulary in their own
  `## Files` descriptions", which is discipline, and a discipline-only remedy recurs. The correction is
  therefore a **parser change plus assertions**, not a documentation note.
- **L25** — the comment beside the Boundary-2 regex is what made this invisible: it states the exemption
  as settled ("an authorized item's own description never trips it") while naming only the single-line
  case. It is **re-derived**, not amended around, and the new bound (lazy continuation) is named in it.
- **L26** — `set-writes-scope.cjs` is hook-protected and on its own `CONTROL_SURFACE`, so verification runs
  at the **real path**: apply the change in a throwaway `git worktree` of this repo and run `npm run check`
  there, never against a scratchpad copy.
- **L1** — the increment changes shipped `.cjs` hook bytes, so `SKILLS_VERSION` and `CHANGELOG.md` are
  scoped. `SKILLS_VERSION` moves 2.7.7 → **2.7.8** and the README badge with it.

  _Corrected (P6). This bullet first justified the bump by asserting that 2.7.7 was "committed canon" —
  an assertion made from memory and **false**: `git show HEAD:SKILLS_VERSION` is `2.7.6` and 2.7.7 is
  still an uncommitted working-tree change, exactly as it was when the previous increment folded its own
  second fix into it. The bump stands, on the correct reason: `CLAUDE.md`'s rule is per-**change** ("any
  change that alters product-surface bytes MUST bump `SKILLS_VERSION` and add a `CHANGELOG.md` entry"),
  and this is a distinct increment with its own plan and its own entry — where the previous increment's
  F2 was a repair to a finding **within** its own already-bumped increment, which is why that one folded
  rather than bumped. Both versions therefore sit under `[Unreleased]` together, which the CHANGELOG's
  preamble already accounts for. The false claim is corrected here rather than silently overwritten,
  because "asserting repo state without reading it" is the P6 violation this methodology exists to
  catch, and it is not less of one for landing on the right answer._

## Files

- `.claude/hooks/enforce-writes-scope.test.cjs` — assertions for the wrapped-line case: a continuation line
  carrying exclusion vocabulary keeps every authorized path; the column-0 head-less intro still excludes;
  a heading still excludes — layer floor/hook tests
- `SKILLS_VERSION` — 2.7.7 → 2.7.8 — layer repo-meta
- `README.md` — shields badge to match, pinned by `.dev/floor/check-version-badge.mjs` — layer repo-meta
- `CHANGELOG.md` — one entry — layer repo-meta
- `.dev/features/plan-cue-continuation/set-writes-scope.patch` — the unified diff for the human-applied
  change, declared **up front** this time, which is the F4 correction from the previous increment applied
  before the fact rather than after — layer dev-artifact
- `.claude/hooks/test.cjs` — the whole-file handoff copy of the patched setter, the mechanism the human
  chose last increment (rename into place rather than `git apply`). Carries no banner, so the rename
  produces exactly the verified bytes — layer floor/hook (handoff artifact)

### Delivered as a human-applied patch (NOT agent-written, NOT in the parsed scope)

- `.claude/hooks/set-writes-scope.cjs` — `pathsFromPlanFiles()`'s Boundary-2 cue gains a continuation-line
  exemption. Below an exclusion heading deliberately, so `--from-plan` never parses it into scope: the file
  is hook-protected (fix #2) **and** on the setter's own `CONTROL_SURFACE`, which would make the setter
  refuse this very scope.

### Explicitly **not** touched

- `pharn/CONSTITUTION.md`, `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`, `LIMITS.md` — trusted docs, human-only.
- `.claude/settings.json`, `.claude/hooks/protect-trusted-paths.cjs`, `.claude/hooks/enforce-writes-scope.cjs`,
  `CODEOWNERS` — untouched.
- `.dev/memory-bank/**` — L28 is already canon; this increment writes no canon.

## Contracts satisfied

- `pharn/ARCHITECTURE.md §7` / §3.1 (`writes:` enforced by the pre-write hook) — the enforcement is
  unchanged; only the **parse** of the authorized set is corrected. Cited, not restated (P4).

## Evals to write (P1)

No Capability and no `enforces` rule_id is added, so P1 is vacuous here; the regression surface is the
`node --test` assertions below, run by `npm test` inside `npm run check`.

- a `## Files` item whose **wrapped continuation** line contains `out of scope` → **all** authorized paths
  survive (the live 5→1 truncation, as a test)
- the same vocabulary on a **column-0** head-less intro line → still truncates (the existing behavior is
  preserved, not traded away)
- an exclusion **heading** → still truncates (Boundary 1 untouched)
- a continuation line carrying `not touched` / `not written` → paths survive (the cue's other alternatives
  behave the same, so the fix is not keyed to one phrase)

## Guarantee audit (P0)

- "a path below an exclusion heading never enters scope" → **floor: enum-regex (primitive #3)**, unchanged
  — Boundary 1 is not touched by this increment.
- "an authorized item's own wrapped description no longer truncates the list" → **floor: enum-regex
  (primitive #3)** — a line-shape test in the parser, pinned by the assertions above.
- "the parsed scope equals the plan's authorized `## Files` set" → **advisory.** The parser is a heuristic
  over markdown; this increment removes one known way it under-reads, and does not make it complete. The
  floor guarantee remains only what `enforce-writes-scope.cjs` does with whatever set it is handed.
- **Explicitly NOT claimed:** that the cue now handles every markdown shape. A **lazy continuation** — an
  unindented line continuing a list item's paragraph — still trips it. That bound is real, named in the
  code comment, and accepted: prettier (which formats every PLAN in this repo) indents continuations, so
  the lazy form does not arise here; making the parser a full markdown parser is a different increment with
  no triggering failure (P7).

## Trust audit (P2)

- **Input:** a `PLAN.md` is **untrusted** — the setter's own header says a declared file is untrusted input.
  Unchanged: the new branch tests a line's **shape** (leading whitespace), never its content, and no
  decision anywhere reads plan free-text. The change makes the parser accept **more** of the plan's
  authorized list, so the direction of the change is toward the [[L3]] side (less friction), and the guard
  that actually withholds power — the `CONTROL_SURFACE` refusal and fix #2 — is untouched.
- **Widening check, stated because this is the dangerous direction (L7):** a wider parse means more paths
  in scope. The paths it newly admits are exactly those the human already approved above the exclusion
  boundary; no path below a heading or a column-0 intro becomes reachable, and one assertion each pins that.

## Determinism audit (P5)

- The added test is `/^\s+\S/` on the line — leading whitespace, deterministic, no LLM, no new I/O.
- Terminal fallback: none needed; the branch is total.

## Open questions (HALT)

None. The remedy was named in L28 at promotion time, the narrower of its two options is taken, and the
residual it leaves is stated in the guarantee audit rather than left open.
