# PLAN — per-stage model/effort config + floor validator

- spec_content_hash: 11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969 # fix #4 (sha256 of ARCHITECTURE.md, read live this run)
- increment: Add a declared `pharn.config.json` (per-stage `{model,effort}`) and a deterministic floor checker that validates it, resolves a stage → `{model,effort}` (missing → `default`), and verifies each wired dev command's static `model:`/`effort:` frontmatter AGREES with the config — the config↔frontmatter agreement being the config's real floor-checked consumer.
- layer(s): build apparatus (dev tooling) — `.dev/floor/` checker + root `pharn.config.json` + `.claude/commands/` frontmatter. NOT a product layer (ARCHITECTURE §4); this configures the `/pharn-dev-*` build loop, not shipped PHARN capabilities.
- constitution_refs: [P0, P2, P4, P5, P6, P7]

> **Direction (recorded at GATE-1 discovery halt).** The increment as originally phrased could not be
> built soundly and was redirected by the human to **Option B — config file + floor validator, binding
> explicitly ADVISORY**, which also **authorizes reversing the P7 deferral** of `pharn.config.json`
> (`.claude/commands/pharn-loop.md:90`). Corrected premises from live Claude Code docs (verified this run):
> (1) commands-as-skills **do** support `model:` **and** `effort:` frontmatter directly — the "no
> per-command override → use subagents" premise is **false**, so **no subagents are introduced**;
> (2) frontmatter is **static** — nothing reads model/effort from JSON at runtime, and **`effort` has no
> per-invocation/config-driven runtime override at all**; (3) therefore "a stage RUNS UNDER its configured
> model+effort" has **no floor reduction** and is labeled **advisory** below (P0). The real effort enum is
> `{low,medium,high,xhigh,max}` (the increment's `{low,high,max}` was incomplete); there is **no
> `/pharn-dev-pr`** stage (the `pr` key is dropped).

## Files

- `pharn.config.json` — NEW (root). `{ "models": { "stages": { "default": {model,effort}, "plan": …, "build": …, "review": … } } }`. Declared source of truth for per-stage model/effort. — layer build-apparatus (config; a `.json`, so `validate.mjs` — which walks only `.md` — ignores it)
- `.dev/floor/check-config.mjs` — NEW. Deterministic checker: **validate** (shape + enums, `default` required), **resolve** `<stage>` → `{model,effort}` (`stages[stage] ?? stages.default`), **agreement** (each wired stage's `.claude/commands/pharn-dev-<stage>.md` frontmatter `model:`/`effort:` must equal the config-resolved value). Exits non-zero on any RED. Node stdlib only. — layer build-apparatus (floor)
- `.dev/floor/check-config.test.mjs` — NEW. `node --test` cases (auto-run by `npm test`'s `.dev/**/*.test.mjs` glob). — layer build-apparatus (floor test)
- `.claude/commands/pharn-dev-plan.md` — EDIT (frontmatter only): add `model: opus` + `effort: high`. — layer build-apparatus (command)
- `.claude/commands/pharn-dev-build.md` — EDIT (frontmatter only): add `model: sonnet` + `effort: high`. — layer build-apparatus (command)
- `.claude/commands/pharn-dev-review.md` — EDIT (frontmatter only): add `model: opus` + `effort: high`. — layer build-apparatus (command)

_(Seed values above are placeholders — see Open question 3. Other `/pharn-dev-*` commands are intentionally left with no `model:`/`effort:` frontmatter → they use session/`inherit`, described by the config's `default` entry; only the three wired stages carry frontmatter and are agreement-checked.)_

## Contracts satisfied

- No `pharn-contracts` schema is added or consumed — this is build-apparatus (floor tooling), which sits **outside** the product-capability contract set (ARCHITECTURE §3.3: hooks/floor are a separate class, not Capabilities). It reuses the established **`.dev/floor/check-*.mjs` + `.dev/floor/check-*.test.mjs`** convention (cite, don't restate — P4) exactly as `check-spec.mjs`, `check-verify.mjs`, `check-loop.mjs` do.

## Evals to write (P1)

Floor checkers are tested by their `.test.mjs` (repo convention), not by capability `evals/` (there is no `role:` here). `check-config.test.mjs` cases:

- valid config → GREEN; `resolve plan` → `opus/high`, `resolve build` → `sonnet/high`, `resolve review` → `opus/high` (correct per-stage resolution)
- `resolve grill` (a stage with no explicit entry) → falls back to `default` `sonnet/high` (missing stage → default)
- bad model (`"gpt-4o"`, not in `{sonnet,opus,haiku,fable,inherit}` ∪ `^claude-[a-z0-9][a-z0-9-]*$`) → RED
- bad effort (`"turbo"`, not in `{low,medium,high,xhigh,max}`) → RED
- missing `default` entry → RED
- malformed JSON / missing `models.stages` → RED (fail-closed)
- agreement: command frontmatter matches config → GREEN; a deliberately mismatched frontmatter (`model:` differs, or the field absent) → RED

## Guarantee audit (P0)

- "`pharn.config.json` shape is valid; every `model` ∈ allowlist; every `effort` ∈ `{low,medium,high,xhigh,max}`; `default` present" → **floor: enum-regex** (`check-config.mjs`).
- "a stage with no explicit entry resolves to `default`" → **floor: enum-regex** (deterministic `stages[k] ?? stages.default` lookup; membership test, P5).
- "each wired command's `model:`/`effort:` frontmatter equals the config-resolved value (no config↔frontmatter drift)" → **floor: enum-regex** (deterministic equality between two repo files — the config's real consumer; same drift-detection class as content-hash).
- "each stage **RUNS UNDER** its configured model+effort at runtime" → **advisory.** No PHARN hook/content-hash/enum can observe or enforce the runtime's model/effort selection. It rests on the Claude Code platform honoring static frontmatter (documented behavior, not a PHARN floor primitive); under a multi-stage `/pharn-dev-ship` turn the per-skill `model:`/`effort:` "applies for the rest of the turn," so cross-stage application is platform-dependent and **uncertain**. Labeled advisory wherever it appears; **no guaranteed decision rests on it** (P0). `check-config.mjs` guarantees config/frontmatter **consistency**, never runtime application.

## Trust audit (P2)

- `pharn.config.json` and the command frontmatter are **repo-local, human-authored DATA**, read as JSON / parsed as YAML frontmatter — **never executed**. Their values are floor-validated against fixed enums, so a poisoned/edited config can at most select a _different allowlisted_ model/effort for a stage (bounded, **advisory** blast radius — changes which model runs, never injects instructions); an out-of-enum value is **rejected RED**. No tainted free-text reaches any guaranteed decision — the guaranteed decisions here (validate / resolve / agreement) read only enum-gated fields and reject non-members. Consistent with §8's finding-object discipline.

## Resolved at GATE 1 (no open questions)

Approved by the human at the plan gate (all recommended options taken; the plan body above already reflects them):

1. **Scope size** → **foundation + agreement** (all six files above; the config↔frontmatter agreement check is the config's floor-checked consumer).
2. **Config location** → **root `pharn.config.json`**.
3. **Seed values** → `default = sonnet/high`, `plan = opus/high`, `build = sonnet/high`, `review = opus/high`.

No open questions remain — cleared for `/pharn-dev-build`.
