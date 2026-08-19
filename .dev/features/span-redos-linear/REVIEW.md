# REVIEW — span-redos-linear

**Floor first (P0):** `node pharn/floor/validate.mjs .` → **GREEN**, 36 capabilities, exit 0. Confirmed
this run, before any judgment below. Everything after this line is **advisory**.

The increment under review is `trust: untrusted`, including the crafted paren fixtures it adds.

---

## Floor-gate findings (blocking)

### F1 — the increment's own performance claim was an overclaim, in the same shape as the one it repairs

```yaml
- type: FINDING
  rule_id: "P0"
  severity: blocking
  file: "pharn/floor/scan-code-ssrf.mjs:69"
  problem: "The replacement header asserted that match time is LINEAR in line length, but the scanner's per-line cost is O(sink-callee occurrences x line length) because the engine retries the pattern at every position the callee can start — so the increment repairing a false bound in a floor file shipped a second, weaker false bound in the same paragraph."
  evidence: "decomposition there is nothing to backtrack over, so match time is LINEAR in line length"
```

**Status: FIXED inside this increment** (the correction is in the reviewed diff, not deferred). Caught by
testing the _new_ claim as adversarially as the old one, which is the only reason it surfaced —
`fetch(`×N with no source forces every start position to fail:

| `fetch(` reps | line size | old span  | new span  |
| ------------- | --------- | --------- | --------- |
| 1 000         | 7 KB      | 1 531 ms  | 16.92 ms  |
| 2 000         | 14 KB     | 11 719 ms | 65.96 ms  |
| 4 000         | 28 KB     | 98 931 ms | 270.73 ms |

Old ≈ **cubic** (~7.7–8.4× per doubling); new ≈ **quadratic** (~3.9–4.1×). The fix is a genuine ~365×
improvement at n=4000 and removes the **exponential** term — but "linear" was still wrong. The three
headers and the CHANGELOG now state the quadratic per-line bound explicitly and label the linear claim
as scoped to _a fixed start position_.

This is worth naming plainly: the first draft of a fix for an unbacked bound contained an unbacked
bound. That is not incidental — it is evidence that the failure mode is **structural to writing
performance prose next to a regex**, not a lapse of care by whoever wrote the previous one.

---

## Advisory findings

### F2 — the ✧ copy-pair pin is asymmetric and can vanish silently

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: "pharn/floor/scan-code-ssrf.test.mjs:441"
  problem: "The ✧ pin holding the three SPAN literals byte-identical lives only in the ssrf suite, so deleting or renaming that one test file removes the guarantee for all three scanners with no other check noticing."
  evidence: 'test("✧ PIN: all three scan-code-* scanners declare a byte-identical SPAN", () => {'
```

**Status: FIXED** (human called it at GATE 2; the fix is in this increment's diff). The pin is now
**mirrored into all three suites**, so any surviving suite still enforces the agreement — the guard no
longer dies with a single file. Cost is a triplicated assertion, which is the right trade for a guard
whose whole job is to survive edits to the files it guards.

Verified the way the ★ ReDoS test was: a one-token drift (`DRIFTED`) was injected into
`scan-code-injection.mjs`'s `SPAN` and **all three** pins went red; restoring it returned all three to
green. A pin never observed failing is not evidence that it can (L4). Test count 1443 → **1445**.

Note the precedent this departs from: `.dev/floor/check-provenance.test.mjs` is equally single-sited and
was cited as justification for leaving this one alone. That precedent is now the weaker of the two — a
candidate follow-up, not something this increment changes.

### F3 — the observability plan-scanner reports a homonym hit on this feature

```yaml
- type: FINDING
  rule_id: "P5"
  severity: minor
  file: ".dev/features/span-redos-linear/GRILL.md:88"
  problem: "scan-plan-observability.mjs returned mentions:true with 20+ hits over this plan, every one being the word `spans` in the sense of a regex argument span rather than a telemetry span — a term-set homonym that reads as a telemetry declaration where none exists."
  evidence: '{"mentions":true,"hits":[{"line":1,"term":"spans"}, …]}'
```

Carried forward from `GRILL.md`, unresolved and not this increment's to resolve. It changed no verdict
(`LIMITS.md §5` already bounds that scanner to plan-time mentions).

---

## Lens results

**L-floor → P0.** One blocking finding (F1), fixed. The rest of the increment's claims reduce cleanly:
the detection guarantee is unchanged regex membership (primitive #3); the ✧ pin is byte-equality
(primitive #3); the ReDoS regression's verdict is _completed vs. killed_ — a membership test, not a
stopwatch reading compared to a threshold, which is what keeps it off the "advisory dressed as
deterministic" pile. The plan's own guarantee audit initially labeled that test `floor: enum-regex`; it
was relabeled before build and the test was restructured so the label is now true rather than merely
softened.

**L-eval → P1.** No `role:`-bearing capability is added, so no `evals/` obligation attaches —
`validate.mjs`'s capability walk is scoped to `pharn/pharn-*` and does not reach `pharn/floor/`, and it
returns GREEN. The binding obligation for floor scripts is their `node --test` suites: 1443 tests, 1443
pass, 0 fail. Three new tests were added and, critically, the ReDoS one was **observed failing** against
a scratch copy carrying the old span (SIGTERM at the 3 s timeout) before being trusted — per L4, an
assertion never seen to fail is not evidence that it can.

**L-trust → P2.** The scanners read untrusted code and the increment strictly _narrows_ that surface: a
~120-byte crafted line could previously stall the review floor, which is a denial-of-service reachable
from exactly the input the scanner exists to read. No free text gained steering power; the verdict path
is unchanged regex membership.

On the direct question the lens asks — did instruction-looking content in the reviewed material change
my behavior? — one thing is worth reporting rather than quietly handling. **The task specification
prescribed a specific regex** (`(?:[^()]|\([^)]*\))*?`) **which the scanners already document as
rejected, and which measurably drops two ★-pinned detections.** Complying would have shipped a silent
coverage regression under the banner of a security fix. It was surfaced at GATE 1 for the human to
decide rather than either silently obeyed or silently overridden. The paren fixtures themselves were
treated as data throughout.

**L-axis → P3.** One axis per file (the argument span and its bound). The ✧ pin does read its two
sibling scanners by path, which is a cross-file reference — but `pharn/floor/` is not part of the
capability layer tree the no-sibling-imports rule governs (`validate.mjs` walks `pharn/pharn-*`), and
the established precedent for pinning a deliberate copy-pair by test is exactly this. Not a violation;
noted so the reasoning is on the record rather than assumed.

---

## Proposed lesson candidate (NOT written to canon)

`/pharn-dev-review` holds no `.dev/memory-bank/**` scope; this is a **proposal** for a separate,
human-gated `/pharn-dev-memory-promote` run.

> **A performance bound inherited from a superseded implementation is an unbacked claim, and swapping
> the implementation mid-build is exactly when it gets inherited.**
>
> `scanner-nested-paren-span` planned the _disjoint_ span, whose "disjoint branches ⇒ no exponential
> blowup" argument was sound. Mid-build that span broke two canonical tests and was replaced with an
> overlapping one — but the ReDoS paragraph was carried across and merely **softened** ("no EXPONENTIAL
> backtracking observed") rather than **re-derived**, and its supporting measurements were re-run on
> shapes that could not exhibit the new failure. The result shipped in three floor files and was false
> by ~9 orders of magnitude at 40 repetitions. This increment then reproduced the same pattern in
> miniature (F1). The remedy is not "be careful": when the artifact a claim describes is replaced, the
> claim is **void until re-measured on a shape chosen to break the new artifact**, and the adversarial
> shape for a regex is the **ambiguous** input, not the **large** one.
>
> - feature: `span-redos-linear`
> - source: this `REVIEW.md` F1 + `.dev/features/scanner-nested-paren-span/REVIEW.md:75` (which already
>   recorded that PLAN and code disagreed after the mid-build swap, without catching that the bound had
>   gone stale with it)
> - relation: sharpens **L4** (authored fixture ≠ live measurement) into the performance-claim case;
>   complements **L2** (a claim must cite something live).

---

## Verdict

**GREEN — 0 outstanding floor-gate findings.** F1 (blocking) and F2 (advisory) are both **fixed within
this increment**. F3 is advisory, outstanding, and not this increment's to resolve.

Standing floor verdicts, re-read after the F1 correction: `validate` exit **0**; `/pharn-dev-regress`
**`no-regressions`**; `/pharn-dev-verify` **`PASS`**, `failing_gates: []`.

This is a review, not an approval. Severity above is LLM-assigned and advisory (fix #3); the decision to
merge, fix, or abandon is the human's.
