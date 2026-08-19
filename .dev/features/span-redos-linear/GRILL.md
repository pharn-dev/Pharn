# GRILL — span-redos-linear

Plan under interrogation: `.dev/features/span-redos-linear/PLAN.md` (`trust: untrusted` to this stage).
Spec-hash check: `sha256(pharn/ARCHITECTURE.md)` =
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52` — **matches** the plan's
`spec_content_hash`. No drift surfaced. (Computation is content-hash floor-grade; the **block** on
drift belongs to `/pharn-dev-build`, not here.)

Griller membership (FLOOR — `node pharn/floor/count-grillers.mjs .`): **13 registered**. Note the
command prose still says "today the registered set is the `testability` griller" — stale doc-vs-repo;
live membership was used (P6). Axes applied inline: performance, testability, security, architecture,
documentation, observability, error-handling.

---

## Findings

### Axis: testability (P5) — the ReDoS budget test as specified would HANG, not fail

```yaml
- type: FINDING
  rule_id: "P5"
  severity: blocking
  file: ".dev/features/span-redos-linear/PLAN.md:67"
  problem: "The ReDoS regression fixture is specified at 40 repetitions, which on the CURRENT (shipped) span extrapolates to ~26,758 s (~7.4 h) — so if the SPAN is ever reverted or mis-edited, this test hangs the whole `npm test` suite for hours instead of failing, converting a loud RED into an indefinite stall."
  evidence: 'ReDoS regression (×3 files) → `fetch(` + `"((a)".repeat(40)` scans within a wall-clock budget'
```

**Grounded, not reasoned:** measured 0.05 s / 0.47 s / 7.26 s at 20 / 24 / 28 reps → factor **3.93**
per +2 reps; 40 reps extrapolates to ~26,758 s. **Recommendation:** use **28 reps** (measured 7.26 s
on the old span, <1 ms on the new) with a budget around 500 ms–1 s. A revert then fails in ~7 s — a
three-order-of-magnitude discriminator that still terminates. A hang is a strictly worse failure mode
than a red, and this is the one axis the increment exists to protect.

### Axis: testability (P5) — a wall-clock assertion is not a membership test

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/span-redos-linear/PLAN.md:91"
  problem: "The plan labels the budget test `floor: enum-regex`, but a wall-clock timing assertion is neither an enum nor a regex — it is a machine-dependent measurement, and calling it a floor primitive overstates it in exactly the way P0 forbids."
  evidence: '"The ReDoS bound will not silently regress" → **floor: enum-regex** via the budget test under `npm test`'
```

The _test's_ pass/fail is a deterministic exit code, but what it measures is timing, which varies with
machine load. **Recommendation:** either relabel this row **advisory** (a regression _detector_, not a
floor primitive), or reduce it to something genuinely deterministic — e.g. assert on a **step budget**
via a bounded iteration count rather than milliseconds. Do not leave it labeled `enum-regex`.

### Axis: architecture (P7 / L20) — the three-way copy-pair has no pin

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/span-redos-linear/PLAN.md:89"
  problem: "The plan concedes the three scanners' SPAN must stay identical but files it as `advisory` with no pin, which is precisely the discipline-only remedy L20 says will recur — and this increment is itself the second time the same constant plus its claim paragraph must be hand-edited across three files."
  evidence: '"The three scanners' spans stay identical" → **advisory** (a copy-pair convention). No floor op compares them'
```

The repo already has the precedent for the fix: `.dev/floor/check-provenance.test.mjs` pins a
deliberate copy-pair's shared constants by ✧ test. **Recommendation:** either add a ✧ test asserting
the three `SPAN` constants are byte-identical (cheap, in-scope, and exactly L20's escalation trigger),
or record it explicitly as a **named follow-up** in `SHIP.md` so the deferral is on the record rather
than implicit. Do not leave it as an unpinned convention a third time.

### Axis: documentation (P0) — the P1 waiver states a conclusion without its mechanism

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/span-redos-linear/PLAN.md:65"
  problem: "The plan waives P1's eval obligation by asserting these are 'not role:-bearing capabilities' without citing the mechanism that makes the waiver true, so a reader cannot check it — the shape of an unbacked claim, even though the claim itself is correct."
  evidence: "These are floor scripts, not `role:`-bearing capabilities, so P1's `evals/cases` + `evals/expected` obligation does not attach"
```

Verified correct this run: `validate.mjs`'s capability walk is scoped to the `pharn/pharn-*` tree and
does not reach `pharn/floor/`. **Recommendation:** cite that scope in one clause.

### Axis: observability (P5) — a homonym false positive the human must not misread

```yaml
- type: FINDING
  rule_id: "P5"
  severity: minor
  file: ".dev/features/span-redos-linear/PLAN.md:1"
  problem: "`scan-plan-observability.mjs` returns `mentions:true` with 20+ hits over this plan, and EVERY hit is the term `spans` meaning a REGEX argument span, not a telemetry span — a homonym collision that reads as 'this plan declares telemetry' when it declares none."
  evidence: '{"mentions":true,"hits":[{"line":1,"term":"spans"},{"line":5,"term":"spans"},…]}'
```

Not a defect in this plan, and not a defect the plan can fix — recorded so the human is not misled by
the scanner output, and as a candidate observation about the scanner's term set (`LIMITS.md §5` already
bounds this scanner to plan-time mentions; it does not name the homonym case).

### Axis: security / trust (P2) — no findings

The increment strictly _narrows_ an untrusted-input attack surface (a crafted ~120-byte line can
currently stall the review floor). The verdict path stays regex membership over text; no free text
gains steering power. The plan's trust audit is accurate.

### Axis: performance (P7) — no findings beyond the above

The change is the performance fix; its numbers are measured, not asserted (200 / 2 000 / 20 000 reps →
0.01 / 0.06 / 0.60 ms, linear).

---

## Summary

The plan's core substitution is well-grounded and, unusually, arrives with its evidence already
measured rather than reasoned — the differential fuzz (200 000 inputs, 0 divergences) is the right
instrument for a language-preservation claim, and it directly answers the trap that caught the
previous increment (a span swapped mid-build while the ReDoS argument written for the _other_ regex
was carried over and merely softened).

Two concerns are worth resolving before `/pharn-dev-build`. The **blocking-severity** one is concrete
and cheap: at 40 repetitions the regression fixture does not fail loudly on a revert, it stalls for
hours — the fixture must be sized so that the failure it exists to catch is _survivable_. The second
is the P0 labeling of a wall-clock assertion as `floor: enum-regex`; in a repo whose entire thesis is
that a timing measurement is not a floor primitive, that row should be relabeled advisory or made
genuinely deterministic.

The copy-pair finding is the interesting one for the human to weigh: L20's own rule says the second
occurrence of a discipline-only remedy is the trigger to give it a floor check, and this increment is
that second occurrence for the SPAN constant. Doing it now is small; deferring it is defensible, but
should then be a _named_ follow-up rather than an unpinned convention.

**ADVISORY VERDICT: 5 concerns raised (1 blocking-severity, 2 important, 2 minor) — for the human to
weigh before `/pharn-dev-build`.** Severity here is LLM-assigned and advisory (fix #3); nothing in this
grill-log gates the build, and no finding above is a floor verdict.
