# VERIFY — deny-message-phantom-commands

**Machine report:** `.dev/features/deny-message-phantom-commands/verify-report.json`
(`check-verify.mjs` stdout verbatim + the advisory `verifiers` block).

## FLOOR layer — gate results (run at HEAD, whole working tree)

| gate                                    | exit | result |
| --------------------------------------- | ---- | ------ |
| `test`                                  | 0    | green  |
| `validate`                              | 0    | green  |
| `lint`                                  | 0    | green  |
| `format:check`                          | 0    | green  |
| `lint:md`                               | 0    | green  |
| `structural:expected-injection-comment` | 0    | green  |

**VERIFIED: floor gates PASS.** (`check-verify.mjs` exit **0**, `"failing_gates": []`.)

This gate set is exactly the repo's `npm run check` aggregate plus the structural eval gate, so the
verdict tracks the full `npm run check` (L9).

## This is the SECOND pass; the first FAILED, and that history is kept

The first run of this stage returned **`FAIL`** with `failing_gates: ["test"]` — four tests added by
this increment asserting against a **live hook that was still unpatched**. `.claude/hooks/enforce-writes-scope.cjs`
is hook-protected (fix #2, probed live: exit 2), so the agent could not apply the change; the human did,
via the delivered handoff. The chain STOPped there and handed over, exactly as it should have.

The red is recorded rather than overwritten because it is the evidence that the tests **detect** the
defect. A suite that was green both before and after the fix would prove nothing about either.

**The tests were deliberately pointed at the live hook**, not at the handoff copy. Pointing them at the
copy would have produced a green suite while the real guard still printed phantom command names — the
false-green shape `.dev/memory-bank/lessons-learned.md` **L26** names.

## Applied change confirmed identical to the verified artifact

Before the human applied it, the patched state was verified at the real path (L26): a detached
`git worktree` of this repo carrying full working-tree state, `node_modules` linked in, so
`eslint.config.mjs` / `.prettierrc.json` / markdownlint config resolve by path as the repo's own gates
resolve them.

- Worktree: `npm run check` **exit 0**, `node --test` **1491 pass / 0 fail**.
- The applied `.claude/hooks/enforce-writes-scope.cjs` hashes to
  `sha256 5f48a7e8a843597bb505950cbf76397bafae434a7d4e0decdd77e0cfc63691d6` — **byte-identical** to the
  handoff file and to the worktree copy the gates above ran against. What was verified is what shipped.

## Reproduce, after (P6) — against the real, applied hook

A live denial from the installed guard now renders:

```text
  • If running a command (/pharn-build, /pharn-dev-build, …): scope is set in the command's FIRST step.
    If "(none set)", that step did not run — restart the command from the top; do not write ad hoc.
```

`grep -c "/build, /review" .claude/hooks/enforce-writes-scope.cjs` → **0**. The verdict is unchanged:
the probe still exits 2, and no path became writable.

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.
**No verifiers registered — floor gates only.** Step 2 is a no-op; the verdict is the floor gates alone.
No verifier free-text exists, so no untrusted `problem` / `evidence` entered this report.

## The honest residual (P0/P7)

**Verified = the named gates passed** — this is NOT a guarantee of correctness beyond what those gates
check; verifier concerns would be advisory help, not assurance, and there are none.

Specifically, the four new tests prove a cited command **exists** and **invokes the setter**; they do
**not** prove it does so in its **FIRST step**, which is what the shipped sentence asserts. A deferral is
expressed in prose _inside_ a Step 0 section, so that half is not mechanically checkable the obvious way.
It stays human-read and advisory — see the named residual in `PLAN.md` and `GRILL.md` finding G-P0.

**One scope note for a re-run of `/pharn-dev-regress`.** `.claude/hooks/enforce-writes-scope.cjs` is now
in `git diff` but is deliberately in the plan's **"Explicitly not touched"** list, because the _agent_
does not write it. A fresh `check-regress.mjs scope` would therefore report it as an `escaped` path. That
would be a true statement about the diff and a false one about the build: the change arrived through a
human's Bash `mv`, which no `## Files` declaration governs and no `PreToolUse` hook sees (L19). Stated
here so the next reader does not re-derive it as a scope breach.
