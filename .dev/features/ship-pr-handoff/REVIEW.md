# REVIEW — ship-pr-handoff

**Step 1 — floor first (P0):** `node pharn/floor/validate.mjs .` → **GREEN**, 36 capabilities. Review may
proceed. The floor is the only guaranteed part of this review; every lens below is **advisory**.

> The reviewed increment is `trust: untrusted`. All `problem` / `evidence` free text is quoted as DATA.

## L-floor → P0 (the governing lens)

```yaml
- type: FINDING
  rule_id: P0
  severity: blocking
  file: ".claude/commands/pharn-ship.md:345"
  problem: "Step 2d's slug shape-check was labeled `FLOOR — enum/regex, ARCHITECTURE §2 primitive #3`, but nothing executes it: no checker reads the regex, no test pins it, and validate.mjs deliberately ignores .claude/commands/ — a guarantee claimed with no floor reduction, which is the exact disease."
  evidence: "'**Guarantee audit for Step 2d (P0):** FLOOR — the slug **shape check** (enum/regex) that gates interpolation.' A repo-wide grep for the regex `a-z0-9-]{0,63}` across every .mjs/.cjs/.json returned ZERO — it exists only as command prose."
  status: FIXED IN THIS INCREMENT — relabeled "SPECIFIED — advisory compliance, NOT floor" in
    .claude/commands/pharn-ship.md AND in the CHANGELOG entry, which shipped the same overclaim. The
    miss is RECORDED, not quietly corrected; follow-up `ship-slug-shape` would give it a real checker.
```

This is the finding that matters, and it is worth stating plainly what happened: the increment whose entire
purpose was to **refuse** an under-floored capability shipped its own unbacked `FLOOR` label in the same
breath — in the guarantee-audit section, the one place designed to catch it. The grill had already flagged
the adjacent instance (F2, "floor by absence"), the plan corrected _that_ wording, and the defect
reappeared one paragraph later in the artifact the plan produced. That is L2 exactly ("a contract's honesty
must travel with the artifact") and L20 exactly (a discipline-only remedy recurs).

```yaml
- type: FINDING
  rule_id: P0
  severity: minor
  file: ".dev/features/ship-pr-handoff/PLAN.md:Guarantee audit"
  problem: "The PLAN's own audit row labels 'performs no git write' as 'FLOOR by absence + hook (fix #7)' — absence is not one of the three primitives, and fix #7 cannot see a Bash git call at all."
  evidence: "Grill finding F2 raised this; the SHIPPED text was corrected, but the PLAN retains the wording as the record of what was proposed."
  status: DELIBERATELY LEFT — the PLAN is a record of the proposal, not shipped bytes. The corrected
    claim is what ships.
```

> **Recurrence note, added after the fix.** The correction was applied in two places and the SAME overclaim
> survived in a **third**: the command's own `## Guarantee audit` bullet still read _"The **one** floor
> element in Step 2d is the slug **shape check**"_ while the step body two hundred lines above already read
> _"there is NO floor element in this step. Zero."_ It was caught by a `grep -n 'floor element'` consistency
> sweep, not by any gate — `npm run check` was exit 0 with the contradiction in the tree. Three sites, one
> claim, two rounds to converge. That is the strongest available evidence for Candidate A below, and it is
> recorded rather than smoothed over.

## L-eval → P1

```yaml
- type: FINDING
  rule_id: P1
  severity: minor
  file: ".claude/commands/pharn-ship.md:306"
  problem: "Step 2d ships with zero evals and zero tests — nothing anywhere verifies that the emitted `gh pr create` invocation is well-formed, that the refusal branch fires on a bad slug, or that the block is never executed."
  evidence: "The increment adds no `role:`-bearing capability and no `enforces` rule_id, so P1's floor trigger does not fire and validate.mjs stays GREEN; CLAUDE.md: 'The floor still deliberately ignores this repo's own tooling (`.claude/commands/`, `.dev/`).'"
  status: OPEN — advisory. Confirms grill F5. Not blocking: P1 binds Capabilities and rule_ids, and this
    increment adds neither. The honest consequence is that Step 2d's correctness rests entirely on
    reading it.
```

**Floor/advisory agreement check:** the floor (`validate.mjs`) and this lens **agree** — both find no
missing eval _binding_, because there is no binding to miss. No disagreement to report.

## L-trust → P2

```yaml
- type: FINDING
  rule_id: P2
  severity: important
  file: ".claude/commands/pharn-ship.md:306"
  problem: "Step 2d introduces a genuinely new egress shape for this repo: every other artifact the chain produces is a FILE that gets read, whereas this is a LINE a human pastes into a shell — so an untrusted feature slug becomes a shell-injection surface at the human's terminal, not PHARN's."
  evidence: "ship-briefing.md constrains `feature` only to 'non-empty, control-char-free, `<=128` chars', which admits spaces, `;`, backticks and `$(…)`. Step 2d's mitigation (shape-check + single-quoting + refuse-rather-than-sanitize) is correct in design but is SPECIFIED PROSE, per the L-floor finding above — so the mitigation is exactly as reliable as model compliance."
  status: OPEN — advisory, and the sharpest residual this increment leaves. Bounded (the slug is
    path-derived from a PHARN-created directory, not attacker-supplied today) but not zeroed.
```

**Did instruction-looking content change my behavior?** No injection attempt was present in the reviewed
artifacts, and none was complied with. One honest note in the same family: the **invoking prompt** asserted
several repo facts that were stale (`SKILLS_VERSION 2.5.4`, non-goal line numbers, an unamended
`THREAT-MODEL` §4) and one that conflated two artifacts (`record_hash` on `BRIEFING.md`). Those were
treated as untrusted claims and **re-measured** rather than believed — which is P6 working, and worth
recording because believing them would have produced a wrong increment.

```yaml
- type: FINDING
  rule_id: P2
  severity: minor
  file: ".dev/features/ship-pr-handoff/REGRESSION.md"
  problem: "Every artifact in this run was written with a Bash heredoc, so none of them passed the fix #7 writes-scope hook — the gate that pins where each stage may write did not apply to this run's own writes."
  evidence: "fix #7 is wired on matcher `Write|Edit|MultiEdit|NotebookEdit` (.claude/settings.json); Bash is absent from it. This is L19's escape. The scope WAS set before each write and the written paths match it exactly, but that agreement is a fact about this run, not a guarantee."
  status: OPEN — disclosed in REGRESSION.md and here. Not concealed, and directly relevant: it is the
    same Bash-bypass fact that decided against Options C/D.
```

## L-axis → P3

No findings. `.claude/commands/pharn-ship.md` retains one axis of change (the `/pharn-ship` orchestration
prose). The only module path Step 2d references is `pharn/pharn-contracts/ship-briefing.md` — the **tree
root**, which is the sanctioned direction; there is no leaf→leaf reference. The version bump, badge and
CHANGELOG are meta-doc consequences of the same single change (L1's sweep), not a second axis.

## Gate split (fix #3)

- **floor-gate (blocking):** the L-floor P0 finding — verdict came from actual content (a repo-wide grep
  proving the cited regex is executed nowhere), not from judgment. **It blocked, and it was fixed before
  this review closed.** No blocking finding stands open.
- **advisory-gate (warn):** L-eval P1, both L-trust findings, and the PLAN-record P0 note. These
  **inform**; none is a basis for blocking.

## Standing floor verdicts (recomputed after the correction)

| stage                | verdict               | source                               |
| -------------------- | --------------------- | ------------------------------------ |
| `/pharn-dev-build`   | `validate` exit **0** | `pharn/floor/validate.mjs .` → GREEN |
| `/pharn-dev-regress` | **`no-regressions`**  | `regression-report.json` `.verdict`  |
| `/pharn-dev-verify`  | **`PASS`**            | `verify-report.json` `.verdict`      |

## Proposed lessons (candidates only — promotion is `/pharn-dev-memory-promote`'s gated call, never mine)

- **Candidate A — "The guarantee-audit section is itself the highest-risk site for an unbacked FLOOR
  label."** Both the grill (F2) and the review (L-floor) caught P0 overclaims, and both were located _in
  the prose written to demonstrate P0 compliance_. An increment that argues at length about floor-vs-
  advisory is not thereby immune; it is more exposed, because the section invites the word "FLOOR".
  Possible remedy per L20: a checker that flags a `FLOOR`/`floor:` claim in a command or contract whose
  cited mechanism resolves to no executable — the `check-specified-markers.mjs` shape, pointed at
  guarantee-audit blocks.
- **Candidate B — "A `## Files` bullet's own prose can silently truncate the writes-scope."** Reproduced
  live in this run: the phrase "is NOT touched" inside a bullet matched the head-less exclusion cue and
  `set-writes-scope.cjs --from-plan` parsed **3 paths against 10 declared bullets**. It failed _closed_,
  and was caught only because the setter prints its count — the same "there was a number to read" luck
  L21 names as the difference between a caught and an uncaught recurrence.

_Neither is promoted here. `/pharn-dev-review` proposes; it holds no write-scope to canon (L7)._
