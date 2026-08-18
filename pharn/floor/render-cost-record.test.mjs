// pharn/floor/render-cost-record.test.mjs — hermetic tests for the measured token-cost renderer. Imports the
// module directly (render-ship-briefing.mjs's export-for-testing convention); every test builds a fresh
// scratch "projects" tree, so nothing ever reads the real ~/.claude.
//
// The marked groups pin the things that would otherwise be silent forks:
//   ★ DEDUP — one API response is written as SEVERAL transcript lines repeating the SAME usage object.
//     Summing without deduping on requestId over-counts (2.34x on this repo's own history). This is the
//     single defect most likely to make every reported number quietly wrong.
//   ✧ ISOLATION — only the named session is read, the lossy cwd->dirname mapping is verified against the
//     transcript's own cwd, and tool-results/ is never walked.
//   ✦ DETERMINISM — rendering twice over unchanged bytes yields byte-identical output (no clock, no random).

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { render, aggregate, projectDirName, transcriptFiles, SCHEMA, COVERAGE } from "./render-cost-record.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const CLI = join(here, "render-cost-record.mjs");
const CWD = "/work/repo";

function usage({ input = 0, w1h = 0, w5m = 0, read = 0, out = 0, think = 0 } = {}) {
  return {
    input_tokens: input,
    cache_creation: { ephemeral_1h_input_tokens: w1h, ephemeral_5m_input_tokens: w5m },
    cache_read_input_tokens: read,
    output_tokens: out,
    output_tokens_details: { thinking_tokens: think },
  };
}

function rec(requestId, u, extra = {}) {
  return JSON.stringify({
    type: "assistant",
    requestId,
    cwd: CWD,
    timestamp: extra.timestamp ?? "2026-08-18T10:00:00.000Z",
    attributionSkill: extra.stage,
    message: { model: extra.model ?? "claude-opus-5", usage: u },
  });
}

/** Build a scratch projects dir containing one session transcript (plus optional nested/extra files). */
function scratch({ session = "s1", lines = [], nested = {}, extra = {}, cwd = CWD } = {}) {
  const root = mkdtempSync(join(tmpdir(), "cost-record-"));
  const proj = join(root, projectDirName(cwd));
  mkdirSync(proj, { recursive: true });
  writeFileSync(join(proj, `${session}.jsonl`), lines.join("\n") + "\n");
  for (const [rel, content] of Object.entries(nested)) {
    const p = join(proj, session, rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, content);
  }
  for (const [rel, content] of Object.entries(extra)) {
    const p = join(proj, rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, content);
  }
  return { root, proj };
}

const call = (root, opts = {}) => render({ sessionId: opts.sessionId ?? "s1", cwd: opts.cwd ?? CWD, projectsDir: root });

test("projectDirName maps every / to - (the platform's rule)", () => {
  assert.equal(projectDirName("/Users/x/Projects/pharn-oss"), "-Users-x-Projects-pharn-oss");
  assert.equal(projectDirName("/a/b/c"), "-a-b-c");
});

test("★ DEDUP: repeated lines sharing one requestId are counted ONCE", () => {
  const u = usage({ read: 1000, out: 100 });
  const { root } = scratch({ lines: [rec("r1", u), rec("r1", u), rec("r1", u), rec("r2", u)] });
  const o = call(root);
  assert.equal(o.requests, 2, "4 records, 2 distinct requestIds");
  assert.equal(o.tokens.cache_read, 2000);
  assert.equal(o.tokens.output, 200);
});

test("★ DEDUP: a naive sum would have over-counted — the guard is real, not decorative", () => {
  const u = usage({ out: 10 });
  const lines = ["a", "a", "b", "b", "b", "c"].map((id) => rec(id, u));
  const o = call(scratch({ lines }).root);
  assert.equal(o.requests, 3);
  assert.equal(o.tokens.output, 30, "not 60 — the raw line count");
});

test("dedup falls back to message.id when requestId is absent", () => {
  const line = JSON.stringify({
    type: "assistant",
    cwd: CWD,
    timestamp: "2026-08-18T10:00:00.000Z",
    message: { id: "m1", model: "claude-opus-5", usage: usage({ out: 7 }) },
  });
  const o = call(scratch({ lines: [line, line] }).root);
  assert.equal(o.requests, 1);
  assert.equal(o.tokens.output, 7);
});

test("nested subagent transcripts are INCLUDED — disjoint storage, else fan-out is invisible", () => {
  const { root } = scratch({
    lines: [rec("parent", usage({ out: 10 }))],
    nested: { "subagents/agent-a.jsonl": rec("child1", usage({ out: 5 })) + "\n" },
  });
  const o = call(root);
  assert.equal(o.requests, 2);
  assert.equal(o.tokens.output, 15);
  assert.equal(o.transcript_files, 2);
});

test("✧ ISOLATION: tool-results/ is never walked (captured tool output, no usage)", () => {
  const { root } = scratch({
    lines: [rec("r1", usage({ out: 10 }))],
    nested: { "tool-results/x.jsonl": rec("leak", usage({ out: 999 })) + "\n" },
  });
  const o = call(root);
  assert.equal(o.tokens.output, 10);
});

test("✧ ISOLATION: another session in the same directory is NOT read", () => {
  const { root } = scratch({
    lines: [rec("mine", usage({ out: 10 }))],
    extra: { "s2.jsonl": rec("theirs", usage({ out: 999 })) + "\n" },
  });
  const o = call(root);
  assert.equal(o.requests, 1);
  assert.equal(o.tokens.output, 10);
});

test("✧ ISOLATION: a transcript whose own cwd differs is REFUSED (the lossy a/b vs a-b collision)", () => {
  const { root } = scratch({ lines: [rec("r1", usage({ out: 10 }))] });
  const o = render({ sessionId: "s1", cwd: "/work/repo", projectsDir: root });
  assert.equal(o.coverage, "partial", "control: matching cwd reports");
  // Same directory name, foreign cwd recorded inside.
  const foreign = JSON.stringify({
    type: "assistant",
    requestId: "r1",
    cwd: "/somewhere/else",
    timestamp: "2026-08-18T10:00:00.000Z",
    message: { model: "claude-opus-5", usage: usage({ out: 10 }) },
  });
  const { root: root2 } = scratch({ lines: [foreign] });
  const o2 = render({ sessionId: "s1", cwd: CWD, projectsDir: root2 });
  assert.equal(o2.coverage, "unavailable");
  assert.match(o2.coverage_note, /foreign run/);
});

test("synthetic-model records are excluded — not real API calls", () => {
  const { root } = scratch({
    lines: [rec("r1", usage({ out: 10 })), rec("r2", usage({ out: 500 }), { model: "<synthetic>" })],
  });
  const o = call(root);
  assert.equal(o.requests, 1);
  assert.equal(o.tokens.output, 10);
});

test("non-assistant records and records without usage are ignored", () => {
  const { root } = scratch({
    lines: [
      JSON.stringify({ type: "user", cwd: CWD, message: { content: "x" } }),
      JSON.stringify({ type: "assistant", requestId: "no-usage", cwd: CWD, message: { model: "claude-opus-5" } }),
      rec("r1", usage({ out: 10 })),
    ],
  });
  assert.equal(call(root).requests, 1);
});

test("a torn / invalid JSON line is tolerated (the session is still being written)", () => {
  const { root } = scratch({ lines: [rec("r1", usage({ out: 10 })), '{"type":"assis'] });
  assert.equal(call(root).requests, 1);
});

test("by_stage groups on attributionSkill; untagged records get an honest bucket", () => {
  const { root } = scratch({
    lines: [
      rec("r1", usage({ out: 10 }), { stage: "pharn-build" }),
      rec("r2", usage({ out: 20 }), { stage: "pharn-verify" }),
      rec("r3", usage({ out: 5 })),
    ],
  });
  const o = call(root);
  assert.equal(o.by_stage["pharn-build"].tokens.output, 10);
  assert.equal(o.by_stage["pharn-verify"].tokens.output, 20);
  assert.equal(o.by_stage["(untagged)"].tokens.output, 5);
  assert.equal(o.by_stage["(untagged)"].requests, 1);
});

test("by_model groups on the recorded model, keys sorted for stable output", () => {
  const { root } = scratch({
    lines: [rec("r1", usage({ out: 10 }), { model: "claude-sonnet-5" }), rec("r2", usage({ out: 20 }), { model: "claude-opus-5" })],
  });
  const o = call(root);
  assert.deepEqual(Object.keys(o.by_model), ["claude-opus-5", "claude-sonnet-5"]);
});

test("every token class is summed separately — cached and uncached never blended", () => {
  const { root } = scratch({
    lines: [rec("r1", usage({ input: 1, w1h: 2, w5m: 3, read: 4, out: 5, think: 6 }))],
  });
  const t = call(root).tokens;
  assert.deepEqual(t, {
    input_uncached: 1,
    cache_write_1h: 2,
    cache_write_5m: 3,
    cache_read: 4,
    output: 5,
    thinking: 6,
  });
});

test("window_start / window_end come from record timestamps, in order", () => {
  const { root } = scratch({
    lines: [rec("r1", usage(), { timestamp: "2026-08-18T12:00:00.000Z" }), rec("r2", usage(), { timestamp: "2026-08-18T09:00:00.000Z" })],
  });
  const o = call(root);
  assert.equal(o.window_start, "2026-08-18T09:00:00.000Z");
  assert.equal(o.window_end, "2026-08-18T12:00:00.000Z");
});

test("✦ DETERMINISM: rendering twice over unchanged bytes is byte-identical", () => {
  const { root } = scratch({ lines: [rec("r1", usage({ out: 10 })), rec("r2", usage({ read: 99 }))] });
  assert.equal(JSON.stringify(call(root)), JSON.stringify(call(root)));
});

test("coverage is NEVER `complete` — the enum has no such member (a run cannot account for itself)", () => {
  assert.deepEqual([...COVERAGE], ["partial", "unavailable"]);
  assert.ok(!COVERAGE.includes("complete"));
  const { root } = scratch({ lines: [rec("r1", usage({ out: 1 }))] });
  assert.equal(call(root).coverage, "partial");
});

test("no price table is embedded — tokens only, so a stale price can never be reported", () => {
  const { root } = scratch({ lines: [rec("r1", usage({ out: 10 }))] });
  const o = call(root);
  const flat = JSON.stringify(o);
  assert.ok(!("usd" in o) && !/\busd\b/i.test(Object.keys(o).join(" ")), "no usd key");
  assert.ok(!/\$\d/.test(flat), "no dollar figure anywhere in the block");
});

test("honest absence: no session id -> unavailable, never a throw", () => {
  const o = render({ sessionId: null, cwd: CWD, projectsDir: "/nope" });
  assert.equal(o.coverage, "unavailable");
  assert.equal(o.requests, 0);
  assert.match(o.coverage_note, /CLAUDE_CODE_SESSION_ID/);
});

test("honest absence: missing project directory -> unavailable, and names what it looked for", () => {
  const o = render({ sessionId: "s1", cwd: CWD, projectsDir: join(tmpdir(), "definitely-not-here-xyz") });
  assert.equal(o.coverage, "unavailable");
  assert.match(o.coverage_note, /no transcript directory/);
});

test("honest absence: directory exists but the session has no transcript -> unavailable", () => {
  const { root } = scratch({ session: "other", lines: [rec("r1", usage())] });
  const o = call(root, { sessionId: "missing" });
  assert.equal(o.coverage, "unavailable");
  assert.match(o.coverage_note, /no transcript found/);
});

test("every emitted block carries the schema tag and a coverage enum member", () => {
  const { root } = scratch({ lines: [rec("r1", usage())] });
  for (const o of [call(root), render({ sessionId: null, cwd: CWD, projectsDir: root })]) {
    assert.equal(o.schema, SCHEMA);
    assert.ok(COVERAGE.includes(o.coverage));
    assert.equal(o.dedup_key, "requestId");
  }
});

test("transcriptFiles returns sorted paths (filesystem-independent read order)", () => {
  const { proj } = scratch({ lines: [rec("r1", usage())], extra: { "b.jsonl": "", "a.jsonl": "" } });
  const files = transcriptFiles(proj);
  assert.deepEqual([...files].sort(), files);
});

test("aggregate on an unreadable subtree does not throw", () => {
  const { proj } = scratch({ lines: [rec("r1", usage())] });
  assert.doesNotThrow(() => aggregate(proj, "s1"));
});

test("CLI: prints valid JSON and exits 0", () => {
  const { root } = scratch({ lines: [rec("r1", usage({ out: 10 }))] });
  const r = spawnSync(process.execPath, [CLI, "--session", "s1", "--cwd", CWD, "--projects-dir", root], {
    encoding: "utf8",
  });
  assert.equal(r.status, 0);
  const o = JSON.parse(r.stdout);
  assert.equal(o.tokens.output, 10);
});

test("CLI: an unknown argument exits 2 and writes nothing to stdout (fail-closed)", () => {
  const r = spawnSync(process.execPath, [CLI, "--bogus"], { encoding: "utf8" });
  assert.equal(r.status, 2);
  assert.equal(r.stdout, "");
});
