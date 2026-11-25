# Art Thinking

一個讓 AI 用「文組 3D 模型師」的思維幫你想專案、檢視設計、寫程式、整理想法的 skill。

核心只有一個標準：**對方拿到之後，能不能不問我就讓它動起來？**

*English below.*

---

## 這是什麼

這個 skill 是從五個真實專案整理出來的：VMCFacial、CONNECT、yugo、譜面（Agent Clan）、BlastRadius。
整理過程和每條 pattern 的證據放在 [research/behavior-pattern.md](research/behavior-pattern.md)。

裝好之後，AI 會：
- 先問「這是讓誰方便、讓誰覺得好玩」，而不是先問「怎麼做得更快」
- 用你的招式產生點子（例如「把要填的變成自己找」「把限制變成亮度提示」）
- 一輪只給你一個具體方案，不丟一堆選項
- 用白話講，不用術語

## 兩個版本，擇一安裝

| 資料夾 | 語言 | 名稱（指令） |
|--------|------|--------------|
| [art-thinking/](art-thinking/) | 繁體中文 | `/art-thinking` |
| [art-thinking-en/](art-thinking-en/) | English | `/art-thinking-en` |

內容相同，只是 skill 檔案本身的語言不同。兩個版本都會用你說話的語言回覆（簡體就回簡體，繁體就回繁體，英文就回英文）。兩個都裝的話，AI 可能不確定要用哪一個，所以建議只裝一個。

## 怎麼安裝

### Claude Code（推薦：用 plugin 安裝，會自動更新、每台電腦都一樣）
這個 repo 本身就是一個 Claude Code plugin marketplace。每台電腦只要在 PowerShell 跑一次：

```powershell
claude plugin marketplace add TseTseCheng/skill_Art-Thinking
claude plugin install art-thinking@art-thinking-skills
```

英文版把第二行的 `art-thinking` 換成 `art-thinking-en`。

**打開自動更新**（第三方 marketplace 預設是關的）：在 Claude Code 裡打 `/plugin` → Marketplaces 分頁 → 選 `art-thinking-skills` → 開啟 auto-update。之後只要 push 到 GitHub，各台電腦開 Claude Code 時就會自己拉新版（每次 commit 都算新版本，不用改版號）。想馬上更新：

```powershell
claude plugin marketplace update art-thinking-skills
```

用 plugin 裝的話，指令會帶 plugin 名稱：`/art-thinking:art-thinking`。

### Claude Code（手動複製，不會自動更新）
把資料夾整個複製到你的個人 skill 資料夾：

```powershell
Copy-Item -Recurse "D:\Github\skill_Art-Thinking\art-thinking" "$env:USERPROFILE\.claude\skills\art-thinking"
```

只想在某個專案裡用的話，改複製到那個專案的 `.claude\skills\` 資料夾。

### claude.ai 網頁版或桌面 App 的聊天
1. 把 `art-thinking` 資料夾壓成 ZIP（資料夾名稱要跟 skill 名稱一樣）。
2. 打開 Customize → Skills → 「+」→ Upload a skill，上傳 ZIP。
3. 需要在 Settings → Capabilities 開啟程式碼執行。

注意：Claude Code、claude.ai、API 三邊的 skill 不會互相同步，要各自安裝。

## 怎麼用

有兩種方式叫它出來：
- **直接打指令**：`/art-thinking`，後面接你要說的話。
- **讓它自己判斷**：講到「用我的思維」「更有創造力」「客戶用不起來」「不知道意義」「整理我說的話」這類話時，AI 會自己用。

### 可以拿來做的事

| 想做什麼 | 你可以這樣說 | 它會做什麼 |
|----------|--------------|------------|
| **發想** | 「我想讓 CONNECT 的客戶可以自己換角色的衣服，幫我想」 | 先整理你的話，找出對象和樂趣，用招式發散，最後給一個具體方案 |
| **檢視一個專案** | 「用我的思維看一下 MotionData-Tester，客戶會卡在哪」 | 假裝自己是文組客戶，從拿到走到「動起來」，列出卡點，給一個改善提案 |
| **寫程式時做決定** | 「這個設定頁要怎麼做？」 | 自動找、記住上次的選擇、錯誤訊息用白話、直接在東西上調 |
| **找意義** | 「BlastRadius 我不知道還要做什麼」 | 沿著作品往下游走，找出它保護的人或樂趣 |
| **跟 AI 講清楚** | 貼上一段語音輸入，說「整理我說的話」 | 修同音錯字、整理成編號條列、分開你說的和它推測的，請你確認 |
| **寫交接文件** | 「整理成一份交接，我要給另一個 AI」 | 寫出包含出發點、否決過的版本、合作方式、判斷標準的交接文件 |
| **檢查路線** | 「看一下 yugo 的 roadmap，好玩的東西還在嗎」 | 檢查嚴謹的工作有沒有吃掉當初讓人興奮的功能 |
| **決定要不要自己做** | 「要用現成的直播軟體，還是自己做？」 | 檢查別人的工具有沒有吃掉作品的細節、有沒有限制作品的呈現 |
| **寫動機文或論文的動機段落** | 「幫我寫譜面為什麼要做」 | 用你的口吻和價值觀寫，不過度解讀 |
| **給團隊或外包的 AI 看** | 把 skill 放進專案的 `.claude/skills/` | 所有在這個專案工作的 AI 都會照同一套標準判斷 |

## 資料夾內容

```
art-thinking/                中文版 skill
  SKILL.md                   主流程：一個標準、四種情境、回覆格式
  references/
    moves.md                 招式表：把 A 變成 B
    patterns.md              15 條行為 pattern 和證據
    origin-stories.md        原話：VMCFacial、CONNECT、譜面、BlastRadius
art-thinking-en/             English edition (same structure)
research/
  behavior-pattern.md        研究筆記：從專案歸納 pattern 的過程
```

---

# English

A skill that lets an AI think like a non-engineer 3D character artist: to brainstorm projects, review designs, make coding decisions, and turn rambling ideas into clear briefs.

One test drives everything: **can someone who receives the work get it moving without asking anyone?**

## Editions — install one

- `art-thinking/`: written in Traditional Chinese, invoked as `/art-thinking`
- `art-thinking-en/`: written in English, invoked as `/art-thinking-en`

Both editions reply in whatever language the user writes in.

Installing both may make it unclear which one should trigger.

## Install

- **Claude Code (recommended, auto-updates across machines)**: this repo is a plugin marketplace. On each machine:
  ```
  claude plugin marketplace add TseTseCheng/skill_Art-Thinking
  claude plugin install art-thinking-en@art-thinking-skills
  ```
  Then turn on auto-update: `/plugin` → Marketplaces → `art-thinking-skills` → enable auto-update. Every push is picked up as a new version. Invoke it as `/art-thinking-en:art-thinking-en`.
- **Claude Code (manual, no updates)**: copy the folder to `~/.claude/skills/` (personal) or `<project>/.claude/skills/` (project only).
- **claude.ai / desktop chat**: zip the folder (folder name must match the skill name), then Customize → Skills → + → Upload a skill. Code execution must be enabled in Settings → Capabilities.
- Skills don't sync between Claude Code, claude.ai and the API; install on each.

## What it's for

Ideation, reviewing a project from a non-technical user's point of view, coding defaults (discover instead of asking, remember choices, plain-language errors), finding the meaning in a purely technical project, organizing voice-typed ideas into a numbered brief, writing handoff documents for another AI, checking whether a roadmap still contains the fun parts, and deciding whether to build your own tool.
