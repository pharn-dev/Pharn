# PLAN — register the forward-claim class on the EXISTING marker checker (no new checker)

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L6, L20, L29, L34, L35]
- increment: Give expired forward-looking claims a floor check by REGISTERING them as a new claim class on `.dev/floor/check-specified-markers.mjs` + `specified-primitives.json`, rather than building the parallel checker the originating note assumed. The existing checker's truth table already IS the forward-claim semantics; what was missing is a membership list.
- layer(s): none — build apparatus (`.dev/`). Nothing here ships. # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P5, P6, P7]

## Applied lessons

- L35 — The decisive one, and it inverted the increment. The originating note
  (`.pharn/fixes/05-deferred-forward-claim-marker-check.md`) specified "a manifest plus a checker …
  a real increment". Building it would have created a second manifest, a second checker, a second
  `npm run check` entry, a second `ci.yml` step and a second pair of wiring tests — a parallel
  identity for logic that already exists, which is exactly the shape L35 says to refuse. The first
  question is whether the second copy must exist; here it must not. Registered as a claim class
  instead.
- L20 — The trigger is genuinely fired, which is why this is built at all rather than deferred: the
  forward-claim class recurred INSIDE `#165`, the increment whose entire purpose was fixing it (it
  corrected one "next increment" claim in `pharn/pharn-contracts/eval-format.md` and left a second at
  line 52). A discipline-only remedy — "remember to re-derive the tense" — has had its second
  occurrence.
- L6 — Membership is read from the STRUCTURED manifest, never by scanning doc prose for what looks
  like a forward-looking sentence. A prose scan cannot distinguish `check-spec.mjs`'s "a Draft is not
  yet pinned" (a correct runtime-state sentence) from an expired claim, and it would count a CHANGELOG
  sentence quoting a marker as a doc site — the identical defect the existing checker's header records.
- L29 — The remedy is quantified over "every registered forward claim", so the ENUMERATION is the
  deliverable. `forward_claims[]` is that enumeration in one place, with the checker's loop iterating
  it, so a claim added later is covered by both directions for free.
- L34 — Applied directly to this increment's own code, and it is the reason for the `EMPTY_CLASS`
  guard below. Every check here is "for each registered claim, assert P", which is VACUOUSLY TRUE over
  an empty `forward_claims[]`. Without a guard, deleting the array (or shipping the section with zero
  entries) yields a confident GREEN over nothing. The legitimate "no claims registered yet" state must
  stay expressible, and is — by OMITTING the key entirely, which is distinguishable from an empty array.

## Files

- `.dev/floor/specified-primitives.json` — add the `forward_claims[]` array + its `$comment` bound — layer apparatus
- `.dev/floor/check-specified-markers.mjs` — process `forward_claims[]` through the existing probe/direction logic; own wording, own count, `EMPTY_CLASS` fail-closed guard — layer apparatus
- `.dev/floor/check-specified-markers.test.mjs` — tests: both directions per class, the `EMPTY_CLASS` guard, manifest-validation fail-closed — layer apparatus
- `.dev/features/forward-claim-marker-check/PLAN.md` — this plan — layer apparatus

## The design, and why it needed no new logic

`check-specified-markers.mjs` already computes, per site:

| probe  | marker  | verdict                                                  |
| ------ | ------- | -------------------------------------------------------- |
| live   | present | RED — direction 1, the doc UNDERSTATES a live protection |
| absent | absent  | RED — direction 2, silent return to overclaiming         |
| live   | absent  | GREEN                                                    |
| absent | present | GREEN                                                    |

An expired forward-looking claim is exactly row 1: the named artifact shipped, the "not yet built"
sentence remains. The inverse — the sentence deleted while the artifact is still absent — is exactly
row 2. So `forward_claims[]` reuses `isLive()`, `readDoc()`, the manifest loader's fail-closed exit 2,
and both direction branches. Only the MESSAGE WORDING and the summary COUNT are new, because
"specified primitive" and "forward claim" read differently to a human even though they compute
identically.

## Scope — what is registered, and what is deliberately NOT

**Registered.** Claims naming a CONCRETE artifact whose appearance falsifies the sentence, where the
probe is an unambiguous path test:

- `pharn-eval` — the product `/pharn-eval` twin, probe `.claude/commands/pharn-eval.md`
- `product-capability-catalog` — probe `pharn/floor/gen-capability-catalog.mjs`

**NOT registered, and the reason stated in the manifest.** The ~20 P7 "future increment, added when a
real need surfaces" statements across `pharn/pharn-review/*` and the `scan-code-*` scanners. These are
CONDITIONAL DESIGN POSTURES, not pinned predictions: they assert a policy ("we do not build
speculatively"), which stays true whether or not the thing is later built for a real reason.
Registering them would add ~20 entries that fire on a correct sentence — noise that trains the reader
to ignore the check. This is a scoping judgment, recorded rather than silently made.

**Deferred with a named reopen trigger.** The `live griller runner` class — 13+ sites across every
griller, all citing one subject — is the highest-count class and is NOT registered, because the repo
has never named a path for that runner. A probe would have to invent one, and a probe pointing at a
path nobody has agreed on is a guess (P6). **Reopens when** the griller runner is named in a plan or
built. The same holds for `/pharn-verify`'s verifier runner, whose stated trigger is "the first
`role: verifier` capability authored outside PHARN's own surface" — a membership question over
frontmatter, not a path test, so it needs a probe type that does not exist yet.

## Guarantee audit (P0)

- "a REGISTERED forward claim cannot silently expire" → **FLOOR: enum-regex** (primitive #3 — path
  existence + exact substring presence), both directions, inherited from the existing checker.
- "the docs carry no expired forward claims" → **NOT CLAIMED.** The manifest is a hand-maintained
  address book. It cannot DISCOVER an unregistered claim; a doc that starts asserting some other
  not-yet-built thing tomorrow is invisible until a human adds the entry. This is the same bound the
  existing checker states about itself, inherited verbatim and re-stated for the new class.
- "an empty `forward_claims[]` is a real GREEN" → **FLOOR, and this is the L34 guard.** A present-but-
  empty array is exit 2 (`EMPTY_CLASS`), never GREEN. Omitting the key entirely is the expressible
  "none registered" state, and is GREEN by design — the two are distinguishable, which is what makes
  the guard honest rather than an obstacle.
- "the probe proves the artifact WORKS" → **NOT CLAIMED.** It tests existence. A stub at the probe path
  flips the claim to expired and REDs direction 1 — deliberately, as for the existing classes.
- "this checker RUNS" → **ADVISORY**, and unchanged: it inherits the EXISTING `check:markers` wiring in
  `npm run check` and `ci.yml`. **Adding no new wiring is the point of the increment** (L35) — there is
  no new invoker to pin, because there is no new invoker.

## Trust audit (P2)

Unchanged from the existing checker. The manifest is trusted, human-reviewed apparatus; the docs it
reads are trusted. Doc bytes are opaque DATA — compared with `String.prototype.includes`, never parsed,
interpreted or executed. No untrusted input is ingested and no free text steers a branch.

## Open questions (HALT)

None. The one genuine ambiguity — the probe path for the `live griller runner` class — is resolved by
NOT registering it and recording the reopen trigger, rather than inventing a path (P6: the terminal
fallback is to ask/defer, never to guess).

## SKILLS_VERSION

**No bump.** Everything here is `.dev/**` build apparatus; no product-surface byte changes. No
CHANGELOG entry is owed either, per the dev/product boundary in CLAUDE.md.
