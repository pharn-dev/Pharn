# GRILL — seam-guess-hardening (ADVISORY)

Header: interrogates `.dev/features/seam-guess-hardening/PLAN.md`. **Spec-hash check: MATCH** — `sha256(ARCHITECTURE.md)` = `11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969` == the plan's `spec_content_hash` (no drift; the deterministic block on drift is `/pharn-dev-build`'s floor-gate — surfaced here, not enforced here).

Grillers registered (FLOOR membership, `count-grillers.mjs`): **13**. Relevant to a markdown-spec increment: **testability, architecture, comprehension, security, coupling, documentation**. Applied inline (the live isolated runner is deferred, P7). The application-oriented axes (**a11y, i18n, migrations, privacy, performance, observability, error-handling**) are **N/A** — this increment ships no application code, schema, UI, or data path.

Griller Layer-1 results: **testability — verification approach PRESENT** (populated `## Evals to write`, three eval declarations) → no absence finding. **architecture — FIT recognized** (edits stay in `pharn-core` / `pharn-contracts` / `.claude/commands`; `seam-resolver` reads down to `pharn-contracts/seam-config.md`; no leaf→leaf coupling, no layer inversion, no reinvented mechanism) → no P3 finding. All findings below are **Layer-2 ADVISORY**.

## Findings (all ADVISORY — `/pharn-dev-grill` gates nothing; the enum-gated / free-text split is honored)

```yaml
- type: FINDING
  rule_id: "P0" # guarantee-audit / implementation-precision
  severity: important # advisory assignment (fix #3) — a grill finding never gates
  file: ".dev/features/seam-guess-hardening/PLAN.md:25"
  problem: "FIX 5's rule as worded ('default ONLY when the file is ABSENT; a parse error → HALT') is two-way and imprecise; the build must implement a THREE-way distinction or it will break the current valid-but-seamless pharn.config.json."
  evidence: "PLAN line 25: 'FIX 5 (extraction one-liner: default **only** when the file is ABSENT; a parse error → **HALT**...)'. The live root pharn.config.json is present + valid JSON + has NO `seam` block, so it must still take `c.seam ?? default-seam` (present+valid+seam-absent → default), distinct from present+malformed → HALT and absent → default."
```

```yaml
- type: FINDING
  rule_id: "P2" # trust posture consequence of the GATE-1 choice
  severity: important # advisory
  file: ".dev/features/seam-guess-hardening/PLAN.md:50"
  problem: 'By keeping FIX 4 advisory (GATE-1 decision), the extra-field injection channel stays LIVE at the floor — a poisoned {"note":"..."} still validates GREEN and is read by the model; the fence is a strengthened advisory instruction, not a floor closure.'
  evidence: 'PLAN line 50: ''the model still *reads* the poisoned free-text and "ignore it" is a **heuristic** — the **named, bounded residual** ... **not floor-closed** this increment.'' Re-surfaced so the residual is consciously owned; bounded because the verdict never reads the field, not zeroed because the walking model does.'
```

```yaml
- type: FINDING
  rule_id: "P1" # eval adequacy (Layer 2, advisory)
  severity: minor # advisory
  file: ".dev/features/seam-guess-hardening/PLAN.md:26"
  problem: "The fetch-thin-skips-to-ask eval demonstrates the fail-safe SKIP direction but cannot deterministically prove FIX 2's specific 'absent ⇒ high' default — a lower default (medium/low) would also skip on genuinely thin docs, so the exact bar rests on the doc, not the eval."
  evidence: 'PLAN line 26: config ''["fetch","ask"]'' with ''modelConfidenceThreshold **omitted** (exercises the default)''. A semantic judge sees ''skipped on thin docs'', consistent with any threshold; the eval evidences direction, not the exact default value (which is advisory anyway).'
```

```yaml
- type: FINDING
  rule_id: "P1" # verification of FIX 5 (Layer 2, advisory)
  severity: minor # advisory
  file: ".dev/features/seam-guess-hardening/PLAN.md:51"
  problem: "FIX 5's parse-error→HALT behavior has NO automated verification — it is untested bash by design — so a future edit could silently reintroduce the swallow with no test to catch it."
  evidence: "PLAN line 51: 'the extraction one-liner is untested bash **by design** (pharn-build.md:195) ... A floor-covered (tested-helper) extraction remains a **separate future increment** (P7).' Accepted labeled limit; the verification for FIX 5 is reasoning, not a gate."
```

```yaml
- type: FINDING
  rule_id: "P4" # comprehension / naming (advisory)
  severity: minor # advisory
  file: ".dev/features/seam-guess-hardening/PLAN.md:67"
  problem: "After FIX 1, a field literally named `modelConfidenceThreshold` will govern the `fetch` step too; the name implies model-only, so the docs must make the broadened scope explicit or a future reader will mis-scope it."
  evidence: 'PLAN line 67: ''FIX 1 reuses `modelConfidenceThreshold` for the fetch gate (generalized to "the bar the resolved answer must clear at any model-judgment step")''. The reuse is the non-speculative choice; the name/behavior gap must be closed in prose, not left implicit.'
```

```yaml
- type: FINDING
  rule_id: "P7" # scope / smallest-increment (advisory)
  severity: minor # advisory
  file: ".dev/features/seam-guess-hardening/PLAN.md:68"
  problem: "The increment bundles five fixes across three product/command files plus four eval files; whether this is the SMALLEST coherent increment vs. two (doc-hardening + FIX-5 bash) is a judgment the human already resolved (one PR) but is surfaced per P7."
  evidence: 'PLAN line 68: ''One increment, one axis ("guess-instead-of-ask closure"), one PR.'' The fixes are interdependent (FIX 1''s gate needs FIX 2''s default bar; FIX 3/FIX 2 pair on haltOnUnknown), which supports coherence; noted, not objected to — GATE-1 accepted one PR.'
```

## Prose summary

The plan is **honest and internally consistent** — its guarantee audit correctly relabels FIX 4 to advisory after the GATE-1 change, keeps the terminal-`ask` floor invariant intact, and adds no new floor primitive or floor behavior change. Verification is present (three evals), architecture fits, and every claim carries a floor/advisory label.

The two concerns worth the human's attention before/at build time are both **important-advisory**, not gaps in reasoning:

1. **FIX 5 implementation precision (P0).** "Default only when absent" must not be read literally as two-way. The build must preserve the **present + valid + seam-absent → `c.seam ?? default`** path (today's live `pharn.config.json` is exactly that shape), and HALT **only** on a genuine parse error. A too-literal implementation would break the current GREEN build — a downstream `/pharn-dev-regress` / `/pharn-dev-verify` risk to watch.
2. **Live injection residual (P2).** The GATE-1 choice to keep FIX 4 advisory is legitimate and honestly labeled, but it means the `{"note":"…"}` channel remains open at the floor (bounded: the verdict never reads it). The new hostile fixture `injected-extra-field-ignored` probes the advisory fence — its injected string must be quoted **as DATA** in the expected, never echoed as guidance.

The remaining three are minor: the fetch-thin eval evidences direction not the exact `high` default (P1), FIX 5 is untested-by-design (P1), and the `modelConfidenceThreshold` name now spanning `fetch` needs explicit prose (P4). The five-fix bundle (P7) was consciously accepted at GATE 1.

## Verdict

**ADVISORY VERDICT: 6 concerns raised (0 blocking-severity, 2 important-advisory, 4 minor-advisory) — for the human to weigh before `/pharn-dev-build`.** No finding blocks the build; the only deterministic stop that applies is the spec→plan hash chain, which **MATCHED** this run. `/pharn-dev-grill` surfaces; it does not ensure the plan is sound (P0).
