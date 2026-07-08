# SHIP — installed-skills-context

Thin, **advisory** roll-up of a gated `/pharn-dev-ship` run (no `--loop`). `/pharn-dev-ship` added **no** new floor
primitive — every verdict below belongs to a sub-stage. This file records **that the chain ran and its floor
verdicts**; it is **not** an approval, a "shipped", or a `PHARN ✓ reviewed` seal.

## Increment

Make the product stages `/pharn-build`, `/pharn-grill`, `/pharn-review` **respect user-installed Claude Code
skills** (`.claude/skills/*/SKILL.md`) as **advisory, untrusted** context — build follows their conventions;
grill/review consider them — via one deterministic enumerator (`.dev/floor/scan-installed-skills.mjs`).
**No floor guarantee** that code "matches" a skill (context-enrichment only).

- **spec_content_hash:** `11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969` (un-drifted across the whole run).

## Stages ran, in order — where the run ended

`/pharn-dev-plan` → **[GATE 1: human approved]** → `/pharn-dev-grill` → `/pharn-dev-build` → `/pharn-dev-regress`
→ `/pharn-dev-verify` → `/pharn-dev-review` → **[GATE 2: human decides]**. The run reached **GATE 2** (the
post-review human decision) — no RED-verdict STOP occurred.

## Structural verdicts read, verbatim (each owned by its sub-stage's floor checker)

| stage                | verdict source                      | verdict                         |
| -------------------- | ----------------------------------- | ------------------------------- |
| `/pharn-dev-build`   | `validate.mjs .` exit code          | **0 / GREEN** (35 capabilities) |
| `/pharn-dev-regress` | `regression-report.json` `.verdict` | **`no-regressions`**            |
| `/pharn-dev-verify`  | `verify-report.json` `.verdict`     | **`PASS`** (5/5 gates exit 0)   |

- GATE 1 (plan acceptance) was hit at `/pharn-dev-plan`'s own halt; the human approved product-trio-only + the deterministic-enumerator-helper, "Approve as written."
- `/pharn-dev-grill` is advisory (no deterministic verdict): 0 blocking, 3 important, 2 minor — its refinements were folded into the build (review finding-suppression asymmetry named; test scope kept honest; enumerator hygiene: one level, symlink-skip, JSON-safe names).
- `/pharn-dev-review` has **no** structural verdict (LLM severity is advisory, fix #3); `/pharn-dev-ship` computes no proceed/stop from it. Its floor-grade content (`validate` GREEN) was already gated by build + verify.

## Pointers (cite, don't restate — P4)

- **`.dev/features/installed-skills-context/REVIEW.md`** — GATE-2 reading. ADVISORY VERDICT: **GREEN**, 0 floor-gate (blocking) findings; 1 advisory (minor, P2 skill-name-as-DATA) + 1 standing scope judgment for the human.
- **`.dev/features/installed-skills-context/GRILL.md`** — advisory interrogation (5 findings).
- `PLAN.md`, `REGRESSION.md`, `VERIFY.md`, `regression-report.json`, `verify-report.json` — the audit trail.

## For the human at GATE 2 (the standing decision is yours)

Two things the pipeline surfaced for **your** judgment (neither is a floor block):

1. **P7 trigger (grill + review).** The increment is justified by anticipated user demand, not an observed dogfood/eval failure. Product-scope features may be a different category than internal capabilities, but P7 asks you to accept that consciously.
2. **P2 skill-name note (review, minor).** Skill _directory names_ (not just bodies) are attacker-influenced and surface into stage context as DATA — bounded and escaped today; a future edit could fence the name explicitly.

New behavior a merge would land in the product commands: each of `/pharn-build`, `/pharn-grill`, `/pharn-review` gains a deterministic `scan-installed-skills.mjs` discovery step feeding installed skills as advisory untrusted context (with `count:0` → unchanged behavior). The dogfood run touched **PHARN's own** command files; PHARN's repo has no `.claude/skills/`, so the new steps are inert here and exercised by the enumerator's 10 hermetic tests.

---

_Chain ran; the named floor verdicts are as shown — this is **NOT** a judgment that the increment is good or wise; that is the human's call at the post-review gate._
