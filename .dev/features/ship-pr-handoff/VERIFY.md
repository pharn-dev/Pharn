# VERIFY — ship-pr-handoff

## FLOOR layer — the deterministic gates (these OWN the verdict)

Run at HEAD, over the repo with the increment present. Exit codes only; no stdout free-text was read.

| gate                                           | exit |
| ---------------------------------------------- | ---- |
| `test` (`npm test` — the whole hermetic suite) | 0    |
| `validate` (`node pharn/floor/validate.mjs .`) | 0    |
| `lint` (eslint)                                | 0    |
| `format:check` (prettier, whole-repo — L9/L11) | 0    |
| `lint:md` (markdownlint, whole-repo — L9/L11)  | 0    |
| `structural:…/expected-injection-comment.json` | 0    |

The gate set is exactly the repo's `npm run check` aggregate plus the one committed eval pair, so the
verdict tracks the full `npm run check` (L9's coverage hole, closed at verify).

## ADVISORY layer — the verifier plug-in slot

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`. **Zero verifiers authored**
(P7 — the slot exists; no verifier is built speculatively), so there are no annotations this run. A
verifier finding could never have flipped the verdict anyway (fix #3).

## Verdict (FLOOR — `pharn/floor/check-verify.mjs`, exit 0)

**PASS** — every gate exited 0; `failing_gates[]` is empty.

Read verbatim from `verify-report.json`'s `.verdict`. This stage does not re-decide it.

## What PASS means, exactly (P0)

**PASS means the six named gates passed. It does NOT mean the increment is correct.** In particular, for
this increment specifically:

- **Nothing here tested the shipped behavior.** The increment is command prose — a new `## Step 2d` in
  `.claude/commands/pharn-ship.md`. `validate.mjs` deliberately ignores `.claude/commands/`, no eval covers
  it, and no `*.test.*` exercises it. The six green gates prove the repo is clean **with the prose in it**,
  not that the prose is right. This was raised at grill as finding F5 and is not resolved by a PASS.
- **The `structural:*` gate belongs to `trust-fence`, not to this feature.** This increment ships no eval
  pair, so its only feature-specific signal is the absence of breakage — which is what `/pharn-dev-regress`
  already reported.
