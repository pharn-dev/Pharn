# PLAN — check-config model-routing correctness (resolve hardening + reverse-scan + honest wording)

- spec_content_hash: 11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969 # fix #4 (sha256 of ARCHITECTURE.md)
- increment: Make `.dev/floor/check-config.mjs` actually deliver the determinism + honesty it claims — fix a prototype-chain leak that lets a floor tool emit `{}` at exit 0, close the config↔commands agreement scan's missing reverse direction, and correct wording that overstates an open namespace bound as a closed allowlist.
- layer(s): build apparatus (`.dev/floor/`) — NOT a product layer (excluded wholesale by `validate.mjs`; the tool is a floor primitive, not a `role:` Capability) # ARCHITECTURE.md §2 primitive #3, §4
- constitution_refs: [P0, P5, P6, P7]

## Single axis of change (P3)

One reason to change: **`check-config.mjs`'s guarantees as a floor primitive must actually hold and be honestly scoped.** All three sub-fixes serve that one axis (determinism of `resolve`, completeness of the agreement membership test, honesty of the enum-bound claim). No unrelated change-reason is folded in. One PR.

## Files

- `.dev/floor/check-config.mjs` — (FIX 1) `resolveStage` own-property membership pick; (FIX 3) bidirectional agreement (add reverse scan); (FIX 2) reword overstated "allowlist" comments — layer: build apparatus (`.dev/floor`)
- `.dev/floor/check-config.test.mjs` — add tests: prototype-key resolve → default fallback (not `{}`); unwired command with `model:` frontmatter → RED; open-namespace witness (a `claude-*` non-real id validates — the bound is a namespace, not a closed allowlist) — layer: build apparatus (`.dev/floor`)

## The three fixes (exact)

**FIX 1 — resolve prototype-chain leak (:120), the P0-class one.**
`const entry = stages[stage] || stages.default;` → `const entry = Object.hasOwn(stages, stage) ? stages[stage] : stages.default;`
An **own-property** membership test (P5), not an inherited-truthy pick. Also correct the `:8` comment to describe the code: resolution is the own-property pick `Object.hasOwn(stages, stage) ? stages[stage] : stages.default` (removes the `??`-vs-`||` doc/code drift AND documents _why_ own-property — inherited members like `toString` are truthy, so neither `||` nor `??` would exclude them). Behavior after fix: `resolve toString` → the `default` entry at exit 0 (identical to any unknown stage, e.g. `resolve grill`), **never** `{}`.

**FIX 2 — honest wording (:6, :24, :25).**
The valid-model set is `MODEL_ALIASES` (a closed set {sonnet,opus,haiku,fable,inherit}) **∪** `MODEL_ID_RE` (an **open** `claude-*` regex admitting non-real ids). Reword "a fixed allowlist" / "∈ allowlist" / "a DIFFERENT allowlisted model" → "bounded to the Claude model namespace (a closed alias set ∪ an OPEN `claude-*` id regex — a namespace bound, not a closed allowlist)". Comments only; no logic change. Witnessed by a new test asserting a non-real `claude-*` id validates GREEN.

**FIX 3 — bidirectional agreement (reverse scan).**
`doAgreement` currently iterates config-stages → command files only. Add a **reverse** membership pass: enumerate `pharn-dev-*.md` in `commandsDir` (via `readdirSync`); for any file whose frontmatter carries `model:` or `effort:`, its `<stage>` (from `pharn-dev-<stage>.md`) MUST be a key in `models.stages`, else RED. Closes the drift where an _unwired_ command gains `model:`/`effort:` frontmatter invisibly. Update the GREEN message to reflect the now-bidirectional check. GREEN over the real repo today (only build/plan/review carry the frontmatter, all three wired).

## Contracts satisfied

- None in `pharn-contracts` — `check-config.mjs` is a floor primitive (ARCHITECTURE.md §2 #3: enum/regex/presence membership), not a product Capability consuming a contract. It is the deterministic backstop, cited by the model/effort config surface.

## Evals to write (P1)

`check-config.mjs` is a deterministic floor tool, **not** a `role:` Capability, so P1's `evals/cases` + `evals/expected` do not apply; its spec IS its `node --test` suite (same convention as every other `.dev/floor/*.test.mjs`). New black-box tests (subprocess, exit-code + stdout assertions):

- FIX 1 → `resolve toString` / `resolve constructor` / `resolve __proto__` → stdout == the `default` entry JSON, exit 0 (fail-closed to default, **never** `{}`). Regression witness for the exact live failure.
- FIX 3 → `agreement` over a temp commands dir containing an **unwired** `pharn-dev-eval.md` with `model:` frontmatter but no `eval` config stage → exit 1, `RED — agreement failed`. Plus: the existing forward-agreement GREEN test still passes (bidirectional check stays GREEN when both directions agree).
- FIX 2 → a non-real `claude-*` id (`claude-totally-fake-9000`) validates GREEN — documents that the bound is a namespace, not a closed allowlist (the honest claim FIX 2's wording now makes).
- The `★ live ★` agreement test (real repo config + `.claude/commands`) stays GREEN — the reverse scan skips the 6 unwired commands (no model/effort frontmatter) and confirms the 3 wired ones.

## Guarantee audit (P0)

- "`resolve <stage>` deterministically returns a stage-or-default `{model, effort}`, never a silent `{}`" → **floor: enum-regex/presence (#3)** — own-property membership + validated-present `default`; the fix makes the _existing_ claim actually hold.
- "config↔commands agree in **both** directions" → **floor: enum-regex/presence (#3)** — set-membership (frontmatter-bearing command stages ⊆ config stages) + per-stage equality; deterministic file-vs-file compare (same class as content-hash #2).
- "valid model ∈ the Claude model namespace" → **advisory-honest relabel**: the alias set is a closed enum (floor #3), but the `claude-*` regex is an OPEN bound — FIX 2 stops calling the union a "fixed allowlist." No new guarantee is claimed; an OVERSTATED one is corrected (the core P0 hygiene: "written in the comment" ≠ closed set).
- "check-config GREEN ⇒ the stage RAN under model X" → remains **explicitly NOT guaranteed** (runtime binding is platform-applied, invisible to any hook/hash/enum; already stated at `:13–20`, unchanged).

## Trust audit (P2)

`pharn.config.json` and command frontmatter are repo-local, human-authored **trusted** DATA (parsed as JSON/YAML frontmatter, never executed). No untrusted artifact is ingested. The reverse scan reads only enum-gated fields (frontmatter key _presence_ + the `<stage>` filename token) and the verdict ranges only over membership — no free-text field steers control flow. Blast radius of a poisoned config is unchanged (a different namespace-valid model/effort at most; never an injected instruction).

## Determinism audit (P5)

- FIX 1: replaces a truthy pick (`||`, which leaks the prototype chain) with an **own-property** membership test (`Object.hasOwn`) — strictly more deterministic; terminal fallback on a non-member stage is the validated `default`, and on an absent `default` a loud RED — never a guess.
- FIX 3: a set-membership test (command-file stage ∈ config stages); non-member → loud RED.
- FIX 2: no branch — comment-only.

## Open questions (HALT)

- None blocking. All three findings were reproduced against live state this run (`resolve toString` → `{}` exit 0 confirmed; `MODEL_ID_RE` open-match confirmed; only build/plan/review carry model/effort frontmatter confirmed). Two design decisions were resolved from the description + live reading and are recorded above for approval, not deferred:
  1. **Reverse scan folded into `agreement` mode** (making it bidirectional) rather than a new mode — matches "add a reverse scan" and keeps one entry point; the GREEN message is updated accordingly.
  2. **FIX 2 wording scoped to `check-config.mjs` comments** (`:6/:24/:25`); the test file gets a _witness test_ rather than comment edits (its "allowlist regex" phrasing at `:132` is accurate about the regex itself).
