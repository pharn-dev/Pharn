# GRILL — forward-looking-claims-sweep

Advisory interrogation of the approved `PLAN.md` before `/pharn-dev-build`. **This stage gates
nothing** (`grill.md`) — it surfaces concerns; the build proceeds regardless. Findings below use the
enum-gated / free-text split (`pharn/pharn-contracts/finding-shape.md`, cited not restated — P4).

## Verdict

**PROCEED.** Four findings, all resolved or converted into build constraints before the build ran.
No finding invalidates the plan's enumeration; one (G2) independently **strengthens** its largest
class.

---

## G1 — the plan's `## Files` omits `docs/capabilities/**`, and the risk is real but does not bite

- type: `gap`
- rule_id: `CLAUDE.md docs:check`
- severity: `advisory`
- file: `.dev/features/forward-looking-claims-sweep/PLAN.md`

**problem** (free-text, untrusted): `docs/capabilities/**` is a GENERATED region guarded by
`npm run docs:check` at byte-equality, and it renders **37** pages including a page for every lens
and griller this increment edits. The plan's `## Files` names none of them. If the catalog embedded
body prose, all 31 edits would drift the catalog and RED the `docs:check` gate — with the writes-scope
simultaneously denying the regeneration write.

**evidence**: `docs/capabilities/` contains 37 files (`a11y.md`, `copy-paste-drift.md`,
`injection.md`, …). `head -20 docs/capabilities/injection.md` shows the rendered page carries
**frontmatter fields only** — Role / Kind / Version / Applies / Coupling / Enforces / Model tier —
plus the one-line `purpose`, and is 23 lines total.

**resolution**: `grep -rl "isolated lens runner|runner yet invokes" docs/` returns **nothing**. The
catalog does not render body prose, so body-only edits cannot drift it.

**Converted into a BUILD CONSTRAINT:** every edit in this increment must stay **below the
frontmatter fence**. Touching `purpose:` or any rendered field turns G1 from theoretical into a RED.
`npm run docs:check` is run at the end regardless (it is inside `npm run check`), so the constraint
is verified, not merely intended.

---

## G2 — Class A's premise was single-sourced; a second independent witness now confirms it

- type: `unstated-assumption`
- rule_id: `P6`
- severity: `advisory`
- file: `.dev/features/forward-looking-claims-sweep/PLAN.md`

**problem** (free-text, untrusted): Class A (20 sites — the largest in the increment) rests on the
claim "the isolated lens runner landed." The plan evidenced this from **one** file — `pharn-review.md`
Step 4. If "the review stage" in the lens prose meant `/pharn-dev-review` rather than `/pharn-review`,
and `/pharn-dev-review` applied the 22 lenses inline, the lens sentences would be **correct** and
Class A would be a 20-file over-edit — by far the worst outcome available in this increment.

**evidence**: `.claude/commands/pharn-dev-review.md:109-110` states directly: _"the
`pharn/pharn-review/*` **code** lenses over a code increment … use **`/pharn-review`** — it runs them
as parallel subagents and merges deterministically (`count-lenses` + …)"_.

**resolution**: **CONFIRMED, from the opposite direction.** `/pharn-dev-review` does **not** apply the
22 lenses; it explicitly delegates them to `/pharn-review`, and describes that command as running them
as parallel subagents. So both candidate readings of "the review stage" agree the isolated runner
exists. Class A stands on two independent witnesses.

---

## G3 — the lens/griller prose has multiple spellings; a blanket replace would be the L33 defect again

- type: `risk`
- rule_id: `L33`
- severity: `advisory`
- file: `pharn/pharn-review/`

**problem** (free-text, untrusted): The plan states the classes but not the **edit method**. The
26 body edits (19 lenses + 7 grillers) are near-duplicates, which invites a scripted
find-and-replace. That is precisely how this defect class propagates: `coupling` already proves the
spelling varies (`no **live** runner yet invokes it`), and the griller class has at least three
distinct phrasings. A single replacement string would silently skip the variants — reproducing L33
inside L33's own remedy.

**resolution / BUILD CONSTRAINT**: each of the 26 files is **read and edited individually** against
its own wording. After the build, a re-scan with the same whitespace-normalized scanner must report
**zero** surviving sites in Classes A–F — a post-condition, not an intention.

---

## G4 — "no floor check" is a P7 judgment the plan argues but cannot discharge

- type: `unresolved-tension`
- rule_id: `L20`
- severity: `advisory`
- file: `.dev/features/forward-looking-claims-sweep/PLAN.md`

**problem** (free-text, untrusted): L20's trigger has fired — this class recurred, inside the
increment that named it. The plan declines the checker on P7 grounds (the manifest is a separate axis
of change) and records `forward-looking-claims-manifest` as a follow-up. That reasoning is sound but
**self-issued**: the same argument would justify deferring the checker indefinitely, one increment at
a time. Nothing structural forces the follow-up to ever land.

**Not resolvable at this stage, and deliberately not resolved.** It was surfaced to the human at
GATE 1 with an explicit offer to re-plan and fold the checker in; the human approved the plan as
written. Recorded here so the deferral is auditable rather than invisible — and so the second
recurrence, if it comes, has this note to point at.

---

## What this grill did NOT check

- Whether each of the 31 rewritten sentences is **true**. That is `/pharn-dev-verify`'s floor gates
  and `/pharn-dev-review`'s lenses, and ultimately the human's — a grill reads the plan, not the diff.
- Whether the enumeration is **complete**. G3 constrains the method and adds a post-condition
  re-scan, but a claim spelled in a way no pattern anticipated survives both. The plan's own
  guarantee audit states this; the grill confirms it is stated, not that it is solved.
