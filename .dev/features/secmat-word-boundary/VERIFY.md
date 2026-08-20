# VERIFY — secmat-word-boundary

## FLOOR layer (owns the verdict)

| gate                                         | exit | what it covers                                                                |
| -------------------------------------------- | ---- | ----------------------------------------------------------------------------- |
| `test`                                       | 0    | the full hermetic suite, including this feature's own 44 crypto-scanner tests |
| `validate`                                   | 0    | `pharn/floor/validate.mjs .` — GREEN, 36 capabilities checked                 |
| `lint`                                       | 0    | eslint, whole-repo                                                            |
| `format:check`                               | 0    | prettier, whole-repo (L9)                                                     |
| `lint:md`                                    | 0    | markdownlint, whole-repo (L9)                                                 |
| `structural:expected-injection-comment.json` | 0    | the one committed eval pair (trust-fence)                                     |

Both eval-pair paths were confirmed readable before their exit code was recorded, so an ENOENT could not
be recorded as a gate verdict.

**VERIFIED: floor gates PASS.** (`check-verify.mjs` → `"PASS"`, exit 0, `failing_gates: []`.)

The five non-`structural` gates are exactly the repo's `npm run check` aggregate, so this verdict tracks
the full aggregate rather than a subset — which gates are in the map is this command's **advisory**
composition, though; nothing on the floor locks the style gates into the set.

## ADVISORY layer (annotates; never flips the verdict)

`pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}` —
**no verifiers registered; floor gates only.** Step 2 was a no-op, and no verifier free-text exists to
quote. The verdict above rests on the six integers alone; `check-verify.mjs` cannot receive a finding.

## What this feature's own gates actually demonstrate

The `test` gate is the feature-specific correctness signal here. Inside it,
`pharn/floor/scan-code-crypto.test.mjs` went 26 → **48** tests, and the added rules **iterate** the
11-word set and the 4-branch table rather than sampling them — the two false-positive classes (`keys`,
`monkeys`) are asserted across every word, not just the two in the bug report. A drift pin asserts the
suite's copy of the word set equals the scanner's, so a word added to the scanner without extending the
suite REDs rather than silently escaping the anchoring. The last four tests pin the **non-monotone**
deltas in both directions — the `iv` widening (`myIv`, `IV_SEED`) and the deliberate mixed-case drop
(`tOKEN`) — which no gate would otherwise have covered, since every earlier test was written for the
false positives being removed.

**The new lens eval pair adds NO `structural:*` gate here, and that is not an oversight.** A
`structural:<expected>` gate exists only where a committed **actual** `findings.json` sits beside the
expected file; `case-insecure-random` ships an expected pair with no committed actual, exactly like the
lens's four pre-existing cases. What the floor does check about it is `validate` (exit 0 above): the pair
is present and non-empty, and the lens's `enforces: ["P2"]` is produced by it, so the P1 binding holds.
Executing the case against a live lens run is `/pharn-dev-eval`'s job, not this stage's — so "the eval was
added" means the fixture is committed and bound, **not** that a lens run was measured against it.

## Honest residual (P0/P7)

**Verified = the named gates passed.** This is NOT a guarantee of correctness beyond what those gates
check. Concretely for this increment: the gates prove the segment anchoring behaves as asserted on the
cases the suite encodes, and they say nothing about whether the _word set itself_ is the right set, nor
whether an `insecure-random` hit is a real vulnerability — that remains Layer-2 lens judgment and, past
it, human review. A false negative the suite does not encode is invisible here. Verifier concerns would
be advisory help, not assurance; today there are none because none are registered.
