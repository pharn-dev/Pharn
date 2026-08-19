# GRILL — scope-file-case-guard

Plan under interrogation: `.dev/features/scope-file-case-guard/PLAN.md`.
**Spec-hash check (content-hash primitive):** live `sha256(pharn/ARCHITECTURE.md)` =
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52` — **AGREES** with the plan's
`spec_content_hash`. No drift to surface. (The computation is floor-grade; the **block** on drift is
`/pharn-dev-build`'s gate, not this stage's.)

**Griller membership (FLOOR — `pharn/floor/count-grillers.mjs`, frontmatter not prose):** 13 registered.
**Deterministic sub-checks, all run over the PLAN, all clean:** `scan-plan-secrets` `{"found":false}` ·
`scan-plan-pii` `{"found":false}` · `scan-plan-i18n` `{"found":false}` · `scan-plan-migrations`
`{"mentions":false}` · `scan-plan-observability` `{"mentions":false}`.

---

## Findings

### Axis: architecture / coupling (P3) — griller `architecture`

```yaml
- type: FINDING
  rule_id: "P3"
  severity: important
  file: ".dev/features/scope-file-case-guard/PLAN.md:121"
  problem: "The increment creates a SECOND, UNPINNED copy of the path literal `.pharn/writes-scope.json` — it will live both as `SCOPE_FILE` in enforce-writes-scope.cjs:73 and as a DEFAULT_PROTECTED entry in protect-trusted-paths.cjs — while this repo's own precedent pins exactly this duplication class with a ✧ cross-copy test; grep finds no ✧ test naming SCOPE_FILE, so the two can drift silently and the protect-hook entry would then guard a path the scope guard no longer uses."
  evidence: "The setter writes the file with `fs.writeFileSync`, so `PreToolUse` never sees it and the setter is unaffected by this change."
```

**Why this is the sharpest finding in the run.** `set-writes-scope.test.cjs` carries a ✧ guard whose
own comment says a shared module was rejected and "two copies drift; that is the cost of the choice,
and this guard is the mitigation that makes the choice acceptable." That reasoning applies verbatim to
the new pair, and the plan neither pins them nor records the omission as accepted. Note the pin cannot
be added to the existing `CONTROL_SURFACE` agreement test — that one deliberately filters
`.claude/`-prefixed entries — so this needs its own small ✧ assertion, or an explicit "not pinned, and
here is why" line.

### Axis: testability (P1) — griller `testability`

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/scope-file-case-guard/PLAN.md:25"
  problem: "The plan asserts the build 'must re-measure that each new test FAILS against the unpatched hook' but names no procedure for doing so, and the measurement gets structurally harder the moment the human applies the patch — the unpatched hook no longer exists in the tree, so the mutation must run in the opposite direction (REMOVE the entry from a sandbox copy) using the file's existing mutantSandbox helper, which the plan never cites."
  evidence: "the build step must re-measure that each new test **fails** against the unpatched hook before it is trusted."
```

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/scope-file-case-guard/PLAN.md:121"
  problem: "Nothing in the increment pins the claim that set-writes-scope.cjs can still write .pharn/writes-scope.json after that path becomes protected; the claim is argued from the tool boundary (fs.writeFileSync vs the Write tool) and is demonstrated only incidentally by this run's own later stages, so a future change routing the setter through a gated path would break the whole pipeline with no failing test."
  evidence: "set-writes-scope.cjs is unaffected: it writes the file with fs.writeFileSync, which PreToolUse never sees."
```

### Axis: documentation (P7) — griller `documentation`

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/scope-file-case-guard/PLAN.md:106"
  problem: "The planned CLAUDE.md edit adds the scope file to hard-constraint #1's enumeration, but that same sentence is ALREADY stale in a second way the plan does not mention: it names `.claude/settings.json` and 'the three hook scripts' while DEFAULT_PROTECTED also carries `.claude/settings.local.json`, so editing the sentence without fixing that omission re-ships a known-incomplete enumeration."
  evidence: "`CLAUDE.md` — hard constraint #1's enumeration of the guards' control surface gains the scope file (L1) — layer repo-meta"
```

### Axis: scoping / regress-surface (P6) — inline

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/scope-file-case-guard/PLAN.md:32"
  problem: "The plan pre-declares exactly ONE expected L17 false-positive at /pharn-dev-regress (the human-applied hook file), but the run has since acquired two more changed-since-base paths outside `## Files` — `.markdownlint-cli2.jsonc` and `.dev/features/scope-file-case-guard/BASELINE-REPAIR.md`, both from the GATE-1-directed baseline repair — so the regress scope check will report escapes the plan does not account for."
  evidence: 'human-applied edit to `.claude/hooks/protect-trusted-paths.cjs` **will** surface as a false "the build escaped its `## Files`" finding'
```

### Axis: guarantee audit (P0) — inline

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/scope-file-case-guard/PLAN.md:69"
  problem: "The plan reports '106 tests, 106 pass' as proof the patch breaks nothing, but that run executed in a PARTIAL sandbox holding only the hooks directory — not the real repo — so tests whose behavior depends on repo contents (the PROTECTED_INODES hard-link scan stats real files; ROOTS anchors differ) did not exercise the same state; it is strong evidence, not the post-apply repo run, and the plan words it as settled."
  evidence: "node --test protect-trusted-paths.test.cjs against the PATCHED hook → 106 tests, 106 pass, 0 fail"
```

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/scope-file-case-guard/PLAN.md:103"
  problem: "The SemVer size is asserted as patch without weighing the competing reading: CLAUDE.md defines patch as 'a correction/clarification to bytes that already shipped' and minor as 'a newly shipped capability / checker', and a newly guarded path is arguably a behavior change an installed user would want surfaced as minor rather than as a correction."
  evidence: "`SKILLS_VERSION` — `2.7.0` → `2.7.1` (patch: a correction to product `.cjs` hook bytes that already shipped)"
```

### Axes with no findings

`security` (P2) — `scan-plan-secrets` clean; the increment ingests one untrusted document and the plan's
trust audit correctly states that every claim in it was re-verified live rather than believed, with no
gate resting on its free text. `coupling` (P3) — no leaf→leaf reference; the change is one entry in an
existing floor hook. `error-handling`, `observability`, `migrations`, `privacy`, `i18n`, `a11y`,
`performance`, `comprehension` — **not applicable to this increment** and recorded as such rather than
silently skipped: a one-entry membership addition to a pre-write hook has no failure path, telemetry
surface, data migration, PII flow, user-facing string, rendered UI, or hot path.

---

## Summary

The plan is unusually well-grounded — its discovery section is measured rather than asserted, its
guarantee audit already narrows the central claim to the Write-tool surface and names the Bash bypass
as the standing hole, and its `## Files` was verified against the setter's parsed count. The
interrogation therefore found no defect in what the plan **does**; every finding above is about what it
**leaves unpinned or understates**.

Two are worth the human's attention before `/pharn-dev-build`. The **unpinned duplicate path constant**
is the one I would act on: this repo has already decided, in writing, that duplicated membership
constants get a ✧ cross-copy guard, and this increment creates a new instance of exactly that pair
while the existing guard structurally cannot cover it. The **CLAUDE.md `settings.local.json` omission**
is cheap to fix in the same edit and expensive to leave, since the increment is touching that very
sentence.

The remaining four are calibration rather than defects: the L4 measurement needs a named procedure, the
setter's continued ability to write a now-protected file deserves a pin, the sandbox measurement should
be re-stated as evidence pending the real post-apply run, and the patch-vs-minor bump is a judgment
call the human should make consciously rather than inherit.

**ADVISORY VERDICT: 7 concerns raised (0 blocking-severity, 4 important, 3 minor) — for the human to
weigh before `/pharn-dev-build`.** This log gates nothing: `/pharn-dev-grill` is advisory end-to-end, every
severity above is an LLM assignment (fix #3), and the deterministic backstops remain `/pharn-dev-build`'s
spec-hash gate and `pharn/floor/validate.mjs`. "A grill log exists" never means "the plan is sound" (P0).
