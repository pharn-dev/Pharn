# PLAN — specified-marker-check

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L1, L2, L6, L13, L18, L20]
- increment: Give the F7 specified-not-yet-live annotations a deterministic floor check, so the docs cannot drift back into overclaiming — nor silently understate a primitive once it ships.
- layer(s): none (build apparatus, `.dev/floor/`)
- constitution_refs: [P0, P5, P6, P7]

## Applied lessons

- **L20** — this increment **is** L20 applied. F7's correction reduced to "remember to update the
  docs", which is precisely the remedy-class L20 says WILL fail. The trigger is not hypothetical: the
  docs asserted non-existent floors and nothing detected it for as long as it was true.
- **L6** — the defect L6 names (a membership fact grepped from free text) recurred **inside F7's own
  REVIEW.md** while correcting a different error. So this checker reads its membership from a
  **structured** JSON manifest, never by scanning prose for what looks like a marker.
- **L2** — the checker's own header states what it guarantees and what it does not, in the artifact,
  not only here; and it cites only ops verified live this run.
- **L1** — meta-doc sweep: `CLAUDE.md`'s Commands block states the apparatus checkers, and
  `package.json` states the gate. Both change and are declared below.
- **L13 / L18** — format this stage's own artifact; exclusion block is a `###` heading.

## Discovery (P6 — verified live this run)

| fact                                  | verification                                           |
| ------------------------------------- | ------------------------------------------------------ |
| no `pre-egress` hook                  | `ls .claude/hooks/` → 3 hooks, none matching `egress`  |
| no archetype-maps manifest            | `pharn/pharn-contracts/archetype-maps.json` absent     |
| no `/pharn-estimate`                  | no `.claude/commands/*estimate*`                       |
| no `pharn/pharn-audits/`              | absent                                                 |
| nothing reads trusted-doc prose       | all three in `.prettierignore` + markdownlint-excluded |
| `npm run check` is the aggregate gate | `package.json` scripts, read this run                  |

## Files

- `.dev/floor/specified-primitives.json` — the structured manifest: each not-yet-live primitive, its
  existence probe, and the exact marker substring at each doc site
- `.dev/floor/check-specified-markers.mjs` — the checker (existence test + exact-substring test)
- `.dev/floor/check-specified-markers.test.mjs` — tests, incl. mutants
- `package.json` — wire the checker into `npm run check`
- `CLAUDE.md` — document the new apparatus command (L1)
- `CHANGELOG.md` — `[Unreleased]` entry

### Deliberately NOT in scope

- `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`, `LIMITS.md` — no trusted-doc edit is needed; this
  increment reads them, never writes them. **No Bash write this time.**
- `SKILLS_VERSION` — **no bump.** Every path here is apparatus (`.dev/**`) or repo-meta
  (`package.json`, `CLAUDE.md`, `CHANGELOG.md`); the product surface is byte-unchanged.
- `pharn/floor/**` — this guards PHARN's own docs, so it is dev apparatus, not shipped product. A
  user's install has no reason to check PHARN's annotations.
- Building `pre-egress` / the archetype manifest / `/pharn-estimate` — still trigger-gated (P7).

## Contracts satisfied

- none — no capability, no contract shape change.

## Evals to write (P1)

- **none** — P1 binds a `role:`-bearing Capability; this authors none. The checker's own
  `*.test.mjs` is the regression suite, and it is apparatus.

## Guarantee audit (P0)

- "a primitive that SHIPS while its markers remain is caught" → **floor: enum/regex** (an existence
  probe + set membership). This is the load-bearing direction.
- "a marker DELETED while its primitive is still absent is caught" → **floor: enum/regex** (exact
  substring presence). Both drift directions close.
- "the docs are accurate" → **ADVISORY, and emphatically not claimed.** The checker proves a known
  annotation is still present and still warranted. It **cannot discover a NEW overclaim** about a
  primitive absent from the manifest — the manifest is a hand-maintained address book, not a
  discovery mechanism. That limit is the honest analogue of L6's index: "the manifest was checked"
  never means "the docs are true".
- "the probe proves the primitive does not exist" → **floor, NARROWED and stated.** It tests **file
  existence**, never that a hook is WIRED in `settings.json` or that it WORKS. A file named
  `*egress*` in `.claude/hooks/` flips the probe to live even if nothing loads it. It is the loud
  early signal, not proof of function.

## Trust audit (P2)

The manifest is a **trusted**, human-reviewed apparatus file, not ingested content. The docs it reads
are trusted. No untrusted input is ingested and no free text steers a branch — the checker's every
decision is an existence test or an exact substring test over bytes it never interprets.

## Determinism audit (P5)

Two membership tests, no classification, no LLM. Terminal fallback on a malformed manifest is a loud
RED naming the manifest — never a guess, never a silent pass.

## Open questions (HALT)

- none. The human's standing instruction ("if there are things we need to fix to make pharn better
  just do it now") is the GATE-1 approval for this increment; the design contains no wording decision
  over governing text, because no trusted doc is edited.
