# PLAN — secmat-word-boundary

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L13, L14, L19, L20, L24, L25, L26, L28, L29]
- increment: Anchor `pharn/floor/scan-code-crypto.mjs`'s `SECMAT` word set to identifier-SEGMENT boundaries so the `insecure-random` pattern stops firing inside ordinary identifiers (`keys`, `monkeys`), while keeping the genuine security-material positives.
- layer(s): pharn/floor (product floor checker) # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P2, P3, P5, P6, P7]

## Applied lessons

- L29 — The defect IS L29's shape: `SECMAT` is a SET of 11 words, `iv` alone was boundary-anchored, and the
  rule read as discharged. So the deliverable is the ENUMERATION — one `SECMAT_WORDS` array with a single
  `segment(w)` builder iterating it — and tests that LOOP the array, never an assertion authored for whichever
  member was in front of me.
- L25 — The existing header (lines 59-63) states sub-word matching as settled design and never names the
  `keys`/`monkeys` flood; it is trusted for the defect it does not name. The comment is re-derived, not carried
  across, and the rationale is made enforceable by the iterated tests rather than by better prose.
- L24 — Dropping the `i` flag SWAPS the implementation of the RNG conjunct, so its behavior claim is void until
  re-derived: `Math\.random` is expanded to explicit per-character case classes (`ci()`), preserving today's
  case-insensitivity exactly, and pinned by a test rather than asserted.
- L14 — The tightening COMPOSES: it narrows only the `SECMAT` lookahead of the two-lookahead conjunction and
  leaves the `Math.random` lookahead intact, never replacing the conjunction with a single shape regex.
- L26 — Config-driven gates resolve by PATH, so every style/lint verification runs in-repo via `npm run check`;
  the scratch repro files outside the repo are sound only for the scanner's own verdict, which reads file text
  and resolves no config.
- L13 — This stage's own artifact is formatted immediately after writing it, before the halt.
- L19 — The formatter is invoked per-artifact (`npx prettier --write <this file>`), never `npm run format`,
  whose repo-wide sweep escapes the fix #7 scope through Bash.
- L28 — Every `## Files` bullet below is a SINGLE line, so the setter's head-less exclusion cue cannot fire on
  an item's own continuation line and truncate the authorized list.
- L20 — Step 4 re-runs `set-writes-scope.cjs --from-plan` and compares the printed count against the five
  bullets below; the count is read as a checkable number, never as decoration.

## Files

- `pharn/floor/scan-code-crypto.mjs` — segment-anchored `SECMAT` builder plus its re-derived header — layer pharn/floor
- `pharn/floor/scan-code-crypto.test.mjs` — set-iterating boundary tests plus the four named cases — layer apparatus
- `SKILLS_VERSION` — patch bump `2.7.10` → `2.7.11` — layer repo-meta
- `CHANGELOG.md` — one `[Unreleased]` entry recording the bump and the narrowing — layer repo-meta
- `README.md` — the shields badge value, which `check:badge` pins to `SKILLS_VERSION` — layer repo-meta
- `pharn/pharn-review/insecure-crypto/evals/cases/case-insecure-random.md` — the missing `insecure-random` lens case — layer pharn-review
- `pharn/pharn-review/insecure-crypto/evals/expected/expected-insecure-random.json` — its structural + semantic assertions — layer pharn-review
- `pharn/pharn-review/insecure-crypto/evals/expected/expected-insecure-random.md` — its human render — layer pharn-review
- `.claude/commands/pharn-dev-grill.md` — correct the stale registered-griller count in the command's prose — layer apparatus

## Why the last four paths were added at GATE 2

The human's decision at the post-review gate was "fix everything", so the four paths at the end of the
list above were added to close `REVIEW.md`'s open findings. Two things about HOW they were added:

- **Declared BEFORE the writes, then the scope-setter re-run** — the sanctioned remedy for a blocked
  write. A `## Files` edit made AFTER writing those paths would be the retroactive self-authorization L20
  names, and `check-regress.mjs scope` cannot distinguish the two, so the ordering is the whole safeguard.
- **They sit in the SAME flat list, deliberately.** The first attempt put them under an `### Added at
GATE 2` subheading; the setter then reported **5 paths, not 9**, because a heading ends the authorized
  list (L18's boundary, fail-closed). It was caught only because L20's discipline of reading the printed
  count was followed — the setter exits 0 either way.

## The change (shape, so build has no latitude)

`SECMAT` becomes a generated 4-branch matcher over an explicit word array. For each word `w`, with
`lo = w`, `Ti = Capitalize(w)`, `UP = w.toUpperCase()`:

1. `(?<![A-Za-z0-9_$])lo(?![a-z0-9])` — bare lowercase head, NO plural. Blocks `keys`, `monkeys`,
   `Object.keys`, `salted`, and `iv` inside `private` / `receive` / `derive`.
2. `Ti s?(?![a-z0-9])` — camelCase segment, plural allowed. Matches `sessionToken`, `apiKeys`.
3. `(?<![A-Za-z0-9])UP S?(?![A-Za-z0-9])` — ALL-CAPS segment, plural allowed. Matches `API_KEY` / `API_KEYS`;
   blocks `MONKEYS` and `IV` inside `PRIVATE`.
4. `(?<=[_-])lo s?(?![a-z0-9])` — snake/kebab tail, plural allowed. Matches `api_keys`, `api-key`.

Branches 2-4 need case discrimination, so the `insecure-random` RegExp loses its `i` flag; the
`Math.random` conjunct keeps its exact current case-insensitivity via per-character classes. The word set
itself is UNCHANGED (11 members) — membership is not the axis of change here, boundary anchoring is (P3).

## Contracts satisfied

- `pharn/pharn-contracts/finding-shape.md` — unchanged; the scanner emits `{line, kind}`, not findings, and the
  lens `pharn/pharn-review/insecure-crypto/` maps a hit into the enum-gated fields as before (P4 — cited, not restated).
- `pharn/floor/lens-scanner-map.json` — the `insecure-crypto` → `scan-code-crypto.mjs` binding is untouched.

## Evals to write (P1)

No `role:`-bearing capability is added or changed, so no new eval pair is owed. The lens
`pharn/pharn-review/insecure-crypto/` keeps its four committed cases; none exercises `insecure-random`, so
none moves. Coverage for this change lands in the hermetic scanner suite:

- every word in `SECMAT_WORDS` → bare lowercase form on a `Math.random` line FIRES (set-iterated).
- every word in `SECMAT_WORDS` → the same word suffixed `s` and embedded after a lowercase letter does NOT
  fire (set-iterated — the `keys` / `monkeys` class, quantified).
- `keys[Math.floor(Math.random() * keys.length)]` → no finding.
- Fisher-Yates shuffle over `monkeys` → no finding.
- `const key = Math.random().toString(36)` → `insecure-random`.
- `sessionToken = Math.random()` → `insecure-random`.
- `apiKeys` / `API_KEYS` / `api_keys` on a `Math.random` line → still `insecure-random` (the plural branches).
- `MATH.RANDOM` / `math.random` casing → still fires (the L24 re-derivation pin).
- the two ★ injection-immunity tests and every other kind's cases → unchanged and still green.

## Guarantee audit (P0)

- "`insecure-random` fires only when a security-material word appears as an identifier SEGMENT on a
  `Math.random` line" → **floor: enum-regex** (`pharn/ARCHITECTURE.md §2` primitive #3). The regex is the check.
- "the `keys` / `monkeys` shapes no longer fire, and the four named positives still do" → **floor: enum-regex**,
  pinned by the hermetic suite whose exit code is a `/pharn-dev-verify` gate.
- "the `Math.random` conjunct's case-insensitivity is unchanged" → the equivalence ARGUMENT is **advisory**;
  the floor is the added casing test's membership assertion, not the reasoning.
- "an `insecure-random` hit is a real vulnerability" → **advisory**, and NOT claimed. Segment anchoring makes the
  NAME match precise; it says nothing about the value. The header's existing honest bound stands and is restated
  with the narrowing below.
- "`SKILLS_VERSION` agrees with the README badge" → **floor: enum-regex** (`.dev/floor/check-version-badge.mjs`,
  wired as `check:badge` in `npm run check` and as its own `ci.yml` step).
- "the bump SIZE (patch) is correct" → **advisory**. No checker verifies that a correction earned a patch rather
  than a minor; that is the human's call at GATE 2.

## Stated narrowing (the honest cost, P7)

Segment anchoring converts some current matches into misses. Named, not hidden:

- A lowercase plural at a hard boundary — bare `keys`, `secrets`, `tokens` — no longer matches. This is exactly
  the repro being fixed; it is indistinguishable from `Object.keys` by boundary alone, and the repro wins.
- A security-material word glued inside a longer lowercase word (`mytoken`, `thesalt`) no longer matches.
- Everything the header already disclaims — aliased algorithms, split literals, unlisted libraries — is unchanged.

## Trust audit (P2)

- Input: an arbitrary CODE file, `trust: untrusted`. Taint propagation is UNCHANGED: the verdict stays regex
  membership over the text, so no comment can suppress a real hit or manufacture a false one. The two ★
  injection-immunity tests remain the proof and must stay green.
- Test fixtures added by this increment are DATA authored as adversarial input; nothing inside them is followed.

## Determinism audit (P5)

- The only branch is regex membership over a line — no LLM classification anywhere in the scanner.
- The fallback is unchanged: a `Math.random` with no SECMAT segment on its line yields no hit, and the
  "is this RNG actually crypto-sensitive?" question stays Layer-2 lens judgment terminating in human review.

## Open questions (RESOLVED at GATE 1, 2026-08-20)

Both were put to the human as a selectable form at the plan halt; both are answered, so this section is
closed and the plan is approved as written.

- ~~The task text reads "a camelCase-segment boundary — t applied to `iv`". Read as "the same treatment
  already applied to `iv`", which the preceding sentence forces. Confirm.~~
  **RESOLVED — "Yes, extend iv's treatment to all 11 words."** The reading the plan assumed is correct.
- ~~Plural preservation: strict anchoring alone would turn `apiKeys` / `API_KEYS` / `api_keys` — all
  detected today — into misses. Confirm that is wanted rather than the strictest possible anchor.~~
  **RESOLVED — "Anchor + keep plurals."** Branches 2-4 stand: a trailing `s` is admitted on a CONTINUATION
  segment only, never on a bare lowercase word.

## Grill dispositions (advisory input, folded in before build)

`.dev/features/secmat-word-boundary/GRILL.md` raised 6 concerns, 0 blocking. Three are accepted and land
inside the `## Files` already approved above; three are recorded without a change. This subsection records
what the build does differently from the shape pinned above — it does not widen scope.

- **Accepted (P5).** Branch 1's negative lookbehind narrows from `(?<![A-Za-z0-9_$])` to `(?<![A-Za-z0-9])`.
  The `_$` earned nothing — `keys` is blocked by the right-hand `(?![a-z0-9])`, not the lookbehind — while
  excluding `$` made `$key` / `$token` uncompensated misses. This is the one deviation from the pinned shape.
- **Accepted (P1 + L29).** The 4-branch set is materialized as an iterated table, not three named examples,
  so branch coverage ranges over all 11 words.
- **Accepted (P0 + L24).** The measured cost bound is recorded in the scanner header and pinned by a
  membership test (completed vs. killed under a subprocess timeout), never a stopwatch-vs-threshold.
- **Recorded, no change.** The `hardcoded-iv-salt` pattern keeps its `\b`-anchored idiom (a different axis,
  P7) — the header names the divergence as deliberate; no lens eval exercises `insecure-random` (a second
  surfacing, escalation deferred); the grill command's own griller-count prose is stale (not in scope).
