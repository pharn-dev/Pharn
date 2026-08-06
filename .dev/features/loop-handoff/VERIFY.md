# VERIFY — loop-handoff

## FLOOR layer — the deterministic gates (this layer OWNS the verdict)

| gate                                         | exit | what it covers                                                     |
| -------------------------------------------- | ---- | ------------------------------------------------------------------ |
| `test`                                       | 0    | `npm test` — 963 tests, incl. the feature's own 55                 |
| `validate`                                   | 0    | `pharn/floor/validate.mjs .` — GREEN, 36 capabilities              |
| `lint`                                       | 0    | `eslint .`                                                         |
| `format:check`                               | 0    | `prettier --check .` — whole-repo (L9)                             |
| `lint:md`                                    | 0    | `markdownlint-cli2` — whole-repo (L9)                              |
| `structural:expected-injection-comment.json` | 0    | the one committed eval pair (trust-fence expected ↔ findings.json) |

That gate set is exactly the repo's `npm run check` aggregate plus the structural pair, so this verdict
tracks the full `npm run check` — confirmed independently during the build (`npm run check` exit 0).

**The feature's own deterministic surface**, inside the `test` gate: `pharn/floor/check-loop-record.test.mjs`,
**55 tests, all passing**. Of note for what they actually pin:

- a **✧ agreement** test extracts the canonical template out of the `LOOP-RECORD-TEMPLATE` markers in
  `pharn/pharn-contracts/loop-record.md` and runs the checker on it — so the contract, the checker, and
  `/pharn-loop` (which **cites** the contract rather than restating the shape, P4) cannot drift apart;
- **★ collision** tests pin both sides of the heading boundary: a line-initial `### next_steps` inside a
  body → RED, the inline back-ticked form → GREEN, and a fenced quote → GREEN;
- **✦ L6** tests pin that the envelope is read only from `---`-fenced frontmatter — a `decision:` line in
  prose or inside a fence never supplies the field;
- **✦ L15** pins that frontmatter keys named `toString` / `__proto__` / `hasOwnProperty` are inert;
- four GREEN decision cases, `CONTINUE` → RED, and fail-closed cases for missing file, no argv, extra argv.

## ADVISORY layer — verifiers

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}`.

**No verifiers registered — floor gates only.** Step 2 is a no-op, exactly as designed; no verifier is
authored speculatively (P7). No verifier free-text was produced, so nothing tainted entered this report.

## Verdict (FLOOR — `pharn/floor/check-verify.mjs`, exit 0)

**VERIFIED: floor gates PASS.**

Every gate exited 0, so the helper's absolute threshold (`PASS iff every gate exit 0`) returned `PASS`.
The verdict rests entirely on comparing integers — no model judgment reached it, and with zero verifiers
there was no advisory input that could have.

## Honest residual (P0/P7)

**Verified = the named gates passed.** This is **not** a guarantee of correctness beyond what those gates
check — verifier concerns would be advisory help, not assurance, and there are none. Two things this
increment specifically does **not** verify, stated rather than left implicit:

- **The checker's tests are authored fixtures** (`lessons-learned.md` **L4**). They prove the **check is
  shaped right**; they cannot prove that a real `/pharn-loop` run writes an **honest** Handoff. The only
  measurement that would touch that is a live run, and no fixture substitutes for it.
- **The record's narrative is unverifiable by construction.** `check-loop-record.mjs` asserts structure;
  that `investigated` / `learned` / `next_steps` are **true**, that `decision` **agrees** with what
  `check-loop.mjs` emitted, and that `commit` / `date` are real, are all **advisory** — a corrupted Bash
  capture yields a shape-valid lie (**L5**). **"A record was written" never means "continuity was
  achieved."**

**Two clocks:** the verdict above is floor-grade; everything this stage did around it — choosing the gate
set, running them, assembling the map — is **advisory orchestration**. In particular the gate **set** is
this command's composition, not a floor-locked list (L9's remedy lives in the orchestration layer), so
"verify runs the style gates" is discipline, not a guarantee.
