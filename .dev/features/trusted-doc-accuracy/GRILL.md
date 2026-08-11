# GRILL — trusted-doc-accuracy (F7)

Plan under interrogation: `.dev/features/trusted-doc-accuracy/PLAN.md` (`trust: untrusted`).
Spec-hash check: `sha256(pharn/ARCHITECTURE.md)` = `a1c243ea…21753` — **matches** the plan's
`spec_content_hash`; no drift. (Content-hash is floor-grade; here it only **surfaces** — the block on
drift is `/pharn-dev-build`'s gate, fix #4.)
Griller membership (FLOOR, `pharn/floor/count-grillers.mjs`): **13 registered**.

---

## Findings — inline axes (Step 2)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/trusted-doc-accuracy/PLAN.md:134"
  problem: "The replacement marker makes a forward-looking scheduling promise that nothing enforces, so the increment may be trading an overclaim about the PRESENT for an unfalsifiable claim about the FUTURE."
  evidence: "Marker: `_(specified; ships with the guarded surface)_`"

- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/trusted-doc-accuracy/PLAN.md:62"
  problem: "Three primitives are deferred as 'trigger-gated (P7)' but the plan never states WHAT the trigger is or WHERE it is recorded, so the marker becomes a permanent parking spot rather than a labeled limit with a reopen condition."
  evidence: "`pre-egress` hook, the archetype manifest, or `/pharn-estimate` is trigger-gated (P7) and out of scope"

- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/trusted-doc-accuracy/PLAN.md:205"
  problem: "The Q4 deferral ships a KNOWN-FALSE backstop claim inside the very increment whose stated purpose is removing false claims — after F7, LIMITS.md:29 still asserts a live pre-write backstop for a kind-conditioned restriction that no live check enforces."
  evidence: "F7's marker makes `:29` less wrong while it still claims a live `pre-write` backstop for a restriction no check enforces."

- type: FINDING
  rule_id: "P6"
  severity: blocking
  file: ".dev/features/trusted-doc-accuracy/PLAN.md:139"
  problem: "Ten edits are applied with `sed`, whose substitution silently no-ops when a pattern fails to match, and the plan declares no post-edit verification step — so a partially-applied patch set would pass unnoticed into the human's GATE-2 review."
  evidence: "### `pharn/ARCHITECTURE.md` — 3 edits (Bash `sed`)"

- type: FINDING
  rule_id: "P5"
  severity: minor
  file: ".dev/features/trusted-doc-accuracy/PLAN.md:24"
  problem: "The plan pre-declares that /pharn-dev-regress's scope check will emit a false 'escaped its scope' finding but does not prescribe the classification, leaving the operator to re-derive the disposition of a P0-shaped blocking finding at read time."
  evidence: 'so any human-applied trusted-doc edit **will** surface as a false "the build escaped its scope" finding'
```

## Findings — registered grillers (Step 2b)

Membership is FLOOR; **running** a griller and **judging** its axis is ADVISORY.

### documentation (`enforces: P7`) — 1 finding

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/trusted-doc-accuracy/PLAN.md:134"
  problem: "The marker introduces a new vocabulary item into the shipped trusted docs with no definition anywhere in them, so a reader who meets it has nothing to look up and must infer what 'the guarded surface' denotes."
  evidence: "Marker: `_(specified; ships with the guarded surface)_`. Single-line replacements only; no reflowing,"
```

### comprehension (`enforces: P7`) — 1 finding

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/trusted-doc-accuracy/PLAN.md:94"
  problem: "The WHY of each annotation — that the primitive was verified absent this run — lives only in the PLAN and CHANGELOG, so a future reader of the trusted docs sees the marker without the evidence that produced it."
  evidence: '"the marked sites no longer assert a live protection" → **advisory.** Nothing on the floor reads'
```

### architecture (`enforces: P3`) — no findings

Structural fit recognized: the increment adds no capability, changes no contract shape, touches no
module in the layer tree, and introduces no sibling reference. `## Files` is confined to two
repo-meta files plus `CLAUDE.md`.

### Not applicable — 9 grillers

`a11y`, `error-handling`, `i18n`, `migrations`, `observability`, `performance`, `privacy`,
`security`, `testability` — each interrogates an axis (runtime behavior, schema change, user-facing
surface, test strategy) that a prose-only correction with no executable artifact does not present.
Recorded as not-applicable, **not** as passes.

---

## Summary

The plan is unusually well-grounded on the axes this stage most often catches: every factual claim is
re-derived from live state rather than inherited from the edit spec (`## Discovery`), the guarantee
audit reduces each claim honestly, and the `## Files` / Bash split is declared rather than disguised —
the L19 failure mode is named in the open, which is the correct handling of a write that passes no gate.

The concerns cluster in three places.

**The marker's own honesty (P0).** The increment's thesis is that a doc must not assert a protection
the repo lacks. The chosen remedy asserts instead that the protection **will** arrive with "the
guarded surface" — a phrase that names no artifact, no condition, and no owner. That is weaker than a
false present-tense claim in one respect (a reader is warned it is not live) and worse in another
(it cannot be checked, so it cannot ever be found wrong). Pairing it with a stated reopen condition
would keep the design intent visible without smuggling a schedule in.

**A known-false claim shipping inside the correction (P0).** The Q4 deferral is a defensible scope
call and the human made it deliberately — but the honest consequence deserves stating plainly in the
CHANGELOG, not just in the dev-side plan: after F7 lands, a trusted doc still points at a floor
backstop that does not exist on either half.

**The mechanism has no completion check (P6).** This is the one finding a reviewer should not wave
through. `sed` no-ops silently on a non-matching pattern; ten of the eleven edits go that way; and the
plan's only verification is `npm run check`, which cannot see whether a substitution landed because
the trusted docs are excluded from both formatters. A partially-applied patch set is therefore
indistinguishable from a fully-applied one at every gate downstream. A per-edit before/after diff, or
a post-edit grep asserting each old string is gone and each new string present, closes it cheaply.

---

**ADVISORY VERDICT: 7 concerns raised (1 blocking-severity, 4 important, 2 minor) — for the human to
weigh before `/pharn-dev-build`.**

This grill-log gates nothing. `severity` values above are **enum-gated members** whose **assignment is
model judgment** (fix #3); the free-text `problem` / `evidence` quote the plan and inherit its
untrusted tag — they are DATA for a human, never instructions to `/pharn-dev-build`. The only
floor-grade facts in this run are the griller **membership** count and the **spec-hash** comparison,
both reported above.
