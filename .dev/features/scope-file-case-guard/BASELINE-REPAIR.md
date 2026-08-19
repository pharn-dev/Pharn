# BASELINE-REPAIR — pre-increment, NOT part of the scope-file-case-guard increment

This file exists to **declare a writes-scope** for a baseline repair the human directed at GATE 1, so
the write passes fix #7 rather than bypassing it. It is deliberately **not** a PLAN: it goes through no
grill/build/verify/review, and its one file is deliberately **absent** from
`.dev/features/scope-file-case-guard/PLAN.md`'s `## Files` — the human chose "fix them first, then
proceed" over "fold the fixes into this increment", keeping the increment to one axis of change (P3).

## Why (P7 — the trigger has genuinely fired, and it is a real failure, not a hypothetical)

`.markdownlint-cli2.jsonc` globs `**/*.md`, and markdownlint-cli2 descends into dot-directories — a
fact the config's own comment already records as VERIFIED LIVE. Six untracked scratch files under
gitignored `.pharn/` therefore fail `lint:md` (exit 1), and through it the
`style: a spliced README passes the repo's prettier and markdownlint unchanged` test in
`.dev/floor/capability-catalog-core.test.mjs`. That is L11's exact shape: a whole-repo style gate red,
caused by files unrelated to any increment, blocking **every** later feature's `/pharn-dev-verify`.

The existing `.pharn/lessons-index.md` entry stays: its comment records the narrower, load-bearing
reason (a `--fix` pass would rewrite the product index cache and make its drift checker report STALE
over damage the linter itself caused). This entry is the broader, newly-triggered one.

## Files

- `.markdownlint-cli2.jsonc` — add `.pharn/fixes` and `.pharn/FABLE_REVIEW.md` to `ignores`

**One path beyond the literal instruction, and why.** The human authorized `.pharn/fixes`. That cleared
five of the six offenders; the sixth, `.pharn/FABLE_REVIEW.md`, sits at the `.pharn/` **root** and is a
**byte-identical duplicate** of `.pharn/fixes/FABLE_REVIEW.md` (verified live). It was added as a second
**named** entry rather than by (a) widening to a blanket `.pharn/`, which would put a standing waiver
over the directory that also holds the load-bearing product-index cache, or (b) deleting the duplicate,
which is a destructive act on a human's file that no instruction asked for. The exclusion therefore
stays an enumerated list of known scratch. Flagged here so the widening is visible, not silent.

### Deliberately NOT in scope

- `pharn.config.json` — Red A; the human reverted it by hand before this run continued
  (`check-config.mjs validate` → GREEN, verified live).
- Everything in `.dev/features/scope-file-case-guard/PLAN.md`'s `## Files` — that is the increment,
  and it is scoped separately from its own plan.

## Guarantee audit (P0)

- **The write lands only in `.markdownlint-cli2.jsonc`** → **FLOOR: hook** (fix #7,
  `set-writes-scope.cjs --from-plan` + `enforce-writes-scope.cjs`).
- **`lint:md` returns to exit 0** → **FLOOR: the gate's own exit code**, measured after the edit, never
  assumed.
- **That ignoring `.pharn/fixes` is the RIGHT call rather than merely an effective one** → **ADVISORY.**
  It is a human decision made at GATE 1; no checker reads it.

## Measured result (P6 — read live after the edit, never assumed)

```text
lint:md        → 0   (was 1)
format:check   → 0   (was 1, Red A; reverted by the human)
check:badge    → 0
docs:check     → 0
check:markers  → 0
validate       → 0
npm test       → 0   1407 tests, 1407 pass, 0 fail   (was 1405 pass / 2 fail)
```

Both baseline reds are cleared, so a later `/pharn-dev-verify` FAIL can no longer be attributed to
pre-existing state — which is the entire point of repairing them **before** the increment rather than
inside it.
