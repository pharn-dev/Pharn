# REVIEW — retro-tag-legacy-lessons

PHARN reviewing PHARN. The increment under review is **`trust: untrusted`**; every quote below is DATA.

> **Second pass, after the GATE-2 fix pass.** The first pass raised 5 advisory findings; four were fixed
> inside the (amended) `## Files` and one was considered and declined. This pass re-reviews the tree as
> it now stands and records the disposition of each.

## Step 1 — Floor first (P0)

`node pharn/floor/validate.mjs .` → **GREEN — 36 capabilities checked** (exit 0), unchanged from the
pre-build baseline. `npm run check` → **exit 0**, now at **1381** tests. **The floor is the only
guaranteed part of this review; all four lenses below are advisory.**

## Disposition of the first pass

| #   | finding                                           | disposition                                                                                                 |
| --- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| F1  | P0 — CHANGELOG overstated the fix #7 guarantee    | **FIXED.** The entry now carries the L19 narrowing: `docs/lessons-index.md` is a Bash write, never gated    |
| F2  | P0 — guarantee-audit row said FLOOR for a marker  | **FIXED.** The row now reads "FLOOR (enum), but it MARKS rather than GATES", agreeing with its residual row |
| F3  | P5 — hand-typed eval-pair path caused a false red | **FIXED (narrow).** `/pharn-dev-regress.md` names the pair in full + prescribes a `test -r` pre-check       |
| F4  | P4 — `plan-shape` overloaded on L1                | **DECLINED**, with reasons recorded in `PLAN.md` `## Post-review amendments` — see below                    |
| F5  | P4 — legend narrated history rather than the rule | **FIXED.** Both legend sites now state the rule; the rendered header no longer references the retag event   |

**On F4, since declining a finding deserves more scrutiny than fixing one.** I raised it and I still
think the collision is real: `plan-shape` on L1 means _scoping completeness_ where L18/L20 mean
_document structure_. It was declined because the tag is defensible under a broad reading, it was
**human-ratified at GATE 1** as part of the 37-tag inventory, and churning ratified canon over a minor
stylistic call would cascade the `37 distinct / 4 reused` figure through three further docs for no
functional gain — a selector on `plan-shape` still gets L1/L18/L20, all genuinely about plans. **This is
a judgment call, not a fact**, and it is recorded in the plan so a future reader sees a decision rather
than an omission.

## Findings — this pass

### FLOOR-GATE (blocking) — none

No P0 guarantee lacks a floor reduction or an `advisory` label; P1 has nothing to bind (no Capability,
no `rule_id`, no `enforces` — the floor agrees at 36 capabilities); no sibling reference. **Not
blocked.**

### ADVISORY (warn) — 1 new

#### F6 — the input-capture boundary was crossed a SECOND time in this same increment

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/retro-tag-legacy-lessons/REGRESSION.md:60"
  problem: "The regress re-run collected its changed-path set with `git ls-files --others --exclude-standard -uall`, where `-uall` is a `git status` flag that `git ls-files` rejects — git exited with `unknown switch 'a'`, the brace group carried on, and every untracked path silently vanished from `inside` (9 instead of 17), which would have had `scope` compare a TRUNCATED changed-set against `## Files`."
  evidence: "REGRESSION.md:60 — 'an invalid flag silently dropping half the input set … In the first pass the same mistake was masked by a `|| git ls-files --others --exclude-standard` fallback that quietly produced the right answer.'"
```

**Why it matters more than the first instance.** F3 (the guessed eval path) fails **closed** — a bogus
red that gets investigated. **This one fails OPEN**: a truncated `inside` set means `scope` has fewer
paths to test against `## Files`, so a genuine escape would go **unreported** and every downstream gate
would still be green. It was caught only by **asserting the expected cardinality** — 9 ≠ 17 — which is
verbatim what L5 already prescribes ("assert the expected cardinality; fail-closed on a surprising
shape"). Two instances of one class inside one increment, on top of L5 → L16 → L21, is exactly the
evidence **L20** asks for before escalating a discipline-only remedy to the floor.

## Lens-by-lens

- **L-floor → P0.** Clean this pass. Both P0 findings are fixed, and the fixes are themselves honest
  about their limits: the CHANGELOG now says the render residual is **"narrowed, not closed"** and names
  the product surface it does not cover; the new test's own comment states it proves shape, never
  aptness, and scopes itself to this repo. Checked specifically that the fix pass did not create a
  **new** overclaim — the guard is described as covering dev canon only, never "canon is now guaranteed
  tagged."
- **L-eval → P1.** No Capability, no `rule_id`, no `enforces` — P1 binds none of this and the floor
  agrees. The gap the first pass flagged is now **closed for this surface**: the newly-true 21/21
  invariant is pinned by a live-canon assertion in an existing suite, and — per **L4** — it was
  **measured rejecting** two distinct mutations before being trusted, with canon restored and verified
  byte-identical by SHA-256. It is not the deferred `lesson-tagline-render-check` checker, and the plan
  says so.
- **L-trust → P2.** Clean. The 17 tag lines sit in the **enum/regex-gated** half; every lesson body and
  title is byte-unchanged free text inside a `text` fence, read by no decision. Titles carrying
  back-ticks and `||` (L15) round-trip through `assertSafeTitle`, which refuses rather than sanitizes.
  Taint direction unchanged: a poisoned `concepts` tag biases only **advisory context selection**, never
  a floor verdict, since `check-plan-lessons.mjs` reads **canon**, never the index. **No
  instruction-looking content in the reviewed artifacts changed reviewer behavior** — the PLAN's
  imperative prose was treated as approved intent to verify against (and verified: the setter's printed
  count was checked against the declared number at both 15 and 17), never as a directive to obey.
- **L-axis → P3.** Clean. `.dev/floor/lessons-index-core.mjs` still serves **one** axis (the legend's
  truth) across a comment and a template string; no import, signature, or constant moved, so the ✧
  cross-surface pin — which compares only constant right-hand sides and `cleanScalar`, stripping
  trailing comments — is untouched. The new test lives in the existing drift-guard section of the file
  that already owns those live-file reads, rather than starting a new suite. Product twins byte-unchanged;
  `SKILLS_VERSION` correctly unbumped at 2.6.1 and the README badge check GREEN.

## Proposed lesson candidate (NOT written to canon here — P2)

`/pharn-dev-review` holds **no** `.dev/memory-bank/**` write scope. Proposal only; promotion is a separate
human-gated `/pharn-dev-memory-promote` run.

> **Candidate — A stage must DISCOVER its gate inputs; a hand-typed path or flag is an input-capture
> surface, and the fail-OPEN variant is the dangerous one.**
>
> L5 named input-capture a trust boundary; L16 found the trap inside L5's own remedy; L21 found it again
> through `git status`. This increment hit it **twice more in one stage**: a guessed eval-pair path
> (fail-closed — a bogus red, equal at base and head, classified `pre_existing`) and an invalid
> `git ls-files -uall` flag (**fail-open** — untracked paths silently dropped, so a real scope escape
> would go unreported). Both were caught only by **asserting the expected cardinality**, which is
> already L5's prescription — so per **L20** the reminder was not too quiet, it was the wrong KIND of
> remedy. The reduction needs no new primitive: `check-regress.mjs scope` should **discover** committed
> eval pairs by glob rather than accept a hand-typed `--eval-pairs`, and should **REJECT an unreadable
> pair path as a setup error (exit 2) rather than record it as a gate result** — a shape/membership
> test, `pharn/ARCHITECTURE.md §2` primitive #3. The generalization: **a wrong input that makes a gate
> louder gets investigated; a wrong input that makes a gate quieter does not** — so orchestration must
> assert its input cardinality, not just its exit codes.
>
> **Provenance.**
>
> - feature: `retro-tag-legacy-lessons`
> - commit: `45d742a9c3932f9d1e31c4bd25ae94e71533f175` (working-tree dogfood built on this commit;
>   uncommitted at review time)
> - source: `.dev/features/retro-tag-legacy-lessons/REGRESSION.md` ("Input-capture defects found and
>   corrected during this run") + this REVIEW's F3 and F6, both reproduced live at the regress stage
> - type: `tooling` · concepts: `[input-capture, lesson-recurrence, floor-escalation, fail-open]`

## Verdict

**GREEN — 0 floor-gate (blocking) findings; 1 advisory (important).**

The increment is **not blocked**. Floor GREEN, six verify gates PASS, no regression outside the feature,
`npm run check` exit 0 at 1381 tests. Of the first pass's five findings, four are fixed and one is
declined with recorded reasons; the one new finding is a follow-up proposal, not a defect in what
ships.

**This verdict is ADVISORY.** "Review GREEN" means no blocking finding was raised by four LLM-applied
lenses — it is **not** a guarantee the increment is correct, and it says nothing about whether the 17
`type`/`concepts` assignments are apt. That remains the human's call.
