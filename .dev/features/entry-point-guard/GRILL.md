# GRILL — entry-point-guard

Plan under interrogation: `.dev/features/entry-point-guard/PLAN.md` (read live this run as
`trust: untrusted` DATA). **Spec-hash check: MATCH** — recomputed
`sha256(pharn/ARCHITECTURE.md)` = `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52`
via `.dev/floor/hash-doc.mjs`, equal to the plan's pinned `spec_content_hash` (PLAN.md:3). No drift to
surface. (The computation is content-hash floor-grade; the **block** on drift belongs to
`/pharn-dev-build`, not here — fix #3.)

Griller membership (FLOOR, `pharn/floor/count-grillers.mjs .`): **13 registered**. The five with a
deterministic plan-side scanner were run as commands, not judged:

| scanner                       | result                         |
| ----------------------------- | ------------------------------ |
| `scan-plan-secrets.mjs`       | `{"found":false,"hits":[]}`    |
| `scan-plan-pii.mjs`           | `{"found":false,"hits":[]}`    |
| `scan-plan-i18n.mjs`          | `{"found":false,"hits":[]}`    |
| `scan-plan-migrations.mjs`    | `{"mentions":false,"hits":[]}` |
| `scan-plan-observability.mjs` | `{"mentions":false,"hits":[]}` |

All five exit 0 with no hits. The remaining eight grillers' procedures were applied inline (the live
isolated runner is deferred, P7).

**Enum-gated / free-text split (fix #1), honored below.** `type`, `rule_id`, `severity`, `file` are
**this griller's own** enum-membership / path-resolution assertions → TRUSTED. `problem` and
`evidence` quote the plan and **inherit its untrusted tag** → rendered as quoted DATA, never a
directive to `/pharn-dev-build`.

## Findings

### Axis: guarantee-audit completeness (P0) — inline

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/entry-point-guard/PLAN.md:98"
  problem: "The banned-spelling sweep's guarantee is stated without its denominator, so a reader
    sizes its reach as the whole floor when it is measured live at 11 of 60 files."
  evidence: "PLAN.md:82 scopes the sweep to 'every `*.mjs` under `pharn/floor/` and `.dev/floor/`
    (tests excluded)' and PLAN.md:98 bounds it only as 'A **novel** wrong spelling … passes
    untouched'. Measured this run: 5 of 48 non-test `pharn/floor/*.mjs` and 6 of 12 non-test
    `.dev/floor/*.mjs` carry an entry guard at all. The other 49 call `main()` unconditionally, so
    the sweep is vacuously green over them — it cannot distinguish 'guard is correct' from 'there is
    no guard'."
```

```yaml
- type: FINDING
  rule_id: "P0"
  severity: minor
  file: ".dev/features/entry-point-guard/PLAN.md:104"
  problem: "The plan asserts a `check-version-badge.mjs` floor reduction for the bump but never names
    which of `npm run check`'s seven sub-gates the increment actually re-runs to substantiate it."
  evidence: 'PLAN.md:104 — ''"`SKILLS_VERSION` agrees with the README badge" → **floor: enum/regex**
    — `.dev/floor/check-version-badge.mjs`, already wired into `npm run check` and its own CI step.''
    The plan''s `## Files` edits `.dev/floor/check-version-badge.mjs` itself, so the gate proving the
    bump is also a file this increment modifies — a self-referential ordering the plan does not
    state.'
```

### Axis: testability / eval coverage (P1) — griller `testability`

Verification approach: **present** (`## Evals to write (P1)` declares five named probes with expected
outputs). No absence finding. Layer-2 (advisory) concerns follow.

```yaml
- type: FINDING
  rule_id: "P1"
  severity: blocking
  file: ".dev/features/entry-point-guard/PLAN.md:89"
  problem: "No declared probe pins that the repaired guard still passes `main()` its arguments and
    still propagates its exit code, which is the mechanical regression the ten-file swap can
    actually introduce."
  evidence: "The ten sites are not one shape. `pharn/floor/render-cost-record.mjs:228` is
    `if (…) process.exit(main(process.argv.slice(2)));` while the other nine are a block form. The
    plan's probes at PLAN.md:82-90 all assert behavior of `check-ship-briefing.mjs` and
    `check-lessons-index.mjs`; `render-cost-record.mjs` is edited but never invoked, so silently
    dropping `process.argv.slice(2)` or the `process.exit()` wrapper passes every declared probe."
```

```yaml
- type: FINDING
  rule_id: "P1"
  severity: important
  file: ".dev/features/entry-point-guard/PLAN.md:118"
  problem: "The fixture directory is described only as 'a temp directory the test creates', with no
    uniqueness requirement, and `node --test` runs test files in parallel by default."
  evidence: "PLAN.md:118 — 'in a temp directory the test creates and removes'. The reproduction
    recipe the increment inherits names a fixed path (`/tmp/space dir`). A fixed fixture path shared
    between concurrently-running test files makes the suite order-dependent, and a teardown in one
    worker can delete a fixture another is mid-spawn on — a flaky red that would be read as a real
    guard failure."
```

```yaml
- type: FINDING
  rule_id: "P1"
  severity: minor
  file: ".dev/features/entry-point-guard/PLAN.md:90"
  problem: "The declared negative control is vacuous under the idiom adopted at GATE 1 — with
    `import.meta.main` an imported module is false by construction, so the probe cannot fail."
  evidence: "PLAN.md:90 — 'negative control → the same script **imported** (not run as entry point)
    executes no `main()`'. This probe was meaningful against a string-comparison guard; against
    `import.meta.main` it restates the runtime's own definition. Keeping it is harmless, but it
    should not be counted as coverage."
```

### Axis: comprehension — the WHY (P7) — griller `comprehension`

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/entry-point-guard/PLAN.md:1"
  problem: "The rationale for the adopted idiom lives only in this feature folder, so the ten
    repaired sites will each carry a bare one-line guard with no pointer to why that spelling is
    load-bearing — the same condition that let the defect spread to ten files."
  evidence: "The plan's measured comparison table sits at PLAN.md:139-148, inside
    `.dev/features/entry-point-guard/`. `## Files` (PLAN.md:38-47) describes each of the ten edits
    only as 'replace the entry-point guard' and declares no comment or pointer at the repaired
    sites. Today exactly one site — `.dev/floor/hash-doc.mjs:72-83` — carries the reasoning, and the
    plan leaves that file byte-unchanged."
```

### Axis: documentation / doc-drift (P7, P6) — griller `documentation`

```yaml
- type: FINDING
  rule_id: "P6"
  severity: important
  file: ".dev/features/entry-point-guard/PLAN.md:63"
  problem: "The increment invalidates a comment it deliberately does not edit: after the swap,
    `hash-doc.mjs`'s description of the old form as 'the repo's older sibling idiom' refers to an
    idiom that no longer exists anywhere in the repo."
  evidence: "PLAN.md:63 — '`.dev/floor/hash-doc.mjs` — already carries the repaired guard;
    **byte-unchanged** (the request listed it in error).' Its live comment at hash-doc.mjs:80 reads
    '`import.meta.url === \\`file://${process.argv[1]}\\`` — the repo's older sibling idiom', which
    is true only while siblings still use it. This is the doc-vs-repo mismatch P6 names, and it is
    the shape L1 records ('`/plan` must scope the meta-docs an increment invalidates')."
```

```yaml
- type: FINDING
  rule_id: "P7"
  severity: minor
  file: ".dev/features/entry-point-guard/PLAN.md:57"
  problem: "The plan adds a new deterministic apparatus file but declares no update to CLAUDE.md's
    Commands block, which is where this repo documents every other floor checker a contributor is
    expected to know about."
  evidence: "PLAN.md:52 declares `.dev/floor/entry-point-guard.test.mjs` as NEW, and PLAN.md:64-67's
    exclusion list names generated regions but not CLAUDE.md. Whether a `*.test.mjs` with no paired
    checker warrants a CLAUDE.md entry is a judgment — `.dev/floor/command-hygiene.test.mjs`, the
    closest precedent, has none — so this is raised as a question, not a defect."
```

### Axes with no findings

- **Trust propagation (P2)** — the increment ingests no untrusted artifact; the plan's trust audit
  (PLAN.md:114-119) correctly states the swept sources are read as DATA for a string test and never
  interpreted. Presence recognized.
- **Architecture / structural fit (P3)** — griller `architecture`. No sibling coupling: the new test
  lives in `.dev/floor/` and reaches into `pharn/floor/`, which is the only permitted direction
  (a user's install ships `pharn/floor/` without `.dev/`). It follows the established
  `command-hygiene.test.mjs` precedent rather than inventing a mechanism. No layer inversion.
- **Determinism (P5)** — every declared branch is an exit-code or set-membership test; the one
  irreducible judgment terminated in the GATE-1 question rather than a guess.
- **Honest scope (P7)** — the increment bundles a repair, a guard, and a bump, and that was
  interrogated: splitting them would land the repair with no guard, and the bump is coupled to the
  product-surface bytes the repair changes. Judged coherent, not bundled.
- **`security`, `error-handling`, `performance`, `coupling`, `a11y`, `migrations`, `i18n`,
  `privacy`, `observability`** — no concern on this increment's surface (a guard-expression swap in
  eleven CLI scripts). The five with deterministic scanners are recorded clean above.

## Summary

The plan's decisions are sound and its GATE-1 resolution is better-evidenced than the request it came
from. The concerns are about **coverage and durability of the repair**, not about the repair itself.

The sharpest one is **F3 (P1, blocking-severity)**: the ten edited sites are not one shape, but every
declared probe exercises only two of them. `render-cost-record.mjs` carries the one-line
`process.exit(main(process.argv.slice(2)))` form and is never invoked by any planned test — so the
mechanical failure this swap can realistically cause (dropping the argument slice or the exit-code
propagation) is exactly the failure the eval plan cannot see. That is the inherited-fixture shape L24
names, one layer down: the probes were designed against the _reported_ symptom, not against the _new_
edit.

**F1 (P0)** and **F6 (P7)** are both about the repair not travelling: the sweep is green over 49 files
it cannot actually speak for, and the reasoning that makes the chosen idiom correct stays in a feature
folder while the ten sites get a bare line. **F7 (P6)** is a concrete, checkable drift the plan created
by scoping `hash-doc.mjs` out — its comment's "older sibling idiom" becomes false the moment the build
lands.

## Verdict

**ADVISORY VERDICT: 8 concerns raised (1 blocking-severity, 5 important, 2 minor) — for the human to
weigh before `/pharn-dev-build`.**

This grill-log is **advisory end-to-end and gates nothing** (fix #3). Every severity above is an
LLM assignment, including the `blocking` one; it does not block `/pharn-dev-build` and must not be read
as one. The only floor-grade facts in this run are the spec-hash MATCH, the `count-grillers.mjs`
membership count, the five scanner exits, and the writes-scope hook that pinned this file. Nothing
here means "the plan is good" — that judgment is the human's.
