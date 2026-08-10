# PLAN — verification-corrections

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4
- applied_lessons: [L1, L2, L5, L13, L16, L18, L20]
- increment: Fix the eight defects an adversarial verification pass reproduced in the three preceding commits — one **blocking** (`/pharn-regress` would RED on every product run), one detection **regression**, one silent-empty-digest CLI bug, plus five doc/consistency defects — and pin each with a test.
- layer(s): `pharn/floor/` (product floor + shipped doc), `.dev/floor/` (apparatus), `.claude/commands/` (both surfaces).
- constitution_refs: [P0, P2, P4, P5, P6, P7]

## Applied lessons

- L20 — the recurrence rule turned on **this** work: the preceding commit gave L17 a floor check, and that check shipped with a filename enum derived from the **dev** pipeline's artifacts only. The remedy is structural, not a longer list from memory: the enum is now justified against a **deterministic enumeration** of what the commands actually declare (`grep -hoE 'features/<name>/[A-Za-z0-9._-]+' .claude/commands/*.md`), and a test asserts the enum covers every artifact any command declares — so the next new artifact fails a test instead of REDing a user's pipeline.
- L5 — a floor verdict is only as trustworthy as the input capture. Two of these defects are exactly that: `parseList` splits `--changed` on **whitespace**, and `git diff --name-only` does not quote a space in a path, so one real file can be split into tokens that are each separately declared-or-exempt. The verdict core was right; its operands were not.
- L16 — the remedy is itself an input-capture surface. The preceding commit's remedy (an exemption set) **created** the laundering path in L5's shape: before it, the split-out token was an escape; after it, the token can be exempt. Fixing a check can open a hole in the check.
- L2 — the honesty travels with the artifact: every narrowed bound below is written into the module's own HONEST SCOPE block, not only into this plan.
- L1 — meta-doc sweep: `CHANGELOG.md` + `SKILLS_VERSION` are in `## Files`, plus the two `[Unreleased]` entries that later commits falsified.
- L13 / L18 — artifacts formatted scoped to themselves; the exclusion block is a `###` heading.

## Files

- `pharn/floor/check-regress.mjs` — the artifact enum, the `parseList` separator, the `--feature` shape gate, the narrowed HONEST SCOPE — layer `pharn/floor/`
- `pharn/floor/check-regress.test.mjs` — a test per defect, plus the enum-covers-every-declared-artifact test — layer `pharn/floor/` (test)
- `pharn/floor/README.md` — the 6-of-8 check list, the missing `pharn/floor/` exclusion, five broken relative paths — layer `pharn/floor/` (shipped doc)
- `.claude/commands/pharn-regress.md` — state the real exempt set and the narrowed bound — product command
- `.claude/commands/pharn-dev-regress.md` — same — dev command
- `.dev/floor/hash-doc.mjs` — the CLI entry guard + the BOM bound — layer `.dev/floor/`
- `.dev/floor/hash-doc.test.mjs` — pin the guard both ways — layer `.dev/floor/` (test)
- `.github/workflows/gitleaks.yml` — a comment citing a floor path that has not existed since the relocation — repo-meta
- `CHANGELOG.md` — correct the two falsified clauses + one new entry — repo-meta
- `SKILLS_VERSION` — `2.4.5` → `2.4.6` (patch) — repo-meta

### Deliberately NOT in scope

- A `## Files`-diff check inside `scope` (the principled remedy for the narrowing below) — a genuinely new deterministic check on a different axis; it is **named as a follow-up in the module's own HONEST SCOPE**, not smuggled in here.
- Every other `pharn/floor/*` checker, and the trusted docs.
- `.dev/memory-bank/lessons-learned.md` — canon is human-gated (L7).

## Contracts satisfied

- No contract changes shape. `escape_exempt` stays an enum-gated, paths-only field; the `finding-shape.md` split is untouched (cited, not restated — P4).

## Evals to write (P1)

No Capability, no `rule_id` — the obligation is the test suite, one case per reproduced defect:

- **D1 (blocking)** → `features/<f>/BUILD.md`, `SPEC.md`, `findings.json` and `lenses/<lens>/findings.json` are exempt under `--feature`; the product-pipeline shape that RED'd on every run now exits 0.
- **D1-recurrence** → a test that reads every `features/<name>/<artifact>` string the `.claude/commands/*.md` actually declare and asserts each is covered by the enum, so a newly-added artifact breaks a test rather than a user's pipeline.
- **D3** → a single path containing a space is **one** path: `--changed "THREAT-MODEL.md LIMITS.md"` must NOT split into two exempt tokens; it stays one undeclared path and REDs.
- **D9** → a `--feature` containing `/`, `..`, or a glob char is **rejected fail-closed** (exit 2), which makes the module's own comment true instead of narrowing it.
- **D4** → invoking `hash-doc.mjs` under a differently-cased or symlinked `argv[1]` still prints a digest and never exits 0 silently; importing it never exits the importer.
- **Non-regression** → the ten existing escape-exempt cases still hold.

## Guarantee audit (P0)

- "The exempt set covers exactly the pipeline's own artifacts" → **floor: enum membership**, and now **justified against a deterministic enumeration** rather than recalled — with a test that fails when the two diverge. The enumeration itself is a grep over command prose, so it is **advisory input to a floor enum**: the test proves enum ⊇ enumerated set, never that the commands' prose is complete.
- "A single path is never split into multiple paths" → **floor: parsing**. Separator narrowed to comma/newline; a space is a legal filename character and is now treated as one.
- "A crafted `--feature` cannot widen the exemption" → **floor: enum/regex**, and now literally true — a `--feature` outside `[A-Za-z0-9._-]+` is rejected at exit 2 rather than reasoned about. The previous wording claimed this while `..` in fact matched.
- **The narrowing this whole exemption introduces, stated plainly (new, and the most important line here):** a build that **rewrites its own `features/<name>/PLAN.md` `## Files`** to retroactively authorize a path it wrote is **no longer detected** by this check — the plan edit is exempt, and the added path then reads as declared. Before the exemption it was caught. Nothing else catches it: `check-plan-spec-agree.mjs` reads only `spec_content_hash` from the PLAN, which a `## Files` edit does not move. This is **advisory-by-absence**, it is written into the module's HONEST SCOPE, and the deterministic remedy (compare `git show <base>:…/PLAN.md`'s `## Files` against HEAD's) is named there as a follow-up.

## Trust audit (P2)

Unchanged in shape: every operand is a path string or an enum member, never free text, never executed. The `--feature` shape gate **reduces** the untrusted surface — a value that is not a plain slug is refused rather than concatenated into a prefix.

## Determinism audit (P5)

All new branches are membership/shape tests: exact filename in the enum, one nested `lenses/<x>/findings.json` shape, a `[A-Za-z0-9._-]+` slug regex, a comma/newline split. The terminal outcome of a non-member `--feature` is a loud exit 2, never a guess.

## Open questions (HALT)

None. Every defect was reproduced live before being scoped, and each fix was verified by re-running the reproduction.
