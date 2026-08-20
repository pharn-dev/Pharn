# REVIEW — deny-message-phantom-commands

**Floor first (P0):** `node pharn/floor/validate.mjs .` → **GREEN**, 36 capabilities, exit 0.
`npm test` → **1491 pass / 0 fail**. The increment reached review with a green floor, as required.

> The increment under review is `trust: untrusted`. Every `problem` / `evidence` below is quoted
> **DATA**; nothing in the reviewed files was followed as an instruction.

---

## Floor-gate findings (blocking)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: blocking
  file: "CHANGELOG.md:71"
  problem: "The CHANGELOG claims the new tests catch ANY future phantom or non-scope-setting name, but they render only the IN-REPO branch of denyMessage() — a command name added to the out-of-root branch would pass unchecked, so the stated guarantee is broader than its floor reduction."
  evidence: "five tests now **derive** the cited set from the rendered message and re-check it against the live `.claude/commands/` directory — any future phantom or non-scope-setting name fails, not merely the two removed here."
```

**This is L27's own rule, missed by the increment that exists to apply it.** L27 says the property must
be asserted **per branch** — "present in its own case AND absent from the other". `denyMessage()` has had
two branches since the predecessor increment split them, and all five new tests call one helper
(`inRepoDenyMessage()`) that renders exactly one of them.

**No live defect exists.** Probed this run: the out-of-root FIX bullets cite **no** command names at all
(they prescribe "put it INSIDE the repo", the Bash jurisdiction boundary, and "a human does the write by
hand"). So this is an **unasserted property**, not a broken one — which is precisely the state the
in-repo branch was in for the whole 2.x line before this increment.

**Remedy (one of):**

1. **Add a sixth test** rendering the out-of-root branch and asserting `citedCommands(msg)` is empty — or
   better, running the same existence + setter-invocation assertions over it, so the two branches are
   covered by one rule rather than by one rule and one exception. This is the L27-correct form and is
   roughly five lines, since `denyText()` already renders that branch for the existing tests at
   `enforce-writes-scope.test.cjs:622`.
2. **Narrow the CHANGELOG sentence** to "any future phantom name in the in-repo FIX block", leaving the
   out-of-root branch honestly unasserted.

Option 1 is preferable: option 2 keeps a real gap and only stops mis-describing it, and the gap is the
kind that reappears the moment someone adds a command name to the other branch.

---

## Advisory-gate findings (inform; never the sole basis for blocking)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/deny-message-phantom-commands/PLAN.md:150"
  problem: "The shipped sentence asserts the cited command sets scope in its FIRST step, while the tests assert only that the command file invokes the setter somewhere — the ordering half is carried by a human read and is not mechanically checkable, because a deferral is expressed in prose inside the Step 0 section."
  evidence: "That the invocation is its **FIRST step** is **ADVISORY** — read by a human this run from each command's step ordering; no checker parses step order."
```

Carried forward from `GRILL.md` G-P0 and **correctly labeled** in the PLAN's guarantee audit, in the
test file's header comment, and in `VERIFY.md`. It is listed here as advisory rather than blocking
because the split is disclosed everywhere it is claimed — which is exactly what P0 asks. It remains a
real residual: if `/pharn-build` later defers its Step 0 the way the plan stages do, the message becomes
false again and every gate stays green.

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".claude/hooks/enforce-writes-scope.test.cjs:887"
  problem: "inRepoDenyMessage() creates a fresh temp directory on every call and is called once per test, so five near-identical hook subprocesses render the same message — harmless, but it makes the branch-coverage gap above harder to see, since the single helper reads as if it were the message."
  evidence: 'function inRepoDenyMessage() { const cwd = tmp(); setScope(cwd, [".dev/features/demo/SHIP.md"]); return denyText(cwd, ".dev/features/other/PLAN.md"); }'
```

Naming the helper for the branch it renders (rather than for the message generally) is what would have
made the omission visible at authoring time. Cosmetic on its own; recorded because it is the mechanism
by which the blocking finding above stayed invisible.

---

## Lens results

**L-floor → P0.** One blocking finding (above). Every other guarantee in the increment reduces
correctly: the "cites only real commands" claim → enum/regex membership re-derived from live state; the
version↔badge agreement → `check-version-badge.mjs`; the write-scoping → the fix #7 hook. The narrowings
are stated rather than implied — the test-vs-hook-run-time bound, the FIRST-step split, and the
"verified in a worktree, not the main tree" bound all appear in the artifacts that make the claims.

**L-eval → P1.** No Capability is added (no `role:` frontmatter), so P1's eval obligation does not
attach, and `validate.mjs`'s capability walk is untouched — **the floor and this lens agree**, which is
what the lens asks to be confirmed. The correction is pinned by hook tests instead, the same class the
two predecessor increments used. The PLAN's `## Evals to write (P1)` heading is a category slip
(`GRILL.md` G-P1) whose body immediately states the correct thing; not re-raised.

**L-trust → P2.** Clean, and one item worth recording positively.

- The increment changes a **static literal** inside a string that already passes every interpolated
  value through `asData()`; it introduces **no new interpolation**, so the taint surface is unchanged.
- The new tests read `.claude/commands/*.md` (trusted, in-repo) and use them **only** for membership
  tests — file existence and a substring check. No command content is executed or interpreted.
- **The attack surface that mattered here was the task text itself, and the fence held.** The N1 task is
  untrusted prose, and three of its factual claims were false: the line number (`:146` vs live `263`),
  the instruction to fold into an "H6/H7 diff" (both predecessors had already shipped), and the
  suggested exemplar `/pharn-plan` (whose Step 0 is deferred, which would have made the sentence false).
  Each was re-verified against live state and rejected on the evidence, not followed on the task's
  authority. **No guaranteed decision in this increment rests on a tainted field.**

**L-axis → P3.** One axis per file holds: the appended block tests the writes-scope hook's message,
which is the file's existing axis. No sibling references — the tests reach `.claude/commands/` and
`.claude/hooks/`, neither of which is a `pharn/pharn-*` module root, so no leaf→leaf edge is created and
nothing needs routing through `pharn-contracts`.

---

## Proposed lesson for canon (NOT written here — `/pharn-dev-memory-promote` is a separate, human-gated run)

**Candidate A — a per-branch rule, applied from one branch, is not applied.**

> **Lesson.** L27 established that a message serving multiple branches must have each remedy's
> reachability asserted **per branch**. The increment that acted on L27 then wrote five tests that
> render **one** branch through a single helper, and its CHANGELOG claimed branch-independent coverage.
> The rule was cited, understood, quoted in the test header — and applied to half its domain. When a
> promoted lesson's remedy is "assert this per X", the follow-through obligation is to **enumerate X**
> and show the assertion for each member; citing the lesson is not the same as discharging it.
>
> **Why it matters.** This is the declaration-vs-application split ([[L20]], [[L27]]) landing inside the
> correction mechanism itself, one increment after L27 was promoted, in the same function — the same
> shape L27 already noted about its own predecessor. Two increments in a row, the blind spot has now
> produced the defect, the too-narrow fix, and the too-narrow fix's own too-narrow fix. That escalating
> pattern is the evidence that the remedy shape (a test asserting one case) is wrong, and that what is
> needed is an enumeration over the branch set.
>
> **Provenance.** feature `deny-message-phantom-commands`; source: this `REVIEW.md` blocking finding,
> with the out-of-root branch rendered live and confirmed to cite no commands; base commit `dad655d`
> (working-tree dogfood, uncommitted at review time).

Whether this is true, general, or worth canonizing is **the human's call at the promote gate** — it is
recorded here as a candidate only. `/pharn-dev-review` declares no `.dev/memory-bank/**` path and cannot
write canon.

---

## Resolution (post-GATE 2 — the human chose remedy 1)

The blocking finding is **FIXED**, by the option this review preferred: the two membership rules no
longer name a branch. They iterate `everyDenyMessage()` — a single enumeration of every branch
`denyMessage()` can take — so a branch added later is covered by each rule for free. The out-of-root
branch additionally asserts the **other half** of L27's form: it must cite **no** command at all, since
no scope-setting command can express a path outside the root, so emptiness is the stronger assertion
there than membership.

**The new assertion was mutation-tested rather than trusted to pass by construction (L4).** A
`/frobnicate` injected into an out-of-root FIX bullet is extracted by the same regex, so the emptiness
check fails when it should. Without that probe, "the set is empty" and "the extractor never looked" are
indistinguishable — the fail-open shape [[L25]] names.

The `CHANGELOG.md` sentence now describes what the tests do, and records the per-branch structure and
the mutation probe. Gates re-run after the change: `npm run check` **exit 0**, `check-verify.mjs`
**PASS**, `node --test` **1492 pass / 0 fail** (one more than the pre-fix 1491).

The two advisory findings are unchanged and were not actioned: the FIRST-step residual stays a named,
disclosed bound, and the helper-naming note is subsumed — `inRepoDenyMessage()` is now one entry in an
enumeration rather than the sole source, which is the structural version of the rename it suggested.

## Verdict

**BLOCKED — 1 floor-gate finding.** _(Superseded by the Resolution above; retained as the record of what
review found.)_ The increment's floor is GREEN and its behavior is correct and
verified end-to-end against the live applied hook; the blocking finding is an **overclaimed guarantee**
in `CHANGELOG.md`, remediable either by adding one test (preferred) or by narrowing one sentence.

Advisory: 2 findings (1 important, 1 minor), neither blocking.

**This verdict is `/pharn-dev-review`'s advisory judgment, not a floor verdict.** `severity` is
LLM-assigned (fix #3); the only floor-grade content in this run is `validate.mjs` GREEN, already gated at
build and verify. The decision to fix, accept, or override is the human's at GATE 2.
