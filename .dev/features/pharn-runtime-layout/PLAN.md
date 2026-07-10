# PLAN — pharn-runtime-layout (relocate the product surface under `pharn/`)

- spec_content_hash: 11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969 # fix #4 (sha256 of ARCHITECTURE.md at repo root, this run)
- increment: Move every runtime-read product file under a single visible `pharn/` folder (same layout in the dev repo and in an installed project), so `npx pharn init` no longer scatters 11 loose items into the user's root — while preserving the floor, the hooks' fail-closed posture, and every deterministic guarantee.
- layer(s): cross-cutting relocation — touches `pharn-contracts`, `pharn-core`, `pharn-pipeline`, `pharn-review` (ARCHITECTURE §4 tree) plus the build apparatus (floor, hooks, commands, CI). No layer's _content_ or _dependency direction_ changes; only paths.
- constitution_refs: [P0, P2, P4, P5, P6]

## Discovery summary (live state, this run — P6)

**Content hash of `ARCHITECTURE.md` (root):** `11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969` — content is unchanged by a move, so this hash is invariant across the relocation (the pin is content-, not location-, based, fix #4).

**The product/dev floor partition (traced, not guessed).** Every floor `*.mjs` is self-contained — **no floor checker `require`s/`import`s another** (grep: only Node stdlib). Cross-file coupling is exclusively via `spawnSync(process.execPath, join(here, "<sibling>.mjs"))`:

| spawner (file)                        | spawns                                                | both same split?                                |
| ------------------------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| `check-plan-spec-agree.mjs` (PRODUCT) | `check-spec-approved.mjs`, `check-spec.mjs` (PRODUCT) | ✅ move together → `join(here,…)` stays correct |
| `check-spec-approved.mjs` (PRODUCT)   | `check-spec.mjs` (PRODUCT)                            | ✅ move together                                |
| **`check-variance.mjs` (DEV, stays)** | **`check-structural.mjs` (PRODUCT, moves)**           | ❌ **CROSS-SPLIT — `join(here,…)` BREAKS**      |

**Confirmed: no PRODUCT checker references anything under `.dev/`** (grep across the 18 moving checkers found only ENUM literals like `"pharn-owned"`, never a `.dev/` path or import). The forbidden direction (product→dev) does **not** occur. The one cross-split edge is the _allowed_ direction (dev `check-variance` → product `check-structural`) and is handled below.

**Product floor subset → `pharn/floor/` (18 checkers + map + their `*.test.mjs`):** `validate`, `check-spec`, `check-spec-approved`, `check-plan-spec-agree`, `check-regress`, `check-verify`, `check-build-complete`, `check-structural`, `check-loop`, `check-ship`, `check-seam-config`, `count-verifiers`, `count-lenses`, `count-grillers`, `merge-findings`, `scan-installed-skills`, all 21 `scan-code-*`, `lens-scanner-map.json` (+ `README.md`, `test-fixtures/`).

**Dev-only floor subset → stays `.dev/floor/`:** `check-provenance`, `check-variance`, `check-config`, all 5 `scan-plan-*` (+ their `*.test.mjs`).

**Hardcoded product-path bases inside the MOVING checkers (only one real edit):** `validate.mjs` line 223/238/245 hardcodes `join(TARGET, "pharn-contracts", "archetype-maps.json")` → must become `join(TARGET, "pharn", "pharn-contracts", …)`. All other moving checkers (`count-lenses`, `scan-code-*`, `scan-installed-skills`, `check-seam-config`, `merge-findings`, `check-spec`) take their target from `argv`/`process.cwd()` and discover capabilities generically — **no path edit needed**. `lens-scanner-map.json` values are **bare filenames** — location-agnostic, no edit.

**Hooks (read live):**

- `protect-trusted-paths.cjs` — `isProtected` matches by basename/fragment (`norm.endsWith("/"+x)`), so `pharn/CONSTITUTION.md` and `pharn/ARCHITECTURE.md` **still fire** post-move. ✅ **No hook edit needed for protection to hold.** (Confirmed against source, not assumed.)
- `enforce-writes-scope.cjs` — `DEFAULT_SAFE_SET = ["features/**", ".dev/features/**", "pharn-*/**"]`. The glob `pharn-*/**` (regex `^pharn\-[^/]*/.*$`) does **NOT** match `pharn/**` (no hyphen). So after the move the product module dirs (`pharn/pharn-review/…`) fall **out** of the fail-closed safe-set. → needs a port (see Open Question 4).
- Bash-tool writes bypass PreToolUse hooks entirely (documented in both hooks) — relevant to the trusted-doc move mechanism (Open Question 3).

**`.gitignore`** ignores `.pharn/`, `runs/`, `node_modules/`, `.claude/settings.local.json`. `pharn/` is **not** ignored (will be committed) and `.pharn/` does **not** glob-match `pharn/`. ✅ **No `.gitignore` change required** — the argument's two conditions already hold.

**Edit volume (measured):** product `.md` refs to product paths/trusted docs = **496 line-occurrences across 271 files** (of which **36** are `reads:` frontmatter = runtime-read); 17 command files; `validate.mjs`; `check-variance.mjs`; `enforce-writes-scope.cjs` (+2 tests); 2 CI workflows; `package.json` test glob. **This is the largest single change in the repo** (as the ship brief stated).

## Files

Moves (content preserved; via `git mv`), then in-place path edits within the moved trees:

- `pharn/CONSTITUTION.md` ← `CONSTITUTION.md` — trusted doc, MOVE only (content untouched) — see OQ3 — layer: spec
- `pharn/ARCHITECTURE.md` ← `ARCHITECTURE.md` — trusted doc, MOVE only (content untouched) — see OQ3 — layer: spec
- `pharn/pharn-contracts/**` ← `pharn-contracts/**` — schemas — layer pharn-contracts
- `pharn/pharn-core/**` ← `pharn-core/**` — seam-resolver — layer pharn-core — **see OQ1**
- `pharn/pharn-pipeline/**` ← `pharn-pipeline/**` — grillers — layer pharn-pipeline
- `pharn/pharn-review/**` ← `pharn-review/**` — lenses — layer pharn-review
- `pharn/floor/**` ← the 18 product checkers + `lens-scanner-map.json` + `README.md` + `test-fixtures/` + their `*.test.mjs` — the product-invoked checker subset — layer: apparatus
- `.dev/floor/{check-provenance,check-variance,check-config,scan-plan-*}.mjs` (+ tests) — **stay** (dev-only) — layer: apparatus

In-place edits (paths only; no behavior change):

- `pharn/floor/validate.mjs` — `archManifest` base `pharn-contracts` → `pharn/pharn-contracts`; consider adding `pharn/floor` to `EXCLUDE_SEGMENTS` (see OQ / notes)
- `.dev/floor/check-variance.mjs` — `CHECK_STRUCTURAL = join(here,"check-structural.mjs")` → point at the moved product location `pharn/floor/check-structural.mjs` (resolve via repo-root, not `here`)
- `.dev/floor/check-variance.test.mjs` — update any fixture path assumption for the above
- `.claude/hooks/enforce-writes-scope.cjs` — `DEFAULT_SAFE_SET`: `pharn-*/**` → `pharn/pharn-*/**` (OQ4)
- `.claude/hooks/enforce-writes-scope.test.cjs` — update safe-set test vectors to the ported glob
- `.claude/commands/pharn-*.md` (8 product) + `.claude/commands/pharn-dev-*.md` (9 dev) — every `reads:` + body ref: `CONSTITUTION.md`→`pharn/CONSTITUTION.md`, `ARCHITECTURE.md`→`pharn/ARCHITECTURE.md`, moved-checker `.dev/floor/<x>.mjs`→`pharn/floor/<x>.mjs` (ONLY the 18 that moved; `check-provenance`/`check-variance`/`check-config`/`scan-plan-*` stay `.dev/floor/`), `pharn-contracts/`→`pharn/pharn-contracts/`, `pharn-review/`→`pharn/pharn-review/`, `pharn-pipeline/`→`pharn/pharn-pipeline/`, `pharn-core/`→`pharn/pharn-core/`. **THREAT-MODEL.md / LIMITS.md refs UNCHANGED** (stay at root).
- `pharn/pharn-review/**/*.md`, `pharn/pharn-pipeline/**/*.md`, `pharn/pharn-core/**/*.md` — capability `reads:` frontmatter + prose: `pharn-contracts/`→`pharn/pharn-contracts/` (OQ2 governs whether prose citations are included)
- `.github/workflows/ci.yml` — `node .dev/floor/validate.mjs .` → `node pharn/floor/validate.mjs .`
- `.github/workflows/floor.yml` — same `validate.mjs` path; test-glob add `pharn/**` (mirror the explicit `.dev/**`/`.claude/**` entries)
- `package.json` — `test` script glob: add explicit `"pharn/**/*.test.mjs"` (mirror the existing `.dev/**`/`.claude/**` explicit globs so the moved floor tests are definitely collected)
- `CLAUDE.md` — **(folded in from GRILL #3, human-approved amendment)** path-fixups only: `.dev/floor/<moved>.mjs` → `pharn/floor/<moved>.mjs`, reading order + `spec_content_hash` prose to `pharn/CONSTITUTION.md`/`pharn/ARCHITECTURE.md`, `pharn-review/`/`pharn-contracts/`/`pharn-pipeline/`/`pharn-core/` layout prose → `pharn/…`. Stays at root; THREAT-MODEL/LIMITS refs unchanged.
- `README.md` — **(folded in from GRILL #3, human-approved amendment)** same moved-path consistency fixups so the described clone layout is correct. Stays at root.
- `.prettierignore` — **(folded in at build — REQUIRED safeguard restoration, not creep)** the trusted-doc formatter-exclusion (fix #4: "style fixes can never mutate their content-hash") pointed at root `CONSTITUTION.md`/`ARCHITECTURE.md`; after the move it matches nothing, so `prettier --write` could mutate the relocated trusted docs. Re-point to `pharn/CONSTITUTION.md`/`pharn/ARCHITECTURE.md`; also add `pharn/floor/test-fixtures` (the product fixtures relocated out of `.dev/floor/test-fixtures`). Stays at root.
- `.markdownlint-cli2.jsonc` — **(folded in at build — same safeguard)** same trusted-doc `ignores` re-point + add `pharn/floor/test-fixtures`. Stays at root.
- `eslint.config.mjs` — **(folded in at build — consistency)** add `pharn/floor/test-fixtures/**` to `ignores` (mirrors the relocated product fixtures; the old `.dev/floor/test-fixtures/**` stays for the `variance` fixtures that remained). Stays at root.
- `CONTRIBUTING.md`, `SECURITY.md` — **(folded in at build — same current-doc category as CLAUDE/README)** path-fixups in live command examples/prose: `.dev/floor/validate.mjs` → `pharn/floor/validate.mjs`, `CONSTITUTION.md`/`ARCHITECTURE.md` → `pharn/…`, `pharn-review/`/`pharn-contracts/` → `pharn/…`. `CHANGELOG.md` is deliberately NOT rewritten (historical release notes are point-in-time and accurate as-written). Stay at root.
- `.dev/floor/check-variance.mjs` — additionally: one comment path (`pharn-contracts/eval-format.md` → `pharn/pharn-contracts/eval-format.md`) for consistency.

_Not moved (deliberate):_ `THREAT-MODEL.md`, `LIMITS.md`, `README.md`, `CLAUDE.md`, `AGENTS`, `package.json`, root dotfiles stay at root; `features/` (product-pipeline output) stays at root; `.dev/` apparatus stays; `.pharn/` runtime scratch stays gitignored.

## Contracts satisfied

- `pharn/pharn-contracts/{finding-shape,eval-format,seam-config}.md` — unchanged in content; only their _path_ moves. Every enforcer that cites them (`finding-shape.md` §8 split) keeps citing them, at the new path (P4 — cite, do not restate).

## Evals to write (P1)

This increment **adds no new capability** (it is a pure relocation), so per P7 it introduces no new eval fixtures. Correctness is proven by the **existing** suites re-run GREEN against the new layout:

- `pharn/floor/validate.mjs .` → GREEN (every product path resolves under `pharn/`).
- `npm test` (hook + floor `*.test.mjs`/`*.test.cjs`, incl. the moved `pharn/floor/*.test.mjs` and the edited `enforce-writes-scope.test.cjs` / `check-variance.test.mjs`) → all pass.
- `npm run check` (format:check + lint + lint:md + test) → GREEN.
- Post-move byte-identity proof for the two trusted docs: `sha256(pharn/CONSTITUTION.md) == sha256(old CONSTITUTION.md)` and likewise ARCHITECTURE — proving MOVE-not-EDIT.
- Hook self-tests: `pharn/CONSTITUTION.md` write → denied by fix #2; a `pharn/pharn-review/x.md` write with the ported safe-set → allowed; a `pharn/floor/x.mjs` write with no scope → denied (fail-closed posture preserved).

## Guarantee audit (P0)

- "Every runtime path resolves under the new layout" → **floor: enum-regex** (`validate.mjs` GREEN) + **the test suite** (`npm test`). Not advisory — a broken path is a RED.
- "The trusted docs remain write-protected after the move" → **floor: hook** (fix #2 basename match fires for `pharn/CONSTITUTION.md`; verified in a self-test).
- "The fail-closed writes-scope posture is preserved" → **floor: hook** (fix #7; `enforce-writes-scope.test.cjs` re-run GREEN with the ported safe-set; `pharn/floor` stays deny-by-default).
- "Trusted-doc content is unchanged" → **floor: content-hash** (byte-identity sha256 compare, above).
- "The relocation is correct/complete / nothing subtle broke" → **advisory** (model judgment; downstream `/pharn-dev-regress` + `/pharn-dev-verify` + human review are the check). "Files moved" NEVER means "the layout is right" (P0).

## Trust audit (P2)

No new untrusted artifact is ingested; the increment relocates trusted apparatus and product structure. The trust tags of `reads:`/finding-shape flows are unchanged (paths only). The one trust-adjacent invariant asserted and floor-checked: the trusted-doc write-guard (fix #2) still fires at the new location.

## Determinism audit (P5)

Every proceed/stop remains a membership/exit-code test: `validate` exit, `npm test` exit, the hook self-tests' deny/allow. No branch added rests on model classification. The trusted-doc-move-mechanism decision (OQ3) is deliberately handed to the human (terminal fallback = ask), not guessed.

## Open questions — RESOLVED by human at GATE 1 (2026-07-10)

1. **`pharn-core/` moves under `pharn/`** → **RESOLVED: YES → `pharn/pharn-core/`.** Folded into `## Files`.
2. **Capability-internal `pharn-contracts/…` refs** → **RESOLVED: prefix ALL occurrences** (36 `reads:` frontmatter + ~85 prose citations) to `pharn/pharn-contracts/…`, via a guarded transform that never double-prefixes an already-`pharn/`-qualified path.
3. **Trusted-doc move mechanism** → **RESOLVED: agent performs `git mv` of `CONSTITUTION.md` + `ARCHITECTURE.md` to `pharn/`, with a sha256 byte-identity proof after** (content unchanged; a human-approved location change; Bash `git mv` is the sanctioned path since PreToolUse hooks don't gate Bash, and fix #2 protection still fires at the new path).
4. **`DEFAULT_SAFE_SET` port** → **RESOLVED: narrow `pharn-*/**` → `pharn/pharn-*/**`** (product module dirs writable-by-default; `pharn/floor/` + `pharn/CONSTITUTION.md` stay deny-by-default — posture preserved).
5. **(Non-blocking, deferred.)** Product commands cite `THREAT-MODEL.md`/`LIMITS.md` in prose; those stay at root and aren't installed, so citations dangle in an installed project. **Accepted as a known limitation; de-reference in a separate follow-up increment.** THIS increment stays a pure relocation.
