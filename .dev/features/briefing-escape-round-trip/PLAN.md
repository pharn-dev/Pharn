# PLAN — briefing-escape-round-trip

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L14, L25, L26, L27, L29]
- increment: Make `check-ship-briefing.mjs` read the BRIEFING frontmatter as the exact inverse of `render-ship-briefing.mjs`'s `yamlScalar`, so a just-rendered, quote- or backslash-bearing briefing stops REDding "stale" against its own unchanged source.
- layer(s): pharn/floor (deterministic floor infrastructure — not a Capability, no `role:`)
- constitution_refs: [P0, P3, P5, P6, P7]

## Applied lessons

- L14 — the unescape is layered as a **precondition-preserving** step: `cleanScalar` stays the guard and
  runs on the UNESCAPED value, never replaced by the new decode path, so the control-char rejection the
  shape check exists to do cannot be re-opened by the decoder.
- L25 — `check-ship-briefing.mjs`'s header already claims the duplicated readers are pinned by a ✧ parity
  test; that rationale was trusted for the defect it did **not** name (the write-side escape has no
  read-side inverse). Remedy is enforceable, not louder prose: a round-trip property test, plus the header
  amended to name the codec pair explicitly.
- L26 — the incidence measurement below ran against COPIES under `/private/tmp`, which is legitimate for
  counting but not for verifying a patch; every gate that judges this change (`npm run check`,
  `validate.mjs .`, `node --test`) runs at the REAL repo path, and the new tests use the existing in-repo
  `mkdtempSync` black-box harness these two suites already use.
- L27 — `clean()` is a SHARED helper serving THREE read branches (BRIEFING envelope, SPEC/PLAN header,
  GRILL verdict line). Only ONE of them reads `yamlScalar` output; unescaping inside `clean()` would apply
  a decode to two branches where nothing was ever encoded and would break their parity with the renderer.
  The change is therefore confined to `readEnvelope`, and the tests assert per branch — decoded in its own
  case AND unchanged in the other two.
- L29 — the remedy is quantified over a SET (the fields `render-ship-briefing.mjs` emits through
  `yamlScalar`). The deliverable is that set **materialized in one place** and iterated by the rules, not a
  test authored for `grill_verdict` because that is the field the report named.

## Files

- `pharn/floor/render-ship-briefing.mjs` — export `yamlScalar`; add + export its inverse `yamlUnscalar`; name the codec pair in the header — layer pharn/floor
- `pharn/floor/check-ship-briefing.mjs` — duplicate the codec pair; make `readEnvelope` decode fully-double-quoted scalars; amend the duplication header — layer pharn/floor
- `pharn/floor/render-ship-briefing.test.mjs` — round-trip property test over the materialized field-value corpus — layer pharn/floor (test, never ships)
- `pharn/floor/check-ship-briefing.test.mjs` — ✧ parity on the codec pair, per-branch assertions, and a render→check GREEN fixture per quote-bearing field — layer pharn/floor (test, never ships)
- `SKILLS_VERSION` — patch bump 2.7.9 → 2.7.10 (product-floor `.mjs` bytes change) — layer repo-meta
- `CHANGELOG.md` — the entry recording the fix + the bump — layer repo-meta
- `README.md` — the shields version badge, which `check-version-badge.mjs` holds equal to `SKILLS_VERSION` — layer repo-meta

## Contracts satisfied

- `pharn/pharn-contracts/ship-briefing.md` — unchanged. The contract specifies each field's SHAPE and the
  cross-file equality rule; it never specified a frontmatter ENCODING, and this increment does not add one
  to the contract — it makes the two implementations agree on the encoding they already use (P4: cited,
  not restated). No contract text changes, so no contract-version bump.

## Evals to write (P1)

Not applicable — `pharn/floor/*.mjs` is floor infrastructure, not a Capability (no `role:` frontmatter),
so P1's evals requirement does not attach. Its regression suite is `node --test` over the two `*.test.mjs`
files named in `## Files`; the new tests below are that suite's extension.

- round-trip property → for every value in the materialized corpus (quotes, backslashes, the literal `\"`,
  a lone trailing `\`, a `"` at each end, and a `n/a`-lookalike): `yamlUnscalar(strip(yamlScalar(v))) === v`
- codec parity → the renderer's and checker's copies of BOTH `yamlScalar` and `yamlUnscalar` agree over
  that same corpus (the existing ✧ PARITY group's convention)
- per-field render→check → for each `yamlScalar`-emitted field that can carry a quote (`feature`,
  `spec_id`, `grill_verdict`): assemble sources containing a `"` and a `\`, render, check → exit 0
- per-branch non-regression (L27) → `readHeaderField` and `grillVerdictLine` return the SAME value as today
  for an input containing `\"`, i.e. the decode did NOT leak into the two live-source branches
- guard composition (L14) → a frontmatter value whose decoded form would exceed its length bound, and one
  carrying a control char, are still RED after decoding

## Guarantee audit (P0)

- "a rendered BRIEFING's frontmatter fields decode to exactly what the renderer copied" → **floor:
  enum-regex** (`pharn/ARCHITECTURE.md §2` primitive #3) — the checker's existing byte-equality compare,
  now performed on the decoded value. Unchanged primitive; the increment adds NO new floor primitive.
- "the two copies of the codec cannot silently diverge" → **advisory**, backstopped by the ✧ parity test.
  A test is not a floor primitive; it is a regression guard that fires only when `node --test` is run.
  Never write "the codec is guaranteed to stay in sync" — write that a parity test pins it.
- "`check-ship-briefing.mjs` GREEN means the briefing is faithful" → **struck.** It means, exactly as
  before, that the copies currently equal their sources. The decode changes only WHICH bytes are compared,
  never what GREEN asserts.
- "this fix is triggered by a real failure (P7)" → **advisory, and honestly bounded.** The defect is
  deterministically reproduced (below). Its live incidence on this repo's own corpus is measured at **0 of
  77** captured grill verdicts — the `**ADVISORY VERDICT: …**` convention closes the bold span before the
  quoted phrases, so the vector sits one wording change away, not in the past. 21 verdict LINES do contain
  a `"`, outside the captured span. The trigger is the reproduced round-trip failure in shipped floor code,
  NOT an observed production RED; that distinction is stated here rather than smoothed over.

## Trust audit (P2)

- `GRILL.md`'s advisory verdict line is `trust: untrusted` free text, and `grill_verdict` is a VERBATIM
  COPY that inherits the tag (`pharn/pharn-contracts/ship-briefing.md`). This increment makes the copy
  MORE faithful — a decoded `"` reaches the compared value where a mangled `\"` did before. Taint class is
  unchanged: the field is still shape-gated (`cleanScalar` ≤256, control-char-free) and still never steers
  a branch. `yamlUnscalar` decodes ONLY `\\` and `\"` — it introduces no new byte classes, cannot emit a
  control character that `cleanScalar` would then have to catch, and is not a general YAML unescaper (no
  `\n`/`\u` handling), so an escape sequence the writer never emits is left inert rather than interpreted.
- `SPEC.md`'s `spec_id` and the `<name>` argument are the other two decode-reachable fields; both remain
  behind their existing `cleanScalar` bounds.

## Determinism audit (P5)

- The decode branches on a **membership test over the value's own shape** — "is this scalar fully
  double-quoted?" (starts with `"`, ends with an UNESCAPED `"`, length ≥ 2) — not on content judgment. A
  value failing that test takes today's `clean()` path unchanged.
- No fallback ends in a guess: a malformed or unquoted scalar degrades to the existing behavior, and every
  shape violation is still a named RED.

## Open questions (HALT)

- **Shared codec vs. duplicated codec.** The task text prefers "a shared escape/unescape pair (export the
  escaper from the renderer, or a small shared helper) so the two sides can't drift again." But
  `check-ship-briefing.mjs`'s SHIPPED header explicitly documents the opposite convention for exactly these
  two files — "Duplication, not import (P3 — no sibling import) … a ✧ PARITY test asserting both copies
  agree" — and `pharn/floor/lessons-index-core.mjs` shows the repo does have a shared-core precedent.
  Importing would contradict a shipped rationale paragraph; duplicating keeps the documented convention and
  relies on the parity test as the anti-drift device. This changes which files ship and what the header
  says, so it is the human's call at GATE 1.

## Reproduction (P6 — run this run, before any change)

Assembled a fixture whose `GRILL.md` verdict contains both a `"` and a `\`:

```text
render exit=0
  grill_verdict: "ADVISORY VERDICT: the plan says \"escape it\" and also uses a back\\slash"
check exit=1
  RED — stale: `grill_verdict` = "ADVISORY VERDICT: the plan says \\\"escape it\\\" and also uses a
  back\\\\slash" but …/GRILL.md currently reads "ADVISORY VERDICT: the plan says \"escape it\" and also
  uses a back\\slash"
```

A briefing rendered seconds earlier REDs "stale" against a source that never changed. Baseline at this
commit: `npm run check` 0-fail (1492 tests), `node pharn/floor/validate.mjs .` GREEN (36 capabilities).
