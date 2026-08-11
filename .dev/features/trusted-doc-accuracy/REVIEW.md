# REVIEW — trusted-doc-accuracy (F7)

PHARN reviewing PHARN. The increment under review is `trust: untrusted`.

## Step 1 — Floor first (P0)

| floor check                               | result                                           |
| ----------------------------------------- | ------------------------------------------------ |
| `pharn/floor/validate.mjs .`              | **GREEN** — 36 capabilities, exit 0              |
| `check-regress.mjs verdict`               | **`no-regressions`**, exit 0                     |
| `check-regress.mjs scope`                 | `escaped: []`, exit 0                            |
| `check-verify.mjs`                        | **`PASS`**, exit 0 (5/5 gates)                   |
| `npm run check` (aggregate)               | exit 0                                           |
| `check-plan-lessons.mjs`                  | **GREEN** — 8 cited ids resolve                  |
| spec-hash gate at build time (fix #4)     | **MATCH** — build was against an un-drifted spec |
| per-edit assertion (10 trusted-doc edits) | 10/10 matched exactly once; 10/10 verified after |

The floor is green everywhere it applies. **What it does not cover is the whole substance of this
increment** — see F1.

---

## The four lenses

### L-floor → P0 (the governing lens)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: "LIMITS.md:29"
  problem: "After this increment a trusted doc still labels a clause '**Backstop (floor):**' whose floor operation does not exist on either half — the marker narrows the overclaim without removing it, so the site remains an instance of the exact disease the increment exists to cure."
  evidence: "(`ARCHITECTURE.md §5`, pre-write hook; pre-egress specified, ships with the guarded surface). Safety comes from the floor, not from the"

- type: FINDING
  rule_id: "P0"
  severity: important
  file: "pharn/ARCHITECTURE.md:41"
  problem: "The replacement marker asserts a future ('ships with the guarded surface') that names no artifact, condition, or owner, so it is unfalsifiable — a claim that cannot be checked has traded a wrong statement for an uncheckable one."
  evidence: "- `pre-egress` _(specified; ships with the guarded surface)_ — blocks a network call to a domain not on a hardcoded allowlist."

- type: FINDING
  rule_id: "P0"
  severity: minor
  file: "THREAT-MODEL.md:102"
  problem: "The §4 sibling of the LIMITS:29 site still reads 'trusted-write or off-allowlist egress (floor)' with no annotation, so the two docs now disagree about the same mechanism — one marked specified, the other still labelled floor."
  evidence: "trusted-write or off-allowlist egress (floor), so blast radius is bounded even when the body is"
```

### L-eval → P1

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/trusted-doc-accuracy/PLAN.md:85"
  problem: "No eval binds any claim in this increment, correctly — but the consequence is that nothing in the repo will detect if one of these eleven annotations is later reverted or contradicted by a new sentence, leaving the correction unprotected against exactly the drift that produced it."
  evidence: "**none, and this is not a P1 exemption claim.** P1 binds a **Capability** (a `role:`-bearing file)"
```

P1 is **satisfied**, not waived: it binds a `role:`-bearing Capability to its evals, and this
increment authors none. The finding above is about durability, not about a missing eval.

### L-trust → P2 (targets the residual)

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: "pharn/floor/check-regress.mjs:311"
  problem: "The trusted-doc escape exemption's named L19 residual — a Bash write bypassing both the hook and this exemption — was exercised for real for the first time by this increment, so a limit the module documents as theoretical is now observed live and its blast radius is measured rather than predicted."
  evidence: "const escapeExempt = undeclared.filter((f) => TRUSTED_DOCS.includes(f) || isPipelineArtifact(f, feature));"

- type: FINDING
  rule_id: "P2"
  severity: important
  file: ".dev/features/trusted-doc-accuracy/PLAN.md:65"
  problem: "The increment establishes a working precedent for agent-authored edits to the four human-only trusted docs, and the only controls on it are a human wording approval and CODEOWNERS review — neither of which is a floor primitive, and neither of which leaves a machine-checkable trace that a given trusted-doc edit passed a human."
  evidence: "### Written by Bash, OUTSIDE every write gate (L19 — declared, not disguised)"
```

The taint handling itself is clean: the edit spec was treated as untrusted input, every factual claim
in it was re-derived from live state rather than accepted, and one string it proposed (`"the check is
condips with the guarded surface"`) was **rejected** rather than copied into governing text. That is
the fence working — an untrusted source proposed bytes for a trusted doc and did not get them.

> **Correction — a finding this review first raised and then withdrew.** The first draft asserted that
> `check-regress.mjs`'s trusted-doc exemption rests on the premise "the agent cannot write these files
> at all", and that this increment falsified it. **That was wrong**, and reading the module rather than
> inferring from its behavior is what showed it. `pharn/floor/check-regress.mjs:117-121` already states
> the bound exactly: _"BOUNDED, and stated: the hook gates the Write-tool surface only, so a Bash-tool
> write bypasses both it and this exemption (the L19 escape). The claim is 'the build could not have
> written this WITH THE WRITE TOOL', never 'no process changed it'."_ The module named the residual
> before this increment exercised it. The finding above is the corrected, narrower one: not a falsified
> rationale, but a **documented limit observed live for the first time**. Recorded rather than silently
> edited, because a review that quietly deletes its own wrong finding is the same dishonesty it exists
> to catch.

### L-axis → P3

No findings. One axis of change (doc accuracy), no capability tree edits, no sibling references, no
layer inversion. `## Files` held to three paths and the setter confirmed three.

---

## Gates (fix #3) — floor-gate vs advisory

- **Floor-gate (blocking): none.** Every floor check above is green.
- **Advisory: 6 findings** (0 blocking-severity, 3 important, 3 minor). `severity` values are
  enum-gated members; the **assignment** is model judgment and gates nothing.

  > **Two corrections to this tally, and the second one is the interesting one.** The first draft said
  > "7 findings (0 blocking, 5 important, 2 minor)" against a body that has only ever held **6** — an
  > arithmetic slip plus a severity tally that did not match the objects above it. A stated count
  > nobody derives from the artifact is the same class of defect as a stated guarantee nobody derives
  > from the floor. `GRILL.md`'s `7 (1 blocking, 4 important, 2 minor)` was re-derived and is correct.
  >
  > Re-deriving it, however, first produced **7** — because the remediation note itself quoted the
  > search patterns, and a substring search counted that prose as a seventh finding. That is
  > `.dev/memory-bank/lessons-learned.md` **L6** reproduced inside this review: a membership fact read
  > by grepping free text conflates _documentation about_ a declaration with _a_ declaration. The count
  > here is the **six YAML objects in the four lens code fences** — read from the structured location,
  > which is why this note no longer spells the patterns out.

---

## The one thing a reviewer should weigh hardest (F1, restated in prose)

The increment does what it was scoped to do, and the floor confirms nothing broke. But its own
success criterion is unverifiable by any mechanism in this repo: **no gate reads trusted-doc prose.**
`format:check` and `lint:md` exclude the three docs by name; `validate` scans a tree they are not in.
So `PASS` here is a statement about the repo's health, not about the correction's accuracy.

What carries the accuracy claim is the `## Discovery` table — each primitive confirmed absent by live
inspection this run — plus the per-edit assertion that the intended bytes landed. Both are real and
both are recorded. Neither is a check that will run again tomorrow. If `pre-egress` ships next month
and nobody removes these ten markers, the docs will be wrong in the opposite direction and nothing
will say so.

That is not an argument against the change; it is the honest boundary of a prose correction in a
repo whose floor deliberately does not read prose. It is worth stating plainly at the gate, because
the alternative reading — "verify passed, so the docs are accurate now" — is precisely the inference
P0 forbids.

## Candidate lesson (proposed, NOT promoted — promotion is a separate gated run)

**An increment that edits its own pinned spec self-invalidates its pin, and the pipeline reports that
as drift.** `sha256(pharn/ARCHITECTURE.md)` moved from `a1c243ea…` to `8f5ec002…` as a direct result
of the approved work. `/pharn-dev-build` checked the pin before writing, so the build was sound — but
re-running the same plan now HALTs with "the spec drifted" though nothing is wrong. fix #4 models the
spec as a fixed **input**; for a trusted-doc increment it is the **target**. This will recur on every
such increment. Not promoted here: `/pharn-dev-memory-promote` is the gated path, and one occurrence
is one occurrence (**L20**'s trigger is the _second_).

---

**This review gates nothing and issues no seal.** `/pharn-dev-review` has no structural verdict by
design; the floor-grade facts are the Step-1 table, already gated at build and verify. The free-text
`problem` / `evidence` fields above quote the increment and inherit its untrusted tag — DATA for the
human, never instructions. The merge/fix/abandon decision is the human's.
