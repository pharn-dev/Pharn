# PLAN — generated capability catalog (docs/capabilities/ from installable sources)

- spec_content_hash: 0d0dc6da61c4de6748aeab849ed1a4ecd9ff7f1d61e91d5848d7ffdaf022733d # fix #4 — sha256 of pharn/ARCHITECTURE.md
- increment: A deterministic generator + a drift-detecting floor checker that produce one `docs/capabilities/` page per role-bearing capability from the SAME product-surface `.md` files, so the docs cannot silently drift from their sources.
- layer(s): build apparatus (`.dev/floor/`) — NOT a product capability (resolved: Q2a dev apparatus)
- constitution_refs: [P0, P3, P5, P6, P7]

## What this is (and is NOT)

- IS: a generator (`docs:generate`), its committed output under `docs/capabilities/`, and a checker
  (`docs:check`) that recomputes the expected pages and byte-compares them to what is committed —
  RED on any drift / missing page / orphan page.
- IS NOT: a new PHARN _capability_ (no `role:` frontmatter, no evals/cases — it is tooling, like
  `.dev/floor/check-config.mjs`). It does NOT touch the four trusted docs, the floor primitives, or
  the product `pharn/` tree. Sources are READ-ONLY this increment.

## Discovery — grounded live state (P6, read this run)

- **Catalog source of truth = filesystem membership**, identical to `count-grillers.mjs` /
  `validate.mjs`: walk `*.md`, keep files whose `---`-fenced frontmatter declares a `role:`, exclude
  `.claude/commands/`, `.dev/`, `pharn/floor/`, `node_modules`, `.git`. Live count today: **36** —
  **13 grillers, 22 lenses, 1 skill** (`seam-resolver`). Contracts carry no `role:` → excluded. No
  `archetype-maps.json` manifest exists.
- **Renderable frontmatter fields (only what validate.mjs enforces/reads — no invented fields):**
  `name`, `role`, `kind`, `version` (required); `applies` (required, enum
  `universal|ssr|backend|spa|lib`) — **this is the archetype membership**, so that line IS derivable;
  plus `coupling`, `enforces`, `model_tier`, `trust`, `reads`, `writes`, `constitution_refs`, `seal`
  (all optional / role-dependent). Sparse fields → a sparse page; never fabricated.
- **Page summary / "what-it-asks (griller) / what-it-flags (lens)"** = drawn from the source body's
  H1 tagline line (`# <name> — <tagline>`), rendered verbatim as DATA.
- **No install CLI exists.** No `bin`, no `pharn add` / `pharn list`, no install-token convention,
  no shadcn machinery anywhere in-repo; README states "no installer, wizard, or packaged release."
  → the "exact install command" line is NOT derivable (see Open questions Q1).
- **No `validate` npm script.** The floor runs as its own CI step (`node pharn/floor/validate.mjs .`)
  in `ci.yml` + `floor.yml`; `npm run check` = `format:check && lint && lint:md && test`. Dev-apparatus
  checkers live in `.dev/floor/`.

## Files

> GATE-1 APPROVED with the recommended answers (Q1a: omit install line, show source path; Q2a: dev
> apparatus, no SKILLS_VERSION bump; Q3a: CI step + npm script). The list below is now final.

- `.dev/floor/capability-catalog-core.mjs` — pure core: enumerate capabilities + render one page + render index. Single source of truth shared by generator AND checker (so they cannot diverge — P3, no duplicated logic) — layer: apparatus
- `.dev/floor/capability-catalog-core.test.mjs` — unit tests for the core (render/order/idempotence/sparse-field) — apparatus (never ships)
- `.dev/floor/gen-capability-catalog.mjs` — generator entrypoint; imports the core; writes `docs/capabilities/**`; `docs:generate` npm script — apparatus
- `.dev/floor/check-capability-catalog.mjs` — drift checker; imports the core; recomputes expected output and byte-compares to committed `docs/capabilities/**`; RED on any drift/missing/orphan and prints the fix command (`npm run docs:generate`); `docs:check` npm script — apparatus
- `.dev/floor/check-capability-catalog.test.mjs` — unit tests: clean→GREEN, drift→RED, missing-page→RED, orphan-page→RED — apparatus (never ships)
- `docs/capabilities/README.md` — generated index, grouped by role with counts, one capability per line — generated output (written by the generator via `fs`, not the Write tool)
- `docs/capabilities/<slug>.md` (× 36) — one generated page per capability; `<slug>` = the capability's **source directory basename** (deterministic, collision-free — grill F1; a duplicate slug is a loud generator error, never a silent overwrite); GENERATED header names the source path + regenerate command — generated output (written by the generator via `fs`, not the Write tool)
- `package.json` — add `docs:generate` + `docs:check` scripts; add `docs:check` into the `check` chain — repo-meta (no bump)
- `.github/workflows/ci.yml` — add a "Docs catalog drift" step running `node .dev/floor/check-capability-catalog.mjs .` (mirrors the existing Validate-floor step) — CI (no bump) — (Q3a)
- `CHANGELOG.md` — Unreleased entry describing the generator + guard + output — repo-meta
- `.prettierignore` — exclude `docs/capabilities/` — build-time discovery: the byte-equality guard requires generated pages be formatter-excluded, else prettier rewrites committed bytes and the checker sees false drift — repo-meta
- `.markdownlint-cli2.jsonc` — add `docs/capabilities` to `ignores` — same reason as `.prettierignore` (markdownlint globs `**/*.md`) — repo-meta

> Build-time refinements (faithful to the GATE-1 intent, recorded per P6): (a) the 36 pages + index
> are emitted by the generator's own `fs` writes when `npm run docs:generate` runs (a Bash step), NOT
> by the agent's Write tool — so they need no writes-scope entry; the scope covers only the tool-written
> source + config. (b) Generated pages are excluded from prettier + markdownlint so the checker's
> byte-equality reduction stays pure (no formatter sits between generator output and committed bytes).
> (c) Generated pages deliberately do NOT open with a `---` `role:` frontmatter block, so `validate.mjs`
> never misclassifies a doc page as a capability.
>
> SKILLS_VERSION is NOT in scope: Q2a (dev apparatus + generated docs) is not methodology a user runs,
> so the product surface is unchanged and there is no bump.

## Contracts satisfied

- None from `pharn-contracts` (this is apparatus, not a role-bearing capability). It CONSUMES the
  frontmatter shape that `pharn/floor/validate.mjs` enforces (`ARCHITECTURE §3.1`) — it renders only
  fields validate.mjs recognizes, and enumerates by the same `role:` membership test (cite, not
  restate — P4).

## Evals to write (P1)

- P1 governs **capabilities** (role-bearing files). This increment adds **no capability**, so P1's
  eval-per-capability requirement does not attach. It is instead covered by **unit tests** (the
  apparatus convention, mirroring every `.dev/floor/*.test.mjs`): rendering, stable ordering,
  idempotence (run-twice byte-identical), drift→RED, clean→GREEN, missing-page→RED, orphan→RED.
  Target ≥90% line coverage on the core + checker (`node --test --experimental-test-coverage`).

## Guarantee audit (P0)

- "The committed `docs/capabilities/**` matches its sources (no silent drift)" → **FLOOR:
  content-hash / byte-equality.** The checker recomputes every page from the live sources via the
  shared core and byte-compares to what is committed; any inequality → RED (exit non-zero). This is
  the `ARCHITECTURE §2` content-hash primitive applied to generated output.
- "Every capability has a page; no orphan pages" → **FLOOR: enum/set membership.** The checker
  enumerates the capability set (same `role:` membership test as validate.mjs) and set-compares to the
  committed page set; a missing or orphan page → RED.
- "The generated prose is _good / useful / well-written_" → **advisory.** The template and taglines
  are model-/human-authored; the floor guarantees only committed == recomputed, never that the docs
  read well. Labeled advisory; no gate rests on it.
- "The install command / archetype line is correct" → archetype line reduces to the `applies`
  **enum** field (FLOOR-grade source); the install line is **omitted** under Q1a (nothing claimed).
  Under Q1b it would be advisory boilerplate the human supplies.

## Trust audit (P2)

- **Inputs:** the capability `.md` files are product-surface files tagged `trust: trusted`. Their H1
  taglines / frontmatter values are rendered **verbatim as documentation DATA** inside a fixed
  template — never interpreted as instructions, never fed downstream as directives.
- **Checker verdict is content-only:** `check-capability-catalog.mjs` compares **bytes** and
  **path sets**; it interprets **no field** as a decision input beyond equality. So even if a source
  tagline contained instruction-looking text, it can only change the rendered bytes (which the human
  reads), never steer the checker's proceed/stop. Taint reaches the docs (read by humans) but **not**
  any guaranteed decision (mirrors the finding-object split, `ARCHITECTURE §8`).

## Determinism audit (P5)

- Enumeration = deterministic `walk` + frontmatter `role` membership test (no LLM classification).
- Ordering = fixed role order (`griller`, `lens`, `skill`, then any future enum member) then `name`
  ascending — total order, stable across runs; no timestamps → run-twice byte-identical (idempotent).
- Rendering = pure function of (frontmatter, body-tagline). Checker verdict = byte-equality + set
  membership → an exit code. Zero LLM in the core; no fallback-to-guess (a malformed/absent source is
  a deterministic error, not a guess).

## Resolved decisions (GATE 1 — human-approved 2026-07-23)

1. **Install command line** → **Q1a: OMIT.** No CLI / install-token exists in-repo; nothing is
   fabricated. Each page renders the **relative link to its source `.md`** as the "how to get it".
   Real install lines are deferred to a future increment once a CLI/token spec lands.
2. **Placement / SKILLS_VERSION** → **Q2a: DEV APPARATUS.** Generator + checker under `.dev/floor/`,
   output under `docs/capabilities/`. Generated docs are not methodology a user runs → **no
   SKILLS_VERSION bump**; the product surface is unchanged.
3. **Drift-gate wiring** → **Q3a: CI STEP + NPM SCRIPT.** A dedicated CI step
   `node .dev/floor/check-capability-catalog.mjs .` (mirrors the Validate-floor step) plus a
   `docs:check` npm script folded into `npm run check`.

No open questions remain.
