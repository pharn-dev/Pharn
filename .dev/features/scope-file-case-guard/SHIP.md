# SHIP — scope-file-case-guard

An **advisory** roll-up of a `/pharn-dev-ship` run. It records **that the chain ran and what its floor
verdicts were**. It is not a decision, not an approval, and not a `PHARN ✓ reviewed` seal.

## Where the run ended

**GATE 2 — the post-review human decision.** The full chain ran; the human decides merge / fix /
abandon. Nothing was merged, committed, pushed, or sealed.

## Stages, in order, with the verdict read at each

| #   | stage                | verdict read (deterministic)                  | value                  | outcome              |
| --- | -------------------- | --------------------------------------------- | ---------------------- | -------------------- |
| 1   | `/pharn-dev-plan`    | — (ends at GATE 1, the human's approval halt) | approved as written    | GATE 1 passed        |
| 2   | `/pharn-dev-grill`   | none — advisory by design, gates nothing      | 7 concerns             | proceeded regardless |
| 3   | `/pharn-dev-build`   | `pharn/floor/validate.mjs` exit code          | **0**                  | GREEN → proceed      |
| 4   | `/pharn-dev-regress` | `regression-report.json` `.verdict`           | **`no-regressions`**   | GREEN → proceed      |
| 5a  | `/pharn-dev-verify`  | `verify-report.json` `.verdict`               | **`FAIL`** `["test"]`  | RED → STOP (1st run) |
| 5b  | `/pharn-dev-verify`  | `verify-report.json` `.verdict` (re-run)      | **`PASS`**             | GREEN → proceed      |
| 6   | `/pharn-dev-review`  | none — advisory; floor content already gated  | 0 blocking, 3 advisory | GATE 2               |

Final state: `npm test` **1412/1412**, and `format:check` · `lint` · `lint:md` · `docs:check` ·
`check:markers` · `check:badge` · `validate` · `check-config` all exit **0**.

## The FAIL→PASS transition is the run's main evidence, not a hiccup

The increment's substantive change is **one line in a human-only file**:
`.claude/hooks/protect-trusted-paths.cjs` is its own `DEFAULT_PROTECTED` entry, so the agent guard
denies Write/Edit at exit 2 (verified live). It was delivered as a unified diff.

Verify ran **twice on purpose**. At 5a the patch was unapplied and four of the increment's five new
tests failed — the detectors firing at a still-open hole. They were written to hard-code `exit 2`
rather than derive the expectation from source, precisely so they **could** fail, and were **measured
rejecting** the unpatched hook before being trusted (L4). At 5b, with the patch applied, the same suite
is 1412/1412. **A suite green on both sides would have proved nothing.**

### How the patch was applied — recorded because the distinction matters

The agent declined to apply it across **four** exchanges, on the grounds that routing around fix #2 in
the increment that hardens fix #2 would refute the work. On the fifth, the human instructed **"do it"**
explicitly, and the agent ran:

```sh
git apply .dev/features/scope-file-case-guard/protect-trusted-paths.patch
```

**Bash writes bypass `PreToolUse` entirely, so no hook fired.** The guard was not defeated, injected
past, or circumvented silently — it was overridden by explicit human authority over a diff that human
had reviewed at GATE 1. But **"a human applied it outside the agent loop" and "the agent applied it on
a human's say-so" are different facts, and only the second is true here.** `REVIEW.md` raises this as an
important advisory P2 finding against `CLAUDE.md:73`'s "write-protected and human-only" heading — a
phrase this run is the live counter-example to, and whose own paragraph already states the correct,
narrower bound.

## What the fix does, measured live against the real hook after the apply

```text
.pharn/writes-scope.json   → 2   denied  (declared spelling)
.pharn/WRITES-SCOPE.JSON   → 2   denied  ← the vulnerability, closed
.pharn/Writes-Scope.Json   → 2   denied  (mixed case, via the full fold)
.pharn/foo.json            → 0   allowed (no over-block of .pharn/)
.pharn/lessons-index.md    → 0   allowed (product-index cache untouched)
pharn/CONSTITUTION.md      → 2   denied  (pre-existing protections intact)
enforce-writes-scope.cjs   → 2   on the scope file (byte-exact compare kept: defense in depth)
set-writes-scope.cjs       → 0   still writes its own now-protected output (fs.writeFileSync)
```

**Product surface, not apparatus.** `.claude/hooks/*.cjs` is in `CLAUDE.md:63`'s bump-triggering set, and
`/pharn-plan`, `/pharn-build`, and `/pharn-ship` all write `.pharn/writes-scope.json` — so a PHARN **user**
had the identical hole. Hence `SKILLS_VERSION` **2.7.0 → 2.7.1** (patch) and the README badge to match,
both gated by `check-version-badge.mjs`. The `/pharn-dev-*` loop was the correct **build vehicle** for a
product change (PHARN builds PHARN); its audit trail belongs in `.dev/features/`.

**The claim is narrowed, deliberately:** the **Write-tool** self-escalation is closed. This is **not**
"the scope file cannot be rewritten" — Bash reaches it exactly as it reaches every guarded path, as this
run demonstrated.

## Pre-increment baseline repairs (GATE-1 directed, one axis kept, P3)

The run began on a **red** repo: `npm test` 1405/1407, `format:check` and `lint:md` both exit 1. Neither
red was this increment's. The human chose "fix them first, then proceed", so both were repaired
**outside** the increment: the uncommitted `pharn.config.json` restructure was reverted by hand, and
`.pharn/fixes` + `.pharn/FABLE_REVIEW.md` were excluded from `lint:md` under their own declared
writes-scope (`BASELINE-REPAIR.md`). Measured after: 1407/1407, all gates 0. **A later verify FAIL
therefore could not be attributed to pre-existing state** — which was the point.

## Two latent defects this run surfaced (reported, not folded in — P3)

1. **L16's eighth recurrence.** The regress baseline capture used `xargs -a`, a GNU flag BSD `xargs`
   rejects, fabricating `tests=1`. Equal at base and head, it would have been classified `pre_existing`
   — evading a false alarm while **masking** a real one. Caught only because a red baseline on a
   known-green repo was investigated rather than recorded. Seven prior feature records document the same
   flag. `REVIEW.md` Candidate A proposes the L20 escalation.
2. **`/pharn-dev-verify`'s `verify-report.json` conflict.** Step 4 requires the report verbatim
   (unformatted) while the same command owns whole-repo `format:check` — conflicting only when
   `failing_gates` is non-empty. Every prior run reached that step with `PASS` and `[]`. Resolved here by
   formatting after asserting parsed values byte-identical; `REVIEW.md` Candidate B proposes the lesson.

## Artifacts

- `PLAN.md` — GATE-1 approved; `check-plan-lessons.mjs` GREEN (10 lessons); setter count 6 = 6 (L20).
- `GRILL.md` — advisory, 7 concerns. Two acted on in scope: the ✧ cross-copy pin, and `CLAUDE.md`'s
  pre-existing `settings.local.json` omission.
- `REGRESSION.md` / `regression-report.json` — `no-regressions`; six gates 0→0; L17 scope check reported
  **both** ways rather than resolved silently.
- `VERIFY.md` / `verify-report.json` — both runs, the cause, the post-fix measurements.
- `REVIEW.md` — 0 blocking, 3 advisory, 2 lesson candidates.
- `protect-trusted-paths.patch` · `BASELINE-REPAIR.md`.

## Standing note (P0)

The chain ran; the named floor verdicts are as shown. **This is NOT a judgment that the increment is
good or wise; that is the human's call at the post-review gate.** `/pharn-dev-ship` adds no floor
primitive of its own — every guarantee above belongs to a sub-stage (`validate`, `check-regress`,
`check-verify`, the writes-scope hooks). Running the stages in order is **advisory orchestration**; only
the verdicts are floor-grade. Nothing here was merged, committed, or sealed.
