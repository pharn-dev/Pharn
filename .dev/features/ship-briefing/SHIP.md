# SHIP — ship-briefing

**Stages run, in order:** `/pharn-dev-plan` → [human approved, GATE 1] → `/pharn-dev-grill` → `/pharn-dev-build` →
`/pharn-dev-regress` → `/pharn-dev-verify` → `/pharn-dev-review`. **Ended at GATE 2** (post-review, this record).

**GATE 1.** Plan approved as written via interactive form (artifact filename `BRIEFING.md`, `minor`
version bump, ADVISORY paragraph invoked inline — all three confirmed). Mid-build, the plan was amended
once (a discovered file, `pharn/floor/check-regress.mjs`, added to `## Files`) — re-approved by
re-running the writes-scope setter, not silently.

**Each structural verdict read, verbatim:**

- `/pharn-dev-grill` → advisory only, gates nothing. 5 concerns raised (3 important, 2 minor) — folded into
  the build (see `.dev/features/ship-briefing/GRILL.md`).
- `/pharn-dev-build` → `node pharn/floor/validate.mjs .` → `GREEN — 36 capabilities checked` (unchanged).
- `/pharn-dev-regress` → `regression-report.json` `.verdict` = `"no-regressions"`.
- `/pharn-dev-verify` → `verify-report.json` `.verdict` = `"PASS"` (`test`, `validate`, `lint`,
  `format:check`, `lint:md` all exit 0; `verifiers.registered: 0`).
- `/pharn-dev-review` → advisory only, gates nothing. GREEN — 0 blocking floor-gate findings, 3 advisory
  findings (2 important, 1 minor), all found and **fixed within the same review**: a fenced-evidence
  verdict-line shadow (a trust-fence gap in `grillVerdictLine`), a line-wrap truncation of the same
  function (found only by rendering the real HALT-2 demo), and this feature's own `GRILL.md` deviating
  from the sampled verdict-line convention. `/pharn-dev-regress` and `/pharn-dev-verify` were each re-run
  after every fix and stayed unchanged (still `no-regressions` / `PASS`).

**Pointers (cited, not restated — P4):** `.dev/features/ship-briefing/PLAN.md`, `GRILL.md`,
`REGRESSION.md`, `regression-report.json`, `VERIFY.md`, `verify-report.json`, `REVIEW.md`.

**`npm run check`:** clean (1378/1378 tests passing) at the point this record was written.

**What was built:** a new contract (`pharn/pharn-contracts/ship-briefing.md`), two new floor scripts
(`pharn/floor/render-ship-briefing.mjs`, `pharn/floor/check-ship-briefing.mjs`) with their `node --test`
suites (45 tests, 97.9% aggregate line coverage), one edited command (`.claude/commands/pharn-ship.md` —
new Step 2c), one edited pre-existing floor file (`pharn/floor/check-regress.mjs`, one array entry), and
the meta files (`SKILLS_VERSION` 2.5.5 → 2.6.0, `CHANGELOG.md`, `README.md` badge + regenerated
CURRENT-STATE block, `CLAUDE.md`). `/pharn-ship` now renders `features/<name>/BRIEFING.md` at GATE 2 —
see `pharn/pharn-contracts/ship-briefing.md` for exactly what it is and is not.

**The standing decision is the human's.** This record states that the chain ran and its floor verdicts
are as shown — it is **not** a self-issued "shipped", an approval, or a `PHARN ✓ reviewed` seal. Chain
ran; the named floor verdicts are as shown; this is NOT a judgment that the increment is good or wise —
that is the human's call at this post-review gate.
