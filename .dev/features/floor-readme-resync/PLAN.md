# PLAN — floor-readme-resync

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4
- applied_lessons: [L1, L2, L8, L13, L18, L20]
- increment: Resync the shipped `pharn/floor/README.md` to live state — it claims "the floor is three files" against 46 checkers, says the content-hash primitive is "used inline … rather than as a file" (false twice over as of this branch), prints pre-rename `/plan` `/build` `/review` command names, and gives `node floor/…` invocation paths that no longer exist.
- layer(s): `pharn/floor/` — shipped product-surface documentation, not a checker.
- constitution_refs: [P0, P4, P6, P7]

## Applied lessons

- L1 — the meta-doc sweep, applied to a meta-doc that was itself missed by every prior sweep: this file states facts (a file count, a primitive's implementation form, command names, invocation paths) that increments kept invalidating without ever naming it in a `## Files`.
- L2 — the honesty travels with the artifact: the corrected text keeps every P0 bound the file already carries (best-effort checks 4/5, GREEN ≠ correct) and adds none it cannot back.
- L20 — the recurrence rule, applied to a **doc** rather than a lesson: a count restated by hand in a second place WILL go stale, so the fix is structural — this file stops restating the number and cites the root README's generated, drift-checked `CURRENT-STATE` inventory instead (P4: cite, don't restate). Removing the duplicate is what stops the recurrence; correcting `3` to `46` would just reset the clock.
- L8 — three concrete paths, so the build scope comes from `## Files` via `--from-plan`.
- L13 — this artifact is formatted scoped to itself.
- L18 — the exclusion block is a `###` heading.

## Files

- `pharn/floor/README.md` — resync to live state — layer `pharn/floor/` (shipped doc)
- `CHANGELOG.md` — one `## [Unreleased]` entry — repo-meta
- `SKILLS_VERSION` — `2.4.4` → `2.4.5` (patch) — repo-meta

### Deliberately NOT in scope

- Every `pharn/floor/*.mjs` — this increment corrects **documentation about** the checkers; it changes no checker behavior, and touching one would put two axes in one change.
- The root `README.md` `CURRENT-STATE` region — generated and drift-checked; this increment **points at** it rather than editing or duplicating it.
- `.dev/memory-bank/lessons-learned.md` — canon is written only by a human-gated `/pharn-dev-memory-promote` run (L7).

## Contracts satisfied

- None change shape. The file documents `pharn/ARCHITECTURE.md §2`'s three primitives and `pharn/pharn-contracts/eval-format.md`'s `structural[]` reduction; both are **cited, not restated** (P4), and this increment strengthens that citation rather than weakening it.

## Evals to write (P1)

No Capability, no `rule_id`, no checker behavior — nothing is owed, and inventing a test for prose would be the speculation P7 forbids. The deterministic guards that DO cover this change are the existing ones, and they run: `npm run format:check`, `npm run lint:md`, `npm run docs:check` (byte-equality over the generated regions this file now cites), and `npm test`.

## Guarantee audit (P0)

- "The file's factual claims match live state" → **advisory**. Prose accuracy is not floor-reducible; it was verified by reading live state this run (46 non-test `pharn/floor/*.mjs`, 3 hook scripts, 19 commands) and it can drift again tomorrow. Stated plainly rather than dressed as a guarantee.
- "The file will not go stale on the checker COUNT again" → **structurally reduced, not guaranteed**: the count is deleted, not corrected, so there is no second copy to drift. The remaining single copy is the root README's generated region, which `npm run docs:check` holds to byte-equality — a real floor guarantee, but over **consistency with the generator**, never over truth.
- No new guarantee is claimed by this increment, and every existing P0 bound in the file is preserved verbatim.

## Determinism audit (P5)

No branch, no code. Documentation only.

## Open questions (HALT)

None.
