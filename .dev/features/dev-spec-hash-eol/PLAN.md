# PLAN — dev-spec-hash-eol

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4
- applied_lessons: [L1, L2, L8, L13, L18]
- increment: Close the same line-ending defect on the DEV pipeline's spec pin that `check-spec.mjs` just closed on the product's — route `/pharn-dev-plan`, `/pharn-dev-grill` and `/pharn-dev-build` through ONE folded whole-file hasher (`.dev/floor/hash-doc.mjs`) instead of two byte-exact inline `node -e` one-liners.
- layer(s): `.dev/floor/` — build apparatus, not the product surface; the dev twin of `pharn/floor/check-spec.mjs --hash`.
- constitution_refs: [P0, P2, P4, P5, P6, P7]

## Applied lessons

- L2 — the honesty travels with the artifact: `hash-doc.mjs`'s own header states what it hashes, that the fold makes the pin line-ending-agnostic, and the exact bound (whole file, CRLF folded; the identity map on LF input). It cites only floor ops verified live this run.
- L1 — meta-doc sweep: `CHANGELOG.md` is in `## Files`. **`SKILLS_VERSION` is deliberately NOT** — every path here is apparatus (`.dev/**` plus `pharn-dev-*` commands), which CLAUDE.md's bump rule explicitly exempts. The README `CURRENT-STATE` region counts `pharn/floor/*.mjs` and hook scripts; a new `.dev/floor/` file moves neither, so no regeneration is owed.
- L8 — all six paths below are concrete, so the build scope comes from `## Files` via `--from-plan`, with no `--target` narrowing.
- L13 — each stage formats its own artifact only, never repo-wide (L19's Bash escape).
- L18 — the exclusion block is a `###` **heading**, so the setter terminates the authorized list structurally.

## Files

- `.dev/floor/hash-doc.mjs` — the single folded whole-file hasher for the dev spec pin — layer `.dev/floor/`
- `.dev/floor/hash-doc.test.mjs` — CRLF/LF parity, mixed endings, real-text drift, lone `\r`, usage errors — layer `.dev/floor/` (test)
- `.claude/commands/pharn-dev-plan.md` — pin via the tool, not an inline byte-exact one-liner — dev command
- `.claude/commands/pharn-dev-grill.md` — same, for its re-check — dev command
- `.claude/commands/pharn-dev-build.md` — same, for its refuse-on-drift gate — dev command
- `CHANGELOG.md` — one `## [Unreleased]` entry — repo-meta

### Deliberately NOT in scope

- `SKILLS_VERSION` — apparatus-only increment; bumping it would misreport an unchanged product surface as changed.
- `pharn/floor/check-spec.mjs` — a different artifact (a SPEC's post-frontmatter **body**) and already folded. The dev spec is a **whole file** including frontmatter, so this is a sibling tool, not a reuse of that one; sharing code across the `.dev/`→`pharn/` boundary in the wrong direction is forbidden (a user's install ships `pharn/floor/` **without** `.dev/`).
- `.claude/commands/pharn-memory-promote.md` and `pharn-dev-memory-promote.md` — their `node -e` hashers pin **canon** for a TOCTOU check where byte-exactness is **correct**: there the question is "did these exact bytes change under me", not "is this the same intent". Folding them would weaken a check that is right as it stands.
- `pharn/ARCHITECTURE.md` itself — human-only, hook-denied. This increment hashes it; it never writes it.

## Contracts satisfied

- No contract changes shape. `spec_content_hash`'s name, 64-hex form, and role as `/pharn-dev-build`'s refuse-on-drift gate (`pharn/ARCHITECTURE.md §6`, cited not restated — P4) are all unchanged.

## Evals to write (P1)

No Capability, no `rule_id` — the obligation is the `node --test` suite for `hash-doc.mjs`:

- Parity → a CRLF spelling of a file and its LF spelling produce the **same** digest.
- Identity on LF → the folded digest of `pharn/ARCHITECTURE.md` **equals** its byte-exact digest, which is why no committed PLAN's pin moves.
- Mixed endings → a half-renormalized file still matches the LF digest.
- Drift still caught → a real **text** change produces a different digest.
- Boundedness → a lone `\r` is **not** folded (two fixtures, each placed where a wider fold would reconstruct the original — the L17-adjacent lesson from `check-spec.test.mjs`, where a single carelessly-placed fixture pinned nothing).
- Usage → a missing argument and an unreadable path each exit non-zero with a message, never a silent empty digest.

## Guarantee audit (P0)

- "The dev spec pin no longer depends on the file's line endings" → **floor: content-hash** (`pharn/ARCHITECTURE.md §2` primitive #2). The fold is part of computing the hashed input; the comparison stays byte-equality over a SHA-256.
- "A real edit to the trusted spec is still detected" → **floor: content-hash**. Unchanged, pinned by the drift test.
- "There is now ONE dev spec-hash implementation" → **advisory**, and stated as such. Three commands shelling one tool is a **convention**; nothing on the floor prevents a future command from re-introducing an inline `node -e`. This mirrors the product side's honest bound: the comparison is floor, single-implementation is discipline.
- "No committed PLAN's `spec_content_hash` moves" → **floor-verifiable and verified live this run**: `pharn/ARCHITECTURE.md` is all-LF, so folded == byte-exact == `a1c243ea…621753`, the value every committed PLAN already carries. The CRLF form (`4cd9746d…0ec082`) is what a Windows clone was computing — the false drift this closes.
- **The bound, stated:** this makes the pin survive a CRLF **checkout**; it does not make the trusted doc tamper-proof, and it does not fold the memory-promote canon pins, which are deliberately byte-exact.

## Trust audit (P2)

`pharn/ARCHITECTURE.md` is a trusted doc, but `hash-doc.mjs` treats its bytes as **opaque data**: it reads, folds `\r\n`, hashes, prints. It never parses, executes, imports, or interprets the content, and it emits only a 64-hex digest — no free text reaches any caller. The CLI path argument is used only for `readFileSync`; a caller passing a hostile path gets a read error, never execution. No network, no child process.

## Determinism audit (P5)

One branch: the argument is present and readable, or the tool exits non-zero with a message. No classification. The fold itself is an unconditional literal-regex `replace`.

## Open questions (HALT)

None. The one design choice — a shared tool versus editing two inline one-liners in place — is settled by the defect it would otherwise reproduce: two copies is exactly the duplication the product fix avoided by folding in a single `bodyHash`, and a third caller (`/pharn-dev-build`) already describes the recompute in prose without a one-liner, so a tool is the only form all three can share.
