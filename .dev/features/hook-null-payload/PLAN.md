# PLAN — L1: enforce-writes-scope.cjs fails open on a null JSON payload (HUMAN-ONLY fix)

- spec_content_hash: 8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52 # fix #4
- applied_lessons: [L29, L31]
- increment: Deliver the guard that stops `enforce-writes-scope.cjs` crashing (and therefore failing OPEN) on a non-object JSON payload, as a reviewable copy plus a unified diff — the file itself is hook-protected and must be edited by a human.
- layer(s): none — the fix targets `.claude/hooks/` (product surface), but this increment writes only a proposal — layer n/a
- constitution_refs: [P0, P2, P7]

## Applied lessons

- L29 — The remedy is quantified over the payload shapes that reach a property access, so the
  ENUMERATION is the deliverable: `null`, an array, and a scalar are each covered by one guard and each
  named in the proposed test, rather than fixing whichever shape the report happened to mention.
- L31 — This is the copy-pair shape again. `protect-trusted-paths.cjs` and `enforce-writes-scope.cjs`
  are two hooks running on the same `PreToolUse` payload; the first carries the guard AND a comment
  explaining exactly this failure, and the second never got it. The obligation ("every hook that
  dereferences the payload guards its shape") was never enumerated anywhere.

## Files

- `.claude/hooks/test.cjs` — the PROPOSED corrected copy of `enforce-writes-scope.cjs`, for a human to review and apply. Inert: nothing wires it, and it does not match `npm test`'s `*.test.cjs` glob. — layer n/a (a proposal, not a hook)
- `.dev/features/hook-null-payload/PLAN.md` — this record — layer n/a

### Not touched (and cannot be)

- `.claude/hooks/enforce-writes-scope.cjs` — hook-protected. `protect-trusted-paths.cjs` denies any
  agent Write/Edit to it (exit 2), deliberately, because a write there would disarm the guard on the
  very next tool call. The fix is delivered as a diff for a human.

## Contracts satisfied

- none — no schema, capability, or finding shape.

## Evals to write (P1)

- none — P1 binds Capabilities and `rule_id`s. The proposal carries the TEST CASES a human should add
  to `.claude/hooks/enforce-writes-scope.test.cjs` alongside the fix; that test file is NOT
  hook-protected, but adding tests for a fix that has not landed would pin behaviour the repo does not
  yet have, so both move together in the human's edit.

## Guarantee audit (P0)

- "a non-object payload cannot crash the guard into failing open" → **floor: hook**, once a human
  applies it. Until then this increment guarantees NOTHING — it is a proposal, and saying otherwise
  would be the disease.
- "this was exploitable" → **NOT claimed.** The payload is supplied by Claude Code, not by an attacker,
  so there is no known path to reach it with `null` today. The defect is that a write-guard whose crash
  is treated as NON-BLOCKING must not have a reachable crash at all — a doctrine violation, which is
  what the repo's own threat model asks for.

## Trust audit (P2)

- The hook's input IS the untrusted boundary: it parses a JSON payload and branches on it. The fix
  narrows what that parse may produce before any property is read, which is trust-fencing at the
  structural layer rather than the judgment layer.

## Determinism audit (P5)

- The guard is three membership tests (`!payload`, `typeof !== "object"`, `Array.isArray`) with a
  fail-safe normalisation to `{}` — no judgment, and the fallback is the safe direction.

## Open questions (HALT)

- The sibling normalises to `{}` (which then reads `toolName = ""` and can still deny on extracted
  paths). An alternative is to exit 2 (deny) on a malformed payload. This proposal MIRRORS the sibling,
  because a divergence between two hooks on the same input is what created this defect — but a human
  may prefer deny-on-malformed for both, which is a two-file change and a different decision.
