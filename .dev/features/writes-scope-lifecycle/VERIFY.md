# VERIFY — writes-scope-lifecycle

## FLOOR layer — the deterministic gates (OWNS the verdict)

| gate                                         | exit | note                                                  |
| -------------------------------------------- | ---: | ----------------------------------------------------- |
| `test`                                       |    0 | 1475/1475 — includes this feature's 20 new assertions |
| `validate`                                   |    0 | `FLOOR: GREEN — 36 capabilities checked`              |
| `lint`                                       |    0 | eslint clean                                          |
| `format:check`                               |    0 | prettier clean, whole-repo                            |
| `lint:md`                                    |    0 | markdownlint clean, whole-repo                        |
| `structural:expected-injection-comment.json` |    0 | the one committed eval pair                           |

Eval-pair paths were confirmed readable (`test -r`) before their exit code was recorded, so a setup
error could not be laundered into a gate verdict (L5 / L16 / L21).

## Verdict (FLOOR — `check-verify.mjs`, exit 0)

**VERIFIED: floor gates PASS.**

```json
{ "verdict": "PASS", "failing_gates": [] }
```

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}` —
**no verifiers registered; floor gates only.** Membership is a deterministic frontmatter read, never a
prose grep. Step 2 is a no-op and the verdict is the floor gates alone (P7 — none authored
speculatively).

## What this run caught, and what that says about the increment

**The first gate pass FAILED**, and it failed on the increment's own patch — recorded here rather than
smoothed over, because it is the most useful thing this stage produced:

```text
lint          = 1   .claude/hooks/enforce-writes-scope.cjs:166
                    error  Unexpected control character(s) in regular expression: \x00, \x1f  no-control-regex
format:check  = 1   .claude/hooks/enforce-writes-scope.cjs  (not prettier-formatted)
```

Both defects were in the human-applied hook patch, and both were **mine**. The cause is precise and
worth naming: the pre-delivery verification ran `node --check` and the two hook test suites against a
**sandbox copy**, and proved zero regression that way — but a sandbox outside the repo has neither the
eslint config nor `.prettierrc.json`, so **the style gates were never run against the patched file at
all.** A verification that reproduces the tests but not the linters certifies less than it appears to.

**The fixes, and why they are the right ones rather than the quick ones:**

1. **`no-control-regex`** — the sanitizer was rewritten from a control-char regex to a **char-code
   scan**, matching the established idiom in `.dev/floor/check-provenance.mjs`'s `cleanScalar()`, whose
   own comment already says a regex holding literal control characters "is neither readable in a diff
   nor safe against a copy-paste that silently drops them." An `eslint-disable` comment would have
   silenced the gate while leaving the repo with two different constructions for the same job. The
   sanitizer's behavior was **re-measured after the rewrite**, not assumed: the injection probe still
   reports **0 forged message lines**.
2. **`format:check`** — a second, self-inflicted miss surfaced while fixing the first. Running
   `prettier --write` on the scratchpad copy silently ignored `.prettierrc.json` (`printWidth: 140`),
   which reformatted **unrelated pre-existing lines** and inflated the patch from 59/11 to **92/17**.
   Re-running with `--config .prettierrc.json` brought it back to **69/11** — my lines only, plus one
   line prettier joined at width 140. The patch record on disk is the corrected one.

Nothing else in the increment moved: after the fix, the same six gates and the same tests were green,
and the `--clear` end-to-end behavior was re-measured against the real hooks.

**Re-run at GATE 2.** After the human's `fix` decision, all seven `REVIEW.md` findings were addressed
and every gate above was **re-measured on the fixed tree**, not carried over: `test` **1475/1475**
(four new assertions — the U+2028/U+2029 fold, the non-ENOENT unlink branch, the byte-identical
release-line spelling, and the conditional-rule control case), and `validate` / `lint` / `format:check`
/ `lint:md` / `structural` all still exit 0. The verdict shown above is from that re-run.

## The honest residual (P0/P7)

**Verified = the named gates passed.** This is **not** a guarantee of correctness beyond what those
gates check: a defect no test, eval, rule, or linter covers is invisible to this verdict, and the
verifier layer that might notice such a thing is **advisory** and, today, empty. Verifier concerns are
advisory help, not assurance.

Two bounds specific to this increment, restated so the PASS is not read as more than it is:

- The `✧` corpus tests (now in their own file, `.claude/hooks/writes-scope-release.test.cjs`) prove
  every setter-invoking command **declares** the release step, **orders** it after every set
  invocation, and spells it identically everywhere. They do **not** prove any run **executed** it — the
  same declaration-vs-application split `check-plan-lessons.mjs` already labels advisory.
- Running the release step is **ADVISORY** orchestration through Bash, outside the `PreToolUse` gate
  entirely (L19). The floor guarantee is unchanged and belongs to the **reader**: absence of a scope
  file = the fail-closed default-safe-set.
