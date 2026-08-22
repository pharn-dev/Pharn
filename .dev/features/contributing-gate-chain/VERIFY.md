# VERIFY — contributing-gate-chain

## FLOOR layer (owns the verdict)

| gate                                    | exit |
| --------------------------------------- | ---- |
| `test` (whole suite, `node --test`)     | 0    |
| `validate` (structural floor)           | 0    |
| `lint` (eslint)                         | 0    |
| `format:check` (prettier)               | 0    |
| `lint:md` (markdownlint)                | 0    |
| `structural:expected-injection-comment` | 0    |

The `test` + `lint` + `format:check` + `lint:md` set is exactly the repo's `npm run check` aggregate
minus its generated-docs and marker/badge checks, so this stage's verdict tracks the style gates that
would otherwise surface only at full `npm run check` or CI (L9). The gate SET is this command's
**advisory** composition; only the PASS/FAIL reduction over it is floor.

**VERIFIED: floor gates PASS.** `pharn/floor/check-verify.mjs` returned `"verdict": "PASS"` with
`failing_gates: []` at **exit 0** — every gate exit 0. The verdict was not re-decided here.

## ADVISORY layer (verifiers)

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.

**No verifiers registered — floor gates only.** Step 2 is a no-op, and the verdict above rests on the
floor gates alone. Membership was read from `---`-fenced frontmatter, never grepped from prose.

## Honest residual (P0/P7)

**Verified = the named gates passed. This is NOT a guarantee of correctness beyond what those gates
check** — verifier concerns would be advisory help, not assurance, and there are none to report.

The bound deserves to be concrete for this increment, because it is unusually wide here. The change is
**prose in two governance documents**, and not one gate above reads that prose for meaning:

- `format:check` and `lint:md` check that the markdown is _styled_ correctly, not that it is _true_.
- `validate` excludes `.dev/` wholesale and scans the product capability surface; `CONTRIBUTING.md` and
  `SECURITY.md` are outside what it inspects.
- `test`, `lint`, and the `structural:*` eval gate are untouched by a documentation edit — their green
  is evidence that nothing broke, never evidence that the new sentences are accurate.

So a PASS here would look identical if the enumeration were wrong. What actually establishes the
enumeration's correctness is a **separate deterministic comparison run at build time** — extracting
every `npm run <x>` from `package.json`'s `scripts.check` and confirming each appears in
`CONTRIBUTING.md` (7/7 matched) — plus the live GitHub API resolution behind the slug change. Neither
is part of this verdict, and neither is re-run by any gate on a future edit. That gap is the residual
`GRILL.md` F1 raises: the repaired drift has no standing floor check, only this one-time verification.
