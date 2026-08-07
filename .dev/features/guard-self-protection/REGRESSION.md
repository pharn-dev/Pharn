# REGRESSION — guard-self-protection

Did building this increment break anything **outside** it? Pure state comparison: the same deterministic
gates run at the pre-build baseline and at HEAD, and any gate that flipped pass→fail is a regression.

- **Base:** `11c51a9b4bcb5753596496b173b98871d6690297` — resolved by the deterministic state test
  (`git status --porcelain` non-empty → working-tree dogfood → `base = HEAD`), which is `main`'s tip.
- **Style gates:** SKIPPED. `inside` touches no shared style config (`eslint.config.mjs`,
  `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so an outside style flip is
  provably impossible. Absent from **both** maps, so the gate sets match.

## Inside / outside partition

**Inside (10)** — exactly the plan's `## Files`; `check-regress.mjs scope` reports **`escaped: 0`**:

`.claude/hooks/enforce-writes-scope.test.cjs`, `.claude/hooks/protect-trusted-paths.cjs`,
`.claude/hooks/protect-trusted-paths.test.cjs`, `.claude/hooks/set-writes-scope.cjs`,
`.claude/hooks/set-writes-scope.test.cjs`, `.claude/settings.json`, `CHANGELOG.md`, `CLAUDE.md`,
`SKILLS_VERSION`, `pharn/floor/README.md`

> **Second pass.** This report was recomputed after the post-review fixes (the ✧ cross-copy agreement
> guard for `REVIEW.md` F1, and `pharn/floor/README.md`'s stale protected-set enumeration). Both the
> baseline worktree and the HEAD gates were re-run from scratch; `pharn/floor/README.md` is the tenth
> declared path and enters `inside`, so it is correctly excluded from the outside gates.

**Outside:** 57 test files + `validate` + 1 committed eval pair.

### The two "escapes" the raw partition reported, and their disproof (L17)

The first `scope` run exited **1** with two **blocking `P0` fix#7** findings, naming
`.dev/features/guard-self-protection/PLAN.md` and `…/GRILL.md` as paths the build wrote outside its
`## Files`. **Both are false, and they are the exact class `.dev/memory-bank/lessons-learned.md` L17
documents** — `scope` computes `escaped` over `git diff <base>`, which is a **changed-since-base** test
being read as a **written-by-the-build** test; with `base = HEAD` on a working-tree dogfood, every
sibling stage's own artifact lands in `inside`.

Disproof, not dismissal: `PLAN.md` was written by `/pharn-dev-plan` and `GRILL.md` by `/pharn-dev-grill`,
each under **its own** Step-0 writes-scope; neither path was ever in the build's active scope (the build
ran under the 10-path bootstrap scope recorded in `.pharn/f3-scope.md`, which names neither). Re-running
`scope` with the feature's own `.dev/features/<name>/**` pipeline artifacts excluded — L17's stated
remedy — yields **`escaped: 0`, exit 0**. L17's other remedy (fix the helper to derive "written by the
build" from `.pharn/writes-scope.json` rather than the diff) is a change to `pharn/floor/check-regress.mjs`,
**outside this increment's approved edit set** — carried forward as a follow-up, not silently applied.

## Per-gate exit codes

| gate                                                  | base | head | result    |
| ----------------------------------------------------- | ---- | ---- | --------- |
| `tests` (57 outside test files)                       | 0    | 0    | no change |
| `validate` (`pharn/floor/validate.mjs .`, whole-repo) | 0    | 0    | no change |
| `structural:…/expected-injection-comment.json`        | 0    | 0    | no change |

- **`regressions[]`:** none
- **`pre_existing[]`:** none

### Two reds this run FABRICATED, found by investigating rather than recording (L16, L5)

The first capture returned `tests=1` and `structural=1` at **both** sides. Equal-on-both-sides reads as
"pre-existing" and would have been recorded as such — but both were artifacts of this stage's own
orchestration, and both would have **masked** a real flip in the same gate:

1. **`xargs -a` is GNU-only.** The command this stage's own text prescribes (`xargs -a <file> node --test`)
   fails on macOS/BSD with `xargs: invalid option -- a`, so `node --test` never ran and the gate exited 1
   identically at base and head. This is **L16 precisely** — L5's remedy for the zsh word-split trap is
   itself a portability trap. Corrected to the portable stdin form (`xargs < <file> node --test`), after
   which the gate runs **1018 tests, 1018 pass, exit 0**.
2. **A fabricated eval path.** The expected-findings file was passed as
   `…/evals/expected/injection-residual.json`, which does not exist; the real committed pair is
   `…/evals/expected/expected-injection-comment.json`. `check-structural.mjs` correctly RED-failed on an
   unreadable input at both sides. With the real path it is **GREEN — 6 structural assertions passed**.

Both are **orchestration** defects (advisory), not floor-verdict defects: `check-regress.mjs` compared
faithfully whatever exit codes it was handed. That is the standing two-clocks split — and the live
instance of L5's point that a verdict is only as trustworthy as the inputs the orchestration captures.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
(`check-regress.mjs verdict` → `"no-regressions"`, exit **0**. The comparison is the floor; choosing the
base, partitioning, and running the suite are advisory orchestration.)

**Honest residual (P0/P7):** this catches **exactly what its suite catches — nothing more.** A regression
no deterministic check covers is invisible here. The claim is "deterministically-detectable breakage
outside the feature is caught," **never** "nothing broke," and never that the increment itself is good.
