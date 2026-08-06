# PLAN — product-memory-promote

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # sha256 of pharn/ARCHITECTURE.md, read this run (fix #4)
- applied_lessons: [L1, L2, L3, L4, L5, L6, L7, L8, L10, L13, L14, L15, L16, L17, L18, L19]
- increment: Port the memory-bank promotion WRITE side to the product surface — ship `/pharn-memory-promote` plus `pharn/floor/check-provenance.mjs` and its test suite, de-dev-ified to a user's `memory-bank/`, so a PHARN user can promote a lesson to canon through the same gated, provenance-carrying path the build apparatus already has.
- layer(s): product `.claude/` command surface + `pharn/floor/` (the product floor). Not a `pharn-*` capability tree layer — a command has no `role:`, so `pharn/ARCHITECTURE.md §4` layering does not bind it; the checker is floor (`§2` primitive #3, `§3.3` — hooks/floor are a separate class from Capabilities).
- constitution_refs: [P0, P2, P4, P5, P6, P7]

## Increment framing — the trigger, stated honestly (P7)

**No dogfood run failed and no eval failed.** This is not a failure-triggered increment, and saying
otherwise would be the overclaim this repo exists to prevent. What justifies it is a **gap between the
trusted spec and the shipped product surface**, verified live this run:

1. `pharn/ARCHITECTURE.md §5` (**State**) specifies the memory-bank as four canonical markdown files and
   says _"Promotion of a lesson/pattern to canon is a **gated** action with provenance per entry"_. That
   is a **product** claim — `ARCHITECTURE.md` describes PHARN, not the apparatus.
2. The product surface ships the **consumer** of that memory-bank and none of the gate.
   `.claude/commands/pharn-plan.md` declares `memory-bank/lessons-learned.md` in `reads:` (read live,
   `:11`), runs a mandatory lessons sweep (Step 1.3), and gates on
   `pharn/floor/check-plan-lessons.mjs` (Step 4b). The product command surface is exactly **9** commands
   (`README.md` generated `## Current state`, read live) — there is **no** `/pharn-memory-promote`, and
   `check-provenance.mjs` lives under `.dev/floor/`, i.e. it is stripped at packaging.
3. **Be precise about what is missing.** It is _not_ "`applied_lessons` can only be `none` in a user
   repo" — that is false: `check-plan-lessons.mjs` resolves cited ids against `## L<n>` headings in a
   plain markdown file, so a user can hand-write `memory-bank/lessons-learned.md`, cite `[L1]`, and pass
   the floor today. The accurate statement is narrower and worse: **the product ships a memory-bank
   consumer and none of the discipline that makes its contents trustworthy** — no provenance capture, no
   duplicate-id check, no target enum, no `type`/`concepts` shape gate, no human accept/deny halt.

Closing that is **domknięcie** — tightening an existing spec claim to its floor, the same move
`check-provenance.mjs` itself made for §5's provenance half — not a new capability invented from a
hypothetical, which is what P7 forbids.

## Applied lessons

- **L1** — meta-doc sweep at plan time: this increment changes facts asserted in `README.md`'s generated
  `## Current state` (**Product commands — 9 → 10**, **Floor checkers — 37 → 38**), in `CLAUDE.md`'s
  `## Commands` block (which documents `.dev/floor/check-provenance.mjs` and the nine product commands),
  in `CHANGELOG.md`, and in `SKILLS_VERSION`. All four are named in `## Files` so `/pharn-dev-build` can
  write them; omitting them would ship stale canon.
- **L2** — the honesty travels **with the artifact**: the P0 floor/advisory split is written into
  `/pharn-memory-promote`'s own `## Guarantee audit` section and into the checker's file header, not only
  into this PLAN. And the command may cite only a **live** floor op at a path that exists **in a user's
  install** — hence `pharn/floor/check-provenance.mjs` (shipped) and never `.dev/floor/…` (stripped);
  every cited path is re-read at build before the prose ships.
- **L3** — read in the direction it actually applies: this increment makes **no** declarative field
  load-bearing (`pharn/floor/check-plan-lessons.mjs` is byte-unchanged), so it inherits **no** migration
  and invalidates **no** existing install. The mirror obligation is honored too: the checker keys on
  `candidate.json` and **never scans canon**, so a user's hand-written `memory-bank/lessons-learned.md`
  is **not** retro-invalidated by the `type`/`concepts` requirement.
- **L4** — an authored fixture passes by construction. The unit suite proves the **check** is shaped
  right; it never proves the **shipped path** works. So acceptance requires a **live round-trip** in a
  staged temp dir (promote → canon heading → a PLAN citing `[L1]` → `check-plan-lessons.mjs` GREEN) plus
  a **live** hook-denial measurement, not an assertion that they would pass.
- **L5** — the provenance capture is exactly the input-capture trust boundary L5 names: a corrupted
  `git rev-parse HEAD` would yield a **shape-valid lie** the floor cannot see. So the command captures it
  fail-closed and writes the literal **`unknown`** when git cannot resolve a SHA — never an empty field,
  never a fabricated one — and the checker admits `unknown` as an explicit enum member rather than
  letting a garbage value squeak past `COMMIT_RE`.
- **L6** — every membership/structural fact is read from its **defined structured location**: the
  candidate's fields from `candidate.json` (never grepped from a body), and the command doc's `type`
  member list from its marked `TYPE-ENUM:BEGIN/END` region (never grepped from prose). A `type:` string
  inside a lesson **body** stays DATA about typing, not a declaration of it.
- **L7** — `/pharn-memory-promote` declares **exactly** the one path it writes
  (`writes: ["memory-bank/<canon-file>"]`), and the increment **audits that no other product command
  holds canon write-scope**: `/pharn-plan` reads `memory-bank/lessons-learned.md` and declares
  `writes: ["features/<name>/PLAN.md"]`; `/pharn-review` declares `writes: ["features/**"]` — neither
  covers `memory-bank/**` (both read live this run). Canon stays writable **only** through the gated
  command, which is the exact power L7 says must not leak upstream.
- **L8** — the setter narrows **one** `--target` per call and each call overwrites the scope file, so a
  multi-artifact command cannot scope its outputs. `/pharn-memory-promote` therefore emits a **single**
  scopeable file (the one canon file); the candidate goes to `.pharn/pharn-memory-promote/candidate.json`
  — always-writable scratch, not hook-gated — so no second placeholder path ever needs scoping.
- **L10** — the asymmetry L10 names lands **directly** on this port: `pharn/floor/validate.mjs`'s
  `EXCLUDE_SEGMENTS` (read live) excludes `.dev/` and `pharn/floor/` but **not** a root `memory-bank/`,
  so in a user's repo the promoted canon file **is on validate's scanned surface** and CHECK 5 fires on
  any file containing both `rule_id:` and `problem:` without documenting the enum-gated/free-text split.
  The command therefore carries an explicit, **advisory** note: an entry whose body quotes a finding
  template must document the split (or not reproduce the literal pair). Declared as a consequence, not
  discovered by a user's first RED — and **not** "fixed" by widening `EXCLUDE_SEGMENTS`, which would
  discard the trust upside L10 also names.
- **L13** — the stage formats **its own** artifact and nothing else. Following the dev promote command
  exactly, the product command's format step is **check-only** (`--check` / no `--fix`) over the one
  target canon file: canon is shared, historical and provenance-carrying, so an auto-fixer invoked
  through Bash over it is the L19 class aimed at the fail-closed zone with a blast radius on entries this
  run never touched.
- **L14** — the ported `concepts` validation keeps the control-char guard **composed before** the
  anchored shape regex, never substituted for it. **But the repo's stated justification for that
  composition is false and is NOT carried across** (see `## The false trailing-newline claim` below):
  measured on this tree, JS `$` without `m` matches **only** at end-of-input. The ported comment states
  the site's **real** reason instead — nothing on the `concepts` path trims, so the guard is **redundant
  today** on control characters and is kept anyway, per `check-loop-record.mjs`'s honest framing.
- **L15** — audited, with the conclusion recorded rather than assumed: the checker's only keyed lookup on
  arbitrary input is `field in p` over the **closed literal list** `REQUIRED_PROVENANCE`
  (`feature`/`commit`/`source`/`date`), none of which collide with an `Object.prototype` member, so the
  inherited-inclusive `in` cannot leak a prototype member here. **No change is made** — a gratuitous
  divergence from the dev copy would weaken the cross-copy agreement guard this plan adds for the price
  of no real safety.
- **L16** — a remedy is itself an input-capture surface. The round-trip staging must use **portable**
  shell only (no GNU-only flags such as `xargs -a`; `cp`/`mkdir -p` and stdin pipes), and any
  human-implausible result during the round trip (e.g. a RED on a path proven green a moment earlier) is
  **investigated, never recorded**.
- **L17** — pre-declared so the downstream stage is not misread: `check-regress.mjs scope` tests
  **changed-since-base**, not written-by-the-build, so on a working-tree dogfood the sibling
  `.dev/features/product-memory-promote/*` artifacts will appear in `inside` and read as "the build
  escaped its `## Files`". Expected and false; not a reason to widen `## Files`.
- **L18** — the exclusion block below is a real markdown **heading** (`### Deliberately NOT in scope`),
  not a bold prose intro, because `set-writes-scope.cjs --from-plan` ends the authorized list at a
  heading (structural, wording-independent) and a bold intro outside its narrow prose vocabulary would
  grant write-scope to **every path the exclusion names**. The setter's printed path count is to be read
  against the approved list, not treated as decoration.
- **L19** — `npm run docs:generate` rewrites `README.md` through **Bash**, which escapes the fix #7
  writes-scope entirely. The remedy L19 prescribes is to **declare it**, not to pretend the gate covered
  it: `README.md` is named in `## Files` as a generated-region write, and the command's own format step
  is check-only + path-scoped so it never becomes a second uncontrolled Bash write.

## Files

- `.claude/commands/pharn-memory-promote.md` — NEW. The product promotion command: a de-dev-ified port of `/pharn-dev-memory-promote` (canon at `memory-bank/`, product `reads:`, product Step-0 scope, `features/<name>/` as the surfacing artifact, `unknown` commit fallback, bootstrap-on-accept). Product surface → bumps `SKILLS_VERSION`.
- `pharn/floor/check-provenance.mjs` — NEW. The product provenance + duplicate-id + target-enum + `type`/`concepts` shape checker. Stdlib-only, no runtime deps. `TARGET_ENUM = ["memory-bank/lessons-learned.md", "memory-bank/pattern-library.md"]`; `COMMIT_RE = /^([0-9a-f]{7,40}|unknown)$/`. Product surface → bumps `SKILLS_VERSION`.
- `pharn/floor/check-provenance.test.mjs` — NEW. Black-box `node --test` suite (subprocess, temp dirs), ported from the dev suite plus the new product-specific pins. A `*.test.*` file → does **not** bump.
- `.dev/floor/check-provenance.test.mjs` — EDIT (append only). Adds the **cross-copy agreement guard**: it reads both checkers and asserts they agree on `TYPE_ENUM`, `CONCEPTS_MIN`/`CONCEPTS_MAX`/`CONCEPT_MAX_LEN`, `CONCEPT_RE`, `DATE_RE` and `REQUIRED_PROVENANCE`, while asserting the two `TARGET_ENUM`s are **deliberately different**. Lives on the dev side because a **product** test must never read `.dev/**` (absent in a user's install). Apparatus + test → does **not** bump.
- `SKILLS_VERSION` — `2.1.0` → `2.2.0`. **Minor**: a newly shipped command + checker; nothing already installed is invalidated.
- `CHANGELOG.md` — one `[Unreleased] / ### Added` entry recording the port, the two de-dev-ification decisions put to the human, the P0 split, the honest P7 trigger, and the `SKILLS_VERSION` bump.
- `CLAUDE.md` — `## Commands`: document `node pharn/floor/check-provenance.mjs <candidate.json> <canon-file.md>` and note the dev/product pair; update the product-command list to include `/pharn-memory-promote` (L1). Repo-meta → does **not** bump.
- `README.md` — the `<!-- CURRENT-STATE:BEGIN/END -->` region, **regenerated** by `npm run docs:generate` (Product commands 9 → 10, Floor checkers 37 → 38). Never hand-edited; declared here because the generator writes it through Bash (L19).

### Deliberately NOT in scope

- `pharn/floor/check-plan-lessons.mjs` — **byte-unchanged**. It already works; this increment gives it something trustworthy to resolve against, it does not change how it resolves. (Stated non-goal in the intent.)
- `.dev/floor/check-provenance.mjs` — the dev checker is a **port source**, not a move: `/pharn-dev-memory-promote` must keep promoting into `.dev/memory-bank/` while PHARN is being built.
- `.claude/commands/pharn-dev-memory-promote.md` — unchanged, same reason.
- `pharn/floor/merge-findings.mjs`, `pharn/floor/check-loop-record.mjs` — carry the pre-existing false `$` claim on the **product** surface. Correcting them is a **separate patch-bump increment** with its own `CHANGELOG` entry (open question Q3); silently fixing them inside this port would smuggle a product-surface byte change past its own justification.
- `.dev/memory-bank/lessons-learned.md` — canon `L14`'s cited witness is likewise wrong. Canon is a **gated** artifact: correcting it is a `/pharn-dev-memory-promote`-class action at a human gate, never a casual edit inside this increment.
- `.dev/features/*/{PLAN,GRILL,REVIEW}.md` — four audit trails repeat the false claim. **Never edited**: they record what was believed at the time, and an audit trail that gets rewritten is not one.
- The four trusted docs (`pharn/CONSTITUTION.md`, `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`, `LIMITS.md`) — hook-denied (fix #2). Nothing here needs an edit to them; if that changes, **halt and ask**.
- `pharn/floor/README.md` — already stale independently of this increment (it describes "three files" against 37 live checkers). This port neither worsens nor repairs it; a separate cleanup.
- `pharn/floor/validate.mjs` `EXCLUDE_SEGMENTS` — deliberately **not** widened to exclude `memory-bank/` (see L10 above).

## Contracts satisfied

- `pharn/ARCHITECTURE.md §5` (**State**) — the **gated promotion with provenance per entry** half, now on the product surface. Cited, not restated (P4).
- `pharn/ARCHITECTURE.md §2` primitive **#3** (enum/regex/presence) — the checker's verdict; and primitive **#1** (pre-write hook) — the fix #7 confinement of the write.
- `THREAT-MODEL.md §2 #3` / `§3` (memory-poisoning row) — the surface this gate answers.
- `pharn/pharn-contracts/finding-shape.md` (fix #1) — the enum-gated vs free-text split the checker's verdict range mirrors.

## Evals to write (P1)

P1 binds **Capabilities** (`role:`-bearing files). A `.claude/commands/*.md` has no `role:` and
`pharn/floor/` is outside `validate.mjs`'s scan (both verified live), so neither new file is a Capability
and neither carries an `evals/` dir — the same standing as every other command and floor checker in this
repo. The equivalent discipline is the `node --test` suite, which `npm test` picks up automatically via
the existing `pharn/**/*.test.mjs` glob:

- `pharn/floor/check-provenance.test.mjs` → the full ported set (GREEN valid; RED per missing/malformed
  provenance field; RED duplicate id; RED out-of-enum target; ★ needle-in-body ignored; first-promotion
  case; non-object candidate; the `type` enum set; the `concepts` shape/bounds/uniqueness set; both-reds
  accumulation; the P0-bound GREEN line), **plus five product-specific pins**:
  - ✧ `TARGET_ENUM` is **exactly** `["memory-bank/lessons-learned.md", "memory-bank/pattern-library.md"]`
    — derived from source, asserting the enum was **not** silently widened to §5's four state files, and
    that no `.dev/`-prefixed path is a member.
  - `commit: "unknown"` is **GREEN**; `commit: ""` and `commit: "UNKNOWN"` are **RED** (the literal is an
    exact member, not a case-insensitive escape).
  - ✦ the trailing-newline concept stays **RED**, and the test asserts the **guard's** `control-char-free`
    message — so it still discriminates guard-present from guard-removed, while its comment states the
    **real** reason (no trim on this path) rather than the false `$` claim.
  - ✧ P4 drift guard: the `/pharn-memory-promote` doc's `TYPE-ENUM` marked region **equals** the
    checker's `TYPE_ENUM` (product doc ↔ product checker; the dev pair keeps its own).
  - the first-promotion case over a **non-existent `memory-bank/`** directory, not merely a
    non-existent file — the user-bootstrap path.
- `.dev/floor/check-provenance.test.mjs` → the cross-copy agreement guard described in `## Files`.

## Guarantee audit (P0)

**FLOOR — what a run actually guarantees:**

- **"A candidate reaching the human gate carries well-shaped provenance, a non-duplicate id, a target in
  the canon enum, an enum-member `type`, and a well-shaped `concepts` list"** → **floor: enum-regex**
  (`pharn/floor/check-provenance.mjs`, primitive #3).
- **"`commit` is a git SHA or the explicit literal `unknown`"** → **floor: enum-regex**
  (`/^([0-9a-f]{7,40}|unknown)$/`, the `check-loop-record.mjs` precedent). An honest absence is a
  **member**, not a hole.
- **"The write lands only in the one declared canon file"** → **floor: hook** (fix #7 —
  `set-writes-scope.cjs --target` + `enforce-writes-scope.cjs`; `memory-bank/**` is outside the
  fail-closed default-safe-set, **measured live this run**: exit 2, "Active scope : (none set …)").
- **"The trusted docs stay unwritable regardless of scope"** → **floor: hook** (fix #2, composes).
- **"The two checker copies agree on everything but their target enum"** → **floor: enum-regex** (the
  dev-side agreement test, string comparison over both sources). Narrow and honest: it pins the
  **constants**, not the behavior.

**ADVISORY / HUMAN — never a guarantee:**

- **"The lesson is true / general / worth canonizing"** → **advisory, human.** The command does not judge
  worth. **"memory-promote promoted it" NEVER means "the lesson is sound."**
- **"The `type`/`concepts` VALUES describe the entry"** → **advisory, human**, ratified only at the
  accept/deny gate. **"Typed `floor`" NEVER means "about the floor"**; any downstream `type`-keyed filter
  is advisory context selection, never a guarantee.
- **"A human approved this entry"** → **advisory, procedural.** No checker can verify a human said yes
  (`LIMITS.md §1d` is the same boundary). The halt is an instruction, backstopped — not replaced — by the
  two floor ops.
- **Two clocks.** The checker's **verdict** is floor; the command's **act** of invoking it is advisory
  orchestration. The unconditional claim is the narrow one: _when the checker runs_, a candidate with a
  non-member `type` or a misshapen `concepts` cannot pass it.
- **Named residual, kept named.** The checker validates the **candidate** at the deterministic-gate step,
  while the entry reaches canon only **after** the human gate. Copy-through of already-validated fields
  into a fixed template **narrows** that gap; it does not close it. Cite **the gate**, not a step number
  (the dev source is internally loose here — its checker header says "Step 6", its command titles Step 5
  "Render"). Related open follow-up: `lesson-tagline-render-check`.
- **"The promoted entry keeps a user's `validate.mjs` GREEN"** → **advisory** (L10): canon sits on the
  scanned surface, so an entry reproducing `rule_id:` + `problem:` without documenting the split trips
  CHECK 5. Documented in the command; not floor-prevented.

**Struck claims** — these will not appear anywhere in the increment:

- ~~"`/pharn-memory-promote` ensures the memory-bank is trustworthy"~~ — it gates **shape** and
  **confinement**; trustworthiness is the human's.
- ~~"JS `$` without `m` matches before a trailing newline"~~ — **false**, measured (below).

## The false trailing-newline claim — measured, and deliberately not carried across

The repo asserts in several places that JS `$` without the `m` flag "matches at end-of-string **or** just
before a single trailing newline". That is Python/Perl behavior. Measured on this tree, at
`caf6e31a909964dda8d6babddd8cb5540eb3d550`:

```text
$ node -e '
  console.log(/^[a-z0-9-]+$/.test("enum-gate\n"));  // .dev/floor/check-provenance.mjs  → asserted TRUE
  console.log(/^P[0-7]$/.test("P2\n"));             // pharn/floor/merge-findings.mjs   → asserted TRUE
  console.log(/^\d+$/.test("2\n"));                 // pharn/floor/check-loop-record.mjs→ asserted TRUE
  console.log(/^\d+$/m.test("2\n"));                // the SAME regex WITH the m flag
  console.log(/^P[0-7]$/i.test("P2\n".trim()));     // merge-findings RULE_ID_OK trims first
'
false
false
false
true
true
```

**The conclusion is right everywhere; the stated reason is wrong everywhere; the real reason is
site-specific.** So this port carries neither the blanket claim nor a blanket denial:

- **`merge-findings.mjs`** — the guard is **load-bearing**, for a reason its comment never states:
  `RULE_ID_OK` **`.trim()`s** before the shape regex, and `/^P[0-7]$/i.test("P2\n".trim())` is `true`.
- **`check-provenance.mjs` `concepts`** — the guard **is redundant today** on control characters: nothing
  on that path trims, and every control char lies outside `[a-z0-9-]`, so `CONCEPT_RE` alone would reject
  them. Its independent contribution is the **length bound** and the **string-type** check.
- **The ported wording** follows `check-loop-record.mjs`, the one site already honest: reachability is
  re-derived **per field**, the guard is **kept regardless** (L14's discipline is to compose, not to
  re-derive per field whether today's parser makes the hole reachable), and the guard is **never claimed
  to be what catches the case**. The `$` sentence preceding it there is the false one — dropped.
- **L14 as a principle is untouched.** Only its cited witness is wrong.

## Trust audit (P2)

- **Input.** The candidate's `title`/`body` originate in `trust: untrusted` input — typically a
  `features/<name>/` finding whose free text inherited the reviewed code's tag (`§8`, fix #1). They are
  **ignored** by the verdict.
- **Verdict range.** Only enum-gated / floor-verifiable fields: `target` ∈ enum, provenance shape, `id`
  set-membership over `## <id>` headings, `type` ∈ `TYPE_ENUM`, `concepts` shape. **No guaranteed
  decision rests on a tainted field.**
- **The laundering vector, and its closure.** `type`/`concepts` promote **model-drafted** values into the
  enum-gated class — exactly what fix #1 exists to stop. Admitted only because neither is free text:
  `type` is exact `.includes` membership in a literal array (no regex at all), and each concept passes a
  control-char guard **composed before** an anchored shape regex. An instruction-looking needle satisfies
  neither grammar → a loud RED, not a trusted-looking value.
- **Propagation.** The body lands in canon as **DATA**; future sessions read canon as untrusted memory
  content (`THREAT-MODEL.md §2 #3`), never as steering.
- **Named residual — a well-shaped but MISLEADING tag.** `concepts: [safe, approved, verified]` passes
  every check. Because these land in **canon**, the window is **permanent** — write-once-influence-
  forever, no rollback signal — unlike a transient finding. Held by the human's read at the gate and by
  the advisory-only status of every `type`-keyed selection downstream; **never** by the floor.
- **New surface this port opens, stated plainly.** Shipping the write side means an **end user's**
  memory-bank becomes reachable by an agent for the first time. The blast radius is bounded by exactly
  the two floor ops (one file, shape-gated) plus the human gate — the same bound the apparatus already
  runs under — but the population exposed to `THREAT-MODEL.md §2 #3` grows from "this repo" to "every
  install that runs the command". That is the honest cost of closing the §5 gap.

## Determinism audit (P5)

- Target resolution (**lesson → `memory-bank/lessons-learned.md`**, **pattern →
  `memory-bank/pattern-library.md`**) is a **membership test** on the invocation, never LLM
  classification; ambiguous → **ask the human**. `feature-catalog.md` / `architecture-context.md` are
  refused: the enum is the **two prescription files**, ported as a narrowing of §5's four — deliberately
  **not** widened.
- The gate branch reads **only** the checker's **exit code**.
- Provenance is assembled deterministically: `commit` from `git rev-parse HEAD` (or the literal
  `unknown`), `date` from today, `feature`/`source` from the increment reference. No field is invented to
  satisfy the checker; an entry whose provenance cannot be truthfully filled is **not promotable**.
- The next id is computed from **live canon** (highest `## L<N>` + 1); the checker independently rejects a
  duplicate.
- Terminal fallback everywhere is **ask the human** — for an ambiguous target, for "no `type` member
  fits", and for the accept/deny decision itself. Never a guess.

## Bootstrapping decision (stated, per the intent's demand that silence is not an option)

A user's repo has **no** `memory-bank/` on first run (this repo has none either — verified live).
**Decision: create the canon file on accept**, with its header preamble, then append the entry.

Rationale: (1) the checker **already** treats a non-existent canon as the empty set — its own comment
calls that "the legitimate first-promotion case" — so refusing would contradict a state the floor already
blesses; (2) `/pharn-plan` passes `memory-bank/lessons-learned.md` to `check-plan-lessons.mjs` and a
project with none is GREEN at `applied_lessons: none`, so nothing downstream breaks either way; (3) the
write is scope-pinned to **exactly** that one path by `--target`, so creating a file is no wider a power
than appending to one; (4) making the user hand-author a file whose format they have not seen invites a
malformed canon — the failure this command exists to prevent. Put to the human as Q2 regardless.

## Open questions — RESOLVED at the plan gate (human, this run)

- **Q1 — Where does the checker live?** → **(a) two independent files.** `pharn/floor/check-provenance.mjs`
  (product) alongside the **unchanged** `.dev/floor/check-provenance.mjs`, plus the **cross-copy agreement
  guard** on the dev side so "drifts silently" becomes "drifts loudly". (b) was declined because the two
  target enums differ, so the enum would have to become a CLI argument — a **caller-supplied membership
  set is a weaker floor primitive than a literal array**. (c) was declined as the largest option: it would
  refactor a working dev checker and its suite mid-port, and its core would have to sit on the product side
  with the apparatus importing across the boundary. If drift is ever observed despite the guard, the named
  follow-up is `provenance-checker-share` — built on a real failure, not speculatively (P7).
- **Q2 — Bootstrapping.** → **Create the canon file on accept**, header preamble first, then the entry.
  Rationale recorded above under `## Bootstrapping decision`.
- **Q3 — The pre-existing product-surface false `$` claims.** → **Recorded as a separate patch-bump
  increment, not touched here.** This port drops the false claim from its **own** new files only, stating
  the real per-site reason instead. The follow-up increment is **`regex-newline-claim-correction`**:
  `pharn/floor/merge-findings.mjs` + `pharn/floor/check-loop-record.mjs` (product bytes → patch bump +
  `CHANGELOG` entry), with canon `L14`'s cited witness corrected through a gated
  `/pharn-dev-memory-promote`. The `.dev/features/*` audit trails and the `CHANGELOG` #114 entry are
  **never** rewritten — both are history.

## Follow-ups recorded (not built here — P7)

- `regex-newline-claim-correction` — Q3 above.
- `provenance-checker-share` — only if the agreement guard ever reports real drift.
- `lesson-tagline-render-check` — the named residual (candidate validated at the gate, entry rendered
  after it); inherited from the dev original, unchanged by this port.
- `product-lessons-index` — the read-side sibling; explicitly **sequenced after** this increment, since
  there is nothing worth indexing until a user can write canon under a gate.
