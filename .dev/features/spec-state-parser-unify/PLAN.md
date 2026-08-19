# PLAN — unify the `state:` spec parser so the Approved gate agrees with canon

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L1, L2, L5, L6, L20, L22]
- increment: Delete `check-spec-approved.mjs`'s private `readState()` and read the SPEC's `state` from a new `check-spec.mjs --state` print-mode, so the Approved gate and the canonical checker can no longer disagree on the same bytes.
- layer(s): product floor (`pharn/floor/`) — not a capability tree layer
- constitution_refs: [P0, P4, P5, P6, P7]

## Applied lessons

- **L1** — the meta-doc sweep named `SKILLS_VERSION` (product-floor bytes change) and `CHANGELOG.md` —
  the latter twice over, since its 2.5.0 entry asserts a fact this increment **falsifies** (see
  `## Discovery`).
  **CORRECTED MID-RUN: the sweep was INCOMPLETE and `/pharn-dev-regress` caught it.** It missed
  `README.md:13`, whose shields badge states the version a **third** time, so bumping `SKILLS_VERSION`
  without it flipped the `tests` gate pass→fail via `.dev/floor/check-version-badge.test.mjs`.
  `README.md` was added to `## Files` at the human's GATE-1 decision.
  **The reusable correction, for the next plan that bumps a version:** L1's sweep question
  ("which meta-docs state a fact this increment changes?") must be answered by **enumerating every site
  that states the version**, not the two that come to mind — and for `SKILLS_VERSION` that set is
  exactly three: `SKILLS_VERSION`, `CHANGELOG.md`, **and the README badge**. That the third has a floor
  check (`check-version-badge.mjs`, itself created because the badge silently read `1.0.0` through the
  whole 2.x line) is what turned a silent doc-drift into a loud RED here — an instance of **L20**: this
  is the version-badge defect recurring, caught this time because its remedy had been escalated from
  discipline to a floor check.
- **L2** — the honesty must travel with the artifact: `check-spec-approved.mjs`'s own header claims the
  shell-out reuse means the content-hash logic "can never drift between the two". That sentence is
  true of the hash and was **false of `state`**. The header is corrected in the same commit as the
  code, not left for the CHANGELOG to carry.
- **L5** — the new `--state` read is an input-capture boundary: the gate's floor verdict is only as
  good as the capture. It fails closed on spawn error and on a non-zero child exit (surfacing the
  child's own message verbatim) rather than treating an empty capture as a state.
- **L6** — `state` is a structural/membership fact and is read from the **structured** frontmatter
  location through `parseSpec`, never grepped from the file's free text. This increment's whole point
  is that there must be exactly **one** such structured read.
- **L20** — the second-occurrence escalation rule, applied literally. The `readState` divergence was
  **already known and consciously deferred** with a discipline-only bound ("the bound is written into
  the module rather than quietly fixed"). It recurred as a live fail-open. Per L20 the remedy is not a
  louder comment but removal of the duplicate — and the cross-check test is the detector L20 asks for.
- **L22** — remove the choice rather than describe it: `check-spec-approved.mjs` gets a **pinned**
  `spawnSync` call line mirroring `check-plan-spec-agree.mjs`'s existing `--hash` / `--spec-id`
  captures byte-for-byte, so no future run re-derives a capture technique from prose.

## Discovery (P6 — read live this run, reproduced before changing anything)

Both divergence directions reproduce live against the current tree:

| fixture                                              | `check-spec.mjs` (canon)  | `check-spec-approved.mjs` (GATE)     | verdict       |
| ---------------------------------------------------- | ------------------------- | ------------------------------------ | ------------- |
| duplicate key: `state: Approved` then `state: Draft` | GREEN, state `"Draft"`    | **exit 0** "Approved and un-drifted" | **fail-OPEN** |
| `state: Approved # ratified 2026-08-18`, correct pin | GREEN, state `"Approved"` | **exit 1** RED                       | false-RED     |

- `check-spec.mjs:106` (`parseSpec`) is **last-wins** (`fm[kv[1]] = readValue(...)` in a loop) and runs
  each value through `readValue` → `stripComment`. `check-spec-approved.mjs:62` (`readState`) is
  **first-wins** (`return` on first match) and applies only `stripQuotes`.
- **The fail-open direction is the serious one.** The duplicate-key spec is also **unpinned** (no
  `spec_content_hash`), so the gate that exists to guarantee "a PLAN may be produced only from an
  Approved, un-drifted SPEC" admits a spec that is neither approved-effective nor pinned.
- **`check-plan-spec-agree.mjs` adds no third parser** — it shells `check-spec-approved.mjs` (line 139),
  so it _inherits_ the defect today and will inherit the fix. The four downstream consumers
  (grill/build/regress/verify) are fixed transitively; none needs editing.
- **A prior decision is falsified by this run.** `CHANGELOG.md:247` records that `readState` was
  deliberately left unchanged because "the asymmetry fails **closed** (a false RED, never a false
  GREEN) — so P7 supplies no trigger". The duplicate-key repro **is** a false GREEN. That supplies the
  P7 trigger this increment needs, and the claim must be corrected in place (this repo has precedent
  for correcting a superseded entry in place rather than only appending).

## Files

- `pharn/floor/check-spec.mjs` — add the `--state` print-mode (`emitState`) + usage lines — layer product-floor
- `pharn/floor/check-spec-approved.mjs` — delete `readState`/`FM_RE`/`stripQuotes`, read state via `--state`, correct the header's drift claim — layer product-floor
- `pharn/floor/check-spec.test.mjs` — `--state` mode tests (mirroring the `--hash` / `--spec-id` mode tests) — layer apparatus
- `pharn/floor/check-spec-approved.test.mjs` — duplicate-key RED, trailing-comment GREEN, and the two-checker cross-check — layer apparatus
- `pharn/floor/check-plan-spec-agree.test.mjs` — one chain case proving the delegation carries the fix — layer apparatus
- `SKILLS_VERSION` — `2.7.1` → `2.7.2` — layer repo-meta (product-surface bytes changed)
- `CHANGELOG.md` — new entry + correct the falsified `:247` "fails closed / never a false GREEN" claim — layer repo-meta
- `README.md` — update the shields version badge `2.7.1` → `2.7.2` — layer repo-meta (**AMENDED at the human's GATE-1 decision after `/pharn-dev-regress` REDed; see `## Applied lessons` L1**)

**Deliberately NOT in scope** (stated as a heading, not prose — L18):

### Excluded

- `pharn/floor/check-plan-spec-agree.mjs` — inherits the fix by shelling; no code change earns a diff here.
- The four downstream product commands (`/pharn-grill`, `/pharn-build`, `/pharn-regress`, `/pharn-verify`) — they invoke the chain checker and are unaffected.
- Any change to `readValue` / `stripComment` / `parseSpec` semantics — this increment _reuses_ the canonical parse, it does not alter it.

## Contracts satisfied

- `pharn/ARCHITECTURE.md §6` (the spec stage's `Draft → Approved` lifecycle and the `spec_content_hash`
  pin) — cited, not restated (P4). The increment changes **which parser answers** "what is `state`?",
  never what §6 says `state` means.
- `pharn/ARCHITECTURE.md §2` primitive #3 (enum membership) — the gate's `state === "Approved"`
  assertion is unchanged in kind; only its input becomes canonical.

## Evals to write (P1)

P1 binds **Capabilities** (`role:`-bearing `.md` files with `evals/cases/*` + `evals/expected/*`).
This increment adds **no capability** — it is a floor-checker fix — so P1 requires no eval directory.
The floor equivalent is `node --test` coverage, specified next.

## Tests to write

- `check-spec-approved.test.mjs` — duplicate `state:` (`Approved` then `Draft`, unpinned) → **RED**, exit 1 (the fail-open, killed).
- `check-spec-approved.test.mjs` — `state: Approved # note` on a correctly pinned spec → **GREEN**, exit 0 (the false-RED, killed).
- `check-spec-approved.test.mjs` — **cross-check**: for both fixtures, `check-spec.mjs --state` and the gate's own verdict agree (`--state` prints `Approved` ⟺ the gate exits 0).
- `check-spec.test.mjs` — `--state` prints the last-wins, comment-stripped value; unreadable file → exit 1 with the message on **stderr** (L5); no frontmatter → exit 1 on stderr; frontmatter with no `state` → empty line at exit 0 (mirroring `--spec-id` exactly).
- `check-spec.test.mjs` — `--state` is read-only: running it does not change `--hash`'s digest for the same file.
- `check-plan-spec-agree.test.mjs` — one chain case: a PLAN against a trailing-comment Approved SPEC now passes the chain (the delegation carries the fix).

## Guarantee audit (P0)

- "`check-spec.mjs --state` prints the SPEC's canonical resolved `state`" → **FLOOR** (enum/regex,
  §2 primitive #3, over the single `parseSpec` read) — the same class as `--hash` and `--spec-id`.
- "The Approved gate admits only `state === "Approved"`" → **FLOOR** (enum, §2 primitive #3). Unchanged
  in kind; this increment only makes its **input** canonical.
- "The two checkers cannot disagree on the same bytes" → **FLOOR by construction after this change**
  (there is exactly one `state` parse; the gate holds no parser to disagree with). **NARROWED, and
  stated:** that no _third_ parser is ever re-added is **DISCIPLINE, not a floor op** — the cross-check
  test **DETECTS** a divergent re-implementation, it does not **PREVENT** one. This is the identical
  bound `check-spec.mjs`'s `bodyHash` already states for the hash, and it is written that way
  deliberately rather than upgraded to a claim the floor cannot back.
- "The gate fails closed on a capture failure" → **FLOOR** (exit-code branch): spawn error or non-zero
  child exit → RED, never a defaulted state.
- "The fix propagates to the four downstream consumers" → **FLOOR** (structural: `check-plan-spec-agree.mjs`
  holds no `state` parser and shells the gate) — verified by reading the file this run, not assumed.
- "The SPEC's intent is sound / the plan will be good" → **not claimed.** Unchanged: passing this gate
  means only "the input spec is approved and unchanged" (P0).

## Trust audit (P2)

- **Input:** `SPEC.md` frontmatter + body — untrusted human intent (DATA).
- **Taint path:** `state`'s value now crosses a **process boundary** (child stdout → parent capture)
  that it did not cross before. It is read from the structured frontmatter location (L6), and the only
  operation performed on it is **exact string equality against the literal `"Approved"`** — never
  interpretation, never injection into a downstream context as a directive.
- **Bound, stated:** `check-spec.mjs`'s `kv` regex ends at `$` and JS `.` excludes `\r`/`\n`, so a
  frontmatter value cannot carry a newline and cannot forge an extra stdout line. `readValue` already
  `.trim()`s, so the parent's `.trim()` on transport is the identity map on any value check-spec would
  emit — the capture cannot silently alter a value that survived the canonical parse.
- **No guaranteed decision rests on any free-text field.** An instruction-looking needle in the intent
  prose cannot move the verdict — the existing ★ test in `check-spec-approved.test.mjs` continues to
  pin this, and is not modified.

## Determinism audit (P5)

- The only branch is `state === STATE_APPROVED` — exact string membership, not classification.
- Capture-failure branches are exit-code tests (`r.error`, `r.status !== 0`), each terminating in a
  **named RED that says what to do**, never a guess and never a default.
- No LLM step exists anywhere in either checker.

## Versioning (CLAUDE.md — SKILLS_VERSION discipline)

`2.7.1` → `2.7.2`, **patch**. Both `.mjs` files are product-floor checkers, squarely in the
bump-triggering set. **Patch, not minor** — and the distinction from the 2.5.0 precedent (which took a
minor for adding `--spec-id`) is deliberate: there, the new mode was the _point_ and gave a user
surface they did not have; here `--state` exists **only** as the internal seam that removes a duplicate
parser, and the shipped defect being corrected is the increment. The `*.test.mjs` files are apparatus
and drive no bump on their own.

## Open questions (HALT)

- **Bump size — RESOLVED at GATE 1 (human, 2026-08-19): patch (`2.7.2`).** The question was whether
  `--state`, as a new invocation form, takes a **minor** under the 2.5.0 precedent. The human chose
  **patch**, on the reasoning already recorded in `## Versioning`: there the new mode was the _point_
  and gave a user surface they did not have; here it exists **only** as the internal seam that removes
  the duplicate parser, and the corrected defect is the increment. No open questions remain.
