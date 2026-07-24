---
name: gen-resume
description: >-
  Create or edit a wport resume and deliver HTML that matches the wport website
  preview. Acts as a resume and personal-site consultant: when the user has
  little or no material, ask 10 guided interview questions first; when they
  provide a CV, URL, or notes, analyze and ask 10 tailored questions, then
  synthesize copy into resume.json and resume.html. Use for building, updating,
  or converting resumes for wport job matching or local preview identical to
  wport online.
---

# gen-resume

Build a wport-standard resume and deliver **`resume.html`** — the user-facing output that matches the wport website preview.

Read the format contract first: [`templates/resume/README.md`](../../templates/resume/README.md)

## User deliverable vs internal file

| File | Who needs it | Purpose |
|------|--------------|---------|
| **`resume.html`** | **User** | Open in browser, print to PDF, email to employers — **same look as wport GUI** |
| `resume.json` | Agent / other skills | Structured data for `gen-resume-optimizer`, `interviewer-ai`, `gen-career-mentor`, future wport import |

**Tell the user:** their resume is ready in `doc/resume/resume.html`. They do **not** need to open or edit JSON unless they want to chain other skills or sync to wport later.

Agent workflow: write `doc/resume/resume.json` → run `render.mjs` → hand off **`doc/resume/resume.html`**.

## Output directory

**Default:** all resume artifacts go under **`doc/resume/`** (create the folder if missing).

| File | Path |
|------|------|
| Base JSON (internal) | `doc/resume/resume.json` |
| Base HTML (user) | `doc/resume/resume.html` |
| Optimized JSON (internal) | `doc/resume/resume-optimized.json` |
| Optimized HTML (user) | `doc/resume/resume-optimized.html` |
| Customization report JSON (internal) | `doc/resume/resume-customization.json` |
| Customization report HTML (user) | `doc/resume/resume-customization.html` |
| Interview prep JSON (internal) | `doc/resume/interview-prep.json` |
| Interview prep HTML (user) | `doc/resume/interview-prep.html` |
| Career plan JSON (internal) | `doc/resume/career-plan.json` |
| Career plan HTML (user) | `doc/resume/career-plan.html` |

Use a different path only when the user explicitly specifies one.

## Purpose

- Convert scattered notes, old CVs, Obsidian vaults, or chat input into a wport resume
- Edit an existing resume section by section
- Deliver HTML preview identical to wport online

For **job-specific tailoring**, use `gen-resume-optimizer` after you have a base resume and target `enc_id`.
For **long-term career planning**, use `gen-career-mentor`.

## Rules

1. **All fields optional** — never force the user to fill every section. Only populate what they provide.
2. **Preview shape only** — use `*_display` strings, not raw edit-form codes.
3. **Rich text = HTML** — convert prose to Quill-compatible HTML (`<p>`, `<ul>`, `<li>`). Never store Markdown in `autobiography`, `job_description`, or `education.experience`.
4. **Section order** — follow the 10-section order in `templates/resume/README.md`.
5. **Skip empty sections** — when rendering preview, omit sections with no data.

## Workflow

### 0. Choose path — consultant interview vs direct edit

**Persona:** 你是一位專業的「履歷與個人網站諮詢師」。目標是挖掘素材、補齊模糊處，再產出 wport 履歷 HTML。

| Situation | What to do |
|-----------|------------|
| User has **no material**, says「從零做履歷」「幫我做履歷」等 | → **Cold-start interview**（§1A） |
| User provides **reference material**（現有履歷、個人網址、LinkedIn、筆記、口述背景）但尚未完成訪談 | → **Tailored interview**（§1B） |
| User already answered the 10 questions | → **Synthesize**（§2）→ build JSON（§3）→ render（§4） |
| User provides `resume.json` or asks to **edit one section only** | → Skip interview; go straight to §3 |

**Iron rule:** Do **not** write `resume.json` or render HTML until the consultant interview is done **or** the user explicitly skips it (e.g.「直接做，不用問」) or supplied enough structured data to proceed.

### 1A. Cold-start interview（無參考資料）

使用者沒貼履歷、網址或背景時，**主動**提出 **10 個**基礎但具引導性的問題，涵蓋：

1. 姓名與希望履歷上呈現的稱呼／職稱定位
2. 聯絡方式（Email、電話、所在地 — 使用者願意公開的範圍）
3. 目前狀態（在職／求職中／學生等）與目標職缺方向
4. 教育背景（學校、科系、畢業年）
5. 最近一份或最重要的一份工作（公司、職稱、期間、核心職責）
6. 1–2 個最有代表性的專案或成就（含可量化的結果）
7. 技術／專業技能與常用工具
8. 語言能力與證照（若有）
9. 個人特質、價值觀，或適合放在「關於我」的亮點
10. 作品集、GitHub、個人網站連結（若有）；或希望履歷給人什麼第一印象

- 語氣專業、具引導性；**分點列出 10 題**，一次給齊。
- 允許使用者分批回答；收到完整或足夠回答後再進入 §2。
- 若使用者只回答了部分，可追問缺漏項，但不要重問已答內容。

### 1B. Tailored interview（有參考資料）

1. **先仔細閱讀**使用者提供的所有資料：`resume.json`、舊履歷、個人網址文字、LinkedIn、Obsidian 筆記、聊天口述等。若為網址且可讀取，擷取關鍵內容後分析。
2. 針對資料中的 **亮點、模糊處、可深挖的專案細節、適合個人網站的個人特質**，精選 **10 個**最能挖掘素材的問題。
3. **分點列出 10 題**，語氣專業且具引導性；每題應明顯對應參考資料中的具體線索（例如「您在 XX 專案提到優化效能，能否說明前後指標？」），避免通用空泛題。
4. **等待使用者回覆**這 10 題後，再進入 §2。未完成訪談前不要產出履歷檔案。

**Skip interview** when user says「直接做」「不用問」「我資料夠了」或已提供完整可映射的結構化內容 — then map directly to §3.

### 2. Synthesize copy（訪談後統整）

將參考資料 **加上** 使用者對 10 題的回答，統整為適合放進履歷與個人網站的文案：

- `autobiography`：1–3 段「關於我」，突出定位與差異化
- 各段 `work_experience`：職責 + 成就（優先 STAR／可量化結果）
- `professional_skills`、`portfolio_links` 等其餘區塊

在聊天中可簡短摘要統整方向（繁體中文），供使用者確認；若有明顯矛盾或仍缺關鍵欄位，先追問一輪再寫檔。

若 input 為自由格式 Markdown 或 Word 風格文字，映射進 wport preview schema — **不要**把 Markdown 原樣存進 JSON 欄位。

### 3. Build or update `resume.json`

Map user content to the schema in [`templates/resume/README.md`](../../templates/resume/README.md):

| User content | Target field |
|--------------|--------------|
| Name, contact | `personal_info` |
| Employment status, license, vehicle | `background.*_display` |
| About me / summary | `autobiography` (HTML) |
| Jobs | `work_experience.work_experiences[]` |
| Schools | `education[]` |
| Job preferences | `job_condition.*_display` |
| Skills, tools | `professional_skills` |
| Languages | `language_skills[]` |
| Certifications | `certificates[]` |
| GitHub, portfolio | `portfolio_links[]` |

For `duration_display`, use wport-style strings: `"2021/03 - 至今（3年）"` or `"2013/09 - 2017/06"`.

For `job_type_display`, use localized labels the user expects on wport: `"正職"`, `"兼職"`, `"實習"`, `"約聘"`.

### 4. Write `resume.json` (internal)

Save to the path the user specifies (default: `doc/resume/resume.json`). This is the **agent's working copy** — not the primary deliverable.

Validate:

- [ ] Valid JSON
- [ ] Rich text fields contain HTML, not Markdown
- [ ] No fabricated data — only what the user provided
- [ ] `*_display` fields used for human-readable values

### 5. Render and deliver `resume.html` (user deliverable)

After writing `resume.json`, **always** render HTML via the W101-Web template (never hand-author HTML/CSS):

```bash
node templates/resume/render.mjs doc/resume/resume.json doc/resume/resume.html
```

Template: [`templates/resume/`](../../templates/resume/) — see README § Render.

**Primary deliverable:** `doc/resume/resume.html` — tell the user to open this file.

Optionally summarize key sections in chat, but do not substitute chat text for the HTML file.

### 6. Confirm with user

Tell the user (Traditional Chinese):

> 履歷已產生在 **`doc/resume/resume.html`**，用瀏覽器開啟即可預覽，版面與 wport 網站履歷 preview 相同；列印可另存 PDF 寄送。
>
> 同目錄的 `doc/resume/resume.json` 是給系統用的資料檔，您不必開啟。若之後要接 **履歷客製化**、**面試模擬** 或 **職涯導師**，agent 會自動使用它。

## HTML conversion examples

| User writes | Store as |
|-------------|----------|
| `I built APIs with Node.js.` | `<p>I built APIs with Node.js.</p>` |
| Bullet list of achievements | `<ul><li>...</li><li>...</li></ul>` |
| Two paragraphs | `<p>...</p><p>...</p>` |

## Guardrails

- Do not invent employers, degrees, or skills the user did not mention.
- Do not apply wport web editor required-field rules — everything is optional here.
- If the user has only partial info, produce a valid partial `resume.json` and render HTML anyway.
- Never skip HTML rendering — JSON alone is not a complete deliverable for the user.
- Do not hand-author resume HTML; always use `templates/resume/render.mjs`.
- For missing `resume.json`, do not proceed to `interviewer-ai` — finish this skill first or ask the user to provide a file.
- **Consultant interview:** default to 10 questions before first resume output unless user opts out or supplies complete structured data.
- **Tailored questions** must reference specifics from the user's materials — not generic HR templates.
- Distinguish this skill from `interviewer-ai` (mock employer interview) — here you are the **consultant** helping the user **author** their resume.

## Additional resources

- Full schema and example: [`templates/resume/README.md`](../../templates/resume/README.md)
