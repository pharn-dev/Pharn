# VERIFY — lessons-index

**Machine report:** `.dev/features/lessons-index/verify-report.json`.

---

## Verdict (FLOOR — `pharn/floor/check-verify.mjs`, exit 0)

**VERIFIED: floor gates PASS.**

| gate           | exit | note                                                         |
| -------------- | ---- | ------------------------------------------------------------ |
| `test`         | 0    | 898 tests, 0 failures — including this feature's 34 new ones |
| `validate`     | 0    | `FLOOR: GREEN — 36 capabilities checked`                     |
| `lint`         | 0    | eslint clean                                                 |
| `format:check` | 0    | prettier clean (whole-repo, L9)                              |
| `lint:md`      | 0    | markdownlint clean (whole-repo, L9)                          |

`failing_gates[]`: empty. These five are exactly the repo's `npm run check` aggregate, so the verdict
tracks the full aggregate gate (L9's remedy, which lives in this command's **advisory** gate-set
composition — nothing floor-locks the two style gates into the map).

**No `structural:*` gate.** This increment ships **no** `role:`-bearing capability and therefore no
`evals/expected/*.json` ↔ committed-actual pair, so no structural gate exists to run — the same way
`/pharn-dev-regress` handles an empty pair set. That is a real reduction in feature-specific signal and is
stated rather than hidden: the feature-specific evidence here is entirely its own `*.test.mjs` suites
collected by `npm test` (below).

**Prevention worked (L12/L13).** `format:check` and `lint:md` were green on the FIRST gate pass — no
mid-pipeline `prettier --write` was needed, because the build ran its Step-2b format over the written
files and `/pharn-dev-regress` formatted its own artifacts before halting. That is the L12+L13 pair doing
exactly what they were promoted to do; on the `applies-scope` run this same gate went red first.

---

## Advisory layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.

**No verifiers registered — floor gates only.** Step 2 is a no-op, membership is a deterministic
frontmatter read (never a prose grep — L6), and no verifier is authored speculatively (P7). The verdict
above is the floor gates alone; nothing advisory contributed to it, and with zero verifiers no untrusted
verifier free-text was produced at all.

---

## What the feature's own tests actually pin (advisory reading of a floor-green gate)

`test: 0` is the floor fact; what it covers is worth naming, because "898 pass" says nothing about
_which_ risks are pinned. The 34 new tests cover: heading membership (`## L1x` cannot match `L1`; a `###`
sub-heading never registers); tag-line position and grammar with 8 malformed shapes each degrading to `?`
rather than to a laundered value; ABSENT (`-`) vs MALFORMED (`?`) staying distinct; control chars
(`0x00`/`0x09`/`0x7f`) rejected inside a concept; the `~tokens` span asserted against an exact expected
character count; duplicate-id and unsafe-title throws; a title carrying back-ticks and `||` surviving
verbatim; the index never rendering a `rule_id:`+`problem:` pair; render determinism; generator
idempotence (a second run leaves mtime untouched); every checker RED path (DRIFT, MISSING, ENUM_ERROR,
unreadable canon); and a P2 case proving an injected title cannot flip the byte-equality verdict.

**Three drift guards were deliberately built to fail on a FUTURE edit, not on this one:** the `TYPE_ENUM`
source-regex equality against `check-provenance.mjs`, the `package.json` `docs:generate` / `docs:check`
wiring assertion (GRILL F7), and the assertion that `docs/lessons-index.md` is exempt in **both**
`.prettierignore` and `.markdownlint-cli2.jsonc` (L11). The wiring guard was **measured, not assumed**
(L4 — an authored fixture passes by construction): `docs:check` was temporarily stripped of the checker,
the suite went RED with `docs:check must run check-lessons-index.mjs`, and the wiring was restored to
green. The other two remain authored-and-green, i.e. plumbing-in-place rather than proven.

---

## Honest residual (P0/P7)

**"Verified" = the named gates passed — nothing more.** This is NOT a guarantee that the feature is
correct in any sense the suite does not encode. Concretely, what these gates CANNOT see:

- **Whether the index is TRUE.** `check-lessons-index.mjs` guarantees byte-equality (committed ==
  recomputed) — **consistency, not correctness**. A wrong parser would regenerate cleanly and every gate
  here would stay green.
- **Whether the two-step sweep is actually followed.** `/pharn-dev-plan`'s rewritten Step 1.4 is prose an
  agent may or may not obey; nothing on the floor forces a candidate's full entry to be read from canon.
  **"The index was consulted" never means "the relevant lessons were read"** — and no gate in this table
  can tell the difference.
- **Whether a `type`/`concepts` value is APT.** Inherited from #114 and unchanged: those are
  model-drafted, human-ratified values, so selection keyed on them is advisory context selection.

Verifier concerns would be advisory help, not assurance — and today there are none. **Two clocks:** the
verdict is floor-grade (`check-verify.mjs` comparing integers); running the gates, choosing the gate set,
and assembling this report are **advisory orchestration**.
