# PLAN — guard-self-protection (F3: the pre-write guards do not protect their own control surface)

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4, pharn/ARCHITECTURE.md
- applied_lessons: [L1, L3, L7, L8, L12, L13, L14, L18, L19, L20]
- increment: close F3 — make the `.claude/` control surface (settings.json + the three hook files) non-writable by the Write/Edit/MultiEdit tool, at both pre-write guards.
- layer(s): floor (`.claude/hooks/` — the hook primitive, pharn/ARCHITECTURE.md §2 #1); no capability, no `role:`
- constitution_refs: [P0, P2, P5, P6, P7]

## Applied lessons

- **L1** — meta-doc sweep run: this increment changes a fact asserted in `CLAUDE.md` (§Writes-scope, §Hard
  constraints), `pharn/floor/README.md:70-73`, `THREAT-MODEL.md:86` and `.claude/settings.json`'s `_comment`.
  Only `CHANGELOG.md`, `SKILLS_VERSION` and `settings.json._comment` are in this increment's `## Files`; the
  other three are named as human/follow-up items below rather than left silently stale.
- **L3** — the re-audit L3 prescribes was RUN, not assumed: `set-writes-scope.cjs --from-plan` was executed
  over all 105 `.dev/features/*/PLAN.md` (104 parseable) in a temp cwd. Result **settled** Open Question 1
  at the GATE-1 halt — a whole-`.claude/` refusal would have rejected **46 of 104** historical plans; the
  chosen control-4 refusal rejects **6 of 104**, each one an edits-a-guard increment. Making a field
  load-bearing without this audit was L3's exact failure.
  **And L3 bit anyway, at a corpus the audit did not cover:** two `## Files` fixtures live _inside_
  `.claude/hooks/enforce-writes-scope.test.cjs`, not under `.dev/features/`, so the sweep missed them and
  they reddened at the first full gate. Recorded here rather than quietly fixed — the lesson's real scope is
  "every existing declaration of the field", and a declaration can be a **test fixture**, not only a
  document. This is the candidate for a follow-up promotion.
- **L7** — L7 names as a residual that "nothing enumerates every command's `writes:` for canon paths".
  Change B is the floor check for the `.claude/` half of that residual: an over-declaration naming a guard
  can no longer be resolved into an active scope silently.
- **L8** — the bootstrap scope uses **concrete** `writes:` entries in a scratch frontmatter file, precisely
  because the setter narrows only ONE `--target` per call; concrete entries pass through, so all eight paths
  survive a single call and no per-artifact re-scoping is needed.
- **L12 / L13** — this PLAN.md is formatted with prettier + markdownlint immediately after writing, and the
  build will format its own written files before the floor rather than leaving them for verify.
- **L14** — the setter's new `.claude/` refusal is layered **after** the existing `scope.length === 0`
  fail-closed check, never as a replacement; both must remain reachable.
- **L18** — this plan's exclusion block below is a `###` **heading**, not a bold prose intro, so the setter
  terminates the authorized list structurally regardless of wording.
- **L19** — the Bash-run steps that escape fix #7 scope are declared, not pretended-covered: the scratch
  scope-source under `.pharn/` and the `npx prettier` / `markdownlint-cli2` formatting runs. The scratch file
  is written with the **Write tool** (`.pharn/**` is in the hook's ALWAYS set), so it passes the gate rather
  than bypassing it — one fewer Bash escape than the supplied procedure prescribed.
- **L20** — this increment IS an L20 escalation: F3 is the "a guard's own control surface is protected only
  by discipline" case, and L18's recurrence (`product-capability-catalog`) already granted write-scope to
  `.claude/commands/pharn-plan.md` and `SKILLS_VERSION` through a plan's prose. Discipline is replaced with
  a deterministic path check at both guards.

## Files

- `.claude/hooks/protect-trusted-paths.cjs` — **EDIT (change A, ARMED LAST).** Extend `DEFAULT_PROTECTED`
  with four `.claude/`-qualified path fragments; update the header to state the widened set. Layer: floor.
- `.claude/hooks/protect-trusted-paths.test.cjs` — **EDIT.** Add deny cases (4 control files + a symlink
  onto `.claude/settings.json`), anti-F4-widening allow cases, and the pre-existing-trusted regressions.
  Plus (post-review, REVIEW F1) a ✧ test deriving the `.claude/` entries from `DEFAULT_PROTECTED`'s source
  and asserting each is actually denied, so a future fifth entry cannot ship untested.
- `.claude/hooks/set-writes-scope.cjs` — **EDIT (change B).** Add `--allow-claude-dir` as its own arg-loop
  branch; add a refusal over the **same four control paths** change A protects, layered **after** the
  existing empty-scope fail (L14); update header/usage. Layer: floor.
- `.claude/hooks/set-writes-scope.test.cjs` — **EDIT.** Add refusal / opt-in / regression cases. Plus
  (post-review, REVIEW F1) the ✧ **cross-copy agreement guard**: the four control paths are a deliberate
  duplicate, so three ✧ tests pin all **three** copies to the same set — `CONTROL_SURFACE`, the hook's
  `.claude/` `DEFAULT_PROTECTED` entries, and this file's own literal — each derived from source, none
  restated in the assertion. This is the `check-provenance.test.mjs` discipline the precedent requires.
- `.claude/settings.json` — **EDIT, `_comment` field only, BEFORE arming change A.** State that the
  trusted-path guard now also protects itself, the other two hooks, and this file.
- `CHANGELOG.md` — **EDIT.** One `## [Unreleased]` entry recording the change and the version bump.
- `SKILLS_VERSION` — **EDIT.** `2.3.0` → `2.3.1` (product-surface patch; see Versioning).
- `CLAUDE.md` — **EDIT** (added at the GATE-1 halt, Q3). Record in §Hard constraints / §Writes-scope that
  the trusted-path guard now also protects the guards' own control surface, and that the setter refuses to
  scope those four paths without `--allow-claude-dir`. Repo-meta: does not itself trigger a version bump.
- `pharn/floor/README.md` — **EDIT** (added at the post-review halt). Its "Wire the write-guard hook"
  section enumerated the protected set as the four trusted docs — already stale before this increment (it
  omitted `CODEOWNERS`) and made staler by it. Product surface shipping under `2.3.1`, so it is corrected
  here rather than shipped knowingly wrong; the setter's refusal and the Bash bound are stated too.
- `.claude/hooks/enforce-writes-scope.test.cjs` — **EDIT, 4 fixture lines** (added at a second human halt,
  mid-build). The hook itself is untouched. Two pre-existing fixtures put a control path in a PLAN's
  **authorized** `## Files`, which change B correctly refuses, reddening two boundary-parsing tests. The
  authorized entries move to the hooks' `*.test.cjs` siblings — outside the refusal set — so both tests keep
  pinning the same boundary on the default (no-flag) path and now also document the carve-out. The control
  path in the **exclusion** section is left in place: excluded paths never enter scope, so they never reach
  the refusal. Verified 39/41 → 41/41.

### Deliberately NOT in scope

- `.claude/hooks/enforce-writes-scope.cjs` — already realpath-denies out-of-scope writes; unchanged.
- `.claude/commands/*.md` — **not** frozen by change A, **not** in change B's refusal set, and **not**
  edited. Freezing or refusing them would break the self-hosting loop (46 of 104 historical plans write one).
- `.claude/hooks/*.test.cjs` — deliberately outside **both** the protected list and the refusal set: this
  increment must edit two of them, and a guard that froze its own tests would be unmaintainable.
- `pharn/CONSTITUTION.md`, `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`, `LIMITS.md`, `CODEOWNERS` —
  trusted/human-only, hook-denied (fix #2). Flagged for a human below; never agent-edited.
- `pharn/floor/README.md` — enumerates the protected set and is already stale (omits `CODEOWNERS`); it is
  outside this increment's approved edit set. Named as a follow-up, not silently left.
- `package.json`, CI workflows, any `pharn/**` — untouched.

## Contracts satisfied

- `pharn/ARCHITECTURE.md §2` primitive #1 (hook) and #3 (enum/regex) — the change adds no new primitive;
  it widens an existing hook denylist and adds a membership test to an existing deterministic parser.
- `pharn/ARCHITECTURE.md §7` (fix #2 / fix #7 composition) — a deny from either guard blocks; unchanged.

## Evals to write (P1)

Hooks carry no `role:`, so their eval-equivalent is their `*.test.cjs` (the repo's established precedent).

- `protect-trusted-paths` → deny `.claude/settings.json`; deny each of the three hook files; deny a symlink
  in an allowed dir resolving onto `.claude/settings.json`; **allow** root `settings.json`,
  `.vscode/settings.json`, `src/enforce-writes-scope.cjs`, and `.claude/hooks/*.test.cjs`; still deny the
  four trusted docs + `CODEOWNERS`.
- `set-writes-scope` → `--from-plan` naming a refused path exits non-zero and writes nothing; the same plan
  with `--allow-claude-dir` exits 0 and the scope contains the entry; `--from-frontmatter` with a refused
  `writes:` entry is rejected without the flag; a plan with no refused path emits the identical scope as
  before; `--allow-claude-dir` does not corrupt positional `mode`/`file` parsing.

## Guarantee audit (P0)

- "the four `.claude/` control files cannot be written by Write/Edit/MultiEdit" → **FLOOR: hook**
  (`protect-trusted-paths.cjs`, path-fragment membership). Bounded: Write-tool surface only.
- "a PLAN or `writes:` cannot silently authorize a scope over one of the four control paths" → **FLOOR:
  enum** (deterministic exact-membership test in the setter, before any file write).
- "the two guards cover the SAME four paths" → **FLOOR: enum, within the `test` gate** (the ✧ cross-copy
  agreement guard, `set-writes-scope.test.cjs`; binding via `check-verify.mjs`'s gate map, the standing
  every `*.test.cjs` has). Before the post-review fix this claim was a **code comment only** — REVIEW F1,
  and the exact P0 disease. **Narrowed and stated:** it pins the declared SETS are equal, **not** that the
  two guards behave identically on them (the hook matches path fragments; the setter does exact membership
  over a normalized entry) — declarations, not logic. Measured rejecting three mutants (L4).
- "the `.claude/` control surface cannot be modified at all" → **STRUCK.** Bash-tool writes bypass
  PreToolUse hooks entirely; `cat > .claude/settings.json` still works. Identical in kind to the standing
  residual for the four trusted docs (`THREAT-MODEL.md:86`). Advisory, named, not closed here.
- "the setter's refusal catches every path that reaches a control file" → **STRUCK / NARROWED.** The
  setter's test is **lexical** (no realpath, no `..`-normalization), so a symlink or an indirect path
  declared in `## Files` that resolves onto a control file is not caught there. Defense-in-depth ordering:
  `enforce-writes-scope.cjs` realpaths the write target and denies it out of scope, and post-change
  `protect-trusted-paths.cjs` realpaths and denies the four control files specifically. The setter is the
  loud early failure, not the last line.
- "the whole `.claude/` tree is guarded" → **STRUCK.** By the GATE-1 decision, `.claude/commands/**` and
  `.claude/hooks/*.test.cjs` are deliberately outside both the protected list and the refusal set. A PLAN
  can still authorize a write to a command file — bounded, chosen, and named, not overlooked.
- "F4 (the `isProtected()` substring/case over-match) is fixed" → **STRUCK.** Separate axis (P3), untouched.
  The fragment form was chosen so it does not _worsen_ F4; verified live against the anti-widening cases.

## Trust audit (P2)

- A `PLAN.md` is `trust: untrusted`. Today its `## Files` free text flows into an _authorization_ decision
  (the emitted scope) — the F3 defect. After change B the untrusted list is filtered by a deterministic
  membership test before it can authorize a control-surface write; the refusal decision reads only the
  parsed path strings, never any free-text field. Taint reaches the _message_, never the _decision_.
- `--allow-claude-dir` is an operator-supplied **argv** flag, not a field any untrusted artifact can set —
  a PLAN cannot opt itself in.

## Determinism audit (P5)

- Both new branches are membership tests over the **same fixed four-element set**: a path-fragment match in
  the hook, exact-string membership in the setter. No classification, no LLM.
- The terminal fallback on refusal is exit non-zero + a message naming the offending entry — the human then
  decides to re-scope or to pass `--allow-claude-dir`. It ends in "ask", never a guess.

## Versioning

`SKILLS_VERSION` `2.3.0` → **`2.3.1`** (patch: a security correction to bytes that already shipped; no
contract / finding-shape / frontmatter change, no existing install invalidated). Verified live: there is no
manifest in this repo and `pharn.config.json` carries no `skillsVersion` key, so `SKILLS_VERSION` + the
`CHANGELOG.md` entry are the whole version story.

## Corrections to the supplied write procedure (discovered at HALT 1)

1. **The prescribed bootstrap scope is incomplete and would fail-closed mid-build.** It lists only the five
   `.claude/` paths. A **set** scope replaces the default-safe-set, so writes to `CHANGELOG.md` and
   `SKILLS_VERSION` — both in the may-edit whitelist — would be **denied**. The bootstrap must declare all
   **eight** `## Files` paths. (This is L7/L3's failure mode: declaration ≠ what is actually written.)
2. **The scratch scope-source needs no Bash bypass.** `.pharn/**` is in the enforcing hook's ALWAYS set, so
   `.pharn/f3-scope.md` is writable with the Write tool and passes both guards (L19: prefer the gated write).

## Open questions — RESOLVED at the GATE-1 human halt (2026-08-07)

1. **Refusal-set width in change B — the one genuine ambiguity, and it was decision-changing.** The build
   prompt's _axis_ said "the `.claude/` **control surface**" while its _change B_ text said "any `.claude/`
   path", and its change A protects exactly four files. Live audit over 104 setter-parseable historical
   plans: whole-`.claude/` refuses **46**; control-4-only refuses **6**.
   → **RESOLVED: the four control files only.** All 6 refused plans are exactly the "this increment edits a
   guard" case that should need an explicit opt-in; the two guards now agree on one identical set; and a
   flag that had to be passed on 46 of 104 builds would become routine — a discipline remedy, which is the
   anti-pattern **L20** was promoted about.
2. **Update `.claude/settings.json`'s `_comment`?** → **RESOLVED: yes** (L1 meta-doc sweep). Must land
   **before** change A arms, since arming freezes the file.
3. **Update `CLAUDE.md`?** Discovery found that `CLAUDE.md` describes the guards' behaviour (§Hard
   constraints line 77, §Writes-scope line 206) but does **not** enumerate `DEFAULT_PROTECTED` as a list and
   does not state the setter's emit rule — so the prompt's own conditional evaluated to _no_.
   → **RESOLVED: update it anyway** (human override of the prompt's conditional). `CLAUDE.md` is injected as
   project instructions every session, so it should describe the guards accurately. Added to `## Files`;
   being pure repo-meta it does **not** itself trigger a version bump — the hooks already do.

## Flagged for a HUMAN (trusted/human-only or out of the approved edit set — never agent-edited)

- `THREAT-MODEL.md:86` (§4, fix #2) — records the guard as covering "trusted source files"; after this
  change it also protects itself, the other two hooks, and `settings.json`. Will read stale.
- `LIMITS.md` — no note yet that the guards' own control surface is Write-tool-protected with a standing
  Bash residual.
- `pharn/floor/README.md:70-73` — enumerates the protected set as the four docs; **already** stale (omits
  `CODEOWNERS`) and will become more so. Product surface, outside this increment's edit set.
- **F4** — the `isProtected()` substring/case over-match. Separate axis; deliberately not folded in.
