# PLAN — a floor check binding CONTRIBUTING's gate list to package.json

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L2, L6, L20, L22, L25, L29]
- increment: Add a dev-floor checker that REDs when a gate in package.json's `scripts.check` is named nowhere in CONTRIBUTING.md, closing the residual `contributing-gate-chain`'s GRILL F1 named.
- layer(s): none — build apparatus (`.dev/floor/`), not product surface # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P5, P7]

## Applied lessons

- L2 — The checker's own header states its guarantee and its bounds inside the artifact, not only here:
  the PLAN is ephemeral, the checker is durable. Every floor op it cites is one it performs.
- L6 — The gate set is read from its STRUCTURED location (`package.json`'s `scripts.check` string),
  never hardcoded in the checker and never recalled from memory. The checker holds no gate names.
- L20 — This IS L20's remedy applied. The gate-chain drift's only remedy was "remember to update it",
  and it recurred through three gate additions; L20 says the second occurrence is the trigger to give
  it a floor check. `check-version-badge.mjs` is the precedent that fired on the same lesson.
- L22 — The `contributing-gate-chain` increment left the enumeration verified once, by hand, in prose.
  This removes the choice: the comparison is a command, run by `npm run check` and CI.
- L25 — The checker's header names BOTH failure directions it does not cover (reverse-direction
  staleness, prose accuracy) rather than a partial rationale that reads as complete analysis.
- L29 — The remedy is quantified over "every gate in the chain", so the ENUMERATION is the deliverable:
  the checker iterates the parsed set rather than asserting the seven that exist today, and the tests
  loop that set too, so an eighth gate is covered the day it lands.

## Files

- `.dev/floor/check-contributing-gates.mjs` — the checker — layer n/a (apparatus)
- `.dev/floor/check-contributing-gates.test.mjs` — its tests, incl. the wiring pins — layer n/a (apparatus)
- `package.json` — wire as `check:contributing` inside `scripts.check` — layer n/a (repo-meta)
- `.github/workflows/ci.yml` — wire as its own CI step (ci.yml never runs `npm run check`) — layer n/a (CI)
- `CLAUDE.md` — document the new floor command in the Commands block — layer n/a (repo-meta)
- `CONTRIBUTING.md` — name the new `check:contributing` gate; wiring it into `scripts.check` makes it a chain member and therefore subject to the checker itself — layer n/a (repo-meta)

## Contracts satisfied

- none — no `pharn-contracts` schema, no capability frontmatter, no finding shape.

## Evals to write (P1)

- none — P1 binds Capabilities and `rule_id`s; this adds neither. It ships **tests** instead, which is
  what CONTRIBUTING requires of the executable floor.

## Guarantee audit (P0)

- "every gate in `scripts.check` is named in CONTRIBUTING.md" → **floor: enum-regex** (parse + exact
  back-ticked-substring membership, `pharn/ARCHITECTURE.md §2` primitive #3).
- "CONTRIBUTING describes the gates correctly" → **NOT claimed.** Name presence only; stated in the
  checker header and in its RED output.
- "a gate removed from the chain but still documented is caught" → **NOT claimed, and not decidable**
  from these two files (CONTRIBUTING legitimately names non-chain scripts). Stated as a bound, with the
  reason, per L25.
- "the checker runs" → **floor only once wired**; the wiring is pinned by tests, mirroring
  `check-version-badge.test.mjs`, because `ci.yml` runs scripts individually and never `npm run check`.

## Trust audit (P2)

- Inputs are two trusted repo files read live. The checker emits no free-text from untrusted sources;
  its findings quote only gate names it parsed from `package.json`.

## Determinism audit (P5)

- Fail-closed on every unreadable/absent/empty input (`MISSING_PACKAGE`, `NO_CHECK_SCRIPT`,
  `EMPTY_CHAIN`, `MISSING_DOC`) — no input state returns GREEN by default.
- Membership is exact string containment of a back-ticked token, never a fuzzy or line-number match.
- The back-tick requirement is load-bearing: a bare substring test would make the `test` gate
  unfalsifiable, since "test" appears in ordinary prose.

## Open questions (HALT)

- Depends on `docs/contributing-gate-chain` (PR #160): on `main`, CONTRIBUTING names only 4 gates, so
  this checker correctly REDs there. This branch is stacked on that one and must merge after it.
