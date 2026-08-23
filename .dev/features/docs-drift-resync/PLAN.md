# PLAN — docs-drift-resync: re-derive stale doc claims across the shipped and meta surfaces

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L25]
- increment: Correct every doc sentence a full-tree audit CONFIRMED stale against the live repo — no reframing, no new claims; each edit restores a sentence to what the tree already proves.
- layer(s): none — doc corrections across contracts, floor README, two lenses, and repo-meta # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P6]

## Applied lessons

- **L25** — every target sentence here is exactly L25's defect at doc scale: prose written when a
  state was true (checker unbuilt, path pre-relocation, gate list shorter) and trusted after the
  state moved. Each fix RE-DERIVES the sentence from the live tree rather than patching the visible
  symptom: the "3c runner not yet built" sites are rewritten to name the runners that now invoke
  `check-structural.mjs` (not merely to delete "not yet"), and the honest bounds they carried
  (nothing fires at write time) are preserved rather than dropped.

## What this is

An audited resync, run at the maintainer's direct request ("analyze, update README/CLAUDE.md, check
if docs need updating"). A six-agent audit verified every falsifiable doc claim against the live
tree; this increment applies only the CONFIRMED-stale corrections that are framing-independent.
It deliberately does NOT touch the four trusted docs (hook-denied, human-only — their issues are
reported to the human instead) and does NOT change the repo's adoptability framing.

## Scope of correction (why each file)

- Shipped surface (bumps SKILLS_VERSION, patch): `eval-format.md` still calls `check-structural.mjs`
  "the next increment"; `finding-shape.md` still calls the 3c runner "not yet built" and cites
  pre-relocation `floor/…` paths plus a pre-move `features/trust-fence` example;
  `pharn/floor/README.md` says "nothing in the build loop invokes it automatically yet" (stale — the
  verify/eval stages do) and understates the hook matcher; the two lenses repeat the "3c not yet
  wired" bound.
- Repo-meta (no bump): CLAUDE.md (7-gate list vs the live 8; "21 tagged" vs 32; the four-constants
  enumeration omits `GEN`; a present-tense `pharn` CLI that does not exist); README.md line 60's
  "authorization checked" inside a "can guarantee" sentence (the repo's own security griller records
  that floor candidate as REJECTED); SECURITY.md pointing at the deliberately inert `package.json`
  version; CONTRIBUTING.md's `pharn/floor/` bump sentence missing the `*.test.mjs` carve-out; both
  GitHub templates citing pre-relocation `floor/validate.mjs` and pre-rename `/plan`-style commands;
  `.dev/features/README.md` placing modules at the repo root.

## Files

- `.dev/features/docs-drift-resync/PLAN.md` — this record
- `README.md` — line-60 guarantee triple; version badge (bump)
- `CLAUDE.md` — gate list, tagged count, four-constants enumeration, planned-CLI tense
- `SECURITY.md` — version-of-record sentence
- `CONTRIBUTING.md` — `pharn/floor/` bump sentence test-file carve-out
- `.github/PULL_REQUEST_TEMPLATE.md` — gate list, floor path, trusted-doc paths
- `.github/ISSUE_TEMPLATE/bug_report.md` — command names, floor path, module path
- `.dev/features/README.md` — module locations under `pharn/`
- `pharn/pharn-contracts/eval-format.md` — checker landed; `pharn/floor/` spellings
- `pharn/pharn-contracts/finding-shape.md` — 3c landed; path spellings; trust-fence example path
- `pharn/floor/README.md` — invokers named; hook matcher
- `pharn/pharn-review/input-validation/input-validation.md` — 3c bound re-derived
- `pharn/pharn-review/hallucinated-api/hallucinated-api.md` — 3c bound re-derived
- `SKILLS_VERSION` — 2.7.13 → 2.7.14 (patch: corrections to already-shipped bytes)
- `CHANGELOG.md` — the matching entry
