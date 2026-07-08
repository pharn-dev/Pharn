# REVIEW — seam-build-wiring (PHARN reviewing PHARN)

- **Increment under review:** `trust: untrusted` — the Step 2c addition + three audit bullets in `.claude/commands/pharn-build.md`.
- **Step 1 (floor first, P0):** `node .dev/floor/validate.mjs .` → **GREEN**, 36 capabilities (exit 0). (`validate.mjs` ignores `.claude/`, so the floor's GREEN reflects the repo staying structurally sound with the edit present, not a check of the edit's content.)

## Floor-gate findings (blocking)

**None.** No lens found a guarantee-without-floor-reduction, a missing eval binding, a tainted gate, or a sibling reference.

## Lens results

### L-floor → P0 (governing)

**No blocking finding.** The edit's guarantee split is careful and correct: config validity = **FLOOR** (`check-seam-config.mjs`, reused — "No new floor primitive"), invocation + seam-recognition = **ADVISORY** (explicitly "DOUBLY advisory, not floor-forced"), resolution correctness = **ADVISORY**. It does not dress the wiring as a guarantee.

- **Advisory (P0):** the honest residual the edit itself names — a build can **skip Step 2c entirely** (nothing hook-forces it), so "seams are validated" holds only when the model both recognizes the seam and runs the check. This is inherent to wiring a checker into **advisory command prose**; the edit states it plainly (line 206). Noted so the human doesn't over-read "operative."

```yaml
- type: FINDING
  rule_id: P0
  severity: minor
  file: ".claude/commands/pharn-build.md:206"
  problem: "Step 2c's config-validity floor fires only if the model recognizes the seam AND runs check-seam-config.mjs; neither is hook-forced, so 'the build validates every seam-config' is advisory command discipline, not a guarantee."
  evidence: '"operative" is DOUBLY advisory, not floor-forced ... it fires only if (a) you recognize the seam and (b) you run the check; neither is hook-forced'
```

### L-eval → P1

**No blocking finding.** No role-bearing Capability and no new helper → no eval obligation (`validate.mjs` ignores `.claude/`); floor and lens agree.

- **Advisory (P1/testability):** the inline `.seam`-extraction bash (line 195) is **untested** — the floor covers only "the extracted file is valid," not "the extraction is faithful." The edit labels it `ADVISORY, untested` and defers a tested extraction helper to a separate axis (P7). I **separately ran the documented extraction during build** and confirmed it produces a GREEN default config — a live spot-check, not a committed regression test. If extraction correctness should be floor-covered, that is the deferred second axis.

### L-trust → P2

**No blocking finding.** The added Step 2c handles the (untrusted) seam-config correctly: it branches only on `check-seam-config.mjs`'s exit code, never on config free-text; the new Trust-audit bullet states a poisoned config can at most RED-halt or carry ignored fields, and cannot escape the fix #7 scope. Fetched docs are deferred to the resolver skill's DATA-fence. No instruction-looking content in the edit steered this review.

### L-axis → P3

**No blocking finding.** One file, one change-reason (add seam handling); the audit-section extensions are part of the same change. The edit **cites** `pharn-core/seam-resolver` (a dependency root, allowed), `pharn-contracts/seam-config.md` (the bottom), and the floor tool `check-seam-config.mjs` — all citations (P4), no `reads:` sibling, no leaf→leaf. Mirrors the command's existing Step-2b idiom.

## Verdict

**GREEN — 0 floor-gate (blocking) findings.** Two advisory notes for the human (the wiring is advisory-until-invoked by design; the inline extraction is untested — both named, both deliberate one-axis costs). The increment is clean and honest.

## Proposed lesson for canon

**None this run.** The one honesty pattern here — "wiring a floor checker into advisory command prose makes it operative-in-the-flow, not floor-forced" — is correct **design**, not a **failure** (P7 requires a real failure to trigger canon). The real dogfood-failure lesson from this pipeline run was already proposed in the **seam-resolver** increment's REVIEW.md (concrete-paths-only in `## Files`); it stands for `/pharn-dev-memory-promote`.
