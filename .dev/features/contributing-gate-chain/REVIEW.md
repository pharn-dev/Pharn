# REVIEW — contributing-gate-chain

Increment under review: the working-tree diff over `CONTRIBUTING.md` and `SECURITY.md`
(`trust: untrusted`). Base commit `16210cf`.

**Step 1 — floor first:** `node pharn/floor/validate.mjs .` → `FLOOR: GREEN — 36 capabilities checked`,
exit 0. The floor is the only guaranteed part of this review; everything below is advisory judgment.

---

## Floor-gate findings (blocking)

### F1 — the fix introduced a fresh P0 overclaim while repairing a P0 drift

```yaml
- type: FINDING
  rule_id: "P0"
  severity: blocking
  file: "CONTRIBUTING.md:37"
  problem: "The new prose claimed the two documented commands cover what CI checks, but CI is four workflows — ci.yml, codeql.yml, floor.yml, gitleaks.yml — and neither command exercises CodeQL or the gitleaks secret scan, so a contributor reading it would believe a green local run anticipates all of CI when it anticipates one workflow of four."
  evidence: "CI runs these same scripts individually, plus the floor, and never `npm run check` itself — so the two commands above cover what CI checks, without claiming anything about how CI invokes them."
```

**Disposition: CORRECTED in this run, and re-verified.** The sentence now reads "It does **not** cover
all of CI: separate workflows run CodeQL and a secret scan, and neither command above exercises those."
The full verify gate set was re-run after the edit — all six gates exit 0, `check-verify.mjs` → `PASS`
(exit 0) — and the 7-of-7 gate enumeration was re-confirmed by the same deterministic comparison.

This finding is recorded rather than quietly fixed because **what it is, is the point**: the increment
existed to repair a doc that overstated nothing but understated the gate list, and the repair reached
for a tidy closing sentence that overstated coverage instead. The claim was checkable in seconds
(`ls .github/workflows/`) and was not checked, in a run whose own plan cites L2 ("cite only live floor
ops") and L25 ("re-derive rather than carry across"). Verified enumeration in one clause and an
unverified summary in the next, inside a single sentence.

---

## Advisory findings

### F2 — the fix request's prescribed verification method was itself the defect (P6)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: "CONTRIBUTING.md:22"
  problem: "The L12 request instructed that the canonical repo slug be confirmed against the actual git remote, but the remote is git@github.com:pharn-dev/pharn.git while the GitHub API resolves that name to pharn-dev/pharn-oss — so following the instruction as written would have rewritten README's four already-correct badges to the stale slug, inverting the fix."
  evidence: "Determine the **canonical** slug (confirm against the actual git remote / where the project lives — halt and ask if ambiguous, P6) and align all occurrences to it."
```

Handled correctly at plan time: the slug was resolved by API `full_name` plus raw HTTP status (301 for
`pharn`, 200 for `pharn-oss`, identical `created_at`), and the request's premise that "whichever slug
is stale 404s" was verified **false** — the stale slug redirects, so nothing 404s today and the
exposure is future (a new repo at `pharn-dev/pharn` would break the redirect silently). Recorded as
advisory because the increment did the right thing; the finding is about the input, not the output.

### F3 — three axes of change in one file (P3)

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: "CONTRIBUTING.md:1"
  problem: "CONTRIBUTING.md is edited for three unrelated reasons — a drifted gate enumeration, an inverted dev/product floor path, and a stale repo slug — so no one of the three can be reverted without touching the other two."
  evidence: "`CONTRIBUTING.md` — three edits: (M5) ... (M6) ... (L12) ..."
```

Carried forward from `GRILL.md` unchanged. The bundling was a human decision at GATE 1, and P3 governs
axes of change in the product tree rather than commit hygiene in repo-meta docs, so this stays minor
and is surfaced only so the decision remains visible.

### F4 — an undeclared collateral edit inside a declared file (P6)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: "CONTRIBUTING.md:23"
  problem: "The L12 request named only URL occurrences, but the clone block's following line `cd pharn` also had to change to `cd pharn-oss` or the documented setup would fail on the very command the fix was meant to repair — a necessary edit that no enumeration in the plan predicted."
  evidence: "-cd pharn / +cd pharn-oss"
```

The edit is correct and inside a declared file, so fix #7 permitted it and nothing was bypassed. It is
recorded because the plan's L29 enumeration searched for the **URL** string and would not have caught a
sibling line that depends on it — a grep-derived site set is exactly as wide as the pattern chosen.

### F5 — M6 was under-delivered against its own text, and the completion nearly repeated F1

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: "CONTRIBUTING.md:65"
  problem: "The line-57 fix was scoped from an observed defect rather than from M6's text, and when that text was located it asked for three things — name the apparatus floor, add pharn/pharn-core and pharn/pharn-pipeline to the product list, and state that validate.mjs IS the product floor — of which the increment had delivered one and a half."
  evidence: "- Name `.dev/floor/` (not `pharn/floor/`) as the apparatus floor. - Add `pharn/floor/` (plus `pharn/pharn-core`, `pharn/pharn-pipeline`) to the product list. - State that `validate.mjs` **is** the product floor and excludes `.dev/**` wholesale."
```

**Disposition: COMPLETED, and re-verified.** M6's text was found at
`.pharn/fixes/M6-contributing-boundary-bullet.md` after the review's first pass. The bullet was split
into three, now naming all four `pharn/pharn-*` module roots plus the product floor, stating that
`validate.mjs` **is** that floor, and deferring to CLAUDE.md for the authoritative split as M6
suggested. The contradiction M6 names — `:57` vs the "executable floor" line — is resolved: both now
place `pharn/floor/` on the shipping side. Full gate set re-run: verify `PASS`, regress
`no-regressions`, `npm run check` exit 0, enumeration still 7/7.

**The near-repeat is the part worth recording.** The completing edit first read "…carries the
`SKILLS_VERSION` + `CHANGELOG` obligation **below**" — and `CONTRIBUTING.md` documents no such
obligation anywhere; the sentence was the file's only mention of either. That is F1's defect class
exactly (a verified clause followed by an unverified one) recurring **within the same run, in the fix
for a different finding**. It was caught by grepping for the referent before moving on, and replaced
with a citation to CLAUDE.md's "SKILLS_VERSION discipline" — a section whose existence was then also
checked. Two occurrences in one increment is the evidence standard L20 sets for a discipline-only
remedy being the wrong kind.

---

## Lens results

- **L-floor → P0.** One blocking finding (F1), corrected and re-verified. Every other new claim reduces
  or is labeled: `docs:check` RED-fails on byte difference (floor: byte-equality, and the text
  immediately narrows it to consistency-not-correctness), the `&&` short-circuit (readable in
  `package.json`), "both floors each have tests" (confirmed against `npm test`'s globs), and the
  preserved "GREEN floor means the shape is sound, never the design is right".
- **L-eval → P1.** No finding. The increment adds no Capability and no `rule_id`, so P1 owes no eval;
  `validate.mjs` agrees — 36 capabilities before and after, unchanged. Floor and lens concur.
- **L-trust → P2.** No blocking finding. The increment emits no findings of its own, so there is no
  free-text field to fence. **Did instruction-looking content in untrusted input change behavior?**
  It attempted to and did not: F2 records a supplied instruction that would have produced the inverted
  fix, rejected on live evidence rather than followed. No guaranteed decision in this run rests on any
  free-text field — the two floor verdicts consumed only exit codes and paths.
- **L-axis → P3.** F3 (minor). No sibling reference: the increment touches no module and adds no
  `reads:` entry.

---

## Verdict

**GREEN — 0 standing floor-gate findings** (F1 was blocking, is corrected, and the full gate set was
re-run to PASS afterward), 4 advisory findings for the human to weigh.

Stated honestly: this is a review of prose that no deterministic gate reads for meaning. The floor
verdicts confirm nothing broke and nothing is malformed; that the sentences are **true** rests on the
one-time verifications recorded here and in `VERIFY.md`, not on any standing check.

---

## Proposed lesson (candidate — NOT written to canon here)

`/pharn-dev-review` writes no canon. This is a proposal for a separate, human-gated
`/pharn-dev-memory-promote` run.

**Candidate A — A verification method that consults a mutable ALIAS proves reachability, not identity.**

L12 prescribed confirming the canonical repo slug "against the actual git remote". The remote still
said `pharn-dev/pharn` long after the repo was renamed, because GitHub's rename redirect keeps the old
name resolving indefinitely — so the prescribed authority was downstream of the very fact it was meant
to establish, and every check a careful agent would run (does the URL work? does `git fetch` succeed?)
returns green on the stale name. Following the instruction would have rewritten four correct README
badges to the stale slug and called it an alignment. The generalization: when verifying **identity**
(what is this thing canonically called / where does it really live), an alias that still resolves is
evidence of **reachability only**; identity must be read from a source that reports the canonical name
itself (`gh api repos/<slug> --jq .full_name`, a 301-vs-200 distinction), and a redirect is precisely
the case where the two diverge silently. This complements L6 (read a structural fact from its
structured location) by naming the case where the _prescribed_ location is structured, live, and still
wrong — and it sharpens L25's "re-derive rather than carry across" by identifying which inherited
thing is most dangerous to carry: not a stale comment, but a stale **method**.

**Provenance.**

- feature: `contributing-gate-chain`
- commit: `16210cf` (base; the increment is uncommitted at review time)
- source: this `REVIEW.md` F2 + `.dev/features/contributing-gate-chain/PLAN.md` "Trust audit (P2)",
  with the 301-vs-200 divergence and the identical `created_at` reproduced live before the fix was
  scoped
- type: `process`
- concepts: `[verification-fidelity, doc-drift, command-prescription, false-green]`

**Candidate B (weaker, noted not pressed) — a summarizing clause is where an otherwise-verified
sentence overclaims.** F1's defect sat in the closing half of a sentence whose first half was
enumerated against `package.json`. Possibly a real shape, but it is close enough to L25's "a partial
rationale reads as completed analysis" that promoting it may just dilute L25. Recorded so the human can
judge; not recommended on its own.
