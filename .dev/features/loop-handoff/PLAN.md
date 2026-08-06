# PLAN — loop-handoff

- spec_content_hash: a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753 # fix #4 (sha256 of pharn/ARCHITECTURE.md, computed this run)
- applied_lessons: [L1, L2, L3, L4, L5, L6, L7, L8, L10, L13, L14, L15, L18, L19]
- increment: give `/pharn-loop`'s existing, already-scoped `features/<name>/LOOP.md` a narrative `## Handoff` section (investigated / learned / next_steps) plus a deterministic envelope, define its shape once in a new `pharn-contracts` contract, and add a shape-only floor checker the command self-runs after every stop.
- layer(s): pharn-contracts (the only `pharn/ARCHITECTURE.md §4` layer touched; the checker is floor tooling and the command is advisory orchestration — neither is a layer)
- constitution_refs: [P0, P2, P3, P4, P5, P6, P7]

## Applied lessons

- L1 — the meta-doc sweep ran: this increment changes facts asserted in `CHANGELOG.md`, `CLAUDE.md`
  (its floor-checker command block), `SKILLS_VERSION`, and the **generated** `## Current state` region of
  root `README.md` (verified live: `Contracts — 4` → 5 and `Floor checkers — 36` → 37), so all four are
  named in `## Files` rather than discovered stale after the build.
- L2 — the honesty travels **with the artifact**: the floor-vs-advisory table lives in
  `pharn/pharn-contracts/loop-record.md` itself (not only in this PLAN), and it may cite only floor ops
  that are **live** — so the contract cites `check-loop-record.mjs` only because this same increment
  builds it, and it cites the fix #7 hook pair, verified live this run in `.claude/settings.json`'s wiring
  via the existing `/pharn-loop` Step 4.
- L3 — making `LOOP.md`'s shape load-bearing forces a re-audit of every existing declaration of it:
  verified live that **zero** `LOOP.md` files exist in this repo (`find . -name LOOP.md` → empty), and the
  design deliberately keeps a **legacy** record readable — Step 1 reads a prior `LOOP.md` tolerantly
  (absent `## Handoff` ⇒ note and continue, never RED), and only the record **just written this run** is
  checked. That containment is what makes the `SKILLS_VERSION` question a real question rather than a
  foregone major (Open question 1).
- L4 — the checker ships an authored `node --test` suite, and the plan states what that buys: the suite
  proves the **check is shaped right**, never that any real run's Handoff is honest. No fixture can
  measure that, so "the tests are green" is scoped in the guarantee audit, not left to read as proof.
- L5 — the two deterministic envelope values (`commit`, `date`) are captured by the **command's Bash**,
  so their trustworthiness is the orchestration's, not the checker's: the checker shape-gates them and is
  explicitly labeled as never resolving the SHA or the clock. A corrupted capture yields a shape-valid
  lie, and the audit says so instead of letting a GREEN read as "this is the right commit".
- L6 — every fact the checker reads comes from a **structured location**: the four envelope values from
  the `---`-fenced frontmatter, the Handoff keys from real markdown **headings**, with fenced blocks
  skipped. A `decision: STOP_GREEN` line in prose or inside a fence is DATA about the record, never a
  declaration — pinned by a dedicated RED test.
- L7 — `/pharn-loop`'s `writes:` stays exactly `["features/<name>/LOOP.md"]`. The increment adds a new
  **`reads:`** entry only; nothing aspirational and no downstream gate's target is declared upstream.
- L8 — the setter resolves one `--target`, so the Handoff is folded **into the existing single output**
  rather than emitted as a sidecar (`HANDOFF.md` / a `.pharn/` side channel). That is the whole reason the
  existing "`/pharn-loop` may write only `LOOP.md`" floor guarantee survives this increment unchanged.
- L10 — root `features/` is **on** `validate.mjs`'s scanned surface (verified live: `EXCLUDE_SEGMENTS`
  excludes `.dev/`, `.claude/commands/`, `pharn/floor/` — not `features/`). So `LOOP.md` and the new
  contract must not trip CHECK 5: any file carrying both `rule_id:` and `problem:` must document the
  enum-gated / free-text split. The contract documents the split by construction; the record template
  carries neither field, and the contract states the constraint so a future edit cannot reintroduce it.
- L13 — this stage formats its own artifact (`prettier` + `markdownlint-cli2` scoped to this PLAN) before
  halting, so the pipeline's own audit trail does not redden a later whole-repo style gate.
- L14 — the control-char guard is the **precondition** to every anchored shape regex in the new checker,
  never a replacement: `/^[0-9a-f]{7,40}$/.test("abc1234\n")` is `true` in JS, so a shape-regex-only
  `commit` check would re-admit the trailing-newline vector. Two dedicated witness tests pin it
  (`commit` and `date`).
- L15 — the checker holds its required-key sets as `Set`s and tests membership with `.has()`; no
  arbitrary key is ever indexed into a plain object with `||` / `??`, so an input naming `toString` or
  `__proto__` cannot resolve to an inherited member and print a quiet pass.
- L18 — the exclusion block below is a real `###` **heading**, not a bold prose intro, so
  `set-writes-scope.cjs --from-plan` terminates the authorized list structurally; the setter's printed
  path count is to be read against this plan's `## Files` count at build Step 0. The same structural
  discipline is why the three Handoff fields are **headings**, not bolded labels — a bold label is prose
  and would make the presence check a prose grep.
- L19 — `npm run docs:generate` writes `README.md`'s generated region through **Bash**, escaping the
  fix #7 writes-scope entirely, so that write is **declared** in `## Files` rather than left to look like
  an undeclared side effect.

## Files

- `pharn/pharn-contracts/loop-record.md` — NEW. Schema-only contract (no `role:`, zero behavior), modeled
  on `ship-record.md`: the object, a field-shape/trust-class table, an explicit IS / IS-NOT section, the
  floor-vs-advisory rule, and the named residual. SoT for `LOOP.md`'s shape — layer `pharn-contracts`.
- `pharn/floor/check-loop-record.mjs` — NEW. Shape-only validator over a written `LOOP.md`. Node stdlib
  (`fs`) only; no network, no child process, no `eval`/import of input. Floor tooling (validate-excluded).
- `pharn/floor/check-loop-record.test.mjs` — NEW. `node --test` suite; auto-collected by `npm test`'s
  `pharn/**/*.test.mjs` glob (verified live in `package.json`).
- `.claude/commands/pharn-loop.md` — EDIT. (a) Step 4 writes the envelope + `## Handoff` on **every** stop
  path (all four terminal decisions, `INCONCLUSIVE` included), setting `decision` by **copying it verbatim
  out of the `check-loop.mjs` JSON captured at Step 3**, never re-typing it (resolved at GATE 1 — see Open
  questions 3); (b) Step 4 runs `check-loop-record.mjs` on
  the record immediately after writing it — a RED means fix the record before ending the turn; (c) add
  `features/<name>/LOOP.md` to `reads:` (absent today, verified live) plus a Step 1 instruction to read a
  prior record and quote its Handoff as untrusted DATA; (d) extend the Guarantee audit and the Trust
  section with the new floor op and the new residual; bump `version: 0.1.0` → `0.2.0`.
- `CHANGELOG.md` — EDIT. One `[Unreleased]` entry carrying the honest split and the `SKILLS_VERSION` call.
- `CLAUDE.md` — EDIT. Add the new checker to the floor-command block (the `check-plan-lessons` /
  `check-provenance` neighbourhood) with its honest one-line scope.
- `SKILLS_VERSION` — EDIT. `2.0.0` → `2.1.0` (minor; resolved at GATE 1 — see Open questions 1).
- `README.md` — EDIT **inside the generated markers only**, by running `npm run docs:generate` (never by
  hand): `Contracts — 4` → 5 and `Floor checkers — 36` → 37.

### Deliberately NOT in scope

- `pharn/floor/check-loop.mjs` and `check-loop.test.mjs` — **byte-unchanged**. The stop decision is not
  touched, and `check-loop-record.mjs` is never one of its inputs.
- `pharn/pharn-contracts/ship-record.md`, `pharn/floor/check-attestation.mjs` — `/pharn-loop` never emits
  a `ship-record.json` and never attests (`pharn-loop.md` "No attestation").
- `pharn/CONSTITUTION.md`, `pharn/ARCHITECTURE.md`, `THREAT-MODEL.md`, `LIMITS.md` — human-only,
  hook-denied (fix #2). `§6`'s stage table has no `loop` row (the loop is a meta-orchestrator, not a spine
  stage), so nothing is invalidated; if a human wants the contract listed there, that is a human edit.
- `.claude/commands/pharn-ship.md`, `pharn-dev-ship.md`, `pharn/floor/check-ship.mjs` — the dev loop and
  the gated product sibling are unchanged. Giving `SHIP.md` the same Handoff is a **follow-up**
  (`ship-handoff`), not this increment: no failure has triggered it (P7).
- `docs/capabilities/**` — verified live that the catalog enumerates only `role:`-bearing files; this
  increment adds none, so those pages do not change.
- The other product commands (`/pharn-spec`, `-plan`, `-grill`, `-build`, `-regress`, `-verify`) and every
  `pharn-dev-*` command.

## Contracts satisfied

- `pharn/pharn-contracts/loop-record.md` — **this increment authors it**; it becomes the SoT the command
  and the checker both conform to and cite (P4 — neither restates its semantics).
- `pharn/pharn-contracts/finding-shape.md` — cited, not restated, for the enum-gated vs tainted-free-text
  split the Handoff fields inherit (fix #1, `pharn/ARCHITECTURE.md §8`).
- `pharn/pharn-contracts/ship-record.md` — cited as the **shape precedent** (contract layout, IS/IS-NOT
  section, floor-vs-advisory rule, residual). No content is copied and no behavior is shared.

## Evals to write (P1)

No `role:`-bearing Capability is added, so P1's `evals/cases` + `evals/expected` requirement does not
bind — the same standing as `check-loop.mjs`, `check-attestation.mjs`, and `check-plan-lessons.mjs`, all
of which are floor tooling under the validate-excluded `pharn/floor/`. The equivalent obligation here is a
`node --test` suite, and it must include the negative cases that make the check real:

- `check-loop-record` → a well-formed record for **each** of the four decisions → GREEN (4 cases).
- `check-loop-record` → `decision: CONTINUE` → RED (a record is written only at a stop, so `CONTINUE` is
  deliberately outside the record enum even though `check-loop.mjs` emits it).
- `check-loop-record` → `decision` absent / lowercase / not in the enum → RED.
- `check-loop-record` → `iterations` `0`, `-1`, `2.5`, `"two"`, absent → RED (5 cases).
- `check-loop-record` → `## Handoff` absent → RED; each of the three subsections absent → RED (4 cases).
- `check-loop-record` → the three fields written as **bold prose** instead of `###` headings → RED
  (the L18 witness: a bold intro must not pass a heading membership test).
- `check-loop-record` → a subsection present but with no non-blank body line → RED (see the tightening
  named under "Decisions taken" below).
- `check-loop-record` → `commit: "abc1234\n"` and `date: "2026-08-05\n"` → RED (the L14 witnesses).
- `check-loop-record` → `commit` uppercase / 6 chars / non-hex; `date` `2026-8-5` / `05-08-2026` → RED.
- `check-loop-record` → `decision:` / `### learned` appearing only in body prose or inside a fenced block,
  with no frontmatter declaration → RED (the L6 witness).
- `check-loop-record` → a record naming `toString` / `__proto__` where a key is expected → RED, never a
  quiet pass (the L15 witness).
- `check-loop-record` → missing / unreadable file, and no argv → RED with the usage line (fail-closed).
- `check-loop-record` → extra frontmatter keys and extra body sections alongside a valid record → GREEN
  (the checker gates named fields; it is not a closed-key whitelist — stated in the contract).

## Guarantee audit (P0)

- "After a stop, the **just-written** `LOOP.md` is shape-valid — `decision` ∈ the 4-member record enum,
  `iterations` a positive integer, `commit` matching `^[0-9a-f]{7,40}$`, `date` matching
  `^\d{4}-\d{2}-\d{2}$` (each anchored regex **composed after** a control-char guard), and `## Handoff`
  present with its three named `###` subsections" → **FLOOR: enum / regex + heading membership**
  (`pharn/ARCHITECTURE.md §2` primitive #3), owned by `check-loop-record.mjs`, tested.
- "`/pharn-loop` **runs** the checker after writing the record" → **ADVISORY** orchestration. Nothing on
  the floor forces the command's prose to invoke it — the same two clocks as every other stage.
- "`/pharn-loop` may write only `features/<name>/LOOP.md`" → **FLOOR: hook (fix #7)**, **unchanged and
  inherited**. This increment adds **no** new write target, so the existing guarantee stays true verbatim.
- "The stop decision is unaffected" → **STRUCTURAL.** `check-loop.mjs` is byte-unchanged, and its input
  signature (`{verify-report.json, regression-report.json, iter, cap}`) has no record parameter — the new
  checker **cannot** feed it. The record is validated **after** the stop decision already exists.
- "The record's `decision` is the one `check-loop.mjs` actually emitted" → **ADVISORY.** The checker gates
  enum **membership**, never **agreement**: a mis-transcribed but in-enum decision passes. Step 4's
  copy-through (resolved at GATE 1) **narrows** this gap — the value is lifted verbatim out of the already-
  captured checker JSON — but does **not** close it, because the copy is itself advisory command prose.
  Follow-up: `loop-record-decision-agree`.
- "`commit` is the SHA `HEAD` resolved to, and `date` is today" → **ADVISORY.** The checker shape-gates
  both and never runs `git`, never reads a clock, never spawns a process (L5: a corrupted Bash capture
  yields a shape-valid lie). "Shape-valid" never means "true".
- "The Handoff is **accurate** — that `investigated` / `learned` / `next_steps` describe the run
  truthfully and usefully" → **ADVISORY**, and unreachable by any checker. **"A record was written" never
  reads as "continuity was achieved."**
- "The **next** run uses the Handoff" → **ADVISORY.** Step 1's read is command prose; `reads:` has teeth
  only on the write side (fix #7, `THREAT-MODEL.md §4.7`), and `next_steps` gates nothing by design.
- "The `node --test` suite proves the checker is correct" → **ADVISORY as to live behavior** (L4). It
  proves the check is **shaped** right; no fixture can measure whether a real run's Handoff is honest.
- **Net:** the increment adds **exactly one** new floor primitive — `check-loop-record.mjs`, an
  enum/regex/membership shape gate over one artifact — and **zero** new authority: no new write target, no
  new input to the stop core, no new egress. Writing "`/pharn-loop` now carries synthesis forward" or
  "the loop preserves context" is the P0 disease — **struck**; what is true is that the loop is now
  **structurally forced to leave a shape-valid record**, and nothing more.

## Trust audit (P2)

- **Input: `features/<name>/LOOP.md`.** Untrusted DATA in both directions — it is authored by the model
  over untrusted sub-stage output, and on re-read it is arbitrary on-disk content anyone may have edited.
- **The three Handoff fields are `trust: untrusted` free text** and inherit the taint of everything the
  run read (the user's description, reviewed code, stage prose). They render as quoted DATA, exactly like
  `problem` / `evidence` in `finding-shape.md` — never injected downstream as directives.
- **The checker's verdict is provably taint-independent.** It ranges only over four enum/regex-gated
  scalars and over heading **membership**; it asserts the three sections **exist**, and never reads their
  bodies' meaning. No guaranteed decision rests on a tainted field (`pharn/ARCHITECTURE.md §8`).
- **The read side (Step 1) gates nothing.** A prior Handoff is quoted for the human and for planning
  context; `next_steps` informs, never branches (P5). Instruction-looking content inside it is an attack
  to **quote and report**, never to follow — and the command must say so in those terms.
- **New instance of the named residual (`LIMITS.md §2`, `THREAT-MODEL.md §5`) — stated loudly, not
  hidden.** This increment deliberately creates a **session-to-session channel made of free text**: a
  future LLM stage reads `next_steps` written by a past one. Bounded (nothing gates on it, the checker
  never reads it, it is feature-scoped and quoted) but **not zeroed** — this is the one place the
  increment makes the residual bigger, and the contract must say so in its own residual section.
- **It is deliberately NOT memory-bank canon** (`THREAT-MODEL.md §2.3`, the write-once-influence-forever
  vector). The Handoff is scoped to one feature's record, is never promoted, and passes through no
  `/pharn-dev-memory-promote` gate — so it opens no path into canon.
- **The checker itself:** stdlib `fs` only; input is read as text and used only as string operands —
  never `eval`'d, executed, spawned, imported, or sent anywhere. No network, no child process.

## Determinism audit (P5)

- Every branch is a membership test: enum `.has()`, an anchored regex over a control-char-guarded string,
  a heading-set membership, or an integer test. **No LLM classification anywhere in the checker.**
- **Fail-closed:** unreadable/absent file, absent frontmatter, an absent or malformed field, or a missing
  heading is a **RED** — never a silent pass, never a default.
- The command's only branch after the write is the checker's **exit code**.
- **Terminal fallback is the human:** a RED means fix the record and re-run; a record that cannot be made
  valid is handed to the human, never waved through and never skipped.
- **Legacy tolerance is also a membership test, not a judgment:** at Step 1, `## Handoff` present ⇒ quote
  it; absent ⇒ note it and continue. Reading a pre-existing record is never a gate (L3).

## Decisions taken here (correctable at the gate, not silent)

- **Each of the three Handoff subsections must carry ≥1 non-blank body line** — a heading with an empty
  body is RED. This is a deliberate tightening beyond bare key-presence: an empty section is presence
  without content, and admitting it would let the record satisfy the floor while saying nothing. It stays
  **shape** only — that the line says anything true or useful is advisory and unreachable.
- **`CONTINUE` is excluded from the record's `decision` enum** (`check-loop.mjs:42` emits it) because a
  record is written only at a **stop**. The record enum is therefore
  `{STOP_GREEN, STOP_CAP, STOP_TERMINAL, INCONCLUSIVE}`, quoted verbatim from `check-loop.mjs:38-43`.
- **The observations-log boundary is prose, not machinery (P7).** Verified live: **no** observations log
  exists anywhere in this repo. The contract therefore notes only that `learned` **may** cite an external
  entry id instead of restating it, and defines, requires, and enforces **nothing** about such ids.
- **The record is not a closed-key object.** Unlike `ship-record.md`'s attestation block (exactly three
  keys, to stop field smuggling), `LOOP.md` is a human-facing roll-up carrying prose, so extra keys and
  sections are ignored rather than RED. Nothing downstream reads the record as a gate, so there is no
  smuggling surface to close — stated in the contract rather than left implicit.

## Grill resolutions (folded in after `/pharn-dev-grill`; `## Files` unchanged)

`/pharn-dev-grill` raised 9 advisory concerns (`GRILL.md`). All nine are folded in here; none needed a
new file, so `## Files` is byte-unchanged and the approved scope holds.

- **G1 (P7, blocking) — `git rev-parse HEAD` has no failure path.** RESOLVED: the `commit` grammar
  admits an explicit honest-absence sentinel — `^([0-9a-f]{7,40}|unknown)$` — and the command writes
  `unknown` when the capture fails (no git repo, unborn HEAD, non-zero exit), **never** a fabricated
  SHA and never an empty value. This follows `ship-record.md`'s established rule that **state is always
  shown** (`· unattested` rather than a silent omission): an absent commit renders as absent. Tests: a
  GREEN case for `unknown`, and RED cases for empty-string and whitespace-only.
- **G2 (P0, important) — the headline FLOOR claim is composite.** RESOLVED: the guarantee audit's first
  bullet is re-scoped to _the checker's verdict **over a record handed to it**_ is FLOOR; that a record
  is ever handed to it is ADVISORY orchestration — the phrasing `pharn-loop.md:204-206` already uses for
  `check-loop.mjs` ("the decision **given** the inputs"). The contract carries the same wording (L2).
- **G3 (P4, important) — nothing pins the command's template to the checker.** RESOLVED: the suite gains
  an agreement test in the `#114` `TYPE-ENUM` mould — it extracts the record template from
  `pharn/pharn-contracts/loop-record.md` and asserts `check-loop-record.mjs` returns GREEN on it, so the
  contract, the checker, and the command's copy cannot silently drift apart.
- **G4 (P2, blocking) — free text can forge a `###` heading.** RESOLVED, and the "provably
  taint-independent" claim in the Trust audit is **corrected**: untrusted body text shares a namespace
  with the structural markers, so membership is made unforgeable by structure — the three subsections
  must appear **in fixed order**, must be the **only** `###` headings under `## Handoff`, and a
  **duplicate is a RED** (a malformed record, never a satisfied one). Refuse, never sanitize (the
  lessons-index precedent). Tests: a `learned` body containing the literal line `### next_steps` → RED;
  a duplicate `### learned` → RED; out-of-order subsections → RED.
- **G5 (P3, important) — cross-tree import risk.** RESOLVED: `check-loop-record.mjs` **re-implements**
  the frontmatter regex, the shape regexes, and the control-char guard **in-file** — no import from
  `.dev/floor/**`, which is stripped at packaging ("ship root minus `.dev/`") and would be green here
  and broken in every install. Stated in the file's header comment, as `check-plan-lessons.mjs:55-56`
  does.
- **G6 (P5, important) — unbounded record repair.** RESOLVED: Step 4 permits **at most one** re-write
  attempt after a RED; a second RED presents the checker output and hands to the human. Labeled
  **ADVISORY** (command prose, not a floor counter — the same honest framing as `--iter` per
  `LIMITS.md §1d`), never sold as a bound the floor enforces.
- **G7 (P7, important) — no honest trigger.** RESOLVED, stated plainly: **this increment was identified
  at design time; no dogfood or eval failure forced it.** The motivating observation — a run's synthesis
  dies with the session while its artifacts persist — is real and is reproducible by inspection, but it
  is **not** a recorded `/pharn-loop` failure. Same standing as L8, `#114`, and `#115`.
- **G8 (P4, minor) — the enum is cited to a comment block.** RESOLVED: the contract cites the values
  `check-loop.mjs` **emits** as `.decision` (the same JSON the GATE-1 copy-through consumes), not the
  explanatory comment at `check-loop.mjs:38-43`, so the citation and the runtime path are one thing.
- **G9 (P2, important) — `README.md` scope grant is wider than the need.** RESOLVED: the declaration
  stays (L19 — declare a Bash write, never hide it), paired with an explicit build instruction that the
  **only** permitted change to `README.md` is `npm run docs:generate`'s output, re-verified with
  `npm run docs:check`. Labeled a **discipline** bound, not a floor one: fix #7 cannot express
  "markers only", so the granted Write scope is declared-but-unused.
- **G10 (P7, minor) — write-side / read-side bundling.** WEIGHED, not split: the read side is one
  `reads:` entry plus a short Step-1 instruction, and a write-only increment would ship a record nothing
  consumes. Recorded as the human's call, taken here rather than left implicit.

## Open questions (HALT) — RESOLVED at GATE 1 (human, 2026-08-05); none remain

1. **`SKILLS_VERSION` bump size** → **RESOLVED: minor, `2.0.0` → `2.1.0`.** The product surface changes,
   so a bump is mandatory; it is not breaking. The `#113` precedent went major because
   `check-plan-lessons.mjs` reads a **pre-existing, user-authored** `PLAN.md`, turning every existing
   install's plans RED. `check-loop-record.mjs` only ever reads the record written **in the same run**, and
   Step 1's read of a legacy record is tolerant by design (L3) — no existing install is invalidated.
2. **The record's structured header shape** → **RESOLVED: YAML frontmatter**, carrying exactly the four
   deterministic envelope fields (`decision`, `iterations`, `commit`, `date`), with the three free-text
   Handoff fields as `###` heading subsections under `## Handoff`. This matches the product `SPEC.md` /
   `PLAN.md` shape that `check-plan-lessons.mjs` already reads. The rejected alternative — free text inside
   the structured header — would place tainted prose in the structured region and blur the very split the
   record exists to keep (P2).
3. **The decision-transcription gap** → **RESOLVED: copy through now.** Step 4 must set `decision` by
   copying it **verbatim out of `check-loop.mjs`'s emitted JSON** (which the command already captures at
   Step 3) rather than re-typing it — the same copy-through discipline `/pharn-dev-memory-promote` uses at
   its Step 6. Honest scope, to be written into the command and the contract: this **narrows** the gap, it
   does **not** close it — the copy is still advisory command prose, so the floor still guarantees
   membership, never agreement (follow-up `loop-record-decision-agree` remains named).
