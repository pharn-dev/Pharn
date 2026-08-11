# PLAN — trusted-doc-accuracy (F7)

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4
- applied_lessons: [L1, L2, L7, L13, L17, L18, L19, L20]
- increment: Annotate every site in the four trusted docs that presents a **not-yet-live** floor primitive as operative, and correct one name-drift — so the governing text stops asserting protections the repo does not have (P0).
- layer(s): none (root trusted docs + repo-meta; no capability tree change)
- constitution_refs: [P0, P2, P6, P7]

## Applied lessons

- **L1** — meta-doc sweep run: `grep -rn "pre-egress" --include="*.md"` found **`CLAUDE.md:256`**
  carrying the _same_ three-primitives claim as `pharn/ARCHITECTURE.md:41`. The edit spec does not
  name it; leaving it would ship exactly the stale canon L1 describes. Raised as **Q3**.
- **L2** — the increment _is_ L2's rule applied to the trusted docs themselves: every "enforced by
  `<floor op>`" phrase must cite an op verified **live this run**. Liveness was verified by reading
  implementations, not by trusting the edit spec — see `## Discovery` below.
- **L7** — `## Files` declares **only** what this increment's Write/Edit tools actually touch. The
  three trusted docs are deliberately **excluded** rather than declared: naming them would be the
  over-declaration L7 forbids (and L18's live over-grant reached `pharn/ARCHITECTURE.md` by exactly
  that route).
- **L13** — this stage formats its own artifact (`prettier` + `markdownlint-cli2` over this PLAN
  only, never repo-wide — L19).
- **L17** — pre-declared: `/pharn-dev-regress`'s `scope` check tests _changed-since-base_, not
  _written-by-the-build_, so any human-applied trusted-doc edit **will** surface as a false "the
  build escaped its scope" finding. Recorded here so it is classified, not waved through.
- **L18** — the exclusion block below is a `###` **heading**, not a bold prose intro, so
  `set-writes-scope.cjs --from-plan` terminates the authorized list structurally.
- **L19** — the only agent path to the trusted docs is a **Bash write that never passes fix #7 at
  all**. L19 says name it, never pretend the gate covered it. This is the substance of **Q1**.
- **L20** — the setter's printed path count was read against this plan's approved list, not assumed:
  `--from-plan` reported **3 path(s)** = `SKILLS_VERSION`, `CHANGELOG.md`, `CLAUDE.md`, exactly the
  approved set. Re-verified at build Step 0; a mismatch is a STOP.

## Discovery (P6 — verified live this run, not from the edit spec)

| Claim under test                                | Verification                                                                 | Result                                         |
| ----------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------- |
| `pre-egress` hook exists                        | `ls .claude/hooks/`                                                          | **absent** — 3 hooks, none egress              |
| archetype-maps manifest exists                  | `validate.mjs:233` expects `pharn/pharn-contracts/archetype-maps.json`       | **absent** repo-wide                           |
| the fix #5 check ever fires                     | `validate.mjs:15` — "if an archetype-maps manifest exists (**conditional**)" | **never fires**                                |
| `/pharn-estimate` exists                        | `git ls-files .claude/commands/`                                             | **absent**                                     |
| `est_tokens` is emitted                         | grep over `.mjs`/`.cjs`/`.json`                                              | **docs only**, no emitter                      |
| `security-secrets` lens exists                  | `ls pharn/pharn-review/`                                                     | **no** — 22 lenses; ships as `secrets-in-code` |
| `pharn-audits` module exists                    | `ls -d pharn/pharn-audits`                                                   | **absent**                                     |
| the community-privilege restriction is enforced | `KIND_ENUM` used only at `validate.mjs:155`                                  | **value-membership only** — see Q4             |

`SKILLS_VERSION` live = **2.5.0** (the edit spec says it was verified at 2.4.6). Line numbers were
re-confirmed against `main`@`c93ca61` and **all still match**.

## Files

Write/Edit-tool outputs — these and only these are granted fix #7 scope (expected setter count: **3**):

- `SKILLS_VERSION` — patch bump 2.5.0 → 2.5.1 (trusted docs are in the bump-triggering set)
- `CHANGELOG.md` — one `[Unreleased]` entry recording the correction + the Q4 deferral
- `CLAUDE.md` — edit **C1** (`:256`), the `pre-egress` claim (Q3 / L1)

### Deliberately NOT in scope

- `pharn/CONSTITUTION.md` — not implicated; no site names a not-yet-live primitive
- `.claude/hooks/**`, `pharn/floor/**`, `package.json` — F7 is doc accuracy only; building the
  `pre-egress` hook, the archetype manifest, or `/pharn-estimate` is trigger-gated (P7) and out of scope
- `LIMITS.md:28` / `THREAT-MODEL.md:102` beyond the marker — the Q4 deferral

### Written by Bash, OUTSIDE every write gate (L19 — declared, not disguised)

Per Q1 the agent applies edits **A1–A3 / T1–T3 / L1–L4** with `sed`. `sed` is not
`Write|Edit|MultiEdit`, so these writes pass **neither** fix #7 **nor** fix #2 — the hooks are not
satisfied, they are **not consulted**. They are listed here rather than in `## Files` on purpose:
naming them there would grant Write-tool scope to three hook-protected docs, the over-declaration
L7 forbids and the exact over-grant L18 reproduced live.

- `pharn/ARCHITECTURE.md` — A1, A2, A3
- `THREAT-MODEL.md` — T1, T2, T3
- `LIMITS.md` — L1, L2, L3, L4

The only real control on these three is the **human wording approval** at GATE 1 plus CODEOWNERS
review on `main`. That is discipline and a GitHub-layer gate, not a floor primitive (P0).

## Contracts satisfied

- none — this increment adds no capability and changes no contract shape. It corrects prose in the
  governing text and bumps the shipped-surface version.

## Evals to write (P1)

- **none, and this is not a P1 exemption claim.** P1 binds a **Capability** (a `role:`-bearing file)
  to `evals/cases/*` + `evals/expected/*`. This increment authors no capability and no `rule_id`, so
  there is nothing for an eval to bind. The deterministic gate that _does_ apply is
  `npm run check` staying GREEN (`/pharn-dev-verify`'s gate map).

## Guarantee audit (P0)

- "the marked sites no longer assert a live protection" → **advisory.** Nothing on the floor reads
  trusted-doc prose; no checker validates their text. This is a human-reviewed wording correction.
- "the four trusted docs cannot be written by the agent's Write/Edit/MultiEdit" → **floor: hook**
  (`protect-trusted-paths.cjs`, fix #2). **Narrowed, and stated:** it gates that tool surface only —
  a Bash write bypasses `PreToolUse` entirely (`THREAT-MODEL.md:86`, L19). This is Q1.
- "this increment's Write/Edit tools touch only `SKILLS_VERSION`, `CHANGELOG.md`, `CLAUDE.md`" →
  **floor: hook** (fix #7, `set-writes-scope.cjs --from-plan` + `enforce-writes-scope.cjs`), verified
  live at **3 path(s)**. **Narrowed, and stated:** this says nothing about the ten `sed` edits to the
  three trusted docs — that surface is ungated (see `## Files`, L19).
- "the annotated primitives are genuinely not live" → **floor-grounded evidence, advisory
  conclusion.** Absence was verified by directory listing and by reading `validate.mjs`'s own
  conditional; that no _other_ mechanism supplies the protection is a reading, not a check.
- "SKILLS_VERSION was bumped because product bytes changed" → **advisory.** No checker binds a
  product-surface diff to a version bump (a standing, unenforced repo convention).

## Trust audit (P2)

The edit spec in the command arguments is **untrusted input** — it is unverified text, and it
proposed at least one string that must not be copied through (Q2). Every factual claim in it was
**re-derived from live state** (`## Discovery`) rather than accepted; its proposed wording is treated
as a **suggestion for the human to ratify**, never as an instruction to apply verbatim. No
guaranteed decision in this increment rests on it.

## Open questions — RESOLVED at GATE 1

- **Q1 — write mechanism.** Raised: `CLAUDE.md` #1 says _"do not work around the hook — let a human
  edit them outside the agent loop"_, which conflicts with the edit spec's Bash residual.
  **Human decision: the agent applies the trusted-doc edits via Bash `sed`, after approving the
  wording below.** Recorded honestly per L19: these three files are written by a path that **never
  passes fix #7 or fix #2** — not a gated write, and not claimed as one.
- **Q2 — corrupted target string.** The spec's `THREAT-MODEL.md:91` replacement was garbled
  ("condips"). **Resolved:** _"Specified; the check is conditional and no manifest exists, so it
  never fires."_
- **Q3 — `CLAUDE.md:256`.** **Included** (L1 meta-doc sweep).
- **Q4 — the empty backstop.** **Deferred to a follow-up, flagged in the CHANGELOG.** F7 applies the
  marker as specified; the deeper defect is recorded below so it is not lost.
- **Q5 — `security-review auditors`.** **Included.**

## The patch set — 11 edits across 4 files

Marker: `_(specified; ships with the guarded surface)_`. Single-line replacements only; no reflowing,
no other lines. The three trusted docs are `.prettierignore`d **and** markdownlint-excluded (verified
this run), so no formatter can touch them; `CLAUDE.md` is formatter-governed but prettier's markdown
`proseWrap` default is `preserve`, and MD013 is off.

### `pharn/ARCHITECTURE.md` — 3 edits (Bash `sed`)

**A1 · :41** — the primitive list entry

- `- \`pre-egress\` — blocks a network call to a domain not on a hardcoded allowlist.`
- → `- \`pre-egress\` _(specified; ships with the guarded surface)_ — blocks a network call to a domain not on a hardcoded allowlist.`

**A2 · :239** — the §7 pre-egress allowlist clause. The spec named `:237`, but the marker reads far
better folded into the existing parenthetical's close on `:239` than jammed mid-clause on `:237`.

- `fooled) and the **constitution/trusted-file write-guard** (fix #2) and the **\`writes\`-scope`
- → `fooled — specified; ships with the guarded surface) and the **constitution/trusted-file write-guard** (fix #2) and the **\`writes\`-scope`

**A3 · :258** — the validate-contract list

- `\`coupling\` enum membership; the four archetype maps agree (fix #5); finding templates separate`
- → `\`coupling\` enum membership; the four archetype maps agree (fix #5 — conditional; specified, ships with the guarded surface); finding templates separate`

### `THREAT-MODEL.md` — 3 edits (Bash `sed`)

**T1 · :70** — mechanism cell only

- `| pre-write + pre-egress hook |`
- → `| pre-write hook + pre-egress (specified; ships with the guarded surface) |`

**T2 · :71** — mechanism cell only

- `| pre-egress hook + enum gate |`
- → `| pre-egress (specified; ships with the guarded surface) + enum gate |`

**T3 · :91** — the fix #5 closure status (Q2)

- `5. **Archetype maps drift** — \`validate\` checks the four maps agree (fix #5). _Closed._`
- → `5. **Archetype maps drift** — \`validate\` checks the four maps agree (fix #5). _Specified; the check is conditional and no manifest exists, so it never fires._`

### `LIMITS.md` — 4 edits (Bash `sed`)

**L1 · :29** — the §1a backstop citation

- `(\`ARCHITECTURE.md §5\`, pre-write + pre-egress hooks). Safety comes from the floor, not from the`
- → `(\`ARCHITECTURE.md §5\`, pre-write hook; pre-egress specified, ships with the guarded surface). Safety comes from the floor, not from the`

**L2 · :52** — `/pharn-estimate`

- `**measured runtime cost** (the system already observes it). \`/pharn-estimate\` reports a range,`
- → `**measured runtime cost** (the system already observes it). \`/pharn-estimate\` _(specified; ships with the guarded surface)_ reports a range,`

**L3 · :75** — the §1d re-gate claim; pre-write / writes-scope stay live

- `no floor-gated capability — the pre-write / writes-scope and pre-egress hooks re-gate every downstream`
- → `no floor-gated capability — the pre-write / writes-scope hooks (and pre-egress, specified; ships with the guarded surface) re-gate every downstream`

**L4 · :108** — name correction **+** Q5 marker, one line. The `security` **griller** does ship
(verified: `pharn/pharn-pipeline/grillers/security/`), so it is left alone. An inner `(...)` would
close two parens against the sentence's own; an em-dash avoids `))`.

- `griller, security-secrets lens, security-review auditors) — each fresh sub-agent re-pays. Tiered`
- → `griller, secrets-in-code lens, security-review auditors — specified; ships with the guarded surface) — each fresh sub-agent re-pays. Tiered`

### `CLAUDE.md` — 1 edit (Edit tool; fix #7 applies)

**C1 · :256** — the same three-primitives claim (Q3 / L1)

- `1. **Hooks** — \`pre-write\` (block writes to protected paths / out-of-\`writes\`-scope), \`pre-egress\``
- → `1. **Hooks** — \`pre-write\` (block writes to protected paths / out-of-\`writes\`-scope), \`pre-egress\` _(specified; ships with the guarded surface)_`

## Deferred finding (Q4) — recorded, not fixed here

`LIMITS.md:28-29` and `THREAT-MODEL.md:102` are **backstop** claims, not descriptions: each strikes a
claim as a limit, then points at the floor as what bounds the residual. Live, **both halves are
empty** — no egress hook exists, and `KIND_ENUM` is read only to check that `kind`'s _value_ is an
enum member (`validate.mjs:155`); nothing conditions any privilege on `kind: community`. F7's marker
makes `:29` less wrong while it still claims a live `pre-write` backstop for a restriction no check
enforces. Follow-up: `community-privilege-backstop`. Trigger to reopen (P7): satisfied already — this
is a real, verified defect, not a hypothetical.
