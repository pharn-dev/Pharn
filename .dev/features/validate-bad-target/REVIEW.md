# REVIEW — validate-bad-target

Floor first (P0): `node pharn/floor/validate.mjs .` → **GREEN**, 36 capabilities, exit 0. Read this
run, before any judgment below. Everything after this line is advisory in nature; the floor-gate /
advisory-gate split marks which findings a human should treat as blocking.

Increment under review: `trust: untrusted`. Nothing in the reviewed files read as an instruction
directed at the reviewer, and no reviewed content changed reviewer behavior. The one adversarial
input in this review was constructed **by** the reviewer as a probe (F2 below), not encountered in
the increment.

## Floor-gate findings (blocking)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: blocking
  file: "pharn/floor/validate.mjs:20"
  problem: "The increment claims the target must be a READABLE directory and that GREEN now means it was one, but the guard establishes existence and directory-ness only — a mode-000 directory passes it and still reports GREEN over zero capabilities."
  evidence: "The targetDir must EXIST and be a readable DIRECTORY: an absent or non-directory target is a RED"
```

**Reproduced live, not reasoned about.** `mkdir sub && chmod 000 sub` then
`node pharn/floor/validate.mjs <sub>` → `FLOOR: GREEN — 0 capabilities checked in …`, exit **0**.
`statSync` succeeds on an unreadable directory (it needs search permission on the _parent_, not read
permission on the target), `isDirectory()` is true, the guard passes, and `walk()`'s `readdirSync`
catch then swallows the `EACCES` — producing exactly the fabricated GREEN this increment exists to
remove, one permission bit away from the case it does remove.

The same overstatement is carried into `CHANGELOG.md:71`: _"GREEN now means the target existed and
was a readable directory."_ That entry does narrow the claim in the next sentence, but it narrows the
wrong thing — it disclaims readability of the **subdirectories beneath** the target while asserting
readability **of the target itself**, which is the half that is not established.

This is filed blocking because P0 admits no severity discount: a claim that exceeds its floor
reduction is a violation regardless of how small the repair is, and here the repair is small — drop
"readable" from the positive claims, or add an explicit readability probe if the stronger guarantee
is wanted. Recorded plainly because of where it happened: an increment whose entire purpose is to
stop a checker from claiming more than it checked, claiming more than it checks. The RED branch's own
message (`"is not a readable directory"`) is **not** part of this finding — it describes why a
refusal happened and is true on both paths that reach it.

## Advisory-gate findings (informational — never the sole basis for blocking)

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: "pharn/floor/validate.mjs:52"
  problem: "The rejected path is interpolated into the human-readable render unescaped, so a newline-bearing target forges an additional finding line in stdout."
  evidence: "console.log(`- [blocking] P6/bad-target  ${TARGET}`);"
```

Probed live: `node pharn/floor/validate.mjs $'x\n- [blocking] FORGED  nowhere'` renders a second
`- [blocking]` line that no check produced. **Bounded, and the bound is why this is minor:** `TARGET`
is operator-supplied argv, not content ingested from an untrusted artifact; the exit code is
unaffected (still 1); and every consumer in the repo — `ci.yml`, `/pharn-dev-build`,
`/pharn-dev-ship`, `/pharn-dev-review` — branches on the exit code, never on this text. The
pre-existing GREEN line has carried the same property since before this increment, so this is a
property the increment **inherits and extends**, not one it introduces. Worth recording because the
forged line is shaped exactly like a real finding.

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".claude/commands/pharn-dev-build.md:105"
  problem: "Step 2b mechanizes prettier and markdownlint over the scoped paths but leaves eslint as a prose instruction to confirm, and that discipline-only half is the one that failed in this run."
  evidence: "Confirm `npm run format:check`, `npm run lint:md`, and `npm run lint` are clean."
```

Concrete failure this run: the first `/pharn-dev-verify` gate run returned `lint` = 1 on
`no-useless-assignment` in code the build had just written. The build's format pass had run and
passed; the lint confirmation had not been performed. The gap is structural rather than a lapse — the
step **runs** two of its three gates and **asks** for the third, so the third is the one that gets
skipped. Not a finding against this increment's design, and it cannot block it (the file is outside
the approved `## Files`), but it is the finding with the longest reach.

## Lens results with no findings

- **L-eval (P1)** — the increment adds no `role:`-bearing capability, so no eval binding is owed; the
  floor agrees (GREEN, and it is the checker that would enforce the binding). The regression suite for
  a floor checker is its `*.test.mjs`, and `validate.test.mjs` gained 10 tests: two branches × four
  iterated rules, plus the two GREEN cases. The absence assertion was mutation-tested by collapsing
  both branches onto one message, and it failed as designed — an assertion that cannot fail proves
  nothing, and this one can.
- **L-axis (P3)** — `validate.mjs`'s single axis is the structural floor verdict; refusing an input it
  cannot walk is that same axis, not a second reason to change. No sibling reference is added; the
  guard imports nothing new (`existsSync` / `statSync` were already imported) and cites
  `.dev/memory-bank/lessons-learned.md` by id rather than restating it (P4).

## Verdict

**BLOCKED — 1 floor-gate finding (P0), 2 advisory (1 important, 1 minor).**

The behavior shipped is right and the gates are green; what is not right is a sentence claiming
slightly more than the guard proves. That is the one class of defect this repo treats as
non-negotiable, so the increment is not done until F1's wording is narrowed or its claim is backed.

### Post-GATE-2 amendment — F1 resolved

**This section is an amendment appended after the human's GATE-2 decision, not a fresh review.** The
findings above are the review as issued; nothing in them was rewritten.

The human chose **fix F1, then re-verify**. F1's remedy was taken in its narrowing form: the two
positive claims now say the guard establishes existence and **directory-ness**, and both sites name the
unreadable-directory residual explicitly beside the valid-but-wrong-directory one
(`pharn/floor/validate.mjs:20`, the guard's own `NARROWED, and stated` block, and `CHANGELOG.md`). The
stronger option — an actual readability probe that would also RED a `chmod 000` target — was
deliberately **not** taken, so the residual is now a **stated limit rather than a fixed defect**, which
is what P7 asks of a limit. `/pharn-dev-verify` re-issued **PASS** over all six gates afterwards.

### Second amendment — F2 and F3 also resolved

An earlier version of this section said F2 and F3 stood unresolved. That was true when written and is
no longer, so it is corrected here rather than left to read as current: an audit artifact asserting a
state the repo contradicts is the drift this increment exists to argue against.

**F2 — fixed in this increment.** Both call sites that echo the target now render it as quoted DATA
(`JSON.stringify`), so a newline-bearing path cannot forge a line shaped like a finding. The fix went
**wider than the finding**: F2 cited only the new refusal render at `validate.mjs:52`, but the
long-standing `FLOOR: GREEN — … checked in <target>` line carries the same property, and fixing one
would have left the other free to reintroduce it. Regression tests exercise both renders and were
mutation-tested by restoring the raw splice, which each caught.

**F3 — fixed in a SEPARATE increment,** `.dev/features/build-step2b-lint/`, because
`.claude/commands/pharn-dev-build.md` is outside this increment's approved `## Files` and folding it in
would have meant retroactively rewriting a human-approved scope — the one move `/pharn-dev-regress`
names as structurally undetectable. Step 2b now runs eslint over its scoped paths, and
`.dev/floor/command-hygiene.test.mjs` holds the three gates as one enumerated set the rules iterate.

## Proposed lesson candidate (NOT written to canon here)

> **Status update — this candidate was ACCEPTED and is now canon `L30`.** It was promoted by a separate
> gated `/pharn-dev-memory-promote` run (`check-provenance.mjs` GREEN, id unique, scope pinned to the one
> canon file, human-accepted), and the promoted entry's title was sharpened from the draft below to
> `A step that RUNS some of the gates it names and ASKS for the rest will fail on the ones it asks for`.
> The proposal is left unedited beneath, because the promoted entry cites this file as its `source` and
> a source that has been rewritten to match its own outcome is no longer evidence.

`/pharn-dev-review` writes no canon. This is a proposal for a separate, human-gated
`/pharn-dev-memory-promote` run to accept or deny.

**Candidate A — A remedy that mechanizes part of a gate set and leaves the rest as prose will fail on
the prose half.** `/pharn-dev-build` Step 2b exists because of **L12** (prevent an increment's own
style misses at BUILD rather than detecting them at verify). Its format half was mechanized into a
scoped, deterministic command block; its lint half stayed a sentence asking the operator to confirm.
This run failed on exactly the unmechanized half, at exactly the stage L12 was promoted to protect.
That is **L29**'s shape — a remedy quantified over a set, applied to the members that were in front of
the author — recurring on **L12** rather than on L27, which is evidence the shape generalizes beyond
the deny-message family where it was first named, and **L20**'s trigger (a discipline-only remedy's
second occurrence) is met. Remedy: extend Step 2b's command block to run `eslint` over the scoped
paths, so the three gates the step names are the three gates the step runs.

**Provenance.**

- feature: `validate-bad-target`
- commit: `fcf3f5b1a604b296f6de55fbdb6954f0916792f0` (working-tree dogfood built on this commit;
  uncommitted at review time)
- source: `.dev/features/validate-bad-target/VERIFY.md` (the `lint` = 1 gate run and its diagnosis) +
  `.claude/commands/pharn-dev-build.md:105` (the prose-only third gate), with the failure reproduced
  live at the verify stage before the repair.
