# REGRESSION — guard-coverage

**Base:** `0323bf9f63d6fb63e79d8aeab9de6d8a3bcd60fd` — passed **explicitly**, not auto-detected. HEAD moved
mid-run when commit `0323bf9` ("update") landed between `/pharn-dev-grill` and `/pharn-dev-build`, so the
plan's originally-pinned `0562f9e` would have measured against a stale baseline and pulled that commit's
two files into `inside`.
**Machine report:** `.dev/features/guard-coverage/regression-report.json` (the helper's `verdict` JSON, verbatim).

---

## Verdict (FLOOR — `pharn/floor/check-regress.mjs verdict`, exit 0)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

| gate       | base | head | result |
| ---------- | ---- | ---- | ------ |
| `tests`    | 0    | 0    | stable |
| `validate` | 0    | 0    | stable |

`regressions[]`: empty · `pre_existing[]`: empty · outside partition: **52** test files, 0 eval pairs.

**The style gates were correctly SKIPPED, and the reasoning is load-bearing here.** `inside` touches no
shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`),
so over the **outside** files — byte-identical at base and head — a style result cannot flip. Note this is
_not_ contradicted by the formatting repair described below: that file is **inside**, so its style change is
out of this comparison's scope by construction.

**Input capture (L5 / L16).** The 52-file `tests` list was expanded through **stdin-fed `xargs`**
(`xargs node --test < list`) — never `node --test $LIST` (zsh does not word-split, L5) and never
`xargs -a` (GNU-only; macOS `xargs` rejects it outright and the failure is captured as the gate result,
L16). `tests: 0` at both ends is the plausible reading for a repo whose full `npm run check` is green.

---

## A scope escape that was real, benign, and is now declared (not waved through)

`git diff 0323bf9` showed **`.dev/floor/check-lessons-index.mjs`** as changed — a file the approved plan
did **not** name. It was investigated rather than recorded (L16's discipline), and the finding is a
**defect in `/pharn-dev-build` itself**:

- **What changed:** whitespace only. Two `process.stdout.write(...)` calls re-joined onto single lines.
  `git diff` shows no semantic change.
- **What did it:** `/pharn-dev-build`'s **Step 2b**, whose text reads "run the project formatter over the
  **just-written files** — `npm run format`". But `npm run format` is `prettier --write .` — the **whole
  repo**. The instruction's stated scope and its actual command disagree.
- **Why fix #7 did not stop it:** prettier runs through **Bash**, and the writes-scope hook gates only
  `Write|Edit|MultiEdit`. This is the _documented_ boundary of fix #7, reached from the inside by one of
  PHARN's own stages.
- **It is a repair, not damage — verified live.** A worktree at `0323bf9` was checked out and
  `prettier --check .dev/floor/check-lessons-index.mjs` **fails** there. That commit was pushed
  format-RED, so both `npm run check` and CI's `Format check` step would have failed on it. Step 2b
  incidentally fixed it.
- **Resolution:** the path was **declared** in the plan's `## Files` with this reasoning, and `scope`
  re-run → exit **0**, `escaped: []`. Not reverted (that would re-red the style gate at HEAD) and not
  left silent (an undeclared write is L7's dangerous direction). The plan record now matches what the
  increment actually wrote.

**This is a lesson candidate, not a one-off:** every increment that writes any file runs Step 2b, so any
unformatted file anywhere in the repo gets silently swept into that increment's diff. It will recur.

---

## Honest residual (P0/P7)

`/pharn-dev-regress` catches **exactly what its suite catches — nothing more.** The claim is
"deterministically-detectable breakage outside the feature is caught," **never** "nothing broke." Two
concrete blind spots for this increment: the new ✧ CI-wiring guard's _usefulness_ is invisible here (it
passes at base and head alike, because base already had the wiring), and nothing in this comparison can
tell whether the CLAUDE.md prose edits are accurate — that is `/pharn-dev-review`'s advisory job.

**Two clocks:** the **verdict** is floor-grade (`check-regress.mjs` comparing exit codes). Choosing the
base, partitioning inside/outside, running the suite, and the reasoning that declared the formatter's
escape are all **advisory orchestration** — the layer L5, L16 and L17 all exist to warn about, and the
layer that produced this run's one real surprise.
