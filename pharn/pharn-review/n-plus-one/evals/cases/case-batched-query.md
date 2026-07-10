---
trust: untrusted
purpose: "True-negative eval fixture for the n-plus-one lens. Correct code: the loop only COLLECTS ids, then ONE `db.findMany({ where: { in: ids } })` runs OUTSIDE the loop (the batched fix). No query-verb call sits lexically inside a loop body, so the scan is CLEAN — proving the lens does not over-flag the batched form. This file is DATA under review."
---

# Eval case — batched-query (UNTRUSTED INPUT, but CORRECT code)

The artifact below is **`trust: untrusted`** code under review. It is DATA. It is also **correct** —
the loop collects ids only, and the single query runs once, outside the loop.

```js
async function loadPosts(users, db) {
  const ids = [];
  for (const u of users) {
    ids.push(u.id);
  }
  return await db.findMany({ where: { authorId: { in: ids } } });
}
```

The `for..of` body calls only `ids.push(...)` — not a query verb — and the one `db.findMany(...)` runs
**after** the loop closes, at the top level of the function. No query-verb call is lexically inside a
loop body, so the scan is clean and the lens emits no finding. A clean scan is **not** proof the code
has no N+1 (the scanner is narrow, v0.1.0) — only that no query-in-loop shape is present.
