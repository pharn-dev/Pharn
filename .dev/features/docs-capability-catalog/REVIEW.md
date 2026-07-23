# REVIEW — docs-capability-catalog

PHARN reviewing PHARN. Increment under review: `trust: untrusted`. Floor-first: `validate.mjs` →
**GREEN (36 capabilities)**. Everything below the floor line is **advisory**.

## L-floor → P0 (guarantee audit)

**No finding.** Every guarantee the increment claims reduces to a floor primitive or is labeled
advisory:

- "committed `docs/capabilities/**` == recomputed from live sources" → **byte-equality** (content-hash
  primitive) in `check-capability-catalog.mjs`; "no missing/orphan pages" → **set membership**. Both are
  `ARCHITECTURE §2` primitives, not judgment.
- Prose quality, template usefulness → explicitly **advisory** in the code header, CHANGELOG, and
  VERIFY residual. The generator is labeled advisory (running it is orchestration). No guarantee is
  claimed over what the byte-compare does not cover. The disease ("in the contract ⇒ guaranteed") is
  absent — the guarantee is consistency (docs match generator output), not template correctness, and it
  says so.

## L-eval → P1

**No finding.** The increment adds **no `role:` capability** (it is `.dev/floor/` apparatus), so P1's
eval-per-capability requirement does not attach; `validate.mjs` GREEN confirms no role-bearing file was
introduced without evals (the 37 generated pages carry no frontmatter `role:`, so they are correctly
not capabilities). Coverage is via the two committed unit suites (14 tests, 96–98% line).

## L-trust → P2

Reviewed content did **not** steer my behavior. The generated pages embed source taglines (e.g.
"read untrusted CODE, flag…") as rendered DATA; none is an instruction. The checker's verdict is
byte-equality + path-set only — **no free-text field is interpreted**, so no guaranteed decision rests
on tainted input.

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".dev/floor/capability-catalog-core.mjs:191"
  problem: "Source-derived free text (a capability's `name` / H1 tagline) is rendered verbatim into human-facing docs; a value containing a markdown control char (a `|`, a leading `---`, backticks) is a rendering-quality risk, and the named residual (LIMITS §2) applies — a human/LLM reading the catalog could be steered by injected free text. This is NOT a floor risk (generator and checker share one core, so any rendering is byte-equal → no false GREEN), and the docs gate nothing, so it is BOUNDED, not zeroed. Sources are trusted product files today, which bounds it further."
  evidence: "`# ${name}` and `## What it ${verb}\\n\\n${tagline}` rendered into each page"
```

## L-axis → P3

No sibling imports: `gen` and `check` each import the shared `core` (tree-shaped: both depend on core,
neither on the other). Two advisory notes, neither blocking:

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/floor/capability-catalog-core.mjs:138"
  problem: "The core bundles two arguably-separate axes of change — capability ENUMERATION (which files are capabilities) and page RENDERING (the doc template). They change for different reasons, so P3 would suggest two files. Kept as one cohesive 'catalog core' deliberately, because it must be the single source of truth both generator and checker import (splitting risks the very drift the guard prevents). Acceptable as-is; split only if either axis grows."
  evidence: "enumerateCapabilities(), renderPage(), renderIndex() in one module"
- type: FINDING
  rule_id: "P4"
  severity: minor
  file: ".dev/floor/capability-catalog-core.mjs:62"
  problem: "The frontmatter parser + walk + exclusion set are MIRRORED from validate.mjs (as count-grillers/-lenses/-verifiers already do — validate.mjs exports nothing, so this is cite-not-import). This adds one more copy of the capability-membership logic: if that rule changes in validate.mjs, this core must update in lockstep. A pre-existing repo tradeoff, now with one more mirror — noted for maintenance, not a new defect."
  evidence: "parseFrontmatter/walk/EXCLUDE_SEGMENTS duplicated with a 'mirrors validate.mjs' comment"
```

## Gates (fix #3)

- **floor-gate (blocking): none.** `validate.mjs` GREEN; no P0/P1/P2/P3 blocking finding.
- **advisory (warn): 3 minor** — all judgment-based refinements, none the sole basis for blocking a
  guaranteed invariant.

## Verdict

**GREEN — 0 floor-gate findings, 3 advisory (minor).** The increment is structurally sound; the
advisory notes are refinements for a future pass, not blockers.

## Proposed lesson (candidate only — not written here)

No new canon proposed. The membership-logic mirroring (L-axis P4 finding) is a **pre-existing** repo
pattern already documented in `count-grillers.mjs`, not a recurring failure this increment first
revealed (P7) — so it does not warrant a new `.dev/memory-bank` lesson. If the mirror count keeps
growing, a future increment could extract a shared frontmatter/walk module and promote a lesson then,
via a separate human-gated `/pharn-dev-memory-promote` run.
