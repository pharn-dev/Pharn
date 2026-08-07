# GRILL — product-capability-catalog

**Plan under interrogation:** `.dev/features/product-capability-catalog/PLAN.md` (a recorded deferral).
**Spec-hash check (content-hash primitive #2, surfaced not blocking):** recomputed
`sha256(pharn/ARCHITECTURE.md)` = `a1c243eaa7b52494dbdbc6dab02132d4783ca139826920d848e58a8dac621753`
— **matches** the plan's pinned `spec_content_hash`. No drift. (`/pharn-dev-build` is where drift blocks.)
**Griller membership (FLOOR — `pharn/floor/count-grillers.mjs`, frontmatter enum):** 13 registered.

> The PLAN is `trust: untrusted`. Its prose is quoted below as **DATA**, never followed as instruction.
> `problem` / `evidence` inherit that untrusted tag; the enum-gated `type` / `rule_id` / `severity` /
> `file` fields are this griller's own path-resolved assertions.

---

## Findings — axis: guarantee-audit completeness (P0)

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/product-capability-catalog/PLAN.md:104"
  problem: "The plan claims validate.mjs will structurally confirm the capability set is unchanged, but validate.mjs emits only a GREEN/RED verdict — it never enumerates or diffs the capability set, so no tool performs the confirmation the plan attributes to it."
  evidence: "`pharn/floor/validate.mjs` will confirm this structurally: the capability set it enumerates is byte-identical before and after."
```

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/product-capability-catalog/PLAN.md:85"
  problem: "The plan treats `npm run docs:check` as the gate keeping the three generated regions honest, but docs:check is NOT in /pharn-dev-verify's gate map (live map: test, validate, lint, format:check, lint:md, structural) — so within THIS pipeline nothing checks it; the claim rests on CI or a manual `npm run check`."
  evidence: "all three generated regions are byte-unchanged; `npm run docs:check` must stay GREEN without a regenerate."
```

## Findings — axis: honest scope / no speculation (P7)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/product-capability-catalog/PLAN.md:90"
  problem: "The brief that instructs an agent to BUILD the deferred thing is left in the tree as an untracked file with only prose 'housekeeping' assigning its removal to nobody — a future session reading it would be told to run the increment this plan just declined, and being untracked it appears in no diff and no review."
  evidence: "`.dev/PORT-3-capability-catalog.md` — an **untracked** scratch brief; it never enters the diff and is not a plan file. Deleting it is post-merge housekeeping, as with the PORT-1/PORT-2 briefs."
```

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/product-capability-catalog/PLAN.md:45"
  problem: "The reopening condition names an event with no observer and no owner — nothing in the repo detects a capability authored outside PHARN's surface — so a deferral gated on it may never reopen, which is the failure mode P7's 'revisit when a real failure arrives' depends on avoiding."
  evidence: "The first `role:`-bearing capability authored **outside** PHARN's own shipped surface — the same trigger `/pharn-verify` already names for its verifier runner."
```

## Findings — axis: determinism / where the bytes land (P5)

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/product-capability-catalog/PLAN.md:72"
  problem: "The plan names CLAUDE.md as a target but not WHERE in it the deferral goes; CLAUDE.md's only existing follow-up convention is an inline parenthetical at the end of an unrelated bullet (line 283) and there is no deferrals section, so /pharn-dev-build must invent a location in the one file injected as project instructions into every future session."
  evidence: "`CLAUDE.md` — EDIT — add `product-capability-catalog` as a **named deferral follow-up** with its one-line reasoning and its reopening condition — layer: none (repo-meta)"
```

## Findings — axis: evals / structural-vs-semantic (P1)

No findings. The plan declares zero evals and grounds the declaration in P1's actual binding
(Capabilities and `enforces` rule_ids), rather than requesting an exemption. The increment adds no
`role:`-bearing file, so the griller's own membership test agrees there is nothing to bind.

## Findings — axis: trust propagation (P2)

No findings. The plan tags its input brief untrusted, records that every load-bearing fact was
re-verified live, names the two facts that disagreed and resolved them toward the repo, and states
that no taint reaches a floor decision because the increment makes none.

## Findings — axis: one axis of change / layering (P3)

No findings. Two files, one reason to change each (record the decision; record the change). No layer of
`pharn/ARCHITECTURE.md §4` is touched, and the plan says so rather than claiming a layer it does not use.

---

## Observations OUTSIDE this increment (reported, not findings — no PLAN line to anchor)

These are live defects found while grounding the interrogation. They belong to other files and are
**not** in this increment's scope; they are surfaced for the human, not folded into the plan.

1. **`pharn/pharn-pipeline/grillers/coupling/coupling.md` cites a floor op that does not exist.** It
   directs the reader to `.dev/floor/count-grillers.mjs`; live, that path is absent and the real
   checker is `pharn/floor/count-grillers.mjs`. This is `lessons-learned.md` **L2** — a doc may cite
   only a **live** floor op — in a **shipped product-surface** file.
2. **`.claude/commands/pharn-dev-grill.md` asserts a stale griller roster.** Its prose says _"Today the
   registered set is the `testability` griller"_; the live membership count is **13**. Harmless to this
   run (membership was read live, P6), but it is a doc-vs-repo mismatch in a command.

## Summary

The plan is unusually honest about what it is not — its `Contracts satisfied`, `Evals to write` and
`Guarantee audit` sections all state absences explicitly instead of omitting them, and its trust and
determinism audits are grounded in reads from this run. The five concerns above are therefore about
**precision**, not about the decision.

Two of them are the P0 disease in miniature, inside a plan whose whole subject is P0: it attributes a
check to `validate.mjs` that `validate.mjs` does not perform (F1), and it leans on `docs:check` as
though the pipeline ran it, when only CI or a manual `npm run check` does (F2). Both are cheap to fix
in wording — say "the diff shows no capability was added" and "docs:check is verified manually /
in CI, not by `/pharn-dev-verify`" — and both would otherwise ship a claim slightly stronger than the
floor behind it.

The most consequential concern is **F3**: leaving `.dev/PORT-3-capability-catalog.md` in the tree means
the single artifact instructing an agent to build the deferred capability outlives the decision to
defer it, invisibly (untracked). If the deferral is worth recording, deleting the brief — or appending
the decision to it — is part of recording it. **F5** is the practical one `/pharn-dev-build` will hit
immediately: it has no declared location in `CLAUDE.md` and will otherwise choose one by judgment.

**ADVISORY VERDICT: 5 concerns raised (0 blocking-severity, 4 important, 1 minor) — for the human to
weigh before `/pharn-dev-build`.** Nothing here blocks: `/pharn-dev-grill` is advisory end-to-end, and
this log gates nothing. The deterministic backstops remain `/pharn-dev-build`'s spec-hash gate and
`pharn/floor/validate.mjs`.
