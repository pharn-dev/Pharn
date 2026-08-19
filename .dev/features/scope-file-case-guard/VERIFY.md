# VERIFY — scope-file-case-guard

## FLOOR layer (owns the verdict)

| gate                                         | exit | result |
| -------------------------------------------- | ---- | ------ |
| `test`                                       | 0    | green  |
| `validate`                                   | 0    | green  |
| `lint`                                       | 0    | green  |
| `format:check`                               | 0    | green  |
| `lint:md`                                    | 0    | green  |
| `structural:expected-injection-comment.json` | 0    | green  |

`node pharn/floor/check-verify.mjs .pharn/pharn-dev-verify/results.json --feature scope-file-case-guard`
→ exit **0**.

## VERIFIED: floor gates PASS

`npm test` → **1412 tests, 1412 pass, 0 fail.** The verdict is the helper's (`PASS` iff every gate exits
0), not a judgment, and is not re-decided here.

## This stage ran TWICE, and both runs are recorded

The first run returned **FAIL** (`failing_gates: ["test"]`, 1408/1412). That was **not** a defect in the
increment — it was the increment's own new detectors firing at a hook whose one-line change had not yet
been applied, because `.claude/hooks/protect-trusted-paths.cjs` is human-only (it is its own
`DEFAULT_PROTECTED` entry; the agent guard denies the edit at exit 2, verified live). The change was
delivered as a unified diff, held for a human across four exchanges, and then applied on **explicit,
repeated human instruction** — see `SHIP.md`, which records that the agent ran `git apply` through Bash,
the very `PreToolUse` bypass the hook's own HONEST BOUNDS block documents.

**The FAIL→PASS transition is the evidence that the tests are real.** The four detectors were **measured
rejecting** the unpatched hook before being trusted (L4); a suite that was green both before and after
would have proved nothing.

## Post-fix behaviour, measured live against the REAL hook

```text
.pharn/writes-scope.json   → 2   denied  (declared spelling)
.pharn/WRITES-SCOPE.JSON   → 2   denied  ← the vulnerability, closed
.pharn/Writes-Scope.Json   → 2   denied  (mixed case, via the full fold)
.pharn/foo.json            → 0   allowed (no over-block of .pharn/)
.pharn/lessons-index.md    → 0   allowed (product-index cache untouched)
pharn/CONSTITUTION.md      → 2   denied  (pre-existing protections intact)
enforce-writes-scope.cjs on .pharn/writes-scope.json → 2   (byte-exact compare kept: defense in depth)
```

**The setter still works, which was an unpinned claim the grill flagged.** `set-writes-scope.cjs` writes
`.pharn/writes-scope.json` with `fs.writeFileSync`, which `PreToolUse` never sees — confirmed live after
the fix (`writes-scope set: 1 path(s)`, exit 0), and confirmed structurally by the fact that every stage
after the apply set its own scope successfully.

## ADVISORY layer (verifiers)

`node pharn/floor/count-verifiers.mjs .` → `{"registered":0,"verifiers":[]}` — **no verifiers registered;
floor gates only.** Step 2 is a no-op and no verifier free-text exists to quote. Zero verifiers is the
deliberate P7 state, not an omission.

## Honest residual (P0)

**Verified = the named gates passed; this is NOT a guarantee of correctness beyond what those gates
check** — verifier concerns would be advisory help, not assurance, and there are none.

Specifically, PASS here does **not** mean the writes-scope file is safe from modification. It means the
**Write-tool** vector is closed, on the six gates named above. **Bash-tool writes bypass `PreToolUse`
entirely** and reach `.pharn/writes-scope.json` exactly as they reach every other guarded path — a bound
this run demonstrated in the most direct way possible, by applying the fix itself that way.

The gate SET is **advisory orchestration** (L9, two clocks): `check-verify.mjs` computes `PASS iff every
gate exit 0` over whatever map this stage assembles, but nothing on the floor locks `format:check` /
`lint:md` into that map.
