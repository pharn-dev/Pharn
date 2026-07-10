# REGRESSION — pharn-runtime-layout

- Base: `23d16b8` (merge-base with `origin/main` — the pre-relocation OLD layout)
- Head: `4bcc71c` ("Relocate the product surface under pharn/…" — the NEW layout)
- Inside (changed) scope: **507 files** (the relocation diff).
- Outside gates measured: the **10 unchanged test files** + `validate` + the three style gates (style gates ran because the inside diff touched shared style config — `.markdownlint-cli2.jsonc`, `.prettierignore`, `eslint.config.mjs`).

## Per-gate exit codes (base → head)

| gate           | base (`23d16b8`, old layout)          | head (`4bcc71c`, new layout)     | flip? |
| -------------- | ------------------------------------- | -------------------------------- | ----- |
| `tests`        | 0 (101 tests across 10 outside files) | 0 (101 tests)                    | none  |
| `validate`     | 0 (`.dev/floor/validate.mjs .`)       | 0 (`pharn/floor/validate.mjs .`) | none  |
| `lint`         | 0                                     | 0                                | none  |
| `format_check` | 0                                     | 0                                | none  |
| `lint_md`      | 0                                     | 0                                | none  |

The `validate` gate is the same logical gate on both sides; because the checker itself relocated, each checkout ran its own `validate` path (old `.dev/floor/` at base, new `pharn/floor/` at head) so the comparison measures the gate, not the move.

## Deterministic verdict (floor — `pharn/floor/check-regress.mjs verdict`, exit 0)

**REGRESSIONS: none — no deterministically-detectable breakage outside the feature.**
`regressions: []`, `pre_existing: []`. No outside gate flipped pass→fail.

Honest residual (P0/P7): `/pharn-dev-regress` catches **exactly what its suite catches — nothing more.** This says the deterministic gates over the unchanged files are as green after the relocation as before; it is **not** a claim that "nothing broke" in any broader sense. Behavioural correctness of the relocation itself is the feature's INSIDE scope — covered by the floor GREEN + the 726-test suite at HEAD, and judged advisorily downstream.

## Orchestration notes (advisory — the verdict above rests only on the exit-code comparison)

- **An L5 near-miss was caught and corrected.** The first capture used `xargs -a` (unsupported by macOS BSD xargs) → exit 1 at **both** base and head — a false-equal that would have masked a real `tests` regression. Replaced with a newline-split zsh array (`"${(@f)$(cat …)}"`, 10 elements verified, 101 tests). The reported `tests` gate is the corrected 0/0.
- **State change during the run (flagged, external to `/pharn-dev-regress`):** the working-tree changes were committed onto branch `pharn-runtime-layout` as `4bcc71c` partway through the run (HEAD moved `23d16b8`→`4bcc71c`; tree now clean). `/pharn-dev-ship`/`/pharn-dev-regress` never commit — this was done outside the agent's tool calls. It is surfaced for the human at the post-run gate; it did not affect the verdict (it gave a stable immutable base to compare against).
