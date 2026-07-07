# PLAN — applies-scope (archetype scoping on grillers + lenses)

- spec_content_hash: 11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969 # fix #4 — sha256(ARCHITECTURE.md), pinned this run
- increment: Add an enum-gated `applies:` frontmatter field (archetype scoping) to every griller + lens capability, and a deterministic floor check that its values are members of the archetype enum.
- layer(s): pharn-pipeline (grillers) + pharn-review (lenses) + .dev/floor (the deterministic floor tool) # ARCHITECTURE.md §4
- constitution_refs: [P0, P3, P4, P5, P6, P7]

## Decisions carried in (resolved at plan-time via halt-and-ask, P6)

- **Enum = §5's archetype set + a `universal` wildcard:** `APPLIES_ENUM = {universal, ssr, backend, spa, lib}`.
  This reuses ARCHITECTURE §5's `archetype ∈ {ssr, backend, spa, lib}` **verbatim** and adds `universal`
  as a scoping sentinel meaning "all archetypes." It does **not** redefine what an archetype is, so **no
  edit to the human-only ARCHITECTURE.md is required** (P3/P4/P6-clean). The CLI's `{universal, frontend,
db, ...}` set was **rejected** because it contradicts §5 and points at an out-of-repo `archetype.ts`
  I cannot verify (P6).
- **P7 driver = fix #5's "which grillers run" map.** ARCHITECTURE §5 already names "which grillers run"
  as one of the four archetype-driven maps, and `validate.mjs` CHECK 7 already anticipates an
  archetype-keyed `grillers` map. `applies:` is the per-capability realization of that
  **existing-but-unbuilt** concept — an internal, non-speculative driver. Not built for the (absent) CLI.
- **Floor strictness = REQUIRED (GATE-2 change).** Originally planned optional (enum-checked when
  present, mirroring `coupling` CHECK 4); at GATE-2 the human elected to make `applies:` **required** —
  every capability must declare a valid `applies:` or the floor is RED (absent/empty → RED; each value ∈
  enum). This reverses the GATE-1 optional decision and also subsumes the empty-`[]` boundary. It
  requires adding `applies:` to the `test-fixtures/green` fixture (scope expanded above).

## Files

<!-- 13 griller capability frontmatters (add one `applies:` line each) -->

- `pharn-pipeline/grillers/a11y/a11y.md` — add `applies: ["ssr", "spa"]` (UI-bearing archetypes) — layer pharn-pipeline
- `pharn-pipeline/grillers/architecture/architecture.md` — add `applies: ["universal"]` — layer pharn-pipeline
- `pharn-pipeline/grillers/comprehension/comprehension.md` — add `applies: ["universal"]` — layer pharn-pipeline
- `pharn-pipeline/grillers/coupling/coupling.md` — add `applies: ["universal"]` — layer pharn-pipeline
- `pharn-pipeline/grillers/documentation/documentation.md` — add `applies: ["universal"]` — layer pharn-pipeline
- `pharn-pipeline/grillers/error-handling/error-handling.md` — add `applies: ["universal"]` — layer pharn-pipeline
- `pharn-pipeline/grillers/i18n/i18n.md` — add `applies: ["ssr", "spa"]` (UI-bearing archetypes) — layer pharn-pipeline
- `pharn-pipeline/grillers/migrations/migrations.md` — add `applies: ["backend", "ssr"]` (DB concern; GATE-2) — layer pharn-pipeline
- `pharn-pipeline/grillers/observability/observability.md` — add `applies: ["universal"]` — layer pharn-pipeline
- `pharn-pipeline/grillers/performance/performance.md` — add `applies: ["universal"]` — layer pharn-pipeline
- `pharn-pipeline/grillers/privacy/privacy.md` — add `applies: ["universal"]` — layer pharn-pipeline
- `pharn-pipeline/grillers/security/security.md` — add `applies: ["universal"]` — layer pharn-pipeline
- `pharn-pipeline/grillers/testability/testability.md` — add `applies: ["universal"]` — layer pharn-pipeline

<!-- 22 lens capability frontmatters (add one `applies:` line each) -->

- `pharn-review/copy-paste-drift/copy-paste-drift.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/duplicated-logic/duplicated-logic.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/hallucinated-api/hallucinated-api.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/injection/injection.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/input-validation/input-validation.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/insecure-crypto/insecure-crypto.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/magic-values/magic-values.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/missing-await/missing-await.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/missing-error-handling/missing-error-handling.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/missing-timeout/missing-timeout.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/n-plus-one/n-plus-one.md` — add `applies: ["backend", "ssr"]` (DB concern; GATE-2) — layer pharn-review
- `pharn-review/null-deref/null-deref.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/off-by-one/off-by-one.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/path-traversal/path-traversal.md` — add `applies: ["backend", "ssr"]` (server-only; GATE-2) — layer pharn-review
- `pharn-review/placeholder-as-done/placeholder-as-done.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/race-condition/race-condition.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/resource-leak/resource-leak.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/secrets-in-code/secrets-in-code.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/ssrf/ssrf.md` — add `applies: ["backend", "ssr"]` (server-only; GATE-2) — layer pharn-review
- `pharn-review/swallowed-exception/swallowed-exception.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/trust-fence/trust-fence.md` — add `applies: ["universal"]` — layer pharn-review
- `pharn-review/unsafe-deserialization/unsafe-deserialization.md` — add `applies: ["backend", "ssr"]` (server-only; GATE-2) — layer pharn-review

<!-- the floor: the required-enum check + its tests + the green fixture (GATE-2: now REQUIRED) -->

- `.dev/floor/validate.mjs` — add `APPLIES_ENUM = ["universal","ssr","backend","spa","lib"]` const + a per-capability **REQUIRED** `applies` check (absent/empty → RED; each value ∈ enum); update the header checklist comment — layer .dev/floor
- `.dev/floor/validate.test.mjs` — add `withRepo` tests: valid `applies` → GREEN; non-enum value → RED (attributable); MISSING `applies` → RED (required); and add `applies` to `VALID_CAP` — layer .dev/floor
- `.dev/floor/test-fixtures/green/skill.md` — add `applies: ["universal"]` so the GREEN-fixture test stays green under the required check (GATE-2 scope expansion) — layer .dev/floor

**Placement note (build detail):** insert the `applies:` line immediately after each capability's
`coupling:` line (all 35 capabilities carry `coupling:`; fall back to after `model_tier:` if any does
not). Use the quoted inline-array style (`applies: ["universal"]`) to match existing `reads:` /
`constitution_refs:` frontmatter and stay Prettier-clean.

**Classification note (advisory; GATE-2 final taxonomy):** carve-outs off `["universal"]` are —
UI-bearing: `a11y`/`i18n` → `["ssr","spa"]`; DB concerns: `migrations`/`n-plus-one` → `["backend","ssr"]`
(GATE-2, so SSR apps that own a DB also match); server-only security lenses: `ssrf`/`path-traversal`/
`unsafe-deserialization` → `["backend","ssr"]` (GATE-2 — need a server; a pure SPA/lib cannot exhibit
them). Everything else — cross-cutting security (`injection` [XSS+SQLi span FE+BE], `input-validation`,
`insecure-crypto`, `secrets-in-code`, `trust-fence`) and all correctness lenses — stays `["universal"]`.

## Contracts satisfied

- **Capability frontmatter (ARCHITECTURE §3.1)** — `applies:` is added as an **additive, enum-gated**
  frontmatter field. `validate.mjs` is field-set-permissive (checks required fields + enum membership of
  present fields; ignores unknown keys), so the addition is non-breaking. **Reconciliation surfaced (not
  agent-edited):** §3.1's frontmatter block does not yet _list_ `applies:`. ARCHITECTURE.md is human-only
  (hook-denied, fix #2); a human may later document `applies:` in §3.1. Cited, not restated (P4).
- **Archetype enum (ARCHITECTURE §5)** — `applies:`'s archetype-specific members are exactly §5's
  `{ssr, backend, spa, lib}`; `universal` is an `applies:`-scope-only wildcard. No parallel/second
  archetype vocabulary is introduced (P4 single-source-of-truth preserved).

## Evals to write (P1)

- **Floor check → `.dev/floor/validate.test.mjs`:**
  - case: a capability whose `applies:` holds a non-enum value (e.g. `["frontend"]`) → expected: `FLOOR: RED`, exit 1.
  - case: a capability whose `applies:` holds valid members (e.g. `["universal"]` and `["ssr","spa"]`) → expected: `FLOOR: GREEN`, exit 0.
- **No capability gains a new `enforces` rule_id** (`applies:` is metadata, not an enforced rule), so no
  capability `evals/cases|expected` fixtures are added or changed. The floor test above **is** the P1 spec
  for the new deterministic check (the convention for floor tools: a `node --test` suite, not `evals/`).

## Guarantee audit (P0)

- **"The floor rejects a capability whose `applies:` contains a value outside `{universal, ssr, backend,
spa, lib}`"** → **floor: enum/regex check** (`validate.mjs` set-membership over `APPLIES_ENUM`). A real,
  deterministic guarantee — this is the one thing the increment adds to the floor.
- **"A capability's `applies:` value is the _semantically correct_ archetype set (e.g. a11y really is
  UI-only)"** → **advisory.** The floor checks enum membership only, **never** whether the classification
  is right. The per-capability assignment is human authoring judgment (static metadata written once), not
  a runtime branch. Labeled advisory wherever it appears.
- **"pharn-cli (or a future map) can filter capabilities per stack via `applies:`"** → **advisory.** No
  in-repo consumer reads the field yet; `applies:` is enum-checked _data_ a future consumer may use. The
  floor guarantees only the field's enum-validity, not any filtering behavior. (P7: the field is justified
  by fix #5's _internal_ map concept, not by the absent CLI.)

## Trust audit (P2)

- **N/A — no untrusted artifact is ingested.** This increment edits `trust: trusted` capability
  frontmatter and the floor tool. `applies:` is a **floor-verifiable, enum-gated** field (the trusted
  class per ARCHITECTURE §8), not free text — there is no tainted free-text field and no taint to
  propagate. No guaranteed decision rests on model-authored prose here.

## Determinism audit (P5)

- The new floor branch is a pure **membership test** (`value ∈ APPLIES_ENUM`) — deterministic, non-LLM,
  no fallback chain needed. The per-capability value is authored once as static metadata (not an LLM
  classification driving a runtime branch), then validated deterministically by the floor. Compliant.

## Open questions — RESOLVED at GATE 1 (human approval; none remain unresolved)

Both were folded into the plan-approval form and settled by the human's **"Approve as written"** selection —
no open question remains, so `/pharn-dev-build`'s open-questions HALT does not fire.

1. **DB-concern archetype breadth.** _Resolved:_ keep `migrations` / `n-plus-one` = `["backend"]` (the
   approved preview). The `["backend","ssr"]` alternative was offered and **not** chosen.
2. **§3.1 documentation of `applies:` (reconciliation).** _Resolved:_ proceed now (add the field + floor
   gate); documenting `applies:` in the human-only ARCHITECTURE §3.1 is left as a later human doc edit,
   **surfaced** (this plan + GRILL.md), never agent-edited.
