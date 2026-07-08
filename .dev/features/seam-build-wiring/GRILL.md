# GRILL — seam-build-wiring plan interrogation (ADVISORY)

- Plan under interrogation: `.dev/features/seam-build-wiring/PLAN.md` (trust: **untrusted** — self-claims tested, not believed).
- Spec-hash check (content-hash primitive, surfaced not blocking): `sha256(ARCHITECTURE.md)` = `11cd9ad5…d1d969` — **matches** the plan's pin. No drift finding.
- Griller roster (FLOOR membership, `count-grillers.mjs`): **13 registered**. Relevant axes applied inline; the rest raise no findings on a command-prose edit with no UI/data/runtime-code surface.

## Findings

### Axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: P0
  severity: important
  file: ".dev/features/seam-build-wiring/PLAN.md:32"
  problem: "The claim that wiring makes the config-validity floor 'OPERATIVE in the documented build flow' is DOUBLY advisory: Step 2c only runs its checker if (a) the model RECOGNIZES a seam and (b) the model actually invokes check-seam-config.mjs — neither is hook-forced, so a build that fails to recognize a seam (or skips the step) never validates the config and the floor never fires. 'Operative' means 'in the documented flow', NOT 'floor-forced'."
  evidence: "this increment **makes that pre-existing floor OPERATIVE in the documented build flow**; it does **not** add a new primitive."
```

The plan is mostly honest here (it labels the invocation ADVISORY at line 30), so this is a sharpening, not a contradiction: the build text + the new audit lines must make explicit that seam-recognition AND checker-invocation are both advisory command discipline — otherwise a reader over-reads "operative" as a guarantee that seams are always validated. Same class as pharn-build.md's own "`/pharn-build` invokes the gate and obeys it → ADVISORY."

### Axis: testability / eval coverage (P1)

```yaml
- type: FINDING
  rule_id: P1
  severity: important
  file: ".dev/features/seam-build-wiring/PLAN.md:26"
  problem: "The chosen approach (Q1-A) adds NEW inline command bash — extract pharn.config.json's `.seam` to .pharn/seam-config.json — that is UNTESTED: the floor (check-seam-config.mjs) verifies only that the EXTRACTED FILE is valid, never that the extraction itself is correct/faithful (right object, absent-block handling, malformed pharn.config.json). A buggy extraction can hand the checker a valid-looking but wrong config and pass."
  evidence: "This increment adds **no** ... new deterministic helper ... Reusing a tested checker rather than adding an untested one is the honest move"
```

The plan does flag the extraction as "advisory orchestration; only the checker's verdict on the extracted file is floor" (line 55) — so this is a **named** gap, not a hidden one. It is the honest cost of keeping the increment to one axis. If the human wants extraction correctness floor-covered, that is **option C** (a tested extraction helper) — a deliberate second axis, correctly deferred. Surfaced so the human weighs "extraction is untested" at GATE 2.

### Axis: determinism (P5)

```yaml
- type: FINDING
  rule_id: P5
  severity: minor
  file: ".dev/features/seam-build-wiring/PLAN.md:55"
  problem: "The 'no `seam` block → use the documented default order' path means an absent config proceeds on a hardcoded default. Ensure the build text routes that default THROUGH check-seam-config.mjs too (validate the default object), so there is no code path where a walk runs on an unvalidated config — even the safe default."
  evidence: "if there is **no** `seam` block, use the documented **default order** ... which contains `ask` → still safe"
```

Minor because the default is hardcoded-safe (contains `ask`), but validating it too keeps a single, uniform floor path (every walk is preceded by a GREEN checker run) rather than a validated path and an unvalidated-but-trusted path.

## Prose summary

Well-scoped, one-axis (pharn-build.md only), and it correctly mirrors the command's existing Step-2b idiom and two-clocks audit framing. It reuses the tested `check-seam-config.mjs` rather than inventing a helper (P7-honest), and it defers the checker/config-widening (option C) cleanly. The three concerns are all about **the build faithfully expressing the honesty the plan already commits to**:

1. **(important)** "operative" is doubly-advisory (seam-recognition + invocation, neither hook-forced) — the build text must say so plainly;
2. **(important)** the inline `.seam` extraction is untested — floor covers the extracted file's validity, not the extraction's correctness (a named cost of the one-axis choice; option C would fix it as a second axis);
3. **(minor)** route the no-config default through the checker too, so no walk runs on an unvalidated config.

None blocks the build.

## Verdict

**ADVISORY VERDICT: 3 concerns raised (0 blocking, 2 important, 1 minor) — for the human to weigh before/at `/pharn-dev-build`.** Advisory end-to-end; gates nothing. "grill produced a GRILL.md" ≠ "the plan is sound" (P0); the deterministic backstops remain `/pharn-dev-build`'s floor-gates and `validate.mjs`.
