# PLAN — scope-file-case-guard

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4, pharn/ARCHITECTURE.md
- applied_lessons: [L1, L2, L3, L4, L7, L13, L17, L18, L19, L20]
- increment: Add `.pharn/writes-scope.json` to `protect-trusted-paths.cjs`'s `DEFAULT_PROTECTED`, so the writes-scope guard's own input is guarded by the same case-folding, symlink-resolving primitive as the trusted docs — closing a Write-tool self-escalation reachable on any case-insensitive filesystem.
- layer(s): floor / `.claude/` product surface (not a `pharn/` capability layer) # pharn/ARCHITECTURE.md §2, §4
- constitution_refs: [P0, P2, P5, P6, P7]

## Applied lessons

- **L1** — the meta-doc sweep ran: this increment changes a fact asserted in `CLAUDE.md` (hard
  constraint #1 enumerates exactly what `protect-trusted-paths.cjs` covers), in `SKILLS_VERSION`, in
  the `README.md` version badge, and in `CHANGELOG.md`. All four are named in `## Files` rather than
  left to drift.
- **L2** — the honesty travels with the artifact: the patch amends the hook's own header comment
  (the "Protected by default:" enumeration and a new HONEST BOUNDS line), not only this PLAN, and it
  cites only the primitive that is **live** — verified by running the patched hook this run, never
  assumed from the source reading.
- **L3** — the declaration re-audit ran before making the path load-bearing: every
  `.claude/commands/*.md` frontmatter `writes:` block was scanned for `writes-scope.json` and **none
  declares it** (the 14 grep hits are all prose/commentary), so no existing declaration is converted
  into a guaranteed block by this change.
- **L4** — the new tests are treated as authored-to-pass until measured: the fix was applied to a
  **sandbox copy** and the three assertions plus the full existing 106-test suite were run against it
  live (results in `## Discovery`), and the build step must re-measure that each new test **fails**
  against the unpatched hook before it is trusted.
- **L7** — `## Files` declares exactly the six paths this increment writes, and nothing aspirational:
  the hook itself is human-applied and is therefore in the exclusion heading, not in the write list.
- **L13** — this stage formats its own artifact (`prettier` + `markdownlint-cli2 --fix` over this
  PLAN.md alone) before halting.
- **L17** — `check-regress scope` asks changed-since-base, not written-by-the-build, so the
  human-applied edit to `.claude/hooks/protect-trusted-paths.cjs` **will** surface as a false "the
  build escaped its `## Files`" finding at `/pharn-dev-regress`. Pre-declared here as expected and
  disprovable: the agent cannot write that file (fix #2 denies it, exit 2, verified live this run).
- **L18** — the exclusion block below is a real `###` **heading**, not a bold prose intro, so
  `set-writes-scope.cjs --from-plan` structurally ends the authorized list there.
- **L19** — the formatter invocations are scoped to this stage's own artifact by path; no repo-wide
  `prettier --write .` is run, and the one Bash-written artifact outside the Write-tool gate (the
  `.patch` record) is declared in `## Files` rather than pretended to be gated.
- **L20** — L18's remedy is discipline-only, so it is escalated here: after writing this PLAN the
  setter is re-run with `--from-plan` and its **printed path count is read against the six declared
  paths** as a checkable number.

## Discovery (P6 — read live this run, never asserted from memory)

**The defect, reproduced before anything was changed:**

```text
protect-trusted-paths.cjs  .pharn/WRITES-SCOPE.JSON  → 0   (not covered)
protect-trusted-paths.cjs  .pharn/writes-scope.json  → 0   (not covered)
enforce-writes-scope.cjs   .pharn/WRITES-SCOPE.JSON  → 0   ← ALLOWED: the case variant slips past
enforce-writes-scope.cjs   .pharn/writes-scope.json  → 2   (denied, byte-exact)
```

`enforce-writes-scope.cjs:187` guards its own input with one byte-exact compare
(`if (rel === SCOPE_FILE) deny(...)`) while `ALWAYS = [".pharn/**"]` (line 61) makes everything else
under `.pharn/` writable. On a case-insensitive volume the two spellings are the same inode.

**The fix, proved in an isolated sandbox copy of the hook (the real hook was never written):**

```text
.pharn/writes-scope.json          → 2   denied
.pharn/WRITES-SCOPE.JSON          → 2   denied  ← the regression this increment exists for
.pharn/Writes-Scope.Json          → 2   denied  (mixed case, via the full fold)
.pharn/alias.json -> writes-scope.json (BROKEN symlink) → 2   denied  ← the second vector, also closed
.pharn/foo.json                   → 0   allowed (no over-block of `.pharn/`)
.pharn/lessons-index.md           → 0   allowed (the load-bearing product-index cache is untouched)
vendor/third-party/writes-scope.json → 0 allowed (the F4 invariant holds)
node --test protect-trusted-paths.test.cjs against the PATCHED hook → 106 tests, 106 pass, 0 fail
```

**Why no existing test breaks.** Three ✧ tests are _derived from source_ rather than restated, so they
pick the new entry up automatically: `every entry declared in DEFAULT_PROTECTED is denied at its
declared path` (asserts `length >= 11`; 11 → 12), `every .claude/ entry ... is denied` (filters
`.claude/`, unaffected), and `no declared entry over-blocks the same basename at depth` (builds
`vendor/third-party/writes-scope.json`, which exact matching allows). The cross-copy agreement guard in
`set-writes-scope.test.cjs` compares `CONTROL_SURFACE` against the hook's **`.claude/`-prefixed**
entries only, so a `.pharn/` entry cannot drift it.

**Two pre-existing baseline REDs, neither caused by this increment** (L11's shape; see
`## Open questions`):

```text
npm test        → 1   (1407 tests, 1405 pass, 2 fail)
format:check    → 1   (pharn.config.json)
lint:md         → 1   (6 untracked .pharn/ scratch files)
```

- **Red A** — the uncommitted working-tree change to `pharn.config.json` restructures
  `models.stages` → `models.claude.stages`. It fails `check-config.mjs validate` ("missing
  `models.stages` object"), the `★ live ★ agreement over the REAL repo config` test, and
  `format:check` (indentation). `format:check` is the **first** `&&`-chained gate in `npm run check`,
  so it short-circuits every later gate.
- **Red B** — `.markdownlint-cli2.jsonc` globs `**/*.md` and ignores only `.pharn/lessons-index.md`,
  not `.pharn/**`; markdownlint descends into dot-directories (the config's own comment records this,
  verified live). Six untracked scratch files — including the `.pharn/fixes/H2-*.md` request this
  increment came from — therefore fail `lint:md`, and through it the
  `style: a spliced README passes the repo's prettier and markdownlint unchanged` test.

## Files

- `.claude/hooks/protect-trusted-paths.test.cjs` — add the three requested tests: `.pharn/writes-scope.json` → exit 2, `.pharn/WRITES-SCOPE.JSON` → exit 2 (the regression), `.pharn/foo.json` → exit 0 (no over-block) — layer floor-tests
- `SKILLS_VERSION` — `2.7.0` → `2.7.1` (patch: a correction to product `.cjs` hook bytes that already shipped) — layer product-surface version
- `README.md` — the shields badge `pharn-2.7.0` → `pharn-2.7.1`, forced by `check-version-badge.mjs` (a live `npm run check` **and** `ci.yml` gate) — layer repo-meta
- `CHANGELOG.md` — one `### Fixed` entry under `[Unreleased]` recording the vector, the fix, and its honest bound — layer repo-meta
- `CLAUDE.md` — hard constraint #1's enumeration of the guards' control surface gains the scope file (L1) — layer repo-meta
- `.dev/features/scope-file-case-guard/protect-trusted-paths.patch` — the unified diff, recorded so the ship trail is self-contained — layer dev-artifact

### Deliberately NOT in scope

- `.claude/hooks/protect-trusted-paths.cjs` — **HUMAN-ONLY.** The file is its own `DEFAULT_PROTECTED`
  entry; `fix #2` denies the agent at exit 2, verified live this run. The change is delivered as a
  unified diff for a human to apply. This is the increment's whole point: a guard the agent may
  rewrite is not a floor op.
- `.claude/hooks/enforce-writes-scope.cjs` — its byte-exact `rel === SCOPE_FILE` compare **stays**
  (defense in depth, as requested). Human-only regardless.
- `.claude/hooks/set-writes-scope.cjs` — `CONTROL_SURFACE` is deliberately **not** extended.
  Adding `.pharn/writes-scope.json` there would break the ✧ cross-copy agreement test, which compares
  `CONTROL_SURFACE` to the hook's `.claude/`-prefixed entries only, and would pull a third copy and a
  test rewrite into this increment — a second axis of change (P3) with no triggering failure (P7).
  The setter writes the file with `fs.writeFileSync`, so `PreToolUse` never sees it and the setter is
  unaffected by this change.
- `pharn/CONSTITUTION.md`, `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`, `LIMITS.md` — trusted docs,
  human-only; nothing here needs them changed.
- `pharn.config.json` — pre-existing working-tree red (Red A). A separate axis of change (P3).
- `.markdownlint-cli2.jsonc` and the untracked `.pharn/` scratch files — pre-existing red (Red B).
  A separate axis of change (P3).

## Contracts satisfied

- No `pharn/pharn-contracts/*` contract is amended. The change is a membership addition to an existing
  floor hook, so `pharn/ARCHITECTURE.md §2` primitive #1 (hooks) and primitive #3 (enum/regex
  membership) are **cited, not restated** (P4).

## Evals to write (P1)

- **None, and the absence is reasoned, not an omission.** P1 attaches to a Capability — a `.md` file
  whose frontmatter carries a `role:`. This increment adds no `role:`-bearing file and no `rule_id`,
  so no `evals/cases/*` + `evals/expected/*` pair is owed. The hook's regression suite is its
  `*.test.cjs` file, and the three new cases above are that suite's equivalent obligation.

## Guarantee audit (P0)

- **Both case spellings of `.pharn/writes-scope.json`, and a symlink alias onto it, are denied to
  `Write|Edit|MultiEdit|NotebookEdit`** → **FLOOR: hook** (primitive #1), deciding by exact
  repo-relative membership under the full `toUpperCase().toLowerCase()` fold plus segment-wise symlink
  resolution (primitive #3 inside it). Measured live against the patched hook, not inferred.
- **The agent cannot self-escalate its own writes-scope** → **FLOOR, NARROWED, and the narrowing is
  the honest half.** It covers the Write-tool surface only. **Bash-tool writes bypass `PreToolUse`
  hooks entirely**, so a `node -e`/`cat >` write to the scope file is untouched by this change — the
  hook's own header and `CLAUDE.md` already state this bound and it is not weakened or improved here.
  Write "the Write-tool vector is closed", never "the scope file cannot be rewritten".
- **The new tests prove the fix** → **two clocks.** Their _verdict_ is floor-grade only through
  `npm test`'s membership in `check-verify.mjs`'s gate map; their _existence_ is advisory, and an
  authored assertion passes by construction until measured against the unpatched hook (L4).
- **`SKILLS_VERSION` and the README badge agree** → **FLOOR: enum/regex**
  (`.dev/floor/check-version-badge.mjs`, wired in `npm run check` and as its own `ci.yml` step).
- **The bump is the right SemVer size, and the CHANGELOG/`CLAUDE.md` prose is true** → **ADVISORY.**
  No checker reads either; a wrong-sized bump with a matching badge stays GREEN.
- **Nothing here is a new floor primitive.** One entry is added to an existing set (P7).

## Trust audit (P2)

- **Input:** `.pharn/fixes/H2-scope-file-self-escalation.md` — untracked scratch prose, therefore
  `trust: untrusted`. Its every factual claim was treated as DATA and **re-verified live** rather than
  believed: the `enforce-writes-scope.cjs:187` byte-exact compare and the `ALWAYS` glob at line 61 were
  read at those lines, and the four-way exit-code matrix was reproduced. No instruction inside it steers
  a gate; the proceed/stop decisions in this run rest only on exit codes.
- **Output taint:** none propagates. The plan's decisions are exit codes and path sets — enum-gated and
  floor-verifiable throughout. The quoted free text above is rendered as DATA for the human.

## Determinism audit (P5)

- Every branch this increment adds or relies on is a membership test: the hook's `PROTECTED_KEYS.has()`
  set membership over folded keys; the tests' exit-code equality; `check-version-badge`'s string
  compare. No LLM classification drives any branch.
- The terminal fallback is **ask**: both unresolved items below are put to the human, not guessed.

## Open questions (RESOLVED at GATE 1 — recorded verbatim, not re-decided)

Both were put to the human as selectable forms at the plan halt and answered before `/pharn-dev-build`
was invoked. They are recorded here because `/pharn-dev-build` Step 1 HALTs on an **unresolved** HALT
block, and a plan whose questions were answered off-document would read as unapproved.

1. **When does the human apply the hook diff?** The three new tests hard-code the assertion
   `exit 2`, so they **fail against the unpatched hook** — deliberately (an assertion that cannot fail
   is worthless, L4). Applying the diff **before** `/pharn-dev-build` lets the chain run clean in one
   pass; applying it after means `/pharn-dev-verify` returns FAIL and the chain STOPs until it lands.
   - **RESOLVED — "Apply now, before build."** The human applies the diff by hand; the agent never
     writes the hook. **Standing at build time: NOT YET APPLIED** (verified live — `grep` finds no
     `.pharn/writes-scope.json` entry in `DEFAULT_PROTECTED`, and the real hook still exits `0` on both
     case spellings). The build proceeds because none of its six files depend on the patch, and this is
     in fact the **only** cheap moment to take the L4 rejection measurement the plan owes: the
     unpatched hook is live now, and once the patch lands the mutation must be inverted (GRILL.md,
     testability finding). `/pharn-dev-verify` will FAIL until the patch is applied — expected, named,
     and not a defect in the increment.
2. **What happens to the two pre-existing baseline reds (A and B)?** `/pharn-dev-verify`'s floor
   verdict is absolute — PASS iff every gate exits 0 — so it will FAIL on Red A and Red B no matter
   how correct this increment is (L11). Fixing either inside this increment adds a second axis of
   change (P3); leaving them means the chain STOPs at verify with a known, pre-existing cause.
   - **RESOLVED — "fix them first, then proceed."** Both were repaired **outside** this increment,
     before it began, and neither file is in `## Files`: Red A the human reverted by hand
     (`check-config.mjs validate` → GREEN); Red B was fixed under its own declared writes-scope,
     recorded in `.dev/features/scope-file-case-guard/BASELINE-REPAIR.md`. Measured after both:
     `npm test` 1407/1407, and `format:check` / `lint:md` / `check:badge` / `docs:check` /
     `check:markers` / `validate` all exit 0. A later verify FAIL therefore cannot be attributed to
     pre-existing state — which was the point of repairing them first.
