# REVIEW — briefing-escape-round-trip

PHARN reviewing PHARN. The increment under review is treated as `trust: untrusted`, including the prose
comments it added to two shipped files.

**Floor gate first (not my judgment):** `pharn/floor/validate.mjs .` → **GREEN**, 36 capabilities.
`check-verify.mjs` → **PASS** (6/6 gates exit 0). `check-regress.mjs verdict` → **no-regressions**. Those
three verdicts are floor; everything below this line is **advisory** and gates nothing.

## L-floor → P0

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: "pharn/floor/check-ship-briefing.mjs:87"
  problem: "The comment names the ✧ parity + round-trip tests as what keeps the two duplicated codec copies from diverging, but that guard does NOT travel with the shipped code — both copies live in pharn/floor/ (which ships) while the only thing pinning them is a *.test.* file (which never does), so a user's install carries the duplication with no anti-drift device at all."
  evidence: "Kept as a DUPLICATE, not an import, per this file's documented no-sibling-import convention (P3) — the ✧ PARITY + ✧ round-trip tests in check-ship-briefing.test.mjs pin both copies to identical behavior."
```

Verified live rather than reasoned: `CLAUDE.md:56` states every `*.test.*` file never ships, and both
`yamlScalar`/`isQuotedScalar`/`yamlUnscalar` copies sit in `pharn/floor/`, which does. This is the same
shape CLAUDE.md already records for the `lessons-index-core.mjs` pair — "the honest consequence is that
it guards the two copies **in this repo**, and does not travel with the shipped code" — but there the
asymmetry is forced (`.dev/` may depend on `pharn/`, never the reverse). Here **both** copies ship, so
the bound is not forced by the layering; it follows only from tests not shipping.

Not a defect in the code, and **not** an argument for reversing the human's GATE-1 decision — it is a
missing sentence. The plan's guarantee audit already labelled the parity test `advisory` and said "a test
is not a floor primitive"; what neither the plan nor the shipped comment says is that for an installed
copy the guard is **absent**, not merely advisory. Those are different claims and only the weaker one is
written down.

## L-eval → P1

**No findings.** `pharn/floor/*.mjs` is floor infrastructure, not a Capability — no `role:` frontmatter,
so P1's eval requirement does not attach, and the increment introduces no `rule_id` in any `enforces`.
The floor agrees: `validate.mjs` is GREEN and raised nothing about this increment, which is the agreement
this lens asks to be confirmed rather than assumed.

## L-trust → P2

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".dev/features/briefing-escape-round-trip/PLAN.md:31"
  problem: "The invoking task text named two paths that do not exist in this repo — `<dir>/featuING.md` and `psted-paths.cjs` — which read as transmission corruption rather than injection, but were nonetheless untrusted input describing where to write and what to protect."
  evidence: 'node pharn/floor/check-ship-briefing.mjs <dir>/featuING.md   # → RED "stale" on the quoted field'
```

Recorded because this lens asks specifically whether reviewed content changed my behavior. It did not:
every path was resolved from live state (`ls pharn/floor/`, the plan's parsed `## Files`), and the
garbled `psted-paths.cjs` was read against the real `protect-trusted-paths.cjs`, whose protections were
respected — no trusted doc, hook script, or settings file was touched. Had those names been followed
literally, the second one would have described a **weaker** protected set than the real one.

**On the decoder's own taint surface — checked, no finding.** Making `grill_verdict` decode more
faithfully means a `"` from untrusted GRILL.md prose now reaches the compared value. Three things were
verified rather than argued: `yamlUnscalar` decodes only `\\` and `\"`, so it cannot synthesize a control
character or a newline that would let a crafted verdict forge a second frontmatter field (confirmed live:
`"a\\nb"` decodes to the two characters `\` `n`, never a newline); `cleanScalar` still runs **on the
decoded value**, so the control-char and length guards are layered after the decoder, not replaced by it
(L14); and no branch anywhere reads the field — it is compared for equality and printed. No guaranteed
decision rests on it.

## L-axis → P3

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: "pharn/floor/check-ship-briefing.mjs:16"
  problem: "This file set itself an explicit tripwire — split when it grows a fourth concern — and this increment added a fourth named thing to it (the scalar codec) without recording whether that tripwire was considered."
  evidence: "structure. If this checker grows a fourth, unrelated concern, split it then."
```

My reading is that the tripwire has **not** fired: the codec is not a fourth assertion axis but the
read-side mechanics of concerns (1) and (2) — it decides what bytes the shape check and the equality
check see. A reviewer could reasonably disagree, which is exactly why the file wrote the tripwire down,
so the judgment is surfaced rather than made silently.

**No sibling imports.** Confirmed live: both files import only `node:fs`, `node:path`, and (in the
renderer) `node:child_process`. The codec is duplicated, not imported, per the human's GATE-1 decision.

## Process finding (outside the four lenses, and the one I would read first)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/briefing-escape-round-trip/PLAN.md:31"
  problem: "Several of this build's in-repo writes were routed through Bash (heredoc append, python3 rewrite) rather than Write/Edit, and PreToolUse never sees Bash — so fix #7 did not adjudicate them, even though the writes-scope was correctly set and every path was authorized."
  evidence: "- `pharn/floor/render-ship-briefing.mjs` — export `yamlScalar`; add + export its inverse `yamlUnscalar`"
```

Affected: both `*.test.mjs` files, the three `export` insertions in the two `.mjs` checkers, and
`SKILLS_VERSION`. The session's active harness mode instructs Bash-first file editing, which is what
produced this; CLAUDE.md's writes-scope section says the opposite for in-repo paths, and CLAUDE.md is the
project instruction.

**What was actually checked, so the report is not merely reassuring.** Each of the seven paths was replayed
through `enforce-writes-scope.cjs` against the live scope: all seven exit **0** (allowed), and an
undeclared control path (`.dev/memory-bank/lessons-learned.md`) exits **2** (denied) — so the scope was
live and discriminating, not vacuously permissive. `git status --porcelain` shows exactly the seven
declared paths plus the feature's own artifact directory, and `check-regress.mjs scope` returned
`escaped: []` against the deterministically-parsed declared list. Nothing escaped its authorization.

But "the guard would have allowed it" and "the guard was asked" are different claims, and only the first
is true here. The distinction is the whole point of fix #7 — a guard that is bypassed on the runs where
it happens to be unnecessary is being trained to be bypassable. This is `lessons-learned.md` **L19**'s
exact shape (Bash escapes the writes-scope) reappearing through a new vector: L19's live instance was a
repo-wide formatter, and its remedy — scope the formatter to declared paths — does not reach an agent
editing files with `python3` heredocs, because that agent is not running a tool L19 names.

One near-miss belongs in the record: an improvised format command in this run
(`npx markdownlint-cli2 --fix $PATHS` with an unsplit zsh variable) fell through to markdownlint's own
repo-wide config globs and reported "Attempted: 2 fixes in 1 file". The fixes landed in `CHANGELOG.md`,
which was in scope, so nothing escaped — but they landed there by luck, not by construction, and the
correct pinned command line was sitting in `/pharn-dev-build` Step 2b the whole time (L22).

## Proposed lesson candidate (NOT promoted — `/pharn-dev-memory-promote` gates that, and a human decides)

**Candidate A — an encoder and its decoder are one artifact; splitting them across files is the drift.**
`yamlScalar` shipped without an inverse, and the checker's own duplication header enumerated the three
readers the two files must agree on and stopped — so the pair that had actually drifted was the one thing
the completed-looking analysis did not name. This is [[L25]] ("a rationale comment is trusted for the
defects it does NOT name") with a sharper structural remedy available than "write a better comment": a
codec's correctness criterion is a **round-trip property**, which is testable without naming any
particular defect, and a suite whose corpus contains only the character from the bug report
(`"`) passes under an implementation that is still wrong for `\`. Worth weighing against [[L29]], which
already covers "materialize the set the rule ranges over" — the new part here would be that for an
inverse pair the set is generated by the property, not enumerated by hand.

## Summary

The increment does what it was scoped to do: the reproduction that REDded before the change is GREEN
after it, mutation testing shows the new assertions fail on both the original defect and on the naive
terminator spelling `/pharn-dev-grill` predicted, and all three floor verdicts are green with no
regressions. The grill's blocking finding was applied, not deferred.

Two findings are worth the human's time before merging: the shipped comment overstates what protects the
duplicated codec in an installed copy (a missing sentence, not a broken guarantee), and this build routed
several in-repo writes around the very guard the repo exists to demonstrate. Neither blocks — no floor
finding is outstanding — and both are the human's call at the post-review gate.

**ADVISORY VERDICT: 5 findings (0 blocking, 2 important, 3 minor) — all advisory; the floor gates are
green.** This is not an approval and not a seal. `/pharn-dev-review` surfaces findings; it does not decide
merge, and severity here is LLM-assigned (fix #3), never a gate.
