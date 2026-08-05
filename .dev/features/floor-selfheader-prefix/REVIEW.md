# REVIEW — `floor-selfheader-prefix`

**Step 1, floor first (P0):** `node pharn/floor/validate.mjs .` → **GREEN**, 36 capabilities, exit 0. The
increment reached review legitimately. Everything below this line is **advisory** (P0); the floor result
above is the only guaranteed part of this review.

Increment under review is `trust: untrusted`. 14 files, 29 rewrites, no logic change.

---

## Floor-gate findings (blocking)

**None.** No guarantee in this increment lacks a floor reduction or an `advisory` label; no eval binding
is missing (none is introduced); no sibling reference is created.

---

## Advisory findings

### L-floor → P0

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/floor-selfheader-prefix/PLAN.md:120"
  problem: "The approved PLAN.md still states the LEAVE-SET guarantee in its overstated form while GRILL.md and the CHANGELOG entry state the corrected, partial form — so the increment's own artifacts disagree about what is floor-backed, and the PLAN is the one a reader treats as the versioned record of intent."
  evidence: '"**\"The LEAVE-SET test data was not mutated\"** → **FLOOR: enum/regex** … so any wrong rewrite of them fails `npm test` immediately. This is the increment''s principal risk and it is genuinely floor-backed."'
```

**Advisory, and the disagreement is deliberate** — worth stating so the human can overrule it. `GRILL.md`
established (against live test source) that only the _assertion_ lines are floor-guarded, while
`check-regress.test.mjs:87/96/98` and the `REGR` fixtures in `check-ship.test.mjs:51` /
`check-loop.test.mjs:63` are protected **only** by the comment-only rule. The CHANGELOG entry carries the
corrected wording. `PLAN.md` was **left unedited on purpose**: it was approved at GATE 1, and silently
rewriting an approved plan's claims after the fact would undermine the versioned-intent thesis more than
the stale sentence costs. The correction is therefore recorded in the three later artifacts rather than
backported. **If the human prefers the plan corrected, that is a one-line edit** — but it should be a
human's call, not the builder quietly revising its own approved record.

### L-axis → P3 (and the increment's own stated purpose)

```yaml
- type: FINDING
  rule_id: "P3"
  severity: important
  file: "pharn/floor/check-ship.mjs:5"
  problem: "The existence-gate leaves three different path spellings on a single comment line, so the header line this PR touched is now less internally consistent than the uniformly-abbreviated line it replaced — a legibility cost on exactly the axis the increment exists to improve."
  evidence: "// like pharn/floor/check-verify.mjs / pharn/floor/check-regress.mjs / floor/check-variance.mjs / check-structural.mjs,"
```

**This is the review's real catch, and the grill did not anticipate it.** Three of the six checkers now
carry mixed forms in one sentence:

| file                | line 5 after this PR                                                                                             | spellings |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- | --------- |
| `check-ship.mjs`    | `pharn/floor/check-verify.mjs / pharn/floor/check-regress.mjs / floor/check-variance.mjs / check-structural.mjs` | **3**     |
| `check-verify.mjs`  | `pharn/floor/check-regress.mjs / floor/check-variance.mjs / pharn/floor/check-structural.mjs`                    | 2         |
| `check-regress.mjs` | `floor/check-variance.mjs and pharn/floor/check-structural.mjs`                                                  | 2         |

The rule behaved exactly as designed — condition 1 (existence-gating) correctly refuses to invent
`pharn/floor/check-variance.mjs`, which does not exist. But _correct_ and _legible_ diverge here. The
`check-ship.mjs` line is the worst case: prefixed, bare, and bare-with-no-directory, in one list.

**The accurate fix is available and is not a prefix rewrite:** `check-variance.mjs` genuinely lives at
`.dev/floor/check-variance.mjs`, so writing that full path would make every one of these lines both
correct **and** uniform. The 4-condition rule forbids it (condition 1 gates on existence _in
`pharn/floor/`_), which is why this surfaces at review rather than during the build. Three options for
GATE 2:

1. **Ship as-is** — every token is individually accurate; the lines are just mixed. The dangling-ref
   cleanup was already scoped as a separate concern in the plan.
2. **Widen this PR** to rewrite the three `floor/check-variance.mjs` → `.dev/floor/check-variance.mjs`.
   Small, uniform, and it resolves the dangling refs the plan deferred. Would be a **declared scope
   widening** beyond the approved `## Files` rule (the files themselves are already in scope).
3. **Fold into the follow-up** README/accuracy feature, which is already chartered to fix stale paths.

### L-trust → P2

**No finding.** The increment emits no findings and introduces no free-text field; there is nothing for
taint to propagate through. No instruction-looking content was encountered in the reviewed `.mjs` files —
their comments are usage text and cross-references, not directives.

**One positive control worth recording, since this lens exists to catch exactly this.** The task brief
supplied to the pipeline asserted, under its own `## VERIFY` heading, that _"`npm test` GREEN is the real
guard AND this time it genuinely covers the risk."_ That is a **claim inside input**, and the correct
handling was to treat it as data and check it — which happened: live reading of `check-structural.test.mjs`
showed **zero** tests on the no-args path, and reading `check-regress.test.mjs` showed three LEAVE-SET
lines whose tests assert only exit codes. The brief's claim was **partially false** and was corrected in
`PLAN.md`, `GRILL.md`, and the CHANGELOG rather than adopted. Not an attack — a human's good-faith
overstatement — but the same discipline that defeats an attack is what caught it.

### L-eval → P1

**No finding.** The increment introduces no `role:`-bearing capability and no `enforces` `rule_id`, so P1's
binding requirement does not attach. The floor agrees: `validate.mjs` reports the capability count
**unchanged at 36**, and no eval-binding check fired. Lens and floor concur — no disagreement to report.

---

## Verdict

**GREEN — 0 floor-gate (blocking) findings; 2 advisory findings (both `important`).**

The increment is structurally sound and its deterministic verdicts are all clean (`validate` exit 0,
`regress` `no-regressions`, `verify` `PASS`). Neither advisory finding concerns the correctness of a
rewritten token; both concern **presentation** — one an inconsistency between the increment's own
artifacts, one an inconsistency the rule leaves inside three comment lines. Both are cheap to resolve and
both are the human's call at the post-review gate.

**GREEN here means "the floor is green and the lenses raise no blocking finding." It does not mean the
increment is wise, or that the comment text is right** — 22 of its 23 checker rewrites are unobservable to
every gate in this pipeline (P0).

---

## Proposed lesson candidate (NOT written to canon — P2/P7)

Recorded here only. Promotion is a separate, human-gated `/pharn-dev-memory-promote` run under its own scope,
behind `check-provenance.mjs` and an explicit accept/deny. `/pharn-dev-review` declares no
`.dev/memory-bank/**` write and performed none.

- **Candidate id:** `L-baseline-capture-harness-red`
- **Provenance:** increment `floor-selfheader-prefix`; observed live in this run's `/pharn-dev-regress` Step 2
  (first baseline capture) and independently in `/pharn-dev-verify` Step 1 (first gate capture).
- **Lesson (proposed):** _A gate that reds because the **capture harness** failed is indistinguishable, in
  the results map, from a gate that reds because the **code** failed — and when the same broken harness runs
  on both sides of a comparison, the equal reds are filed as `pre_existing` and silently **mask** the real
  gate. Confirm any non-zero baseline exit by reading the tool's output before recording it._
- **Why it generalizes beyond L5:** `.dev/memory-bank/lessons-learned.md` L5 names the **zsh
  word-splitting** instance. This run hit a **different** instance of the same class — `xargs -a` is a GNU
  flag and macOS ships **BSD xargs**, which exits 1 without ever invoking `node --test`. Same masking
  mechanism, different cause, so the existing L5 wording would not have prevented it. A second, unrelated
  instance appeared minutes later at verify: three gates (`test`, `format:check`, `lint:md`) went red from
  **one** malformed markdown table in a pipeline artifact written _after_ `/pharn-dev-build`'s Step 2b
  formatting — reds that pointed at the increment but originated in the pipeline's own output.
- **Real failure, not hypothetical (P7):** both occurred in this run and are recorded in `REGRESSION.md`
  ("A fabricated red, caught and corrected") and `VERIFY.md` ("Two style reds, found and fixed at this
  stage").
