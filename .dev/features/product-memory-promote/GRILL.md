# GRILL — product-memory-promote

Interrogated `.dev/features/product-memory-promote/PLAN.md` (approved at the plan gate this run).
**Spec-hash check:** recomputed `sha256(pharn/ARCHITECTURE.md)` =
`a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753` — **equal** to the plan's pinned
`spec_content_hash`. No drift. (The computation is content-hash floor-grade; here it only **surfaces** —
`/pharn-dev-build` is where drift blocks, fix #4.)

**Griller membership (FLOOR — `pharn/floor/count-grillers.mjs .`):** `{"registered":13}` — `a11y`,
`architecture`, `comprehension`, `coupling`, `documentation`, `error-handling`, `i18n`, `migrations`,
`observability`, `performance`, `privacy`, `security`, `testability`. Each was applied inline over the
PLAN; the axes that produced no finding are recorded as such below rather than silently dropped.

> **The findings below are ADVISORY.** Their `problem` / `evidence` free-text quotes the PLAN, which is
> `trust: untrusted` to this stage — rendered as DATA, never as an instruction to `/pharn-dev-build`. The
> enum-gated fields (`type`, `rule_id`, `severity`, `file`) are this stage's own enum-membership /
> path-resolution assertions. **No guaranteed decision rests on anything in this file**, and the
> `severity` values are LLM-assigned (fix #3) — advisory, never a floor verdict.

---

## Findings — axis: determinism (P5) / scoping

```yaml
- type: FINDING
  rule_id: "P5"
  severity: blocking
  file: ".dev/features/product-memory-promote/PLAN.md:291"
  problem: "The next-id rule is ported verbatim from the dev command, but a USER's canon is arbitrary — the plan never says what happens when live memory-bank/lessons-learned.md is non-empty yet carries no `## L<n>` headings, so the deterministic next-id computation has no defined answer and no stated terminal fallback."
  evidence: "The next id is computed from **live canon** (highest `## L<N>` + 1); the checker independently rejects a duplicate."
```

**Why this is the sharpest finding.** In the apparatus, canon is house-style by construction — every
entry is `## L<n> — <title>` because `/pharn-dev-memory-promote` wrote every one of them. On the product
surface that assumption evaporates: a user may hand-write `memory-bank/lessons-learned.md` today (the
PLAN's own framing section says exactly this, `:33`) in any shape they like. `existingIds()` takes the
first whitespace-delimited token after `##`, so over `## Lesson 1 — …` it yields `"Lesson"`; the
duplicate check then silently cannot collide, and "highest `## L<N>` + 1" is undefined. **Remedy:** the
command must branch on a membership test — canon holds ≥1 `## L<n>` heading → next id is max+1; canon is
absent/empty → `L1`; canon is non-empty with **no** `L<n>` heading → **HALT and ask the human** which id
scheme to use (P5's terminal fallback is a question, never a guess). State it in the command, and pin the
"non-empty, no `L<n>`" case with a test.

---

## Findings — axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/product-memory-promote/PLAN.md:188"
  problem: "The cross-copy agreement guard is labeled `floor: enum-regex` in the guarantee audit, but it is a `node --test` assertion — nothing in ARCHITECTURE §2's three primitives is 'a unit test', and the plan never names what makes it binding."
  evidence: '**"The two checker copies agree on everything but their target enum"** → **floor: enum-regex** (the dev-side agreement test, string comparison over both sources).'
```

The claim is **recoverable, not wrong** — it just skips a step. What makes a test binding in this repo is
its membership in `/pharn-dev-verify`'s `check-verify.mjs` gate map (the `test` gate), which is exactly
the status every other `*.test.mjs` here has. Say that, and say the other half honestly too: **the
guard's verdict is floor-grade within the `npm test` gate; the guard's existence and the act of running
it are advisory orchestration** (the two clocks). Without that sentence the audit reads as "we invented a
fourth floor primitive," which is the disease in miniature.

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/product-memory-promote/PLAN.md:178"
  problem: "Admitting the literal `unknown` as a COMMIT_RE member narrows what 'well-shaped provenance' guarantees — an entry may now reach canon with no diff pointer at all — and the guarantee audit restates the old, broader claim without relabeling it."
  evidence: '**"A candidate reaching the human gate carries well-shaped provenance, a non-duplicate id, a target in the canon enum, an enum-member `type`, and a well-shaped `concepts` list"** → **floor: enum-regex**'
```

`pharn/ARCHITECTURE.md §5` specifies provenance as _"which run / feature / diff"_. In the apparatus all
three are always real, because the apparatus is always a git repo. On the product surface `commit:
unknown` is a legitimate, deliberately-chosen state — and it deletes the **diff** third of §5's triple
while `feature` and `source` (both still non-empty-checked) carry the rest. That is a **defensible**
trade and the right one; it is **not** a free one. The audit should read: _"well-shaped provenance —
where `commit` may be an honest `unknown`, so a promoted entry is not guaranteed to carry a diff
pointer."_ Naming the narrowing is the whole discipline; a guarantee that quietly gets smaller is how
`written ≠ guaranteed` reappears.

---

## Findings — axis: scoping (L7's own prescribed remedy, unapplied)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/product-memory-promote/PLAN.md:65"
  problem: "The plan cites L7 and audits only TWO of the nine product commands for a memory-bank path in `writes:`, and it applies neither half of L7's stated remedy — it neither enumerates every command's `writes:` nor pins the resolved scope with a set-equality test, so a future re-widening still fails OPEN."
  evidence: '`/pharn-plan` reads `memory-bank/lessons-learned.md` and declares `writes: ["features/<name>/PLAN.md"]`; `/pharn-review` declares `writes: ["features/**"]` — neither covers `memory-bank/**`'
```

L7's remedy is explicit and this plan quotes only the easy half of it. Two things are missing. **(1) The
audit is not exhaustive** — nine product commands exist and two were checked; the other seven are
asserted-by-omission, which is precisely the P6 failure ("never assert what exists from memory"). **(2)
There is no guard.** L7 says _"pin the resolved scope with a test … so a future re-widening fails
closed,"_ and this increment is the first moment a canon path becomes reachable from the **product**
surface — the exact moment the guard is cheapest and most valuable. `.dev/floor/command-hygiene.test.mjs`
already walks every `.claude/commands/*.md` for a forbidden vocabulary and is the natural home: assert
that **no** command other than the two `*memory-promote` ones names a `memory-bank` path in `writes:`.
Note the honest bound, exactly as that file already does for L19: this pins a **vocabulary**, not a
behavior.

### The audit was then RUN during this grill — and it found something the plan did not

All **18** commands were enumerated live (`grep -m1 '^writes:' .claude/commands/*.md`). **No command
other than `pharn-dev-memory-promote.md` declares a `memory-bank` path.** The declared-`writes:` half of
the audit is therefore **clean**. But running it exposed a hole the declaration-level audit cannot see:

```yaml
- type: FINDING
  rule_id: "P2"
  severity: blocking
  file: ".dev/features/product-memory-promote/PLAN.md:65"
  problem: "/pharn-build derives its writes-scope from a PLAN's `## Files` via --from-plan, not from a declared literal, and no human approves a product PLAN — so a `## Files` entry naming memory-bank/lessons-learned.md would grant /pharn-build a direct, ungated canon write, bypassing the accept/deny gate this entire increment exists to install."
  evidence: 'writes: ["<user-code files named in the plan''s ## Files (Phase-1, via --from-plan — not from this list)>", "features/<name>/BUILD.md"]'
```

**Why this matters more than its severity label suggests.** This is L7's failure mode reached through a
door L7 does not describe: not an over-broad `writes:` **declaration**, but a scope **derived from a
model-authored document**. In the product pipeline the human gate is on the **SPEC** (Draft → Approved);
the `PLAN.md` that `--from-plan` parses is written by `/pharn-plan` with **no** human approval step, so
the path from "model writes a line in `## Files`" to "agent holds canon write-scope" has no human in it.
`THREAT-MODEL.md §2 #3` is the surface (memory poisoning, write-once-influence-forever) and this is a
second route onto it.

**It is pre-existing, and this increment is what makes it live.** The hole exists on `main` today and is
currently inert only because `memory-bank/` means nothing on the product surface — there is no canon to
poison. This increment gives it meaning. That is not an argument for building the port differently; it is
an argument for naming the consequence loudly rather than shipping the gate and leaving its bypass
undocumented.

**It cannot be closed inside this increment's approved `## Files`** — closing it needs an edit to
`.claude/commands/pharn-build.md`, to `set-writes-scope.cjs`, or to `enforce-writes-scope.cjs` (e.g. a
denylist that refuses a canon path regardless of the active scope, which is the shape that would actually
hold, since it does not depend on any declaration being honest). None is in scope. **Recommended
follow-up: `canon-write-denylist`** — and note the vocabulary guard proposed above **does not** close it
either, because `--from-plan` never reads a `writes:` declaration at all. Say that explicitly wherever
the guard is documented, or the guard becomes exactly the "written therefore guaranteed" artifact it was
meant to prevent.

---

## Findings — axis: testability / eval coverage (P1, `eval-format.md` — cited, not restated)

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/product-memory-promote/PLAN.md:123"
  problem: "The plan requires a live round-trip to satisfy L4 but never applies L4 to the agreement guard itself — a newly-authored assertion that has not been measured REJECTING a mutant is exactly the 'passes by construction' artifact L4 warns about."
  evidence: "Adds the **cross-copy agreement guard**: it reads both checkers and asserts they agree on `TYPE_ENUM`, `CONCEPTS_MIN`/`CONCEPTS_MAX`/`CONCEPT_MAX_LEN`, `CONCEPT_RE`, `DATE_RE` and `REQUIRED_PROVENANCE`"
```

The guard is the **entire** mitigation that made option (a) acceptable at the plan gate — if it is
inert, the human approved a duplication with an imaginary safety net. The repo already has the precedent
and the wording for this: the `ci.yml` ✧ guard's CHANGELOG entry records that _"both halves were measured
rejecting a mutated workflow before being trusted (L4)."_ Do the same: transiently add a seventh member
to one `TYPE_ENUM`, confirm the guard REDs, revert, and record the measurement in `BUILD.md`.

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/product-memory-promote/PLAN.md:53"
  problem: "The round-trip is specified as a one-time human-witnessed demonstration, so the evidence dies with the session and nothing regression-guards the checker→canon→check-plan-lessons seam that is this increment's entire reason for existing."
  evidence: "So acceptance requires a **live round-trip** in a staged temp dir (promote → canon heading → a PLAN citing `[L1]` → `check-plan-lessons.mjs` GREEN)"
```

The agent-driven half (the human gate, the Write tool, the pre-write hook) genuinely **cannot** be a
`node --test`, and the plan is right to demonstrate it live. But the **checker-to-checker** half can be:
a test that renders an entry from a GREEN candidate into a temp canon file and asserts
`check-plan-lessons.mjs` resolves `[L1]` against it would pin the seam durably. Consider it; do not let
"we demonstrated it once" stand in as a regression asset.

---

## Findings — axis: architecture / one-axis-of-change (P3)

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/product-memory-promote/PLAN.md:172"
  problem: "Appending the cross-copy agreement guard to `.dev/floor/check-provenance.test.mjs` gives that file two reasons to change — the dev checker's own behavior, and the relationship between two separate files — when a standalone test file is both cleaner under P3 and already precedented."
  evidence: "`.dev/floor/check-provenance.test.mjs` → the cross-copy agreement guard described in `## Files`."
```

`command-hygiene.test.mjs` is the precedent and its header argues the case explicitly: a test whose
subject is not its sibling checker gets its own file. A `.dev/floor/provenance-copies-agree.test.mjs`
would change for exactly one reason, be findable by name, and keep the dev checker's suite about the dev
checker. The counter-argument (the repo accepted a two-artifact `capability-catalog-core.mjs` as a
recorded cost) is real but weaker here, because the split costs nothing. Human's call; the plan should at
least record which shape was chosen and why.

---

## Findings — axis: comprehension / documentation

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/product-memory-promote/PLAN.md:47"
  problem: "The plan never mentions that the very consumer it exists to feed — pharn/floor/check-plan-lessons.mjs — carries a known, recorded fail-open (the naive fence toggle noted in the CHANGELOG #116 entry), so a human reading only this plan cannot see that the write side is being hardened while the read side has an open defect."
  evidence: "this increment makes **no** declarative field load-bearing (`pharn/floor/check-plan-lessons.mjs` is byte-unchanged), so it inherits **no** migration"
```

Keeping it byte-unchanged is the **right** call and is not disputed. The gap is disclosure: the CHANGELOG
records _"(Noted for a human, out of scope here: `pharn/floor/check-plan-lessons.mjs` carries the same
naive toggle.)"_ — a fenced-block-handling defect in the exact file this increment's output flows into.
Name it in the plan as a known adjacent defect with its own follow-up, so "byte-unchanged" reads as a
deliberate boundary rather than as an implicit clean bill of health.

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".dev/features/product-memory-promote/PLAN.md:120"
  problem: "The command's surfacing-artifact input is described as `features/<name>/` generically, which is not a citable path; a `reads:` list must name paths that exist, and the product analogue does exist."
  evidence: "(canon at `memory-bank/`, product `reads:`, product Step-0 scope, `features/<name>/` as the surfacing artifact, `unknown` commit fallback, bootstrap-on-accept)"
```

Verified live this run: `/pharn-review` Step 6 renders `features/<name>/REVIEW.md` from the merged
`features/<name>/findings.json`, so the direct analogue of the dev command's
`.dev/features/<name>/REVIEW.md` is real and should be named. L2's rule — a doc may cite only a live
thing — applies to `reads:` entries just as it does to floor ops.

---

## Findings — axis: bootstrapping (P6, verify-before-assert)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".dev/features/product-memory-promote/PLAN.md:170"
  problem: "The declared first-promotion test covers the CHECKER over a non-existent directory, but the bootstrap decision also asserts a Write-tool + hook behavior — creating a file whose parent directory does not exist, under a scope pinned to that exact path — which no declared step measures."
  evidence: "the first-promotion case over a **non-existent `memory-bank/`** directory, not merely a non-existent file — the user-bootstrap path."
```

Two different claims sit under one bullet. The checker half is testable and declared. The **write** half
— "creating a file is no wider a power than appending to one" — is a live assertion about the fix #7 hook
and the Write tool that has not been measured this run. The staged round-trip should start from a
directory with **no** `memory-bank/` at all, so the bootstrap path is exercised end to end rather than
reasoned about.

---

## Axes that produced no finding (recorded, not silently dropped)

- **security** — the increment adds no network egress, no `.cjs`, no new privilege. The one new power
  (agent-reachable canon in a user's repo) is named in the plan's Trust audit as a growth in exposed
  population, with the blast radius bounded by the same two floor ops the apparatus runs under.
- **error-handling** — the ported checker accumulates reds and fails closed on unreadable/invalid input;
  the plan preserves that. `readJson` / `existingIds` both already have explicit failure branches.
- **performance / a11y / i18n** — not applicable. `node .dev/floor/scan-plan-i18n.mjs` reported
  `{"found":false}`.
- **privacy** — `node .dev/floor/scan-plan-pii.mjs` and `scan-plan-secrets.mjs` both reported
  `{"found":false}`.
- **migrations** — `scan-plan-migrations.mjs` reported hits at `:48` and `:272`; both are **false
  positives** on prose stating that this increment needs **no** migration and that canon has **no**
  rollback signal. No migration is planned and none is needed (L3's direction is explicitly audited).
- **observability** — `scan-plan-observability.mjs` reported five hits at `:228`–`:232`; all five are
  `console.log` lines **inside a fenced measurement block**, not an observability claim. Noted as a
  scanner-precision observation about the scanner (it presence-greps rather than reading a structured
  location — L6's discipline applied to the scanner's own input would exclude fenced blocks), not as a
  finding against this plan.
- **coupling** — no framework-touching content; `coupling` does not apply to a command or a floor
  checker.

---

## Summary

The plan is unusually well-grounded — every fact it asserts about the repo was read live this run, the
false `$`-trailing-newline claim was measured rather than inherited, and the three decisions the port
brief refused to make alone were put to the human and resolved. The concerns are concentrated in one
place: **the plan is strongest where it ported the apparatus faithfully and weakest exactly where the
product surface differs from it.**

The sharpest instance is the next-id rule (`P5`, `:291`): the apparatus can assume house-style canon
because it wrote every entry; a user's repo cannot, and the plan carries the assumption across without
noticing it became an assumption. Two P0 findings are labeling slips of the kind this repo is most
allergic to — a unit test called a floor primitive, and a guarantee that quietly got smaller when
`commit: unknown` was admitted. The L7 finding is the one with the most leverage: this increment is the
moment a canon path first becomes reachable from the product surface, which is the cheapest possible
moment to pin it, and L7's own remedy prescribes exactly that guard.

None of this argues against the increment. All eight findings are addressable **inside the approved
`## Files`** — five are prose corrections to files already being written, two ask for one extra test each
(both in already-declared files, or one new dev-side test file if the P3 finding is accepted), and one
asks for a staging detail in the round-trip.

**ADVISORY VERDICT: 10 concerns raised (2 blocking-severity, 5 important, 3 minor) — for the human to
weigh before `/pharn-dev-build`.** `/pharn-dev-grill` gates nothing; `/pharn-dev-build`'s floor-gates
(spec-hash drift, unresolved `## Open questions (HALT)`) and `pharn/floor/validate.mjs` remain the only
deterministic stops.
