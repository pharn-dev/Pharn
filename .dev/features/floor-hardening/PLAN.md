# PLAN — floor hardening: six confirmed product-floor defects (L2, L3, L5, L6, L7, L9)

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L6, L15, L20, L25, L29, L31, L32]
- increment: Fix six confirmed defects in the product floor — a prototype-walking gate comparison, a BOM that defeats every frontmatter anchor, two silently-failing read-only modes, a bare catch that maps I/O errors to benign, a vacuous structural pass over an empty findings array, and an undetected `.concat()` injection sink.
- layer(s): pharn-core-adjacent — `pharn/floor/` (PRODUCT floor; it ships) # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P5, P7]

## Applied lessons

- L6 — L2's fix IS this lesson's remedy at the membership layer: `k in obj` walks the prototype chain,
  so a gate named `toString` is read as present when it is not. `Object.hasOwn` is the own-property
  membership test L15 already prescribes.
- L15 — Directly cited by L2's defect: index an arbitrary key with an own-property test, never a
  prototype-walking operator. The defect is that lesson recurring inside the checker that promises
  "never a silent pass".
- L20 — Each of these six had "a careful reader will notice" as its only defence. Every fix here lands
  a TEST that fails without it, so the remedy is a check rather than a reminder.
- L25 — Applied twice. (1) L9's scanner header already states an honest bound; the fix updates that
  bound rather than leaving a repaired defect described by stale prose. (2) The BOM fix sits beside the
  existing CRLF fold, so the two input-normalisation steps live together and neither reads as complete
  on its own.
- L29 — L3's remedy is quantified over "every `FM_RE` consumer", so the ENUMERATION is the deliverable:
  a shared core holds the one definition, and a test RANGES over the consumer set rather than asserting
  a fix in whichever file was in front of me.
- L31 — L3's defect is exactly this lesson's shape and is why the fix is a shared core rather than six
  edits. `FM_RE` is currently copy-pasted into SIX checkers with nothing ranging over the set, so a
  seventh consumer would silently reintroduce the defect. Precedent for the core: `lessons-index-core.mjs`.
- L32 — Load-bearing for this increment's scoping. The L5 fix request's own reproduce command
  (`check-spec.mjs /no/such/spec.md --hash`) puts the flag AFTER the path, so it falls through to
  `validate()` and PRINTS — making the defect look already-fixed. Re-derived with the correct
  invocation (`--hash <path>`), the defect is real. Every one of the six was reproduced live before
  being scoped, and the prescribed method was not trusted.

## Files

- `pharn/floor/frontmatter-core.mjs` — NEW: the single `FM_RE` + BOM-strip, shared by all consumers — layer product-floor
- `pharn/floor/frontmatter-core.test.mjs` — its tests, incl. the consumer-set pin — layer product-floor
- `pharn/floor/check-spec.mjs` — L3 (use the core) + L5 (print before returning non-zero) — layer product-floor
- `pharn/floor/check-spec.test.mjs` — L3 + L5 regression tests — layer product-floor
- `pharn/floor/check-loop-record.mjs` — L3 (use the core) — layer product-floor
- `pharn/floor/check-plan-lessons.mjs` — L3 (use the core) — layer product-floor
- `pharn/floor/check-plan-spec-agree.mjs` — L3 (use the core) — layer product-floor
- `pharn/floor/check-ship-briefing.mjs` — L3 (use the core) — layer product-floor
- `pharn/floor/render-ship-briefing.mjs` — L3 (use the core) — layer product-floor
- `pharn/floor/check-regress.mjs` — L2 (`Object.hasOwn` for gate-set membership) — layer product-floor
- `pharn/floor/check-regress.test.mjs` — L2 regression test — layer product-floor
- `pharn/floor/lessons-index-core.mjs` — L6 (rethrow non-absence I/O errors) — layer product-floor
- `pharn/floor/lessons-index-core.test.mjs` — L6 regression test — layer product-floor
- `pharn/floor/check-structural.mjs` — L7 (no vacuous per-finding pass) — layer product-floor
- `pharn/floor/check-structural.test.mjs` — L7 regression test — layer product-floor
- `pharn/floor/scan-code-injection.mjs` — L9 (`.concat(` taint; f-strings named out of scope) — layer product-floor
- `pharn/floor/scan-code-injection.test.mjs` — L9 regression test — layer product-floor
- `SKILLS_VERSION` — patch bump (product-surface bytes change) — layer n/a
- `README.md` — the shields badge, which `check:badge` pins to SKILLS_VERSION — layer n/a
- `CHANGELOG.md` — the entry recording all six — layer n/a

## Contracts satisfied

- `pharn/pharn-contracts/finding-shape.md` — L7's fix defends the enum-gated assertion set against a
  suppressed (empty) emission; the finding shape itself is unchanged (cited, not restated — P4).
- `pharn/pharn-contracts/eval-format.md` — L7 operates on the `structural[]` assertion list it defines.

## Evals to write (P1)

- none — no Capability and no `rule_id` is added. Each fix ships a **test** that fails without it, which
  is what CONTRIBUTING requires of the executable floor.

## Guarantee audit (P0)

- L2 "a gate-set mismatch is never silently shared" → **floor: enum-regex** (own-property membership).
  Previously false for any gate id colliding with an `Object.prototype` member.
- L3 "a BOM-prefixed file parses identically to its BOM-less twin" → **floor: enum-regex**. NARROWED:
  exactly one leading `U+FEFF` is stripped; a genuinely frontmatter-less file still REDs.
- L5 "a read-only mode never exits non-zero silently" → **advisory-to-human reporting**, not a new
  guarantee: the exit code is unchanged, only the diagnostic is added. Stated so the fix is not read as
  strengthening a gate it does not touch.
- L6 "a present-but-unreadable canon fails closed" → **floor**: only `ENOENT`/`ENOTDIR` map to
  `NO_CANON`; every other `e.code` rethrows. The deliberate product-vs-dev divergence on ABSENT canon is
  preserved.
- L7 "per-finding assertions cannot pass vacuously" → **floor: enum-regex** over the assertion-kind set.
  NARROWED: an eval that legitimately expects nothing must say so with `finding_count == 0`, which stays
  GREEN.
- L9 "`.concat()` into a matched sink is detected" → **floor: enum-regex**. NARROWED, and written into
  the scanner's own honest-bound header: Python f-strings remain OUT OF SCOPE and are now named there
  rather than left silently unhandled.
- "these six are the floor's defects" → **NOT claimed.** They are six that a review found and this run
  reproduced. No completeness claim.

## Trust audit (P2)

- The fix requests are untrusted input; every claim was reproduced live before being acted on. One
  (L5's reproduce command) was wrong and is recorded above rather than followed.
- No fix ingests untrusted content into a guaranteed decision. L7's fix reads only assertion KINDS
  (enum-gated) and the actual array's LENGTH — never a finding's free text.

## Determinism audit (P5)

- Every fix replaces or adds a membership/enum test; none introduces judgment.
- L6's branch is membership over `e.code` in a closed set, with the terminal fallback being **rethrow**
  (fail-closed), never a benign default.
- L7's branch is set-intersection between the assertion kinds present and the per-finding kind set,
  plus an integer length test.

## Open questions (HALT)

- none — all six defects were reproduced live before scoping, and each fix's shape is prescribed by an
  existing lesson or an existing sibling implementation.
