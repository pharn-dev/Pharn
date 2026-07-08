# REGRESSION — loop-cap-honesty

Did building this feature break anything **OUTSIDE** the feature?
**Verdict (FLOOR — `.dev/floor/check-regress.mjs verdict`, exit 0): `no-regressions`** — no
deterministically-detectable breakage outside the feature.

## Base + partition

- **Base:** `HEAD` (`da3b2fd39ddc8779e2ee14f936a4dcab60ab356c`) — auto-detected: `git status --porcelain`
  is non-empty (a working-tree dogfood build), so `base = HEAD` and the uncommitted edit is the feature
  under test.
- **Inside (changed scope):** `.claude/commands/pharn-loop.md` — ⊆ the plan's declared `## Files`
  (`scope` exit 0, `escaped: []`). The pipeline artifacts under `.dev/features/loop-cap-honesty/`
  (PLAN.md, GRILL.md, this report) are correctly **not** in `inside` — they are stage artifacts, not the
  build's changed scope (avoids the false-positive scope breach).
- **Outside gate set (run identically at base and HEAD):** the 46 tracked `*.test.{mjs,cjs}` files
  (`tests`), whole-repo `validate`, and the one committed eval pair `structural:trust-fence`
  (`pharn-review/trust-fence/evals/expected/expected-injection-comment.json` ↔
  `.dev/features/trust-fence/findings.json`).
- **Style gates (`lint` / `format:check` / `lint:md`): SKIPPED** (deterministic, P5/P7) — `inside` touches
  no shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`,
  `.markdownlint-cli2.jsonc`), so an outside style result cannot flip; no `npm ci` incurred.

## Per-gate exit codes (base → head)

| gate                     | base | head | result |
| ------------------------ | ---- | ---- | ------ |
| `tests` (46 outside)     | 0    | 0    | OK     |
| `validate` (whole-repo)  | 0    | 0    | OK     |
| `structural:trust-fence` | 0    | 0    | OK     |

- **regressions[]:** none
- **pre_existing[]:** none

## Why no outside gate could flip

The feature changed exactly one file — `.claude/commands/pharn-loop.md` — which is **floor-ignored** by
`validate` (`.claude/commands/` is excluded) and is **imported / referenced by nothing** outside itself
(it is orchestration prose, not code). No outside test, no `validate` check, and no eval pair reads it,
so every outside gate is byte-identical at base and HEAD.

**Honest residual (P0/P7):** `/pharn-dev-regress` catches exactly what its deterministic suite catches —
nothing more. `no-regressions` means "no deterministically-detectable breakage outside the feature,"
**not** "nothing broke" and **not** a judgment that the increment is good (that is the human's GATE-2
call).
