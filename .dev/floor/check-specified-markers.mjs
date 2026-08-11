#!/usr/bin/env node
// .dev/floor/check-specified-markers.mjs — bind PHARN's "specified; ships with the guarded surface"
// annotations to reality, in BOTH drift directions.
//
// Build apparatus, NOT product surface: it guards PHARN's OWN governing docs, and a user's install has
// no reason to check PHARN's annotations. It is not a Capability (no `role:`), ships to nobody, and
// drives no SKILLS_VERSION bump. The dependency may only point .dev/ -> pharn/, never the reverse.
//
// Floor primitive (ARCHITECTURE §2): #3 (enum / regex — here, set membership by file EXISTENCE and by
// exact SUBSTRING presence). No LLM, no classification, no heuristics, no network, no child_process.
//
// WHY IT EXISTS (P7 — a real failure, not a hypothetical). The four trusted docs asserted, in the
// present tense, floor primitives that do not exist as running checks: a `pre-egress` hook (no
// .claude/hooks/*egress* file), the fix #5 archetype-maps agreement (validate.mjs CHECK 7 is
// CONDITIONAL and no manifest exists, so it has never fired), and `/pharn-estimate` (no such command).
// THREAT-MODEL.md even carried `_Closed._` on fix #5. That is the P0 disease — "written in the contract"
// mistaken for "therefore guaranteed" — reproduced inside the documents that DEFINE it, and NOTHING
// DETECTED IT: the three trusted docs are in .prettierignore AND excluded by name in
// .markdownlint-cli2.jsonc, and no floor checker reads their prose. The `trusted-doc-accuracy` (F7)
// increment corrected the sites by hand. This checker exists because that correction's only remaining
// remedy was "remember to update the docs", which is exactly the remedy-class
// .dev/memory-bank/lessons-learned.md L20 says WILL recur — the second occurrence being the trigger to
// give the class a floor check rather than another reminder.
//
// THE TWO DIRECTIONS IT CLOSES.
//   1. THE PRIMITIVE SHIPS, THE MARKERS REMAIN.  Someone builds the pre-egress hook. The docs still say
//      "specified; ships with the guarded surface", now UNDERSTATING a live protection. RED, naming
//      every site to update. This is the load-bearing direction: it fires exactly when the repo gets
//      BETTER, which is precisely when nobody is looking for a doc bug.
//   2. A MARKER IS DELETED, THE PRIMITIVE IS STILL ABSENT.  The doc silently returns to overclaiming —
//      the original F7 defect. RED, naming the file and the missing marker.
//
// WHY A STRUCTURED MANIFEST (lessons-learned L6). Membership is read from specified-primitives.json —
// never by scanning doc prose for what LOOKS like a marker. L6's defect (a membership fact grepped out
// of free text, so documentation ABOUT a declaration counts as a declaration) recurred inside F7's own
// REVIEW.md while correcting an unrelated error: a substring search for finding objects counted the
// remediation note that quoted the search pattern, inflating 6 findings to 7. A prose-scanning version
// of THIS checker would have the identical bug — a CHANGELOG sentence quoting a marker would register
// as a doc site. So the sites are enumerated, not discovered.
//
// HONEST SCOPE (P0) — what this does NOT guarantee, stated because it is not obvious.
//   * IT CANNOT DISCOVER A NEW OVERCLAIM. The manifest is a hand-maintained address book. A doc that
//     starts asserting some OTHER non-existent primitive tomorrow is invisible here until a human adds
//     the entry. "The manifest checked out" NEVER means "the docs are true" — the same bound the
//     lessons index carries, and the reason this file is not called check-doc-accuracy.
//   * THE PROBE TESTS EXISTENCE, NOT FUNCTION. `dir-contains` asks whether a file whose NAME contains a
//     substring is present; `path` asks whether a path exists. Neither asks whether a hook is WIRED in
//     .claude/settings.json, whether it is invoked, or whether it works. A stub named pre-egress.cjs
//     flips the probe to "live" and REDs direction 1 — deliberately: a loud early signal beats a silent
//     one, and the remedy (check the doc, then the wiring) is the right next action either way.
//   * SUBSTRING PRESENCE IS NOT SENTENCE COHERENCE. Direction 2 proves the marker bytes are still in the
//     file. It says nothing about whether the surrounding sentence still makes sense, sits in the same
//     section, or has been reduced to a quotation inside an unrelated paragraph.
//   * IT IS APPARATUS. Nothing on the floor forces `npm run check` to run it; that wiring is a
//     convention this file cannot enforce about itself.
//
// TRUST (P2): the manifest is a trusted, human-reviewed apparatus file and the docs it reads are
// trusted. No untrusted input is ingested; no free text steers a branch. Doc bytes are opaque DATA —
// read, compared by `String.prototype.includes`, never parsed, interpreted, or executed.
//
// Usage:  node .dev/floor/check-specified-markers.mjs [targetDir] [--manifest <path>]
//         targetDir defaults to cwd; --manifest defaults to the sibling specified-primitives.json and
//         exists so the test suite can drive fixture manifests (an authored fixture passes by
//         construction — L4 — so the RED paths must be reachable, not merely asserted).
// Exit:   0 GREEN | 1 RED (a drifted annotation) | 2 the manifest itself is unusable (fail-closed)

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const mIdx = argv.indexOf("--manifest");
const MANIFEST = mIdx !== -1 && argv[mIdx + 1] ? resolve(argv[mIdx + 1]) : join(HERE, "specified-primitives.json");
const positional = argv.filter((a, i) => !a.startsWith("--") && i !== mIdx + 1);
const TARGET = resolve(positional[0] ?? process.cwd());

const reds = [];
const red = (msg) => reds.push(msg);

// --- Load the manifest. Any defect here is exit 2, never a silent pass: a checker that cannot read its
// --- own membership set has no verdict to give, and reporting GREEN would be the worst outcome.
let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
} catch (e) {
  console.error(`RED (manifest unusable): cannot read/parse ${MANIFEST} — ${e.message}`);
  process.exit(2);
}
const primitives = manifest.specified_primitives;
const named = manifest.named_artifacts ?? [];
if (!Array.isArray(primitives)) {
  console.error(`RED (manifest unusable): ${MANIFEST} has no \`specified_primitives\` array`);
  process.exit(2);
}

/**
 * Is the primitive LIVE? A pure existence test (ARCHITECTURE §2 primitive #3).
 * Unknown probe type => throw, so a typo in the manifest fails CLOSED (exit 2) rather than
 * silently reporting "not live" and passing every marker check.
 */
function isLive(probe, id) {
  if (!probe || typeof probe !== "object") throw new Error(`primitive ${id}: missing probe`);
  if (probe.type === "path") {
    if (typeof probe.path !== "string") throw new Error(`primitive ${id}: probe.path must be a string`);
    return existsSync(join(TARGET, probe.path));
  }
  if (probe.type === "dir-contains") {
    if (typeof probe.dir !== "string" || typeof probe.substring !== "string") {
      throw new Error(`primitive ${id}: dir-contains needs string \`dir\` and \`substring\``);
    }
    const dir = join(TARGET, probe.dir);
    let entries;
    try {
      if (!statSync(dir).isDirectory()) return false;
      entries = readdirSync(dir);
    } catch {
      // The directory itself is absent/unreadable => nothing in it => the primitive is not live.
      return false;
    }
    return entries.some((e) => e.includes(probe.substring));
  }
  throw new Error(`primitive ${id}: unknown probe type ${JSON.stringify(probe.type)}`);
}

function validatePrimitive(p) {
  if (!p || typeof p !== "object") throw new Error("primitive record must be an object");
  if (typeof p.id !== "string") throw new Error("primitive record lacks string `id`");
  if (!Array.isArray(p.sites)) throw new Error(`primitive ${p.id}: \`sites\` must be an array`);
  for (const site of p.sites) {
    if (!site || typeof site !== "object") {
      throw new Error(`primitive ${p.id}: each site must be an object`);
    }
    if (typeof site.file !== "string" || typeof site.marker !== "string") {
      throw new Error(`primitive ${p.id}: each site needs string \`file\` and \`marker\` fields`);
    }
  }
}

function validateNamedArtifact(a) {
  if (!a || typeof a !== "object") throw new Error("named-artifact record must be an object");
  if (typeof a.id !== "string") throw new Error("named-artifact record lacks string `id`");
  if (typeof a.cited_in !== "string") {
    throw new Error(`named-artifact ${a.id}: \`cited_in\` must be a string`);
  }
  if (typeof a.citation !== "string") {
    throw new Error(`named-artifact ${a.id}: \`citation\` must be a string`);
  }
  if (typeof a.must_exist !== "string") {
    throw new Error(`named-artifact ${a.id}: \`must_exist\` must be a string`);
  }
  if (a.forbidden !== undefined) {
    if (!Array.isArray(a.forbidden)) {
      throw new Error(`named-artifact ${a.id}: \`forbidden\` must be an array`);
    }
    for (const entry of a.forbidden) {
      if (typeof entry !== "string") {
        throw new Error(`named-artifact ${a.id}: each \`forbidden\` entry must be a string`);
      }
    }
  }
}

const fileCache = new Map();
function readDoc(rel) {
  if (!fileCache.has(rel)) {
    try {
      fileCache.set(rel, readFileSync(join(TARGET, rel), "utf8"));
    } catch {
      fileCache.set(rel, null);
    }
  }
  return fileCache.get(rel);
}

let siteCount = 0;
let liveCount = 0;

try {
  for (const p of primitives) {
    validatePrimitive(p);
    const live = isLive(p.probe, p.id);
    if (live) liveCount++;
    for (const site of p.sites) {
      siteCount++;
      const src = readDoc(site.file);
      if (src === null) {
        red(`${site.file}: listed as a site for \`${p.id}\` but the file could not be read`);
        continue;
      }
      const present = src.includes(site.marker);
      if (live && present) {
        // DIRECTION 1 — the repo got better and the docs did not follow.
        red(
          `${site.file}: \`${p.id}\` IS NOW LIVE (${describe(p.probe)}), but the doc still annotates it ` +
            `as not-yet-live. REMOVE the marker — the doc now UNDERSTATES a real protection.\n` +
            `    marker: ${JSON.stringify(site.marker)}`
        );
      } else if (!live && !present) {
        // DIRECTION 2 — the annotation was removed while the primitive is still absent.
        red(
          `${site.file}: the \`${p.id}\` annotation is GONE, but the primitive is still absent ` +
            `(${describe(p.probe)}). The doc has returned to asserting a protection the repo does not have.\n` +
            `    expected: ${JSON.stringify(site.marker)}`
        );
      }
    }
  }

  for (const a of named) {
    validateNamedArtifact(a);
    const src = readDoc(a.cited_in);
    if (src === null) {
      red(`${a.cited_in}: named-artifact citation for \`${a.id}\` — the file could not be read`);
      continue;
    }
    if (!src.includes(a.citation)) {
      red(`${a.cited_in}: no longer cites \`${a.id}\` as ${JSON.stringify(a.citation)} — the name drifted`);
    }
    if (a.forbidden) {
      for (const forbidden of a.forbidden) {
        if (src.includes(forbidden)) {
          red(`${a.cited_in}: still cites \`${a.id}\` by the obsolete name ${JSON.stringify(forbidden)} — ` + "remove the legacy citation");
        }
      }
    }
    if (!existsSync(join(TARGET, a.must_exist))) {
      red(`${a.cited_in} cites \`${a.id}\`, but ${a.must_exist} does not exist — the doc names a missing artifact`);
    }
  }
} catch (e) {
  console.error(`RED (manifest unusable): ${e.message}`);
  process.exit(2);
}

function describe(probe) {
  return probe.type === "path" ? `${probe.path} exists` : `${probe.dir}/*${probe.substring}*`;
}

if (reds.length) {
  console.error(`SPECIFIED-MARKERS: RED — ${reds.length} drifted annotation(s)\n`);
  for (const r of reds) console.error(`  - ${r}`);
  console.error(
    `\nManifest: ${MANIFEST}\n` + `This checks only the annotations that manifest LISTS. It cannot discover a new overclaim (P0).`
  );
  process.exit(1);
}

console.log(
  `SPECIFIED-MARKERS: GREEN — ${siteCount} annotation(s) across ${primitives.length} specified primitive(s) ` +
    `(${liveCount} now live), ${named.length} named artifact(s) checked in ${TARGET}.\n` +
    `NOTE (P0): this proves the LISTED annotations still match reality. It never means the docs are accurate — ` +
    `an overclaim not in the manifest is invisible here.`
);
