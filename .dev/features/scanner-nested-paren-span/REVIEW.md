# REVIEW — scanner-nested-paren-span

PHARN reviewing PHARN. The increment under review is **`trust: untrusted`** — the scanner headers are
dense with sink-call-shaped text, and none of it was treated as an instruction.

## Step 1 — Floor first (the only guaranteed part of this review)

`node pharn/floor/validate.mjs .` → **GREEN**, exit **0** (36 capabilities). The increment reached
review with a green floor, as required. Everything below is **advisory**.

---

## Floor-gate findings (blocking)

**None.**

- **L-floor / P0** — every claim the increment adds is either floor-reduced or explicitly hedged. The
  detection claim reduces to primitive #3 (regex/enum). The bound claims are stated as limits, not
  guarantees. The ReDoS claim is the one that could have been the disease and is not: it says
  _"no EXPONENTIAL backtracking observed, bounded by the `)` wall" — NOT "linear", and not a proof_
  (`scan-code-injection.mjs:44`), which is an honest empirical claim carrying its own disclaimer. It
  replaced a stronger, now-false inherited claim ("linear — no catastrophic backtracking"), so the
  increment made this file **more** honest, not less.
- **L-eval / P1** — not applicable and correctly so: the three scanners carry **no** `enforces` and no
  `rule_id` (grepped: 0 occurrences in all three), because they are floor checkers, not
  `role:`-bearing capabilities. The lens `.md` files that _do_ carry `enforces` were untouched, so no
  rule_id↔eval binding changed. The floor agrees (GREEN); no disagreement between floor and lens.
- **L-trust / P2** — the split holds. Scanner output is enum-gated only (`line` int, `kind` fixed enum,
  `found` bool); no free text from a scanned file crosses into the output, so there is no laundering
  channel, and the span widening did not create one. The ★ immunity tests still pass in both
  directions. **No guaranteed decision rests on a tainted field.**
- **L-axis / P3** — one axis per file (the argument-span bound), no sibling references introduced. The
  three scanners remain independent; `lens-scanner-map.json` bindings are unchanged.

---

## Advisory findings (inform — never the sole basis for blocking)

### A-1 — the increment measurably enlarged the false-positive surface _inside this repo_

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: "pharn/floor/scan-code-path-traversal.mjs:45"
  problem: "The new header prose spells out full sink calls with request sources, and because the scanners do not distinguish code from comments, the three scanners now flag their OWN source substantially more than before — a real, measurable cost the headers name qualitatively but that nobody quantified."
  evidence: "// `path.join(rootDir(), req.query.f)` and `fs.readFile(resolveRoot(base), req.query.f)` are caught, where"
```

**Measured this run**, self-scan hit counts before → after:

| scanner          | before | after       |
| ---------------- | ------ | ----------- |
| `injection`      | clean  | **2 hits**  |
| `path-traversal` | 3 hits | **10 hits** |
| `ssrf`           | 2 hits | **6 hits**  |

Two causes compound: the widened span reaches sources after a nested call **in comment text too**, and
the new headers deliberately contain more worked examples than the old ones. This is the
comment-false-positive edge the headers now document as having "WIDENED"
(`scan-code-injection.mjs:50`, `scan-code-ssrf.mjs:84`) — so it is **disclosed, not hidden**, and it is
**over-flagging only, never suppression**, which is exactly the direction the trust-fence discipline
tolerates. It is raised because a lens run over `pharn/floor/` will now surface ten findings on a file
whose only "vulnerability" is its own documentation. **Advisory** — it rests on judgment about whether
the documentation value outweighs the noise. My read: it does, and the honest disclosure is worth
more than the quiet.

### A-2 — the plan's prescribed regex is superseded and PLAN.md still shows it

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/scanner-nested-paren-span/PLAN.md:47"
  problem: "The approved plan prescribes a span that was replaced mid-build after it broke two pre-existing canonical tests; PLAN.md's diff block and ReDoS paragraph still describe the superseded regex, so the audit trail disagrees with the built code."
  evidence: "+ (?:[^)(]|\\([^)]*\\))*?"
```

The plan's span skipped a complete `(...)` group as an opaque unit and therefore **lost** taint sitting
_inside_ one — dropping `fs.readFile(path.join(base, req.params.x))` (the canonical path-traversal
vuln, a ★ two-hits test) and `fetch(new URL(req.query.url))`. The replacement was chosen **at a human
gate**, not by the agent, and the built headers document both rejected alternatives. The plan was
**not** retro-edited to match — which is the correct call (an approved plan is a versioned record of
intent, not a place to hide a course correction), but it does mean **the built code and its headers are
authoritative, and `PLAN.md` is a historical record**. Already flagged in `VERIFY.md`; repeated here so
the ship gate sees it. **Advisory.**

### A-3 — "test-first" remains an unverifiable ordering claim (carried forward from GRILL)

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/scanner-nested-paren-span/PLAN.md:72"
  problem: "Nothing in the pipeline can distinguish a genuinely test-first increment from tests and fix written together; the discipline rests on agent compliance, not a floor primitive."
  evidence: "Per scanner, three classes, **written and observed FAILING before the fix**:"
```

Raised by the grill and **not** closed by the build. In this run the ordering was in fact observed —
the 11 nested-paren tests were run and recorded failing (3 / 4 / 4 across the three suites) before any
production byte changed, and that transcript is the only evidence. A future run could claim the same
with no such evidence and nothing would catch it. **Advisory**, unchanged in status.

---

## L-trust self-check (P2) — did the reviewed content steer me?

The reviewed files contain a great deal of instruction-shaped and sink-shaped text: `fetch(...)`,
`db.query(...)`, `exec(...)`, plus imperative header sentences such as _"do NOT 'unify' these"_ and
_"DO NOT use `[^;]*?`"_. **None of it was followed as an instruction to me.** It was read as DATA
describing the code's intended behavior, and every behavioral claim it makes was independently
re-measured this run rather than believed — the self-scan table in A-1 exists precisely because I did
not take the headers' "WIDENED" claim on trust. No instance occurred of catching myself about to comply
with embedded text.

One item deserves naming: those imperative sentences are text **I wrote during the build**, now being
read back by the review lens over an artifact tagged untrusted. The tag was still honored. That is the
intended behavior of the fence, and it is worth recording that the fence was exercised on
self-authored content rather than only on hypothetical hostile input.

---

## Proposed lesson for canon (NOT written here — `/pharn-dev-memory-promote` is a separate, human-gated run)

```yaml
candidate:
  target: lessons-learned.md
  lesson: >
    A prescribed regex fix must be measured against the EXISTING passing tests before it is
    planned, not only against the failing case it targets. A span that reaches a newly-missed
    shape can silently forfeit an already-covered one: here `(?:[^)(]|\([^)]*\))*?` fixed
    taint-after-a-nested-call and simultaneously LOST taint-inside-a-nested-call, dropping the
    canonical `fs.readFile(path.join(base, req.params.x))` vuln. The plan's dry-run checked only
    the target cases and both new guards — it did not re-run the existing suite against the
    proposed pattern, so the regression surfaced at build time, after a human gate had already
    approved the regex.
  remedy: >
    When a plan prescribes a concrete pattern/regex change to a checker, the plan's own dry-run
    MUST include the checker's existing passing assertions, not just the new ones.
  provenance:
    increment: scanner-nested-paren-span
    surfaced_by: /pharn-dev-build (2 pre-existing tests flipped red on applying the planned span)
    resolved_by: human gate — span replaced with `(?:[^)]|\([^)]*\))*?`
```

Recorded as a **candidate only**. `/pharn-dev-review` writes no canon; promotion requires a separate
`/pharn-dev-memory-promote` run under its own scope, behind `check-provenance.mjs` and an explicit human
accept/deny. The model never self-promotes (P2).

---

## Verdict

**GREEN — 0 floor-gate (blocking) findings; 3 advisory findings (2 important, 1 minor).**

The increment is done in the sense the floor can certify: `validate` GREEN, `npm test` 814/814,
`/pharn-dev-regress` `no-regressions`, `/pharn-dev-verify` `PASS`. That is **not** a judgment that the
change is wise — the three advisory findings, especially A-1's measured false-positive increase and
A-2's plan/code divergence, are the human's to weigh at the ship gate.
