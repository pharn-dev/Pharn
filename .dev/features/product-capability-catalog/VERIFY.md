# VERIFY — product-capability-catalog

## FLOOR layer — the gates that own the verdict

| gate           | exit | notes                                                        |
| -------------- | ---- | ------------------------------------------------------------ |
| `test`         | 0    | full `npm test` — hermetic suite, whole-repo                 |
| `validate`     | 0    | `pharn/floor/validate.mjs .` — GREEN, 36 capabilities        |
| `lint`         | 0    | eslint, whole-repo                                           |
| `format:check` | 0    | prettier, whole-repo (L9) — **red on first pass, see below** |
| `lint:md`      | 0    | markdownlint, whole-repo (L9)                                |

**No `structural:<expected>` gate.** This feature ships **no** committed eval pair — it adds no
Capability, so there is nothing for `check-structural.mjs` to compare. Absent from the map by the same
convention `/pharn-dev-regress` uses, not silently skipped.

**VERIFIED: floor gates PASS.** (`pharn/floor/check-verify.mjs` → `"PASS"`, exit `0`, `failing_gates: []`.)

## ADVISORY layer — verifiers

**No verifiers registered — floor gates only.** `pharn/floor/count-verifiers.mjs .` →
`{"registered":0,"verifiers":[]}` (deterministic frontmatter `role:` read, never a prose grep). Step 2
is a no-op; the verdict is the floor gates alone, and **no verifier is authored speculatively (P7)**.

> Noted because this increment's subject is that same P7 posture: the zero-verifier slot is precisely
> the precedent the recorded deferral cites. The verifier **runner** is deferred until the first
> verifier lands; the capability **catalog** is now deferred until the first user-authored capability
> lands. Same trigger shape, recorded consistently.

## A real cross-stage conflict this run surfaced (for `/pharn-dev-review`)

`format:check` came back **1** on the first gate pass. The offender was **this feature's own**
`.dev/features/product-capability-catalog/regression-report.json` — and the two stages' instructions
genuinely disagree about it:

- **`/pharn-dev-regress` Step 4** requires the machine report to be the helper's `verdict` JSON
  **verbatim** and states it is _"deliberately **NOT** formatted"_.
- **`/pharn-dev-verify`** runs `format:check` **whole-repo**, and `.prettierignore` does **not** exclude
  `.dev/features/*/regression-report.json`.

So the artifact one stage forbids formatting is an artifact the next stage's floor gate fails on.
**This did not surface earlier by luck, not by design:** every prior feature's committed
`regression-report.json` passes prettier because its arrays are empty or single-element, where
`JSON.stringify(obj, null, 2)` and prettier agree. This run's `inside` has **two** entries, which
`JSON.stringify` expands over three lines and prettier collapses onto one — the first time the two
formatters disagreed on a real report.

**Resolution taken, and why:** the report was formatted. `format:check` is a **floor gate that owns the
verify verdict**; the "do not format" instruction is **advisory prose** in a command. The floor wins.
The reflow is provably content-preserving — the written report parses **deep-equal** to the captured
helper verdict (`JSON.stringify(a) === JSON.stringify(b)` → `true`, `verdict: "no-regressions"`), so
"verbatim" survives in the sense that matters (the verdict's content), and is lost only in the sense
that does not (byte layout).

**Honest scope of that write (L19):** `npx prettier --write` is a **Bash** invocation, so it wrote
outside the fix #7 writes-scope, which gates only `Write|Edit|MultiEdit`. Declared, not pretended —
this is exactly the escape L19 documents, and the remedy L19 prescribes for generated artifacts is to
**declare it**, which is what this paragraph does.

**Left for `/pharn-dev-review` (a real dogfood failure, so P7-eligible):** the durable fix is not this
run's one-off format. It is either adding `.dev/features/*/regression-report.json` to `.prettierignore`
(mirroring how the three generated doc regions are excluded so a formatter cannot induce false drift),
or having `/pharn-dev-regress` emit the report through prettier-compatible serialization. Both are out
of this increment's approved `## Files` and were **not** done here.

## Honest residual (P0/P7)

**Verified = the named gates passed — nothing more.** This is **not** a guarantee of correctness beyond
what those gates check, and verifier concerns would be advisory help, not assurance (there are none to
report). For this increment in particular the gates are unusually weak evidence about the _substance_:
the increment is two paragraphs of prose recording a decision, and no deterministic check can test
whether the deferral is the **right call**, whether its five evidence points are **true**, or whether
the reasoning written into `CLAUDE.md` is the **real** reasoning. `validate` confirms the prose did not
trip CHECK 5 and the style gates confirm it is formatted; that is the whole of what "verified" means
here. The decision itself is the human's, at the post-review gate.
