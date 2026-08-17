# SHIP — observability-code-side-limit

Advisory roll-up of one gated `/pharn-dev-ship` run. **The chain ran; the named floor verdicts are as
shown — this is NOT a judgment that the increment is good or wise. That is the human's call at the
post-review gate.**

## Where the run ended

**GATE 2** — the post-review human decision (merge / fix / abandon). No stage returned a non-GREEN
verdict, so no RED-verdict STOP occurred.

## Stages that ran, in order

| #   | Stage                | Outcome                                                                                         |
| --- | -------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | `PLAN.md` written; **GATE 1** — the human approved Option B ("select the best approach and go") |
| 2   | `/pharn-dev-grill`   | `GRILL.md`, 5 findings — advisory, gates nothing                                                |
| 3   | `/pharn-dev-build`   | `LIMITS-5-PROPOSED.md` + `CHANGELOG.md` entry written; floor run                                |
| 4   | `/pharn-dev-regress` | `regression-report.json` + `REGRESSION.md`                                                      |
| 5   | `/pharn-dev-verify`  | `verify-report.json` + `VERIFY.md`                                                              |
| 6   | `/pharn-dev-review`  | `REVIEW.md`, 4 lenses, no blocking finding                                                      |

## The structural verdicts read, verbatim

| Stage                | Verdict source                              | Value                                                   |
| -------------------- | ------------------------------------------- | ------------------------------------------------------- |
| `/pharn-dev-build`   | `node pharn/floor/validate.mjs .` exit code | **`0`** (`FLOOR: GREEN — 36 capabilities checked in .`) |
| `/pharn-dev-regress` | `regression-report.json` `.verdict`         | **`"no-regressions"`**                                  |
| `/pharn-dev-verify`  | `verify-report.json` `.verdict`             | **`"PASS"`**                                            |

Each was read as a deterministic value — an exit code and two enum strings — never inferred from
prose. No proceed/stop decision in this run rested on a free-text field.

## Pointers (cited, not restated — P4)

- `.dev/features/observability-code-side-limit/REVIEW.md` — the four-lens review and its lesson
  candidate.
- `.dev/features/observability-code-side-limit/GRILL.md` — the interrogation, including the eight-row
  correction table against the build prompt's own premises.
- `.dev/features/observability-code-side-limit/PLAN.md` — the decision and the `## The L20 objection,
engaged` section, which is the strongest recorded case **against** this increment.

## The one output this run cannot apply itself

`.dev/features/observability-code-side-limit/LIMITS-5-PROPOSED.md` holds the proposed `LIMITS.md` §5
text. `LIMITS.md` is hook-denied to the agent (`protect-trusted-paths.cjs`, verified live: exit 2), so
the text is **reported, never agent-edited**. It is appended after `## 4.`, renumbering nothing — the
existing section ids are cited from code (`scan-installed-skills.mjs:21` → `§1a`;
`lessons-index-core.mjs:78,316` → `§1c`).

**Deliberately unbumped.** `SKILLS_VERSION` stays `2.6.0` and the README badge is untouched, because
every path this increment wrote is apparatus (`.dev/**`) or repo-meta (`CHANGELOG.md`) and neither
bumps. The patch bump to `2.6.1` plus the matching badge edit belong in the **same commit as the
human's `LIMITS.md` append**, and are spelled out in `LIMITS-5-PROPOSED.md`. Bumping now would assert
a product-surface change that had not landed.

## What this record is not

It is not a "shipped", not an approval, and not a `PHARN ✓ reviewed` seal. `/pharn-dev-ship` added no
floor primitive in this run: every guarantee above belongs to a sub-stage's own checker
(`validate.mjs`, `check-regress.mjs`, `check-verify.mjs`) and to the two write-guard hooks, which
fired and were obeyed twice — once denying `LIMITS.md` (fix #2) and once denying an out-of-scope
`regression-report.json` write (fix #7, an L8 over-narrowing). Running the stages in order is advisory
orchestration; only the verdicts are floor.
