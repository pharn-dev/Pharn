# PLAN — scan-plan-relocation (F2)

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4
- applied_lessons: [L1, L2, L6, L10, L13, L16, L18, L19, L20]
- increment: Relocate the five plan-side grill-scanners from `.dev/floor/` to `pharn/floor/` so the grillers' Layer-1 deterministic sub-check resolves in a user install, and rewrite the canon cites CHECK 8 then flags.
- layer(s): pharn-pipeline (canon cites) + the product floor `pharn/floor/` (not a capability layer)
- constitution_refs: [P0, P4, P5, P6, P7]

## Applied lessons

- L1 — Swept the meta-docs this increment invalidates and named them in `## Files`: `CLAUDE.md` L33
  ("dev-only checkers — … the `scan-plan-*` grill-scanners") and L114-115 ("resident only in
  `.dev/floor/` (no twin …), pinned as deliberate by a test") both go **false** on the move, and
  `pharn/floor/validate.mjs`'s CHECK 8 comment L271-273 asserts the same false fact. Raised as
  OQ-1/OQ-2 because the build request's whitelist omits both.
- L2 — The moved scanners' headers must cite **live** ops: 24 internal refs name `.dev/floor/…`,
  including `scan-plan-secrets.mjs:18` citing `.dev/floor/count-grillers.mjs`, a file that exists
  **only** at `pharn/floor/`. Verified live this run; all 24 are in `## Files`.
- L6 — The cite rewrite's **decision** is a filesystem membership test (`existsSync(pharn/floor/<B>)`),
  not a prose pattern: grep only **locates** candidates, the existence gate **decides**. That is what
  structurally protects the 5 ghost cites (`scan-plan-{a11y,comprehension,docs,error-handling,performance}`),
  which no rule enumerates — they survive because their twin does not exist.
- L10 — This lesson names the root cause: `.dev/` is the unscanned, unshipped side. The five scanners
  sat there while their callers shipped, so the increment is exactly "move them to the shipped side."
  It also grounds decision 1 — `.dev/features/**` is never scanned, so its trail refs are inert.
- L13 — This stage formats its own artifact (`prettier` + `markdownlint-cli2` over this PLAN.md only),
  never a repo-wide sweep.
- L16 — The 44-cite rewrite runs as a **Node script** (`.pharn/f2-rewrite.mjs`), never `sed -i`: a
  BSD/GNU split in the remedy would silently corrupt files, and F1 set this precedent for the same
  transform. Corollary applied: the post-move RED is to be **investigated against the expected count**,
  never merely recorded.
- L18 — This plan's exclusion block is a real `###` heading (`### Deliberately NOT in scope`), so
  `set-writes-scope.cjs --from-plan` terminates the authorized list structurally, not by prose cue.
- L19 — `git mv`, the Node cite-rewrite, and `npm run docs:generate` are **Bash writes that escape
  fix #7 entirely**. Declared here as an accepted, audited residual — the audit is the HALT-2 diff plus
  the CHECK-8 RED→GREEN capture — rather than pretending the writes-scope covered them. **Corrected
  mid-build:** `README.md` was initially omitted from `## Files`, and the generated `CURRENT-STATE`
  block drifted (`Floor checkers — 41` → `46`) because five checkers newly reside under `pharn/floor/`.
  The guard denied a direct `README.md` write (exit 2) and the regenerate landed only through Bash —
  L19's exact live instance. Declared above rather than left as an undeclared write.
- L20 — Applied twice. (a) At build Step 0 the setter's printed path count is read against this plan's
  `## Files`, treated as a checkable number. (b) F2 **is** L20's escalation reaching its payoff: the
  hand-fix-the-cites remedy was discipline-only, it recurred, CHECK 8 became its floor check, and this
  increment is the first event that check was built to force.

## Files

- `pharn/floor/scan-plan-secrets.mjs` — moved from `.dev/floor/` (`git mv`); 3 internal refs repointed (L2, L18, L21) — product floor
- `pharn/floor/scan-plan-pii.mjs` — moved; 4 internal refs repointed (L2, L8, L23, L26) — product floor
- `pharn/floor/scan-plan-migrations.mjs` — moved; 4 internal refs repointed (L2, L9, L30, L33) — product floor
- `pharn/floor/scan-plan-observability.mjs` — moved; 4 internal refs repointed (L2, L10, L28, L31) — product floor
- `pharn/floor/scan-plan-i18n.mjs` — moved; 4 internal refs repointed (L2, L10, L33, L36) — product floor
- `pharn/floor/scan-plan-secrets.test.mjs` — moved; line-1 self-header repointed — product floor (test, non-shipping)
- `pharn/floor/scan-plan-pii.test.mjs` — moved; line-1 self-header repointed — product floor (test, non-shipping)
- `pharn/floor/scan-plan-migrations.test.mjs` — moved; line-1 self-header repointed — product floor (test, non-shipping)
- `pharn/floor/scan-plan-observability.test.mjs` — moved; line-1 self-header repointed — product floor (test, non-shipping)
- `pharn/floor/scan-plan-i18n.test.mjs` — moved; line-1 self-header repointed — product floor (test, non-shipping)
- `pharn/floor/scan-code-secrets.mjs` — 2 header twin-refs repointed (L4, L25); CHECK-8-invisible, hand-fixed — product floor
- `pharn/floor/validate.test.mjs` — the F2-boundary test + its comment repurposed to the positive assertion — test, non-shipping
- `pharn/pharn-pipeline/grillers/**/*.md`, `**/*.json` — 44 existence-gated cite rewrites across 24 files, no content change — pharn-pipeline
- `README.md` — the GENERATED `CURRENT-STATE` block only (`Floor checkers — 41` → `46`); regenerated by `npm run docs:generate`, never hand-edited — meta-doc
- `pharn/floor/validate.mjs` — **comment-only** edit to CHECK 8's L269-275 scope note; zero executable change — product floor
- `CLAUDE.md` — 2 assertions the move falsifies (L33, L114-115) — meta-doc
- `CHANGELOG.md` — one `## [Unreleased]` entry; plus the L62 inventory line repointed to `pharn/floor/scan-plan-*.mjs`
- `SKILLS_VERSION` — `2.3.4` → `2.4.0` (minor)

### Deliberately NOT in scope

- `.dev/features/**` — 188 trail refs across 64 files. They record the scanner's location **when each
  griller was built**; rewriting them would falsify the record. Precedent confirmed live: after the
  `scan-code-*` relocation, 253 `.dev/floor/scan-code-*` refs were left standing in `.dev/` against
  126 pointing at `pharn/floor/`.
- `pharn/floor/scan-code-secrets.test.mjs` — its line-4 mention of `scan-plan-secrets.test.mjs` is a
  **bare filename, not a path**, so it stays true after the move. Verified, not assumed.
- The 5 ghost cites — `scan-plan-{a11y,comprehension,docs,error-handling,performance}.mjs` are resident
  nowhere; the existence gate leaves them alone by construction.
- `pharn/floor/validate.mjs`'s **executable body** — CHECK 8 needs no code change; the move is exactly
  what it already handles. Only its comment is edited, so its behavior and coverage are provably unchanged.
- `pharn/floor/README.md`, `.github/workflows/gitleaks.yml` — same staleness class, separate axis.
- The trusted docs, `.claude/**`, `package.json`, CI workflows.
- Any griller→scanner map — a separate axis (lenses use `lens-scanner-map.json`; grillers cite in-body).

## Contracts satisfied

- None amended. The move changes **where a cited file lives**, not any contract's shape. `finding-shape.md`
  and `eval-format.md` are untouched — cited, not restated (P4).

## Evals to write (P1)

- No new capability, no new `rule_id`, so P1 adds nothing. The five relocated scanners keep their
  existing hermetic suites, which move with them and stay in the gate (`npm test` globs both
  `.dev/**/*.test.mjs` and `pharn/**/*.test.mjs`, so the move is gate-neutral).
- `pharn/floor/validate.test.mjs` — the repurposed F2-boundary case: a canon cite of
  `.dev/floor/scan-plan-secrets.mjs` with the twin now present is **RED**, `P6/floor-path`, message
  `now lives at pharn/floor/scan-plan-secrets.mjs`. Replaces a test whose premise F2 removes.
- The `scan-plan-a11y` ghost case and the CHECK 8 integration case ("the real tree is GREEN") stay
  untouched — the latter is the net that catches an incomplete cite rewrite.

## Guarantee audit (P0)

- "The five scanners now resolve in a user install" → **floor: enum-regex** (CHECK 8's `existsSync`
  twin test in `pharn/floor/validate.mjs`, plus each scanner's own hermetic suite at its new home).
- "Every stale canon cite was rewritten" → **floor: enum-regex** (CHECK 8 REDs any `.dev/floor/<B>`
  whose `pharn/floor/<B>` exists; the integration test asserts the real tree is GREEN).
- "The `pharn/floor` cross-refs were fixed" → **advisory.** CHECK 8's scope excludes `pharn/floor`
  (an intentional dev-ref and a stale ref are byte-indistinguishable there), so nothing checks these.
  Hand-verified, and the honest bound is stated: a miss here is silent.
- "The grillers' Layer-1 sub-check now works" → **NARROWED, and stated.** The floor proves the cited
  file **exists** and that the scanner runs; it never proves a griller body invokes it correctly, nor
  that a griller is run at all. "The scanner ships" is not "the sub-check fired."
- "`git mv` preserved history" → **advisory** (a git property, no floor op reads it).
- "The move is gate-neutral for tests" → **floor: enum-regex** (the `npm test` glob covers `pharn/**`;
  observed live, and re-observed after the move).
- "SKILLS_VERSION is bumped correctly" → **advisory.** No floor op checks the bump against the diff.

## Trust audit (P2)

- The five scanners are deterministic non-LLM checks over a PLAN, which is **untrusted** input. The
  move changes their **location only** — not their inputs, outputs, or fail-closed contract. Taint
  propagation is byte-unchanged, so this increment opens no new trust surface.
- The relocation does, however, move each scanner from the excluded `.dev/` side onto the **shipped**
  side, where a user runs it against their own plan text. That is the increment's whole point, and it
  is the same posture `scan-code-*` already holds.

## Determinism audit (P5)

- The rewrite branch is `existsSync(TARGET/pharn/floor/<basename>)` — a filesystem membership test,
  never a judgment about whether a cite "looks stale."
- The proceed/stop signal is `node pharn/floor/validate.mjs .`'s exit code, read as a membership test.
- Terminal fallback: the two open questions below are **asked**, not guessed.

## Open questions (HALT)

All four were raised at HALT 1 and **resolved by the human** before approval; none remain open.

- **OQ-1 — `CLAUDE.md` (resolved: fix both).** L33 and L114-115 go false on the move; both are
  corrected in this PR, per L1 and the F1 (#121) precedent. Added to `## Files`.
- **OQ-2 — CHECK 8's own comment (resolved: comment-only edit).** `pharn/floor/validate.mjs`
  L269-275 is rewritten to say the boundary is **closed**. Executable body untouched, so CHECK 8's
  behavior and coverage are provably unchanged. Added to `## Files`.
- **OQ-3 — `CHANGELOG.md:62` (resolved: repoint).** It is a live inventory line, and its sibling cite
  `count-grillers.mjs` already resides only at `pharn/floor/`; repointing makes the sentence true.
- **OQ-4 — F2-boundary test (resolved: repurpose).** It becomes the positive assertion that a stale
  `.dev/floor/scan-plan-secrets.mjs` cite is now **flagged**, with the comment rewritten to record the
  boundary as closed rather than deferred.
