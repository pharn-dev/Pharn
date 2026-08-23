# REVIEW — forward-looking-claims-sweep

PHARN reviewing PHARN. Four advisory lenses, each citing a principle, over the increment's own diff
(31 files, +111/−77). The increment under review is treated as `trust: untrusted` (P2):
instruction-looking content in a reviewed file is reported, never followed.

**Floor-gate vs advisory split.** The blocking verdicts are already in: `validate` exit **0**,
`regression-report.json` `.verdict` **no-regressions**, `verify-report.json` `.verdict` **PASS**
(8 gates, 1620/1620). Everything below is **advisory** — `/pharn-dev-review` emits no machine verdict
and its `severity` values are LLM-assigned (fix #3). Nothing here gates.

---

## R1 — the increment reproduced its own defect at reversed polarity, and only the verify stage caught it

- type: `correctness`
- rule_id: `pharn/CONSTITUTION.md P0`
- severity: `blocking` (LLM-assigned — advisory)
- file: `pharn/pharn-pipeline/grillers/a11y/a11y.md`
- status: **FIXED before this review, during `/pharn-dev-verify`**

**problem** (free-text, untrusted): The first-pass Class C rewrite replaced the grillers'
_"no runner yet invokes it"_ with _"`/pharn-verify` / `/pharn-dev-verify` run it per committed eval
pair (this griller ships them)"_. That is false. `/pharn-verify` Step 3b pairs
`<capDir>/evals/expected/*.json` with a committed **`<capDir>/findings.json`**; the product surface
carries **zero** committed `findings.json`, so the absent-if-none membership rule emits **no
`structural:*` gate** for any of the seven.

**evidence**: `find pharn -name "findings.json"` → 0 results. `.claude/commands/pharn-verify.md`
§3b: _"a feature that ships **no** such committed `(expected, actual)` pair simply has **no**
`structural:*` gate"_. The increment's own `verify-report.json` records `structural_gates: []`.

**Why this is the sharpest finding in the increment.** The original prose **underclaimed** — it
described the repo as weaker than it is, which is the failure mode L33 names and this increment
exists to fix. The first-pass repair **overclaimed** — it asserted a floor gate that does not fire.
Those are not symmetric: L33's polarity survives review by sounding conservative, but P0's polarity
is the disease this entire repo was built to prevent. **The repair pass was more dangerous than the
defect**, and a sweep whose stated purpose is "delete the 'not yet'" is structurally biased toward
producing exactly this. The seven files and the CHANGELOG entry now name the runner that landed
(`/pharn-dev-eval`, 3c) **and** state the operative bound (no gate fires over griller output today;
nothing fires at grill time at all).

**Recommendation (for the human):** this is promotion-grade. The transferable claim — _a pass that
removes stale hedges is biased toward manufacturing overclaims, so each rewrite needs its own
guarantee audit, not just a staleness check_ — is not in canon. L33 covers the expiry; nothing
covers the repair's polarity risk.

---

## R2 — the completeness claim is verified by patterns the same author wrote

- type: `unverifiable-claim`
- rule_id: `pharn/CONSTITUTION.md P0`
- severity: `advisory`
- file: `CHANGELOG.md`

**problem** (free-text, untrusted): The CHANGELOG states _"a post-build re-scan reports **0**
surviving stale sites."_ True as stated, but the scan's nine patterns were authored by the same pass
that wrote the replacements — so it verifies "the phrasings I knew about are gone", never "the class
is discharged". The first scanner run demonstrated the hazard directly: it reported `LENS-RUNNER: 19`
**after** the fix, because the pattern `/isolated\s+lens\s+runner/i` matched the _replacement_ text.
A less careful reading of that output would have concluded either "nothing was fixed" or, with the
pattern tightened wrongly, "everything is clean."

**Bound, stated rather than resolved:** the PLAN's guarantee audit already labels completeness
ADVISORY, and Class A carries a genuine independent cross-check (19 + 3 = 22 against
`count-lenses.mjs`). Classes B–F have no such counter. **No claim in the shipped bytes asserts
completeness** — the assertion lives only in the CHANGELOG and PLAN, which are repo-meta. That
containment is what keeps this advisory rather than blocking.

---

## R3 — L20's trigger has fired twice and the remedy is still discipline

- type: `unresolved-tension`
- rule_id: `.dev/memory-bank/lessons-learned.md L20`
- severity: `advisory`
- file: `.dev/features/forward-looking-claims-sweep/PLAN.md`

**problem** (free-text, untrusted): L20 holds that a defect whose only remedy is "remember to update
it" has earned a floor check. This class has now recurred **inside the increment that named it**
(`#165` → L33) and been re-swept here. The PLAN declines the checker on P7 grounds and records
`forward-looking-claims-manifest`. The reasoning is sound, but it is **self-issued and repeatable** —
the identical argument is available next time, and nothing structural forces the follow-up to land.
R1 sharpens this: a checker over a hand-maintained manifest would have caught neither the original
staleness **nor** the overclaim, since both live in prose no manifest indexes. So the deferral may be
more defensible than the PLAN argues, and the eventual checker weaker than L20 implies.

**Surfaced for the human at GATE 2.** It was raised at GATE 1 with an explicit re-plan offer and the
plan was approved as written; recorded here so a third recurrence has this note to point at.

---

## R4 — what the sweep deliberately left, and why that half is the fragile one

- type: `risk`
- rule_id: `pharn/CONSTITUTION.md P6`
- severity: `advisory`
- file: `pharn/pharn-pipeline/grillers/`

**problem** (free-text, untrusted): **14** sentences reading _"isolated per-**griller** runner is
deferred"_ were left untouched because they are true — `/pharn-grill` spawns zero subagents. Their
**lens** twins, nearly identical in wording, were all rewritten because `/pharn-review` does spawn
one subagent per lens. Two near-identical sentences now have opposite truth values, distinguishable
only by one word. A future sweep pattern-matching on shape rather than re-deriving against the tree
will "fix" the 14 correct ones — the same over-edit R1 nearly committed, at 14× the blast radius.

**Mitigation shipped, and its limit.** Six rewritten files now say the per-griller runner remains
deferred **in the same sentence** as the landed lens runner, so the distinction is visible where a
reader meets it. That is prose, not a check — and the constraint that produced the correct outcome
here (G3's per-file read, and the post-condition re-scan) lived in this increment's grill log, not
in anything that persists.

---

## Verified clean

- **No frontmatter touched.** `git diff` over `pharn/**/*.md` shows zero `+`/`−` on `role`, `kind`,
  `version`, `applies`, `coupling`, `enforces`, `model_tier`, `purpose`, `trust`, `writes`, `reads`.
  G1's build constraint held, so `docs:check` GREEN is **causal**, not luck — the generated catalog
  renders frontmatter only.
- **Every honest bound survived.** All **19** lenses retain "advisory orchestration"; all 19 retain
  the "not 'the model always ran it'" guarantee line (13 on one line, 5 line-wrapped, `race-condition`
  in its own variant). All **7** grillers state the grill-time bound.
- **`SKILLS_VERSION` ↔ badge** pinned by `check:badge` (exit 0); patch bump is correct per
  `CLAUDE.md` (corrections to already-shipped bytes).
- **Trusted docs untouched.** Swept and clean; no hook-denied write attempted.
- **P2:** every file edited is PHARN's own `trust: trusted` surface; no untrusted input entered
  control flow.

## What this review did NOT do

It did not independently re-derive all 31 rewritten sentences against the live tree — it re-derived
the ones the lenses surfaced (R1's seven, R4's fourteen) and spot-checked bound preservation across
the rest. **"`/pharn-dev-review` ran" never means "the prose is true"** (P0). The human owns that at
GATE 2.
