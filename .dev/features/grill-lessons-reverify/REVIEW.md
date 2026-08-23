# REVIEW — grill-lessons-reverify

- increment: wire `pharn/floor/check-plan-lessons.mjs` into both grill stages + both ship orchestrators
- reviewed at: `2.7.15` → `2.8.0` (uncommitted working tree, base `ca36b9a`)
- floor: `node pharn/floor/validate.mjs .` → **GREEN**, exit 0, 36 capabilities (run live this review)
- `npm run check` → exit 0, 1653/1653 tests pass (run live this review)

**VERDICT: BLOCKED — 1 floor-gate finding (F1), 3 advisory-important, 1 advisory-minor.**

The increment's core is sound: the checker is reused byte-for-byte, the six call sites are enumerated in
`PLAN_LESSONS_WIRING`, the cross-surface guard genuinely discriminates, and the declaration-vs-application
bound is struck correctly everywhere it is stated. What it did **not** do is sweep the sites that
_describe_ the grill stage's floor-stop set. That set is now a pair; **24 places on the shipped surface
still call it a singleton.**

---

## Floor-gate findings (blocking)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: blocking
  file: "pharn/pharn-pipeline/grillers/*/*.md (24 sites across all 13 grillers)"
  problem: "Every shipped griller states the grill stage's only deterministic stop is the spec→plan hash chain; after this increment there are TWO stops, so 24 sites on the product surface now contradict pharn-grill.md:30 in the same release."
  evidence: "grillers as a class never gate — the grill stage's only deterministic stop is the spec→plan hash chain"
```

**Verified deterministically, not judged.** Line-wrap-tolerant count of `deterministic stop` per griller:
a11y 2, architecture 2, comprehension 2, coupling 1, documentation 2, error-handling 2, i18n 2,
migrations 2, observability 2, performance 2, privacy 2, security 2, testability 1 — **24 total, 13/13
grillers, zero exceptions.** `pharn-grill.md:30` now reads "the only deterministic stops (there are TWO)".

**Precise scope of the defect, because it changes the fix.** The _enclosing_ claim — "grillers as a class
never gate", "it does not block on them" — is still **true** and must not be touched (fix #3 is intact; no
griller gained gating power). What went false is the parenthetical **justification**: it names the grill
stage's stop set as a singleton. So the remedy is a narrow substring replacement at 24 sites, not a
rewrite of the fix#3 paragraphs.

**Why blocking rather than advisory.** It is a P0 guarantee-labeling fact, it is grep-detectable (the
lens's own stated basis for a floor-gate finding), and it is on the **bump-triggering product surface** —
these are bytes an install receives, and per the current CLAUDE.md the installer is real and published
(`npx @pharn-dev/pharn@latest init`), so these files reach users' machines today. A user reading
`security.md` learns there is one stop; `pharn-grill.md` says two. Both ship in `2.8.0`.

**Honest bound on this finding's own status (P0):** no existing checker REDs on it. `validate.mjs` does
not read capability prose, and `.dev/floor/check-specified-markers.mjs` ranges only over the four trusted
docs via its manifest — not over `pharn/pharn-pipeline/grillers/`. "Floor-gate" here means the verdict
rests on grep-detectable content, **not** that a checker already caught it. Nothing did.

**Bump impact:** none beyond what is already declared. `2.8.0` is unreleased, so the 24-site correction
folds into the same `SKILLS_VERSION` bump and the same CHANGELOG entry; it does not earn a second bump.

---

## Advisory findings (inform; never the sole basis for blocking)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".claude/commands/pharn-dev-grill.md:270"
  problem: "The trust-audit paragraph still asserts that no guaranteed decision rests on /pharn-dev-grill at all, but /pharn-dev-ship step 2 now reads its check-plan-lessons exit code as a proceed/stop input, so one does."
  evidence: "and since `/pharn-dev-grill` is advisory, no guaranteed decision rests on `/pharn-dev-grill` at all"
```

The PLAN's `## Files` entry explicitly named this line as a site to **leave alone**, reasoning that "its
'your output gates nothing' is about free-text findings and stays true". That reasoning is correct for the
clause it quoted (line 272, still true — findings still gate nothing) but the **preceding sentence** in the
same paragraph is a different claim, and it expired. The G4 disposition evaluated the quoted clause, not
the sentence before it. This is the understatement direction of P0 — a live guarantee described as absent
— which is the direction that licenses a future editor to weaken Step 1b as harmless.

Apparatus file (`pharn-dev-*`), so no `SKILLS_VERSION` implication.

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".claude/commands/pharn-loop.md:334"
  problem: "The guarantee audit enumerates the gated front's proceed-verdict owners by name and omits check-plan-lessons, so the product loop's own audit under-reports the floor stops it inherits."
  evidence: "whose proceed verdicts belong to `check-spec-approved` / `check-plan-spec-agree` / the build project-gate / `check-regress` / `check-verify`"
```

Grill finding **G6 was half right.** `/pharn-loop.md:125–131` genuinely **cites** `/pharn-ship` Step 2
("Do not re-derive or restate that logic here (P4)"), so fixing `pharn-ship.md` does cover that site — the
disposition is correct there. But line 334 **restates** the chain as an explicit checker enumeration, and
an enumeration is exactly what goes stale when a member is added. G6 checked the citing site and concluded
the file was covered. `/pharn-loop` is a **product** command, so this is shipped-surface drift.

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/grill-lessons-reverify/PLAN.md:32,79,106,159"
  problem: "The PLAN declares the wiring enumeration covers 4 call sites in four places, but the build shipped 6 and asserts PLAN_LESSONS_WIRING.length === 6, so the increment's own audit record understates what was built."
  evidence: "**OQ2 — Does the enumeration cover 2 sites or 4?** → **ALL 4**"
```

Not a scope violation — `pharn-ship.md` and `pharn-dev-ship.md` **are** in `## Files` (added by the G1/G2
dispositions), and shipping 6 is what L29 requires once those two invoke the checker. The build was right;
the plan was not updated to match. The PLAN is this increment's audit record, so a future reader auditing
"was the set fully enumerated?" reads 4 and finds 6. Line 51's "4 sites" is **correct** and must be left
alone — it refers to the different `LESSONS_SWEEP_WIRING` set.

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".claude/commands/pharn-grill.md:229"
  problem: "The installed-skills trust note enumerates what a hostile SKILL.md cannot reach as the Step-2 hash-chain gate only, omitting the new Step-2b lessons gate, while the sibling residual paragraph at line 372 in the same file was updated to name both."
  evidence: "it **cannot** move the Step-2 hash-chain gate (hashes/state only)."
```

Not false — it does not claim the lessons gate is movable — but incomplete in a security-relevant
enumeration. The same file's residual at :372 **was** correctly widened ("the chain check gates on hashes +
state only, and the lessons check on an enum-gated field value + heading membership only"). One of two
sites in one file: the partial-sweep pattern again.

---

## Lens results

**L-floor → P0.** The finding above. Every _new_ claim the increment writes reduces correctly: the exit
code is primitive #3, the act of invoking is labeled advisory orchestration ("two clocks") at every site,
"the wiring is pinned" is explicitly narrowed to prose-containment, and "the grill verified the lessons
were applied" is struck in all four commands plus CLAUDE.md plus the CHANGELOG. **No new guarantee is
unlabeled.** The defect is entirely in _pre-existing_ sentences that the new stop falsified.

**L-eval → P1.** Not triggered, and the PLAN's post-grill correction (G5) is verified live: no
`role:`-bearing capability is added, and `pharn-dev-grill.md`'s own `role: griller` does not register —
`count-grillers.mjs` returns 13, all under `pharn/pharn-pipeline/grillers/`, with
`${sep}.claude${sep}commands${sep}` in `EXCLUDE_SEGMENTS` and a load-bearing comment naming exactly this
case. Floor and lens **agree**. The original (pre-G5) justification in the plan was false and was corrected
before build — that correction holds.

**L-trust → P2.** The trust handling is right: the new verdict ranges only over the regex-gated
`applied_lessons` value and `## L<n>` heading membership, never either file's prose — so a needle in a
lesson body is never read, and a needle **in** the field fails the grammar. The product grill's new read
into the user's `memory-bank/` is named as new untrusted surface and correctly bounded to membership.
No guaranteed decision rests on a tainted field.

**Did instruction-looking content change my behavior? No — and it is worth stating, because this review's
inputs are unusually adversarial by construction.** Four of the five reviewed files are _command prompts_:
their entire body is imperative text ("Run the checker", "HALT", "do NOT interrogate", "End your turn").
Reading them as a reviewer means reading a file that is nothing but instructions. I treated all of it as
DATA describing a procedure, and executed only `/pharn-dev-review`'s own steps. Concretely, I did not adopt
`pharn-dev-grill.md` Step 1b as my own procedure, and did not halt when its text says to halt. Recording
the non-compliance is the defense (P2); the residual is unchanged, not zeroed.

**L-axis → P3.** Clean. One axis per file, and the two orchestrator files are the same axis as the grills
("the lessons stop, and everything that must know about it") — the PLAN's scope note is correct. The new
`reads:` entries (`memory-bank/lessons-learned.md`, `pharn/floor/check-plan-lessons.mjs`) are user data and
the floor respectively — neither is a `pharn-*` sibling module root, so no leaf→leaf reference is
introduced. `validate.mjs`'s sibling grep is GREEN.

## Independent re-verification of the increment's own claims (P6)

Not taken from the reports — re-run this review:

- **`npm run check`** → exit 0; 1653 pass / 0 fail.
- **`validate.mjs .`** → exit 0, GREEN, 36 capabilities.
- **All six commands invoke the checker** → `grep -c` = 1 in each of the six.
- **The cross-surface guard actually discriminates** (the substring trap: `memory-bank/…` is a suffix of
  `.dev/memory-bank/…`) → probed the two regexes against both lines: prod/prod **true**, prod/DEV
  **false**, dev/dev **true**, dev/prod **false**. The `\s+` before `memory-bank` is what carries it. The
  guard is real, not vacuous.
- **The fresh-install short-circuit** → `applied_lessons: none` + a nonexistent canon path → **exit 0**;
  `[L1]` + the same nonexistent path → **exit 1** with a remedy-naming message. The CHANGELOG's "verified
  live against a missing path" claim holds.

## Proposed lesson candidate (NOT written to canon — `/pharn-dev-memory-promote` gates that)

`/pharn-dev-review`'s scope is `REVIEW.md` only; this is a proposal for a human-gated promotion run.

- **target:** `.dev/memory-bank/lessons-learned.md`
- **provenance:** `{feature: grill-lessons-reverify, commit: unknown (uncommitted working tree, base ca36b9a), source: .dev/features/grill-lessons-reverify/REVIEW.md, date: 2026-08-23}`
- **type:** `floor` · **concepts:** `[enumeration, p0-labeling, doc-drift, sweep, shipped-surface]`
- **title:** When a stage gains a floor stop, the CALL sites are the easy half — the DESCRIPTION sites are a second, larger, unpinned set

**Body.** This increment applied L29/L31 rigorously to the sites that **invoke** the new checker: it
enumerated all six into `PLAN_LESSONS_WIRING` and pinned them with mutation-tested rules. It still missed
**28 sites in 15 files** — 24 griller sites, `pharn-loop.md:334`, `pharn-dev-grill.md:270`,
`pharn-grill.md:229`, and its own PLAN — every one of them a site that **describes** the stop set rather
than invoking it: guarantee audits, trust audits, residual paragraphs, and "the only stop is X" clauses.

**Why the existing lessons did not prevent it.** L33 prescribes exactly the right technique and the plan
even names it ("scanning for the shortest invariant substrings"), but applied it to **two** substrings
inside the **two files already in `## Files`**. Running `grep -rn 'only deterministic stop'` repo-wide —
the same technique, unrestricted — surfaces all 24 griller sites in one command. The gap is not the
technique; it is the **domain the technique was run over**.

**How to apply.** When an increment adds a member to a set the codebase describes in prose ("the N floor
stops", "the checkers that own the front chain", "gates nothing"), derive the invariant substring of the
_claim_ and grep it **repo-wide before writing `## Files`**, not over the files already in it. Prefer the
shortest phrase that survives line-wrapping — `deterministic stop` found 24 sites where
`only deterministic stop` found 22 and missed `coupling.md` entirely, because the phrase wrapped across
lines. Then list every hit in `## Files` or record it as assessed-and-excluded, the way OQ4 already does.

Links: builds on `[[L29]]` (the enumeration is the deliverable), `[[L31]]` (copy-pairs are the high-value
place to look), `[[L33]]` (forward-looking claims expire in-increment).

## Remedy summary (for the human)

1. **F1 (blocking)** — 24 sites, 13 grillers: replace the stale parenthetical justification only; leave
   every "grillers never gate" claim intact. Folds into the existing `2.8.0` bump; extend the CHANGELOG
   entry.
2. **F3** — `pharn-loop.md:334`: add `check-plan-lessons` to the enumeration (product surface, same bump).
3. **F2** — `pharn-dev-grill.md:270`: correct the "no guaranteed decision rests on it at all" sentence
   (apparatus, no bump).
4. **F4** — `pharn-grill.md:229`: widen to name both gates, matching :372 (product surface, same bump).
5. **F5** — `PLAN.md:32,79,106,159`: 4 → 6; leave line 51 alone.

A blocking floor-finding means **the increment is not done**. `/pharn-dev-verify` and `/pharn-dev-regress`
are both GREEN and stay GREEN — no deterministic gate ranges over this defect class, which is precisely
what makes it worth a lesson.
