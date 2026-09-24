#!/usr/bin/env node
/**
 * Create a new post from one of the templates in _templates/.
 *
 *   npm run new -- my-post-slug                    # general column
 *   npm run new -- my-post-slug --template series  # column | series | tutorial | note
 *   npm run new -- my-post-slug --title "제목" --category AI
 *
 * Writes _posts/YYYY-MM-DD-<slug>.md with today's date in Asia/Seoul and the
 * same front matter the CMS (.pages.yml) produces, then prints the path.
 * The slug becomes the URL, so it is limited to lowercase ASCII and hyphens:
 * a Korean filename would publish under a percent-encoded address.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const slug = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));

const fail = (msg) => { console.error(msg); process.exit(1); };
if (!slug) fail("usage: npm run new -- <english-slug> [--template column|series|tutorial|note] [--title 제목] [--category AI]");
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(`slug "${slug}": use lowercase letters, digits and hyphens only`);

const templateName = opt("template", "column");
const templateFile = readdirSync(join(root, "_templates")).find((f) => f.replace(/^\d+-|\.md$/g, "") === templateName);
if (!templateFile) fail(`unknown template "${templateName}" (column, series, tutorial, note)`);
const body = readFileSync(join(root, "_templates", templateFile), "utf8").replace(/^---[\s\S]*?---\n/, "");

// Today in Asia/Seoul regardless of the machine's timezone; a UTC date would
// file a post written after 09:00 KST midnight under yesterday.
const parts = Object.fromEntries(
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date()).map((p) => [p.type, p.value]),
);
const day = `${parts.year}-${parts.month}-${parts.day}`;
const path = join(root, "_posts", `${day}-${slug}.md`);
if (existsSync(path)) fail(`${path} already exists`);

const isNote = templateName === "note";
const tags = templateName === "series" ? '\n  - "원화 스테이블코인 심층분석"' : "";
const frontMatter = `---
title: "${opt("title", "제목을 입력하세요").replace(/"/g, '\\"')}"
slug: ${slug}
excerpt: ""
date: ${day} ${parts.hour}:${parts.minute}:${parts.second} +0900
categories:
  - ${opt("category", templateName === "series" ? "Web3" : "AI")}
tags:${tags || " []"}
toc: ${!isNote}
toc_sticky: ${!isNote}
published: false
---

`;
writeFileSync(path, frontMatter + body);
console.log(`created ${path.slice(root.length + 1)} (draft: set published: true to publish)`);
