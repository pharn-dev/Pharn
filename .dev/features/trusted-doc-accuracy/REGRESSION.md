# REGRESSION — trusted-doc-accuracy (F7)

**FLOOR VERDICT: `no-regressions`** (`pharn/floor/check-regress.mjs verdict`, exit 0). Deterministic
exit-code comparison — zero LLM-judge in the core.

| gate       | base (`HEAD` = `c93ca61`) | head (working tree) | flip |
| ---------- | ------------------------- | ------------------- | ---- |
| `tests`    | 0                         | 0                   | none |
| `validate` | 0                         | 0                   | none |

Base resolved by deterministic state test: `git status --porcelain` non-empty → working-tree dogfood
→ `base = HEAD`. The baseline ran in a detached `git worktree` at that SHA (stdlib-only gates, no
`npm ci`); the gate set is identical on both sides.

**Style gates deliberately skipped, not omitted.** `inside` touched no shared style config
(`.prettierrc`, `.prettierignore`, `.markdownlint-cli2.jsonc`, eslint config, `package.json` — all
byte-unchanged), so over outside files byte-identical at base and head a style result cannot flip.
The increment's own style is covered by `/pharn-dev-verify`'s gate map (L9), where it is not skipped.

**Test list expanded through stdin** (`xargs node --test < list`) — not `node --test $LIST`, which
zsh does not word-split (**L5**), and not `xargs -a`, which BSD `xargs` rejects outright (**L16**).

## Scope check — `escaped: []`, and the exemptions are the story

`scope` exited **0**. Five paths landed in `escape_exempt` rather than in `escaped`:

- `.dev/features/trusted-doc-accuracy/{PLAN,GRILL}.md` — this feature's own pipeline artifacts, each
  written by its own stage under that stage's Step-0 writes-scope.
- `LIMITS.md`, `THREAT-MODEL.md`, `pharn/ARCHITECTURE.md` — the hook-protected trusted docs.

This is the 2.4.4 `--feature` fix working as intended: on the pre-2.4.4 checker every one of these
five would have been reported as a **blocking P0 fix#7 "the build escaped its `## Files`"** finding on
the correct, designed workflow — the false positive `.dev/memory-bank/lessons-learned.md` **L17**
documents and **L20** demanded be given a floor check. It fired **zero** times here.

### One observation the exemption cannot see (for `/pharn-dev-review`)

The trusted-doc exemption's stated justification is that those four docs are ones **the agent cannot
write at all** — `protect-trusted-paths.cjs` denies every `Write|Edit|MultiEdit` to them, so their
presence in a diff provably came from a human. **This increment falsifies that premise.** Under the
GATE-1-approved Bash path, the agent wrote all three: `sed`-class writes never reach `PreToolUse`, so
fix #2 was not satisfied, it was **not consulted**.

The exemption still fired on the correct paths, and `escaped: []` is the right answer here — the
three docs were authorized at GATE 1 and their edits are the increment. But the checker reached that
answer via a rationale that no longer holds: it exempts those paths because it believes an agent write
to them is impossible. An agent-authored trusted-doc edit and a human-authored one are, at this
checker, indistinguishable. Recorded for the review lens, not fixed here.

## Honest scope (P0)

`/pharn-dev-regress` catches **exactly what its suite catches — nothing more**. `no-regressions` means
the outside gates that ran did not flip pass→fail. It does **not** mean "nothing broke," and for a
prose-only increment it is especially weak evidence: **no deterministic check in this repo reads
trusted-doc prose**, so the correctness of all eleven edits is invisible to this stage by construction.
That verification is the per-edit assertion recorded in the build note, plus human review.
