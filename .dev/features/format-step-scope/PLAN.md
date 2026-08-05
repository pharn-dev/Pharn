# PLAN — format-step-scope (each stage formats exactly its own outputs, portably)

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4 (sha256 of pharn/ARCHITECTURE.md, computed live this run)
- applied_lessons: [L1, L2, L5, L7, L12, L13, L16, L19] # MANDATORY — floor-checked; `none` is the escape, omission is not
- increment: Replace `/pharn-dev-build`'s repo-wide Step-2b formatter with one scoped to the paths the plan authorized, land L13's never-implemented per-stage format step in every artifact-writing stage, and pin the whole class with a guard test.
- layer(s): build apparatus (`.claude/commands/` + `.dev/floor/`) — no `pharn/` product surface is touched
- constitution_refs: [P0, P2, P5, P6, P7]

## Applied lessons

- L19 — **The defect this increment repairs**, promoted to canon minutes ago. Step 2b says "format the **just-written files**" while running `npm run format` = `prettier --write .` over the whole repo, so every build writes outside its `writes:` scope through a Bash door fix #7 cannot gate. Fixed by naming the exact paths.
- L13 — **Its remedy was prescribed in canon and never implemented** — verified live: no stage command contains `prettier --write`. Landed here. L13's list (regress/verify/review/ship) is also **extended by two**: `plan` and `grill` write markdown artifacts too, and they run _before_ build, so nothing formats them either.
- L12 — Step 2b's origin. Prevention-at-build is preserved exactly; only its **scope** changes. The step stays ADVISORY orchestration and still never blocks — L12's core claim ("the build formats its output" cannot be a guarantee) is untouched.
- L16 — **A remedy is itself a portability trap.** Verified live this run: on BSD/macOS `xargs` does **not** run its command on empty stdin, while GNU `xargs` (ubuntu CI, Linux contributors) runs it **once with no arguments** unless `-r`. For `markdownlint-cli2 --fix` that means an empty `.md` list would invoke it **bare — which lints and fixes the whole repo**, resurrecting L19's exact defect through L19's own fix. Closed with an explicit POSIX non-empty test that relies on no `xargs` dialect at all.
- L5 — The file list handed to a formatter is an **input-capture surface**. Paths are passed newline-delimited through stdin-fed `xargs`, never an unquoted variable expansion.
- L2 — A doc may cite only ops verified **live this run**. Every mechanic written into these commands was executed first: `--ignore-unknown` is **required** (without it prettier exits **1** on an extension-less path such as `SKILLS_VERSION`, which really did appear in a plan's `## Files` this session); `.prettierignore` **is** honored for explicitly-named paths (so the generated `docs/lessons-index.md` stays protected); `markdownlint-cli2 --fix <path>` accepts explicit paths.
- L7 — Declare exactly what is written. Every touched command is named in `## Files`; the guard test asserts the negative rather than trusting prose.
- L1 — Meta-doc sweep run live: `CLAUDE.md` and `README.md` assert nothing about the format step (grepped), so only `CHANGELOG.md` needs the entry.

## Files

- `.claude/commands/pharn-dev-build.md` — EDIT. Step 2b rewritten: format **exactly** the paths in `.pharn/writes-scope.json` (the deterministic list fix #7's Step-0 setter already produced — no re-parsing of the plan, P5), via `xargs npx prettier --ignore-unknown --write`, plus `markdownlint-cli2 --fix` over only the `.md` subset behind an explicit non-empty guard. The old repo-wide invocation is named and struck **inside the guard's marked-skip region** so the reason survives without tripping it. **Amended after GRILL F2:** the step must state its behavior when `.pharn/writes-scope.json` is **absent or stale** — `.pharn/` is gitignored runtime state an operator may delete, and this session re-set it mid-run more than once. Contract: if the file is missing or unreadable, **skip with a printed note and continue** (never throw — the step is advisory and "never blocks"); the step also prints the file count it formatted, so a stale scope is visible rather than silent. — layer: apparatus
- `.claude/commands/pharn-dev-plan.md` — EDIT. Add the format-own-artifact step before its halt (`PLAN.md`). — layer: apparatus
- `.claude/commands/pharn-dev-grill.md` — EDIT. Same (`GRILL.md`). — layer: apparatus
- `.claude/commands/pharn-dev-regress.md` — EDIT. Same, over **`REGRESSION.md` only** — **amended after GRILL F2-sibling**: the machine report `regression-report.json` is explicitly **excluded**, because that command requires it to be "the helper's `verdict` JSON **verbatim**" and a formatter that rewrites bytes makes "verbatim" false. It is generated, not authored — the same reasoning that exempts `docs/lessons-index.md` from the style gates. (Latent today only because the helper's output happens to match prettier's spacing; that is luck, not contract.) — layer: apparatus
- `.claude/commands/pharn-dev-verify.md` — EDIT. Same, over **`VERIFY.md` only**; `verify-report.json` excluded for the identical reason. — layer: apparatus
- `.claude/commands/pharn-dev-review.md` — EDIT. Same (`REVIEW.md`). — layer: apparatus
- `.claude/commands/pharn-dev-ship.md` — EDIT. Same (`SHIP.md`). — layer: apparatus
- `.claude/commands/pharn-dev-memory-promote.md` — EDIT. Same, over the one canon file it appends to. — layer: apparatus
- `.dev/floor/command-hygiene.test.mjs` — NEW. The guard that makes L19's remedy enforceable rather than prose: asserts **no** `.claude/commands/*.md` prescribes a repo-wide formatter/linter **write** (`npm run format`, a bare `prettier --write .`, or a bare `markdownlint-cli2 --fix`). **Amended after GRILL F1 and F3:** (a) the scan **skips an explicitly marked region** — an HTML-comment fence, the house pattern already used for `TYPE-ENUM:BEGIN/END` in `pharn-dev-memory-promote.md` — so Step 2b can keep the struck-through historical form without the guard REDing on the file it protects (as specified, the two collided and the increment could not have gone green); (b) the weak positive assertion "every artifact-writing stage names `prettier` at all" is **dropped** — a presence check over prose is launderable, the same shape the error-handling griller rejects as a floor candidate. Only the strong negative remains. Deliberately a **new file, not an addition to `lessons-index-core.test.mjs`** — that file was flagged twice for accumulating unrelated ✧ guards, and this is a different axis; its header will say why a test with no paired checker lives in `.dev/floor/` (GRILL F4). — layer: apparatus
- `CHANGELOG.md` — EDIT. `[Unreleased]` entry (L1). — layer: repo-meta

### Deliberately NOT in scope

> A `###` heading, not a bold prose line — the structural boundary `set-writes-scope.cjs` honors
> regardless of wording (L18, promoted this session after the bold form failed OPEN at 16-vs-13 paths).

- `SKILLS_VERSION` — **no bump.** Every changed path is a `pharn-dev-*` command, a `*.test.*` file, or repo-meta. **Verified live** that no product (`pharn-*`, non-dev) command prescribes a formatter write, so the product surface is untouched.
- `.claude/commands/pharn-dev-eval.md` — its `writes:` is `runs/**` (eval run output, not a committed prose artifact). Out of the "artifact-writing stage" set this increment addresses; named so the omission is a decision, not an oversight.
- **The product pipeline's stages** (`pharn-build.md` et al.) — they carry no formatter step to fix. Whether a _user's_ project should get an equivalent is a separate question with a `SKILLS_VERSION` cost: follow-up `product-format-step`.

## Contracts satisfied

- **None in `pharn/pharn-contracts/`.** No Capability, no product-tree behavior — apparatus and CI-adjacent hygiene.
- It **implements** the remedy `lessons-learned.md` **L13** prescribes and **closes** the defect **L19** names, both cited rather than restated (P4).

## Evals to write (P1)

- **No evals, and that is not an exemption.** P1 binds Capabilities (`role:`-bearing markdown + `evals/`); this increment adds none, and both `.claude/commands/` and `.dev/floor/` sit outside `pharn/floor/validate.mjs`'s scan. The apparatus equivalent is the `node --test` guard above, collected by the existing `npm test` glob.
- **The guard must be measured FAILING before it is trusted** (L4 — an authored fixture passes by construction): re-introduce `npm run format` into a command file in a scratch copy, confirm the suite REDs, restore.

## Guarantee audit (P0)

- **"A build writes only the paths its plan authorized"** → **STILL NOT A GUARANTEE, and this increment does not make it one.** fix #7 gates `Write|Edit|MultiEdit`; a Bash-invoked tool bypasses it entirely. This increment **removes the known instance** (the repo-wide formatter) and **pins it with a test** — it does not close the class. Any future Bash tool a stage invokes escapes exactly as before. Saying "scope is now enforced for Bash writes" would be the disease; L19 stays true after this lands.
- **"No stage command prescribes a repo-wide formatter write"** → **FLOOR (regex over the command files), via the new guard test.** Narrow and honest: it pins the known-bad **strings**, so a novel spelling of the same mistake (a shell alias, a differently-worded script) passes. A negative assertion over a known vocabulary, not a proof of absence.
- **"The formatter step is correct"** → **ADVISORY.** Running a formatter is orchestration, never a floor op (L12's original framing, unchanged). The deterministic style gate remains `/pharn-dev-verify`'s `check-verify.mjs` map (L9) — this only reduces a foreseeable red.
- **"Each stage now formats its own artifact"** → **ADVISORY (command discipline).** Prose an agent may or may not follow; nothing on the floor forces it. Its absence is detected only downstream, by verify's whole-repo style gate.
- **"`--ignore-unknown` / `.prettierignore` behave as described"** → **FLOOR-adjacent and verified live this run** (exit 1 → 0; index byte-unchanged), not asserted from documentation.

## Trust audit (P2)

- **No new untrusted ingestion.** The touched files are repo-controlled command prose; the guard test reads `.claude/commands/*.md` — trusted by provenance — and its verdict is a **regex over bytes**, never prose meaning.
- **A relevant tightening:** narrowing the formatter's scope **reduces** the blast radius of a hostile or mistaken plan. Today a build's formatter touches every file in the repo; after this, it touches only paths a human approved in `## Files`. That is a genuine, if modest, containment improvement — and it is the reason to prefer the scoped fix over merely documenting the sweep.
- **Named residual:** the `.pharn/writes-scope.json` the step reads is itself Bash-written scratch (`enforce-writes-scope.cjs` excludes it from Write-tool edits precisely so the gate's input cannot be self-escalated). The formatter now trusts that file to be correct. It is produced deterministically by the setter, but this does add one consumer to it.

## Determinism audit (P5)

- The path list comes from **`.pharn/writes-scope.json`** — already parsed deterministically by the Step-0 setter — not from a fresh model reading of the plan.
- Every branch is a membership/emptiness test: the `.md` subset by extension, the non-empty guard by `[ -n "$FILES" ]`. **No `xargs` dialect behavior is relied on**, because the two dialects genuinely disagree (verified live on BSD; GNU's differing empty-input behavior is documented, not verified here — which is itself the reason not to depend on either).
- Terminal fallback is unchanged: an unresolvable prettier↔markdownlint conflict is resolved **by hand**, and the step never blocks.

## Open questions (HALT)

1. **Scope size.** This touches **8 command files** where the request was "fix Step 2b." The plan argues they are one increment because fixing Step 2b **alone would regress the pipeline**: `plan` and `grill` artifacts are currently formatted only as collateral of the repo-wide sweep, so removing the sweep without adding their own steps makes them start reddening verify. **If you prefer the narrow version** — build only, accepting that regression and leaving L13 unimplemented — say so at GATE 1 and I will cut it back.

**Reported for a human, not fixed here (carried forward):**

1. `pharn/ARCHITECTURE.md §5` — the derived-index artifact class. Human-only, hook-denied.
2. The canon anomaly: `## L10` has no `**Provenance.**` block (its block sits orphaned under `## L11`), now visible as a blank date in `docs/lessons-index.md`. A gated promote-class write.
3. `.dev/features/guard-coverage/PLAN.md` names two different regress bases (`0562f9e` at `:16`/`:75` vs `0323bf9` at `:27`). The run used the correct one; the audit record is the defect.

## Follow-ups this increment deliberately does not do (P7)

- `product-format-step` — whether the product pipeline's stages should carry an equivalent (bumps `SKILLS_VERSION`).
- `bash-write-scope` — the real closure of L19's class: gate Bash-invoked tool writes, or record them in a scope-audit artifact. Materially harder; this increment removes one instance, not the door.
- `lesson-tagline-render-check`, `retro-tag-legacy-lessons`, `product-lessons-index`, `lessons-index-downstream-reads`, and L17's remedy — all still queued.
