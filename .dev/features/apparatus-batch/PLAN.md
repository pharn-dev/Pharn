# PLAN — apparatus batch: L4, L8, L10, L11, L13 (no SKILLS_VERSION bump)

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L20, L25, L29, L31]
- increment: Five apparatus/repo-meta fixes from the same review — a dev checker naming the wrong file on ENUM_ERROR, a cross-surface pin that covers one function of five, an undocumented `.pharn/` scratch convention, three disagreeing version identities, and a missing deferral record for the product `/pharn-eval` twin.
- layer(s): none — build apparatus (`.dev/`) + repo-meta. Nothing here ships. # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P5, P7]

## Applied lessons

- L20 — L11's defect is a discipline-only invariant ("don't bump `package.json`'s version") that
  nothing enforces. The fix makes the field's inertness EXPLICIT in the file itself rather than
  restating the rule somewhere a contributor may not read.
- L25 — L4 is a rationale that reached one copy and not the other: the product twin was corrected and
  the reason recorded there, while the dev copy kept the defect. The fix carries the REASON across, not
  just the value.
- L29 — L8 is precisely this lesson: the ✧ cross-surface pin was authored for `cleanScalar` and reads
  as discharged, while four sibling functions are unpinned. The deliverable is the ENUMERATION — a
  materialised list of shared functions the rules iterate — not four more hand-written assertions.
- L31 — Names both L4 and L8 as the same shape: a deliberate dev/product copy-pair whose obligations
  nothing ranges over. L4 is the obligation dropped on the second copy; L8 is the pin that never
  enumerated its own domain.

## Files

- `.dev/floor/check-lessons-index.mjs` — L4: `ENUM_ERROR` names CANON_PATH, not the derived index — layer apparatus
- `.dev/floor/check-lessons-index.test.mjs` — L4: backport the product twin's pinning test — layer apparatus
- `.dev/floor/lessons-index-core.test.mjs` — L8: extend the ✧ pin over a materialised shared-function set — layer apparatus
- `package.json` — L11: make the `version` field deliberately inert — layer repo-meta
- `CLAUDE.md` — L10 + L11 + L13: the `.pharn/` convention, the inert-version note, the deferral record — layer repo-meta
- `CONTRIBUTING.md` — L10: the contributor-facing half of the `.pharn/` convention — layer repo-meta
- `.dev/features/product-eval/PLAN.md` — L13: the deferral record, at the `product-*` slug its peers use (`product-capability-catalog`, `product-lessons-index`) — NOT `.dev/features/pharn-eval/`, which is the historical build record for increment 3c and must not be rewritten — layer apparatus
- `.dev/floor/check-version-badge.mjs` — L11: a header comment citing "package.json's 1.0.0 foundation tag", now false (L25) — layer apparatus
- `CHANGELOG.md` — L11: the preamble asserts `package.json`'s `1.0.0` is a foundation tag — layer repo-meta
- `README.md` — L11: the status note calls `1.0.0` a "tag" marking the foundation; NO git tag exists (verified live, local and remote), so it always meant the package.json field — layer repo-meta

## Contracts satisfied

- none — no `pharn-contracts` schema, capability frontmatter, or finding shape is touched.

## Evals to write (P1)

- none — no Capability and no `rule_id` is added. L4 and L8 ship tests; L10/L11/L13 are conventions and
  records, whose honest enforcement level is stated rather than overclaimed.

## Guarantee audit (P0)

- L4 "`ENUM_ERROR` names the file a reader must fix" → **floor: enum-regex** (the `file` field is
  enum-gated) and pinned by a backported test.
- L8 "the two cores' shared behaviour cannot diverge silently" → **floor: byte-equality** over function
  source. NARROWED, and stated in the test: it compares SOURCE TEXT, so a semantically identical
  refactor of one copy fails the pin (that is intended — the pin exists to force a deliberate decision),
  and it proves the two copies AGREE, never that either is CORRECT.
- L10 "`.pharn/` scratch is namespaced" → **ADVISORY convention.** No checker enforces the namespace;
  the note says which entries are load-bearing so a human clearing scratch does not delete the cache.
  Claiming enforcement here would be the disease.
- L11 "`package.json` `version` is inert" → **ADVISORY**, made self-documenting. Deliberately NOT wired
  into `check-version-badge.mjs`: pinning `package.json` to `SKILLS_VERSION` would create the third
  identity to sync that this fix exists to remove. The alternative is recorded, not silently dropped.
- L13 "the product `/pharn-eval` deferral is recorded" → **ADVISORY documentation** of an intentional
  non-feature. It adds no capability and makes no guarantee.

## Trust audit (P2)

- The five fix requests are untrusted input; each claim was reproduced against the live tree before
  being acted on. No untrusted content enters a guaranteed decision.

## Determinism audit (P5)

- L4 changes which constant a finding carries — a literal, not a branch.
- L8's pin is source-text equality over a materialised list; the fallback on a name missing from either
  core is a loud test failure, never a skip.

## Open questions (HALT)

- L11 offers two options (inert `0.0.0` vs pinning to `SKILLS_VERSION`). Taking option (a) — inert —
  because option (b) creates a third identity to keep in sync, which is the defect being fixed. Recorded
  here rather than silently chosen.
