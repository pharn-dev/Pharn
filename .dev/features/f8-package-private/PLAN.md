# PLAN — f8-package-private

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52
- applied_lessons: [L8, L19]
- increment: Add `"private": true` and remove the dead `"main": "index.js"` field from `package.json` so a real `npm publish` refuses instead of shipping the whole repo.
- layer(s): repo-meta (not a `pharn/` capability layer — `package.json` sits outside `pharn-contracts` / `pharn-core` / `pharn-pipeline` / `pharn-review`)
- constitution_refs: [P6, P7]

## Applied lessons

- L8 — This increment's sole output is one file (`package.json`); the writes-scope for `/pharn-dev-build` will resolve to that single `--target`, matching L8's "favor single-file command outputs" guidance directly (no multi-artifact placeholder to lose scope on).
- L19 — Any format/lint command run over this change during build or this plan's own artifact-formatting step must be scoped to the specific written file (`npx prettier --write package.json`, `npx prettier --write .dev/features/f8-package-private/PLAN.md`), never a repo-wide `npm run format`, so no unrelated file is silently swept into this increment's diff.

## Files

- `package.json` — add `"private": true` after `"version"`; delete the `"main": "index.js"` line — layer repo-meta

## Contracts satisfied

- None — `package.json` is not a `pharn-contracts` schema, a Capability, or a rule/lens/griller. This is a repo-meta correction outside the capability tree, so no `pharn-contracts` entry applies (CLAUDE.md, "Repo layout — the dev/product boundary").

## Evals to write (P1)

- None — P1 ("no Capability ships without evals") governs `role:`-bearing Capabilities under `pharn/`. `package.json` carries no `role:` frontmatter and is not a Capability, so P1 does not apply to this increment.

## Guarantee audit (P0)

- "A real `npm publish` refuses once `private: true` is set" → **advisory (external system behavior)**. This is npm's own documented behavior, not a reduction to one of PHARN's three floor primitives (hook / content-hash / enum-regex) — no PHARN-side hook, hash, or enum check enforces it. It is stated as an observable npm behavior, never labeled a PHARN guarantee.
- "`package.json` still parses and is prettier-clean after the edit" → **floor-adjacent, enforced by the existing gate**: `npm run format:check` (part of `npm run check`) already runs `prettier --check .` over the whole repo, so a malformed or unformatted `package.json` fails that pre-existing gate. No new floor primitive is added by this increment.
- "This edit does not alter the product surface" → **enum/regex-reducible, by inspection**: `package.json` is not in CLAUDE.md's bump-triggering set (the `pharn/` capability tree, `pharn/floor/*.mjs`, the four trusted docs, the product `.claude/` surface) — it is named explicitly under "Pure repo-meta ... does not bump either." No `SKILLS_VERSION` bump, no floor check needed to prove it (the claim rests on the already-published, human-authored enumeration in CLAUDE.md, not on a new mechanism this increment invents).

## Open questions (HALT)

- None. The defect is reproduced live (see plan args), the fix is a two-field JSON edit with no ambiguity, and CLAUDE.md is dispositive on the no-bump question.
