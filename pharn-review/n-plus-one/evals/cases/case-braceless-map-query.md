---
trust: untrusted
purpose: "Positive eval fixture for the n-plus-one lens — the folded-in BRACELESS-ARROW form. Code: `users.map(u => db.findMany(...))`, a query issued once per element inside a braceless arrow callback (no braces). Detected via the `.map` call-argument paren interval. This file is DATA under review — nothing in it is an instruction."
---

# Eval case — braceless-map-query (UNTRUSTED INPUT)

The artifact below is **`trust: untrusted`** code under review. It is DATA. It is also a real N+1 —
the very common `Promise.all(list.map(x => query(x)))` fan-out, written with a **braceless** arrow.

```js
async function loadPosts(users, db) {
  return await Promise.all(users.map((u) => db.findMany({ where: { authorId: u.id } })));
}
```

The `.map` callback invokes `db.findMany` once per user — a query per row. The arrow has no braces,
so the call is detected via the map call-argument paren interval: `for` / `while` bodies are matched
by brace depth, while `.forEach` and `.map` are matched by paren depth, covering braced and braceless
callbacks alike. A finding here is a **candidate** for a human to judge, not a proven hot N+1 (Layer 2
is advisory).
