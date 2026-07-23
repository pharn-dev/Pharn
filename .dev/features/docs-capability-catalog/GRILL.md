# GRILL — docs-capability-catalog

Header: interrogating `.dev/features/docs-capability-catalog/PLAN.md`.
Spec-hash check (content-hash primitive): **MATCH** — live `sha256(pharn/ARCHITECTURE.md)` ==
plan `spec_content_hash` (`0d0dc6da…733d`). No drift finding. (The binding block on drift is
`/pharn-dev-build`'s floor-gate, not this stage.)

Griller membership (FLOOR, `count-grillers.mjs`): 13 registered. Axes applied inline below:
testability, architecture, coupling, documentation, comprehension, security, performance. The plan
adds apparatus (no `role:` capability), so most product-code grillers (a11y/i18n/privacy/migrations/
observability) find nothing to interrogate.

## Findings (advisory — none block /pharn-dev-build)

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/docs-capability-catalog/PLAN.md:52"
  problem: "The plan does not pin the deterministic page-filename KEY. A capability's frontmatter `name` is not always unique or path-stable (a griller's name is e.g. `security-griller` while its dir is `security`; a lens `name` equals its dir). Two capabilities sharing a frontmatter `name` would collide to one page. The build must choose a collision-free, deterministic key (recommend the capability's source directory slug relative to `pharn/`, which is guaranteed unique by the filesystem) and the checker's orphan/missing detection must key off the SAME thing."
  evidence: "`docs/capabilities/<name>.md` (× 36, glob `docs/capabilities/**`) — one generated page per capability"
```

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/docs-capability-catalog/PLAN.md:74"
  problem: "Idempotence is claimed but the test list should EXPLICITLY assert order-independence from filesystem readdir order (readdirSync order is not guaranteed across platforms). A run-twice-identical test on one machine does not prove the sort is total; add a test that feeds an unsorted capability set and asserts the rendered index/page order is the fixed (role, name) order."
  evidence: "Ordering = fixed role order … then `name` ascending — total order, stable across runs"
```

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".dev/features/docs-capability-catalog/PLAN.md:88"
  problem: "Source taglines are trusted product bytes, but a tagline containing markdown control sequences (a leading `---`, backticks, a heading marker) could render a structurally-ugly page. This is NOT a floor risk (generator and checker share one core, so any such rendering is byte-equal → no false GREEN) — but the template should place source-derived free text in a fixed, escaped position so a page cannot be visually corrupted. Advisory quality, not a gate."
  evidence: "Their H1 taglines / frontmatter values are rendered verbatim as documentation DATA inside a fixed template"
```

## Prose summary

The plan is well-formed and its **guarantee audit is honest**: the headline claim ("docs cannot
silently drift from sources") reduces to a genuine floor primitive — byte-equality between committed
pages and pages recomputed from live sources (the content-hash primitive, `ARCHITECTURE §2`), plus a
set-membership check for missing/orphan pages. The advisory boundary is correctly drawn (prose
_quality_ is labeled advisory; the floor guarantees only committed == recomputed). Routing both the
generator and checker through **one shared core** is the correct P3 shape and is what makes "recompute"
faithful to "generate" — the plan states it explicitly. The GATE-1 decisions removed the only real
hazards (a fabricated install command; an unwarranted SKILLS_VERSION claim).

The three findings above are refinements for the build, not objections: (1) the page-key must be
pinned to a deterministic, collision-free identifier — the sharpest one, because an ambiguous key
could silently map two capabilities to one page and the checker would still pass; (2) tests should
prove order-independence, not just run-twice stability; (3) a rendering-position guard for
source-derived text. None reduce to a floor stop here.

## Verdict

**ADVISORY VERDICT: 3 concerns raised (0 blocking-severity, 1 important, 2 minor) — for the human to
weigh before /pharn-dev-build.** This grill-log is advisory end-to-end; it does not gate
`/pharn-dev-build`. The deterministic backstops remain `/pharn-dev-build`'s spec-hash + open-questions
floor-gates and `pharn/floor/validate.mjs`.
