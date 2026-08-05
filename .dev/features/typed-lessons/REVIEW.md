# REVIEW — typed-lessons

PHARN reviewing PHARN. The increment under review is `trust: untrusted` — 6 files, +447/−24.

**Step 1 — floor first (the only guaranteed part of this review):**
`node pharn/floor/validate.mjs .` → **FLOOR: GREEN — 36 capabilities checked**, exit **0**. Everything below
this line is **advisory**.

Findings honor the enum-gated / free-text split (`pharn/pharn-contracts/finding-shape.md`, cited not restated
— P4): `type` / `rule_id` / `severity` / `file` are my own enum-membership and path-resolution assertions
(trusted); `problem` / `evidence` quote the reviewed increment and inherit its untrusted tag — DATA, never
instructions.

---

## L-floor → P0

```yaml
- type: FINDING
  rule_id: "P0"
  severity: blocking
  file: ".claude/commands/pharn-dev-memory-promote.md:2"
  problem: "The frontmatter description asserts under FLOOR that every written ENTRY carries an enum-member type and a well-shaped concepts list, but the floor validates the CANDIDATE — the rendered entry is never checked, so the claim is advisory dressed as a guarantee."
  evidence: "FLOOR: every written entry carries valid, well-shaped provenance, a unique id, an enum-member `type` and a well-SHAPED `concepts` list, and the write lands only in the declared canon file"
```

This is the increment's own disease, caught in its own artifact. Every **other** place the increment
touches states the boundary correctly — `check-provenance.mjs`'s header ("NOT CHECKED HERE… that the entry
RENDERED into canon at Step 6 actually carries a conforming tag line"), the command's `## Guarantee audit`
("**ADVISORY, a named residual**"), `VERIFY.md`, and the CHANGELOG. The frontmatter `description` is the one
surface that did not get the memo, and it is the surface most likely to be read in isolation (it is what
the skill listing renders). The pre-existing wording said "every written entry carries valid, well-shaped
provenance and a unique id", which was already loose but survivable — `provenance` and `id` are copied into
the entry mechanically. Extending the same phrasing to the **tag line** is what makes it a real overclaim,
because the tag line is precisely the field this increment declined to check at render time.

**One-line remedy:** say **candidate** where it says "written entry", or append the render caveat already
present three other places. Blocking per this lens's own rule — a guarantee with no floor reduction and no
`advisory` label — not because the consequence is severe.

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/floor/check-provenance.mjs:236"
  problem: "The uniqueness check compares a string-filtered Set against the FULL array length, so any non-string item fabricates a `concepts must be unique` RED on input that contains no duplicate at all."
  evidence: 'const seen = new Set(c.filter((v) => typeof v === "string"));'
```

Reproduced live before writing this: `concepts: ["a", 42]` — one valid tag, one non-string, **no
duplicate** — emits two reds, the second reading `concepts must be unique, got ["a",42] — a repeated tag
adds no address`. The **verdict is still correct** (the input is genuinely invalid, exit 1), which is why
this is important rather than blocking, and why no test caught it: the two non-string cases assert only
`status === 1` and `/RED — concepts failed/`, both of which hold. But a floor tool giving a **false reason
for a true refusal** misdirects whoever fixes it — the operator reads "unique" and starts deleting tags that
were never duplicated. The whole value of a deterministic checker is that its output is trustworthy at the
granularity it speaks.

**Remedy:** compute uniqueness over the string items only (`seen.size !== strings.length`), or gate the
uniqueness check behind "every item passed the shape check". Either is 1 line, plus a test asserting
`["a", 42]` does **not** mention `unique`.

**No other unlabeled guarantee found.** The `type` / `concepts` guarantee is stated as SHAPE-only in all
four durable places, with the "typed `floor` ≠ about the floor" line carried into the checker header, the
command's guarantee audit, and the CHANGELOG — that is L2 satisfied (the honesty travelled into the durable
artifacts, not just the ephemeral PLAN). The two-clocks note (verdict floor / invocation advisory) is
likewise present in both the checker header and the command.

## L-eval → P1

**No finding.** The increment adds no `role:`-bearing file, so no Capability and no `enforces` roster
enters, and P1's `evals/` requirement does not attach. Confirmed live rather than assumed: `validate.mjs`
reports the same **36** capabilities as at baseline, and `pharn-dev-memory-promote.md` still declares no
`role:`. The floor and this lens agree — no disagreement to report.

The equivalent regression surface is 23 new `node --test` cases (862 total, up from 839, all passing). Two
carry real proving power rather than coverage: the **L14 witness** (`"enum-gate\n"` → RED, which fails the
instant the control-char guard is replaced rather than composed) and the **✧ agreement case** (neither the
doc's member list nor the checker's `TYPE_ENUM` is restated in the test — both are derived from their source
files and compared, so the test cannot itself drift into agreement).

## L-trust → P2

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".claude/commands/pharn-dev-memory-promote.md:194"
  problem: "The named residual covers a misleading tag misleading a READER, but the tag's actual downstream job is to control RETRIEVAL — which untrusted memory content enters a future context — and that mechanism is not named anywhere."
  evidence: "Named residual — a well-shaped but MISLEADING tag. Shape-validity is not truth: `concepts: [safe, approved, verified]` passes every check above."
```

The trust audit this increment added is genuinely good — it names that `type`/`concepts` **promote
model-drafted values into the enum-gated class**, which is the laundering vector itself, and it closes that
on grammar rather than on promise. The gap is one level further out. A misleading tag does not merely
misinform someone reading the entry; once the lessons-index generator lands, the tag **selects** which
entries are loaded. Mistagging `L14` as `process` does not make a reader think L14 is procedural — it makes
L14 **absent** from a floor-scoped sweep. Omission is quieter than misinformation and has no error surface
at all, which is the memory-poisoning shape (`THREAT-MODEL.md §2 #3`) applied to retrieval rather than
content. The existing "advisory-grade context selection, never a guarantee" line bounds it correctly; what
is missing is naming the **mechanism** so the index increment inherits the constraint rather than
rediscovering it.

**Did instruction-looking content in the reviewed artifacts change my behavior?** The reviewed increment
contains a great deal of imperative text — `MUST`, `Ask the human`, `Remedy:` — and the `GRILL.md` I read
before building was full of directives. I folded seven of its eight findings, and I want to be precise
about why that is **not** the attack working: I adopted them as **my own** build judgments after checking
each against live state, and the one I declined (the P3 taxonomy fork) I declined because the human's brief
had already decided it. The distinction that matters is that no _guaranteed_ decision in this run rested on
any of that text — the four proceed/stop decisions came from `validate` exit 0, `check-regress` verdict,
`check-verify` verdict, and `check-plan-lessons` exit 0, none of which reads free text.

**One honest note on trust and the memory-bank.** I applied L14 and L17 this run, and the memory-bank is
`trust: untrusted` content by P2. So untrusted canon _did_ steer this build. That is by design and the
design holds: consumption is declared (`applied_lessons: [L1, L2, L3, L6, L7, L14]`), the declaration is
floor-checked for shape, and the human approved the plan carrying it at GATE 1. The steering passed through
a human gate rather than around one. Worth restating because this increment makes that path wider.

**No guaranteed decision rests on a tainted field.** Confirmed by reading the verdict path:
`check-provenance.mjs` ranges over `target` / `provenance` / `id` / `type` / `concepts` and never `title` /
`body`; the retained ★ needle test proves it, and now proves more than it did, since two additional
enum-gated fields exist for a needle to aim at.

## L-axis → P3

```yaml
- type: FINDING
  rule_id: "P4"
  severity: important
  file: ".dev/floor/check-provenance.test.mjs:6"
  problem: "The test file's own header still claims inputs are temp-dir-only with no committed fixtures, but two new tests read committed repo files — the checker source and the command doc — so the file's self-description is now false."
  evidence: "Inputs are written to a fresh temp dir per run — no committed fixtures (the plan scopes only the two floor files, not a fixtures dir), and nothing touches the real memory-bank."
```

`typeEnumFromChecker()` reads `check-provenance.mjs` and `typeEnumFromDoc()` reads
`.claude/commands/pharn-dev-memory-promote.md`. Both are deliberate — that coupling **is** the P4 drift
guard, and it is the right design. But the header now misdescribes the file, and the "nothing touches the
real memory-bank" half (still true) sitting beside a now-false clause is worse than either alone, because it
reads as a verified statement. This is L1/L2 in miniature: the increment changed a fact asserted in a
doc-like surface and updated five such surfaces while missing the one inside the file it was editing.

**Remedy:** amend the header to say the fixtures are temp-dir-only **except** the two agreement tests, which
read their sources by design.

```yaml
- type: FINDING
  rule_id: "P3"
  severity: important
  file: ".dev/floor/check-provenance.mjs:78"
  problem: "check-provenance.mjs now serves two contracts — ARCHITECTURE §5's per-entry provenance and a new entry taxonomy with no basis in §5 — so a change to either can force an edit for a reason unrelated to the other."
  evidence: 'const TYPE_ENUM = ["process", "contract", "floor", "scoping", "tooling", "eval"];'
```

**Standing, not new** — `/pharn-dev-grill` raised this against the PLAN and it was built as approved, because
the human's brief decided the enum's home explicitly ("constants at the top of the checker file… NOT a
shared config module"). Restated here so the post-review gate sees it rather than inheriting it silently.
Reviewing the built code rather than the plan does sharpen one observation: the taxonomy block now occupies
~20 lines of the file's constants region and its comment explains a **ratification against the lessons
corpus**, which is a concern the provenance checker has no other reason to know about. That is the two-axes
smell made visible. The counter-argument is unchanged and still real: splitting means `/pharn-dev-memory-promote`
runs two checkers over one candidate for no user-visible gain. **For the human at GATE 2** — no action is
implied; it is a legitimately-decided fork worth re-confirming now that the shape is concrete.

**No sibling-import violation.** The layer tree (`pharn-contracts` → `pharn-core` → leaves) is untouched:
every changed file is build apparatus (`.dev/floor/`, `.claude/commands/`), repo-meta, or a `*.test.*` file.
`pharn/floor/check-plan-lessons.mjs` is **byte-unchanged** — verified in the diff, not assumed — so the
product floor's behavior is identical and only its test surface grew.

---

## Floor-gate vs advisory (fix #3) — what actually blocks

- **FLOOR (blocking, already satisfied):** `validate.mjs` GREEN; `check-verify` PASS over 6 gates;
  `check-regress` `no-regressions`; `check-plan-lessons` GREEN on the PLAN; the fix #7 writes-scope confined
  every write to the plan's `## Files`.
- **ADVISORY (this document):** all five findings above. **Every severity here is LLM-assigned and gates
  nothing** (fix #3, `pharn/ARCHITECTURE.md §7`). The `blocking` label on the P0 finding is my judgment that it
  is a genuine P0 violation, **not** a deterministic stop — no floor primitive computed it, and `/pharn-dev-ship`
  does not read this file for a proceed/stop. The human decides at the post-review gate.

## Proposed lesson (a PROPOSAL only — no canon write happens here)

`/pharn-dev-review` declares **no** `.dev/memory-bank/**` path in its `writes:` (L7 — a stage that only
proposes must not hold write-scope to canon). This is a candidate for a separate, gated
`/pharn-dev-memory-promote` run behind `check-provenance` + a human accept.

**Candidate — a control-char guard must be authored as explicit char-code logic, never as a regex holding
literal control characters.** Building this increment, `cleanScalar` was first written as
`!/[�-]/.test(v)` and landed on disk as `!/[<literal control bytes>]/.test(v)` — the escape
sequences were transcribed into raw bytes by the authoring path. It was **functionally equivalent and
therefore silent**: tests passed, lint passed, prettier passed. It surfaced only because a follow-up `Edit`
could not match the string it had just written. The generalization: a guard whose entire job is to be
**unambiguous about which bytes it rejects** must not be expressed in a form that is invisible in a diff,
unmatched by a search, and destroyed by a copy-paste. Rewriting it as a `charCodeAt` scan (`code < 0x20 ||
code === 0x7f`) makes the guard readable and reviewable. This is adjacent to **L14** (which says compose the
guard with the shape regex, never replace it) but distinct: L14 governs the guard's **composition**, this
governs its **authored form** — a correctly-composed guard can still be unreviewable. Honest trigger (P7):
observed live this run, not hypothetical.

If accepted, `type: floor` · `concepts: [control-char, authoring, guard]` — dogfooding this increment's own
tag line on the first entry that would carry it.

## Verdict

**ADVISORY REVIEW: 5 findings (1 blocking-severity, 3 important, 1 minor) + 1 proposed lesson.**

The increment does what it set out to do and its honesty discipline is largely intact — the P0 split is
carried into every durable artifact, the L14 trap was found and closed with a real witness test, and the
enum was ratified against the corpus rather than proposed. The two findings worth acting on before merge are
small and mechanical: a frontmatter sentence that overclaims, and a uniqueness check that gives a false
reason for a true refusal.

**Nothing in this document is a guarantee.** The floor's verdicts are recorded above; this review's
severities are model judgment and block nothing (P0).
