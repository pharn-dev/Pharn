# VERIFY — observability-code-side-limit

**Verdict: `PASS`** (`pharn/floor/check-verify.mjs` exit 0 — every gate exit 0, an absolute threshold,
not a comparison). Machine report: `verify-report.json`.

## Floor layer — the gates that OWN the verdict

| Gate            | exit |
| --------------- | ---- |
| `test`          | 0    |
| `validate`      | 0    |
| `lint`          | 0    |
| `format:check`  | 0    |
| `lint:md`       | 0    |
| `docs:check`    | 0    |
| `check:markers` | 0    |
| `check:badge`   | 0    |

`failing_gates: []`. Test count read live: **1380 passing, 0 failing**.

The style gates (`format:check`, `lint:md`) are present here by design — that is L9's remedy, and it
is the stage that actually covers this increment's own new markdown, which `/pharn-dev-regress`
deterministically (and soundly) skipped. It earned its place this run: the build's first
`CHANGELOG.md` edit failed `lint:md` with `MD024/no-duplicate-heading`: `.markdownlint-cli2.jsonc:44`
sets `"MD024": { "siblings_only": true }`, and `## [Unreleased]` already carries a `### Added`
(`CHANGELOG.md:173`), so the new one was a **sibling** duplicate. Renamed to `### Deferred`, unique
among that section's five `###` siblings and a more accurate label for the entry besides.
Caught at build Step 2b by the scoped formatter rather than at verify — L12's prevention working as
intended, with L9's gate as the backstop that would have caught it anyway.

## Structural gates — zero, and that is a design consequence, not a gap

`structural_gates.count: 0`. The increment ships **no capability**, so it ships no
`evals/cases/` + `evals/expected/` pair for `check-structural.mjs` to execute. P1 ("no Capability
ships without evals") is satisfied vacuously — there is no Capability. Had Option A been chosen, this
row would carry one `structural:<expected>` gate per committed eval pair; its absence here is the
increment's whole point, stated rather than glossed.

## Advisory layer — empty

```console
$ node pharn/floor/count-verifiers.mjs .
{"registered":0,"verifiers":[]}
```

Zero `role: verifier` capabilities exist (P7 — none has been authored). The advisory layer is
therefore empty, and per fix #3 a verifier finding could never flip the verdict even if one existed.
Read live this run, never asserted from the build prompt's copy of the same output.

## What PASS does and does not mean (P0)

`PASS` means **exactly** "the eight named gates exited 0 at HEAD." It does **not** mean the deferral
decision is correct, that the proposed `LIMITS.md` §5 text is accurate, or that PHARN would not
benefit from the code-side lens. None of those is floor-checkable: `.dev/**` is excluded wholesale
from `validate.mjs`, and no checker reads trusted-doc prose. Those judgments belong to the human at
GATE 2, and the case against the decision is recorded in `GRILL.md` F4 and the PLAN's
`## The L20 objection, engaged`.

One consequence worth stating plainly: **this increment's central claim — that PHARN never checks
observability against code — is verified by exhaustive live instrument, not by any gate above.** The
gates prove the repo is green; they say nothing about whether the claim is true. Its evidence is the
instrument set recorded in `GRILL.md`, re-runnable at any commit.
