# VERIFY — grill-lessons-reverify

**VERIFIED: floor gates PASS.**

Second run of this stage. The first ran before `/pharn-dev-review`; the review's F1 fix then changed 13
shipped griller files plus three command files, so the gates were re-run at the new HEAD rather than
carried forward. The verdict below is `check-verify.mjs`'s (exit **0**), verbatim in
`verify-report.json`.

## FLOOR layer — the gates that OWN the verdict

| gate                                    | exit |
| --------------------------------------- | ---- |
| `test`                                  | 0    |
| `validate`                              | 0    |
| `lint`                                  | 0    |
| `format:check`                          | 0    |
| `lint:md`                               | 0    |
| `structural:expected-injection-comment` | 0    |

`failing_gates[]`: empty. `PASS iff every gate exit 0` — the threshold held.

The `test` + `lint` + `format:check` + `lint:md` set is exactly the repo's `npm run check` aggregate, so
this verdict tracks the full style chain (L9). The eval-pair paths were confirmed readable with `test -r`
before their exit code was recorded, so a mis-typed path would fail loudly as a setup error rather than
quietly as a gate verdict (L5 / L16 / L21).

## ADVISORY layer — verifiers

**No verifiers registered — floor gates only.** `node pharn/floor/count-verifiers.mjs .` →
`{"registered":0,"verifiers":[]}` — a deterministic frontmatter read (`role: verifier`), never a prose
grep. Step 2 is a no-op and the verdict is the floor gates alone. Zero verifiers are authored, by P7:
none has been triggered by a real failure.

## Honest residual (P0)

**Verified = the named gates passed.** This is **not** a guarantee of correctness beyond what those gates
check; verifier concerns would be advisory help, not assurance — and there are none, because there are no
verifiers.

This increment is an unusually sharp demonstration of that residual, and it is worth recording rather
than leaving implicit. `/pharn-dev-review` found **24 false claims across 13 shipped griller files** — a
P0 contradiction on the product surface — and **every gate in the table above was exit 0 both before and
after that defect was fixed.** No deterministic check ranges over capability prose, so the floor verdict
was, correctly, silent about it. A PASS here says the gates passed. It has never said the feature is
right, and this run is the proof of why that distinction is not pedantry.

The lesson candidate proposed in `REVIEW.md` names the remedy that would have caught it earlier — a
repo-wide substring sweep at plan time — and is deliberately **not** a new floor primitive.
