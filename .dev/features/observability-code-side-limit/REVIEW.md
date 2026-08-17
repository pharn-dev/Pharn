# REVIEW — observability-code-side-limit

PHARN reviewing PHARN. Four inline principle-lenses over the increment, which is treated as
`trust: untrusted` — including the build prompt that drove it.

## Step 1 — Floor first (P0)

```console
$ node pharn/floor/validate.mjs .
FLOOR: GREEN — 36 capabilities checked in .   (exit 0)
```

Standing verdicts from the chain: `/pharn-dev-build` → `validate` exit **0**; `/pharn-dev-regress` →
`.verdict` **`no-regressions`**; `/pharn-dev-verify` → `.verdict` **`PASS`** (8/8 gates, 1380 tests).

## L-floor → P0 (the governing lens)

The increment claims **no** new guarantee — it authors no capability, no checker, no hook. That makes
this lens's job unusually narrow, and the risk correspondingly specific: the danger is not an
unbacked guarantee but an **overstated absence**.

**Every claim the increment makes, audited:**

| Claim                                           | Reduction                          | Verdict                                        |
| ----------------------------------------------- | ---------------------------------- | ---------------------------------------------- |
| "PHARN never checks observability against code" | none — verified by live instrument | correctly **not** called a guarantee           |
| "No telemetry sink is configurable"             | none — exhaustive grep, recorded   | stated as measurement, not floor               |
| "The repo is green with this in it"             | `check-verify.mjs` exit 0          | **FLOOR**, correctly cited                     |
| "The `.dev/` records are true"                  | none                               | labeled **ADVISORY** in the PLAN's audit       |
| "`LIMITS.md` §5 is accurate"                    | none                               | labeled **ADVISORY**, with F5's residual named |
| "Choosing B was wise"                           | none                               | **struck** in the PLAN's audit                 |

No finding. The PLAN's `## Guarantee audit (P0)` labels every non-floor claim and strikes the one
overclaim a reader would be tempted to make. **Clean.**

### F1 (advisory) — an absence claim is a perishable guarantee

```yaml
- type: FINDING
  rule_id: P0
  severity: minor
  file: ".dev/features/observability-code-side-limit/LIMITS-5-PROPOSED.md:1"
  problem: "The proposed LIMITS §5 asserts a state of the world ('no scan-code-* counterpart exists') that a single future increment can falsify, and nothing in the floor will notice when it does."
  evidence: "check-specified-markers.mjs GREEN output, read live: 'this proves the LISTED annotations still match reality. It never means the docs are accurate — an overclaim not in the manifest is invisible here.' §5 adds no manifest entry because it names no primitive."
```

**ADVISORY.** Already surfaced as `GRILL.md` F5 and deliberately not remedied — a manifest entry
would be false, since the manifest's contract is about primitives that _ship_ while their markers
remain. The mitigation is §5's explicit reopen trigger. Recorded here so the residual appears in the
review record and not only in the grill.

## L-eval → P1

The increment ships **no Capability**, so P1 is satisfied vacuously: there is no `role:`-bearing file,
hence no `enforces` list, hence no `rule_id` needing an eval binding. Confirmed against the floor
rather than asserted — `validate.mjs` reports **36 capabilities checked**, the same count as at base
(`b7626d4`), so the increment added none.

**Agreement check (the lens is required to confirm the floor agrees):** `validate` GREEN and the lens
reach the same conclusion. No disagreement. **Clean, no finding.**

Worth stating because it is the honest cost of Option B: had Option A been chosen, this lens would
have had real work — three eval trios and a `rule_id: P2` binding to verify. Its emptiness here is a
consequence of the decision, not evidence the decision was safe.

## L-trust → P2 (targets unknown #1 / the residual)

**Did instruction-looking content in the reviewed input change behavior?** The build prompt is
untrusted input and it contained directives that were **not** followed, each for a stated reason:

| Prompt directive                                            | Disposition                                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| §5 "a new lens **bumps `SKILLS_VERSION`**"                  | **Not followed.** Conditional on the lens option; nothing product-surface landed. `GRILL.md` F3. |
| §1 "`SKILLS_VERSION` was `2.5.4`"                           | **Rejected as false.** Live `2.6.0`.                                                             |
| §1 "Grounded at `08f6fd1`"                                  | **Rejected as stale.** HEAD `b7626d4`.                                                           |
| §2 floor-able = "**the configured** sink"                   | **Rejected as unsatisfiable.** No sink is configurable. `GRILL.md` F1.                           |
| §6 "Correct explicitly any claim ... that turned out wrong" | **Followed.**                                                                                    |

This is the correct posture: the prompt's _instructions_ were weighed, its _assertions about repo
state_ were re-measured, and where the two conflicted the measurement won. Nothing in it was executed
on assertion.

**One instance of the attack nearly working, reported because noting it is the defense.** The prompt's
§3.2 contains a stop-clause — _"If such a lens or scanner already exists, stop and tell me — this
prompt is void."_ Discovery found `scan-code-swallowed-exception.mjs:286`'s `LOG_HEAD`, a genuine
code-side logger read. The pull was to resolve that ambiguity **silently** in the direction that let
the work continue. It was instead surfaced at HALT 1 as an explicit question to the human (P5's
terminal fallback — ask, never guess), and the human's "go" resolved it. Had it been decided silently,
a P6 halt-and-ask would have been skipped on exactly the question the prompt reserved for its author.

**Free-text handling.** Every finding in `GRILL.md` and this file confines untrusted content —
including the prompt's own false claims and the quoted scanner internals — to `problem` / `evidence`.
No enum-gated field carries prompt-derived text. No guaranteed decision in this run rested on a
free-text field: all three proceed/stop decisions read `validate`'s exit code, `regression-report.json`
`.verdict`, and `verify-report.json` `.verdict`.

**Clean, no blocking finding.**

## L-axis → P3

**One axis of change per file?** Yes. The increment's only two non-record writes are `CHANGELOG.md`
(one entry, one axis: recording a change) and `LIMITS-5-PROPOSED.md` (one axis: the proposed text and
how to apply it). No existing file gained a second reason to change.

**Sibling references?** None introduced. The increment adds no `reads:` field, no module, and no
cross-module path. The `.dev/` records _mention_ `pharn/pharn-review/`, `pharn/floor/`, and
`pharn/pharn-pipeline/grillers/` by path — but `.dev/**` is not a module in the layer tree
(`validate.mjs` excludes it wholesale), so these are citations in an apparatus record, not leaf→leaf
references. The proposed §5 text likewise cites floor scripts by path from a trusted **doc**, which is
the same posture `LIMITS.md` §1a/§1c already take.

**Clean, no finding.**

### F2 (advisory) — the deferred design would itself have had a P3 question

```yaml
- type: FINDING
  rule_id: P3
  severity: minor
  file: ".dev/features/observability-code-side-limit/PLAN.md:1"
  problem: "The rejected Option A would have placed two lenses in a deliberate mutual dependency — the new lens's scope defined as the complement of swallowed-exception's classifier — which is a leaf-to-leaf coupling P3 forbids, and the plan does not name that as a cost."
  evidence: "The HALT-1 design specified: 'if swallowed-exception would fire (empty / log-only) -> skip it', making the new scanner's behavior a function of a sibling scanner's classification rather than of pharn-contracts."
```

**ADVISORY, and it strengthens the decision rather than undermining it.** The disjoint-partition
construction was presented as Option A's most elegant property; on P3 review it is also its most
serious architectural liability — the partition is only disjoint as long as the two classifiers stay
in lockstep, and nothing in `pharn-contracts` would hold them there. A parity test pins constants, not
behavior. **This was not identified at HALT 1 and is recorded now** so that if the reopen trigger
fires, the design restarts with this cost visible rather than rediscovering it.

## Floor-gate vs advisory-gate (fix #3)

- **floor-gate (blocking): none.** No P0 guarantee lacks a reduction; no eval binding is missing (none
  exists to be missing); no sibling reference; no guaranteed decision rests on a tainted field. The
  three deterministic verdicts are GREEN / `no-regressions` / `PASS`.
- **advisory-gate (warn): F1, F2**, plus `GRILL.md` F1–F5. All rest on judgment or on named residuals.
  None blocks. Per fix #3 none of them could flip a verdict even if it were severe — `check-verify.mjs`
  reads only gate exit codes, and `/pharn-dev-review` emits no machine verdict at all.

## Proposed lesson candidate (NOT promoted — that needs a gated `/pharn-dev-memory-promote`)

**Candidate: `git status --porcelain` collapses untracked directories, so a scope check fed by it
reports a false escape.** This run, the first `check-regress scope` call produced a **blocking** P0
finding — _"the build escaped its plan's `## Files`"_ — that was entirely an artifact of input capture:
git reported the untracked directory `.dev/features/observability-code-side-limit` as one entry, and
that literal path is not in `## Files` (which names files). `-uall` expanded it to its four real files
and the escape set went empty.

**Why it is worth canon.** L5 already says a floor verdict is only as trustworthy as the orchestration
that captures its inputs, but its provenance is a _shell word-splitting_ instance (`xargs`/zsh). This
is a distinct axis — **a VCS tool's own output-compaction** — reaching the same checker. And it fails
in the direction L17 warns about most sharply: it trains the operator to wave through the one finding
that must never be waved through. A future entry would name the remedy as `-uall` (or deriving the
changed set from `.pharn/writes-scope.json` rather than from git status at all).

**Deliberately not promoted here.** The model never self-promotes; `/pharn-dev-memory-promote` runs the
provenance floor and halts for human accept/deny. Recorded as a candidate only.

## Verdict

**No blocking findings.** Four advisory findings across grill and review, all named and none remedied
by silence. The chain's three deterministic verdicts are GREEN, `no-regressions`, `PASS`.

`/pharn-dev-review` emits no structural verdict and none is invented here (fix #3) — its `severity`
values above are LLM-assigned and advisory. The merge/fix/abandon decision is the human's at GATE 2.
