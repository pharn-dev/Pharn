# GRILL — template-mask-suppression-2

**Plan under interrogation:** `.dev/features/template-mask-suppression-2/PLAN.md` (approved as written).
**Spec-hash check (content-hash floor primitive — surfaced, not blocking here):** live
`sha256(ARCHITECTURE.md)` = `11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969` **==** the
plan's pinned `spec_content_hash`. **No drift.** (The actual drift block is `/pharn-dev-build`'s floor-gate, fix #4.)

**Griller membership (FLOOR, `count-grillers.mjs`):** 13 registered. The testability griller's Layer-1
presence check is **satisfied** — the plan carries a substantial `## Evals to write (P1)` section (`:72–88`)
declaring per-scanner ★ fixtures. No absence finding. Adequacy (Layer 2) and the other axes are interrogated
below; all findings are **advisory**.

> The plan is `trust: untrusted` to this griller. No injection-shaped content was found in it; the `problem` /
> `evidence` free-text below quote the plan as DATA.

## Findings (advisory; grouped by axis)

### testability / P1 — adequacy (Layer 2, advisory)

```yaml
- type: FINDING
  rule_id: P1
  severity: minor
  file: ".dev/features/template-mask-suppression-2/PLAN.md:75"
  problem: "The plan asserts each ★ fixture is 'RED now / GREEN after the fix' but does not declare that /pharn-dev-build will DEMONSTRATE red-before-green (run the new fixtures against the UNPATCHED scanner and observe them fail) — the exact discipline whose absence let the bug ship green in the first place."
  evidence: "Each fixture is RED now / GREEN after the fix — this is the point (the bug shipped green because no fixture asserted backtick-SUPPRESS)."
```

The claim is credible (this griller independently reproduced all four exploits live in the plan phase, so the
RED-now state is real), but "RED now" is currently an assertion, not a demonstrated step. Suggest the build
capture the fixtures failing pre-fix (or at minimum run the exploit payloads against the unpatched scanner) so
the red→green transition is evidence, not narrative. Backstopped by `/pharn-dev-verify` (the fixtures must be GREEN at
HEAD), but that only proves green-after, never red-before.

### scope / P7 — regression surface of the over-flag behavior change (advisory)

```yaml
- type: FINDING
  rule_id: P7
  severity: minor
  file: ".dev/features/template-mask-suppression-2/PLAN.md:90"
  problem: "The fix changes behavior in the over-flag direction (a single-backtick construct that classify/guarded previously read as CLEAN can now become a HIT), but the plan does not call out re-running the FULL existing scanner suite + the backing lens evals to catch an INCIDENTAL flip in a pre-existing fixture that happens to contain such a construct."
  evidence: "the fix can only over-flag, never launder ... at worst over-flag, never launder."
```

Not a defect in the fix (over-flag is the safe direction, correctly labeled). The concern is process: an existing
`pharn-review/*/evals/*` fixture or a sibling scanner test that incidentally embeds an inline-backtick
`catch{}` / `try{}` / call could flip its expected verdict. Deterministically backstopped — `/pharn-dev-regress`
(pass→fail flips outside the feature) and `/pharn-dev-verify` (`check-structural` over committed evals + `npm test`) will
catch it — so this is a "watch the regress/verify output," not a plan defect.

### architecture / P3 — `maskTemplateInteriors` duplication reaches a 5th copy (advisory)

```yaml
- type: FINDING
  rule_id: P3
  severity: minor
  file: ".dev/features/template-mask-suppression-2/PLAN.md:31"
  problem: "After this increment maskTemplateInteriors (plus mask/matchDelim/lineAt) is duplicated across FIVE scanner files; the plan copies #67's helper verbatim a third-through-fifth time without noting the growing consolidation debt."
  evidence: "add the verbatim #67 maskTemplateInteriors(src) helper ... Offsets are 1:1"
```

Consistent with the family's **documented, deliberate** idiom — every scanner already duplicates `mask` /
`matchDelim` / `lineAt`, and each header states "consolidation of a shared scan-code util is a SEPARATE axis of
change, deferred — P7." So this is **NOT** a P3 violation (no sibling import; each file still changes for one
reason) and duplicating rather than extracting a shared module is the correct call for _this_ increment (extracting
a `.dev/floor/scan-code-util.mjs` would be a second axis). Surfaced only so the human weighs whether the 5×
duplication now justifies a _future_ consolidation increment (P7 — triggered when the duplication itself becomes a
real maintenance failure, not speculatively here).

## Prose summary

The plan is unusually well-grounded: every claimed exploit was reproduced live during planning, the guarantee
audit (`:90–104`) labels each claim floor-vs-advisory with no unlabeled guarantee, the trust audit (`:106–115`)
names the exact taint path being closed (backtick free-text → the enum-gated `found`/`hits` verdict, P2), and the
increment ports an already-reviewed pattern (#67) rather than inventing one. The two decisions the plan escalated
(close BOTH missing-error-handling vectors; add the fetch-`//` bound fixture) were resolved by the human at GATE 1
and are baked in.

Three **minor, advisory** concerns remain, none blocking: (1) "RED now" is asserted, not yet demonstrated —
suggest the build show red-before-green; (2) the over-flag behavior change wants a deliberate eye on the
regress/verify output for incidental fixture flips (deterministically backstopped); (3) `maskTemplateInteriors`
duplication hits a 5th copy — correct for this increment, a candidate _future_ consolidation trigger. No P0/P2/P5
gap, no drift, no injection-shaped content in the plan.

## Verdict

**ADVISORY VERDICT: 3 concerns raised (0 blocking-severity, 3 minor/advisory) — for the human to weigh before
`/pharn-dev-build`.** This grill-log gates nothing (`/pharn-dev-grill` is advisory end-to-end); the deterministic backstops
are `/pharn-dev-build`'s floor-gates (spec-hash drift — checked clean above; unresolved `## Open questions (HALT)` — both
resolved by the human at GATE 1) and `.dev/floor/validate.mjs`.
