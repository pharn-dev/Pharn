# PLAN — out-of-root (scratchpad) write denials get a reachable message

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L1, L8, L13, L19, L20, L22, L25, L26]
- increment: Give `enforce-writes-scope.cjs`'s `rel === null` (path not inside the repo root) denial its own message, whose every prescribed remedy is actually reachable — instead of the in-repo `writes:` advice, which no out-of-root path can ever satisfy.
- layer(s): floor / hook (`.claude/hooks/`) — not a `pharn/` capability layer; the write-guard sits beside `pharn/ARCHITECTURE.md §2` primitive #1.
- constitution_refs: [P0, P2, P5, P6, P7]

## Applied lessons

- **L1** — the increment bumps `SKILLS_VERSION`, so the meta-docs that assert that fact are scoped in
  `## Files`: `CHANGELOG.md`, the `README.md` shields badge (pinned byte-for-byte by
  `.dev/floor/check-version-badge.mjs`), and the `CLAUDE.md` "Writes-scope" sentence that currently states
  the single unconditional remedy this increment makes conditional.
- **L8** — the setter narrows ONE `--target` per call and each call overwrites the scope file, so this
  increment does not assume one setter call authorizes its five agent-written paths: `/pharn-dev-build`
  scopes from the plan's `## Files` (a concrete, non-placeholder list, so all five resolve in one call),
  and every other stage re-scopes to its own single artifact immediately before writing it.
- **L13** — this stage and every later artifact-writing stage formats its OWN artifact
  (`npx prettier --ignore-unknown --write <artifact>`), never a repo-wide sweep.
- **L19** — the Bash-run tooling this increment invokes writes OUTSIDE the fix #7 gate, so it is declared
  rather than assumed covered: the per-artifact `prettier`/`markdownlint-cli2` calls, and (the load-bearing
  one) the **human's `git apply` of the hook patch**, which is by definition an ungated write. The patch is
  therefore delivered as text for a human, and its effect is re-verified by re-running the repro afterwards.
- **L20** — the discipline-only half of this fix is exactly the kind that recurs, so the correction is a
  **test**, not a comment: `enforce-writes-scope.test.cjs` pins that the out-of-root branch does NOT emit the
  unreachable `writes:` advice and that the in-repo branch DOES, so a future message edit that collapses the
  two branches fails loudly.
- **L22** — the plan pins literal command lines (the repro, the setter calls, the worktree verification),
  never a prose description of a technique to be re-chosen per run.
- **L25** — the rationale for the split does not live only in a header comment beside the code it describes;
  it is made enforceable by the two cross-contamination tests above, and the header comment is re-derived
  for this change rather than left asserting the pre-change story.
- **L26** — the hook is hook-protected and human-only, so verification runs **at the real path**: apply the
  patch in a throwaway `git worktree` of THIS repo and run `npm run check` there, never against a scratchpad
  copy where `eslint.config.mjs` / `.prettierrc.json` / `markdownlint` config do not resolve.

## Files

- `.claude/hooks/enforce-writes-scope.test.cjs` — 4 new tests: out-of-root `/tmp`-style, out-of-root
  `/etc/…`, an in-repo path the active scope excludes (message unchanged), and no cross-contamination in
  either direction — layer floor/hook tests
- `SKILLS_VERSION` — 2.7.6 → 2.7.7 (patch: a correction to bytes that already shipped) — layer repo-meta
- `README.md` — shields badge `pharn-2.7.6-blue` → `pharn-2.7.7-blue` (line 13, OUTSIDE the
  `CURRENT-STATE` generated region; pinned by `.dev/floor/check-version-badge.mjs`) — layer repo-meta
- `CHANGELOG.md` — one entry describing the message split + the version bump — layer repo-meta
- `CLAUDE.md` — the "Writes-scope" bullet that reads "**When a write is blocked,** the fix is to declare
  the path in `writes:` and re-run the scope-setter" gains the out-of-root exception it no longer covers —
  layer repo-meta
- `.claude/hooks/test.cjs` — **added post-GATE-1 by explicit human direction**, not by the agent's own
  judgment: the patched hook delivered as a whole FILE beside its target instead of only as a diff, so the
  human's remaining step is a one-command `mv` rather than a `git apply`. Byte-identical to the file the
  worktree verification ran `npm run check` against, and therefore carries **no** banner or marker — a
  header comment would ship into the live hook on rename. Declaring it here is what makes the write pass
  fix #7; it is NOT on `set-writes-scope.cjs`'s `CONTROL_SURFACE`, so no `--allow-claude-dir` is involved
  and no guard is scoped. Inert until renamed: nothing wires it, and it does not match the `*.test.cjs`
  glob `npm test` runs — layer floor/hook (handoff artifact)

- `.dev/features/out-of-root-deny-message/enforce-writes-scope.patch` — the unified diff for the
  human-applied hook change, recorded so the ship trail is self-contained. **Declared at GATE 2
  (2026-08-19), AFTER the write, in response to `REVIEW.md` F4 — and that ordering is stated rather than
  hidden.** The write itself was permitted at the time (it landed under the fail-closed
  `DEFAULT_SAFE_SET`, which admits `.dev/features/**`, with the build scope already released), so this
  declares a legitimate-but-undeclared output; it does not launder a denied one. The precedent increment
  `writes-scope-lifecycle` declared both of its `.patch` records up front, and this one should have.
  `REGRESSION.md` and `REVIEW.md` F4 both keep the original undeclared state on record, so the audit
  trail still shows what happened — layer dev-artifact

### Delivered as a human-applied patch (NOT agent-written, NOT in the parsed scope)

- `.claude/hooks/enforce-writes-scope.cjs` — `denyMessage()` gains an out-of-root branch. This is the
  increment's substantive change, and it is **deliberately below an exclusion heading** so
  `set-writes-scope.cjs --from-plan` never parses it into scope: the file is hook-protected (fix #2,
  exit 2) **and** on the setter's `CONTROL_SURFACE`. Listing it as an agent-written path makes the setter
  refuse the **whole** scope — reproduced live at this plan's Step 4 (exit 1, "refusing to scope the
  write-guards' own control surface"), which is why the list above holds exactly five paths. The agent
  emits a unified diff; a human applies it with `git apply`.

### Explicitly **not** touched

- `pharn/CONSTITUTION.md`, `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`, `LIMITS.md` — trusted docs, human-only.
- `.claude/settings.json`, `.claude/hooks/protect-trusted-paths.cjs`, `.claude/hooks/set-writes-scope.cjs`,
  `CODEOWNERS` — the guards' control surface; untouched, so no `--allow-claude-dir` is needed anywhere.
- `.pharn/writes-scope.json` — setter-only.

## Contracts satisfied

- `pharn/ARCHITECTURE.md §2` primitive #1 (hooks) — the guard's **verdict** is untouched; only its prose
  changes. Cited, not restated (P4).
- `pharn/ARCHITECTURE.md §7` / §3.1 (`writes:` enforced by the pre-write hook) — unchanged; this increment
  makes the message stop **describing** a remedy that section cannot deliver for out-of-root paths.

## Evals to write (P1)

P1 binds **Capabilities** (`role:`-bearing `.md` under `pharn/`). This increment adds none — it edits a
hook and its `node --test` suite — so the P1 obligation is satisfied vacuously and the equivalent
regression surface is the four hook tests below (`node --test`, run by `npm test` inside `npm run check`).

- out-of-root absolute path (`<os.tmpdir()>/…`) → exit 2 **and** the message names "not inside the repo
  root" **and** does NOT contain the `add it to the active Capability's writes:` advice
- out-of-root `/etc/pharn-oss-nonexistent` → exit 2 **and** the same out-of-root variant (proves the branch
  keys on root-relativity, not on a hardcoded scratchpad prefix)
- in-repo out-of-scope (`.dev/floor/x.mjs`) → exit 2 **and** the original `writes:` advice **and** NOT the
  out-of-root line (the two branches do not cross-contaminate)
- verdict-unchanged pin: the same allow/deny outcomes as before for in-scope, out-of-scope, `ALWAYS` zone,
  and the scope file itself (the message edit is prose, never a behavior edit)

## Guarantee audit (P0)

- "an out-of-root write is denied" → **floor: hook** (unchanged — `rel === null` still reaches `deny()`;
  this increment adds no allowance and widens no hole)
- "the deny message's advice is reachable for the branch it is printed in" → **advisory (prose)**, with a
  **floor backstop on the SPLIT**: the enum/regex assertions in `enforce-writes-scope.test.cjs` (primitive
  #3, run by `npm test`) pin that each branch's text is present in its own case and absent from the other.
  The tests guarantee the two messages **differ as specified**; they do **not** guarantee the advice is
  _useful_, only that the unreachable advice is not printed where it is unreachable.
- "the version bump is recorded" → **floor: enum/regex** — `.dev/floor/check-version-badge.mjs` string-compares
  the README badge to `SKILLS_VERSION` (already wired in `npm run check` and as its own `ci.yml` step).
  The CHANGELOG entry itself is **advisory** — nothing parses it.
- "the message never becomes a verdict input" → **advisory (code shape), with a FLOOR backstop:
  enum-regex (primitive #3)** — the code-shape observation is that `denyMessage()` is called only from
  `deny()`, which exits 2 unconditionally and never reads the return value; but "I read the call graph"
  is **not** a floor primitive, so the claim is advisory and the guarantee lives in the
  verdict-unchanged test, which pins the observable consequence (identical allow/deny outcomes across
  in-scope, out-of-scope, out-of-root, root-itself, `ALWAYS`, and the scope file).
  _Corrected at GATE 2 (2026-08-19). It previously read `floor: structural` — a fourth primitive P0 does
  not admit. `GRILL.md` G1 raised it and `## Post-grill corrections` recorded the withdrawal, but the
  correction sat in a different section from the claim, which is the [[L2]] defect (a contract's honesty
  must travel WITH the artifact); `REVIEW.md` F1 therefore held it blocking until fixed HERE, in place._
- **Explicitly NOT claimed:** that an agent will read or follow the new message (it is prose returned as a
  tool result), and that out-of-root writes are prevented in any absolute sense — Bash-tool writes bypass
  `PreToolUse` entirely, which is precisely the fact the new message stops obscuring.

## Trust audit (P2)

- **Input:** `.pharn/writes-scope.json` — Bash-writable, outside the `PreToolUse` gate, therefore
  **untrusted**. Unchanged by this increment: every echoed field still passes through `asData()` and no
  branch reads any of them. The new branch keys on `rel === null`, a value derived from `path.relative` over
  the **tool payload's path** and `ROOT` — a structural, non-free-text fact.
- **Output:** the deny message is returned to the **agent** as a tool result, so it is an injection surface
  in the outbound direction. The new lines are **static literals** — no untrusted value is interpolated into
  them — and the one interpolated value (`blockedPath`) is already the tool's own input path, printed exactly
  as today. The repo root is printed from `process.cwd()` (trusted), not from the record.
- **Named residual:** the new branch tells the reader that Bash-tool writes are outside this gate. That fact
  is already stated in `CLAUDE.md` and `pharn/ARCHITECTURE.md`'s bound, and the Bash tool carries its own
  permission gate — but naming it in a denial is, honestly, a nudge toward the escape. The message is
  therefore worded to give the escape **only for scratch/temporary work** and to keep "put it in the repo and
  declare it" as the first option for work that belongs to the increment. Advisory; stated, not zeroed.

## Determinism audit (P5)

- The added branch is `rel === null` — a strict-equality membership test on a value already computed by
  `toRel()`. No LLM classification, no new parsing, no new I/O.
- **Deliberately NOT added: a hardcoded scratchpad-prefix match.** Recognizing `/private/tmp/claude-*` by
  name would be (a) platform-specific — the same session's scratchpad is `/tmp/...` on Linux and
  `%TEMP%\...` on Windows, the L16/L22 portability-trap shape, and (b) speculative (P7): no failure has been
  reported that root-relativity alone does not explain. Root-relativity is the true predicate; the prefix is
  one instance of it. See `## Open questions (HALT)` — the human may overrule.
- Fallback: none needed; the branch is total (`rel === null` or not).

## Known residuals (surfaced live at this plan's Step 4, not fixed here)

Both were found by **running** the L20 comparison rather than by reading the plan, which is the evidence
L20 asks for. Neither is in this increment's scope (P7 — each needs its own trigger and its own increment):

- **The setter's head-less exclusion CUE fires on an authorized item's own CONTINUATION line.** The bullet
  describing the test file contained the phrase "in-repo out-of-scope unchanged" on a wrapped line; that
  line is not a path-item and not a blockquote, so `pathsFromPlanFiles`'s Boundary-2 cue matched
  `\bout\W*of\W*scope` and **truncated the authorized list from 5 paths to 1**. The comment beside that
  regex says the cue is "anchored to a NON-path line so an authorized item's own description never trips
  it" — which holds for a **single-line** item and fails for a **wrapped** one. Fails CLOSED (too few
  paths, a loud deny), so it is friction, not a hole — the L3 direction, not the L7 one. Same shape as
  [[L25]]: a rationale comment trusted for the defect it does not name.
- **`check-plan-lessons.mjs` returned GREEN both before and after** the `## Files` restructuring that the
  setter's refusal forced — exactly the declaration-vs-application split that checker already labels
  advisory ([[L20]]'s "the plan cited L18 only after violating it").

## Open questions — ALL RESOLVED at GATE 1 (none outstanding)

Answered by the human at the plan-approval halt on 2026-08-19; the approval was **"Approve as written"**
with every recommendation taken. Recorded here so `/pharn-dev-build` Step 1.1 reads a plan with no
unresolved HALT, and so the decisions survive the run.

1. **Scratchpad prefix → ROOT-RELATIVITY ONLY.** No hardcoded `/private/tmp/claude-*` match.
2. **Bash route → NAME IT, scoped to scratch/temporary work**, with "put it in the repo and declare it"
   listed first.
3. **`CLAUDE.md` → ADD ONE CLAUSE**, no restructuring.

## Post-grill corrections (adopted at build; `## Files` UNCHANGED)

`GRILL.md` raised five advisory concerns. Four change **how** the approved files are written, none changes
**which** files are written, so the human-approved scope stands and no re-plan is needed. Recorded rather
than silently applied — the original claims stay visible above for the GATE-2 reader:

- **G1 (P0) — `floor: structural` is not a floor primitive.** The `## Guarantee audit` line "the message
  never becomes a verdict input → **floor: structural**" is **withdrawn and relabelled**: it is
  **advisory (code shape)**, backstopped by the verdict-unchanged test (enum/regex, primitive #3). P0
  admits three primitives; "I read the call graph" is not one of them. Flagged, not auto-fixed in place.
- **G2 (P0) — three unreachable remedies, not one.** For a path not inside the repo root, the staleness
  bullet, the "restart the command" bullet, and the "declare a scope" half of the last bullet are ALL
  unreachable, not only the `writes:` bullet the plan named. The build replaces the **whole** FIX block in
  that branch and the tests assert the **staleness** line's absence too.
- **G3 (P5) — the branch has three cases, not one.** `toRel()` returns `null` for outside-the-root, for a
  `../` traversal, and for the root ITSELF (`path.relative(ROOT, ROOT) === ""`; reproduced live with
  `file_path: "."`). The approved wording "NOT INSIDE the repo root" is true for all three; the build
  states that in the code comment and adds a `.` test.
- **G4 (P7) — no new I/O inside `denyMessage()`.** A throw while building the message exits non-2, which
  `PreToolUse` treats as a non-blocking error — a **fail-OPEN**. The new branch is pure string composition
  over `ROOT` (already resolved at module load in a `try/catch`) and the path already in hand.
- **G5 (P2)** — the "the message now advertises the Bash surface" concern is the trade-off the human ruled
  on at GATE 1; recorded, not reopened.

Test count consequently rises from the 4 declared above to **6** (G2's staleness assertion and G3's `.`
case). More assertions over the same file, on the same axis — no scope change.

## Post-review corrections (adopted at GATE 2 on the human's "fix" decision)

`REVIEW.md` returned **BLOCKED** with 1 floor-gate and 3 advisory findings. The human chose **fix**, so
all four are dispositioned here. Same `## Files` axis; two entries added above, both stated as added.

- **F1 (P0, blocking) — FIXED IN PLACE.** The `## Guarantee audit` line no longer says `floor:
structural`; it reads `advisory (code shape), with a FLOOR backstop: enum-regex (primitive #3)` at the
  claim itself, which is where [[L2]] says the honesty has to live.
- **F2 (P2, important) — FIXED IN THE HOOK.** `blockedPath` was the one echoed value still interpolated
  raw, so a `file_path` carrying U+000A forged an authoritative `FIX:` line — while the header asserted
  that _every_ echoed value passes `asData()`. Both branches now render it through `asData()`, the header
  is **re-derived** rather than patched-around ([[L25]]: when the thing a comment describes is repaired,
  re-derive what the comment claims), and two assertions pin the fold in **each** branch. Pre-existing at
  BASE, so this closes a defect the increment inherited rather than one it created.
- **F3 (P2, minor) — NO CODE CHANGE; it is a named residual, correctly.** The Bash boundary is prose and
  cannot become floor: the escape it names lives outside `PreToolUse` by construction, so no hook can
  backstop it. Recorded in `LIMITS`-style terms in `REVIEW.md` rather than papered over. Fixing it would
  mean gating Bash, which is a different subsystem and a different increment (P7 — no failure has
  triggered it).
- **F4 (P0, important) — FIXED BY DECLARING** the `.patch` artifact in `## Files` above, with the
  after-the-fact ordering stated in the entry itself.

**SKILLS_VERSION stays at 2.7.7.** That bump is `[Unreleased]` and uncommitted, so F2's hook change folds
into the same version and the same CHANGELOG entry rather than earning 2.7.8 — one unreleased version,
one entry, which is what the badge and `check-version-badge.mjs` compare against.

<!-- The original questions, as put to the human: -->

1. **Should the out-of-root message name the agent scratchpad prefix explicitly** (e.g. recognize
   `/private/tmp/claude-*` and say "this is your session scratchpad"), or key only on root-relativity?
   Recommendation: **root-relativity only**, for the two reasons in the determinism audit.
2. **How explicitly should the message name the Bash-tool escape?** Recommendation: **name it, scoped to
   scratch/temporary work**, since the whole defect is that today's message hides the only reachable route
   and thereby trains an _undirected_ bypass. The alternative — say only "the scope cannot authorize this"
   and stop — is more conservative but leaves the reader to rediscover Bash unguided.
3. **`CLAUDE.md` edit:** in scope per L1 (it states the now-conditional remedy), but it is dense, curated
   prose. Recommendation: **one added clause**, no restructuring.
