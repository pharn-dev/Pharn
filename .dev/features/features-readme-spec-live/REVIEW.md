# REVIEW — features-readme-spec-live

**Step 1, floor first (the only guaranteed part of this review):** `node pharn/floor/validate.mjs .` →
**GREEN**, 36 capabilities, exit 0. Everything below is **advisory**.

> The increment under review is `trust: untrusted`. Every `problem` / `evidence` quotes it as DATA.

## Floor-gate findings (blocking)

**None.** No guarantee is claimed without a floor reduction; no eval binding is missing; no sibling
reference exists; no guaranteed decision rests on a tainted field.

## Advisory findings

### L-floor → P0

No finding. The increment claims no guarantee. Its two substantive assertions are **factual claims
about repo state** (`/pharn-spec` exists; `features/` is empty until used), not protection claims, so
the floor-or-advisory test resolves by not applying — and the PLAN's guarantee audit labels the
truth-of-the-prose claim `advisory` explicitly, naming the live reads it rests on instead of implying a
checker stands behind it.

Worth recording because it is the increment's real hazard: a docs fix is the one change shape where
"the gates are green" is most tempting to read as "the text is right," and every artifact in this run
states the opposite.

### L-eval → P1

No finding, and the floor agrees (no disagreement to report). `features/README.md` has no
`---`-fenced frontmatter, therefore no `role:` — it is not a Capability, so the "≥1 eval case +
expected" obligation does not attach, and it declares no `enforces` rule id owing a producing fixture.
Read structurally from the file, not from the plan's claim about it (L6). `validate` counted the same
36 capabilities before and after, which is the expected signature of a change that adds none.

### L-trust → P2

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".dev/features/features-readme-spec-live/PLAN.md:1"
  problem: "The build request contained a garbled, truncated sentence at the exact point where it prescribed the replacement wording, and the increment resolved it by inference rather than asking — the terminal fallback P6 reserves for ambiguity is a question, not a reconstruction."
  evidence: 'The request text: ''rewrites "Until then" (which implied non-existence) to "Until a usethe empty-fresh-clone fact). Do not reflow the rest of the file.'' — two clauses collapsed mid-word. Read as ''Until a user runs it'' plus ''keeping the empty-fresh-clone fact''.'
```

**Why it is minor rather than important:** the same message carried the intended replacement
**verbatim** in a block quote immediately above the garbled line, so the ambiguity was resolvable from
the message itself by comparison, not by guessing at intent — and the shipped sentence matches that
quoted text. The finding stands anyway because "resolvable by inference" is precisely the reasoning
that erodes halt-and-ask; recording it is cheaper than relying on the next garble being equally
redundant.

**Did instruction-looking content in the reviewed artifacts change behavior?** No. Neither
`features/README.md` nor `CHANGELOG.md` contains instruction-shaped content. The directives in this run
came from the human invoker (scope limits, banned words), which is legitimate steering, not injected
content from a reviewed file.

**Two request premises were rejected rather than inherited**, which is the discipline working in the
direction it exists for: the stated `SKILLS_VERSION 2.4.6` was live **2.5.1**, and the
`pharn/floor/README.md` half presented as needing confirmation was already fixed. Neither changed the
fix; both are recorded in the PLAN's trust audit so no downstream stage inherits an unverified premise.

### L-axis → P3

No finding. `features/README.md` carries one reason to change (the product pipeline now ships);
`CHANGELOG.md` records that same change under the file's own "all notable changes are documented"
contract. No sibling reference: the increment touches no module and adds no `reads:` entry, so there is
nothing to route through `pharn-contracts`.

### Precision of the shipped wording (advisory, outside the four lenses)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: "features/README.md:18"
  problem: "The reworded sentence asserts the directory is empty, but a fresh clone's features/ contains the README the reader is holding — the claim is true of product-pipeline artifacts, not of the directory literally."
  evidence: "features/README.md:18 — '`/pharn-spec` writes the first `SPEC.md` here. Until a user runs it this directory is empty — the declared home for product-pipeline artifacts'. The pre-change text carried the same imprecision in a softer grammatical position ('the declared, empty home for product-pipeline artifacts')."
```

**Not a regression — an inherited imprecision made slightly more assertive.** The old wording attached
"empty" to "home for product-pipeline artifacts", which scopes it; the new wording states it of "this
directory" before the scoping clause arrives. No reader is misled in practice (they are reading the
file that disproves the literal reading), and the surrounding clause supplies the scope. Flagged so the
human can decide at the gate; a one-word remedy exists — "this directory holds no feature folders" — but
`/pharn-dev-review` does not edit built files, so it is not applied here.

## Proposed lesson candidate (NOT promoted — `/pharn-dev-memory-promote` is a separate, human-gated run)

**Candidate:** _A doc that says a capability is "not yet built" is a dated assertion with no expiry —
the moment it ships, the doc silently becomes false, and only the four trusted docs have a checker
that notices._

**Why it qualifies under L20's escalation rule (a real recurrence, not a hypothetical).** The repo
already met this failure and already built a remedy — `#128` (commit `2b4fec8`, the immediately
preceding commit) found four trusted docs asserting floor primitives that do not exist and answered
with `.dev/floor/check-specified-markers.mjs`, which binds those claims **both** directions. That
remedy's scope is the **four trusted docs plus a hand-maintained manifest**. Everything else in the
repo keeps the discipline-only remedy, and L20's finding is that a discipline-only remedy **will**
recur. It did, twice in this run's sweep alone:

- **Fixed here:** `features/README.md:8` and `:18` — the product pipeline described as under
  construction, in the guide a user reads first.
- **Found, deliberately not fixed:** `pharn/pharn-contracts/finding-shape.md:81` — "that wiring is
  increment **3c, not yet built**", while `/pharn-dev-eval:125` and `/pharn-verify:210` both invoke
  `check-structural.mjs` over an emitted `findings.json` today, and canon **L4** records two live runs
  of exactly that. This one is **product surface**, so it bumps `SKILLS_VERSION` — its own increment.
- **Found, judgment call:** `.claude/commands/pharn-ship.md:350` — "`--loop` … is a **separate
  follow-up increment**", while `/pharn-loop` ships that capability under a different name. The literal
  claim ("not part of this command") remains true; the framing reads as unbuilt.

**The asymmetry that makes it interesting, and the honest objection to its own remedy.** The existing
checker is possible because a _specified-but-absent primitive_ has a manifest of names to check
existence against. A prose "not yet built" has no such handle — the phrase names a **increment id**
(`3c`) or a **command**, and only the command case reduces to a file-existence test. So the candidate
remedy is narrower than the failure: a checker could bind "a doc says `/pharn-X` is unbuilt" to
"`.claude/commands/pharn-X.md` does not exist" — deterministic, primitive #3, no new floor kind — and
would have caught `features/README.md:18` and `pharn-ship.md:350`, but **not** `finding-shape.md:81`,
whose referent is an increment id no file existence test resolves. Promoting the lesson should not
imply the remedy is complete; that gap is the P7-honest part and belongs in the entry.

**Provenance for the promote run:**

- feature: `features-readme-spec-live`
- commit: `unknown` at review time (working-tree dogfood; base `2b4fec89cbd68e03544b9bad4254360ee029f040`)
- source: this `REVIEW.md`, plus `.dev/features/features-readme-spec-live/PLAN.md`'s `## Files`
  exclusion block (which records the two deferred sites) and the L1 sweep run at plan time
- relates to: **L20** (discipline-only remedies recur; the second occurrence is the trigger to give it
  a floor check) and **L1** (an increment must scope the meta-docs it invalidates — the sweep that
  found all three sites)

## Verdict

**GREEN — 0 floor-gate findings, 2 advisory findings (both minor).** The increment is complete as
scoped: the two false sentences are corrected, `SKILLS_VERSION` is untouched at 2.5.1,
`pharn/floor/README.md` is untouched, and the full `npm run check` is green.

Stated plainly, because this is the increment where it matters most: **the gates prove the repo is green
with the new bytes in it; they do not read the sentences.** That the sentences are now true rests on the
live command-directory read recorded in the PLAN and CHANGELOG, and that evidence is advisory.
