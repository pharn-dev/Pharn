# PLAN — seam-build-wiring (make the resolver operative at build seams)

- spec_content_hash: 11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969 # fix #4 — sha256(ARCHITECTURE.md), pinned this run (unchanged from the seam-resolver increment)
- increment: Add a seam-handling **Step 2c** to `.claude/commands/pharn-build.md` — when the product build touches a framework/library seam, it validates the project's seam-config with `.dev/floor/check-seam-config.mjs` (fail-closed: RED → HALT) and then follows the committed `pharn-core/seam-resolver` skill's deterministic walk.
- layer(s): pharn-pipeline (product build command prose — `.claude/commands/pharn-build.md`; `validate.mjs` deliberately does **not** scan `.claude/`, so this increment has no capability-floor surface)
- constitution_refs: [P0, P2, P4, P5, P6, P7]

## What already exists (discovery, read live this run — P6)

- `pharn-core/seam-resolver/seam-resolver.md` — the resolver skill (the deterministic walk). **Committed** (prior increment, `80ee982`).
- `pharn-contracts/seam-config.md` — the config schema; `.dev/floor/check-seam-config.mjs` — the config validator (green, 13/13 tests). **Done.**
- `.claude/commands/pharn-build.md` — the product build command. Today it has **no** seam handling (`grep -i seam` → nothing). Its Step 2b ("Discover installed skills") is the exact idiom this increment mirrors: a deterministic sub-invocation + advisory incorporation, with the honest FLOOR/ADVISORY split already spelled out in its audits.
- `pharn.config.json` — `models` block only; **no `seam` block** (unchanged; the deferred Q2 config-surface question resurfaces here — see Open questions).

## Files

- `.claude/commands/pharn-build.md` — EDIT (one file, one axis): add **Step 2c — Resolve seams** (deterministic config validation via `check-seam-config.mjs` + advisory resolver walk), and extend the command's **Guarantee / Trust / Determinism** audits to cover it. — layer pipeline (product command prose)

## Contracts satisfied

- `pharn-contracts/seam-config.md` — the new step **cites** the config schema + the terminal-`ask` floor invariant (does not restate — P4). The build **consumes** a seam-config and defers its validity verdict to `check-seam-config.mjs`.
- `pharn-core/seam-resolver/seam-resolver.md` — the step **cites** the resolver skill and hands off the walk to it (does not restate the walk — P4).

## Evals to write (P1)

- **None required.** This increment adds **no** role-bearing Capability and **no** new deterministic helper — it is command prose that invokes the **already-tested** `check-seam-config.mjs` (`.dev/floor/check-seam-config.test.mjs`, green). `validate.mjs` ignores `.claude/`, so there is no capability-eval obligation, and P1 is not triggered (nothing new to bind an eval to). Reusing a tested checker rather than adding an untested one is the honest move (P7 — no speculative helper).

## Guarantee audit (P0)

- "The build validates the seam-config before resolving a seam" → the **checker's verdict is FLOOR** (`check-seam-config.mjs` exit, primitive #3); the build **invoking it and obeying RED** is **ADVISORY command orchestration** — the _same two-clocks split_ the command already uses for its Step-2 hash-chain gate and Step-4 project gate (cite pharn-build.md §"Guarantee audit").
- "A RED (unsafe) seam-config halts the build" → **FLOOR signal + ADVISORY obey** — fail-closed is command discipline backed by the checker's exit code, exactly as pharn-build.md frames its "no parseable scope → REFUSE."
- "`ask` can never be configured away / config validity" → **FLOOR** (`check-seam-config.mjs`, already built/green) — this increment **makes that pre-existing floor OPERATIVE in the documented build flow**; it does **not** add a new primitive.
- "The build **hits** a seam here / identifies the boundary" → **ADVISORY** (model recognizes the seam — irreducible judgment), bounded downstream by the terminal `ask`.
- "The seam is **resolved correctly**" → **ADVISORY** (the resolver's own audit — confidence gate + terminal `ask`). "wired the resolver in" ≠ "seams resolve correctly."
- **No new floor primitive.** The entire floor story remains `check-seam-config.mjs`. The wiring is advisory orchestration that routes the build through it.

## Trust audit (P2) — the build ingests an untrusted artifact (the seam-config)

- The project's seam-config may be **untrusted** (forked/poisoned repo — `THREAT-MODEL.md §2`). Step 2c branches only on the checker's **exit code** (enum/type verdict over enum-gated fields) — never on any free-text in the config. A poisoned config can only go RED (→ HALT) or carry ignored extra fields; it **cannot** steer the build through free-text, and it **cannot** escape the fix #7 writes-scope (a write outside the plan's `## Files` is still denied). Same bounded residual as hostile PLAN prose / installed `SKILL.md` (cite pharn-build.md §"Trust audit").
- Anything the resolver **fetches** at the `fetch` step is untrusted and fenced as DATA by the resolver skill (already specified there); this step does not re-own that.

## Determinism audit (P5)

- The proceed/halt branch reads **only** `check-seam-config.mjs`'s exit code (a deterministic enum/type verdict) — no LLM classification gates it.
- Seam **identification** is advisory model judgment (as is "which code touches a framework boundary"); the walk it hands to is ordered/stop-at-first; the terminal fallback of the whole chain is **`ask` the human**, never a guess. When no seam is touched, Step 2c is a **no-op** (mirrors Step 2b's `count:0` path) and the build proceeds identically.

## Open questions (RESOLVED at GATE 1 — human approved 2026-07-08)

- Q1 (config surface) → **(A) Extract `.seam` inline** — Step 2c extracts `pharn.config.json`'s `seam` block to `.pharn/seam-config.json` scratch and validates that with `check-seam-config.mjs`; no `seam` block → documented default order. One axis; checker + config untouched.
- Q2 (fail-closed reach) → **HALT the whole build** on a RED config.

Original questions (for the record):

1. **Config surface / where Step 2c reads the seam-config (the deferred Q2, now load-bearing).** `check-seam-config.mjs` validates a **standalone** config file (the whole file _is_ the config), while `seam-config.md` says the config "lives in `pharn.config.json`'s `seam` block" — which does not exist yet. How should Step 2c obtain and validate it **without touching the green checker**?
   - **(A, recommended)** Step 2c **extracts** the `seam` block from `pharn.config.json` (if present) into `.pharn/seam-config.json` (gitignored scratch) and validates **that** with `check-seam-config.mjs`; if there is **no** `seam` block, use the documented **default order** (`official-skill → pinned-docs → model → fetch → ask`, which contains `ask` → still safe). Realizes "config in `pharn.config.json`'s seam block" via extraction. **One axis** (pharn-build.md only); checker + config untouched. _(The extraction is inline command bash — advisory orchestration; only the checker's verdict on the extracted file is floor.)_
   - **(B)** Step 2c validates a **standalone** `seam-config.json` path the project supplies; simpler, but does not match "lives in `pharn.config.json`."
   - **(C)** Widen the axis: add a real `seam` block to `pharn.config.json` **and/or** extend `check-seam-config.mjs` to read `.seam`. Touches a green/tested checker and/or a root config — a second axis.
2. **Fail-closed reach on a RED config.** On `check-seam-config.mjs` RED, should Step 2c **HALT the whole build** (recommended — an unsafe seam-config means seams cannot be resolved safely; halt and ask the human to fix the config), or only **skip seam-resolution** and continue building the non-seam parts? Recommendation: **HALT** (fail-closed, matches "no build against an unsafe config").
