# REGRESSION — spec-state-parser-unify

**Verdict: `regressions` (`check-regress.mjs verdict` exit 1). The stage FAILS.**
This is a deterministic exit-code comparison, not a judgment — one outside gate flipped pass→fail.

- **base:** `HEAD` (auto-detected: `git status --porcelain` non-empty → working-tree dogfood build)
- **inside (changed scope):** 9 paths — the plan's 7 declared `## Files` plus this feature's own
  `PLAN.md` / `GRILL.md`, which `scope --feature` exempted (`escaped: []`, `escape_exempt` listed both).
  **No scope breach.**
- **outside gates run:** `tests` (63 test files, this feature's 3 excluded), `validate`,
  `structural:expected-injection-comment`. Style gates **skipped** by the deterministic rule — `inside`
  touches no shared style config.

| gate                                    | base | head  |                |
| --------------------------------------- | ---- | ----- | -------------- |
| `tests`                                 | 0    | **1** | **REGRESSION** |
| `validate`                              | 0    | 0     | —              |
| `structural:expected-injection-comment` | 0    | 0     | —              |

The baseline was **all-green**, so this is a believable baseline rather than a fabricated red
(`.dev/memory-bank/lessons-learned.md` L5 / L16 / L22 — the input-capture trap, cited not restated).
The `tests` list was expanded with the pinned `cat … | xargs node --test` form.

## The regression, diagnosed (investigated, not recorded)

`.dev/floor/check-version-badge.test.mjs` → `the checker is GREEN against this repo` now fails.
Reproduced directly:

```text
$ node .dev/floor/check-version-badge.mjs .
VERSION-BADGE: RED — 1 finding(s)
- [DRIFT] README.md
    the badge reads "2.7.1" but SKILLS_VERSION is "2.7.2"
```

**This is a correct RED, and the checker did exactly its job.** `README.md:13` carries
`img.shields.io/badge/pharn-2.7.1-blue`; the increment bumped `SKILLS_VERSION` to `2.7.2`. The badge
sits in the README's unguarded prose — outside the `CURRENT-STATE` markers `docs:check` holds to
byte-equality — which is precisely why `check-version-badge.mjs` exists (its own header records that
the badge read `version-1.0.0` through the whole 2.x line and nothing noticed).

**The defect is in the PLAN, not in the code this increment wrote.** The plan's L1 meta-doc sweep asked
"which meta-docs state a fact this increment changes?" and named `SKILLS_VERSION` and `CHANGELOG.md`.
It **missed `README.md`**, which states the version a third time. Every `.mjs` change in this increment
is unaffected; the three modified test suites and the floor are green.

**Remedy (requires a human scope decision — it is not the agent's to take):** add `README.md` to the
plan's `## Files`, re-run the scope-setter, and update the badge to `2.7.2`. The write is currently
**denied** by fix #7, correctly — `README.md` is not in the approved `## Files`. Amending an approved
plan's scope is a GATE-1 matter, so `/pharn-dev-ship` stops here and asks rather than widening its own
authorization. (Note the residual `check-regress.mjs` names: a build that rewrites its own `## Files`
to retroactively authorize a path is not caught by this checker — which is exactly why the amendment
is being surfaced to a human **before** any write, not after.)

## Honest scope (P0)

The **verdict** is FLOOR (an exit-code comparison, `pharn/ARCHITECTURE.md §2` primitive #3). The
**orchestration** that captured the inputs — resolving the base, partitioning inside/outside, running
each gate — is ADVISORY, and a verdict computed over corrupted inputs would be GIGO (L5). Granularity
limit, named: `tests` and `validate` are whole-suite / whole-repo gates, so this report identifies
_that_ the suite flipped, and the diagnosis above (which test, why) is agent work on top of the floor
verdict, not part of it.
