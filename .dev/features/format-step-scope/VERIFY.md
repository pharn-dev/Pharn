# VERIFY — format-step-scope

**Machine report:** `.dev/features/format-step-scope/verify-report.json`.

---

## Verdict (FLOOR — `pharn/floor/check-verify.mjs`, exit 0)

**VERIFIED: floor gates PASS** — on the **second** gate pass. The first returned **FAIL**, and that
failure is the most informative result of this increment; it is recorded below rather than smoothed over.

| gate           | pass 1 | pass 2 | note                                                   |
| -------------- | ------ | ------ | ------------------------------------------------------ |
| `test`         | 0      | 0      | 906 tests, 0 failures — 903 → 906 (+3 command-hygiene) |
| `validate`     | 0      | 0      | `FLOOR: GREEN — 36 capabilities checked`               |
| `lint`         | 0      | 0      | eslint clean                                           |
| `format:check` | **1**  | 0      | see "The predicted regression" below                   |
| `lint:md`      | 0      | 0      | markdownlint clean                                     |

`failing_gates[]`: empty at the recorded verdict. No `structural:*` gate — this increment ships no
`role:`-bearing capability, so there is no `evals/expected/*` ↔ committed-actual pair.

---

## The predicted regression, observed live

`format:check` failed the first pass on exactly two files:

```text
[warn] .dev/features/format-step-scope/GRILL.md
[warn] .dev/features/format-step-scope/PLAN.md
```

**This is the regression the plan predicted at GATE 1, and the reason the increment was scoped beyond
"fix Step 2b".** Those two artifacts were previously formatted **only** as collateral of Step 2b's
repo-wide `npm run format`. This run, Step 2b executed under its new rules and correctly formatted **only
the 10 paths the plan declared** — so the two pipeline artifacts, written before the per-stage steps
existed, went unformatted and the whole-repo style gate caught them.

The remedy was the increment's own deliverable: `/pharn-dev-plan`'s and `/pharn-dev-grill`'s newly-added
format steps, run over their own artifacts exactly as written. `format:check` then returned 0.

Two honest readings, both worth stating:

- **It validates the GATE-1 argument.** Had the increment been narrowed to "build only" — the option
  offered and declined — this failure would have become permanent: every future run's PLAN.md and GRILL.md
  would red `/pharn-dev-verify` until fixed by hand, which is precisely the friction L12 and L13 exist to
  remove.
- **It is also a self-inflicted ordering artifact**, not a defect in the shipped change. The two files were
  authored before the steps that now cover them. On any subsequent run the stages format their own output
  as they go, and this cannot recur.

**Prevention worked everywhere it was in force.** The six artifacts written _after_ their format steps
landed (`REGRESSION.md`, this file, and the four command-file groups) were clean on the first pass.

---

## Advisory layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`. **No verifiers registered —
floor gates only.** Membership is a deterministic frontmatter read (L6); none is authored speculatively
(P7). Nothing advisory contributed to the verdict.

---

## What the 3 new tests pin, and what they do not

`test: 0` is the floor fact; the count says nothing about coverage.

**`.dev/floor/command-hygiene.test.mjs` (3 tests).** (1) No `.claude/commands/*.md` prescribes a
repo-wide formatter write. (2) The matcher **discriminates** — it flags `npm run format`,
`prettier --write .` and a bare `markdownlint-cli2 --fix`, while passing `npm run format:check` and both
scoped `xargs` forms. (3) The `COMMAND-HYGIENE:SKIP` region is honored **only** inside its markers.

**It was measured failing, twice, and neither was authored (L4).** The guard REDed on its first live run —
on the rationale line of all seven newly-inserted format steps, which quoted the rejected token. That is
GRILL F1's class recurring in a form the grill did not predict, caught by the guard rather than by review.
The rationale now cites L19 instead of restating it (P4) and the literal survives once, inside build's
skip region.

**What it does not buy (P0):** it pins a **vocabulary**, not a behavior. A novel spelling — a new npm
script, a shell alias, a different tool — passes untouched. And it does **not** close L19's class: any
Bash-invoked tool still writes outside the writes-scope entirely, because fix #7 gates only
`Write|Edit|MultiEdit`. **L19 remains true after this increment lands.** One instance removed is not a
door closed.

---

## Honest residual (P0/P7)

**"Verified" = the named gates passed — nothing more.** Specific blind spots here:

- **Whether the eight commands' new prose is followed.** It is not executable; a stage that skips its
  format step produces no failing gate — only a later whole-repo style red, which is where this run's own
  first-pass FAIL came from.
- **Anything about GNU `xargs`.** The empty-input divergence that shaped the fix was confirmed on **BSD**
  only; the GNU half is documented, not observed. It would show on ubuntu CI, not here.
- **The `--ignore-unknown` and stale-scope paths.** Both were exercised by hand this run; neither is
  covered by a gate.

**Two clocks:** the verdict is floor-grade (`check-verify.mjs` comparing integers); running the gates,
composing the gate set, and the decision to re-run after formatting are advisory orchestration.
