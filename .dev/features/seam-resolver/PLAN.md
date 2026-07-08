# PLAN — seam-resolver (the agnostic resolution mechanism)

- spec_content_hash: 11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969 # fix #4 — sha256(ARCHITECTURE.md), pinned this run
- increment: Add the `pharn-core/seam-resolver` **capability** (`role: skill`) — the agnostic mechanism the agent follows when it hits a framework/library seam: walk `resolutionOrder` in order, stop at first resolution, apply the confidence-gate at the `model` step, terminate at `ask` — driven by the already-contracted seam-config.
- layer(s): pharn-core (L0–L2; the MECHANISM, agnostic — ARCHITECTURE.md §4 tree explicitly places "seam-resolver (the MECHANISM, agnostic)" here)
- constitution_refs: [P0, P2, P4, P5, P6, P7]

## What already exists (discovery, read live this run — P6)

- `pharn-contracts/seam-config.md` — the trusted schema for the config object (resolutionOrder step enum; the one floor invariant "resolutionOrder MUST contain `ask`"; optional `modelConfidenceThreshold`, `haltOnUnknown`). **Done.**
- `.dev/floor/check-seam-config.mjs` + `.dev/floor/check-seam-config.test.mjs` — the deterministic config validator. **Done and GREEN** (`node --test` → 13/13 pass this run).
- `pharn-core/seam-resolver/` — an **empty directory**. The capability itself is **unbuilt** — this is the gap this increment fills.
- `pharn.config.json` — has a `models` block only; **no `seam` block** today.

So the "config validator" half of the ask is already built. This increment builds the **resolver capability + its evals** — the one missing product artifact — and nothing else (see Open questions for the deliberately-deferred parts).

## Files

> Concrete paths only — the `--from-plan` scope-setter stores literal paths (globs/placeholders are stripped, `set-writes-scope.cjs`), and the enforce hook allow-lists exactly these. The capability + all 8 eval files (4 case/expected pairs) are enumerated so the build writes exactly them (P3, fix #7).

- `pharn-core/seam-resolver/seam-resolver.md` — the resolver capability — layer pharn-core. `role: skill`, `kind: pharn-owned`, `trust: trusted`, `coupling: agnostic`, `applies: ["universal"]`, `constitution_refs: [P0,P2,P4,P5]`, **no `enforces`** (a skill enforces no rule_id → floor CHECK 3 is vacuous). Describes the deterministic walk; **cites** `pharn-contracts/seam-config.md` for the schema and `.dev/floor/check-seam-config.mjs` for the floor invariant — does not restate them (P4).
- `pharn-core/seam-resolver/evals/cases/resolve-early-hit.md` — case: official-skill covers the seam.
- `pharn-core/seam-resolver/evals/cases/model-not-confident.md` — case: model below the confidence threshold.
- `pharn-core/seam-resolver/evals/cases/unknown-terminates-at-ask.md` — case: no step resolves.
- `pharn-core/seam-resolver/evals/cases/config-without-ask-is-refused.md` — case: config lacks `ask`.
- `pharn-core/seam-resolver/evals/expected/resolve-early-hit.md` — expected walk outcome for the above.
- `pharn-core/seam-resolver/evals/expected/model-not-confident.md` — expected walk outcome for the above.
- `pharn-core/seam-resolver/evals/expected/unknown-terminates-at-ask.md` — expected walk outcome for the above.
- `pharn-core/seam-resolver/evals/expected/config-without-ask-is-refused.md` — expected walk outcome for the above.

## Contracts satisfied

- `pharn-contracts/seam-config.md` — the resolver **consumes** this config object and **cites** its step enum + the terminal-`ask` invariant; it does not restate the schema (P4). The resolver is the runtime counterpart the contract names ("a future `pharn-core` capability").

## Evals to write (P1)

`seam-resolver` (skill) → four case→expected pairs. No `enforces`, so no rule_id→eval binding is required (CHECK 3 vacuous); CHECK 2 (evals present) is satisfied by the non-empty cases+expected dirs. Each `expected` declares `skill_kind: llm` and splits `assertions` per `pharn-contracts/eval-format.md`. **Honest bound (grill finding #1):** eval-format's `structural[]` kinds range only over finding-shape's enum-gated fields (`type`/`rule_id`/`severity`/`file`); the resolver is **not** a finding-emitter (its output is a walk-decision), so those kinds do not apply and the walk outcome is asserted in **`semantic[]` (advisory judge)** — which is **consistent with the guarantee audit** below ("resolution correctness = advisory"). Asserting a walk-decision structurally would require **extending eval-format** with a non-finding output kind — a separate axis, deferred (P7), not done here. The **floor** part of the story is unchanged: config validity / terminal-`ask` presence is owned by `check-seam-config.mjs` (already green), which the `config-without-ask-is-refused` expected **cites**:

- `resolve-early-hit` → a config `["official-skill", …, "ask"]` where the official skill covers the seam → expected: **stop at `official-skill`**, later steps unreached.
- `model-not-confident` → config with `modelConfidenceThreshold: high` at the `model` step, package version newer than training → expected: **skip `model`, fall through toward `ask`** (never guess).
- `unknown-terminates-at-ask` → no earlier step resolves → expected: **terminal `ask`** (halt, ask the human); with `haltOnUnknown: true`, a hard stop.
- `config-without-ask-is-refused` → a config whose `resolutionOrder` lacks `ask` → expected: the resolver **refuses to run the walk** (the floor invariant, `check-seam-config.mjs` RED) — fail-closed, no walk on an unsafe config.

## Guarantee audit (P0)

- "The walk is deterministic — ordered, stop-at-first-hit, terminal `ask`" → **floor: enum/presence** — the mechanism is an ordered instruction, and its _safety_ (a terminal `ask` always exists) reduces to `.dev/floor/check-seam-config.mjs` (primitive #3, `ARCHITECTURE.md §2`), which rejects any config lacking `ask`.
- "`ask` can never be configured away" → **floor: enum/presence** (`check-seam-config.mjs`, already built/green).
- "Config validity (steps ∈ enum, `ask` present, optional fields well-typed)" → **floor: enum/presence** (`check-seam-config.mjs`).
- "The model resolves the seam **correctly** at the `model` step" → **advisory.** Backstopped by the confidence-gate (skip-if-not-confident, toward `ask`) and the terminal `ask`. "resolver ran" ≠ "resolved correctly" — `ask` is the honest terminal (matches the contract's own guarantee audit and `THREAT-MODEL.md` line 66: "terminal fallback is **ask**").
- "The runtime walk is executed faithfully" → **advisory** — the agent following an ordered instruction; only the config validity that makes a _safe_ walk possible is floor here.

No new floor primitive is introduced: this increment reuses the existing `check-seam-config.mjs` (primitive #3). The capability adds a skill + evals; the floor story is entirely the pre-existing checker.

## Trust audit (P2) — the increment ingests an untrusted artifact (the seam-config)

- A seam-config may originate in **untrusted** input (a forked/poisoned repo — `THREAT-MODEL.md §2`: "seam-resolver fetch fallback" and "seam-record.json in a forked repo"). The resolver treats the config as **DATA**: it branches only on the enum-gated / type-checked fields (`resolutionOrder` steps ∈ enum, `ask` presence, the `modelConfidenceThreshold` enum, the `haltOnUnknown` boolean) — exactly the fields `check-seam-config.mjs`'s verdict ranges over.
- A poisoned config can only (a) name an invalid step → RED, (b) drop `ask` → RED (fail-closed, no walk), or (c) carry extra free-text fields → **ignored, unread by any branch**. Taint cannot flip the walk through free-text; no branch or guaranteed decision rests on a tainted field (`ARCHITECTURE.md §8`, P2).
- Anything the walk _fetches_ at the `fetch` step is itself untrusted (`THREAT-MODEL.md §2` ai_docs poisoning); the resolver's job here is only the **walk**; pinning/content-hashing a fetched resolution is the seam-record's concern, out of scope for this increment (named, not silently owned — P7).

## Determinism audit (P5)

- Every branch in the described walk is a **membership / presence / type test** over the config's enum-gated fields, never LLM classification: "is step[i] ∈ enum", "is the model confident to `modelConfidenceThreshold`" (a threshold compare, and if the model can't establish it → treat as not-confident → skip), "does `resolutionOrder` contain `ask`".
- The terminal fallback of the chain is **`ask` the human** — never a guess. Doubly P5: the artifact the resolver reads (its config) is itself floor-required to keep a terminal `ask`.

## Open questions (RESOLVED at GATE 1 — human approved 2026-07-08)

- Q1 (build wiring) → **DEFER** — resolver capability + evals only this increment; wiring is a follow-up axis.
- Q2 (config surface) → **INLINE in evals only** — do not touch `pharn.config.json` or the green checker.
- Q3 (walk order) → **`model` before `fetch`** — cite `ARCHITECTURE.md §5` / contract default; order stays user-configurable, terminal `ask` fixed.

Original questions (for the record):

1. **Should this increment also wire the resolver into the build stage** (`.claude/commands/pharn-build.md` / `pharn-dev-build.md` — "the stage that hits seams"), as the original ask mentions? My recommendation is **defer**: the resolver capability is self-contained and floor-GREEN on its own; the build commands live under `.claude/` which `validate.mjs` deliberately does **not** scan (no floor consequence), and editing an existing stage command is a _separate change-reason_ (a second axis) — better as its own increment per P3/P7/"one axis of change."
2. **Config surface / a possible checker↔config mismatch.** `check-seam-config.mjs` today validates a **standalone** seam-config JSON (the whole file _is_ the config), while the ask says the config "lives in `pharn.config.json`'s seam block." I recommend **not** touching `pharn.config.json` or the (green, tested) checker this increment — the resolver's evals carry **inline** example configs, so the mechanism is demonstrable without resolving the file-location question. Adding a `seam` block to `pharn.config.json` **and** teaching the checker to read `.seam` would be a second axis touching a green checker — defer it.
3. **Default `resolutionOrder` the resolver documents.** `ARCHITECTURE.md §5` and the contract's default put **`model` before `fetch`** (`official-skill → pinned-docs → model → fetch → ask`); the original ask wrote **`fetch` before `model`**. I recommend the resolver **cite the contract/§5 default (`model` before `fetch`)** as canonical, since `ARCHITECTURE.md` is the pinned, human-only spec — and note that order is user-configurable while the terminal `ask` is not.
