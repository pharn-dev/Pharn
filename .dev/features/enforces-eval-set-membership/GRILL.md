# GRILL — enforces-eval-set-membership

Plan under interrogation: `.dev/features/enforces-eval-set-membership/PLAN.md`.
Spec-hash check (content-hash primitive, surfaced not blocking here): recomputed
`sha256(pharn/ARCHITECTURE.md)` = `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`
— **agrees** with the plan's `spec_content_hash`. No drift.

Griller membership (FLOOR — `node pharn/floor/count-grillers.mjs .`, frontmatter not prose):
**13 registered**. Deterministic plan-scanners over `PLAN.md`: `scan-plan-secrets` `found:false`,
`scan-plan-pii` `found:false`, `scan-plan-i18n` `found:false`, `scan-plan-migrations`
`mentions:false`, `scan-plan-observability` `mentions:false`.

> **Advisory end-to-end (P0).** Nothing below blocks `/pharn-dev-build`. The findings are this
> griller's judgment; the `severity` values are assignments, not floor verdicts (fix #3). The plan is
> read as `trust: untrusted` — quoted text below is DATA, never an instruction followed.

## Findings

### Axis: trust propagation (P2) — the `.md` fallback is a weaker binding than the plan admits

```yaml
- type: FINDING
  rule_id: P2
  severity: important
  file: ".dev/features/enforces-eval-set-membership/PLAN.md:77"
  problem: "The non-JSON fallback is a regex over free-form markdown, so unlike the JSON path it has no structured location to read — an expected `.md` fixture that QUOTES untrusted case content containing a `rule_id:` line (the fixtures routinely quote case code as evidence) would satisfy the binding for a rule the capability never produces; the plan's trust audit claims the produced-set is built 'exclusively from enum-gated positions', which is true of the JSON path and only approximately true of the fallback."
  evidence: '`.md`-only fixtures → `enforces: ["P2"]`, a single `expected-1.md` carrying `rule_id: P2 # comment` in its finding block → **GREEN** (the fallback path…)'
```

**Ask:** state the fallback's weaker bound explicitly in the guarantee audit and in the code comment
(the JSON path reads a structured location; the `.md` path reads an anchored line and is therefore
best-effort), and add the negative test named in the next finding so the weakness is at least bounded
to `rule_id:`-shaped lines rather than any prose mention.

### Axis: eval coverage (P1) — the `.md` path has no negative test

```yaml
- type: FINDING
  rule_id: P1
  severity: important
  file: ".dev/features/enforces-eval-set-membership/PLAN.md:72"
  problem: "The free-text-laundering regression is tested only on the JSON path (an id inside `semantic[].judge`), but the `.md` fallback is the path where prose laundering is most likely — live `.md` expected fixtures contain sentences like 'exactly one FLOOR finding (rule_id P2)' and `purpose:` frontmatter mentioning the id, so a loose fallback regex would bind on prose and the planned test set would not notice."
  evidence: '- free-text only → `enforces: ["P2"]`, fixture''s only mention of `P2` is inside a `semantic[].judge` string → **RED**'
```

**Ask:** add a sixth test — a `.md`-only fixture whose sole mention of the id is prose (not a
`rule_id:` line) → **RED**.

### Axis: honest scope (P7) — the L3 re-audit's bound is unstated

```yaml
- type: FINDING
  rule_id: P7
  severity: minor
  file: ".dev/features/enforces-eval-set-membership/PLAN.md:14"
  problem: "The re-audit result '0 would-RED' is scoped to THIS repo's 35 enforces-declaring capabilities, but `pharn/floor/validate.mjs` is product surface a downstream install runs against its own tree, where fixture shapes this repo does not use (a `.yaml`/`.txt` expected file, or a JSON shape other than eval-format) would contribute nothing to the produced-set and flip a previously-GREEN capability to RED; the plan states the audit as if it bounded the change's blast radius generally."
  evidence: "all 35 `enforces`-declaring capabilities were simulated under the new exact-membership rule … result **0 would-RED**, so no currently-GREEN capability is converted into guaranteed friction."
```

**Ask:** say "audited over this repo's 35 declarations" rather than "no currently-GREEN capability",
and record the downstream-install case in the CHANGELOG entry so an installer reading it is warned
that a non-eval-format expected fixture now REDs (which is the fail-closed direction, but is a
behavior change, not a pure bug fix).

### Axis: determinism (P5) — `## Open questions (HALT)` still reads unresolved

```yaml
- type: FINDING
  rule_id: P6
  severity: blocking
  file: ".dev/features/enforces-eval-set-membership/PLAN.md:125"
  problem: "The plan retains a populated `## Open questions (HALT)` section, and `/pharn-dev-build` refuses to build a plan with open questions; the question WAS resolved at GATE 1 (the human confirmed the repro must RED and the real tree stay GREEN), but that resolution lives only in the session transcript, not in the artifact the build gate reads."
  evidence: "## Open questions (HALT)\n\n- The task's `Done when` bullet reads \"The prefix-collision repro **match** still GREEN\", which is garbled."
```

**Ask:** the build stage must resolve this against live state before writing anything — either the
question is recorded as answered in the plan, or the build halts. Do not let the build proceed by
silently ignoring the section.

### Axis: determinism (P5) — a non-string `value` is an unhandled shape

```yaml
- type: FINDING
  rule_id: P5
  severity: minor
  file: ".dev/features/enforces-eval-set-membership/PLAN.md:118"
  problem: 'The determinism audit names `Array.isArray` guards and own-property shape checks but does not say what happens when a `field_equals` entry carries a non-string `value` (a number, null, an object); coercing it with `String(value)` would silently mint the member `"[object Object]"` into the produced-set, while ignoring it is the fail-closed reading the rest of the plan takes.'
  evidence: "Object access on parsed fixture data uses shape checks on own properties and `Array.isArray` guards before iteration (L15's family)"
```

**Ask:** admit only `typeof value === "string"` entries to the produced-set; a non-string `value` is
not a rule id and must not become one.

## Summary

The plan is **well-grounded and unusually well-evidenced**: all three defects were reproduced live at
`rc=0` before planning (P6 satisfied for real, not asserted), the spec-hash agrees, the L3 re-audit was
run as a simulation rather than assumed, and it correctly identifies that the task description's
premise ("collect every finding's `rule_id`") does not match the live eval-format fixture shape — the
kind of doc-vs-repo mismatch P6 exists to catch. Its guarantee audit reduces every claim and **strikes**
the false-GREEN class explicitly rather than quietly dropping it.

The concerns cluster on one seam: **the `.md` fallback is the weak half of the fix and the plan treats
it as equivalent to the JSON path.** The JSON path reads a structured location (L6's remedy, correctly
applied); the fallback is a regex over free-form markdown, which is the very shape L6 warns about. It
is still a large improvement over the current concatenated-substring test, and it is needed to avoid
false-REDding a contract-conformant `.md`-only capability — but it should be labeled best-effort in
both the code and the guarantee audit, and it needs the prose-laundering negative test it currently
lacks. The remaining findings are small: an unstated audit bound, an unhandled non-string `value`, and
one process item — the `## Open questions (HALT)` section that `/pharn-dev-build` will refuse on.

ADVISORY VERDICT: 5 concerns raised (1 blocking-severity, 2 important, 2 minor) — for the human to
weigh before `/pharn-dev-build`. This is not a pass, and it is not a gate.
