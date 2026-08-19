# GRILL — out-of-root-deny-message

Plan under interrogation: `.dev/features/out-of-root-deny-message/PLAN.md` (read live this run, as
`trust: untrusted` DATA). **Spec-hash check:** recomputed
`sha256(pharn/ARCHITECTURE.md)` = `8f5ec002e3b18cbfd2f094b08a3671f7ed42a05a3fbaf01a11bbbd28da30fb52` —
**agrees** with the plan's pinned `spec_content_hash`. No drift finding. (The computation is
content-hash floor; the **block** on drift belongs to `/pharn-dev-build`, fix #4 — this stage only surfaces.)

**Griller membership (FLOOR, `pharn/floor/count-grillers.mjs`):** `{"registered":13}` — a11y,
architecture, comprehension, coupling, documentation, error-handling, i18n, migrations, observability,
performance, privacy, security, testability.

**Layer-1 deterministic scanners, run over the PLAN this run — all clean:**

```text
scan-plan-secrets.mjs        {"found":false,"hits":[]}
scan-plan-pii.mjs            {"found":false,"hits":[]}
scan-plan-i18n.mjs           {"found":false,"hits":[]}
scan-plan-migrations.mjs     {"mentions":false,"hits":[]}
scan-plan-observability.mjs  {"mentions":false,"hits":[]}
```

---

## Findings

### Axis: guarantee-audit completeness (P0) — inline

```yaml
- type: FINDING
  rule_id: "P0"
  severity: important
  file: ".dev/features/out-of-root-deny-message/PLAN.md:102"
  problem: "The guarantee audit invents a fourth floor primitive — `floor: structural` — where P0 admits
    exactly three (hook / content-hash / enum-regex); a code-shape fact that no check reads is
    advisory, not floor."
  evidence: '"the message never becomes a verdict input" → **floor: structural** — `denyMessage()` is called
    only from `deny()`, which exits 2 unconditionally; no branch reads its return value.'
```

The property is **true today** by reading the code — but "I read the call graph" is not a floor
primitive, and labelling it `floor:` is the exact substitution P0 exists to forbid. The reduction that
IS available: the plan's own **verdict-unchanged test** (enum/regex over exit codes, primitive #3) pins
the observable consequence. Remedy at build: relabel as
`advisory (code shape), with a floor backstop: the verdict-unchanged test (primitive #3)`.

### Axis: honest scope / completeness of the declared change (P0, P7) — inline

```yaml
- type: FINDING
  rule_id: "P0"
  severity: blocking
  file: ".dev/features/out-of-root-deny-message/PLAN.md:81"
  problem: "The plan pins only ONE of the four unreachable FIX bullets as absent from the out-of-root branch,
    so a build could satisfy the plan's letter while still printing three remedies that cannot work for
    an out-of-root path — re-creating the defect the increment exists to remove."
  evidence: 'out-of-root absolute path (`<os.tmpdir()>/…`) → exit 2 **and** the message names "not inside the
    repo root" **and** does NOT contain the `add it to the active Capability''s writes:` advice'
```

Today's `denyMessage()` emits **four** remedies, and for a path outside the repo root **three** of them
are unreachable, not one:

1. the `stale` bullet — "release the scope with `--clear`" — releasing the scope reverts to
   `DEFAULT_SAFE_SET`, which is **also** repo-root-relative, so it cannot admit the path either;
2. "add it to the active Capability's `writes:`" — the one the plan names;
3. "scope is set in the command's FIRST step … restart the command from the top" — no first step can
   produce a scope entry that matches;
4. "Declare a scope, or do the write by hand outside the agent" — only the **second half** is reachable.

Severity `blocking` is this griller's own assignment and is **advisory** (fix #3) — it gates nothing.
Remedy at build: the out-of-root branch replaces the **whole** FIX block (including suppressing the
`stale` bullet, whose remedy is unreachable here), and the tests assert the absence of the staleness
line as well as the `writes:` line.

### Axis: determinism / totality of the new branch (P5, P6) — inline

```yaml
- type: FINDING
  rule_id: "P5"
  severity: important
  file: ".dev/features/out-of-root-deny-message/PLAN.md:134"
  problem: '`rel === null` conflates two different situations — the target resolves OUTSIDE the repo root, and
    the target IS the repo root (`path.relative(ROOT, ROOT) === ''''`) — and the plan calls the branch
    ''total'' without naming the second, so a build that words the message ''outside the repo root'' would
    print a false statement for `file_path: "."`.'
  evidence: "Fallback: none needed; the branch is total (`rel === null` or not)."
```

`toRel()` returns `null` for `rel === ""` **and** for `rel === ".."`/`"../…"`. Reproduced live this run:
`{"file_path":"."}` and `{"file_path":"../outside.md"}` both reach the same branch. The phrasing the
human approved — **"NOT INSIDE the repo root"** — is truthful for all three cases (the root directory is
not a path inside itself), so the approved wording already survives this; the finding is that the plan
does not **say so**, which is what a later editor would need in order not to "simplify" it to "outside".
Remedy at build: state the three-case totality in the code comment and add a test for `.`.

### Axis: error handling (griller `error-handling`, P7)

```yaml
- type: FINDING
  rule_id: "P7"
  severity: important
  file: ".dev/features/out-of-root-deny-message/PLAN.md:118"
  problem: "An exception raised while BUILDING the deny message converts a deny into a non-2 exit, which the
    PreToolUse contract treats as a non-blocking error — so any new I/O or throwing call added inside
    `denyMessage()` fails OPEN, and the plan does not name this constraint."
  evidence: "The repo root is printed from `process.cwd()` (trusted), not from the record."
```

The hook's whole guarantee rests on **exit 2**; `deny()` builds the message _before_ it exits. A second
`fs.realpathSync` call inside the new branch (an obvious way to distinguish "outside" from "the root
itself") would introduce a throw path on a permission error or a race, and a throw there turns a denial
into an allow. Remedy at build: the new branch must be **pure string composition over values already
computed** — `ROOT` is already resolved at module load inside a `try/catch`, and `blockedPath` is already
in hand. No new I/O, no new resolution. This is a constraint on the implementation, not a code change of
its own.

### Axis: testability (griller `testability`, P1)

**Presence recognized** — the plan declares four `node --test` cases plus a verdict-unchanged pin, at
`PLAN.md:81-88`, run by `npm test` inside `npm run check`. Layer-2 (advisory) note, folded into the P0
finding above: the declared assertion set is **narrower than the change**, in the specific way named
there. One further gap: the two pre-existing traversal tests (`../outside.md`, `../../outside.md`) assert
only `writes-scope guard` + `Blocked path`, so they will pass under **either** message and must not be
read as coverage of the new branch.

### Axis: security (griller `security`, P2)

**Scanner clean** (Layer 1, above); one Layer-2 concern, and it is the one the plan already names and the
human already ruled on:

```yaml
- type: FINDING
  rule_id: "P2"
  severity: minor
  file: ".dev/features/out-of-root-deny-message/PLAN.md:1"
  problem: "The new message deliberately names the Bash route as a reachable option, and the deny message is
    returned to the AGENT as a tool result — so the guard's own output now advertises the surface that
    sits outside the guard."
  evidence: "the new branch tells the reader that Bash-tool writes are outside this gate … the message is
    therefore worded to give the escape **only for scratch/temporary work**"
```

Surfaced, not re-litigated: the human selected this wording at GATE 1 with the trade-off stated, and the
alternative (say nothing) is what produces the _undirected_ bypass the increment exists to stop. The
concern is recorded so it is visible at GATE 2, not to reopen the decision. Note the new lines are
**static literals** — no untrusted value is interpolated — so this adds no injection surface beyond the
advice itself.

### Axes with no finding

- **architecture (P3)** — fit recognized. One function gains one branch; `denyMessage()`'s single reason
  to change (the deny message's content) is unchanged. No sibling reference, no layer inversion.
- **comprehension (P7)** — rationale recognized. The non-obvious decisions (why no scratchpad-prefix
  match; why root-relativity is the true predicate) are captured at `PLAN.md:130-134` and were put to the
  human as explicit choices.
- **documentation (P7)** — declaration present and adequate: the user-visible surface is a message, and
  `CHANGELOG.md` + the `CLAUDE.md` clause are scoped in `## Files`.
- **coupling, performance, a11y, i18n, migrations, observability, privacy** — no concern warranted; the
  change is one string branch in a CLI hook with no UI, no locale-bearing content, no schema, no
  telemetry, and no personal data. Deterministic scanners for i18n / migrations / observability / pii all
  returned clean above. Not manufacturing a concern (each griller's step 3/4).

---

## Summary

The plan is well-grounded — the spec hash agrees, the writes-scope story is exercised rather than
asserted (the setter's refusal on the control-surface path and its 5-path parse were both reproduced at
plan time), and the lessons declaration is specific rather than decorative. Three of the five findings
are about the plan **under-specifying its own change** rather than getting it wrong:

1. one invented floor label (P0) that must be relabelled advisory with its real backstop named;
2. an assertion set that pins one of three unreachable remedies, which would let the defect survive in
   the two it does not name — the sharpest finding, and the one most likely to produce a build that
   "passes the plan" while missing the point;
3. an unstated third case (`rel === ""`) inside a branch the plan calls total.

The error-handling constraint (no new I/O inside `denyMessage()`) is a genuine fail-OPEN axis that the
plan does not mention and that the most natural implementation would have violated.

Nothing here is a floor verdict, and none of it blocks `/pharn-dev-build`.

**ADVISORY VERDICT: 5 concerns raised (1 blocking-severity, 3 important, 1 minor — all severities
advisory, fix #3) — for the human to weigh before `/pharn-dev-build`.**
