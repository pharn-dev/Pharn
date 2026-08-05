# REGRESSION — format-step-scope

**Base:** `d5cddbe6595b67efc7cf53f86d7133b3fea05aa0` — auto-detected, and the detection is correct this run:
`git status --porcelain` is non-empty (the build wrote its files), so the state test's first branch fires
and `base = HEAD`. That is the right baseline: this increment builds directly on `d5cddbe`.
**Machine report:** `.dev/features/format-step-scope/regression-report.json` (the helper's `verdict` JSON,
verbatim — and now **deliberately excluded** from this stage's format step, see below).

---

## Verdict (FLOOR — `pharn/floor/check-regress.mjs verdict`, exit 0)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

| gate       | base | head | result |
| ---------- | ---- | ---- | ------ |
| `tests`    | 0    | 0    | stable |
| `validate` | 0    | 0    | stable |

`regressions[]`: empty · `pre_existing[]`: empty · outside partition: **54** test files, 0 eval pairs.

**Style gates correctly SKIPPED.** `inside` touches no shared style config, so over the outside files —
byte-identical at base and head — a style result cannot flip. Worth stating explicitly _this_ run, because
the increment is _about_ formatting: it changes **which files a stage formats**, not **how any file is
formatted**, so no outside file's style outcome can move. The skip is sound, not convenient.

**Input capture (L5 / L16).** The 54-file list was expanded through **stdin-fed `xargs`** — never
`node --test $LIST` (zsh does not word-split, L5), never `xargs -a` (GNU-only, L16).

---

## `scope` came back clean — and that is itself the result worth reporting

`check-regress.mjs scope` returned **exit 0 with `escaped: []`**. Every changed path was declared:

```text
.claude/commands/pharn-dev-{build,plan,grill,regress,verify,review,ship,memory-promote}.md
.dev/floor/command-hygiene.test.mjs
CHANGELOG.md
```

**This is the increment validating itself.** One increment ago, `scope` reported
`.dev/floor/check-lessons-index.mjs` as escaped — a file no plan had declared, swept in by Step 2b's
repo-wide `npm run format`. That episode became **L19**. This run, Step 2b executed under its **new** rules
(format exactly the paths in `.pharn/writes-scope.json`) and reported `formatting 10 scoped path(s)` —
and the diff contains **exactly** those ten and nothing else. The defect that produced the lesson does not
reproduce under the fix.

Stated honestly, since the temptation is to over-read it: this is **one observation**, not proof. The class
L19 names is untouched — any Bash-invoked tool still writes outside the scope unchecked. What changed is
that the known instance no longer fires, and `.dev/floor/command-hygiene.test.mjs` now fails if a command
re-acquires the habit.

**L17's known-false escape class did not fire**, because this run's own pipeline artifacts
(`.dev/features/format-step-scope/**`) were filtered out of `--changed` before the partition — the same
disproved-and-excluded handling as the previous two runs. L17 itself remains unremedied.

---

## Honest residual (P0/P7)

`/pharn-dev-regress` catches **exactly what its suite catches — nothing more.** Specific to this
increment, three things it cannot see:

- **Whether the eight commands' new prose is actually followed.** Command text is not executable; a stage
  that ignores its format step produces no failing gate here.
- **Whether the scoped formatter works on a repo state other than this one** — e.g. a plan declaring an
  extension-less path (the `--ignore-unknown` case) or an empty `.md` subset (the GNU-`xargs` case). Both
  were verified by hand this run; neither is exercised by a gate.
- **Anything about GNU `xargs`.** The empty-input divergence that shaped the fix was confirmed on **BSD**
  only; the GNU half is documented, not observed. CI (ubuntu) would be where it shows.

**Two clocks:** the **verdict** is floor-grade (`check-regress.mjs` comparing exit codes). Choosing the
base, partitioning inside/outside, and running the suite are **advisory orchestration**.
