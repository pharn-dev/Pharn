# GRILL — readme-adoption-rewrite

Plan interrogated: `.dev/features/readme-adoption-rewrite/PLAN.md`. Spec-hash check: **MATCH** — recomputed `sha256(pharn/ARCHITECTURE.md)` = `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`, equal to the plan's pin, so the plan was made against the current spec.

Griller membership read deterministically: `node pharn/floor/count-grillers.mjs .` → `registered=13`. The five plan-scanners those grillers own were run over the plan and all returned clean: `scan-plan-secrets`, `scan-plan-pii`, `scan-plan-i18n` → `{"found":false}`; `scan-plan-migrations`, `scan-plan-observability` → `{"mentions":false}`.

**This grill-log is ADVISORY end-to-end. It gates nothing.** No finding below blocks `/pharn-dev-build`; the deterministic backstops remain `/pharn-dev-build`'s spec-hash and open-questions gates and `pharn/floor/validate.mjs`.

## Findings

### Axis: honest scope / writes-scope (P7, P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/readme-adoption-rewrite/PLAN.md:44"
  problem: "The exclusion block names docs/capabilities/ as out of scope while build hazard #3 (line 135) prescribes `npm run docs:generate`, which writes exactly that directory plus docs/lessons-index.md — the plan contradicts itself, and per L19 the honest move is to DECLARE the Bash write, not to leave it fenced off in prose the gate cannot see."
  evidence: "line 44: '- `docs/capabilities/` — generated; regenerated only by `npm run docs:generate`, never hand-edited.' against line 135: 'npm run docs:generate && npm run docs:check'. Verified live: docs:generate = `node .dev/floor/gen-capability-catalog.mjs . && node .dev/floor/gen-lessons-index.mjs .`"
```

The plan cites L19 in `applied_lessons` and then reproduces the exact shape L19 warns about — a Bash-invoked tool writing outside the declared scope, benign in result, invisible to fix #7. L19's own words: the remedy "is to **declare it**, not to pretend the gate covered it."

### Axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/readme-adoption-rewrite/PLAN.md:79"
  problem: "The guarantee audit enumerates sentences the README WILL contain, but nothing binds the built artifact to that table — a new guarantee-shaped sentence written at build time would never be audited, and the audit dies with the plan."
  evidence: "Section header at line 79: '## Guarantee audit (P0)', whose rows are all prospective ('Sentence the README will carry'). The plan cites L2 at line 12 but carries only its first half."
```

L2's remedy is explicitly two-part: the honesty must be written **into the durable artifact**, not just the ephemeral plan. The plan declares L2 and implements the reduction, but no step re-reads the finished README against this table. Suggested: add a build step that walks the rendered README and confirms every guarantee-shaped sentence appears in the audit — advisory, but at least performed on the artifact.

### Axis: documentation drift (P6, P7)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/readme-adoption-rewrite/PLAN.md:157"
  problem: "S3 hardcodes 'what lands in the repo' from a one-time install observation, but the CLI fetches the repo's current HEAD, so the described tree drifts with every commit and no generator or checker owns it — the same unowned-number shape §2.4 forbids for counts."
  evidence: "line 157: '- **S3 Quick start** — install, then `/pharn-spec`, then what lands in the repo (the verified tree from the discovery report).' Verified live: the probe install wrote pharn.config.json commit 71e71ee, byte-equal to HEAD."
```

The plan is careful to hardcode no capability count and no test total, then reintroduces the same class of claim as a prose tree listing. Suggested: describe what lands **by kind** ("the product commands, the write-gating hooks, the floor, the contracts") rather than by enumerated path, so the sentence stays true as the tree grows.

### Axis: determinism / unbounded build-time choice (P5)

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/readme-adoption-rewrite/PLAN.md:162"
  problem: "S8 requires citing one defect the loop caught in PHARN's own code, cited to the REVIEW.md that caught it, but the plan names no file — leaving the build to pick from 146 increment directories with no criterion, which is an unbounded model choice inside an otherwise pinned step."
  evidence: "line 162: '- **S8 PHARN builds PHARN** — short; the generated CURRENT-STATE block lives here, plus one defect the loop caught in PHARN's own code, cited to the `.dev/features/*/REVIEW.md` that caught it.'"
```

The plan pins every command line it prescribes (L22) and then leaves its single most persuasive claim unpinned. Suggested: name the exact `REVIEW.md` and finding id in the plan so the build quotes rather than selects.

### Axis: one axis of change (P3, P7)

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/readme-adoption-rewrite/PLAN.md:28"
  problem: "The increment bundles a full structural rewrite of README.md with a one-sentence status realignment across four sibling files; these have different reasons to change and different risk profiles, and a build that reds on the rewrite drags the trivial edits with it."
  evidence: "## Files at line 28 lists five paths whose descriptions range from 'full rewrite to the S1–S10 structure' to 'line 7's ... replaced with the Q3(a) status wording.'"
```

Raised, not pressed: the human explicitly chose the four-file scope at GATE 1 with L1's meta-doc argument on the table, and the setter resolves all five in one call, so the mechanical cost is low. Recorded so the coupling is a decision on the record rather than an omission.

### Axis: product judgment (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/readme-adoption-rewrite/PLAN.md:163"
  problem: "S9 plans to state that an install ships two of the four trusted docs — a real packaging gap, but one that belongs to pharn-cli; surfacing it in the adoption README may read as documenting a defect rather than describing the product, and the plan does not say which framing it intends."
  evidence: "line 163: '- **S9 Honest scope** — what has not shipped, labelled in the same sentence; links `LIMITS.md`; notes that an install ships two of the four trusted docs.'"
```

P7 favours stating the limit; product sense favours fixing the packaging instead of narrating it. Either is defensible — the plan should say which, since the README's credibility rests on S9 being read as candour rather than as an apology.

## Summary

The plan is unusually well-grounded: every claim in its source prompt was re-verified against live state, four were corrected, and three of its own hero sentences were struck rather than softened. The discovery is the strongest part and the guarantee audit is genuinely reduced rather than asserted.

The concerns cluster in one place — **the plan applies its cited lessons to the README's content but not to the plan's own procedure**. It cites L19 and then prescribes a repo-wide generator write it fenced off two sections earlier (F1). It cites L2 and implements only its first half, leaving the audit ephemeral (F2). It cites L20/L24 against hardcoded numbers and then hardcodes an install tree that drifts the same way (F3). It cites L22's "pin the command line" and leaves its most load-bearing citation unpinned (F4). This is L29's shape exactly: a rule applied to part of its domain reads as discharged.

None of these is a reason to stop. F1 and F4 are cheap to fix in the plan before building; F2 and F3 are judgment calls the human should make.

ADVISORY VERDICT: 6 concerns raised (0 blocking-severity, 4 important, 2 minor) — for the human to weigh before /pharn-dev-build. This is not a pass, and it is not a gate.
