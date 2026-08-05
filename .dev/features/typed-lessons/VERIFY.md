# VERIFY — typed-lessons

## FLOOR layer (owns the verdict)

Six deterministic gates, all re-run **once at HEAD** over the repo with the feature in it. Every gate is an
**existing** check — `/pharn-dev-verify` invents none.

| gate                                    | command                                      | exit |
| --------------------------------------- | -------------------------------------------- | ---- |
| `test`                                  | `npm test`                                   | 0    |
| `validate`                              | `node pharn/floor/validate.mjs .`            | 0    |
| `lint`                                  | `npm run lint`                               | 0    |
| `format:check`                          | `npm run format:check`                       | 0    |
| `lint:md`                               | `npm run lint:md`                            | 0    |
| `structural:expected-injection-comment` | `check-structural.mjs <expected> <actual> .` | 0    |

**Live suite count (read this run, never asserted from memory — P6): 862 tests, 862 pass, 0 fail** (839 at
the pre-build baseline; +23 from this increment — 20 in `.dev/floor/check-provenance.test.mjs`, 3 in
`pharn/floor/check-plan-lessons.test.mjs`).

`check-verify.mjs .pharn/pharn-dev-verify/results.json --feature typed-lessons` → **`"verdict": "PASS"`**,
`failing_gates: []`, exit **0**.

**The `test` + `lint` + `format:check` + `lint:md` set is exactly the repo's `npm run check` aggregate**, so
this verdict tracks the full aggregate — L9's style-coverage hole closed at verify. **L11 note:** those
gates are **whole-repo** with no base comparison, so a pre-existing style error in an unrelated committed
file would have failed this feature's verify. None fired: the repo was style-clean at HEAD.

Also run, though not part of the canonical gate map: `npm run docs:check` → **CATALOG: GREEN** (the generated
`docs/capabilities/` pages and the README current-state block still match their sources). This was predicted
at plan time and confirmed here: no `role:`-bearing capability, floor-checker count under `pharn/floor/`, or
dev-command name changed, so the generated regions do not move.

### Feature-specific evidence (what actually verifies THIS increment)

The whole-repo gates answer "is the repo green with this in it". The feature-specific signal is the 23 new
`node --test` cases collected by `npm test`, notably:

- **the L14 witness** — a concept of `"enum-gate\n"` is RED. `/^[a-z0-9-]+$/.test("enum-gate\n")` is `true`
  in JS, so this case fails the moment the control-char guard is replaced by the shape regex rather than
  composed with it;
- **the ✧ P4 agreement case** — the `/pharn-dev-memory-promote` doc's marked member list is derived from the
  doc and compared against `TYPE_ENUM` derived from `check-provenance.mjs`; neither side is restated in the
  test, so a seventh member added to one and not the other fails here;
- **the ★ P2 case, retained** — an instruction-looking needle in `title`/`body` still leaves the verdict
  GREEN, re-proving the free-text fields stay outside the verdict now that two more enum-gated fields exist;
- **three `check-plan-lessons` regressions** — a lessons canon whose entries carry a tag line still resolves
  cited ids, still REDs a nonexistent id, and still declares exactly 3 lessons (the tag line is never
  mistaken for a heading). `pharn/floor/check-plan-lessons.mjs` is **byte-unchanged**.

## ADVISORY layer (annotates; never flips the verdict)

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.

**No verifiers registered — floor gates only.** Membership is a deterministic frontmatter read, not a prose
grep (L6). Zero is the correct state, not a gap: no verifier is authored speculatively (P7). Step 2 is a
no-op and the verdict is the floor gates alone.

## Verdict

**VERIFY: PASS — the six named deterministic gates passed.**

**What that means, exactly (P0):** the named gates passed. Nothing more. `/pharn-dev-verify` guarantees
**exactly what those gates check** — a defect no test, eval, rule or lint covers is **invisible** to this
verdict, and the verifier layer that might have noticed it is advisory and, today, empty. "PASS" is **not**
"the feature is correct."

Two clocks: the verdict is floor-grade (`check-verify.mjs`, an absolute exit-code threshold over the gate
map). **Which** gates are in that map is this stage's **advisory** composition — there is no floor lock
keeping `format:check` and `lint:md` in the set (L9's remedy lives in orchestration, exactly where L9 places
it). Do not read "verify runs the style gates" as floor-locked.

One thing this stage explicitly does **not** verify, restated so it is not lost between artifacts: the floor
validates the promotion **candidate**, never the **rendered** canon entry — the tag line reaching canon in
conforming shape is advisory (follow-up `lesson-tagline-render-check`).
