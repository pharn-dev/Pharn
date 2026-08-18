# PLAN — ship-pr-handoff (open the PR carrying the briefing)

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L1, L2, L7, L13, L19, L20, L21]
- increment: **Option B, chosen by the human at GATE 1.** `/pharn-ship` Step 2c additionally DISPLAYS a ready-to-run `gh pr create --body-file features/<name>/BRIEFING.md` invocation. PHARN performs ZERO git writes; the human executes. The methodology boundary is NOT crossed and the non-goal text is untouched and remains true.
- layer(s): product `.claude/` command surface (`/pharn-ship`) + repo-meta; NO new `pharn-*` module, NO new floor checker, NO `pharn.config.json` change (B gates nothing, so there is nothing to gate)
- constitution_refs: [P0, P2, P5, P6, P7]

## Applied lessons

- **L19** — the increment's central technical fact. fix #7 gates `Write|Edit|MultiEdit|NotebookEdit` only,
  so a `git`/`gh` call is a Bash write that **never passes the gate at all**. Applied by making that the
  first-order argument in the option comparison (below), not a footnote: Options C/D are scored as
  _ungated_ writes, and Option B is preferred precisely because its only write is a Write-tool write the
  hook does gate.
- **L21** — `git` is already a proven input-capture trap in this repo (`git status --porcelain` emitting a
  directory produced a false blocking finding). Applied by requiring, for any option that shells to git,
  that every captured value be cardinality-asserted and shape-checked at the floor rather than trusted —
  and by counting that requirement as build cost against C/D.
- **L20** — a remedy that reduces to "the agent should remember" WILL recur; the second occurrence is the
  trigger to move it to the floor. Applied to §3's "Never on the agent's initiative": that constraint is
  **discipline only** — no floor primitive can verify a human said "open it" — so under C/D it is exactly
  the kind of remedy L20 says will fail. Counted against C/D, not waved through.
- **L7** — `writes:` must equal exactly what the stage writes, never an aspirational or downstream path.
  Applied to this plan itself (`## Files` = 1 path; the setter reported 1) and to the option designs:
  none may widen `/pharn-ship`'s `writes:` to reach paths it does not itself write.
- **L2** — a contract's honesty must travel with the artifact and may cite only **live** floor ops.
  Applied by verifying this run that the two guards are `Write|Edit|MultiEdit|NotebookEdit`-only
  (`.claude/settings.json` read live) before asserting the Bash bypass, rather than citing it from memory.
- **L1** — `/plan` must scope the meta-docs an increment invalidates. Applied by enumerating, per option,
  every meta-doc the change would falsify (`CLAUDE.md`, `CHANGELOG.md`, `SKILLS_VERSION`, and — for C/D —
  `/pharn-dev-ship`'s mirrored non-goal, which the prompt's "may edit" list omits).
- **L13** — every artifact-writing stage formats its own artifact before halting. Applied to this PLAN.md.

## Files

- `.claude/commands/pharn-ship.md` — Step 2c gains a DISPLAY-ONLY PR handoff block (the `gh pr create
--body-file` invocation, emitted as text, never executed) plus its own guarantee-audit line — layer: product `.claude/` surface
- `SKILLS_VERSION` — `2.6.1` → `2.6.2` (patch: a clarification/extension of bytes that already shipped) — layer: repo-meta
- `README.md` — the shields badge `pharn-2.6.1` → `pharn-2.6.2` ONLY (`check:badge` REDs otherwise);
  the generated CURRENT-STATE block stays byte-identical — layer: repo-meta
- `CHANGELOG.md` — one `[Unreleased]` entry recording the change, the bump, and the boundary that was
  deliberately NOT crossed — layer: repo-meta
- `.dev/features/ship-pr-handoff/PLAN.md` — this plan — layer: `.dev` apparatus
- `.dev/features/ship-pr-handoff/GRILL.md` — layer: `.dev` apparatus
- `.dev/features/ship-pr-handoff/REGRESSION.md` — layer: `.dev` apparatus
- `.dev/features/ship-pr-handoff/regression-report.json` — layer: `.dev` apparatus
- `.dev/features/ship-pr-handoff/VERIFY.md` — layer: `.dev` apparatus
- `.dev/features/ship-pr-handoff/verify-report.json` — layer: `.dev` apparatus
- `.dev/features/ship-pr-handoff/REVIEW.md` — layer: `.dev` apparatus
- `.dev/features/ship-pr-handoff/SHIP.md` — layer: `.dev` apparatus

### Deliberately NOT in scope

> **Live parser note (the #137 Mode-B caveat, reproduced in this very plan).** An earlier draft of the
> `README.md` bullet contained the prose "is NOT touched". `set-writes-scope.cjs --from-plan` matches a
> head-less exclusion cue (`\bnot\W*(touch|writ|modif|edit|chang)`) and TRUNCATED the authorized list
> there — it parsed **3 paths against 10 declared bullets**. It failed CLOSED (shorter, not longer — the
> opposite of L20's over-grant), and it was caught only because the setter PRINTS its count and the count
> was read. The bullet was reworded; the cue words are safe inside this subsection because it carries its
> own `###` heading. See `## Open questions` Q4.

- `pharn.config.json` — B executes nothing, so there is no gate to add (Options C/D needed one; B does not).
- `.claude/commands/pharn-dev-ship.md` and `/pharn-loop` — neither renders a `BRIEFING.md`. Touching them
  would be a second axis of change (P3) and a speculative addition (P7).
- The four trusted docs — hook-denied, and B requires no amendment to any of them. THREAT-MODEL §4 item 2
  ALREADY records the Bash residual, so no proposed append is owed.
- `pharn/floor/**` — B adds no floor primitive.

## Contracts satisfied

- `pharn/pharn-contracts/ship-briefing.md` — cited, not restated. The contract already states `BRIEFING.md`
  "is written to be pasteable as a pull-request description", which is why the _destination_ is settled and
  only the _transport_ is in question.
- `pharn/pharn-contracts/ship-record.md` — cited. Establishes that `record_hash` lives on
  `ship-record.json`, **not** on `BRIEFING.md`; the request's §3 conflates the two artifacts (see
  Open questions Q2).

## Evals to write (P1)

- **None under Option A or B-minimal** — neither adds a `role:`-bearing capability, a rule_id, or a floor
  checker, so P1's trigger does not fire. B-minimal is command prose; its correctness is `/pharn-verify`'s
  existing gates.
- **Under C or D**: a new `pharn/floor/check-pr-preflight.mjs` + `.test.mjs` would be required, with one
  test per §4.6 failure path (`gh` absent / unauthenticated / no remote / push rejected / PR already
  exists / detached HEAD / dirty tree), plus a fixture proving the config gate's three-way membership
  test (absent → default, boolean → use, malformed → surface).

## Guarantee audit (P0)

Per option, since the options differ precisely in what they can honestly claim.

| claim                                         | A (do nothing)            | B (emit command)                                                                             | C (full commit+push+PR)                | D (PR only, human pre-pushed)           |
| --------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------- |
| "the briefing reaches the PR body byte-exact" | advisory (human paste)    | **floor-adjacent** — `--body-file` reads committed bytes; the _running_ of it is the human's | advisory (agent-run)                   | advisory (agent-run)                    |
| "PHARN performs no ungated write"             | **FLOOR (hook, fix #7)**  | **FLOOR (hook, fix #7)**                                                                     | **FALSE** — git/gh via Bash is ungated | **FALSE** — gh via Bash is ungated      |
| "only on explicit human instruction"          | n/a                       | **structural** (the human runs it)                                                           | **advisory only** (L20 class)          | **advisory only** (L20 class)           |
| "the config gate is read deterministically"   | n/a                       | n/a                                                                                          | floor (enum membership, per Step 3b)   | floor (enum membership, per Step 3b)    |
| "no half-state (committed-but-unpushed)"      | **structural** (no state) | **structural** (no state)                                                                    | advisory + new checker                 | **structural** (human owns commit+push) |
| "never merges, never seals"                   | floor-by-absence          | floor-by-absence                                                                             | advisory                               | advisory                                |

**The decisive row is row 2.** Every product write today reduces to the fix #7 hook. Options C and D would
add the **first** product action with **no floor gate of any kind**, at the most consequential point in the
chain (shared, external, remote state). The honest label for it is _advisory git writes_ — and "advisory"
paired with "pushes to a shared remote" is the pairing this repo exists to refuse.

## Trust audit (P2)

A PR body is agent-authored free text published to an external surface — the `LIMITS.md §1d` forgery class,
one step worse because the reader is a third party with no access to this session. Under **B**, the body is
`--body-file features/<name>/BRIEFING.md`: the bytes are a committed file whose frontmatter is already
cross-file-verified by `pharn/floor/check-ship-briefing.mjs`, so a reviewer can diff prose against source.
Under **C/D** the same file is used, but the _act_ of publishing is the agent's, so the residual widens: a
reviewer sees "PHARN opened this" and may read it as a PHARN endorsement. `BRIEFING.md`'s `grill_verdict`
field is verbatim-quoted untrusted DATA (per its contract) and travels into the PR body under every option
— named, bounded, not zeroed.

## Determinism audit (P5)

- The config gate (C/D) is a three-way **membership** test copied from Step 3b: absent → default `false`;
  present ∧ boolean → use; present ∧ non-boolean → **surface to the human, never silently default**.
- `gh` availability is a membership test (`command -v gh`), never an assumption. Measured this run: `gh`
  2.83.2 is present _on this machine_, and the remote is `git@github.com:pharn-dev/pharn.git` — but the
  repo advertises **zero runtime dependencies (Node stdlib; Node 24)** and no doc mentions `gh` anywhere,
  so a user's machine may have neither `gh` nor GitHub. Under C/D, absence must be a named refusal.
- Terminal fallback everywhere is **ask the human**, never a guess.

## Open questions (HALT) — ALL RESOLVED AT GATE 1

- **Q1 — Which option?** → **RESOLVED: Option B** (emit a ready-to-run command; PHARN performs no git
  write). The human selected it at the GATE-1 form. The boundary is not crossed.
- **Q2 — `record_hash` vs `rendered_at_commit`.** The request's §3 binds the PR description to
  `record_hash` from `features/<name>/ship-record.json`. Measured live: `record_hash` is a field of the
  _attestation_ block on `ship-record.json` (`check-attestation.mjs --compute`); `BRIEFING.md` carries
  `rendered_at_commit`; and no `ship-record.json` exists anywhere in this repo. → **RESOLVED: use
  `rendered_at_commit`** — already present, already regex-gated (`^[0-9a-f]{7,40}$` or the literal
  `unknown`), already cross-verified by `check-ship-briefing.mjs`. Nothing new to build.
- **Q4 — the Mode-B exclusion-cue truncation reproduced live in THIS plan.** An earlier draft's `README.md`
  bullet read "is NOT touched"; `set-writes-scope.cjs --from-plan` treated that as a head-less exclusion
  cue and parsed **3 paths against 10 declared bullets**. Fail-CLOSED, and caught only because the setter
  prints its count. → **RESOLVED for this increment** by rewording the bullet. → **NOT resolved as a
  class:** the cue-vs-content ambiguity is a real recurrence of the #137 caveat and is carried to
  `/pharn-dev-grill` and `/pharn-dev-review` as a candidate finding, not silently absorbed (L16).
- **Q3 — the mirrored non-goal in `/pharn-dev-ship`.** → **MOOT under B.** B amends no non-goal, in either
  command, so there is no drift to reconcile and no whitelist to extend.

## Guarantee audit — the SHIPPED claim under B (P0)

The table above compares four candidate options; this is the audit of what B actually ships.

- **"`/pharn-ship` performs no git write"** → **FLOOR by absence + hook (fix #7).** B adds no `git`/`gh`
  invocation at all; `/pharn-ship`'s `writes:` is unchanged, so `set-writes-scope.cjs` +
  `enforce-writes-scope.cjs` still pin exactly `SHIP.md` / `ship-record.json` / `BRIEFING.md`.
- **"the displayed command, if run, sends byte-exact briefing content"** → **FLOOR-adjacent.**
  `--body-file` reads the committed file; `check-ship-briefing.mjs` already cross-verifies that file's
  frontmatter against its live sibling sources. **NARROWED, and stated:** nothing forces the human to run
  the command, nothing verifies their remote is GitHub, and nothing checks that `gh` exists on their
  machine — all three are the human's, by construction.
- **"B adds no new floor primitive"** → **TRUE, and it is the point.** No checker, no config key, no hook
  change. The increment is command prose plus a version bump.
- **STRUCK, never to be written:** "`/pharn-ship` opens the PR", "`/pharn-ship` files the briefing". It
  displays a command. A human runs it. Conflating those is the disease.
