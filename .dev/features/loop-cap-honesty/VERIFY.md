# VERIFY — loop-cap-honesty

Did the feature get built CORRECTLY (does it satisfy its own requirements)?
**Verdict (FLOOR — `.dev/floor/check-verify.mjs`, exit 0): `VERIFIED: floor gates PASS`.**

## FLOOR layer — deterministic gates at HEAD (owns the verdict)

| gate                      | exit | result |
| ------------------------- | ---- | ------ |
| `test` (`npm test`)       | 0    | OK     |
| `validate` (whole-repo)   | 0    | OK     |
| `lint` (eslint)           | 0    | OK     |
| `format:check` (prettier) | 0    | OK     |
| `lint:md` (markdownlint)  | 0    | OK     |
| `structural:trust-fence`  | 0    | OK     |

`PASS iff every gate exit 0` → **PASS**, `failing_gates: []`. The `test` + `lint` + `format:check` +
`lint:md` set is exactly the repo's `npm run check` aggregate (L9), so an increment's own markdown style
is caught here. The `structural:trust-fence` gate re-checks the one committed eval pair
(`pharn-review/trust-fence/evals/expected/expected-injection-comment.json` ↔
`.dev/features/trust-fence/findings.json`).

## ADVISORY layer — verifiers

**No verifiers registered — floor gates only.** `count-verifiers.mjs .` → `{"registered":0}` (deterministic
frontmatter membership, not a prose grep). Step 2 is a no-op; the verdict is the floor gates alone. No
verifier is authored speculatively (P7).

## Feature-specific note (honest granularity)

The feature changed exactly one file, `.claude/commands/pharn-loop.md` (the plan's sole `## Files` path,
present at HEAD → build complete). That file is **floor-ignored** by `validate` (`.claude/commands/` is
excluded from the product-surface scan) and ships **no** eval, so **no gate above inspects the content of
the relabel itself** — the floor gates confirm only that the whole repo stayed green with the edit in it.
The correctness of the FLOOR-compare/ADVISORY-bound relabel wording is **human-reviewed** (approved at
GATE 1; presented again at the post-review gate), exactly as GRILL finding #1 (important) flagged.

**Honest residual (P0/P7):** verified = the named gates passed; this is **NOT** a guarantee of correctness
beyond what those gates check — and for a `.claude/commands/` prose edit that means "nothing else broke,"
not "the relabel is right." Verifier concerns would be advisory help, not assurance; none exist today.
