# PLAN — entry-point-guard

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L3, L6, L10, L13, L16, L19, L20, L22, L24]
- increment: Repair the CLI entry-point guard in the 10 floor scripts that compare `import.meta.url`
  against an un-percent-encoded `` `file://${process.argv[1]}` ``, so a checker invoked from a path
  containing a space or non-ASCII character stops exiting 0 having checked nothing; pin the repaired
  idiom with one deterministic family test.
- layer(s): floor (`pharn/floor/`, `.dev/floor/`) — not a capability layer; no `pharn-*` module changes
- constitution_refs: [P0, P5, P6, P7]

## Applied lessons

- L3 — Re-audited **every** occurrence of the guard idiom repo-wide before scoping, not only the sites
  the request named. The audit changed the file set: the request listed `.dev/floor/hash-doc.mjs`, which
  is **already repaired** (it uses `import.meta.main`; only its explanatory comment quotes the old
  idiom). The real set is **10** files (5 product + 5 dev), not 11.
- L6 — The family test's substring sweep is labeled for what it is: a **vocabulary** assertion over a
  banned spelling, **not** a membership test and **not** proof of correct behavior. The behavioral half
  is a separate spawn probe, so no structural claim rests on the grep alone.
- L10 — The new test lands under `.dev/floor/` (apparatus, never scanned by `validate.mjs`, never
  shipped), which is also why it triggers no `SKILLS_VERSION` bump; the 5 product `.mjs` edits do.
- L13 — This stage formats **its own** artifact (`PLAN.md`) immediately after writing it.
- L16 — The remedy is itself checked for a portability trap: `import.meta.main` requires Node ≥ 24.2, so
  the plan records the live floor (`node --version` = v24.13.1; `ci.yml` `node-version: 24`; no
  `engines` pin in `package.json`) rather than assuming the newer form is safe.
- L19 — The formatter invocations are scoped to this stage's own artifact; no repo-wide `prettier
--write .` appears anywhere in this increment.
- L20 — The remedy is **not** "remember to use the right idiom." The idiom has now been mis-copied into
  10 files, which is the escalation trigger: the increment adds a deterministic check that fails on the
  banned spelling, so the eleventh copy REDs instead of silently no-op'ing.
- L22 — The correct guard is **pinned as a literal line** in the test's own header, with the wrong forms
  named beside it, rather than described in prose that leaves the choice open — this defect class is a
  prose-prescribed technique that accumulated wrong implementations.
- L24 — The "it is fixed" claim is re-derived against an input chosen to break the **new** form, not
  inherited from the old fixtures: a symlink probe was run live, and it shows the requested
  `pathToFileURL(...).href` repair **still fails** there (see `## Open questions`). The spaced-path
  fixtures alone would have proved nothing about that axis.

## Files

- `pharn/floor/check-ship-briefing.mjs` — replace the entry-point guard — layer floor (product)
- `pharn/floor/render-ship-briefing.mjs` — replace the entry-point guard — layer floor (product)
- `pharn/floor/render-cost-record.mjs` — replace the entry-point guard — layer floor (product)
- `pharn/floor/check-lessons-index.mjs` — replace the entry-point guard — layer floor (product)
- `pharn/floor/gen-lessons-index.mjs` — replace the entry-point guard — layer floor (product)
- `.dev/floor/gen-capability-catalog.mjs` — replace the entry-point guard — layer floor (dev)
- `.dev/floor/check-capability-catalog.mjs` — replace the entry-point guard — layer floor (dev)
- `.dev/floor/check-version-badge.mjs` — replace the entry-point guard — layer floor (dev)
- `.dev/floor/check-lessons-index.mjs` — replace the entry-point guard — layer floor (dev)
- `.dev/floor/gen-lessons-index.mjs` — replace the entry-point guard — layer floor (dev)
- `.dev/floor/entry-point-guard.test.mjs` — NEW: the family test (vocabulary sweep + behavioral spawn
  probes over both floors) — layer floor (dev apparatus; never ships)
- `SKILLS_VERSION` — `2.7.4` → `2.7.5` (patch: a correction to bytes that already shipped)
- `README.md` — the shields badge on line 13 (`pharn-2.7.4` → `pharn-2.7.5`) — **coupled to the bump**:
  `.dev/floor/check-version-badge.mjs` REDs `npm run check` and CI if the badge disagrees with
  `SKILLS_VERSION`. The badge sits in unguarded prose **outside** the `CURRENT-STATE` markers, so it is
  hand-edited, not regenerated.
- `CHANGELOG.md` — one `[Unreleased] → ### Fixed` entry recording the defect and the bump
- `.dev/floor/hash-doc.mjs` — **ADDED AT GATE 2, see the amendment note below** — reword the one comment
  clause the build itself invalidated; its guard is already correct and stays byte-identical

### Amendment note (GATE-2 "fix", recorded rather than silent)

`.dev/floor/hash-doc.mjs` moved from the exclusion list into `## Files` **after** iteration 1's
`/pharn-dev-review`, on the human's explicit GATE-2 decision to fix. It is recorded here, in the plan,
because `check-regress.mjs scope` compares changed paths against this very list — so a plan edited to
authorize a path it already wrote would be **invisible** to that check (the honest gap
`check-regress.mjs` names in its own scope block, and which `check-plan-spec-agree.mjs` cannot see
either, since a `## Files` edit does not move `spec_content_hash`). The audit trail is therefore this
paragraph, deliberately: **nothing was written to `hash-doc.mjs` before this line existed**, the
GATE-1-approved intent is unchanged, and the amendment adds one comment reword — no guard, no behavior.

### Not written by this increment

- `pharn/CONSTITUTION.md`, `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`, `LIMITS.md` — human-only.
- `docs/capabilities/**`, README `CURRENT-STATE` block, `docs/lessons-index.md` — generated regions; the
  increment adds no `pharn/floor/*.mjs` **checker** (the new file is a `.dev/` test), so the rendered
  floor-checker count does not move. Re-verified at build via `npm run docs:check`.

## Contracts satisfied

- None amended. This is a defect repair inside existing floor scripts; no `pharn/pharn-contracts/`
  schema changes shape. `pharn/ARCHITECTURE.md §2` primitive #3 (enum/regex) is the primitive the new
  test reduces to — cited, not restated (P4).

## Evals to write (P1)

P1 governs **Capabilities** (`role:`-bearing `.md` files). This increment adds no capability and
changes no `enforces` list, so no `evals/cases/*` + `evals/expected/*` pair is owed. The equivalent
obligation for a floor script is its `*.test.mjs`, which this increment supplies:

- banned-spelling sweep → every `*.mjs` under `pharn/floor/` and `.dev/floor/` (tests excluded) must
  not contain `` `file://${process.argv[1]}` `` as executable code
- spaced-dir behavioral probe (`check-ship-briefing.mjs` on a missing input) → non-zero exit **and**
  the `RED —` line, byte-identical to the normal-path invocation
- spaced-dir token probe (`check-lessons-index.mjs --verdict`) → prints a member of
  `{NO_CANON, COLD, GREEN, STALE, ENUM_ERROR}`, identical to the normal-path invocation
- non-ASCII-dir probe → same two assertions (the request names non-ASCII; the sweep must cover it)
- negative control → the same script **imported** (not run as entry point) executes no `main()`

## Guarantee audit (P0)

- "A checker invoked from a spaced/non-ASCII path now runs `main()`" → **floor: enum/regex** — the
  behavioral probe spawns the real script from such a directory and asserts a non-zero exit + the
  expected output token by set membership. Not a claim about paths never probed.
- "No floor script carries the banned guard spelling" → **floor: enum/regex**, and **narrowed**: it is
  a negative assertion over one **known-bad string**, a vocabulary pin in the shape of
  `.dev/floor/command-hygiene.test.mjs`. A **novel** wrong spelling (a hand-rolled `decodeURI`, a
  `endsWith()` suffix match, a new file added after this run that invents its own form) passes
  untouched. "The sweep is green" NEVER means "every entry guard in the repo is correct."
- "The repaired guard is correct for **all** paths" → **advisory, and explicitly bounded.** Which forms
  hold is measured, not asserted (see `## Open questions`): the requested `pathToFileURL(...).href`
  form is measured to fix space and non-ASCII and to **still fail through a symlink**;
  `import.meta.main` — the form adopted at GATE 1 — is measured to hold on all three. The plan does not
  claim the adopted form is universally correct; it records exactly which invocations were probed, and
  the probe set is not exhaustive over path shapes.
- "`SKILLS_VERSION` agrees with the README badge" → **floor: enum/regex** —
  `.dev/floor/check-version-badge.mjs`, already wired into `npm run check` and its own CI step.
- "The bump size is right (patch)" → **advisory.** `check-version-badge.mjs` proves the two strings
  agree, never that the version is correct; SemVer judgment is human.
- "Running the stages in order / this plan being followed" → **advisory** orchestration, per
  `/pharn-dev-ship`'s own guarantee audit. No new floor primitive is introduced by this increment.

## Trust audit (P2)

The increment ingests no untrusted artifact. The family test reads repo-local source files as **DATA**
for a string sweep and never executes or interprets their content as instruction; the spawn probes run
scripts that are already part of the trusted, committed surface, in a temp directory the test creates
and removes. No finding free-text is produced, so no taint propagates.

## Determinism audit (P5)

- The banned-spelling sweep is a fixed-string containment test over a filesystem-derived file list —
  membership, no classification.
- Each behavioral probe branches on a **spawned process's exit code** and on membership of its stdout
  token in the closed `--verdict` set — never on prose and never on the model's reading.
- The file set to edit was derived from a repo-wide `grep`, re-run this run (P6), not from the request's
  list — which is how the list's one error was caught.
- The one irreducible judgment (which repaired idiom to adopt) is **not guessed**: it terminates in a
  question to the human at GATE 1, below.

## Open questions (HALT) — RESOLVED at GATE 1

Both questions were put to the human as a selectable form at the `/pharn-dev-plan` approval halt and
answered before any build (P5 — the fallback terminated in a question, never a guess). **No question
remains open**; the resolutions below are the approved decisions this plan builds to.

1. **RESOLVED → `import.meta.main`.** All 10 files adopt the form already live in
   `.dev/floor/hash-doc.mjs`, which closes all three measured failure modes and leaves the repo with a
   **single** entry-guard idiom across all 11 floor CLIs. The `pathToFileURL(...).href` form the request
   prescribed is **not** adopted: it is measured to leave the symlink no-op open, and shipping a second
   spelling of the same guard is the L22 shape that let this defect accumulate in the first place. The
   Node ≥ 24.2 requirement is satisfied live (v24.13.1) and in CI (`node-version: 24`).
2. **RESOLVED → yes, the badge edit is in scope.** `README.md` line 13 moves `pharn-2.7.4` →
   `pharn-2.7.5` in the same increment as the `SKILLS_VERSION` bump, so `npm run check` and the
   `check:badge` CI step stay green rather than landing a knowingly-red gate.

### The evidence the resolutions rest on

1. **Which repaired idiom?** The request prescribes `pathToFileURL(process.argv[1]).href`. But
   `.dev/floor/hash-doc.mjs` already uses `import.meta.main` and its comment documents, in this repo's
   own words, that the `` `file://${process.argv[1]}` `` family "still breaks through a symlink, because
   `import.meta.url` is the resolved real path while `argv[1]` is the link." Measured live this run
   (Node v24.13.1) on a probe module invoked four ways:

   | invocation                    | legacy `` `file://${argv[1]}` `` | `pathToFileURL(argv[1]).href` | `import.meta.main` |
   | ----------------------------- | -------------------------------- | ----------------------------- | ------------------ |
   | plain path                    | ✅ runs                          | ✅ runs                       | ✅ runs            |
   | path with a space             | ❌ **silent no-op**              | ✅ runs                       | ✅ runs            |
   | non-ASCII path (`ünï/`)       | ❌ **silent no-op**              | ✅ runs                       | ✅ runs            |
   | invoked through a **symlink** | ❌ silent no-op                  | ❌ **silent no-op**           | ✅ runs            |

   So the requested fix closes 2 of the 3 measured failure modes and leaves the third open, while the
   repo's existing precedent closes all 3 and is one token shorter. `import.meta.main` requires
   Node ≥ 24.2 (live: v24.13.1; CI `node-version: 24`; `package.json` declares no `engines` floor).

2. **Scope of the bump-coupled README edit.** The plan adds `README.md` to `## Files` solely for the
   shields badge, because `check-version-badge.mjs` would otherwise RED `npm run check` and CI the
   moment `SKILLS_VERSION` moves. The request did not name it. Confirming this is in scope (rather
   than a follow-up) — the alternative is landing a knowingly-red `npm run check`.
