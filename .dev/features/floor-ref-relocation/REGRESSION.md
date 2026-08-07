# REGRESSION — floor-ref-relocation

Base: `7bf82bd328f180164d4b0309cf45b51c71cd02cc` (`main`, passed explicitly as `--base main`; the
increment is committed on `fix/f1-floor-ref-relocation`, so the auto-detect's working-tree branch did
not apply). Machine report: [`regression-report.json`](./regression-report.json) — the helper's
`verdict` JSON verbatim.

## Partition

- **inside (changed since base): 141 paths** — the 134 canon files carrying the existence-gated path
  rewrite, plus `pharn/floor/validate.mjs` + `validate.test.mjs` (CHECK 8), the three meta-docs
  (`CHANGELOG.md`, `SKILLS_VERSION`, `CLAUDE.md`), and this feature's own `PLAN.md` / `GRILL.md`.
- **outside tests: 59** of the 60 in the universe (`pharn/floor/validate.test.mjs` is inside).
- **outside eval pairs: 0** — no committed expected↔actual pair sits outside this feature.

### The `scope` partition, and an L17 reading that has to be stated

`check-regress.mjs scope` was run twice, deliberately, because its question and fix #7's question are
not the same one (`.dev/memory-bank/lessons-learned.md` **L17**: it tests **changed-since-base**, not
**written-by-the-build**):

| `--declared`                                          | exit  | escaped |
| ----------------------------------------------------- | ----- | ------- |
| the fix #7-**granted** set (the 5 Write-tool paths)   | **1** | **136** |
| the PLAN's **full** declared set (incl. Bash-written) | **0** | **0**   |

The 136 are **not** a scope breach, and the difference is by design rather than by accident:

- **134 canon files** — written by a Bash transform, which fix #7 structurally does not gate (**L19**).
  The PLAN declares them in its own `### Written via Bash (outside fix #7 — L19, declared not
pretended)` subsection, and because `set-writes-scope.cjs --from-plan` ends its authorized list at
  any heading (**L18**), that subsection is read by a human but deliberately **not** granted
  write-scope. The setter reported exactly **5** paths, matching the 5 approved at the plan gate.
- **2 pipeline artifacts** (`PLAN.md`, `GRILL.md`) — written by the earlier stages under their **own**
  Step-0 scopes. This is the precise false positive L17 documents.

So the honest answer to "did the build change a path the plan did not name?" is **no** — read from row
two. Row one is reported here rather than suppressed, because a `P0 fix#7` finding is exactly the kind
that must never be quietly waved through.

## Gates — `base → head` exit codes

| gate       | base  | head  | flip |
| ---------- | ----- | ----- | ---- |
| `tests`    | **0** | **0** | no   |
| `validate` | **0** | **0** | no   |

Both gate sets are identical at base and head, so the comparison is not inconclusive.

**Style gates (`lint` / `format:check` / `lint:md`) were SKIPPED**, deterministically: `inside` touches
none of `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.markdownlint-cli2.jsonc`. Over
outside files that are byte-identical at base and head, a style result cannot flip without a shared
config change, so the skip is sound and not a coverage hole. (Separately, and outside this stage's
verdict: the full `npm run check` — which does include all three — was run at HEAD and passed, 1136
tests.)

- `regressions[]`: **empty**
- `pre_existing[]`: **empty**

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
`check-regress.mjs verdict` exited **0** with `"verdict": "no-regressions"`.

That verdict is FLOOR: it rests entirely on the helper comparing two exit-code maps, never on this
stage's judgment. Everything around it — resolving the base, partitioning inside/outside, obtaining
the baseline worktree, running the suite — is advisory.

**The honest residual (P0/P7):** `/pharn-dev-regress` catches exactly what its suite catches, nothing
more. A regression no deterministic check covers is invisible to it. This says **"nothing that the
outside suite can detect broke"**, never "nothing broke". Worth naming for this increment
specifically: the transform rewrote 134 files of **prose and eval-judge text**, and no deterministic
gate reads a judge's `judge` string for meaning — so what the suite proves here is that the JSON still
parses and every test still passes, not that all 322 rewritten sentences remain true. The evidence for
that is the inversion proof recorded in the CHANGELOG (all 134 files' only delta is the path
substitution) and the HALT-2 human diff review, neither of which is this stage's floor.
