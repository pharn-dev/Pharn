# REGRESSION — seam-build-wiring

- **Base:** `HEAD` (working-tree dogfood build — the seam-resolver increment is already committed at HEAD, so the change under test is exactly the `pharn-build.md` edit + this feature's artifacts).
- **Verdict (deterministic, `.dev/floor/check-regress.mjs verdict`):** **`no-regressions`** (exit 0).

## Inside / outside partition (deterministic, `check-regress.mjs scope` — exit 0, `escaped: []`)

**Inside:** `.claude/commands/pharn-build.md` (the build's declared `## Files`, the one modified file) plus this feature's `PLAN.md` / `GRILL.md`. The product footprint (`pharn-build.md`) is `⊆` the declared writes — **no scope escape** (fix #7).

**Outside gate set (identical at base and HEAD):** the 46 tracked test files, whole-repo `validate`, and the `structural:trust-fence` eval pair. **Style gates SKIPPED** — `inside` touches no shared style config, so an outside style flip is provably impossible.

## Per-gate exit codes (base → head)

| gate                   | base | head | result |
| ---------------------- | ---- | ---- | ------ |
| tests                  | 0    | 0    | OK     |
| validate               | 0    | 0    | OK     |
| structural:trust-fence | 0    | 0    | OK     |

- **regressions[]:** none. **pre_existing[]:** none.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**

Honest residual (P0/P7): `/pharn-dev-regress` catches **exactly what its suite catches — nothing more.** Editing a command's prose (`pharn-build.md`) has no test/validate/eval surface of its own — `validate.mjs` deliberately ignores `.claude/` — so this comparison confirms only that the **rest of the repo's deterministic gates stayed GREEN with the edit present.** It does **not** certify the new Step 2c behaves correctly; that is `/pharn-dev-verify`'s gates + the human.
