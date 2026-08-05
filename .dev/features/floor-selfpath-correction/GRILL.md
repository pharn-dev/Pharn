# GRILL — floor-selfpath-correction

Plan under interrogation: `.dev/features/floor-selfpath-correction/PLAN.md` (approved at GATE 1).
**Spec-hash check (content-hash primitive): MATCH** — recomputed `sha256(pharn/ARCHITECTURE.md)` =
`0d0dc6da61c4de6748aeab849ed1a4ecd9ff7f1d61e91d5848d7ffdaf022733d`, equal to the plan's pinned
`spec_content_hash`. No drift. (Surfaced here; the actual block on drift is `/pharn-dev-build`'s
floor-gate, fix #4.)

**This entire grill-log is ADVISORY (P0).** It gates nothing. `/pharn-dev-build` is not blocked by any
finding below; the human weighs them.

## Deterministic pre-checks (floor-grade, run this run)

| check                                 | result                                                 |
| ------------------------------------- | ------------------------------------------------------ |
| `count-grillers.mjs .`                | `{"registered":13}` — membership is FLOOR (enum/regex) |
| `scan-plan-secrets.mjs PLAN.md`       | `{"found":false,"hits":[]}`                            |
| `scan-plan-pii.mjs PLAN.md`           | `{"found":false,"hits":[]}`                            |
| `scan-plan-i18n.mjs PLAN.md`          | `{"found":false,"hits":[]}`                            |
| `scan-plan-migrations.mjs PLAN.md`    | `{"mentions":false,"hits":[]}`                         |
| `scan-plan-observability.mjs PLAN.md` | `{"mentions":false,"hits":[]}`                         |

## Findings

### Axis: honest scope / guarantee audit (P0, P7) — inline

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/floor-selfpath-correction/PLAN.md:165"
  problem: "The plan labels the whole increment a no-behavior-change edit, but five of the rewritten occurrences are operative code — console.log/console.error usage strings — so the rewrite changes observable program output, not only comments."
  evidence: '"The change is cosmetic — no behavior changes" → **advisory** (a reading of the code, grounded in the discovery note that nothing resolves `.dev/floor` through `fs`).'
```

The five operative-code sites, verified on disk this run:

- `pharn/floor/check-seam-config.mjs:71` — `console.log("RED — usage: node .dev/floor/check-seam-config.mjs …")`
- `pharn/floor/check-spec.mjs:168` — `console.error("check-spec: usage: node .dev/floor/check-spec.mjs --hash …")`
- `pharn/floor/check-spec.mjs:174` — `console.log("RED — usage: node .dev/floor/check-spec.mjs …")`
- `pharn/floor/check-spec-approved.mjs:119` — `console.log("RED — usage: node .dev/floor/check-spec-approved.mjs …")`
- `pharn/floor/check-plan-spec-agree.mjs:154` — `console.log("RED — usage: node .dev/floor/check-plan-spec-agree.mjs …")`

The discovery note the plan rests on ("nothing resolves `.dev/floor` through `fs`") is **true and
verified** — no path is handed to `fs`. But "not fs-resolved" is a narrower claim than "no behavior
change": these strings _are_ the programs' stderr/stdout contract. Correcting them is still the
right call (they are exactly the task's "`node .dev/floor/…` usage string" stale category); the
finding is that the plan should say **"output-text change, no control-flow change"**, not "cosmetic".

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/floor-selfpath-correction/PLAN.md:161"
  problem: "The plan names `npm test` as the floor backstop for the rewrite, but the two tests that exercise the affected usage strings assert only /usage/ — a regex loose enough to pass whether or not the rewrite is correct, so npm test does not actually guard the five operative-code sites."
  evidence: "backstopped by the floor**: `npm test` exit code (a mutated mock-fs fixture key flips the exclusion assertions in `count-*.test.mjs` / `validate.test.mjs` to FAIL)"
```

The backstop is **real but narrower than the plan implies.** Verified this run:
`check-plan-spec-agree.test.mjs:167` and `check-spec-approved.test.mjs:104` both assert
`assert.match(r.stdout, /usage/)` — they pass with either path spelling. So:

- **Guarded by `npm test`:** mock-fs fixture-key mutation (the catastrophic case the task warns
  about) — those keys are asserted exactly, in `count-grillers.test.mjs:219`,
  `count-lenses.test.mjs:135`, `count-verifiers.test.mjs:202`, `validate.test.mjs:70`.
- **NOT guarded by `npm test`:** the correctness of the five usage-string rewrites, and every
  comment-only rewrite. Nothing asserts on those.

This is not a reason to add tests (P7 — no triggering failure, and asserting on comment text would
be worse than the disease). It is a reason for the plan's guarantee audit to **say which half the
floor covers**, rather than implying it covers the rewrite as a whole.

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/floor-selfpath-correction/PLAN.md:135"
  problem: "Pinning setup-node to ci.yml's SHA moves floor.yml from action major v7 to v6 — a deliberate downgrade of a build tool, which the plan records as SHA-pinning for consistency without interrogating whether v6 resolves `node-version: lts/*` identically."
  evidence: "`.github/workflows/floor.yml` — SHA-pin the two bare-tag actions, SHAs copied verbatim from `ci.yml` — repo-meta"
```

The instruction to reuse `ci.yml`'s SHAs verbatim is sound and is being followed (inventing a v7 SHA
would be far worse — an unverifiable digest). But the change is **two changes wearing one label**:
(1) tag → immutable digest, genuinely consistency-only; (2) setup-node **v7 → v6**, a real version
move. Both workflows use `node-version: lts/*`, so the expected delta is nil — but "expected nil" is
advisory, and CI is where it would show. Worth the human knowing it is a downgrade, not a pin.

### Axis: one axis of change (P3) — inline

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/floor-selfpath-correction/PLAN.md:4"
  problem: "The increment bundles two changes with no shared axis of change — stale comment paths in the relocated floor scripts, and action pinning in a CI workflow — so a revert of one necessarily reverts the other."
  evidence: "Rewrite stale `.dev/floor/<B>` self-path tokens … and SHA-pin the two bare-tag actions in `.github/workflows/floor.yml`"
```

Deliberately scoped this way by the human, and the plan is transparent about it (`layer(s): none`,
line 5). Recorded, not contested — the cost is only revert granularity, and the single commit
message names both.

### Axis: determinism (P5) — inline

```yaml
- type: FINDING
  rule_id: "P5"
  severity: minor
  file: ".dev/features/floor-selfpath-correction/PLAN.md:39"
  problem: "The rewrite rule says 'all text files under pharn/floor/', which as stated would include pharn/floor/test-fixtures/ — the same fixture-inversion hazard the plan carefully excludes for fake*.md, left unexcluded by the rule's wording."
  evidence: "Replace every occurrence of the exact token `.dev/floor/<B>` with `pharn/floor/<B>` across all text files under `pharn/floor/`, UTF-8 aware."
```

**Empirically null today:** `grep -ran '\.dev/floor' pharn/floor/test-fixtures` returns zero hits,
verified this run. The finding is about the rule's _stated_ scope, not its _current_ effect — a
fixture added later containing a real `pharn/floor/` basename would be silently rewritten. Cheap
mitigation if wanted: exclude `test-fixtures/` from the walk.

### Axes with no findings

- **P1 (evals).** The plan's "no evals required" is correct, not an omission: no `role:`-bearing
  capability and no `rule_id` is added, so P1's trigger does not fire. The plan states this
  explicitly rather than silently skipping it (line ~150).
- **P2 (trust).** No untrusted artifact is ingested. The SHAs are copied from in-repo `ci.yml`, not
  fetched — the plan is right that this introduces no taint path and no `pre-egress` question. This
  is the correct call: resolving a digest over the network would have been the injectable move.
- **P6 (discovery).** Every repo claim in the plan is grounded in a read this run, and the one
  doc-vs-repo mismatch (HEAD `c88593b` vs live `1db762f`) was surfaced and resolved at GATE 1 rather
  than absorbed silently.
- **Grillers (a11y, i18n, migrations, observability, privacy, performance, security, documentation,
  comprehension, coupling, error-handling, architecture, testability).** 13 registered; their
  deterministic partial floors ran clean (table above). No axis applies substantively — the
  increment adds no user-facing surface, no data handling, no runtime path, and no new module edge.

## Summary

The plan is well-grounded and its discovery is solid. Three of the five findings are the **same
underlying issue**: the increment is described as "cosmetic / no behavior change", and that framing
is slightly too generous in three independent places — five operative usage-strings do change
program output; `npm test` guards the fixture half of the rewrite but not the usage-string half; and
the setup-node pin is also a v7→v6 downgrade. None of these makes the work wrong. All three make the
plan's _self-description_ rosier than the change, which is precisely the framing error P0 exists to
catch, even when the underlying edit is benign.

The two minor findings (bundled axes, `test-fixtures/` unexcluded) are recorded for the record and
need no action.

Nothing here argues against building. The corrections are to **claims**, not to **code**.

ADVISORY VERDICT: 5 concerns raised (0 blocking-severity, 3 important, 2 minor) — for the human to
weigh before `/pharn-dev-build`. This is not a pass, not an approval, and not a guarantee that the
plan is sound.
