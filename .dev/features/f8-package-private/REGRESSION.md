# REGRESSION — f8-package-private

**Base:** `HEAD` (working-tree dogfood — `git status --porcelain` was non-empty, so base = HEAD per
the deterministic auto-detect rule).

## Partition

- **Inside (changed scope):** `.dev/features/f8-package-private/GRILL.md`,
  `.dev/features/f8-package-private/PLAN.md`, `package.json`
- **Declared (`## Files` in the approved plan):** `package.json`
- **Escaped:** none
- **Escape-exempt (this feature's own stage artifacts, per `--feature`):**
  `.dev/features/f8-package-private/GRILL.md`, `.dev/features/f8-package-private/PLAN.md`
- **Style-gate skip:** applied — `inside` touches no shared style config
  (`eslint.config.mjs` / `.prettierrc.json` / `.prettierignore` / `.markdownlint-cli2.jsonc`), so
  `lint` / `format:check` / `lint:md` are provably unable to flip outside the feature and were skipped
  at both base and head.

## Outside gates run (base → head)

| gate                                                                                       | base | head |
| ------------------------------------------------------------------------------------------ | ---- | ---- |
| `tests` (63 outside `*.test.mjs`/`*.test.cjs` files)                                       | 0    | 0    |
| `validate` (`pharn/floor/validate.mjs .`)                                                  | 0    | 0    |
| `structural:pharn/pharn-review/trust-fence/evals/expected/expected-injection-comment.json` | 0    | 0    |

## Regressions

None.

## Pre-existing failures

None.

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

This certifies only the comparison: every gate this suite runs was green at the pre-build baseline and
stays green at HEAD. It does not certify the feature itself is correct or complete — it catches exactly
what the deterministic suite covers, nothing more (P0).
