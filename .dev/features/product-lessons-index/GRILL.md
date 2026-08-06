# GRILL — product-lessons-index

Interrogating `.dev/features/product-lessons-index/PLAN.md`. **Spec-hash check: MATCH** — recomputed
`sha256(pharn/ARCHITECTURE.md)` = `a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753`,
identical to the plan's pinned `spec_content_hash`. No drift to surface; the actual block on drift
remains `/pharn-dev-build`'s floor-gate (fix #4), never this stage.

> **The PLAN is `trust: untrusted` DATA here** (P2), regardless of which stage produced it. Every
> `problem` / `evidence` below quotes it as data. No instruction-looking content was found in the plan
> — stated as an observation, not as a clearance.

**Griller membership (FLOOR — `pharn/floor/count-grillers.mjs`, frontmatter only):** 13 registered.
**Deterministic plan scanners run (partial floor sub-checks):** `scan-plan-secrets`, `-pii`, `-i18n`,
`-migrations`, `-observability` — all five clean (`found/mentions: false`, exit 0).

**Grillers with no applicable surface on this increment** (recorded so the silence is not read as a
pass): `a11y`, `i18n` — no UI, no user-facing strings; `migrations` — no schema or persisted-data
shape; `observability`, `performance` — no production runtime, no scaling surface (the index is bounded
by the lesson count); `privacy`, `security` — no PII, no secrets, no new egress or authz surface
(scanners confirm). Their axes do not reach a markdown-plus-Node-checker increment.

---

## Findings

### Axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: P0
  severity: important
  file: ".dev/features/product-lessons-index/PLAN.md:121"
  problem: "The plan narrows the guarantee to a staleness check but never states that its COVERAGE is machine-local and ephemeral, so a reader can still over-read what the shipped floor content actually buys."
  evidence: "Guarantee audit: 'the subject is a gitignored cache, so this is a staleness check.' Combined with the verdict table's 'COLD | canon has lessons; the cache is absent/unreadable | 0 GREEN', it follows — but is nowhere written — that the cache exists ONLY on the machine that ran the generator, so a fresh clone always yields COLD/GREEN and STALE can fire only in the window between a hand-edit of canon and the next regeneration, on that one machine."
```

### Axis: determinism (P5)

```yaml
- type: FINDING
  rule_id: P5
  severity: important
  file: ".dev/features/product-lessons-index/PLAN.md:104"
  problem: "'Branch on exit code only' is under-determined: exit 0 covers three states that each demand a DIFFERENT sweep behavior, and an exit code alone cannot tell them apart."
  evidence: "'**The five verdicts of `check-lessons-index.mjs`** (branch on exit code only, P5)' — yet the table gives NO_CANON, COLD and GREEN all '0 GREEN', while the determinism audit prescribes three distinct outcomes for them ('canon absent -> applied_lessons: none'; 'index stale or absent -> read canon in full'; the two-step select-then-read otherwise). Nothing in the plan supplies the discriminator."
```

### Axis: eval / verification coverage (P1)

```yaml
- type: FINDING
  rule_id: P1
  severity: important
  file: ".dev/features/product-lessons-index/PLAN.md:88"
  problem: "A verification approach is declared for the three .mjs modules but for NEITHER command edit, though the commands carry all of this increment's user-visible behavior change."
  evidence: "'**None — and that is the correct answer, not a gap.** … Their specification is the hermetic `node --test` suite, one per module' — which covers `pharn/floor/*.mjs` only. `.claude/commands/pharn-plan.md` and `.claude/commands/pharn-memory-promote.md` are named in `## Files` with no declared verification, and the one live guard that DOES range over stage-command prose — `.dev/floor/command-hygiene.test.mjs`, whose test is '✧ L19: no stage command prescribes a repo-wide formatter/linter WRITE' — is unmentioned, although this increment adds a Bash tooling invocation to a stage command and lands squarely in its blast radius."
```

### Axis: one axis of change / no sibling imports (P3)

```yaml
- type: FINDING
  rule_id: P3
  severity: important
  file: ".dev/features/product-lessons-index/PLAN.md:61"
  problem: "Placing the cross-surface pin in the DEV test file means the only guard over a PRODUCT module's constants lives in the build apparatus, and does not travel with the code it pins."
  evidence: "'`.dev/floor/lessons-index-core.test.mjs` — EDIT. Add the ✧ cross-surface pins.' Three consequences go unstated: the dependency direction is `.dev/` -> `pharn/` (apparatus reaching into shipped product); the product suite has no self-contained guard, so deleting the dev test silently removes the alignment check; and a user's install ships `pharn/floor/*` WITHOUT `.dev/`, so the pin is absent wherever the pinned code actually runs. The `check-provenance.mjs` precedent has the identical shape — which makes this consistent, not verified."
```

### Axis: honest scope / no speculation (P7)

```yaml
- type: FINDING
  rule_id: P7
  severity: important
  file: ".dev/features/product-lessons-index/PLAN.md:21"
  problem: "The P7 ship-or-defer decision and the Q1 location decision are recorded as independent, but Q1's answer materially weakened the guarantee that carried the ship decision."
  evidence: "'the human **declined it and chose the full port**' is recorded under a P7 section arguing from the brief's framing, in which the feature's floor content was dev-strength byte-equality over a COMMITTED artifact. The Q1 row ('**`.pharn/lessons-index.md`** (gitignored cache)') then reduced that to the machine-local staleness check the guarantee audit describes. Each is honest alone; their coupling is never stated."

- type: FINDING
  rule_id: P7
  severity: minor
  file: ".dev/features/product-lessons-index/PLAN.md:51"
  problem: "No in-scope file tells a USER that the generated cache exists in their repo, is disposable, or may need excluding from their own tooling."
  evidence: "`## Files` scopes `.markdownlint-cli2.jsonc` for PHARN's own lint, and the L11 line concedes PHARN 'can't edit a user's config' — but `README.md` is in scope for its GENERATED region only, and no other doc surface is named. Probed live this run: `markdownlint-cli2` does lint `.pharn/**/*.md`, so a user whose linter behaves the same way inherits the problem with nothing telling them why."
```

---

## Summary (prose)

The plan is unusually well-grounded on the axes this stage most often catches: the guarantee audit
reduces every claim, names the two Bash writes that escape fix #7 rather than pretending the gate covers
them, and explicitly **struck** the "index consulted ⇒ lessons read" conflation that is the whole
feature's risk. The trust audit is real (titles verbatim inside a fence, refusal rather than
sanitization, taint reaching no verdict), and the P7 decision is recorded with the planner's declined
recommendation intact rather than reframed after the fact. Three of its design points were re-derived
from live state against the brief rather than copied — the `.pharn/`-is-scanned correction in
particular.

The concerns cluster in two places.

**The first is a gap in the design, not the prose: F2.** The five-verdict table collapses three
behaviorally distinct states onto exit 0 while the determinism audit prescribes three different
responses to them. As written, `/pharn-plan` has no deterministic way to pick its branch — and the
tempting repair (let the model read the checker's printed verdict line) is exactly the classification
branch P5 forbids. Two clean repairs exist: give the three states distinct exit codes, or specify a
second **structural** discriminator (filesystem membership over canon and the cache). This is worth
settling before the build, not during it.

**The second is a cluster about how much this feature actually buys (F1, F5) and where its guard
lives (F3, F4).** None of these say the plan is wrong; they say a reader could finish it with a
rosier picture than the design supports. F1 and F5 together are the sharper pair: the Q1 choice made
the shipped floor content thinner than the framing under which the ship-over-defer call was made. That
is the human's to re-weigh, and re-weighing it is not the same as re-opening it.

F3 and F4 are ordinary build-shaping notes — declare how the two command edits get verified (the
existing `command-hygiene.test.mjs` is the natural home and is already in the increment's blast
radius), and state the direction and reach of the ✧ pin rather than resting on the `check-provenance`
precedent alone.

**ADVISORY VERDICT: 6 concerns raised (0 blocking-severity, 5 important, 1 minor) — for the human to
weigh before `/pharn-dev-build`.** Nothing here blocks: `/pharn-dev-grill` is advisory end-to-end, every
`severity` above is this stage's own assessment (fix #3), and the deterministic backstops remain
`/pharn-dev-build`'s spec-hash gate and `pharn/floor/validate.mjs`. "Six findings" never means "the plan
is unsound", and a clean grill would never have meant "the plan is good".
