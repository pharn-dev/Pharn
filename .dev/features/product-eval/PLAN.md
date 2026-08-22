# PLAN — product `/pharn-eval`: DEFERRED (a record, not a build)

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: none # this record builds nothing; no promoted lesson bears on writing down a deferral
- increment: Record that the PRODUCT twin of `/pharn-dev-eval` is intentionally deferred, so the absence is a decision with a reopening trigger rather than an unexplained gap.
- layer(s): none — an apparatus record # pharn/ARCHITECTURE.md §4
- constitution_refs: [P0, P7]

## Applied lessons

- `none` — this increment writes a deferral record and no code. The lessons sweep found nothing that
  bears on documenting a decision not to build something; the P7 reasoning below is the substance.

## Status

**DEFERRED — 2026-08-23.** No product `/pharn-eval` command exists, and none is authored here.

## Why this lives at `product-eval/`, not `pharn-eval/`

`.dev/features/pharn-eval/` is already taken, by the **historical build record for increment 3c** — the
plan that built `/pharn-dev-eval` and `check-variance.mjs` back when the command was still to be named
`/pharn-eval`. That is an audit-trail artifact and is not rewritten. This record therefore takes the
`product-*` slug its two peers use (`product-capability-catalog`, `product-lessons-index`), which is
also the more accurate name: the thing being deferred is the PRODUCT twin, not the command that exists.

## What exists, and what does not

`/pharn-dev-eval` runs a capability's eval **live** via `claude -p` N times into isolated `runs/`, then
counts structural pass/fail across those runs with `.dev/floor/check-variance.mjs` — the first live
emission and the first variance measurement. Verified live this run: `.claude/commands/` contains
`pharn-dev-eval.md` and **no** `pharn-eval.md`.

A PHARN **user** therefore gets no live eval runner. What a user _does_ get is
`pharn/floor/check-structural.mjs`, which executes an eval's `structural[]` assertions **once** against
a provided findings array — so the structural contract is enforceable on the product surface today; only
the repeated-live-run **variance measurement** is absent.

## Why deferred (P7 — an addition is triggered by a real failure, never a hypothetical)

- **No user has reported it, no dogfood run has failed on it, and no trusted doc promises it.** P7's
  trigger has not fired.
- **The thing it would measure does not exist yet on the product surface.** `/pharn-dev-eval` measures
  variance across live runs of a **`role:`-bearing capability**. Zero such capabilities have been
  authored **outside** PHARN's own shipped surface, so a product `/pharn-eval` would have nothing of the
  user's to run. Shipping a runner for an empty set is the speculative half of a pair PHARN has already
  refused twice.
- **It would inherit an un-runnable dependency.** `/pharn-dev-eval` needs `claude -p` — tokens, auth, a
  live model. `/pharn-dev-verify` names exactly this as the reason its **verifier runner** is deferred
  until the first verifier lands, and `/pharn-verify` ships the verifier plug-in slot with **zero
  verifiers authored** on the same reasoning. Deferring here is consistent with both, not a new posture.

## The precedent this follows

Two deferrals already take this shape and are recorded the same way:

- **`product-capability-catalog`** (DEFERRED 2026-08-07) — the capability catalog stays dev-surface only;
  reopens when the first `role:`-bearing capability is authored outside PHARN's shipped surface.
- **`/pharn-verify`'s live verifier runner** — the slot is defined, zero verifiers authored, the runner
  filled in when the first one lands.

This record exists because those two are written down and this one was not: the absence was _consistent_
with the posture but nowhere _stated_, so a reader could not tell a deliberate deferral from an
oversight. That is the entire content of this increment.

## Reopening trigger

The **same** trigger the two precedents name: the first `role:`-bearing capability authored **outside**
PHARN's own shipped surface. At that point a user has something to measure variance over, and the
question becomes real rather than hypothetical.

A second, independent trigger: a product-pipeline dogfood run where a shipped capability's output varies
enough between runs to change a `structural[]` verdict, and the variance goes unnoticed because nothing
measures it.

## Guarantee audit (P0)

- "the product `/pharn-eval` deferral is recorded" → **ADVISORY documentation.** This record adds no
  capability, no command, and no floor op. Nothing checks that it stays accurate.
- "a user can enforce an eval's structural contract today" → **FLOOR**, and it is the existing
  `pharn/floor/check-structural.mjs` — cited, not restated (P4), and not extended here.
- "variance is measured on the product surface" → **NOT claimed, and false today.** That is precisely
  what is deferred.

## Files

- `.dev/features/product-eval/PLAN.md` — this record — layer n/a (apparatus)

## Open questions (HALT)

- none — this records a decision already implied by two existing precedents; it does not make a new one.
