#!/usr/bin/env node
// Checks every node of the project tree, recolors PROJECT_TREE.md, and prints what is still red.
//
//   node checks/run.mjs           quick checks (a few seconds, free)
//   node checks/run.mjs --evals   also run the reply evals first (a few minutes, uses your Claude account)
//
// Reply nodes read the latest eval result in evals/results/latest.json.

import { execSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TREE_FILE = join(ROOT, "PROJECT_TREE.md");
const EVAL_FILE = join(ROOT, "evals", "results", "latest.json");

const read = (p) => readFileSync(join(ROOT, p), "utf8").replace(/\r\n/g, "\n");
const sh = (cmd) => execSync(cmd, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const ok = (why = "") => ({ ok: true, why });
const bad = (why) => ({ ok: false, why });

// ---------- facts read once ----------

const marketplace = JSON.parse(read(".claude-plugin/marketplace.json"));
const plugin = JSON.parse(read(".claude-plugin/plugin.json"));
const skillMd = read("thinking/SKILL.md");
const front = Object.fromEntries(
  (skillMd.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "")
    .split("\n")
    .map((l) => l.match(/^(\w+):\s*(.*)$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2]]),
);
const readme = read("README.md");
// everything git would ship: committed files plus new files not ignored
const tracked = sh("git ls-files --cached --others --exclude-standard").split("\n").filter(Boolean);
const repo = (sh("git remote get-url origin").match(/github\.com[/:](.+?)(\.git)?\s*$/) ?? [])[1];

// ---------- eval results ----------

// graderName -> { pass, total } for the arm that had the skill loaded,
// plus the overall pass share with and without the skill.
function loadEval() {
  if (!existsSync(EVAL_FILE)) return null;
  const data = JSON.parse(readFileSync(EVAL_FILE, "utf8"));
  const tally = {};
  const share = { with: [0, 0], without: [0, 0] };
  for (const c of data.cases ?? []) {
    for (const [arm, runs] of Object.entries(c.arms ?? {})) {
      for (const run of runs) {
        for (const g of run.graders ?? []) {
          if (share[arm]) { share[arm][1] += 1; if (g.passed) share[arm][0] += 1; }
          if (arm !== "with") continue;
          const t = (tally[g.name] ??= { pass: 0, total: 0 });
          t.total += 1;
          if (g.passed) t.pass += 1;
        }
      }
    }
  }
  const pctOf = ([p, t]) => (t ? Math.round((p / t) * 100) : null);
  return {
    tally,
    when: new Date(data.startedAt).toLocaleString("zh-TW", { hour12: false }),
    withSkill: pctOf(share.with),
    withoutSkill: pctOf(share.without),
    pluginLoaded: (data.suite?.plugins ?? []).length > 0,
  };
}
const evalResult = loadEval();

function graders(...names) {
  return () => {
    if (!evalResult) return bad("還沒跑過回覆測試：node checks/run.mjs --evals");
    if (!evalResult.pluginLoaded) return bad("上次回覆測試沒有載入 skill，結果不算數，請重跑 --evals");
    const missing = [];
    const failed = [];
    for (const n of names) {
      const t = evalResult.tally[n];
      if (!t) missing.push(n);
      else if (t.pass < t.total) failed.push(`${n} ${t.pass}/${t.total}`);
    }
    if (missing.length) return bad(`測試結果裡找不到：${missing.join("、")}`);
    if (failed.length) return bad(`沒過：${failed.join("、")}`);
    return ok();
  };
}

// ---------- the tree ----------
// kind: auto = a script decides; person = only a person can judge, never faked.

const tree = [
  { id: "root", label: "拿到的人不用問就能讓它動起來" },

  { id: "install", parent: "root", label: "兩行指令就裝得起來" },
  {
    id: "manifest", parent: "install", label: "安裝設定檔格式正確",
    check: () => {
      try { sh("claude plugin validate ."); return ok(); }
      catch (e) { return bad(((e.stdout ?? "") + (e.stderr ?? "")).trim().split("\n").slice(-3).join(" ") || "驗證沒過"); }
    },
  },
  {
    id: "skillPath", parent: "install", label: "安裝設定指到 skill 資料夾",
    check: () => {
      const dirs = plugin.skills ?? [];
      const missing = dirs.filter((d) => !existsSync(join(ROOT, d, "SKILL.md")));
      if (!dirs.length) return bad("安裝設定裡沒有列出 skill");
      return missing.length ? bad(`找不到 ${missing.join("、")} 裡的 SKILL.md`) : ok();
    },
  },
  {
    id: "realInstall", parent: "install", label: "在乾淨的環境真的裝一次，skill 有出現",
    check: () => {
      const home = mkdtempSync(join(tmpdir(), "art-install-"));
      const env = { ...process.env, CLAUDE_CONFIG_DIR: home };
      const run = (cmd) => execSync(cmd, { cwd: ROOT, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
      try {
        run(`claude plugin marketplace add "${ROOT}"`);
        run(`claude plugin install ${plugin.name}@${marketplace.name}`);
        const details = run(`claude plugin details ${plugin.name}`);
        const skills = details.match(/Skills \((\d+)\)\s+(.*)/);
        if (!skills) return bad("裝好了，但看不到任何 skill");
        if (skills[1] !== "1" || skills[2].trim() !== front.name) return bad(`裝好後的 skill 是：${skills[2].trim()}（${skills[1]} 個）`);
        return ok();
      } catch (e) {
        return bad(`安裝失敗：${((e.stdout ?? "") + (e.stderr ?? "")).trim().split("\n").slice(-2).join(" ")}`);
      } finally {
        rmSync(home, { recursive: true, force: true });
      }
    },
  },
  {
    id: "readmeCommands", parent: "install", label: "說明書上的指令跟設定一致",
    check: () => {
      const want = [
        `claude plugin marketplace add ${repo}`,
        `claude plugin install ${plugin.name}@${marketplace.name}`,
        `claude plugin marketplace update ${marketplace.name}`,
        `/${plugin.name}:${front.name}`,
      ];
      const missing = want.filter((w) => !readme.includes(w));
      return missing.length ? bad(`README 少了：${missing.join("、")}`) : ok();
    },
  },
  {
    id: "pushed", parent: "install", label: "別人拿到的就是這裡這一版",
    check: () => {
      let note = "";
      try { sh("git fetch origin --quiet"); } catch { note = "（沒連上 GitHub，用上次抓到的版本比）"; }
      const paths = ["thinking", ".claude-plugin", "README.md", "images"];
      const diff = sh(`git diff --name-only origin/main -- ${paths.join(" ")}`).trim();
      const untracked = sh(`git ls-files --others --exclude-standard -- ${paths.join(" ")}`).trim();
      const files = [diff, untracked].filter(Boolean).join("\n").split("\n").filter(Boolean);
      return files.length
        ? bad(`這些還沒推上 GitHub：${files.join("、")}${note}`)
        : ok(note);
    },
  },

  { id: "trigger", parent: "root", label: "該出現的時候會自己出現" },
  {
    id: "frontmatter", parent: "trigger", label: "skill 名稱和說明格式正確",
    check: () => {
      const folder = (plugin.skills?.[0] ?? "").replace(/^\.\//, "");
      if (front.name !== folder) return bad(`skill 名稱「${front.name}」跟資料夾「${folder}」不一樣`);
      if (!front.description) return bad("沒有說明");
      if (front.description.length > 1024) return bad(`說明太長（${front.description.length} 字，上限 1024）`);
      if (/[<>]/.test(front.description)) return bad("說明裡有角括號，會被擋");
      return ok();
    },
  },
  {
    id: "phrases", parent: "trigger", label: "說明裡有觸發的關鍵句",
    check: () => {
      const want = ["art thinking", "think like an artist", "make it fun", "organize what I said", "project tree", "Skip plain bug fixes"];
      const missing = want.filter((w) => !front.description?.toLowerCase().includes(w.toLowerCase()));
      return missing.length ? bad(`說明裡少了：${missing.join("、")}`) : ok();
    },
  },

  { id: "content", parent: "root", label: "AI 讀得到完整的思路" },
  {
    id: "refs", parent: "content", label: "提到的參考檔都在",
    check: () => {
      const refs = [...new Set(skillMd.match(/references\/[\w-]+\.md/g) ?? [])];
      const missing = refs.filter((r) => !existsSync(join(ROOT, "thinking", r)));
      if (!refs.length) return bad("主檔沒有提到任何參考檔");
      return missing.length ? bad(`找不到：${missing.join("、")}`) : ok();
    },
  },
  {
    id: "short", parent: "content", label: "主檔夠短，AI 一次讀完",
    check: () => {
      const lines = skillMd.split("\n").length;
      return lines <= 150 ? ok(`${lines} 行`) : bad(`主檔 ${lines} 行，超過 150 行`);
    },
  },
  {
    id: "patterns", parent: "content", label: "行為 pattern 數量跟目錄一致",
    check: () => {
      const p = read("thinking/references/patterns.md");
      const said = Number(p.match(/^#\s*(\d+)\s+behavior patterns/m)?.[1]);
      const contents = p.split(/^## Contents/m)[1]?.split(/^---/m)[0] ?? "";
      const listed = (contents.match(/^\d+\.\s/gm) ?? []).length;
      const written = (p.match(/^###\s+\d+\./gm) ?? []).length;
      return said === listed && listed === written
        ? ok()
        : bad(`標題說 ${said} 條，目錄 ${listed} 條，內文 ${written} 條`);
    },
  },
  {
    id: "private", parent: "content", label: "私人筆記沒有被帶出去",
    check: () => {
      const leaked = tracked.filter((f) => f.startsWith("art-thinking-workspace/") || /private-notes/.test(f));
      return leaked.length ? bad(`這些被放進 git 了：${leaked.join("、")}`) : ok();
    },
  },

  { id: "replies", parent: "root", label: "回覆一眼看懂、照著就能做" },
  { id: "language", parent: "replies", label: "用對方的語言和字體回", check: graders("same-language") },
  { id: "conclusion", parent: "replies", label: "第一行就是結論", check: graders("conclusion-first") },
  { id: "oneProposal", parent: "replies", label: "一次只給一個提案", check: graders("one-proposal") },
  { id: "noNumbers", parent: "replies", label: "不用編號清單", check: graders("no-numbered-lists") },
  { id: "whoServes", parent: "replies", label: "先說出是讓誰方便", check: graders("who-it-serves") },
  {
    id: "userSide", parent: "replies", label: "站在使用者那邊找卡點",
    check: graders("walks-as-the-couple", "checks-the-test"),
  },
  {
    id: "restate", parent: "replies", label: "把一長串話整理好再請人確認",
    check: graders("restates-as-named-bullets", "asks-to-confirm", "protects-the-detail"),
  },
  { id: "phone", parent: "replies", label: "在手機上一眼看得懂", kind: "person" },

  { id: "readme", parent: "root", label: "打開 README 就知道是什麼" },
  {
    id: "image", parent: "readme", label: "前後對照圖在",
    check: () => {
      const imgs = [...readme.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
      const missing = imgs.filter((i) => !existsSync(join(ROOT, i)));
      return !imgs.length ? bad("README 沒有圖") : missing.length ? bad(`找不到：${missing.join("、")}`) : ok();
    },
  },
  {
    id: "folders", parent: "readme", label: "資料夾說明跟實際檔案一致",
    check: () => {
      const block = readme.split("## 資料夾內容")[1]?.match(/```\n([\s\S]*?)```/)?.[1] ?? "";
      const named = [...block.matchAll(/^\s*([\w.-]+\/?)\s/gm)].map((m) => m[1].replace(/\/$/, ""));
      const shipped = tracked.filter((f) => !f.startsWith(".git"));
      const names = new Set(shipped.flatMap((f) => f.split("/")));
      const ghost = named.filter((n) => !names.has(n));
      const unlisted = shipped
        .map((f) => f.split("/")[0])
        .filter((top, i, a) => a.indexOf(top) === i && top !== "README.md")
        .filter((top) => !named.includes(top));
      const msg = [
        ghost.length && `寫了但不存在：${ghost.join("、")}`,
        unlisted.length && `存在但沒寫：${unlisted.join("、")}`,
      ].filter(Boolean).join("；");
      return msg ? bad(msg) : ok();
    },
  },
  { id: "firstLook", parent: "readme", label: "第一次看的人看得懂", kind: "person" },

  { id: "fun", parent: "root", label: "用起來有趣、讓人想再叫它", kind: "person" },
];

// ---------- run ----------

if (process.argv.includes("--evals")) {
  console.log("正在跑回覆測試，大約幾分鐘……");
  try {
    execSync("claude plugin eval . --trust-plugin --no-publish -j 4 --threshold 0 --json evals/results/latest.json", {
      cwd: ROOT, stdio: "inherit",
    });
  } catch {
    console.log("回覆測試沒有跑完，下面的回覆項目會用上一次的結果。");
  }
}

const byId = Object.fromEntries(tree.map((n) => [n.id, n]));
const kids = (id) => tree.filter((n) => n.parent === id);

for (const n of tree) if (n.check) {
  try { n.result = n.check(); } catch (e) { n.result = bad(`檢查本身出錯：${e.message}`); }
}

function state(n) {
  if (n.kind === "person") return "person";
  if (n.result) return n.result.ok ? "green" : "red";
  const s = kids(n.id).map(state).filter((x) => x !== "person");
  return s.every((x) => x === "green") ? "green" : "red";
}
for (const n of tree) n.state = state(n);

const leaves = tree.filter((n) => n.check);
const green = leaves.filter((n) => n.state === "green").length;
const pct = Math.round((green / leaves.length) * 100);
const people = tree.filter((n) => n.kind === "person");

// ---------- write PROJECT_TREE.md ----------

const esc = (s) => s.replace(/"/g, "'");
const mermaid = [
  "```mermaid",
  "graph TD",
  ...tree.map((n) => `  ${n.id}["${esc(n.label)}"]:::${n.state}`),
  ...tree.filter((n) => n.parent).map((n) => `  ${n.parent} --> ${n.id}`),
  "  classDef green fill:#2e7d32,stroke:#1b5e20,color:#fff",
  "  classDef red fill:#c62828,stroke:#8e0000,color:#fff",
  "  classDef person fill:#f9a825,stroke:#c17900,color:#000",
  "```",
].join("\n");

const redList = leaves.filter((n) => n.state === "red");
const status = [
  `**${pct}% 綠**　自動檢查 ${green}/${leaves.length} 過　·　${people.length} 項要人看　·　上次檢查 ${new Date().toLocaleString("zh-TW", { hour12: false })}`,
  "",
  redList.length ? "**還是紅的**" : "**全部自動檢查都過了**",
  ...redList.map((n) => `- ${n.label}：${n.result.why}`),
  "",
  "**要人看**",
  ...people.map((n) => `- ${n.label}`),
  "",
  evalResult
    ? `回覆項目用的是 ${evalResult.when} 的回覆測試：有 skill 過了 ${evalResult.withSkill ?? "?"}% 的評分項，沒有 skill 過了 ${evalResult.withoutSkill ?? "?"}%。`
    : "回覆項目還沒有測試結果。",
].join("\n");

const START = "<!-- tree:start -->";
const END = "<!-- tree:end -->";
const block = `${START}\n${status}\n\n${mermaid}\n${END}`;
const current = existsSync(TREE_FILE) ? readFileSync(TREE_FILE, "utf8") : "";
if (current.includes(START) && current.includes(END)) {
  writeFileSync(TREE_FILE, current.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block));
} else {
  writeFileSync(TREE_FILE, `${current}\n${block}\n`);
}

// ---------- tell the person ----------

console.log(`\n${pct}% 綠（${green}/${leaves.length}），${people.length} 項要人看\n`);
for (const n of leaves) {
  const mark = n.state === "green" ? "綠" : "紅";
  console.log(`${mark}  ${n.label}${n.result.why ? `：${n.result.why}` : ""}`);
}
console.log("\n樹已經更新在 PROJECT_TREE.md");
process.exitCode = redList.length ? 1 : 0;
