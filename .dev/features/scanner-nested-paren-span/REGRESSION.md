# REGRESSION — scanner-nested-paren-span

- base: `7af8dd867179a797d86be6b2fdef1358ba4f466c` (working-tree dogfood build → `base = HEAD`, by the
  deterministic `git status --porcelain` non-empty test)
- verdict source: `pharn/floor/check-regress.mjs verdict` — exit **0**
- machine report: `.dev/features/scanner-nested-paren-span/regression-report.json`

## Inside / outside partition

`inside` (10 paths — the 8 the plan's `## Files` declared, plus this feature's own pipeline audit
trail):

```text
pharn/floor/scan-code-injection.mjs           pharn/floor/scan-code-injection.test.mjs
pharn/floor/scan-code-path-traversal.mjs      pharn/floor/scan-code-path-traversal.test.mjs
pharn/floor/scan-code-ssrf.mjs                pharn/floor/scan-code-ssrf.test.mjs
SKILLS_VERSION                                CHANGELOG.md
.dev/features/scanner-nested-paren-span/PLAN.md
.dev/features/scanner-nested-paren-span/GRILL.md
```

`escaped`: **none** — no changed path fell outside the declared writes-scope (fix #7).

`outside_tests`: **47** suites — the whole `*.test.mjs` / `*.test.cjs` universe minus the three the
feature changed. `outside_eval_pairs`: none.

### One orchestration decision, recorded rather than buried (P6)

The first `scope` call exited **1** with two blocking fix#7 findings naming
`.dev/features/scanner-nested-paren-span/PLAN.md` and `GRILL.md` as escapes. That was a **false
positive of the partition inputs, not a build scope breach**: those two files are written by
`/pharn-dev-plan` and `/pharn-dev-grill` under **their own** writes-scopes (each set by
`set-writes-scope.cjs --from-frontmatter` and observed succeeding this run) — `/pharn-dev-build` never
wrote them, and its scope was pinned to exactly the 8 declared paths (`.pharn/writes-scope.json`,
`"set_by": ".dev/features/scanner-nested-paren-span/PLAN.md"`, 8 entries). The plan's `## Files`
deliberately omits the audit trail, following the established convention (see
`.dev/features/a11y-griller/PLAN.md`, whose `## Files` likewise omits it and states the reason). The
re-run added `.dev/features/scanner-nested-paren-span/**` to `--declared` and exited **0**. This is
**advisory orchestration** — the verdict below rests only on exit-code comparison.

## Per-gate exit codes (the floor comparison)

| gate       | base | head | flip |
| ---------- | ---- | ---- | ---- |
| `tests`    | 0    | 0    | none |
| `validate` | 0    | 0    | none |

Style gates (`lint` / `format:check` / `lint:md`) were **skipped** by the deterministic config-touch
rule: `inside` touches no shared style config (`eslint.config.mjs`, `.prettierrc.json`,
`.prettierignore`, `.markdownlint-cli2.jsonc`), so over the byte-identical outside files a style flip
is provably impossible. Skipped on **both** sides, so the gate sets match.

### A fabricated red, caught and discarded (lessons-learned L5, cite not restate)

The first baseline capture recorded `tests: 1`. It was **not** a real failure: the invocation used
`xargs -a <file>`, and macOS/BSD `xargs` has no `-a` option, so the runner never executed
(`xargs: invalid option -- a`). Left unexamined this would have produced a matching red at head, an
equal-both-sides `pre_existing` entry, and would have **masked** any genuine `tests` regression —
exactly the failure mode L5 names. Re-run portably (`xargs node --test < file`), both sides captured
**0**. Recorded because a silently-passing wrong number is the disease, not the fix.

## Result

`regressions`: **none**. `pre_existing`: **none**.

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

Honest residual (P0/P7): this catches **exactly what its suite catches — nothing more**. A regression
no deterministic check covers is invisible to it. The claim is "deterministically-detectable breakage
outside the feature is caught," **never** "nothing broke."
