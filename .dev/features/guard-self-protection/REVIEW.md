# REVIEW — guard-self-protection

PHARN reviewing PHARN. The increment under review is treated as **`trust: untrusted`** even though a
trusted stage produced it.

## Step 1 — Floor first (the only guaranteed part of this review)

`node pharn/floor/validate.mjs .` → **FLOOR: GREEN — 36 capabilities checked.** Standing verdicts from the
chain: `/pharn-dev-regress` → `"no-regressions"` (exit 0); `/pharn-dev-verify` → `"PASS"`, `failing_gates: []`
(exit 0); `check-build-complete` → `"complete"` (9/9 declared files present). Everything below is
**advisory**.

---

## L-floor → P0 (the governing lens)

### F1 — the "identical sets" claim has no floor reduction and no advisory label

```yaml
- type: FINDING
  rule_id: "P0"
  severity: blocking
  file: ".claude/hooks/protect-trusted-paths.cjs:82"
  problem: "Both guards' correctness rests on their four-path lists being the same set, and the code says so in prose ('Kept identical to CONTROL_SURFACE in set-writes-scope.cjs'), but nothing enforces it — the lists are three hand-maintained copies (DEFAULT_PROTECTED's .claude/ entries at protect-trusted-paths.cjs:75, CONTROL_SURFACE at set-writes-scope.cjs:76, and a third at set-writes-scope.test.cjs:190) with no test cross-checking any pair, so a future edit to one silently desynchronizes the guards."
  evidence: "// basenames. Kept identical to CONTROL_SURFACE in set-writes-scope.cjs."
```

**Why this is the disease, by this repo's own standard.** `CLAUDE.md:130-131` records that
`pharn/floor/check-provenance.mjs` is "a DELIBERATE second copy … the two are pinned to agree on every
shared constant by ✧ tests", and `CLAUDE.md:370` records the same discipline for the two
`lessons-index-core.mjs` copies ("every shared constant must AGREE and those four must DIFFER"). This
increment reproduces the deliberate-copy pattern **without** its mandatory pin. "Kept identical" is a
comment, and a comment is not a floor primitive — that is precisely "written in the contract" read as
"therefore guaranteed."

**Concrete failure mode it permits.** Add a fifth control file (or rename one) in
`protect-trusted-paths.cjs` only: the hook denies the write, the setter still happily emits a scope
naming it, and the loud-early-failure the setter exists to provide silently stops covering that path —
with every gate GREEN.

**Remedy (small, and inside the already-approved edit set).** One test in each `*.test.cjs` that reads
the sibling file and asserts set-equality of the four paths — the `check-provenance.test.mjs` /
`lessons-index-core.test.mjs` shape. Both test files are declared in the plan's `## Files`, so this needs
no scope change. **Not applied at review time:** `/pharn-dev-review` is advisory and does not edit the
increment it reviews; it was the human's call at the post-review gate.

> **RESOLVED at the post-review gate (human instructed the fix).** Four ✧ tests were added, all deriving
> their inputs from source and restating no side as a literal: (1) setter `CONTROL_SURFACE` == the hook's
> `.claude/` `DEFAULT_PROTECTED` entries; (2) this test file's own literal == the setter's (the third
> copy); (3) the set names exactly the wiring file plus the three hook scripts — no command, no
> `*.test.cjs` — which pins the GATE-1 decision itself; and (4) hook-side, every `.claude/` entry read
> from `DEFAULT_PROTECTED`'s source is actually denied, so a future fifth entry cannot ship untested.
> **Measured rejecting three mutants before being trusted** (L4): a fifth path in one copy only → 1
> failure; an entry removed from the other → 7; a command path smuggled in → 4; green when reverted.
> **Narrowed and stated:** the guard pins that the declared **sets** are equal, **not** that the two
> guards behave identically on them — the hook matches path fragments, the setter does exact membership
> over a normalized entry. Declarations, not logic. Tests 59 → 63.

### F2 — struck claims are labeled correctly (no finding)

Recorded because the lens must check it, not to pad: every non-reducible claim carries its strike — the
Bash-tool bypass, the setter's lexical (non-realpath) test, the deliberately-unguarded
`.claude/commands/**` and `*.test.cjs`, and F4. Each appears in **both** file headers, `CHANGELOG.md`,
`CLAUDE.md` and the PLAN's guarantee audit, not in one place only.

---

## L-eval → P1

The increment adds **no capability** — no file in the diff carries `role:`, so there is no
`enforces` → eval binding for the floor to check, and `validate` GREEN agrees. Per repo precedent the
hooks' eval-equivalent is their `*.test.cjs`: **13 → 59 tests (46 new)**, line coverage **97.53%** and
**98.91%** on the two touched checkers.

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".claude/hooks/set-writes-scope.test.cjs:190"
  problem: "The new suites cover both guards' behaviour thoroughly but assert nothing about the two guards AGREEING; the test file's own CONTROL_SURFACE is a third independent copy, so the tests would keep passing after a desynchronizing edit — the eval layer has the same blind spot as the code (this is F1 seen from P1)."
  evidence: "const CONTROL_SURFACE = [ … ];  // a local literal, never compared to either source file"
```

Everything the tests _do_ assert is sound: the deny/allow matrix, the anti-F4 negatives (a user's
`settings.json`, `.vscode/settings.json`, `src/enforce-writes-scope.cjs`), the symlink case, the
opt-in-flag argument-position hazard, the re-spelling normalization, and the L14 compose-not-replace
check that the empty-scope fail stays reachable.

---

## L-trust → P2

**No new decision reads a free-text field.** The refusal branches on parsed path strings compared to a
fixed literal set; the hook branches on path fragments. Grepping the two changed `.cjs` for
`problem` / `evidence` / free-text handling returns nothing — there is no tainted input in either
decision path. `--allow-claude-dir` is an **argv** flag, so no declared (untrusted) file can set it for
itself. **This increment strictly reduces taint exposure:** before it, an untrusted `PLAN.md`'s
`## Files` free text flowed into an _authorization_ decision; now that list is filtered by a
deterministic membership test before it can authorize a control-surface write.

**Did instruction-looking content change my behavior? Yes — and I caught it. Reporting it, per the lens.**

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".dev/features/guard-self-protection/PLAN.md:1"
  problem: "The build instruction supplied to this increment asserted two things that live discovery falsified — that change B should refuse ANY .claude/ path, and that after the fix the enforce-writes-scope step of the reproduction would return 2 — and complying with either as written would have shipped a defect (a refusal rejecting 46 of 104 historical plans) or a false verification claim; the correct behavior was to measure and halt, which is what happened, but the near-miss is the lens working and is recorded rather than omitted."
  evidence: "'(B) set-writes-scope.cjs — refuse … to emit a scope that contains any `.claude/` path' and 'The three-exit-code reproduction … now returns 2 for the enforce and protect steps'."
```

The second item is the sharper one: checklist item 8 as written is **unsatisfiable** given the same
document forbids editing `enforce-writes-scope.cjs`. A guard whose only job is scope membership must
permit a path that _is_ in the active scope. Reporting the expectation as wrong — rather than
massaging the run to appear to satisfy it — is the whole point of P0.

---

## L-axis → P3

```yaml
- type: FINDING
  rule_id: "P3"
  severity: important
  file: ".claude/hooks/set-writes-scope.cjs:76"
  problem: "set-writes-scope.cjs now has two reasons to change — the declaration format it parses, AND the membership of the protected control surface — so a future change to the protected set forces an edit to a file whose axis was previously 'parse a declaration into a scope'."
  evidence: "const CONTROL_SURFACE = [ '.claude/settings.json', … ];  // a policy set inside a parser"
```

**Weighed, not just raised.** The alternative — a shared module both hooks import — was rejected for the
documented reason the `check-provenance.mjs` split records: routing the membership set through a shared
import makes the gate's set reachable/parameterizable, and the hooks must stay standalone, stdlib-only,
zero-dependency scripts each invoked as `node <file>`. Deliberate duplication is the repo's established
answer to exactly this tension. **The duplication is therefore defensible; what is missing is the pin
that the precedent pairs it with (F1).** Treat F1 and this as one remedy, not two.

**No sibling-import violation.** Both hooks live in the same layer (`.claude/hooks/`, the floor); the
cross-references are header comments, not module imports, and cross no sibling module root.

---

## Proposed lesson candidate (for a separate `/pharn-dev-memory-promote` run — NOT written here)

**Candidate A — L3's re-audit must sweep test fixtures, not only documents.** L3 says making a
declarative field load-bearing requires re-auditing every existing declaration of it. This run performed
that audit deliberately and at scale (104 PLANs, run live) — and it still missed two declarations,
because they were `## Files` fixtures **inside** `.claude/hooks/enforce-writes-scope.test.cjs`, a corpus
"every existing PLAN" does not name. They reddened at the first full gate. The generalization: a
declaration of a load-bearing field can live in a **test fixture**, and a corpus sweep scoped to the
document type will systematically miss them. Evidence: `REGRESSION.md`, the 39/41 → 41/41 measurement,
and the second human halt this forced mid-build.

`/pharn-dev-review` declares no `.dev/memory-bank/**` path and holds no scope to canon; promotion runs
separately behind `check-provenance` + the human gate.

---

## Verdict

**ADVISORY REVIEW: 5 findings — 1 blocking-severity, 3 important, 1 minor.** The floor-gate half is
GREEN and already gated upstream (`validate`, `check-regress`, `check-verify`); **none of these findings
is a floor gate**, and `severity` here is LLM-assigned and therefore advisory (fix #3).

F1 was the one I would not merge without: this repo's own documented deliberate-copy discipline applied
to a new set of copies, minus the pin that discipline requires. **It is now resolved** (see the RESOLVED
note under F1), which also closes the L-eval finding — the same defect seen from the eval layer — and
settles the L-axis finding, whose remedy was always "pin it, don't de-duplicate it". The P2 finding
records a near-miss, not a defect in the shipped bytes, and stands as a record.

**Disposition after the post-review gate:** F1 fixed (+4 ✧ tests, mutant-measured); L-eval fixed by the
same change; L-axis accepted as designed with the pin now in place; P2 recorded, no action. Separately,
`pharn/floor/README.md` — flagged in this review's own follow-up list as product surface shipping a stale
protected-set enumeration — was corrected rather than shipped knowingly wrong under `2.3.1`.
`/pharn-dev-regress` and `/pharn-dev-verify` were both **re-run from scratch** afterwards: still
`no-regressions` and `PASS`.

"Review produced findings" never means "the increment is correct" — it means these four lenses were
applied and what they saw is written down.
