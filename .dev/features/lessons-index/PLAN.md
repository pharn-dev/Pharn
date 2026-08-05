# PLAN — lessons-index (derived one-line index over the dev memory bank)

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4 (sha256 of pharn/ARCHITECTURE.md, read live this run)
- applied_lessons: [L1, L3, L6, L9, L10, L11, L14, L15] # MANDATORY — floor-checked; `none` is the escape, omission is not
- increment: Add a generated, drift-guarded one-line index over `.dev/memory-bank/lessons-learned.md` (`docs/lessons-index.md`) using the #101 generator/checker/core house pattern, and rewrite the `/pharn-dev-plan` lessons sweep to select candidates from it before fetching the full entries from canon.
- layer(s): build apparatus (`.dev/floor/`) — OUTSIDE the `pharn/ARCHITECTURE.md §4` product layer tree; adds no product-surface bytes
- constitution_refs: [P0, P2, P3, P4, P5, P6, P7]

## Applied lessons

- L1 — Meta-doc sweep run against live state, and it caught three files the increment brief omitted: `.prettierignore` and `.markdownlint-cli2.jsonc` (they ignore `docs/capabilities/` **specifically**, not `docs/`, so a new `docs/lessons-index.md` would be linted) and the `CLAUDE.md` `docs:*` description. All three are named in `## Files`.
- L3 — Retrofitting enforcement onto existing declarations converts latent drift into active friction. No live L1–L17 entry carries a #114 tag line, so the parser treats `type`/`concepts` as OPTIONAL and renders `-`; it never fails on an untagged entry, and this increment does **not** retro-tag canon (that stays a follow-up, P7).
- L6 — The tag line is read from its **defined structured location** — the first non-empty line after the `## L<n> — <title>` heading, per the entry contract in `.claude/commands/pharn-dev-memory-promote.md` — and never grepped from prose. A `type:` string inside a lesson body is DATA about typing, not a declaration of it.
- L9 — An increment's own new markdown is style-gated only at the whole-repo `format:check` / `lint:md`. The generated index is exempted from both (the catalog precedent) so generator bytes and formatter output can never disagree.
- L10 — `pharn/floor/validate.mjs` `EXCLUDE_SEGMENTS` does **not** exclude `docs/`, so `docs/lessons-index.md` lands on the validate-SCANNED surface. Verified live that CHECK 5 fires only on a `rule_id:` **and** `problem:` pair; the row format is therefore constrained to never render that pair, and a test pins it.
- L11 — A stale byte in a whole-repo-gated file blocks **every later feature's** verify, not just this one's. That is the decisive reason to add `docs/lessons-index.md` to `.prettierignore` + the markdownlint ignores rather than hand-tuning the generator to match prettier's canonical output.
- L14 — The `concepts` shape regex is composed **after** a control-char guard, never as a replacement: JS `$` matches before a single trailing newline, so a shape regex used alone would re-admit a trailing-newline laundering vector. Same guard-first order `check-provenance.mjs` uses.
- L15 — Every keyed lookup over an arbitrary id (`L<n>` → entry) uses `Map` / `Object.hasOwn`, never `obj[key] || fallback`; a lesson id such as `constructor` cannot occur, but the discipline is the floor tool's, not the input's.

## Files

- `.dev/floor/lessons-index-core.mjs` — NEW. The shared deterministic core: parse canon → `[{id, type, concepts, title, date, chars}]`, render `docs/lessons-index.md`. Imported by BOTH the generator and the checker so "recompute" is byte-identical to "generate" by construction (the #101 discipline). — layer: apparatus
- `.dev/floor/lessons-index-core.test.mjs` — NEW. node:test suite: heading membership, tag-line position + grammar, untagged→`-` degradation, `TYPE_ENUM` equality with `check-provenance.mjs` (the ✧ P4 drift guard), control-char/fence-escape refusal, no `rule_id:`+`problem:` pair, idempotent bytes. — layer: apparatus
- `.dev/floor/gen-lessons-index.mjs` — NEW. Generator CLI (`node .dev/floor/gen-lessons-index.mjs [targetDir]`); writes only on a real change (idempotence). — layer: apparatus
- `.dev/floor/gen-lessons-index.test.mjs` — NEW. node:test suite: writes the expected path, second run is a filesystem no-op, missing canon = hard error not a silent empty index. — layer: apparatus
- `.dev/floor/check-lessons-index.mjs` — NEW. Drift checker CLI; RED on `MISSING` / `DRIFT` / a core enumeration throw; prints the fix command. — layer: apparatus
- `.dev/floor/check-lessons-index.test.mjs` — NEW. node:test suite: GREEN on committed==recomputed, RED on a mutated byte, RED on absent file, fail-closed on a bad target dir. — layer: apparatus
- `docs/lessons-index.md` — NEW, GENERATED + committed. The derived index. Never hand-edited. — layer: apparatus output
- `package.json` — EDIT. `docs:generate` and `docs:check` each gain the second script (`&&`), so the drift check rides the existing `npm run check` pipeline. — layer: repo-meta
- `.prettierignore` — EDIT. Add `docs/lessons-index.md` with the same rationale comment the catalog entry carries. — layer: repo-meta
- `.markdownlint-cli2.jsonc` — EDIT. Add `docs/lessons-index.md` to `ignores`. — layer: repo-meta
- `.claude/commands/pharn-dev-plan.md` — EDIT. Step 1.4 sweep rewritten (select candidates from the index → fetch each candidate's FULL `## L<n>` entry from canon → declare as today); `reads:` gains `docs/lessons-index.md` and KEEPS `.dev/memory-bank/lessons-learned.md`; `version: 0.2.0` → `0.3.0`. — layer: apparatus (a `pharn-dev-` command)
- `CLAUDE.md` — EDIT. Document the second generated region + the `docs:generate` / `docs:check` pair now covering two artifacts (L1). — layer: repo-meta
- `CHANGELOG.md` — EDIT. `[Unreleased]` entry (L1). — layer: repo-meta

### Deliberately NOT in scope

> **Why this is a `###` heading and not a bold line (corrected at build Step 0, this run).** As first
> written, this exclusion block opened with the bold prose line `**Deliberately NOT in scope, each with
its reason:**`. `set-writes-scope.cjs --from-plan` ends the authorized list at any markdown **heading**
> (`:165`, structural) or at a non-path prose **cue** (`:179`) whose vocabulary is
> `not touch|writ|modif|edit|chang` / `explicitly excluded` / `out of scope` / `off limits`. "NOT in
> scope" matches none of those, so the block was scanned as ordinary `## Files` items and the setter
> resolved **16** paths instead of 13 — handing the build write-scope to `SKILLS_VERSION`,
> `.claude/commands/pharn-plan.md`, and the fix #2 trusted doc `pharn/ARCHITECTURE.md`. That is L7's
> failure direction exactly (an over-declaration is permissive in the dangerous direction), caught before
> any write. The heading form is wording-independent and fails closed. No approved path changed: this
> strictly NARROWS the scope back to the 13 files the human approved at GATE 1.

- `SKILLS_VERSION` — **no bump.** Per CLAUDE.md's bump-triggering set, this increment touches **no** product surface: `.dev/**`, `pharn-dev-*` commands and `*.test.*` files are apparatus, `docs/` is not in the set, and repo-meta (`package.json`, `CHANGELOG`, `CLAUDE.md`, the two ignore files) does not bump.
- `.claude/commands/pharn-plan.md` — **untouched** (human decision at the Step-1 halt). A user's repo has no index generator, so a rewritten product sweep would point at a file that does not exist there. Follow-up: `product-lessons-index` (ship a product-side generator + the product sweep rewrite together; that one DOES bump `SKILLS_VERSION`).
- `pharn/ARCHITECTURE.md §5` — **FLAGGED FOR A HUMAN, never agent-written.** §5 (`:188-193`) names four canonical memory-bank files plus an _optional gitignored vector index_. A **committed, git-tracked, drift-guarded derived index** is a different artifact class and §5 does not describe it. The file is fix #2 hook-protected and human-only; this plan reports the amendment and does not attempt it.

## Contracts satisfied

- **None in `pharn/pharn-contracts/`.** This increment adds no Capability and no product-tree behavior; it is build apparatus (the #101 precedent — `capability-catalog-core.mjs` declares no `role:` and ships no evals).
- It **consumes** (cites, never restates — P4) the **lesson-entry tag line contract** defined in `.claude/commands/pharn-dev-memory-promote.md` ("The lesson-entry tag line", added by #114): position = first non-empty line after `## L<n> — <title>`; grammar = `type: <member> · concepts: [c1, c2, …]`.
- It **mirrors** `TYPE_ENUM` from `.dev/floor/check-provenance.mjs` (which exports nothing — it is a CLI) and pins the mirror with a source-regex equality test, exactly the ✧ P4 drift guard `check-provenance.test.mjs:208` already applies to the memory-promote doc's copy.
- It **re-uses** the `^## L(\d+)` heading discipline of `pharn/floor/check-plan-lessons.mjs:66`, re-implemented in-file (no sibling import — the same P3 note that file carries).

## Evals to write (P1)

- **No evals — and that is not an exemption.** P1 binds **Capabilities** (`role:`-bearing markdown + `evals/cases/*` + `evals/expected/*`). This increment adds none; `pharn/floor/validate.mjs` will not enumerate any of these files as a capability (`.dev/` is excluded wholesale). The apparatus equivalent, per the #101 precedent, is a `node --test` suite per module — three suites, listed in `## Files`, all wired by the existing `npm test` glob (`.dev/**/*.test.mjs`).
- Behavioural fixtures live in the test suites, not on disk: a synthetic canon holding one tagged entry, one untagged legacy entry, one entry with a malformed tag line, one whose title contains `||` and backticks (the live L15 shape), and one whose title contains a fence-closing sequence (the refusal case).

## Guarantee audit (P0)

- **"The committed `docs/lessons-index.md` equals what the core recomputes from canon"** → **FLOOR** (enum-regex, `pharn/ARCHITECTURE.md §2` primitive #3 applied to generated output as byte-equality): `check-lessons-index.mjs`, wired into `docs:check` → `npm run check`.
- **"The index is TRUE / complete / the tags describe the lessons"** → **ADVISORY.** Byte-equality is _consistency, not correctness_ — a wrong parser regenerates cleanly and stays GREEN (the identical caveat `check-capability-catalog.mjs` states). Inherits #114's named residual: **"the entry is typed `floor`" never means "the entry is about the floor."**
- **"Every `applied_lessons` id resolves to a real lesson heading"** → **FLOOR, and UNCHANGED.** `check-plan-lessons.mjs` and its canon-path argument are not touched; the floor keeps verifying the PLAN against `lessons-learned.md` itself, never against the derived index.
- **"The sweep selects the RIGHT candidates from the index"** → **ADVISORY.** It was model judgment before this increment and stays model judgment; the index changes what the model reads first, not who decides.
- **"`~<tokens>` is the entry's token count"** → **ADVISORY estimate** (`ceil(chars / CHARS_PER_TOKEN)`, a named constant = 4). Precedent and reason: `LIMITS.md §1c` — a static token figure is an estimate with a confidence band, never a measured cost. Rendered with a leading `~` so the column never reads as a measurement.
- **"The generator never fails on an untagged legacy entry"** → **FLOOR** (regex: the tag line is optional; absent/malformed → the literal `-`), pinned by a test over the live L1–L17 shape.
- **"A canon title can never escape the fenced block or forge a finding template"** → **FLOOR** (regex refusal, fail-closed): the core **throws** on a title containing a fence-closing sequence or a control char — refusal, not sanitization (the `SAFE_BASENAME` precedent in `capability-catalog-core.mjs`).
- **STRUCK — never write these.** "The index is adopted, therefore the relevant lessons were read" and "the sweep no longer reads canon." The rewritten sweep still fetches **every candidate's full entry** from canon before declaring; the only text that goes unread is that of entries the model did **not** select — and that reduction is advisory, not a guarantee. Nothing here makes an unread lesson safe.
- **`/pharn-dev-plan`'s act of consulting the index** → **ADVISORY orchestration** (the two clocks). Nothing on the floor forces the command's prose to read either file.

## Trust audit (P2)

- **Input: `.dev/memory-bank/lessons-learned.md` — `trust: untrusted` DATA** (memory-bank poisoning, `THREAT-MODEL.md §2.3` — the worst persistence vector: write-once, influence-forever).
- **Taint propagates into the `title` column and nowhere else.** Titles are canon free text; they are copied through **verbatim as DATA**, rendered inside a fenced block, and never interpreted. No decision — in the generator, the checker, or the sweep's floor step — reads the title column.
- **The floor-verifiable columns are enum/regex-gated before use** (fix #1, `pharn/ARCHITECTURE.md §8`): `id` from `^## L(\d+)` heading membership; `type` by **exact** `TYPE_ENUM` array membership; each `concept` by a control-char guard **composed with** `^[a-z0-9-]+$` (guard first — L14); `date` by `^\d{4}-\d{2}-\d{2}$`. Anything failing its gate degrades to the literal `-`; **a non-member value is never laundered into a typed column.**
- **Two named fence-escape / laundering vectors, both closed by refusal:** a title carrying a fence-closing sequence would break out of the `text` block into live markdown → **throw**; and because `docs/` is on `validate.mjs`'s scanned surface (L10), a canon pair of titles supplying `rule_id:` and `problem:` could otherwise trip CHECK 5 and RED the floor for a reason unrelated to the user's code → the row format renders neither key, pinned by a test.
- **Residual, named not hidden:** the index is read by an LLM stage (the sweep). Instruction-looking text inside a title reaches that context as quoted data — the standing `LIMITS.md §2` residual, unchanged and **not widened**: canon already reached the same stage in full before this increment, and no guaranteed decision rests on the index.

## Determinism audit (P5)

- **Enumeration** = `^## L(\d+)` heading membership over canon (the `check-plan-lessons.mjs:66` discipline), never a substring scan.
- **Tag extraction** = fixed position (first non-empty line after the heading) + exact grammar match — a membership test on a structured location (L6), never a search through the entry body.
- **Ordering** = numeric id ascending — a total order, independent of file order.
- **No timestamps anywhere** → two runs render byte-identical output (the precondition byte-equality depends on).
- **Fail-closed branches:** duplicate id → throw; unreadable/absent canon → throw (never a plausible-looking empty index); unsafe title → throw. Every unresolvable-but-benign field → the literal `-`, never a guess.
- **Keyed lookups** use `Map` / `Object.hasOwn` (L15) — never `obj[key] || fallback`.
- **The command's branch** on `check-lessons-index.mjs` is its **exit code** only; the checker owns the verdict.

## Open questions (HALT)

Both blocking questions were **resolved by the human at the Step-1 halt** and are recorded here for the audit trail:

1. **Row format** (live `## L15`'s title contains `||` and backticks, so the specified pipe row cannot be a GFM table) → **RESOLVED: pipe rows inside a ```text fence.** Pipes and backticks are inert inside a fence; no table reflow, no MD055/056, titles verbatim.
2. **Does the product `/pharn-plan` sweep get rewritten too?** → **RESOLVED: dev-only.** `/pharn-plan` is untouched; no `SKILLS_VERSION` bump; `product-lessons-index` is the named follow-up.

**Reported for a human, not fixed here (P6/P7 — surfaced, not guessed):**

1. **`pharn/ARCHITECTURE.md §5` amendment** — see "Deliberately NOT in scope". Human-only; the agent cannot and does not write it.
2. **A live canon data anomaly.** `## L10` (`:272-292`) carries **no** `**Provenance.**` block, while `## L11` (`:294-327`) carries **two** — the second block (`:321-327`, `feature: product-pipeline-probe`, `promoted: 2026-06-30`) is L10's, orphaned under L11. Consequence on first generation: **L10's date column renders `-`** and L11's renders `2026-07-01`. That is the designed graceful degradation working, not a generator bug. Fixing canon is a **gated** `/pharn-dev-memory-promote`-class write and is deliberately **not** in this increment's `## Files` (P7 — no speculative repair of a file this increment only reads).
3. **Expected first-generation output, stated so it is not mistaken for a defect:** all 17 rows render `-` for `type` **and** `concepts`, because no entry promoted before #114 carries a tag line. The index's typed columns become useful only as new entries land (or if a separate increment retro-tags canon).

## Follow-ups this increment deliberately does not do (P7)

- `product-lessons-index` — the product-side generator + the `/pharn-plan` sweep rewrite (bumps `SKILLS_VERSION`).
- `lessons-index-downstream-reads` — the addressability payoff: let `build` / `verify` / `regress` / `review` consult the index instead of carrying hardwired L-citations in prose (e.g. `pharn-dev-build.md:70`). New read surface; out of scope here.
- `retro-tag-legacy-lessons` — retro-tag L1–L17 with `type`/`concepts` through the gated promote path.
- `lesson-tagline-render-check` — the residual #114 already names: nothing re-checks the RENDERED canon tag line. This increment's parser is the first consumer that would silently see a malformed one as `-`, which strengthens the case for that checker without being it.
