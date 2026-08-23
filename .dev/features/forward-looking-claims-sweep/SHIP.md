# SHIP — forward-looking-claims-sweep

Advisory roll-up of the `/pharn-dev-ship` gated chain. **This is not a seal and not an approval.**

## Stages run, in order

| #   | Stage                | Structural verdict read                     | Value                          |
| --- | -------------------- | ------------------------------------------- | ------------------------------ |
| 1   | `/pharn-dev-plan`    | — (ends at **GATE 1**)                      | human approved                 |
| 2   | `/pharn-dev-grill`   | none — advisory by design, gates nothing    | PROCEED (4 findings)           |
| 3   | `/pharn-dev-build`   | `node pharn/floor/validate.mjs .` exit code | **0** (GREEN, 36 capabilities) |
| 4   | `/pharn-dev-regress` | `regression-report.json` `.verdict`         | **`no-regressions`**           |
| 5   | `/pharn-dev-verify`  | `verify-report.json` `.verdict`             | **`PASS`**                     |
| 6   | `/pharn-dev-review`  | none — no machine verdict (fix #3)          | 4 findings, 1 fixed pre-review |

**Where the run ended:** **GATE 2** — the post-review human decision. No RED-verdict STOP occurred.

## Final gate state

`npm run check` exit **0** (8 gates: `format:check`, `lint`, `lint:md`, `docs:check`,
`check:markers`, `check:badge`, `check:contributing`, `test`) · `npm test` **1620/1620** ·
`node pharn/floor/validate.mjs .` **GREEN**.

## What changed

31 product-surface files across 7 correction classes, plus `SKILLS_VERSION` 2.7.14 → **2.7.15**
(patch), the README shields badge, and a `CHANGELOG.md` entry. Net **+111 / −77**. The enumeration
itself is the deliverable (L29) and lives in `PLAN.md`; the false-positive audit — what was
deliberately **left** — is in the same section.

## Pointers (cited, not restated — P4)

- `.dev/features/forward-looking-claims-sweep/PLAN.md` — the enumeration, the false-positive audit,
  and the guarantee audit
- `.dev/features/forward-looking-claims-sweep/GRILL.md` — 4 advisory findings (G1/G3 became build
  constraints; G2 independently confirmed the largest class)
- `.dev/features/forward-looking-claims-sweep/REVIEW.md` — 4 advisory findings; **R1 is the one to
  read**
- `.dev/features/forward-looking-claims-sweep/regression-report.json`,
  `verify-report.json` — the machine verdicts quoted above

## The one thing a reader should not miss

`/pharn-dev-verify` caught the increment reproducing **its own defect at reversed polarity**: the
first-pass griller rewrite replaced an underclaiming "no runner yet invokes it" with an
**overclaiming** "`/pharn-verify` runs it per committed eval pair" — a floor gate that does not fire,
because zero `findings.json` are committed and the gate is absent-if-none. Fixed in all seven files
and the CHANGELOG before review. Detail: `REVIEW.md` R1.

## Standing decision

**The decision is the human's.** The chain ran; the named floor verdicts are as shown — this is
**NOT** a judgment that the increment is good or wise; that is the human's call at the post-review
gate. Nothing was merged, committed, pushed, or sealed.
