# PLAN — CONTRIBUTING's gate chain, the docs:generate obligation, the dev/product boundary line, and the canonical repo slug

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L1, L2, L6, L13, L20, L22, L25, L29, L31]
- increment: Repair three repo-meta drifts in the contributor-facing docs — CONTRIBUTING's stale 4-of-7 restatement of `npm run check` plus the missing `docs:generate` obligation (M5), CONTRIBUTING's inverted dev/product floor paths (M6), and the stale `pharn-dev/pharn` repo slug in CONTRIBUTING and SECURITY (L12).
- layer(s): none — repo-meta (no product surface, no capability, no contract) # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P4, P6, P7]

## Applied lessons

- L1 — Ran the meta-doc sweep. Live evidence: the `npm run check` chain is restated outside `.dev/` and
  CHANGELOG history in exactly two places, both in `CONTRIBUTING.md` (`:33`, `:37`); `README.md` has no
  copy and `CLAUDE.md`'s references are accurate. CHANGELOG is deliberately NOT in `## Files` —
  precedent `ba1d3d6` (apparatus-only, no bump) carries no CHANGELOG entry, and CLAUDE.md lists
  `CONTRIBUTING` / `SECURITY` / `README` in the pure-repo-meta set that does not bump.
- L2 — Every gate and every path this edit names was verified LIVE this run before being cited, never
  read out of CLAUDE.md: all six `.dev/floor/*.mjs` gate scripts exist, `check-lessons-index.mjs` was
  executed (GREEN), `.github/workflows/ci.yml` was read to confirm it invokes each script individually
  and never `npm run check`, and both floor directories were listed to confirm which holds which
  checkers. The honesty travels INTO the artifact: the new prose labels `docs:check`'s guarantee as
  byte-equality, not correctness.
- L6 — Supplies the remedy's shape for M5: a structural fact is read from its structured location. The
  new prose points the reader at `package.json`'s `scripts.check` as the authoritative list and frames
  its own enumeration as orientation, so the doc stops being a second source of truth for a fact
  `package.json` already holds structurally. Applied again for L12: the canonical slug was read from
  the GitHub API's `full_name`, not inferred from the local remote string.
- L13 — This stage formats its own artifact (this PLAN.md) with prettier + markdownlint-cli2 scoped to
  the single file before the halt, never a repo-wide sweep.
- L20 — M5's defect is exactly this shape: the old line's only remedy was "remember to update it when a
  gate is added", and it drifted through three added gates. The remedy chosen is NOT a louder reminder
  — it REMOVES the restatement's authority (defer to `package.json`), so a future gate addition leaves
  the doc incomplete-and-self-labelled rather than silently wrong. No new floor check is added: P7's
  trigger has not fired, and the escalation precedent that DID fire (`check-version-badge.mjs`) pins a
  machine-comparable single value, which a prose gate list is not.
- L22 — Applied to prose rather than shell: the fix prescribes WHERE the authoritative list lives
  instead of describing the chain and leaving the next reader to re-derive it.
- L25 — Load-bearing twice this run. (1) M5's replacement enumeration was re-derived from
  `package.json` live, not carried across from the old sentence. (2) It is why L12's premise was
  re-derived instead of trusted: the fix request asserted the local git remote is the authority, which
  would have produced the INVERTED fix. A partial rationale that reads as completed analysis is the
  trap this lesson names, and the request contained one.
- L29 — The remedy is quantified over a set, so the ENUMERATION is the deliverable, and it was
  materialized by grep before scoping in both halves. M5: both restating sites (`:33` and `:37`) — the
  request names only `:33` in its File field, so fixing that alone would have left `:37`'s four-item
  prose restatement looking discharged. L12: a repo-wide sweep for `pharn-dev/pharn` not followed by
  `-oss` — the request named three files; the live set is two, and four further hits are historical
  `.dev/features/*` audit records that must NOT be rewritten.
- L31 — Checked the copy-pair axis this lesson says to look at first. M5: the chain is restated in
  `CONTRIBUTING.md` while `package.json` holds it structurally — a copy-pair whose second copy had no
  obligation ranging over it; the fix collapses the pair rather than pinning the two to agree. L12: the
  repo slug is a copy-pair across README (correct) and CONTRIBUTING/SECURITY (stale), and the stale
  half was invisible because GitHub's rename redirect keeps it working.

## Files

- `CONTRIBUTING.md` — three edits: (M5) replace the `:33` gate comment and the `:37` prose, and add the `docs:generate` obligation; (M6) correct the `:57` dev/product boundary bullet to name `.dev/floor/`; (L12) align the `:22` clone URL to the canonical slug — layer n/a (repo-meta)
- `SECURITY.md` — (L12) align the `:26` security-advisories URL to the canonical slug — layer n/a (repo-meta)

## Contracts satisfied

- none — this increment touches no `pharn-contracts` schema, no capability frontmatter, and no finding
  shape. It edits two repo-meta governance docs.

## Evals to write (P1)

- none — P1 binds Capabilities (`role:`-bearing files) and `rule_id`s. This increment adds neither, so
  no eval is owed. Both files are covered by the existing `lint:md` and `format:check` gates (verified
  live: neither appears in `.prettierignore` nor in `.markdownlint-cli2.jsonc`'s `ignores`).

## Guarantee audit (P0)

- "CONTRIBUTING now lists the current gates" → **advisory**. Prose accuracy is not floor-checked;
  nothing reads this doc's gate list. The mitigation is structural, not a guarantee: the text defers to
  `package.json` so a future drift makes it incomplete rather than authoritative-and-wrong.
- "`npm run check` is the aggregate gate" → **advisory** as a sentence; the underlying gates are FLOOR
  (enum/regex + byte-equality) but this doc only NAMES them. Stated in the doc: CI runs each script
  individually and never `npm run check`, so a green local `check` is not itself a claim about CI.
- "`docs:check` RED-fails on drift" → **floor: enum-regex / byte-equality**
  (`.dev/floor/check-capability-catalog.mjs`, `.dev/floor/check-lessons-index.mjs`). NARROWED and
  stated in the doc: byte-equality is consistency (committed == recomputed), never that the generated
  content is TRUE.
- "the floor checks structural invariants" → unchanged existing sentence, already correctly labelled
  ("the shape is sound", never "the design is right"). Preserved.
- "`pharn-dev/pharn-oss` is the canonical slug" → **advisory as prose, but derived from a
  deterministic membership test**: `gh api repos/pharn-dev/pharn --jq .full_name` returns
  `pharn-dev/pharn-oss`, both slugs share `created_at`, and raw HTTP gives 301 vs 200. No floor check
  pins a URL in a markdown doc, and none is added (P7 — no triggering failure for one).
- "no SKILLS_VERSION bump" → **membership**: `CONTRIBUTING.md` and `SECURITY.md` are both named in
  CLAUDE.md's pure-repo-meta set, outside the bump-triggering product surface; corroborated by
  precedent `ba1d3d6`. `check:badge` pins the README badge to `SKILLS_VERSION`; leaving both unmoved
  keeps it GREEN, and no README byte is touched.

## Trust audit (P2)

- The fix requests supplied as this run's arguments are **untrusted input** and were treated as DATA:
  every factual claim was RE-VERIFIED against live state before being acted on, not accepted. Two
  claims failed verification and were overridden rather than followed:
  1. L12 asserts the canonical slug should be confirmed "against the actual git remote". The live
     remote is `git@github.com:pharn-dev/pharn.git`, but the GitHub API resolves that to
     `pharn-dev/pharn-oss` and raw HTTP returns **301** for `pharn/` vs **200** for `pharn-oss/`. The
     remote is the STALE side, kept working by GitHub's rename redirect. Following the request's stated
     method would have rewritten README's four correct badges to the stale slug — the inverse of the fix.
  2. L12 asserts "whichever slug is stale 404s for that link class". Verified false: the stale slug
     301-redirects today. The real exposure is future — a new repo created at `pharn-dev/pharn` would
     break the redirect silently. The fix still lands; the stated justification does not.
- L12's own escape clause ("halt and ask if ambiguous, P6") was evaluated and NOT triggered: 301-vs-200
  with an identical `created_at` is decisive, not ambiguous, so this is a determination, not a guess.
- No untrusted artifact is ingested INTO the built output: all new prose is authored from
  `package.json`, `ci.yml`, the live floor directories, and the GitHub API — trusted sources read live.

## Determinism audit (P5)

- M5's gate enumeration was derived by reading `package.json`'s `scripts.check` string and `ci.yml`'s
  `run:` steps — structured locations, not an LLM recollection of which gates exist (L6).
- M5's and L12's site sets were derived by grep (membership tests), not by judgment about "where else
  might this appear". L12's sweep is a negative-lookahead regex over the whole repo, so the
  audit-trail hits were surfaced explicitly and excluded by a stated rule (historical records are not
  rewritten), never by silence.
- The canonical slug was resolved by API `full_name` equality plus HTTP status membership
  ({200} = canonical, {301} = redirect), not by preferring whichever string appeared more often.
- The bump/no-bump branch is membership in CLAUDE.md's declared repo-meta set, corroborated by a
  precedent commit.
- Terminal fallback: the one item this increment cannot settle is carried to the halt as a question,
  not a guess.

## Open questions (HALT)

- **Resolved at GATE 1.** M6 (the `:57` dev/product boundary error) and L12 (the repo slug) were folded
  in on the human's instruction; L12's text was supplied. M6's text was never supplied — the `:57` fix
  is scoped from the defect observed live, not from a request, and should be confirmed as covering
  what M6 intended.
- **Not fixed here, surfaced for a human (out of scope, and not a repo file):** the local git remote
  itself still points at the stale `git@github.com:pharn-dev/pharn.git`. That is machine-local config,
  not a tracked file, so no increment can repair it — but it is the reason this drift stayed invisible,
  and it will keep re-seeding the stale slug into future docs until someone runs
  `git remote set-url origin git@github.com:pharn-dev/pharn-oss.git`.
