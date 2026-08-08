#!/usr/bin/env node
// pharn/floor/validate.mjs — the deterministic floor for PHARN.
//
// This is the only GUARANTEED part of this repo's build loop (CONSTITUTION P0).
// It is non-LLM, dependency-free (Node stdlib only), and exits non-zero on any RED finding.
//
// It checks structural invariants of the PHARN repo being BUILT:
//   1. capability frontmatter present + required fields           (ARCHITECTURE §3.1)
//   2. every capability has non-empty evals/cases + evals/expected (P1)
//   3. every `enforces` rule_id is produced by >=1 eval case        (P1, fix #6)
//   4. `coupling` is a valid enum value where present               (enum check, §3.2)
//   4b. `applies` is present AND every value is an archetype-enum member  (required + enum, §5)
//   5. finding templates separate enum-gated from free-text fields  (fix #1, best-effort)
//   6. no forbidden sibling reference                               (P3, best-effort)
//   7. archetype maps agree, if an archetype-maps manifest exists   (fix #5, conditional)
//   8. the capability canon names a relocated floor checker at its LIVE path (P6, enum/regex)
//
// Usage:  node pharn/floor/validate.mjs [targetDir]      (default: cwd)
// Honest scope: checks 5 and 6 are BEST-EFFORT — markdown has no import statement to lint, so they
// reduce a class of mistakes, they do not eliminate it (see ARCHITECTURE §4 caveat, LIMITS).
//
// It deliberately does NOT validate this repo's own tooling (.claude/commands, .dev/) — those
// are advisory orchestration, not built PHARN capabilities. Point this at the PHARN repo.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const TARGET = process.argv[2] || ".";
const COUPLING_ENUM = ["agnostic", "framework-seam", "framework-specific"];
const ROLE_ENUM = ["skill", "lens", "validator", "verifier", "griller", "auditor"];
const KIND_ENUM = ["pharn-owned", "vendor-official", "community"];
// `applies` = which archetypes a capability is scoped to. Reuses ARCHITECTURE §5's archetype enum
// {ssr, backend, spa, lib} verbatim + a `universal` wildcard meaning "all archetypes" (does NOT
// redefine the archetype enum). REQUIRED field: every capability must declare a valid `applies`
// (absent or empty → RED); each declared value must be an enum member.
const APPLIES_ENUM = ["universal", "ssr", "backend", "spa", "lib"];
// `pharn/floor` holds the deterministic checkers + their test-fixtures (incl. the deliberately-RED
// fixture) — tooling, never product capabilities — so it is excluded from the capability scan exactly
// as `.dev/` (its pre-relocation home) always was. The product surface remains pharn/pharn-*/**.
const EXCLUDE_SEGMENTS = [
  `${sep}.claude${sep}commands${sep}`,
  `${sep}.dev${sep}`,
  `${sep}pharn${sep}floor${sep}`,
  `${sep}node_modules${sep}`,
  `${sep}.git${sep}`,
];

const findings = [];
function finding(severity, rule_id, file, problem) {
  findings.push({ type: "FINDING", rule_id, severity, file, problem });
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

// --- tiny dependency-free frontmatter parser (handles the subset PHARN uses) ---
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

function isExcluded(file) {
  const norm = sep + relative(TARGET, file);
  return EXCLUDE_SEGMENTS.some((seg) => norm.includes(seg));
}

function nonEmptyDir(dir) {
  return existsSync(dir) && statSync(dir).isDirectory() && readdirSync(dir).filter((f) => !f.startsWith(".")).length > 0;
}

function capabilityDir(file) {
  // a capability file lives at <capDir>/<NAME>.md ; evals are at <capDir>/evals/
  return file.slice(0, file.lastIndexOf(sep));
}

// ---------------------------------------------------------------------------

const allMd = walk(TARGET);
const capabilities = [];

for (const file of allMd) {
  if (isExcluded(file)) continue;
  const text = readFileSync(file, "utf8");
  const { fm, body } = parseFrontmatter(text);

  // a "capability" = a role-bearing markdown file (ARCHITECTURE §3.1)
  if (fm && fm.role) {
    capabilities.push({ file, fm, body });
  }

  // CHECK 5 (best-effort): finding-template files must show the enum-gated / free-text split (fix #1)
  const hasFindingTemplate = /rule_id:/.test(text) && /problem:/.test(text);
  if (hasFindingTemplate) {
    const showsEnumGated = /enum-gated|floor-verifiable/i.test(text);
    const showsFreeText = /free[- ]text|untrusted/i.test(text);
    if (!(showsEnumGated && showsFreeText)) {
      finding(
        "blocking",
        "P0/fix#1",
        relative(TARGET, file),
        "finding template does not document the enum-gated vs free-text (untrusted) split — a guaranteed decision could rest on a tainted field"
      );
    }
  }
}

for (const cap of capabilities) {
  const rel = relative(TARGET, cap.file);
  const fm = cap.fm;

  // CHECK 1: required frontmatter fields
  for (const req of ["name", "role", "kind", "version"]) {
    if (!fm[req]) finding("blocking", "P1/ARCH§3.1", rel, `missing required frontmatter field: ${req}`);
  }
  if (fm.role && !ROLE_ENUM.includes(fm.role)) finding("blocking", "ARCH§3.1", rel, `role not in enum: ${fm.role}`);
  if (fm.kind && !KIND_ENUM.includes(fm.kind)) finding("blocking", "ARCH§3.1", rel, `kind not in enum: ${fm.kind}`);
  if (fm.seal && fm.kind !== "pharn-owned") finding("blocking", "ARCH§3.1", rel, "seal present on a non-pharn-owned capability");

  // CHECK 4: coupling enum (only when present)
  if (fm.coupling && !COUPLING_ENUM.includes(fm.coupling)) {
    finding("blocking", "ARCH§3.2", rel, `coupling not in enum: ${fm.coupling}`);
  }

  // CHECK 4b: applies REQUIRED + enum — archetype scoping (ARCH §5 enum + `universal` wildcard)
  const applies = Array.isArray(fm.applies) ? fm.applies : fm.applies ? [fm.applies] : [];
  if (applies.length === 0) {
    finding("blocking", "ARCH§5/applies", rel, "missing required frontmatter field: applies");
  }
  for (const a of applies) {
    if (!APPLIES_ENUM.includes(a)) {
      finding("blocking", "ARCH§5/applies", rel, `applies value not in enum: ${a}`);
    }
  }

  // CHECK 2: evals present
  const evalsDir = join(capabilityDir(cap.file), "evals");
  const casesDir = join(evalsDir, "cases");
  const expectedDir = join(evalsDir, "expected");
  const hasCases = nonEmptyDir(casesDir);
  const hasExpected = nonEmptyDir(expectedDir);
  if (!hasCases || !hasExpected) {
    finding(
      "blocking",
      "P1",
      rel,
      `capability has no evals (need non-empty evals/cases + evals/expected) [cases:${hasCases} expected:${hasExpected}]`
    );
  }

  // CHECK 3: every enforces rule_id is produced by >=1 eval case (fix #6)
  const enforces = Array.isArray(fm.enforces) ? fm.enforces : fm.enforces ? [fm.enforces] : [];
  if (enforces.length && hasExpected) {
    const expectedText = readdirSync(expectedDir)
      .map((f) => {
        try {
          return readFileSync(join(expectedDir, f), "utf8");
        } catch {
          return "";
        }
      })
      .join("\n");
    for (const id of enforces) {
      // a rule_id is "produced" if it appears in any expected fixture (id is file-qualified or bare)
      const bare = String(id).split(/\s+/).pop(); // "security.md SEC-1" -> "SEC-1"
      if (!expectedText.includes(id) && !expectedText.includes(bare)) {
        finding("blocking", "P1/fix#6", rel, `enforces rule_id "${id}" has no eval case that produces it`);
      }
    }
  } else if (enforces.length && !hasExpected) {
    finding("blocking", "P1/fix#6", rel, `declares enforces ${JSON.stringify(enforces)} but has no expected fixtures to bind them`);
  }

  // CHECK 6 (best-effort): no sibling reference (P3)
  // a reads: path pointing into a DIFFERENT pharn-stack-* / pharn-skills-* module is a sibling ref,
  // unless this capability lives in pharn-contracts or pharn-core (allowed to be depended on).
  const ownModule = (rel.split(sep).find((s) => s.startsWith("pharn-")) || "").trim();
  const reads = Array.isArray(fm.reads) ? fm.reads : fm.reads ? [fm.reads] : [];
  if (ownModule && ownModule !== "pharn-contracts" && ownModule !== "pharn-core") {
    for (const r of reads) {
      const m = String(r).match(/(pharn-(?:stack|skills)-[A-Za-z0-9-]+)/);
      if (m && m[1] !== ownModule) {
        finding(
          "blocking",
          "P3",
          rel,
          `sibling reference in reads: "${r}" points at module ${m[1]} — route shared things through pharn-contracts`
        );
      }
    }
  }
}

// CHECK 7 (conditional): archetype maps agree, if a manifest declares them (fix #5)
const archManifest = join(TARGET, "pharn", "pharn-contracts", "archetype-maps.json");
if (existsSync(archManifest)) {
  try {
    const maps = JSON.parse(readFileSync(archManifest, "utf8"));
    const mapNames = ["constitution", "phases", "grillers", "planSections"];
    const present = mapNames.filter((k) => maps[k]);
    if (present.length) {
      const archetypeSets = present.map((k) => new Set(Object.keys(maps[k])));
      const union = new Set(archetypeSets.flatMap((s) => [...s]));
      for (const k of present) {
        for (const a of union) {
          if (!maps[k][a])
            finding(
              "blocking",
              "fix#5",
              "pharn/pharn-contracts/archetype-maps.json",
              `archetype "${a}" missing from map "${k}" — the four archetype maps disagree`
            );
        }
      }
    }
  } catch (e) {
    finding("blocking", "fix#5", "pharn/pharn-contracts/archetype-maps.json", `archetype-maps.json is unparseable: ${e.message}`);
  }
}

// ---------------------------------------------------------------------------
// CHECK 8: the capability canon must name a relocated floor checker at its LIVE path (P6).
//
// When the checkers moved .dev/floor/ -> pharn/floor/, CHANGELOG 1.1.2 rewrote their own line-2
// self-headers but not the capability bodies that INVOKE them, so a lens's Layer-1 sub-check still
// named the old directory and ENOENTed — the strongest deterministic sub-check silently degrading to
// judgment, with the audit record citing a command that errored. That hand-fix was a discipline-only
// remedy and the canon rotted anyway; per .dev/memory-bank/lessons-learned.md L20 the second
// occurrence is the trigger to give the class a deterministic check rather than another reminder.
//
// RULE: a literal `.dev/floor/<B>` is RED iff <TARGET>/pharn/floor/<B> is a real file — i.e. the cite
// names a file that MOVED. The existence gate means it structurally cannot flag:
//   - the five scan-plan-* grill-scanners still resident ONLY in .dev/floor/ (no twin). That is a
//     real and separate defect — they are dead in every install, which ships pharn/ without .dev/ —
//     but it is fixed by RELOCATING the file, not by rewriting the cite. Pinned by a test.
//   - scan-plan-{a11y,comprehension,docs,error-handling,performance}.mjs, named in griller prose as
//     scanners that are NOT built (resident nowhere).
//
// SCOPE: the capability canon only — every pharn/pharn-* module, DISCOVERED FROM THE TARGET at run
// time rather than fixed in a list, so a module added later (pharn-audits, pharn-stack-<fw>, …) is
// covered the day it lands instead of being a silent blind spot in the very check meant to stop
// floor-rot. The `pharn-` prefix IS the exclusion, and it is the same predicate the writes-scope
// guard already partitions on (.claude/hooks/enforce-writes-scope.cjs DEFAULT_SAFE_SET):
//   - NOT pharn/floor (no `pharn-` prefix): it holds the INTENTIONAL dev-references (the cross-copy
//     agreement pin's home, and the "deliberately does NOT import the packaged-away copy" notes) plus
//     the deliberately-RED fixtures. Inside pharn/floor an intentional dev-ref and a stale ref are
//     byte-indistinguishable.
//   - NOT the trusted pharn/*.md docs: they are files, not pharn-* module dirs — and human-only,
//     hook-governed, a different governance class.
//   - NOT .dev/: the apparatus references .dev/floor/ by design.
//   - NOT the root docs: CLAUDE.md, CHANGELOG.md and docs/lessons-index.md correctly cite the DEV
//     copy of a deliberate copy-pair (check-provenance, check-lessons-index, gen-lessons-index,
//     lessons-index-core all exist in BOTH floors on purpose), so a TARGET-wide walk would report 31
//     correct sentences as drift. Canon cites zero copy-pair files, which is what makes it safe.
// EXCLUDE_SEGMENTS is applied on top as defence-in-depth.
//
// Honest bound (P0): a genuinely stale ref that later appears inside pharn/floor is NOT caught here —
// that surface stays a manual concern. And this proves only that the cited file EXISTS; it never runs
// it, checks its arguments, or knows the body invokes it correctly. It is also GREEN when the target
// has no pharn/floor at all (no twin anywhere), and silently empty-scoped when the target has no
// pharn/ at all — both correct, both fail-open paths, named.

// Discovered, not fixed. Mirrors walkExts's two guards below: a missing <TARGET>/pharn and a per-entry
// stat failure (a broken symlink) each degrade to a skip, never a crash of the validator. .sort() is
// load-bearing, not cosmetic — findings are emitted in loop order and readdirSync's order is
// filesystem-dependent, so an unsorted scope would make one tree report in different orders on
// different machines. Sorted, it is byte-identical in behavior to the four-name list it replaces.
function canonDirs() {
  let entries;
  try {
    entries = readdirSync(join(TARGET, "pharn"));
  } catch {
    return [];
  }
  const dirs = [];
  for (const name of entries) {
    if (!/^pharn-/.test(name)) continue;
    let st;
    try {
      st = statSync(join(TARGET, "pharn", name));
    } catch {
      continue;
    }
    if (st.isDirectory()) dirs.push(name);
  }
  return dirs.sort();
}
const CANON_DIRS = canonDirs();
const FLOOR_REF_RE = /\.dev\/floor\/([A-Za-z0-9._-]+\.(?:mjs|cjs))/g;

// validate's capability walk (above) is .md-only; the eval judges are .json, so collect both here.
function walkExts(dir, exts, acc = []) {
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
    if (st.isDirectory()) walkExts(p, exts, acc);
    else if (exts.some((e) => name.endsWith(e))) acc.push(p);
  }
  return acc;
}

for (const d of CANON_DIRS) {
  for (const file of walkExts(join(TARGET, "pharn", d), [".md", ".json"])) {
    if (isExcluded(file)) continue;
    const rel = relative(TARGET, file);
    const seen = new Set(); // one finding per stale checker per file, not one per occurrence
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const m of text.matchAll(FLOOR_REF_RE)) {
      const base = m[1];
      if (seen.has(base)) continue;
      // The gate: a twin in pharn/floor means the file MOVED and this cite is stale. No twin means
      // there is nothing to point at, so the cite is left alone.
      if (!existsSync(join(TARGET, "pharn", "floor", base))) continue;
      seen.add(base);
      finding(
        "blocking",
        "P6/floor-path",
        rel,
        `cites .dev/floor/${base}, but that checker now lives at pharn/floor/${base} — the cited path does not resolve, so the command ENOENTs and its deterministic check silently degrades`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Report — findings in the canonical shape (ARCHITECTURE §8)
const blocking = findings.filter((f) => f.severity === "blocking");
if (findings.length === 0) {
  console.log(`FLOOR: GREEN — ${capabilities.length} capabilities checked in ${TARGET}`);
  process.exit(0);
}
console.log(
  `FLOOR: ${blocking.length ? "RED" : "GREEN-with-warnings"} — ${findings.length} finding(s), ${capabilities.length} capabilities checked\n`
);
for (const f of findings) {
  console.log(`- [${f.severity}] ${f.rule_id}  ${f.file}`);
  console.log(`    ${f.problem}`);
}
process.exit(blocking.length ? 1 : 0);
