# SHIP — scanner-nested-paren-span (advisory roll-up)

Chain: `/pharn-dev-plan → [GATE 1 approved] → /pharn-dev-grill → /pharn-dev-build → /pharn-dev-regress →
/pharn-dev-verify → /pharn-dev-review → [GATE 2 — you are here]`.

**Ended at: GATE 2.** No stage returned a non-GREEN verdict; no RED-verdict STOP occurred.

## Stages run, in order

| stage                | outcome                                          |
| -------------------- | ------------------------------------------------ |
| `/pharn-dev-plan`    | `PLAN.md` written; halted at GATE 1              |
| GATE 1 (human)       | **approved as written**                          |
| `/pharn-dev-grill`   | `GRILL.md` — 5 concerns, advisory, gates nothing |
| `/pharn-dev-build`   | 8 files written; floor GREEN                     |
| `/pharn-dev-regress` | `no-regressions`                                 |
| `/pharn-dev-verify`  | `PASS`                                           |
| `/pharn-dev-review`  | `REVIEW.md` — 0 blocking, 3 advisory             |

## Structural verdicts read, verbatim

- **`/pharn-dev-build`** → `node pharn/floor/validate.mjs .` exit **`0`** (GREEN, 36 capabilities).
- **`/pharn-dev-regress`** → `regression-report.json` `.verdict` = **`"no-regressions"`**
  (`check-regress.mjs verdict` exit `0`; `regressions: []`, `pre_existing: []`).
- **`/pharn-dev-verify`** → `verify-report.json` `.verdict` = **`"PASS"`**
  (`check-verify.mjs` exit `0`; `failing_gates: []`; gates `test` / `validate` / `lint` /
  `format:check` / `lint:md` all exit `0`).

`/pharn-dev-review` has **no** structural verdict and none was invented (P0, fix #3) — its `severity`
values are LLM-assigned and advisory.

## One human gate fired mid-chain, outside the standard two

`/pharn-dev-build` halted and asked (P6) when the plan's prescribed span
`(?:[^)(]|\([^)]*\))*?` broke **two pre-existing canonical tests** — it skips a nested `(...)` group as
an opaque unit and so loses taint sitting _inside_ one, dropping
`fs.readFile(path.join(base, req.params.x))` and `fetch(new URL(req.query.url))`. The brief's FIX clause
and its MUST-NOT-BREAK clause were in genuine conflict. The human selected span
**`(?:[^)]|\([^)]*\))*?`**, which satisfies every case in both directions. This was a human decision,
not an agent override; `PLAN.md` was deliberately **not** retro-edited.

## Pointers (cited, not restated — P4)

- `.dev/features/scanner-nested-paren-span/REVIEW.md` — the review findings. **Read A-1** (the
  scanners' self-scan false-positive count rose: injection clean→2, path-traversal 3→10, ssrf 2→6) and
  **A-2** (`PLAN.md` still shows the superseded regex; the built code and headers are authoritative).
- `.dev/features/scanner-nested-paren-span/GRILL.md` — advisory; three of its five concerns were folded
  into the built headers.
- `.dev/features/scanner-nested-paren-span/REGRESSION.md` — includes a recorded false red that was
  caught and discarded (a `xargs -a` invocation unsupported on BSD/macOS, the lessons-learned L5
  masking hazard) before it could fabricate a `pre_existing` entry.
- `REVIEW.md` also carries a **proposed** memory-bank lesson candidate. It is a candidate only —
  promotion requires a separate human-gated `/pharn-dev-memory-promote` run.

## Surface touched

3 scanners + 3 test files + `SKILLS_VERSION` (`1.1.3` → `1.1.4`, patch) + `CHANGELOG.md`. 13 tests
added; suite 801 → **814**, 0 failures.

---

Chain ran; the named floor verdicts are as shown — this is **NOT** a judgment that the increment is
good or wise; that is the human's call at the post-review gate.
