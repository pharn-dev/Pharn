# VERIFY — trusted-doc-accuracy (F7)

**FLOOR VERDICT: `PASS`** (`pharn/floor/check-verify.mjs`, exit 0). Absolute threshold: PASS iff every
gate exits 0.

| gate           | exit |
| -------------- | ---- |
| `test`         | 0    |
| `validate`     | 0    |
| `lint`         | 0    |
| `format:check` | 0    |
| `lint:md`      | 0    |

`npm run check` (the aggregate the gate map is designed to track, L9) also exits **0**, so verify and
the full gate agree — the L9 seam where an increment's own new markdown passes both per-increment
stages and only reddens at `npm run check` did not open here.

**No `structural:<expected>` gate.** This increment ships no capability, so there is no eval pair to
run — not a skipped check, an inapplicable one. P1 binds a `role:`-bearing file to its evals; this
increment authors none.

**Advisory layer: empty.** `pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.
Zero verifiers exist (P7 — none authored, none built speculatively), so the advisory layer contributed
nothing. Per fix #3 it could not have flipped the verdict in either direction even if populated.

## What PASS means here, and what it emphatically does not

`PASS` means **exactly** "the five named gates exited 0." For this increment that claim is unusually
narrow, and saying so is the point:

- **No gate in this repo reads trusted-doc prose.** `.prettierignore` and `.markdownlint-cli2.jsonc`
  both exclude `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`, and `LIMITS.md` by name, and the floor
  checkers cite them only in header comments — none validates their text. So `format:check` and
  `lint:md` passing says **nothing** about ten of the eleven edits; they passed identically before the
  change.
- **`validate` GREEN is not evidence about this increment either.** It scans the `pharn/pharn-*`
  capability tree, which this increment did not touch.
- **What actually verified the edits** is the per-edit assertion in the build step: all ten
  substitutions were required to match **exactly once** before any file was written (fail-closed), then
  re-verified after writing that each old string is absent and each new string present exactly once.
  That is a deterministic check, but it is **not** one of these gates and it is **not** in the verdict.
  It verifies that the intended bytes landed — never that the intended wording is _right_, which is the
  human's call at GATE 2.

So: **the gates passed. That is not "the docs are now accurate."** The accuracy claim rests on the
`## Discovery` verification in `PLAN.md` (each primitive confirmed absent by live inspection) and on
human review of the wording — advisory and human, respectively, never floor.

## Spec-pin drift — expected, and worth a decision

`sha256(pharn/ARCHITECTURE.md)` moved from `a1c243ea…621753` (the plan's pin) to `8f5ec002…30fb52`,
because **this increment edits the very doc the plan pins**. `/pharn-dev-build` checked the pin
_before_ writing, correctly, so the build was sound. But re-running `/pharn-dev-build` on this plan
would now HALT with "the spec drifted" even though the work is complete and correct.

fix #4 treats the spec as a fixed **input**; here it is the **target**. Nothing in the pipeline is
wrong, and no gate is bypassed — the pin did its job — but the failure mode is confusing rather than
informative, and it will recur on every future trusted-doc increment. Surfaced for
`/pharn-dev-review`; not fixed here (out of scope, and it is a pipeline question, not a doc question).
