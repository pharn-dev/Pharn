# PLAN — floor self-path correction + floor.yml SHA pins

- spec_content_hash: 0d0dc6da61c4de6748aeab849ed1a4ecd9ff7f1d61e91d5848d7ffdaf022733d # fix #4
- increment: Rewrite stale `.dev/floor/<B>` self-path tokens to `pharn/floor/<B>` in the relocated floor checkers (existence-gated), and SHA-pin the two bare-tag actions in `.github/workflows/floor.yml` by reusing `ci.yml`'s SHAs verbatim.
- layer(s): none — this touches the **floor apparatus** (`pharn/floor/`, `ARCHITECTURE.md §2`) and repo-meta CI. No capability, contract, or layer in the `§4` tree is added or moved.
- constitution_refs: [P0, P5, P6, P7]

## Discovery (live state read this run, P6)

- HEAD is `1db762f` (`chore(deps): bump github/codeql-action/init … (#107)`), working tree clean.
  The task text cites HEAD `c88593b` — **a mismatch**; see Open questions Q1. Both defects were
  independently re-verified against live `1db762f` this run, so the findings stand on their own.
- `.dev/floor/` **still exists** (23 entries: `check-config`, `check-provenance`, `check-variance`,
  `capability-catalog-*`, `gen-capability-catalog`, `check-capability-catalog`, the five
  `scan-plan-*` grill-scanners, their tests, `test-fixtures/`).
- `pharn/floor/` holds 89 real files (88 distinct basenames).
- 58 files under `pharn/floor/` contain the literal `.dev/floor/`, across 148 lines.
- All path resolution in those files is via `dirname(fileURLToPath(import.meta.url))` — **no
  hardcoded `.dev/floor` is ever handed to `fs`**. Verified in `lens-scanner-map.test.mjs:23-25,48`
  and `check-structural.test.mjs:16-18`. The defect is therefore **cosmetic/documentary only**,
  exactly as the task states.
- `.github/workflows/floor.yml:19-20` carries bare tags `actions/checkout@v7.0.1` and
  `actions/setup-node@v7`. `ci.yml:12,15` carries
  `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1` and
  `actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v6`. `codeql.yml` and
  `gitleaks.yml` are already fully SHA-pinned. `floor.yml` grants `contents: read` and no secrets.
- `SKILLS_VERSION` is `1.1.1`. `CHANGELOG.md` has an open `[Unreleased]` section.

## The rewrite rule (deterministic; P5)

For each real file `F` under `pharn/floor/` (recursive), let `B = basename(F)`. Replace every
occurrence of the exact token `.dev/floor/<B>` with `pharn/floor/<B>` across all text files
under `pharn/floor/`, UTF-8 aware. The loop is driven by files that **exist in `pharn/floor/`**, so
it can never emit a replacement for a `.dev/floor/`-resident file or a test fixture.

Dry-run result (computed this run): **57 files modified, 129 lines rewritten, 19 occurrences
survive.**

### Plus: 6 hand-corrections the token rule structurally cannot reach (Q2, RESOLVED)

VERIFY-#1 is a **review checklist, not a grep pass/fail** (human ruling at GATE 1). Every surviving
`.dev/floor/` occurrence must, on inspection, be intentional — exactly one of:

- **(a)** a reference to a file that STILL lives in `.dev/floor/` (`scan-plan-secrets*`);
- **(b)** a fixture path (`fake*.md` in a `*.test.mjs` mock-fs map);
- **(c)** `.dev/floor/` named AS the excluded segment / P3 boundary.

**No occurrence may describe the LOCATION of a relocated floor script** — a self-header, a
`node .dev/floor/…` usage string, "the live scanners on disk", or "this test lives at". Those are
the only true stales. Classification of all 20 survivors (19 with trailing slash + 1 without):

| Occurrence                                                                                                         | Class     | Action  |
| ------------------------------------------------------------------------------------------------------------------ | --------- | ------- |
| `scan-code-secrets.mjs:4,25` — `.dev/floor/scan-plan-secrets.mjs`                                                  | (a)       | keep    |
| `count-grillers.test.mjs:219`, `count-lenses.test.mjs:135`, `count-verifiers.test.mjs:202`, `validate.test.mjs:70` | (b)       | keep    |
| `count-verifiers.test.mjs:11,201`, `count-grillers.test.mjs:218` — "EXCLUDED segment"                              | (c)       | keep    |
| `scan-code-{magic-values,missing-await,missing-timeout,n-plus-one,off-by-one}.test.mjs:6` — P3 boundary            | (c)       | keep    |
| `lens-scanner-map.test.mjs:4,10,13,23,44`; `check-structural.test.mjs:18`                                          | **STALE** | **fix** |

The six stales are bare-directory / glob / no-trailing-slash forms, so the existence-gated token
rule cannot match them; they are corrected **by hand** in the same two files (both already in the
write set). `lens-scanner-map.test.mjs:23` (`// .dev/floor`, no trailing slash) was missed by the
initial grep and is caught only by this checklist pass.

`npm test` GREEN is the real guard: it fails if any (a)/(b)/(c) assertion was inverted.

## Files

Product-surface floor checkers (28) — **bump-triggering** per CLAUDE.md § SKILLS_VERSION discipline:

- `pharn/floor/check-plan-spec-agree.mjs` — self-path comments — floor apparatus
- `pharn/floor/check-seam-config.mjs` — self-path comments + usage string — floor apparatus
- `pharn/floor/check-spec-approved.mjs` — self-path comments + usage string — floor apparatus
- `pharn/floor/check-spec.mjs` — self-path comments + usage strings — floor apparatus
- `pharn/floor/count-grillers.mjs` — self-path comments + usage string — floor apparatus
- `pharn/floor/count-lenses.mjs` — self-path comments + usage string — floor apparatus
- `pharn/floor/count-verifiers.mjs` — self-path comments + usage string — floor apparatus
- `pharn/floor/merge-findings.mjs` — self-path comments + usage string — floor apparatus
- `pharn/floor/scan-code-copy-paste-drift.mjs` — self-path comments + usage string — floor apparatus
- `pharn/floor/scan-code-crypto.mjs` — self-path comments — floor apparatus
- `pharn/floor/scan-code-deserialization.mjs` — self-path comments — floor apparatus
- `pharn/floor/scan-code-duplicated-logic.mjs` — self-path comments + usage string — floor apparatus
- `pharn/floor/scan-code-injection.mjs` — self-path comments — floor apparatus
- `pharn/floor/scan-code-magic-values.mjs` — self-path comments + usage string — floor apparatus
- `pharn/floor/scan-code-missing-await.mjs` — self-path comments — floor apparatus
- `pharn/floor/scan-code-missing-error-handling.mjs` — self-path comments + usage string — floor apparatus
- `pharn/floor/scan-code-missing-timeout.mjs` — self-path comments + usage string — floor apparatus
- `pharn/floor/scan-code-n-plus-one.mjs` — self-path comments — floor apparatus
- `pharn/floor/scan-code-null-deref.mjs` — self-path comments — floor apparatus
- `pharn/floor/scan-code-off-by-one.mjs` — self-path comments — floor apparatus
- `pharn/floor/scan-code-path-traversal.mjs` — self-path comments — floor apparatus
- `pharn/floor/scan-code-placeholder.mjs` — self-path comments — floor apparatus
- `pharn/floor/scan-code-resource-leak.mjs` — self-path comments + usage string — floor apparatus
- `pharn/floor/scan-code-secrets.mjs` — self-path comments (the two `scan-plan-secrets.mjs` refs are PRESERVED) — floor apparatus
- `pharn/floor/scan-code-ssrf.mjs` — self-path comments — floor apparatus
- `pharn/floor/scan-code-swallowed-exception.mjs` — self-path comments — floor apparatus
- `pharn/floor/scan-installed-skills.mjs` — self-path comments + usage string — floor apparatus
- `pharn/floor/validate.mjs` — self-path comments + usage string — floor apparatus

Test files (30) — apparatus, **not** bump-triggering:

- `pharn/floor/check-plan-spec-agree.test.mjs` — self-path header — apparatus
- `pharn/floor/check-seam-config.test.mjs` — self-path header — apparatus
- `pharn/floor/check-spec-approved.test.mjs` — self-path header — apparatus
- `pharn/floor/check-spec.test.mjs` — self-path header — apparatus
- `pharn/floor/check-structural.test.mjs` — **hand-correction only** (`:18` "this test lives at"); the token rule does not match it — apparatus
- `pharn/floor/count-grillers.test.mjs` — self-path header (the `fake-griller.md` fixture is PRESERVED) — apparatus
- `pharn/floor/count-lenses.test.mjs` — self-path header (the `fake.md` fixture is PRESERVED) — apparatus
- `pharn/floor/count-verifiers.test.mjs` — self-path header (the `fake-verifier.md` fixture is PRESERVED) — apparatus
- `pharn/floor/lens-scanner-map.test.mjs` — self-path header — apparatus
- `pharn/floor/merge-findings.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-copy-paste-drift.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-crypto.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-deserialization.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-duplicated-logic.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-injection.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-magic-values.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-missing-await.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-missing-error-handling.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-missing-timeout.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-n-plus-one.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-null-deref.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-off-by-one.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-path-traversal.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-placeholder.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-resource-leak.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-secrets.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-ssrf.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-code-swallowed-exception.test.mjs` — self-path header — apparatus
- `pharn/floor/scan-installed-skills.test.mjs` — self-path header — apparatus
- `pharn/floor/validate.test.mjs` — self-path header (the `fake-capability.md` fixture is PRESERVED) — apparatus

CI + release bookkeeping (3):

- `.github/workflows/floor.yml` — SHA-pin the two bare-tag actions, SHAs copied verbatim from `ci.yml` — repo-meta
- `SKILLS_VERSION` — patch bump `1.1.1` → `1.1.2` (28 product-surface `pharn/floor/*.mjs` files change bytes) — repo-meta
- `CHANGELOG.md` — one `[Unreleased] → Fixed` entry recording both fixes and the bump — repo-meta

Deliberately **not** touched: `pharn/CONSTITUTION.md`, `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`,
`LIMITS.md` (hook-denied, human-only); every file resident in `.dev/floor/`; the `fake*.md` mock-fs
fixtures; `.claude/settings.json`; `README.md`; `docs/capabilities/**`.

## Contracts satisfied

None. This increment adds no capability and no contract. It cites `pharn/ARCHITECTURE.md §2` (the
three floor primitives) only to bound its own guarantee claims, and CLAUDE.md § _SKILLS_VERSION
discipline_ for the bump rule (P4 — cited, not restated).

## Evals to write (P1)

**None required, and this is not an omission.** P1 binds Capabilities (`role:`-bearing `.md`) and
`rule_id`s. This increment adds neither — it edits comment text in existing floor scripts and two CI
`uses:` lines. The existing `node --test` suite over `pharn/floor/*.test.mjs` is the regression
suite that covers this change, and it is re-run as a floor gate by `/pharn-dev-verify`.

## Guarantee audit (P0)

- "The rewrite touches only stale self-paths, never a fixture or a `.dev/floor/`-resident file" →
  **the procedure is a deterministic membership test** (`existsSync(pharn/floor/<B>)`, P5) — but no
  wired floor checker verifies it was applied correctly, so the claim itself is **advisory**,
  **backstopped by the floor**: `npm test` exit code (a mutated mock-fs fixture key flips the
  exclusion assertions in `count-*.test.mjs` / `validate.test.mjs` to FAIL) and
  `pharn/floor/validate.mjs` exit code. Both are `ARCHITECTURE.md §2` primitive #3 and are re-run by
  `/pharn-dev-verify`.
- "The change is cosmetic — no behavior changes" → **advisory** (a reading of the code, grounded in
  the discovery note that nothing resolves `.dev/floor` through `fs`). Backstopped by the floor:
  `npm test` + `validate.mjs` GREEN + `/pharn-dev-regress` `no-regressions`.
- "`floor.yml`'s actions are SHA-pinned after this change" → **advisory at PHARN's floor.** No PHARN
  checker enforces action-pin shape; the verification is a one-off `grep`, not a wired gate. Do not
  write "PHARN guarantees the workflows are pinned."
- "SHA-pinning removes tag-mutation risk" → **a GitHub-platform property, not a PHARN floor
  reduction.** Labeled advisory here. Honest scope (P7): `floor.yml` already runs with
  `contents: read`, `pull_request` (not `pull_request_target`), and no secrets — this is
  defense-in-depth consistency, **not** the closing of an exploitable hole.
- "`SKILLS_VERSION` correctly reflects the shipped-byte change" → **advisory** (a human/agent reading
  of the bump rule). No floor primitive ties a `pharn/floor/*.mjs` byte-diff to a `SKILLS_VERSION`
  increment; that gap is pre-existing and is **not** in scope to fix here (P7 — no triggering
  failure).

## Trust audit (P2)

The increment ingests **no untrusted artifact**. The two action SHAs are copied verbatim from
`.github/workflows/ci.yml`, an in-repo trusted file — they are **not** resolved over the network, so
no new taint path is introduced and no `pre-egress` question arises. The rewritten text is this
repo's own comment prose (trusted). No finding object is produced, so there is no enum-gated /
free-text split to propagate.

## Determinism audit (P5)

- The one branch in the rewrite — "rewrite this token or leave it" — is a filesystem membership test
  (`basename ∈ readdirSync(pharn/floor/)` recursively), never LLM classification.
- The residual judgment — whether the 13 bare-directory / glob survivors should also change — is
  genuinely irreducible to a membership test, so the fallback chain **ends in a question to the
  human** (Q2), not a guess.

## Open questions (HALT)

- **Q1 — HEAD provenance mismatch (P6). RESOLVED at GATE 1: proceed.** The task cites HEAD
  `c88593b`; live HEAD is `1db762f`. Both defects were re-verified live this run, so the findings
  hold regardless; the stale SHA is provenance noise, not a correctness problem.
- **Q2 — DISCRIMINATOR vs VERIFY-#1. RESOLVED at GATE 1.** VERIFY-#1 is a review checklist, not a
  grep pass/fail: intentional survivors are exactly (a) still-resident `.dev/floor/` files, (b)
  `fake*.md` fixtures, and (c) `.dev/floor/` named as the excluded segment / P3 boundary; nothing
  may describe the LOCATION of a relocated script. Applied above — 14 survivors kept, **6
  hand-corrected**.
- **Q3 — `SKILLS_VERSION` bump. RESOLVED at GATE 1: include it.** 28 of the modified files are
  `pharn/floor/*.mjs`, squarely inside CLAUDE.md's bump-triggering set, whose rule says "prose-only
  edits included". Therefore: **patch** bump `1.1.1` → `1.1.2` plus one `[Unreleased] → Fixed`
  `CHANGELOG.md` entry. Both files are listed under `## Files`.

**All open questions are resolved. Plan APPROVED as written at GATE 1** (human, this run).

## Totals (writes-scope input for `/pharn-dev-build`)

**61 files**: 28 product-surface `pharn/floor/*.mjs` + 30 `pharn/floor/*.test.mjs` +
`.github/workflows/floor.yml` + `SKILLS_VERSION` + `CHANGELOG.md`. Of the 58 files under
`pharn/floor/`, 57 are touched by the existence-gated token rule (129 lines) and
`check-structural.test.mjs` by hand-correction alone.
