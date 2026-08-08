# VERIFY — floor-ref-relocation

Machine report: [`verify-report.json`](./verify-report.json) — the `check-verify.mjs` verdict verbatim,
with the advisory `verifiers` block merged in after the verdict was computed.

## FLOOR layer — the gates that OWN the verdict

| gate           | exit  |
| -------------- | ----- |
| `test`         | **0** |
| `validate`     | **0** |
| `lint`         | **0** |
| `format:check` | **0** |
| `lint:md`      | **0** |

`failing_gates[]`: **empty**. The five gates are exactly the repo's `npm run check` aggregate, so this
verdict tracks the full `npm run check` — L9's style-gate hole closed at verify (`.dev/memory-bank/lessons-learned.md`
L9, cited not restated). `npm test` collected **1136** tests, 0 failing, including this increment's
own `pharn/floor/validate.test.mjs` (6 → 15 tests).

**No `structural:*` gate**, and that is the convention rather than an omission: this feature ships no
committed expected↔actual eval pair. It adds a check to `validate.mjs`, which is a floor checker and
not a `role:`-bearing capability (`pharn/ARCHITECTURE.md §3.1`), so P1's eval obligation does not
attach and its equivalent is the `*.test.mjs` suite `npm test` already collected. **Informational,
outside this feature's map:** the repo's one committed pair (trust-fence) was run anyway and exits
**0** — recorded here as evidence, deliberately not as a gate, because inventing a gate the convention
does not produce would make the map a matter of composition rather than membership.

## ADVISORY layer — verifiers

**No verifiers registered — floor gates only.** `node pharn/floor/count-verifiers.mjs .` →
`{"registered":0,"verifiers":[]}`, a deterministic frontmatter read (P5), never a prose grep. Step 2
is a no-op and contributes nothing to the verdict. Zero verifiers exist by design (P7): none is
authored speculatively, and the live runner is deferred until the first one lands.

## Verdict

**VERIFIED: floor gates PASS.** `check-verify.mjs` exited **0** with `"verdict": "PASS"`.

That verdict is FLOOR — an exit-code threshold (`PASS iff every gate exit 0`) over a map of integers.
It is provably independent of any judgment: the helper's only input is the gate→exit-code map, and it
cannot receive a finding even in principle. Assembling that map, running the gates and writing these
artifacts is this stage's advisory work.

**Honest residual (P0/P7):** verified = **the named gates passed**; this is NOT a guarantee of
correctness beyond what those gates check — verifier concerns would be advisory help, not assurance,
and today there are none. This increment makes the residual unusually concrete and it should be read,
not skimmed: 134 of the 141 changed files are **prose and eval-judge text**, and no gate above reads a
judge's `judge` string for meaning. What PASS establishes here is that the repo is green with the
change in it — that every `.json` still parses, every test still passes, and the floor is structurally
clean. It does **not** establish that all 322 rewritten sentences remain true. The evidence for that
claim lives elsewhere and is deliberately not laundered into this verdict: the inversion proof (all
134 files' only delta is the path substitution, zero files with any other change), the idempotence
re-run, the four killed mutants, and the human diff review at HALT 2.

One thing the gates **do** establish about the increment's substance, because it was ordered
deliberately: CHECK 8 was RED on the pre-rewrite tree (exit 1, 210 findings, every one `P6/floor-path`
and no other rule_id) and GREEN after — so the check demonstrably bites, and `validate` exit 0 above
is a measurement rather than a check that could not have failed.
