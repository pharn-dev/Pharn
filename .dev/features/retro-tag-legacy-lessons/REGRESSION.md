# REGRESSION — retro-tag-legacy-lessons

**Question answered:** did building this feature break anything **outside** it? Nothing else.

> **Re-run after the GATE-2 fix pass.** This report supersedes the first pass; the tree changed (two
> paths added to `## Files`), so the partition and gate set were recomputed rather than reused.

- **Base:** `45d742a9c3932f9d1e31c4bd25ae94e71533f175` (`docs: record observability as plan-side-only
(LIMITS §5) (#140)`) — resolved deterministically: `git status --porcelain` non-empty (working-tree
  dogfood), so `base = HEAD`.
- **Machine report:** `regression-report.json` — the helper's `verdict` JSON **verbatim** (byte-compared
  after writing).

## Inside / outside partition (floor — `check-regress.mjs scope`, exit 0)

`scope` returned **`escaped: []`** — every one of the 17 changed paths is declared in the plan's
(amended) `## Files`, so there is **no fix #7 scope breach**. **`escape_exempt` was also `[]`**: the
`--feature` exemption fired on nothing, because this plan declares its own pipeline artifacts
explicitly.

**Inside: 17 changed paths** — the 15 declared at GATE 1 plus the two the GATE-2 fix pass declared
(`.dev/floor/lessons-index-core.test.mjs`, `.claude/commands/pharn-dev-regress.md`). All 17 now exist and
have changed, so `inside` and `## Files` coincide exactly.

**Outside gates run:** **64** test files + `validate` + 1 committed eval pair.

> **The outside test count dropped 65 → 64, and that is correct, not a narrowing.**
> `.dev/floor/lessons-index-core.test.mjs` moved **into** the feature when the fix pass declared it, so
> it is no longer an outside gate. Comparing it base-vs-head would have compared two different files —
> the base worktree has no new drift guard in it.

## Per-gate exit codes — base → head

| gate                                                         | base | head | flip      |
| ------------------------------------------------------------ | ---- | ---- | --------- |
| `tests` (64 outside `*.test.mjs` / `*.test.cjs`)             | 0    | 0    | none      |
| `validate` (whole-repo — a named granularity limit)          | 0    | 0    | none      |
| `structural:…/expected-injection-comment.json` (trust-fence) | 0    | 0    | none      |
| `lint` / `format:check` / `lint:md`                          | —    | —    | _skipped_ |

**Style gates skipped, deterministically (P5), not overlooked.** The skip fires only when `inside`
touches a shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`,
`.markdownlint-cli2.jsonc`); none of the 17 paths does, so over the byte-identical outside files a style
flip is **provably impossible**, and the gates are absent from **both** maps — which is what keeps the
gate sets identical and the verdict conclusive. They still run at `/pharn-dev-verify`, at HEAD (L9).

## Input-capture defects found and corrected during this run (L5 / L16 / L21)

Recorded rather than quietly fixed. **Two distinct instances of the same class, in one stage, in one
increment** — which is itself the evidence L20 asks for.

**1 — a guessed eval-pair path (first pass).** The capture used
`…/evals/expected/injection-comment.json`; the committed file is
`…/evals/expected/**expected-**injection-comment.json`. `check-structural` returned `RED — expected.json
is unreadable … ENOENT`, recording **`structural: 1` at the baseline of a repo whose full
`npm run check` was green.** Being **equal at base and head**, it would have been classified
`pre_existing` — evading a false _regression_ while **masking a real** structural-gate one. Caught only
because the red was **investigated rather than recorded** (L16).

**2 — an invalid flag silently dropping half the input set (this pass).** `git ls-files --others
--exclude-standard -uall` — `-uall` is a **`git status`** flag, not a `git ls-files` one. `git` exited
with `unknown switch 'a'` and the brace group carried on, so **every untracked path vanished from
`inside`**, which came back as 9 instead of 17. In the first pass the same mistake was masked by a
`|| git ls-files --others --exclude-standard` fallback that quietly produced the right answer. Had it
gone unnoticed here, `scope` would have compared a **truncated** changed-set against `## Files` — the
failure mode is a **missed** escape, i.e. fail-open.

Both were caught by **asserting the expected cardinality** (L5's own prescription) — the first because
a green repo cannot have a red baseline, the second because 9 ≠ 17. The floor cores
(`check-structural.mjs`, `check-regress.mjs`) were **correct throughout**; only the inputs this
orchestration handed them were wrong. That is the two-clocks split with teeth: the **verdict** is
floor-grade, everything that produces its inputs is **advisory**.

**Remedies landed in this increment** (rather than left as a third reminder — L20): the eval pair is now
**named in full** in `/pharn-dev-regress.md` the way `/pharn-dev-verify.md` already named it, with an
explicit `test -r "$EXP"` pre-check so an unreadable path fails **as a setup error** instead of as a
gate verdict. The path-set collection was additionally checked for **directory-shaped entries** per
**L21** (none). A deeper fix — having `check-regress.mjs scope` **discover** committed eval pairs
itself rather than accepting a hand-typed `--eval-pairs` — is proposed as a lesson candidate in
`REVIEW.md`, not built here.

## Verdict (FLOOR — `check-regress.mjs verdict`, exit 0)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

`regressions[]` empty · `pre_existing[]` empty · `verdict: "no-regressions"`.

**Honest residual (P0).** `/pharn-dev-regress` catches **exactly what its suite catches — nothing more.**
A regression no deterministic check covers is invisible here. This verdict certifies **the comparison**,
never the feature: it does not mean "nothing broke," and it says nothing about whether the 17
retro-fitted `type`/`concepts` values are **apt**. The verdict is floor-grade; every step that produced
its inputs is advisory orchestration — as the two defects above demonstrate concretely, twice.
