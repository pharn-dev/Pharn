# REGRESSION — scope-file-case-guard

**Base:** `461216dc01c08b09eec0dfc6f3effdfa30c95bb6` (working-tree dogfood → `base = HEAD`, resolved by
the deterministic state test: `git status --porcelain` non-empty).

## Partition

**Inside (10 paths changed since base):** the six the PLAN's `## Files` declares, plus this feature's own
stage artifacts (`PLAN.md`, `GRILL.md` — exempted by `--feature`), plus the two from the GATE-1-authorized
baseline repair (`BASELINE-REPAIR.md`, `.markdownlint-cli2.jsonc`).

**Outside:** 65 test files + 1 committed eval pair
(`pharn/pharn-review/trust-fence/evals/expected/expected-injection-comment.json` ↔
`.dev/features/trust-fence/findings.json` — **both confirmed readable before their exit codes were
recorded**, per the L5/L16/L21 input-capture boundary; a guessed path there produces an ENOENT red that is
equal on both sides and would mask a real structural-gate regression).

### The scope check was run BOTH ways, and the difference is reported rather than resolved silently

| `--declared` input                           | exit  | `escaped`                                                        |
| -------------------------------------------- | ----- | ---------------------------------------------------------------- |
| PLAN `## Files` only (**as prescribed**)     | **1** | `.markdownlint-cli2.jsonc`, `.dev/features/…/BASELINE-REPAIR.md` |
| PLAN `## Files` ∪ BASELINE-REPAIR `## Files` | **0** | none                                                             |

**The as-prescribed escape is real and is not waved away.** Two paths changed since base that the
approved PLAN does not name. **Their cause is known, authorized, and separately gated:** the human chose
"fix them first, then proceed" at GATE 1, and the repair was written under **its own** declared
writes-scope (`set-writes-scope.cjs --from-plan .dev/features/scope-file-case-guard/BASELINE-REPAIR.md`
→ 1 path), deliberately **outside** the increment to keep it to one axis of change (P3).

This is **L17's shape exactly** — `scope` computes `escaped` from `git diff <base>`, which answers _what
changed since base_, not _what the build wrote_. The build wrote **only** its six declared paths, gated
live by fix #7 the whole time. The union row is reported as the answer to the question the check is
_for_; the prescribed row is reported because suppressing it would be the laundering this repo exists to
prevent. **A future increment that writes outside its plan will still trip the prescribed row** — the
exemption here is one run's stated reasoning, not a change to the checker.

## Per-gate comparison (base → head)

| gate                                         | base | head | result |
| -------------------------------------------- | ---- | ---- | ------ |
| `tests` (65 outside files)                   | 0    | 0    | stable |
| `validate`                                   | 0    | 0    | stable |
| `structural:expected-injection-comment.json` | 0    | 0    | stable |
| `format:check`                               | 0    | 0    | stable |
| `lint`                                       | 0    | 0    | stable |
| `lint:md`                                    | 0    | 0    | stable |

The style gates ran because `inside` touches a shared style config (`.markdownlint-cli2.jsonc`) — the
deterministic config-touch rule, which is the only case where an outside style result can flip. That
required `npm ci` in the baseline worktree (the named cost, `LIMITS.md §3c` analog); it exited 0.

## A harness defect reproduced live (L16), and why the first baseline number was discarded

The first baseline capture recorded `tests=1`. **It was investigated, not accepted** — and it was
bogus: the expansion used `xargs -a outside-tests.txt`, and `-a` is a **GNU** flag that macOS BSD
`xargs` rejects outright (`xargs: invalid option -- a`). Re-run through the portable stdin form
(`cat … | xargs node --test`) the same gate exits **0** across 1301 tests.

Left unexamined this would have been the precise failure L16 documents: equally bogus at base and head,
`check-regress.mjs` classifies it `pre_existing` rather than a regression — evading a false alarm while
**masking** a real one. Two notes for `/pharn-dev-review`:

- **No command file prescribes `xargs -a`** — the command text says only "through `xargs`". The trap was
  this run's, and canon caught it.
- **It has now recurred at least eight times.** Seven prior feature records document hitting the same
  flag (`floor-selfpath-correction`, `product-lessons-index`, `scan-plan-relocation`, `format-step-scope`,
  `template-mask-nesting-3`, `features-readme-spec-live`, and its own promotion). That is **L20's**
  signature — a lesson whose only remedy is discipline recurring — and the remedy L20 prescribes is a
  floor check or a fixed snippet, not a louder reminder.

## Verdict

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
(`check-regress.mjs verdict` → exit **0**, `"verdict": "no-regressions"`; machine report:
`regression-report.json`, written verbatim.)

**What this does and does not say (P0).** The verdict is floor-grade: it is an exit-code comparison, not
a judgment. Everything around it — choosing the base, partitioning, running the suite — is **advisory
orchestration**. And it catches **exactly what the suite catches, nothing more**: a breakage no
deterministic check covers is invisible here. Never read this as "nothing broke."

**It says nothing about this feature's own four failing tests.** Those live in
`.claude/hooks/protect-trusted-paths.test.cjs`, which is **inside** the changed scope and therefore not
an outside gate. They are the new detectors firing correctly at a hook whose one-line patch is still
pending a human `git apply` — that is `/pharn-dev-verify`'s verdict to render, not this stage's.
