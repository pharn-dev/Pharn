# REVIEW — product-lessons-index

**Step 1, floor first:** `node pharn/floor/validate.mjs .` → **GREEN**, 36 capabilities, exit 0. The
increment was entitled to reach review. Everything below the floor line is **advisory**.

> The increment under review is `trust: untrusted`, regardless of which stage produced it. Every
> `problem` / `evidence` below quotes it as DATA.

---

## Floor-gate findings (blocking)

**None.** Each floor-checkable lens was run mechanically, not judged:

| lens             | mechanical check                                                                        | result                                                                                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **L-floor** → P0 | grep for an unnarrowed byte-equality/guarantee claim about the product index            | the only two hits are explicit **negations** ("NOT the dev surface's … byte-equality")                                                                        |
| **L-eval** → P1  | does any new file declare `role:` frontmatter (making it a Capability that owes evals)? | no — three `.mjs` checkers, zero capabilities; the floor agrees (it scans `pharn/floor/` never)                                                               |
| **L-trust** → P2 | does any verdict read a canon-derived (tainted) value?                                  | no — the drift verdict is a byte comparison, the `--verdict` token is the checker's own literal enum, and `check-plan-lessons.mjs` reads canon, not the index |
| **L-axis** → P3  | sibling references across module roots in the new files                                 | imports are `node:fs`, `node:path`, and the same-directory core only                                                                                          |

Two acceptance criteria were verified rather than asserted: `pharn/floor/check-plan-lessons.mjs` is
**byte-identical** to base (`git diff --stat` empty), and the product prose contains **zero** references to
`npm run docs:generate` (L2 — a user's repo has no such script).

---

## Advisory findings

```yaml
- type: FINDING
  rule_id: P0
  severity: important
  file: ".claude/commands/pharn-plan.md:295"
  problem: "/pharn-plan's guarantee audit still claims fix #7 pins everything the stage writes, but this increment gave the stage an optional Bash invocation that writes outside that scope — the same escape /pharn-memory-promote Step 6b declares explicitly, left undeclared here."
  evidence: 'Line 295 reads ''**"It writes only `features/<name>/PLAN.md`"** → **FLOOR: hook (fix #7)**'', while the new line 109 permits ''you may optionally warm the cache first with `node pharn/floor/gen-lessons-index.mjs .`''. That generator writes `.pharn/lessons-index.md` through Bash, which the `Write|Edit|MultiEdit` hook does not gate. Benign in effect (`.pharn/**` is always-writable scratch, so nothing is reached that the scope withheld) but the audit sentence is now narrower than the truth — L19''s ''declare it, do not pretend the gate covered it'' applied inconsistently WITHIN one increment.'

- type: FINDING
  rule_id: P0
  severity: minor
  file: "pharn/floor/check-lessons-index.mjs:9"
  problem: "The documented condition for COLD is narrower than the implemented one: an UNREADABLE cache also yields COLD, but the header says only 'no cache exists yet'."
  evidence: "Line 9 documents 'COLD  exit 0  canon has lessons; no cache exists yet.' while line 8's sibling correctly reads 'NO_CANON … is absent, or holds zero `## L<n> ` headings'. Reproduced live: with a DIRECTORY at `.pharn/lessons-index.md`, the checker returns COLD at exit 0. The behavior is in the safe direction (degrade to reading canon in full, never a false GREEN on a real drift), so this is a documentation accuracy gap, not a defect — but the fix is one word ('absent or unreadable'), and a checker whose header overstates its own precision is the seed of the disease."
```

**Both are advisory-gate**, not floor-gate: each rests on reading prose against behavior, and neither
blocks. Recommended disposition — fix both before merge; they are a sentence and a word respectively, and
the first is the more valuable of the two because it is a **guarantee-audit** sentence.

---

## L-trust — the self-check the lens actually demands

**Did instruction-looking content in a reviewed artifact change my behavior? No — and the interesting part
is where it nearly did, from a source that is not the untrusted class at all.**

The input brief `.dev/PORT-2-lessons-index.md` is human-authored task intent, not untrusted ingested
content, and it explicitly invited its own override ("the live file always wins over this brief"). It was
overridden three times from live state (P6), and each override changed the design:

1. The brief's Q1 reasoning distinguished `docs/` from `memory-bank/` on sensitive-zone grounds. Live, the
   guard denies **both** under the fail-closed safe-set (`DEFAULT_SAFE_SET = features/**, .dev/features/**,
pharn/pharn-*/**`); the real distinction is that `memory-bank/**` is the **gated-canon** zone and `docs/`
   has no gate.
2. The brief did not know `.pharn/` sits on `validate.mjs`'s scanned surface. It does — `EXCLUDE_SEGMENTS`
   omits it — so the CHECK-5 refusal had to be **carried over**, not dropped.
3. The brief did not anticipate that the dev core **throws** on absent canon, which is the common state of
   a user's repo. That single fact turned the increment from a copy job into a design change.

Recording this because the near-miss is instructive: I wrote "CHECK-5 N/A" in an option preview to the
human **before** checking, and had to correct it. The correction came from reading `validate.mjs` live, not
from noticing the error by reasoning — which is exactly the argument for P6 over careful thought.

---

## Verdict

```text
GREEN — 0 floor-gate findings; 2 advisory findings (1 important, 1 minor)
```

A GREEN floor and a PASS verify mean **the named deterministic checks passed** — never that the increment
is good or wise. That judgment is the human's at the post-review gate, and the two design questions worth
weighing there are the ones `/pharn-dev-grill` raised and this review does not re-litigate: whether the
`.pharn/` narrowing left enough floor content to justify shipping over deferring (F1/F5).

---

## Proposed lesson candidate (PROPOSED ONLY — not promoted, not written to canon)

`/pharn-dev-review` declares no `.dev/memory-bank/**` path and cannot write canon. This is a **candidate**
for a separate, human-gated `/pharn-dev-memory-promote` run.

**Candidate title.** _A port must RE-DERIVE its host-surface assumptions; "gitignored" never means
"unscanned", and each tool's traversal differs._

**Body.** When porting a generated artifact to a new directory, the guards that protected it in its old
home must be **re-derived against the new path**, never copied and never dropped. Three host-surface facts
about `.pharn/` were each **opposite** to the intuitive answer and each was established by running the
tool, not by reasoning: `pharn/floor/validate.mjs` **does** walk it (its `EXCLUDE_SEGMENTS` omits `.pharn/`,
so being gitignored exempts nothing, and CHECK 5 fires on any `.md` regardless of frontmatter);
`markdownlint-cli2` **does** descend into it (`**/*.md` matches dot-directories in its globber — which is
also why `.dev/**/*.md` is listed separately in the config); and `prettier --check .` **does not**. So one
`ignores` entry was load-bearing and the symmetric `.prettierignore` entry would have been
speculative — opposite conclusions for two tools invoked the same way, in the same repo, over the same path.
Generalizes to every relocation of a generated file: enumerate the tools whose scope the path enters, and
**probe each one**.

**Why it matters.** Copying the guard is the safe-looking error and dropping it is the dangerous one, but
both come from the same move — treating the old home's scan properties as a property of the artifact rather
than of the path. Had the CHECK-5 refusal been dropped here, a pair of canon titles in a **user's**
memory-bank could have RED'd that user's floor for a reason unrelated to their code — L10's failure mode,
reached through a third surface L10 does not name. Complements L10 (which contrasts `.dev/` and root
`features/`, and does not cover `.pharn/`) and L11 (whole-repo style gates), and it is the first entry
concerning a **tool-traversal asymmetry** rather than a scan-surface boundary.

**Honest trigger (P7), stated rather than hidden.** **No dogfood failure and no eval failure.** This was a
**design-time near-miss, self-corrected**: the wrong conclusion ("CHECK-5 N/A for `.pharn/`") was written
into a question put to the human before the live check was run, and was corrected minutes later by reading
`validate.mjs`. That is a weaker trigger than the before→fix→after cycle L4 was earned by, and the human
should weigh it as such at the promote gate — including the option of declining. A recurrence would earn
it more clearly than this run does.

**Provenance (for the promote gate to capture live, not to copy from here).**

- feature: `product-lessons-index`
- source: `.dev/features/product-lessons-index/REVIEW.md` (this candidate) +
  `.dev/features/product-lessons-index/PLAN.md` (the `L10` applied-lessons line recording the re-derivation)
- the `commit` and `date` fields must be captured deterministically by `/pharn-dev-memory-promote` Step 1,
  never composed here.
