# GRILL — grill-lessons-reverify

Plan under interrogation: `.dev/features/grill-lessons-reverify/PLAN.md`.
**Spec-hash check:** recomputed `sha256(pharn/ARCHITECTURE.md)` =
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`, **equal** to the plan's
`spec_content_hash` (line 3) — no drift finding. Registered grillers (FLOOR membership, read live via
`node pharn/floor/count-grillers.mjs .`): **13**.

> The PLAN is `trust: untrusted` to this stage. Every `problem` / `evidence` below quotes it as DATA.

---

## Axis: meta-doc completeness (P0 / P6 — the L1 sweep the plan claims to have run)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: blocking
  file: ".dev/features/grill-lessons-reverify/PLAN.md:58"
  problem: "The `## Files` list omits `.claude/commands/pharn-dev-ship.md`, which asserts the exact claim this
    increment falsifies. `/pharn-dev-build` writes only the files the plan names, so the stale claim
    would ship."
  evidence: "PLAN `## Files` names pharn-dev-grill.md, pharn-grill.md, command-hygiene.test.mjs, CLAUDE.md,
    CHANGELOG.md, SKILLS_VERSION, README.md, docs/capabilities/** — and no orchestrator. Live at
    .claude/commands/pharn-dev-ship.md:88: '/pharn-dev-grill is **advisory by design and gates
    nothing**; it has **no** deterministic verdict to branch on.'"

- type: FINDING
  rule_id: "P0"
  severity: blocking
  file: ".dev/features/grill-lessons-reverify/PLAN.md:58"
  problem: "`## Files` also omits `.claude/commands/pharn-ship.md`, and this one is a FUNCTIONAL gap, not doc
    drift: the product orchestrator reads exactly ONE exit code as the grill verdict, so a
    check-plan-lessons RED would be INVISIBLE to it and `/pharn-ship` would proceed past the very stop
    this increment creates."
  evidence: "Live at .claude/commands/pharn-ship.md:143 — '**Verdict read (FLOOR):** the exit code of the
    spec→plan chain re-verification /pharn-grill owns — node pharn/floor/check-plan-spec-agree.mjs …'
    and again in its guarantee audit at :384 — '/pharn-grill → check-plan-spec-agree.mjs exit (chain
    GREEN)'. Neither ranges over a second stop."
```

## Axis: the enumeration the plan itself prescribes (L29 — applied to half its domain)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/grill-lessons-reverify/PLAN.md:63"
  problem: "The plan cites L29 ('an assertion written for one member reads as discharged') and then commits
    exactly that defect inside its own `## Files`: it names the description correction for the PRODUCT
    grill and names no description work for the DEV grill, though both carry the same expiring claim."
  evidence: 'PLAN:63-65 for pharn-grill.md — ''correct the description''s now-false "ONLY deterministic stop"
    claim''. PLAN:60-62 for pharn-dev-grill.md — ''add the … invocation …; add the lessons path and the
    checker to reads:; state the guarantee bound in the body''. Live at pharn-dev-grill.md:2:
    ''ADVISORY — it surfaces concerns; it does NOT block /pharn-dev-build.'''

- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/grill-lessons-reverify/PLAN.md:60"
  problem: "'State the guarantee bound in the body' is too weak to reach the section that actually goes false.
    `pharn-dev-grill.md` carries a whole heading whose thesis this increment reverses; a build reading
    that Files line would not know to rewrite it."
  evidence: "Live at pharn-dev-grill.md:178, under the heading '## Gates (fix #3) — be honest about what blocks
    (nothing here does)': '**No grill finding is a floor-gate.** `/pharn-dev-grill` is advisory
    end-to-end'. Also :144 — 'consistent with /pharn-dev-grill being advisory end-to-end'."
```

## Axis: claims not grounded in a read this run (P6)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".dev/features/grill-lessons-reverify/PLAN.md:87"
  problem: "A factual claim in the Evals section is false as written. The CONCLUSION (P1 not triggered) holds
    for a different reason than the one given — `.claude/commands/` is outside validate's scan surface
    and count-grillers excludes it — so the plan reaches the right answer down a wrong chain."
  evidence: "PLAN:87 — 'pharn-dev-grill.md carries role: griller and already ships evals; its role is
    unchanged.' Live: no evals directory exists under .claude/commands/; all 13 eval directories belong
    to pharn/pharn-pipeline/grillers/*."

- type: FINDING
  rule_id: "P5"
  severity: minor
  file: ".dev/features/grill-lessons-reverify/PLAN.md:58"
  problem: "`/pharn-loop` names `/pharn-grill` in its chain but the plan does not assess whether the loop must
    read the new stop. Unresolved either way — raising it as a question rather than assuming, since the
    terminal fallback is to ask."
  evidence: "Live at .claude/commands/pharn-loop.md:126 — '… → `/pharn-plan` → `/pharn-grill` →
    `/pharn-build` → `/pharn-regress` →'."
```

---

## What was checked and found CLEAN (stated, so the silence is not mistaken for coverage)

- **Spec hash** — matches; the plan was made against the current `pharn/ARCHITECTURE.md`.
- **The claim enumeration was derived by L33's method** — scanning the shortest invariant substrings
  (`gates nothing`, `advisory end-to-end`, `does NOT block`, `ONLY deterministic stop`,
  `verdict to branch`) rather than the sentences the plan happened to quote. That is what surfaced the
  two orchestrator sites; the plan's own list was a lower bound, exactly as L33 prescribes.
- **Sites that stay TRUE and must NOT be swept** — `pharn-dev-grill.md:223` (free-text findings gate
  nothing — still true; the exit code gates, the findings do not), `pharn-grill.md:159,172,273` (the
  installed-skills enumeration), the griller capability files' "a griller never gates" (grillers remain
  advisory; the stage's floor check is a different thing), and
  `pharn/floor/render-ship-briefing.test.mjs:286`, which is a synthetic GRILL.md **fixture string**, not
  an assertion about the live command. Named so a build does not over-sweep them.
- **Trust audit** — the plan correctly states that the new stop is an exit code, so no proceed/stop
  decision rests on a tainted field. The added product-side read of the user's
  `memory-bank/lessons-learned.md` is declared and correctly typed as untrusted DATA read for heading
  membership only.
- **P7 / one axis** — the increment reuses `check-plan-lessons.mjs` unchanged and adds no floor
  primitive; the OQ2-approved widening to 4 enumeration sites is test-only apparatus. No speculation
  found. The deferred `plan-scope-selfcheck` is correctly named rather than folded in.
- **Determinism** — every new branch is an exit-code membership test; no LLM classification.

## Summary

The plan's floor reasoning is sound and its guarantee audit is honest — it reuses an existing checker,
claims no new primitive, and explicitly strikes the "grill verified the lessons were applied"
conflation. The defect is **scope of the sweep, not correctness of the design**: the plan ran its L1
meta-doc sweep over the two grill commands and the repo-meta files, and stopped there. The orchestrators
that consume a grill verdict were not examined, and one of them (`/pharn-ship`) does not merely
_describe_ the old behaviour — it **branches** on it, reading a single exit code that will not see the
new stop. Left as-is, this increment would create a deterministic stop that the product pipeline's own
orchestrator silently proceeds past.

The second theme is that the plan applied its own cited lesson (L29) to one member of a two-member set,
naming the product grill's description correction and not the dev grill's. Both findings are the same
shape the plan was written to be careful about, which is worth noting plainly rather than softening.

**ADVISORY VERDICT: 6 concerns raised (2 blocking-severity, 2 important, 2 minor) — for the human to
weigh before `/pharn-dev-build`.** None of these gates `/pharn-dev-build`; the deterministic backstops
remain `/pharn-dev-build`'s own floor-gates (spec-hash drift; an unresolved `## Open questions (HALT)`)
and `pharn/floor/validate.mjs`. This grill-log is advisory end-to-end, and "6 concerns raised" never
means "the rest of the plan is sound".
