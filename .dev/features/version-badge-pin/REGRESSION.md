# REGRESSION — version-badge-pin

Base: `c583c1f11c13cee659b1ed9b259423c8c8467a6d` (working-tree dogfood — `git status --porcelain` was
non-empty, so the base resolves deterministically to `HEAD`, not a merge-base).

## Partition

**Inside (9 changed paths)** — the 7 the plan declared, plus this feature's own pipeline artifacts:

| Path                                       | Kind                      |
| ------------------------------------------ | ------------------------- |
| `.dev/floor/check-version-badge.mjs`       | declared — new checker    |
| `.dev/floor/check-version-badge.test.mjs`  | declared — new tests      |
| `README.md`                                | declared — badge          |
| `CHANGELOG.md`                             | declared — header + entry |
| `package.json`                             | declared — `check:badge`  |
| `.github/workflows/ci.yml`                 | declared — CI step        |
| `CLAUDE.md`                                | declared — docs           |
| `.dev/features/version-badge-pin/PLAN.md`  | stage artifact (exempt)   |
| `.dev/features/version-badge-pin/GRILL.md` | stage artifact (exempt)   |

**`escaped: []`** — `check-regress.mjs scope` exited 0. The build did **not** write outside the plan's
`## Files`. The two exemptions are listed in `escape_exempt` and were read rather than assumed: each is
written by its own stage under that stage's own Step-0 writes-scope, which is exactly the false-positive
class `.dev/memory-bank/lessons-learned.md` **L17** documents and **L20** demanded be given a floor
check. That check is doing its job here — this is the designed workflow, not an escape.

**Outside:** 62 test files, `validate` (whole-repo), and 1 committed eval pair
(`expected-injection-comment.json` ↔ `.dev/features/trust-fence/findings.json`).

## Gates — base → head

| Gate                                    | Base | Head | Flip |
| --------------------------------------- | ---- | ---- | ---- |
| `tests` (62 outside files)              | 0    | 0    | none |
| `validate`                              | 0    | 0    | none |
| `structural:expected-injection-comment` | 0    | 0    | none |

Gate-id sets are identical on both sides, so the comparison is not inconclusive.

**Style gates deliberately absent from both maps.** The deterministic skip rule ran: `inside` touches no
shared style config (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`,
`.markdownlint-cli2.jsonc`). This was checked rather than assumed — `package.json` **is** in `inside`,
and had prettier's config lived there the skip would have been unsound; it does not
(`require("./package.json").prettier` is `undefined`; the config is `.prettierrc.json`, which is in the
rule's list and untouched). Over outside files byte-identical at base and head, a style flip is then
provably impossible. Independently, the full `npm run check` — which does include `format:check`,
`lint`, and `lint:md` — was **exit 0 at the pre-build baseline and exit 0 at HEAD**, so the style
dimension is covered by direct observation as well as by the skip's argument.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
`check-regress.mjs verdict` exit **0**, `"verdict": "no-regressions"`, `regressions: []`,
`pre_existing: []`.

The verdict is floor-grade: it rests entirely on the helper comparing two exit-code maps, never on
judgment. Everything around it — choosing the base, partitioning, running the suite — is advisory
command-layer work.

**The honest residual (P0/P7):** this catches **exactly what the suite catches, and nothing more**. A
regression no deterministic check covers is invisible to it. The claim is "deterministically-detectable
breakage outside the feature is caught," **not** "nothing broke."
