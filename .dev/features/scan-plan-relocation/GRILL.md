# GRILL — scan-plan-relocation (F2)

Plan under interrogation: `.dev/features/scan-plan-relocation/PLAN.md` (`trust: untrusted` to this
stage). **Spec-hash check: MATCH** — recomputed `sha256(pharn/ARCHITECTURE.md)` =
`a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753`, equal to the plan's pinned
`spec_content_hash`; no drift. (The computation is floor-grade; here it only surfaces — the block on
drift is `/pharn-dev-build`'s gate, fix #4.)

Griller membership read deterministically (FLOOR): `node pharn/floor/count-grillers.mjs .` →
**13 registered**. Their Layer-1 scanners were run over this PLAN as a dogfood of the very defect
this increment repairs (results in the summary).

---

## Findings

### Axis: discovery accuracy (P6)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/scan-plan-relocation/PLAN.md:56"
  problem: "The authorized-scope line states the cite rewrite spans 20 files, but the live measurement over the canon is 24 files; the cite count (44) is correct, so only the file count is wrong."
  evidence: "`pharn/pharn-pipeline/grillers/**/*.md`, `**/*.json` — 44 existence-gated cite rewrites across 20 files, no content change — pharn-pipeline"
```

### Axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/scan-plan-relocation/PLAN.md:28"
  problem: "The plan cites L16 for using a Node script over sed, but does not carry L16's second corollary — the post-move RED must be checked against a PREDICTED number, since recording a count is not investigating it, and an anomalous count reads as normal when nothing was expected."
  evidence: "Corollary applied: the post-move RED is to be **investigated against the expected count**, never merely recorded."

- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/scan-plan-relocation/PLAN.md:100"
  problem: "The pharn/floor cross-ref fix is correctly labeled advisory with its blind spot named, but the plan prescribes no concrete repeatable command for the hand-verification, leaving an advisory check with no stated method."
  evidence: '"The `pharn/floor` cross-refs were fixed" → **advisory.** CHECK 8''s scope excludes `pharn/floor`'

- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/scan-plan-relocation/PLAN.md:103"
  problem: "The plan narrows the headline Layer-1 claim honestly but commits to no POSITIVE check that a relocated scanner actually executes from its new path, so the increment's whole point is asserted rather than demonstrated."
  evidence: '"The grillers'' Layer-1 sub-check now works" → **NARROWED, and stated.**'
```

### Axis: determinism and writes-scope (P5, fix #7)

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/scan-plan-relocation/PLAN.md:56"
  problem: "The glob entry in ## Files is silently dropped by set-writes-scope.cjs, which emits literal paths only, so the build's scope resolves to 16 paths from 17 bullets and pharn/pharn-pipeline is absent; because a set scope REPLACES the default safe-set, any Edit-tool write to a griller file during build is denied."
  evidence: "`pharn/pharn-pipeline/grillers/**/*.md`, `**/*.json` — 44 existence-gated cite rewrites"
```

### Axis: eval coverage (P1)

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/scan-plan-relocation/PLAN.md:85"
  problem: "Three of the 44 cites name .test.mjs files rather than scanners, and they become CHECK-8-visible only because the tests move alongside the scanners; the plan does not state this dependency between the two halves of the move."
  evidence: "No new capability, no new `rule_id`, so P1 adds nothing."
```

---

## Summary (prose)

The plan is well-grounded — every count in it was re-derived live rather than copied from the build
request, and it corrects that request in three places (44 cites not "~44"; 2 twin refs in
`scan-code-secrets.mjs` not 4; 253-vs-126 trail refs not "~102 vs ~8"). Its guarantee audit is the
strongest part: it labels the `pharn/floor` cross-ref fix advisory and names the blind spot explicitly
rather than implying CHECK 8 covers it, and it narrows the headline claim to "the scanner ships",
never "the sub-check fired". The trust audit correctly concludes the move opens no new surface.

Six concerns, none of them a reason not to build:

The sharpest is the **predicted-count gap** (F2). The plan invokes L16 for the right reason — a Node
script over `sed -i` — but stops short of L16's harder half, which is that a red baseline must be
measured against an expectation. Derived deterministically this run: the post-move floor should emit
**29 findings across 24 files**, because CHECK 8 records one finding per stale checker **per file**,
not one per occurrence (`pharn/floor/validate.mjs`: `const seen = new Set()`). Without that number in
hand, "record the count" cannot distinguish a complete move from a partial one.

Next is the **writes-scope drop** (F3). Running the setter against this plan resolves **16 paths from
17 bullets**; the missing entry is the glob, which the setter refuses by design. The resolved set is
otherwise exactly right — no over-grant, no trusted doc, which is the L18/L20 check passing. But the
consequence is unstated: `pharn/pharn-pipeline` will not be Edit-writable at build time, so the cite
rewrite genuinely must go through Bash, and any hand-fix to a griller file would be denied.

F1 is a plain factual slip — 20 files stated, 24 measured — in the line that describes the authorized
scope. F4 and F6 are the mirror of each other: the plan is admirably honest that the `pharn/floor`
cross-refs and the Layer-1 behavior are outside the floor, but honesty about a gap is not the same as
a method for checking it, and both deserve a concrete command. F5 notes that the `.test.mjs` cites
only resolve because the tests move too.

**Dogfood note.** The five Layer-1 scanners were run over this PLAN from their current `.dev/floor/`
location: `secrets`, `pii` and `i18n` report `{"found":false,"hits":[]}`; `migrations` and
`observability` report `mentions: true` on lines 46-47 and 51-52 — matches on the scanners' own
filenames in the prose, not on any schema change. That is the expected behavior of a fixed-vocabulary
presence check and is exactly why its verdict is Layer-1 evidence rather than a judgment.

**Observation, not a finding against the plan (P6).** `.claude/commands/pharn-dev-grill.md` states
"Today the registered set is the `testability` griller"; the live membership count is **13**. The
command's own prose has drifted from the repo — the same class of staleness this increment exists to
repair, on a surface neither CHECK 8 nor `validate.mjs` scans (`.claude/` is excluded). Raised for a
human; out of scope for F2's single axis.

---

**ADVISORY VERDICT: 6 concerns raised (0 blocking-severity, 3 important, 3 minor) — for the human to
weigh before `/pharn-dev-build`.**

This grill-log gates nothing. Every finding above rests on model judgment; the only floor-grade facts
in this run are the spec-hash comparison, the griller membership count, and the predicted RED figure,
each of which is a deterministic computation stated as such. Nothing here means the plan is sound —
that remains the human's call.
