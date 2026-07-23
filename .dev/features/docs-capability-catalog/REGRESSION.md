# REGRESSION — docs-capability-catalog

- Base (fork point): `c849f13` = `origin/main` (`git merge-base HEAD origin/main`)
- HEAD: `5d6429e` (feature branch `docs/capability-catalog`)
- Verdict source: `pharn/floor/check-regress.mjs verdict` (deterministic; exit `0`)

## Inside / outside partition (deterministic; `check-regress.mjs scope`)

- **Inside** (the changed scope, 50 paths): the 49 committed feature files + the untracked
  `regression-report.json`. `scope` confirmed **inside ⊆ declared writes** — `escaped: []`, no fix #7
  breach.
- **Outside gates run** (byte-identical at base and head): `tests` (47 outside test files),
  `validate` (whole-repo floor), `structural:trust-fence` (the one committed eval pair), and the three
  style gates `lint` / `format:check` / `lint:md` — run because the feature touched shared style config
  (`.prettierignore`, `.markdownlint-cli2.jsonc`), so a style flip was possible and had to be measured.

## Per-gate exit codes (base → head)

| Gate                     | base | head | result |
| ------------------------ | ---- | ---- | ------ |
| tests (47 outside files) | 0    | 0    | OK     |
| validate                 | 0    | 0    | OK     |
| structural:trust-fence   | 0    | 0    | OK     |
| lint                     | 0    | 0    | OK     |
| format:check             | 0    | 0    | OK     |
| lint:md                  | 0    | 0    | OK     |

- `regressions[]`: none
- `pre_existing[]`: none

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

Honest residual (P0/P7): `/pharn-dev-regress` catches exactly what its suite catches — nothing more. A
regression that no deterministic check covers (a broken behavior with no test/rule/eval) is invisible
here. The claim is "deterministically-detectable breakage outside the feature is caught," **not**
"nothing broke."

Note (surfaced for the human, not a verdict input): during this run external automation branched the
working tree onto `docs/capability-catalog` and committed the 49 feature files as `5d6429e`; the base
was therefore recomputed against the explicit fork point `c849f13` (= `origin/main`) rather than a
dirty-tree `HEAD`, so the comparison is pre-feature vs feature — the intended semantics.
