# PLAN — version-badge-pin

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52
- applied_lessons: [L1, L2, L3, L6, L7, L9, L11, L13, L14, L16, L18, L19, L20]
- increment: Make the two version tracks legible on the front page — the README badge shows `SKILLS_VERSION` under a label that distinguishes it from the `1.0.0` foundation tag, the CHANGELOG header names both tracks, and a new apparatus checker pins the badge to `SKILLS_VERSION` deterministically so it cannot silently drift again.
- layer(s): none (build apparatus + repo-meta — no product-surface capability; `.dev/` is outside the layer tree)
- constitution_refs: [P0, P5, P6, P7]

## Applied lessons

- L1 — Meta-doc sweep run against **live** state, not assumed. Verified this run that the README `CURRENT-STATE` generated region counts `pharn/floor/` `.mjs` files (**46**) and **not** `.dev/floor/`, so adding a dev-floor checker owes **no** `npm run docs:generate` regeneration — the region's bytes are unchanged. Two meta-doc facts **do** go stale and are therefore named in `## Files`: `CLAUDE.md:215`'s `npm run check` component list, and CLAUDE.md's Commands block (which documents each `.dev/floor` checker). `CHANGELOG.md` gets an `[Unreleased]` entry so the file's own "all notable changes are documented" contract holds.
- L2 — The checker's honesty travels **in the checker**, not only in this plan: its header carries the guarantee audit below verbatim, and it cites only ops verified live this run. This lesson is what forced the discovery that **CI does not invoke `npm run check`** — `.github/workflows/ci.yml` runs each script as its own step (read live: `format:check`, `lint:md`, `lint`, `validate.mjs`, `docs:check`, `check:markers`, `test`). Wiring the checker into `npm run check` alone would have left it **unrun on every PR** while this plan claimed it was gated. `ci.yml` is in `## Files` for that reason.
- L3 — Making the badge value load-bearing means re-auditing every existing declaration of the same kind. Audited all **7** README badges live: only the version badge is pinned by this increment. The other six (License, CI, CodeQL, Floor, Secrets, Built for Claude Code) are named as out of scope below — none has a demonstrated drift, and pinning them speculatively is the P7 violation.
- L6 — A badge value has **no** structured location; a README badge is free-text prose by nature, which is exactly why it drifted. The checker therefore does the narrowest honest thing: it matches the **shields URL token** (a structured token _within_ prose), never a line number and never a loose version-like substring, and it REDs on **≠ 1** match rather than silently taking the first. The header states this prose-scan bound instead of claiming a structured read.
- L7 — `## Files` lists exactly the seven paths this increment writes — nothing aspirational, and no downstream gate's target. No canon file (`.dev/memory-bank/**`) and no product-surface path appears.
- L9 — The badge check is deliberately **not** added to `/pharn-dev-verify`'s gate map; it lives in `npm run check` + CI only. Verify's gate map stays the deterministic style/test authority, and this increment adds no new class of red to it.
- L11 — Corollary of the above, and the reason it is deliberate: `/pharn-dev-verify`'s gates are whole-repo and run once at HEAD with no base comparison, so a badge RED added there would block **every later feature's** verify until someone fixed an unrelated front-page byte. Keeping the gate in `npm run check` + CI puts it where a red is attributable to the PR that caused it.
- L13 — This stage formats its own artifact (`prettier` + `markdownlint-cli2 --fix` scoped to this `PLAN.md`) before halting, rather than leaving it for a mid-pipeline manual pass.
- L14 — The value regex **composes after** a guard, never replaces one: the extracted badge value and the `SKILLS_VERSION` file contents are each required to be a control-char-free, single-line scalar **before** the anchored shape regex runs. This is why `SKILLS_VERSION` is trimmed **and** shape-validated rather than string-compared raw — JS `$` matches before a single trailing newline, so a raw compare would admit exactly the newline vector the guard exists to reject.
- L16 — No GNU-only tooling anywhere: the checker is pure Node stdlib (Node 24, zero runtime deps) and the npm wiring is a portable `&&` chain, matching the existing `check:markers` shape.
- L18 — The exclusion block below is a real markdown `###` **heading**, not a bold prose intro, so `set-writes-scope.cjs --from-plan` terminates the authorized list structurally rather than depending on prose vocabulary.
- L19 — Stated rather than pretended-gated: the `prettier` / `markdownlint-cli2` passes this stage runs are **Bash** writes and therefore pass **neither** fix #2 nor fix #7. They are declared here as a known, accepted escape scoped to this stage's own artifact — never a repo-wide sweep.
- L20 — This lesson **decides the mechanism**. A hardcoded `pharn-2.5.1` badge plus "remember to bump it when you bump `SKILLS_VERSION`" is a discipline-only remedy, and L20's rule is that such a remedy WILL recur and that the trigger to escalate it to a floor check has been met. The badge has silently survived the entire `1.x → 2.5.1` run of bumps, which is the recurrence evidence. Hence mechanism **(A)** below — and hence the CI wiring gets a **pin test** rather than a note, since "remember to add the CI step" would reproduce the same anti-pattern one level down.

## Files

- `.dev/floor/check-version-badge.mjs` — NEW. Apparatus checker: locate the README version badge by its shields URL pattern, assert its value equals `SKILLS_VERSION`. — layer: none (`.dev/` apparatus)
- `.dev/floor/check-version-badge.test.mjs` — NEW. Mutant-driven tests: green on agreement, RED on drift, clean RED on absent/malformed/duplicate badge, plus a ✧ pin that `package.json` and `ci.yml` actually invoke it. — layer: none (apparatus test, never ships)
- `README.md` — EDIT line 13 only: `version-1.0.0-blue` → `pharn-2.5.1-blue` (renders `pharn | 2.5.1`). The `1.0.0` foundation note at `:25` is accurate and stays untouched. — layer: none (repo-meta)
- `CHANGELOG.md` — EDIT the header line 5 (ambiguous single-version sentence → explicit two-track statement naming `SKILLS_VERSION` as the version of the **product surface**, the bytes under `pharn/` an install receives) + ADD an `[Unreleased]` entry carrying **no** version line. — layer: none (repo-meta)
- `package.json` — ADD `check:badge` script; fold it into the `check` chain. — layer: none (repo-meta)
- `.github/workflows/ci.yml` — ADD a `Version badge check` step running `npm run check:badge`, carrying the same install-gated `if:` as its siblings. — layer: none (repo-meta/CI)
- `CLAUDE.md` — EDIT: document the new checker in the Commands block, and correct `:215`'s `npm run check` component list (which is **already** stale — it omits the live `check:markers`). — layer: none (repo-meta)

### Deliberately NOT in scope

- `SKILLS_VERSION` — **untouched.** Every file above is repo-meta or apparatus; none is product surface, so the versioning discipline's bump-triggering set is not entered. No bump, and the CHANGELOG entry carries no version line.
- `package.json`'s `version: "1.0.0"` — the foundation tag itself. Reconciling it (a release-tagging policy) is a separate axis and a separate increment.
- The other six README badges (License, CI, CodeQL, Floor, Secrets, Built for Claude Code) — no demonstrated drift; pinning them would be the P7 speculative addition (L3).
- `/pharn-dev-verify`'s gate map — untouched, per L9/L11 above.
- **F8** (`package.json "private": true`) and **F12** (the `gitleaks.yml` `validate.mjs` comment) — each its own tiny change.
- The product surface (`pharn/**`, `.claude/commands/pharn-*`) — nothing here ships to a user's install.

## Contracts satisfied

- None. This increment adds no capability and no `pharn-contracts` shape — it is a build-apparatus checker plus repo-meta prose. Cited for completeness per P4: the finding vocabulary it prints follows `pharn/pharn-contracts/finding-shape.md`'s enum-gated / free-text split, restated nowhere.

## Evals to write (P1)

- **N/A — no Capability is added.** P1 binds `role:`-bearing capabilities to `evals/cases/*` + `evals/expected/*`; a `.dev/floor/*.mjs` checker is not one, and the existing dev-floor checkers carry `*.test.mjs` suites instead. This increment ships that equivalent: `check-version-badge.test.mjs`, written mutant-first per L4 (an authored fixture passes by construction, so the tests drive the RED paths).
- Test roster (each a fixture tree in `os.tmpdir()`, badge located **by pattern** in the fixture too, so the tests survive fixture line shifts):
  - agreement → exit 0 (`pharn-2.5.1` badge vs `SKILLS_VERSION` `2.5.1`)
  - ✧ **drift mutant** → exit 1 (badge `1.0.0` vs `SKILLS_VERSION` `2.5.1`) — the whole point of the checker
  - ✧ badge absent → exit 1, named message, **no crash/stack**
  - ✧ badge URL malformed (no `pharn-<x>-` match) → exit 1, clean
  - ✧ **two** `pharn-` badges → exit 1 (ambiguity is RED, never first-match-wins — L6)
  - ✧ the anchor is the **badge** URL, not any `pharn-` substring: a fixture whose prose says `pharn-9.9.9` outside an `img.shields.io/badge/` URL must NOT be picked up
  - ✧ `SKILLS_VERSION` missing / blank / multi-line / control-char-bearing → exit 1, clean (L14 guard-before-regex)
  - ✧ pin: `package.json` `check:badge` runs the checker **and** `check` runs `check:badge`
  - ✧ pin: `ci.yml` has a step whose `run:` is `npm run check:badge`, carrying the sibling install-gated `if:` (the docs:check pin precedent — a step disabled by `if: false` is a dead guard)
  - real-repo case: the checker run against this repo exits 0 after the README edit

## Guarantee audit (P0)

- "The README version badge's value equals `SKILLS_VERSION`" → **FLOOR: enum/regex** (primitive #3). A deterministic string comparison between a pattern-extracted token and a shape-validated file read. Zero LLM.
- "The badge cannot silently drift again" → **FLOOR, and NARROWED.** It cannot drift _undetected by `npm run check` or CI_. It can still drift in a working tree until a gate runs, and the guarantee is only as live as the wiring — which is why the wiring itself is pinned by tests rather than trusted.
- "CI runs this check" → **FLOOR within the repo** (the ✧ `ci.yml` pin asserts the step exists and is not `if:`-disabled) — but the **honest residual** is the same one the `docs:check` pin already records: that GitHub _executed_ the job, that the workflow is enabled, and that branch protection requires it are **harness-layer** facts unverifiable from inside the repo. "The wiring is pinned" NEVER means "CI is guaranteed to run it".
- "The front page's version story is now legible/coherent" → **ADVISORY.** A checker compares two strings; it has no opinion on whether a human reads the two tracks correctly. The CHANGELOG header rewrite and the badge relabel are prose judgment, reviewed by a human, gated by nothing.
- "`SKILLS_VERSION` is the product-surface version and `1.0.0` is the foundation tag" → **ADVISORY.** This is a documented convention. No floor op binds `package.json`'s version to anything, and none is added here.
- "Every file this increment touches is repo-meta or apparatus, so no bump is owed" → **ADVISORY.** The bump-triggering set is a `CLAUDE.md` convention; nothing on the floor checks a bump against a diff. Stated as a reasoned call, not a verified one.
- "The badge value is read from a structured location" → **STRUCK.** It is not. It is extracted from README prose by URL pattern. See L6 above; the checker's header says so rather than implying otherwise.

## Trust audit (P2)

- **Inputs.** `README.md` and `SKILLS_VERSION` are in-repo, human-authored, committed files — trusted in the ordinary sense, but the checker treats their contents as **DATA** regardless and never as instructions.
- **Taint handling.** The extracted badge value and the trimmed, shape-validated `SKILLS_VERSION` scalar are compared with JavaScript string equality (`===`), never interpreted beyond the scalar/shape guards. Both pass a control-char-free single-line-scalar guard _before_ any anchored regex (L14), so a crafted README cannot launder a newline or control sequence into the comparison or into the printed finding.
- **Output.** The checker prints the two values inside a quoted finding message. That message is free text and is treated as untrusted DATA by any reader; **no decision anywhere rests on it** — the verdict is the exit code alone.

## Determinism audit (P5)

- The verdict is a string equality plus regex membership — a membership test, no classification.
- Ambiguity **fails closed and loudly**: ≠ 1 badge match, an unreadable/blank/multi-line `SKILLS_VERSION`, or a malformed URL is RED with a named reason, never a silent GREEN and never a first-match guess.
- There is no fallback chain that ends in a guess. The terminal state is a RED naming the file and the reason, which hands the decision to the human.

## Open questions (HALT) — all four RESOLVED at the human gate

1. **Mechanism** → **(A)**. Hardcoded badge value pinned by a new deterministic checker. (B) a dynamic shields _endpoint_ JSON + a CI job that writes it, and (C) hardcode + a bump-discipline note, were both declined — (C) explicitly as the L20 anti-pattern.
2. **Checker placement** → **`.dev/floor/` (apparatus), NOT `pharn/floor/`.** Raised at the gate as "this is about pharn, not pharn-dev", and resolved to **framing, not relocation**: the thing `SKILLS_VERSION` versions is the product surface (`pharn/`), so the badge and CHANGELOG prose must say so — but the checker reads **this repo's** `README.md`, which no user install has. Grounded live rather than argued: **no file under `pharn/` mentions `SKILLS_VERSION`, `shields`, or a badge**, and there is **no `pharn` CLI** (`package.json` `bin` is undefined), so `pharn status` / `pharn update` are specified, not built. Shipping the checker would bump `SKILLS_VERSION` to 2.6.0, force a `CURRENT-STATE` regeneration (46 → 47), and land an inert checker in user repos that have neither a PHARN README nor a `SKILLS_VERSION` file.
3. **CI wiring** → **add the step AND its pin test.** `.github/workflows/ci.yml` stays in `## Files`: CI was verified live to run each script as its own step and **never** `npm run check`, so `check`-only wiring would leave the checker unrun on every PR while this plan claimed it was gated.
4. **`CLAUDE.md:215`** → **fix both.** `check:markers` (already missing today) and `check:badge` land in the same sentence, rather than shipping a list that is accurate about the new checker and still false about an existing one.
5. **Badge label** → **`pharn-2.5.1`**, rendering `pharn | 2.5.1`. It names the product whose surface the number versions, and is unmistakably not a rival release number beside the `1.0.0` foundation note. The checker's anchor is therefore the **badge URL** `img.shields.io/badge/pharn-<x>-`, never a bare `pharn-` substring — a distinction the test roster asserts directly.
