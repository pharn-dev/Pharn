# REVIEW — guard-coverage

**Step 1, floor first (P0):** `node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities checked`
(exit 0). Standing sibling verdicts: `/pharn-dev-regress` `no-regressions` (base `0323bf9`),
`/pharn-dev-verify` `PASS`. **Everything below the floor line is advisory.**

The increment under review is `trust: untrusted`.

---

## Floor-gate findings (blocking)

```yaml
- type: FINDING # enum-gated (floor-verifiable)
  rule_id: "P0"
  severity: blocking
  file: "CLAUDE.md:260"
  problem: "The sentence claims it 'cannot quietly become false' because a ✧ test pins it — but the test does not pin the step NAME the sentence cites, so renaming the CI step makes the sentence false while the test stays green."
  evidence: "CLAUDE.md: 'as the `Docs drift check` step in `ci.yml` — pinned by a ✧ test in .dev/floor/lessons-index-core.test.mjs, so this sentence cannot quietly become false'. But `grep -n 'Docs drift check' CLAUDE.md .dev/floor/lessons-index-core.test.mjs` matches CLAUDE.md ONLY — the test asserts the step's `run:` and its `if:`, never its name."
```

**This is the smallest possible blocking finding, and the fix is one word — but it is the disease, in the
sentence written to cure the disease.** The substantive claim is genuinely backed: that
`npm run docs:check` runs in CI _is_ pinned, and an edit removing it or disabling it via `if:` fails the
test (both halves measured rejecting a mutated workflow, L4). What exceeds its floor reduction is the
scope word **"this sentence"** — one clause of that sentence, the step's name, is unpinned. A future
`- name: Docs & catalog drift` rename leaves `CLAUDE.md` stating a step that does not exist, injected as
project instructions into every future session, with every gate green.

**Two fixes, either sufficient, both inside this increment's `## Files`:**

1. **Narrow the claim** — drop the step name from the sentence (`…and in CI, pinned by a ✧ test…`), so the
   claim covers exactly what the test asserts. Zero risk.
2. **Widen the guard** — add the step name to the ✧ assertion. Slightly more brittle (a benign rename
   then fails CI until both are updated, which is arguably the point).

Recommended: **(1)**. The step's _name_ is not load-bearing; its _invocation_ is, and that is already
pinned. This increment's own lesson (L2) is that a doc may cite only what is live — the honest move is to
cite less, not to guard more.

---

## Advisory findings (inform; never the sole basis for a block)

### L-floor → P0 / P7 — the run's most consequential finding

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".claude/commands/pharn-dev-build.md:73"
  problem: "Step 2b's stated scope contradicts the command it prescribes — it says to format the just-written files but runs the repo-wide formatter, producing undeclared out-of-scope writes that fix #7 structurally cannot catch."
  evidence: "'Run the project formatter over the just-written files — `npm run format` (prettier `--write`)'. But package.json defines `format` as `prettier --write .` — the whole repo. This run it silently modified `.dev/floor/check-lessons-index.mjs`, a file the approved plan did not name."
```

**Why this matters more than its severity suggests.** It is not a near-miss: it fired, and it fires on
**every** increment that reaches Step 2b, because any unformatted file anywhere in the repo gets swept
into that increment's diff. The mechanism defeats fix #7 by construction — prettier runs through **Bash**,
and the writes-scope hook gates only `Write|Edit|MultiEdit` — so this is PHARN's own stage reaching around
PHARN's own guard, through a door the guard was always documented as leaving open.

**Honest reading of what happened here (P0 — do not overstate the harm either).** The write was a
**repair**: verified live in a worktree, `0323bf9`'s copy of that file **fails `prettier --check`**, so the
baseline was format-RED and both `npm run check` and CI's Format step would have failed on it. Left alone,
**L11 applies in full** — a pre-existing whole-repo style red blocks _every later feature's_ verify. So
Step 2b did something valuable via a mechanism that is wrong. That combination is exactly why it has gone
unnoticed: the outcome is usually good, and the scope violation is invisible unless someone diffs against
the base and investigates rather than records (L16's discipline).

It was **declared, not hidden**: the path was added to the plan's `## Files` with the reasoning, and
`check-regress.mjs scope` re-run to exit 0 with `escaped: []`. Reverting was rejected (it would re-red the
style gate); leaving it undeclared was rejected (L7's dangerous direction).

### L-floor → P6

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/guard-coverage/PLAN.md:16"
  problem: "The PLAN contradicts itself about the regress base — two places still prescribe `--base 0562f9e` while the amendment prescribes `0323bf9` — so the plan read alone yields the wrong, stale baseline."
  evidence: "PLAN.md:16 'is run with an explicit `--base 0562f9e`' and PLAN.md:75 'passed explicitly (`--base 0562f9e`)', versus PLAN.md:27 'The base for /pharn-dev-regress moves from `0562f9e` to **`0323bf9`**.'"
```

The run itself used `0323bf9` (correct — `regression-report.json` records it), so no verdict is affected.
But the PLAN is the **durable, auditable record of intent**, and an audit trail that names two different
baselines for the same stage is worse than one that names a wrong one, because it looks settled. This is
the cost of amending a plan in place rather than re-planning — a trade-off taken deliberately at the
Step-1.3 halt, and worth recording as its price.

### L-axis → P3

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/floor/lessons-index-core.test.mjs:172"
  problem: "The file now holds FOUR repo-integration guards while its name says it tests the core module — the divergence flagged as minor one increment ago has grown rather than been addressed."
  evidence: "The ✧ block now asserts: TYPE_ENUM equality against check-provenance.mjs, package.json's docs:* wiring, both style-ignore entries, and ci.yml's step. Only the first concerns lessons-index-core.mjs. The previous increment's GRILL raised this at three guards; it is now four."
```

Still not a violation — `.dev/floor/` is apparatus, outside the `pharn/ARCHITECTURE.md §4` tree, and the ✧
family's cohesion is a real argument. But the trend is the finding: each increment adds one more, each
individually justified by "it joins the existing ✧ guards." The cheap remedy (split to
`lessons-index-integration.test.mjs`, or a section comment naming the two groups) costs least now.

### L-eval → P1

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/floor/lessons-index-core.test.mjs:180"
  problem: "The ✧ CI guard's fail-closed proof exercised the MATCHER in-memory, not the test's own file-reading path, so the L4 measurement is one step short of end-to-end."
  evidence: "The mutations (`if: false`, reverted `run:`) were applied to an in-memory copy of ci.yml and the regexes run against it. `.github/workflows/ci.yml` is outside this increment's `## Files`, so a true end-to-end proof would have required either a plan amendment or bypassing fix #7."
```

**Recorded as an honest limit, not a lapse** — and the reason is a point in the floor's favour: the only
way to prove it end-to-end was to write a file the plan did not declare, and the correct answer was to
_not_ do that. The matcher is the part that could plausibly be wrong; the `readFileSync` path is exercised
by the passing test. Worth naming so "measured failing" is not read as more than it was.

### L-trust → P2

**No findings. The checks, run rather than assumed:**

- **Did instruction-looking content change my behavior? No.** Nothing in the increment addressed this
  reviewer. Noted deliberately: this increment **writes to `CLAUDE.md`**, which is injected as project
  instructions into every future session — the highest-leverage instruction surface in the repo. The added
  text was read specifically for gate-weakening language (anything that could license skipping or
  downgrading a check) and contains none; the `&&` paragraph documents a limitation and directs the reader
  to _re-run after fixing_, rather than to tolerate a second RED.
- **No new untrusted ingestion.** The one new read is `.github/workflows/ci.yml` — repo-controlled,
  trusted by provenance. The verdict over it is a **regex match on bytes**, never prose meaning, so a
  hostile workflow edit fails the test rather than steering it.
- **The prior increment's taint path is unchanged** — canon titles → `docs/lessons-index.md` → the plan
  stage, fenced as DATA, no decision reading the title column.

---

## Verdict

**BLOCKED — 1 floor-gate finding.**

The increment does what it set out to do and does it carefully: the wiring is real and pinned, both halves
of the new guard were **measured rejecting** a mutated workflow (L4), the four CLI tests were measured
failing against the pre-`0323bf9` checker, and the mid-run precondition failure was halted on and taken to
the human rather than papered over. The regress stage's one surprise was investigated to root cause
instead of recorded.

It is blocked on a **one-word overclaim** in `CLAUDE.md` — the sentence says it cannot quietly become
false, and one clause of it can. That is a small defect and a proportionate block: this increment exists
because a `CLAUDE.md` sentence claimed a CI guarantee that did not hold, and the replacement sentence
claims a guard slightly wider than the one it has.

**Not done** until F1 is resolved. The four advisory findings are for the human to weigh; none blocks —
though **F2 will recur on the next increment and every one after it**.

---

## Proposed lesson candidate (NOT written to canon — `/pharn-dev-review` holds no canon scope)

> Proposed only. Promotion is a separate, human-gated `/pharn-dev-memory-promote` run under its own scope,
> behind `check-provenance.mjs` and an explicit accept/deny. The model never self-promotes (P2).
> **Note:** Candidate A from `.dev/features/lessons-index/REVIEW.md` (a PLAN's exclusion subsection must be
> a heading) is **still unpromoted**; this is a second, independent candidate.

### Candidate B — a stage's Bash-run tooling escapes `writes:` scope, and repo-wide formatters are the live instance

**Lesson (draft).** fix #7 gates `Write|Edit|MultiEdit` only, so **any tool a stage invokes through Bash
writes outside the writes-scope unchecked** — and `/pharn-dev-build`'s Step 2b does exactly that today: it
says "run the project formatter over the **just-written files**" while prescribing `npm run format`, which
is `prettier --write .` over the **whole repo**. Every increment that reaches Step 2b silently rewrites any
unformatted file anywhere in the tree and sweeps it into that increment's diff. Either scope the command to
the written files (`npx prettier --write <paths from the plan's ## Files>`) or declare the repo-wide sweep
honestly as an accepted, out-of-scope side effect — but do not let the prose say "just-written files" while
the command says otherwise.

**Why it matters (draft).** It is the `writes:`/scope family's **fourth distinct failure axis**: L3 is a
declaration too narrow, L7 a declaration too broad, L8 the setter's one-`--target` resolution, Candidate A
the PLAN's own formatting — and this one is a write that never passes the gate at all. It is the most
dangerous of the five in principle, because the other four are visible in a declaration a human can read,
while this one leaves no trace except a file in the diff nobody declared. Concretely this run: Step 2b
reformatted `.dev/floor/check-lessons-index.mjs`, a file the approved plan did not name, and it surfaced
only because `check-regress.mjs scope` reported it and the result was **investigated rather than recorded**
(L16). The outcome was benign and in fact useful — `0323bf9` had been committed format-RED, so the sweep
repaired a red that would have blocked every later feature's verify (L11) — and that benign-usefulness is
precisely why it has survived unnoticed: the mechanism is wrong, the result usually looks right.

**Suggested tags (#114 shape, for the human to ratify — the floor checks shape, never aptness):**
`type: scoping` · `concepts: [writes-scope, bash-escape, formatter]`

**Provenance (draft).**

- feature: `guard-coverage`
- commit: `0323bf9f63d6fb63e79d8aeab9de6d8a3bcd60fd` (working-tree dogfood built on this commit)
- source: `.dev/features/guard-coverage/REGRESSION.md` ("A scope escape that was real, benign, and is now
  declared") + this `REVIEW.md` F2; the format-RED baseline reproduced live in a `git worktree` at
  `0323bf9` before the claim was made.
