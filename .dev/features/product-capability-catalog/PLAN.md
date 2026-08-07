# PLAN — product-capability-catalog (RECORDED DEFERRAL)

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4
- applied_lessons: [L1, L2, L9, L10, L11, L13, L18, L19]
- increment: Do **not** port the capability catalog to the product surface. Instead ship the **recorded
  deferral** — a named follow-up in `CLAUDE.md` plus a `CHANGELOG.md` entry stating the P7 reasoning and
  the condition that would reopen it. No floor code, no product-surface bytes, no `SKILLS_VERSION` bump.
- layer(s): none — this increment touches **no** layer of `pharn/ARCHITECTURE.md §4`. Both files are
  repo-meta (build apparatus), not the capability tree.
- constitution_refs: [P0, P5, P6, P7]

## The decision this increment records

The brief `.dev/PORT-3-capability-catalog.md` gates itself on one question: **do PHARN users author
their own `role:`-bearing capabilities?** It is the human's to answer, and it was **put to the human
explicitly at this plan's gate**. The answer: **defer, and record it.**

### Evidence the answer rests on (all read live this run — P6)

1. **The user population is zero, not small.** `README.md:103` — _"What does **not** exist yet is
   packaging: no installer, no versioned release you can drop into your own repo"_ — and `README.md:178`
   — _"Please do not adopt it yet."_ There is no installed user who could author a capability.
2. **The product surface already takes this exact posture for the adjacent case.**
   `.claude/commands/pharn-verify.md:385` ships _"The verifier plug-in slot (defined here; ZERO
   verifiers authored — P7)"_ and defers the live runner until _"the first verifier lands."_ Shipping a
   **catalog** of user-authored capabilities while deliberately deferring the **runner** for those same
   capabilities would be internally inconsistent.
3. **Nothing promises it.** `product-capability-catalog` is named as a follow-up **nowhere** in the repo
   (grepped live; the only named follow-up in `CLAUDE.md` is `grill-lessons-reverify`). No trusted doc
   claims a product catalog — unlike `product-memory-promote`, which closed a real `ARCHITECTURE §5` gap.
4. **The brief's Q2 has a binding precedent that removes the catalog's only reader.** The brief was
   written at `caf6e31` and assumed `product-lessons-index` might have been deferred; live HEAD is
   `123559e` and it **shipped** (#118), fixing the product output location at **`.pharn/lessons-index.md`
   — a gitignored, disposable cache**, explicitly not the user's `docs/`. That cache is justified there
   because `/pharn-plan` **machine-reads** it. A capability catalog is human-readable prose with **no
   machine consumer**, so the consistent answer gives it no reader at all; the inconsistent answer
   (`docs/`) claims a directory PHARN does not own — the brief's own reason for refusing to render into a
   user's `README.md`.
5. **Q3 has no invoker.** A user repo has no `npm run docs:check`. The brief states the consequence
   itself: if the answer is "nothing", _"the guarantee is unreachable … that is an argument for
   deferring, not a detail to settle later."_

### The condition that reopens it

The first `role:`-bearing capability authored **outside** PHARN's own shipped surface — the same trigger
`/pharn-verify` already names for its verifier runner. That is a real event, not a hypothetical, and it
is what P7 requires before this is planned again.

## Applied lessons

- **L1** — The meta-doc sweep **is** this increment's `## Files` list: a deferral that lives only in an
  ephemeral PLAN is not "somewhere durable", so the two meta-docs that assert the repo's follow-up and
  change record (`CLAUDE.md`, `CHANGELOG.md`) are named explicitly, or `/pharn-dev-build` writes neither.
- **L2** — The recorded deferral must cite only **live** floor ops. This increment introduces none, so
  the note claims none: it states a decision and its reasoning, and the "no `SKILLS_VERSION` bump"
  clause is labeled **advisory** below (verified live: no checker reads `SKILLS_VERSION`).
- **L9** — `/pharn-dev-verify`'s gate map includes `format:check` + `lint:md`, so this increment's own
  edits to two root markdown files **are** gated. `/pharn-dev-build`'s Step 2b must format them.
- **L10** — Re-derived live rather than copied: `validate.mjs` `EXCLUDE_SEGMENTS` is
  `{.claude/commands, .dev, pharn/floor, node_modules, .git}` — root files are **not** excluded, so
  `CLAUDE.md` and `CHANGELOG.md` sit on the **scanned** surface and face CHECK 5. The new prose must
  therefore never contain both `rule_id:` and `problem:` without documenting the enum-gated/free-text
  split (`validate.mjs:129-142`, read this run).
- **L11** — Whole-repo style gates mean one stale byte here blocks **every** later feature's verify, so
  the repo must be left style-clean at merge; the two edits are formatted before the floor runs.
- **L13** — This PLAN is formatted with `prettier` + `markdownlint-cli2` before the halt.
- **L18** — Applied **after** this plan reproduced the lesson live, not before: the exclusion block was
  first written as a bold prose intro, `set-writes-scope.cjs --from-plan` reported **6** paths against
  the **2** approved (granting scope to `pharn/floor/capability-catalog-core.mjs`, `SKILLS_VERSION` and
  `.dev/memory-bank/lessons-learned.md`), and the build **halted** at Step 1. The block is now the `###`
  heading form, which is structural and wording-independent; the setter's printed count is treated as a
  checkable number, as L18 prescribes.
- **L19** — Those formatters are scoped to **this artifact's path**, never `npm run format`, whose
  repo-wide Bash write escapes the fix #7 scope entirely.

## Files

- `CLAUDE.md` — EDIT — add `product-capability-catalog` as a **named deferral follow-up** with its
  one-line reasoning and its reopening condition — layer: none (repo-meta)
- `CHANGELOG.md` — EDIT — `[Unreleased]` entry recording the deferral, the five evidence points above,
  and explicitly that **no `SKILLS_VERSION` bump applies** — layer: none (repo-meta)

### Deliberately NOT in scope

<!-- L18: this MUST stay a `###` heading. `set-writes-scope.cjs --from-plan` ends the authorized
     list at a heading (structural, wording-independent); a bold prose intro fails OPEN and grants
     write-scope to every path named below. Verified live at build Step 0: the bold form yielded 6
     paths, this form yields 2. -->

- `pharn/floor/capability-catalog-core.mjs`, `gen-capability-catalog.mjs`,
  `check-capability-catalog.mjs` and their test suites — **not created.** This is the deferral.
- `SKILLS_VERSION` — **not bumped.** No product-surface byte changes (per `CLAUDE.md`'s bump-triggering
  set: the `pharn/` tree, `pharn/floor/*.mjs`, the four trusted docs, the `pharn-*` `.claude/` surface).
- `docs/capabilities/**`, `docs/lessons-index.md`, `README.md`'s `## Current state` — **not
  regenerated.** This increment adds no capability, command, hook, or floor checker, so all three
  generated regions are byte-unchanged; `npm run docs:check` must stay GREEN without a regenerate.
- `.dev/memory-bank/lessons-learned.md` — **not written.** A deferral is not a promoted lesson, and
  promotion is `/pharn-dev-memory-promote`'s gated action (L7 — this stage must not hold canon scope).
- The four trusted docs — hook-denied, human-only.
- `.dev/PORT-3-capability-catalog.md` — an **untracked** scratch brief; it never enters the diff and is
  not a plan file. Deleting it is post-merge housekeeping, as with the PORT-1/PORT-2 briefs.

## Contracts satisfied

- **None.** The increment adds no Capability, so no `pharn/pharn-contracts/*` schema is implicated.
  Stated rather than omitted: naming a contract this increment does not touch would be the "written in
  the contract" move P0 forbids.

## Evals to write (P1)

- **None, and this is not a P1 exemption request.** P1 binds **Capabilities** — a `.md` with a `role:`
  frontmatter field — and every `rule_id` in an `enforces` field. This increment adds **no** capability,
  no `rule_id`, and no enforcer; it adds two paragraphs of prose to two meta-docs. There is nothing for
  an eval case to produce. `pharn/floor/validate.mjs` will confirm this structurally: the capability set
  it enumerates is byte-identical before and after.

## Guarantee audit (P0)

- "The deferral and its reasoning are recorded in `CLAUDE.md` + `CHANGELOG.md`" → **ADVISORY.** No floor
  op checks that a deferral is recorded, or that the recorded reasoning is the real reasoning. The bytes
  land or they do not; a human reads them. Do not write "PHARN guarantees the deferral is on record."
- "No `SKILLS_VERSION` bump is required" → **ADVISORY.** Verified live: **no checker reads
  `SKILLS_VERSION`** (grepped this run — every hit is prose in docs or command text). The bump rule is
  human discipline documented in `CLAUDE.md`, not a floor primitive. The honest claim is "the
  bump-triggering set is untouched", which a human can verify from the `## Files` list.
- "This increment adds no new floor primitive" → **TRUE BY CONSTRUCTION, and that is the point.** The
  `## Files` list contains zero `.mjs`. The claim is checkable by reading the diff, not by a checker.
- "The three generated doc regions stay GREEN without a regenerate" → **FLOOR: content-hash /
  byte-equality (primitive #2)**, via `npm run docs:check` — reused, not added. Bounded exactly as the
  dev original states it: byte-equality is **consistency, not truth**.
- "`CLAUDE.md` / `CHANGELOG.md` do not trip `validate.mjs` CHECK 5" → **FLOOR: enum-regex (primitive
  #3)**, reused. Load-bearing here because root files are on the scanned surface (L10, re-derived live).
- "The build writes only these two files" → **FLOOR: hook (fix #7)** — `set-writes-scope.cjs
--from-plan` + `enforce-writes-scope.cjs`. Both are root files, which the fail-closed safe-set
  **denies** until this plan's `## Files` names them; naming them is what unlocks them.
- "Deferring is the _correct_ engineering call" → **NOT a claim this plan makes.** It is the **human's**
  answer to the P7 gate, recorded as such. The plan carries the reasoning, not a certification.

## Trust audit (P2)

- **Input: `.dev/PORT-3-capability-catalog.md`** — an untracked, hand-written brief. It is **not** one of
  the four trusted docs and carries no `trust:` tag, so it is treated as **untrusted DATA**: it was used
  to **scope** the increment, never as an instruction executed on its own authority.
- **Taint handling.** Every load-bearing fact it asserts was **re-verified against live state** (P6),
  and the two that disagreed were resolved **in favour of the repo**: it claimed `product-lessons-index`
  might still be deferred (it shipped, #118) and anchored at `caf6e31` (HEAD is `123559e`). Its "19
  lessons" and "named as a follow-up nowhere" claims were re-checked and **hold**.
- **Propagation.** No taint reaches a floor decision, because this increment makes **no** floor
  decision — it adds no checker and no gate. The brief's free text reaches only the human-readable
  `CHANGELOG` / `CLAUDE.md` prose, where it is a recorded rationale a human can audit, never an input to
  an enum-gated field.

## Determinism audit (P5)

- The single branch in this increment — **ship or defer** — was **not** decided by model classification.
  It was surfaced as an explicit gate and **answered by the human**. That is P5's terminal fallback
  ("ask the human") exercised as designed, not a guess dressed as a judgement.
- No other branch exists: the `## Files` list is fixed, and the downstream stages branch only on the
  deterministic verdicts they already own (`validate` exit, `check-regress`, `check-verify`).

## Open questions (HALT)

- **None outstanding.** The brief's Q1 (whose capabilities), Q2 (output location) and Q3 (what invokes
  the drift check) are **moot under the deferral** and are deliberately left unanswered — answering
  them now would be designing the thing P7 just declined to build. They are recorded in the brief and
  reopen with it.
