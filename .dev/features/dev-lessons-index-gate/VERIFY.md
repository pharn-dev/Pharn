# VERIFY — dev-lessons-index-gate

## FLOOR layer — the gates that OWN the verdict

| gate                                                        | exit |
| ----------------------------------------------------------- | ---- |
| `test` (full `npm test`, incl. the feature's own suite)     | `0`  |
| `validate` (`pharn/floor/validate.mjs .` — 36 capabilities) | `0`  |
| `lint` (eslint)                                             | `0`  |
| `format:check` (prettier, whole-repo)                       | `0`  |
| `lint:md` (markdownlint, whole-repo)                        | `0`  |
| `structural:expected-injection-comment`                     | `0`  |

Both eval-pair paths were confirmed readable **before** their exit code was recorded (**L5** / **L16** /
**L21**) — an ENOENT would otherwise have been recorded as a gate verdict rather than a setup error.

## Verdict

**VERIFIED: floor gates PASS.**

Computed by `pharn/floor/check-verify.mjs` (exit `0`, `PASS iff every gate exit 0`). The report's
`feature` / `gates` / `verdict` / `failing_gates` fields are the helper's stdout **verbatim** —
programmatically confirmed, with the `verifiers` block additive only. `failing_gates: []`.

## Feature-specific evidence (beyond the whole-repo gates)

The whole-repo gates say the repo is green **with this increment in it**; they do not by themselves show
the increment does its job. That signal is the feature's own suite, collected by `npm test`:

- `.dev/floor/command-hygiene.test.mjs` — **20/20 pass** (was 11 at base; +9 from the new
  `LESSONS_SWEEP_WIRING` set: 4 presence + 4 discrimination + 1 non-vacuity).
- **The pin was proved to DISCRIMINATE against the real defect, not just its own fixture.** The new test
  file was run unchanged inside a `git worktree` at base `d6aa21d`: both dev members **failed** with
  `must INVOKE its lessons-index tool, not name the condition in prose`, while both product members
  passed. A test that only passes after the fix is weak evidence; one that provably fails before it is
  the actual claim (**L4** — an authored assertion passes by construction).

## Also confirmed (not a `check-verify` gate — stated as such)

`npm run check` is **0-fail**, which additionally covers `docs:check` (the committed lessons-index
byte-equality guard), `check:markers`, and `check:badge`. These sit **outside** the `check-verify.mjs`
gate map, so they are reported here as a separate confirmation and are **not** part of the floor verdict
above. `SKILLS_VERSION` is **unchanged at `2.7.12`** — correct, since every file this increment touched
is apparatus (`pharn-dev-*` commands and a `*.test.mjs`), none of which ships.

## ADVISORY layer — verifiers

**No verifiers registered — floor gates only.** `node pharn/floor/count-verifiers.mjs .` returns
`{"registered":0,"verifiers":[]}` — a deterministic frontmatter read, never a prose grep. Step 2 is a
no-op and the verdict is the floor gates alone. No verifier is authored speculatively (P7).

## The honest residual (P0/P7)

**Verified = the named gates passed.** This is **NOT** a guarantee of correctness beyond what those
gates check — a defect no test, eval, rule, or lint covers is invisible to this verdict, and the
verifier layer that might notice it is advisory and currently empty.

Two bounds specific to this increment, stated rather than left to be discovered:

- The new wiring pin is a **vocabulary** assertion. It proves the four commands **declare** their
  lessons-index invocation. It **cannot** prove a run executed it, that the branch is obeyed, or that the
  flags are right — **"the wiring is pinned" NEVER means "the sweep was fresh."**
- The gate **SET** is advisory orchestration, not floor-locked (L9): `check-verify.mjs` is generic over
  gate keys, so nothing forces the style gates to stay in the map.

Running the gates and assembling this report is advisory orchestration; only the exit-code threshold is
floor.
