# REVIEW — readme-current-state

PHARN reviewing PHARN. Increment under review: `trust: untrusted`. **Floor first:**
`node pharn/floor/validate.mjs .` → **GREEN (36 capabilities), exit 0**. Standing stage verdicts:
`/pharn-dev-regress` → `no-regressions`; `/pharn-dev-verify` → `PASS` (7/7 gates). Everything below the
floor line is **advisory**.

## L-floor → P0 (guarantee audit — the governing lens)

**No blocking finding.** Every guarantee the increment claims reduces to a floor primitive or carries an
explicit `advisory` label, and — unusually — the _negative_ space is documented too:

- "committed `## Current state` block == recomputed block" → **byte-equality** (content-hash primitive),
  `check-capability-catalog.mjs`. "exactly one well-ordered marker pair" → **regex occurrence count**.
  Both are `ARCHITECTURE §2` primitives, not judgment.
- The checker's header states three things it does **NOT** guarantee — that the content is _true_
  (a wrong enumerator regenerates cleanly and stays GREEN), that the capability count agrees with
  `validate.mjs` (a **mirrored** implementation → advisory), and anything about prose outside the
  markers (unguarded). The CHANGELOG entry and the `CLAUDE.md` note repeat the same split. This is the
  disease's inverse: the increment's most quotable claim ("the README can't lie anymore") is precisely
  the one it refuses to make.

One minor P0 finding, structurally unfixable inside this increment:

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".github/workflows/ci.yml:33"
  problem: "The CI step named 'Docs catalog drift' now also gates the README current-state block, so its name understates what a red there means — a contributor reading a failed CI run is told the catalog drifted when the README block may be the actual offender. The plan deliberately excluded ci.yml from `## Files`, so the writes-scope hook would DENY correcting the label during this build; it is reported rather than silently left. Cosmetic only: the step does run the widened checker, so nothing is ungated."
  evidence: "- name: Docs catalog drift\n        run: node .dev/floor/check-capability-catalog.mjs ."
```

## L-eval → P1

**No finding.** The increment introduces **no `role:`-bearing file**, so P1's eval-per-capability
requirement does not attach — `validate.mjs` GREEN confirms no capability was added without evals.
Verification is instead the three unit suites: **38 tests** across `capability-catalog-core.test.mjs`
(16), `gen-capability-catalog.test.mjs` (7) and `check-capability-catalog.test.mjs` (15), at **98.64 % /
100.00 % / 97.95 %** line coverage on the three modified `.mjs`. The floor and the review agree.

Worth crediting rather than merely passing: the suites test the **failure** paths as first-class —
missing / duplicated / inverted markers each assert a _distinct_ message, a missing enumerated directory
and a non-inert basename each assert a throw, and one test pins that hand-editing a **marker line** is
itself drift (the marker text lives inside the guarded region, so there is no unguarded escape hatch).

## L-trust → P2

**Reviewed content did not steer my behavior.** No instruction-looking content was found in the
increment; every quotation in this file is rendered as DATA.

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".dev/floor/capability-catalog-core.mjs:415"
  problem: "Repo-derived free text (filenames and directory names) is rendered verbatim into the root README — the most-read file in the project — so the LIMITS §2 residual applies: a human or downstream LLM reading it could be steered by injected text. The increment BOUNDS this deliberately rather than ignoring it (a fail-closed SAFE_BASENAME refusal throws instead of emitting a non-inert name), and it cannot produce a false GREEN because generator and checker share one renderer. Bounded, not zeroed — and the sources are hook-protected product paths today."
  evidence: "`const SAFE_BASENAME = /^[A-Za-z0-9._-]+$/;` … `throw new Error(...refusing to render it into README.md)`"
```

Note the improvement over the prior increment: the catalog's equivalent residual (recorded as L-trust in
`.dev/features/docs-capability-catalog/REVIEW.md`) was _accepted_; here it is **refused at the floor**.
That is a recorded finding driving a concrete hardening — P7's "real failure, not hypothetical" working
as intended.

**No guaranteed decision rests on a tainted field.** The verdict is byte-equality plus marker counting;
no free-text is interpreted anywhere in the checker.

## L-axis → P3

No sibling imports: `gen` and `check` each import only the shared `core` (tree-shaped; neither imports
the other) — confirmed by grep, zero cross-imports. But the increment's central architectural cost is
real and must be reported, not argued away:

```yaml
- type: FINDING
  rule_id: "P3"
  severity: important
  file: ".dev/floor/capability-catalog-core.mjs:2"
  problem: "The core now carries THREE axes of change — capability enumeration, capability-page rendering, and (new) repo-surface enumeration plus README-block rendering — and the three `*-capability-catalog*` filenames describe only the first two. P3 says a file changes for exactly one reason. The prior increment's REVIEW pre-registered this exact exit condition ('split only if either axis grows'); this increment IS that growth, and the split was not taken."
  evidence: "SCOPE NOTE … 'this module renders TWO generated artifacts, not one … Its filename says only the first.'"
```

**Why this is not a build defect.** The alternative — a separate core + generator + checker per artifact
— was put to the human as an explicit three-way choice at the plan gate, with this cost stated in
advance; **Option A was chosen over the planner's recommendation.** The finding stands as the honest,
recorded price of a deliberate decision. Two things materially reduce it, both verified:

- The file **names its own tension** in a `SCOPE NOTE` header rather than hiding it — the growth is
  legible to the next reader, which is the failure mode P3 actually guards against.
- The change is **purely additive**: `enumerateCapabilities()`, `renderPage()`, `renderIndex()`,
  `buildCatalog()` and `listCommittedPages()` are untouched, and the 37 committed catalog files come out
  byte-identical (`docs:check` GREEN). The containment `GRILL.md` recommended was applied.

A second, smaller axis note:

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/floor/check-capability-catalog.test.mjs:29"
  problem: "The ~25-line fixture builder (capabilities + the four enumerated directories + a marked README) is now duplicated across all three test suites, because the plan's `## Files` authorised no shared test-helper module and the writes-scope hook would have denied creating one. The repo's existing idiom already duplicated a smaller `cap()`/`makeRepo()` helper, so this extends a known pattern rather than introducing one — but three copies is where it starts to cost."
  evidence: "`function seed(root, { readme = ... })` in check-capability-catalog.test.mjs, mirrored in gen-capability-catalog.test.mjs and by `surface()` in capability-catalog-core.test.mjs"
```

## Gates (fix #3)

- **floor-gate (blocking): none.** `validate.mjs` GREEN; `/pharn-dev-verify` PASS; `/pharn-dev-regress`
  clean. No P0 guarantee lacks a reduction, no eval binding is missing, no sibling reference exists, and
  no guaranteed decision rests on a tainted field.
- **advisory (warn): 4** — 1 important (P3, the accepted axis cost), 3 minor (P0 CI label, P2 residual,
  P3 test-fixture duplication). None is the sole basis for blocking a guaranteed invariant.

## Verdict

**GREEN — 0 floor-gate findings, 4 advisory (1 important, 3 minor).** The increment is structurally
sound and does what it claimed: the two README falsehoods are gone **as a consequence of generation**
(`pharn-core` is no longer called planned; the contract count reads 4 from the filesystem), and a
byte-equality guard now makes their recurrence a RED rather than a slow rot.

## Two things outside the increment, for the human (not review findings)

1. **A broken commit is on `main`.** An external tool (Cursor) committed a partial mid-build snapshot as
   `6b0e7f1` at 23:59:38 — the four source files plus `PLAN.md`/`GRILL.md`, without the test files that
   make them pass. Measured in a detached worktree, that commit fails **6 tests**; the current working
   tree fixes all six (790/790). The remaining files are still uncommitted. This is a **git-history**
   problem, not an increment problem, and rewriting a commit on `main` is the human's call — see the
   post-review gate.
2. **`/pharn-dev-verify` FAILED on its first run** (`format:check`, exit 1), caused by
   `/pharn-dev-regress`'s own unformatted `REGRESSION.md` — no build file was implicated. Recorded in
   `VERIFY.md` rather than quietly re-run.

## Proposed lesson (candidate only — NOT written to canon here)

`/pharn-dev-review`'s scope is `REVIEW.md` alone; promotion requires a separate human-gated
`/pharn-dev-memory-promote` run behind `check-provenance.mjs`.

**Candidate — widen L5 from "quote the list" to "prove the gate ran".**

- **Lesson.** Before trusting an **equal** exit-code pair at base and head, confirm the gate **actually
  executed** (e.g. assert a non-empty test count), not merely that both sides returned the same integer.
  An equal red is indistinguishable from a real `pre_existing` red, and it silently **masks** a genuine
  regression.
- **Why it matters.** This run reproduced L5's failure class through a **new mechanism**: the regress
  gate ran `xargs -a <file> node --test`, and **BSD `xargs` on macOS has no `-a` flag**, so `xargs`
  errored and `node --test` never ran — yielding `tests: 1` on **both** sides. L5 currently names only the
  zsh word-splitting variant, so its remedy ("quote the list correctly") would not have prevented this.
  The invariant that generalises is about **evidence of execution**, not about quoting.
- **Provenance.** feature: `readme-current-state`; surfaced by: this run's `/pharn-dev-regress` capture,
  recorded in `REGRESSION.md` ("A false red was caught and corrected before the verdict"); corrected to
  `xargs node --test < <file>`, confirmed by a separate run reporting 752 tests / 752 pass / 0 fail.
  Related canon: `.dev/memory-bank/lessons-learned.md` **L5**.
- **Real, not hypothetical (P7).** It fired in this run and was caught only because the equal-red pair
  was distrusted on sight.
