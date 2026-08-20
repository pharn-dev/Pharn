# GRILL — briefing-escape-round-trip

Interrogating `.dev/features/briefing-escape-round-trip/PLAN.md`. **Spec-hash check (content-hash
primitive, surfaced not blocking):** recomputed `sha256(pharn/ARCHITECTURE.md)` =
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`, **equal** to the plan's
`spec_content_hash` — no drift. The block on drift remains `/pharn-dev-build`'s floor-gate (fix #4), not this
stage.

The PLAN under interrogation is `trust: untrusted`. Its prose is quoted below as DATA.

## Findings

### Axis: determinism (P5) — the membership test's own edge case

```yaml
- type: FINDING
  rule_id: "P5"
  severity: blocking
  file: ".dev/features/briefing-escape-round-trip/PLAN.md:98"
  problem: 'The plan defines the decode branch as `ends with an UNESCAPED "` but never says how `unescaped` is decided; the obvious spelling — the preceding character is not a backslash — is WRONG for every value the writer emitted from a backslash-terminated source, so the fix would silently not close the round trip for exactly the second half of the defect it names.'
  evidence: 'double-quoted?" (starts with `"`, ends with an UNESCAPED `"`, length >= 2) — not on content judgment.'
```

**Reproduced live, before any change** (both candidate spellings run against `yamlScalar` output):

```text
value      -> rendered scalar        naive(prev char != \)   backslash-run-parity
"a\"       -> "\"a\\\""              false                   true
"a\\"      -> "\"a\\\\\""            false                   true
"say \"hi\"" -> "\"say \\\"hi\\\"\"" true                    true
```

A value ending in a backslash renders a scalar whose closing `"` **is** preceded by a backslash — the
last character of the escaped `\\` pair. The naive test therefore rejects it as "not fully quoted", the
value falls back to today's `clean()` path, and `a\` reads back as `a\\`: still stale, still RED. The
correct test counts the run of consecutive backslashes immediately before the final quote and treats an
**even** run as a real terminator. Note that a `"`-only test suite passes under BOTH spellings — the
naive one is invisible unless a backslash-terminated case is in the corpus.

### Axis: honest scope / no speculation (P7) — the enumeration is pre-filtered

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/briefing-escape-round-trip/PLAN.md:58"
  problem: "The plan cites L29 — materialize the set and iterate it — and then hand-picks three of the seven yamlScalar-emitted fields on a judgment call (`that can carry a quote`), which is the same partial-application shape L29 was promoted to name."
  evidence: "per-field render→check → for each `yamlScalar`-emitted field that can carry a quote (`feature`, `spec_id`, `grill_verdict`)"
```

The judgment "can carry a quote" is correct **today** and is exactly what L29 says not to encode
implicitly: `regress_verdict` and `verify_verdict` are enum-closed _now_, and `rendered_at_commit` is
hex _now_. The deliverable L29 asks for is the seven-member enumeration materialized in one array with
its per-field reachability declared as data, with the rules iterating it — so a field whose source
loosens later is covered without anyone remembering to revisit this decision.

### Axis: discovery-first (P6) — the "after" half of reproduce-before-and-after

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".dev/features/briefing-escape-round-trip/PLAN.md:114"
  problem: "The plan records the BEFORE reproduction in full but never commits the build to re-running that same fixture AFTER the change, so `it is fixed` could rest on the new unit tests alone — which are authored by the same reasoning that would author the bug."
  evidence: "## Reproduction (P6 — run this run, before any change)"
```

The fixture that produced the RED is the one artifact not written by this increment's own reasoning.
Re-running it after is cheap and is the only check that is not self-referential.

### Axis: architecture (P3) — the README co-edit's blast radius

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/briefing-escape-round-trip/PLAN.md:39"
  problem: "`README.md` is authorized whole by the writes-scope for a one-token badge edit, and the same file carries the generated CURRENT-STATE region that `docs:check` holds to byte-equality — the scope cannot express the narrower intent."
  evidence: "`README.md` — the shields version badge, which `check-version-badge.mjs` holds equal to `SKILLS_VERSION`"
```

Verified live and **not** currently a conflict: the badge is `README.md:13` and the guarded region runs
`README.md:152`–`161`, so the edit is nowhere near it. Recorded because the guard here is the build's
own care, not the floor — fix #7 authorizes the whole file either way, and `docs:check` would catch a
stray only after the fact.

### Non-finding, recorded so this log does not read as an unexamined clean

`node pharn/floor/scan-plan-observability.mjs` reports `{"mentions":true}` with two hits on the term
`spans` at PLAN.md:78 and :80. Both are the English noun — "the bold **span**", "the captured **span**"
— not telemetry spans. The scanner is a keyword scan and did its job; the judgment that these are false
positives is this griller's, and is advisory. The other four scanners (`i18n`, `migrations`, `pii`,
`secrets`) report no hits.

## Summary

The plan's direction is sound and its guarantee audit is unusually honest — it volunteers that live
incidence is **0 of 77**, and it strikes the "GREEN means faithful" reading rather than restating it.
Three things are worth the human's attention before `/pharn-dev-build`.

The **first finding is the one that matters**: the plan names the decode's membership test in prose and
leaves its hardest case unspecified, and the natural implementation of that prose is wrong in a way a
quote-only test corpus cannot see. This is the same shape as L14's own origin story (a tightening whose
prose read as REPLACE), which the plan cites — applied to the branch test rather than to the guard. The
second is L29 under-applied by the plan that cites L29, which is precisely the recurrence L29 exists to
describe; the remedy is mechanical. The third is a cheap non-self-referential check the plan already has
the fixture for.

Nothing here blocks. The `blocking` severity on the first finding is an **LLM-assigned** value under
`finding-shape.md` (fix #3) — it marks what I judge most consequential, not a gate.

**ADVISORY VERDICT: 4 concerns raised (1 blocking-severity, 1 important, 2 minor) — for the human to
weigh before `/pharn-dev-build`.** This is not a gate and not "grill passed"; `/pharn-dev-grill` surfaces
concerns and does not ensure the plan is sound (P0). The deterministic backstops remain
`/pharn-dev-build`'s own floor-gates (spec-hash drift fix #4 — checked GREEN above; unresolved
`## Open questions (HALT)` — resolved at GATE 1) and `pharn/floor/validate.mjs`.
