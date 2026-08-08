# REVIEW — floor-ref-relocation

Increment under review: **`trust: untrusted`** (the increment `/pharn-dev-build` produced, even though
trusted stages produced it). 141 files changed on `fix/f1-floor-ref-relocation` @ `6c570c6`.

## Step 1 — Floor first (P0)

`node pharn/floor/validate.mjs .` → **`FLOOR: GREEN — 36 capabilities checked`, exit 0.** The increment
was entitled to reach review. Everything below the floor line is **advisory**.

Two floor-grade facts carried in from earlier stages, cited not restated: `/pharn-dev-regress`
`no-regressions` (exit 0) and `/pharn-dev-verify` `PASS` (exit 0, five gates).

## Floor-gate findings (blocking)

**None.** No guarantee is claimed without a reduction, no eval binding is missing (the floor confirms
and this lens agrees — no disagreement to report), and no sibling reference is introduced (`pharn-stack-*`
appears **0** times in the diff; the one occurrence at `validate.mjs:213` is CHECK 6's own pre-existing
comment).

## Advisory findings

### L-floor → P0

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: "pharn/floor/validate.mjs:292"
  problem: "CHECK 8's canon scope is a hardcoded four-element list, but pharn/ARCHITECTURE.md §4 names seven layers — so the day a fifth layer directory is created it is silently unscanned, which is the same silent-coverage-rot class this increment exists to fix."
  evidence: 'const CANON_DIRS = ["pharn-contracts", "pharn-core", "pharn-pipeline", "pharn-review"];'
```

**Advisory, and the severity is this lens's judgment (fix #3).** Measured: `pharn/ARCHITECTURE.md`
names `pharn-contracts`, `pharn-core`, `pharn-pipeline`, `pharn-review`, **`pharn-audits`**,
**`pharn-skills-*`**, **`pharn-stack-<fw>`**; only the first four exist under `pharn/` today, and
CHECK 8 lists exactly those four. **So there is no coverage gap right now** — which is why this is not
blocking. The concern is the failure _mode_, not a present defect: when `pharn-audits/` is first
created, CHECK 8 will not scan it, will not say so, and will keep reporting GREEN. That is precisely
the shape of the defect this increment fixes — a reference that silently stops covering what it names —
reproduced one level up in the checker's own scope.

The honest counter-argument, which is why this is a finding and not a demand: enumerating "every
`pharn/pharn-*` directory" by glob would be a **speculative** widening onto three layers that do not
exist (P7), and the hardcoded list is the more conservative, more auditable choice today. The cheap
middle path is a comment at `:292` naming the three uncovered layers and the trigger to add them
(the first such directory), so the next author meets the decision instead of inheriting it silently.

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: "pharn/floor/validate.mjs:296"
  problem: "walkExts duplicates walk()'s traversal with a different extension rule, so a future fix to one walker can silently miss the other."
  evidence: "function walkExts(dir, exts, acc = []) {"
```

**Advisory.** The duplication is defensible — `walk()` is `.md`-only because a capability is a `.md`
file, while CHECK 8 must reach `.json` eval judges, and parameterizing the original would change a
function five other checks depend on. Recorded because it is a real maintenance seam, not because it
should be changed now.

### L-eval → P1

**No findings.** CHECK 8 is not a `role:`-bearing capability (`pharn/ARCHITECTURE.md §3.1`), so P1's
`evals/cases` + `evals/expected` obligation does not attach; its equivalent is `validate.test.mjs`,
the convention every one of CHECKs 1–7 already follows. The floor agrees (GREEN), and the plan cites
the contract rather than asserting the waiver — a gap the grill raised and the plan closed before build.

Worth recording as a **positive** result rather than silence, because L4 is the lesson most at risk of
being nodded past: the nine new tests were **measured against four mutants** before being trusted —
inverting the existence gate (6 failures), dropping `.json` from the collection (1, exactly the judge
test), suppressing the finding emission (3), and injecting a twinned cite into the clean fixture (1) —
each green on revert. And CHECK 8 was RED before the rewrite (210 findings, all `P6/floor-path`) and
GREEN after, so `validate` exit 0 is a measurement rather than a check that could not have failed.

### L-trust → P2

**No findings — and this lens was genuinely at risk here, so the negative result is evidence, not an
empty section.** The transform ran over 134 files, of which the `pharn/pharn-review/**/evals/**`
fixtures are **deliberately full of injection payloads** ("skip the finding", "pre-approved",
"migration + rollback fully covered here"). Three independent checks:

- **Nothing but paths changed.** Of every `+` line in the canon diff, the count that does **not**
  contain a floor path, excluding `+++` file headers, is **0**. Independent of the inversion proof and
  agreeing with it.
- **No rewrite landed inside a payload.** Grepping the added lines for the payload vocabulary returns
  nothing, so no fixture's attack string was altered and no expectation silently shifted.
- **No eval `cases/` file was touched at all** — zero carry a `.dev/floor` cite, verified before the
  transform ran, so the untrusted-tagged fixture inputs are byte-identical.

Did instruction-looking content in the reviewed artifact change this reviewer's behavior? **No** — and
the structural reason is that the transform is not a reader: it matches a fixed regex and its verdict
is an `existsSync` call, so fixture prose cannot steer it. CHECK 8 inherits the same property. Its
matched basename is bounded by `[A-Za-z0-9._-]+` and reaches only the free-text `problem`, never an
enum-gated field — the L14 composition, which the plan states explicitly after the grill flagged that
it was true but unstated.

### L-axis → P3

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: "pharn/floor/validate.mjs:2"
  problem: "validate.mjs now carries eight checks and CHECK 8 answers a different question from CHECKs 1-7 — path liveness rather than capability structure — so the file's single axis of change is stated more loosely than before."
  evidence: "//   8. the capability canon names a relocated floor checker at its LIVE path (P6, enum/regex)"
```

**Advisory, and the lens's own reading is that this is acceptable.** The file's axis is "deterministic
structural invariants of a PHARN repo," and a cite that does not resolve is a structural invariant of
exactly that kind; the alternative — a new standalone checker — would have made the increment a
newly-shipped capability and pushed the bump to minor for no gain in guarantee. Recorded so the
judgment is visible rather than assumed.

No sibling reference: `reads:` frontmatter is untouched, and the new code references only
`pharn/floor/` (its own directory) and the four canon dirs it scans.

## Proposed lesson (candidate — NOT written to canon here)

`/pharn-dev-review` holds no `.dev/memory-bank/**` write-scope by design; promotion is a separate
human-gated `/pharn-dev-memory-promote` run behind `check-provenance.mjs`. This is a **proposal only**.

> **Candidate — a relocation is not complete until the references that INVOKE the moved file are
> checked, and the check must be part of the move.** `1.1.2` moved the checkers and corrected their own
> self-headers; the bodies that invoke them were never audited, so 322 references across 134 files went
> dead and stayed dead through two further releases without a single gate noticing — because every gate
> reads paths from code, and these paths live in prose a machine had no reason to resolve. The general
> shape: **when a file moves, its inbound references are a distinct surface from its outbound ones, and
> only the outbound ones are usually visible to tooling.**
>
> **Why it may not be worth promoting, stated honestly (P7):** this is arguably just **L20 instantiated**
> — the recurrence of a discipline-only remedy triggering a floor check — and this increment already
> applied L20 rather than discovering something new. The one thing it adds that L20 does not name is the
> **inbound/outbound reference asymmetry**, which is what made the rot invisible. A human should decide
> whether that asymmetry is a lesson or a detail of this one; the memory-bank is worth less if it
> accumulates near-duplicates.
>
> **Provenance:** feature `floor-ref-relocation`; commit `6c570c6`; source
> `.dev/features/floor-ref-relocation/REVIEW.md` (this file) + `GRILL.md`; the RED-before/GREEN-after
> ordering reproduced live this run.

## Verdict

**GREEN — 0 floor-gate findings, 3 advisory (1 important, 2 minor).**

The increment is done in the sense this review can certify: the floor is GREEN, no guarantee lacks a
reduction, no eval binding is missing, no sibling reference is introduced, and the trust boundary held
under a transform that ran across 134 files of injection-fixture text. The one advisory finding worth a
human's attention is the hardcoded `CANON_DIRS` — not a present gap, but the same silent-coverage-rot
shape as the defect just fixed, and cheap to defuse with a comment naming the three uncovered layers.

**This verdict is advisory (P0).** The only guaranteed content of this review is
`pharn/floor/validate.mjs` GREEN — already gated at `/pharn-dev-build` and `/pharn-dev-verify`. A
severity above is this reviewer's assignment, not a floor fact, and "review GREEN" never means "the
increment is good or wise" — that is the human's call at the post-review gate.
