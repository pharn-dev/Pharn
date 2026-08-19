# VERIFY — out-of-root-deny-message

**PASS 2** — re-run at the GATE-2 "fix" decision, after `REVIEW.md`'s F1 / F2 / F4 were closed. Every
gate was re-executed; nothing was carried over from pass 1. The test count moved 1481 → **1483** (F2's
two assertions), and the verdict is unchanged at PASS.

## FLOOR layer — the deterministic gates (OWNS the verdict)

| gate                                         | exit | note                                                 |
| -------------------------------------------- | ---: | ---------------------------------------------------- |
| `test`                                       |    0 | 1483/1483 — includes this feature's 8 new assertions |
| `validate`                                   |    0 | `FLOOR: GREEN — 36 capabilities checked`             |
| `lint`                                       |    0 | eslint clean, whole-repo                             |
| `format:check`                               |    0 | prettier clean, whole-repo                           |
| `lint:md`                                    |    0 | markdownlint clean, whole-repo                       |
| `structural:expected-injection-comment.json` |    0 | the one committed eval pair                          |

Both eval-pair paths were confirmed readable (`test -r`) **before** their exit code was recorded, so a
setup error could not be laundered into a gate verdict (L5 / L16 / L21).

## Verdict (FLOOR — `check-verify.mjs`, exit 0)

**VERIFIED: floor gates PASS.**

```json
{ "verdict": "PASS", "failing_gates": [] }
```

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}` — **no verifiers registered;
floor gates only.** Membership is a deterministic frontmatter read, never a prose grep. Step 2 is a no-op
and the verdict is the floor gates alone (P7 — none authored speculatively).

## The first gate pass was GREEN, and the reason is worth recording (L26)

The previous increment's first verify pass **failed on its own human-applied hook patch**, twice, by the
same mechanism: the patch had been verified against a scratchpad **copy**, where `eslint.config.mjs`,
`.prettierrc.json` and the markdownlint config do not resolve — so `lint`, `format:check` and `lint:md`
never ran against the patched file at all, while the test numbers looked reassuringly exact. That is L26,
promoted at the end of that increment.

This increment applied L26's remedy directly: the patch was generated and then **applied inside a
detached `git worktree` of this repo**, with `node_modules` symlinked in, and `npm run check` was run
**there** — at the real path, under the same config resolution the repo's own gates use.

**It caught something on the first pass, which is the evidence the remedy works.** `eslint` flagged two
`no-useless-escape` errors on line 229 of the patched hook: escaped back-ticks (`` \` ``) inside a
double-quoted JavaScript string, where no escape is needed. Exactly the gate family a scratchpad copy
skips silently. They were fixed at the real path and re-linted to exit 0 **before** the patch was ever
handed over, so the human never saw a broken diff and this stage's first gate pass was clean.

Two further controls were run in the worktree, neither required by the command, both recorded because
they are what makes the PASS above mean something:

- **Negative control.** Reverting **only** the hook (leaving the new tests in place) makes **4 of the 6**
  new assertions fail. The other two are invariance pins — "in-repo advice unchanged" and "no verdict
  moves" — which correctly pass in both directions by construction. A test suite that passed either way
  would have verified nothing.
- **Byte-equality.** The file that landed in `.claude/hooks/` hashed
  `9d64bef639831dbb6c6682fd0eaab2121f97ce78d1332cdee6b4604f8c25f83b`, identical to the worktree copy
  `npm run check` passed at exit 0. The verified artifact and the shipped artifact are the same bytes,
  not merely the same intent.

## Pass 2 — the same procedure applied to the F2 fix

F2 (`blockedPath` interpolated raw) also lands in the hook-protected file, so it went through the same
L26 route rather than a shortcut: a **second** fresh worktree carrying the full working-tree state, the
change applied there, `npm run check` run at the real path → **exit 0, 1483/1483**, eslint and prettier
clean on both changed files.

- **Negative control, again.** Reverting **only** the F2 hook change fails exactly the forge assertion.
  The companion assertion — a legitimate 200+ character path must survive the fold un-truncated — is an
  invariance pin and correctly passes both ways.
- **Byte-equality, again.** The landed file hashes
  `396ea124d64b9debfb10dd090ea3a57b08319a6c97e4b27adca4fde2b36f90db`, identical to the pass-2 worktree
  copy that `npm run check` passed.
- **The defect itself was re-probed against the LIVE hook after the rename**, not inferred from the test
  result: a `file_path` carrying U+000A now yields **0 forged lines**, where the same probe returned 1 at
  the baseline, 1 against the pass-1 hook, and 1 in the untouched in-repo branch.

## What "VERIFIED" means here, and what it does not (P0)

- **It means:** the six named gates exited 0 with this feature present. That is the entire content of the
  word.
- **It does NOT mean** the message is well-worded, that an agent reading it will act on it, or that the
  advice is useful. The gates check that the two branches emit the strings the tests name and that no
  verdict moved — **not** that the prose achieves its purpose. That judgment is the human's at GATE 2.
- **The verdict is whole-repo**, so PASS requires the whole repo clean, not just this increment's files.
- **The gate SET is advisory orchestration.** `check-verify.mjs` is generic over gate keys; nothing
  floor-locks the two style gates into the map (L9's remedy lives in this orchestration layer, by design).
