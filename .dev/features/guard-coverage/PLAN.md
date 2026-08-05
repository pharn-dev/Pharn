# PLAN — guard-coverage (make the lessons-index guard real in CI, and the claim about it true)

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4 (sha256 of pharn/ARCHITECTURE.md, computed live this run)
- applied_lessons: [L1, L2, L5, L7, L16, L17] # MANDATORY — floor-checked; `none` is the escape, omission is not
- increment: Wire `npm run docs:check` into CI so the lessons-index drift guard actually runs on a PR, correct the CLAUDE.md claim that already asserted it, and pin the wiring with a test so the claim cannot silently become false again.
- layer(s): build apparatus + repo-meta — no `pharn/` product surface is touched
- constitution_refs: [P0, P2, P5, P6, P7]

## Applied lessons

- L1 — Meta-doc sweep run live: `CLAUDE.md` (the false claim itself) and `CHANGELOG.md` are named in `## Files`. Checked and found **unaffected**: `README.md`'s generated Current-state block enumerates only `pharn/floor/` checkers (`:155`, "36"), and this increment adds no floor checker; the README CI badge (`:12`) is a link, not a claim about steps.
- L2 — **The lesson this increment exists for.** L2 requires that any "enforced by `<floor op>`" phrase cite an op verified **live this run**, not merely spec'd. Verified live: `grep -rn "check-lessons-index\|docs:check" .github/workflows/` returns **nothing**, while `CLAUDE.md:260` claims the regions are guarded "as its own CI step". This increment makes the op live (the ci.yml change) **and** pins it with a test, so the claim is backed rather than asserted.
- L5 — A floor verdict is only as trustworthy as the orchestration that captures its inputs. Here the CI **step** is that orchestration: a checker nothing invokes produces no verdict at all. Applied by making the wiring itself a checked artifact rather than trusting the workflow file to stay correct.
- L7 — Declare exactly what is written, nothing aspirational. `.github/workflows/ci.yml` is newly declared in `## Files` (it is outside `enforce-writes-scope.cjs`'s default-safe-set, so the declaration is what unlocks it), and no path is declared that this increment does not write.
- L16 — A remedy can itself be a portability trap. Applied as a **refusal**: the reviewed `docs:check` `&&`-unbundling is deliberately NOT done, because the only shell-level fix needs POSIX-only arithmetic (`; $?; exit $((c||l))`) and would make it the first non-portable npm script in a repo whose scripts are all `&&`-chained. See "Deliberately NOT in scope".
- L17 — `check-regress scope` tests changed-since-base, not written-by-the-build. Applied: `/pharn-dev-regress` is run with an explicit `--base 0562f9e`. **Corrected after GRILL F1** — the original rationale here was wrong about _when_ auto-detection runs. `/pharn-dev-regress` executes **after** `/pharn-dev-build` has written the plan's `## Files`, so `git status --porcelain` is non-empty at that moment and the state test's first branch fires, yielding `base = HEAD = 0562f9e` — the same answer. The flag is therefore **belt-and-braces, not a correction**: the base decides the entire inside/outside partition, and a value that happens to coincide today would stop coinciding the moment a build wrote nothing (clean tree → the `merge-base` branch → `c0ca610` → all 13 files of the already-committed `lessons-index` commit reported as "escaped"). Too load-bearing to leave implicit.

## Files

> **AMENDED at build Step 1.3 (P6 — a precondition failed), human-approved.** Commit `0323bf9` ("update")
> landed between `/pharn-dev-grill` and `/pharn-dev-build` and **already made the `ci.yml` change this plan
> was built to make** (step renamed `Docs drift check`, now running `npm run docs:check`). Two consequences,
> both verified live: `.github/workflows/ci.yml` is **removed from `## Files`** — the edit is a no-op — and
> the `CLAUDE.md:260` claim that `/pharn-dev-review` called blocking is **now TRUE**, so the CLAUDE.md edit is
> reframed from _correcting a false claim_ to _documenting the `&&` short-circuit_. The same commit also
> added two new output branches to `check-lessons-index.mjs`'s `main()` **with no test**, so covering them
> is added to scope. The base for `/pharn-dev-regress` moves from `0562f9e` to **`0323bf9`**.

- `.dev/floor/lessons-index-core.test.mjs` — EDIT. Add one ✧ drift guard asserting `.github/workflows/ci.yml` invokes `npm run docs:check` **and** that the step carries the install-gated `if:` condition its siblings use (GRILL F3 — the `if:` is in-repo and pinnable, not harness-layer). Now guards a fix that already landed, which is exactly when a wiring guard earns its keep. Joins the three ✧ guards already in this file — no new file, same pattern. — layer: apparatus
- `.dev/floor/check-lessons-index.test.mjs` — EDIT. Cover the two output branches `0323bf9` added to `main()` and shipped untested: an `ENUM_ERROR` prints "canonical input is invalid" + a FIX naming the canon file (because `docs:generate` **cannot** succeed until the input is corrected), while a `DRIFT`/`MISSING` prints "out of date" + the regenerate FIX. Exercised through the CLI with `spawnSync(process.execPath, …)`, the house pattern, since `main()` calls `process.exit`. — layer: apparatus
- `CLAUDE.md` — EDIT. **Reframed** (see the amendment above): the `:260` claim is now TRUE, so this documents the `&&` short-circuit honestly instead — a first RED stops the second checker, `npm run docs:generate` regenerates **all** regions so the remedy is identical either way, and an `ENUM_ERROR` is the one case where regenerating **cannot** help (fix canon first). — layer: repo-meta
- `.claude/commands/pharn-dev-plan.md` — EDIT. Repair the `markdownlint --fix` indentation regression at Step 1.4: the sweep's closing instructions ("Then carry the applicable ids…", the `none`-escape sentence) were re-indented under sub-item (ii) and now read as applying to step (ii) only, not to the whole two-step sweep. — layer: apparatus (a `pharn-dev-` command)
- `CHANGELOG.md` — EDIT. `[Unreleased]` entry (L1) covering **both** this increment and commit `0323bf9`, which shipped the CI wiring change and the `check-lessons-index.mjs` messaging change **without a CHANGELOG entry** — L1's exact failure mode, caught live this run. — layer: repo-meta
- `.dev/floor/check-lessons-index.mjs` — EDIT (**declared retroactively at regress Step 1, and the reason is a defect worth naming**). Content unchanged; **whitespace only** — two `process.stdout.write(...)` calls re-joined onto single lines. It was modified by `/pharn-dev-build`'s **Step 2b**, whose text says "run the project formatter over the just-written files — `npm run format`" while `npm run format` is `prettier --write .`, i.e. the **whole repo**. fix #7 cannot catch it: prettier runs through Bash, not the Write tool. The change is a **repair, not damage** — verified live in a worktree at `0323bf9`, that commit's copy **fails `prettier --check`**, so the baseline was format-RED and both `npm run check` and CI's `Format check` step would have failed on it. Declared here rather than reverted (reverting would re-red the style gate) or left undeclared (which would be an undeclared write — L7's dangerous direction). — layer: apparatus

### Deliberately NOT in scope

> This block is a `###` **heading**, not a bold prose line — the structural form `set-writes-scope.cjs`
> ends its scan on (`:165`), independent of wording. The bold-prose form silently failed OPEN on the
> previous increment (16 paths resolved against 13 approved). That episode is proposed as lesson
> Candidate A in `.dev/features/lessons-index/REVIEW.md`.

- `package.json` — **the `docs:check` / `docs:generate` `&&`-unbundling is NOT done, and this narrows what was selected at the scoping question.** Stated plainly so it can be overridden at GATE 1. Reason (L16): every npm script in this repo is `&&`-chained and portable; running both checkers unconditionally while still failing closed needs `sh`-only arithmetic (`node A; c=$?; node B; l=$?; exit $((c||l))`), which breaks on Windows' `cmd.exe` and would be the repo's first non-portable script — L16's exact "the remedy is itself a portability trap" shape. Weighed against a real but small cost: both checkers print the **same** fix (`npm run docs:generate`, which regenerates **both** regions), so a masked second RED costs one extra `docs:check` run and is repaired by the identical command. The honest mitigation shipped instead is **documenting** the short-circuit in CLAUDE.md. If a real failure ever makes this bite, that is the P7 trigger for a proper Node-runner increment.
- `SKILLS_VERSION` — **no bump.** Per CLAUDE.md's discipline every changed path is `.dev/**`, a `pharn-dev-*` command, a `*.test.*` file, or repo-meta/CI. No product-surface byte changes.
- `.dev/memory-bank/lessons-learned.md` — **not written here.** Lesson Candidate A is promoted by a separate, human-gated `/pharn-dev-memory-promote` run behind `check-provenance.mjs` (L7: a stage that only _proposes_ a lesson must never hold write-scope to canon).
- `pharn/ARCHITECTURE.md §5` — human-only, hook-denied (fix #2). Still outstanding from the previous increment: §5 names four canonical memory-bank files plus an _optional gitignored vector index_, and a committed, drift-guarded derived index is a different artifact class.

## Contracts satisfied

- **None in `pharn/pharn-contracts/`.** No Capability and no product-tree behavior is added; this is apparatus + CI wiring.
- It **restores** the honesty contract L2 names — a doc's "enforced by `<op>`" phrase must cite a live op — and converts it from prose discipline into a **checked** property for this one claim.

## Evals to write (P1)

- **No evals — and that is not an exemption.** P1 binds Capabilities (`role:`-bearing markdown + `evals/`). This increment adds none; `.claude/commands/` and `.dev/` are both outside `pharn/floor/validate.mjs`'s scan. The apparatus equivalent is the `node --test` guard below, wired by the existing `npm test` glob.
- **One new test**, added to the existing suite: `✧ ci.yml runs npm run docs:check` — reads `.github/workflows/ci.yml` and asserts the invocation is present. **It must be measured failing before it is trusted** (L4 — an authored fixture passes by construction): revert the ci.yml step, confirm the suite REDs, restore.

## Guarantee audit (P0)

- **"The committed `docs/lessons-index.md` matches canon, enforced on every PR"** → **FLOOR (enum-regex / byte-equality), and TRUE ONLY AFTER this increment.** Before it, the reduction existed locally (`npm run check`) but **no CI step invoked it**. This is the defect being repaired, not a new claim.
- **"CI will keep invoking the checker"** → **FLOOR (regex over `ci.yml`), via the new ✧ test** — bounded, and **the boundary is drawn correctly only after GRILL F3**. The test pins **two** in-repo properties: that `npm run docs:check` appears in the workflow, **and** that the step's `if:` condition is the same install-gated form the sibling steps use. The `if:` is emphatically **not** harness-layer — it lives at `ci.yml:37`, in the very file the test reads, so an edit to `if: false` would otherwise leave the string present, the test green, and the guard dead: the exact defect this increment repairs, one level down. What genuinely **remains** outside the repo, and is claimed as a limit rather than a gap: that GitHub actually executed the job, that the workflow was not disabled, and that branch protection requires this check — harness-layer facts, the same boundary `LIMITS.md §1d` draws for an out-of-band approval signal. Claim it as "the wiring is pinned", never "CI is guaranteed to run it".
- **"`docs:check` reports every drifted region in one run"** → **FALSE, and deliberately left false.** The `&&` short-circuit stands; CLAUDE.md will now say so. Documenting a limitation is P7-honest; silently leaving the claim ambiguous would not be.
- **"The plan-command indentation repair changes agent behavior"** → **ADVISORY.** Command prose is not executable and `.claude/commands/` is outside the floor's scan; this fixes a scoping cue a reader relies on, and nothing verifies it was obeyed.
- **STRUCK — never write this.** "CI guards the index, therefore the index is correct." Byte-equality is **consistency, not correctness**: a wrong parser regenerates cleanly and stays GREEN in CI exactly as it does locally.

## Trust audit (P2)

- **No new untrusted ingestion.** This increment reads `.github/workflows/ci.yml` (repo-controlled, trusted-by-provenance), `package.json`, and its own meta-docs. No canon free text, no reviewed code, no fetched doc enters any new path.
- **The new test's verdict ranges over a regex match on a workflow file** — an enum-gated/floor-verifiable class read, never over prose meaning. A hostile edit to `ci.yml` that removed the invocation would fail the test rather than steer it.
- The taint surface of the previously-shipped index (canon titles → `docs/lessons-index.md` → the plan stage, rendered as fenced DATA, no decision reading the title column) is **unchanged** by this increment.

## Determinism audit (P5)

- The new guard is a **regex membership test** over a file's bytes — no LLM classification, no judgment.
- `/pharn-dev-regress`'s base is **passed explicitly** (`--base 0562f9e`) rather than auto-detected, because the auto-detect branch would produce a knowably wrong partition here (L17). The choice is stated in this plan, so it is reviewable rather than improvised at the stage.
- Terminal fallback everywhere is **ask the human** — GATE 1 for the narrowed `package.json` item, GATE 2 for the rest.

## Open questions (HALT)

1. ~~**The `package.json` `&&`-unbundle was selected at the scoping question and is NOT in `## Files`.**~~
   **RESOLVED at GATE 1 — the human approved this plan _as written_, so the unbundle stays out of scope**
   for the L16 portability reason recorded under "Deliberately NOT in scope". Struck through rather than
   deleted so the question and its answer both stay on the audit trail. **No open question remains**;
   `/pharn-dev-build`'s Step 1.1 halt condition is not met. (Recorded per GRILL F2 — an answered question
   left looking open either halts the next stage wrongly or teaches it to skim the one section that
   exists to stop it.)

**Reported for a human, not fixed here (carried forward, unchanged):**

1. `pharn/ARCHITECTURE.md §5` — the derived-index artifact class. Human-only; the agent cannot write it.
2. A live canon data anomaly: `## L10` carries **no** `**Provenance.**` block while `## L11` carries **two** (the second is L10's), which is why L10's date column renders `-`. Repair is a gated `/pharn-dev-memory-promote`-class write, deliberately not in this increment's `## Files`.

## Follow-ups this increment deliberately does not do (P7)

- `product-lessons-index` — the product-side generator + `/pharn-plan` sweep rewrite (bumps `SKILLS_VERSION`).
- `lessons-index-downstream-reads` — let build/verify/regress/review consult the index instead of carrying hardwired `L<n>` citations in prose.
- `retro-tag-legacy-lessons` — retro-tag L1–L17 through the gated promote path.
- `lesson-tagline-render-check` — #114's named residual: nothing re-checks the RENDERED canon tag line.
- L17's own remedy — derive "written by the build" from `.pharn/writes-scope.json` instead of from `git diff <base>`. Now with **two** confirmed occurrences behind it.
