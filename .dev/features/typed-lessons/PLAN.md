# PLAN — typed-lessons (a closed `type` enum + a `concepts[]` tag list on memory-bank lesson entries)

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4 (sha256 of pharn/ARCHITECTURE.md, read live this run)
- applied_lessons: [L1, L2, L3, L6, L7, L14]
- increment: Add two required, floor-checked fields — a closed `type` enum and an open-vocabulary `concepts[]` tag list — to the memory-bank promotion candidate, and define the rendered tag line's exact grammar as a structured location below each lesson heading.
- layer(s): build apparatus (`.dev/floor/`, `.claude/commands/pharn-dev-*`) + one product-floor TEST file — no product-surface bytes change
- constitution_refs: [P0, P2, P3, P4, P5, P6, P7]
- skills_version_bump: none — every written path is apparatus (`.dev/**`), a `pharn-dev-*` command, a `*.test.*` file, or repo-meta; per CLAUDE.md "SKILLS_VERSION discipline" none of those are the product surface

## Applied lessons

- **L1** — the meta-doc sweep ran and its results are named in `## Files`: `CHANGELOG.md` (`[Unreleased]`), `CLAUDE.md:109` (the candidate-validation description asserts the checked field set), the promote command's frontmatter `description` (it enumerates the candidate shape), and `check-provenance.mjs`'s own header comment block (`:20-28` currently states the verdict ranges ONLY over target/provenance/id — that sentence becomes false).
- **L2** — the P0 honesty does not stay in this PLAN: the sharpened split (floor = the CANDIDATE's field shape; advisory = the field VALUES _and_ the RENDERED line) is written into `pharn-dev-memory-promote.md`'s own `## Guarantee audit (P0)` and into `check-provenance.mjs`'s header, because the PLAN is ephemeral and those two artifacts are durable. Every "enforced by" phrase in them cites a floor op verified live this run (`check-provenance.mjs` read at `:33-153`, the fix #7 setter run at Step 0).
- **L3** — making a declarative field load-bearing forces a re-audit of every EXISTING declaration of it. The existing declarations are the 17 legacy entries L1–L17, none of which carries a tag line. That audit is Open question **Q2** (not a silent decision), and the recommended answer keys the checker on `candidate.json` only — so no legacy entry is retro-invalidated (the inverse of L3's too-narrow-friction failure).
- **L6** — the tag line is a DEFINED STRUCTURED LOCATION with a fixed grammar at a fixed position (first non-empty line after the `## L<n> — <title>` heading), specified in the promote command as part of the entry contract, so the upcoming lessons-index generator reads a declaration — never a substring grep over prose. A `type:` string in a lesson BODY is DATA about typing, not a declaration of it.
- **L7** — `## Files` declares exactly what `/pharn-dev-build` writes and deliberately EXCLUDES `.dev/memory-bank/lessons-learned.md`: a stage that merely changes the entry CONTRACT must not hold write-scope to canon. If Q2 resolves to a backfill, that backfill runs as separate gated `/pharn-dev-memory-promote` invocations — never as a build write.
- **L14** — the two new checks COMPOSE with the existing target/provenance/id checks rather than replacing them (the heading regex in `check-plan-lessons.mjs:66` is byte-untouched, with a regression test proving it). And L14's own newline trap bites directly here: JS `$` without the `m` flag matches before a single trailing newline, so a bare shape regex would accept `"floor\n"` as a concept. The concept check is therefore guard-first — a control-char/length precondition runs BEFORE the anchored shape regex — with a dedicated trailing-newline test.

## Files

- `.dev/floor/check-provenance.mjs` — add `TYPE_ENUM` + `CONCEPT_RE` + `CONCEPTS_MIN/MAX` + a `cleanScalar` guard as file-top constants (house pattern, `:37-40`); add check (4) `type` enum-membership and check (5) `concepts` array/count/shape; rewrite the header comment block `:20-28` so the stated verdict range includes the two new fields — layer: build apparatus
- `.dev/floor/check-provenance.test.mjs` — extend the shared `VALID` fixture with the two required fields (mandatory: without it every existing case would flip RED — see "A brief-vs-reality correction" below) and add the new RED/GREEN cases — layer: build apparatus (test)
- `.claude/commands/pharn-dev-memory-promote.md` — frontmatter `description` (candidate shape); a new `## The lesson-entry tag line (the entry contract)` section defining the grammar; Step 2's `candidate.json` template; Step 6's rendered-entry instruction; two lines in `## Guarantee audit (P0)` — layer: build apparatus (command)
- `pharn/floor/check-plan-lessons.test.mjs` — one regression case: a lessons file whose entries carry a tag line below the heading still resolves cited ids GREEN (the heading parse is unaffected) — layer: product floor (TEST only; the checker itself is byte-untouched)
- `CHANGELOG.md` — an `[Unreleased] → Added` entry, explicitly recording **no `SKILLS_VERSION` bump** and why — layer: repo-meta
- `CLAUDE.md` — line 109's candidate-validation description gains the two new checked fields — layer: repo-meta

Deliberately NOT written: `.dev/memory-bank/lessons-learned.md` (L7 — canon is writable only through `/pharn-dev-memory-promote`), `pharn/floor/check-plan-lessons.mjs` (the heading contract is untouchable), and the four trusted docs (hook-denied, fix #2).

## The tag-line grammar (the defined structured location — L6)

The first **non-empty** line after a `## L<n> — <title>` heading MUST be exactly:

```text
type: <member> · concepts: [<c1>, <c2>, …]
```

- the literal `type:` plus one space, then one `TYPE_ENUM` member;
- the separator is space + U+00B7 MIDDLE DOT + space (`·`) — existing house vocabulary (the `/pharn-ship` seal renders `· attested by <name>`);
- the literal `concepts: [`, then 1–6 concepts separated by a comma plus one space, then `]`;
- the line sits ABOVE the entry's `**Lesson.**` paragraph and never inside it.

Recognizer (for the upcoming index generator; defined here, **not implemented** this increment — P7):

```text
/^type: (process|contract|floor|scoping|tooling|eval) · concepts: \[[a-z0-9-]+(?:, [a-z0-9-]+)*\]$/
```

## Field contract (`candidate.json`)

- `type` — **required**, a string, member of `TYPE_ENUM` (Q1 below ratifies the members). Checked by `Array.prototype.includes` over a literal array, so a trailing-newline value (`"floor\n"`) is a non-member by construction — no newline trap here.
- `concepts` — **required**, an array of 1–6 strings. Each item must pass the guard-first pair: `cleanScalar(v, 32)` (a string, no control characters incl. `\r`/`\n`, length 1–32) **then** the anchored shape regex for lowercase alphanumerics and hyphens. Duplicates are RED (a duplicate tag is meaningless and would otherwise let one tag consume the 6-slot budget). Vocabulary is **open** — shape-checked, never enum-checked.

## Contracts satisfied

- `pharn/ARCHITECTURE.md §5` (State — "Promotion … is a **gated** action with **provenance per entry**") — cited, not restated (P4). This increment widens the _validated candidate shape_, which is the same axis of change `check-provenance.mjs` already owns (P3: one reason to change).
- `pharn/ARCHITECTURE.md §2` primitive #3 (enum / regex) — the two new checks are set-membership and pattern-match, nothing else.

## Evals to write (P1)

No file in this increment carries a `role:` frontmatter key, so no Capability is added and P1's `evals/` requirement does not attach (verified live: `pharn-dev-memory-promote.md` declares `kind`/`trust`/`model_tier` but no `role:`, so `pharn/floor/validate.mjs` and the capability catalog both skip it). The equivalent regression surface is the `node --test` suites:

- `check-provenance.test.mjs` → GREEN: a candidate with a valid `type` + 1..6 well-shaped `concepts` exits 0.
- `check-provenance.test.mjs` → RED, one case each: `type` missing · `type` not a member (`"security"`) · `type` non-string · `concepts` missing · `concepts` not an array · `concepts` empty (`[]`) · `concepts` with 7 items · a concept with an illegal character (`"Enum_Gate"`) · **a concept with a trailing newline (`"enum-gate\n"`) — the L14 guard-first witness** · a concept exceeding 32 chars · duplicate concepts.
- `check-provenance.test.mjs` → the existing ★ P2 case (a needle in `title`/`body`) stays GREEN, re-proving the verdict never reads free text now that two more enum-gated fields exist.
- `check-plan-lessons.test.mjs` → GREEN: a lessons file whose `## L1`/`## L2` entries each carry a tag line still resolves `[L1, L2]`, naming both — the heading contract is unaffected.

## Guarantee audit (P0)

- "No promotion **candidate** reaches the Step-5 human gate without an enum-member `type` and a well-shaped `concepts` array" → **FLOOR** (enum-regex, primitive #3 — `check-provenance.mjs`, which `/pharn-dev-memory-promote` Step 3 runs before any write).
- "The lesson-heading contract (`HEADING_RE`, a `##` heading naming `L<n>` followed by a space) is unaffected by the tag line" → **FLOOR** (regex — `check-plan-lessons.mjs:66` is byte-unchanged, witnessed by the new regression test).
- "The concept shape check cannot be defeated by a trailing newline" → **FLOOR** (the control-char guard runs before the anchored regex — L14), witnessed by a dedicated test.
- "The **values** of `type` and `concepts` are correct — the entry really _is_ about the floor" → **ADVISORY.** They are model-drafted and human-ratified at the Step-5 accept/deny gate. Any downstream selection keyed on `type` is therefore **advisory-grade context selection, never a guarantee**: _"the entry is typed `floor`" must never read as "the entry is about the floor."_
- "The **rendered canon entry** carries a conforming tag line" → **ADVISORY, and named as a residual.** The floor validates `candidate.json` at Step 3; the entry is rendered at Step 6, after the gate. Step 6 is therefore instructed to substitute the two **already-validated** fields into a fixed template rather than compose the line freely — which narrows the gap but does not close it (a model can still mis-render). Closing it needs a checker that reads canon _after_ the write; that belongs with the lessons-index generator that will consume the line, and is named as the follow-up **`lesson-tagline-render-check`** (P7 — not built speculatively here).
- "Typed entries make plan-stage candidate selection a membership test" → **ADVISORY, and NOT delivered by this increment.** This increment adds the _address_; no consumer reads it yet. Both plan stages' lessons sweeps still read all lessons' full text. Do not write that this increment made selection deterministic.

## Trust audit (P2)

- **Input.** `type` and `concepts` are drafted by the model from the same untrusted surfacing artifact (`REVIEW.md` free-text) as `title`/`body`. They enter as **untrusted** proposals.
- **Laundering risk, and why it is closed.** These two fields are _promoted into the enum-gated class_ — which is exactly the laundering vector the finding-shape split exists to stop. The closure is that neither field is free text: `type` must be an exact member of a 6-element literal array, and every `concepts` item must survive a control-char guard plus an anchored `[a-z0-9-]` shape. An instruction-looking needle cannot satisfy either grammar, so it becomes a loud RED rather than a trusted-looking value. The existing ★ needle-in-body test is retained to prove `title`/`body` remain outside the verdict.
- **Propagation.** The rendered tag line lands in canon as human-readable DATA. A future index generator keyed on it performs **advisory context selection** — never a guaranteed gate — so no guaranteed decision comes to rest on a model-drafted tag.

## Determinism audit (P5)

- Every new branch is a membership test (`TYPE_ENUM.includes`), a count comparison (`1 ≤ length ≤ 6`), or a regex — no LLM classification.
- The terminal fallback on any non-member/misshapen value is a loud RED naming the offending field, never a guess or a coercion.
- The two genuinely irreducible choices — which members the enum holds, and what happens to the 17 legacy entries — are **not decided by the model**: they are the halt questions below (P5's terminal "ask").

## Corpus validation of the `type` enum (the ratification table — Q1)

Every one of L1–L17 read live this run and mapped to a member. The starting proposal was `process | contract | floor | scoping | tooling`.

| id  | lesson (gist)                                                        | type       |
| --- | -------------------------------------------------------------------- | ---------- |
| L1  | `/plan` must scope the meta-docs an increment invalidates            | `process`  |
| L2  | a contract's honesty must travel with the artifact                   | `contract` |
| L3  | making a declarative field load-bearing → re-audit every decl.       | `scoping`  |
| L4  | an authored fixture passes by construction; measure live             | **misfit** |
| L5  | a floor verdict is only as good as its input capture                 | `tooling`  |
| L6  | membership is read from the structured location, never grepped       | `floor`    |
| L7  | a stage's `writes:` must equal exactly what it writes                | `scoping`  |
| L8  | the setter resolves one `--target` → favor single-file outputs       | `scoping`  |
| L9  | an increment's own markdown style is gated by neither stage          | `process`  |
| L10 | product artifacts sit on the validate-scanned surface; `.dev/` not   | `floor`    |
| L11 | verify's whole-repo style gates block every later feature            | `process`  |
| L12 | prevent style misses at BUILD, don't only detect at verify           | `process`  |
| L13 | extend the Step-2b format discipline to every artifact stage         | `process`  |
| L14 | a shape-regex tightening must COMPOSE with the control-char guard    | `floor`    |
| L15 | index an arbitrary key with an own-property test, never `\|\|`/`??`  | `floor`    |
| L16 | `xargs -a` is GNU-only; the remedy is itself an input surface        | `tooling`  |
| L17 | `check-regress scope` tests changed-since-base, not written-by-build | `scoping`  |

**Counts under the 5-member proposal:** `process` 5 · `scoping` 4 · `floor` 4 · `tooling` 2 · `contract` 1 · **unassigned 1 (L4)**.

**The two misfits the brief named, resolved against the corpus:**

- `injection` — **0 instances** across L1–L17. Keeping it would be a speculative addition with no triggering failure → **drop** (P7).
- **L4** fits no member. Its subject is the eval/measurement layer specifically ("an authored fixture proves the CHECK is shaped right, never that the live capability satisfies it"); forcing it into `process` would make the tag a lie, which is the exact failure mode the ADVISORY label above warns about. → **add `eval`** (1 instance, a real trigger — so not speculative).

**Recommended enum (6 members, every member backed by ≥1 real corpus instance):**

```text
process | contract | floor | scoping | tooling | eval
```

Axis distinctions, so the members stay decidable: `process` = pipeline-stage discipline · `floor` = floor-checker implementation discipline · `scoping` = the `writes:`/writes-scope subsystem · `tooling` = the shell/harness/portability layer · `contract` = contract-document honesty · `eval` = the eval/measurement layer.

## A brief-vs-reality correction (P6 — surfaced, not silently absorbed)

The increment brief asks for "plus the existing suite untouched". That is not literally achievable: the tests share one `VALID` candidate fixture (`check-provenance.test.mjs:24-35`), so making `type`/`concepts` **required** flips every existing case RED unless `VALID` gains the two fields. The plan's reading: every existing **assertion and behavioral case survives byte-for-byte**; only the shared fixture gains two lines. If the intent was instead that the fields be OPTIONAL (validated only when present), say so at the halt — that is a different increment with a materially weaker floor.

## Open questions (HALT) — all three RESOLVED by the human at this plan's halt

1. **Q1 — the `type` enum: RATIFIED as the 6-member set** `process | contract | floor | scoping | tooling | eval`. `injection` is **dropped** (0 instances across L1–L17 — a speculative addition under P7); `eval` is **added** for L4, whose subject is the eval/measurement layer and which no other member fits. Every member is backed by ≥1 real corpus instance. The human ratified via the mapping table above, not by trust.
2. **Q2 — legacy L1–L17: LEAVE UNTAGGED.** The checker keys on `candidate.json` and **never scans canon**, so the two fields are required of **NEW candidates only** and no existing entry is retro-invalidated (this is the L3 re-audit, resolved in the direction that avoids L3's retrofitting friction). Consequence to carry forward, stated not hidden: the corpus will be **mixed** — the upcoming lessons-index generator MUST tolerate untagged entries, and any `type`-keyed selection over canon is incomplete by construction until/unless a backfill happens. A backfill remains possible later as separate gated `/pharn-dev-memory-promote` runs; it is **not** in this increment's `## Files` (L7).
3. **Q3 — field strength: REQUIRED.** `type` and `concepts` are mandatory on every new candidate. The shared `VALID` fixture in `check-provenance.test.mjs` gains two lines; every existing assertion and behavioral case survives byte-for-byte. The OPTIONAL variant was rejected as a materially weaker floor.
