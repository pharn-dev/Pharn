# REGRESSION — template-mask-nesting-3

- **Base (fork point):** `0c40e64` = `merge-base(HEAD, origin/main)` = parent of the feature commit
  `d40661a`. Working tree dirty (dogfood refinements on top of `d40661a`), so the feature-under-test is
  `0c40e64 → working tree` (commit + uncommitted edits together).
- **Verdict (deterministic, `.dev/floor/check-regress.mjs verdict`):** **`no-regressions`** (exit 0).

## Inside / outside partition (deterministic, `check-regress.mjs scope`; exit 0, no fix#7 escape)

- **Inside (15 declared build files, all ⊆ the plan's `## Files`):** the 5 `scan-code-*.mjs` scanners +
  their 5 `.test.mjs` + the 5 `pharn-review/*` lens docs. (The pipeline's own artifacts —
  `PLAN.md`, `GRILL.md` — are excluded from `--changed`: they are stage bookkeeping, not build outputs
  subject to the fix#7 `## Files` cross-check.)
- **Outside:** 41 test files + 1 committed eval pair (`structural:trust-fence`).

## Per-gate exit codes (base → head)

| gate                     | base | head | regression? |
| ------------------------ | ---- | ---- | ----------- |
| tests (41 outside files) | 0    | 0    | no          |
| validate (whole-repo)    | 0    | 0    | no          |
| structural:trust-fence   | 0    | 0    | no          |

- **regressions[]:** none
- **pre_existing[]:** none
- **Style gates (`lint` / `format:check` / `lint:md`): SKIPPED** — deterministic config-touch rule: the
  feature touches no shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`,
  `.markdownlint-cli2.jsonc`), so a style flip over the byte-identical outside files is provably
  impossible.

## Method note (L5 — honest, so the verdict is trustworthy)

The outside-test gate was run over a **zsh array** (`node --test "${(@f)$(cat outside-tests.txt)}"`), not
`xargs -a` (macOS BSD `xargs` has no `-a` flag) and not an unquoted `$LIST` (zsh does not word-split
command substitution). An earlier BSD-`xargs -a` attempt fabricated a false `tests=1` at **both** sides
— an L5-class false `pre_existing` red that would have MASKED a real tests regression; it was caught and
the capture re-run, yielding the honest `tests: 0 → 0` above.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

Honest residual (P0/P7): `/pharn-dev-regress` catches **exactly what its suite catches — nothing more.** A
regression outside the feature that no deterministic check covers is invisible. This certifies the
`0c40e64 → head` exit-code comparison over the named outside gates, **not** that "nothing broke."
