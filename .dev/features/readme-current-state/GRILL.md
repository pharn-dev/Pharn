# GRILL — readme-current-state

Plan interrogated: `.dev/features/readme-current-state/PLAN.md` (137 lines, `trust: untrusted`).
**Spec-hash check (content-hash primitive, surfaced not blocking):** recomputed
`sha256(pharn/ARCHITECTURE.md)` = `0d0dc6da61c4de6748aeab849ed1a4ecd9ff7f1d61e91d5848d7ffdaf022733d` —
**matches** the plan's pinned `spec_content_hash`. No drift. (The blocking check on drift is
`/pharn-dev-build`'s, fix #4 — this only warns early.)

**Griller membership (FLOOR — enum/regex, `pharn/floor/count-grillers.mjs`):** 13 registered. Their
findings below are **advisory**; membership is the only runtime floor guarantee any griller carries.

**Deterministic plan scanners run** (`.dev/floor/scan-plan-*.mjs`, the partial-floor sub-checks of the
secrets / pii / i18n / migrations / observability grillers):

| scanner                    | result                                                                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scan-plan-secrets.mjs`    | `{"found":false,"hits":[]}`                                                                                                                         |
| `scan-plan-pii.mjs`        | `{"found":false,"hits":[]}`                                                                                                                         |
| `scan-plan-i18n.mjs`       | `{"found":false,"hits":[]}`                                                                                                                         |
| `scan-plan-migrations.mjs` | `{"mentions":false,"hits":[]}`                                                                                                                      |
| `scan-plan-observability`  | `{"mentions":true,"hits":[{"term":"logging"}]}` — a prose hit only; the increment emits no runtime logs beyond a generator status line. No finding. |

---

## Axis: testability → P1

**Layer 1 (presence): PRESENT.** The plan carries a substantive `## Verification gate` (6 numbered
items) plus a `## Evals to write (P1)` section that explains why P1 does not attach. **No absence
finding.**

**Layer 2 (adequacy): one finding.** The verification gate did not survive the GATE-1 amendment intact.

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/readme-current-state/PLAN.md:125"
  problem: "The verification gate is STALE with respect to the plan's own amended `## Files`: it demands coverage and tests for `.mjs` files that no longer exist under the chosen Option A. Line 124 says 'Unit tests for every `.mjs` CREATED — core, gen, check' and line 125 says '≥90 % line coverage on the THREE NEW `.mjs`', but Option A creates NO new `.mjs` at all — it modifies three existing ones (`capability-catalog-core.mjs`, `gen-capability-catalog.mjs`, `check-capability-catalog.mjs`) and creates exactly one new file, a TEST file. Read literally the coverage bar binds to an empty set and is vacuously satisfiable — a gate that cannot fail is not a gate."
  evidence: "line 124 'Unit tests for **every** `.mjs` created — core, gen, check'; line 125 '**≥90 % line coverage** on the three new `.mjs`'"
```

> **Resolution recorded for `/pharn-dev-build` (grill cannot amend the PLAN — its writes-scope is this
> file alone, fix #7).** The gate is to be read as binding on the **three modified** `.mjs` — `.dev/floor/capability-catalog-core.mjs`,
> `.dev/floor/gen-capability-catalog.mjs`, `.dev/floor/check-capability-catalog.mjs` — at ≥90 % line
> coverage. That is the strictly stronger reading and matches the originating Design's wording
> ("every `.mjs` created **or modified** (core, gen, check)"). `/pharn-dev-verify` will report the
> measured numbers rather than the plan's phrasing.

## Axis: architecture → P3

```yaml
- type: FINDING
  rule_id: "P3"
  severity: important
  file: ".dev/features/readme-current-state/PLAN.md:56"
  problem: "The chosen approach puts a THIRD change-axis into `capability-catalog-core.mjs` — it will hold capability enumeration, capability-page rendering, AND (new) repo-surface enumeration plus README-block rendering — and leaves three files named `*-capability-catalog*` doing work that is not the capability catalog. P3 says a file changes for exactly one reason; this file will change for at least three. The prior increment's REVIEW pre-registered the exit condition for precisely this growth."
  evidence: "'`capability-catalog-core.mjs` will carry a **second** rendering axis plus four enumerators unrelated to capabilities, and the three `*-capability-catalog*` filenames will no longer describe everything they do.'"
```

> **Not a defect the build should silently 'fix'.** The plan's self-label ("accepted deliberately") is a
> claim the plan makes about itself and carries no weight here — but the **run record** does: this was
> presented as an explicit three-way choice at GATE 1 and the human selected Option A over the planner's
> Option C recommendation. The finding stands as the honest cost of that decision, not as a plan error.
> It is **advisory** — grillers never gate.

## Axis: coupling → P3

```yaml
- type: FINDING
  rule_id: "P3"
  severity: important
  file: ".dev/features/readme-current-state/PLAN.md:54"
  problem: "Option A makes the increment MODIFY the exact three files the repo's existing docs/capabilities byte-equality guarantee is built on, so a regression in the new code can ripple into a guarantee this increment never intended to touch — a change-ripple across a boundary that Option C would have insulated. The plan states the benefit of that entanglement (CI picks the new guard up for free) but nowhere states the cost or names a containment measure; it also drops the 'zero regression risk to the existing guarantee' assurance that the pre-amendment draft carried, without replacing it."
  evidence: "'CI's existing `run: node .dev/floor/check-capability-catalog.mjs .` step therefore picks the new README guard up for free (this is the payoff of Option A against Discovery finding 1).'"
```

> **Containment available at no cost, recommended to `/pharn-dev-build`:** keep `enumerateCapabilities()`,
> `renderPage()`, `renderIndex()`, `buildCatalog()` and `listCommittedPages()` **byte-unchanged**, add the
> new surface purely additively, and let the existing catalog suites plus `docs:check` stand as the
> containment evidence — the 37 committed catalog files must come out byte-identical after the change.

## Axis: documentation → P7

**Presence: PRESENT.** New public surface (exported enumerators, `renderReadmeCurrentState()`, splice /
extract helpers, marker constants, new hard-error modes) is matched by declared documentation: file
header comments, a `CLAUDE.md` _Conventions_ note, and a `CHANGELOG.md` entry. **No absence finding.**
One adequacy note, below severity, recorded in prose only: the plan does not say the marker comment's
own text is the user-facing instruction for regeneration — it is, and it should keep naming
`npm run docs:generate` verbatim so a reader who edits between markers is told the fix on the spot.

## Axis: comprehension → P7

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/readme-current-state/PLAN.md:112"
  problem: "The plan mandates a fail-closed basename guard (`/^[A-Za-z0-9._-]+$/`, throw on mismatch) but records no verification that the LIVE repo's basenames actually pass it — an unstated assumption on which `npm run docs:generate` either runs or hard-errors on first use. The WHY (the recorded L-trust finding) is captured well; the 'does it run here today' check is not."
  evidence: "'every enumerated basename must match `/^[A-Za-z0-9._-]+$/` — otherwise the renderer **throws** rather than emitting it.'"
```

> **Checked during this grill (so the build is not flying blind):** all 4 contract, 18 command, 3 hook
> and 35 floor-checker basenames were tested against that pattern — **0 violations**. The guard is
> satisfiable on the live tree today.

## Axis: guarantee-audit completeness → P0

**No blocking finding.** Every claim in `## Guarantee audit (P0)` carries either a named primitive or an
explicit `ADVISORY` label, including the three that a weaker plan would have overstated: the
`validate.mjs` **mirror** (labeled advisory, not "the floor validates this count"), the glob
enumerations' _meaningfulness_ (advisory), and prose outside the markers (advisory **and unguarded**).
The `## Guarantee audit` closes with an explicit disease check — "a wrong enumerator would be
regenerated and committed wrongly, and the gate would stay GREEN" — which is the honest statement of
what byte-equality does **not** buy. One narrower gap:

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/readme-current-state/PLAN.md:54"
  problem: "Under Option A the CI step that will now also guard the README block keeps the name 'Docs catalog drift', which understates its scope — and because the plan deliberately excludes `.github/workflows/ci.yml` from `## Files`, the writes-scope hook will DENY any attempt to correct the label during this build. The inaccuracy is cosmetic (the step does run the widened checker), but it is structurally unfixable inside this increment, so it must be reported rather than quietly left."
  evidence: "'`package.json` and `.github/workflows/ci.yml` are **unchanged** under Option A.'"
```

## Axis: trust propagation → P2

**No finding.** `## Trust audit (P2)` states the ingested untrusted surface (repo-derived filenames), the
residual (`LIMITS.md §2` — a human/LLM reading the README could be steered), and why it is **bounded,
not zeroed**: generator and checker share one renderer so no false GREEN is reachable, the README gates
nothing, and sources are hook-protected paths. Taint reaches human-facing output, never a guaranteed
decision. That is the correct shape.

## Axis: determinism → P5

**No finding.** Enumeration is glob + prefix/suffix membership; every list is sorted; marker location is
an occurrence **count** plus an index comparison (0 / ≥2 / inverted → hard error), never a nearest-match
heuristic; a missing expected directory throws rather than rendering a plausible `0`. No branch rests on
model classification, and no fallback ends in a guess.

## Axis: honest scope → P7

**No finding.** One increment, one axis (a generated + guarded README block). The hand-prose rewrite is a
required consequence — leaving the old bullets would double-state counts the block now owns — not a
second feature. Noted in prose only, below severity: `gen-capability-catalog.test.mjs` will incidentally
cover pre-existing untested behavior (stale-page removal) that predates this increment; that is the
verification gate's demand, not scope creep.

## Axes with no findings

`security` (no auth/crypto/network surface; `scan-plan-secrets` clean), `privacy` (`scan-plan-pii`
clean), `error-handling` (every new failure mode is an explicit throw or a RED with the fix command
printed), `performance` (a directory walk over a small repo, run in CI only), `migrations`, `i18n`,
`a11y`, `observability`.

---

## Summary

The plan is unusually well-grounded: live-verified discovery, both README lies confirmed against disk
rather than asserted, the prompt's named prettier-idempotence HALT pre-tested and cleared, and a
guarantee audit that names what byte-equality does **not** buy. Three doc-vs-repo mismatches were
surfaced rather than papered over — including one that contradicts the originating prompt's own premise
about CI wiring.

The concerns worth the human's attention are the two P3 findings and the stale gate:

1. **The stale verification gate (P1, important)** is the only finding with a real chance of degrading
   the build if unhandled — a coverage bar that binds to an empty set. Resolution is recorded above and
   `/pharn-dev-verify` will report measured numbers.
2. **The two P3 findings (architecture, coupling)** are the price of the GATE-1 decision, not plan
   errors. They are logged because a plan does not get to self-absolve by writing "accepted" next to its
   own cost — but the decision was the human's, made with the alternatives in front of them.
3. **The P0 CI-label finding (minor)** is structurally unfixable inside this increment by design.

Nothing here contradicts the plan's core claim, and no injected or instruction-shaped content was found
in the plan — every quotation above is rendered as DATA.

**ADVISORY VERDICT: 5 concerns raised (0 blocking-severity, 3 important, 2 minor) — for the human to
weigh before `/pharn-dev-build`.** This log gates nothing; `/pharn-dev-build`'s floor-gates (spec-hash
drift, unresolved `## Open questions`) and `pharn/floor/validate.mjs` remain the only deterministic
stops.
