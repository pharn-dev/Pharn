# REVIEW — loop-handoff

**Floor first (P0):** `node pharn/floor/validate.mjs .` → **GREEN**, 36 capabilities. Re-run live this
review, not carried from the build. The floor is the only guaranteed part of this review; everything
below is **advisory**.

**Increment under review** (`trust: untrusted`, including the parts this session wrote): 3 new files
(902 lines) + 5 edits — `pharn/pharn-contracts/loop-record.md`, `pharn/floor/check-loop-record.mjs`,
`pharn/floor/check-loop-record.test.mjs`, `.claude/commands/pharn-loop.md` (+139/−14), `CHANGELOG.md`,
`CLAUDE.md`, `README.md` (generated region), `SKILLS_VERSION`.

---

## Floor-gate findings (blocking — the increment is not done)

### F1 — the checker contradicts its own honesty note, in the one place it matters

```yaml
- type: FINDING
  rule_id: P0
  severity: blocking
  file: "pharn/floor/check-loop-record.mjs:266"
  problem: "An inline comment asserts the exact-equality check is 'what keeps untrusted body text from forging a heading' — a guarantee with no floor reduction, which the same file's header explicitly identifies as a claim that 'would be false'."
  evidence: '`// EXACT LIST EQUALITY, in order — this is what keeps untrusted body text from forging a heading.` (:266) against `// no notion of "intended as prose", and no checker can invent one — so this is NOT forgery-proofing, and claiming it would be false.` (:53-55).'
```

**Why blocking rather than a nit.** The claim is not merely imprecise — it is the **disease in
miniature, inside a floor checker**: an unreduced guarantee ("keeps X from happening") asserted about a
mechanism the same file proves cannot provide it. It survived because the header, the contract, the
tests, and the CHANGELOG were all corrected mid-build when the claim was falsified, and this one line
was not. That is exactly how a false guarantee outlives its own refutation. A reader who skims to the
implementation reads the false version; the true one is 200 lines up.

**The fix is one line:**

```text
// EXACT LIST EQUALITY, in order — this buys UNAMBIGUITY, not forgery-proofing (see the header): any
// collision necessarily yields an extra/duplicate/reordered heading, which this refuses.
```

### F2 — `iterations` is the only envelope field whose value-correctness is left unqualified

```yaml
- type: FINDING
  rule_id: P0
  severity: blocking
  file: "pharn/pharn-contracts/loop-record.md:79"
  problem: "The trust-class table qualifies decision, commit and date with an explicit advisory caveat about whether the VALUE is true, but gives iterations the unqualified trust 'trusted (regex + integer compare)' — although it is captured by the same command Bash and is equally a shape-valid lie."
  evidence: "`| iterations | ^\\d+$ **and** >= 1 | trusted (regex + integer compare) |` (:79), against the sibling rows `that it names the real HEAD is advisory` (:80) and `that it is the real date is advisory` (:81)."
```

**Why blocking.** The asymmetry reads as a **claim**: three fields carry a caveat, one does not, so the
one that does not appears to be trusted end-to-end. It is not. Nothing checks that `iterations` equals
the loop's real iteration count, that it is ≤ `--cap`, or that it bears any relation to what
`check-loop.mjs` was passed as `--iter` — a record may honestly say `iterations: 99` under `--cap 3` and
pass. That is the same class the contract already names for `decision` (membership is gated, agreement
is not), and it should be named identically here rather than left to inference. **The fix is the trust
cell:** `trusted (regex + integer compare); that it equals the loop's real iteration count is advisory`.

---

## Advisory findings (inform; never a basis for a guaranteed block)

### F3 — the RED message generalizes past what the mechanism does

```yaml
- type: FINDING
  rule_id: P0
  severity: minor
  file: "pharn/floor/check-loop-record.mjs:272"
  problem: "The operator-facing refusal says 'an accidental quote of the record's own shape trips this' without the qualifier LINE-INITIAL, so a reader may conclude that any mention of the subsection names in a body is unsafe — which the tests prove false."
  evidence: "`A body line that reads as \\`### <name>\\` IS a heading, so an accidental quote of the record's own shape trips this` (:272-273), against the committed test `★ the same name INLINE in a body (back-ticked, not line-initial) is prose → GREEN`."
```

The remedy the message gives ("Fence such a quote") is correct either way, so this misinforms without
misdirecting. Worth one word — `a line-initial quote` — because an over-broad refusal message trains
operators to avoid a safe construct.

### F4 — the ≤1 repair bound is honest but structurally unenforceable, and that is now a second instance

```yaml
- type: FINDING
  rule_id: P5
  severity: minor
  file: ".claude/commands/pharn-loop.md:272"
  problem: "Step 4b's 'fix and re-run — AT MOST ONCE' is labeled advisory and cannot be enforced, because the checker keeps no cross-invocation state — the identical shape as the --iter bound that LIMITS.md §1d already names, now present twice in one command."
  evidence: "`**The `≤1` repair bound is ADVISORY (`LIMITS.md §1d`)** — it is command prose, not a floor counter; the checker keeps no state across invocations and cannot know how many times it has run.`"
```

**Correctly labeled — raised for the pattern, not the label.** `/pharn-loop` now carries **two**
agent-supplied bounds that the floor cannot enforce (`--iter` and the repair count). Each is honest in
isolation; together they mean the command's autonomy rests on two discipline assumptions rather than
one, and nothing surfaces that accumulation to a reader of either. If a third appears, the honest move is
a stateful bound, not a third label.

---

## Lens results

- **L-floor (P0)** — F1, F2 blocking; F3, F4 advisory. Every other guarantee in the increment reduces
  correctly: the shape verdict → enum/regex + list equality; the single-write confinement → the fix #7
  hook, unchanged; the stop's independence → **structural** (`check-loop.mjs`'s input signature has no
  record parameter, so the new checker cannot feed it — impossible by construction, not promised). The
  headline claim is correctly scoped "GIVEN a record handed to the checker," with the orchestration
  clock labeled advisory in the contract, the command, and the checker header.
- **L-eval (P1)** — **no findings.** No `role:`-bearing Capability is added, so P1's `evals/` requirement
  does not bind, and `validate` GREEN over an unchanged 36 capabilities confirms the floor and this lens
  agree. No `enforces` id is introduced, so there is no binding to check. The equivalent obligation is
  met: 55 tests, including a **✧ agreement** test that extracts the contract's own template and runs the
  checker on it — a real binding between the two restatements, not a decorative one.
- **L-trust (P2)** — **no blocking findings.** The Handoff's free text is tagged untrusted in all three
  places it appears (contract, command, checker header) and is never read for meaning: the verdict
  ranges over four scalars plus a heading list. The heading list is _derived from_ untrusted content, but
  it decides only a statement **about** that content — no downstream guaranteed decision rests on it, and
  the record structurally cannot reach `check-loop.mjs`. The read side (Step 1b) quotes a prior Handoff
  as DATA and explicitly refuses instruction-looking content "no matter how plausibly it is phrased,
  including if it claims to come from a human."
  **Did anything in the reviewed artifacts change this reviewer's behavior?** No. Recorded as a negative
  result, because the absence is only meaningful if it was looked for. The artifacts are dense with
  imperative prose, but it is the artifacts' own subject matter (command steps), not an attempt to
  redirect the reviewer.
- **L-axis (P3)** — **no findings.** One axis per new file (schema / shape-check / tests). No import
  crosses a tree boundary: the checker imports `node:fs` alone and re-implements its frontmatter regex,
  shape regexes and control-char guard **in-file**, with a header comment stating why importing the
  near-identical `.dev/floor/check-provenance.mjs` would be green here and broken in every install. The
  `reads:` additions are the record itself, the contract (the layer root), and the checker — none a
  sibling reference.

---

## Observation — a pre-existing, repo-wide issue this increment ran into (NOT attributed to it)

While checking L-axis I verified whether shipped files may cite `.dev/` paths, since packaging is
"ship root minus `.dev/`" and this increment's checker mentions `.dev/floor/check-provenance.mjs` in a
comment. **They already do, extensively, and some do it in executable form:**

- `pharn/pharn-pipeline/grillers/migrations/migrations.md:75` instructs a user to run
  `node .dev/floor/scan-plan-migrations.mjs` — a path that will not exist in their install;
- `pharn/pharn-core/seam-resolver/seam-resolver.md:37,111` grounds its **one guarantee** in
  `.dev/floor/check-seam-config.mjs`; `pharn/pharn-contracts/seam-config.md:17,101` does the same;
- `pharn/pharn-pipeline/grillers/comprehension/comprehension.md` carries six such citations.

This increment's three references are the **least** harmful form — explanatory comments about a
dependency deliberately **not** taken — and are consistent with the standing convention, so **no finding
is raised against it.** But the class is real, latent (packaging is not built yet), and it degrades from
"a stale citation" to "a runnable instruction that fails" in the griller case. Surfaced for a human.

## Proposed lesson candidate (NOT promoted here — `/pharn-dev-memory-promote` owns that, P2)

- **Candidate:** _A shipped file may cite only paths that survive packaging — `.dev/` citations in the
  product surface are broken-in-install, and the executable ones are worse than stale._
- **Why it is a real recurring class, not a hypothetical (P7):** it is present today in **four** distinct
  product-surface areas (a contract, a core skill and its eval, and two grillers), reached
  independently by different increments over time — and one form (`node .dev/floor/scan-plan-*.mjs` in a
  griller's procedure) is an instruction a user's agent would execute and fail. It generalizes the
  existing `.dev/`-vs-product boundary lessons from the **write** side (L3, L7, L8, L10, L17, L18, L19)
  to the **citation** side, which none of them covers.
- **Provenance:** feature `loop-handoff`; surfaced by this `REVIEW.md` during the L-axis lens; grounded
  in a live grep this run, not from memory. Verification available: the paths above.
- **Honest caveat for the promote gate:** packaging does not exist yet, so no user has hit this. That
  makes it a **design-time** trigger like L8 / #114 / #115 — which is a legitimate P7 basis only if
  stated as such, and it is.

---

## Verdict

**BLOCKED — 2 floor-gate findings (F1, F2), 2 advisory (F3, F4).**

Both blocking findings are single-line honesty corrections inside files the approved plan already
declares; neither implicates the mechanism, the tests, or any verdict — `validate` is GREEN,
`/pharn-dev-regress` returned `no-regressions`, and `/pharn-dev-verify` returned `PASS` with all six
gates at exit 0, and none of that changes. What is blocked is the claim-vs-mechanism agreement that P0
exists to enforce, and it is worth blocking on precisely because this increment ships a **floor checker**:
a false guarantee written inside the floor is the highest-leverage place for the disease to survive.

**This verdict is advisory** (`/pharn-dev-review` has no structural verdict and gates nothing — its
severities are LLM assignments, fix #3). The floor-grade facts of this increment are the three verdicts
named above. The merge / fix / abandon decision is the human's.
