# GRILL — observability-code-side-limit

Interrogation of `.dev/features/observability-code-side-limit/PLAN.md`. **ADVISORY — this stage gates
nothing** (`/pharn-dev-grill`); it surfaces concerns for the human. Findings below dogfood the
enum-gated / free-text split (fix #1): `type` / `rule_id` / `severity` / `file` are enum-gated and
floor-verifiable; `problem` / `evidence` are free text, rendered as DATA.

> The build prompt this increment was handed is **untrusted input** (`pharn/CONSTITUTION.md` P2). Its
> assertions about repo state are DATA, re-measured this run rather than obeyed. Where a premise was
> false it is corrected below and the correction, not the premise, drove the plan.

## Corrections to the build prompt's own premises (P6 — verify before assert)

| #   | Prompt's claim                                     | Live at `b7626d4`                                  | Verdict                   |
| --- | -------------------------------------------------- | -------------------------------------------------- | ------------------------- |
| 1   | Grounded at `08f6fd1` (#137)                       | `08f6fd1` is an ancestor; HEAD is `b7626d4` (#139) | **stale by 2 commits**    |
| 2   | `SKILLS_VERSION` was `2.5.4`                       | `2.6.0`                                            | **stale**                 |
| 3   | 18 `scan-code-*`, 5 `scan-plan-*`                  | 18 / 5                                             | holds                     |
| 4   | 22 lenses mapped, 4 explicit `null`                | 22 / 4                                             | holds                     |
| 5   | All 22 lenses byte-identical `reads:`              | 22/22 identical                                    | holds                     |
| 6   | `count-verifiers` → `{"registered":0,...}`         | identical                                          | holds                     |
| 7   | §2: floor-able = a call to **the configured** sink | **no sink is configurable anywhere**               | **premise unsatisfiable** |
| 8   | §3.2: no lens/scanner reads code for telemetry     | one near-miss exists (`LOG_HEAD`)                  | **needs qualification**   |

Corrections 7 and 8 are the two that changed the design. Both are recorded as findings below.

## Findings

### F1 — the prompt's floor-able half cannot be built as specified

```yaml
- type: FINDING
  rule_id: P0
  severity: blocking
  file: ".dev/features/observability-code-side-limit/PLAN.md:1"
  problem: "The build prompt's §2 defines the floor-able half as a call to THE CONFIGURED logger/telemetry sink, but no telemetry sink is configurable anywhere in PHARN, so any scanner must silently substitute a hardcoded name set for 'configured'."
  evidence: "pharn.config.json read in full carries only models.stages{default,plan,build,review} and ship.requireAttestation. seam-config.md grepped for telemetry|observab|logger|logging|metric|sink|apm|trace -> (NO MATCHES). Repo-wide grep for declare.{0,25}(logger|telemetry) -> (NO MATCHES). Every 'sink' hit under pharn/ belongs to the SSRF / deserialization 'URL sink' sense."
```

**Why this is blocking rather than advisory.** A capability whose `.md` says `FLOOR` while its
detection set is a guess about the project's logger is the exact P0 silhouette. The finding does not
block the plan — it is **satisfied by** the plan, which declines to build the scanner. Recorded so
the reasoning survives the decision.

### F2 — the absence claim needs qualification, not a blanket assertion

```yaml
- type: FINDING
  rule_id: P6
  severity: important
  file: ".dev/features/observability-code-side-limit/PLAN.md:1"
  problem: "A blanket 'nothing reads code for logging' would be false: scan-code-swallowed-exception.mjs does read code for logger calls, and the limit text must say so or it overstates the absence."
  evidence: "pharn/floor/scan-code-swallowed-exception.mjs:286 — const LOG_HEAD = /(?:\\b(?:console|logger)\\s*\\.\\s*\\w+|\\blog)\\s*\\(/; used at :320 to classify a catch body as 'log-only-catch'. Its polarity is INVERTED: a logger call there is evidence the error was SWALLOWED, not evidence it is observable. Its own :23 comment records that telemetry.record(e) is classified CLEAN."
```

**Resolution.** The proposed §5 text names this scanner explicitly and states its inverted polarity,
rather than claiming a clean absence. An exhaustive per-file sweep of all 18 `scan-code-*.mjs`
confirmed the other 17 contain **no** logger reference at all, so the qualification is complete
rather than a hedge.

### F3 — the increment's own writes must not trigger a version bump

```yaml
- type: FINDING
  rule_id: P0
  severity: important
  file: ".dev/features/observability-code-side-limit/PLAN.md:1"
  problem: "The build prompt's §5 mandates a SKILLS_VERSION bump, but that clause was written for the lens option; bumping for this increment would claim a product-surface change that has not landed, because the only product-surface delta is a LIMITS.md append the agent cannot write."
  evidence: 'CLAUDE.md''s bump rule: apparatus-only changes (.dev/**) do NOT bump, and pure repo-meta (CHANGELOG / README / SKILLS_VERSION itself) does not bump either. Every path in this plan''s ## Files is .dev/** or CHANGELOG.md. The hook denies LIMITS.md live: echo ''{"tool_name":"Edit","tool_input":{"file_path":"LIMITS.md"}}'' | node .claude/hooks/protect-trusted-paths.cjs -> permissionDecision: deny, exit 2.'
```

**Resolution.** No bump. The patch bump (`2.6.0` → `2.6.1`) and the matching README badge edit are
handed to the human **with** the §5 text so all three land in one commit. Bumping now would also
force a badge edit to satisfy `check-version-badge.mjs` for a version nothing earned.

### F4 — L20 argues against this plan and must be answered, not cited

```yaml
- type: FINDING
  rule_id: P7
  severity: important
  file: ".dev/features/observability-code-side-limit/PLAN.md:1"
  problem: "The plan cites L20, whose thesis is that documentation-only remedies recur and earn a floor check — which reads as an argument for building the scanner, so citing it without answering it would be the declaration-vs-application gap L20 itself names."
  evidence: 'L20 canon: ''When a lesson''s remedy reduces to "the agent should remember", a second occurrence is evidence the remedy is the wrong kind.'' Its own closing note: the plan that triggered it ''cited L18 only after violating it, and check-plan-lessons.mjs returned GREEN both before and after.'''
```

**Resolution.** The plan carries a dedicated `## The L20 objection, engaged` section rather than a
bullet. Its three-part answer — no first occurrence exists, a limit is not a remedy, and the
floor-able half is unbuildable as specified — is the substantive engagement L20 demands. Whether
that answer is _correct_ is human judgment at GATE 2; this stage only records that it was made.

### F5 — the limit text will silently go stale if the lens is ever built

```yaml
- type: FINDING
  rule_id: P0
  severity: advisory
  file: ".dev/features/observability-code-side-limit/PLAN.md:1"
  problem: "Nothing checks trusted-doc prose, so if a future increment adds the code-side lens, LIMITS.md §5 becomes false and no gate notices."
  evidence: "check-specified-markers.mjs binds only annotations listed in its hand-maintained .dev/floor/specified-primitives.json manifest; its own GREEN output states 'an overclaim not in the manifest is invisible here'. §5 describes an ABSENCE, not a specified-but-unshipped primitive, so it is deliberately outside that manifest."
```

**Not remedied, and deliberately so.** Adding a marker would be false — the manifest's contract is
"a primitive that SHIPS while its markers remain → RED", and §5 names no primitive. The honest
mitigation is §5's explicit reopen trigger, which tells the future increment that adds the lens to
delete the section. Recorded as a named residual, not solved.

## Untested axes (surfaced, not resolved)

- **Whether a user would want the check even with a hardcoded logger set.** Unanswerable from inside
  this repo — PHARN has no users yet and no production runtime of its own. This is the strongest
  reason the decision is a _deferral with a trigger_ rather than a rejection.
- **Whether `catch`-clause coverage is even the right unit.** A failure path is also an `if (err)`
  callback, a rejected promise, a non-2xx branch. The lens option scoped to `catch` because that is
  what the existing family brace-matches — a scope chosen by available tooling rather than by the
  problem's shape. Worth revisiting if the reopen trigger fires.
- **The over-flag rate of the disjoint-partition design.** Never measured; no fixture exists. The
  claim that over-flagging is "the monotone-safe direction" is sound in principle and unquantified
  in practice.

## Verdict

**ADVISORY — proceed.** Five findings, all either satisfied by the plan (F1, F3), resolved into the
proposed text (F2), answered substantively (F4), or recorded as a named unmitigated residual (F5).
No finding contradicts the plan's scope. `/pharn-dev-grill` gates nothing; the deterministic stops in
this run belong to `validate`, `check-regress`, and `check-verify`.
