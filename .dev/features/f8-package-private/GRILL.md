# GRILL — f8-package-private

Plan under interrogation: `.dev/features/f8-package-private/PLAN.md`.

**Spec-hash check:** recomputed `sha256(pharn/ARCHITECTURE.md)` =
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`, matches the plan's
`spec_content_hash` exactly. No drift.

**Griller membership (floor, `pharn/floor/count-grillers.mjs`):** 13 registered
(`a11y, architecture, comprehension, coupling, documentation, error-handling, i18n, migrations,
observability, performance, privacy, security, testability`). All 13 applied below; this is advisory
end-to-end (fix #3) — nothing here gates `/pharn-dev-build`.

## Findings

```yaml
- type: FINDING
  rule_id: P1
  severity: important
  file: ".dev/features/f8-package-private/PLAN.md:1"
  problem: "The plan declares no verification/acceptance approach for the change it makes — the '## Evals to write (P1)' section correctly says 'None' because package.json is not a Capability, but that answers a different question than 'how do we know the fix worked.'"
  evidence: "## Evals to write (P1)\n\n- None — P1 (\"no Capability ships without evals\") governs `role:`-bearing Capabilities under `pharn/`. `package.json` carries no `role:` frontmatter and is not a Capability, so P1 does not apply to this increment."
```

```yaml
- type: FINDING
  rule_id: P0
  severity: minor
  file: ".dev/features/f8-package-private/PLAN.md:24"
  problem: 'The guarantee audit correctly labels the npm-refusal behavior advisory (no PHARN floor primitive backs it), but does not name that this leaves no regression guard: a future edit could silently drop "private": true and nothing in `npm run check` would catch it.'
  evidence: '"A real `npm publish` refuses once `private: true` is set" -> advisory (external system behavior). ... no PHARN-side hook, hash, or enum check enforces it.'
```

```yaml
- type: FINDING
  rule_id: P3
  severity: minor
  file: ".dev/features/f8-package-private/PLAN.md:19"
  problem: 'The single ''## Files'' entry bundles two edits to package.json — adding "private": true (a publish-safety fix) and deleting the dead "main" field (a stale-reference cleanup) — under one stated axis; worth the human''s explicit confirmation these are one reason to change, not two glued together.'
  evidence: '- package.json — add "private": true after "version"; delete the "main": "index.js" line — layer repo-meta'
```

```yaml
- type: FINDING
  rule_id: P2
  severity: minor
  file: ".dev/features/f8-package-private/PLAN.md:1"
  problem: "The originating defect narrative frames this as preventing the repo from being 'shipped' via publish, which could read as a confidentiality fix; the repo is already public on GitHub, so the actual value of `private: true` is preventing npm-registry namespace confusion with the real `@pharn-dev/pharn` package, not secret exposure — worth precise phrasing in the commit message / CHANGELOG note."
  evidence: '"A single `npm publish` would push the entire working tree -- .dev/, pharn/, .claude/, everything -- to the registry under that name."'
```

## Non-findings (checked, no concern)

- **Documentation griller (P7):** no public/exported surface is added (`private`/`main` are npm-standard
  package.json fields, not a new API or config key a downstream consumer reads) — genuinely needs no
  dedicated documentation. Advisory-only observation: given this repo's own exhaustive CHANGELOG habit
  (see the `[Unreleased]` F9 entry), the optional one-line note the plan allows is worth taking even
  though not required.
- **Architecture griller (P3, Layer 2 fit):** correctly scoped outside the `pharn/` capability tree as
  repo-meta; no architectural-fit concern.
- **Security griller (Layer 1, floor secret-literal scan):** no hardcoded secret or credential literal
  in the plan text — clean.
- **Testability griller (Layer 2 adequacy):** N/A — Layer 1 already raised absence above; adequacy is
  moot until a verification approach exists.
- **a11y, coupling, comprehension, error-handling, i18n, migrations, observability, performance,
  privacy:** not applicable — no UI, no runtime code path, no cross-module coupling, no error-handling
  surface, no user-facing text, no data migration, no metrics/logging surface, no perf-sensitive path,
  no personal data. One JSON config file, two fields, zero behavior.

## Summary

The plan is small and well-scoped, and the spec→plan hash chain holds. The two live findings worth the
human's attention before build: (1) the plan doesn't declare how the fix will be verified beyond "re-run
the reproduce" implied by context — the build/verify stages will in practice confirm it via
`npm run check` + the plan's own verification checklist from the originating request, but that checklist
never made it into `PLAN.md`'s structure; (2) there is no durability guard against a future silent
regression of `private: true` — named here as a residual, not a recommendation to build a checker now
(P7: no trigger from a real dogfood/eval failure exists yet, the same reasoning `product-capability-catalog`
used to defer its own follow-up). The P3 bundling and P2 risk-framing notes are precision nits, not
blockers.

**ADVISORY VERDICT: 4 concerns raised (0 blocking-severity, 1 important, 3 minor) — for the human to
weigh before `/pharn-dev-build`. This is not a pass/fail gate; `/pharn-dev-grill` blocks nothing.**
