# PLAN — retro-tag-legacy-lessons

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L1, L2, L3, L6, L7, L10, L18, L19, L20]
- increment: Give L1–L17 in `.dev/memory-bank/lessons-learned.md` the #114 tag line (`type: <enum> · concepts: [...]`) so `docs/lessons-index.md` becomes selectable on more than the title, and correct every meta-doc sentence that calls an untagged entry "expected and benign".
- layer(s): apparatus (`.dev/**`, `pharn-dev-*` commands, `docs/`, repo-meta) — no product surface
- constitution_refs: [P0, P4, P5, P6, P7]

## Applied lessons

- **L1** — ran the meta-doc sweep before scoping. It found **five** sites asserting the fact this
  increment invalidates, not the one the brief named: `docs/lessons-index.md:13` + `:15` (generated),
  `CLAUDE.md:420`, `.claude/commands/pharn-dev-plan.md:98-99`,
  `.claude/commands/pharn-dev-memory-promote.md:101-104`, and `CHANGELOG.md:222-223` (historical —
  deliberately **not** edited; see the exclusion heading). All four live sites are in `## Files`.
- **L2** — every "enforced by" in this plan's guarantee audit cites an op I **read live this run**
  (`gen-lessons-index.mjs` / `check-lessons-index.mjs` / `docs:check`, `npm run check` GREEN at 1380
  tests), and the honesty travels into the **artifacts** (the `-`-legend edits), not just this PLAN.
- **L3** — this is L3's own case, reversed. L3 is _why_ legacy entries were left untagged (":103 —
  avoids converting latent drift into active friction"). Making the tag line universal in practice
  obliges the same-increment re-audit of **every existing declaration of it**, which is exactly the
  five-site sweep above. Answered head-on rather than inherited.
- **L6** — read `TYPE_ENUM` from its **structured location** (the literal array at
  `.dev/floor/check-provenance.mjs:77`) and the ratified distribution from the SoT comment at `:73-74`
  — never from a command doc's restatement. Same for the tag line's **defined position** (first
  non-empty line after the heading), read from `lessons-index-core.mjs`, not from prose.
- **L7** — L7 is the strongest objection to this increment's shape, so it is answered, not skipped:
  L7 forbids a stage holding canon write-scope while it only **proposes** a lesson. Here canon is the
  increment's **declared deliverable**, authorized by a human at GATE 1 and pinned by
  `--from-plan`. The distinction is _incidental_ scope (L7's defect) vs _declared, approved_ scope.
- **L10** — verified the regenerated `docs/lessons-index.md` introduces no `rule_id:` + `problem:`
  pair, so it cannot trip validate CHECK 5 on the scanned surface `docs/` sits on. No new concept tag
  is `rule_id` or `problem`.
- **L18** — the exclusion block below is a `###` **heading**, and its intro is a **blockquote** so it
  cannot match the setter's prose-cue fallback.
- **L19** — `docs/lessons-index.md` is written by `npm run docs:generate` through **Bash**, which
  escapes fix #7 entirely. Declared in `## Files` and labeled as such, per L19's own remedy
  ("declare it, not pretend the gate covered it").
- **L20** — the setter's printed path count is a **checkable number**: `## Files` declares **15**
  paths at GATE 1, and build Step 0 must print `15 path(s)`. Any other number halts the build.
  _(Held: the build printed `15 path(s)`. The GATE-2 fix pass then declared two more paths and re-ran
  the setter, which printed `17 path(s)` against the amended `## Files` — the check re-applied to the
  new number rather than being waived, which is the whole point of it being checkable.)_

## The promote-path decision (HALT — resolved, human to ratify)

**Recommendation: (c) — the ordinary gated build path. No new mechanism, no new checker.**

The brief is right that the gated promote path **cannot** do this, and all three blockers verified live:

| Blocker                                                                | Live evidence                                                                    |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Legacy entries are declared out of contract                            | `pharn-dev-memory-promote.md:101-104` — "**Legacy entries are not retrofitted**" |
| A duplicate id is a deterministic floor RED                            | `:185` — "Duplicate id → **FLOOR**. Already enforced by Step 3"                  |
| Step 6 can only **append** a whole entry, not annotate an existing one | `:205` — "**append** the rendered entry to the … `<canon-file>`"                 |

**Why (c) and not (a) — a `retag` mode in promote.** (a) requires inverting the duplicate-id check
from must-NOT-exist to must-EXIST. That check is the only thing preventing a promotion from colliding
with a live id, and a mode-dependent guard is a guard that becomes its **own opposite** when the mode
is wrong. It also requires replacing Step 6's append with an in-place inserter — append **cannot**
corrupt an existing entry, insert **can**. Decisively: `check-provenance.mjs` **never scans canon** by
design (`:101-102`), so a `retag` mode could not verify that the line it writes lands under the right
heading without a **new canon-scanning capability** — a new primitive, for a job the build path
already gates.

**Why not (b) — a separate one-shot dev tool.** It creates a **second** canon write path, doubling the
audit surface §5's rationale exists to protect; "one-shot" is unenforceable once the tool is
committed; and per this brief's own constraint a new checker owes WARN-vs-RED semantics plus a
`ci.yml` pin test — permanent cost for a 17-line, one-time job. **P7, stated honestly (amended at GATE 2
per `GRILL.md` F2):** this increment is **not** triggered by an observed dogfood failure, and calling "17
untagged entries make the index unselectable" a _triggering failure_ overstated it — no run failed on an
untagged entry, and `typed-lessons/PLAN.md:135` recorded the gap in advance as "incomplete **by
construction**". Its real authorization is that it is the **named follow-up #115 booked**
(`retro-tag-legacy-lessons`), ratified by a human at GATE 1 — the same honest-trigger form #114 and #115
both used. What P7 still decides here is the **remedy's size**: 17 tag lines, not a tool.

**The `pharn/ARCHITECTURE.md §5` consequence — stated for each option.** §5's "State" paragraph says:
_"Promotion of a lesson/pattern to canon is a **gated** action with provenance per entry … the floor
gates the write (P2)."_ Read exactly:

1. **§5 requires a gated write, not a named command.** The floor op is fix #7. `/pharn-dev-build`
   with `--from-plan` supplies precisely that, pinned to the one canon path, behind GATE 1.
2. **A retag is not a promotion.** No entry enters canon; no `provenance` is created. §5's
   provenance-per-entry clause is therefore **not triggered** — which is _why_ the brief's "do not
   retro-fill provenance" is principled rather than a corner cut.
3. **Only (c) creates no trusted-doc debt.** (a) and (b) would each make a second canon-write path
   exist while §5 documents only one — a doc-vs-repo drift (P6) in a **human-only** file the agent
   cannot fix. (c) leaves §5 true as written; the _promotion vs annotation_ distinction lives in the
   dev apparatus's practice, where it belongs.

**Surface conclusion: dev-only ⇒ NO `SKILLS_VERSION` bump, and no README badge change.** Verified
positively, not assumed: every path in `## Files` is `.dev/**`, a `pharn-dev-*` command, `docs/`, or
repo-meta. The product twins are **byte-unchanged and stay true** — `pharn/floor/lessons-index-core.mjs`
already words its legend for a user's corpus ("an entry written before the tag line existed, or by
hand"), with no `#114`/"legacy" reference; `.claude/commands/pharn-memory-promote.md:118` speaks of a
**user's** pre-existing entries, which this increment does not touch; and
`pharn/floor/check-provenance.mjs:108-112` cites the same distribution, which this increment
**reproduces rather than changes**. The dev/product legend prose already diverges by design, and the
cross-surface `✧` test pins only named constants + `cleanScalar` — deliberately **not** prose ("a guard
that fires on a reworded sentence is a guard operators learn to wave through").

## The `type` re-derivation — reproduces the published distribution exactly

`check-provenance.mjs:73-74` publishes `process 5 · scoping 4 · floor 4 · tooling 2 · contract 1 ·
eval 1` (= 17). My independent assignment over all 17 full entries **matches every component**. It is
not luck: the `scoping` set is named **by canon itself** (L19 enumerates "L3 … L7 … L8 … L18"; L20
cites "L3 / L7 / L8 / L17 / L18" as the family), and `contract`/`eval` are singletons by inspection.

| type       | expected | derived | ids                   |
| ---------- | -------- | ------- | --------------------- |
| `process`  | 5        | **5**   | L1, L9, L11, L12, L13 |
| `scoping`  | 4        | **4**   | L3, L7, L8, L17       |
| `floor`    | 4        | **4**   | L6, L10, L14, L15     |
| `tooling`  | 2        | **2**   | L5, L16               |
| `contract` | 1        | **1**   | L2                    |
| `eval`     | 1        | **1**   | L4                    |
| **total**  | **17**   | **17**  |                       |

No disagreement to report, so no member is proposed and `TYPE_ENUM` is **untouched** (P7).

## The five accept batches (sequenced so no batch collapses into one yes)

Batched **by `type`**, because each batch's size is then independently checkable against the published
distribution component above. Each table cell is the **exact byte string** to insert — no emphasis
markup inside it, so what you read is what gets written. Concepts already live in L18–L21 are named in
each batch's `reuses:` line; everything else is **new** and inventoried below.

### Batch A — the two singletons (most decidable; ratify these first)

| id  | tag line to insert                                                                                    |
| --- | ----------------------------------------------------------------------------------------------------- |
| L2  | `type: contract · concepts: [guarantee-audit, doc-drift, live-floor-op]`                              |
| L4  | `type: eval · concepts: [eval-fixture, live-measurement, structural-semantic-split, guarantee-audit]` |

_Accepting this batch = agreeing L2 is contract-document honesty and L4 is the eval/measurement layer._

### Batch B — `scoping` (4) — the family canon names itself

| id  | tag line to insert                                                                           |
| --- | -------------------------------------------------------------------------------------------- |
| L3  | `type: scoping · concepts: [writes-scope, declaration-audit, fail-closed]`                   |
| L7  | `type: scoping · concepts: [writes-scope, over-declaration, canon-write, declaration-audit]` |
| L8  | `type: scoping · concepts: [writes-scope, setter-resolution, command-design]`                |
| L17 | `type: scoping · concepts: [writes-scope, scope-check, false-blocking]`                      |

`reuses:` `writes-scope` (all four).

_Accepting this batch = agreeing the `writes:`/scope family is exactly {L3, L7, L8, L17} among L1–L17
(L18/L19 already tagged `scoping`; L20/L21 already tagged `process`)._

### Batch C — `floor` (4) — floor-checker implementation discipline

| id  | tag line to insert                                                                  |
| --- | ----------------------------------------------------------------------------------- |
| L6  | `type: floor · concepts: [membership-test, frontmatter, enum-gated]`                |
| L10 | `type: floor · concepts: [validate-scan-surface, dev-product-boundary, enum-gated]` |
| L14 | `type: floor · concepts: [enum-gated, control-char-guard, regex-anchoring]`         |
| L15 | `type: floor · concepts: [keyed-lookup, prototype-pollution, silent-failure]`       |

_Accepting this batch = agreeing these four are about **how a floor checker is implemented**, not about
a pipeline stage's discipline._

### Batch D — `tooling` (2) — the shell / harness / portability layer

| id  | tag line to insert                                                                        |
| --- | ----------------------------------------------------------------------------------------- |
| L5  | `type: tooling · concepts: [input-capture, shell-portability, word-splitting]`            |
| L16 | `type: tooling · concepts: [input-capture, shell-portability, word-splitting, false-red]` |

`reuses:` `input-capture` (both).

_Accepting this batch = agreeing L5's zsh word-split and L16's BSD-`xargs` trap are **tooling**, not
`floor` (the floor cores were correct in both; only their inputs were wrong)._

### Batch E — `process` (5) — pipeline-stage discipline

| id  | tag line to insert                                                            |
| --- | ----------------------------------------------------------------------------- |
| L1  | `type: process · concepts: [plan-shape, meta-docs, doc-drift]`                |
| L9  | `type: process · concepts: [style-gates, gate-map, stage-seam]`               |
| L11 | `type: process · concepts: [style-gates, gate-map, whole-repo-scope]`         |
| L12 | `type: process · concepts: [style-gates, prevention-vs-detection, formatter]` |
| L13 | `type: process · concepts: [style-gates, prevention-vs-detection, gate-map]`  |

`reuses:` `plan-shape` (L1), `formatter` (L12).

_Accepting this batch = agreeing the four style-gate lessons (L9, L11, L12, L13) plus L1's meta-doc
sweep are stage discipline. This is the batch where a reasonable person could instead argue L9/L11 are
`floor` — but the floor checkers there are correct; it is verify's **gate map** that was wrong._

### Concept inventory — 4 reused, 33 new (all human-gated)

**Reused from live L18–L21** (8 slots): `writes-scope` (L3, L7, L8, L17), `input-capture` (L5, L16),
`plan-shape` (L1), `formatter` (L12).

**New, flagged for ratification** (33). The recurring ones are the ones that make the index
_selectable_; singletons are precision tags:

- **used 4×:** `style-gates` (L9, L11, L12, L13)
- **used 3×:** `gate-map` (L9, L11, L13), `enum-gated` (L6, L10, L14)
- **used 2×:** `doc-drift` (L1, L2), `guarantee-audit` (L2, L4), `declaration-audit` (L3, L7),
  `shell-portability` (L5, L16), `word-splitting` (L5, L16), `prevention-vs-detection` (L12, L13)
- **used 1×:** `meta-docs`, `live-floor-op`, `fail-closed`, `eval-fixture`, `live-measurement`,
  `structural-semantic-split`, `membership-test`, `frontmatter`, `over-declaration`, `canon-write`,
  `setter-resolution`, `command-design`, `stage-seam`, `validate-scan-surface`,
  `dev-product-boundary`, `whole-repo-scope`, `control-char-guard`, `regex-anchoring`,
  `keyed-lookup`, `prototype-pollution`, `silent-failure`, `false-red`, `scope-check`,
  `false-blocking`

All 37 satisfy the live shape rules read this run (`.dev/floor/check-provenance.mjs:81-84`): 3–4 per
entry (cap 1–6), `/^[a-z0-9-]+$/`, longest is `structural-semantic-split` at 25 ≤ 32 chars.

## Files

- `.dev/features/retro-tag-legacy-lessons/PLAN.md` — this plan (already written at the plan stage; listed so the build's scope is self-consistent) — layer apparatus
- `.dev/features/retro-tag-legacy-lessons/GRILL.md` — `/pharn-dev-grill` interrogation — layer apparatus
- `.dev/features/retro-tag-legacy-lessons/REGRESSION.md` — `/pharn-dev-regress` human report — layer apparatus
- `.dev/features/retro-tag-legacy-lessons/regression-report.json` — `/pharn-dev-regress` machine verdict — layer apparatus
- `.dev/features/retro-tag-legacy-lessons/VERIFY.md` — `/pharn-dev-verify` human report — layer apparatus
- `.dev/features/retro-tag-legacy-lessons/verify-report.json` — `/pharn-dev-verify` machine verdict — layer apparatus
- `.dev/features/retro-tag-legacy-lessons/REVIEW.md` — `/pharn-dev-review` 4-lens advisory review — layer apparatus
- `.dev/features/retro-tag-legacy-lessons/SHIP.md` — `/pharn-dev-ship` roll-up — layer apparatus
- `.dev/memory-bank/lessons-learned.md` — **the deliverable**: insert 17 tag lines, one per L1–L17, each as the first non-empty line after its `## L<n> — <title>` heading (verified uniform: every heading is followed by a blank line then `**Lesson.**`). **`Write`-tool edits only** — no `sed`, no repo-wide formatter — layer apparatus (canon, fail-closed zone)
- `.dev/floor/lessons-index-core.mjs` — correct the `-` legend at **two** sites: the inline comment `:53` and the rendered header template `:277-278`. **Dev copy only**; the product twin's wording is already surface-correct — layer apparatus (dev floor)
- `docs/lessons-index.md` — **regenerated**, never hand-edited: `npm run docs:generate`. This is a **Bash** write and therefore **outside** the fix #7 scope — declared here rather than pretended-gated (L19) — layer apparatus (generated)
- `CLAUDE.md` — correct `:420`'s "A `-` means no tag line (the pre-#114 legacy shape — expected, benign)" — layer repo-meta
- `.claude/commands/pharn-dev-plan.md` — correct `:98-99`'s "A `-` is the pre-#114 legacy shape: expected, benign" — layer apparatus (`pharn-dev-*` command)
- `.claude/commands/pharn-dev-memory-promote.md` — correct `:101-104`: **keep** the mechanism sentence (the checker still never scans canon, so the fields still bind NEW candidates only) and **keep** "any consumer must tolerate untagged entries"; replace only the now-false descriptive clause "entries promoted before this contract stay untagged, deliberately" — layer apparatus (`pharn-dev-*` command)
- `CHANGELOG.md` — a new `[Unreleased]` entry recording the retro-tag, the promote-path decision, and the explicit **no-bump** conclusion — layer repo-meta
- `.dev/floor/lessons-index-core.test.mjs` — **ADDED POST-REVIEW** (see `## Post-review amendments`): one live-canon drift guard pinning `0 untagged · 0 malformed`, folded into the file's existing drift-guard section. Not a new checker — an assertion in an existing suite — layer apparatus (dev floor tests)
- `.claude/commands/pharn-dev-regress.md` — **ADDED POST-REVIEW** (see `## Post-review amendments`): name the exact committed eval pair the way `/pharn-dev-verify` already does, removing the placeholder that produced a live false red this run — layer apparatus (`pharn-dev-*` command)

**Declared path count: 17.** Build Step 0 must print `17 path(s)`; any other number halts (L20).
**(Was 15 at GATE 1;** the two `ADDED POST-REVIEW` paths above were declared at the GATE-2 fix pass and
the setter re-run — the documented remedy for a blocked write, never a hook bypass.)

### Deliberately NOT in scope

> Each with its reason. This is a `###` heading, not a bold prose intro, so the setter's list
> terminates here (L18); this intro is a blockquote so it cannot match the prose-cue fallback either.

- `SKILLS_VERSION` and `README.md` — **no product-surface byte changes**, so no bump and no badge edit.
  Verified positively above, not assumed.
- `pharn/floor/lessons-index-core.mjs`, `.claude/commands/pharn-memory-promote.md`,
  `pharn/floor/check-provenance.mjs` — the product twins. Their wording is **already** correct for a
  user's corpus, and editing them would move the surface and force a bump for no gain.
- `pharn/floor/check-plan-lessons.mjs` — untouched per the brief; its heading regex is load-bearing
  since #113. The 17 tag lines sit **below** the heading and cannot disturb `L<n>` id resolution
  (already pinned by that checker's own regression tests).
- `.dev/floor/check-provenance.mjs` — `TYPE_ENUM` is **untouched** (the re-derivation reproduced the
  published distribution, so there is nothing to add), and no `provenance` is retro-filled.
- `CHANGELOG.md:222-223` — the historical #114/#115 entries stay **verbatim**. They correctly describe
  what shipped **then** ("all 17 rows currently render `-`"); a changelog records history, it does not
  rewrite it. The new `[Unreleased]` entry supersedes them.
- **L10's misplaced `**Provenance.**` block** (L10 has none; L11 carries two — the second is L10's,
  confirmed live). A pre-existing data anomaly, already reported in
  `guard-coverage/PLAN.md:91`. Repairing it **moves** real provenance rather than fabricating it, so it
  is legitimate work — but it is a **different** change with a different review question, and folding
  it in would make one of the 17 batches unreviewable. Stays a follow-up.
- **A `lesson-tagline-render-check` floor checker** — see the guarantee audit's named residual. P7:
  **zero** occurrences of a malformed rendered tag line exist, so a checker now would be speculative,
  and it is already a named follow-up (`guard-coverage/PLAN.md:98`).

## Contracts satisfied

- **The lesson-entry tag line** (`.claude/commands/pharn-dev-memory-promote.md`, "The lesson-entry tag
  line") — the 17 inserted lines conform to its defined **position** (first non-empty line after the
  heading) and **grammar** (`type: <member> · concepts: [<a>, <b>]`). Cited, not restated (P4).
- **`TYPE_ENUM` as single source of truth** (`.dev/floor/check-provenance.mjs:77`) — every assigned
  `type` is read from that array; no member added, none reinterpreted.

## Evals to write (P1)

**None — and this is not an exemption.** P1 binds a **Capability** (a `.md` with `role:` frontmatter).
This increment adds no capability, no `rule_id`, and no checker: it writes 17 data lines into an
apparatus file, corrects four prose sentences, and regenerates one derived file. The existing suite
already covers the machinery it exercises (`lessons-index-core.test.mjs` pins the tag-line parse, the
`✧` cross-surface constants, and the `tagged / malformed / untagged` header render).

## Guarantee audit (P0)

| claim                                                                            | reduction                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Each assigned `type` is a real enum member                                       | **FLOOR (enum), but it MARKS rather than GATES** — set membership over `TYPE_ENUM` re-runs on regeneration and a non-member renders `?`; **nothing exits non-zero**, so this makes a bad value _visible_, never _impossible_ (agrees with the residual row below)                                            |
| Each `concepts[]` is well-shaped (1–6, `/^[a-z0-9-]+$/`, ≤32, control-char-free) | **FLOOR (regex + guard)** — same gate, with `cleanScalar` composed **before** the shape regex (L14)                                                                                                                                                                                                          |
| The committed `docs/lessons-index.md` equals what the core recomputes            | **FLOOR (content-hash class — byte-equality)** — `check-lessons-index.mjs` via `docs:check` in `npm run check`. **Consistency, never correctness.**                                                                                                                                                          |
| The tag line is read from its defined structured location, not grepped           | **FLOOR (structural parse)** — `lessons-index-core.mjs` parses the first non-empty line after the heading (L6)                                                                                                                                                                                               |
| `applied_lessons` is declared and every cited id resolves                        | **FLOOR (enum/regex + heading membership)** — `check-plan-lessons.mjs`, self-run at Step 4                                                                                                                                                                                                                   |
| The build writes only these 15 paths                                             | **FLOOR (hook, fix #7)** — `set-writes-scope.cjs --from-plan` + `enforce-writes-scope.cjs`. **Narrowed:** `docs:generate`'s write is Bash → **ungated** (L19)                                                                                                                                                |
| The 17 `type` values reproduce the published distribution                        | **ADVISORY** — an arithmetic cross-check against a committed comment, done by hand this run. Real evidence, not a floor op: no checker computes it                                                                                                                                                           |
| The `type`/`concepts` values **describe** their lessons                          | **ADVISORY — human-gated only.** "Typed `floor`" never means "about the floor." The GATE-1 batch accepts are the whole check                                                                                                                                                                                 |
| A **malformed rendered** tag line is caught **in THIS repo's canon**             | **FLOOR (enum/regex over live canon) — ADDED POST-REVIEW.** `.dev/floor/lessons-index-core.test.mjs` asserts `0 untagged · 0 malformed` over `.dev/memory-bank/lessons-learned.md`, so a `?` or `-` now fails `npm test` (and CI). **Narrowed:** dev canon only — a USER's `memory-bank/` is still uncovered |

**Two honest consequences I am not softening.**

1. **This increment made a 21-line surface uncovered, and the GATE-2 fix pass then covered it — for
   this repo only.** As planned, nothing turned a malformed rendered tag line into a non-zero exit: the
   only remedy was an **advisory** Step-2b grep for `21 lessons · 21 tagged · 0 malformed · 0 untagged`,
   which nothing on the floor forces the build to run. **L20 says exactly this is the trigger to
   escalate**, and `/pharn-dev-grill` raised it, so the fix pass added the live-canon assertion named in
   the row above — an assertion in an **existing** suite, not the new `lesson-tagline-render-check`
   checker (still deferred, still the right P7 call at zero malformed instances). **What is still NOT
   guaranteed, stated plainly:** the product twin `pharn/floor/lessons-index-core.mjs` has no equivalent
   pin, so a **user's** canon can still carry a `?` at exit 0; and the assertion proves the tag line is
   well-**shaped**, never that it is **apt** (consequence 2 below is untouched by it).
2. **An _inapt_ tag is caught by nothing at all.** Not the enum gate, not byte-equality, not the
   distribution arithmetic. Per batch, what you are accepting is exactly the judgment call named in
   that batch's italic line — and a wrong one is a wrong `type`/`concepts` value living in canon,
   surfacing later only as a bad candidate selection in a plan's lessons sweep.

## Trust audit (P2)

Canon is **untrusted DATA** and this increment does not change that. The 17 tag lines are written into
the **enum-gated / regex-gated** half of the entry (`type`, `concepts`) — the half a consumer may
branch on — while every lesson **body** and **title** stays free text reproduced verbatim inside a
`text` fence, read by no decision. The index core refuses (never sanitizes) a title bearing a
fence-closing sequence or a control char. Taint direction is unchanged: a poisoned `concepts` tag
could only ever bias **advisory context selection** in a later plan's sweep, never a floor verdict —
`check-plan-lessons.mjs` still verifies declarations against **canon**, never against the index.

## Determinism audit (P5)

- Which entries get a tag line → **membership**: the `## L<n> —` headings present in canon (17,
  enumerated live with their line numbers).
- Which `type` each gets → **model judgment, human-ratified at GATE 1**, cross-checked against a
  committed distribution. Terminal fallback if a lesson fits no member: **report it and ask** — never
  force the nearest member, never extend `TYPE_ENUM` (P7; the dropped `injection` precedent).
- Proceed/stop after each stage → each stage's own deterministic verdict, unchanged.
- Build Step 0's path count → **integer compare** against the declared 15 (L20).

## Open questions (HALT) — all four RESOLVED at the plan gate

Resolved by the human at the Step-4 halt, before any build. Recorded here because this PLAN is the
versioned record of intent, not a scratch file.

1. **The promote-path decision → RESOLVED: (c), the ordinary gated build path.** No `retag` mode, no
   one-shot tool, no new checker. This sets the precedent for every future canon **annotation**: it
   travels the same route as any other increment — declared in `## Files`, scoped by
   `set-writes-scope.cjs --from-plan`, approved by a human at GATE 1 — and `/pharn-dev-memory-promote`
   remains the sole path for a **promotion** (a new entry, with provenance). `pharn/ARCHITECTURE.md §5`
   stays true as written; the promotion-vs-annotation distinction lives in apparatus practice.
2. **The batch accepts → RESOLVED: all five accepted as proposed.** Batches A–D (L2, L4 · L3, L7, L8,
   L17 · L6, L10, L14, L15 · L5, L16) accepted together, since each batch's size independently matches
   its published distribution component. Batch E (L1, L9, L11, L12, L13) accepted **as `process`** —
   the contested reading (L9/L11 as `floor`) was declined on the stated ground that those two lessons'
   floor checkers were correct and the defect was `/pharn-dev-verify`'s **gate map** and scope.
   Final: `process 5 · scoping 4 · floor 4 · tooling 2 · contract 1 · eval 1`, matching
   `.dev/floor/check-provenance.mjs:73-74` component-for-component.
3. **The 33 new concepts → RESOLVED: accepted as proposed**, 3–4 tags per entry, singletons kept. The
   open vocabulary needs no code change; the nine recurring tags carry the index's selectivity.
4. **A brief-text ambiguity, flagged rather than guessed (P6) → RESOLVED as moot.** The brief's
   CONSTRAINTS section contains a truncated sentence: _"…#115's remediation of exactly thists a parity
   test to the SoT; any new checker gets explicit WARN-vs-RED semantics and a ci.yml pin test"_. Read
   as **"any new constant gets a parity test to the SoT; any new checker gets WARN-vs-RED semantics + a
   ci.yml pin test."** Under (c) this increment adds **neither** a constant nor a checker, so no part
   of the plan turns on the reading. Left recorded rather than silently dropped.

## Post-review amendments (GATE 2 — human-authorized fix pass)

**This section is an APPENDED record, not a rewrite.** The GATE-1 text above is unchanged except where a
line is marked `ADDED POST-REVIEW` or amended below, so the plan stays the versioned record of intent
rather than being retro-fitted to match delivery (the same reason `CHANGELOG.md:222-223`'s historical
entries were excluded from scope). Authorized by the human at GATE 2 with "fix everything needs fixing".

| #   | source                  | change                                                                                                                        |
| --- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1   | `REVIEW.md` F1 (P0)     | `CHANGELOG.md` now carries the **L19 narrowing** — `docs/lessons-index.md` was a Bash write, never fix#7-gated. L2's own case |
| 2   | `GRILL.md` F1 (P0)      | Guarantee-audit row amended: the `type` enum **marks** (`?`), it does not **gate** — it now agrees with the residual row      |
| 3   | `GRILL.md` F3 (P1/L20)  | `.dev/floor/lessons-index-core.test.mjs` gains a live-canon pin (`0 untagged · 0 malformed`); `## Files` +1, count 15 → 16    |
| 4   | `REVIEW.md` F3 (P5/L20) | `.claude/commands/pharn-dev-regress.md` now names the exact eval pair; `## Files` +1, count 16 → 17                           |
| 5   | `REVIEW.md` F5 (P4)     | The index legend states the **rule** ("a `-` means the promote gate was bypassed") rather than narrating the retag event      |
| 6   | `GRILL.md` F2 (P7)      | The promote-path section no longer calls this a "triggering failure" — it is the **named #115 follow-up**, the honest trigger |
| 7   | `GRILL.md` F1 / L20     | The L20 applied-lessons bullet records that the count check **re-applied** at 17 rather than being waived                     |

**One review finding was CONSIDERED and DECLINED, recorded so the decision is visible rather than
silent — `REVIEW.md` F4 (minor).** F4 argued `plan-shape` on **L1** collides with its L18/L20 sense
(document structure vs. scoping completeness) and should be dropped. Declined: the tag is defensible
under a broad reading of "the shape of a plan document" (which files its `## Files` names **is** part of
that document's shape), it was **ratified by the human at GATE 1** as part of the 37-tag inventory, and
churning ratified canon over a minor stylistic call would cascade the `37 distinct / 4 reused` figure
through three further docs for no functional gain. The collision is real but harmless: a selector on
`plan-shape` gets L1, L18, L20 — all genuinely about plans. **Reopens** if a future sweep actually
mis-selects on it.

**Not bundled, named as a follow-up instead (P7 — one axis per increment).**
`.claude/commands/pharn-dev-grill.md` Step 2b still reads _"Today the registered set is the
`testability` griller"_ while `count-grillers.mjs` reports **13**. It is a live doc-vs-repo drift and
worth fixing — but it is a **different axis** from this increment's (the tag line's truth), it was
already stale before this run, and nothing here invalidated it. Folding it in would make the diff span
two unrelated stories.
