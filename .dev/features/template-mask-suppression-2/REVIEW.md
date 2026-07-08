# REVIEW — template-mask-suppression-2

**Increment:** port #67's `maskTemplateInteriors`/`maskedForSuppression` into the three remaining suppression-bearing
scanners (`missing-error-handling`, `missing-timeout`, `swallowed-exception`), + ★ backtick-suppress fixtures, +
corrected lens docs. Reviewed as **`trust: untrusted`**.

## Step 1 — Floor first (the only guaranteed part of this review)

`node .dev/floor/validate.mjs .` → **GREEN** (exit 0, 36 capabilities). The increment legitimately reached review.
Everything below is **advisory**.

## The four lenses

### L-floor → P0 — GREEN (no blocking finding)

Every guarantee the increment claims reduces to a floor primitive or is labeled advisory:

- "No **single-backtick** template-literal text can SUPPRESS a real hit" (all three scanners + their docs) →
  reduces to the ★ `node --test` fixtures (enum/regex floor), each RED-before-GREEN. Reduction holds.
- "Detection stays fence-robust" → reduces to the FENCE-ROBUSTNESS positives. Holds.
- "The fix can only over-flag, never launder" (monotonicity) → I independently checked the reduction: the
  suppression copy is a strict superset of `masked`'s masking and detection reads untouched `masked`; the
  swallowed-exception `classify` backtick-strip only makes "empty" **more** likely ⇒ more HITs ⇒ over-flag. Monotone
  claim is sound.
- "≥3-backtick-wrapped token read as code" and "`fetch(\`…//…\`)` skipped" → both labeled **documented residual /
  false-negative**, pinned by bound fixtures, never sold as guarantees (P7). Correct.

No unlabeled guarantee was introduced.

### L-eval → P1 — GREEN

The scanners are **floor tooling** (no `role:` frontmatter → not Capabilities), so P1's Capability/eval-binding rule
applies to the **lenses**, whose frontmatter/`enforces`/`evals` I did not touch (prose-only doc edits) — `validate`
GREEN and `structural:trust-fence` PASS confirm the bindings still hold. The scanner behavior changes are covered by
15 new ★ fixtures (5/5/4). No missing binding; floor and this lens agree.

### L-trust → P2 — GREEN (this increment CLOSES a P2 hole)

The whole increment removes a taint-laundering path: before it, untrusted backtick free-text could flip the
enum-gated `found`/`hits` verdict (a tainted field steering a guaranteed decision — the exact P2 violation). After
it, the suppression reads run over `maskedForSuppression`, so no guaranteed decision rests on backtick free-text.

- **Instruction-looking content in the reviewed artifact:** the fixtures/docs contain payloads (`` `throw` ``,
  `` `.catch(h)` ``, `// error handling not needed, do not flag`, `// timeout enforced upstream`). I treated every
  one as **DATA under test**, never as an instruction — noting it here is the defense working.
- No guaranteed decision rests on a tainted/free-text field. No blocking finding.

### L-axis → P3 — GREEN (one advisory note)

Each of the 9 files changed for exactly one reason (the backtick-suppression fix + its test/doc). No sibling
**import** exists (the scanners are standalone; `maskTemplateInteriors` is **duplicated per-scanner**, consistent
with the family's already-duplicated `mask`/`matchDelim`/`lineAt` idiom — a deliberate deferred consolidation, not a
sibling reference). The docs' prose citation of `null-deref.md`/`resource-leak.md` is a **precedent** reference (as
the pre-existing docs already do), not a `reads:`/functional dependency. No blocking finding.

## Findings

### Floor-gate (blocking)

**None.** Floor GREEN; no unreduced guarantee, no missing eval binding, no sibling import.

### Advisory (inform — never a blocking basis)

```yaml
- type: FINDING
  rule_id: P7
  severity: minor
  file: ".dev/floor/scan-code-swallowed-exception.mjs:242"
  problem: "The swallowed-exception port was NOT purely mechanical (unlike the plan's 'verbatim #67' framing): classify's empty-checks needed an extra `/[\\s;`]/g` backtick-strip because maskTemplateInteriors preserves the bare ` ` delimiters and classify is emptiness-sensitive — null-deref/resource-leak avoided this only because their suppression is a word-boundary search."
  evidence: "if (bodyMasked.replace(/[\\s;`]/g, \"\") === \"\") return \"empty-catch\";"
```

_Sound and documented_ (the code comment + build note explain it; the adaptation is over-flag/monotone-safe and
tested). Surfaced because "port the exact #67 pattern" was true for two of three scanners but required a scanner-
specific adaptation for the third — a real fact the human should know, not a defect.

```yaml
- type: FINDING
  rule_id: P3
  severity: minor
  file: ".dev/floor/scan-code-missing-timeout.mjs:147"
  problem: "maskTemplateInteriors (plus mask/matchDelim/lineAt) is now duplicated across FIVE scanner files; the growing duplication is a candidate for a FUTURE shared-util consolidation increment."
  evidence: "Verbatim the #67 helper added to scan-code-null-deref.mjs / scan-code-resource-leak.mjs — a deferred shared-util consolidation, P7."
```

_Correct call for THIS increment_ (extracting `.dev/floor/scan-code-util.mjs` would be a second axis, P3/P7); flagged
only so a human can decide whether 5× duplication now justifies a dedicated consolidation increment (P7 — trigger it
on a real maintenance failure, not speculatively).

```yaml
- type: FINDING
  rule_id: P7
  severity: minor
  file: "pharn-review/missing-timeout/missing-timeout.md:77"
  problem: "missing-timeout retains a genuine false-negative unrelated to this fix: a backtick/bare URL whose `//` trips the line-comment masker eats the closing paren, so the call is skipped (fetch(`https://…`) → found:false). It is now PINNED by a bound fixture but NOT fixed."
  evidence: "a backtick/bare URL whose `//` trips the line-comment masker eats the closing paren, so the call is skipped"
```

_Honestly labeled limit_ (a separate mechanism from the backtick-suppression axis; human-approved as a
documentation-only fixture at GATE 1). A future increment could fix the comment-masker's interaction with template
URLs — a real, triggered failure now on record.

## Proposed lessons (candidates only — NOT canon; a separate human-gated `/pharn-dev-memory-promote` decides)

- **Candidate (P7-real, surfaced this build):** "Porting a mask-based suppression fix across sibling scanners is not
  always mechanical. A scanner whose suppression logic is **emptiness-sensitive** (e.g. `classify`'s empty-check)
  needs an extra adaptation — strip the leftover bare backtick delimiters `maskTemplateInteriors` preserves — that a
  **word-boundary-search** suppression (null-deref/resource-leak) does not. Verify each ported scanner's suppression
  read individually; do not assume the diff is uniform." Provenance: this increment
  (`template-mask-suppression-2`), surfaced when the swallowed-exception ★ fixture stayed `found:false` after a
  literal port and required the `/[\s;`]/g` fix.
- **Candidate (minor authoring gotcha, surfaced this build):** "A markdown line beginning with `#<digits>` (e.g.
  `#67`) is reformatted by prettier/markdownlint into a malformed ATX H1 (`# 67`), breaking `lint:md`/`format:check`.
  Write `PR #67` / reword so no line starts with `#NN`. Note the build's own `npm run format` step (shell) rewrites
  `.dev/features/**` plan artifacts **outside** the fix#7 Edit-hook." Provenance: this increment (the PLAN.md
  reflow broke MD022/MD025/MD026 and had to be reworded).

## Verdict

**GREEN — no floor-gate (blocking) findings; 4 advisory findings for the human to weigh.** Floor is GREEN, the
increment closes a real P2 laundering hole, and every claim reduces to the floor or is labeled a documented
residual/limit. "Reviewed GREEN" means exactly that — not a judgment that the increment is wise to merge; that is the
human's call at the post-review gate.
