# GRILL — installed-skills-context

- **plan:** `.dev/features/installed-skills-context/PLAN.md`
- **spec-hash check (content-hash floor primitive, surfaced not blocking):** `sha256(ARCHITECTURE.md)` = `11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969` — **matches** the plan's `spec_content_hash`. No drift. (The block on drift is `/pharn-dev-build`'s floor-gate, not this stage.)
- **grillers registered (FLOOR, `count-grillers.mjs`):** 13. Relevant axes applied inline: testability, security, architecture/coupling, P7-scope. Not-applicable to a markdown-command + one-helper increment (no runtime UI/data/schema surface): a11y, i18n, migrations, observability, privacy, performance.
- **nature:** ADVISORY end-to-end. Nothing below blocks `/pharn-dev-build`.

## Findings (enum-gated / free-text split honored — `finding-shape.md`, cited P4)

### Axis: P7 — honest scope / triggering failure

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/installed-skills-context/PLAN.md:5"
  problem: "The increment is justified by anticipated user need, not by an observed dogfood or eval failure — P7 requires a real triggering failure, not a hypothetical; the plan cites none."
  evidence: "increment: The product stages ... incorporate their content as advisory, untrusted context — so build follows their conventions ... (no dogfood/eval failure named as the trigger)"
```

### Axis: P2 / security — finding SUPPRESSION in review is the sharper, under-named risk

```yaml
- type: FINDING
  rule_id: "P2"
  severity: important
  file: ".dev/features/installed-skills-context/PLAN.md:56"
  problem: "The residual names 'steer advisory concerns' generally but not the asymmetry that in /pharn-review a hostile SKILL.md can make a lens SUPPRESS a real finding — and unlike an injected concern (quoted DATA the human sees), a suppressed finding never reaches the human at all."
  evidence: "a hostile SKILL.md can steer the model's advisory ... concerns (grill/review) — bounded: ... (b) grill/review gate nothing on the interrogation/lens judgment"
```

### Axis: P1 / testability — the `.test.mjs` proves discovery, not incorporation

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/installed-skills-context/PLAN.md:19"
  problem: "The deterministic test proves the ENUMERATOR lists a skill; it does NOT prove the STAGE 'surfaces/uses' it, which the SPEC's test line asks for. The 'stage surfaces/uses it' and 'no skills → unchanged' claims for the COMMANDS are advisory and unproven by the test — a green test must not be read as proving the stages incorporate skills."
  evidence: 'This IS the increment''s deterministic test (SPEC "tests" requirement).'
```

### Axis: security / build-note — enumerator scope hygiene

```yaml
- type: FINDING
  rule_id: "P5"
  severity: minor
  file: ".dev/features/installed-skills-context/PLAN.md:17"
  problem: "Build should pin the enumerator to exactly one level (.claude/skills/<name>/SKILL.md), JSON.stringify all names/paths (a skill dir name with control chars must not corrupt output), and not follow symlinks out of the tree — so a hostile skills dir cannot make the enumerator emit or read arbitrary paths."
  evidence: 'scans <dir>/.claude/skills/*/SKILL.md, prints {"count":N,"skills":[{"name","path"}...]} (sorted, stdlib-only, fail-safe empty when absent)'
```

### Axis: P0 — enumerator-as-primitive-#3 is a slight stretch (precision only)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/installed-skills-context/PLAN.md:45"
  problem: "Framing directory globbing as 'enum/regex (primitive #3)' is defensible (mirrors count-grillers membership) but the honest primitive is 'deterministic filesystem enumeration' that GATES NOTHING; the FLOOR label is fine only because nothing branches on it. Keep the wording from implying a gating check."
  evidence: "FLOOR: enum/regex (primitive #3) — scan-installed-skills.mjs lists .claude/skills/*/SKILL.md by path membership"
```

## Prose summary

The plan is unusually disciplined on the P0 axis: it explicitly strikes the disease claim ("code respects/matches a skill"), keeps the enumerator FLOOR-but-non-gating, and labels incorporation ADVISORY throughout. Trust (P2) and determinism (P5) audits are strong; the "no skills → no-op → unchanged" story is clean and the writes-scope backstop for build is correctly load-bearing.

Three concerns worth the human's attention before build:

1. **P7 trigger (important).** PHARN's P7 wants a _real_ failure behind an addition. This increment is a product-scope feature driven by anticipated user demand. That may be legitimate (P7's "no speculation" is aimed most sharply at internal capabilities/enforcers, and a user-facing product feature is a different category) — but the plan should either cite a concrete trigger or the human should consciously accept the product-scope justification.

2. **Suppression asymmetry in review (important).** The most dangerous direction is not a SKILL.md _adding_ a bogus concern (that surfaces as quoted DATA the human reads) but a SKILL.md _talking a lens out of_ reporting a genuine issue — which is invisible. Build should name this explicitly and lean on the structural backstop that lens _scanner hits_ are deterministic regex verdicts over the code (Step 3 of `/pharn-review`), so skills inform judgment but cannot erase a scanner-detected shape.

3. **Test scope honesty (important).** The `.test.mjs` covers the enumerator, which is exactly the FLOOR half — good. But nobody should read it as evidence the _stages_ incorporate skills; that half is advisory and checked only by dogfood/human. Say so where the test is described.

Two minor precision notes (enumerator scope hygiene; primitive-#3 wording) are build-time refinements, not blockers.

## Verdict

ADVISORY VERDICT: 5 concerns raised (0 blocking-severity, 3 important, 2 minor) — for the human to weigh before `/pharn-dev-build`. Nothing here blocks the build; the spec-hash chain is intact and the plan's guarantee audit is honest. The important findings are refinements to make in the command prose (name the suppression asymmetry; keep the test's scope honest) and one scope judgment for the human (P7 trigger).
