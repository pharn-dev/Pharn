# VERIFY — version-badge-pin

## FLOOR layer — the gates that own the verdict

| Gate                                         | Exit |
| -------------------------------------------- | ---- |
| `test` (1329 tests, incl. 27 new)            | 0    |
| `validate` (36 capabilities)                 | 0    |
| `lint`                                       | 0    |
| `format:check`                               | 0    |
| `lint:md`                                    | 0    |
| `structural:expected-injection-comment.json` | 0    |

`node pharn/floor/check-verify.mjs` exit **0**.

**VERIFIED: floor gates PASS.**

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.

**No verifiers registered — floor gates only.** Membership is a deterministic frontmatter read, not a
content grep, so the several files in this feature whose prose mentions verifiers (this artifact
included) correctly register as zero.

## Feature-specific evidence, beyond the whole-repo gates

The whole-repo gates answer "is the repo green with this in it". The feature-specific signal is the 27
new tests collected by `npm test`, of which the load-bearing ones are mutants — each asserts the checker
**fails** when the thing it guards is broken:

- **the drift case itself** — badge `1.0.0` against `SKILLS_VERSION` `2.5.1` → exit 1, naming both values
- ambiguity (two `pharn` badges) → RED even when the _first_ badge is correct — never first-match-wins
- a pre-release `SKILLS_VERSION` → a named refusal explaining the shields `--` encoding, not a
  near-identical-looking mismatch
- both inputs broken → the `SKILLS_VERSION` refusal wins, deterministically
- prose containing `pharn-9.9.9` outside a shields URL → **not** picked up as a badge
- the two wiring pins: `package.json` runs the checker and `check` runs `check:badge`; `ci.yml` has a
  step whose `run:` is `npm run check:badge`, carrying the install-gated `if:`

Additionally verified **outside** the gate map, by running the checker against a throwaway copy of the
repo with `SKILLS_VERSION` bumped to `2.6.0` and the badge left behind: exit **1**, `[DRIFT]`. The real
`SKILLS_VERSION` was not touched. That is the end-to-end proof that the gate fires on the actual failure
mode rather than only on synthesised fixtures.

## A defect found during this increment, in canon, not fixed here

`.dev/memory-bank/lessons-learned.md` **L14** states that JavaScript `$` without the `m` flag "matches at
end-of-string OR just before a single trailing newline, so `/^P[0-7]$/.test('P2\n') === true`". Verified
live on Node v24.13.1: that expression is **`false`**. `$` without `m` matches only at end of input in
JavaScript; the behaviour L14 describes is Perl/Python/PCRE and needs the `m` flag here.

It surfaced because the new test suite asserted L14's mechanism as a **precondition** rather than
assuming it, and the assertion failed. L14's **remedy** (compose the clean-scalar guard before the shape
regex, never replace it) is sound and this checker follows it; only its stated **reason** is wrong. The
checker's own header and a dedicated test now record the correction so the false claim is not propagated
into a new file. Canon is edited only through a gated promotion with human approval, and
`.dev/memory-bank/` is not in this increment's `## Files`, so this reports rather than fixes.

## The honest residual

**Verified = the named gates passed.** This is **not** a guarantee of correctness beyond what those
gates check — a defect no test, eval, rule, or lint covers is invisible to this verdict, and the
verifier layer that might have noticed it is advisory and currently empty. Verifier concerns, when they
exist, are advisory help, not assurance.
