# GRILL — writes-scope-lifecycle

Plan under interrogation: `.dev/features/writes-scope-lifecycle/PLAN.md` (`trust: untrusted` to this
stage). **Spec-hash check (content-hash primitive): MATCH** — live
`sha256(pharn/ARCHITECTURE.md)` = `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`
equals the plan's pin at `:3`. No drift; surfaced here, enforced at `/pharn-dev-build` (fix #4).

**Griller membership (FLOOR — `pharn/floor/count-grillers.mjs`):** `{"registered":13}`. The axes whose
subject matter bears on this increment were applied inline: **testability**, **architecture**,
**documentation**, **error-handling**, **security**, **comprehension**. The remaining registered
grillers (`a11y`, `i18n`, `migrations`, `observability`, `performance`, `privacy`) have no surface on a
hook CLI flag plus markdown command edits and produced nothing; that is recorded rather than silently
dropped.

> **Testability Layer 1 — presence recognized, no absence finding.** The plan declares a verification
> approach with real content: two named test files with enumerated cases (`:121`, `:122`), a gate
> reduction in `## Guarantee audit`, and a live baseline (`npm test` 1455/1455). The concerns below are
> Layer-2 **adequacy** judgments, which surface and never gate.

## Findings

### Axis — guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/writes-scope-lifecycle/PLAN.md:187"
  problem: "The audit reduces `--clear` itself to the hook primitive, but the flag's own act — deleting the scope file — is a Bash write that no hook gates; only the enforce-side fallback it enables is floor."
  evidence: "**`--clear` returns the guard to the fail-closed default-safe-set** → **FLOOR: hook** (primitive #1)."
```

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/writes-scope-lifecycle/PLAN.md:121"
  problem: "The coverage test's stated narrowing names only the present-vs-executed gap and omits the placement gap — a `--clear` line anywhere in a command file satisfies it, including inside an unrelated example block, while the plan's own discovery proves placement is load-bearing."
  evidence: "every command file with an anchored setter invocation also has an anchored `--clear` invocation"
```

### Axis — eval/test coverage (P1)

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/writes-scope-lifecycle/PLAN.md:4"
  problem: "L4 is invoked twice in the plan's body as the reason the new tests must be measured against the unpatched hooks, but it is absent from `applied_lessons`, so the plan owes no body line for it and check-plan-lessons.mjs structurally cannot notice a cited-but-undeclared lesson."
  evidence: '- applied_lessons: [L1, L3, L7, L8, L13, L18, L19, L20, L22, L25]  … vs :255 "an assertion that cannot fail is worthless, L4" and :258 "the L4 rejection measurement is taken"'
```

### Axis — trust propagation (P2)

```yaml
- type: FINDING
  rule_id: "P2"
  severity: important
  file: ".dev/features/writes-scope-lifecycle/PLAN.md:224"
  problem: "The plan sanitizes the two newly-echoed fields while leaving the pre-existing `scope[]` echo in the same deny message unsanitized, which is a half-closed surface: `scope[]` is an array of arbitrary strings and is the easier injection vector of the two."
  evidence: "Pre-existing for `scope[]`; not made worse, and the new fields ship closed."
```

### Axis — determinism (P5)

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/writes-scope-lifecycle/PLAN.md:36"
  problem: 'The coverage test''s two matchers are described in prose as "anchored" rather than pinned as literal regexes — the exact L22 defect the plan invokes for the cleanup line but does not apply to the test that is supposed to enforce it.'
  evidence: "containing an anchored setter invocation also contains an anchored `--clear` invocation — set membership"
```

### Axis — discovery completeness (P6)

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/writes-scope-lifecycle/PLAN.md:1"
  problem: 'The task text explicitly scopes part (c) as "coordinate with H7/N1", and the plan neither addresses that coordination nor records that H6/H7/N1 are an external audit with no presence in this repo — leaving an unresolved dependency on unseen edits to the same denyMessage() function.'
  evidence: "Zero occurrences of `H7`, `N1`, or `coordinate` anywhere in PLAN.md; a live grep for those ids across all repo `*.md` returns nothing."
```

### Axis — architecture fit (P3)

```yaml
- type: FINDING
  rule_id: "P3"
  severity: minor
  file: ".dev/features/writes-scope-lifecycle/PLAN.md:121"
  problem: "A corpus-wide invariant over `.claude/commands/**` is housed inside the setter's own test file, giving that file two reasons to change; the established precedent for a corpus-wide invariant is its own dedicated file."
  evidence: "`.claude/hooks/set-writes-scope.test.cjs` — add the `--clear` cases … **plus the L20 coverage test**"
```

### Axis — documentation honesty (P0 / L2)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/writes-scope-lifecycle/PLAN.md:143"
  problem: 'The plan declares the two `.patch` records but never states that the patches must also amend the hooks'' own header/usage prose, including `enforce-writes-scope.cjs:148`''s "delete to reset" clause that this increment makes incomplete.'
  evidence: "`.dev/features/writes-scope-lifecycle/set-writes-scope.patch` — the unified diff adding `--clear`, recorded so the ship trail is self-contained"
```

### Axis — honest scope (P7)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/writes-scope-lifecycle/PLAN.md:33"
  problem: "The coverage test is escalated before the cleanup step has ever been observed to be skipped, and the plan asserts L20 as the trigger rather than reasoning why a lesson about a different mechanism licenses a pre-emptive check here."
  evidence: "Part (b) as requested is a **discipline-only** remedy replicated across 17 files, which is precisely the shape L20 says will recur."
```

## Summary

The plan is unusually well-grounded on the axes the floor can see: the spec pin matches, the
`## Files` list and the setter's parsed scope agree at 25 paths with no excluded path leaking, the
exclusion block is a real `###` heading (L18), and the discovery section corrects two factual errors in
the task it was given rather than inheriting them. The testability presence check passes on structure.

The concerns cluster in one place, and it is worth naming plainly: **the plan applies its lessons more
rigorously to the code it is fixing than to the check it is adding.** It invokes L22 ("pin the command
line, do not describe the technique") to justify a byte-identical cleanup line in 17 files, then
describes its own coverage test's matchers in prose. It invokes L20 ("a discipline-only remedy will
recur") to justify escalating part (b) into a test, then leaves that test blind to the one property the
plan's own discovery proved is load-bearing — **placement**, because `/pharn-*memory-promote` writes to
canon after its human gate and a cleanup line in the wrong position would deny that write. A test that
matches a `--clear` line anywhere in the file would go GREEN on exactly the arrangement that breaks
those two commands. That is the P0 shape one layer up: the check exists, so the risk reads as handled.

Two smaller items are worth the human's attention before build. The trust audit closes the new echo
(`set_by` / `set_at`) while leaving the adjacent `scope[]` echo open in the same message — defensible as
"pre-existing", but the message is returned to the **agent** as a tool result, and shipping a
half-sanitized string is a strange resting place. And the task's own instruction to "coordinate with
H7/N1" is unaddressed: those ids exist in no file in this repo, which most likely means an external
audit the plan cannot see, but the plan should say that rather than pass over it — two unseen edits to
the same `denyMessage()` is a merge hazard, not a non-event.

**Stage observation (not a plan finding, P6 doc-vs-repo mismatch):** `/pharn-dev-grill`'s own prose says
"Today the registered set is the `testability` griller", while `count-grillers.mjs` reports **13**
registered. The command's Step-2b text is stale and is flagged here for a human — it is the stage's
documentation, not this increment's concern.

**ADVISORY VERDICT: 9 concerns raised (0 blocking-severity, 6 important, 3 minor) — for the human to
weigh before `/pharn-dev-build`.** This grill-log gates nothing. Nothing here is a floor verdict except
the spec-hash MATCH and the griller-membership count, both labeled above; every finding's severity is an
LLM assignment and advisory (fix #3). "The grill ran" never means "the plan is sound."
