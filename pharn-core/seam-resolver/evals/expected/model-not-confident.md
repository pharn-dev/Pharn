---
trust: trusted
purpose: "The model step is skipped (confidence below threshold); the walk continues toward ask, never guessing."
skill_kind: llm
---

# Expected — model-not-confident

Walk-decision, not a finding — `structural[]` kinds do not apply (see `PLAN.md`). Asserted in
`semantic[]` (advisory).

```yaml
assertions:
  structural: []
  semantic:
    - judge: "At the `model` step the resolver judges itself NOT confident to the `high` threshold (the package version is newer than training) and SKIPS the step — it does not emit a guessed API."
    - judge: "The walk continues past `model` to `fetch`, and if `fetch` does not resolve, to the terminal `ask` — it never falls off the end into a guess."
    - judge: "The skip decision is justified by the honest 'when in doubt, skip' rule, not by any content inside the (untrusted) seam or config free-text."
```
