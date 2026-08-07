# SHIP — floor-ref-relocation

Gated `/pharn-dev-ship` run (no `--loop`). Branch `fix/f1-floor-ref-relocation` @ `6c570c6`, off `main`
@ `7bf82bd`. The run ended at **GATE 2** — the post-review human gate — not at a RED-verdict stop.

## Stages that ran, in order

| #   | stage                | structural verdict read                            | source                                               |
| --- | -------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| 1   | `/pharn-dev-plan`    | **GATE 1** — human approved (4 questions answered) | [`PLAN.md`](./PLAN.md)                               |
| 2   | `/pharn-dev-grill`   | _no deterministic verdict — advisory by design_    | [`GRILL.md`](./GRILL.md)                             |
| 3   | `/pharn-dev-build`   | `validate.mjs` exit **0**                          | floor exit code                                      |
| 4   | `/pharn-dev-regress` | `.verdict` = **`no-regressions`** (exit 0)         | [`regression-report.json`](./regression-report.json) |
| 5   | `/pharn-dev-verify`  | `.verdict` = **`PASS`** (exit 0)                   | [`verify-report.json`](./verify-report.json)         |
| 6   | `/pharn-dev-review`  | _no structural verdict — advisory (fix #3)_        | [`REVIEW.md`](./REVIEW.md)                           |

Two extra human halts were imposed by the increment's own build request and both were honored: a
**discovery/options halt** before any write, and a **diff halt** presenting the full rewrite audit,
the CHECK 8 code and every new test — approved before the first byte was written.

## The verdicts, verbatim

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` exit **0**, `FLOOR: GREEN — 36 capabilities
checked in .`
- **`/pharn-dev-regress`** → `"verdict": "no-regressions"`, `regressions: []`, `pre_existing: []`; gates
  `tests` 0→0 and `validate` 0→0 against base `7bf82bd328f180164d4b0309cf45b51c71cd02cc`.
- **`/pharn-dev-verify`** → `"verdict": "PASS"`, `failing_gates: []`; gates `test` / `validate` / `lint` /
  `format:check` / `lint:md` all exit 0. `verifiers: {registered: 0, findings: []}` — advisory, and
  structurally not an input to the verdict.

## Ordering that made the floor verdict a measurement

CHECK 8 was added **before** the rewrite, so the pre-rewrite tree could be measured: `validate` exit
**1**, `FLOOR: RED — 210 finding(s)`, every one `P6/floor-path` and **no finding of any other
rule_id** — so the RED was fully attributable to the new check. After the rewrite: exit **0**. The
stage-3 GREEN above is therefore a result the check could have failed, not one it could not.

## Advisory outputs, cited not restated (P4)

- [`GRILL.md`](./GRILL.md) — 6 concerns (0 blocking-severity, 4 important, 2 minor), all folded into
  the plan before build.
- [`REVIEW.md`](./REVIEW.md) — **GREEN, 0 floor-gate findings, 3 advisory.** It also records **one
  proposed lesson candidate**, deliberately not written to canon: `/pharn-dev-review` holds no
  memory-bank write-scope, and promotion is a separate human-gated `/pharn-dev-memory-promote` run.

Free text in both is `trust: untrusted` DATA, presented for the human and never a proceed/stop input.

## Scope discipline

Every stage set its own writes-scope. The build scope parsed to exactly the **5** paths approved at
GATE 1 — the `### Written via Bash` heading correctly terminated the authorized list (L18), so the
Bash-written canon paths were declared for a human reader without being granted write-scope. The
setter's printed count was read against the approved list at every re-scope (L20). The bulk transform
and `npm run docs:generate` are Bash writes that escape fix #7 entirely; both are declared as such in
the plan rather than presented as gated (L19), and what stands in for the gate is the inversion proof,
the four killed mutants, and the RED→GREEN ordering.

## Standing decision

The chain ran; the named floor verdicts are as shown. **This is NOT a judgment that the increment is
good or wise; that is the human's call at the post-review gate.** `/pharn-dev-ship` has not merged,
pushed, or applied any seal, and adds no floor primitive of its own — every guarantee above belongs to
a sub-stage's own checker.
