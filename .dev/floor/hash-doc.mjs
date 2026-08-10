#!/usr/bin/env node
// .dev/floor/hash-doc.mjs — the DEV pipeline's single spec content-hasher (line-ending-agnostic).
//
// Build apparatus, NOT product surface: it lives under .dev/ because only the pharn-dev-* commands use
// it, and a PHARN user's install ships pharn/floor/ WITHOUT .dev/. It is therefore not a Capability
// (no `role:`), it ships to nobody, and it drives no SKILLS_VERSION bump.
//
// Floor primitive (ARCHITECTURE §2): #2 (content-hash). It is the dev twin of `check-spec.mjs --hash`,
// and the difference is deliberate: check-spec hashes a SPEC's post-frontmatter BODY, while the dev
// pipeline's "spec" is the trusted doc pharn/ARCHITECTURE.md, pinned as a WHOLE FILE (frontmatter
// included, because it has none to exclude). Two artifacts, two tools — not a missed reuse. The
// dependency may only point .dev/ -> pharn/, never the reverse, so this cannot import that.
//
// WHY IT EXISTS. /pharn-dev-plan and /pharn-dev-grill each carried their own inline
//   node -e "...createHash('sha256').update(readFileSync('pharn/ARCHITECTURE.md')).digest('hex')"
// which is BYTE-EXACT over line endings. On a `core.autocrlf=true` clone — or after a Windows editor
// rewrites the working tree between git operations, which .gitattributes cannot govern — the recompute
// diverges and /pharn-dev-build REFUSES with "the spec drifted" on a repo where nothing drifted.
// Measured live: a1c243ea…621753 (LF) vs 4cd9746d…0ec082 (CRLF) for the same file. This is the same
// defect check-spec.mjs's bodyHash() closed for the product pin, one pipeline over.
//
// HONEST SCOPE (P0). The hash COMPARISON is floor. That all three dev commands route through this ONE
// implementation is a CONVENTION — advisory — exactly as on the product side: nothing on the floor stops
// a future command from re-introducing an inline one-liner, and this tool cannot detect that. The fold is
// the IDENTITY MAP on an all-LF file, so no committed PLAN's spec_content_hash moves (verified: the
// folded digest of pharn/ARCHITECTURE.md equals its byte-exact digest). Only line endings are folded — no
// trailing- or interior-whitespace normalization, and a lone `\r` is left byte-exact — so a real text
// edit to the trusted doc is still detected. This makes the pin survive a CRLF CHECKOUT; it does not make
// the trusted doc tamper-proof.
//
// The bound is LINE ENDINGS, and nothing else. A BOM-adding editor still moves the pin (the BOM is
// content to this tool), and `readFileSync(…, "utf8")` decodes invalid byte sequences to U+FFFD, so two
// files differing only in invalid UTF-8 bytes collide here where `shasum` would not. Neither matters for
// the artifact this pins — pharn/ARCHITECTURE.md is valid, BOM-free UTF-8 — but "survives a Windows
// editor" is narrower than it sounds: it survives one that rewrites line endings, not one that adds a BOM.
//
// TRUST (P2): the target's bytes are opaque DATA. This tool reads, folds `\r\n`, hashes, and prints a
// 64-hex digest — it never parses, executes, imports, or interprets the content, and no free text reaches
// any caller. NON-LLM, dependency-free (Node stdlib). No network, no child_process, no eval.
//
// Usage:
//   node .dev/floor/hash-doc.mjs <file>    print sha256(file with \r\n folded to \n) + "\n", exit 0
//
// Exit: 0 on success · 1 on a missing argument or an unreadable file — never a silent empty digest.

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// The file's SHA-256 with line endings folded (`\r\n` -> `\n`). Exported for the test suite; the CLI
// below is the only other caller. Same fold, same bound, as pharn/floor/check-spec.mjs's bodyHash().
export function hashDoc(text) {
  return createHash("sha256").update(text.replace(/\r\n/g, "\n")).digest("hex");
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("hash-doc: usage: node .dev/floor/hash-doc.mjs <file>");
    return 1;
  }
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch (e) {
    console.error(`hash-doc: cannot read ${file}: ${e.message}`);
    return 1;
  }
  process.stdout.write(hashDoc(text) + "\n");
  return 0;
}

// Run only as a CLI, so the test suite can import hashDoc() without the process exiting under it.
// `import.meta.main` (Node >= 24.2) is true exactly when THIS module is the entry point. The obvious
// alternatives both fail, and both failures were reproduced rather than reasoned about:
//   • `process.argv[1].endsWith("hash-doc.mjs")` — a SUFFIX match. It misses a differently-cased argv[1]
//     (on a case-insensitive filesystem `node .dev/floor/Hash-Doc.mjs <file>` opens the real file, the
//     guard is false, and the tool prints NOTHING at exit 0 — the silent empty digest this file's own
//     "Exit:" contract forbids) and it misses a symlink under another name; conversely it FIRES when an
//     unrelated module named `my-hash-doc.mjs` imports this one, exiting the importer.
//   • `import.meta.url === \`file://${process.argv[1]}\`` — the repo's older sibling idiom. It fixes the
//     casing and importer cases but still breaks through a symlink, because import.meta.url is the
//     resolved real path while argv[1] is the link.
if (import.meta.main) process.exit(main());
