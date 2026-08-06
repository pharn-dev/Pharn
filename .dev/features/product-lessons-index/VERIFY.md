# VERIFY — product-lessons-index

## Verdict (FLOOR — `pharn/floor/check-verify.mjs`, exit 0)

```text
VERIFIED: floor gates PASS
```

`failing_gates[]` is empty. The threshold is **absolute** — PASS iff every gate exits 0 — not a
base↔HEAD flip; that comparison is `/pharn-dev-regress`'s question, and it was answered separately
(`no-regressions`).

## FLOOR layer — the deterministic gates

| gate                                           | exit | what it covers                                                              |
| ---------------------------------------------- | ---- | --------------------------------------------------------------------------- |
| `test`                                         | 0    | the whole hermetic suite — **1072 tests**, incl. this feature's 45 new ones |
| `validate`                                     | 0    | `pharn/floor/validate.mjs .` — GREEN, 36 capabilities                       |
| `lint`                                         | 0    | eslint, whole-repo                                                          |
| `format:check`                                 | 0    | prettier, whole-repo (L9)                                                   |
| `lint:md`                                      | 0    | markdownlint, whole-repo (L9)                                               |
| `structural:…/expected-injection-comment.json` | 0    | the one committed eval pair (`trust-fence`) — untouched here                |

This gate set is exactly the repo's `npm run check` aggregate plus `validate` and the structural pair, so
the verdict **tracks the full `npm run check`** — L9's style-gate coverage hole stays closed at verify.

**Two clocks, kept honest (L9, P0).** `check-verify.mjs` is generic over gate keys — it computes
`PASS iff every gate exit 0` over **whatever** map this stage assembles. The verdict is floor; **which**
gates are in the map is this command's **advisory** composition, and nothing floor-locks the two style
gates into the set. Do not read "verify runs the style gates" as floor-locked.

## What the new checkers were actually exercised against

The 45 new tests are hermetic (temp dirs, in-memory canon strings) and cover every branch that carries a
verdict: the five checker states, the generator's write-on-change / second-run-is-a-true-no-op
idempotence, the tag-line gate's eight malformed shapes, the L14 control-char composition over NUL/TAB/DEL,
the two title refusals (fence-closing sequence, control char), the CHECK-5 hazard refusal, and the
`--verdict` channel agreeing with the exit code in both directions.

Beyond the suite, the shipped surface was exercised **end-to-end in a temp repo containing only
`pharn/floor/` and no `.dev/`** — the real install shape, which is the one place the two-copies decision
could have failed silently. The chain ran `NO_CANON` (exit 0) → `COLD` (exit 0) → generate → `GREEN`
(exit 0) → hand-edit canon → `STALE` (exit 1). That last step is the memory-poisoning case (`THREAT-MODEL.md
§2` surface 3) the `STALE` verdict exists for. This is **advisory evidence**, not a gate: it is not in the
map above and flips nothing.

## ADVISORY layer — verifiers

**No verifiers registered — floor gates only.** `node pharn/floor/count-verifiers.mjs .` →
`{"registered":0,"verifiers":[]}` — a deterministic **frontmatter** read (P5), never a prose grep, so the
`role: verifier` strings in this repo's own command prose correctly do not register. Step 2 is a no-op and
contributes nothing to the verdict. No verifier was authored for this increment (P7 — the slot stays empty
until a real failure triggers one).

## The honest residual (P0/P7)

**Verified = the named gates passed.** This is **NOT** a guarantee of correctness beyond what those gates
check — a defect no test, eval, rule or lint covers is invisible here, and the verifier layer that might
have noticed it is advisory and, today, empty. Writing "`/pharn-dev-verify` ensures the feature is correct"
would be the disease; the gates ensure what they check.

Two narrower notes specific to this increment, so the PASS is not over-read:

- The gates confirm the **checkers behave as their tests say**. They say nothing about whether the
  **narrowed guarantee is worth having** — that `.pharn/` makes the drift check a machine-local staleness
  check rather than durable byte-equality is a design consequence the human accepted at the plan gate
  (and `/pharn-dev-grill` F1/F5 surfaced), not something a gate can weigh.
- The two **command** edits (`/pharn-plan`, `/pharn-memory-promote`) are prose. The only automated guard
  over them is `.dev/floor/command-hygiene.test.mjs` (✧ L19 — no stage command prescribes a repo-wide
  formatter/linter write), which passes and is inside the `test` gate. That this increment adds a Bash
  tooling invocation to a stage command is therefore checked for the L19 shape and **for nothing else**;
  whether the new sweep prose is _followed_ is irreducibly advisory (`LIMITS.md §1d`).
