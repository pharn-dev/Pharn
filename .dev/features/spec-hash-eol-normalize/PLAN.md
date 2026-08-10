# PLAN — spec-hash-eol-normalize

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4
- applied_lessons: [L1, L2, L3, L8, L13, L16, L18, L20]
- increment: Fold `\r\n` to `\n` inside `check-spec.mjs`'s `bodyHash()` — the single body-hash implementation the whole spec→plan chain delegates to — so a CRLF working tree no longer reads as "the approved intent drifted", and add a `.gitattributes` as advisory git-layer hygiene.
- layer(s): `pharn/floor/` — the deterministic floor of `pharn/ARCHITECTURE.md §2` (primitive #2, content-hash), which sits beneath the §4 capability tree rather than inside it; no capability module is touched.
- constitution_refs: [P0, P2, P3, P4, P5, P6, P7]

## Applied lessons

- L1 — meta-doc sweep run against live state: `CHANGELOG.md` + `SKILLS_VERSION` are named in `## Files`; the README `CURRENT-STATE` generated region enumerates capabilities / contracts / commands / hooks / a **count** of `pharn/floor/*.mjs` (46), none of which this increment moves — it adds no floor checker — and `grep -n 'check-spec' CLAUDE.md README.md` returned nothing this run, so neither needs an edit.
- L2 — the honesty travels with the artifact, not only with this PLAN: the `check-spec.mjs` header note will state what the hash now covers (the body with `\r\n` folded to `\n`) and will label the `.gitattributes` half **advisory** in the file itself, citing only floor ops verified live this run.
- L3 — the field being made line-ending-agnostic was re-audited across every existing declaration of it: `git ls-files | grep -E '(^|/)SPEC\.md$'` returned **zero** committed `SPEC.md`, so no stored `spec_content_hash` exists to migrate; and because the fold is the identity map on LF input, an LF-authored pin is byte-unchanged even if one did.
- L8 — the setter narrows exactly one `--target` per call, so a multi-artifact increment cannot rely on it: all seven paths below are **concrete, non-placeholder**, so `/pharn-dev-build`'s scope comes from this plan's `## Files` (`--from-plan`), with no `--target` narrowing.
- L13 — this `PLAN.md` is formatted with `prettier` + `markdownlint-cli2` scoped to **this artifact alone** before the halt, never a repo-wide sweep (L19's escape).
- L16 — a remedy is itself an input-capture surface: the fold is a plain `String.prototype.replace` with a literal regex (no shell, no platform-dependent tool), and `.gitattributes` is deliberately **not** the load-bearing half because it governs only what git stores and checks out — never what an editor writes into the working tree between git operations. Verification commands below avoid GNU-only flags.
- L18 — the exclusion block in `## Files` is a `###` **heading**, not a bold prose intro, so `set-writes-scope.cjs --from-plan` terminates the authorized list structurally rather than on a vocabulary match.
- L20 — Step 4 re-runs `set-writes-scope.cjs --from-plan` against this file and reads its **printed path count** against the `## Files` bullets as a checkable number; a disagreement is a RED, not a note.

## Files

- `pharn/floor/check-spec.mjs` — fold `\r\n`→`\n` inside `bodyHash()`; extend the header note to state what the hash covers — layer `pharn/floor/`
- `pharn/floor/check-spec.test.mjs` — the unit-level fold assertion, the complete-Approved-CRLF-spec GREEN case, and the still-detects-a-real-text-change case — layer `pharn/floor/` (test, never shipped)
- `pharn/floor/check-spec-approved.test.mjs` — one chain case: the same complete Approved CRLF spec through the wrapper — layer `pharn/floor/` (test, never shipped)
- `pharn/floor/check-plan-spec-agree.test.mjs` — one chain case: that CRLF spec + a PLAN carrying the LF-computed hash — layer `pharn/floor/` (test, never shipped)
- `.gitattributes` — new root file; advisory git-layer line-ending hygiene — repo-meta
- `CHANGELOG.md` — one `## [Unreleased]` entry recording the fix and the version bump — repo-meta
- `SKILLS_VERSION` — `2.4.2` → `2.4.3` (patch) — repo-meta

### Deliberately NOT in scope

- `pharn/floor/check-spec-approved.mjs` **source** — it `spawnSync`s `check-spec.mjs` and holds **zero** `createHash` calls (verified by grep this run); it inherits the fold for free. Editing it would re-create the duplication the P4 centralization exists to avoid.
- `pharn/floor/check-plan-spec-agree.mjs` **source** — same: it shells `check-spec-approved.mjs` and `check-spec.mjs --hash`, **zero** `createHash` calls. It inherits the fold for free.
- Every other `pharn/floor/*` checker — a different axis.
- `.claude/hooks/*`, `.claude/settings.json`, `CODEOWNERS` — untouched; no `--allow-claude-dir` is needed or requested.
- The four trusted docs (`pharn/CONSTITUTION.md`, `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`, `LIMITS.md`) — human-only, hook-denied.
- `package.json`, `README.md`, `CLAUDE.md`, `docs/**` — no fact they state changes (see the L1 line above).

## Contracts satisfied

- No `pharn/pharn-contracts/` contract changes shape. The increment tightens the **implementation** of `pharn/ARCHITECTURE.md §6`'s existing `spec_content_hash` pin (cited, not restated — P4); the field's name, type, and 64-hex shape are all unchanged, so no existing install faces a new shape.

## Evals to write (P1)

P1 binds **Capabilities** (`role:`-bearing markdown) to `evals/cases/*` + `evals/expected/*`. This increment adds no Capability and no `rule_id`, so no eval fixture is owed. The equivalent obligation for a floor checker is its `node --test` suite, and it is discharged by the four cases below:

- `bodyHash` fold → a CRLF body and its LF spelling hash **identically** (direct unit assertion on the two spellings).
- `check-spec.mjs` end to end → a **complete, `state: Approved`** `SPEC.md` (all four required sections present) whose body is written CRLF but whose `spec_content_hash` was computed from the **LF** form → exit **0**. Completeness and `Approved` are load-bearing: a Draft or a section-short fixture accumulates other REDs, so the assertion would no longer isolate the pin.
- Chain inheritance → that same spec through `check-spec-approved.mjs` → exit 0; and through `check-plan-spec-agree.mjs` with a PLAN carrying the LF hash → agreement. This is the case that proves the single-source claim rather than asserting it.
- Drift still caught → a body differing in actual **text**, not only in line endings → a different hash → RED. The equivalence class widens by exactly the LF/CRLF axis and by nothing else.
- Mutant → deleting the fold makes the first two cases fail; restoring it makes them pass.

## Guarantee audit (P0)

- "The `spec_content_hash` pin no longer depends on the body's line endings" → **floor: content-hash** (`pharn/ARCHITECTURE.md §2` primitive #2). The fold is part of computing the hashed input; the comparison stays a byte-equality over a SHA-256.
- "A body edit that changes actual text is still detected" → **floor: content-hash**. Unchanged behavior; pinned by the drift test above.
- "The two wrapper checkers inherit the fold" → **floor: content-hash** for the _comparison_ itself; **advisory** for the property that carries it — that no second hash implementation is ever added is **discipline**, not a floor op. Neither wrapper computes a hash today (0 `createHash`, verified by reading both this run), so no second implementation can disagree; the chain tests **detect** a divergent re-implementation, they do not **prevent** one. (Corrected per GRILL F1 — the original wording labelled the whole claim `floor`.)
- "`.gitattributes` keeps a clone's working tree LF" → **advisory**. It is git configuration, not a hook, a content-hash, or an enum/regex check. Git can be configured to ignore it, and it says nothing about what an editor writes between git operations. It is hygiene that reduces the chance of the input arriving as CRLF; the `bodyHash` fold is what makes arriving as CRLF harmless.
- "No existing install newly REDs" → **advisory over repos we cannot read**, resting on two deterministic facts: the fold is the identity map on any body containing no `\r\n`, and this repo has **zero** committed `SPEC.md`. A CRLF spec that was **falsely** REDing now correctly GREENs; nothing moves in the other direction.
- Non-claim, stated: this changes **nothing** about whether the intent is clear, complete, or wise. `check-spec` GREEN still means only "the shape, state, identity, and pin hold" (P0).

## Trust audit (P2)

- **Input:** the SPEC body — human-authored intent, free-text **DATA**, untrusted per `pharn/pharn-contracts/finding-shape.md`.
- **Propagation:** unchanged. The verdict still ranges only over enum-gated / floor-verifiable values (section presence, the `state` enum, `spec_id` presence, hash equality) and never over the intent's meaning. The fold alters **which bytes feed the hash**, not which fields the verdict reads, so no new path exists by which free text could steer a decision.
- **The equivalence class widens, and the widening is bounded:** two bodies now collide only if they differ _solely_ in `\r\n` vs `\n`. No trailing- or interior-whitespace folding is introduced, so two genuinely distinct intents cannot be made to share a pin. A body containing a literal lone `\r` is left byte-exact under the recommended minimal form.

## Determinism audit (P5)

No branch is added or changed. The fold is an unconditional literal-regex `replace` — no classification, no judgment, no fallback chain. Every existing branch in `check-spec.mjs` stays a presence / enum / hash-equality membership test whose terminal non-member outcome is a loud RED.

## Open questions (HALT) — RESOLVED at the plan halt

Both were put to the human as a selectable form before any write and both are **answered**; nothing below is outstanding, so `/pharn-dev-build`'s Step-1 refusal on an unresolved HALT does not apply.

- **Normalization breadth** — minimal `/\r\n/g` (folds CRLF only) vs `/\r\n?/g` (additionally folds a lone `\r`). Discovery found **zero** `\r` bytes anywhere in the 1348 tracked files, so a lone-CR fold has no triggering failure (P7). **RESOLVED: the minimal `/\r\n/g`** — a lone `\r` in a body stays byte-exact.
- **`.gitattributes` breadth** — `* text=auto eol=lf` (full hygiene) vs `*.md text eol=lf` (exactly the hashed artifact type). Git's own binary test reports **1348 text / 0 binary** across the tree, so the broad form is safe today. **RESOLVED: `* text=auto eol=lf`**, carrying a note to add explicit `binary` markers if a binary is ever committed.

## Grill findings folded in (advisory — `.dev/features/spec-hash-eol-normalize/GRILL.md`)

`/pharn-dev-grill` raised 8 concerns, **0 blocking**. The build absorbs five of them; the human weighed and closed the other three. Recorded here so the plan reflects what was actually built.

- **F1 (P0)** — corrected in **both** places: the `bodyHash` header states that the _comparison_ is floor while single-implementation is _discipline_ the chain tests detect but do not enforce, and the `## Guarantee audit` line above was edited in place to match rather than left standing beside its correction.
- **F5 (P2)** — the `bodyHash` header names the cost explicitly: a pure CRLF-for-LF body rewrite moves from **detected** to **undetected**; nothing downstream is line-ending-sensitive today (`FM_RE` and `headingsOf` both split on `/\r?\n/`), but a future consumer that is would need its own check.
- **F6 (P1)** — a **mixed-line-ending** case (alternating CRLF and LF — the half-renormalized working tree) is added to the test set; neither all-LF nor all-CRLF covers it.
- **F7 (P1)** — a **direct** `--hash` assertion over a CRLF checkout is added rather than relying on transitive coverage through the chain case.
- **F4 (P7)** — rollback, stated: reverting `check-spec.mjs` restores byte-exactness, and because the fold is the identity map on LF input, every LF-authored pin still validates unchanged. The way back is a plain revert with no data migration.
- **F3 (P6)** — `spec_content_hash == sha256(body)` appears 9 times across `.claude/commands/pharn-plan.md` (5) and `pharn-spec.md` (4). **Human decision: leave them** — the phrase defers to the cited checker (`pharn-spec.md:151` already says "the checker's own body-extraction, single source of truth"), every sentence stays true for every LF body, and widening would add a second axis to this PR. Recorded as a follow-up, not built.
- **F2 (P7)** — the `.gitattributes` speculation tension was resolved by the human's ratification at the plan halt; kept, and labeled advisory in the file itself.
- **F8 (P0)** — a SPEC whose intent text literally demonstrates line endings has that distinction folded. **Closed as "no change" on a false premise, then reopened and genuinely discharged.** The premise was that the `bodyHash` header already stated the fold's exact bound; it did not — it claimed "two genuinely distinct intents can never share a pin", which the post-review sweep falsified by construction (an Approved SPEC embedding a ` ```http ` fixture, where CRLF is the mandatory wire terminator, pins identically to its LF spelling). The header now states the assertible bound instead — "can share a pin only by differing in CR bytes immediately before an LF" — brute-force verified over 3280 strings (555 colliding classes, 0 violations). The equivalence class is still the intended one; what changed is that the artifact now describes it truthfully. See `REVIEW.md`'s addendum.
