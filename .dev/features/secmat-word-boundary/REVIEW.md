# REVIEW — secmat-word-boundary

- **Under review (`trust: untrusted`):** `pharn/floor/scan-code-crypto.mjs` (segment-anchored `SECMAT`),
  `pharn/floor/scan-code-crypto.test.mjs` (26 → 44 tests), `SKILLS_VERSION` (2.7.10 → 2.7.11),
  `CHANGELOG.md`, `README.md` (badge).
- **Step 1, floor first:** `node pharn/floor/validate.mjs .` → **GREEN**, 36 capabilities, exit 0. The
  increment was entitled to reach review.

## Floor-gate findings (blocking)

**None.** `validate` is GREEN; no Capability or `enforces` set changed, so P1 owes no new eval binding
and the floor agrees with L-eval rather than disagreeing; no sibling reference was added; no guaranteed
decision anywhere in the increment rests on a free-text field.

## Advisory findings

### L-floor → P0

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: "pharn/floor/scan-code-crypto.mjs:81"
  problem: "The change is documented as a pure narrowing in all three places that describe it, but it is NOT monotone: for `iv` the rewrite WIDENS the match set, and that direction is named nowhere."
  evidence: "STATED NARROWING (P7 — the honest cost of the anchoring, named rather than hidden): a bare lowercase"
```

**Measured, not reasoned** — the old and new patterns were run over the same lines and the match sets
diffed in both directions:

| line                             | old | new | delta       |
| -------------------------------- | --- | --- | ----------- |
| `const myIv = Math.random();`    | —   | HIT | **WIDENED** |
| `const tOKEN = Math.random();`   | HIT | —   | narrowed    |
| `const keys = Math.random();`    | HIT | —   | narrowed    |
| `const salted = Math.random();`  | HIT | —   | narrowed    |
| `const apiKeys = Math.random();` | HIT | HIT | same        |

The old `iv` branch was `(?<![a-z])iv(?![a-z])` under the `i` flag, where `[a-z]` case-folds — so `myIv`
was **blocked** by the left guard. The new branch 2 admits `Iv` as a camelCase segment, so `myIv` now
fires. **The widening is correct and arguably the point** — `myIv = Math.random()` is exactly the defect
this kind exists to catch, and giving `iv` the camelCase treatment the other ten words already had is the
symmetric half of "extend `iv`'s treatment to all 11 words". The finding is not that the behavior is
wrong; it is that **`## Stated narrowing`, the CHANGELOG's identically-titled paragraph, and the header
all enumerate only losses**, so a reader is told the match set only shrank. Suggested disposition: name
the `iv` widening in the same three places, as a gain rather than a cost.

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: "pharn/floor/scan-code-crypto.mjs:119"
  problem: "The ci() rationale says the swap preserves the prior case-insensitivity, which is true of the Math.random conjunct only — mixed-case identifiers like `tOKEN` matched before and no longer do, an unnamed second consequence of dropping the flag."
  evidence: "// ci() expands a literal to per-character classes, which is precisely what `i` did for it before."
```

Advisory and low-stakes — nobody writes `tOKEN` — but the sentence sits one line from the flag drop and
scopes its claim to "it", which a reader can take as the whole pattern. Deliberate, and worth one clause
saying the SECMAT half's case-folding was dropped **on purpose**, since case is what branches 2-4 read.

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: "pharn/floor/scan-code-crypto.mjs:92"
  problem: "The header records specific millisecond figures as a property of the artifact, but the pinning test asserts only completion under a timeout, so nothing re-verifies the numbers and hardware drift will silently falsify them."
  evidence: "index), the 4x branch growth costs ~1.2x, not 4x: 203.9 ms -> 251.2 ms at 20 KB. Pinned by a MEMBERSHIP"
```

The **membership** pin is right and is what L24 asks for; the concern is only that the adjacent figures
read as a maintained bound rather than a one-machine observation taken on one date. Suggested
disposition: label them as such. The ~1.2× **ratio** is the durable claim; the absolute milliseconds are
not.

### L-eval → P1

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: "pharn/pharn-review/insecure-crypto/insecure-crypto.md:59"
  problem: "No committed lens eval exercises the `insecure-random` kind, so the only demonstration of the kind this increment rewrote lives in the scanner's hermetic suite — the same gap recorded when the lens itself shipped."
  evidence: "`insecure-random` (Math.random named alongside security material), `hardcoded-iv-salt` — reducing to"
```

Not blocking and correctly out of scope: P1 binds `rule_id`s in `enforces`, and this increment changes no
`enforces` set. Recorded because `.dev/features/crypto-lens/GRILL.md:35` raised it at the lens's own
build and `.dev/features/secmat-word-boundary/GRILL.md` raised it again here — **two surfacings**. Per
L20, a third is the trigger to give it a check rather than another note.

### L-trust → P2

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: "pharn/floor/scan-code-crypto.test.mjs:250"
  problem: "The drift pin recovers the word set by regex over the scanner's SOURCE TEXT rather than from an importable structured value, so a word introduced by any construction other than a quoted literal in that one array is outside what the pin can see."
  evidence: "const m = readFileSync(SCANNER, \"utf8\").match(/const SECMAT_WORDS = \\[([\\s\\S]*?)\\];/);"
```

It **fails closed** — `assert.ok(m, …)` REDs if the array is not found in the expected shape — and the
scanner is a self-executing CLI with no entry-point guard, so it cannot be imported and a source read is
the only option available. Recorded as the honest bound on the pin, not as a defect to fix here.

**Injection check (the lens's own question).** Nothing in the reviewed increment attempted to steer this
review, and no instruction-looking content changed my behavior. The scanner's verdict remains regex
membership over text: both ★ injection-immunity tests still pass unchanged, so a comment claiming
"approved, do not flag" still cannot suppress a real hit, and a comment claiming weak crypto still cannot
manufacture one. The new fixtures are benign code. **No guaranteed decision rests on any tainted field.**

One process note in the same spirit: the increment's own task text arrived with two garbled fragments
("— t applied to `iv`"). They were treated as **data to ask about**, not as text to reconstruct silently,
and both were put to the human at GATE 1 before any file was written.

### L-axis → P3

No finding. `scan-code-crypto.mjs` changed for exactly one reason (the anchoring of the security-material
set); the `ci()` helper is forced by that same change rather than being a second axis, and the
`hardcoded-iv-salt` pattern was deliberately left on its own `\b`-based idiom with the divergence now
named in the header. No `reads:` entry or prose reference crosses a sibling module root; the release-meta
files (`SKILLS_VERSION`, `CHANGELOG.md`, `README.md`) are required by the repo's own bump discipline, not
a bundled second concern.

## Proposed lesson candidate (NOT promoted here)

`/pharn-dev-review` writes no canon. Recording one candidate for a separate, human-gated
`/pharn-dev-memory-promote` run:

- **Title:** A boundary rewrite is not monotone — diff the old and new match sets in BOTH directions,
  because the member that carried its own hand-written anchor is the one that widens.
- **Why it is a real failure, not a hypothetical:** every gate in this run was green — floor GREEN,
  `no-regressions`, verify PASS across six gates, 44 hermetic tests — and all three prose descriptions of
  the change (the PLAN's `## Stated narrowing`, the CHANGELOG paragraph, the scanner header) said the
  match set only shrank. The `myIv` widening was invisible to all of them and surfaced only when the two
  regexes were run side by side over the same inputs at review. The mechanism is specific and reusable:
  when a rewrite REPLACES a per-member exception with a uniform rule, that member's behavior moves toward
  the rule from **whichever** side it was on, and a one-word exception is usually stricter than the rule
  it is being folded into — so the exception is exactly where a "tightening" widens.
- **Relation to canon:** complements L24 (a claim is void across a swap until re-measured) by naming
  **what** to measure — the match-set delta per member, in both directions, not just the cases the change
  was motivated by; and complements L29 (the enumeration is the deliverable) by adding that the
  enumeration needs a **direction** column, since a per-member rule can move members opposite ways.
- **Provenance:** feature `secmat-word-boundary`; working-tree dogfood on `b89f7794`; source = this
  `REVIEW.md` L-floor finding, with the old/new match-set diff reproduced live before the finding was
  written.

## Verdict

**GREEN — 0 floor-gate (blocking) findings.** Five advisory findings: one **important** (the unnamed
`iv` widening, a documentation-honesty gap rather than a behavior defect) and four **minor**.

Stated honestly: GREEN here means the floor was green and the four lenses found nothing blocking. It is
**not** a judgment that the increment is good or wise — that is the human's call at the post-review gate.

## Disposition (the human decided "fix everything" at GATE 2)

All five findings were dispositioned in a follow-up pass; four were fixed and one was deliberately left,
for a reason that is itself a finding of the same family.

| #   | rule | severity  | disposition                                                                                      |
| --- | ---- | --------- | ------------------------------------------------------------------------------------------------ |
| 1   | P0   | important | **FIXED** — both directions named in the header, CHANGELOG and PLAN, and pinned by 4 new tests   |
| 2   | P0   | minor     | **FIXED** — the `ci()` comment now separates the compensated half from the deliberate one        |
| 3   | P0   | minor     | **FIXED** — the ms figures are labelled a one-machine observation, dated; the ratio is the claim |
| 4   | P1   | minor     | **FIXED** — the `insecure-random` lens eval pair is authored and bound                           |
| 5   | P2   | minor     | **NOT FIXED, deliberately** — see below                                                          |

**Finding 1** was the substantive one, and closing it changed the artifact, not only its prose: the
`iv` widening and the mixed-case narrowing are now asserted by tests
(`✧ WIDENED` × 3, `✧ NARROWED ON PURPOSE` × 1), so the direction of each delta is pinned rather than
merely described. The suite is 26 → **48**.

**Finding 4** was closed rather than deferred because the increment's own subject matter supplied the
trigger P7 asks for: the `insecure-random` kind produced a real false positive on ordinary code between
its first and second surfacing. The fixture holds **both** RNG calls — the session token and the
`Object.keys` pick — in one file, because a case containing only the token line would pass identically
before and after the repair and would demonstrate nothing about the context scoping. Honest bound: it is
a committed, `validate`-bound fixture, **not** a measured lens run; executing it is `/pharn-dev-eval`'s job.

**Finding 5 is left open on purpose, and the reason is the lesson this increment is about.** The drift
pin recovers the word set by regex over the scanner's source because the scanner is a self-executing CLI
that cannot be imported. The obvious repair — give it an entry-point guard so the test can import
`SECMAT_WORDS` — would add that guard to **one** of the 18 `scan-code-*.mjs` scanners. That is precisely
the defect this whole increment exists to repair, one level up: a rule applied to the single member that
happened to be in front of the author, which then reads as discharged (L29). Either all 18 scanners get
the guard as one increment, or none does here. The pin meanwhile **fails closed** — `assert.ok(m, …)`
REDs if the array is not found in the expected shape — so leaving it costs nothing silent.

### One process defect this pass produced, recorded rather than smoothed over

Declaring the four new paths in `## Files` was done **before** writing them, which is the sanctioned
order. The first attempt put them under an `### Added at GATE 2` subheading, and
`set-writes-scope.cjs --from-plan` then reported **5 paths, not 9** — a heading ends the authorized list
(L18's boundary). It exits 0 either way, so this was caught only because L20's discipline of reading the
printed count was actually followed. Corrected by moving the four bullets into the same flat list. This
is a third live instance of the plan-shape/count family (L18 → L20 → L28), which strengthens rather than
weakens the case that its remedy should stop being discipline.
