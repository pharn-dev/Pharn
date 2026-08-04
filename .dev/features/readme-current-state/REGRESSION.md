# REGRESSION — readme-current-state

Machine report: [`regression-report.json`](./regression-report.json) (the `check-regress.mjs verdict`
JSON verbatim). The **verdict below is floor-grade** — a deterministic exit-code comparison. Everything
else on this page (choosing the base, partitioning inside/outside, running the suite) is **advisory
orchestration**.

## Base — the auto-detect rule was deliberately overridden, and why

`/pharn-dev-regress` Step 1 auto-detects `base = HEAD` when `git status --porcelain` is non-empty, on
the premise that HEAD is **pre-build**. **That premise is false in this run**, verified rather than
assumed (P6): an external tool (Cursor) committed a **partial mid-build snapshot** of this increment to
`main` as `6b0e7f1` at 23:59:38 while the build was still in progress. It captured the four source files
plus `PLAN.md` / `GRILL.md`, but **not** the three test files, `CLAUDE.md`, or `CHANGELOG.md` (written
after that moment).

Using `HEAD` as the "pre-build baseline" would therefore have measured **half this increment against the
other half**. The base used is the last commit genuinely before the increment:

|                           |                                                                              |
| ------------------------- | ---------------------------------------------------------------------------- |
| base                      | **`252cd25`** (`chore(deps-dev): bump globals from 17.7.0 to 17.8.0 (#106)`) |
| rejected auto-detect base | `6b0e7f1` — contains half of this increment; not pre-build                   |
| head                      | the working tree                                                             |

**`6b0e7f1` is itself broken and is still on `main`.** Measured in a throwaway detached worktree:
**6 failing tests** (`102 tests, 96 pass, 6 fail`) — it landed the generator's new README requirement
without the fixture updates that satisfy it. The working tree repairs all six (**790/790 pass**). This is
a **git-history** problem, not an increment problem, and it is **not `/pharn-dev-regress`'s to fix** —
it is surfaced for the human at the post-review gate.

## Partition (deterministic — `check-regress.mjs scope`, exit 0)

`inside` = 11 changed paths; **`escaped: 0`** — every changed path is covered by a declared writes-scope,
so the build did not escape its `## Files` (fix #7 cross-check).

`--declared` was the union of **every stage's** fix#7-authorized writes this run, not the build's alone:
the plan's `## Files` (9 paths) **plus** `.dev/features/readme-current-state/PLAN.md` (written by
`/pharn-dev-plan` under its own `writes:`) and `GRILL.md` (by `/pharn-dev-grill` under its own). Each
path traces to a stage that was authorized to write it.

- **outside tests:** 47 files — **752 tests**, independently confirmed to have executed.
- **outside eval pairs:** 1 — `trust-fence` expected ↔ `.dev/features/trust-fence/findings.json`.
- **style gates: SKIPPED** by the deterministic config-touch rule — `inside` touches none of
  `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`, so a style flip
  over byte-identical outside files is provably impossible. (No `npm ci` in the baseline worktree.)

## Gates — identical gate set both sides

| gate                                    | base (`252cd25`) | head | flip |
| --------------------------------------- | ---------------- | ---- | ---- |
| `tests` (47 outside files, 752 tests)   | 0                | 0    | none |
| `validate` (whole-repo floor)           | 0                | 0    | none |
| `structural:expected-injection-comment` | 0                | 0    | none |

### A false red was caught and corrected before the verdict (L5, a new mechanism)

The first capture recorded `tests: 1` at **both** base and head. That is the shape lesson L5 warns
about — an equal red on both sides fabricates a `pre_existing` entry and **masks** a real tests-gate
regression. It was not accepted as a result. Cause: the gate ran `xargs -a <file> node --test`, and
**BSD `xargs` on macOS has no `-a` flag**, so `xargs` itself errored and `node --test` never ran —
identically on both sides. Re-running as `xargs node --test < <file>` produced the real numbers above,
confirmed by a separate run showing **752 tests, 752 pass, 0 fail**.

L5 names the zsh word-splitting variant of this trap; this is the **same failure class through a
different mechanism** (a non-portable flag), which suggests L5's remedy should be widened from "quote the
list correctly" to "**prove the gate actually executed** before trusting an equal-exit-code pair."
Recorded here as a lesson candidate for `/pharn-dev-review`; not promoted (that requires a gated
`/pharn-dev-memory-promote` run with human accept/deny).

## Verdict (FLOOR — `check-regress.mjs verdict`, exit 0)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
`regressions: []`, `pre_existing: []`, `verdict: "no-regressions"`.

**The honest residual (P0/P7):** this catches **exactly what the suite catches — nothing more.** A
regression no deterministic check covers is invisible to it. This is **not** a statement that nothing
broke, and **not** a judgment that the increment is good — only that no gate that was passing outside
the feature is failing now.
