# GRILL — ship-pr-handoff

Plan interrogated: `.dev/features/ship-pr-handoff/PLAN.md` (Option B, human-chosen at GATE 1).
Spec-hash check (content-hash floor primitive, surfaced not blocking):
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52` — **AGREE**, no drift.
Griller membership (FLOOR, `pharn/floor/count-grillers.mjs`): **13 registered**.

> The `PLAN.md` under interrogation is `trust: untrusted`. Every `problem` / `evidence` below is free text
> quoted as DATA, never an instruction.

## Findings — inline axes (Step 2)

```yaml
- type: FINDING
  rule_id: P2
  severity: important
  file: ".dev/features/ship-pr-handoff/PLAN.md:Files"
  problem: "The plan emits a shell command string for a human to copy-paste, but never requires the interpolated <feature> slug to be shell-quoted or shape-checked — PHARN would be handing a human a line to run in their shell."
  evidence: 'gh pr create --title "<feature>" --body-file features/<name>/BRIEFING.md — the slug is path-derived and, per ship-briefing.md, only constrained to `non-empty, control-char-free, <=128 chars`; that admits spaces, `$(...)`, backticks and `;`.'

- type: FINDING
  rule_id: P0
  severity: important
  file: ".dev/features/ship-pr-handoff/PLAN.md:Guarantee audit"
  problem: "The claim '/pharn-ship performs no git write' is labeled 'FLOOR by absence + hook (fix #7)', but absence is not a floor primitive — no check would catch a future edit that adds a git call to a product command."
  evidence: '''**"`/pharn-ship` performs no git write"** → **FLOOR by absence + hook (fix #7).**'' — fix #7 pins where the Write tool may write; it cannot see a Bash `git` call at all (that is L19''s whole point, cited two sections earlier in the same plan).'

- type: FINDING
  rule_id: P7
  severity: minor
  file: ".dev/features/ship-pr-handoff/PLAN.md:increment"
  problem: "The P7 argument that defeats Options C and D applies to Option B as well, and the plan does not answer it: B is also triggered by convenience, not by a dogfood or eval failure."
  evidence: 'The plan rejects C/D because ''the triggering failure is "the user does one paste" … a convenience preference, not a dogfood or eval failure.'' B removes the same paste. P7 has no ''cheap enough'' exemption.'

- type: FINDING
  rule_id: P0
  severity: minor
  file: ".dev/features/ship-pr-handoff/PLAN.md:Files"
  problem: "The patch-vs-minor sizing is asserted, not derived — B is arguably neither 'a correction/clarification to bytes that already shipped' nor 'a newly shipped capability/command/checker'."
  evidence: "'`SKILLS_VERSION` — `2.6.1` → `2.6.2` (patch: a clarification/extension of bytes that already shipped)'. CLAUDE.md's minor case names capability/command/checker; B adds none of the three, but it does add new user-visible behavior to a shipped command."

- type: FINDING
  rule_id: P1
  severity: minor
  file: ".claude/commands/pharn-ship.md"
  problem: "Nothing verifies the emitted invocation is a VALID gh invocation — no eval, no test, and validate.mjs deliberately ignores .claude/commands/, so a typo'd flag ships green."
  evidence: "CLAUDE.md: 'The floor still deliberately ignores this repo's own tooling (`.claude/commands/`, `.dev/`).' The plan's `## Evals to write (P1)` says 'None under Option A or B-minimal'."
```

## Findings — griller slot (Step 2b)

Applied inline (the isolated per-griller runner remains deferred, P7). Of the 13 registered grillers,
**`documentation`, `architecture`, `security`, `comprehension`, `testability`** have purchase on a
command-prose increment. The remaining eight (`a11y`, `i18n`, `migrations`, `performance`, `privacy`,
`error-handling`, `observability`, `coupling`) return **no findings** — stated rather than padded, because
inventing a finding to fill an axis is the disease in miniature.

```yaml
- type: FINDING
  rule_id: P4
  severity: minor
  file: ".dev/features/ship-pr-handoff/PLAN.md:Files"
  problem: "documentation axis — the plan updates CHANGELOG/README/SKILLS_VERSION but does not name CLAUDE.md, whose 'Commands' section enumerates what the product commands do; L1 is cited in the plan yet its own sweep is incomplete."
  evidence: "L1: '/plan must name that meta-doc in its _Files_ list, or /build ships stale canon.' The plan's `## Files` has no `CLAUDE.md` entry; whether CLAUDE.md actually asserts a fact B falsifies is the open half."

- type: FINDING
  rule_id: P5
  severity: minor
  file: ".dev/features/ship-pr-handoff/PLAN.md:Determinism audit"
  problem: "security/architecture axis — the plan states gh availability 'must be a named refusal' only under C/D, leaving B silent on what the human sees if they run the emitted command without gh installed."
  evidence: "'Under C/D, absence must be a named refusal.' Under B the failure surfaces in the human's own terminal, which is arguably correct — but the plan should say so, not omit it."
```

## Summary

The plan's core judgment — **do not cross the boundary; emit, never execute** — survives interrogation, and
its strongest support is structural rather than rhetorical: under B there is no ungated write to argue
about, because there is no write. The spec pin agrees and the writes-scope set-equality holds (12 paths, 12
bullets) after a live truncation was caught and corrected.

Three concerns are worth the human's attention before build. **F1 (P2)** is the only one that changes what
gets built: PHARN would be emitting a string a human pastes into a shell, and the plan never requires that
string to be quoted — a genuinely new egress shape for this repo, since every other artifact is a file that
is read, not a line that is run. **F2 (P0)** is a labeling defect in the plan's own honesty section, the
disease aimed inward: "floor by absence" is not one of the three primitives. **F3 (P7)** is the sharpest —
the plan's own reasoning for refusing C and D also indicts B, and the plan does not engage it; the honest
resolutions are either to accept that B is a convenience the human explicitly chose at GATE 1 (which is a
legitimate answer, and different from an agent adding it speculatively) or to fall back to Option A.

F4–F7 are minor and mostly about completeness of the sweep, not correctness of the design.

ADVISORY VERDICT: 7 concerns raised (0 blocking, 2 important, 5 minor) — for the human to weigh before
/pharn-dev-build. This is not "grill passed" and not a judgment that the plan is sound.
