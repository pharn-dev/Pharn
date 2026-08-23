<div align="center">

# PHARN

**Code got cheap. Understanding got scarce.**

PHARN is an audit-grade methodology for building software with AI agents. It installs into your repo as
plain markdown — commands, grillers, review lenses, a constitution — and puts a deterministic floor under
the agent: the intent is written down and approved before code is written, secret-shaped literals in a
plan are found by a regex not a judgment call, an agent may only write the files its plan declared, and a
build that skipped a declared file cannot report success. Everything the floor cannot guarantee is
labeled advisory, in the same sentence.

```bash
npx @pharn-dev/pharn@latest init
```

[![pharn](https://img.shields.io/badge/pharn-2.7.14-blue)](./CHANGELOG.md)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-green)](./LICENSE)
[![CI](https://github.com/pharn-dev/pharn-oss/actions/workflows/ci.yml/badge.svg)](https://github.com/pharn-dev/pharn-oss/actions/workflows/ci.yml)
[![CodeQL](https://github.com/pharn-dev/pharn-oss/actions/workflows/codeql.yml/badge.svg)](https://github.com/pharn-dev/pharn-oss/actions/workflows/codeql.yml)
[![Floor](https://github.com/pharn-dev/pharn-oss/actions/workflows/floor.yml/badge.svg)](https://github.com/pharn-dev/pharn-oss/actions/workflows/floor.yml)
[![Secrets](https://github.com/pharn-dev/pharn-oss/actions/workflows/gitleaks.yml/badge.svg)](https://github.com/pharn-dev/pharn-oss/actions/workflows/gitleaks.yml)
[![Built for Claude Code](https://img.shields.io/badge/built%20for-Claude%20Code-555)](https://claude.com/claude-code)

</div>

> **Status:** Ready to install and use with Claude Code today. Active development continues;
> functionality that has not shipped yet is explicitly labeled.

---

## Contents

- [What PHARN does](#what-pharn-does)
- [Quick start](#quick-start)
- [What it catches](#what-it-catches)
- [Why not just CLAUDE.md or AGENTS.md?](#why-not-just-claudemd-or-agentsmd)
- [Guaranteed vs advisory](#guaranteed-vs-advisory)
- [The pipeline](#the-pipeline)
- [PHARN builds PHARN](#pharn-builds-pharn)
- [Honest scope](#honest-scope)
- [Design docs](#design-docs)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## What PHARN does

Vibe-coding with an agent is fast — until the chat history scrolls away and takes the _understanding_
with it. Six months later nobody can say why the code is shaped the way it is, what the constraints
were, or which decisions were deliberate.

PHARN does not make anyone understand the code. Nothing can, and anything that claims to just gets
bypassed. What it does is make the reasoning survive the session, and put deterministic checks around
the parts that can be checked deterministically.

**Before you write code** — you state the intent, and a human approves it. PHARN turns your prose into a
structured `SPEC.md`, interrogates it for gaps, and waits. The model never approves its own spec. Once
approved, the spec is pinned by a SHA-256 of its own body, so editing it after planning is detectable
rather than silent.

**While the agent works** — the plan declares which files it will touch, and a pre-write hook denies
everything else. Grillers interrogate the plan before a line is written: the security one runs a fixed
regex set over it and flags AWS key ids, private-key headers, and secret-named fields assigned string
literals. Afterwards, review lenses read the diff for injection, SSRF, path traversal, n-plus-one
queries, swallowed exceptions, race conditions, and placeholder code shipped as done.

**After the change lands** — the repo holds a diffable trail: the spec, the plan, the grill log, the
regression report, the verify report. If the plan declared a file the build never wrote, `/pharn-verify`
returns `INCOMPLETE` rather than a pass. Your chat history is gone. Your spec isn't.

PHARN is meant to augment a whole team — the PM writes intent, the developer reviews architecture,
everyone works off the same artifact. It does **not** replace developers.

---

## Quick start

PHARN runs on [Claude Code](https://claude.com/claude-code). In your project root:

```bash
npx @pharn-dev/pharn@latest init
```

The installer reads your `package.json`, detects your project's archetype, and selects the capabilities
that apply — showing you the full list, with a reason beside each one, before it writes anything. It
then installs:

- the **product commands** into `.claude/commands/`,
- the **write-gating hooks** into `.claude/hooks/`,
- the **floor** — the deterministic checkers — plus the **contracts**, **grillers** and **review lenses**
  under `pharn/`,
- and a `pharn.config.json` pinning the skills version and the exact commit it installed from.

Then open Claude Code and run your first command:

```text
/pharn-spec
```

Describe what you want to build. PHARN writes a `SPEC.md`, asks about what you left out, and stops for
your approval. From there, `/pharn-ship` runs the whole chain for you, or you can drive each stage
yourself.

Already installed? `pharn status` reports your version and whether any installed file has drifted;
`pharn update` re-fetches at the latest skills version; `pharn add <capability>` installs another one.

---

## What it catches

Capabilities are named for the problem they find, not the technology they use. Grillers interrogate a
**plan**; lenses read **code**.

**Grillers** — a11y, architecture, comprehension, coupling, documentation, error-handling, i18n,
migrations, observability, performance, privacy, security, testability.

**Lenses** — injection, SSRF, path traversal, insecure crypto, unsafe deserialization, secrets in code,
input validation, hallucinated APIs, missing `await`, missing timeouts, null dereference, off-by-one,
race conditions, resource leaks, swallowed exceptions, missing error handling, n-plus-one queries,
duplicated logic, copy-paste drift, magic values, placeholder-as-done, and a trust fence.

Every capability ships with its own eval cases and expected outputs; the floor refuses a capability
whose rules no eval exercises.

This prose is hand-written and unguarded, so treat it as a tour rather than an inventory. The
authoritative, drift-guarded lists are the generated ones: [`docs/capabilities/`](./docs/capabilities/README.md)
and the [current-state block](#pharn-builds-pharn) below.

---

## Why not just CLAUDE.md or AGENTS.md?

Keep them. PHARN is not a replacement for a project instructions file — it adds the parts an
instructions file structurally cannot provide, because an instructions file is text the model may follow.

- **A file states a rule. A hook enforces one.** "Don't edit the spec" is a sentence a model can be
  talked out of. A `PreToolUse` hook that denies the write is not.
- **Approval becomes a gate, not a habit.** The spec is `Draft` until a human flips it to `Approved`, and
  downstream stages refuse a `Draft`. The model cannot flip it.
- **Instructions drift; content-hashes don't.** An approved spec is pinned by a hash of its body, and
  four later stages re-verify that pin.
- **Findings cite stable rule IDs.** A review finding names the rule it violates, so the chain from a
  line of code back to the intent that justified it is explicit rather than recalled.
- **Untrusted text is fenced structurally.** Code under review, fetched docs and accumulated memory are
  tagged untrusted, and no guaranteed decision reads a free-text field — because prompt injection is
  unsolved, so trust cannot be the model's judgment call.

---

## Guaranteed vs advisory

This distinction is the whole point, so it is stated once and applied everywhere. A **guarantee** must
reduce to one of three deterministic, non-LLM operations — a hook, a content-hash comparison, or an
enum/regex check. Anything else is **advisory**, and is labeled advisory wherever it appears.

**Guaranteed** — each of these is a named checker you can read:

| Guarantee                                                                        | The check behind it                                                                     |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| The four trusted docs cannot be edited by the agent through Write/Edit/MultiEdit | `.claude/hooks/protect-trusted-paths.cjs`                                               |
| A command writes only the paths it declared                                      | `set-writes-scope.cjs` + `enforce-writes-scope.cjs`, fail-closed                        |
| An approved spec is pinned, so a later edit is detectable                        | `check-spec.mjs --hash`, re-verified at grill, build, regress and verify                |
| Secret-shaped literals in a plan are detected                                    | `scan-plan-secrets.mjs` — a fixed regex set, immune to prose claiming the plan is clean |
| A plan-declared file the build never wrote yields `INCOMPLETE`, not a pass       | `check-build-complete.mjs` feeding `check-verify.mjs`                                   |
| Which lenses run, and how their findings merge                                   | `count-lenses.mjs` reads frontmatter; `merge-findings.mjs` keys on enum fields only     |

**Advisory** — everything a model judges: whether a plan is wise, whether a lens's finding is real,
whether a severity is right, whether a griller actually ran its scanner. These surface for a human. They
never gate.

**And the bounds, stated rather than buried.** The write-guards gate the Write/Edit/MultiEdit tool
surface; **writes made through the Bash tool bypass them entirely**, which is the largest hole in that
guard and no amount of path matching narrows it. `scan-plan-secrets` proves a pattern is present, never
that the literal is a live secret — and it runs inside a griller, which surfaces findings and never
blocks. `check-build-complete` proves a declared path exists, never that its contents are right. A green
floor means the named checks passed. It never means the code is correct.

---

## The pipeline

Seven typed stages. Each emits a versioned artifact carrying the `spec_id`, and each reads what the
previous stage produced:

```text
spec → plan → grill → build → regress → verify → ship
```

`/pharn-ship` runs that chain for you and stops at the two human gates — spec approval, and the
post-verify merge/fix/abandon decision. It never self-approves and has no `--yolo`.

`/pharn-loop` runs the same chain, but iterates the build→regress→verify middle until a deterministic
stop: green, a bounded iteration cap, or the first terminal failure. The stop is computed by a tested
checker whose only inputs are the two floor verdicts, so no advisory stage can keep the loop running.

**Standalone:** `/pharn-review` is the one command that is not a pipeline stage. It runs the review
lenses in parallel as subagents and merges their findings deterministically, keyed on enum-gated fields
only. Point it at code whenever you want, pipeline or not.

---

## PHARN builds PHARN

PHARN is self-hosting: it is built with its own tooling, one approved increment at a time, and the
audit trail of every increment is committed in this repo.

The inventory below is **generated** from the live repository by `npm run docs:generate` and guarded
byte-for-byte by `npm run docs:check`, so it cannot quietly drift from what is actually built. The prose
around it is hand-written and carries no such guarantee.

<!-- CURRENT-STATE:BEGIN — GENERATED by .dev/floor/gen-capability-catalog.mjs. DO NOT EDIT BETWEEN MARKERS. Regenerate: npm run docs:generate -->

- **Capabilities — 36 built**, counted by the `role:` frontmatter test (mirrors `pharn/floor/validate.mjs`): **13** grillers, **22** lenses, **1** skill (`pharn/pharn-core/seam-resolver/`), **0** validators, **0** verifiers, **0** auditors. Full list: [`docs/capabilities/README.md`](./docs/capabilities/README.md).
- **Contracts — 6** (`pharn/pharn-contracts/`): `eval-format`, `finding-shape`, `loop-record`, `seam-config`, `ship-briefing`, `ship-record`.
- **Product commands — 10** (`.claude/commands/`): `/pharn-build`, `/pharn-grill`, `/pharn-loop`, `/pharn-memory-promote`, `/pharn-plan`, `/pharn-regress`, `/pharn-review`, `/pharn-ship`, `/pharn-spec`, `/pharn-verify`.
- **Dev-apparatus commands — 9** (`.claude/commands/`): `/pharn-dev-build`, `/pharn-dev-eval`, `/pharn-dev-grill`, `/pharn-dev-memory-promote`, `/pharn-dev-plan`, `/pharn-dev-regress`, `/pharn-dev-review`, `/pharn-dev-ship`, `/pharn-dev-verify`.
- **Hook scripts — 3** (`.claude/hooks/`): `enforce-writes-scope.cjs`, `protect-trusted-paths.cjs`, `set-writes-scope.cjs`.
- **Floor checkers — 50** `.mjs` files under `pharn/floor/` (tests excluded).

<!-- CURRENT-STATE:END -->

The evidence worth reading is a defect the loop caught in PHARN's own code.
[`.dev/features/span-redos-linear/REVIEW.md`](./.dev/features/span-redos-linear/REVIEW.md) records
finding F1 against an increment whose entire purpose was to repair a false performance claim in a floor
checker — and whose replacement claim was false in the same way:

> the increment repairing a false bound in a floor file shipped a second, weaker false bound in the same
> paragraph

That finding is marked `severity: blocking` and was fixed inside the increment that raised it. The
review that caught it was PHARN's own.

---

## Honest scope

**Not yet built.** `pharn-audits`, `pharn-skills-*`, `pharn-stack-*`, and the rest of `pharn-core` — the
constitution engine, the agnostic rule set, and the memory-bank commands beyond promotion. As the
generated inventory above shows, no `validator`, `verifier` or `auditor` capability has been authored:
`/pharn-verify` ships the verifier plug-in slot empty, deliberately, because adding one before a real
need is the speculation the constitution forbids.

**Not guaranteed.** [`LIMITS.md`](./LIMITS.md) states plainly what PHARN does not promise, and
[`THREAT-MODEL.md`](./THREAT-MODEL.md) states the attack surface — starting from the assumption that
prompt injection is unsolved. Both are worth reading before you rely on anything here. Claims in the
shipped docs that describe a check which is specified but not yet running are marked
`(specified; ships with the guarded surface)`, and a checker in CI fails the build if such a marker
survives after the check goes live, or is deleted while it is still absent.

**Packaging.** No git tags and no GitHub releases yet; the installer fetches this repository's current
`main`. Two of the four design documents (`THREAT-MODEL.md` and `LIMITS.md`) are not currently copied
into an install — read them here.

---

## Design docs

The architecture is fully specified in four documents. Read them in this order:

1. [`pharn/CONSTITUTION.md`](./pharn/CONSTITUTION.md) — eight principles (P0–P7) that override every
   command, rule and agent decision here, including the process of building PHARN itself. P0 is the one
   the rest exists to serve: a guarantee reduces to a deterministic floor operation, or it is labeled
   advisory.
2. [`pharn/ARCHITECTURE.md`](./pharn/ARCHITECTURE.md) — the floor, the three primitives, the layer tree,
   the pipeline.
3. [`THREAT-MODEL.md`](./THREAT-MODEL.md) — the security foundation and the attack surface.
4. [`LIMITS.md`](./LIMITS.md) — what PHARN does **not** guarantee.

These four are trusted and human-only: a `PreToolUse` write-guard denies agent edits to them through the
Write, Edit and MultiEdit tools. As noted above, that guard does not cover writes made through Bash.

---

## Contributing

PHARN is small-surface on purpose: a rule or enforcer is added only in response to a real failure, never
a hypothetical. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the read-first order, the gates to run
before pushing, and the build loop. Conduct expectations live in
[`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md); release history is in [`CHANGELOG.md`](./CHANGELOG.md).

The floor and the hooks carry **zero runtime dependencies** (Node stdlib, Node 24); ESLint, Prettier and
markdownlint are dev-only.

## Security

Found a vulnerability? Please follow [`SECURITY.md`](./SECURITY.md) rather than opening a public issue.

## License

[Apache 2.0](./LICENSE).
