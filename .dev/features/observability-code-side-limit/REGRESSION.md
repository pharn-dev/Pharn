# REGRESSION — observability-code-side-limit

**Verdict: `no-regressions`** (`pharn/floor/check-regress.mjs verdict` exit 0). Machine report:
`regression-report.json`. The verdict is a deterministic exit-code comparison — zero LLM judgment in
its core; the orchestration that captured its inputs is advisory (L5).

## Base and head

- **base:** `b7626d4` (`changes (#139)`), measured in a **clean detached worktree**, not by reasoning
  about what "should" be unaffected (L4 — an authored claim is not a measurement).
- **head:** the working tree.

## Outside-gate comparison

| Gate            | base | head | flip |
| --------------- | ---- | ---- | ---- |
| `test`          | 0    | 0    | —    |
| `validate`      | 0    | 0    | —    |
| `lint`          | 0    | 0    | —    |
| `docs:check`    | 0    | 0    | —    |
| `check:markers` | 0    | 0    | —    |
| `check:badge`   | 0    | 0    | —    |

`regressions: []`, `pre_existing: []`. No gate flipped pass→fail.

## Style gates — deterministically skipped, and why (L9)

`format:check` and `lint:md` were **not** run here. The skip is sound rather than convenient: the
changed set contains no shared style config (`.prettierrc` / `.prettierignore` / `.markdownlint*` /
`eslint.config` / `package.json`), so every file **outside** the feature is byte-identical at base and
head and its style result cannot flip. The increment's **own** new markdown is a different question,
owned by `/pharn-dev-verify`'s gate map — that is precisely the seam L9 named, and it is covered
downstream, not waved away here.

## Scope check — clean, after an input-capture correction (L5, L16)

```json
{ "escaped": [], "escape_exempt": [], "scope_exit": 0 }
```

Every changed file is declared in the plan's `## Files`. Two things about this are worth recording
rather than passing over:

**1. The first scope run produced a FALSE blocking finding, and it was investigated, not recorded
(L16).** The initial input capture used `git status --porcelain`, which **collapses an untracked
directory into a single entry**. `check-regress` therefore received the literal path
`.dev/features/observability-code-side-limit` and correctly reported it as outside the declared set —
the declared paths are files, not the directory:

```json
"escaped": [".dev/features/observability-code-side-limit"],
"findings": [{ "rule_id": "P0", "severity": "blocking",
  "problem": "changed file '…' is outside the declared writes-scope (fix #7) — the build escaped its plan's `## Files`" }]
```

The verdict core was right; the **orchestration feeding it** was wrong. Re-capturing with
`git status --porcelain -uall` expanded the directory into its four real files and the escape set went
empty. This is L5 exactly — "a floor verdict is only as trustworthy as the orchestration that captures
its inputs" — and it is a **new instance** of that lesson on an input axis L5's own provenance
(`xargs`/zsh word-splitting) does not cover. It is proposed as a lesson candidate in `REVIEW.md`.

**2. L17's remedy has landed, and this run did not need it.** The PLAN pre-declared that
`check-regress scope` would report sibling pipeline artifacts as escapes (L17's known false positive).
Read live, `check-regress.mjs` now accepts `--feature <name>` and exempts the increment's own pipeline
artifacts, reporting them in `escape_exempt` rather than dropping them silently. It was passed here.
In the event `escape_exempt` came back **empty** — because this plan declared every one of its
artifacts in `## Files` explicitly, so nothing needed exempting. **Correcting the PLAN's L17 note:** it
said the false positive "will" fire; it did not, both because the remedy shipped and because the plan's
`## Files` was exhaustive.

## fix #7 fired during this stage, and was obeyed (L8)

Writing `regression-report.json` was **blocked at the floor**:

```text
PHARN floor — write blocked (writes-scope guard, fix #7)
  Blocked path : .dev/features/observability-code-side-limit/regression-report.json
  Active scope : .dev/features/observability-code-side-limit/REGRESSION.md
```

Cause: the stage's Step-0 setter was invoked with `--target …/REGRESSION.md`, which narrows the scope
to **one** path, while this stage's `writes:` declares **two**. That is L8 verbatim ("the setter
resolves one `--target` — favor single-file command outputs"), reproduced live. The fix was to re-run
the setter against the other declared path and write again — **never** to bypass the hook. Both paths
were already in `pharn-dev-regress.md`'s `writes:`; the over-narrowing was in the invocation, not the
declaration. Recorded because a blocked write that gets silently worked around is the failure mode the
guard exists to prevent.
