# PLAN — ship-attestation (named-human "read the record" attestation)

- spec_content_hash: 11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969 # fix #4 — sha256(pharn/ARCHITECTURE.md)
- increment: Add an OPTIONAL, content-bound, named-human "read the record" attestation to the terminal `/pharn-ship`, rendered as an honest `· attested by <name>` / `· unattested` clause — floor = attestation-block shape (enum/regex) + `record_hash` recompute (content-hash); everything else (that a real human supplied `by`; comprehension; the base seal/merge decision) stays ADVISORY / the human's.
- layer(s): pharn-contracts (new contract) + product floor (`pharn/floor/`) + product command surface (`.claude/commands/`, advisory) + root config/docs # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P2, P4, P5, P7] # P6 governs this plan; P1 is N/A (no new Capability — see Evals)

## Design decisions (locked with the human at GATE-0 discovery)

1. **Annotation, not self-seal (Q1).** `/pharn-ship` still does NOT self-issue `PHARN ✓ reviewed` — that base
   seal + the merge/fix/abandon decision remain the human's GATE-2 call (unchanged; P0 preserved). This
   increment adds only the **attestation clause** (`· attested by <name>` when present ∧ hash-valid, else
   `· unattested`) as an honest annotation on the record. The command never certifies quality.
2. **New minimal contract (Q2).** The ship-record shape is introduced as a new `pharn-contracts` schema —
   none exists today (contracts are only `eval-format`, `finding-shape`, `seam-config`).
3. **No ARCHITECTURE change (Q3).** ARCHITECTURE.md is human-only (hook-denied); this increment is scoped to
   need **zero** ARCHITECTURE semantic edits. The one §6 naming note (`ship-report` vs the concrete
   `ship-record.json`) is **surfaced** under Open Questions for a human — never agent-edited.
4. **Loop autonomy by default (Q4).** `ship.requireAttestation` defaults to `false` → attestation absent →
   ship **proceeds** and renders `· unattested`, **never waiting on a human**. This holds wherever ship is
   reached. `true` is an explicit human opt-in that trades autonomy for a halt-and-ask. (Doubly safe today:
   `pharn-loop` structurally ends at `/pharn-verify` and cannot reach `/pharn-ship` at all.)
5. **The ship-record is a machine artifact `features/<name>/ship-record.json`** emitted by `/pharn-ship`
   alongside the human-facing `SHIP.md` — mirroring the `regression-report.json` + `REGRESSION.md` /
   `verify-report.json` + `VERIFY.md` pattern (report.json for the floor checker, `.md` for the human). Chosen
   over inlining in `SHIP.md` because `record_hash` needs a deterministic serialization to hash. This is a
   **runtime** output (declared in the command's `writes:`), NOT a source file this build writes — so it is
   NOT in `## Files`.

## Files

- `pharn/pharn-contracts/ship-record.md` — NEW — the ship-record contract: the record shape + the OPTIONAL
  `attestation: { by, at, record_hash }` block, with the floor-vs-advisory split spelled out and the
  `record_hash` (sha256 over the record EXCLUDING the attestation block) content-hash semantics defined.
  Schema only, zero behavior, NO `role:` (not a Capability — mirrors `finding-shape.md`). — layer pharn-contracts (L-1)
- `pharn/floor/check-attestation.mjs` — NEW — the deterministic attestation verdict (the one new floor
  primitive): reads a `ship-record.json`, and (a) shape-checks any `attestation` block — `by` non-empty
  string, `at` ISO-8601 regex, `record_hash` `^[0-9a-f]{64}$` — and (b) **recomputes** `record_hash` over the
  canonical serialization of the record with the `attestation` key removed, comparing. Verdict enum
  `attested | unattested | stale | malformed` on stdout JSON; fail-closed; stdlib-only; Node 24; mirrors the
  `count-grillers.mjs` structure (walk/parse/enum, no content-grep). — layer product floor
- `pharn/floor/check-attestation.test.mjs` — NEW — `node --test` suite; ≥90% line coverage via
  `node --test --experimental-test-coverage` (repo convention). Covers: absent block → `unattested` (exit 0);
  valid block → `attested`; edited-record-after-attestation → `stale`; bad `by`/`at`/`record_hash` shapes →
  `malformed`; missing/unparseable file → fail-closed error. — layer product floor
- `.claude/commands/pharn-ship.md` — MODIFY — add the attestation step (after `SHIP.md`, before the GATE-2
  hand-off): read `ship.requireAttestation` from `pharn.config.json` (default `false` on absent/non-`true`);
  **forbid the agent from self-filling `by`** and elicit it via an **interactive question** (the seam-resolver
  terminal-fallback: ask, never guess); the tool stamps `at` and computes `record_hash`; emit
  `features/<name>/ship-record.json`; run `check-attestation.mjs` and render the `· attested by <name>` /
  `· unattested` clause into `SHIP.md`; when `requireAttestation: true` ∧ verdict `unattested`, **halt-and-ask**
  until a human attests. Update frontmatter `reads:` (+ `pharn.config.json`, `pharn/pharn-contracts/ship-record.md`,
  `pharn/floor/check-attestation.mjs`) and `writes:` (+ `features/<name>/ship-record.json`). Bump command
  `version` `0.1.0 → 0.2.0`. — product command surface (EXCLUDED from `validate.mjs`)
- `pharn.config.json` — MODIFY — add top-level `"ship": { "requireAttestation": false }`. (`check-config
validate`/`agreement` read only `models.stages`, so this stays GREEN — verified at build.) — root config
- `CHANGELOG.md` — MODIFY — a `## [Unreleased] / ### Added` entry for ship-attestation. — root docs
- `SKILLS_VERSION` — MODIFY (PROPOSED, pending Open Question 1) — bump `1.0.0 → 1.1.0` (additive shipped-surface
  feature; SemVer minor). — root

Note (known lesson `[[inventory-json-stale-not-gated]]`): do NOT regenerate `inventory.json` in this PR — it is
stale and not CI-gated; the only gate is `npm run check`.

## Contracts satisfied

- `pharn/pharn-contracts/ship-record.md` (NEW, created here) — the SoT for the ship-record + attestation shape.
  `check-attestation.mjs` and `.claude/commands/pharn-ship.md` **cite** it; they do not restate its semantics (P4).
- `pharn/pharn-contracts/finding-shape.md` (cited, not restated — P4) — the **pattern** this reuses: the
  enum-gated/floor-verifiable vs untrusted/advisory split. Attestation's analog: `at` + `record_hash` are
  floor-verifiable (regex + content-hash); `by`'s _value_ is shape-gated (non-empty) but its _truth_ (a real
  named human) is advisory — exactly as `severity`'s value is enum-gated but its _assignment_ is advisory (fix #3).

## Evals to write (P1)

- **None — and that is correct, not a gap.** P1 requires evals for every **Capability** (a `.md` with a
  `role:` discriminator) and every `enforces` `rule_id`. This increment adds **zero** Capabilities: a
  `pharn-contracts` schema (`ship-record.md`, no `role:`, like `finding-shape.md`) and a floor script
  (`check-attestation.mjs`, not LLM-invoked) are not Capabilities. The floor script ships **unit tests +
  ≥90% coverage** (repo convention), which is the correct regression surface for a deterministic checker —
  evals are for LLM-invoked capabilities. `validate.mjs` will not demand evals for either file.

## Guarantee audit (P0) — the heart of this increment

- **"The attestation is bound to the exact record content"** → **FLOOR: content-hash.** `record_hash` is
  recomputed over the record minus its `attestation` block; a post-attestation edit diverges the hash and is
  **detectable, not silent** — the same mechanism/pattern as `spec_content_hash` (fix #4, §5/§6).
- **"The attestation block is well-formed"** (`by` non-empty; `at` ISO-8601; `record_hash` 64-hex) →
  **FLOOR: enum/regex shape check** (`check-attestation.mjs`).
- **"The seal renders the attestation STATE honestly"** (attested-by-name-and-valid, or unattested — state is
  ALWAYS shown; a silent omission would recreate the disease) → the **verdict** is FLOOR (computed by
  `check-attestation.mjs` from shape + hash); the command **rendering** that verdict into `SHIP.md` is
  **ADVISORY** orchestration (command prose honoring the verdict) — labeled, not oversold.
- **"A named HUMAN — not the agent — supplied `by`"** → **ADVISORY.** The pipeline **cannot prove** who typed
  it. The command **forbids** agent self-fill and **elicits interactively** (discipline). Git commit
  authorship is **corroborating context only, never floor**. Stated in the contract + command prose (P0/P2).
- **"Attestation ≠ comprehension"** → **explicitly NOT a guarantee.** The floor verifies a named human
  **attested to having read** record X (content-bound) — **never** that they understood it or that the
  feature is good. Claiming to ensure comprehension is "the disease at the heart of the product" (P0); this
  increment cites P0, it does not claim it.
- **"`requireAttestation` gates ship"** → the config **read** (`=== true`) is a **deterministic boolean
  membership test (P5)**; the command **halting** on it is **ADVISORY** orchestration. No new primitive here.
- **"The loop stays autonomous"** → **STRUCTURAL/ADVISORY** (default `false` → proceed unattested → never
  waits; + loop cannot reach ship). **NOT** a floor guarantee — the floor does not _force_ the command to
  honor the default; it only validates config shape + attestation. Labeled honestly.
- **Base `PHARN ✓ reviewed` seal + merge decision** → **UNCHANGED — the human's GATE-2 call.** `/pharn-ship`
  still never self-issues it (P0 stance preserved).
- **Net:** exactly **one** new floor primitive — `pharn/floor/check-attestation.mjs` (shape + content-hash),
  justified by a real need (P7): 2.0's honest "who-read-it" unit. Everything else is advisory or structural,
  labeled as such.

## Trust audit (P2)

- **`by` (human-supplied attestation handle)** is untrusted free-text DATA: shape-checked non-empty, rendered
  **quoted** in the seal clause, **never executed** as an instruction and **never** the sole input to a
  guaranteed gate (a non-empty `by` certifies nothing about quality). The **agent is forbidden to fabricate
  it** — untrusted identity must come from a human (P2, constraint #4).
- **The rest of the ship-record** inherits the sub-stages' trust: the `verdicts` are floor-verifiable enums;
  any free-text roll-up prose stays untrusted (as today). `record_hash` covers the whole record
  deterministically, so a tainted free-text field **cannot flip** the hash verdict (it changes the hash,
  which fails closed to `stale`, never launders into a "valid" attestation).
- No new egress; no new untrusted ingestion path beyond the human's own `by`/attestation input.

## Determinism audit (P5)

- `requireAttestation` branch = **boolean membership test** (`config.ship?.requireAttestation === true`), not
  LLM classification. Absent/malformed → `false` (default-autonomous; the `unattested` state is visible, so
  this is honest, not a hidden hole).
- The attestation verdict = **deterministic shape + content-hash** in `check-attestation.mjs` (no LLM).
- **Terminal fallback** when `requireAttestation: true` ∧ no attestation: **ASK the human** (interactive),
  never guess or self-fill — the seam-resolver terminal-fallback pattern.

## Open questions (HALT)

1. **SKILLS_VERSION bump policy.** `SKILLS_VERSION` is `1.0.0`, but CLAUDE.md defines **no** bump rule
   (the feature says "per CLAUDE.md rules" — that rule is absent). I **propose** a SemVer-minor bump
   `1.0.0 → 1.1.0` (this adds user-facing behavior to a shipped surface, `/pharn-ship`). Confirm the bump —
   or is SKILLS_VERSION out of scope for a command-behavior change (leave at `1.0.0`)?
2. **ARCHITECTURE §6 naming reconciliation (human-only; surfaced, never agent-edited).** §6 names the ship
   artifact `ship-report` (= decision + `PHARN ✓ reviewed` seal); this increment introduces the concrete
   `ship-record.json` + attestation without changing §6's semantics. Should a human later align §6's naming
   (`ship-report` ⇄ `ship-record`) and note the optional attestation? This is a doc-reconciliation for a
   human — the agent will not touch ARCHITECTURE.md.
3. **Confirm the machine-artifact shape (decision 5).** `/pharn-ship` will emit `features/<name>/ship-record.json`
   (the hashable record) beside `SHIP.md` — mirroring regress/verify's report.json + `.md`. OK, versus
   embedding a fenced attestation block inside `SHIP.md`? (JSON chosen for deterministic hashing.)
