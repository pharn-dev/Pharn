# PLAN — forward-looking-claims-sweep: correct every expired "not yet built" claim on the shipped surface

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L33, L29, L20, L25]
- increment: Re-derive every product-surface sentence that describes LANDED work as future or deferred. Corrections only — each edit preserves the bound that survives and names the invoker that now exists.
- layer(s): none — prose corrections across pharn-review lenses, pharn-pipeline grillers, pharn-contracts, and four product commands # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P6, P7]

## Applied lessons

- **L33** — this increment IS L33's remedy. Its two prescriptions were followed literally: (a) the
  enumeration was derived from the **shortest substring invariant across paraphrase**, not from the
  sentence I happened to read; (b) every prior enumeration was treated as a **lower bound to beat**.
  Both paid off — see "How the enumeration was derived" below. The proposing prompt named 6 grillers;
  the real griller count is **7**; and the largest class in this increment (**20 sites**) appears in
  neither the prompt nor L33.
- **L29** — the deliverable is the **ENUMERATION**, not the three seeds. The enumeration is Section
  "The enumeration" below, stated as a closed set with per-class verdicts and an explicit
  false-positive list, so a later reader can audit what was ruled OUT as easily as what was changed.
- **L20** — a defect whose only remedy is "remember to update it" has earned a floor check. This
  increment adds **no** checker, and that is a recorded decision with a reason, not an oversight; see
  "Why no floor check (P7)".
- **L25** — each fix RE-DERIVES the sentence from the live tree rather than deleting the visible "not
  yet". Every rewrite names the invoker that now exists AND preserves the honest bound that survives
  (nothing fires at write time / nothing on the floor forces a run).

## What this is

`#165` (2.7.14) was the increment whose entire purpose was re-deriving this claim class. It fixed one
instance in `pharn/pharn-contracts/eval-format.md` and **left a second in the same file** — the defect
that produced L33. This increment discharges the class properly: a whitespace-normalized sweep of the
whole product surface (`pharn/**` + the `pharn-*`, non-`pharn-dev-*` commands), every hit classified,
nothing blanket-edited.

## How the enumeration was derived (the part L33 says is transferable)

Line-based `grep` is **structurally wrong** for this class and undercounted it three times:

| Method                                | Grillers found |
| ------------------------------------- | -------------- |
| The proposing prompt's grep           | 6              |
| `grep -rn "runner yet invokes"`       | 4              |
| Whitespace-normalized scan (this run) | **7**          |

The claims **wrap across source lines** (`no runner yet\n  invokes it`), so a line-anchored pattern
sees a fragment. Every count here comes from a scanner that normalizes whitespace **first**, then
matches — and that is the reason the 20-site lens class was found at all. Raw sweep: 172 hits across
72 files, each classified below.

The `coupling` griller confirms L33's variant-spelling warning independently: it spells the claim
`no **live** runner yet invokes it`, so it is invisible to the exact-phrase scan that finds the other
six.

## The enumeration

### CONFIRMED STALE — corrected by this increment (7 classes, 30 files)

**A. The isolated LENS runner — 19 lens files + 1 command = 20 sites. NOT seeded by the prompt or by
L33; the largest class in this increment.**

Every scanner-bearing lens carries: _"until the live isolated lens runner lands (deferred P7, as for
every lens/griller), the review stage **applies this lens inline**"_. This is contradicted by
`.claude/commands/pharn-review.md` **Step 4**: _"Spawn **one subagent per lens** … Each subagent
applies its lens and **writes its own `features/<name>/lenses/<lens>/findings.json`**"_. That is an
isolated per-lens runner, and it shipped.

`pharn/pharn-review/{copy-paste-drift,duplicated-logic,injection,insecure-crypto,magic-values,missing-await,missing-error-handling,missing-timeout,n-plus-one,null-deref,off-by-one,path-traversal,placeholder-as-done,race-condition,resource-leak,secrets-in-code,ssrf,swallowed-exception,unsafe-deserialization}/*.md`

**The enumeration closes arithmetically:** `count-lenses.mjs` reports **22** registered lenses; 19
carry the claim; the 3 that do not (`hallucinated-api`, `input-validation`, `trust-fence`) are exactly
the scanner-less lenses, which have no Layer-1 scanner block to carry it. 19 + 3 = 22. No 20th site
is hiding behind a variant spelling.

**Bound that survives, preserved in every rewrite:** nothing on the floor forces every lens to run —
`pharn-review.md` itself says _"nothing on the floor forces parallelism or forces every lens to run"_.
The guarantee remains "the scanner IS deterministic", never "the model always ran it".

**B. `.claude/commands/pharn-review.md:84` — the same claim, in the command that refutes it.**

_"the isolated per-lens runner is deferred, P7 — as for every lens today"_ sits **28 lines above** the
Step 4 that spawns one subagent per lens. A self-contradiction within one file.

**C. The griller `check-structural` runner — 7 grillers (seed 2, corrected from 6).**

`pharn/pharn-pipeline/grillers/{a11y,comprehension,coupling,documentation,error-handling,migrations,performance}/*.md`

Each claims _"no runner yet invokes it over this griller's live output — deferred P7, as for every
griller and `finding-shape.md`'s 3c runner"_. Re-derived live: `pharn/pharn-contracts/finding-shape.md`
now states the **opposite** — _"the runners that invoke it over emitted output **have landed**:
`/pharn-verify` / `/pharn-dev-verify` run it per committed eval pair, and the dev-side
`/pharn-dev-eval` (increment 3c) runs it over each live-emitted `runs/<i>/findings.json`"_. All seven
ship committed eval pairs (verified: cases 2–4, expected 4–8 each), so the verify-time runner reaches
every one of them. Five of the seven **cite `finding-shape.md` by name** for a deferral that document
no longer records — a stale answer down a trusted-looking chain.

**Bound that survives:** nothing fires at **grill time** or at **write time**; enforcement is
verify/eval-time. Preserved verbatim in each rewrite, per the increment's instruction.

**D. `pharn/pharn-contracts/eval-format.md:52` (seed 1) — the instance `#165` missed in the file it
named.**

_"(the checker that runs these is the NEXT increment)"_ — `pharn/floor/check-structural.mjs` ships, is
tested, and is invoked by `/pharn-verify`, `/pharn-dev-verify`, `/pharn-dev-eval`, `/pharn-regress`,
`/pharn-dev-regress`.

**E. `.claude/commands/pharn-plan.md:307` — NOT seeded. A cite-chain drift identical in shape to C.**

_"the consumer that re-verifies spec↔plan is a later stage, **not built yet** — P7"_. Refuted:
`pharn/floor/check-plan-spec-agree.mjs` exists (15.8 KB, has its own `.test.mjs`) and is invoked by
**seven** commands. `.claude/commands/pharn-grill.md` addresses this sentence directly:
_"(`pharn-plan.md` deferred this re-verifier to 'a later stage' — **you are that stage**)"_. The
downstream file knows; the upstream file was never updated.

**Bound that survives:** the pin still is not re-verified **at plan time** — the honest label
`deterministic, not yet re-verified` is accurate **for this stage** and is kept. Only "not built yet"
is false.

**F. `.claude/commands/pharn-loop.md:95` — NOT seeded. The claim is right; its stated REASON is false.**

_"a config-file cap key (`pharn.config.json`) is **deferred** (P7 — **no project config consumer
exists yet**; the floor bound is identical either way)"_. The cap key genuinely does not exist — that
half stays. But two product commands already consume `pharn.config.json`: `/pharn-build` reads the
`seam` block (`pharn-build.md:188`), and `/pharn-ship` reads `ship.requireAttestation`
(`pharn-ship.md:426`). The deferral must rest on its **surviving** argument (P7 — no real need has
surfaced; the floor bound is identical either way), not on a consumer-absence that is untrue.

**G. `.claude/commands/pharn-ship.md:2` + `:486` (seed 3) — the judgment call, resolved as "fix it".**

The literal claim is **TRUE**: no `--loop` flag on `/pharn-ship` exists. What is stale is the
**impression** that the capability is unavailable — `/pharn-loop` **is** built
(`.claude/commands/pharn-loop.md`) and does exactly what the section describes as unbuilt (iterate
`build → regress → verify` to a floor-grade stop via a tested checker). A reader who takes the
sentence at face value concludes PHARN cannot auto-iterate the product pipeline. It can.

**Resolved as a POINTER, not a rewrite** (the increment's own instruction: "Fix it as a pointer, or
record why not"). The heading and the "not built here" claim stay — they are true — and gain a
sentence naming `/pharn-loop` as the shipped command that provides the capability today. The
distinction preserved: `/pharn-loop` is a **separate command**, not a flag on `/pharn-ship`, and its
stop core is `check-loop.mjs`, not `check-ship.mjs`.

### CONFIRMED CORRECT — false positives, deliberately LEFT (the audit half of L29)

| Site                                                                                                                                                                    | Claim                                                       | Why it stays                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 14 files: 13 grillers + `pharn-grill.md`                                                                                                                                | "isolated per-griller runner is deferred"                   | **TRUE.** `/pharn-grill` spawns **zero** subagents — verified — and applies the griller inline. The lens twin landed; this one did not. The two look identical and are not. |
| 19 lenses + 8 `scan-code-*.mjs`                                                                                                                                         | multi-file sweep / taint analysis "not built speculatively" | **TRUE** — genuinely unbuilt, correctly P7-labeled.                                                                                                                         |
| `.claude/commands/pharn-verify.md`                                                                                                                                      | "ZERO verifiers authored"                                   | **TRUE.** 18 `role: verifier` hits are all **prose mentions**; zero frontmatter declarations.                                                                               |
| `pharn/floor/validate.mjs`, `pharn/floor/README.md`                                                                                                                     | "not built PHARN capabilities"                              | Different sense of "built" — means _is not a capability_, not _is unfinished_.                                                                                              |
| `pharn/floor/validate.mjs`                                                                                                                                              | `scan-plan-*` "NOT built (resident nowhere)"                | **TRUE** — the never-built ghosts CLAUDE.md documents.                                                                                                                      |
| `check-spec.mjs:276`, `check-spec-approved.mjs:126`, `scan-code-placeholder.mjs:12`, `gen-lessons-index.mjs:59`, `check-lessons-index.mjs:86`, `check-plan-lessons.mjs` | "not yet pinned" / "no cache yet" / keyword list            | **Runtime state**, not unbuilt features — the prompt's own predicted false-positive list, confirmed.                                                                        |
| `pharn-spec.md:119`, `pharn-plan.md` (`NO_CANON`/`COLD`), `pharn-memory-promote.md:415`, `pharn-build.md`                                                               | "not yet pinned" / "no lessons yet" / "not yet writable"    | **Runtime state** — the honest normal state of a fresh install or an in-flight stage.                                                                                       |
| `README.md:241` "Not yet built." block                                                                                                                                  | `pharn-audits`, `pharn-skills-*`, `pharn-stack-*`           | **TRUE**, and `check:markers` already guards it. Excluded by the prompt; independently re-confirmed.                                                                        |

### OUT OF SCOPE — reported, not edited

- **Trusted docs (hook-denied): NOTHING TO REPORT.** All four were swept. The only hit —
  `THREAT-MODEL.md`, "the (deferred) AI/LLM-security lens" — is a **false positive**: no such lens
  exists among the 22 registered. No human edit is owed.
- **`.dev/**` and `pharn-dev-*`:** not swept for correction (apparatus, and this increment is about
  shipped bytes). Recorded as a follow-up: **`apparatus-forward-looking-sweep`**.

## Why no floor check (P7 + L20)

L20 says a defect whose only remedy is "remember to update it" has earned a floor check, and this
class has now recurred twice. A checker is **not** added here, deliberately:

1. **P7 — the shape is not yet knowable.** A checker for "prose whose tense expired" needs a
   **structured membership set** (the `check-specified-markers.mjs` pattern: a hand-maintained
   manifest, never a prose scan — L6). Authoring that manifest is a separate axis of change from
   correcting the sentences, and doing both in one increment would mean deriving the manifest from
   the very prose this increment is rewriting.
2. **The honest bound on what such a checker could do.** It could only re-verify claims a human
   already enumerated — "the manifest checked out" would never mean "the docs are true", exactly as
   `check-specified-markers.mjs` states of itself. That is worth building, and worth building
   **deliberately**.

Recorded as the follow-up **`forward-looking-claims-manifest`** rather than silently dropped.

## Steps

1. Rewrite Class A in all 19 lens files: replace the "until the live isolated lens runner lands …
   applies this lens inline" premise with the shipped runner (`/pharn-review` spawns one subagent per
   lens, each writing its own `findings.json`), preserving the surviving conclusion verbatim — the
   act of running is advisory; nothing on the floor forces every lens to run.
2. Rewrite Class B (`pharn-review.md:84`) to agree with its own Step 4.
3. Rewrite Class C in all 7 grillers: name the landed runners (`/pharn-verify`, `/pharn-dev-verify`
   per committed eval pair; `/pharn-dev-eval` over live-emitted findings), keep the bound that
   nothing fires at grill/write time, and drop the stale `finding-shape.md` 3c-deferral cite.
4. Fix Class D (`eval-format.md:52`) — name `check-structural.mjs`.
5. Fix Class E (`pharn-plan.md:307`) — the re-verifier exists; keep "not re-verified at THIS stage".
6. Fix Class F (`pharn-loop.md:95`) — keep the deferral, correct its reason.
7. Fix Class G (`pharn-ship.md:2` + `:486`) — add the `/pharn-loop` pointer; keep the true claims.
8. Bump `SKILLS_VERSION` 2.7.14 → 2.7.15, update the README shields badge, add the CHANGELOG entry.
9. `npm run check` (8 gates) + `node pharn/floor/validate.mjs .` GREEN.

## Files

- `pharn/pharn-review/copy-paste-drift/copy-paste-drift.md` — Class A
- `pharn/pharn-review/duplicated-logic/duplicated-logic.md` — Class A
- `pharn/pharn-review/injection/injection.md` — Class A
- `pharn/pharn-review/insecure-crypto/insecure-crypto.md` — Class A
- `pharn/pharn-review/magic-values/magic-values.md` — Class A
- `pharn/pharn-review/missing-await/missing-await.md` — Class A
- `pharn/pharn-review/missing-error-handling/missing-error-handling.md` — Class A
- `pharn/pharn-review/missing-timeout/missing-timeout.md` — Class A
- `pharn/pharn-review/n-plus-one/n-plus-one.md` — Class A
- `pharn/pharn-review/null-deref/null-deref.md` — Class A
- `pharn/pharn-review/off-by-one/off-by-one.md` — Class A
- `pharn/pharn-review/path-traversal/path-traversal.md` — Class A
- `pharn/pharn-review/placeholder-as-done/placeholder-as-done.md` — Class A
- `pharn/pharn-review/race-condition/race-condition.md` — Class A
- `pharn/pharn-review/resource-leak/resource-leak.md` — Class A
- `pharn/pharn-review/secrets-in-code/secrets-in-code.md` — Class A
- `pharn/pharn-review/ssrf/ssrf.md` — Class A
- `pharn/pharn-review/swallowed-exception/swallowed-exception.md` — Class A
- `pharn/pharn-review/unsafe-deserialization/unsafe-deserialization.md` — Class A
- `.claude/commands/pharn-review.md` — Class B
- `pharn/pharn-pipeline/grillers/a11y/a11y.md` — Class C
- `pharn/pharn-pipeline/grillers/comprehension/comprehension.md` — Class C
- `pharn/pharn-pipeline/grillers/coupling/coupling.md` — Class C
- `pharn/pharn-pipeline/grillers/documentation/documentation.md` — Class C
- `pharn/pharn-pipeline/grillers/error-handling/error-handling.md` — Class C
- `pharn/pharn-pipeline/grillers/migrations/migrations.md` — Class C
- `pharn/pharn-pipeline/grillers/performance/performance.md` — Class C
- `pharn/pharn-contracts/eval-format.md` — Class D
- `.claude/commands/pharn-plan.md` — Class E
- `.claude/commands/pharn-loop.md` — Class F
- `.claude/commands/pharn-ship.md` — Class G
- `SKILLS_VERSION` — 2.7.14 → 2.7.15 (patch)
- `README.md` — shields badge, pinned to SKILLS_VERSION by `check:badge`
- `CHANGELOG.md` — the bump + this enumeration
- `.dev/features/forward-looking-claims-sweep/PLAN.md` — this file

## Guarantee audit (P0)

- **"Every expired claim on the product surface is now corrected"** → **ADVISORY.** The enumeration is
  a whitespace-normalized scan plus human-read classification. No checker reads shipped prose for its
  tense; that is precisely the gap L33 names. A claim spelled in a way no pattern here anticipated
  would survive — the same failure mode this increment documents, one level up.
- **"The enumeration is complete for the classes it names"** → **ADVISORY, with one arithmetic
  cross-check.** Class A closes against `count-lenses.mjs`'s registered count (19 + 3 = 22), which is
  a deterministic membership test. The other classes have no such independent count.
- **"Nothing outside `## Files` was written"** → **FLOOR: hook (fix #7).**
  `set-writes-scope.cjs --from-plan` + `enforce-writes-scope.cjs`.
- **"`SKILLS_VERSION` and the README badge agree"** → **FLOOR** (`check-version-badge.mjs`,
  `npm run check` + its own CI step).
- **"The corrections are TRUE"** → **ADVISORY.** Each was re-derived against the live tree this run
  (P6) and the evidence is cited inline above, but no floor primitive verifies a rewritten sentence.
  `/pharn-dev-review` is the backstop — the stage `#163`/`#164`/`#165` skipped.

## Trust (P2)

Every file edited here is PHARN's own shipped surface, `trust: trusted` by origin. The sweep output
(172 hits) is tool output over that surface, not fetched or third-party input. No untrusted data
enters this increment's control flow.

## Open questions

None. Each of the 7 classes was re-derived against the live tree this run; the 8 false-positive
groups were each checked against the artifact that would refute them (`count-lenses.mjs` output, the
`role: verifier` grep, `/pharn-grill`'s subagent count, the eval-pair listing).
