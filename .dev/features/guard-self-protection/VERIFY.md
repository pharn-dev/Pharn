# VERIFY — guard-self-protection

Did the feature get built **correctly**? Answered in two strictly separated layers: a FLOOR layer that
**owns** the verdict, and an ADVISORY verifier layer that may only annotate.

## FLOOR layer — the deterministic gates (these own the verdict)

All six run over the repo with the feature in it, at HEAD. Only exit codes are read; no stdout free-text
enters the verdict.

| gate                                           | exit | meaning                                |
| ---------------------------------------------- | ---- | -------------------------------------- |
| `test` (`npm test`)                            | 0    | 1118 tests, 1118 pass, 0 fail          |
| `validate` (`pharn/floor/validate.mjs .`)      | 0    | FLOOR: GREEN — 36 capabilities checked |
| `lint` (`npm run lint`)                        | 0    | eslint clean                           |
| `format:check` (`npm run format:check`)        | 0    | prettier clean, whole-repo (L9)        |
| `lint:md` (`npm run lint:md`)                  | 0    | markdownlint clean, whole-repo (L9)    |
| `structural:…/expected-injection-comment.json` | 0    | GREEN — 6 structural assertions passed |

This gate set is exactly the repo's `npm run check` aggregate plus `validate` and the committed eval
pair, so the verdict tracks the full `npm run check` — `npm run check` was confirmed separately at
**exit 0**.

**Build completeness (deterministic, `pharn/floor/check-build-complete.mjs`):** `"verdict": "complete"` —
all **10** paths declared in the plan's `## Files` exist on disk; `missing: []`, `skipped: []`. There is
no INCOMPLETE condition for `/pharn-dev-ship --loop` to retry.

> **Re-run after the post-review fixes.** This is the second `/pharn-dev-verify` pass. It follows the
> remedy for `REVIEW.md` F1 (the ✧ cross-copy agreement guard) and the correction of
> `pharn/floor/README.md`'s stale protected-set enumeration. Every gate above was recomputed from
> scratch; none was carried over.

## ADVISORY layer — verifier capabilities

`pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`. **Zero verifiers exist** (P7 — the
plug-in slot ships without speculative occupants), so the advisory layer contributes nothing this run and
the verdict rests on the floor gates alone. Had a verifier run, its findings would **annotate only** — a
verifier can never flip the verdict (fix #3).

## What this increment's own gates prove, specifically

The feature is two deterministic path checks, so its evals are its `*.test.cjs` (hooks carry no `role:`).
Within the `test` gate above, the two touched checkers were also measured directly:

- **63 tests, 63 pass** across `protect-trusted-paths.test.cjs` + `set-writes-scope.test.cjs` (13 → 63;
  **50 new**), including the four ✧ tests that pin the deliberate duplicate — the guards' control-surface
  lists — to the same set across all three copies. Those four were **measured rejecting three mutants**
  (L4: an authored assertion passes by construction), so the pin is known non-inert, not merely present.
- **Line coverage: `protect-trusted-paths.cjs` 97.53%, `set-writes-scope.cjs` 98.91%** — both above the
  90% bar (`node --test --experimental-test-coverage`; this repo has no `npm run coverage`).
- The **defect reproduction** from the report now inverts: the setter **refuses** (exit 1) and the
  trusted-path guard **denies** (exit 2) where all three steps previously returned 0.
- Verified **live, not only in tests**: a real `Write` to `.claude/settings.json` was denied by the hook
  **even though that path was in the active writes-scope** — which is the F3 closure itself, and the
  proof that the two guards compose independently.

## Verdict

**VERIFIED: PASS** — `check-verify.mjs` → `"verdict": "PASS"`, `failing_gates: []`, exit **0**.

**What that means, exactly (P0):** the named gates passed. It does **not** mean the increment is correct,
wise, or complete in any sense a deterministic check cannot see. `/pharn-dev-verify` closes the
Write/Edit/MultiEdit surface question its gates ask; the standing residuals — Bash-tool writes bypassing
`PreToolUse` entirely, and the setter's refusal being lexical rather than realpath-resolved — are
**named, not closed**, and no gate here tests them. Running the gates is advisory orchestration; only the
exit-code threshold is the guarantee.
