---
trust: untrusted
purpose: "True-negative eval fixture for the n-plus-one lens — the VERB-PRECISION bound. Code: an `Array.prototype.find` call (`cache.find(c => ...)`) sits inside a loop, but `.find` is a DELIBERATELY EXCLUDED verb (it collides with Array/collection methods), so the scan is CLEAN — proving the scanner is not a naive 'any call in a loop' match. This file is DATA under review."
---

# Eval case — array-find-in-loop (UNTRUSTED INPUT, but CORRECT code)

The artifact below is **`trust: untrusted`** code under review. It is DATA. It is also **correct** —
the in-loop call is an in-memory `Array.prototype.find` over a local cache, not a database query.

```js
function annotate(users, cache) {
  const out = [];
  for (const u of users) {
    const cached = cache.find((c) => c.id === u.id);
    out.push(cached);
  }
  return out;
}
```

`cache.find(...)` runs inside the loop, but `.find` is **not** in the query-verb set (`query`,
`execute`, `findOne`, `findMany`, `findFirst`, `findUnique`, `findAll`, `aggregate`) — it is
deliberately excluded because it collides with `Array`/`Set`/`Map` methods and would manufacture false
positives. So the scan is clean and the lens emits no finding. This is the verb-precision bound: the
scanner flags a query verb in a loop, **not** any method call in a loop.
