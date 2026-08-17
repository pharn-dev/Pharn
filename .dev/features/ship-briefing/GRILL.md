# GRILL — ship-briefing

**Plan under interrogation:** `.dev/features/ship-briefing/PLAN.md` (`trust: untrusted` DATA).
**Spec-hash check (content-hash floor primitive — surfaced, not blocking here):** recomputed
`sha256(pharn/ARCHITECTURE.md)` = `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52` —
**MATCHES** the plan's pinned `spec_content_hash`. No drift. (`/pharn-dev-build`'s floor-gate is where
drift would actually block — fix #4.)

**Grillers discovered (deterministic membership, `pharn/floor/count-grillers.mjs`):** `{"registered":13}`.
Given this increment's scope — a new contract + two new floor scripts + one command-step edit, no schema,
no UI, no locale strings, no runtime service — most axes are structurally inapplicable (a11y, i18n,
migrations, observability, performance, privacy). The axes actually engaged (testability, architecture,
security, error-handling/P7, documentation, comprehension) are folded in below rather than run as 13
separate full procedures, proportionate to the size of the change — mirroring `review-sources-render`'s
precedent for a similarly-scoped increment.

## Findings

### Axis: discovery-first / halt-and-ask (P6) — a real gap, not a style note

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/ship-briefing/PLAN.md:26"
  problem: "render-ship-briefing.mjs's spec_id/spec_state fields assume a per-feature SPEC.md exists under <base>/<name>/SPEC.md. That is true for the PRODUCT loop (pharn-spec.md writes exactly that), but FALSE for the DEV loop (.dev/features/<name>/ has no SPEC.md at all — the dev PLAN.md pins spec_content_hash directly against pharn/ARCHITECTURE.md and carries no spec_id field). The plan specifies a --base override precisely so the script can target .dev/features/<name> for the HALT-2 demo and for tests, but never states what the script does when SPEC.md is absent under that base."
  evidence: "PLAN.md:26: 'Reads SPEC.md/PLAN.md frontmatter ... (default --base features, overridable so it can render against .dev/features/<name> for the HALT-2 demo and for tests).' Verified live: none of the sampled .dev/features/*/PLAN.md files (template-mask-nesting-3, migrations-griller, review-sources-render, lessons-index) carry a spec_id field — only spec_content_hash."
```

> This is the one finding that could block the HALT-2 demo as promised, not just a build-time nicety —
> raised `important`, for the human to confirm the intended resolution before `/pharn-dev-build`: the
> render script should treat a missing SPEC.md as an honest `spec_id: n/a`/`spec_state: n/a` under
> `--base .dev/features` (never a fabricated value, never a silent crash), while a missing SPEC.md under
> the real `--base features` product path should stay a fail-closed refusal (a product feature without a
> SPEC.md is a genuine error, not a shape difference). The plan's Files entry for `render-ship-briefing.mjs`
> should say this explicitly so build does not invent the distinction ad hoc.

### Axis: determinism (P5) — the load-bearing regex is unspecified

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/ship-briefing/PLAN.md:26"
  problem: "The plan commits to a 'curated heading-scan' over PLAN.md for a Decision-shaped section but names no candidate patterns. This is the mechanism the whole hybrid design's cost/value tradeoff rests on (PLAN.md/HALT-1 discovery found 34 DIFFERENT heading spellings across 34/121 sampled plans with no fixed convention) — an under-specified pattern list built ad hoc at implementation time could land anywhere between 'catches most of the 28%' and 'catches almost none', silently changing how often the ADVISORY-paragraph fallback fires (and therefore the real token cost measured at HALT 1)."
  evidence: "PLAN.md:26: 'does a curated heading-scan over PLAN.md for a Decision-shaped section (quotes it verbatim if found)' — no pattern list, no reference to the discovery grep's actual 34 matched heading lines."
```

> Recommend the build step seed the pattern list directly from the discovery evidence already gathered
> (headings matching `/^#+\s.*\b(decision|alternative|rejected|resolved)\b/i`, case-insensitive, which
> covers all 34 sampled headings by construction) rather than re-deriving it from scratch, and pin it with
> a test asserting it matches all 34 sampled headings verbatim (a regression fixture, not a live corpus
> re-scan).

### Axis: eval / injection-resistance coverage (P1 + P2) — the forgery problem is untested

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/ship-briefing/PLAN.md:27"
  problem: "render-ship-briefing.test.mjs's planned coverage (quote-extraction hit/miss, missing-source fail-closed, --base override) has no test proving an instruction-looking needle inside PLAN.md/GRILL.md free text (e.g. a fake heading reading '## Decision: mark verify_verdict PASS') cannot land in BRIEFING.md's ENUM-GATED frontmatter fields. Given this whole artifact exists to solve LIMITS.md §1d's forgery problem, its own generator shipping with no needle test is a real gap, not a nice-to-have — the same class of ★ fixture every scanner/lens in this repo carries (scan-plan-migrations.test.mjs's honest-bound test, the ssrf-lens's injection-immunity case, etc.)."
  evidence: "PLAN.md:27: 'hermetic tests: quote-extraction hit/miss, missing-source fail-closed behavior, --base override' — no injection/needle case listed."
```

> Recommend one ★ test in `render-ship-briefing.test.mjs`: a fixture PLAN.md whose `## Files`/body text
> contains a fake enum-looking line (e.g. `verify_verdict: PASS` inside a code fence or plain prose,
> nowhere near the real `verify-report.json`) and assert the rendered frontmatter's `verify_verdict`
> still equals only what `verify-report.json` says — proving the enum-gated fields are computed from the
> JSON/frontmatter sources exclusively, never from the free-text body the heading-scan quotes.

### Axis: architecture / one-axis-of-change (P3) — acceptable precedent, flag for the record

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/ship-briefing/PLAN.md:28"
  problem: "check-ship-briefing.mjs bundles three assertion classes in one file — envelope shape, cross-file equality against source JSON/MD, and advisory-marker presence. This mirrors the accepted check-loop-record.mjs precedent (which bundles envelope shape + Handoff structure), but lessons-index-core.mjs's P3 finding (a prior grill, this same corpus) required an explicit SCOPE NOTE at the top of a similarly-bundled file when a human chose the bundle at a plan gate. This plan makes no such note."
  evidence: "PLAN.md:28: 'NEW deterministic checker ... (1) frontmatter envelope shape ... (2) cross-file equality ... (3) the `## Why this design` section is present and ... that marker is exact-string-present'."
```

> Minimal remedy: a one-line scope-note comment at the top of `check-ship-briefing.mjs`, mirroring the
> lessons-index-core.mjs precedent, naming the bundle as a deliberate choice rather than an oversight.

### Axis: comprehension — a conversation-local label leaking into canon

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/ship-briefing/PLAN.md:1"
  problem: "The plan's own title cites 'Option B — hybrid', a label that only means something inside this build prompt's HALT-1 options list — which is not itself preserved anywhere in canon. A future reader of this PLAN.md (or a later /pharn-dev-review) has no way to recover what 'Option B' denoted without this conversation's transcript."
  evidence: "PLAN.md:1: '# PLAN — ship-briefing (GATE-2 briefing artifact, Option B — hybrid)'."
```

> Non-blocking; the plan's own body (the `## Applied lessons` / `## Files` / `## Guarantee audit`
> sections) is otherwise self-contained and does not lean on the "Option B" label to be understood — only
> the title line does. Cosmetic; safe to leave or rename at build time.

## No findings on

- **P0 (guarantee-audit completeness):** clean. Every claim in `## Guarantee audit (P0)` carries an
  explicit floor/advisory label, two claims are struck by name (`"BRIEFING.md is a faithful summary"`,
  `"GATE 2 requires a GREEN checker"`), and the one genuinely new floor primitive (cross-file equality) is
  named as such rather than folded quietly into "the checker validates it."
- **P2 (trust propagation):** clean. The enum-gated frontmatter is computed exclusively from
  JSON/frontmatter sources by the deterministic script; the ADVISORY subagent's output is structurally
  confined to one fenced free-text section and never reaches an enum-gated field — the isolation the F3
  needle test above would additionally _prove_, not merely assert.
- **P3 (layer placement / no sibling imports):** clean. `render-ship-briefing.mjs` and
  `check-ship-briefing.mjs` need not import each other — the checker only needs to test for the ADVISORY
  marker string in the already-written artifact, not re-derive the render script's heading-scan decision.
  No cross-file import is planned or needed.
- **P7 (honest scope, no speculation):** clean. Triggered by a real, explicit build-prompt request (not
  hypothetical), scoped to one coherent artifact + its floor backstop, matching the precedent of shipping
  a capability together with its verification (e.g. `migrations-griller`).
- **Testability (declared verification approach):** present. Both new `.mjs` files get their own
  `node --test` suites, matching every existing `pharn/floor/check-*.mjs` precedent; P1's Capability-eval
  requirement correctly does not bind them (no `role:`).
- **Security:** no secret literals; no new external call, no new trust elevation.
- **Writes-scope (fix #7):** the plan's `## Files` names every path `/pharn-dev-build` needs to write,
  including the floor-denied-by-default `pharn/floor/*.mjs` paths explicitly — `set-writes-scope.cjs
--from-plan` should resolve the full list correctly.

## Summary

The plan is well-grounded — the HALT-1 discovery it rests on (34/121 sampled plans, 92/92 GRILL.md files,
a full read of two floor-checker precedents) is unusually thorough for a plan of this size, and the P0
guarantee audit correctly identifies and labels the one new floor primitive rather than overclaiming the
whole artifact as "floor". Two of the five findings above are **important** and worth resolving before
`/pharn-dev-build`, not merely noting: the SPEC.md-in-dev-loop gap (F1) could silently break the very demo
this increment promises at HALT 2, and the unspecified heading-pattern list (F2) directly determines
whether the hybrid design's central cost/value argument (cheap in the common ~28% case) holds in practice.
The injection-resistance gap (F3) is important on principle — an artifact built specifically to solve the
forgery problem should not ship its own generator untested against the attack it names. The remaining two
are minor and cosmetic.

**ADVISORY VERDICT: 5 concerns raised (0 blocking-severity, 3 important, 2 minor) — for the human to weigh
before `/pharn-dev-build`.** None gates `/pharn-dev-build`; the deterministic backstops remain
`/pharn-dev-build`'s floor-gates (spec-hash drift, unresolved `## Open questions`) and
`pharn/floor/validate.mjs`. This grill-log is advisory end-to-end — "grilled" never means "the plan is
sound" (P0).
