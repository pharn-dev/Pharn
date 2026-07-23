#!/usr/bin/env node
// .dev/floor/capability-catalog-core.mjs — the SHARED, deterministic core for the capability catalog.
//
// Single source of truth imported by BOTH the generator (gen-capability-catalog.mjs) and the drift
// checker (check-capability-catalog.mjs), so "recompute" (checker) is byte-identical to "generate"
// (generator) BY CONSTRUCTION — the byte-equality guard would be meaningless if the two sides rendered
// via different code (P3: route the shared thing through one module; do not duplicate).
//
// It is build APPARATUS, not a PHARN capability: it declares no `role:` frontmatter, ships no evals, and
// lives under `.dev/floor/` (excluded from validate.mjs's product scan). It CONSUMES the frontmatter
// shape that pharn/floor/validate.mjs enforces (ARCHITECTURE §3.1) — it renders only fields that script
// recognizes and enumerates by the SAME `role:` membership test (cite, don't restate — P4).
//
// Deterministic (P5): enumeration = walk + frontmatter `role` membership (no LLM); ordering = fixed role
// order then slug ascending (a total order, independent of readdir order); rendering = a pure function of
// (frontmatter, source H1 tagline); NO timestamps anywhere → running twice yields byte-identical output.
// A duplicate page slug is a thrown Error (fail-closed), never a silent overwrite.
//
// Non-LLM, stdlib-only.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep, basename, dirname } from "node:path";
import { posix } from "node:path";

// The catalog output directory (repo-relative, POSIX). One page per capability + a README index.
export const OUT_DIR = "docs/capabilities";

// Fixed presentation order + labels for every `role` enum member (ARCHITECTURE §3.1 role enum). A total
// order over roles makes the index deterministic regardless of filesystem walk order.
export const ROLE_ORDER = ["griller", "lens", "skill", "validator", "verifier", "auditor"];
export const ROLE_HEADING = {
  griller: "Grillers",
  lens: "Lenses",
  skill: "Skills",
  validator: "Validators",
  verifier: "Verifiers",
  auditor: "Auditors",
};
// "what it <verb>" per role — the section that surfaces the source's own H1 tagline as DATA.
export const ROLE_VERB = {
  griller: "asks",
  lens: "flags",
  skill: "does",
  validator: "validates",
  verifier: "verifies",
  auditor: "audits",
};

// Same capability surface as validate.mjs / count-grillers.mjs: tooling + noise are NOT capabilities.
// `docs` is additionally excluded so a generated page (which carries no `role:` anyway) can never be
// re-ingested as a source — defensive, changes the capability set by nothing.
const EXCLUDE_SEGMENTS = [
  `${sep}.claude${sep}commands${sep}`,
  `${sep}.dev${sep}`,
  `${sep}pharn${sep}floor${sep}`,
  `${sep}node_modules${sep}`,
  `${sep}.git${sep}`,
  `${sep}docs${sep}`,
];

// --- tiny dependency-free frontmatter parser (mirrors validate.mjs `parseFrontmatter`) ---
function parseFrontmatter(text) {
  if (!text.startsWith("---")) return { fm: null, body: text };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { fm: null, body: text };
  const raw = text.slice(3, end).trim();
  const body = text.slice(end + 4);
  const fm = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      val = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      val = val.replace(/^["']|["']$/g, "");
    }
    fm[key] = val;
  }
  return { fm, body };
}

function walk(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    const p = join(dir, name);
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

function isExcluded(targetDir, file) {
  const norm = sep + relative(targetDir, file);
  return EXCLUDE_SEGMENTS.some((s) => norm.includes(s));
}

function toArray(v) {
  return Array.isArray(v) ? v : v ? [v] : [];
}

// The source H1 tagline: text after "# <name> — " (em dash), or the whole H1 if there is no dash, or ""
// if the body has no H1. Rendered as DATA (P2), never interpreted.
function extractTagline(body) {
  const m = body.match(/^#\s+(.+)$/m);
  if (!m) return "";
  let t = m[1].trim();
  const dash = t.indexOf("—"); // em dash used by capability H1s: "# name — tagline"
  if (dash !== -1) t = t.slice(dash + 1).trim();
  return t;
}

// POSIX repo-relative path for a capability file (stable across OSes → stable link + slug).
function toPosixRel(targetDir, file) {
  return relative(targetDir, file).split(sep).join("/");
}

/**
 * Enumerate role-bearing capabilities under targetDir, sorted by (role order, slug ascending).
 * Returns [{ srcRel, slug, role, fm, tagline }]. Throws on a duplicate slug (fail-closed, P5).
 */
export function enumerateCapabilities(targetDir) {
  const caps = [];
  const seen = new Map();
  for (const file of walk(targetDir)) {
    if (isExcluded(targetDir, file)) continue;
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const { fm, body } = parseFrontmatter(text);
    if (!fm || !fm.role) continue; // capability = role-bearing markdown (ARCHITECTURE §3.1)
    const srcRel = toPosixRel(targetDir, file);
    const slug = basename(dirname(file));
    if (seen.has(slug)) {
      throw new Error(
        `capability-catalog: duplicate page slug "${slug}" from ${seen.get(slug)} and ${srcRel} — ` +
          `slugs (source directory names) must be unique`
      );
    }
    seen.set(slug, srcRel);
    caps.push({ srcRel, slug, role: fm.role, fm, tagline: extractTagline(body) });
  }
  caps.sort((a, b) => {
    const ra = ROLE_ORDER.indexOf(a.role);
    const rb = ROLE_ORDER.indexOf(b.role);
    if (ra !== rb) return (ra === -1 ? ROLE_ORDER.length : ra) - (rb === -1 ? ROLE_ORDER.length : rb);
    return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
  });
  return caps;
}

const GEN = ".dev/floor/gen-capability-catalog.mjs";
const REGEN = "npm run docs:generate";

/** Render one capability's page (deterministic, no timestamp). */
export function renderPage(cap) {
  const fm = cap.fm;
  const dash = "—"; // em dash placeholder for absent fields
  const name = fm.name || cap.slug;
  const applies = toArray(fm.applies).join(", ") || dash;
  const enforces = toArray(fm.enforces).join(", ") || dash;
  const coupling = fm.coupling || dash;
  const modelTier = fm.model_tier || dash;
  const version = fm.version || dash;
  const kind = fm.kind || dash;
  const verb = ROLE_VERB[cap.role] || "does";
  const link = posix.relative(OUT_DIR, cap.srcRel);
  const tagline = cap.tagline || "_(no summary line in source)_";
  return (
    `<!-- GENERATED by ${GEN} from ${cap.srcRel} ${dash} DO NOT EDIT. Regenerate: ${REGEN} -->\n` +
    `\n` +
    `# ${name}\n` +
    `\n` +
    `| Field | Value |\n` +
    `| --- | --- |\n` +
    `| Role | ${cap.role} |\n` +
    `| Kind | ${kind} |\n` +
    `| Version | ${version} |\n` +
    `| Applies | ${applies} |\n` +
    `| Coupling | ${coupling} |\n` +
    `| Enforces | ${enforces} |\n` +
    `| Model tier | ${modelTier} |\n` +
    `\n` +
    `## What it ${verb}\n` +
    `\n` +
    `${tagline}\n` +
    `\n` +
    `## Source\n` +
    `\n` +
    `[\`${cap.srcRel}\`](${link})\n` +
    `\n` +
    `_No install command yet ${dash} this repo has no PHARN CLI or install-token. Copy the source file above._\n`
  );
}

/** Render the README index: groups by role (fixed order), counts, one capability per line. */
export function renderIndex(caps) {
  let out =
    `<!-- GENERATED by ${GEN} ${"—"} DO NOT EDIT. Regenerate: ${REGEN} -->\n` +
    `\n` +
    `# Capability catalog\n` +
    `\n` +
    `${caps.length} capabilities, generated from their source \`.md\` files. Do not edit these pages by ` +
    `hand ${"—"} run \`${REGEN}\`.\n`;
  for (const role of ROLE_ORDER) {
    const group = caps.filter((c) => c.role === role);
    if (group.length === 0) continue;
    out += `\n## ${ROLE_HEADING[role]} (${group.length})\n\n`;
    for (const c of group) {
      const name = c.fm.name || c.slug;
      const tagline = c.tagline || "(no summary line in source)";
      out += `- [${name}](${c.slug}.md) ${"—"} ${tagline}\n`;
    }
  }
  return out;
}

/**
 * Build the full catalog for targetDir. Returns { capabilities, files } where `files` is a Map of
 * repo-relative path -> file content (the README index + one page per capability). Both the generator
 * and the checker call this — the ONLY renderer of catalog bytes.
 */
export function buildCatalog(targetDir) {
  const capabilities = enumerateCapabilities(targetDir);
  const files = new Map();
  files.set(`${OUT_DIR}/README.md`, renderIndex(capabilities));
  for (const cap of capabilities) {
    files.set(`${OUT_DIR}/${cap.slug}.md`, renderPage(cap));
  }
  return { capabilities, files };
}

/** List committed catalog page paths (repo-relative POSIX) actually on disk under OUT_DIR. */
export function listCommittedPages(targetDir) {
  const dir = join(targetDir, OUT_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => `${OUT_DIR}/${f}`)
    .sort();
}
