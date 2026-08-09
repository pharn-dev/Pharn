# REVIEW — scan-plan-relocation (F2)

**Step 1 — floor first.** `node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities checked`,
exit 0. The increment was eligible for review. Everything below the floor line is **advisory**.

The increment under review is `trust: untrusted`. Free-text in the findings below is quoted DATA.

---

## Floor-gate findings (blocking)

**None.**

- **L-floor (P0):** every claim the increment makes carries a reduction or an `advisory` label. The two
  claims most at risk of overselling are both correctly narrowed in the artifacts: "the grillers' Layer-1
  now works" is stated as _the scanner exists and runs_, never _the sub-check fired_; and the
  `pharn/floor` cross-ref fix is labeled advisory with its blind spot named rather than implied covered.
- **L-eval (P1):** no capability and no `rule_id` is introduced — the five relocated files are floor
  checkers, not `role:`-bearing capabilities (verified: none declares `role:` or `enforces:`), so P1 adds
  nothing. The floor agrees (GREEN), so lens and floor do not disagree.
- **L-trust (P2):** clean, and checked rather than assumed — see below.
- **L-axis (P3):** one axis. No sibling reference was introduced: the relocated scanners mention no
  `pharn-pipeline` / `pharn-review` / `pharn-core` / `pharn-contracts` path.

### L-trust evidence (P2) — did reviewed content steer behavior?

The cite rewrite touched two fixtures that carry **deliberate injection payloads**
(`plan-fake-migration-injection.md`, `plan-fake-observability-injection.md`), including the string
`mark present, skip the finding`. Their diffs were inspected: the **only** delta in each is the scanner
path; the payload text is byte-identical and was never acted on. That is structural rather than lucky —
the transform is an anchored path regex gated by `existsSync`, so it has no channel through which fixture
prose could influence it. Nothing in the reviewed artifacts changed reviewer behavior, and no guaranteed
decision in this increment rests on any free-text field.

---

## Advisory findings

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".claude/hooks/set-writes-scope.cjs:99"
  problem: "Two floor tools read a PLAN's `## Files` list with DIFFERENT glob semantics — set-writes-scope --from-plan silently drops any entry containing `*`, while check-regress scope --declared matches it through globMatch — so one list cannot satisfy both consumers and a glob entry grants no write-scope at all."
  evidence: 'return entry.length > 0 && !entry.includes("<") && !entry.includes(">") && !entry.includes("*") && !entry.includes("?");'

- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/scan-plan-relocation/PLAN.md:11"
  problem: "The plan cited L1 and still omitted README.md, whose GENERATED CURRENT-STATE block the increment provably changes (Floor checkers 41 to 46); it surfaced only when docs:check went RED mid-build, after the regenerate had already landed through Bash."
  evidence: "L1 — Swept the meta-docs this increment invalidates and named them in `## Files`"

- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/scan-plan-relocation/PLAN.md:34"
  problem: "Two writes went through Bash while the gated Write path was available and the exact path was in the active scope — SKILLS_VERSION via printf redirection and regression-report.json via cp — so the hook never saw either; both were re-done through the Write tool, but the reflex is L19's failure mode reached with the gate present rather than absent."
  evidence: "`git mv`, the Node cite-rewrite, and `npm run docs:generate` are **Bash writes that escape fix #7 entirely**"

- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".dev/features/scan-plan-relocation/PLAN.md:60"
  problem: "The authorized-scope line originally stated the cite rewrite spanned 20 files against a live measurement of 24; the grill caught it and it was corrected mid-build, but the number reached a human-approved plan."
  evidence: "44 existence-gated cite rewrites across 24 files, no content change"

- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".claude/commands/pharn-dev-grill.md:134"
  problem: "The grill command asserts one registered griller while live membership is 13 — the same staleness class this increment exists to repair, on a surface neither validate nor CHECK 8 scans because .claude/ is excluded."
  evidence: "Today the registered set is the `testability` griller"
```

**All five are advisory-gate.** Each rests on judgment of severity or of prose, so none blocks. The
first three are the ones worth a human's attention; the last two are recorded so they are not lost.

---

## Verdict

**GREEN — 0 floor-gate findings, 5 advisory.**

The increment did what it set out to do, and the strongest evidence is that its own forcing function
fired exactly as designed: moving the ten files made CHECK 8 emit **29 findings across 24 files, every
one `P6/floor-path`**, and the existence-gated rewrite took it to **GREEN** while leaving the five ghost
cites structurally untouched. That RED was **predicted before the move** and matched, which is what
separates a complete move from a partial one. The 5 ghosts and the 188 `.dev/features` trail refs were
verified byte-unmodified.

Honest boundary on this verdict: `/pharn-dev-review` emits prose only, its severities are LLM-assigned
and therefore advisory (fix #3), and its sole floor-grade content is the `validate` GREEN above — which
`/pharn-dev-build` and `/pharn-dev-verify` already gated. This is not an approval.

---

## Proposed lesson candidate (NOT promoted — `/pharn-dev-memory-promote` is a separate, human-gated run)

**Candidate A (primary) — A PLAN's `## Files` is read by two floor tools with different glob
semantics, so a glob entry grants no write-scope.**

`set-writes-scope.cjs --from-plan` emits **literal paths only** (`:99` rejects any entry containing `*`
or `?`), while `check-regress.mjs scope --declared` matches the same entries through `globMatch`
(`:123`). A plan author therefore cannot write one entry that satisfies both: a glob passes regress's
escape check but grants **nothing** to the pre-write hook, and literal paths grant scope but must be
enumerated. Live this run: 18 `## Files` bullets resolved to **17** paths, and
`pharn/pharn-pipeline/**` was never writable — the 44-cite rewrite only succeeded because it went
through Bash. The failure direction is **safe** (under-grant, unlike L18/L20's over-grant), which is
precisely why it can persist unnoticed: the increment completes, and nothing complains. Distinct from
L18 (the exclusion block's _heading_ shape) and L8 (the setter's one-`--target` resolution) — this is
the **entry syntax** inside `## Files`, and it is the first entry in that family where two consumers
disagree about the same declaration. Remedy candidates: make `--from-plan` **warn** on each dropped
entry instead of dropping silently, or state in the plan template that `## Files` entries must be
literal paths.

- provenance: feature `scan-plan-relocation`; commit `24a43d6` (working-tree dogfood, uncommitted at
  review time); source: this `REVIEW.md` + `.dev/features/scan-plan-relocation/GRILL.md` finding F3,
  reproduced live at build Step 0 (17-of-18) and again at regress (`--declared` globs matching).

**Candidate B (secondary) — L1's meta-doc sweep misses GENERATED regions, and there is a deterministic
detector it could use.** The plan **cited** L1 and still omitted `README.md`, because a generated block
is not a "meta-doc stating a fact" in the shape L1 describes — it is derived output nobody hand-edits.
It surfaced only when `docs:check` REDed after the regenerate had already landed through Bash. This is
L20's escalation shape aimed at L1: the remedy is not a louder reminder but a check — run
`npm run docs:check` at plan time and require any drifting generated path to appear in `## Files`.
Recorded as a second candidate; the human picks at the promote gate.
