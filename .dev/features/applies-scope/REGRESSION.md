# REGRESSION — applies-scope

Did building `applies-scope` break anything **outside** the feature? Pure exit-code comparison of the
existing deterministic suite at the pre-build baseline vs HEAD — the verdict is
`.dev/floor/check-regress.mjs`, not judgment (P0).

- **Base (pre-build):** `f245e9d` (working-tree dogfood → `base = HEAD`, deterministic auto-detect).
- **Inside (changed scope):** 37 files (13 grillers + 22 lenses + `validate.mjs` + `validate.test.mjs`) —
  exactly the plan's `## Files`. Scope partition: **`escaped: []`** — the build did **not** write outside
  its declared `## Files` (fix #7 held). The feature's own audit-trail dir `.dev/features/applies-scope/`
  (PLAN/GRILL/report) is excluded from the change-set — those are pipeline artifacts, not build outputs.
- **Style gates skipped (deterministic, P5/P7):** `inside` touches no shared style config
  (`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), so a style
  flip over the byte-identical outside files is provably impossible — gates skipped, no `npm ci`.

## Outside-gate results (base → head exit codes)

| gate                            | base (f245e9d) | head (working tree) | flip? |
| ------------------------------- | -------------- | ------------------- | ----- |
| `tests` (43 outside test files) | 0              | 0                   | no    |
| `validate` (whole-repo floor)   | 0              | 0                   | no    |
| `structural:injection-comment`  | 0              | 0                   | no    |

- **`regressions[]`:** none.
- **`pre_existing[]`:** none.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
(`check-regress.mjs verdict` → `"no-regressions"`, exit 0.)

**Honest residual (P0/P7):** `/pharn-dev-regress` catches **exactly what its deterministic suite catches —
nothing more.** A broken behavior with no test / rule / eval covering it is invisible here. This is
"deterministically-detectable breakage outside the feature is caught," **not** "nothing broke." It
certifies the **comparison**, never the feature as a whole.

## Capture note (transparency)

The first baseline/HEAD capture mis-ran the `tests` gate: the shell did not word-split the space-joined
file list, so `node --test` received it as one argument and errored (`Could not find …`) → exit 1 at
**both** sides. Because it failed **identically** at base and head, even that malformed run would not have
produced a false regression (1 → 1, no flip). It was corrected by piping the file list through `xargs`
(reliable arg-splitting), yielding the real result above: `tests` = 0 at both base and head, consistent
with `npm run check`'s 663/663 pass. The recorded `base-results.json` / `head-results.json` are the
corrected captures.
