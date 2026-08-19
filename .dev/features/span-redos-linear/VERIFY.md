# VERIFY — span-redos-linear

**Verdict: `PASS`** (`pharn/floor/check-verify.mjs` → exit **0**). Deterministic: PASS iff **every** gate
exits 0 — an absolute exit-code threshold computed by the checker, never judged here.

## FLOOR layer — these own the verdict

| gate                                    | exit | what it covers                                                       |
| --------------------------------------- | ---- | -------------------------------------------------------------------- |
| `test`                                  | 0    | whole hermetic suite — **1443 tests, 1443 pass, 0 fail** (read live) |
| `validate`                              | 0    | `pharn/floor/validate.mjs .` — GREEN, 36 capabilities                |
| `lint`                                  | 0    | eslint, whole-repo                                                   |
| `format:check`                          | 0    | prettier, whole-repo (L9)                                            |
| `lint:md`                               | 0    | markdownlint, whole-repo (L9)                                        |
| `structural:expected-injection-comment` | 0    | the one committed eval pair                                          |

`failing_gates: []`. The `test` + `lint` + `format:check` + `lint:md` set is exactly the `npm run check`
aggregate, so this verdict tracks the full `npm run check` — including this increment's own markdown.

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`. **Zero verifiers exist**
(P7 — none authored yet), so the run is floor gates only. Had any existed, their findings would
**annotate** and could never flip the verdict (fix #3).

## Evidence specific to this increment

The whole-repo gates above are the honest "is it green with this in it" signal, but they are not what
makes _this_ change verified. Three feature-specific facts, each measured this run rather than reasoned:

1. **The repro is fixed.** `fetch(` + `((a)`×28 scanned in **7.26 s** before and **0.026 s** after
   (wall-clock, whole process incl. Node startup).
2. **Detection did not narrow.** The differential fuzz over 200 000 inputs found **0** language
   divergences between the old and new span, and the ★-pinned nested cases —
   `fetch(new URL(req.query.url))` and `fs.readFile(path.join(base, req.params.x))` — still produce
   their exact expected hits. The ★ GUARD (no over-span to `[^;]*?`) and the documented depth > 1
   true-negative are unchanged.
3. **The new regression test can actually fail.** A scratch copy of the scanner carrying the _old_ span
   was killed at the 3 s subprocess timeout (`signal: SIGTERM`) while the shipped one completed cleanly
   (`signal: null, status: 0`). A regression test never observed failing is not evidence (L4); this one
   was.

## What PASS means, exactly (P0)

It means **the named gates passed** — nothing more. It does not mean the span is correct for every input,
and the linearity claim now in the three scanner headers rests on measurement across 11 adversarial paren
families up to ~480 KB lines plus the unambiguity argument, **not** on a proof. The ReDoS test pins one
adversarial shape, not "the regex is safe against all inputs"; that bound is stated in the test's own
comment and in the headers.
