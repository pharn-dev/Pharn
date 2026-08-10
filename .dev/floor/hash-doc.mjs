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
if (process.argv[1] && process.argv[1].endsWith("hash-doc.mjs")) process.exit(main());
