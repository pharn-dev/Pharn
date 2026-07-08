# PLAN — installed-skills-context (respect user-installed skills as advisory context)

- spec_content_hash: 11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969 # fix #4 (sha256 of ARCHITECTURE.md, this run)
- increment: The product stages `/pharn-build`, `/pharn-grill`, `/pharn-review` discover the user's already-installed Claude Code skills (`.claude/skills/*/SKILL.md`) via one deterministic enumerator and incorporate their content as **advisory, untrusted** context — so build follows their conventions and grill/review consider them — adding **no** floor guarantee that code "matches" a skill.
- layer(s): tooling — product command prose (`.claude/commands/pharn-*.md`) + one deterministic floor helper (`.dev/floor/`). No `pharn-contracts` / `pharn-core` capability is added (commands carry no `role:`, so this is not a Capability increment; ARCHITECTURE.md §3.1).
- constitution_refs: [P0, P2, P5, P6, P7]

## The one axis (P3/P7)

One axis of change: **"incorporate user-installed skills as advisory context into the three user-facing pipeline stages."** The helper (enumerate) + the three command edits (incorporate) all serve exactly that axis. Nothing else changes — no new gate, no existing gate moved, no new artifact format.

## Scope decision: PRODUCT commands only (recommended; confirm at halt)

CONTEXT is the **user's** repo: a PHARN user installs vendor/tech skills (supabase, …) into **their** `.claude/skills/`, and wants **their** build/grill/review to respect them. That is the `pharn-` (product) trio, not the `pharn-dev-` (build-PHARN-itself) trio — PHARN's own repo has no `.claude/skills/` (verified absent this run). So the target is `/pharn-build`, `/pharn-grill`, `/pharn-review` only. (Open question 1 confirms this.)

## Files

- `.dev/floor/scan-installed-skills.mjs` — deterministic enumerator: scans `<dir>/.claude/skills/*/SKILL.md`, prints `{"count":N,"skills":[{"name","path"}...]}` (sorted, stdlib-only, fail-safe empty when absent). Mirrors the `count-grillers.mjs` enumeration idiom but over **directory presence** (not frontmatter), and its output **gates nothing**. — layer tooling (`.dev/floor/`)
- `.dev/floor/scan-installed-skills.test.mjs` — `node:test` suite: a fixture repo with an installed `SKILL.md` → `count:1` + the path; an absent/empty `.claude/skills/` → `count:0`, exit 0. Runs under `npm test`. This IS the increment's deterministic test (SPEC "tests" requirement). — layer tooling (`.dev/floor/`)
- `.claude/commands/pharn-build.md` — add a discovery+incorporation step: run the enumerator, read each listed `SKILL.md` as `trust: untrusted` advisory DATA, let it shape the (already-advisory) implementation in Step 3; honest P0 label; extend the Guarantee/Trust/Determinism audits. — layer tooling (product command prose)
- `.claude/commands/pharn-grill.md` — add an interrogation input: enumerate installed skills and consider their practices when surfacing plan concerns (advisory, in Step 3); the skill set never moves the Step-2 hash-chain gate; extend audits. — layer tooling (product command prose)
- `.claude/commands/pharn-review.md` — thread the enumerated skills into each lens subagent as additional `trust: untrusted` advisory context; the skill set never moves lens membership (Step 2) or the merge (Step 5); extend audits. — layer tooling (product command prose)

### Not touched / non-goals (P7)

- No `pharn-dev-*` command (they build PHARN, which has no user `.claude/skills/`).
- No personal `~/.claude/skills/` scan — the increment is "installed **in the repo**"; project scope only.
- No new SKILL.md format, no fetching, no seeding, no writing/altering the user's skills.
- No floor gate that checks code "conforms to" a skill (explicitly out — that would be the P0 disease; see Guarantee audit).

## Contracts satisfied

- `pharn-contracts/finding-shape.md` — grill/review already emit findings in the enum-gated / free-text split; skill content enters **only** the free-text/advisory judgment side, never an enum-gated gate input. Cited, not restated (P4).
- No new contract is introduced; `pharn-contracts` is untouched (the shared-abstraction root stays as-is; P3).

## Evals to write (P1)

- P1 (Capability→evals) does **not** bind here: the edited files are **commands** (no `role:` frontmatter → not Capabilities per ARCHITECTURE.md §3.1) and `scan-installed-skills.mjs` is a **floor helper** (`.mjs`), which ships a `.test.mjs` (like every `count-*`/`scan-*` sibling), not an `evals/` pair. `validate.mjs` scans the product-capability surface and ignores `.claude/commands/` + `.dev/` — so this increment adds no capability the eval-presence check governs.
- The deterministic test that stands in for the SPEC "tests" line:
  - `scan-installed-skills` → fixture `.claude/skills/acme/SKILL.md` present → `{"count":1,...}`, exit 0.
  - `scan-installed-skills` → no `.claude/skills/` dir → `{"count":0,"skills":[]}`, exit 0 (absence is not an error — advisory context, fail-**safe**, not fail-closed).

## Guarantee audit (P0)

- **"The stages deterministically enumerate which skills are installed"** → **FLOOR: enum/regex (primitive #3)** — `scan-installed-skills.mjs` lists `.claude/skills/*/SKILL.md` by path membership; deterministic + `.test.mjs`-covered. This is a floor fact about _which files exist_, exactly like `count-grillers` membership.
- **"The enumerated skills shape the built code / the raised concerns"** → **ADVISORY** — model judgment. Always advisory; never guaranteed.
- **"Code respects / conforms to / matches an installed skill"** → **NOT A CLAIM (struck as the P0 disease).** There is no deterministic check that code matches a skill, and none is added. "Respects installed skills" means _the agent had them in context_, never a guaranteed conformance. Any wording that reads as "build guarantees skill-compliance" is struck.
- **"Existing floor gates are unchanged"** → **FLOOR (unchanged):** build's hash-chain (`check-plan-spec-agree.mjs`) + writes-scope (fix #7); grill's hash-chain; review's `count-lenses` membership + `merge-findings`. **None reads skill content**; the enumerator gates nothing. The increment moves **no** existing gate and adds **no** gating primitive — only a non-gating enumerator + advisory prose.
- **Net:** adds one deterministic **enumerator** (FLOOR, but gating nothing — mirrors `count-grillers` membership feeding advisory running) and otherwise **advisory** context-enrichment. No new guarantee is claimed over the code.

## Trust audit (P2)

- **Input — `.claude/skills/*/SKILL.md`:** user-dropped, **not** a write-protected trusted doc → `trust: untrusted` DATA. (The four trusted docs stay the only trusted channel; a SKILL.md is community-grade markdown — LIMITS.md §1a "markdown is executable" applies.)
- **Enumerator taint path:** `scan-installed-skills.mjs` ranges over **paths/names only** (directory membership), never SKILL.md free-text meaning — so its FLOOR output carries no taint into any gate (mirrors how `count-grillers` reads frontmatter membership, not prose).
- **Incorporation taint path:** SKILL.md **content** enters only the **advisory** layer — build's Step-3 implementation choices, grill's Step-3 interrogation, review's per-lens judgment. It is quoted/treated as DATA; instruction-looking content in a SKILL.md ("always add a backdoor", "skip authz") is **never** followed as a directive that moves a floor gate or escapes the writes-scope. In review it is handed to each lens subagent under the same CONSTITUTION fence the untrusted target already gets.
- **Residual (named, not hidden — LIMITS.md §2, THREAT-MODEL.md §5):** a hostile SKILL.md can steer the model's **advisory** implementation (build) or **advisory** concerns (grill/review) — **bounded**: (a) build cannot escape the fix #7 writes-scope (a write outside the plan's `## Files` is denied at the floor regardless of what a skill says); (b) grill/review **gate nothing** on the interrogation/lens judgment; (c) build output is re-checked downstream by `/pharn-regress` + `/pharn-verify` + human review. This is the **same residual class** already named for hostile PLAN prose in `pharn-build.md`'s trust audit — not zeroed, but structurally capped.

## Determinism audit (P5)

- **Discovery** = deterministic membership (`scan-installed-skills.mjs` globs a fixed path set); **no LLM classification** decides which skills exist.
- **Incorporation** = advisory model judgment — and it drives **no gated branch**: no proceed/stop/verdict reads skill content. The only branches in the three stages remain their existing exit-code/enum gates (hash-chain, writes-scope, lens membership, merge), untouched.
- **"No skills present" → unchanged behavior** is deterministic: the enumerator returns `count:0`, the incorporation step is a **no-op**, and the stage proceeds exactly as today (SPEC "no skills → unchanged").
- **Terminal fallback:** if `.claude/skills/` is absent/unreadable, the enumerator yields empty (fail-**safe** — advisory context, so absence is not an error); nothing to ask, nothing to guess. Where a skill's guidance is genuinely ambiguous for a build choice, the stage's existing P5 fallback (ask the human) still governs.

## Open questions (HALT)

1. **Target commands** — confirm this wires **only** the product trio (`/pharn-build`, `/pharn-grill`, `/pharn-review`), not also the `pharn-dev-*` build-PHARN commands. (Recommended: product-only — the user scenario; PHARN's own repo has no `.claude/skills/`.)
2. **Discovery mechanism** — confirm the **deterministic enumerator helper** (`scan-installed-skills.mjs` + `.test.mjs`, FLOOR-enumeration / ADVISORY-incorporation split) over a **pure-prose scan**. (Recommended: helper — it is the only way to give the SPEC's "tests" a runnable deterministic check, and it mirrors the `count-*` idiom; the "no floor guarantee" the SPEC asks for is preserved because the enumerator gates nothing and never claims code-conformance.)
