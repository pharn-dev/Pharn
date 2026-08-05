# REGRESSION — typed-lessons

**Base:** `8fc9124852ece30b3e9148904514c3de7a27eecf` — resolved by the deterministic state test (P5):
`git status --porcelain` was non-empty (a working-tree dogfood build), so `base = HEAD`.

## Partition

**Inside (build-attributable, 6 paths)** — exactly the plan's `## Files`, no more:

```text
.claude/commands/pharn-dev-memory-promote.md
.dev/floor/check-provenance.mjs
.dev/floor/check-provenance.test.mjs
CHANGELOG.md
CLAUDE.md
pharn/floor/check-plan-lessons.test.mjs
```

`check-regress.mjs scope` exited **0** — no changed path fell outside the declared writes, so there is no
fix #7 scope breach.

**Outside:** 49 test files + whole-repo `validate` + 1 committed eval pair
(`…/trust-fence/evals/expected/expected-injection-comment.json` ↔ `.dev/features/trust-fence/findings.json`).

### L17 applied — the escape set excludes this feature's own pipeline artifacts

`git diff HEAD` also listed `.dev/features/typed-lessons/PLAN.md` and `…/GRILL.md`. Those were **excluded
from `inside`** before calling `scope`, per `.dev/memory-bank/lessons-learned.md` **L17** (cited, not
restated — P4): `scope` computes a **changed-since-base** set, which with `base = HEAD` is not the same
question as **written-by-the-build**. Both files were written by sibling pipeline stages under their **own**
Step-0 writes-scopes (`/pharn-dev-plan` → `PLAN.md`, `/pharn-dev-grill` → `GRILL.md`) — by design, not escape.
Without the exclusion this run would have emitted two provably-false blocking `P0 fix#7` findings, which is
precisely the failure L17 documents. **Honest note:** the exclusion is **advisory orchestration** — I applied
it; nothing on the floor enforces it, and L17's deeper remedy (derive "written by the build" from
`.pharn/writes-scope.json` rather than from the diff) is still unbuilt.

## Per-gate exit codes

| gate                                    | base | head | flip |
| --------------------------------------- | ---- | ---- | ---- |
| `tests` (49 outside test files)         | 0    | 0    | —    |
| `validate` (whole-repo)                 | 0    | 0    | —    |
| `structural:expected-injection-comment` | 0    | 0    | —    |

- **regressions[]:** _(empty)_
- **pre_existing[]:** _(empty)_

**Style gates (`lint` / `format:check` / `lint:md`) were SKIPPED at both base and head** — deterministic
skip rule: `inside` touches no shared style config (`eslint.config.mjs`, `.prettierrc.json`,
`.prettierignore`, `.markdownlint-cli2.jsonc`), so over outside files that are byte-identical on both sides
a style result cannot flip. The gate is absent from **both** maps, so the gate sets match and the comparison
is not inconclusive. (The increment's **own** new markdown is still ungated here — that is L9's territory and
`/pharn-dev-verify`'s whole-repo style gates own it.)

## L5 / L16 applied — how the `tests` list was expanded

The 49-path list was fed to `node --test` through **stdin** `xargs`:

```bash
xargs node --test < .pharn/pharn-dev-regress/outside-tests.txt
```

Not `node --test $LIST` (L5: under zsh, the macOS default shell, an unquoted expansion is **not**
word-split — the whole list becomes one bogus path → exit 1 at both sides → a fabricated `pre-existing` red
that **masks** a real tests-gate regression), and not `xargs -a <file>` (L16: `-a` is a **GNU extension**
that macOS/BSD `xargs` rejects outright, reaching the same false red **through L5's own remedy**). The
baseline came back **green**, which is the expected result on a known-green repo — per L16, a red baseline
here would have been a signal to investigate the harness, never to record.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
(`check-regress.mjs verdict` → `"no-regressions"`, exit **0**.)

**The honest residual (P0/P7):** this catches **exactly what the suite above catches — nothing more**. A
regression no deterministic check covers is invisible to it. "No regressions" is **not** "nothing broke",
and it certifies only the **comparison** — never the feature. Two clocks: the verdict is floor-grade
(`check-regress.mjs` comparing exit codes); everything I did to produce its inputs — resolving the base,
partitioning inside/outside, applying the L17 exclusion, running the suite — is **advisory orchestration**.
