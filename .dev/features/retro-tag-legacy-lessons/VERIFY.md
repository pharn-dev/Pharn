# VERIFY — retro-tag-legacy-lessons

**Question answered:** did what was supposed to be built get built **correctly** — through two layers
kept strictly separate. The FLOOR layer owns the verdict; the ADVISORY layer only annotates.

> **Re-run after the GATE-2 fix pass**, so the verdict describes the tree as it now stands, not as it
> stood before the fixes.

- **Machine report:** `verify-report.json` — the helper's verdict fields **verbatim** (re-compared
  field-by-field after writing), plus the advisory `verifiers` block merged in **after** the verdict was
  computed.

## FLOOR layer — the deterministic gates (these OWN the verdict)

| gate                                           | exit | what it covers                                         |
| ---------------------------------------------- | ---- | ------------------------------------------------------ |
| `test`                                         | 0    | the hermetic suite — **1381/1381 pass**                |
| `validate`                                     | 0    | the structural floor — GREEN, 36 capabilities          |
| `lint`                                         | 0    | eslint clean                                           |
| `format:check`                                 | 0    | prettier clean, whole-repo (L9)                        |
| `lint:md`                                      | 0    | markdownlint clean, whole-repo (L9)                    |
| `structural:…/expected-injection-comment.json` | 0    | trust-fence eval pair — 6 structural assertions passed |

Together `test` + `lint` + `format:check` + `lint:md` are exactly the repo's `npm run check` aggregate,
so this verdict tracks the full `npm run check` — L9's style-gate hole closed **at verify**.

**The suite grew 1380 → 1381: the increment now ships a floor check of its own.** The fix pass added a
live-canon drift guard to `.dev/floor/lessons-index-core.test.mjs` asserting **`0 untagged · 0
malformed`** over `.dev/memory-bank/lessons-learned.md`. This converts what the plan could only offer as
an **advisory** Step-2b grep into a gate that fails `npm test` — the escalation **L20** prescribes for a
remedy whose only enforcement was "remember to look."

**It was measured rejecting before being trusted (L4 — an authored fixture passes by construction).**
Against unmutated canon it passes; with `L2`'s tag line deleted it fails naming `L2` (untagged); with
`L2`'s `type` set to a non-member it fails naming `L2` (malformed). Canon was restored from a backup and
verified **byte-identical by SHA-256** (`7b11d950…33db` before and after), so the measurement left no
residue.

**Why a `structural:*` gate is present at all.** This feature ships **no evals of its own** — the plan's
`## Evals to write (P1)` is a reasoned `None` (P1 binds a Capability; this adds none), and the new
assertion is a **test in an existing suite**, not an eval pair. The repo's one committed eval pair is
included anyway, consistent with verify's whole-repo posture: it only **widens** what must be green.

**Two facts re-derived outside the gate map,** because they are the deliverable and an exit code would
not show them: `parseLessons()` over live canon returns **`entries=21 tagged=21 malformed=0
untagged=0`**; and the `type` distribution over `L1`–`L17` is **`process 5 · scoping 4 · floor 4 ·
tooling 2 · contract 1 · eval 1`**, matching `check-provenance.mjs`'s published corpus figures
component-for-component. The first is now **also** a gate (above); the distribution arithmetic is
**not** — no checker computes it, and it stays evidence rather than a guarantee.

## ADVISORY layer — verifiers

**No verifiers registered — floor gates only.** `node pharn/floor/count-verifiers.mjs .` →
`{"registered":0,"verifiers":[]}`, a deterministic frontmatter membership read (P5), never a prose grep.
Step 2 is a no-op and `verifiers.findings[]` is empty. Zero verifiers is the designed state, not a gap:
authoring one speculatively for an empty slot is what P7 forbids.

## Verdict (FLOOR — `check-verify.mjs`, exit 0)

**VERIFIED: floor gates PASS** — every gate exit 0, `failing_gates[]` empty.

**Honest residual (P0).** _Verified = the named gates passed._ This is **NOT** a guarantee of correctness
beyond what those gates check. Two limits matter here specifically:

1. **Aptness is unguarded, and the new drift guard does not change that.** The guard proves every tag
   line is well-**shaped**; **nothing** proves a `type` or `concepts` value **describes** its lesson. The
   enum gate proves `floor` is a member of `TYPE_ENUM`; it cannot prove L6 is about the floor. **"Typed
   `floor`" never means "about the floor."** All 17 assignments rest on the human's batch-by-batch
   ratification at GATE 1.
2. **The render residual is narrowed, not closed.** The new pin covers **this repo's** canon only. The
   product twin `pharn/floor/lessons-index-core.mjs` has no equivalent and deliberately keeps the benign
   reading of `-`, so a **user's** `memory-bank/` can still carry a `?` at exit 0. The
   `lesson-tagline-render-check` follow-up still stands for that surface.

Verifier concerns would be advisory help, not assurance — and there are none to report.
