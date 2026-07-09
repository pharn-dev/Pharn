# SHIP — check-config-routing (gated chain roll-up)

Increment: fix three model-routing gaps in `.dev/floor/check-config.mjs` (harden `resolveStage` against
a prototype-chain leak, add a bidirectional agreement reverse-scan, correct overstated "allowlist"
wording). Gated `/pharn-dev-ship` — advisory orchestration; each proceed decision read from the named
**floor verdict**, never agent judgment. **No new floor primitive** (gated mode); every guarantee
belongs to a sub-stage.

## Stages run, in order, and where the run ended

| stage           | structural verdict read                        | value (verbatim)              | proceed? |
| --------------- | ---------------------------------------------- | ----------------------------- | -------- |
| plan (GATE 1)   | human approval halt                            | **Approved as written**       | ✓        |
| grill           | (advisory — no structural verdict; gates none) | ADVISORY: 0 blocking, 4 minor | ✓        |
| build           | `validate.mjs .` exit code                     | **0** (GREEN, 36 caps)        | ✓        |
| regress         | `regression-report.json` `.verdict`            | **"no-regressions"**          | ✓        |
| verify          | `verify-report.json` `.verdict`                | **"PASS"**                    | ✓        |
| review (GATE 2) | (advisory — no structural verdict; LLM sev.)   | GREEN advisory, 0 blocking    | HALT     |

**Ended at GATE 2** — the post-review human decision (merge / fix / abandon). Not a RED-verdict STOP:
every floor verdict along the chain was GREEN.

## Floor verdicts (the guarantees — each owned by its sub-stage)

- **build → `validate.mjs .` exit `0`** (GREEN, 36 capabilities over the product surface).
- **regress → `.verdict` = `"no-regressions"`** (`check-regress.mjs verdict` exit 0): 45 outside test
  files + whole-repo `validate` + 1 committed eval pair, each `base→head` `0→0`; no pass→fail flip.
  Base `fcd568f4ced8922511d05c7a4a0506d37c93c2cd`.
- **verify → `.verdict` = `"PASS"`** (`check-verify.mjs` exit 0): gates `test`/`validate`/`lint`/
  `format:check`/`lint:md` all exit 0; `failing_gates: []`; 0 verifiers registered (floor gates only).

## Advisory artifacts (cited, not restated — P4)

- **`.dev/features/check-config-routing/REVIEW.md`** — 4 principle-lenses; floor GREEN; **0 blocking**
  findings; 1 advisory (P3 bundling, already weighed at GATE 1); a proposed (not promoted) memory-bank
  lesson on own-property keyed lookups.
- **`.dev/features/check-config-routing/GRILL.md`** — advisory; 0 blocking, 4 minor concerns; all three
  constructive ones (fail-closed `readdirSync`, reuse `frontmatterModelEffort`, a negative skip-test)
  were folded into the build.

## Files changed by the build (writes-scope confined it to exactly these — fix #7)

- `.dev/floor/check-config.mjs`
- `.dev/floor/check-config.test.mjs` (+4 tests; 15 → 19 cases; `npm test` 717 total, 0 fail)

(The `.dev/features/check-config-routing/**` artifacts are the pipeline's own audit trail, written by
the plan/grill/regress/verify/review/ship stages under their own per-stage scopes.)

---

Chain ran; the named floor verdicts are as shown — this is **NOT** a judgment that the increment is good
or wise; that is the human's call at the post-review gate.
