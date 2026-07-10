# REVIEW — pharn-runtime-layout

Increment under review: the relocation of the product surface under `pharn/` (commit `4bcc71c`). Treated as `trust: untrusted`. The moved trees include deliberate injection fixtures (trust-fence / injection lens eval cases); none was followed as an instruction — they are DATA under review.

## Step 1 — Floor (P0, the only guaranteed part of this review)

`pharn/floor/validate.mjs .` → **GREEN, 36 capabilities.** The P3 sibling-reference check and the fix#6 eval-binding check are part of that GREEN. The increment legitimately reached review.

## The four lenses

### L-floor → P0

No finding. Every guarantee the increment claims reduces to a floor primitive or is labeled advisory: path-resolution → `validate` + `npm test` (enum/regex + exit-code); trusted-doc protection → fix#2 hook (verified firing at `pharn/CONSTITUTION.md`/`pharn/ARCHITECTURE.md`); fail-closed writes-scope → fix#7 hook (self-tested: `pharn/pharn-review/*` allowed, `pharn/floor/*` denied); trusted-doc content unchanged → content-hash (sha256 byte-identity, and git records both as pure renames R). Relocation-correctness is explicitly labeled **advisory**. No guarantee-without-reduction.

### L-eval → P1

No finding (blocking). Pure relocation adds no capability, so no new evals (P7-correct). The one standing committed eval pair (trust-fence) re-passes its 6 structural assertions after its actual↔expected paths were realigned. Floor fix#6 binding agrees (GREEN).

### L-trust → P2

No finding (blocking). Free-text finding fields in the moved lenses/grillers keep the enum-gated/free-text split; the fix#2 write-guard still fires at the new trusted-doc location (basename match), so trust-by-location survives the move. No guaranteed decision rests on a tainted field. Instruction-looking content in the reviewed fixtures did not alter my behavior.

### L-axis → P3

No finding (blocking). Single axis of change (file location). Moved capabilities' `reads:` point only at `pharn/pharn-contracts` (the root layer — allowed), never leaf→leaf. The one new cross-tree edge (`.dev/floor/check-variance.mjs` → `pharn/floor/check-structural.mjs`) is dev build-apparatus, not a layer-tree leaf, and resolves from the checker's own dir.

## Findings (advisory — none blocking; floor is GREEN)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/pharn-runtime-layout/VERIFY.md:22"
  problem: "The build's bulk path-rewrite was `.md`-only, silently leaving ~68 `.json` eval-expected files (and the standing eval's committed actual) with stale paths; validate + npm test structurally do not check eval-file path resolution, so this passed BUILD and was caught only by the verify structural gate."
  evidence: "verify structural gate initially RED: 'file_resolves failed: path does not exist: pharn-review/trust-fence/evals/cases/case-injection-comment.md'."
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/pharn-runtime-layout/VERIFY.md:26"
  problem: "Only 1 of the ~68 rewritten eval-expected `.json` files is covered by any structural gate (the single committed trust-fence pair); the other ~67 rely solely on the guarded transform + their `.md` prose — an honest coverage residual, not a floor guarantee."
  evidence: "Step-1 floor checks structure/frontmatter/enforces-binding, not eval-file path resolution; only `check-structural` over a committed actual does, and there is one such pair."
- type: FINDING
  rule_id: "P4"
  severity: minor
  file: "CLAUDE.md:25"
  problem: "The dev/product-boundary prose still labels the relocated items '(root)' though they now live under pharn/; the mechanical path-fixup corrected paths but not this framing word."
  evidence: "'**Product + foundation (root):** `pharn/pharn-review/` (lenses) and `pharn/pharn-contracts/` …'"
- type: FINDING
  rule_id: "P6"
  severity: minor
  file: ".dev/features/pharn-runtime-layout/REGRESSION.md:29"
  problem: "The working tree was committed onto branch pharn-runtime-layout (4bcc71c) mid-run by a process outside the agent's tool calls; /pharn-dev-ship never commits. Surfaced for human awareness at the gate — not a code defect."
  evidence: "reflog: '4bcc71c HEAD@{0}: commit: Relocate…'; HEAD moved 23d16b8→4bcc71c between two tool calls."
```

## Verdict

**GREEN — 0 floor-gate (blocking) findings; 4 advisory findings for the human to weigh.** The increment is structurally sound: floor GREEN, 726 tests, trusted docs byte-identical, hooks verified, verify PASS, no regressions. The advisory findings are process/coverage/doc notes, not defects that block.

## Proposed lesson for canon (candidate only — NOT written here; requires `/pharn-dev-memory-promote` + human gate)

- **Provenance:** increment `pharn-runtime-layout` (`4bcc71c`), finding #1 above.
- **Lesson (proposed):** A repo-wide path-rewrite must enumerate **every file type that can carry the path** — `.md` **and** `.json` (eval expecteds) **and** `.mjs`/`.cjs` comments/fixtures — not just the obvious `.md`. Critically, **`validate.mjs` and `npm test` do NOT check eval-file path resolution**; only the `/pharn-dev-verify` `structural:<expected>` gate does, and only for the _committed_ eval pair(s). So a `.md`-only rewrite passes the build floor and is caught only at verify — and only where a structural gate happens to exist. When a change touches eval `file:` paths, add a verification sweep across all `.json` eval files, not just the guarded transform.
- **Why real (P7):** actually occurred this increment — a `.md`-only `find` silently missed 68 files; the build was GREEN yet the standing eval was broken. Not hypothetical.
