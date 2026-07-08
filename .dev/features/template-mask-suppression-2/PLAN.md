# PLAN — template-mask-suppression-2 (close backtick-suppression laundering in three MORE scanners)

- spec_content_hash: 11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969 # fix #4 (sha256 of ARCHITECTURE.md, this run)
- increment: Port #67's `maskTemplateInteriors` (suppression-only template-interior mask) into the three remaining suppression-bearing floor scanners — `missing-error-handling`, `missing-timeout`, `swallowed-exception` — so untrusted backtick text can no longer SUPPRESS a real hit, then correct each lens doc's false immunity claim to the honest post-fix bound.
- layer(s): build apparatus (`.dev/floor/*` scanners + tests) + `pharn-review` lens docs (product surface) # ARCHITECTURE.md §4; the scanners are dev-floor tooling (validate.mjs ignores `.dev/`), the lens `.md` are the product
- constitution_refs: [P0, P2, P5, P6, P7]

## Root cause (one axis; same as #67)

PR #67 (`f31fc0a`) added `maskTemplateInteriors` → `maskedForSuppression` to **null-deref** and **resource-leak** only.
Every scanner in the family DETECTS over `masked` (comments/strings blanked, **backticks intact** — deliberate, so
detection is fence-robust over ```-fenced markdown eval fixtures). But a scanner that also has a **suppression /
exclusion read over `masked`** lets untrusted **single-backtick template-literal text** be read as code and
**silence a real hit** — taint laundering INTO the enum-gated verdict (P2). Three scanners still have exactly that
hole. **Verified live this run** (payloads run against the current scanners):

| scanner                | suppression read (over `masked`)                                                  | payload (found:**false** = BUG)                                                                                          | control                | double-quote (masked) |
| ---------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------- | --------------------- |
| missing-error-handling | (a) `.catch` same-line exclusion `:199`; **(b) `try {}` guard ranges `:162–177`** | `const y = await risky(x); const s = \`.catch(h)\`;` → **false**; and `` `try {` `` … await … `` `}` `` span → **false** | bare await → true      | `".catch(h)"` → true  |
| missing-timeout        | `INDICATOR_RE.test(args)` `:191`, `args` sliced from `masked`                     | `db.query(\`WHERE note = timeout\`)` → **false**                                                                         | `db.query(sql)` → true | `"…timeout"` → true   |
| swallowed-exception    | `classify(bodyMasked)` `:176–212`, body sliced from `masked`                      | `catch(e){ \`throw\` }` → **false**                                                                                      | empty catch → true     | `"throw"` → true      |

**Finding beyond the brief (surfaced, see Open Questions):** missing-error-handling has **TWO** backtick-suppression
vectors, not the one line the brief named. Vector (b) — a `` `try {` `` opener and a `` `}` `` closer in backtick
strings that **span** a real `await` — was confirmed live to suppress (`found:false`). Closing only `:199` would
leave the lens doc's "No free text can SUPPRESS a hit" **still false**. Both `:199` and the `:162–177` try-range
computation must move to `maskedForSuppression` to make the claim true.

## The fix (port the exact #67 pattern — detection unchanged, suppression narrowed)

In each scanner: after `const masked = mask(text);`, add the **verbatim #67 `maskTemplateInteriors(src)`** helper
(the `≥3-backtick fence-skip` + single-backtick-toggle interior-blanking, length/newlines 1:1 preserved) and
`const maskedForSuppression = maskTemplateInteriors(masked);`. Then switch **only the suppression reads** (never
detection) from `masked` → `maskedForSuppression`. Offsets are 1:1, so indices from detection (`masked`) map into
`maskedForSuppression` unchanged. The pass is **monotone** (only ADDS masking to the suppression copy; detection's
`masked` is untouched) — so it can only **narrow** the laundering surface and at worst **over-flag**, never launder.

1. **`scan-code-missing-error-handling.mjs`** — two suppression reads move:
   - PASS 1 `TRY_RE.exec(...)` + `matchDelim(...)` for `tryRanges` → over `maskedForSuppression` (a backtick `try{}`
     span can no longer manufacture a guard). Real fenced `try {…}` survives (fence-skip preserves fenced code); a
     documented side-benefit: a template `}` in a try body no longer skews that range.
   - `:199` `HANDLED_RE.test(maskedLines[line-1])` → test against `maskedForSuppression.split("\n")[line-1]` (a
     backtick `.catch(` can no longer manufacture same-line handling). Detection (`AWAIT_RE`/`JSONPARSE_RE` over
     `masked`, `lineAt(masked, …)`) is unchanged.
2. **`scan-code-missing-timeout.mjs`** — `:190–191`: slice the indicator-test args from `maskedForSuppression`
   (`maskedForSuppression.slice(callOpen+1, callClose)`) and run `INDICATOR_RE` over that. Detection (`CALL_RE` +
   `matchDelim` paren-match over `masked`) is unchanged — a backtick indicator token can no longer read as an arg.
3. **`scan-code-swallowed-exception.mjs`** — `:211–212`: pass `maskedForSuppression.slice(bodyOpen+1, bodyClose)`
   to `classify(...)`. Detection (`CATCH_RE` + body brace-match over `masked`) is unchanged — a bare-backtick body
   can no longer read non-empty nor supply a fake `throw`/`return`/`reject` HANDLE token. (The `}`-in-template
   brace-skew residual is a **separate** mechanism, left documented — not this fix.)

## Files

- `.dev/floor/scan-code-missing-error-handling.mjs` — add `maskTemplateInteriors`+`maskedForSuppression`; move tryRanges (PASS 1) + `.catch` exclusion (:199) to it; update the header block's immunity/residual comment to the #67 wording — layer .dev-floor
- `.dev/floor/scan-code-missing-error-handling.test.mjs` — add ★ backtick-suppress immunity fixtures for BOTH vectors (`.catch` + `try{}`-span), a fence-robustness positive, and the ≥3-backtick residual bound — layer .dev-floor
- `.dev/floor/scan-code-missing-timeout.mjs` — add `maskTemplateInteriors`+`maskedForSuppression`; slice indicator args from it (:190–191); update header immunity/residual comment — layer .dev-floor
- `.dev/floor/scan-code-missing-timeout.test.mjs` — add ★ backtick-indicator-suppress immunity fixture, fence-robustness positive, ≥3-backtick residual bound, **and** the `fetch(\`https://…\`)` `//`-in-URL bound-documenting fixture (asserts current`found:false`, no code change — see Open Questions) — layer .dev-floor
- `.dev/floor/scan-code-swallowed-exception.mjs` — add `maskTemplateInteriors`+`maskedForSuppression`; classify over the suppression body (:211–212); update header immunity/residual comment — layer .dev-floor
- `.dev/floor/scan-code-swallowed-exception.test.mjs` — add ★ backtick-body-suppress immunity fixture, fence-robustness positive, ≥3-backtick residual bound — layer .dev-floor
- `pharn-review/missing-error-handling/missing-error-handling.md` — replace the false ":73" claim ("No free text can SUPPRESS a hit" while backticks unmasked) with the honest post-fix bound, mirroring null-deref.md's DETECTION/SUPPRESSION/monotone/≥3-backtick-residual wording; name BOTH closed vectors — layer pharn-review
- `pharn-review/missing-timeout/missing-timeout.md` — replace the self-contradictory ":68 vs :83-84" claim with the honest post-fix bound (mirror resource-leak.md); the residual note that a backtick indicator is now masked in the suppression copy — layer pharn-review
- `pharn-review/swallowed-exception/swallowed-exception.md` — replace the false ":63 strongest form" claim with the honest post-fix bound (mirror null-deref.md); keep the `}`-in-template brace-skew as a SEPARATE documented residual — layer pharn-review

## Contracts satisfied

- `pharn-contracts/finding-shape.md` — the scanners back FLOOR sub-checks of their lenses; the fix keeps the
  enum-gated verdict (`found`/`hits[].line`/`kind`) uncontaminated by tainted backtick free-text (P2 taint-fence). # cite, do not restate (P4)
- `ARCHITECTURE.md §2` primitive #3 (enum/regex + brace/paren-match membership) — the verdict stays a deterministic
  membership test over masked text; `maskTemplateInteriors` only widens what "masked" covers in the suppression copy. # cite

## Evals to write (P1)

These scanners are **floor tooling** for the lenses, not Capabilities themselves; their "evals" are the
`node --test` ★ fixtures (the regression suite `npm test` runs). Each fixture is RED now / GREEN after the fix —
this is the point (the bug shipped green because no fixture asserted backtick-SUPPRESS). Per scanner:

- missing-error-handling → `★ backtick \`.catch\` does NOT suppress a real same-line unguarded await` → HIT on the await line (RED now).
- missing-error-handling → `★ backtick \`try {\`…\`}\` span does NOT manufacture a guard` → HIT on the await line (RED now).
- missing-error-handling → `FENCE-ROBUSTNESS: real unguarded await inside a \`\`\`-fence is still found` → HIT (stays GREEN).
- missing-error-handling → `DOCUMENTED BOUND ≥3-backtick residual` → the pinned fence-skip behavior (matches #67).
- missing-timeout → `★ backtick indicator token does NOT suppress a no-timeout call` → HIT (RED now).
- missing-timeout → `FENCE-ROBUSTNESS: real no-timeout call inside a \`\`\`-fence is still found` → HIT (stays GREEN).
- missing-timeout → `DOCUMENTED BOUND ≥3-backtick residual` → pinned.
- missing-timeout → `DOCUMENTED BOUND: fetch(\`https://…\`) with // in URL reads found:false` → asserts the existing comment-masker false-negative (no code change; locks the bound).
- swallowed-exception → `★ bare-backtick catch body does NOT suppress (neither non-empty dodge nor fake throw HANDLE)` → empty-catch HIT (RED now).
- swallowed-exception → `FENCE-ROBUSTNESS: real empty catch inside a \`\`\`-fence is still found; a real \`throw\` inside a fence is still CLEAN` → HIT / CLEAN respectively (stays GREEN).
- swallowed-exception → `DOCUMENTED BOUND ≥3-backtick residual` → pinned.

## Guarantee audit (P0)

- "No **single-backtick** template-literal text can SUPPRESS a real hit in these three scanners" → **floor: enum/regex**
  (the suppression read now runs over `maskedForSuppression`; proven by the ★ RED-now/GREEN-after fixtures). This is
  the claim the doc edits are allowed to make — and ONLY after the fixtures pass.
- "Detection stays fence-robust (real code in ```-fences still scanned)" → **floor: enum/regex** (detection unchanged
  over `masked`; `maskTemplateInteriors` skips ≥3-backtick fence markers; proven by the FENCE-ROBUSTNESS fixtures).
- "The fix can only over-flag, never launder" → **floor: content** (monotonicity — the suppression copy is a strict
  superset of `masked`'s masking; detection reads untouched `masked`). Mirrors #67's monotone argument.
- "≥3-backtick-wrapped token read as code" → **advisory/documented residual** (the price of fence-robustness; pinned
  by a bound fixture, labeled a limit, NOT sold as a guarantee — P7).
- "`fetch(\`https://…\`)`with`//` in the URL is skipped" → **advisory/documented false-negative** (a SEPARATE
  mechanism: the comment-masker eats the line; NOT fixed here, only a fixture documents it — see Open Questions).
- "the code has reliable error-handling / timeouts / no swallowed errors" → **advisory** (unchanged; the lens's
  advisory layer, never the floor — the honest-bound paragraph already says so and stays).

## Trust audit (P2)

- **Input:** an arbitrary CODE/markdown file the scanner reads (untrusted — reviewed code / eval fixture). **Taint
  path closed by this fix:** backtick template-literal _text_ is untrusted free data; before the fix it flowed into
  the **suppression** step and could flip the enum-gated `found`/`hits` verdict (the exact P2 violation — a tainted
  field steering a guaranteed decision). After the fix the suppression read runs over `maskedForSuppression`, so
  that text is blanked and **cannot** move the verdict; detection may still over-flag on backtick text (safe
  direction — a false-positive never launders). The verdict rests only on masked code structure.
- No downstream instruction execution: the scanners emit JSON (`found`/`hits[]`), never prose that a later stage
  treats as instructions.

## Determinism audit (P5)

- Every branch is a deterministic membership/paren/brace test over masked text; `maskTemplateInteriors` is a fixed
  character-state machine (no LLM, no classification). No fallback chain — a malformed/missing target already
  fail-closes (nonzero exit, nothing on stdout), unchanged.

## Open questions (HALT)

1. **missing-error-handling — close BOTH suppression vectors, or only the one the brief named?** Live testing found
   a second backtick-suppression vector (the `try {}` guard-range span, `:162–177`) in addition to the `.catch`
   exclusion (`:199`) the brief cited. Closing only `:199` leaves the doc's "No free text can SUPPRESS a hit"
   **still false**. **Recommendation: close BOTH** (same axis, same root cause) so the corrected doc claim is
   actually true. The alternative (close only `:199`, and word the doc to carve out the try-range hole) is more
   honest-than-status-quo but knowingly ships a still-open laundering vector.
2. **The `fetch(\`https://…\`)` `//`-in-URL fixture — add as a bound-documenting test only (no code change), or
drop it from this increment?** It documents a SEPARATE false-negative (the comment-masker eating the line),
unrelated to the`maskTemplateInteriors`fix; adding it is zero-code-risk (asserts current`found:false`) and
   the brief requested it, but it is arguably a second concern. **Recommendation: add it as a pinned bound fixture**
   (locks the documented limit; no code change), clearly labeled as an unrelated documented bound.
