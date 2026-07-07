# GRILL — per-stage-model-config (ADVISORY)

- Plan under interrogation: `.dev/features/per-stage-model-config/PLAN.md`
- Spec-hash check (content-hash floor primitive, surfaced not blocking): `sha256(ARCHITECTURE.md)` = `11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969` **==** the plan's pinned `spec_content_hash` → **no drift**.
- Griller membership (FLOOR, `count-grillers.mjs`): 13 registered. Most (`a11y`, `i18n`, `migrations`, `privacy`, `observability`, `performance`) target **product-code** plans and are **N/A** to this build-apparatus/floor-tooling increment. The relevant axes (`architecture`, `coupling`, `testability`, `error-handling`, `comprehension`, `documentation`, `security`) were interrogated inline and folded into the findings below. `error-handling`: covered — the plan's tests exercise malformed-JSON / missing-`models.stages` fail-closed (PLAN.md:44). `security`/trust: the trust audit (PLAN.md:56) is sound (config is enum-validated DATA, bounded blast radius).

## Findings (finding-shape; enum-gated fields trusted, free-text inherits the plan's untrusted tag)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/per-stage-model-config/PLAN.md:49"
  problem: "The config-validity and config↔frontmatter-agreement guarantees are only LIVE if check-config.mjs actually runs against the real repo, but the plan wires only the unit test (check-config.test.mjs) into npm test — nothing invokes check-config.mjs against the real pharn.config.json + real command frontmatter in npm run check. As written the floor guarantees are latent, not gated."
  evidence: "'.dev/floor/check-config.test.mjs — NEW. node --test cases (auto-run by npm test's .dev/**/*.test.mjs glob).' (PLAN.md:24) — no line wires check-config.mjs itself into a live gate."

- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/per-stage-model-config/PLAN.md:10"
  problem: "No REAL triggering failure is cited. P7 says an addition is triggered by a dogfood/eval failure, never a hypothetical; here the trigger is a human preference (Option B) + authorization to reverse a prior P7 deferral. Authorization is not a surfaced failure. Surfaced for the human, who already elected to proceed."
  evidence: "'which also authorizes reversing the P7 deferral of pharn.config.json' (PLAN.md:10); the increment records an ergonomic want, not an observed failure where a stage ran under the wrong model and it caused harm."

- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/per-stage-model-config/PLAN.md:52"
  problem: "The increment's HEADLINE goal — 'each stage runs under its configured model/effort' — is delivered only ADVISORILY and is specifically unreliable on the PRIMARY path: under /pharn-dev-ship all stages run in ONE turn, and a per-skill model:/effort: 'applies for the rest of the current turn,' so sequential per-stage switching may not occur. The config risks being largely cosmetic exactly where the loop is most used. The plan is honest about this, but the human should weigh whether config+validator+agreement is worth building when the runtime binding is unreliable in the /pharn-dev-ship path."
  evidence: '''under a multi-stage /pharn-dev-ship turn the per-skill model:/effort: "applies for the rest of the turn," so cross-stage application is platform-dependent and uncertain.'' (PLAN.md:52)'

- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/per-stage-model-config/PLAN.md:23"
  problem: "check-config.mjs gains two change-triggers: the pharn.config.json schema AND the .claude/commands/*.md frontmatter format/location (the agreement facet must parse command frontmatter). Mild one-axis-per-file tension — both are 'config governance,' but a change to how command frontmatter is shaped would also force check-config.mjs to change."
  evidence: "'agreement (each wired stage's .claude/commands/pharn-dev-<stage>.md frontmatter model:/effort: must equal the config-resolved value)' (PLAN.md:23)."

- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/per-stage-model-config/PLAN.md:41"
  problem: "The model allowlist includes a full-model-ID regex branch (^claude-[a-z0-9][a-z0-9-]*$), but no test case exercises a VALID full ID (e.g. claude-opus-4-8) as GREEN — only the alias set and a bad model are tested. The regex branch is not eval-bound (P1)."
  evidence: '''bad model ("gpt-4o", not in {sonnet,opus,haiku,fable,inherit} ∪ ^claude-[a-z0-9][a-z0-9-]*$) → RED'' (PLAN.md:41) — the positive full-ID case is absent.'

- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/per-stage-model-config/PLAN.md:22"
  problem: "A new root-level pharn.config.json that governs the dev loop is not accompanied by any documentation update (CLAUDE.md / CHANGELOG are not in ## Files). A new config consumer that future contributors must know about is arguably under-documented; may be folded in or deliberately deferred."
  evidence: "## Files (PLAN.md:22-27) lists the config, checker, test, and three command edits, but no CLAUDE.md/CHANGELOG note introducing pharn.config.json."
```

## Prose summary

The plan is unusually honest and its guarantee audit is well-formed — the enum-gated/advisory split is correct and the trust audit is sound. The concerns are about **liveness and value**, not soundness:

1. **Latent vs live floor (P0, important):** the checker is unit-tested but nothing runs it against the real repo, so its guarantees don't actually gate `npm run check` yet.
2. **No triggering failure (P7, important):** the increment rests on a human want + a reversed deferral, not an observed failure — the human accepted this at GATE 1, but P7 says surface it.
3. **Headline goal is advisory AND shaky on the primary path (P0, important):** the per-stage binding may not fire under `/pharn-dev-ship`'s single-turn execution — the config may be cosmetic where it matters most.
4. Two minor items: a mild P3 two-axis coupling in `check-config.mjs`, a missing P1 positive test for the full-model-ID branch, and an under-documentation note (P7, minor).

None of these is a defect the plan hides; all are for the human to weigh. Concern #3 is the one worth a real decision — if the runtime binding won't hold under `/pharn-dev-ship`, the increment's practical payoff is the **config↔frontmatter consistency floor** (drift detection), not "stages run under configured model/effort."

## Verdict

**ADVISORY VERDICT: 6 concerns raised (0 blocking-severity, 3 important, 3 minor) — for the human to weigh before/at the post-review gate. This grill-log gates nothing; `/pharn-dev-build`'s floor-gates (spec-hash drift, unresolved open questions) and `.dev/floor/validate.mjs` remain the only deterministic backstops.**
