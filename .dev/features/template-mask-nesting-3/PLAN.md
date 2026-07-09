# PLAN — depth-aware maskTemplateInteriors (close the nested-template suppression launder)

- spec_content_hash: 11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969 # fix #4 (sha256 of ARCHITECTURE.md, this run)
- increment: Rewrite the five scanners' shared `maskTemplateInteriors` from an `inTmpl` boolean toggle to a depth-aware template/interpolation parser, so a nested template (`` `${`user`}` ``) can no longer re-launder a suppressor into the enum-gated verdict.
- layer(s): build apparatus — `.dev/floor/` (deterministic floor scanners) + their `.test.mjs`; `pharn-review/*` lens docs (product surface). No `pharn-contracts`/`pharn-core` change. # ARCHITECTURE.md §2 (floor primitive #3), §4
- constitution_refs: [P0, P2, P5, P7]

## Problem (verified live this run, post-#78 HEAD 0c40e64)

`maskTemplateInteriors` builds the SUPPRESSION copy (`maskedForSuppression`) each scanner reads to reject
fake, backtick-supplied suppressors. It tracks template state as a **boolean** (`inTmpl`). Inside a
`${…}` interpolation a backtick opens a **nested** template; the boolean flips _closed_ on that inner
backtick and exposes the interpolation interior as readable code → a real hit is laundered to
`found:false`. The five copies are **byte-identical** (md5 `b64c00f5…` across all five).

Reproduced on all five scanners (base = real hit `found:true`, nested = laundered `found:false`):

| scanner                | nested-template launder fixture                            | base | nested    |
| ---------------------- | ---------------------------------------------------------- | ---- | --------- |
| null-deref             | ``const label = `${`user`}`;`` before `user.name`          | true | **false** |
| resource-leak          | ``const s = `${`fd.close()`}`;`` after `fs.openSync`       | true | **false** |
| swallowed-exception    | ``catch(e){ const s = `${`throw e`}`; }``                  | true | **false** |
| missing-error-handling | ``const s = `${`try {`}`;`` around an unguarded `await`    | true | **false** |
| missing-timeout        | ``fetch(url,{h:`${`timeout`}`})`` (fake in-args indicator) | true | **false** |

`#78` (da3b2fd) ported the masker into the last three scanners and pinned **single-backtick** immunity,
but added **no nested-template** fixture — that gap let the buggy masker pass. DETECTION reads the
untouched `masked` (templates intact), so this is a **suppression-only** defect; the fix is confined to
`maskTemplateInteriors` and never touches detection or the ```-fence-robust detection path.

## Approach — CHOSEN: Design B (interpolation-code readable, stack parser) — human-approved

Rewrite `maskTemplateInteriors` to a stack/-depth parser (over the already comment/quote-masked
`masked`, so comment/string braces & backticks are already blanked and cannot confuse it):

- outside a template: `` ` `` — a run of **≥3** is a markdown ```-fence marker → emit unchanged, do **not**
  open a template (preserve the load-bearing residual); a run of 1–2 opens a template (push);
- inside a template (mask mode): blank every char (newline preserved); `` ` `` closes it (pop); `${`
  enters an **interpolation** frame (the `$` and `{` are readable code, not masked);
- inside interpolation (code mode, readable): track brace depth — `{` deepens, a `}` at depth 0 closes
  the interpolation back to its enclosing template; a `` ` `` opens **another nested template** (push,
  mask mode) at any depth;
- net rule: **mask template-STRING interiors at any nesting depth; leave interpolation code and
  non-template code readable.** Length + newlines preserved 1:1 (offsets map back to `masked`).

This is the algorithm the increment brief specifies. It closes the launder (the nested `` `user` `` /
`` `fd.close()` `` / `` `try {` `` / `` `timeout` `` STRING interiors are masked at depth) **and** treats
`${…}` interpolation as code (a precision gain over the current Option-A blank-everything).

### The one behavior change Design B forces (open question below)

Design B **flips one pinned test + its documented bound**: `scan-code-null-deref.test.mjs:116`
("DOCUMENTED BOUND (Option A `${…}` over-flag)") asserts `` `${u?.name}` `` is blanked → later `u.name`
reads as first use → **HIT(3)**. Under Design B `u?.name` is interpolation **code** (readable) → the
guard is the first visible use → **CLEAN**. That is _more_ precise (the over-flag disappears), but it
changes documented behavior, so it must be an explicit, human-approved test + doc rewrite, not a silent
flip. No other test flips: the swallowed `` `${e.message}` `` test (`:180`) stays green (its
`console.error(` head is outside the template).

### Alternative: Design A (minimal — keep Option-A semantics)

Same depth-aware parser to locate the true outer close, but **blank the entire outer-template interior
including interpolation** (preserve Option A). Fixes the identical launder, preserves `:116` (HIT) and
every Option-A doc line, is the strictly-minimal one-axis bug fix — but contradicts the brief's explicit
"leave interpolation-code readable" and keeps the `${…}` over-flag. Parser complexity is ~equal (both
must track `${…}`/nested backticks to find the real close); only the "what to blank" rule differs.

**Monotonicity (P0/P2) holds under both:** `maskTemplateInteriors` only ever _adds_ masking relative to
detection's `masked` (templates fully intact there), so the suppression copy stays a superset — the fix
can only over-flag, never unmask to re-enable suppression.

**No consolidation (P7):** the five copies stay byte-identical after the rewrite; folding them into a
shared `scan-code` util is a separate, already-deferred axis — out of scope here.

## Files

- `.dev/floor/scan-code-null-deref.mjs` — replace `maskTemplateInteriors` (depth parser); update header claim to "single- AND nested-template interiors masked" — layer floor
- `.dev/floor/scan-code-resource-leak.mjs` — same masker rewrite + header claim — layer floor
- `.dev/floor/scan-code-missing-timeout.mjs` — same masker rewrite + header claim — layer floor
- `.dev/floor/scan-code-swallowed-exception.mjs` — same masker rewrite + header claim — layer floor
- `.dev/floor/scan-code-missing-error-handling.mjs` — same masker rewrite + header claim — layer floor
- `.dev/floor/scan-code-null-deref.test.mjs` — add nested-template immunity test; **[Design B]** retarget `:116` (HIT→CLEAN, relabel "interpolation code readable → guard seen") — layer floor
- `.dev/floor/scan-code-resource-leak.test.mjs` — add nested-template immunity test — layer floor
- `.dev/floor/scan-code-missing-timeout.test.mjs` — add nested-template (in-args) immunity test — layer floor
- `.dev/floor/scan-code-swallowed-exception.test.mjs` — add nested-template immunity test — layer floor
- `.dev/floor/scan-code-missing-error-handling.test.mjs` — add nested-template immunity test — layer floor
- `pharn-review/null-deref/null-deref.md` — immunity claim: single **and** nested template interiors masked — layer pharn-review
- `pharn-review/resource-leak/resource-leak.md` — same doc honesty update — layer pharn-review
- `pharn-review/missing-timeout/missing-timeout.md` — same doc honesty update — layer pharn-review
- `pharn-review/swallowed-exception/swallowed-exception.md` — same doc honesty update — layer pharn-review
- `pharn-review/missing-error-handling/missing-error-handling.md` — same doc honesty update — layer pharn-review

## Contracts satisfied

- `pharn-contracts/finding-shape.md` — the enum-gated `found`/`hits` verdict must not be reachable from
  attacker-controlled template-STRING text (the trust-fence); this fix closes the nested-template path
  into it. Cited, not restated (P4). No contract file changes.

## Evals to write (P1)

- null-deref → ``const label = `${`user`}`;`` before `user.name` ⇒ was `false`, now HIT on the deref line
- resource-leak → ``const s = `${`fd.close()`}`;`` after an unclosed `openSync` ⇒ now HIT (unclosed-resource)
- missing-timeout → ``fetch(url,{h:`${`timeout`}`})`` ⇒ now HIT (missing-timeout); base (real `{timeout}`) still CLEAN
- swallowed-exception → ``catch(e){ const s = `${`throw e`}`; }`` (empty otherwise) ⇒ now HIT (empty/log-only)
- missing-error-handling → ``const s = `${`try {`}`;`` around an unguarded `await` ⇒ now HIT (unguarded-await)
- Regression pins to keep green in each file: existing single-backtick immunity, the FENCE-ROBUSTNESS
  detection case, and the **≥3-backtick fence-skip residual** case (parser must still skip ≥3 runs)
- **[Design B only]** null-deref `:116` retargeted CLEAN (interpolation code readable)

## Guarantee audit (P0)

- "template-STRING interiors are masked in the suppression copy at ANY nesting depth" → **floor**:
  enum/regex + deterministic text transform (ARCHITECTURE §2 primitive #3), proven by the hermetic
  `.test.mjs` fixtures.
- "no single- OR nested-template string text can suppress a real hit" → **floor** (the above transform ∧
  detection reads untouched `masked`).
- "≥3-backtick fence-skip residual preserved" → **floor** (membership: run-length ≥3 test), pinned by test.
- "interpolation code is treated as code" (Design B) → **advisory framing** of an existing documented
  bound: a real identifier named `timeout`/`signal` in interpolation reads as an indicator exactly as it
  would in any non-template arg (the pre-existing lenient-indicator false-negative) — NOT a new
  laundering hole (that surface is backtick STRING text, which stays masked). No new guarantee claimed.
- "the code is now correct / injection-proof" → **advisory** — never claimed; the floor guarantee is the
  masking transform + the pinned fixtures, nothing broader (P0).

## Trust audit (P2)

- Input: the untrusted code-under-review. Taint path: template-literal STRING text (attacker-controlled)
  → previously could forge a suppressor (fake `.close(` / `try {` / indicator / non-empty catch body /
  fake first-use) that the boolean masker exposed via the nested-backtick flip → laundered into the
  enum-gated `found`/`hits`. After the fix: all template-string interiors (any depth) are blanked in the
  suppression copy, so backtick text cannot reach the verdict; detection still reads `masked` (templates
  intact) so nothing is unmasked. Residual (stated, not hidden): the ≥3-backtick fence-skip (a
  fence-wrapped token reads as code — correct over a `.md` fixture, a narrow raw-`.js` residual) is
  unchanged; and interpolation _code_ is readable (Design B) — real code, the existing lenient-indicator
  bound, not a backtick-text launder.

## Determinism audit (P5)

- The masker is a fixed character-by-character transform with a deterministic template/interpolation
  stack — no LLM, no classification; every branch is a membership/char test (`` ` ``, `$`+`{`, `{`, `}`,
  run-length ≥3). No fallback path; on unbalanced input it simply stops at EOF (fail-open toward
  _flagging_, never toward hiding — consistent with the existing `matchDelim → -1` discipline).

## Open questions (HALT) — RESOLVED

1. **Design B vs Design A.** → **RESOLVED (human, this run): Design B.** Build the interpolation-code-
   readable stack parser; retarget `null-deref.test.mjs:116` HIT→CLEAN (relabel "interpolation code
   readable → guard seen → CLEAN") and rewrite the "Option A `${…}` over-flag" wording in the five
   scanner headers + five lens docs to the interpolation-readable framing. Design A is not built.
