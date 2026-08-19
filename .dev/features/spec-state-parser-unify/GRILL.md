# GRILL — spec-state-parser-unify

Plan under interrogation: `.dev/features/spec-state-parser-unify/PLAN.md` (treated as `trust: untrusted` DATA).
**Spec-hash check (content-hash, floor primitive #2 — surfaced here, ENFORCED at `/pharn-dev-build`):**
recomputed `sha256(pharn/ARCHITECTURE.md)` = `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`
= the plan's pinned `spec_content_hash`. **No drift.**

Griller membership (FLOOR — `pharn/floor/count-grillers.mjs`, frontmatter only): **13 registered**.
Deterministic plan-scanners run clean: `scan-plan-{secrets,pii,i18n,migrations,observability}` all
report no hits.

## Findings

### Axis: comprehension (P7) — the WHY of a non-obvious decision

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/spec-state-parser-unify/PLAN.md:88"
  problem: "The plan adds a whole new process-spawning print-mode without recording why the obvious cheaper alternative — parsing the state out of check-spec.mjs's existing GREEN line, which already prints it — was rejected; the next maintainer will propose exactly that as a simplification."
  evidence: 'PLAN `## Tests to write` and `## Guarantee audit` never mention check-spec.mjs:237, which already emits `GREEN — spec valid; state "Draft"; …`.'
```

The rejection reason is **L6** (a membership fact is read from the structured location, never from
free text) and it is decisive — but it lives only in the griller's head, not in the plan or the
shipped code. A future "optimization" that greps that GREEN line would re-create the exact defect
this increment exists to remove, and would look like a cleanup while doing it.

### Axis: testability (P1) — the declared verification does not cover the property being claimed

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/spec-state-parser-unify/PLAN.md:92"
  problem: "The cross-check test proves the two checkers agree on TWO named fixtures; the plan's actual claim is the structural property 'check-spec-approved.mjs holds no state parser at all', which no declared test pins."
  evidence: "PLAN:92 `cross-check: for both fixtures, check-spec.mjs --state and the gate's own verdict agree`; PLAN guarantee audit claims the stronger 'there is exactly one state parse'."
```

Layer 1 (presence) is satisfied — the plan declares a substantial `## Tests to write` section. This is
a **Layer-2 adequacy** concern, and it has direct precedent in this file's own history: the CRLF-fold
increment pinned its equivalent claim by asserting the wrapper files hold **zero `createHash` calls**
("verified by grep, not assumed"). The analogue here — asserting the gate's source contains no
frontmatter-parse construct — is the detector **L20** actually asks for. Two behavioral fixtures
cannot distinguish "no parser" from "a second parser that happens to agree on these two inputs".

### Axis: security / trust propagation (P2) — a new transport, untested

```yaml
- type: FINDING
  rule_id: "P2"
  severity: important
  file: ".dev/features/spec-state-parser-unify/PLAN.md:116"
  problem: "The change routes an untrusted frontmatter VALUE across a new process boundary (child stdout → parent capture), but every declared trust test puts its needle in the intent BODY; no declared test puts a hostile payload in the `state:` value itself."
  evidence: "PLAN:116 trust audit reasons about the transport correctly; PLAN:88 `## Tests to write` declares no fixture exercising it. The ★ test it relies on is described as 'not modified'."
```

The plan's _reasoning_ about this is sound (the `kv` regex ends at `$`, JS `.` excludes `\r`/`\n`, so
a value cannot forge an extra stdout line). That is exactly why it is worth a fixture: the argument is
a chain of three implementation details, and an unpinned argument is how the previous `readState`
bound rotted. A `state:` value carrying a control character or a newline-looking payload should be
shown to produce a RED, not a forged verdict line.

### Axis: architecture (P3) — a defensive branch the plan may be re-introducing after a prior increment deleted one

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/spec-state-parser-unify/PLAN.md:93"
  problem: "The plan specifies a 'frontmatter with no state → empty line at exit 0' branch by mirroring --spec-id, but in the gate's call path that branch is unreachable: validate() already REDs a state-less spec before --state is ever invoked."
  evidence: "PLAN:93 `frontmatter with no `state` → empty line at exit 0 (mirroring --spec-id exactly)`."
```

Mirroring `--spec-id` is defensible — `emitSpecId` documents its own equivalent branch as "a
fail-closed courtesy, never the load-bearing check". The concern is precedent: the 2.5.0 increment
**deleted** a defensive branch rather than shipping it, on the reasoning that "unreachable code no
test through the public surface can pin is not a safety net". `--state` is a _public_ mode, so the
branch **is** reachable through direct invocation and should ship — but the plan should say which of
those two precedents it is following, and why, rather than leaving the tension implicit.

### Axis: performance — cost of the chosen shape, unstated

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/spec-state-parser-unify/PLAN.md:97"
  problem: "The gate goes from spawning one child process to two, and the chain checker that wraps it is re-run at four downstream stages; the plan's guarantee audit does not state this cost or judge it acceptable."
  evidence: "PLAN:97 `## Guarantee audit (P0)` enumerates correctness properties only."
```

Almost certainly acceptable (a Node spawn is tens of milliseconds and the chain runs once per stage),
and the alternative that avoids it is the L6 violation flagged above. Raised so the trade is
**recorded as chosen**, not merely unnoticed.

## Axes interrogated with no finding

- **P0 guarantee-audit completeness** — every claim carries a floor/advisory label, and the
  "no third parser is ever re-added" claim is explicitly bounded as **discipline, not a floor op**,
  matching the bound `bodyHash` already states. This is the plan's strongest section.
- **P1 eval coverage** — the plan correctly reasons that P1 binds `role:`-bearing Capabilities and
  that a floor-checker fix owes `node --test` coverage instead; it does not launder a floor-checkable
  assertion into a judge.
- **P3 sibling imports** — the change uses the established shell-out-to-CLI pattern rather than a
  sibling import, consistent with `check-spec-approved.mjs` and `check-plan-spec-agree.mjs`.
- **P5 determinism** — the only branch is exact string membership; capture failures terminate in named
  REDs, not defaults.
- **P7 smallest increment** — scope is one defect plus the meta-docs it invalidates, with an explicit
  `### Excluded` heading. The setter parsed **7 paths against the 7 declared bullets** (L18/L20 check).
- **a11y, i18n, migrations, privacy, coupling, documentation, error-handling, observability** — not
  applicable to an internal floor-checker seam with no UI, no user data, no schema, and no new public
  configuration; the deterministic scanners for the four with scanners all report no hits.

## Summary

The plan is unusually well-grounded: it reproduced both failure directions live, it discovered that
`check-plan-spec-agree.mjs` inherits rather than duplicates the parser (so the fix propagates without
touching four downstream consumers), and it found that a **prior recorded decision is falsified** by
the repro — `CHANGELOG.md:247` claims the asymmetry "fails closed (a false RED, never a false GREEN)",
and the duplicate-key case is a false GREEN. That is a genuine P7 trigger, not a manufactured one, and
the plan is right to correct the entry in place.

The concerns cluster on one theme: **the plan reasons well about properties it does not then pin.**
Three of its sharpest arguments — "there is exactly one parser", "the transport cannot alter a value",
"parsing the GREEN line would be the L6 disease" — live in prose. The previous `readState` bound was
also prose, was also correct when written, and is precisely what rotted into this defect. The remedy
is small: a structural no-second-parser assertion, one hostile-`state:`-value fixture, and one
sentence of rationale in the shipped code.

Zero committed `SPEC.md` files exist in this repo, so nothing in-tree changes verdict as a result of
this fix — the beneficiaries are downstream user repos and future specs.

**ADVISORY VERDICT: 5 concerns raised (0 blocking-severity, 3 important, 2 minor) — for the human to
weigh before `/pharn-dev-build`.** This grill-log gates nothing; `/pharn-dev-build`'s spec-hash gate and
`pharn/floor/validate.mjs` remain the deterministic stops.
