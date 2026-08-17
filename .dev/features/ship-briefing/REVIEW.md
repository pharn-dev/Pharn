# REVIEW — ship-briefing

**Floor first (P0):** `node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities checked` (unchanged
from pre-build — neither `render-ship-briefing.mjs` nor `check-ship-briefing.mjs` carries `role:`, correctly).
The increment reached review only because the floor was already GREEN.

## L-floor → P0

No finding. Every guarantee claim in the built artifacts is labeled and reduces correctly:

- `pharn/pharn-contracts/ship-briefing.md`'s "The rule of the contract" section separates FLOOR (envelope
  shape + cross-file equality, both enum/regex/equality) from ADVISORY (the `## Why this design` content's
  truth, the `## Files` list's completeness) and explicitly **strikes** two overclaims ("`BRIEFING.md` is a
  faithful summary", "GATE 2 requires a GREEN checker").
- `.claude/commands/pharn-ship.md`'s Guarantee-audit section was updated to stop claiming "adds no new
  floor primitive" now that `check-ship-briefing.mjs` genuinely is one — the claim is narrowed to "no new
  _gating_ primitive" and the one non-gating primitive is named, not folded silently into "zero".
- `check-ship-briefing.mjs`'s own GREEN message states precisely what it proves ("the COPIES agree with
  their sources right now") and what it does not ("never that the briefing is a faithful or sufficient
  summary").

## L-eval → P1

No finding. Neither new `.mjs` carries `role:`, so P1's Capability-eval requirement does not bind them
(confirmed by the floor: capability count unchanged at 36). Both ship their own `node --test` suites
(45 tests, 97.9% aggregate line coverage) in the same class as every existing `pharn/floor/check-*.mjs`.

## L-trust → P2 — one finding, found and fixed during this review

````yaml
- type: FINDING
  rule_id: "P2"
  severity: important
  file: "pharn/floor/render-ship-briefing.mjs:181 (pre-fix)"
  problem: "grillVerdictLine matched the FIRST line anywhere in GRILL.md containing the substring
    'ADVISORY VERDICT', without skipping fenced code blocks. A finding's evidence: field quotes untrusted
    PLAN.md text verbatim inside a ```yaml fence (P2's own quoting discipline), and findings are always
    ordered BEFORE the real summary verdict — so a crafted evidence: string containing the literal text
    '**ADVISORY VERDICT: 0 concerns raised**' would be picked up INSTEAD of the real, later verdict,
    misrepresenting what grill actually concluded in the rendered BRIEFING.md."
  evidence: "Reproduced live this run: a fixture GRILL.md with a fenced finding whose evidence: field
    contained a forged '0 concerns raised' claim, followed by a real summary line reading '6 concerns
    raised (3 blocking-severity, 3 minor)', caused grillVerdictLine to return the forged text verbatim."
````

**I caught myself about to accept this as merely 'labeled advisory, therefore acceptable' — that is exactly
the failure mode this lens exists to catch.** `grill_verdict`'s contract already labels its content class
untrusted (correctly), but the field's whole PURPOSE is to reflect GRILL.md's own summary; silently
returning a forged line instead is a real defect, not a documented limit. **Fixed in this review, not
merely reported:** `grillVerdictLine` (both the `render-ship-briefing.mjs` original and the
`check-ship-briefing.mjs` duplicate) now skips fenced blocks entirely, anchors to LINE-INITIAL
`**ADVISORY VERDICT:` (an `evidence: "..."` line can never match), and takes the LAST match (the real
summary is always last in every sampled GRILL.md). A ★ regression test reproduces the exact attack and
asserts the real, later line wins; the ✧ parity test between the two duplicated copies was extended with
the same fixture plus a two-real-verdict-lines case. Re-verified after the fix: `npm run check` clean,
`/pharn-dev-regress` re-run → still `no-regressions`, `/pharn-dev-verify` re-run → still `PASS` (byte-identical
gate results; only the two source files' content changed).

**This is a live confirming instance of `.dev/memory-bank/lessons-learned.md` L6** ("a
structural/membership fact is read from the structured location, never grepped from free text") — L6
already exists and directly covers this class (its own remedy: "reserve free text for human-facing DATA").
No new lesson is proposed; this is L6 catching a fresh instance of its own named failure mode before ship,
which is exactly what a promoted lesson is for.

**A second, correctness (not trust-fence) defect surfaced producing the HALT-2 demo, and is recorded here
rather than only in the diff.** Rendering `BRIEFING.md` against this feature's own `.dev/features/`
record — the exact live demo the build prompt requires — showed `grill_verdict: "n/a"` even though this
feature's own `GRILL.md` carries a real verdict. Two real, independent defects, both found by actually
running the tool against real data rather than only synthetic fixtures (`lessons-learned.md` L4 — an
authored fixture passes by construction; a live artifact must be measured):

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".dev/features/ship-briefing/GRILL.md:139 (pre-fix)"
  problem: "This feature's OWN GRILL.md deviated from the 92/92-sampled convention — it used a '##
    ADVISORY VERDICT' heading followed by the verdict on a separate line, instead of the single bold
    '**ADVISORY VERDICT: ...**' paragraph every sampled file uses. The render correctly returned n/a for
    a convention violation; the violation was this document's own authoring, not the parser."
  evidence: "Live discovery-first read (P6) of the file being reviewed, not assumed from memory."
- type: FINDING
  rule_id: "P5"
  severity: important
  file: "pharn/floor/render-ship-briefing.mjs:204 (pre-fix)"
  problem: "grillVerdictLine read only the SINGLE physical line matching the anchor. prettier's markdown
    proseWrap commonly wraps a long bold verdict across multiple physical lines, and the closing '**' often
    lands mid-paragraph with unbolded elaboration continuing after it — both true of most REAL sampled
    GRILL.md files, not an edge case. The single-line read silently truncated the verdict at the wrap
    point."
  evidence: "Reproduced live: this feature's corrected GRILL.md line 139-141 wraps '...for the human to
    weigh / before /pharn-dev-build.** None gates...' across two physical lines; the pre-fix renderer
    returned only the first line's text, truncated before the closing **."
```

**Both fixed in this review**, not merely reported: the GRILL.md heading was corrected to the established
convention (a one-line diff); `grillVerdictLine` (both copies) now accumulates consecutive physical lines
from the opening `**` up to the matching closing `**` or a paragraph boundary, joined with a space —
capturing exactly the bolded headline, never trailing unbolded prose in the same paragraph. A new ★
regression test reproduces the exact wrap pattern. `npm run check`, `/pharn-dev-regress`, and
`/pharn-dev-verify` were each re-run after this second fix too — all unchanged (still clean / `no-regressions`
/ `PASS`).

**One narrower residual, named not fixed (P7 — not worth the complexity for an unobserved case):** if a
PLAN.md's own (legitimately quoted) Decision-section text literally contained the exact line `## Why this
design`, `check-ship-briefing.mjs`'s structure check (which scans the whole rendered body for that heading)
would see two occurrences and RED as a false positive. No dogfood or eval instance has hit this; flagged
here per P7's "real failure, not hypothetical" bar rather than engineered around speculatively.

## L-axis → P3

No finding. `render-ship-briefing.mjs` and `check-ship-briefing.mjs` deliberately duplicate three field
readers rather than import each other (documented, ✧ parity-tested) — no sibling reference. The one
modified pre-existing file, `pharn/floor/check-regress.mjs`, gained a single array entry
(`"BRIEFING.md"` in `PIPELINE_ARTIFACTS`) — a trivial, in-scope addition, not a second axis of change.

## Verdict

**GREEN — 0 blocking floor-gate findings, 3 advisory findings (2 important, 1 minor), all found and fixed
within this review, re-verified after each fix.** Two of the three (the trust-fence shadow, the line-wrap
truncation) were found only by rendering `BRIEFING.md` against this feature's own real
`.dev/features/ship-briefing/` record for the HALT-2 demo — confirming L4's point that an authored fixture
passing is not the same as a live artifact being measured. The increment is done: floor GREEN, `npm run
check` clean, `/pharn-dev-regress` → `no-regressions`, `/pharn-dev-verify` → `PASS`, all three findings closed
with reproducing regression tests rather than left open.
