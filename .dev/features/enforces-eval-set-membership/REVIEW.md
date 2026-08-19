# REVIEW — enforces-eval-set-membership

**Floor first (P0):** `node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities checked`,
exit 0. The increment reached review with a green floor, so the four lenses below are advisory
judgment layered on a verified floor — not a substitute for it.

Increment under review is `trust: untrusted`. Nothing in the reviewed files attempted to steer this
review; the injection-shaped strings that appear (a `semantic[].judge` sentence, a `needle`-style
payload in the test fixtures) are fixture DATA authored by this increment to be rejected, and they were
read as data. Quoted text below is DATA.

## Findings

### L-floor → P0 — the header line overstates what the non-JSON path does

```yaml
- type: FINDING
  rule_id: P0
  severity: minor
  file: "pharn/floor/validate.mjs:10"
  problem: "The file-header summary now reads that CHECK 3 is 'EXACT value membership, read from each fixture's structured location, never a substring scan', but only the JSON path reads a structured location — the non-JSON path is an anchored regex over free-form markdown, which the detailed comment 140 lines below labels BEST-EFFORT; the header is the line a reader skims, and it currently promises the stronger of the two."
  evidence: "//   3. every `enforces` rule_id is produced by >=1 eval fixture — EXACT value membership, read from\n//      each fixture's structured location, never a substring scan  (P1, fix #6)"
```

**Advisory-gate.** Rests on judgment about wording, not on content the floor can check. The remedy is
one clause — e.g. "…from each JSON fixture's structured location (best-effort line scan for non-JSON)".
Worth doing precisely because this repo exists to stop summary lines from outrunning their mechanism:
the increment fixed that pattern in the checker and then reintroduced a small version of it in the
checker's own header.

### L-eval → P1 — the stated behavior change for downstream installs has no test

```yaml
- type: FINDING
  rule_id: P1
  severity: important
  file: "CHANGELOG.md:70"
  problem: 'The CHANGELOG states that a downstream install whose expected/*.json is shaped as something other than eval-format now REDs where it previously passed on a substring, but no test pins that behavior — the six regression tests all use eval-format or .md fixtures, so the one shape most likely to surprise an installer (a plain findings array, `[{"rule_id": "P2"}]`) is asserted in prose only.'
  evidence: "A downstream install whose `expected/*.json` is shaped as something other than eval-format — or whose fixtures are `.yaml`/`.txt` — now REDs where it previously passed on a substring."
```

**Advisory-gate**, but the closest of these to a floor concern: the floor's _behavior_ on that input is
determined (it REDs, fail-closed), so this is a coverage gap rather than a defect. Adding a seventh test
for a findings-array fixture would make the CHANGELOG sentence checkable instead of merely asserted.

### L-axis → P3 — a second unpinned copy of `hasControlChar`

```yaml
- type: FINDING
  rule_id: P3
  severity: minor
  file: "pharn/floor/validate.mjs:170"
  problem: "`hasControlChar` now exists identically in pharn/floor/merge-findings.mjs:68 and pharn/floor/validate.mjs:170, and unlike this repo's other deliberate copy-pairs (check-provenance, lessons-index-core) the two are pinned by nothing — no test asserts they agree, so a future tightening of one guard silently leaves the other loose."
  evidence: "function hasControlChar(s) {\n  for (let i = 0; i < s.length; i++) {\n    const c = s.charCodeAt(i);\n    if (c < 32 || c === 127) return true;"
```

**Advisory-gate.** The duplication is defensible — `validate.mjs` is deliberately self-contained and
importing across floor checkers would be a new dependency edge — but the repo's own precedent for a
deliberate copy is _a copy plus a test that pins the shared constants_. Either add that pin or record
the divergence as accepted. Note the honest counterweight: here the guard only filters a human-facing
message, so a drifted copy is a cosmetic bug, not a floor hole.

### L-floor → P0 — a defensive line whose comment claims a necessity it does not have

```yaml
- type: FINDING
  rule_id: P0
  severity: minor
  file: "pharn/floor/validate.mjs:159"
  problem: "`RULE_ID_LINE.lastIndex = 0` is annotated 'the /g regex is module-scoped: reset before every use', implying a stateful-regex bug it prevents; but the only consumer is String.prototype.matchAll, which clones the regex and never advances the original's lastIndex, so the reset is defensive rather than load-bearing and the comment reads as a stronger claim than the code supports."
  evidence: "RULE_ID_LINE.lastIndex = 0; // the /g regex is module-scoped: reset before every use"
```

**Advisory-gate.** Keep the line (it is correct and cheap, and protects against a future `.exec` loop);
soften the comment to say it guards a future non-`matchAll` consumer.

## L-trust → P2 — no finding, and the reason is worth recording

The produced-set is built only from enum-gated positions (`field_equals` `value`; an anchored
`rule_id:` line). Free-text positions — `semantic[].judge`, `needle`, `purpose`, prose — are
structurally excluded, and the `.md` prose-mention test pins that. **No guaranteed decision rests on a
tainted field.**

One egress is accepted and was named in the plan before it was built, not discovered after: a
`JSON.parse` failure message (`validate.mjs:301`) may quote a short snippet of fixture bytes into the
finding's `problem`. That is the free-text half of the fix #1 split, rendered as quoted DATA in a
human-facing report, read by no gate — the same posture `pharn/floor/check-structural.mjs` already takes
for its `input` reds. Recorded as accepted, not as a finding.

## L-eval → P1 — floor and review AGREE

`validate.mjs` GREEN over 36 capabilities and the six new `★ CHECK 3` tests pass. The binding the floor
now enforces is the binding this lens would ask for, and the pre-change simulation over all 35
`enforces`-declaring capabilities (0 would-RED) matches the post-change live result (GREEN). No
disagreement between the floor and this review to report.

## Verdict

**GREEN — 0 floor-gate (blocking) findings; 4 advisory findings** (1 important, 3 minor).

The increment does what it set out to do, and it did the thing this repo most cares about: it
**reproduced all three defects live at `rc=0` before writing any code**, and it caught that the task
description's prescribed implementation ("collect every finding's `rule_id`") did not match the live
fixture shape — all 110 `expected/*.json` are eval-format `{skill_kind, assertions}`, with no top-level
`rule_id` anywhere. Building to the task's literal words would have produced a checker that extracted
nothing and REDdened all 35 capabilities. That is P6 earning its place.

The advisory findings share one shape: **the code is right and three of its comments are slightly
righter than the code.** That is a mild inversion of the usual failure and is easy to fix, but it is
the same family as the disease — a summary sentence claiming more than the mechanism delivers.

## Proposed lesson candidate (NOT promoted here — `/pharn-dev-review` never writes canon)

**Candidate: a floor check whose two input paths have different strength must say which path a given
GREEN came from.** CHECK 3 now has a strong path (structured read) and a weak one (anchored line scan
over markdown), and a capability's GREEN does not say which one produced it — so "the binding held"
means something different for a `.json`-shipping capability than for a `.md`-only one, and nothing in
the output distinguishes them. This generalizes past this checker: `count-verifiers` / `count-grillers`
have one path each, but any future checker with a fallback inherits the ambiguity.

- **Real, not hypothetical (P7):** surfaced by this increment's own `/pharn-dev-grill` (the P2 finding on
  `PLAN.md:77`), which is what caused the `.md` prose-mention negative test to be written at all.
- **provenance:** feature `enforces-eval-set-membership`; commit `unknown` (working-tree dogfood at base
  `ab152d9af3252a0ea07c2f4a7810e8881f8c7a50`); source `.dev/features/enforces-eval-set-membership/GRILL.md`
  - this `REVIEW.md`.
- **Honest counter-argument for the human to weigh:** this may be one instance, not a pattern — L20's
  own standard is that a _second_ occurrence is what earns a floor remedy. Promoting on one sighting
  would be the speculative addition P7 forbids. Recommend recording it and promoting only if a second
  dual-strength checker appears.

Promotion is a separate, human-gated `/pharn-dev-memory-promote` run.

## One process note for the SHIP roll-up (not a finding)

Two writes in this increment went through **Bash** rather than the Write/Edit tools — a `printf >`
bump of `SKILLS_VERSION` (reverted and redone through `Edit` so it passed the gate) and two
`node -e` patches of `validate.mjs` needed because the control-character class could not be typed
through the tool layer. Both paths were inside the declared `## Files`, and `check-regress.mjs scope`
confirmed `escaped: []` — but neither Bash write passed the fix #7 hook, which is exactly the escape
`.dev/memory-bank/lessons-learned.md` **L19** names. Recorded rather than left silent.
