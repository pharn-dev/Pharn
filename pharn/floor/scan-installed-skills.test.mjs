// pharn/floor/scan-installed-skills.test.mjs — hermetic tests for the user-installed-skill enumerator.
//
// NO `claude -p`, NO git, NO network. Each test builds a small repo in an os.tmpdir() scratch dir and
// asserts the public surface (exit code + stdout JSON) by subprocess — mirroring count-grillers.test.mjs.
//
// SCOPE HONESTY (from the grill): these tests prove DISCOVERY — that the enumerator lists exactly the
// installed SKILL.md files (or none). They do NOT — and cannot — prove that a STAGE "surfaces/uses" a
// skill; that incorporation is advisory model work with no deterministic surface. A green suite means the
// FLOOR half (enumeration) holds, never that the stages respect the skills.
//
// The ★ tests are load-bearing:
//   • the SPEC's two cases: one installed skill → count 1 + its path; NO `.claude/skills/` → count 0,
//     exit 0 ("no skills → unchanged", fail-SAFE, NOT an error);
//   • hygiene: exactly one level (a nested `.claude/skills/a/b/SKILL.md` does not register `b`); a dir
//     without a SKILL.md does not register; a SYMLINKED skill dir / SKILL.md is skipped (no tree escape);
//     a dir NAME with quotes/newlines is emitted safely (JSON.stringify escapes it);
//   • fail-CLOSED only on a bad TARGET repo: a nonexistent target dir → nonzero exit, no stdout.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const SS = join(here, "scan-installed-skills.mjs");

function run(targetDir) {
  return spawnSync(process.execPath, [SS, targetDir], { encoding: "utf8" });
}
function json(r) {
  return JSON.parse(r.stdout);
}
// Build a hermetic repo of { "rel/path": "contents" } in a scratch dir, run the helper, clean up. A
// trailing-slash key with empty body creates an empty directory (for the no-SKILL.md case).
function withRepo(files, fn) {
  const root = mkdtempSync(join(tmpdir(), "pharn-scanskills-"));
  try {
    for (const [rel, body] of Object.entries(files)) {
      if (rel.endsWith("/")) {
        mkdirSync(join(root, rel), { recursive: true });
        continue;
      }
      const p = join(root, rel);
      mkdirSync(dirname(p), { recursive: true });
      writeFileSync(p, body);
    }
    return fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// --- tests ----------------------------------------------------------------------------------------

test("★ SPEC case A: one installed skill → count 1 + its repo-relative path", () => {
  withRepo({ ".claude/skills/supabase/SKILL.md": "# Supabase skill\nUse RLS.\n" }, (root) => {
    const r = run(root);
    assert.equal(r.status, 0);
    assert.deepEqual(json(r), {
      count: 1,
      skills: [{ name: "supabase", path: ".claude/skills/supabase/SKILL.md" }],
    });
  });
});

test("★ SPEC case B: NO .claude/skills/ → count 0, exit 0 (fail-SAFE, 'no skills → unchanged')", () => {
  withRepo({ "README.md": "# a repo with no skills\n" }, (root) => {
    const r = run(root);
    assert.equal(r.status, 0);
    assert.deepEqual(json(r), { count: 0, skills: [] });
  });
});

test("multiple skills → sorted by name, each with its path", () => {
  withRepo(
    {
      ".claude/skills/zeta/SKILL.md": "# z\n",
      ".claude/skills/alpha/SKILL.md": "# a\n",
      ".claude/skills/mid/SKILL.md": "# m\n",
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 0);
      assert.deepEqual(json(r), {
        count: 3,
        skills: [
          { name: "alpha", path: ".claude/skills/alpha/SKILL.md" },
          { name: "mid", path: ".claude/skills/mid/SKILL.md" },
          { name: "zeta", path: ".claude/skills/zeta/SKILL.md" },
        ],
      });
    }
  );
});

test("★ HYGIENE: a skill dir with NO SKILL.md does not register", () => {
  withRepo(
    {
      ".claude/skills/real/SKILL.md": "# real\n",
      ".claude/skills/empty/": "", // directory, no SKILL.md
      ".claude/skills/other/README.md": "# not a SKILL.md\n",
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 0);
      assert.deepEqual(json(r), { count: 1, skills: [{ name: "real", path: ".claude/skills/real/SKILL.md" }] });
    }
  );
});

test("★ HYGIENE: exactly one level — a NESTED SKILL.md does not register the nested dir", () => {
  withRepo(
    {
      ".claude/skills/top/SKILL.md": "# top\n",
      ".claude/skills/top/nested/SKILL.md": "# nested — must be ignored\n",
    },
    (root) => {
      const r = run(root);
      assert.equal(r.status, 0);
      // only `top` registers; `nested` is one level too deep.
      assert.deepEqual(json(r), { count: 1, skills: [{ name: "top", path: ".claude/skills/top/SKILL.md" }] });
    }
  );
});

test("★ HYGIENE: a SYMLINKED skill dir is skipped (no tree escape)", () => {
  withRepo(
    {
      ".claude/skills/real/SKILL.md": "# real\n",
      "outside/evil/SKILL.md": "# outside the skills tree\n",
    },
    (root) => {
      // symlink .claude/skills/link -> ../../outside/evil (a skill dir reachable only via the link)
      symlinkSync(join(root, "outside", "evil"), join(root, ".claude", "skills", "link"), "dir");
      const r = run(root);
      assert.equal(r.status, 0);
      // the symlinked `link` is skipped; only the real dir registers.
      assert.deepEqual(json(r), { count: 1, skills: [{ name: "real", path: ".claude/skills/real/SKILL.md" }] });
    }
  );
});

test("★ HYGIENE: a symlinked SKILL.md inside a real dir is skipped (not a real file)", () => {
  withRepo(
    {
      "outside/target.md": "# link target\n",
      ".claude/skills/linky/": "", // real dir, SKILL.md will be a symlink
    },
    (root) => {
      symlinkSync(join(root, "outside", "target.md"), join(root, ".claude", "skills", "linky", "SKILL.md"), "file");
      const r = run(root);
      assert.equal(r.status, 0);
      // linky's SKILL.md is a symlink → not a real file → linky does not register.
      assert.deepEqual(json(r), { count: 0, skills: [] });
    }
  );
});

test("a dir NAME with a quote/newline is emitted safely (JSON.stringify escapes it)", () => {
  const weird = 'we"ird\nname';
  withRepo({ [`.claude/skills/${weird}/SKILL.md`]: "# weird\n" }, (root) => {
    const r = run(root);
    assert.equal(r.status, 0);
    // output must be valid JSON (no corruption) and round-trip the exact name.
    const parsed = json(r);
    assert.equal(parsed.count, 1);
    assert.equal(parsed.skills[0].name, weird);
    assert.equal(parsed.skills[0].path, `.claude/skills/${weird}/SKILL.md`);
  });
});

test("an EMPTY .claude/skills/ directory (present but no entries) → count 0, exit 0", () => {
  withRepo({ ".claude/skills/": "" }, (root) => {
    const r = run(root);
    assert.equal(r.status, 0);
    assert.deepEqual(json(r), { count: 0, skills: [] });
  });
});

test("★ FAIL-CLOSED on a bad TARGET: a nonexistent target dir → nonzero exit, no stdout (P5)", () => {
  withRepo({}, (root) => {
    const r = run(join(root, "does-not-exist"));
    assert.notEqual(r.status, 0);
    assert.equal(r.stdout.trim(), "");
  });
});
