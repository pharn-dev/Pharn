import { readFileSync } from "node:fs";
import { micromark } from "micromark";
import MarkdownIt from "markdown-it";
const md = new MarkdownIt("commonmark");
const D = "/private/tmp/claude-501/-Users-pgalarowicz-Projects-pharn-oss/031c6c0b-c2b6-42e2-ba9e-c43a479b9378/scratchpad";
for (const f of process.argv.slice(2)) {
  const text = readFileSync(f, "utf8");
  // strip frontmatter (neither parser knows it); keep body only
  const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  const html = micromark(body);
  const mm = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map(m => m[1]);
  const html2 = md.render(body);
  const mi = [...html2.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map(m => m[1]);
  console.log(f.replace(D+"/",""), "micromark h3:", JSON.stringify(mm), "markdown-it h3:", JSON.stringify(mi));
}
