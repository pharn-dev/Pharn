# GRILL — secmat-word-boundary

Plan under interrogation: `.dev/features/secmat-word-boundary/PLAN.md` (`trust: untrusted`).
Spec-hash check (content-hash primitive, surfaced not blocking): **MATCH** —
`8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52` recomputed from `pharn/ARCHITECTURE.md`
equals the plan's pin. Griller membership (FLOOR, `pharn/floor/count-grillers.mjs`): **13 registered**.
Deterministic plan-scanners (`pharn/floor/scan-plan-{i18n,migrations,observability,pii,secrets}.mjs`): all
five clean over this plan.

**This grill-log is ADVISORY end-to-end. It gates nothing.** No finding below blocks `/pharn-dev-build`;
the deterministic backstops remain `/pharn-dev-build`'s spec-hash gate and `pharn/floor/validate.mjs`.

## Findings

### Axis: performance / guarantee-audit completeness (griller `performance`, P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/secmat-word-boundary/PLAN.md:81"
  problem: "The `## Guarantee audit (P0)` makes no COST claim at all, yet the increment swaps the regex L24 says must have its bound re-derived and pinned on exactly such a swap — the plan cites L24 for the `i`-flag half and stops there."
  evidence: "L24 — Dropping the `i` flag SWAPS the implementation of the RNG conjunct, so its behavior claim is void until re-derived"
```

**Measured live before writing this finding (P6), rather than asserted.** A worst-case line — contains
`Math.random(` so the first lookahead succeeds, contains no security-material segment so the second scans
everything and fails at every start index:

| line length | current 11-branch `SECMAT` | proposed 44-branch `SECMAT` |
| ----------- | -------------------------- | --------------------------- |
| 2 039 B     | 3.8 ms                     | 3.1 ms                      |
| 8 039 B     | 33.4 ms                    | 39.7 ms                     |
| 20 039 B    | 203.9 ms                   | 251.2 ms                    |

Two readings, and the second is the one the plan owes:

1. **The swap introduces no new blowup class.** The branches are literal-prefixed and disjoint, each
   carries at most one `s?`, and nothing nests a quantifier over an ambiguous alternation — so the growth
   is a **~1.2× constant**, not the ~4× a naive branch-count argument predicts, and not exponential.
2. **The per-line cost is quadratic, and that is PRE-EXISTING.** `(?=.*X)` re-scans from every start
   index; the current regex already pays it (203.9 ms on a 20 KB minified line). This is **not this
   increment's axis** (P7) and should not be fixed here — but the plan should say the bound was
   re-derived and record the number, or L24 is cited and half-applied.

**Suggested disposition:** record the measured bound in the scanner header, and add the L24-shaped pin — a
membership test (completed vs. killed under a subprocess timeout), never a stopwatch-vs-threshold.

### Axis: architecture / branch coverage (griller `testability`, P1 + L29)

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/secmat-word-boundary/PLAN.md:77"
  problem: "L29 is applied to ONE of the two sets this remedy ranges over: the 11-word set is iterated, but the 4-BRANCH set is covered by three individually-named cases, which is precisely the shape L29 says reads as discharged while being partial."
  evidence: "- `apiKeys` / `API_KEYS` / `api_keys` on a `Math.random` line → still `insecure-random` (the plural branches)."
```

The defect being fixed is itself "the rule was written for one member of a set" (`iv` anchored, ten words
not). The plan correctly materializes the WORD set as `SECMAT_WORDS` and loops it — and then hand-writes the
BRANCH coverage. Branch 2 (camelCase), branch 3 (ALL-CAPS) and branch 4 (snake/kebab) each get exactly one
example, and branch 1's negative cases are named rather than generated. **Suggested disposition:** materialize
the branch table too — an array of `{branch, render(word) → line, expect}` the tests iterate across all 11
words — so a word or a branch added later is covered by every rule for free.

### Axis: determinism / correctness (griller `security`, P5)

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/secmat-word-boundary/PLAN.md:47"
  problem: "Branch 1's negative lookbehind excludes `$`, but no other branch admits a `$`-prefixed identifier, so `$key`/`$token` — ordinary JS naming — become uncompensated false negatives that no listed test would catch."
  evidence: "1. `(?<![A-Za-z0-9_$])lo(?![a-z0-9])` — bare lowercase head, NO plural."
```

`_key` survives because branch 4 admits `_`; `$key` has no such branch. The `$` (and the `_`) earn nothing
in the negative class: `keys` is already blocked by the right-hand `(?![a-z0-9])`, not by the lookbehind.
**Suggested disposition:** narrow the class to `(?<![A-Za-z0-9])`. Re-checked against the repros: `monkeys`
still blocks (`key` preceded by `n`), bare `keys` still blocks (trailing `s`), and `_keys` still matches via
branch 4 — so the simplification costs no coverage and closes the `$` gap.

### Axis: one-axis-of-change (griller `coupling`, P3 / P7)

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/secmat-word-boundary/PLAN.md:58"
  problem: "After this change the file carries TWO anchoring idioms — the new segment matcher for `insecure-random` and the untouched `\\b(?:iv|salt|nonce)\\b` for `hardcoded-iv-salt`, which misses `saltValue`/`ivBytes` — and the plan does not record that the divergence is deliberate."
  evidence: "## Contracts satisfied"
```

Correctly **out of this increment's axis** (P7 — no dogfood failure has been reported against
`hardcoded-iv-salt`), so the recommendation is _not_ to change it. But an unrecorded divergence is what a
later reader reads as drift. **Suggested disposition:** one sentence in the header naming the two idioms and
why only one moved.

### Axis: eval coverage (griller `testability`, P1)

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/secmat-word-boundary/PLAN.md:66"
  problem: "No committed LENS eval exercises `insecure-random`, so the kind this increment modifies is demonstrated only in the scanner's hermetic suite — a recurrence of a concern already recorded when the lens shipped."
  evidence: "No `role:`-bearing capability is added or changed, so no new eval pair is owed."
```

The plan's reasoning is sound (no capability changes → P1 owes no new pair), and closing the gap here would be
scope creep. Recorded because `.dev/features/crypto-lens/GRILL.md:35` raised the identical gap at the lens's
own build, so this is its **second** surfacing — the evidence standard L20 sets for escalating a
discipline-only remedy, should it appear a third time.

### Axis: documentation drift (griller `documentation`, P6)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".claude/commands/pharn-dev-grill.md:1"
  problem: "The grill command's own prose states the registered griller set is the single `testability` griller; `count-grillers.mjs` reports 13 registered, so the prose understates the live set by twelve."
  evidence: "Today the registered set is the `testability` griller (`pharn/pharn-pipeline/grillers/testability/testability.md`)."
```

Not a finding against the plan. It did not create ambiguity — the same command prescribes deterministic
discovery as authoritative, so all 13 were used — but it is doc-vs-repo drift a human should retire.

## Summary

The plan is unusually well-grounded for its size: the spec pin matches, the guarantee audit separates the
regex (floor) from the "is this really a vulnerability" question (advisory, and explicitly not claimed), the
narrowing it introduces is named rather than hidden, and it declares nine lessons that each map to a real
decision in the text.

Three concerns are worth the human's attention before build. Two are the **same failure the increment
exists to fix, recurring inside its own remedy**: L29's rule applied to the word set but not the branch set,
and L24's rule applied to the `i`-flag swap but not the cost bound. The third is a concrete correctness gap
— the `$` in branch 1's lookbehind buys nothing and silently drops `$key`. All three have cheap dispositions
that stay inside the approved `## Files`.

The remaining three are recorded, not urgent: a deliberate-but-unstated divergence between the file's two
anchoring idioms, a second surfacing of the missing `insecure-random` lens eval, and stale prose in the grill
command itself.

**ADVISORY VERDICT: 6 concerns raised (0 blocking, 3 important, 3 minor) — for the human to weigh before
/pharn-dev-build.** Nothing here blocks; nothing here certifies the plan is sound.
