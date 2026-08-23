# REVIEW — readme-adoption-rewrite

Increment reviewed as `trust: untrusted` (the standard posture — trusted `/pharn-dev-build` produced it, and it is still reviewed as data). Files: `README.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CLAUDE.md`, `CHANGELOG.md`.

**Floor first:** `node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities checked in "."`. All nine `/pharn-dev-verify` gates exit 0 (`verify-report.json`, verdict `PASS`); regress verdict `no-regressions`. The floor-gate layer is clean. Everything below is **ADVISORY** — four lenses, each citing a principle. Severity is an LLM assignment (fix #3) and gates nothing.

## Lens 1 — Guarantee honesty (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: blocking
  file: "README.md:66"
  problem: "The rewrite hardcoded 'Thirteen grillers' and 'Twenty-two review lenses' into unguarded README prose while the generated CURRENT-STATE block owns those exact numbers — the drift shape the plan's own writing rule forbids, reintroduced by the build that wrote the rule."
  evidence: "line 66: 'Thirteen grillers interrogate the plan before a line is written'; line 68: 'Twenty-two review lenses read the resulting diff'. The guarded block asserts '**13** grillers, **22** lenses' four sections below."
```

**Status: FIXED inside this increment.** The counts were removed and the section now points at the two drift-guarded lists as authoritative, labelling its own prose a tour rather than an inventory. Re-verified after the fix: no `Thirteen` / `Twenty-two` remains, the block's md5 is unchanged (`d663e4eefcf776cd1f6a266a3effe760`), and all gates re-ran green.

This is the sharpest thing the increment produced, and it deserves recording rather than quiet repair. The plan states the rule explicitly — "no number a generator or a test run already owns is hardcoded" — cites **L20** and **L24** in `applied_lessons`, and the very next stage violated it. `check-plan-lessons.mjs` returned GREEN before and after, exactly as it is documented to: it verifies the **declaration**, never the **application**. That is [[L20]]'s thesis reproduced live — a lesson whose only remedy is discipline recurs — and it lands in the one region the repo openly leaves unguarded: README prose outside the markers, which the README itself now says carries no guarantee.

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: "README.md:152"
  problem: "The Guaranteed-vs-advisory table names nine checkers as the reductions behind six guarantees; a table of this shape is exactly where a cited-but-dead floor op would hide, and nothing in the build verified that each named file exists."
  evidence: "Rows cite protect-trusted-paths.cjs, set-writes-scope.cjs, enforce-writes-scope.cjs, check-spec.mjs --hash, scan-plan-secrets.mjs, check-build-complete.mjs, check-verify.mjs, count-lenses.mjs, merge-findings.mjs."
```

**Status: CHECKED, no defect.** All nine were confirmed present on disk at review time, per **L2** ("a contract may cite only live floor ops, verified by reading the implementation this run"). Recorded because the check was performed, not because it failed — the absence of a finding here is only meaningful if the check is named.

## Lens 2 — Trust and untrusted input (P2)

No finding. The increment ingested three untrusted sources — the increment prompt, two fetched web pages, and the installer's terminal output — and none reached a gate. The structural facts were taken from structured locations rather than from any of them: the install tree from `find`, the capability membership from `count-grillers.mjs` / `count-lenses.mjs`, the version from `SKILLS_VERSION`, the canonical repo slug from `gh api ... --jq .full_name` rather than the git remote ([[L32]] — the remote is a mutable alias that survives a rename).

Worth noting as a **strength** rather than a finding: the prompt driving this increment was internally corrupted (a truncated sentence in its §1) and asserted a claim about the writes-scope setter that is false (`set-writes-scope.cjs --from-plan` resolves all declared paths in one call; the prompt asserted one `--target` per write was required). Both were caught by measuring rather than adapting, and both are named in `PLAN.md`. Untrusted input was treated as data throughout.

## Lens 3 — Single axis and citation discipline (P3, P4)

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/readme-adoption-rewrite/PLAN.md:28"
  problem: "Five files changed for two different reasons — a full structural rewrite of README.md, and a one-sentence status realignment in four siblings — so a red on either half would have dragged the other with it."
  evidence: '## Files lists paths whose descriptions range from ''full rewrite to the S1–S10 structure'' to "line 7''s ... replaced with the Q3(a) status wording".'
```

Raised at grill as F5 and carried forward unchanged. The coupling was put to the human at GATE 1 with [[L1]]'s meta-doc argument stated, and chosen deliberately; the mechanical cost proved low (one setter call, five paths). Recorded so the decision stays on the record rather than reading as an oversight.

On P4: the README cites rather than restates throughout — it names checkers and links the four design documents instead of paraphrasing their content, and the one dogfooding claim in S8 quotes `.dev/features/span-redos-linear/REVIEW.md` verbatim instead of summarising it into something stronger. No finding.

## Lens 4 — Honest scope (P6, P7)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: "README.md:249"
  problem: "The README now tells a reader that two of the four design documents are not copied into an install. That is true and worth stating, but it documents a packaging defect in pharn-cli from inside the product README, and no follow-up exists to actually fix it — so the honest disclosure may become a permanent substitute for the repair."
  evidence: "'Two of the four design documents (`THREAT-MODEL.md` and `LIMITS.md`) are not currently copied into an install — read them here.'"
```

Verified live during discovery: a completed `npx @pharn-dev/pharn@latest init` landed `pharn/CONSTITUTION.md` and `pharn/ARCHITECTURE.md` and neither root document. Stating it is correct under P7. The finding is that stating it is not sufficient — the repair belongs in `pharn-cli`, which is a different repository and outside this increment's axis. **For the human at GATE 2:** decide whether to open that as work, or accept the disclosure as the standing answer.

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: "README.md:88"
  problem: "S3 describes what the installer lands by kind rather than by path, which is drift-resistant, but the description was still derived from a single observed run of a CLI that fetches the repository's current HEAD — so it is accurate today and owned by no checker."
  evidence: "'The installer reads your `package.json`, detects your project's archetype, and selects the capabilities that apply ... It then installs: the product commands ... the write-gating hooks ... the floor ... and a `pharn.config.json`.'"
```

This was grill F3, and the fix (describe by kind, never as an enumerated tree) is the reason the severity is minor rather than important: kinds change far more slowly than paths. The residual is real and unowned, and is the same class as the finding in Lens 1 — README prose is not guarded, by design.

## Summary

The increment did what it set out to do. The README no longer contradicts the repository: the installer claim was corrected against a live install rather than an inference, three hero sentences that could not be reduced to a floor operation were struck rather than softened, and two citations that the linked sources do not support were dropped. Every checker the new text names as a guarantee was confirmed live, and every guarantee is stated with its bound in the same breath — including the largest one, that Bash-tool writes bypass the write-guards entirely.

The one real defect was self-inflicted and instructive: the build hardcoded two counts the generated block already owns, in the same increment whose plan forbade exactly that and cited the two lessons about it. It is fixed, and it is recorded here rather than smoothed over, because it is a cleaner instance of [[L20]] than the one that promoted L20 — the rule was written, cited, declared, floor-checked as declared, and then broken one stage later, in the only part of the file no checker reads.

**Advisory verdict: 5 findings (1 blocking-severity, fixed inside the increment; 1 important; 3 minor). Floor GREEN, verify PASS, regress no-regressions.** This is not a judgment that the increment is good — the README is prose, and no check in this repo evaluates prose. That judgment is the human's at GATE 2.
