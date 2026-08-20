# PLAN — the writes-scope deny message cites only commands that exist AND set a scope

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L1, L7, L19, L20, L22, L25, L26, L27]
- increment: Replace the two phantom command names (`/build`, `/review`) in `enforce-writes-scope.cjs`'s in-repo denial with the two real commands whose FIRST step genuinely sets a writes-scope, and pin the property with a test so a future phantom or non-setting name fails loudly.
- layer(s): floor / hook (`.claude/hooks/`) — not a `pharn/` capability layer; the write-guard is `pharn/ARCHITECTURE.md §2` primitive #1.
- constitution_refs: [P0, P2, P5, P6, P7]

## Applied lessons

- **L1** — the increment changes shipped `.cjs` hook bytes, so it bumps `SKILLS_VERSION`, and the
  meta-docs asserting that fact are scoped in `## Files`: `CHANGELOG.md` and the `README.md` shields
  badge (pinned byte-for-byte by `.dev/floor/check-version-badge.mjs`, which REDs on disagreement).
  No `CLAUDE.md` sentence states the deny message's exemplar names, so `CLAUDE.md` is deliberately
  **not** scoped — verified by grep this run, not assumed.
- **L7** — `writes:` must equal exactly what this increment writes. The hook itself is hook-protected
  and therefore **not** agent-written and **not** declared as an agent write; it is delivered as a
  patch plus a whole-file handoff, and only the handoff path is declared.
- **L19** — the Bash-run writes this increment performs are declared rather than assumed gated: the
  per-artifact `prettier`/`markdownlint-cli2` calls, the throwaway `git worktree` verification, and
  the load-bearing one — the **human's `mv`/`git apply` of the hook change**, which by definition never
  passes `PreToolUse`. Its effect is re-verified by re-running the repro afterwards.
- **L20** — this is the second defect in `denyMessage()` in as many increments whose only remedy would
  otherwise be discipline (L27 was the first). Per L20 the second occurrence is the trigger to make the
  correction **enforceable**, so the remedy is a **test** that mechanically re-derives the property from
  live state, not a comment asking the next author to remember.
- **L22** — the plan pins literal command lines (the repro, the setter call, the worktree verification),
  never a prose description of a technique to be re-chosen per run.
- **L25** — the rationale does not live only in a header comment beside the code it describes; the test
  below is what carries it, and the existing header comment is re-derived for this change rather than
  left asserting the pre-change story.
- **L26** — the hook is human-only, so verification runs **at the real path**: the change is applied in a
  throwaway `git worktree` of THIS repo and `npm run check` runs there, never against a scratchpad copy
  where `eslint.config.mjs` / `.prettierrc.json` / markdownlint config do not resolve.
- **L27** — the direct predecessor, and it governs the choice of names. L27's rule is that a remedy's
  **reachability is a property to assert per branch**. Generalized here: a named exemplar must actually
  **have** the property the sentence attributes to it. That is why `/pharn-review` is rejected below
  despite being the obvious rename of `/review`.

## The defect, reproduced live (P6)

```sh
grep -n "/build, /review" .claude/hooks/enforce-writes-scope.cjs   # → line 263
```

The bullet sits in `denyMessage()`'s **in-repo** branch (after the `notInsideRoot` early return that
L27's increment added), and reads:

> `• If running a command (/build, /review, …): scope is set in the command's FIRST step. If "(none set)", that step did not run — restart the command from the top; do not write ad hoc.`

Neither `/build` nor `/review` exists — `.claude/commands/` holds 19 commands, all `pharn-*` or
`pharn-dev-*` (listed live this run).

**The task's line number is stale.** It cites `:146`; the live line is **263**. The task text was
written against the pre-H6/H7 file, and both `denyMessage()`-rewriting predecessors have since shipped
(`writes-scope-lifecycle` → #152, `out-of-root-deny-message` → #153), which grew the function. Recorded,
not silently corrected.

**"Fold into the H6/H7 diff" is therefore moot, and the consequence is the version bump.** Both
predecessors are merged, so N1 is **standalone** — and by the task's own rule ("bump `SKILLS_VERSION`
(patch) if changed alone") this increment carries its own patch bump rather than riding one.

## Which names replace them — the non-obvious part (P5, L27)

The sentence claims two things about whatever it names: the command **exists**, and **its FIRST step
sets the scope**. Both were checked live, per command:

- **17 of 19 commands invoke `set-writes-scope.cjs`; two do not — `/pharn-review` and `/pharn-dev-eval`.**
  So the obvious rename `/review` → `/pharn-review` would reintroduce L27's disease in a new form: a
  true-sounding sentence whose applicability to the named command is empty. An agent told "restart
  `/pharn-review` from the top, its first step sets the scope" would restart a command that never sets
  one, and then reach for whatever does work. **Rejected.**
- **The plan stages defer their setter.** `/pharn-dev-plan` Step 0 reads "**After Step 2 names `<name>`
  and before Step 3**"; `/pharn-plan` is the same shape. Numbered Step 0, executed mid-run — so "FIRST
  step" is false for them. **Rejected**, notwithstanding the task's suggestion of `/pharn-plan`.
- **The build stages set unconditionally at Step 0**, from the plan's `## Files`
  (`/pharn-dev-build` Step 0 → setter at `:31`; `/pharn-build` Step 0 resolves `<name>` and sets within
  that same first step). Both satisfy **both** claims.

**Chosen: `/pharn-build, /pharn-dev-build`** — one product, one dev, mirroring the surface split the
message serves, and the only pair for which every word of the surrounding sentence is true.

The edit is a **pure name swap**, deliberately minimal-additive inside `denyMessage()` (L27's
predecessor's own discipline): the FIX-bullet structure, the `"(none set)"` cue and the remaining
prose are untouched, so a later diff has the smallest possible surface to collide with.

## Files

- `.claude/hooks/enforce-writes-scope.test.cjs` — **EDIT.** New tests pinning the property
  mechanically (see `## Evals to write`) — layer floor/hook tests. Agent-writable: `*.test.cjs` is
  deliberately outside the fix #2 denylist.
- `.claude/hooks/test.cjs` — **NEW (handoff artifact).** The patched hook delivered as a whole FILE
  beside its target, so the human's step is a one-command `mv` rather than a `git apply`. Byte-identical
  to the file the worktree verification ran `npm run check` against, and therefore carrying **no**
  banner or marker — a header comment would ship into the live hook on rename. It is **not** on
  `set-writes-scope.cjs`'s `CONTROL_SURFACE`, so no `--allow-claude-dir` is involved and no guard is
  scoped. Inert until renamed: nothing wires it, and it does not match the `*.test.cjs` glob `npm test`
  runs. Precedent: `out-of-root-deny-message` — layer floor/hook (handoff)
- `.dev/features/deny-message-phantom-commands/enforce-writes-scope.patch` — **NEW.** The unified diff
  for the human-applied hook change, recorded so the ship trail is self-contained — layer dev artifact
- `SKILLS_VERSION` — **EDIT.** 2.7.8 → 2.7.9 (patch: a correction to bytes that already shipped) — layer repo-meta
- `README.md` — **EDIT.** shields badge `pharn-2.7.8-blue` → `pharn-2.7.9-blue` (line 13, OUTSIDE the
  `CURRENT-STATE` generated region; pinned by `.dev/floor/check-version-badge.mjs`) — layer repo-meta
- `CHANGELOG.md` — **EDIT.** One entry describing the name correction + the version bump — layer repo-meta

Explicitly **not** touched:

- `.claude/hooks/enforce-writes-scope.cjs` — hook-protected (fix #2, probed live this run → exit 2).
  Changed only by the human, via the handoff above. It must NOT enter the writes-scope.
- `CLAUDE.md` — grepped this run; no sentence states the deny message's exemplar command names.
- `.claude/commands/**` — no command's prose cites `/build` or `/review`.

## Contracts satisfied

- None newly. The increment corrects prose inside an existing floor primitive
  (`pharn/ARCHITECTURE.md §2` primitive #1, the pre-write hook) and adds no contract, capability, or
  `role:` frontmatter — so `pharn/floor/validate.mjs`'s capability walk is untouched (P7: no
  speculative addition).

## Evals to write (P1)

No capability is added, so P1's Capability-eval obligation does not attach. The correction is pinned
by hook tests instead — the same class the two predecessors used:

- **`deny message cites only REAL commands`** → extract every slash-command token from a rendered
  in-repo denial; assert each resolves to an existing `.claude/commands/<token>.md`. Catches any future
  phantom name, not merely the two removed today.
- **`every cited command actually SETS a writes-scope`** → for each extracted token, assert its command
  file invokes `set-writes-scope.cjs`. This is the L27-generalized assertion, and it is what would have
  rejected `/pharn-review`.
- **`the specific regression stays dead`** → assert the rendered message does not match the literal
  `(/build, /review`.
- **`the extractor is not vacuous`** → assert at least one command token was extracted, so a future
  message that drops all names cannot pass the two tests above by having nothing to check (the
  fail-open failure L25's `--verdict`-empty-string case names).

Token extraction is over the **FIX-bullet region only**, with a slash-token regex anchored to
start-of-line / whitespace / `(` so interpolated repo paths (`.claude/hooks/…`, `.pharn/…`) cannot be
mistaken for command names; the blocked-path fixture is a **relative** in-repo path so no absolute path
enters the message. The exact regex is pinned in the test file, not described in prose (L22).

## Guarantee audit (P0)

- **"the deny message cites only commands that exist"** → **floor: enum/regex** (primitive #3) — the new
  test re-derives the set from `.claude/commands/` live and asserts membership. NARROWED, and stated: it
  is a **test**, so it guarantees the property at `npm test` time, not at hook-run time; nothing stops a
  human editing the live hook to a phantom name and not running the suite.
- **"every cited command sets a writes-scope in its first step"** → **SPLIT, and the halves differ.**
  That the command file **invokes the setter** is **floor: enum/regex** (a grep-membership assertion in
  the test). That the invocation is its **FIRST step** is **ADVISORY** — read by a human this run from
  each command's step ordering; no checker parses step order. Do not write that the test proves
  "first step".
- **"the hook's behavior is unchanged"** → **floor: enum/regex** — the existing 60 tests plus the L27
  branch-split tests pin the verdict and both message branches; the edit touches message TEXT only, and
  **no path becomes writable**. Exit 2 stays exit 2.
- **"the patch is verified under the repo's own rules"** → **floor: enum/regex** (`npm run check`'s
  gate exits) — but only because it runs in a `git worktree` at the real path (L26). Against a
  scratchpad copy this claim would be **false while appearing green**.
- **"SKILLS_VERSION agrees with the README badge"** → **floor: enum/regex**
  (`.dev/floor/check-version-badge.mjs`, wired in `npm run check` and as its own CI step).
- **"the human applied the handoff"** → **ADVISORY.** A `mv` is a Bash write outside `PreToolUse`
  (L19); nothing on the floor forces or verifies it. Re-running the repro after the `mv` is the check,
  and it is a human's to run.

## Trust audit (P2)

- **Input:** the N1 task text is `trust: untrusted` prose. Every factual claim in it was treated as
  DATA and re-verified live: the line number was **wrong** (146 vs 263) and is corrected above; the
  "fold into the H6/H7 diff" instruction was **unresolvable-then-moot** and is recorded above; the
  suggested name `/pharn-plan` was **checked and rejected** on the deferred-Step-0 finding. None of the
  three was followed on the task's authority.
- **Output:** the deny message interpolates `blockedPath`, the scope entries and `record.set_by` —
  all untrusted — and all already pass `asData()` (control-char folding), which the predecessor
  increment fixed and its tests pin. This increment changes only a **static literal** in the same
  string and introduces **no new interpolation**, so the taint surface is unchanged.
- **The new test reads `.claude/commands/*.md`**, which are `trust: trusted` in-repo files, and uses
  them only for **membership tests** (does the file exist; does it contain the setter call) — never
  executing or interpreting their content.

## Determinism audit (P5)

- The exemplar-name choice was made by a **membership test over live state** (does `.claude/commands/<n>.md`
  exist; does it invoke `set-writes-scope.cjs`), not by recall or by the task's suggestion.
- The new tests branch only on membership and regex match.
- The one irreducible judgment — **which** two of the 17 qualifying commands to name — is model work,
  is labeled advisory here, and is surfaced at GATE 1 as an open question rather than silently taken.

## Open questions (HALT) — both RESOLVED at GATE 1

Both were put to the human as selectable options before any build, and both were resolved **as the plan
recommended**. Recorded rather than deleted, so the ship trail shows what was asked and by whose
authority it was settled.

1. **Exemplar pair — RESOLVED: `/pharn-build, /pharn-dev-build`.** The plan named the only pair for
   which "FIRST step sets the scope" is literally true. The task had suggested `/pharn-plan`; live
   discovery showed the plan stages defer their setter until after `<name>` resolution, so naming one
   would have made the surrounding sentence false. The human confirmed the pair.
2. **Handoff form — RESOLVED: patch AND whole-file.** Deliver the hook change as both a `.patch` (audit
   trail) and a whole-file `.claude/hooks/test.cjs` for a one-command `mv` — the
   `out-of-root-deny-message` precedent. `## Files` above already reflects this; no scope change.

**No open question remains.** `/pharn-dev-build`'s refusal condition (an unresolved HALT) does not apply.
