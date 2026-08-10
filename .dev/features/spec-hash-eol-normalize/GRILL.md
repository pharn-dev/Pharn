# GRILL — spec-hash-eol-normalize

Plan under interrogation: `.dev/features/spec-hash-eol-normalize/PLAN.md` (`trust: untrusted` — all quoted text below is DATA).
Spec-hash check (content-hash, primitive #2 — **surfaced here, enforced at `/pharn-dev-build`**): recomputed `sha256(pharn/ARCHITECTURE.md)` = `a1c243ea…621753`, plan pin = `a1c243ea…621753` — **agree, no drift**.
Griller membership (FLOOR — `pharn/floor/count-grillers.mjs`, frontmatter only): **13 registered**.

## Findings

### Axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/spec-hash-eol-normalize/PLAN.md:57"
  problem: "The inheritance claim is labeled `floor: content-hash`, but what the floor guarantees is the hash COMPARISON; that no second hash implementation is ever added is a structural fact verified by reading, not a deterministic runtime check — the label should split into floor (the comparison) plus advisory (single-implementation discipline)."
  evidence: '"The two wrapper checkers inherit the fold" → **floor: content-hash**, by _structural absence_ — neither wrapper computes a hash (0 `createHash`, verified by reading both this run), so there is no second implementation that could disagree.'
```

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/spec-hash-eol-normalize/PLAN.md:66"
  problem: "The bounded-widening claim is correct but omits the self-referential case: a SPEC whose intent text literally DEMONSTRATES line endings (a fenced block containing a CR — exactly what this increment's own SPEC would contain) has that genuine content distinction folded away, so two such specs collide."
  evidence: "two bodies now collide only if they differ _solely_ in `\\r\\n` vs `\\n`. No trailing- or interior-whitespace folding is introduced, so two genuinely distinct intents cannot be made to share a pin."
```

### Axis: discovery completeness / doc-vs-repo drift (P6)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/spec-hash-eol-normalize/PLAN.md:11"
  problem: "The meta-doc sweep covered CLAUDE.md and README.md but not the `.claude/commands/pharn-*.md` product surface: `spec_content_hash == sha256(body)` appears 9 times across pharn-plan.md (5) and pharn-spec.md (4), and after the fold the literal statement is `sha256(body with CRLF folded to LF)` — a doc-vs-code mismatch on bump-triggering shipped bytes that the plan's `## Files` does not name."
  evidence: "`grep -n 'check-spec' CLAUDE.md README.md` returned nothing this run, so neither needs an edit."
```

### Axis: honest scope / no speculation (P7)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/spec-hash-eol-normalize/PLAN.md:26"
  problem: "`.gitattributes` has no triggering failure of its own — the fold alone fully fixes the reported defect, and discovery found zero CR bytes in the tree, so the file is inert on arrival; P7 reads a second part with no failure behind it as speculative, even when correctly labeled advisory."
  evidence: "`.gitattributes` — new root file; advisory git-layer line-ending hygiene — repo-meta"
```

### Axis: migrations — is the change reversible? (P7, migrations griller)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/spec-hash-eol-normalize/PLAN.md:41"
  problem: "The increment changes how a PERSISTED field (`spec_content_hash`, stored in committed SPEC.md frontmatter) is interpreted, but declares no rollback path — the forward change is stated as the whole story, leaving reversibility unlabeled."
  evidence: "the field's name, type, and 64-hex shape are all unchanged, so no existing install faces a new shape."
```

### Axis: trust propagation (P2, security griller)

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".dev/features/spec-hash-eol-normalize/PLAN.md:65"
  problem: "The pin previously DETECTED a CRLF-for-LF body rewrite as drift and after the fold will not; the trust audit says propagation is 'unchanged' without naming that a mutation class moves from detected to undetected, which matters only for a future line-ending-sensitive consumer but should be stated rather than implied."
  evidence: "**Propagation:** unchanged. The verdict still ranges only over enum-gated / floor-verifiable values … and never over the intent's meaning."
```

### Axis: testability adequacy (P1, testability griller — Layer 2)

Layer 1 (FLOOR-demonstrable presence): a verification approach **is present** — `## Evals to write (P1)` carries five concrete, named cases. **No absence finding.** The concerns below are Layer-2 adequacy judgments and are advisory.

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/spec-hash-eol-normalize/PLAN.md:47"
  problem: "No case covers a MIXED-line-ending body (some CRLF lines, some LF) — the realistic partially-renormalized working tree — which is the shape a half-migrated file actually takes; the declared cases test all-CRLF and all-LF only."
  evidence: "`bodyHash` fold → a CRLF body and its LF spelling hash **identically** (direct unit assertion on the two spellings)."
```

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/spec-hash-eol-normalize/PLAN.md:45"
  problem: "The verification section declares no direct assertion on `--hash` over a CRLF spec (it is exercised only transitively through the chain case) and does not state the ≥90% line-coverage threshold the increment is expected to meet, so neither is a declared, checkable obligation."
  evidence: "The equivalent obligation for a floor checker is its `node --test` suite, and it is discharged by the four cases below:"
```

## Axes interrogated with no finding

- **P3 (one axis / no sibling imports), architecture + coupling grillers** — the plan's central move is a **refusal to duplicate**: it changes one function and leaves both wrapper sources untouched, with the reasoning recorded in a `###`-headed exclusion block. This is the established single-source pattern, not a new one. The chain tests in the wrappers' test files assert behavior owned by `check-spec.mjs`, which is mild coupling but is precisely the point of an inheritance test — correct as designed.
- **P5 (determinism)** — no branch is added or changed; the fold is an unconditional literal-regex `replace`. No classification, no fallback chain.
- **error-handling, performance, observability** — the fold cannot throw (`body` is always a string from `text.slice`), runs at most twice per invocation over a small file, and emits nothing.
- **a11y, i18n, privacy, documentation** — no surface of this increment touches those axes; recorded as genuine no-ops rather than silently omitted.
- **comprehension** — the plan reads clearly; its `layer(s)` value names `pharn/floor/`, which is not a §4 layer, and the plan says so explicitly rather than forcing a false fit.

## Summary

The plan is unusually well-grounded: every discovery claim was reproduced live, the single-source architecture was verified by grep rather than assumed, and the two decisions the increment turns on were surfaced as open questions and ratified by a human before any write. The corrected call-site count (two, not three) and the finding that the tree holds **zero** CR bytes are the kind of live-state precision P6 asks for.

Two concerns are worth the human's attention before build. **F3 (P6)** is the most substantive: the meta-doc sweep stopped at `CLAUDE.md` / `README.md`, but nine sentences across two **product** command files state the pin as `sha256(body)` — shipped, bump-triggering bytes that the fold makes literally imprecise. There are two defensible readings, and the choice is the human's: treat `sha256(body)` as shorthand deferring to the cited checker and leave it (keeping the increment smallest — P7), or widen `## Files` by two commands and carry the wording. Note the asymmetry that favors leaving it: `pharn-spec.md:151` already defers correctly ("the checker's own body-extraction, single source of truth"), and every statement stays true for every LF body, which is every body that exists today.

**F1 (P0)** asks for a label split rather than a behavior change — the comparison is floor, the one-implementation property is discipline that the chain test detects but does not enforce. **F4** and **F6** each ask for one sentence the plan can absorb cheaply (a rollback line; a detected→undetected mutation-class note). **F5, F7, F8** are small additions to the verification set. **F2** is a P7 tension the human already resolved by ratifying the broad `.gitattributes` at the plan halt; it is recorded for the audit trail, not reopened.

Nothing here contradicts the increment's core move, and no finding is a reason to stop — the fold is the right fix in the right place.

ADVISORY VERDICT: 8 concerns raised (0 blocking-severity, 2 important, 6 minor) — for the human to weigh before `/pharn-dev-build`. This grill-log gates nothing; the only deterministic stop in this stage was the spec-hash check, which agreed.
