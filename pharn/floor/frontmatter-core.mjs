// pharn/floor/frontmatter-core.mjs — the ONE definition of the leading-YAML-frontmatter anchor, and the
// input normalisation that must happen before it is applied. Shared by every floor checker that reads
// frontmatter. Node stdlib only, zero behaviour beyond parsing.
//
// WHY THIS FILE EXISTS (the trigger, P7 — not a hypothetical). `FM_RE` was copy-pasted, byte-identical,
// into SIX checkers — check-spec, check-loop-record, check-plan-lessons, check-plan-spec-agree,
// check-ship-briefing, render-ship-briefing — with NOTHING ranging over that set. A UTF-8 BOM
// (`EF BB BF`) sits before the `---`, defeats the `^---` anchor, and every one of the six REDs a
// byte-valid file with "no YAML frontmatter block". Fixing it in whichever file surfaced the report
// would have left five copies broken and no test able to tell. That is lessons-learned L31 exactly: a
// deliberate copy creates an obligation set nothing enumerates, and the second copy is where the
// obligation is dropped. The remedy L29 prescribes for a set-quantified fix is to MATERIALISE the set —
// so the definition lives here once, and `frontmatter-core.test.mjs` ranges over the consumer list.
//
// The BOM matters for the same reason the CRLF fold does, and the two now live together (L25 — when the
// thing a rationale describes is repaired, re-derive rather than carry the old claim across). A Windows
// editor that writes CRLF is the same editor class that writes a BOM; `bodyHash` already folds CRLF so
// a Windows checkout cannot false-RED at the hashing step, while the BOM false-REDs one step EARLIER,
// at the anchor. Normalising both at the read is what makes the two defences complete rather than
// individually plausible.
//
// WHY IMPORTING THIS IS NOT A "SIBLING IMPORT" (P3), stated because six checkers now import it and the
// convention they each used to carry said the opposite. P3 forbids a LEAF referencing another LEAF —
// module A reaching into module B's internals — and routes anything shared through a bottom. This file
// IS such a bottom: zero behaviour beyond parsing, no dependency of its own, and it sits inside the same
// module as its consumers rather than across a tree edge. The precedent is `lessons-index-core.mjs`,
// which `check-lessons-index.mjs` and `gen-lessons-index.mjs` already import for exactly this reason.
// The five stale comments that justified re-implementing `FM_RE` in-file ("re-implemented IN-FILE, no
// sibling import, P3") were removed with the duplication they described — a rationale outliving the
// thing it explains is worse than none, because it reads as a live constraint (lessons-learned L25).
// Other helpers those files duplicate (`readValue`, `cleanScalar`, the `yamlScalar` codec) are NOT
// affected and keep their own, still-accurate notes.
//
// WHAT THIS DOES NOT DO (P0):
//   - NOT a YAML parser. `FM_RE` captures the raw block; each consumer parses the scalars it needs.
//   - NOT a general Unicode normaliser. Exactly ONE leading `U+FEFF` is stripped, only at offset 0. A
//     BOM in the middle of a file is content, not an encoding marker, and is left alone. A doubled BOM
//     is malformed input and still REDs — stripping greedily would be inventing a file the author did
//     not write.
//   - NOT a masking layer. A genuinely frontmatter-less file still fails the anchor. The fix removes a
//     FALSE red; it creates no path to a false GREEN.

/** The leading YAML frontmatter block. CRLF-tolerant. The single definition — do not re-declare it. */
export const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

// Written as the `\uFEFF` escape, never the literal character: a literal BOM here would itself be
// invisible in every editor and diff, and eslint's no-irregular-whitespace rejects it outright.
/** U+FEFF as a leading byte-order mark. Anchored, single occurrence, offset 0 only. */
const BOM_RE = /^\uFEFF/;

/**
 * Strip a single leading UTF-8 BOM, if present. Idempotent on already-clean text.
 * Call this on file text BEFORE applying `FM_RE` — that ordering is the whole point.
 */
export function stripBom(text) {
  return typeof text === "string" ? text.replace(BOM_RE, "") : text;
}

/**
 * Match the leading frontmatter block after normalising the input.
 * Returns the `FM_RE` match array, or `null` when there is genuinely no frontmatter.
 * Consumers should use this rather than applying `FM_RE` themselves, so the BOM strip cannot be
 * forgotten at a new call site.
 */
export function matchFrontmatter(text) {
  return stripBom(text).match(FM_RE);
}
