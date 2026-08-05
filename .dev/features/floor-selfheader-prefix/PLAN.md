# PLAN — prefix abbreviated `floor/` self-headers with `pharn/`

- spec_content_hash: 0d0dc6da61c4de6748aeab849ed1a4ecd9ff7f1d61e91d5848d7ffdaf022733d # fix #4 (sha256 of pharn/ARCHITECTURE.md)
- increment: Rewrite the abbreviated bare `floor/<basename>` location references in `pharn/floor/`'s
  comment headers, sibling cross-refs, and usage strings to the actual path `pharn/floor/<basename>`,
  under an existence-gated + comment/usage-only rule that structurally cannot touch the test mock-path
  data that must stay bare.
- layer(s): none — `pharn/floor/` is the deterministic floor (`pharn/ARCHITECTURE.md §2`), not a
  capability module in the `§4` layer tree. No `role:` frontmatter is added, so no capability is created.
- constitution_refs: [P0, P5, P6, P7]

## Context (live state, read this run — P6)

- Branch `chore/floor-selfheader-prefix`, cut from the **open** PR #110 head
  (`chore/floor-selfpath-correction`, 2 commits ahead of `origin/main`). #110 is NOT merged, so per the
  task's SEQUENCING rule this branches off it to avoid colliding on `SKILLS_VERSION` / CHANGELOG.
- `SKILLS_VERSION` = `1.1.2` (bumped by #110). `CHANGELOG.md` `[Unreleased] → ### Fixed` already holds
  #110's two entries.
- `pharn/floor/check-variance.mjs` **does not exist**; the file lives at `.dev/floor/check-variance.mjs`.
  Every `floor/check-variance.mjs` cross-ref is therefore an existence-gate SKIP (a dangling ref — a
  separate concern, deliberately left).
- `pharn/floor/validate.mjs` already carries the corrected `pharn/floor/` self-header (fixed by #110);
  its `EXCLUDE_SEGMENTS` are `.claude/commands`, `.dev/`, `pharn/floor/`.
- `pharn/floor/test-fixtures/` contains **zero** bare `floor/` occurrences.

## The rewrite rule (all four conditions required; 1 and 3 deterministic, 2 and 4 judgment)

Rewrite `floor/<B>` → `pharn/floor/<B>` **only** where all hold:

1. `pharn/floor/<B>` exists as a real file (**deterministic** — file-existence membership test, P5);
2. the occurrence is inside a `//` comment **or** a `console.log`/`console.error` usage string — never a
   test string-literal / assertion / `run()` argument (**judgment**);
3. `floor/` is bare — the preceding char is not `/`, `.`, or a letter (**deterministic** — regex char
   class; this alone protects `pharn/floor/`, `.dev/floor/`, and `floor-ignored`);
4. it is a **location / invocation** reference — self-header, sibling cross-ref, usage example — not a
   historical or semantic mention of an old convention (**judgment**).

Because conditions 2 and 4 are irreducibly judgment, this is executed as **targeted per-file edits, never
a regex sweep over the tree** (P5: judgment may not drive a gate; it drives an advisory edit whose
backstop is `npm test` + the verification grep below).

## Files

23 token rewrites across 6 product-floor checkers, 6 test-header rewrites, 2 meta files. **14 files total.**
`pharn/floor/README.md` is **excluded** — see "Human decision at GATE 1" below.

**Product-floor checkers (`pharn/floor/*.mjs`) — bump-triggering (shipped bytes):**

- `pharn/floor/check-ship.mjs` — L2 self-header, L5 ×2 (`check-verify`, `check-regress`), L46 usage comment — 4 rewrites — floor
- `pharn/floor/check-loop.mjs` — L2 self-header, L65 usage comment — 2 rewrites — floor
- `pharn/floor/check-regress.mjs` — L2, L5 ×1 (`check-structural`), L41, L42 usage comments — 4 rewrites — floor
- `pharn/floor/check-build-complete.mjs` — L2, L5 ×2 (`check-verify`, `check-regress`), L43 — 4 rewrites — floor
- `pharn/floor/check-structural.mjs` — L2, L22, **L167 (operative `console.log` usage string)** — 3 rewrites — floor
- `pharn/floor/check-verify.mjs` — L2, L5 ×2 (`check-regress`, `check-structural`), L38, L61, L64 — 6 rewrites — floor

**Test line-1 headers only (apparatus — never shipped, non-bumping):**

- `pharn/floor/check-ship.test.mjs` — L1 header only — apparatus
- `pharn/floor/check-loop.test.mjs` — L1 header only — apparatus
- `pharn/floor/check-regress.test.mjs` — L1 header only — apparatus
- `pharn/floor/check-build-complete.test.mjs` — L1 header only — apparatus
- `pharn/floor/check-structural.test.mjs` — L1 header only — apparatus
- `pharn/floor/check-verify.test.mjs` — L1 header only — apparatus

**Meta:**

- `SKILLS_VERSION` — `1.1.2` → `1.1.3` — meta
- `CHANGELOG.md` — one `### Fixed` entry under `[Unreleased]` — meta

## Human decision at GATE 1 — `pharn/floor/README.md` excluded entirely

The plan as first drafted included `pharn/floor/README.md` L21 and L40 and asked whether L25 (a bare
**directory** reference the `floor/<B>` rule does not match) should join them. The human's decision:
**drop all three sites — the README leaves this PR whole.**

Rationale, recorded verbatim in substance: this increment normalizes **checker self-headers**; the README
is a doc and a separate concern, and L25 is not a prefix fix. Its exclusion prose ``(`.claude/commands/`,
`floor/`)`` both **omits `.dev/`** and abbreviates `pharn/floor/`, while the live `EXCLUDE_SEGMENTS`
(`validate.mjs:41–42`) is `.dev/` **and** `pharn/floor/` — and `validate.mjs:21`'s own comment is
_separately_ incomplete (it omits `pharn/floor/`). The accurate fix is a **content pass** aligning both the
README and `validate.mjs:21` to list all three segments; a one-token L25 rewrite would leave the prose
still wrong. Fixing L21/L40 here but not L25 is the incoherent half — **all three leave together.**

Routed to a separate **"`pharn/floor/README.md` accuracy"** feature: L16, L21, L25, L40, L77, the stale
`/plan` `/build` `/review` command names, the missing `.dev/` in the exclusion prose, and alignment with
`validate.mjs:21` — corrected as one coherent unit.

**No effect on the bump:** the README was never a bump driver. `SKILLS_VERSION` `1.1.2` → `1.1.3` remains
driven solely by the 6 non-test product-floor checkers.

## LEAVE-SET — explicitly untouched (this is why a sweep would break the build)

- **A) Bare `floor/` as mock-path DATA in test string-literals** — expected values a checker echoes back
  verbatim; rewriting inverts the assertion. Blocked by condition 2:
  `check-regress.test.mjs` L37, L39, L41, L49, L69, L72, L77, L87, L96, L98, L137, L144;
  `check-loop.test.mjs` L63; `check-ship.test.mjs` L51.
  _(Live grep found L37/39/41/96/98 in addition to the task's enumeration — same class, same disposition.
  Note `floor/evil.mjs` and `floor/x.test.mjs` are also existence-gate skips, but `floor/validate.test.mjs`,
  `floor/check-regress.mjs`, and `floor/*.test.mjs` **do** exist, so **only condition 2 protects them**.)_
- **B) Historical/semantic mention** — `validate.test.mjs:61` (``// old per-folder `floor/` special-case``)
  describes a superseded convention, not this file's location. Blocked by condition 4.
- **C) Existence-gate skips (dangling refs, a separate concern)** — every `floor/check-variance.mjs`
  cross-ref in `check-ship.mjs:5`, `check-regress.mjs:5`, `check-verify.mjs:5`. Blocked by condition 1.
- **D) Already-correct / non-matching** — anything already `pharn/floor/` or `.dev/floor/`, and the bare
  word "floor" (no slash) meaning the concept, including `floor-ignored`.

## Contracts satisfied

- None. This increment adds no capability, no contract, and no `enforces` binding. It edits comment and
  usage text in existing floor checkers plus two version/changelog meta files.

## Evals to write (P1)

- **None required, and this is not an exemption.** P1 binds _Capabilities_ (files whose frontmatter carries
  a `role:`) and every `rule_id` in an `enforces` field. This increment creates neither, and adds no
  `rule_id`. The existing `node --test` suites over the six touched checkers are the regression suite here.

## Guarantee audit (P0)

- **"The LEAVE-SET test data was not mutated"** → **FLOOR: enum/regex** (`pharn/ARCHITECTURE.md §2`
  primitive #3). Those literals are asserted **exactly** (`assert.deepEqual(o.outside_tests,
["floor/validate.test.mjs"])`, `o.findings[0].file === "floor/evil.mjs"`, `o.inside ===
["floor/check-regress.mjs"]`, …), so any wrong rewrite of them fails `npm test` immediately. This is the
  increment's principal risk and it is genuinely floor-backed.
- **"Every surviving bare `floor/` under `pharn/floor/` is a LEAVE-SET item"** → **FLOOR: regex**, but
  **run manually, not wired** — the verification grep below is deterministic yet is not a CI gate. Honest
  label: deterministic check, manual invocation.
- **"`npm run docs:check` stays GREEN"** → **FLOOR: content-hash** (byte-equality, wired in `npm run check`
  - CI). The generated inventory renders checker _filenames_, not their comments, so no regeneration is
    expected — but the gate, not this sentence, decides.
- **"No control flow or filesystem path changes"** → **ADVISORY.** Backstopped by `npm test` for tested
  paths. Grounding read this run: the rewritten sites occur only in comments and in printed usage text,
  never in an `fs` call; the checkers that need their own location resolve it via
  `dirname(fileURLToPath(import.meta.url))`, not from these strings.
- **"`check-structural.mjs:167`'s rewritten usage text is correct"** → **ADVISORY, and UNGUARDED — a named
  residual.** Verified live: `check-structural.test.mjs` contains **zero** tests exercising the no-args
  path (no `run([])` call, no `usage` assertion), so `npm test` cannot catch a botched rewrite of this one
  operative line. **This corrects the task brief**, which states `npm test` "genuinely covers the risk" —
  that holds for the LEAVE-SET (above), but **not** for this line. It is the same unguarded class as
  PR #110's usage strings, narrowed from five sites to one.
- **"`SKILLS_VERSION` was bumped because product-surface bytes changed"** → **ADVISORY** (CLAUDE.md
  § _SKILLS_VERSION discipline_). No checker enforces the bump; it is discipline, not floor.
- **"Header now equals actual location"** → **ADVISORY** (legibility). It was never misdirecting — there is
  no `floor/` at repo root — so nothing was broken; this buys accuracy, not a fixed defect (P7 honesty).

## Trust audit (P2)

No untrusted artifact is ingested. Every file read and written is this repo's own source (trusted), and
the increment produces no finding objects and no free-text field derived from external input. Taint
propagation: **N/A**.

## Determinism audit (P5)

- Conditions **1** (file existence) and **3** (preceding-char regex class) are deterministic membership
  tests and do the bulk of the protection work — condition 3 alone shields `pharn/floor/`, `.dev/floor/`,
  and `floor-ignored`; condition 1 alone shields `check-variance`.
- Conditions **2** and **4** are **irreducibly judgment** and are stated as such. They gate no guarantee:
  they drive an advisory edit, backstopped by the exact-string test assertions (floor) and the grep.
- Fallback on any ambiguous site → **ask the human** (see Open questions), never guess.

## Verification (to run at `/pharn-dev-build` and `/pharn-dev-verify`)

1. `npm test` — GREEN. Guards the LEAVE-SET exactly; does **not** guard `check-structural.mjs:167`.
2. `npm run check` — format, lint, lint:md, docs:check, test.
3. `grep -naE '(^|[^/A-Za-z.])floor/(check|scan|count|validate|merge)' pharn/floor` — every surviving hit
   must be a LEAVE-SET item (test mock data, the historical mention, a `check-variance` dangling ref) **or a
   `pharn/floor/README.md` line deferred to the separate accuracy feature (L21, L25, L40)**; **no checker's
   own header may survive**.
4. `git diff --stat` — confirm no file outside the `## Files` list changed.

## Out of scope (surfaced, deliberately not folded in — P7)

Real but separate; each would be its own increment.

**Routed to the separate "`pharn/floor/README.md` accuracy" feature (human decision at GATE 1):**

- L16 — `../.claude/hooks/protect-trusted-paths.cjs` resolves from `pharn/floor/` to `pharn/.claude/…`,
  which does not exist; it needs `../../`. A stale relative path, not a `floor/` token.
- L21, L40 — `node floor/validate.mjs`, `node floor/check-structural.mjs` invocation examples.
- L25 — the exclusion prose ``(`.claude/commands/`, `floor/`)``: omits `.dev/` **and** abbreviates
  `pharn/floor/`. Needs a content fix, not a prefix fix.
- L77 — `pharn-core/rules/x.md` in the hook self-test example; the tree is now `pharn/pharn-core/`.
- L9, L26, L55, L85 — `/plan`, `/build`, `/review` are pre-split names; apparatus commands are `/pharn-dev-*`.
- L8 — "The floor is three files" versus the 40+ checkers now resident here.
- **`pharn/floor/validate.mjs:21`** — its own comment ("does NOT validate this repo's own tooling
  (`.claude/commands`, `.dev/`)") omits `pharn/floor/`, which **is** in `EXCLUDE_SEGMENTS` (L42). Aligning
  this with the README is the point of treating them as one unit. _(Note: this file is a product-floor
  checker, so that feature will carry its own `SKILLS_VERSION` bump.)_

**Other:**

- `.claude/commands/pharn-dev-verify.md:2` — `floor/validate` (no extension) in the description; an
  existence-gate skip, and a `pharn-dev-*` command is apparatus, so it would not bump.
- The `floor/check-variance.mjs` dangling cross-refs (LEAVE-SET C).

## Open questions (HALT) — both RESOLVED at GATE 1

1. ~~**`pharn/floor/README.md:25`** — fix the bare-directory reference or leave it?~~ **RESOLVED:** the
   README leaves this PR **entirely** (L21, L25, L40 all drop), routed to a separate accuracy feature. See
   "Human decision at GATE 1" above.
2. ~~**Test-file line-1 headers** — header line only?~~ **RESOLVED: confirmed, L1 only.** Exactly 6
   rewrites, one per test file. Every other bare `floor/` in those files is mock-path DATA the checker
   echoes back verbatim — rewriting it inverts the assertion. `floor/validate.test.mjs`,
   `floor/check-regress.mjs`, and `floor/*.test.mjs` in those lines **do** resolve to real files, so
   existence-gating alone would wrongly rewrite them; **only condition 2 protects them.** `validate.test.mjs:61`
   (historical mention) also stays.
