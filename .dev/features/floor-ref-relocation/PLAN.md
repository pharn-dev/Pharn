# PLAN — the capability canon names the floor at its real location, and cannot silently rot there again

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4
- applied_lessons: [L1, L4, L6, L10, L12, L13, L14, L16, L18, L19, L20]
- increment: rewrite the capability canon's stale `.dev/floor/<x>` cites to `pharn/floor/<x>` under an
  existence gate, and add CHECK 8 to `pharn/floor/validate.mjs` so the class cannot recur silently.
- layer(s): pharn-contracts, pharn-core, pharn-pipeline, pharn-review (rewrite) + the product floor
  (`pharn/floor/validate.mjs`) — `pharn/ARCHITECTURE.md §4`
- constitution_refs: [P0, P3, P4, P5, P6, P7]

**Why the rewrite and the check are ONE axis, not two (P3).** Both serve the single change-reason
"canon names the floor at its real location." Shipping part A alone would be the _second_ attempt at a
discipline-only remedy — CHANGELOG 1.1.2 already fixed this relocation's self-headers by hand and the
canon bodies rotted anyway. L20 names exactly that second occurrence as the trigger to give the class
a floor check, so splitting the parts across two PRs would ship the known-insufficient half first.

## Applied lessons

- L1 — the increment changes facts asserted in meta-docs, so `CHANGELOG.md`, `SKILLS_VERSION` **and
  `CLAUDE.md`** are named in `## Files` rather than left to drift. Discovery found no sentence in
  `CLAUDE.md` that CHECK 8 falsifies (its `validate.mjs` entry states the command and its RED-exit
  contract, never the check list), so this is L1 applied in its **additive** direction — recording a
  new floor check in the doc that inventories them, resolved by the human at Q1 rather than silently.
- L4 — an authored fixture passes by construction, so CHECK 8 is not trusted on its fixtures alone: a
  mutant run (inject a twinned `.dev/floor/` cite into an otherwise-clean fixture) must make the suite
  FAIL, and reverting must make it green. Plus the two live measurements the write procedure pins —
  RED on the pre-rewrite tree, GREEN after — which is the "measure it, don't infer it" half.
- L6 — CHECK 8 pattern-matches free text, which is the shape L6 warns about. Named honestly in the
  guarantee audit rather than waved past: the fact CHECK 8 decides is itself textual ("does this file
  name a path that no longer resolves"), not a membership DECLARATION, so there is no structured
  location to read it from. The check's own verdict input — `existsSync(pharn/floor/<base>)` — is a
  filesystem membership test, and that is the part that gates.
- L10 — root `features/` sits on the validate-SCANNED surface while `.dev/` does not. CHECK 8 is
  therefore scoped POSITIVELY to the four canon dirs instead of "TARGET minus exclusions", so a user's
  own product-pipeline artifacts under `features/` can never be dragged into it.
- L12 / L13 — prevention at write time, not detection at verify: the bulk transform rewrites 153
  files, so `prettier --write` runs over exactly those paths (never repo-wide, per L19) as a
  completion step, before the floor runs.
- L14 — the anchored character class `[A-Za-z0-9._-]+` in CHECK 8's basename regex **is** this
  finding's control-char guard, composed into the shape regex rather than bolted beside it: a matched
  basename structurally cannot carry a newline, quote or control character into the free-text
  `problem` field. Raised by grill finding P2; cited here so the reduction is written down, not
  merely true.
- L16 — the transform is a Node script, not `sed`/`xargs` shell plumbing, because a remedy written for
  one platform is itself an input-capture surface. Node's `fs` + `String.replaceAll` behave identically
  on macOS and Linux; a BSD-vs-GNU `sed -i` difference would silently corrupt 153 files.
- L18 — `## Files` ends its authorized list at the `### Written via Bash` heading (structural,
  wording-independent), so the Bash-written paths listed there are NOT granted write-scope.
- L19 — the bulk rewrite and `npm run docs:generate` are Bash writes that escape fix #7 entirely. They
  are DECLARED as such in their own `### Written via Bash` subsection rather than pretended gated; the
  audit that replaces the gate is the HALT-2 diff plus CHECK 8's RED→GREEN transition.
- L20 — this increment IS L20's prescription applied. CHANGELOG 1.1.2 fixed the relocation's
  self-headers with a discipline-only remedy; the canon bodies rotted anyway. That is the second
  occurrence, which L20 names as the trigger to stop relying on discipline and give the class a floor
  check — part B. Without part B this increment would be occurrence 2 of the same discipline remedy.

## Files

- `pharn/floor/validate.mjs` — add CHECK 8 (canon cites a relocated floor file) — layer: product floor
- `pharn/floor/validate.test.mjs` — CHECK 8 fixtures: RED / F2-boundary / ghost / clean / mutant — layer: product floor
- `CHANGELOG.md` — one `[Unreleased]` entry recording both parts and the bump — layer: repo meta
- `SKILLS_VERSION` — product-surface bump `2.3.3` → `2.3.4` — layer: repo meta
- `CLAUDE.md` — record CHECK 8 in the `validate.mjs` entry (L1, resolved at Q1) — layer: repo meta

### Written via Bash (outside fix #7 — L19, declared not pretended)

These are NOT granted write-scope and must not be reached with Write/Edit. Listed so `check-regress`'s
changed-since-base scope report (L17) can be read against an approved list rather than guessed:

- `pharn/pharn-contracts/**`, `pharn/pharn-core/**`, `pharn/pharn-pipeline/**`, `pharn/pharn-review/**`
  — the existence-gated path rewrite ONLY (`.md` + `evals/expected/*.json`); no content changes.
  The transform must **`JSON.parse` every rewritten `.json`** and fail on any parse error, and must be
  **run a second time reporting 0 changed files** — the two observations that turn "deterministic" and
  "idempotent" from assertions into checks (raised by grill findings P5).
- `docs/capabilities/**`, `docs/lessons-index.md` — `npm run docs:generate` output only. **Predicted
  byte-identical** (see Q2); if either changes, HALT and explain.

### Deliberately NOT in scope

- `pharn/CONSTITUTION.md`, `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`, `LIMITS.md` — human-only, fix #2
  hook-denied. Verified live to carry **zero** `.dev/floor` mentions of any form, so nothing is owed.
- `pharn/floor/**` except `validate.mjs` / `validate.test.mjs` — holds the 6 intentional dev-refs
  (decision 1). Byte-integrity there is a verification-checklist item.
- `.dev/floor/**`, the five `scan-plan-*` scanners — F2, a separate axis and PR.
- `.claude/**`, `.github/workflows/**`, `pharn/floor/README.md`, `package.json`.

## Contracts satisfied

- `pharn/pharn-contracts/finding-shape.md` — CHECK 8 emits through `validate.mjs`'s existing
  `finding()` helper, so its `type` / `rule_id` / `severity` / `file` stay enum-gated and its `problem`
  stays free text. Cited, not restated (P4).

## Evals to write (P1)

CHECK 8 is a floor checker, not a `role:`-bearing capability — `pharn/ARCHITECTURE.md §3.1` makes a
capability a file whose frontmatter carries `role:`, and `validate.mjs` carries none (cited, not
restated — P4). So P1's `evals/cases` + `evals/expected` obligation does not attach; its equivalent is
`validate.test.mjs`, the file's existing convention for every one of CHECKs 1–7. `eval-format.md`'s
structural/semantic split likewise does not apply: every assertion below is a `node --test` exit-code
comparison, so nothing is laundered into an LLM judge. Cases, all hermetic via `withRepo`:

- canon file citing `.dev/floor/validate.mjs` (twin EXISTS) → RED, finding names the file + the twin
- canon file citing `.dev/floor/scan-plan-secrets.mjs` (NO twin) → **not flagged** — pins the F2
  boundary as deliberate (decision 4)
- canon file citing `.dev/floor/does-not-exist.mjs` (ghost, resident nowhere) → not flagged
- a twinned cite inside `pharn/floor/` → not flagged (decision 1's intentional dev-refs)
- a twinned cite in a root meta-doc (`CLAUDE.md`-shaped) → not flagged (the canon-scoping discovery)
- `evals/expected/*.json` carrying a twinned cite → RED (proves `.json` collection, not `.md`-only)
- clean canon → GREEN; plus an integration assertion that the real rewritten tree is GREEN
- mutant (L4): inject a twinned cite into a clean fixture → suite FAILS; revert → green

## Guarantee audit (P0)

- "the canon names the floor at its real location" → **FLOOR: enum/regex** (`ARCHITECTURE §2`
  primitive #3) — CHECK 8 is a literal pattern match whose verdict is gated by a filesystem
  `existsSync` membership test. No model judgment.
- "the rewrite is correct" → **ADVISORY.** The transform is a Bash-run script outside fix #7 (L19).
  What backstops it is CHECK 8 going RED before and GREEN after, plus the HALT-2 diff — not the gate.
- "CHECK 8 makes the class un-repeatable" → **FLOOR, and NARROWED.** It catches a stale cite in the
  four canon dirs only. It does NOT catch one inside `pharn/floor` (where an intentional dev-ref and a
  stale ref are byte-indistinguishable — both are `.dev/floor/<twin>`), nor in `.dev/`, `CLAUDE.md`,
  `CHANGELOG.md`, or root docs, where such cites are CORRECT today and would be false positives
  (measured: 9 in `CLAUDE.md`, 21 in `CHANGELOG.md`, 1 in `docs/lessons-index.md`). Those surfaces stay
  a manual concern, exactly as after 1.1.2. **And it is GREEN when `<TARGET>/pharn/floor/` is absent**
  — every `existsSync` is false, so nothing matches. That is correct (no floor → no twin → nothing is
  stale-by-relocation) but it IS a fail-open path, named here rather than left under the word
  "un-repeatable" (raised by grill finding P0).
- "the floor path a capability body prints will run" → **ADVISORY.** CHECK 8 proves the cited file
  EXISTS; it never runs it, never checks the arguments, and cannot know the body invokes it correctly.
- "F2's cites are not flagged" → **FLOOR** — a structural consequence of the existence gate (no twin →
  no match), pinned by a test, not a promise.

## Trust audit (P2)

CHECK 8 reads capability bodies and `evals/expected/*.json`, which are trusted `pharn-owned` product
files — not the untrusted review target. It ingests them purely as bytes for a pattern match and
never as instructions. Its output flows into `validate.mjs`'s existing finding shape: the matched
path is echoed into the free-text `problem` field only, never into an enum-gated field. The mechanism
that makes this structural rather than a promise is the anchored character class `[A-Za-z0-9._-]+` in
the basename regex (L14): it admits no newline, quote or control character, so a crafted filename
cannot launder itself into `type` / `rule_id` / `severity` — and the shape regex COMPOSES with that
guard rather than replacing it. The `file` field is a `relative(TARGET, …)` path that resolves by
construction.

## Determinism audit (P5)

Every branch is a membership test: `existsSync(<TARGET>/pharn/floor/<base>)`; the canon-dir prefix
test; `EXCLUDE_SEGMENTS.includes`; the `.md` / `.json` extension test; and the anchored basename regex
`[A-Za-z0-9._-]+\.(mjs|cjs)`. No classification, no fallback chain, so no terminal "ask" is reachable.

## Open questions (HALT) — all RESOLVED at the Step-4 gate, 2026-08-07

- **Q1 — `CLAUDE.md`.** _Resolved: **add a CHECK-8 line.**_ Discovery found no sentence it falsifies,
  but the human elected to record the new check where the floor's checks are inventoried. `CLAUDE.md`
  is repo-meta and is **not** in the bump-triggering set, so this does not change Q3's size.
- **Q2 — `docs/capabilities/` predicted NOT to change**, contradicting the build prompt. Measured: the
  catalog renders frontmatter + the H1 tagline, never bodies; canon has **zero** `.dev/floor` cites in
  frontmatter or taglines; all 37 cites in `docs/capabilities/` are the generated header naming
  `.dev/floor/gen-capability-catalog.mjs`, correctly dev-resident and twinless. _Resolved: **run
  `docs:generate` + `docs:check` anyway** and expect an empty diff — cheap, and it proves no drift
  instead of inferring it. A non-empty diff in either file is a HALT._
- **Q3 — bump size.** _Resolved: **patch, `2.3.3` → `2.3.4`.**_ Against the prompt's own test: no
  existing install newly-REDs, because CHECK 8 scans PHARN's own shipped canon — which this increment
  makes clean — and a user never authors `pharn/**`.
