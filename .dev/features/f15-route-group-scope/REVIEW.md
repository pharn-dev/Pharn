# REVIEW — f15-route-group-scope

## Step 1 — Floor first

`node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities checked in .`. The increment reached review with a green floor (also independently confirmed by `/pharn-dev-verify`'s `validate` gate). Proceeding to the four advisory lenses.

## L-floor → P0

```yaml
- type: FINDING
  rule_id: P0
  severity: important
  file: "CHANGELOG.md"
  problem: "The CHANGELOG entry's compatibility claim ('Nothing an existing install newly-REDs') is stated as flat fact, but the same claim in PLAN.md's own Guarantee audit is explicitly labeled `advisory` (a reasoned argument about existing-install behavior, not something a floor primitive verifies across all possible prior inputs) — the shipped prose doesn't carry the hedge its own plan gave it."
  evidence: "Nothing an existing install newly-REDs. A route-group `writes:` entry that was silently and incorrectly under-scoped now scopes correctly — a fail-closed-on-a-valid-layout defect becoming correct, never the reverse. A space-separated annotation still strips identically to before."
```

This is a labeling-hygiene gap, not a substance error: the underlying claim is true and follows directly from `\s+` being a strict subset of `\s*`'s matches (the only behavior removed is the zero-space case, which is exactly the bug). No floor primitive backs "no existing install regresses" as a general claim, so per P0 it should read as advisory, the way `PLAN.md`'s own guarantee audit already treats it. **Not blocking** — nothing downstream reads this sentence as a guarantee to act on, and the reasoning is sound; it is worth tightening in a future pass over this CHANGELOG entry, not worth re-opening the increment for.

No other P0 gap found. Every other claim in the built artifacts reduces cleanly: the fix itself → enum-regex + a measured mutant test (floor); the self-lock → hook (`protect-trusted-paths.cjs`, confirmed live); the regression-comparison → `check-regress.mjs`'s exit-code diff (floor); the verify PASS → `check-verify.mjs`'s exit-code threshold (floor).

## L-eval → P1

Not applicable in the Capability sense: `.claude/hooks/*.cjs` are dev tooling, not `role:`-bearing Capabilities under `pharn/pharn-*`, so P1's eval-per-Capability + `enforces`-binding requirement doesn't apply (confirmed: `pharn/floor/validate.mjs` scans `pharn/` only and stayed GREEN without touching these files). Coverage instead comes from `node --test`: `set-writes-scope.test.cjs` grew from 33 to 37 tests, and the two new "survives intact" tests were confirmed to fail against a live-reverted `\s*` mutant and pass again once restored (measured, not just authored — L4). No finding.

## L-trust → P2

The increment under review is `trust: untrusted` by this stage's own framing. Nothing in the diff resembles an injected instruction (no comments telling a reviewer to skip a finding, no fenced blocks posing as directives) — this is a straightforward regex fix with test/doc/version companions, not adversarial input. No instruction-looking content was encountered, so nothing was at risk of being followed. `GRILL.md`'s own finding earlier in this run correctly quoted plan text as data rather than acting on it. No finding.

## L-axis → P3

Every touched file changes for exactly one reason serving this one increment: the hook's regex (the fix), its test file (proof of the fix), `CHANGELOG.md` / `SKILLS_VERSION` / `README.md` (the version-story record the fix requires). No sibling `reads:`/reference crosses module roots — these are hooks and repo-meta, outside the `pharn-contracts` tree entirely, so P3's leaf→leaf constraint doesn't have a tree to violate here. No finding.

## Verdict

**GREEN — 0 blocking floor-gate findings, 1 non-blocking advisory finding (L-floor, `important`).** The increment is done; the one advisory finding is a documentation-hygiene note, not a defect requiring rework.

## Proposed lesson candidate (NOT written to canon here — `/pharn-dev-memory-promote` decides)

**Candidate:** _A plan that bumps `SKILLS_VERSION` must also declare `README.md` in `## Files` (the shields badge), or `/pharn-dev-regress`'s `tests` gate will catch the drift downstream via `check-version-badge.test.mjs` — plan for the badge alongside the version bump, don't wait for regress to find it._

**Why it matters:** this run's `PLAN.md` bumped `SKILLS_VERSION` without the badge, `/pharn-dev-regress` correctly caught it as a real regression (verdict `"regressions"`, `REGRESSION.md`), and the human had to widen scope mid-chain to recover. The mechanism that would have prevented it — `check-version-badge.mjs` — already exists and was added for a near-identical prior incident (`CHANGELOG.md`'s `2.5.1`-era entry: the badge had drifted silently through the entire `1.x → 2.5.1` run). This is the **second** occurrence of essentially the same shape (a `SKILLS_VERSION` move not paired with its badge), which is exactly the trigger `.dev/memory-bank/lessons-learned.md` **L20** names for promoting a discipline-only remedy to something stronger — though here the "stronger" form is cheap: a planning-time checklist item (`/pharn-dev-plan`'s Step 2 already asks planners to state guarantee audits; a version-bumping plan could be prompted to check the badge as part of that same step), not a new floor primitive, since `check-version-badge.mjs` + its `regress`/`verify` wiring already catch it deterministically — this lesson is about **catching it one stage earlier**, at plan time, not about adding a new guarantee.

**Provenance:** `f15-route-group-scope`, this increment, `.dev/features/f15-route-group-scope/{PLAN.md,REGRESSION.md}`, discovered live during `/pharn-dev-regress`'s first run (2026-08-12).

Left for a human to accept/deny via a separate `/pharn-dev-memory-promote` run — not written to `.dev/memory-bank/lessons-learned.md` here.
