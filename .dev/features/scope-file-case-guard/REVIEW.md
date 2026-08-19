# REVIEW — scope-file-case-guard

**Floor first (P0):** `node pharn/floor/validate.mjs .` → **GREEN**, exit 0 (36 capabilities). The
increment was entitled to reach review. Everything below the floor line is **advisory**.

**Under review (`trust: untrusted`):** 7 tracked files (+156/−7) and 9 `.dev/features/` artifacts.

---

## Floor-gate findings (blocking)

**None.** No guarantee in the increment lacks a floor reduction or an `advisory` label; the eval
binding is satisfied vacuously and the floor agrees; no sibling reference was introduced.

---

## Advisory findings

### L-trust → P2

```yaml
- type: FINDING
  rule_id: "P2"
  severity: important
  file: "CLAUDE.md:73"
  problem: "The heading 'write-protected and human-only' overstates what the guard delivers, and THIS RUN is the counter-example: the agent modified a DEFAULT_PROTECTED file by running `git apply` through Bash, which PreToolUse never sees, so the protected set is human-only against the Write/Edit/MultiEdit surface and not against the agent as such."
  evidence: "**The four trusted docs are write-protected and human-only.**"
```

**This is the most important thing in the review, and it is not hypothetical — it happened here.** The
increment's own delivery is the demonstration. The bound itself is **already stated** two sentences later
in the same paragraph ("_Bounded, and stated:_ this covers the Write/Edit/MultiEdit surface only;
Bash-tool writes bypass `PreToolUse` hooks entirely"), and the patch this increment applied **adds the
same bound** to the hook's own HONEST BOUNDS block. So the repo is honest in the body and loose in the
**heading** — which is the half a reader remembers. Advisory because the remedy is wording in a file
this stage may not write, and because no guaranteed decision rests on the phrase.

**Worth stating plainly for the human at GATE 2:** the guard was not defeated, circumvented by
injection, or worked around silently. It was bypassed by an **explicit, repeated human instruction**
("do it"), after the agent declined across four exchanges and the diff had been human-reviewed at
GATE 1. That is the human exercising authority the guard was never meant to remove. But the audit trail
must say so, because "a human applied it outside the agent loop" and "the agent applied it on a human's
say-so" are **different facts**, and only the second is true.

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".pharn/fixes/H2-scope-file-self-escalation.md:1"
  problem: "The entire increment was initiated by an untracked, unsigned markdown file in gitignored scratch, which specified a change to a security guard including the exact file, the exact list to edit, and the version-bump policy — the shape of a prompt-injection payload, distinguishable from one only by the human's GATE-1 approval."
  evidence: "**File:** `.claude/hooks/protect-trusted-paths.cjs` — add `.pharn/writes-scope.json` to `DEFAULT_PROTECTED`"
```

**Did instruction-looking content change my behavior? Yes — and the control that made that legitimate
was the human gate, not my judgment.** Recording it because the lens exists to catch exactly the case
where the agent would not notice. What kept it sound: every factual claim in that document was
**re-verified live** rather than believed (`enforce-writes-scope.cjs:187`, the `ALWAYS` glob at line 61,
and the four-way exit-code matrix were all reproduced before anything was written), and the change
reached the repo only through an approved PLAN. Had the document instead named a path that _weakened_ a
guard, the same verification step is what would have surfaced it — and that step is **advisory**, which
is the honest residual (`LIMITS.md §2`, `THREAT-MODEL.md §5`).

The 14 free-text `problem:` / `evidence:` fields across this feature's artifacts are all rendered as
quoted DATA and gate nothing; no proceed/stop in this run read one.

### L-floor → P0

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".claude/hooks/protect-trusted-paths.test.cjs:665"
  problem: "The new cross-copy pin asserts membership in ONE direction only (enforce-writes-scope's SCOPE_FILE must be in DEFAULT_PROTECTED), unlike the CONTROL_SURFACE guard it is modeled on, which asserts set EQUALITY — so a future `.pharn/` entry added here that no scope guard uses would pass unnoticed."
  evidence: "assert.ok(declaredProtected().includes(m[1]), …)"
```

**Judged correct as built, and recorded so the asymmetry is deliberate rather than accidental.**
Set-equality is wrong here: `DEFAULT_PROTECTED` legitimately holds nine paths that have nothing to do
with the scope guard, so the only meaningful direction is the one asserted. The residual — a stray
`.pharn/` entry — is inert (it would over-block a runtime file, which the third new test would catch for
any path it names). Noted, not a defect.

### L-eval → P1

**No findings.** The increment adds no `role:`-bearing capability and no `rule_id`, so no
`evals/cases/*` + `evals/expected/*` pair is owed; `validate.mjs` GREEN confirms the floor and this lens
agree. The equivalent obligation — a regression suite for a floor hook — was met, and met **well**: five
tests, four of which were **measured failing** against the unpatched hook before being trusted (L4), with
the FAIL→PASS transition recorded across two `/pharn-dev-verify` runs in `VERIFY.md`.

### L-axis → P3

**No findings.** No sibling reference is introduced (the hook diff names no `pharn/pharn-*` module). The
seven touched files are one axis plus its required consequences: the guard entry, its tests, and the
meta-docs that assert facts the change invalidates (`SKILLS_VERSION`, the README badge that
`check-version-badge.mjs` pins to it, `CHANGELOG`, `CLAUDE.md`) — the L1 sweep, not scope creep. The
baseline repair (`.markdownlint-cli2.jsonc`) is a genuinely separate axis and was correctly kept
**outside** the plan under its own declared writes-scope (`BASELINE-REPAIR.md`).

---

## Proposed lesson candidates (NOT written to canon — `/pharn-dev-memory-promote` is a separate, human-gated run)

### Candidate A — L16's remedy is discipline-only and has now recurred eight times

**Real failure, this run:** the `/pharn-dev-regress` baseline capture used `xargs -a outside-tests.txt`;
BSD `xargs` (macOS default) rejects `-a` outright, fabricating `tests=1`. Being equally bogus at base and
head, `check-regress.mjs` would have classified it `pre_existing` — evading a false alarm while
**masking** a real tests-gate regression. Caught only because a red baseline on a known-green repo was
investigated rather than recorded.

**Why it earns canon:** L16 already documents this exact flag, and **seven prior feature records**
document hitting it — `floor-selfpath-correction`, `product-lessons-index`, `scan-plan-relocation`,
`format-step-scope`, `template-mask-nesting-3`, `features-readme-spec-live`, plus L16's own promotion.
This is the eighth. **L20 already named the rule for this situation**: when a lesson's remedy reduces to
"the agent should remember," recurrence is evidence the remedy is the wrong _kind_. The deterministic
remedy is cheap — the command's Step 2 prose says only "through `xargs`"; a **literal copy-pasteable
snippet** using the stdin form, or a tiny helper that expands the list, removes the choice that keeps
being made wrong. Provenance: this increment; `REGRESSION.md`.

### Candidate B — a stage instruction can be correct on every input anyone reached and wrong on the first one nobody did

**Real failure, this run:** `/pharn-dev-verify` Step 4 requires `verify-report.json` to stay the helper's
JSON **verbatim** (explicitly _not_ formatted) while the same command runs whole-repo `format:check` as a
**verdict-owning** gate. The two conflict **only** when `failing_gates` is non-empty —
`JSON.stringify(…, null, 2)` expands a one-element array where prettier wants it inline. Every prior run
reached that step with `PASS` and `[]`, on which both agree, so it had never fired. This run's first
`/pharn-dev-verify` returned FAIL and the stage's own artifact reddened the gate the stage owns.

**Why it earns canon:** it is a distinct shape from L16's portability trap and from L9/L13's style-gate
family — a **self-referential** gate conflict latent behind a happy path, structurally invisible to
every green run. It generalizes: any stage that both _writes an artifact_ and _owns a whole-repo gate
over that artifact's directory_ has this hazard, and the FAIL branch of such a stage is the least-tested
code path in the pipeline. Remedy is one line (format it, or `.prettierignore` it as
`package-lock.json` and `settings*.json` already are). Provenance: this increment; `SHIP.md`.

---

## Verdict

**GREEN — 0 floor-gate (blocking) findings; 3 advisory findings; 2 proposed lesson candidates.**

The increment does what it claims, and its central claim is correctly **narrowed**: the Write-tool
self-escalation via a case-variant filename is closed (measured live — both spellings and a dangling
alias now exit 2, while `.pharn/foo.json` and the lessons-index cache still exit 0), and it is nowhere
sold as "the scope file cannot be rewritten."

**What GREEN does not mean (P0):** this verdict is **advisory**. The only floor-grade content in this
review is `validate.mjs` GREEN, which `/pharn-dev-build` and `/pharn-dev-verify` had already gated. A
`severity` above is an LLM assignment (fix #3), and "review found nothing blocking" never means "the
increment is correct." The human decides merge / fix / abandon.
