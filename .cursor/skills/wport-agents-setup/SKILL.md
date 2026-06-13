---
name: wport-agents-setup
description: >-
  安裝 wport-agents 職涯 Skills 包（履歷、客製化、職涯導師、面試官）與 templates。
  Use when the user wants gen-resume, gen-resume-optimizer, gen-career-mentor,
  interviewer-ai, or wport career coaching skills.
---

# wport-agents Skills 包

職涯相關 generator skills 來自 [hotfire-digital/wport-agents](https://github.com/hotfire-digital/wport-agents/)。  
它們依賴 repo 內的 `templates/`（履歷 HTML、報告 HTML），**必須 clone 後 symlink**，不能只 copy SKILL.md。

## 內含 Skills

| Skill | 用途 |
|-------|------|
| `exec-wport-cli` | 已內建於本專案 `.cursor/skills/exec-wport-cli/` |
| `gen-resume` | 產生 `doc/resume/resume.html` |
| `gen-resume-optimizer` | 依 enc_id 客製履歷 + 客製化報告 |
| `gen-career-mentor` | 能力差距 + 1/3/5 年職涯計畫 |
| `interviewer-ai` | 10 題魔鬼面試 + `interview-prep.html` |

## 安裝（在專案根目錄執行）

```bash
# 1. Clone（建議放在專案外層或 ~/ 下）
git clone https://github.com/hotfire-digital/wport-agents.git ../wport-agents

# 2. Symlink generator skills（路徑依你的 clone 位置調整）
ln -sf "$(pwd)/../wport-agents/skills/gen-resume"           .cursor/skills/gen-resume
ln -sf "$(pwd)/../wport-agents/skills/gen-resume-optimizer" .cursor/skills/gen-resume-optimizer
ln -sf "$(pwd)/../wport-agents/skills/gen-career-mentor"    .cursor/skills/gen-career-mentor
ln -sf "$(pwd)/../wport-agents/skills/interviewer-ai"       .cursor/skills/interviewer-ai

# 3. Symlink templates（gen-* skills 的 render.mjs 需要）
ln -sf "$(pwd)/../wport-agents/templates" templates
```

## 前置需求

```bash
npm install -g @wport/cli
wport doctor
node --version   # >= 18
```

## 輸出目錄

預設全部在 `doc/resume/`：

| 檔案 | 說明 |
|------|------|
| `resume.html` | 履歷（使用者開啟） |
| `resume-optimized.html` | 客製履歷 |
| `resume-customization.html` | 客製化報告 |
| `career-plan.html` | 職涯計畫 |
| `interview-prep.html` | 面試準備 |

## 典型流程

```
gen-resume          → doc/resume/resume.html
exec-wport-cli      → wport jobs search / view
gen-resume-optimizer → 針對 enc_id 客製
interviewer-ai      → 面試題報告
gen-career-mentor   → 長期職涯規劃
```

## Agent 規則

1. 若 `templates/` 不存在，先引導使用者跑上方安裝步驟。
2. 履歷 / 報告 HTML **必須**用 `node templates/.../render.mjs`，勿手寫 HTML。
3. 勿捏造履歷或公司資訊；JD 用 `wport jobs view` 取得。
4. 使用者主要開 `.html`；`.json` 供 skill 鏈內部使用。

## 驗證安裝

```bash
ls -la .cursor/skills/gen-resume
ls -la templates/resume/render.mjs
ls -la templates/report/render.mjs
```

三項都存在即代表 wport-agents 包就緒。
