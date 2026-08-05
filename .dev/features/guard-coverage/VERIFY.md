# VERIFY — guard-coverage

**Machine report:** `.dev/features/guard-coverage/verify-report.json`.

---

## Verdict (FLOOR — `pharn/floor/check-verify.mjs`, exit 0)

**VERIFIED: floor gates PASS.**

| gate           | exit | note                                                             |
| -------------- | ---- | ---------------------------------------------------------------- |
| `test`         | 0    | 903 tests, 0 failures — 898 → 903 (+1 CI guard, +4 CLI branches) |
| `validate`     | 0    | `FLOOR: GREEN — 36 capabilities checked`                         |
| `lint`         | 0    | eslint clean                                                     |
| `format:check` | 0    | prettier clean, whole-repo (L9) — see the note below             |
| `lint:md`      | 0    | markdownlint clean, whole-repo (L9)                              |

`failing_gates[]`: empty. These five are exactly the repo's `npm run check` aggregate, so the verdict
tracks the full aggregate gate. **No `structural:*` gate** — this increment ships no `role:`-bearing
capability, hence no `evals/expected/*` ↔ committed-actual pair; the feature-specific signal is entirely
its own `*.test.mjs`, collected by `npm test`.

**`format:check` is green here for a reason worth stating.** At the base commit `0323bf9` it was **RED**
(`.dev/floor/check-lessons-index.mjs` failed `prettier --check`, verified live in a worktree — see
`REGRESSION.md`). `/pharn-dev-build`'s Step 2b repaired it as a side effect. So this gate went red→green
across the increment; had it been left alone, **L11 would have applied in full** — a pre-existing
whole-repo style red blocks _every later feature's_ verify, not just this one's.

---

## Advisory layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.

**No verifiers registered — floor gates only.** Step 2 is a no-op, membership is a deterministic
frontmatter read (never a prose grep — L6), and none is authored speculatively (P7). Nothing advisory
contributed to the verdict, and no untrusted verifier free-text was produced.

---

## What the 5 new tests actually pin (advisory reading of a floor-green gate)

`test: 0` is the floor fact; naming the coverage matters more than the count.

**The ✧ CI-wiring guard (1 test).** Asserts `ci.yml` contains a step whose `run:` is `npm run docs:check`
**and** that the step carries the install-gated `if:` its siblings use. **Measured rejecting** before
being trusted (L4): the matcher was run against the real file and two mutations — `if: false` → FAIL,
`run:` reverted to the direct catalog call → FAIL, real file → PASS. Honest scope: that proof was
in-memory over the real bytes, which establishes the **matcher** discriminates; the file-reading half is
exercised by the passing test itself. What stays uncheckable from in-repo — GitHub actually executed the
job, the workflow is enabled, branch protection requires it — is harness-layer, the `LIMITS.md §1d`
boundary. **"The wiring is pinned" never means "CI is guaranteed to run it."**

**The CLI branch tests (4 tests).** Cover the two `main()` branches commit `0323bf9` shipped untested,
exercised through `spawnSync` since `main()` calls `process.exit`: GREEN (exit 0, no `FIX:` line), DRIFT
(exit 1, "out of date", FIX = regenerate), ENUM_ERROR (exit 1, "canonical input is invalid", FIX names
the canon file), and fail-closed on a bad target dir. The ENUM_ERROR test carries the **negative** that
matters most — the regenerate remedy must **not** be offered — and it was **measured failing** against
the pre-`0323bf9` checker, which answered a duplicate-id canon with _"FIX: regenerate and commit"_, an
instruction that cannot succeed because the generator refuses on the same invalid input. A floor tool
prescribing an impossible remedy is a floor tool lying quietly; that is now pinned shut.

---

## Honest residual (P0/P7)

**"Verified" = the named gates passed — nothing more.** What these gates cannot see:

- **Whether the CLAUDE.md prose is accurate.** The increment's central act is a documentation claim about
  a floor op. `format:check` proves it is well-formatted, not that it is true. That is L2's territory and
  it remains a `/pharn-dev-review` judgment, not a floor op — the increment pins the _wiring_, not the
  _claim_.
- **Whether the `&&` short-circuit documentation matches behavior.** Asserted in prose, unpinned.
- **Whether the sweep's repaired indentation changes agent behavior.** Command prose is not executable and
  `.claude/commands/` is outside `validate.mjs`'s scan; nothing verifies it is read as intended.

**Two clocks:** the verdict is floor-grade (`check-verify.mjs` comparing integers); running the gates,
composing the gate set, and assembling this report are advisory orchestration.
