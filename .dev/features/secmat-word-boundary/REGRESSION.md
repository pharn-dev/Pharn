# REGRESSION — secmat-word-boundary

**Base:** `b89f7794` (`fix(floor): the ship-briefing render→check round trip survives quotes and
backslashes (#155)`). The working tree was dirty at entry, so the base resolves to `HEAD` by the
deterministic state test — a working-tree dogfood, not a branch comparison.

## Inside / outside partition

**Inside (17 paths — what this increment was allowed to change):**

- `pharn/floor/scan-code-crypto.mjs`, `pharn/floor/scan-code-crypto.test.mjs` — the build outputs
- `SKILLS_VERSION`, `CHANGELOG.md`, `README.md` — the release-meta the bump requires
- `.dev/features/secmat-word-boundary/PLAN.md`, `GRILL.md` — pipeline artifacts, written by their own
  stages under their own Step-0 scopes

`check-regress.mjs scope` returned **exit 0** — no path escaped the plan's `## Files`. Its
`escape_exempt` names exactly the two feature-dir artifacts above, so the exemption was read rather
than assumed.

> **One input-capture correction, recorded rather than quietly fixed (L5 / L21).** The first `--declared`
> capture used a back-tick grep over the whole PLAN and swept in items from `## Contracts satisfied` and
> `## Evals to write` — 12 entries instead of 5. It exited 0, because an over-broad declared set makes the
> escape test **vacuous**, not loud. Re-derived from `set-writes-scope.cjs --from-plan`'s own
> deterministic `## Files` parse — the same parse the build was pinned to — and re-run. The recorded
> result above is the second run.

**Outside:** 67 test files, whole-repo `validate`, and the one committed eval pair
(`expected-injection-comment.json` ↔ `.dev/features/trust-fence/findings.json`). Both eval-pair paths
were confirmed readable at base and at head before their exit code was recorded, so an ENOENT could not
be mistaken for a gate verdict.

## Per-gate exit codes

| gate                                    | base | head | result |
| --------------------------------------- | ---- | ---- | ------ |
| `tests` (67 outside test files)         | 0    | 0    | stable |
| `validate` (whole-repo)                 | 0    | 0    | stable |
| `structural:expected-injection-comment` | 0    | 0    | stable |

**Style gates deliberately absent from both maps.** `lint` / `format:check` / `lint:md` were skipped by
the deterministic config-touch rule: `inside` touches none of `eslint.config.mjs`, `.prettierrc.json`,
`.prettierignore`, `.markdownlint-cli2.jsonc`, so over the outside files — byte-identical at base and
head — a style result cannot flip. Skipped on both sides, so the gate sets match.

- `regressions[]`: **empty**
- `pre_existing[]`: **empty**

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
(`check-regress.mjs verdict` → `"no-regressions"`, exit 0.)

The verdict is floor-grade: it is an exit-code comparison, not a judgment, and no model decided whether a
flip "really" counted. Everything around it — resolving the base, partitioning the scope, running the
suite — is advisory orchestration.

**The honest residual:** this catches exactly what its suite catches, nothing more. A regression no
deterministic check covers is invisible here. "No regressions" means the 69 named gates that were green at
`b89f7794` are still green — it does **not** mean nothing broke.
