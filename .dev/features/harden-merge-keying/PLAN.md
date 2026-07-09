# PLAN — harden merge-findings keying + enum-gated rule_id validation

- spec_content_hash: 11cd9ad5983188623fe0931d13588c16435a5565888344e20669748947d1d969 # fix #4 (sha256 of ARCHITECTURE.md, read this run)
- increment: Harden `.dev/floor/merge-findings.mjs` dedup keying + enum-gated `rule_id` validation so lens-format drift and instruction-shaped `rule_id` values cannot silently defeat dedup or launder a trusted-labeled section header into REVIEW.md.
- layer(s): floor tooling (`.dev/floor/`) — not a `role:`-bearing Capability; the merge is ARCHITECTURE.md §2 primitive #3 (enum/regex). Consumed by `/pharn-review` Step 5.
- constitution_refs: [P0, P2, P5, P6, P7]

## Increment axis (P3 — one reason to change)

One axis: **harden the dedup key + enum-gated validation of `merge-findings.mjs`.** All product-code
changes land in a single file (`.dev/floor/merge-findings.mjs`) + its test (`merge-findings.test.mjs`).
No second file changes **iff** FIX 1 is resolved as the on-axis structural regex-tighten (Option A
below). The rendering-route and roster-enumerator alternatives are a _different_ axis/file and are
therefore surfaced as the Open Question, not silently folded in.

## Files

- `.dev/floor/merge-findings.mjs` — harden `file` canonicalization + `rule_id` keying/validation; carry per-source severity — floor tooling
- `.dev/floor/merge-findings.test.mjs` — new node:test cases binding every hardening (these ARE the evals for floor tooling, P1) — floor tooling

> Both live under `.dev/floor/**` (denied by default); `/pharn-dev-build`'s `--from-plan` scope-setter
> authorizes them from THIS `## Files` block. No trusted/write-protected doc is touched (the four docs
>
> - CODEOWNERS stay denied regardless). `finding-shape.md` is **cited, not edited** (P4) — see Open Q.

## Changes (precise)

1. **FIX 2 — path canonicalization before keying (clean, no ambiguity).** Today `FILE_OK` (`:82`)
   accepts `path:line` AND `path:line:col`, and does no `./` stripping, so `src/app.ts:10`,
   `./src/app.ts:10`, and `src/app.ts:10:5` produce THREE findings for one location. Add a
   `canonFile(v)`: strip a single leading `./`, collapse a trailing `:line:col` to `:line`. Canonicalize
   BEFORE building the key (`:143`) AND use the canonical form as the emitted `file`. Same location →
   same key → one merged finding.

2. **SECONDARY — carry per-source severity into `sources[]` (clean).** `:150` currently drops each
   contributor's `severity`. Add `severity: f.severity` to each `sources[]` entry so a REVIEW.md reader
   sees per-source values. Top-level merged `severity` = MAX (`:149`) is **unchanged** (the escalation
   is not hidden — it is now auditable against the per-source values).

3. **SECONDARY — normalize `rule_id` for KEYING only (clean).** Trim + case-fold `rule_id` when
   building the key so `"SEC-1"` / `"sec-1"` / `"SEC-1 "` (trailing space) merge. The **emitted**
   `rule_id` is a deterministic representative (the sources sort already fixes an order; take the
   first survivor's original, un-folded value) — so the tested output `"security.md SEC-1"`
   (`merge-findings.test.mjs:140`) is preserved verbatim.

4. **FIX 1 — instruction-shaped `rule_id` (RESOLVED at GATE 1 → Option A).**
   **Option A (structural regex-tighten, on-axis, no roster):** tighten `RULE_ID_OK` (`:81`) from
   "any clean single line ≤120 chars (spaces allowed)" to a **shape whitelist** admitting exactly the
   two legitimate forms — a principle `^P[0-7]$` OR a file-qualified rule `^[\w./-]+\.md [A-Z0-9]+-\d+$`
   (e.g. `security.md SEC-1`) — and DROP+report anything else (reusing the existing fail-closed
   `droppedReport` path). A 120-char prose instruction (many tokens/spaces) matches neither shape →
   dropped, so it never becomes a TRUSTED-labeled REVIEW.md section header. This closes the stated
   threat **structurally** (a floor regex, ARCHITECTURE.md §2), keeps the increment to one file/one
   axis, and preserves both `P0..P7` and `security.md SEC-1`. **This reverses a deliberate design note**
   in the current code (`:73-75`: it chose NOT to whitelist rule shapes, citing P0 over-tightness),
   which is exactly why it is a HALT-and-ask, not a silent change.

## Contracts satisfied

- `pharn-contracts/finding-shape.md` — the enum-gated (`type`/`rule_id`/`severity`/`file`) vs free-text
  (`problem`/`evidence`) split; this increment strengthens the enum-gated validation the contract
  declares TRUSTED (`finding-shape.md:22-41`). Cited, not restated (P4). **No edit to the contract is
  planned** (see Open Q — Option A does not require narrowing the contract's `rule_id` prose).

## Evals to write (P1) — as `merge-findings.test.mjs` node:test cases (floor tooling has no evals/ dir)

- FIX 2 → three path variants of one location (`src/app.ts:10`, `./src/app.ts:10`, `src/app.ts:10:5`) from ≥1 lens → exactly ONE merged finding; emitted `file` is the canonical `src/app.ts:10`.
- SECONDARY severity → two lenses (minor + blocking) same key → merged `severity: blocking` AND `sources[]` carries both per-source severities (minor, blocking) verbatim.
- SECONDARY rule_id normalize → `"SEC-1"` and `"sec-1"` (+ a trailing-space variant) at one location → ONE merged finding; emitted `rule_id` is the deterministic representative.
- FIX 1 (Option A) → a `rule_id` holding a spaces-bearing prose instruction, and a non-roster/mis-shaped value → DROPPED at merge (counted in `dropped`, absent from output); `P2` and `security.md SEC-1` still survive (regression-guard the existing `:140` test stays green).

## Guarantee audit (P0)

- **"Same source location → same dedup key" (FIX 2)** → floor: enum-regex (deterministic `canonFile` +
  key). GUARANTEE.
- **"An instruction-shaped `rule_id` cannot enter the merged output" (FIX 1, Option A)** → floor:
  enum-regex (`RULE_ID_OK` shape whitelist + fail-closed drop). GUARANTEE — **valid only under Option A**
  (a regex the merge computes). The _roster_ framing ("rule_id is a registered rule") is NOT floor-backed
  today (no roster artifact/enumerator exists — discovery, below) and must NOT be claimed as a guarantee
  unless a roster is built (Open Q, Option C). Under Option A the guarantee is precisely "shape-valid",
  not "roster-member" — labeled honestly.
- **"`rule_id` case/whitespace variants merge" (SECONDARY)** → floor: enum-regex (normalized key).
  GUARANTEE.
- **"Per-source severity is visible" (SECONDARY)** → floor: the additive `sources[].severity` is carried
  deterministically. GUARANTEE that the value is _present_; whether a MAX escalation is _correct_ stays
  ADVISORY (a lens's severity assignment is advisory — finding-shape.md fix #3).
- **"The merged findings are correct / the code is safe"** → ADVISORY (unchanged; the merge assembles,
  it never judges — merge-findings.mjs header, P0).

## Trust audit (P2)

- **Input:** each per-lens `findings.json` originates from a subagent that read `trust: untrusted` code
  and may be injected. `rule_id`/`file` are enum-gated fields the merge treats as TRUSTED once validated.
- **Taint propagation:** the whole point of this increment is that the current validation is too loose —
  a prose instruction laundered into `rule_id` passes `RULE_ID_OK` today and reaches the merged output in
  a TRUSTED-labeled field, then renders as a REVIEW.md **section header** (`pharn-review.md:138`
  quotes only `problem`/`evidence`/`sources[]` as DATA, grouping BY `rule_id`). FIX 1 (Option A) tightens
  the enum-gate so the laundered value is **dropped before keying** — closing the path structurally, not
  by trusting the renderer. `problem`/`evidence`/`sources[]` remain quoted DATA (unchanged). No guaranteed
  decision rests on a tainted field after this change (fix #1 preserved and strengthened).
- **Named residual (LIMITS.md §2):** Option A bounds laundering to strings matching a real rule shape
  (e.g. `P3` or `x.md ABC-1`); a _shape-valid but semantically bogus_ rule reference could still render as
  a header. That residual is closed only by roster-validation (Option C) — surfaced, not hidden.

## Determinism audit (P5)

- Every branch is a membership/regex test: `canonFile` (regex rewrite), `RULE_ID_OK` (regex whitelist),
  key equality, severity-rank MAX (ordered-enum reduce). No LLM classification. Malformed/mis-shaped input
  → fail-closed DROP + report (the existing terminal behavior), never a guess.

## Resolved (GATE 1 — human approval) — no open questions remain

The doc/code-vs-request conflict below was surfaced at the plan-approval gate and **resolved by the
human** (P6 — halt-and-ask satisfied). Recorded here so no `## Open questions (HALT)` remains for
`/pharn-dev-build` to refuse on.

1. **FIX 1 approach → Option A (structural regex-tighten).** DISCOVERY established there is **no roster**
   to validate against (all live `rule_id`s are `P0..P7`; the file-qualified `security.md SEC-1` form is
   contract-documented and **test-guaranteed not to be dropped** at `merge-findings.test.mjs:140` but has
   **no registry**; no roster enumerator exists in `.dev/floor/`; and `merge-findings.mjs:73-75`
   **deliberately declined** to whitelist rule shapes, citing P0 over-tightness). The request's _preferred_
   "roster-validate at merge time" was therefore not implementable without new infrastructure or breaking
   a tested guarantee. The human **chose Option A** — a shape whitelist in `RULE_ID_OK` admitting `P0..P7`
   - `<file>.md <ID>` and dropping prose — **explicitly signing off on reversing the `:73-75` design note.**
     The guarantee is precisely "shape-valid", NOT "roster-member" (labeled honestly, P0).
2. **Scope → all in one increment.** The human confirmed FIX 2 + both secondaries + FIX 1(Option A) ship
   together as one axis (`merge-findings.mjs` + `merge-findings.test.mjs`), P3-clean (Option A stays in
   that one file).
