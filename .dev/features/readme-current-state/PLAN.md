# PLAN — readme-current-state

- spec_content_hash: 0d0dc6da61c4de6748aeab849ed1a4ecd9ff7f1d61e91d5848d7ffdaf022733d # fix #4 (sha256 of pharn/ARCHITECTURE.md, read this run)
- increment: Make the factual core of the root `README.md` `## Current state` a **generated block**, rendered from the live repo by the same enumeration the capability catalog uses and guarded by the same byte-equality drift check, wired into the existing `npm run docs:generate` / `npm run docs:check` pair.
- layer(s): none — build **apparatus** (`.dev/floor/`) + repo-meta (`README.md`, `package.json`, `ci.yml`, `CLAUDE.md`, `CHANGELOG.md`). No product-surface bytes change. # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P3, P5, P6, P7]

## Discovery (P6 — read live, this run)

Everything below was read from disk this run; nothing is asserted from memory.

**The two lies are confirmed live.**

- `README.md:167` — "`pharn-core` … still **planned**" is **false**: `pharn/pharn-core/seam-resolver/seam-resolver.md` exists (`role: skill`), ships 6 eval case/expected pairs, and is cited two bullets earlier at `README.md:160`.
- `README.md:161` — "three contracts (`pharn/pharn-contracts/{finding-shape,eval-format,seam-config}`)" is **false**: `pharn/pharn-contracts/` holds **four** — `eval-format.md`, `finding-shape.md`, `seam-config.md`, `ship-record.md` (the fourth landed with the ship-attestation increment, commit `87c98ff`).

**Live counts** (`node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities checked in .`; per-role via `enumerateCapabilities(".")`):

| Surface                                          | Live value                                                                                                      |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| capabilities by role (`ROLE_ORDER`)              | griller 13, lens 22, skill 1 (`pharn/pharn-core/seam-resolver/`), validator 0, verifier 0, auditor 0 — total 36 |
| `pharn/pharn-contracts/*.md`                     | 4                                                                                                               |
| `.claude/commands/pharn-*.md` minus `pharn-dev-` | 9                                                                                                               |
| `.claude/commands/pharn-dev-*.md`                | 9                                                                                                               |
| `.claude/hooks/*.cjs` minus `*.test.cjs`         | 3                                                                                                               |
| `pharn/floor/*.mjs` minus `*.test.mjs`           | 35                                                                                                              |

**Existing apparatus read** — `.dev/floor/capability-catalog-core.mjs` (exports `enumerateCapabilities`, `renderPage`, `renderIndex`, `buildCatalog`, `listCommittedPages`, `OUT_DIR`, `ROLE_ORDER`, `ROLE_HEADING`, `ROLE_VERB`), `.dev/floor/gen-capability-catalog.mjs`, `.dev/floor/check-capability-catalog.mjs`, their two test suites, and `.dev/features/docs-capability-catalog/REVIEW.md`.

**`role:` membership test mirrored** — `pharn/floor/validate.mjs:125` treats a markdown file as a capability iff its frontmatter has `role:`, and `:153` checks that value against `ROLE_ENUM`. `capability-catalog-core.mjs:150` mirrors exactly that test. `validate.mjs` exports nothing, so this is **cite-not-import** — already recorded as an advisory finding in the prior REVIEW (L-axis P4). The block may honestly say "the same `role:` membership rule the floor uses"; it may **not** say "the floor validates this count" (see Guarantee audit).

**Three doc-vs-repo mismatches found (P6), all surfaced, none guessed past:**

1. **The originating prompt says "CI is already wired to `docs:check` via `npm run check` — confirm, don't duplicate." Live CI does not do that.** `.github/workflows/ci.yml` runs each gate as its **own** step and the docs gate is a direct `run: node .dev/floor/check-capability-catalog.mjs .` — `npm run check` is never invoked in CI. So a _new_ checker is **not** picked up by CI for free; that is what drives Open question 1's CI sub-decision.
2. **`.dev/floor/gen-capability-catalog.mjs` has no test file.** The verification gate demands "unit tests for every `.mjs` created or modified" — so whether that file must gain a suite depends on whether this increment modifies it (Open question 1).
3. **The prompt's Design places the new renderer in `capability-catalog-core.mjs`.** The prior REVIEW already flagged that file as bundling two axes and wrote the exit condition: _"Acceptable as-is; split only if either axis grows."_ This increment **is** that growth (a second generated artifact + four enumerators unrelated to capabilities), so following the Design as written walks into a known P3 finding. This is Open question 1 — the one HALT this plan raises.

**Idempotence pre-verified (the prompt's named HALT risk — it does not fire).** A draft of the exact block below was spliced into a fixture README and run through the repo's own gates this run: `prettier --check` → clean and byte-identical to `prettier` output; `markdownlint-cli2 --config .markdownlint-cli2.jsonc` → `0 error(s)`. `printWidth: 140` with prettier's default `proseWrap: "preserve"` does not rewrap prose, `MD013`/`MD033` are off, and the block emits only `-` lists, inline code, bold, and links. **No HALT on prettier-idempotence.** `README.md` therefore stays formatted and is **not** added to `.prettierignore` / `.markdownlintignore`.

## Files

**Settled at GATE 1: Option A** — the originating Design, as written (human decision, recorded in _Open questions_ below). This list is the writes-scope `/pharn-dev-build` enforces.

- `.dev/floor/capability-catalog-core.mjs` — **modified.** Extend with the repo-surface enumerators (`enumerateContracts()`, `enumerateCommands()`, `enumerateHooks()`, `countFloorCheckers()`), `renderReadmeCurrentState()` (returns the whole region **including both marker lines**), `extractCurrentState()`, and `spliceCurrentState()` + the marker constants. `enumerateCapabilities()` is **reused**, never forked. — apparatus
- `.dev/floor/capability-catalog-core.test.mjs` — **modified.** Add: render shape, zero-instance-role rendering, sorted/readdir-independent enumeration, round-trip splice, missing/duplicate/inverted-marker throws, missing-directory throw, unsafe-basename throw, and `prettier --check` + `markdownlint-cli2` over a spliced fixture README. — apparatus
- `.dev/floor/gen-capability-catalog.mjs` — **modified.** After writing the catalog, splice the rendered region into `README.md` strictly **between an existing marker pair**; hard-error (never invent markers, never guess boundaries) if the pair is absent, duplicated, or inverted. — apparatus
- `.dev/floor/gen-capability-catalog.test.mjs` — **new** (no suite exists today — Discovery finding 2). Splice-in-place, second-run byte-identity, stale-page removal, hard-error paths, exit codes. — apparatus
- `.dev/floor/check-capability-catalog.mjs` — **modified.** Add the README region check: extract the committed region by markers, byte-compare against a fresh `renderReadmeCurrentState()`. New finding types RED on missing markers, duplicate markers, inverted markers, or byte drift. Header comment restated for the widened honest P0 split. — apparatus
- `.dev/floor/check-capability-catalog.test.mjs` — **modified.** GREEN path, each new RED path, exit codes, fail-closed on a missing/unreadable `README.md`. — apparatus
- `README.md` — **modified.** Insert the marker pair by hand **once**; delete the hand-written factual bullets the block now owns; rewrite the planned-modules sentence; keep the "no installer / do not adopt yet" paragraph untouched. — repo-meta
- `CLAUDE.md` — **modified.** One short note under _Conventions_: README `## Current state` is generated between `CURRENT-STATE` markers, never hand-edited, regenerated by `npm run docs:generate`. — repo-meta (agent instructions, not shipped)
- `CHANGELOG.md` — **modified.** One `[Unreleased]` → `Changed` entry, citing the no-bump rule. — repo-meta

**Not touched, deliberately:** `package.json` and `.github/workflows/ci.yml` are **unchanged** under Option A. `npm run docs:generate` / `docs:check` already point at the two extended scripts, and CI's existing `run: node .dev/floor/check-capability-catalog.mjs .` step therefore picks the new README guard up for free (this is the payoff of Option A against Discovery finding 1).

**Accepted P3 cost, recorded up front (Option A's known tradeoff).** `capability-catalog-core.mjs` will carry a **second** rendering axis plus four enumerators unrelated to capabilities, and the three `*-capability-catalog*` filenames will no longer describe everything they do. The prior REVIEW pre-registered exactly this (_"split only if either axis grows"_). It is accepted deliberately at GATE 1 in exchange for a zero-churn wiring; `/pharn-dev-review` is expected to log it as an advisory P3 finding, and it must be reported honestly, not argued away.

**`SKILLS_VERSION`: NOT bumped.** Settled by rule, not precedent. Every path above is either build apparatus (`.dev/floor/**`, `*.test.*`) or pure repo-meta (`README.md`, `package.json`, CI, `CHANGELOG.md`, `CLAUDE.md`). CLAUDE.md § _SKILLS\_VERSION discipline_: _"Apparatus-only changes do NOT bump … Pure repo-meta (README / CHANGELOG / SECURITY / CONTRIBUTING / LICENSE / CI / package.json / SKILLS_VERSION itself) does not bump either — it is not methodology a user runs."_ **No path in `## Files` is in the bump-triggering set** (the `pharn/` capability tree, `pharn/floor/*.mjs`, the four trusted docs, the product `.claude/` surface). Same call as the catalog increment.

## Block content — only floor-derivable facts

Rendered between exactly one marker pair, both marker lines **inside** the guarded region (so the marker text itself cannot be hand-edited without a RED):

```html
<!-- CURRENT-STATE:BEGIN — GENERATED by .dev/floor/gen-capability-catalog.mjs. DO NOT EDIT BETWEEN MARKERS. Regenerate: npm run docs:generate -->
```

Six bullets, each one line, all lists sorted:

- **Capabilities** — total + one count per role in `ROLE_ORDER`, the single `skill` named with its path, one link to `docs/capabilities/README.md`. Counts only — the catalog states the members (no duplication).
- **Contracts** — `pharn/pharn-contracts/*.md`, names + count.
- **Product commands** — `.claude/commands/pharn-*.md` **minus** the `pharn-dev-` prefix, names + count.
- **Dev-apparatus commands** — `.claude/commands/pharn-dev-*.md`, names + count.
- **Write-guard hooks** — `.claude/hooks/*.cjs` excluding `*.test.cjs`, names + count.
- **Floor checkers** — count of `pharn/floor/*.mjs` excluding `*.test.mjs` and `test-fixtures/`.

**Zero-instance roles render as `0`, never omitted** — the honest read is "the enum exists, instances do not" (P0). This is the opposite of `renderIndex()`, which skips empty groups; the difference is deliberate and will be asserted by a test.

**Hand prose outside the markers** must restate **no** count the block renders. The rewritten planned-modules sentence names only what is genuinely absent: `pharn-audits`, `pharn-skills-*`, `pharn-stack-*`, and **the remainder of** `pharn-core` (constitution engine, agnostic rules, memory-bank, base commands). `pharn-core` as a whole is no longer called "planned". The trust-fence / attempt-0 pointer and the "no installer / do not adopt yet" paragraph stay hand prose.

## Contracts satisfied

- **None.** This increment adds no capability and touches no `pharn/pharn-contracts/*` schema. It is apparatus over repo-meta. (Cited, not restated — P4.)

## Evals to write (P1)

- **None — P1 does not attach.** The increment introduces **no `role:`-bearing file**, so "every Capability ships with evals" has nothing to bind to; `pharn/floor/validate.mjs` GREEN confirms it. Same posture as the catalog increment. Verification is instead the three `node --test` suites above, at **≥90 % line coverage** via `node --test --experimental-test-coverage`.

## Guarantee audit (P0)

| Claim                                                                                 | Reduction                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The committed `## Current state` block equals the block recomputed from the live repo | **FLOOR — content-hash** (byte-equality, `ARCHITECTURE §2` primitive 2) in `check-readme-current-state.mjs`                                                                                                                             |
| Exactly one `CURRENT-STATE` marker pair exists, in order                              | **FLOOR — regex/enum** (occurrence count + index order); 0, ≥2, or inverted → RED                                                                                                                                                       |
| The generator never invents or relocates markers                                      | **FLOOR — regex**: the splice hard-errors unless it finds exactly one well-ordered pair                                                                                                                                                 |
| Regenerating twice is a no-op                                                         | **Deterministic by construction** (sorted listings, no timestamps, no readdir-order dependence) + asserted by test. The _gate_ CI runs is the byte-compare above.                                                                       |
| Capability counts use the same `role:` membership rule `validate.mjs` uses            | **ADVISORY.** It is the same _rule_, in a **mirrored** implementation — `validate.mjs` exports nothing. Nothing on the floor forces the two to stay in sync (prior REVIEW, L-axis P4). The block will not claim the floor validates it. |
| Contract / command / hook / floor-checker counts are "right"                          | **Deterministic enumeration** (glob + prefix/suffix membership, P5) — but that these globs are the _right definition_ of "a contract" / "a command" is **ADVISORY**.                                                                    |
| Prose **outside** the markers is true                                                 | **ADVISORY and unguarded** — stated in the checker header, in `CLAUDE.md`, and in the CHANGELOG entry. The guard covers the block, nothing else.                                                                                        |
| Running `npm run docs:generate` is itself a guarantee                                 | **No — ADVISORY.** Running a generator is orchestration. The guarantee is the checker's byte-equality; the generator only produces the bytes it checks.                                                                                 |

**The disease check.** This increment must not let "generated" be heard as "true". It guarantees exactly one thing: **committed == recomputed**. A wrong enumerator would be regenerated and committed wrongly, and the gate would stay GREEN. That is stated, not buried.

## Trust audit (P2)

The block renders **repo-derived free text** — filenames and directory names — into a human-facing doc. A file named with markdown control characters could distort the README, and the `LIMITS.md §2` residual applies (a human or downstream LLM reading the README could be steered by injected text). It is **bounded, not zeroed**:

- No **floor** risk: the generator and the checker share one renderer, so any rendering is byte-equal on both sides → **no false GREEN is reachable**.
- The README **gates nothing**; no guaranteed decision reads it.
- Sources are trusted, hook-protected product paths today.

**Fail-closed hardening included** (P7-justified: this addresses the _recorded_ L-trust finding from `.dev/features/docs-capability-catalog/REVIEW.md`, a real surfaced issue, not a hypothetical): every enumerated basename must match `/^[A-Za-z0-9._-]+$/` — otherwise the renderer **throws** rather than emitting it. Determinism and fail-closure, not sanitization theatre.

## Determinism audit (P5)

- Enumeration = directory read + suffix/prefix **membership test**. Zero LLM anywhere in core, generator, or checker.
- Every emitted list is **sorted ascending**, so output does not depend on `readdir` order.
- Marker location = regex occurrence **count** (0 / 1 / ≥2) + index comparison — never a search heuristic, never "find the closest".
- **A missing expected directory throws** (e.g. `.claude/hooks/` absent). Rendering `0` would be a plausible-looking lie; a throw is fail-closed.
- No fallback chain ends in a guess: every failure is a hard error or a RED with the fix command (`npm run docs:generate`) printed.

## Verification gate (all required before `/pharn-dev-review`)

1. Unit tests for **every** `.mjs` created — core, gen, check — covering render round-trip, missing/duplicate/inverted-marker RED, drift RED, zero-instance-role rendering, and `prettier --check` + `markdownlint-cli2` over a spliced fixture.
2. **≥90 % line coverage** on the three new `.mjs` via `node --test --experimental-test-coverage`.
3. `npm run check` fully green (`format:check` + `lint` + `lint:md` + `docs:check` + `test`).
4. `npm run docs:generate` twice → the second run is a no-op (`git diff` empty).
5. `node pharn/floor/validate.mjs .` GREEN.
6. `CLAUDE.md` + `CHANGELOG.md` updated as specified; **grep `README.md` outside the markers** for the block's count phrases (`22 lenses`, `13 grillers`, `N contracts`, `36 …capabilities`) → **zero hits**. Bare numbers elsewhere (e.g. "the four trusted documents") are fine.

## Open questions (HALT) — RESOLVED at GATE 1

**1. Where do the new renderer and its enumerators live?** The originating Design says: put `renderReadmeCurrentState()` inside `.dev/floor/capability-catalog-core.mjs` and extend the existing `gen-`/`check-capability-catalog.mjs`. Deviating from a decided Design requires a HALT — this was it. Discovery finding 3 was the reason: the prior REVIEW set the exit condition _"split only if either axis grows"_, and this increment is that growth. Three options were presented (A: the Design as written; B: a new core file with the existing gen/check extended; C: a fully separate core + gen + check, recommended by the planner).

> **HUMAN DECISION — Option A, "exactly as the Design specifies."** Recorded 2026-08-04 at the `/pharn-dev-plan` approval gate, together with _"Approve as written."_ The planner's recommendation (C) was **not** taken; the decision is the human's and stands. `## Files` above is written to Option A, including its accepted P3 cost and the note that `package.json` / `ci.yml` need no change because CI's existing `check-capability-catalog.mjs` step covers the new guard.

No other open questions: the two README lies are confirmed live, prettier/markdownlint idempotence is pre-verified, the no-bump call is settled by written rule, and no claim in `## Current state` was found that is neither derivable nor safe to keep as hand prose.
