# VERIFY — product-memory-promote

## FLOOR layer — the deterministic gates (this layer OWNS the verdict)

| gate           | exit | what it covers                                                            |
| -------------- | ---- | ------------------------------------------------------------------------- |
| `test`         | 0    | `npm test` — 1021 tests, incl. this feature's own 2 suites                |
| `validate`     | 0    | `pharn/floor/validate.mjs .` — GREEN, 36 capabilities                     |
| `lint`         | 0    | `npm run lint` (eslint)                                                   |
| `format:check` | 0    | `npm run format:check` (prettier, whole-repo — L9)                        |
| `lint:md`      | 0    | `npm run lint:md` (markdownlint, whole-repo — L9)                         |
| `docs:check`   | 0    | `npm run docs:check` — generated-region drift (added this run; see below) |

**`structural:*`: none.** This increment ships no `role:`-bearing capability and no `evals/` dir, so it
has no committed eval pair and therefore no `structural:<expected>` gate — the same handling
`/pharn-dev-regress` gave it. Its deterministic feature-specific signal is its own two `*.test.mjs`
suites, collected by `npm test`.

## Verdict (FLOOR — `pharn/floor/check-verify.mjs`, exit 0)

**VERIFIED: floor gates PASS** — every gate exit 0, `failing_gates: []`.

The verdict is an exit-code threshold computed by the helper (`PASS iff every gate === 0`). No model
judgment entered it and none could have: the helper's only input is the gate→exit-code map, and it cannot
receive a finding. Everything **around** it — choosing the gate set, running the gates, assembling the
map — is **advisory orchestration** (the two clocks).

**The honest residual (P0/P7):** verified = **the named gates passed**. It is **not** a guarantee of
correctness beyond what those gates check. A defect no test / eval / rule / lint covers is invisible here,
and the verifier layer that might notice it is advisory, not a guarantee. In particular: **nothing in this
gate set exercises `/pharn-memory-promote` as a command.** What the gates prove is that its checker, its
tests, and the repo around them are green — see the named gap below.

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.

**No verifiers registered — floor gates only.** Step 2 is a no-op; the verdict is the floor gates alone.
Membership is a deterministic `role:` frontmatter read, never a prose grep (L6). No verifier was authored
speculatively (P7).

## `docs:check` was added to the gate map — triggered by a real failure this run, not a hypothetical

The command's canonical gate map is `test` / `validate` / `lint` / `format:check` / `lint:md` /
`structural:*`, and its prose says that set "is exactly the repo's `npm run check` aggregate". **That is no
longer true**: `npm run check` is `format:check && lint && lint:md && docs:check && test`, so the
documented map omits **`docs:check`**. Adding it is legitimate under the command's own terms — it states
that _which_ gates are in the map is this command's **advisory composition**, and that L9's remedy lives in
the orchestration layer rather than in a new floor primitive.

**The trigger is observed, not imagined (P7).** This increment declares `README.md` as a
generated-region write, and mid-run that region **actually reverted** to its `HEAD` content from outside
the agent loop (recorded in `REGRESSION.md`). At that moment `docs:check` was **RED** while all five
canonical gates were **GREEN** — so a verify run at that instant would have returned **PASS on a
drift-broken increment**. That is L9's disease reproduced in a new location: an increment's own generated
region checked by neither `/pharn-dev-regress` (it deterministically skips style/docs gates when no shared
config is touched) nor the canonical verify map, surfacing only at the full `npm run check` or in CI.

**The honest bound (P0):** including the gate is **advisory orchestration**. `check-verify.mjs` is generic
over gate keys, so the floor verdict mechanically covers `docs:check` once it is in the map — but nothing
floor-locks it into the map, exactly as nothing floor-locks the two style gates L9 added. Do not read
"verify runs the docs gate" as floor-locked. **Candidate lesson for `/pharn-dev-review`:**
`verify-include-docs-gate` — the canonical map and its "exactly `npm run check`" claim drifted when
`docs:check` was added to `npm run check`, and no test pins the equality.

## Named gap: the product command itself is not exercised by any gate

`/pharn-memory-promote` is prose executed by an agent, so no deterministic gate here runs it end to end.
What **was** measured, live, in a staged copy of the product surface (recorded in the build note) is the
whole chain around it: the fix #7 denial with no scope (exit 2), Step 0 narrowing to `1 path(s)` so even
the sibling canon file stays denied, a candidate with `commit: unknown` **and** an injected needle in its
body passing GREEN, deny writing nothing, accept bootstrapping the file, and a PLAN citing `[L1]`
resolving GREEN through `check-plan-lessons.mjs` with `[L2]` RED as the control. The checker-to-checker
half of that seam is now a committed test, so it outlives the session.

**Still absent:** a live agent-driven run of the command through its accept/deny gate. Doing it in **this**
repo would create a root `memory-bank/lessons-learned.md` competing with the apparatus's
`.dev/memory-bank/` — a second canon, which is why the port brief specified a temp dir instead. A real
dogfood belongs in a throwaway project and is `/pharn-dev-eval` territory: recorded as follow-up
`product-memory-promote-dogfood`, not claimed as done.
