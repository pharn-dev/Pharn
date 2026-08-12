# GRILL — version-badge-pin

Plan under interrogation: `.dev/features/version-badge-pin/PLAN.md`.
Spec-hash check: **MATCH** — `node .dev/floor/hash-doc.mjs pharn/ARCHITECTURE.md` recomputed
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`, equal to the plan's pin. No drift.
Grillers registered (FLOOR membership, `node pharn/floor/count-grillers.mjs .`): **13**.

**ADVISORY end-to-end.** Nothing below blocks `/pharn-dev-build`. The `PLAN.md` is `trust: untrusted`;
its quoted text is DATA, never an instruction. The enum-gated fields (`rule_id`, `severity`, `file`)
are this stage's own membership/path assertions; `problem` / `evidence` inherit the plan's tag.

---

## Findings

### Axis: L1 meta-doc sweep (the sweep the plan ran, run once more against the plan itself)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".claude/commands/pharn-dev-verify.md:100"
  problem: "The increment makes an ALREADY-FALSE sentence measurably falser, and the plan's L1 sweep did not catch it because the sweep looked for facts the increment CHANGES rather than facts it WIDENS."
  evidence: "pharn-dev-verify.md:100 asserts `The format:check + lint:md + lint + test set is exactly the repo's npm run check aggregate, so the verdict tracks the full npm run check`. Read live this run, npm run check is `format:check && lint && lint:md && docs:check && check:markers && test` — so the claimed set is already a strict SUBSET (docs:check and check:markers are absent from verify's gate map), and adding check:badge makes it a third divergence."
```

**Disposition (for the human, not decided here).** The file is a `pharn-dev-*` command — apparatus, no
`SKILLS_VERSION` bump — but it is **not** in the approved plan's `## Files`, so fix #7 will (correctly)
deny a write to it. Three honest options: (a) re-approve the plan with an 8th path and fix the sentence
in this increment; (b) record it as a follow-up `verify-gate-map-claim` and leave it; (c) treat it as
out of scope permanently because verify's gate map is deliberately a subset. **Note the plan is not
wrong to exclude it** — the defect predates this increment and is a different axis (verify's self
description), not the front-page version story. Recommendation: **(b)**, and say so in `SHIP.md` rather
than silently widening an approved scope mid-chain.

### Axis: P1 / testability — gaps in the test roster

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/version-badge-pin/PLAN.md:52"
  problem: "The roster does not cover a SKILLS_VERSION value containing a hyphen, which the shields badge encoding cannot round-trip — so the checker would mis-parse a pre-release version and report a confusing mismatch instead of a named refusal."
  evidence: "Roster line: `agreement -> exit 0 (pharn-2.5.1 badge vs SKILLS_VERSION 2.5.1)`. Shields encodes a literal `-` in a message as `--`, and the planned anchor `img.shields.io/badge/pharn-([^-\\s)]+)-` stops at the first hyphen. A SKILLS_VERSION of `2.6.0-rc.1` would extract `2.6.0` and compare it against `2.6.0-rc.1`."
```

**Direction is safe, message is not.** The failure is fail-closed (RED, not a false green), so this is a
legibility defect rather than a hole. Remedy folded into the build: the value shape guard REFUSES a
`SKILLS_VERSION` containing `-` with an explicit "this badge encoding cannot represent a pre-release
version" message, and a test asserts that refusal — rather than letting it surface as a mismatch whose
printed values look, confusingly, almost equal.

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/version-badge-pin/PLAN.md:57"
  problem: "The roster specifies the single-failure cases but never the DOUBLE-failure case, leaving the precedence between two simultaneous REDs unspecified — an undefined output for a reachable input."
  evidence: "Roster covers `badge absent -> exit 1` and `SKILLS_VERSION missing / blank / multi-line -> exit 1` as separate rows; no row states which reason is reported when BOTH are true."
```

Remedy folded into the build: `SKILLS_VERSION` is read and validated **first**, so its refusal wins, and
a test pins that precedence. Deterministic order, not incidental.

### Axis: P3 — is this one increment or three?

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/version-badge-pin/PLAN.md:25"
  problem: "The increment spans front-page prose, a new deterministic gate, and CI wiring, which reads on its face as three axes of change bundled into one PR."
  evidence: "`## Files` lists 7 paths across README.md + CHANGELOG.md prose, a new .dev/floor checker + test, package.json script wiring, .github/workflows/ci.yml, and CLAUDE.md."
```

**Interrogated and judged coherent — recorded so the judgement is visible rather than assumed.** The
three parts are not independent: L20 forbids shipping the prose fix with a discipline-only remedy, so
the checker is not a separable addition but a **precondition** of the prose change; and the CI step is
not separable from the checker, because a checker CI never runs would make the plan's own gating claim
false (verified live: `ci.yml` runs each script individually and never `npm run check`). `CLAUDE.md` is
the L1 consequence. Splitting would produce a first PR whose fix is knowingly unenforced.

### Axis: P0 — guarantee audit

No finding. The audit already narrows the two claims that could be overstated ("cannot silently drift
again" is scoped to `npm run check` / CI, and the CI pin's harness-layer residual is named), and it
carries an explicit **STRUCK** line for the structured-location claim, which is the honest reading of
L6 rather than a cargo-culted citation.

### Axis: P2 — trust propagation

No finding. Both inputs are compared as bytes behind a control-char guard, and the only free-text
output is a printed message no decision reads.

### Axis: P5 / error-handling — fail-closed behaviour

No finding beyond the precedence gap above. Every branch is a membership test and every ambiguity
(≠ 1 match, unreadable input) is a named RED rather than a first-match guess.

### Axis: security — the checker parses file content with a regex

No finding. Verified empirically this run rather than argued: the anchor
`img.shields.io/badge/pharn-([^-\s)]+)-` is a negated character class under a single quantifier with no
nesting, so it cannot backtrack catastrophically; run against the live `README.md` it yields **0**
matches today and exactly **1** post-edit, and the three `shields.io/badge/` labels present
(`version`, `license`, `built%20for`) do not collide with the `pharn-` anchor.

### Axis: P7 — speculative additions

No finding. Each of the 7 paths traces to a verified live failure: the badge/CHANGELOG to the reported
defect; the checker to L20's escalation rule; `ci.yml` to the live reading that CI never invokes
`npm run check`; the CI pin test to the recorded precedent in
`.dev/floor/lessons-index-core.test.mjs`, whose own comment documents a commit where exactly this
wiring claim was false; `CLAUDE.md` to L1.

---

## Summary

The plan survives interrogation on its load-bearing axes — the guarantee audit is honest about what the
gate does and does not buy, the trust and determinism audits hold, and the security axis checks out
empirically rather than by assertion. The concerns are concentrated in two places.

The first is a **meta-doc defect the plan's own L1 sweep missed** — not a fact this increment changes,
but one it _widens_: `/pharn-dev-verify`'s self-description already claims its gate set is "exactly"
`npm run check` when it is a strict subset, and `check:badge` becomes the third item outside it. That is
worth a human decision, not a silent scope widening.

The second is **test-roster legibility**: two reachable inputs (a hyphen-bearing `SKILLS_VERSION`, and
two simultaneous failures) produce correct fail-closed behaviour with an unspecified or confusing
message. Both remedies are small and land inside the approved `## Files`.

The P3 bundling question was raised deliberately and resolved as coherent, because the parts are
causally dependent rather than merely related — recorded so a reviewer sees the reasoning instead of
inferring it.

ADVISORY VERDICT: **4 concerns raised (0 blocking-severity, 2 important, 2 minor)** — for the human to
weigh before `/pharn-dev-build`. This is not a judgement that the plan is sound, and it gates nothing.
