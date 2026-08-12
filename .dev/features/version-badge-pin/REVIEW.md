# REVIEW — version-badge-pin

**Floor first (P0):** `node pharn/floor/validate.mjs .` → **GREEN**, 36 capabilities, exit 0. The
increment was eligible for review. Everything below the floor line is **advisory**.

The increment under review is `trust: untrusted`. Nothing in it read as an instruction to this reviewer;
the checker's header comments are descriptive prose about its own guarantees, which is what they should
be. No instruction-looking content changed this reviewer's behaviour.

---

## Floor-gate findings (blocking)

**None.** No guarantee is claimed without a floor reduction or an `advisory` label, no eval binding is
missing (none is owed — see L-eval), and no sibling reference exists.

---

## Advisory-gate findings

### L-trust → P2

```yaml
- type: FINDING
  rule_id: "P2"
  severity: important
  file: ".dev/floor/check-version-badge.mjs:150"
  problem: "Untrusted README text reaches operator stdout unsanitised on the ENUM_ERROR path — a badge value that FAILS the clean-scalar guard is then interpolated raw into the printed message, so control characters the guard exists to reject are emitted to the terminal anyway."
  evidence: '`if (!isCleanScalar(badge) || !VERSION_RE.test(badge)) { return finding("ENUM_ERROR", README_PATH, `badge value "${badge}" is not a <major>.<minor>.<patch> version`); }` — the short-circuit means the raw value is printed precisely in the case where it was found unclean.'
```

**Reproduced live, not inferred.** A README containing
`img.shields.io/badge/pharn-<ESC>[31mPWNED<ESC>[0m-blue` was fed to the checker; `od -c` on its stdout
shows `033 [ 3 1 m` — the escape reaches the terminal. It is reachable because the extraction class
`[^-\s)]+` excludes whitespace but **not** other control characters, which is exactly the gap
`isCleanScalar` was composed in to close; the message then reintroduces it.

**Bounded, and the bound matters.** The **verdict is unaffected** — the exit code is `1` either way, so
no guaranteed decision rests on the tainted value, and `check-verify.mjs` never sees it. This is a
free-text rendering defect, not a gate bypass. But "free text is rendered as quoted DATA, never emitted
raw" is the discipline this repo applies to every finding it produces (`pharn/ARCHITECTURE.md §8`,
fix #1), and a checker in a repo whose thesis is untrusted-input handling should not be the exception.

**Remedy** (not applied — `/pharn-dev-review` writes only this file): print a sanitised rendering on that
path, e.g. escape or elide non-printing characters before interpolation, and add a mutant test asserting
no `\x1b` survives into stdout. Small, and it belongs in this increment rather than a follow-up, because
the file is new and the defect ships with it.

### L-floor → P0

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: "CHANGELOG.md:11"
  problem: "The entry's headline sentence claims a stronger guarantee than the guarantee audit supports, and it sits in the most scannable position in the entry."
  evidence: '"and a checker now makes that impossible to repeat silently" — but the checker''s own header correctly narrows this to "cannot drift UNDETECTED by npm run check or CI"; a working tree can still drift until a gate runs, and the CI half rests on a pin that cannot prove GitHub executed the job.'
```

**Mitigated but worth recording.** The same entry states the narrowing explicitly three paragraphs
later ("What it does not buy, stated rather than implied"), so the entry as a whole is honest — but a
reader who scans only the bolded lead gets the unqualified claim. "Impossible" is the register P0 warns
about. **Remedy:** soften the headline to match the audit (e.g. "and a checker now REDs the gate the
moment it drifts"), or move the narrowing earlier.

### L-eval → P1

**No finding, and the floor agrees.** No `role:`-bearing Capability is added, so no `evals/cases/*` +
`evals/expected/*` pair is owed and no `rule_id` binding exists to check; `validate.mjs` independently
reports the same 36 capabilities as before, confirming the lens and the floor do not disagree. The
substitute the plan named — a `*.test.mjs` suite — shipped: 27 tests, mutant-first, of which the
load-bearing ones assert the checker **fails** when its guard is broken rather than passes when all is
well (L4).

### L-axis → P3

**No finding.** `check-version-badge.mjs` has one reason to change (how the badge is located and
compared); its test file has one (what is asserted about that). No `reads:` entry and no prose reference
crosses a sibling module root — the checker is `.dev/` apparatus and references no `pharn-*` module at
all.

---

## Proposed lesson candidate (NOT written to canon here)

`/pharn-dev-review` declares no `.dev/memory-bank/**` path and cannot write canon. This is a **proposal**
for a separate, human-gated `/pharn-dev-memory-promote` run.

**Candidate — a promoted lesson's stated MECHANISM can be false while its REMEDY is sound; assert the
mechanism in a test rather than inheriting it.**

`.dev/memory-bank/lessons-learned.md` **L14** (promoted 2026-07-09, human-approved) states that
JavaScript `$` without the `m` flag "matches at end-of-string OR just before a single trailing newline,
so `/^P[0-7]$/.test('P2\n') === true`". Verified live on Node v24.13.1 this run: that expression is
**`false`**. `$` without `m` matches only at end of input in JavaScript; the described behaviour is
Perl/Python/PCRE and requires the `m` flag here.

**Why it matters.** L14's remedy — compose the clean-scalar guard _before_ the shape regex, never
replace it — is correct and this increment follows it. But its stated _reason_ is wrong, so anyone
applying L14 by reasoning from its mechanism reaches a wrong model of what the guard buys. This
increment did exactly that in its first draft: the checker's header asserted a trailing-newline hole
that does not exist, and the plan's own `applied_lessons` line for L14 repeated it. It surfaced **only**
because the test suite asserted L14's example as an explicit precondition and the assertion **failed**.
Had the test merely asserted `isCleanScalar("2.5.1\n") === false` — true, and passing — the false claim
would have shipped with a green suite.

It is the P0 disease aimed at canon itself: "the lesson is promoted and human-approved" read as
"therefore its technical claims are true." It complements **L20** (a lesson whose only remedy is
discipline will recur) along a different axis — L20 concerns a remedy that is the wrong _kind_, this one
a rationale that is simply _false_ while the remedy stays right, which is harder to notice precisely
because following the lesson still produces correct code.

**Provenance:** feature `version-badge-pin`; base commit `c583c1f`; source
`.dev/features/version-badge-pin/VERIFY.md` + the failing-then-corrected assertion now pinned in
`.dev/floor/check-version-badge.test.mjs` ("✧ CANON DEFECT: JS `$` does NOT match before a trailing
newline"). Reproduced live before and after. **Note the promotion should also correct L14 itself** —
that is a canon edit and belongs to the same gated run, not to this one.

---

## Also surfaced, deliberately out of scope

`.claude/commands/pharn-dev-verify.md:100` asserts its gate set is "exactly the repo's `npm run check`
aggregate"; live it is a strict subset (`docs:check` and `check:markers` were already outside it, and
`check:badge` is now a third). Raised at `/pharn-dev-grill`, and **not** fixed here: the file is not in the
approved plan's `## Files`, so writing it would mean widening an approved scope mid-run, and the defect
predates this increment on a different axis. Follow-up: `verify-gate-map-claim`.

---

## Verdict

**GREEN on the floor — 0 blocking floor-gate findings.** Two advisory findings stand: one **important**
(P2 — untrusted text reaching stdout raw, reproduced live, verdict unaffected) and one **minor** (P0 —
a headline claim stronger than its own audit).

Stated honestly: this review is **advisory**. `validate.mjs` GREEN is the only guaranteed content in it;
the severities above are this reviewer's assignment, not a deterministic verdict, and neither finding
blocks — the human decides at the post-review gate whether the P2 finding is fixed in this increment or
deferred. My own recommendation is to fix it here, because the file is new and would ship with the
defect.
