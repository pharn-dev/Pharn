# Changelog

All notable changes to PHARN-OSS are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). The current version is also recorded in [`SKILLS_VERSION`](./SKILLS_VERSION).

## [Unreleased]

### Added

- **The product pipeline, as runnable commands** — the full `spec → plan → grill → build → regress → verify → ship` spine (`ARCHITECTURE.md §6`) shipped as [`/pharn-spec`](./.claude/commands/pharn-spec.md), [`/pharn-plan`](./.claude/commands/pharn-plan.md), [`/pharn-grill`](./.claude/commands/pharn-grill.md), [`/pharn-build`](./.claude/commands/pharn-build.md), [`/pharn-regress`](./.claude/commands/pharn-regress.md), [`/pharn-verify`](./.claude/commands/pharn-verify.md), and [`/pharn-ship`](./.claude/commands/pharn-ship.md) — the last a gated meta-orchestrator over stages 1–6, with at most one bounded build-completion retry on an INCOMPLETE verify. Each downstream stage re-verifies the spec→plan content-hash chain (`.dev/floor/check-plan-spec-agree.mjs`) and reuses the existing floor checkers; no stage self-approves, and the two human gates (SPEC approval, post-verify decision) are non-negotiable.
- **`/pharn-review` — parallel code-review lenses, deterministically merged** ([`.claude/commands/pharn-review.md`](./.claude/commands/pharn-review.md)) — runs the `pharn-review/*` lenses as parallel subagents, then merges and de-duplicates their findings into one `findings.json` keyed only on enum-gated fields (`.dev/floor/merge-findings.mjs`); lens membership is floor-derived from frontmatter (`.dev/floor/count-lenses.mjs`), not prose. The parallel spawn and per-lens judgment are advisory; the merge is the floor.
- **22 code-review lenses** (`pharn-review/*`, `role: lens`, each enforcing P2 with committed evals) — `trust-fence`, `secrets-in-code`, `injection`, `input-validation`, `unsafe-deserialization`, `path-traversal`, `insecure-crypto`, `ssrf`, `hallucinated-api`, `swallowed-exception`, `placeholder-as-done`, `duplicated-logic`, `copy-paste-drift`, `null-deref`, `resource-leak`, `off-by-one`, `missing-await`, `magic-values`, `race-condition`, `missing-timeout`, `n-plus-one`, and `missing-error-handling`. Most ship a companion deterministic scanner (`.dev/floor/scan-code-*.mjs`).
- **13 grillers** (`pharn-pipeline/grillers/*`, `role: griller`, advisory PLAN interrogators enforcing P7/P3) — `testability`, `architecture`, `security`, `error-handling`, `performance`, `migrations`, `documentation`, `a11y`, `i18n`, `observability`, `privacy`, `comprehension`, and `coupling`. Several ship a partial presence-check floor (`.dev/floor/scan-plan-*.mjs`, `count-grillers.mjs`).
- **The seam-config contract + validator** (`pharn-contracts/seam-config.md`, `.dev/floor/check-seam-config.mjs`) — a deterministic seam-resolution config contract enforcing P0/P5.
- **The writes-scope guard, fix #7** (`.claude/hooks/enforce-writes-scope.cjs` + `.claude/hooks/set-writes-scope.cjs`) — a second `PreToolUse` hook, wired in `.claude/settings.json`, that confines every command's writes to its declared `writes:` scope (parsed deterministically by the setter), fail-closed to a default-safe-set when no scope is set.
- **The memory-promote command + provenance checker** (`.claude/commands/pharn-dev-memory-promote.md`, `.dev/floor/check-provenance.mjs`) — a P2-gated mechanism for promoting one lesson/pattern to the canonical memory-bank. It automates the _mechanics_ (assemble the entry, capture provenance deterministically, validate shape, detect duplicate ids, set the fix #7 writes-scope to the one target canon file) and **HALTS for explicit human accept/deny before any write** — it never self-promotes. `check-provenance.mjs` is the deterministic floor reduction of `ARCHITECTURE.md §5`'s "provenance per entry": it rejects a candidate with missing/malformed provenance, a duplicate id, or a target outside the two prescription files (`lessons-learned.md` / `pattern-library.md`). Stdlib-only; ships a `node --test` suite. The honest split (P0): the floor guarantees valid provenance + a unique id + a write confined to the declared canon file — **not** that the lesson is correct or wise (that is the human's advisory accept/deny).
- **The eval-format contract** (`pharn-contracts/eval-format.md`) — the structural-vs-semantic split for eval assertions: `structural[]` (floor-reducible) versus `semantic[]` (advisory llm-judge), keyed by a `skill_kind` discriminator.
- **The structural checker** (`.dev/floor/check-structural.mjs`) — a deterministic, dependency-free floor piece that executes an eval's `structural[]` assertions against a skill's already-produced finding output (`finding_count`, `field_equals`, `file_resolves`, `needle_absent_from_enum_gated`, plus the `skill_kind` rule) and exits non-zero on any RED. Ships with a `node --test` suite; reviewed in `.dev/features/structural-checker/REVIEW.md`.
- Repository governance files: `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, and `SKILLS_VERSION`.

### Changed

- **Split the repo into a dev/product boundary** — moved the build apparatus under `.dev/` (`.dev/floor/` checkers + tests, `.dev/features/` audit trails, `.dev/memory-bank/`), excluded wholesale by `.dev/floor/validate.mjs`; the product surface stays at the root (`pharn-review/`, `pharn-pipeline/`, `pharn-contracts/`). Commands split by name prefix — `pharn-dev-*` (apparatus) vs `pharn-*` (product) — since `.claude/commands/` cannot move.
- Reframed the repository from "PHARN bootstrap" to **PHARN-OSS** — the product/methodology itself, self-hosting and early-stage — across all docs and metadata; renamed the package `pharn` → `pharn-oss`. No change to the released surface (the floor, the write-guard hook, the build/review commands, or capabilities).

## [1.0.0] - 2026-06-23

### Added

- **The spec** — the four trusted, human-only documents: `CONSTITUTION.md` (the eight principles, P0–P7), `ARCHITECTURE.md`, `THREAT-MODEL.md`, and `LIMITS.md`.
- **The floor** — `floor/validate.mjs`, the deterministic, dependency-free validator (frontmatter and required fields, evals, the `rule_id`↔eval binding, enums, and the finding shape).
- **The write-guard hook** — `.claude/hooks/protect-trusted-paths.cjs`, a `PreToolUse` hook that denies agent writes to the four trusted docs.
- **The commands** — `/plan`, `/build`, and `/review` (`.claude/commands/`).
- **Dev tooling** — ESLint, Prettier, and markdownlint configuration; the `npm run check` aggregate gate; and a `node --test` suite covering the write-guard hook and the floor.
