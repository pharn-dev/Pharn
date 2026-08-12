# PLAN — F13: document the Mode-B `## Files` exclusion-cue caveat

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52
- applied_lessons: [L18]
- increment: Document, in `/pharn-plan.md`'s `## Files` contract blockquote, that a bare non-blockquote prose line under `## Files` containing exclusion-style wording (`not touch/writ/modif/edit/chang`, `explicitly excluded`, `out of scope`, `off limits`) truncates the authorized list at that line — and tell the author to use a blockquote, a path-item description, or the `### Explicitly not touched` heading instead. No code change to `set-writes-scope.cjs`.
- layer(s): `.claude/` product command surface (not a `pharn-contracts` layer — a command doc, per `pharn/ARCHITECTURE.md §4`'s command/hook split)
- constitution_refs: [P0, P5, P6, P7]

## Applied lessons

- L18 — L18 established that Boundary 1 (a real markdown heading) is the structural, wording-independent mechanism for a PLAN's exclusion block, and that the free-text Boundary-2 cue's vocabulary is deliberately narrow (so a differently-worded real exclusion can miss it and fail OPEN). That is the exact asymmetry this increment weighs: narrowing the cue to stop today's false-positive (an innocent sentence, fail-CLOSED) risks recreating L18's fail-OPEN failure mode for a real exclusion phrased outside the narrowed pattern. L18's own remedy was "use the heading form" — which is precisely what this increment tells the author to do, in the one place (`/pharn-plan.md`'s `## Files` blockquote) an author reads before writing a plan. This confirms option (A) — document and steer authors to the heading — over option (B) — narrow the regex — because (B) is the code-side echo of the mistake L18 already showed is dangerous.

## Files

- `.claude/commands/pharn-plan.md` — add a short caveat to the existing "`## Files` is the PARSEABLE writes-scope" blockquote (after rule 3, before the closing sentence about `## Steps`): a bare, non-blockquote prose line under `## Files` that reads like an exclusion truncates the authorized list at that line; put narrative in a blockquote or a path-item description, and use `### Explicitly not touched` for real exclusions. Also rephrases the blockquote's closing "only `## Files` back-tick paths become the build's scope" sentence so it does not read as "non-path lines are harmless."
- `CHANGELOG.md` — add an `[Unreleased]` entry under `### Fixed` (a doc clarification, framed honestly as such — no behavioral change) recording the caveat and the `SKILLS_VERSION` bump.
- `SKILLS_VERSION` — bump `2.5.2` → `2.5.3` (patch).
- `README.md` — update the shields version badge (line 13) from `pharn-2.5.2-blue` to `pharn-2.5.3-blue`,
  so it agrees with the bumped `SKILLS_VERSION` (`.dev/floor/check-version-badge.mjs`'s live invariant).
  Added after `/pharn-dev-regress` caught this omission as a real, deterministic regression
  (`.dev/floor/check-version-badge.test.mjs`'s live self-check against this repo) — not a speculative
  addition (P7): the failure was observed, not hypothesized.

### Explicitly not touched

- `.claude/hooks/set-writes-scope.cjs` — reused as-is; Boundary 1 and Boundary 2 (including the exclusion-cue regex) are unchanged. This plan implements option (A) from the build prompt (document), not option (B) (narrow the regex).
- `.claude/hooks/set-writes-scope.test.cjs` — no behavior changed, so no new/updated assertions are required; existing tests continue to pass unmodified.
- `.claude/commands/pharn-dev-plan.md` — this command's own `## Files` template is simpler (no equivalent "Three rules" blockquote) and is not named by the build prompt's scope; out of scope for this increment (P7 — no speculative parity edit not triggered by a real failure).

## Contracts satisfied

- No `pharn-contracts` schema is touched — this is a product-command documentation fix, not a Capability, contract, or floor checker change. `pharn/ARCHITECTURE.md §4`'s layer tree does not apply to `.claude/commands/*.md`; the relevant governing doc is CLAUDE.md's "SKILLS_VERSION discipline" (product-surface bump rules) and "Writes-scope" (fix #7) sections, cited not restated.

## Evals to write (P1)

- None. `/pharn-plan.md` is a command doc, not a `role:`-bearing Capability (`pharn/ARCHITECTURE.md §3.1`), so P1's eval requirement does not apply. No `rule_id` is introduced.

## Guarantee audit (P0)

- "The `## Files` blockquote now documents the exclusion-cue truncation behavior" → **advisory** (prose guidance for a human author; nothing on the floor enforces that an author reads or follows it).
- "The truncation _behavior itself_ is unchanged" → reduces to the existing floor: `set-writes-scope.cjs` Boundary 1 (structural heading match) and Boundary 2 (the unchanged regex cue) are untouched code, verified by re-running the existing `.claude/hooks/set-writes-scope.test.cjs` suite unmodified and green, plus a live re-run of the repro command from the build prompt showing identical output before and after this change.
- "`SKILLS_VERSION` correctly reflects that product-surface bytes changed" → **floor, narrowed**: `.dev/floor/check-version-badge.mjs` only checks the README badge agrees with `SKILLS_VERSION`; it does not check that a bump was _warranted_ — that judgment is CLAUDE.md's bump-discipline rules, applied here by hand (a `.claude/commands/*.md` non-`pharn-dev-` file is bump-triggering product surface per CLAUDE.md).

## Trust audit (P2)

Not applicable — no untrusted artifact is ingested by this increment. The build prompt (this plan's own input) is treated as `trust: untrusted` per `/pharn-dev-plan`'s standing instruction, but it contains no instruction-looking content beyond ordinary task description; nothing in it is executed as a directive outside the human-gated plan/build/review loop.

## Open questions (HALT)

- Confirm the resolution: option (A) document-only (recommended by the build prompt and reinforced by L18) vs option (B) narrow the regex. This plan is drafted for (A); if the human selects (B) instead, the plan must be revised (different `## Files`, different guarantee audit, different tests) before approval.
- The build prompt states "currently `SKILLS_VERSION 2.5.1`", but live discovery (Step 1) found `SKILLS_VERSION` is already `2.5.2` (an unrelated prior fix, per `CHANGELOG.md`'s `[Unreleased]` section, already landed on `main`). This plan bumps from the live `2.5.2` to `2.5.3`, not from `2.5.1` — confirm this is expected and not a sign the prompt was written against a stale checkout.
