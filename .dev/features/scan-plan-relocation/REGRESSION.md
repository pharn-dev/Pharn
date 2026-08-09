# REGRESSION — scan-plan-relocation (F2)

Base: `24a43d6c61532efadb52ce9c386428d4fae339c3` (working-tree dogfood → `base = HEAD`, resolved by the
deterministic state test: `git status --porcelain` non-empty).

## Partition (computed by `pharn/floor/check-regress.mjs scope`, not by judgment)

| set                  | count | note                                                                          |
| -------------------- | ----- | ----------------------------------------------------------------------------- |
| `inside`             | 43    | `git diff --name-only HEAD` + untracked-new                                   |
| `outside_tests`      | 54    | the 60-file test universe minus the 6 inside                                  |
| `outside_eval_pairs` | 1     | `expected-injection-comment.json` ↔ `.dev/features/trust-fence/findings.json` |
| `escaped`            | 0     | **no path outside the plan's `## Files`** — `scope` exit 0                    |

The 6 **inside** tests are exactly the five relocated `pharn/floor/scan-plan-*.test.mjs` plus
`pharn/floor/validate.test.mjs` — correctly excluded from the outside gate, since a test the increment
changed cannot answer "did anything else break".

**Two declarations were added to the `--declared` list, and both are stated rather than assumed.**
(1) `pharn/pharn-pipeline/grillers/**/*.json` alongside the plan's `**/*.md`, because the cite rewrite
touched four eval-judge `.json` fixtures. (2) `.dev/features/scan-plan-relocation/**`, this feature's own
pipeline artifacts, which sibling stages wrote under **their own** Step-0 scopes by design — the
`.dev/memory-bank/lessons-learned.md` **L17** correction, without which a `base = HEAD` dogfood reports
every sibling stage's output as "the build escaped its `## Files`". Note the ten `git mv` sources did
**not** need declaring: git recorded the moves as renames (`R093`–`R098`) and `--name-only` reports only
the destination, so no `.dev/floor/` deletion entered `inside`.

## Gate results (exit codes; identical gate set both sides)

| gate                                    | base | head | result    |
| --------------------------------------- | ---- | ---- | --------- |
| `tests` (54 outside test files)         | 0    | 0    | no change |
| `validate`                              | 0    | 0    | no change |
| `structural:expected-injection-comment` | 0    | 0    | no change |

- **Style gates deterministically SKIPPED.** `inside` touches no shared style config
  (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so over
  outside files that are byte-identical at base and head a style flip is provably impossible. Absent
  from **both** maps, so no gate-set mismatch. This also avoided an `npm ci` in the baseline worktree.
- **The test list was expanded through stdin `xargs`** (`xargs node --test < list`), never
  `node --test $LIST` — under zsh the unquoted form passes the whole list as one bogus path and
  fabricates a red equal at base and head, which masks a real tests-gate regression (**L5**), and never
  `xargs -a`, which is GNU-only and fails outright on macOS (**L16**). The baseline came back green on a
  known-green repo, which is the expected shape rather than a suspicious one.

## `regressions[]` / `pre_existing[]`

Both empty.

## Verdict (FLOOR — a deterministic exit-code comparison, zero LLM judgment)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
`check-regress.mjs verdict` → `"no-regressions"`, exit **0**.

**The honest residual (P0/P7):** this catches exactly what the suite catches, and nothing more. A
regression no deterministic check covers — a broken behavior with no test, rule, or eval — is invisible
here. The claim is "deterministically-detectable breakage outside the feature is caught", **never**
"nothing broke". The verdict certifies the comparison, not the feature.

One granularity limit worth naming for this increment specifically: `validate` is whole-repo, so its
`0 → 0` says the floor is green at both ends, not that any particular file is unaffected. The
per-file precision lives in the scoped `tests` and `structural:*` gates.
