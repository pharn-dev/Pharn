# REGRESSION — `floor-selfheader-prefix`

**Base:** `7842bf0114b533c775295d3cb9aca24d56159b7c` — `chore(floor): correct relocated self-paths +
SHA-pin floor.yml actions (#110)`.

Base resolved by the deterministic state test (P5): `git status --porcelain` is non-empty (a
working-tree dogfood build) → `base = HEAD`.

> **Live-state note (P6).** PR #110 was **merged and squashed during this run.** The branch was cut from
> #110's unmerged head (`f4c8a1c`); by the time `/pharn-dev-regress` resolved its base, HEAD had become the
> squash-merge commit `7842bf0`, sitting directly on `1db762f`, with `origin/main` at the same commit
> (`0 0` ahead/behind). The working-tree edits survived unchanged and now diff cleanly against it, and
> `SKILLS_VERSION` reads `1.1.2` at base → `1.1.3` in the tree. Net effect: the task brief's preferred
> sequencing ("assumes #110 is merged, `SKILLS_VERSION` at 1.1.2") is now the **actual** state, and the
> branch-off-the-open-PR contingency is moot. Read live, not assumed.

## Inside / outside partition

Partition computed by `pharn/floor/check-regress.mjs scope` — **exit 0, `escaped: []`** (no fix#7 scope
breach).

- **Inside (16):** the 14 paths the plan's `## Files` declared, plus the two pipeline artifacts
  `.dev/features/floor-selfheader-prefix/PLAN.md` and `GRILL.md`.
- **Outside:** 44 test files, 1 committed eval pair
  (`pharn/pharn-review/trust-fence/evals/expected/expected-injection-comment.json` ↔
  `.dev/features/trust-fence/findings.json`).

**Orchestration decision, declared because it is advisory (not floor).** Run with `--declared` = the
plan's `## Files` **alone**, `scope` exits **1** with two blocking P0 fix#7 findings naming `PLAN.md` and
`GRILL.md` as build escapes. They are **not** build escapes: `PLAN.md` was written by `/pharn-dev-plan` and
`GRILL.md` by `/pharn-dev-grill`, each under **its own** command's `writes:` scope, enforced by fix#7 at the
time of writing — `/pharn-dev-build` never wrote either. The `--declared` set passed here is therefore the
**union** of the build's `## Files` and those two stage-owned artifacts, matching the precedent in
`.dev/features/floor-selfpath-correction/regression-report.json` (whose `inside` likewise carries its own
`PLAN.md` / `GRILL.md`). Choosing the partition is **advisory orchestration**; only the verdict below is
floor.

## Gate set

Style gates (`lint` / `format:check` / `lint:md`) were **deterministically skipped**: `inside` touches no
shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`,
`.markdownlint-cli2.jsonc`), so a style flip over the byte-identical outside files is provably
impossible. The skip also avoids `npm ci` in the baseline worktree. The same three gates ran on **both**
sides.

| gate                                    | base (`7842bf0`) | head | result  |
| --------------------------------------- | ---------------- | ---- | ------- |
| `tests` (44 outside test files)         | 0                | 0    | no flip |
| `validate` (whole-repo floor)           | 0                | 0    | no flip |
| `structural:expected-injection-comment` | 0                | 0    | no flip |

- `regressions[]`: **empty**
- `pre_existing[]`: **empty**

## A fabricated red, caught and corrected (worth recording)

The **first** baseline capture recorded `tests = 1`. That was **not** a real failure: the capture used
`xargs -a <file>`, and **macOS ships BSD `xargs`, which has no `-a` flag** — so `xargs` itself exited 1
without ever invoking `node --test`. Because the same wrong form would have run at **both** base and head,
it would have produced an _equal_ red on both sides and been filed as `pre_existing` — silently **masking**
the real `tests` gate, which is precisely the failure mode `.dev/memory-bank/lessons-learned.md` L5 names
for the zsh word-splitting variant (cite, don't restate — P4). This is the **BSD-`xargs` variant of the
same trap**. Both captures were redone with the stdin form (`xargs node --test < list`), which reports
**709 passing outside tests, exit 0** on both sides. The numbers in the table above are the corrected ones.

## Verdict (FLOOR — `pharn/floor/check-regress.mjs verdict`, exit 0)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

The verdict is a deterministic comparison of exit codes; no model judgment entered it. `verdict` field in
`regression-report.json`: `"no-regressions"`.

**Honest residual (P0/P7):** `/pharn-dev-regress` catches **exactly what its suite catches — nothing more.**
This says deterministically-detectable breakage outside the feature did not occur; it does **not** say
"nothing broke." For this increment that residual is unusually wide in one specific place, already named
in `GRILL.md`: the rewritten comment text is not executed, and the single operative edit
(`check-structural.mjs`'s no-args `console.log`) has **no test on its path at all** — so no gate here, at
base or head, could have observed a mistake in it.
