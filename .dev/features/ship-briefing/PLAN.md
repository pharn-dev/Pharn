# PLAN — ship-briefing (GATE-2 briefing artifact, Option B — hybrid)

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4, sha256(pharn/ARCHITECTURE.md), read live this run via `node .dev/floor/hash-doc.mjs pharn/ARCHITECTURE.md`
- applied_lessons: [L2, L6, L7, L8, L9, L10, L12, L13, L14, L15, L17, L18, L19]
- increment: Add a deterministic-first `features/<name>/BRIEFING.md` artifact, written by `/pharn-ship` at GATE 2 alongside `SHIP.md`, that answers "what/why/is-it-what-was-asked" on one screen — assembled by a new floor render script from committed SPEC/PLAN/GRILL/regression-report/verify-report files, cross-verified by a paired floor checker, with a narrow ADVISORY synthesis paragraph generated only when the plan carries no extractable design-decision section.
- layer(s): pharn-contracts (new `ship-briefing.md` schema), pharn-floor (new `render-ship-briefing.mjs` + `check-ship-briefing.mjs`, both product-surface per `pharn/floor/`), pharn-pipeline (the one edited step in `.claude/commands/pharn-ship.md`) # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P2, P4, P5, P6, P7]

## Applied lessons

- L2 — `pharn/pharn-contracts/ship-briefing.md` cites only LIVE floor ops (the new checker itself, `check-ship-briefing.mjs`, verified to exist and pass its own tests before the contract ships) and its `MUST` language is carried into the artifact's own frontmatter comment, not left only in this PLAN.
- L6 — `render-ship-briefing.mjs` reads every verdict from a STRUCTURED location only: SPEC/PLAN YAML frontmatter, `regression-report.json`/`verify-report.json` fields, and a curated heading-scan over PLAN.md (never a free substring grep for "problem:"/"rule_id:"-shaped text).
- L7 — `.claude/commands/pharn-ship.md`'s `writes:` frontmatter gains exactly `features/<name>/BRIEFING.md` — the one new path the edited step writes, nothing aspirational.
- L8 — `BRIEFING.md` is re-scoped with its OWN `set-writes-scope.cjs --from-frontmatter ... --target features/<name>/BRIEFING.md` call, immediately before its write, mirroring how `SHIP.md`/`ship-record.json` are each (re)scoped rather than assuming one setter call covers three artifacts.
- L9 / L12 / L13 — the new step runs `npx prettier --write features/<name>/BRIEFING.md` + `npx markdownlint-cli2 --fix features/<name>/BRIEFING.md` immediately after writing it (mirrors the existing `SHIP.md` format step already in `pharn-ship.md`), so this increment's own new markdown does not surface only at `npm run check`.
- L10 — `BRIEFING.md` is a product-surface artifact (root `features/<name>/`, on `validate.mjs`'s scanned surface). It never emits bare `rule_id:`/`problem:` text — it quotes PLAN.md sections and JSON verdicts, neither of which uses that vocabulary; verified against the fix #1 split during build.
- L14 — `check-ship-briefing.mjs`'s enum/regex checks (verdict enums, hash shape) compose with a control-char guard (`cleanScalar`, copied convention) before any anchored regex, never replacing it.
- L15 — any keyed lookup in the new checker (e.g. gate-id → exit code) uses `Object.hasOwn`/`Map`, never `||`/`??` on a plain object.
- L17 — this increment's OWN `.dev/features/ship-briefing/**` pipeline artifacts (GRILL.md, REGRESSION.md, VERIFY.md, REVIEW.md) will trigger `check-regress.mjs scope`'s known-false "escaped `## Files`" finding — pre-declared here so `/pharn-dev-regress`'s report is read correctly, not waved through by surprise.
- L18 — this PLAN's own exclusion note (below, "Deliberately NOT in scope") is a `###` heading, not a bold prose intro.
- L19 — the prettier/markdownlint calls above are scoped to the single new file path, never `npm run format` / a repo-wide sweep.

## Files

- `pharn/pharn-contracts/ship-briefing.md` — new contract (schema only, zero behavior): the `BRIEFING.md` frontmatter envelope + body-section shape, cited by the render script and the checker (P4) — layer pharn-contracts
- `pharn/floor/render-ship-briefing.mjs` — NEW deterministic generator (Node stdlib only). `node pharn/floor/render-ship-briefing.mjs <name> [--base <dir>]` (default `--base features`, overridable so it can render against `.dev/features/<name>` for the HALT-2 demo and for tests). Reads SPEC.md/PLAN.md frontmatter, PLAN.md `## Files`/`## Contracts satisfied`, `regression-report.json`/`verify-report.json`, does a curated heading-scan over PLAN.md for a Decision-shaped section (quotes it verbatim if found). Prints the rendered `BRIEFING.md` to stdout; writes nothing itself (the command does the Write, so fix #7 gates the actual file write, not the render) — layer pharn-floor (product)
- `pharn/floor/render-ship-briefing.test.mjs` — hermetic tests: quote-extraction hit/miss, missing-source fail-closed behavior, `--base` override — layer pharn-floor (product)
- `pharn/floor/check-ship-briefing.mjs` — NEW deterministic checker. `node pharn/floor/check-ship-briefing.mjs <BRIEFING.md> [--base <dir>]`: (1) frontmatter envelope shape (enum/regex, control-char-guard-composed per L14); (2) cross-file equality — each frontmatter verdict field literally equals the value in its source JSON/MD file (the new floor primitive; see PLAN §"Guarantee audit"); (3) the `## Why this design` section is present and, when it carries the `ADVISORY — model-synthesized` marker, that marker is exact-string-present (never silently dropped) — layer pharn-floor (product)
- `pharn/floor/check-ship-briefing.test.mjs` — hermetic tests: GREEN fixture, each cross-file mismatch RED individually, missing-envelope-field RED, advisory-marker-present/absent cases — layer pharn-floor (product)
- `.claude/commands/pharn-ship.md` — add one step (post-GATE-2 presentation, before Step 3's `SHIP.md` write) that: re-scopes to `features/<name>/BRIEFING.md`, shells `render-ship-briefing.mjs`, and — ONLY when its output signals no extractable Decision section — spawns one subagent call to draft the fenced `## Why this design (ADVISORY — model-synthesized, not floor-verified; see PLAN.md/GRILL.md)` paragraph (3-5 sentences, reading only that feature's PLAN.md + GRILL.md); writes the composed `BRIEFING.md`, formats it (L9/L13/L19), then self-checks it with `check-ship-briefing.mjs` and surfaces GREEN/RED to the human as an annotation (never a block — reaching GATE 2 stays ungated by this). Also add `features/<name>/BRIEFING.md` to `writes:` frontmatter — layer pharn-pipeline (product command)
- `SKILLS_VERSION` — bump `2.5.5` → `2.6.0` (minor: a newly shipped command step + a newly shipped contract + a newly shipped checker, per `CLAUDE.md`'s bump-size rule — not a correction of existing bytes) — layer repo-meta
- `CHANGELOG.md` — `[Unreleased]` entry for `2.6.0` — layer repo-meta
- `README.md` — update the shields version badge (`pharn-2.5.5` → `pharn-2.6.0`) to agree with `SKILLS_VERSION`, required by `pharn/floor/check-version-badge.mjs` (`check:badge` in `npm run check`) — layer repo-meta
- `CLAUDE.md` — add a `## Commands` entry for `check-ship-briefing.mjs` (and note `render-ship-briefing.mjs`) following the existing per-checker documentation convention, since a new floor contract+checker pair is exactly "a convention changed" — layer repo-meta
- `pharn/floor/check-regress.mjs` — add `"BRIEFING.md"` to the `PIPELINE_ARTIFACTS` enum (discovered mid-build: its own `✧ recurrence guard` test derives the enum from every `.claude/commands/*.md` `writes:` declaration and RED-failed once `BRIEFING.md` was added to `pharn-ship.md`'s `writes:` — the guard existing for exactly this purpose, not a scope violation to route around) — layer pharn-floor (product)

### Deliberately NOT in scope

- `.claude/commands/pharn-ship.md` Steps 1, 2, 2b, and Step 3b's attestation logic — untouched, per the build prompt's exhaustive edit whitelist.
- `.claude/commands/pharn-dev-ship.md` — the DEV-loop orchestrator is not touched; `BRIEFING.md` is a product-surface-only artifact (root `features/`), matching how `SHIP.md`/`GRILL.md`/etc. already diverge between the dev and product loops.
- `docs/capabilities/**` — neither new `.mjs` carries `role:` (both are floor helpers, same class as `check-loop-record.mjs`), so the capability catalog is unaffected; not regenerated.
- No PR creation, no push, no commit beyond this build's own (per the build prompt's Axis-ONE scope).
- No change to the observability gap named in the build prompt's "prompt B" — out of scope here.

## Contracts satisfied

- `pharn/pharn-contracts/ship-briefing.md` (new, this increment) — the SoT for `BRIEFING.md`'s shape; cited, not restated, by both new `.mjs` files (P4).
- `pharn/pharn-contracts/ship-record.md` — unchanged; `BRIEFING.md` is a sibling artifact, not a replacement, and does not alter `ship-record.json`'s schema.

## Evals to write (P1)

- N/A — neither new file carries `role:` (both are floor helpers under `pharn/floor/`, the same class as `check-loop-record.mjs`/`check-provenance.mjs`), so P1's Capability-eval requirement does not bind them. Correctness is covered by their own `node --test` suites (P1's spirit satisfied by hermetic tests, mirroring every existing `pharn/floor/check-*.mjs`).

## Guarantee audit (P0)

- "`BRIEFING.md`'s frontmatter verdict fields match their source files" → **floor**: `check-ship-briefing.mjs`'s cross-file equality pass (new primitive, ARCHITECTURE §2 #3 — enum/regex/equality over JSON+frontmatter fields; no LLM in the checker).
- "The render is deterministic given its inputs" → **floor**: `render-ship-briefing.mjs` is Node stdlib only, no network/LLM call; running it twice on unchanged sources yields byte-identical output (pinned by a test).
- "The `## Why this design` section, when present without the ADVISORY marker, is a verbatim quote of PLAN.md" → **floor**: the heading-scan copies bytes, never paraphrases; a test asserts the quoted text is a substring of the source PLAN.md.
- "The `## Why this design` section, when it carries the ADVISORY marker, is TRUE or USEFUL" → **advisory** (irreducible model judgment) — bounded: it fires only on the quote-miss path (measured ~72% of today's corpus), is always labeled, and gates nothing.
- "`check-ship-briefing.mjs` passing means the briefing is a faithful summary" → **struck, the disease**. It means the enum-gated fields agree with their sources and the quoted section is a real substring. It says nothing about the ADVISORY paragraph's truth, and nothing about the fenced sections' _selection_ being the most important facts (that selection is this PLAN's own design, human-approved at this gate, not floor-verified per run).
- "Reaching GATE 2 requires a GREEN `check-ship-briefing.mjs`" → **struck, deliberately false**. `/pharn-ship` surfaces the checker's verdict as an annotation; it is never a precondition, per the build prompt's own constraint.

## Trust audit (P2)

- Inputs: SPEC.md/PLAN.md/GRILL.md are `trust: untrusted` (human/model-authored, reviewed at their own gates). `render-ship-briefing.mjs` treats every value it reads as DATA: enum-gated fields (verdict strings, hashes, ids) are validated by regex/set-membership before use; free text (the quoted PLAN.md section, the ADVISORY paragraph) is copied/generated but never executed, never used to drive a branch in the render or in `/pharn-ship`'s control flow. The ADVISORY-paragraph subagent call reads only `trust: untrusted` PLAN.md/GRILL.md content and produces more `trust: untrusted` free text — it is fenced with its own marker precisely so a reader (or `check-ship-briefing.mjs`) can tell which class a given paragraph belongs to. No guaranteed decision in this increment rests on any free-text field (mirrors fix #1).

## Determinism audit (P5)

- The only branches are membership tests: `regress`/`verify` verdict-enum reads, the heading-scan's curated-pattern match (hit/miss — on a miss, the fallback is well-defined, never a guess), and `check-ship-briefing.mjs`'s field-by-field equality compares. The one place judgment is irreducible (the ADVISORY paragraph) is isolated to a single, always-labeled, never-gating fenced section — the terminal fallback for "no extractable rationale" is "say so and ask a subagent to synthesize, clearly marked," never a silent guess presented as fact.

## Open questions (HALT) — RESOLVED (human-approved this run, via interactive form)

1. **Artifact filename — `BRIEFING.md`.** Confirmed: matches the existing all-caps single-word convention (`SHIP.md`, `REVIEW.md`, `VERIFY.md`).
2. **SKILLS_VERSION bump size — `minor` (2.5.5 → 2.6.0).** Confirmed: a newly-shipped command step + newly-shipped contract + newly-shipped checker, per `CLAUDE.md`'s bump-size rule.
3. **ADVISORY-paragraph subagent call — invoked inline in `/pharn-ship`'s own turn**, not a separate command. Confirmed: a narrow, bounded, single-purpose read-and-summarize step with no need for its own gate.

Plan approved **as written** at this gate (the same run). `/pharn-dev-grill` subsequently raised 5 advisory
findings (3 important: the SPEC.md-in-dev-loop gap for `--base .dev/features`, the unspecified
heading-pattern list, and a missing injection-resistance test) — none blocking, all folded into the build
below rather than requiring a re-plan.
