# PLAN — safe test-list expansion guardrail (operationalize L5)

- spec_content_hash: 11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969 # fix #4 (sha256 of ARCHITECTURE.md, read live this run)
- increment: Add an explicit safe-list-expansion guardrail to `/pharn-dev-regress`'s Step-2 tests gate — the agent must expand the `node --test <outside_tests...>` list via `xargs` / a shell array, never `node --test $UNQUOTED` — operationalizing lesson L5 at the exact spot the bug recurred.
- layer(s): build apparatus (dev command instruction) — `.claude/commands/`. NOT a product layer (ARCHITECTURE §4).
- constitution_refs: [P0, P4, P7]

> **Trigger (P7 — real, not hypothetical).** L5 is already canon, yet the zsh `node --test $LIST` word-splitting bug **recurred** in the `per-stage-model-config` `/pharn-dev-regress` run (a false `1→1` at base==head that masqueraded as "pre-existing" and would have masked a real regression). The command's Step-2 tests gate is a bare placeholder — `node --test <outside_tests...>` (`pharn-dev-regress.md:113`) — with **no** expansion guidance, so the guardrail belongs exactly there. The recurrence **is** the triggering failure; this is not a speculative addition.

## Files

- `.claude/commands/pharn-dev-regress.md` — EDIT: add one safe-list-expansion guardrail note at the Step-2 tests-gate placeholder (the `node --test <outside_tests...>` block, ~lines 113/124), citing L5. Frontmatter/structure otherwise untouched. — layer build-apparatus (dev command)

_(Deliberately out of scope, with reason: `/pharn-dev-verify` uses `npm test` (glob, no file list) → there is no `node --test <list>` step to guard. The product mirror `/pharn-regress` runs a **generic** user test runner over `outside_tests` (not literally `node --test`) and has had no such failure → a preventive note there is borderline-speculative (P7) and needs different phrasing; see Open questions.)_

## Contracts satisfied

- None. This edits an advisory command instruction (build apparatus), which sits **outside** the `pharn-contracts` capability set (ARCHITECTURE §3.3: commands/floor are not Capabilities). It **cites** `.dev/memory-bank/lessons-learned.md` L5 (P4 — cite, don't restate).

## Evals to write (P1)

- None — this edits a command `.md` (advisory orchestration doc), not a `role:` Capability and not a floor checker, so neither a capability `evals/` pair nor a `.test.mjs` applies. Stated honestly: P1 governs Capabilities; this is neither. (No `enforces` rule_id is added.)

## Guarantee audit (P0)

- "the guardrail note prevents the L5 recurrence" → **advisory.** It is guidance to the agent; it has **no** floor reduction — no hook / content-hash / enum enforces safe expansion, and the command's Bash is not executed by a hook, so the agent could still write `node --test $LIST`. The note **reduces** recurrence by placing the fix at the point of use; it does **not** guarantee it. No floor-guarantee claim is made. (A floor fix would need a checker that greps each command's own Bash for an unquoted `$LIST` before a test runner — a larger, separate increment, and itself only partially floor-grade since command Bash isn't hook-run.)

## Trust audit (P2)

- N/A — no untrusted artifact is ingested. The edit adds a doc note to a `trust: trusted` command file, authored in-repo; no taint propagation.

## Determinism audit (P5)

- No branch or logic is added. The note **prescribes** a deterministic expansion technique (`xargs` / array) for the agent to apply, but that is guidance, not a floor branch. N/A.

## Resolved at GATE 1 (no open questions)

1. **Scope** → **`/pharn-dev-regress` only** (human-approved; strict-P7 smallest — the sole file that literally runs `node --test <list>` and where the bug recurred). The product mirror `/pharn-regress` is deliberately deferred (borderline-speculative; different phrasing).

No open questions remain — cleared for `/pharn-dev-build`.
