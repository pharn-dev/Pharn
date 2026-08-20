<div align="center">

# PHARN

**Code got cheap. Understanding got scarce.**

PHARN is an open, audit-grade system of record for AI-written code — the intent, the constraints, and
the checks behind a change, written as plain markdown that lives in your own repo and diffs in git. It
runs on Claude Code today, and the discipline itself ships as readable markdown — skills, commands,
lenses, rules — that you read, diff, and version yourself. PHARN does not make anyone understand the
code; it keeps a deterministic floor under it and the record available the moment someone needs it.

[![pharn](https://img.shields.io/badge/pharn-2.7.11-blue)](./CHANGELOG.md)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-green)](./LICENSE)
[![CI](https://github.com/pharn-dev/pharn-oss/actions/workflows/ci.yml/badge.svg)](https://github.com/pharn-dev/pharn-oss/actions/workflows/ci.yml)
[![CodeQL](https://github.com/pharn-dev/pharn-oss/actions/workflows/codeql.yml/badge.svg)](https://github.com/pharn-dev/pharn-oss/actions/workflows/codeql.yml)
[![Floor](https://github.com/pharn-dev/pharn-oss/actions/workflows/floor.yml/badge.svg)](https://github.com/pharn-dev/pharn-oss/actions/workflows/floor.yml)
[![Secrets](https://github.com/pharn-dev/pharn-oss/actions/workflows/gitleaks.yml/badge.svg)](https://github.com/pharn-dev/pharn-oss/actions/workflows/gitleaks.yml)
[![Built for Claude Code](https://img.shields.io/badge/built%20for-Claude%20Code-555)](https://claude.com/claude-code)

</div>

> **Status: early, active development.** This repository, **PHARN-OSS**, is PHARN's open-source
> edition: the architecture is specified and the methodology is being built incrementally, in the
> open, using its own tooling (PHARN builds PHARN). The `1.0.0` tag marks that foundation — the spec,
> the build tooling, and the pipeline commands — **not** an adoptable release. It is **not yet ready
> to adopt**: the pipeline runs here (self-hosting), but there is no installer or packaged release you
> can drop into your own repo yet. Star or watch to follow along; see
> [Current state](#current-state) for exactly what exists today.

---

## Contents

- [Why PHARN?](#why-pharn)
- [What makes it different](#what-makes-it-different)
- [The pipeline](#the-pipeline)
- [The design](#the-design)
- [Principles](#principles)
- [Current state](#current-state)
- [How it's built](#how-its-built)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## Why PHARN?

Vibe-coding with an AI agent is fast — until the chat history scrolls away and takes the
_understanding_ with it. Six months later, nobody on the team can say why the code is shaped the way
it is, what the constraints were, or which decisions were deliberate. That gap is **comprehension
debt** — a term [coined by Addy Osmani](https://addyosmani.com/blog/comprehension-debt/) in early
2026 — and it compounds faster than any other kind.

This isn't hypothetical. A [2026 Anthropic RCT](https://www.anthropic.com/research/AI-assistance-coding-skills)
measured developers scoring ~17% lower on comprehension of code they shipped with AI assistance, even
as the volume of AI-generated code keeps climbing — more code, understood less.

PHARN doesn't force you to understand the code — nothing can, and anything that tries just gets bypassed. Instead it does two things it can guarantee: a deterministic floor that holds without you (secrets blocked, authorization checked, the plan actually built), and a markdown-canonical record — spec, constitution, diff, audit trail — kept in your repo, readable and diffable, available the moment you need it. The agent does the typing. PHARN keeps the result legible for whoever reads it next — if anyone does.

> **Your chat history is gone. Your spec isn't.**

PHARN is meant to augment the whole team — the PM becomes a product strategist, the developer an
architect and reviewer, everyone working off the same artifact. It does **not** replace developers.

---

## What makes it different

- **The methodology is the product, and it is readable.** PHARN ships as plain markdown — skills,
  commands, lenses, rules — that you read, diff, and version in git. Nothing is obfuscated behind a
  binary or a closed API. You can audit exactly what the discipline does.
- **Guarantees reduce to a deterministic floor, or they are labeled advisory.** PHARN draws a hard
  line between what is _guaranteed_ (enforced by a deterministic check — a hook, a content-hash, an
  enum/regex) and what is _advisory_ (a model's judgment). It does not sell a probabilistic claim as a
  guarantee. (`pharn/CONSTITUTION.md`, P0.)
- **Built to resist its own attack surface.** An agent that reviews code, fetches docs, and
  accumulates memory is operating on hostile input. PHARN treats trust as a structural property, not
  the model's judgment — because prompt injection is unsolved. (`THREAT-MODEL.md`.)
- **Audit-grade traceability.** Findings cite stable rule IDs; rules cite principles; the spec is
  pinned by content-hash. The chain from a line of code back to the intent that justified it is
  explicit.

---

## The pipeline

The workflow is a spine of typed stages — each emits a versioned artifact that links back to
the spec (`pharn/ARCHITECTURE.md §6`):

```text
spec → plan → grill → build → regress → verify → ship
```

Each stage reads the artifacts the previous stage produced, and every downstream artifact carries the
`spec_id` (the plan additionally pins the spec's `spec_content_hash`, so a spec edited after planning
is detectable, not silent).

> **What runs today:** the seven-stage spine now exists as runnable commands — `/pharn-spec` →
> `/pharn-plan` → `/pharn-grill` → `/pharn-build` → `/pharn-regress` → `/pharn-verify` → `/pharn-ship`
> — exercised by PHARN on itself (self-hosting), alongside the `/pharn-dev-*` build tooling. What does
> **not** exist yet is packaging: no installer, no versioned release you can drop into your own repo.
> See [Current state](#current-state).

---

## The design

The architecture is fully specified in four documents — read them in this order:

- [`pharn/CONSTITUTION.md`](./pharn/CONSTITUTION.md) — the eight non-negotiable principles (P0–P7).
- [`pharn/ARCHITECTURE.md`](./pharn/ARCHITECTURE.md) — the floor, the primitives, the layers, the pipeline.
- [`THREAT-MODEL.md`](./THREAT-MODEL.md) — the security foundation and the attack surface.
- [`LIMITS.md`](./LIMITS.md) — what PHARN does **not** guarantee, stated plainly.

These four are **trusted and human-only**: a `PreToolUse` write-guard hook denies any agent edit to
them.

---

## Principles

PHARN ships a **constitution** ([`pharn/CONSTITUTION.md`](./pharn/CONSTITUTION.md)) — eight principles that
override every command, rule, skill, and agent decision in this repo, including the process of
building PHARN itself. A violation is always blocking and is flagged for a human, never auto-fixed.

| Principle | In one line                                                                                  |
| --------- | -------------------------------------------------------------------------------------------- |
| **P0**    | Floor-or-advisory — every _guarantee_ reduces to a hook, content-hash, or enum/regex check   |
| **P1**    | Evals are the spec — no capability ships without eval cases binding each rule it enforces    |
| **P2**    | Trust is structural, not judged — untrusted input is fenced as data, never as instructions   |
| **P3**    | One axis of change per file; modules form a tree with no sibling imports                     |
| **P4**    | Rules are the single source of truth — enforcers cite rule IDs, never restate them           |
| **P5**    | Determinism over classification — the terminal fallback is to ask the human, never to guess  |
| **P6**    | Discovery-first — read and verify live state; halt and ask on any ambiguity                  |
| **P7**    | Honest scope — limits are labeled as limits; no speculative additions without a real failure |

> The privacy / multi-tenant / accessibility-style principles you may have seen described elsewhere
> are the _app-level_ constitution PHARN intends to ship as selectable templates for the projects it
> builds. Those templates are **not present yet** — the eight principles above are this repo's own
> governing constitution.

---

## Current state

The inventory below is **generated** from the live repository by `npm run docs:generate` and guarded
byte-for-byte by `npm run docs:check`, so it cannot quietly drift from what is actually built. The prose
around it is hand-written and carries no such guarantee.

<!-- CURRENT-STATE:BEGIN — GENERATED by .dev/floor/gen-capability-catalog.mjs. DO NOT EDIT BETWEEN MARKERS. Regenerate: npm run docs:generate -->

- **Capabilities — 36 built**, counted by the `role:` frontmatter test (mirrors `pharn/floor/validate.mjs`): **13** grillers, **22** lenses, **1** skill (`pharn/pharn-core/seam-resolver/`), **0** validators, **0** verifiers, **0** auditors. Full list: [`docs/capabilities/README.md`](./docs/capabilities/README.md).
- **Contracts — 6** (`pharn/pharn-contracts/`): `eval-format`, `finding-shape`, `loop-record`, `seam-config`, `ship-briefing`, `ship-record`.
- **Product commands — 10** (`.claude/commands/`): `/pharn-build`, `/pharn-grill`, `/pharn-loop`, `/pharn-memory-promote`, `/pharn-plan`, `/pharn-regress`, `/pharn-review`, `/pharn-ship`, `/pharn-spec`, `/pharn-verify`.
- **Dev-apparatus commands — 9** (`.claude/commands/`): `/pharn-dev-build`, `/pharn-dev-eval`, `/pharn-dev-grill`, `/pharn-dev-memory-promote`, `/pharn-dev-plan`, `/pharn-dev-regress`, `/pharn-dev-review`, `/pharn-dev-ship`, `/pharn-dev-verify`.
- **Hook scripts — 3** (`.claude/hooks/`): `enforce-writes-scope.cjs`, `protect-trusted-paths.cjs`, `set-writes-scope.cjs`.
- **Floor checkers — 49** `.mjs` files under `pharn/floor/` (tests excluded).

<!-- CURRENT-STATE:END -->

Alongside those: **the architecture spec** — the four trusted documents above — and **the floor and its
guards**, the deterministic validator ([`pharn/floor/validate.mjs`](./pharn/floor/validate.mjs)) plus the
`PreToolUse` write-guards wired in `.claude/settings.json`: the trusted-doc guard
([`.claude/hooks/protect-trusted-paths.cjs`](./.claude/hooks/protect-trusted-paths.cjs)) and the
writes-scope guard (`enforce-writes-scope.cjs`, fix #7), which confines every command to its declared
`writes:`. Every capability ships with evals. `pharn/pharn-review/trust-fence/` (attempt 0) is the
injection-residual probe, recorded in
[`.dev/features/trust-fence/REVIEW.md`](./.dev/features/trust-fence/REVIEW.md).

`pharn-contracts` — the schemas-only root — sits at the bottom of the layer tree in
`pharn/ARCHITECTURE.md §4`, with `pharn-review` and `pharn-pipeline` above it, and `pharn-core` opened by
the `seam-resolver`. Still **planned**: `pharn-audits`, `pharn-skills-*`, `pharn-stack-*`, and the rest of
`pharn-core` — the constitution engine, the agnostic rule set, the memory-bank, and the base commands.

What does **not** exist yet: any installer, wizard, or packaged release. The pipeline runs _here_, on
PHARN itself; it is not yet something you can drop into your own repo. This repository is the
foundation and the tooling, not a finished product. Please do not adopt it yet.

---

## How it's built

PHARN is developed in the open and is **self-hosting**: it is built using its own minimal tooling, one
increment at a time, with a deterministic floor gating every step.

```text
/pharn-dev-plan  →  approve/correct PLAN.md  →  /pharn-dev-build  →  pharn/floor/validate.mjs  →  /pharn-dev-review  →  fold lessons  →  next
```

The floor and the write-guard hook carry **zero runtime dependencies** (Node stdlib, Node 24); the
dev tooling (ESLint, Prettier, markdownlint) is dev-only. To understand or contribute to the build
process, start with [`CLAUDE.md`](./CLAUDE.md) and [`CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## Contributing

PHARN is small-surface on purpose: a rule or enforcer is added only in response to a real failure,
never a hypothetical (P7). See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the read-first order, the
gates to run before pushing, and the build loop. Conduct expectations live in
[`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md); release history is in [`CHANGELOG.md`](./CHANGELOG.md).

## Security

Found a vulnerability? Please follow [`SECURITY.md`](./SECURITY.md) rather than opening a public
issue.

## License

[Apache 2.0](./LICENSE).
