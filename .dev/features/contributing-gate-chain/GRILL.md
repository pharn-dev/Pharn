# GRILL — contributing-gate-chain

Plan under interrogation: `.dev/features/contributing-gate-chain/PLAN.md` (`trust: untrusted`).
Spec-hash check: **MATCH** — recomputed `sha256(pharn/ARCHITECTURE.md)` =
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`, equal to the plan's pin (line 3).
No drift finding; the blocking drift gate remains `/pharn-dev-build`'s (fix #4), not this stage's.

Griller membership (FLOOR — `pharn/floor/count-grillers.mjs`): **13 registered**. Coverage of that set
is enumerated under "Griller coverage" below rather than implied, per the enumeration discipline the
plan itself cites (L29).

---

## Findings

### Axis: honest scope / no speculation (P7) — inline

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/contributing-gate-chain/PLAN.md:36"
  problem: "The plan declines to add a floor check on the grounds that P7's trigger has not fired, but its own cited L20 defines the trigger as a SECOND occurrence of a discipline-only remedy — and the gate chain drifted silently through three separate gate additions (docs:check, check:markers, check:badge), which is at least the third occurrence, not the first."
  evidence: "No new floor check is added: P7's trigger has not fired, and the escalation precedent that DID fire (`check-version-badge.mjs`) pins a machine-comparable single value, which a prose gate list is not."
```

The plan's counter-argument — that a prose gate list is not machine-comparable the way a shields badge
value is — is **not obviously wrong**, and it is the strongest thing in this finding's way. But it is
asserted, not demonstrated: `package.json`'s `scripts.check` **is** a structured string, and a check
that every `npm run <x>` named in it appears somewhere in `CONTRIBUTING.md` (or the inverse) is
expressible as set membership over two structured locations. Whether that check is _worth_ building is
a human call; whether the plan's stated reason for skipping it survives L20 is the concern.

### Axis: one axis of change (P3) — inline

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/contributing-gate-chain/PLAN.md:63"
  problem: "CONTRIBUTING.md is edited for three independent reasons in one increment — a drifted gate enumeration, an inverted dev/product path, and a stale repo slug from a GitHub rename — which is three axes of change in one file and one commit, so a later revert of any one of them cannot be done cleanly."
  evidence: "`CONTRIBUTING.md` — three edits: (M5) replace the `:33` gate comment and the `:37` prose, and add the `docs:generate` obligation; (M6) correct the `:57` dev/product boundary bullet to name `.dev/floor/`; (L12) align the `:22` clone URL to the canonical slug"
```

Noted as **minor** because the bundling was a human instruction at GATE 1, not a planner choice, and
because P3 governs axes of change in the _product tree_ rather than commit hygiene in repo-meta docs.
It is surfaced so the decision stays visible rather than implicit.

### Axis: discovery-first / halt-and-ask (P6) — inline

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/contributing-gate-chain/PLAN.md:151"
  problem: "The M6 edit is scoped from a defect the planner observed while reading the file, not from a supplied fix request, so nothing establishes that correcting line 57 is what M6 actually asked for — the increment may satisfy its own finding while leaving M6 open."
  evidence: "M6's text was never supplied — the `:57` fix is scoped from the defect observed live, not from a request, and should be confirmed as covering what M6 intended."
```

The plan **does** name this itself, which is the honest handling; the finding records that the
open question is still open at build time, not that the plan hid it.

### Axis: trust propagation (P2) — inline

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".dev/features/contributing-gate-chain/PLAN.md:117"
  problem: "The plan overrode two false claims in its untrusted input and documented both, which is the correct handling — but it then adopts the same input's file list as the starting scope for L12, so the request's framing still shapes what was searched even though its facts were rejected."
  evidence: 'L12 asserts the canonical slug should be confirmed "against the actual git remote"... Following the request''s stated method would have rewritten README''s four correct badges to the stale slug — the inverse of the fix.'
```

Mitigated in practice: the plan ran a repo-wide negative-lookahead sweep rather than trusting the
request's three-file list, and the sweep's result (two live files, four historical) is recorded. The
residual is that the _exclusion_ rule for the historical hits is the planner's judgment, not a
membership test — reasonable, but advisory.

### Axis: privacy / PII — `pharn/floor/scan-plan-pii.mjs` (deterministic)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/contributing-gate-chain/PLAN.md:99"
  problem: "The deterministic PII scanner reports three email-literal hits, all of which are SSH remote URLs of the form git@github.com:owner/repo.git rather than personal data — a shape collision the scanner cannot distinguish, recorded here so a reader does not treat the non-empty output as a real PII signal."
  evidence: '{"found":true,"hits":[{"line":99,"kind":"email-literal"},{"line":133,"kind":"email-literal"},{"line":136,"kind":"email-literal"}]}'
```

This is the scanner behaving as specified, not a defect in it: `user@host` is genuinely the email
shape, and an SSH URL is a legitimate instance of it. No PII is present in the plan.

---

## Griller coverage (enumerated, not implied)

| Griller        | Applied                                         | Result                                                                                                               |
| -------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| privacy        | deterministic scanner run                       | 3 hits, all SSH-URL false positives (above)                                                                          |
| security       | deterministic scanner run (`scan-plan-secrets`) | `found:false`                                                                                                        |
| observability  | deterministic scanner run                       | `mentions:false` — no telemetry claimed, none owed (`LIMITS.md §5`)                                                  |
| migrations     | deterministic scanner run                       | `mentions:false`                                                                                                     |
| i18n           | deterministic scanner run                       | `found:false`                                                                                                        |
| documentation  | procedure applied inline                        | no finding — the increment _is_ documentation; it adds no public surface that could go undocumented                  |
| architecture   | procedure applied inline                        | folded into the P3 finding above                                                                                     |
| testability    | procedure applied inline                        | no finding — no Capability and no `rule_id` added, so P1 owes no eval; the plan states this and the claim checks out |
| comprehension  | procedure applied inline                        | no finding — the increment's whole purpose is comprehension repair                                                   |
| coupling       | not applicable                                  | no framework-touching content; `coupling` is undeclared because no capability is added                               |
| a11y           | not applicable                                  | no user-facing UI surface                                                                                            |
| error-handling | not applicable                                  | no executable code path added                                                                                        |
| performance    | not applicable                                  | no runtime behavior added                                                                                            |

The four "not applicable" rows are judgments, not deterministic exclusions — they are listed so the
gap is visible rather than silently skipped.

---

## Summary

The plan is unusually well-grounded on the axes that matter most here: it re-derived every fact it
cites from live state, it caught and documented two false premises in its own untrusted input (the
git-remote authority and the "stale slug 404s" claim), and it enumerated both site sets by grep rather
than trusting the request's file list. Its trust and determinism audits are concrete rather than
ceremonial.

The one concern worth a human's attention before building is **F1 (P7/L20)**: the increment repairs a
drift whose only remedy remains "someone will notice next time," while citing the very lesson that says
a repeat of that shape has earned a floor check. The plan's rebuttal is plausible but asserted. The
honest options are to build as planned and record the residual, or to widen the increment with a
membership check over `package.json`'s `scripts.check` — the second is a real scope increase and is
the human's call, not this stage's.

**F3 (P6/M6)** is the other item that should not be lost: the line-57 fix is well-founded on its own
evidence, but nothing ties it to what M6 actually requested.

---

**ADVISORY VERDICT: 5 concerns raised (0 blocking-severity, 2 important, 3 minor) — for the human to
weigh before `/pharn-dev-build`.** This grill-log gates nothing. Every finding above rests on model
judgment; the only floor-grade facts in this run are the spec-hash match, the griller-membership count,
and the five deterministic scanner outputs, each labeled where it appears.
