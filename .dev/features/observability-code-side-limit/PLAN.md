# PLAN — observability-code-side-limit (Option B — record the named limit, defer the lens)

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4, sha256(pharn/ARCHITECTURE.md), read live this run via `node .dev/floor/hash-doc.mjs pharn/ARCHITECTURE.md`
- applied_lessons: [L1, L2, L4, L6, L9, L10, L12, L13, L17, L18, L19, L20]
- increment: Record — as a named limit in `LIMITS.md` (proposed text, human-applied) plus a durable `.dev/` build-loop record — that PHARN interrogates observability at PLAN time only and never against the code that results. **Deliberately build no lens and no scanner.** The increment's own writes are apparatus-only; the one product-surface byte-change is a `LIMITS.md` append the agent structurally cannot make.
- layer(s): none — no capability, contract, or floor checker is added or changed. The only product-surface delta is a trusted doc (`LIMITS.md`), which is human-only. # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P2, P4, P5, P6, P7]

## Applied lessons

- **L1** — meta-doc sweep run: this increment adds no command, checker, or test suite, so `CLAUDE.md`'s `## Commands` block states no fact it changes and is deliberately **not** in `## Files`. `CHANGELOG.md` **is** in scope — the file's own "all notable changes are documented" contract covers a recorded architectural deferral. Verified live that `CLAUDE.md` contains no LIMITS.md section inventory that a new `## 5.` would invalidate.
- **L2** — the proposed `LIMITS.md` §5 text cites only floor ops verified **live this run**: `pharn/floor/scan-plan-observability.mjs` (exists; one of 5 `scan-plan-*`), `pharn/floor/scan-code-swallowed-exception.mjs` (exists; `LOG_HEAD` read at `:286`), `pharn/floor/scan-plan-secrets.mjs` (exists), `pharn.config.json` and `pharn/pharn-contracts/seam-config.md` (both read in full). No op is cited from memory, and the text claims **no** new guarantee — it discloses a bound, which is what `LIMITS.md` is for.
- **L4** — every §1 premise handed to this increment was **re-measured**, not inherited: the prompt's grounding commit was 3 behind HEAD and its `SKILLS_VERSION` claim (`2.5.4`) was stale (live `2.6.0`). Authored-claim ≠ live state; the corrections are recorded in `GRILL.md`.
- **L6** — every membership fact came from its **structured location**: lens/griller/verifier counts from `count-lenses.mjs` / `count-grillers.mjs` / `count-verifiers.mjs` (frontmatter parsers), the `reads:`/`enforces:` uniformity from anchored `^reads:` / `^enforces:` frontmatter matches, and `npm run check`'s composition from `package.json` via `node -e`, never from `CLAUDE.md`'s prose description of it.
- **L9 / L12 / L13 / L19** — every `.md` this increment writes is formatted at the stage that writes it, with `npx prettier --write` + `npx markdownlint-cli2 --fix` scoped to **that stage's own artifact paths** — never `npm run format`, never a repo-wide sweep. The formatter runs through Bash and therefore escapes fix #7 entirely; that is declared here, not pretended away (L19).
- **L10** — all records land in `.dev/features/observability-code-side-limit/`, which `pharn/floor/validate.mjs` excludes wholesale, so none of them reach validate CHECK 5. Root `features/` is untouched. No artifact this increment writes emits `rule_id:`/`problem:` on the scanned surface.
- **L17** — `check-regress.mjs scope` tests **changed-since-base**, not written-by-the-build, so on a working-tree dogfood it will report this increment's own sibling artifacts (`GRILL.md`, `REGRESSION.md`, `VERIFY.md`, `REVIEW.md`, `SHIP.md`, the two JSON reports) as "escaped `## Files`". Pre-declared so `/pharn-dev-regress`'s report is **read correctly**, not waved through by surprise — L17's own warning is that waving this finding through is the real hazard.
- **L18** — this PLAN's exclusion block below is a `###` **heading** (`### Deliberately NOT in scope`), never a bold prose intro, so `set-writes-scope.cjs --from-plan` terminates the authorized list structurally.
- **L20** — applied in **two** directions. (1) Mechanically: the setter's printed path count is read against the `## Files` list as a checkable number at build Step 0. (2) Substantively: L20 says a remedy that reduces to "the agent should remember" earns a floor check on its **second** occurrence. That is the strongest argument **against** this plan, and it is engaged, not dodged — see `## The L20 objection` below.

## The L20 objection, engaged

L20 is the lesson most hostile to this increment, so it gets its own section rather than a bullet.

**The objection.** "You are choosing documentation over enforcement. L20 says documentation-only remedies recur. Build the check."

**Why it does not apply here, stated so a future reader can overturn it:**

1. **L20's trigger is a _recurrence_ — a second occurrence of a real failure.** Here there is not a first. No dogfood run failed on this, no eval failed, and `npm run check` is green at 1380/1380. P7 is explicit that an addition is triggered by a real failure, never a hypothetical.
2. **A limit is not a remedy.** L20 escalates when a _remedy_ fails to prevent a recurrence. `LIMITS.md` §5 prescribes no behavior for anyone to forget; it discloses a bound the system genuinely has. There is nothing for discipline to fail at.
3. **The floor-able half cannot be built as specified.** The check would be "a call to the **configured** logger/telemetry sink exists on a failure path" — and discovery proved **no sink is configurable** (`pharn.config.json` carries only `models.stages` + `ship.requireAttestation`; `seam-config.md` names no telemetry concept; repo-wide `declare.{0,25}(logger|telemetry)` → no matches). Building it anyway means hardcoding a name set, reusing the very construction whose false-negative `scan-code-swallowed-exception.mjs:23` already documents (`telemetry.record(e)` reads CLEAN). A checker that is wrong for every project with a custom sink, whose `.md` says FLOOR, is the P0 silhouette L20 itself exists to prevent.

**The honest cost of choosing B.** If a future dogfood run ships a plan-promised signal that the code never wired, that is L20's first occurrence and this decision is what made it observable. §5's closing sentence names that reopen trigger explicitly so the occurrence is **recognizable as one** rather than rediscovered from scratch — which is the part of L20's discipline that does transfer.

## Files

- `.dev/features/observability-code-side-limit/PLAN.md` — this plan (already written at the plan stage; listed so the build's scope is self-consistent) — layer apparatus
- `.dev/features/observability-code-side-limit/GRILL.md` — the grill interrogation of this plan, including the corrections to the build prompt's own stale premises — layer apparatus
- `.dev/features/observability-code-side-limit/REGRESSION.md` — `/pharn-dev-regress` human report — layer apparatus
- `.dev/features/observability-code-side-limit/regression-report.json` — `/pharn-dev-regress` machine verdict — layer apparatus
- `.dev/features/observability-code-side-limit/VERIFY.md` — `/pharn-dev-verify` human report — layer apparatus
- `.dev/features/observability-code-side-limit/verify-report.json` — `/pharn-dev-verify` machine verdict — layer apparatus
- `.dev/features/observability-code-side-limit/REVIEW.md` — `/pharn-dev-review` 4-lens advisory review — layer apparatus
- `.dev/features/observability-code-side-limit/SHIP.md` — `/pharn-dev-ship` roll-up, carrying the proposed `LIMITS.md` §5 text for the human to apply — layer apparatus
- `.dev/features/observability-code-side-limit/LIMITS-5-PROPOSED.md` — the exact proposed `LIMITS.md` append, held as a standalone file so the human can apply it verbatim without re-deriving it from prose — layer apparatus
- `CHANGELOG.md` — an `[Unreleased]` entry recording the investigation, the deferral, and the **pending** patch bump that lands with the human's `LIMITS.md` edit — layer repo-meta

> **Post-GATE-1 amendment (the five paths below).** These were **not** in the plan the human approved.
> They were added mid-run on two direct instructions ("create `TEST.md` which is a `LIMITS.md` clone
> with updated text", and "update it" referring to the version-bump lines). They are kept inside
> `## Files` — a heading here would terminate the parser's list (L18) and silently drop them from the
> writes-scope, which is exactly what a first attempt at this amendment did: the setter reported **10**
> paths against the **15** intended, caught by reading the printed count as a number (L20). This intro
> is a blockquote precisely so it cannot match the exclusion-cue fallback.

- `TEST.md` — a **byte-exact clone** of `LIMITS.md` with the new `## 5.` appended, staged at the repo root so the human can review it and apply it with a single `cp`. Transient: delete it (and its two ignore entries below) once applied — layer repo-meta / staging
- `.prettierignore` — add `TEST.md`. **Required, not cosmetic:** measured this run, `LIMITS.md` FAILS `prettier --check` under any non-excluded name, which is exactly why the real file is ignored (`.prettierignore:29`). Without this entry the clone REDs `format:check` — layer repo-meta (shared style config)
- `.markdownlint-cli2.jsonc` — add `TEST.md` to `ignores`. Same measured reason: `LIMITS.md` has no trailing newline and trips `MD047` under a non-excluded name — layer repo-meta (shared style config)
- `SKILLS_VERSION` — `2.6.0` → `2.6.1` (patch: a clarification to already-shipped trusted-doc bytes) — layer repo-meta
- `README.md` — shields badge `pharn-2.6.0-` → `pharn-2.6.1-`, required by `.dev/floor/check-version-badge.mjs` — layer repo-meta

**The bump now runs AHEAD of the byte it versions, and that is a stated consequence of the human's
instruction, not an oversight.** `LIMITS.md` itself is still unedited (hook-denied); `TEST.md` is the
staging copy. Until the human applies it, `SKILLS_VERSION` `2.6.1` describes a product-surface change
that exists only in `TEST.md`. This is the one place this increment knowingly departs from its own
`## Guarantee audit` posture, at the human's direction, and it resolves the moment `TEST.md` is
copied over `LIMITS.md`.

### Deliberately NOT in scope

- **`LIMITS.md`** — hook-denied (`protect-trusted-paths.cjs:130-133`; verified live this run: an `Edit` to it returns `permissionDecision: deny`, exit 2). The proposed §5 text is produced for a human to apply; the agent never attempts the write.
- **`SKILLS_VERSION`** and the **`README.md` version badge** — deliberately **unbumped**. Per `CLAUDE.md`'s bump rule, everything this increment writes is apparatus (`.dev/**`) or pure repo-meta (`CHANGELOG.md`), and neither bumps. The product-surface delta is the `LIMITS.md` append, which is the **human's** write; bumping now would claim a product-surface change that has not landed and would force a badge edit to match a version nothing earned. The bump lines are handed over with the §5 text so both land in one commit.
- **`pharn/pharn-review/**`** — no lens is authored. This is the increment's entire point.
- **`pharn/floor/scan-code-*.mjs`** and **`pharn/floor/lens-scanner-map.json`** — no scanner is authored, so no map entry changes. Note that adding a scanner without a lens would independently RED `lens-scanner-map.test.mjs`'s orphan-scanner test; not building either keeps that pair consistent by construction.
- **`pharn/pharn-pipeline/grillers/observability/observability.md`** — untouched. Its Layer-1/Layer-2 split and its "struck" overclaim are already correct about the plan side; nothing it says becomes false because the code side is now documented as absent.
- **`CLAUDE.md`** — no new command, checker, or convention, so its `## Commands` block states no fact this increment changes (L1 sweep run and recorded, not skipped).
- **`docs/capabilities/**` and `docs/lessons-index.md`** — no `role:`-bearing file and no lesson is added, so neither generated region changes; `npm run docs:generate` is deliberately not run.
- **No memory-bank promotion.** A candidate lesson is proposed in `REVIEW.md` for a later gated `/pharn-dev-memory-promote`; this increment never writes canon (L7 — a stage must not hold that power).
- **No commit, no push, no PR.** The run ends at GATE 2.

## Contracts satisfied

- **P0** — the increment adds **no** guarantee. Its output is a disclosure of an existing bound plus an apparatus record. The one claim it makes ("PHARN does not check observability against code") is verified by exhaustive live instruments, and is a statement of **absence**, which needs no floor reduction.
- **P2** — the build prompt is untrusted input and was treated as DATA: three of its premises were re-measured and two were found false (stale commit, stale `SKILLS_VERSION`; plus its §2 "configured sink" premise, which the repo cannot satisfy). Its instructions were followed where they held and corrected where they did not, rather than executed on assertion.
- **P4** — the proposed §5 text **cites** `scan-plan-observability.mjs`, `scan-code-swallowed-exception.mjs`, and `scan-plan-secrets.mjs` by path and behavior; it restates no rule text.
- **P5** — the proceed/stop decisions in this run branch on deterministic verdicts (`validate` exit, `check-regress` `.verdict`, `check-verify` `.verdict`, the hook's exit 2), never on prose. The terminal fallback for the one genuinely ambiguous question (does `LOG_HEAD` void the prompt?) was **ask the human** at HALT 1 — never a guess.
- **P6** — every §1 and §3 claim was read live this run; the corrections to the prompt's own grounding are recorded rather than silently absorbed.
- **P7** — the increment's whole content is a refusal to add speculatively. No lens, no scanner, no verifier, no empty-role instantiation.

## Guarantee audit (P0)

- **"PHARN never checks observability against code"** → **verified by exhaustive live instrument**, not guaranteed by a floor op. It is a claim about the repo at commit `b7626d4`, re-checkable by re-running the instruments in `GRILL.md`. It is **not** self-enforcing: a future increment could add such a lens and this text would go stale, which is exactly why §5 names its reopen trigger.
- **"`LIMITS.md` §5 is accurate"** → **ADVISORY.** No checker reads trusted-doc prose. `check-specified-markers.mjs` binds only the annotations listed in its hand-maintained manifest, and this text adds no `(specified; ships with the guarded surface)` marker, so it is deliberately **outside** that manifest — adding one would be false, since §5 describes an **absence**, not a specified-but-unshipped primitive.
- **"The `.dev/` records are true"** → **ADVISORY.** `.dev/**` is excluded wholesale from `validate.mjs`; nothing checks their prose.
- **"This increment left the repo green"** → **FLOOR** — `npm run check` exit 0, recomputed at HEAD by `/pharn-dev-verify`, not asserted from the pre-build baseline.
- **"Choosing B was wise"** → **struck (the disease).** The chain ran and the named verdicts are as shown; whether deferring the lens is the right call is the human's judgment at GATE 2, and the L20 objection above is the strongest case against it, recorded so a future reader can overturn the decision on evidence rather than re-litigate it from memory.
