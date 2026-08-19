# VERIFY — entry-point-guard

**This is iteration 2**, recomputed after the GATE-2 fixes. Every gate below was re-run; iteration 1's
PASS was not carried forward.

## FLOOR layer — the deterministic gates (these OWN the verdict)

| gate                                    | exit | note                                                               |
| --------------------------------------- | ---- | ------------------------------------------------------------------ |
| `test`                                  | 0    | `npm test` — 1455 tests pass, including this feature's 10 new ones |
| `validate`                              | 0    | `pharn/floor/validate.mjs .` — GREEN, 36 capabilities checked      |
| `lint`                                  | 0    | eslint clean                                                       |
| `format:check`                          | 0    | prettier clean (whole-repo — L9)                                   |
| `lint:md`                               | 0    | markdownlint clean (whole-repo — L9)                               |
| `structural:expected-injection-comment` | 0    | `check-structural.mjs` over the one committed eval pair            |

`node pharn/floor/check-verify.mjs … --feature entry-point-guard → exit 0`, `"verdict": "PASS"`,
`failing_gates: []`.

```text
VERIFIED: floor gates PASS
```

The gate SET above is this command's **advisory** composition; only the PASS/FAIL reduction over it is
FLOOR (`check-verify.mjs`, an absolute exit-code threshold — PASS iff every gate exits 0). Nothing
floor-locks the two style gates into the map (L9's remedy lives in this orchestration layer by design).

### What the feature's own gates actually exercised

The `test` gate carries this increment's evidence, and it was checked as more than a green count —
each assertion class was **mutated** and confirmed to RED before being trusted (L4: an authored fixture
passes by construction):

| mutation injected into a scratch copy                                        | caught by                                    |
| ---------------------------------------------------------------------------- | -------------------------------------------- |
| the original `` `file://${process.argv[1]}` `` guard, reintroduced           | sweep (2 tests) + the spaced/non-ASCII probe |
| `pathToFileURL(process.argv[1]).href` — the near-miss repair                 | sweep + the **symlink** probe                |
| `main(process.argv)` in place of `process.exit(main(process.argv.slice(2)))` | the `render-cost-record.mjs` argv/exit probe |
| `executableSource()` neutered to a pass-through (iteration 2)                | the sweep + the stripper's own fixture test  |

The second row is the one worth noting: the repair originally requested would itself have been caught
here, which is what makes the GATE-1 decision **enforced** rather than merely recorded. The fourth was
added in iteration 2, after the stripper test was rewritten to run on a synthetic fixture — a
decoupling that could have quietly made it vacuous, so it was re-proven rather than assumed.

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.

**No verifiers registered — floor gates only.** Step 2 is a no-op; none exists to author speculatively
(P7). Had any registered, its findings would be appended here as quoted DATA **after** the verdict was
computed, and could never flip it (fix #3) — `check-verify.mjs`'s only input is the gate→exit-code map,
so it cannot even receive a finding.

## Honest residual (P0/P7)

**Verified = the named gates passed.** This is NOT a guarantee of correctness beyond what those gates
check — verifier concerns would be advisory help, not assurance. Concretely, for this increment:

- The gates prove the guard now fires from a normal, spaced, non-ASCII, and symlinked path **for the
  three scripts the probes spawn**, and that no executable line under either floor carries either
  banned spelling. They do **not** prove every path shape works for every script, and the sweep pins a
  **vocabulary** — a novel wrong spelling would pass untouched.
- Most floor scripts have no entry guard at all (5 of 48 under `pharn/floor/`, 6 of 12 under
  `.dev/floor/`), so the sweep is **vacuously green** over the rest. `GUARDED_MIN` pins that denominator
  against silent erosion; it does not widen the claim.
- `executableSource()` can **under-**detect as well as over-detect: any line whose trimmed form opens
  with `*` is dropped, so an executable statement in that shape would be skipped. Verified live that
  **no such line exists** under either floor (0 across 30,191 lines scanned), which is why the rule is
  acceptable — not because it cannot miss. This bound is now stated in both directions in the test's own
  docstring; iteration 1 stated it one-way, which is the P0 shape and is what iteration 2 fixed.
- **All four `REVIEW.md` findings from iteration 1 are now closed** — three by code change, one by
  removing the coupling that caused it. Nothing is deferred.
