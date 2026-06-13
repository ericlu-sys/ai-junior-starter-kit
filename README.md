# AI Junior Starter Kit

給**大專院校 junior** 的 AI 工具入門包，用來快速理解「在真實團隊裡，AI Agent 要怎麼搭配 CLI 與 Skills 完成工作」。

以 [wport 職航站](https://www.wport.me/) 的實習生培訓為例：我們希望你在進公司前，就具備**把想法變成文件、把文件變成可討論的 mock、用 CLI 查資料與部署、用獨立知識庫累積學習**的能力。這個 repo 就是那一套工具的教學沙盒。

## 這包要幹嘛？

| 層次 | 你在練什麼 | Cursor Skill（`.cursor/skills/`） |
|------|-----------|----------------------------------|
| **產品思維** | 需求 → PRD → Mock 規格 → Storybook demo | `prd-gen`、`prd-mock`、`mockup-storybook-delete` |
| **工程協作** | 版控、PR、CI、部署 | `exec-github-cli`、`exec-vercel-cli`、`exec-supabase-cli` |
| **個人知識** | 筆記、學習紀錄（與程式碼分離） | `exec-obsidian-cli`（vault 在**獨立 repo**） |
| **職涯實戰** | 查職缺、履歷、面試、職涯規劃 | `exec-wport-cli` + `wport-agents-setup` |

重點不是一次做出完美產品，而是學會**可重複的工作流**：用 AI 讀 Skill 指令 → 跑 CLI 拿真實資料 → 產出可 review 的文件或畫面。

---

## wport 希望實習生具備的能力

1. **能把模糊需求寫成 PRD**，並畫出工程師看得懂的流程與邊界。
2. **能把 PRD 拆成 Mock 規格**，包含 `loading` / `empty` / `error` / `success` 狀態矩陣。
3. **能產出 Storybook mockup**，讓 FE/BE/PM 在同一個畫面上對齊。
4. **能用 GitHub CLI** 管理 repo、開 PR、看 CI，而不是只會在網頁上點按鈕。
5. **有前端時會用 Vercel CLI** 部署 preview；**有後端時會用 Supabase CLI** 管理 schema 與本地開發。
6. **用 Obsidian 當個人 SSOT**（Single Source of Truth），知識庫與專案 repo 分開，避免 README 與筆記混在一團。
7. **用 wport CLI 查真實職缺**，並搭配 wport Skills 做履歷、面試、職涯規劃。

---

## Cursor Skills 一覽

Agent 讀的是 `.cursor/skills/<name>/SKILL.md`。在 Cursor 對話裡提到 skill 名稱，或請 Agent「照 exec-github-cli 操作」即可觸發。

### CLI Executor Skills（已內建於本 repo）

| # | Skill 路徑 | CLI | 何時用 |
|---|-----------|-----|--------|
| 1 | `.cursor/skills/exec-github-cli/` | `gh` | **必裝** — 版控、PR、CI |
| 2 | `.cursor/skills/exec-vercel-cli/` | `vercel` | 有前端要部署 preview |
| 3 | `.cursor/skills/exec-supabase-cli/` | `supabase` | 有後端 / DB / Auth |
| 4 | `.cursor/skills/exec-obsidian-cli/` | `obsidian-cli` | 個人知識庫（**獨立 repo**） |
| 5 | `.cursor/skills/exec-wport-cli/` | `wport` | 搜尋職缺、看 JD |
| 6 | `.cursor/skills/wport-agents-setup/` | — | 安裝職涯 skill 包（見下方） |

各 skill 內含：安裝指令、常用命令、Agent 工作流程、troubleshooting。

### wport-agents 職涯包（需額外安裝）

`gen-resume`、`gen-resume-optimizer`、`gen-career-mentor`、`interviewer-ai` 來自 [wport-agents](https://github.com/hotfire-digital/wport-agents/)，依賴 `templates/` 渲染 HTML。請依 **`wport-agents-setup`** skill 執行 clone + symlink：

```bash
git clone https://github.com/hotfire-digital/wport-agents.git ../wport-agents
# 詳細 symlink 指令見 .cursor/skills/wport-agents-setup/SKILL.md
```

| 安裝後可用的 Skill | 用途 |
|-------------------|------|
| `gen-resume` | 從筆記產生 `doc/resume/resume.html` |
| `gen-resume-optimizer` | 依 enc_id 客製履歷 |
| `gen-career-mentor` | 1/3/5 年職涯計畫 |
| `interviewer-ai` | 10 題魔鬼面試題 |

### CLI 快速安裝參考

```bash
brew install gh && gh auth login                    # 1. GitHub（必裝）
npm install -g vercel && vercel login               # 2. 前端部署
npm install -g supabase && supabase login           # 3. 後端 / DB
npm install -g obsidian-cli                         # 4. 知識庫
npm install -g @wport/cli && wport doctor           # 5. 職缺查詢
```

---

## PM 練習 Skills（保持不動）

| Skill 路徑 | 用途 |
|-----------|------|
| `.cursor/skills/prd-gen/` | 結構化問答 → PRD 與流程圖 |
| `.cursor/skills/prd-mock/` | PRD → Mockups Spec（stories、狀態矩陣、fixtures） |
| `.cursor/skills/mockup-storybook-delete/` | 依 mockups spec 刪除對應 Storybook stories |
| `.cursor/skills/ui-ux-pro-max/` | Storybook mockup 實作與 UI 設計輔助 |

### 建議練習流程

```
需求想法
   │
   ▼
prd-gen ──► doc/main/*-prd.md
   │
   ▼
prd-mock ──► doc/mockups/*-mockups-spec.md
   │
   ▼
Storybook mockup ──► storybook/src/stories/
   │
   ▼
同學 / 工程師 review ──► 回寫 PRD 與 Mockups Spec
```

1. 用 `prd-gen` 完成一版 PRD（先完整再精緻）。
2. 用 `prd-mock` 拆成可實作的畫面規格與情境狀態。
3. 在 `storybook/` 做出可 demo 的 stories。
4. 用 `sb dev` 本機預覽，與同學 review 文案、流程、欄位。
5. 需求變更時，**PRD、Mockups Spec、Storybook 三者同步更新**。

進度追蹤請寫在 `docs/features/progress/<feature-name>.md`。

---

## 專案主要目錄

| 路徑 | 說明 |
|------|------|
| `doc/main/` | PRD 主文 |
| `doc/mockups/` | Mockups Spec（Storybook 規格） |
| `docs/features/progress/` | 功能進度（SSOT for 實作狀態） |
| `storybook/` | 本機 Storybook 專案與 stories |
| `.cursor/skills/` | Cursor Agent Skills |
| `sb.sh` | Storybook 快速執行腳本 |

線上 Storybook 參考：[storybook.wport.me](https://storybook.wport.me/)

---

## 常用指令

在專案根目錄：

```bash
sb          # build Storybook → storybook/storybook-static
sb dev      # 啟動本機開發伺服器
```

---

## 學習重點

- 狀態矩陣：`loading` / `empty` / `error` / `success` 都要在 mock 裡看得到。
- 命名一致：scenario、區塊 ID、動作 ID 對齊 PRD 與 Mockups Spec。
- 商業規則要在 UI 有對應（字數限制、disabled 條件、錯誤文案）。
- **知識放 Obsidian vault，規格放本 repo**——不要混用。
- 任何流程都可以被質疑；把討論痕跡留在文件裡，這就是 PM 能力的一部分。

---

## 相關連結

- [wport 職航站](https://www.wport.me/)
- [@wport/cli on npm](https://www.npmjs.com/package/@wport/cli)
- [wport-agents Skills 庫](https://github.com/hotfire-digital/wport-agents/)
