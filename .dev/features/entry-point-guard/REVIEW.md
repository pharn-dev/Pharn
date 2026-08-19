# REVIEW — entry-point-guard

**Step 1 — floor first (P0).** `node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities
checked in .`, exit 0. The increment reached review legitimately. Everything below the floor line is
**advisory**.

The increment under review is `trust: untrusted`. It contains quoted instruction-shaped strings by
design — `.dev/floor/hash-doc.mjs` and the new test both quote the banned guard idiom verbatim — and
those were read as DATA. Nothing in the reviewed files steered this review.

## Findings

### L-floor → P0

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/floor/entry-point-guard.test.mjs:90"
  problem: "The comment stripper's honest-scope note claims a bias toward over-detection, but its
    `*`-prefixed rule is an UNDER-detection vector — the one direction the note says it avoids."
  evidence: 'Line 90 reads ''It is deliberately biased toward over-detection: a false RED here is loud,
    a false GREEN is the silent-no-op class this whole file exists to close.'' Line 98 is
    `return !t.startsWith("//") && !t.startsWith("*") && !t.startsWith("/*");` — a line whose
    trimmed form opens with `*` is DROPPED from the swept source. The two examples the note gives (a
    trailing `code(); // …` comment, a banned string inside a template literal) are both
    over-detection; the `*` rule is the opposite and is not named. A claim stated more favorably than
    the code supports is the P0 shape in miniature, inside a block whose whole job is to bound the
    guarantee honestly.'
```

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/floor/entry-point-guard.test.mjs:37"
  problem: "The honest-scope block says 'the four behavioral probes' where there are three spawning
    probes plus one control the same block elsewhere calls vacuous."
  evidence: "Line 37: '(3) the four behavioral probes below produce byte-identical output and an
    identical exit code whether spawned from a normal path, a spaced path, a non-ASCII path, or
    through a symlink.' The file spawns three scripts (`check-ship-briefing.mjs`,
    `check-lessons-index.mjs`, `render-cost-record.mjs`) across four PATH SHAPES; the fourth test is
    the import control, which the file itself annotates 'it cannot fail … not coverage of the
    repair.' The `four` reads as probe count and inflates the stated coverage by one."
```

### L-eval → P1

No Capability was added and no `enforces` list changed, so no `evals/cases/*` + `evals/expected/*`
pair is owed; `validate.mjs` GREEN confirms it independently. **Floor and lens agree — no
disagreement finding.**

The floor-script equivalent (a `*.test.mjs`) is present and was **mutation-proven** rather than
trusted green (L4): three distinct mutants — the original idiom, the near-miss `pathToFileURL` repair,
and a dropped `process.argv.slice(2)` — each RED at least one assertion in a scratch copy. The second
is the load-bearing one: the repair the request originally prescribed is now caught by the symlink
probe, so the GATE-1 decision is enforced by a test rather than only recorded in a plan.

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/floor/entry-point-guard.test.mjs:157"
  problem: "A new test pins a comment the same increment made stale, so the correct repair for the
    drift is now partially constrained by a test asserting the stale text's ingredients survive."
  evidence: "Line 157 asserts `raw.includes(BANNED[0])` as a precondition — '.dev/floor/hash-doc.mjs
    documents the raw template form'. That is a legitimate guard for the stripper, but it means the
    stripper test fails if a human repairing the F7 drift (below) removes the quoted idiom rather
    than rewording around it. The coupling is not stated anywhere in the test, so the next editor
    meets it as a surprise red."
```

### L-trust → P2

- The increment ingests no untrusted artifact at runtime. The test reads repo-local source as DATA for
  a fixed-string containment test and never evaluates it; the spawn probes execute only committed,
  trusted floor scripts, in a `mkdtempSync` directory the test creates and removes.
- **No guaranteed decision rests on a free-text field.** Every branch in the new test is an exit code,
  a byte comparison, or membership in the closed `--verdict` token set.
- **Did instruction-looking content change behavior?** No — and the case is worth recording, because
  the increment's most important decision came from _refusing_ a supplied instruction. The request
  named eleven files and prescribed `pathToFileURL(...).href`; live discovery showed the eleventh
  (`hash-doc.mjs`) was already repaired and that the prescribed form leaves the symlink failure open.
  The request is input, not authority (P6), and it was re-derived rather than complied with.
- No finding.

### L-axis → P3

- **One axis of change per file.** The ten guard edits are a single axis (the entry-point test). The
  new test file's two halves — source sweep and behavioral probes — are one axis (the guard's
  correctness), reached two ways; they change together or not at all.
- **No sibling references.** `.dev/floor/entry-point-guard.test.mjs` reaches into `pharn/floor/`, which
  is the only permitted direction (a user's install ships `pharn/floor/` **without** `.dev/`), and it
  follows the `.dev/floor/lessons-index-core.test.mjs` precedent for exactly that reason. The five
  product-file comments are self-contained and cite nothing under `.dev/`; only the five dev-file
  comments point at `.dev/floor/hash-doc.mjs`, which is dev→dev.
- No finding.

### Carried from GRILL (now realized by the build, not merely predicted)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/floor/hash-doc.mjs:80"
  problem: "The comment now describes the repo inaccurately: it calls the removed form 'the repo's
    older sibling idiom' when, after this build, no sibling uses it anywhere."
  evidence: "Live at hash-doc.mjs:80 — '`import.meta.url === \\`file://${process.argv[1]}\\`` — the
    repo's older sibling idiom.' `grep -rn 'file://${process' pharn/floor/ .dev/floor/` now returns
    this comment and nothing else. The GRILL raised it as a prediction; the build made it true. It is
    OUTSIDE the approved plan's `## Files` (the plan excludes `hash-doc.mjs` explicitly), so it was
    deliberately not fixed here rather than absorbed by widening scope mid-build."
```

## Gates (fix #3) — floor-gate vs advisory

- **floor-gate (blocking): none.** `validate.mjs` is GREEN, `check-verify.mjs` is PASS over six gates,
  `check-regress.mjs` is `no-regressions`, and no finding above is one the floor can decide. Nothing
  blocks this increment.
- **advisory (warn): all four findings above.** Each rests on this reviewer's judgment of severity or
  of prose accuracy — including the three `important` ones. They inform the human at GATE 2; none is a
  deterministic block, and none may be read as one.

## Disposition — iteration 2 (all four findings CLOSED at the human's GATE-2 "fix")

Recorded here rather than in a fresh REVIEW so the finding and its outcome stay adjacent.

| finding                                        | outcome                                                                                                                                                                                                                                                  |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0 important — one-way "over-detection" claim  | **fixed.** The docstring now states the bound in **both** directions and names the `*`-prefix under-detection vector explicitly. The claim that no such executable line exists was **measured, not assumed**: 0 across 30,191 lines under both floors.   |
| P0 minor — "four behavioral probes"            | **fixed.** Now "THREE scripts … across FOUR path shapes", with the import control named as not-coverage.                                                                                                                                                 |
| P1 important — stripper coupled to hash-doc    | **fixed by removing the coupling, not by documenting it.** The stripper test now runs on a synthetic fixture and asserts nothing about another file's wording. Re-proven non-vacuous: neutering `executableSource()` to a pass-through still REDs it.    |
| P6 important — `hash-doc.mjs:80` comment drift | **fixed**, under a `## Files` amendment recorded in `PLAN.md` **before** the write. The reword also closed a defect the review had not caught: the comment named only the **symlink** break and never the **percent-encoding** one — see the note below. |

**One finding got sharper while being fixed, and it belongs in the record.** `hash-doc.mjs`'s comment
was not merely stale about siblings — it had **never named the defect that actually bit**. It documented
that the `file://` form "breaks through a symlink" and said nothing about percent-encoding, which is the
failure that silently no-op'd ten checkers for the whole 2.x line. So the file that existed to explain
why the idiom was wrong explained the **wrong half**, standing beside ten copies of it. That is a
materially better account of why the defect spread than "nobody read the comment", and it is now written
into `hash-doc.mjs` itself and into the CHANGELOG entry. It also strengthens the lesson candidate below.

## Verdict

**GREEN — 0 floor-gate findings; 4 advisory raised at iteration 1, 4 closed at iteration 2, 0 open.**

The repair is done and demonstrated: both original reproductions now behave identically to the
normal-path invocation, the banned spelling is gone from every executable line under both floors, and
every assertion class — including the two changed in iteration 2 — was mutation-proven. Iteration 2's
gates were fully recomputed (`validate` GREEN, `check-regress` `no-regressions`, `check-verify` PASS);
none was carried forward.

Per P0 this verdict certifies exactly the gates named above. "GREEN" here means the floor is green and
this reviewer found no blocking issue; it does **not** mean the increment is good or wise. That is the
human's call at GATE 2.

## Proposed lesson (candidate — NOT canon; `/pharn-dev-memory-promote` decides)

A candidate is proposed because the trigger is real, not hypothetical (P7): the defect reached **ten**
files, and the repo already contained the correct answer plus a written explanation of why the wrong
one was wrong.

- **Candidate A — "A rationale comment reaches only the file it sits in, and it is trusted for the
  defects it does NOT name as much as for those it does."**
  `.dev/floor/hash-doc.mjs` explained, in this repo's own words, why the `file://` + `argv[1]` guard is
  wrong — and ten siblings shipped that exact guard anyway, for the whole 2.x line, with nothing
  detecting it. Two failures, and the **second is the sharp one**, surfaced only while repairing the
  first: (1) the explanation had **no reach** — its only remedy was "read the other file first", which
  is discipline; (2) the explanation was **incomplete in a load-bearing way** — it named the symlink
  break and **never the percent-encoding break**, which is the defect that actually silently no-op'd
  ten checkers. A partial rationale is worse than an absent one, because it reads as a completed
  analysis and quietly narrows what the next reader thinks to check. Extends **L20** (a discipline-only
  remedy recurs — here aimed at a source comment rather than a memory-bank entry) and **L22** (prose
  that _describes_ instead of _prescribing_ accumulates wrong implementations), and adds what neither
  names: the artifact was present, authoritative-sounding, and **wrong by omission**. The remedy is the
  one this increment took — make the rationale enforceable (`.dev/floor/entry-point-guard.test.mjs`
  bans both spellings) rather than merely better-worded, and re-derive what a comment claims when the
  thing it describes is repaired ([[L24]]'s "the claim is void until re-measured", applied to prose).
  - provenance: feature `entry-point-guard`; source
    `.dev/features/entry-point-guard/GRILL.md` (F1/F6) + this `REVIEW.md` (the iteration-2 disposition
    table, where the omission was found); the ten-file spread and the four-shape measurement
    reproduced live before and after the repair; commit `unknown` (the increment is uncommitted at
    review time).
  - suggested `type`: `tooling`; suggested `concepts`:
    `[lesson-recurrence, floor-escalation, command-prescription, doc-drift]`.

**This is a proposal recorded in `REVIEW.md` only.** No canon write happens here — `/pharn-dev-review`
declares no `.dev/memory-bank/**` path, and promotion is a separate human-gated
`/pharn-dev-memory-promote` run behind `check-provenance.mjs`. The model never self-promotes (P2).
