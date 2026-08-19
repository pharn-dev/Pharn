# REGRESSION — out-of-root-deny-message

**PASS 2** — re-run at the GATE-2 "fix" decision, after `REVIEW.md`'s F1/F2/F4 were closed. Both the
baseline and HEAD were **re-measured**, not carried over; the outside-test set was confirmed byte-identical
to pass 1 (67 suites) before either side ran, so the two passes are comparable.

**Base:** `c7361da79a6946263b1571a5d9d9cf806cce7f5d` — resolved by the deterministic state test, not by
choice: `git status --porcelain` was non-empty (a working-tree dogfood), so `base = HEAD`.

## Verdict (FLOOR — `check-regress.mjs verdict`, exit 0)

```json
{ "verdict": "no-regressions", "regressions": [], "pre_existing": [] }
```

**NO REGRESSIONS.** Nothing outside the feature that was passing at the baseline is failing at HEAD.
Unchanged from pass 1 — the F2 hook fix broke nothing outside the feature.

## The outside gates, base vs head

| gate                                         | base | head | flipped? |
| -------------------------------------------- | ---: | ---: | -------- |
| `tests` (67 outside suites)                  |    0 |    0 | no       |
| `validate`                                   |    0 |    0 | no       |
| `structural:expected-injection-comment.json` |    0 |    0 | no       |

The baseline ran in a detached `git worktree` at the base SHA (removed afterwards) — reproducible and
non-destructive. The gate set is identical on both sides, so the comparison cannot fail inconclusive on a
set mismatch.

**Style gates (`lint` / `format:check` / `lint:md`) were SKIPPED, and are absent from BOTH maps.** The
skip is deterministic, not a shortcut: `inside` touches no shared style config (`eslint.config.mjs`,
`.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`), and over outside files — byte-identical
at base and head — a style result can flip only when shared config changes. They still run for real at
`/pharn-dev-verify`, which is where the deterministic style gate lives (L9).

**The `tests` list was expanded with the pinned command line** — `cat outside-tests.txt | xargs node --test`
— not an improvised equivalent. The two forms L5 / L16 / L22 name (`node --test $LIST` under zsh, and the
GNU-only `xargs -a`) each fabricate a red that is **equal at base and head** and would therefore be
classified `pre_existing`, masking a real one. Both eval-pair paths were confirmed readable with `test -r`
**before** their exit code was recorded, so a setup error could not be laundered into a gate verdict (L21).

## The `scope` escape finding — recorded, then DISPROVEN (never waived)

`check-regress.mjs scope` exited **1** with a blocking `P0` fix#7 finding naming two escapes:

```text
escaped:        .claude/hooks/enforce-writes-scope.cjs
                .dev/features/out-of-root-deny-message/enforce-writes-scope.patch
escape_exempt:  .dev/features/out-of-root-deny-message/GRILL.md
                .dev/features/out-of-root-deny-message/PLAN.md
```

`.dev/memory-bank/lessons-learned.md` **L17** names this shape exactly — `scope` asks
**changed-since-base**, not **written-by-the-build** — and is equally clear that a fix#7 escape finding
must never be waved through, because that is the one finding that must not become routine. Each is
therefore disproven or accepted **with its own evidence**, measured live this run, and they do **not**
have the same disposition.

### Escape 1 — `.claude/hooks/enforce-writes-scope.cjs`: NOT a breach, disproven

1. **No agent write could have produced it.** `protect-trusted-paths.cjs` (fix #2) denies this path on
   every write tool — `Write` exit 2, `Edit` exit 2, `MultiEdit` exit 2, all probed this run.
2. **The live diff IS the reviewed patch.** `git diff -- .claude/hooks/enforce-writes-scope.cjs`
   `diff -q`-matches `.dev/features/out-of-root-deny-message/enforce-writes-scope.patch` byte for byte,
   and the resulting file hashes `9d64bef639831dbb…` — identical to the worktree copy that `npm run check`
   passed at exit 0.
3. **The PLAN pre-declared it**, by name, under `### Delivered as a human-applied patch (NOT
agent-written, NOT in the parsed scope)` at `PLAN.md:59`, with the fix #2 denial and the setter's
   `CONTROL_SURFACE` membership cited as the reasons.

The change was applied by the human on request. That is the designed workflow for a hook-protected file,
not a scope breach. **Improvement over the precedent, worth noting because the precedent asked for it:**
`writes-scope-lifecycle`'s REGRESSION.md recorded that its plan should have pre-declared this false
positive and did not, so the finding arrived unannounced. This plan did pre-declare it.

### Escape 2 — `.dev/features/…/enforce-writes-scope.patch`: PERMITTED, but genuinely UNDECLARED — **CLOSED at pass 2**

> **Pass-2 status: GONE from the escape list.** The GATE-2 "fix" decision declared the artifact in the
> PLAN's `## Files`, and `check-regress.mjs scope` re-run afterwards reports **one** escape where pass 1
> reported two. That shrink is the deterministic confirmation that `REVIEW.md` F4 is closed — the checker
> saying so, not the agent. The pass-1 analysis below stays on record unedited, because the declaration
> was added **after** the write and the trail should show that rather than read as if it were always there.

This one is **not** waved away, because it is a real, if benign, gap in this increment's own plan:

- **It was permitted, not smuggled.** The write happened under the **fail-closed `DEFAULT_SAFE_SET`**,
  which includes `.dev/features/**` by design; the build scope had been released first. fix #7 authorized
  it; no guard was bypassed and no scope was widened to reach it.
- **But the PLAN's `## Files` never named it**, so `scope` is right that a changed path is undeclared.
  This is the **L3 direction** (a declaration too narrow → friction), not the L7 one (too broad → power
  leak): the honest reading is that the artifact should have been declared, exactly as the precedent
  increment declared **both** of its `.patch` records in `## Files`.
- **Remedy, carried to `/pharn-dev-review`:** a stage that emits a `.patch` handoff record should declare
  that path in the plan like any other output. Not fixed here — retroactively editing `## Files` to
  authorize a path already written is the one move `check-regress.mjs`'s own honest-scope block warns
  gives up the detection entirely.

## What this stage guarantees, and what it does not (P0)

- **FLOOR:** the verdict is an exit-code comparison over the outside gates — zero LLM judgment in its core.
  A flipped gate would be a regression, full stop.
- **ADVISORY (mine):** choosing the base, partitioning inside/outside, deciding the gate set, running the
  suite. Only the comparison is a guarantee.
- **The named residual:** `/pharn-dev-regress` catches exactly what its suite catches. This says
  **"deterministically-detectable breakage outside the feature is caught"** — never "nothing broke."
