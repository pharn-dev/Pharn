# REGRESSION — ship-attestation

**Verdict (FLOOR, `pharn/floor/check-regress.mjs verdict`): `no-regressions` (exit 0)** — no
deterministically-detectable breakage outside the feature.

## Base

`--base 5c6c17b` (the feature's fork point — the commit before the plan commit `8be3619`). **Why explicit,
not auto-detected:** the environment auto-committed the in-progress feature this session (`8be3619` plan,
`a45feb3` contract+checker+grill), so `HEAD` is **mid-feature**; the deterministic dirty-tree rule (base=HEAD)
would have measured only the uncommitted tail. `5c6c17b` is the true pre-feature baseline, so this regress
measures the **whole** feature's outside impact. (Orchestration choice — advisory; the verdict itself is
floor.)

## Inside / outside partition

- **Inside (the feature footprint, 9 files):** the 7 plan `## Files`
  (`pharn/pharn-contracts/ship-record.md`, `pharn/floor/check-attestation.mjs` + `.test.mjs`,
  `.claude/commands/pharn-ship.md`, `pharn.config.json`, `CHANGELOG.md`, `SKILLS_VERSION`) **plus** the
  feature's own pipeline trail `.dev/features/ship-attestation/{PLAN,GRILL}.md` (written by the plan/grill
  stages under their own writes-scopes — declared to `scope` as `.dev/features/ship-attestation/**`, not a
  build escape). `scope` reported `escaped: []` — the build did **not** write outside its `## Files` (fix #7).
- **Outside:** everything else. `git diff 5c6c17b` touches **only** the inside files, so the outside tree is
  byte-identical at base and head — no outside gate can flip by construction.

## Per-gate `base → head` exit codes

| gate                      | base | head | flip? |
| ------------------------- | ---- | ---- | ----- |
| tests (46 outside suites) | 0    | 0    | no    |
| validate (whole-repo)     | 0    | 0    | no    |
| structural:trust-fence    | 0    | 0    | no    |

- `regressions[]`: none.
- `pre_existing[]`: none.

## Honest residual (P0/P7)

`/pharn-dev-regress` catches **exactly what its deterministic suite catches — nothing more.** `no-regressions`
means no gate that was GREEN at `5c6c17b` went RED at HEAD; it is **not** a claim that "nothing broke."
`validate` is whole-repo granularity (a named limit). This certifies the **comparison**, never the feature.
