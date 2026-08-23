# PLAN — README adoption rewrite

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L1, L2, L6, L7, L8, L12, L13, L18, L19, L20, L22, L24, L26, L28, L29, L30, L32]
- increment: Rewrite the root `README.md` (and align the three status files) so a developer arriving cold can say what PHARN does, install it, and run the first command — with no claim the repo contradicts.
- layer(s): repo-meta (no product-surface bytes; no `SKILLS_VERSION` bump)
- constitution_refs: [P0, P2, P4, P6, P7]

## Applied lessons

- L1 — The README rewrite invalidates the adoption-status sentence in three sibling meta-docs; the meta-doc sweep found them and `## Files` names all four, so `/pharn-dev-build` cannot ship stale canon.
- L2 — Every guarantee-shaped sentence the new README carries is reduced in `## Guarantee audit (P0)` against a floor op I read live this run, not one merely spec'd; two were demoted as a result.
- L6 — Capability counts come from the generated `CURRENT-STATE` block and test totals from a real `npm test` run, never grepped from CHANGELOG prose or a commit message.
- L7 — This stage declares exactly one output (`PLAN.md`). `README.md` and the three status files are `/pharn-dev-build`'s targets and are declared in `## Files` for the build, never in this command's `writes:`.
- L8 — Q4 chose four files, so I MEASURED the setter rather than assuming its resolution shape: `--from-plan` emitted `4 path(s)` in one call, so L8's one-`--target` limit binds placeholder narrowing, not `--from-plan`, and no per-write re-scoping is needed.
- L12 — Formatting happens at build time over the just-written files, not as a repair after `/pharn-dev-verify` reddens `format:check`.
- L13 — The same format discipline is pinned for this stage's own artifact (`PLAN.md`) and named for every later artifact-writing stage in this chain.
- L18 — The exclusion block below is a `###` heading inside `## Files`, never a bold prose intro, so the setter's authorized list terminates structurally rather than by matching vocabulary.
- L20 — L18's remedy is discipline-only and has already recurred once, so the build MUST read the setter's printed path count against the approved list; Step 2 pins the expected count per call.
- L22 — Every build hazard below is a pinned literal command line, never a prose description of a technique the build then implements its own way.
- L24 — The current README's "no installer" sentence is a claim inherited from a superseded state of the world; I re-measured it against the live registry and a real install rather than carrying it across.
- L26 — I verified the installer in a scratch directory OUTSIDE the repo, so that run proves what the CLI does and proves NOTHING about this repo's gates; the four files are judged only by `npm run check` at their real paths.
- L28 — Each `## Files` bullet is kept on ONE line under `printWidth: 140`, so prettier cannot wrap it into a continuation line whose ordinary vocabulary would trip the setter's exclusion cue.
- L29 — The adoption-status remedy ranges over a SET, so the deliverable is the enumeration: all six sites are listed by file and line in Step 1 below, not just the README ones.
- L30 — Step 2's gate list names only gates the build INVOKES as pinned command lines; no gate is named in prose for the agent to "confirm".
- L32 — I verified the canonical repo slug with `gh api repos/pharn-dev/pharn-oss --jq .full_name`, not the git remote, because a rename redirect keeps a stale slug resolving; `@latest` likewise proves reachability, not that any specific version is canonical.

## Files

- `README.md` — full rewrite to the S1–S10 structure; the generated CURRENT-STATE block moves intact into S8. — layer repo-meta
- `SECURITY.md` — line 7's "early-stage and in active development" replaced with the Q3(a) status wording. — layer repo-meta
- `CONTRIBUTING.md` — line 3's "early-stage and in active development" replaced with the Q3(a) status wording. — layer repo-meta
- `CLAUDE.md` — line 9's "early-stage and in active development" replaced with the Q3(a) status wording. — layer repo-meta
- `CHANGELOG.md` — an `[Unreleased]` entry recording the README rewrite and the status realignment, with no version bump. — layer repo-meta

### Deliberately NOT in scope

- `pharn/ARCHITECTURE.md` — hook-denied to the agent (fix #2); the pipeline spine is READ from it, never edited.
- `pharn/CONSTITUTION.md` — hook-denied to the agent (fix #2).
- `THREAT-MODEL.md` — hook-denied to the agent (fix #2).
- `LIMITS.md` — hook-denied to the agent (fix #2).
- `.claude/commands/pharn-ship.md` — writable, but the pipeline-shape reconciliation is a second axis (P3).
- `SKILLS_VERSION` — no product-surface byte changes, so it stays at 2.7.14 and `check:badge` stays GREEN.
- `docs/capabilities/` — never hand-edited; it IS rewritten by the `docs:generate` Bash call in hazard 3, declared there per L19 rather than silently escaping the gate.

## Discovery report (P6) — every §2 item, verified live this run

### Live state

| Item                     | Verdict   | Evidence read this run                                                                                                                                                 |
| ------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HEAD                     | CONFIRMED | `71e71ee03c7e2a0ad1bbfee9daa4c8336addf615`                                                                                                                             |
| `SKILLS_VERSION` / badge | CONFIRMED | `2.7.14`; `check-version-badge.mjs` → GREEN, badge matches                                                                                                             |
| Generated inventory      | CONFIRMED | 36 capabilities (13 grillers, 22 lenses, 1 skill, 0 validators, 0 verifiers, 0 auditors); 6 contracts; 10 product commands; 9 dev commands; 3 hooks; 50 floor checkers |
| `npm test`               | CONFIRMED | `tests 1620 · pass 1620 · fail 0 · skipped 0`                                                                                                                          |
| `validate.mjs`           | CONFIRMED | `FLOOR: GREEN — 36 capabilities checked in "."`                                                                                                                        |
| Increment dirs           | CONFIRMED | `ls -d .dev/features/*/ \| wc -l` → 146; `find .dev/features -name SHIP.md \| wc -l` → 109                                                                             |
| root `features/`         | CONFIRMED | holds `README.md` only                                                                                                                                                 |

### Claims A–F

- **A — CORRECTED, and this is the increment's whole justification.** `@pharn-dev/pharn` is published; `npm view … version` → `0.3.2`. I ran `npx @pharn-dev/pharn@latest init` in a scratch git repo with a Next.js `package.json` and drove its confirm prompt through a pty to completion. It fetched from `github.com/pharn-dev/pharn-oss`, detected the `ssr` archetype, selected 35 of 36 capabilities with per-row archetype reasons, and landed `.claude/commands/` (10 product commands), `.claude/hooks/` (3), `.claude/settings.json`, `pharn/` (CONSTITUTION, ARCHITECTURE, floor with 50 checkers, contracts, pipeline, review) and `pharn.config.json` pinning `skillsVersion 2.7.14` and commit `71e71ee`. The README's "no installer", "not an adoptable release" and "Please do not adopt it yet" are therefore false against live state.
- **B — CORRECTED.** `.claude/hooks/protect-trusted-paths.cjs` states in its own HONEST BOUNDS: "Bash-tool writes bypass PreToolUse hooks ENTIRELY. That is by far the largest hole in this guard and no amount of path matching narrows it." So "denies **any** agent edit" is not defensible. Two further corrections the current README omits: the hook protects more than the four docs (CODEOWNERS, both settings files, the three hook scripts, `.pharn/writes-scope.json`), and PHARN vendored at a subpath of a larger project is not guarded at all.
- **C — CORRECTED.** The linked post is dated **March 14, 2026**, and it makes no coinage claim — it credits Margaret-Anne Storey's _cognitive debt_ and the MIT Media Lab work. "A term coined by Addy Osmani in early 2026" is unsupported by the source the sentence itself links. The rewrite cites the post as a description of the problem, never as an origin.
- **D — CORRECTED.** Verified at the Anthropic URL: 52 mostly-junior engineers, Python ≥1×/week for over a year, two features using the Trio async library, assessed by a quiz weighted to debugging, code reading and conceptual questions. AI-assisted averaged **50%**, hand-coding **67%** (Cohen's d = 0.738, p = 0.01). **Nothing was shipped** and nobody was maintaining production code, so "code they shipped" is false; and 67 → 50 is 17 **percentage points** (~25% relative), so "~17% lower" is at best ambiguous. The rewrite states the two scores and the population, or drops the citation.
- **E — MIXED; all three legs resolved below in `## Guarantee audit (P0)`.** Leg 1 names the wrong stage and implies a gate that does not exist; leg 2's "every write" is false for Bash; leg 3 is sound and is the strongest of the three.
- **F — CONFIRMED.** `pharn/` holds only `pharn-contracts`, `pharn-core`, `pharn-pipeline`, `pharn-review`; `pharn-core/` contains `seam-resolver` alone. So `pharn-audits`, `pharn-skills-*`, `pharn-stack-*` and the rest of `pharn-core` are correctly listed as still planned.

### Pipeline shape (§2.3) — CONFIRMED

`.claude/commands/pharn-ship.md:194` states verbatim: "There is **no product `/review` stage** (the dev loop's `/pharn-dev-review` is not a §6 spine stage — lenses live in `pharn-review`, §4)". Canonical architecture wins; per Q1 the README shows the spine without `review` and gives `/pharn-review` its own standalone block. The installer's own summary and the shipped command set confirm the first command a new user runs is `/pharn-spec`.

### Findings this increment's prompt did not anticipate

1. **A user's install ships two of the four trusted docs.** `THREAT-MODEL.md` and `LIMITS.md` are absent from the installed tree; only `pharn/CONSTITUTION.md` and `pharn/ARCHITECTURE.md` land. This directly constrains the rewrite: S9 may link `LIMITS.md` on GitHub but must not tell an installed user to read a file they do not have, and the phrase "these four are trusted and human-only" is true of this repository, not of an install.
2. **The prompt's §1 is textually corrupted** ("installemmands/`"). Its substance was re-derived by running the installer rather than adapted to (L24).
3. **`/pharn-dev-verify` passes no `--complete`** (`grep -c` → 0), so the build-completeness guarantee is product-surface only. The README must not present it as covering PHARN's own dev loop.

## Guarantee audit (P0)

Every guarantee-shaped sentence the new README will carry, each reduced to a floor op read live this run or relabelled.

| Sentence the README will carry                                                                          | Reduction                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The four trusted docs cannot be edited by the agent through Write/Edit/MultiEdit                        | **floor: hook** — `protect-trusted-paths.cjs`, exact repo-relative membership. Stated WITH its bound: Bash-tool writes bypass `PreToolUse` entirely. Claim B is fixed here.                                                                                  |
| "denies **any** agent edit"                                                                             | **STRUCK** — not defensible; the hook's own bounds contradict it. Replaced by the bounded sentence above.                                                                                                                                                    |
| A command may write only the paths it declares in `writes:`                                             | **floor: hook** — `set-writes-scope.cjs` + `enforce-writes-scope.cjs` (fix #7), fail-closed. Bounded: gates `Write\|Edit\|MultiEdit` only (L19).                                                                                                             |
| "**every** write confined to its declared scope"                                                        | **STRUCK** — false for Bash-invoked tooling. Replaced by the bounded sentence above. Claim E leg 2.                                                                                                                                                          |
| A deterministic scanner flags secret-shaped literals in a plan                                          | **floor: enum-regex** — `scan-plan-secrets.mjs`, fixed regex set, injection-immune by construction.                                                                                                                                                          |
| "secrets screened at the **plan gate**"                                                                 | **STRUCK** — two overclaims. It runs at **grill**, not plan; and grillers never gate, so nothing is "screened" in the gating sense. The griller's own text: "the guarantee is 'the scanner IS deterministic', not 'the model always ran it'". Claim E leg 1. |
| Every concrete path a plan declared must exist after the build, or `/pharn-verify` returns `INCOMPLETE` | **floor: enum-regex** — `check-build-complete.mjs` (path-set membership + `existsSync`) feeding `check-verify.mjs --complete`, exit 3. Bounded: existence, never content; and product-surface only. Claim E leg 3.                                           |
| An approved SPEC is pinned by content-hash, so a later edit is detectable                               | **floor: content-hash** — `check-spec.mjs --hash` / `check-plan-spec-agree.mjs`, re-verified by grill, build, regress and verify.                                                                                                                            |
| The `## Current state` inventory cannot drift from what is built                                        | **floor: enum-regex** — byte-equality, `npm run docs:check`. Bounded: consistency, not truth.                                                                                                                                                                |
| The README badge agrees with `SKILLS_VERSION`                                                           | **floor: enum-regex** — `check-version-badge.mjs`.                                                                                                                                                                                                           |
| Which lenses run is determined by frontmatter, and their findings are merged deterministically          | **floor: enum-regex** — `count-lenses.mjs` + `merge-findings.mjs`, keyed on enum-gated fields only.                                                                                                                                                          |
| Anything a lens, griller or verifier _judges_                                                           | **advisory** — LLM judgment. Labelled in the same sentence, per S6.                                                                                                                                                                                          |
| "PHARN keeps your code understood / audit-grade"                                                        | **advisory** — a claim about humans; the README says what is recorded and checked, never what is understood.                                                                                                                                                 |

## Trust audit (P2)

- The increment prompt is `trust: untrusted` input. Every claim in it was re-verified against live state; where it disagreed with the repo the repo won and the disagreement is named above. Its corrupted §1 was re-derived, not adapted to.
- Fetched web pages (the Osmani post, the Anthropic study) are `trust: untrusted` DATA. They are quoted as figures and dates, and no instruction inside them steers this plan.
- The installer's terminal output is `trust: untrusted` DATA read for what the CLI did; the filesystem tree it produced is the structural fact, read with `find` rather than from the banner (L6).
- No untrusted free text is an input to any gate in this increment. The four gates below are deterministic exit codes.

## Determinism audit (P5)

- Every proceed/stop in the build is an exit code: `npm run check`, `node pharn/floor/validate.mjs .`, and the setter's printed path count compared to an integer.
- The prose quality of the rewritten README is irreducible judgment and ends at the human, per GATE 2 — never at a self-assessment.

## Evals to write (P1)

None. This increment adds no `role:`-bearing capability, no `rule_id`, and no floor checker, so P1's binding requirement has nothing to range over. `## Files` names four repo-meta documents only.

## Build hazards — pinned command lines (L22, L30)

1. **Scope once from the plan, and READ the printed count (L18, L20, L28).** One call authorizes all four writes — measured at plan time, not assumed.

   ```bash
   node .claude/hooks/set-writes-scope.cjs --from-plan .dev/features/readme-adoption-rewrite/PLAN.md
   ```

   It must print `5 path(s)`, resolving to exactly `README.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CLAUDE.md`, `CHANGELOG.md`. Anything else means the `### Deliberately NOT in scope` boundary or an item's wrapped line moved the parse — STOP and re-read `## Files`, do not proceed on a count you did not check. This is a checkable number, not decoration.

2. **Format at write time, scoped to the written files (L12, L13, L19).** Never `npm run format`.

   ```bash
   npx prettier --write README.md SECURITY.md CONTRIBUTING.md CLAUDE.md
   npx markdownlint-cli2 --fix README.md SECURITY.md CONTRIBUTING.md CLAUDE.md
   ```

3. **The generated block moves intact.** Copy `<!-- CURRENT-STATE:BEGIN … -->` through `<!-- CURRENT-STATE:END -->` byte-for-byte into S8, marker lines included. Then:

   ```bash
   npm run docs:generate && npm run docs:check
   ```

   **Declared Bash-scope escape (L19, grill F1).** `docs:generate` is `gen-capability-catalog.mjs && gen-lessons-index.mjs`; it rewrites `docs/capabilities/` and `docs/lessons-index.md` as well as the README block. Those two are outside this build's five-path scope and the write goes through Bash, so fix #7 never sees it. This is declared, not pretended-covered: both are generated artifacts whose only correct content is the generator's output, and `docs:check` re-verifies them byte-for-byte immediately after.

4. **Do not touch the badge value.** `check:badge` binds `img.shields.io/badge/pharn-2.7.14-` to `SKILLS_VERSION`; restyling the hero must leave that string intact.

5. **Both gates, verdicts reported verbatim.**

   ```bash
   npm run check
   node pharn/floor/validate.mjs .
   ```

   A GREEN gate means the shape is sound. It is never evidence the copy is good.

6. **GATE 2 is where the prose is judged.** No floor check can evaluate a README's copy. The full rendered file is presented for human reading after `/pharn-dev-review`, and merge / fix / abandon is the human's call.

## README structure to build (S1–S10)

Order is product → usage → proof → mechanism → philosophy.

- **S1 Hero** — name, hook line, 2–3 sentences of what PHARN does, `npx @pharn-dev/pharn@latest init`, badges unchanged.
- **S2 What PHARN does** — Before / While / After coding, as concrete outcomes in the reader's repo, no internal vocabulary.
- **S3 Quick start** — install, then `/pharn-spec`, then what lands in the repo described BY KIND (product commands, write-gating hooks, the floor, the contracts, a pinned `pharn.config.json`), never as an enumerated tree: the CLI fetches the repo's HEAD, so a path listing would drift with every commit and no checker owns it (grill F3).
- **S4 Built-in capabilities** — grillers and lenses named by the PROBLEM they catch; link `docs/capabilities/`.
- **S5 Why not just CLAUDE.md / AGENTS.md?** — what PHARN adds as mechanism; never "a plain file can't".
- **S6 Guaranteed vs advisory** — stated once, with the real checks named from the guarantee audit above.
- **S7 The pipeline** — the spine without `review`; `/pharn-ship` as orchestrator, `/pharn-loop` as the bounded floor-gated iteration, and per Q1 a separate standalone block for `/pharn-review`.
- **S8 PHARN builds PHARN** — short; the generated CURRENT-STATE block lives here, plus ONE pinned defect (grill F4, no build-time pick): `.dev/features/span-redos-linear/REVIEW.md` F1, where the review caught a blocking P0 overclaim inside the fix for a P0 overclaim — a false performance bound re-asserted in `pharn/floor/scan-code-ssrf.mjs`. Cite the file and quote it; never paraphrase it into a stronger claim.
- **S9 Honest scope** — what has not shipped, labelled in the same sentence; links `LIMITS.md`; notes that an install ships two of the four trusted docs.
- **S10 Design docs · Contributing · Security · License** — per Q2, one line pointing at `pharn/CONSTITUTION.md` replaces the eight-row P0–P7 table.

Status wording, per Q3(a), used verbatim in all four files: _"Ready to install and use with Claude Code today. Active development continues; functionality that has not shipped yet is explicitly labeled."_

Writing rules the build must hold: every factual claim survives a sceptic with the repo open in another tab; no number a generator or a test run already owns is hardcoded; nothing is called a guarantee unless the check behind it can be named; no superlatives; no named-competitor comparisons; anything unshipped is labelled in the same sentence.

## Open questions (HALT)

**None outstanding.** Q1–Q4 were asked and answered at Step 4; the one remaining question (`CHANGELOG.md`) was put to the human at GATE 1 and answered "include". Nothing below blocks `/pharn-dev-build`; the items that follow are resolutions and reported residuals, recorded here so the decisions are on the record rather than implicit.

## Decisions and reported residuals

1. **`CHANGELOG.md` entry — RESOLVED at GATE 1: include.** Repo-meta triggers no `SKILLS_VERSION` bump, so the entry lands under `[Unreleased]` with the version left at 2.7.14, honouring the file's own "all notable changes are documented" contract (L1) without inventing a bump the CLAUDE.md rule does not authorize.
2. **Hardcoded numbers (L20, L24).** The rewrite hardcodes NO count — capability totals come from the generated block and test totals are not quoted at all. The one unavoidable literal is the install command's package name. Per L32 it stays `@pharn-dev/pharn@latest`, a mutable alias: correct for a README, and it means the README never pins `0.3.2`.
3. **Reported, not fixed — out of axis.** The `pharn-cli` README's "What it installs" table is wrong on two rows (my install created no `.dev/` and put the constitution at `pharn/CONSTITUTION.md`); its pipeline line includes `review`; `pharn-cli`'s `package.json` is ahead of the published `0.3.2`; `pharn-oss` has **0 git tags and 0 GitHub releases** (verified via `gh api`); the installer writes a vestigial `"modules": []`; the installer's capability table breaks its column padding on longer names (reproduced live: `unsafe-deserialization (lens)ssr`); and the repo's topic list carries a malformed slug **`agentic-skill-`** (verified via `gh api`, not rate-limited from here — this corrects the prompt's UNVERIFIABLE).
4. **The two missing trusted docs.** Whether `THREAT-MODEL.md` and `LIMITS.md` should ship with an install is a `pharn-cli` decision, not a README one. Flagged for a human; the README will describe only what an install actually contains.
