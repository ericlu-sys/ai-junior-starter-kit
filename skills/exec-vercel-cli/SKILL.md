---
name: exec-vercel-cli
description: >-
  Runs Vercel CLI for login, project linking, deploy, and env vars for hosting
  resume HTML (and related career reports) from this repo. Use when the user
  mentions Vercel, vercel deploy, preview URL, or putting resume HTML online.
---

# Vercel CLI

Upstream: [Vercel CLI](https://vercel.com/docs/cli)

Prefer project-local execution (no global install required):

```bash
npx vercel <command>
```

## Resume site deploy

履歷與報告產物在 `doc/resume/`。建議一個 Vercel Project，Root Directory = `doc/resume`。

| Vercel Project（建議命名） | Root Directory | Output | 說明 |
|---------------------------|----------------|--------|------|
| `<name>-resume` | `doc/resume` | `.`（即 `doc/resume` 內容） | 履歷 + 職涯報告 HTML |

履歷站設定在 [`doc/resume/vercel.json`](../../doc/resume/vercel.json)：

```json
{
  "buildCommand": "node ../../templates/resume/render.mjs resume.json resume.html && cp resume.html index.html",
  "installCommand": "",
  "rewrites": [{ "source": "/", "destination": "/resume.html" }]
}
```

或 Dashboard 手動設 Build Command（Root = repo 根時）：

```bash
node templates/resume/render.mjs doc/resume/resume.json doc/resume/resume.html
cp doc/resume/resume.html doc/resume/index.html
```

Output Directory = `doc/resume`。

### Deploy 前 checklist

- [ ] 確認目前 `vercel link` 的 project 名稱
- [ ] output 是 `doc/resume`，且有 `index.html` 或 `/` → `resume.html` rewrite
- [ ] 產物已由 `gen-resume`（或其他履歷 skill）寫入 `doc/resume/`

### 與其他 skill 分工

| 使用者意圖 | 先完成的 skill | 本 skill deploy |
|-----------|---------------|-----------------|
| 履歷上線 | `gen-resume`（產出 `doc/resume/*.html`） | `<name>-resume` |

## Auth

```bash
npx vercel login
npx vercel whoami
```

For CI, create a token in Vercel dashboard → Account Settings → Tokens. Store as `VERCEL_TOKEN` in the secret store — never commit values.

## Common commands

```bash
npx vercel link
npx vercel                    # preview
npx vercel --prod             # production — 先確認 project！
npx vercel ls
npx vercel env pull
npx vercel env add <NAME> production
```

Deploy 指定 project（CI / 避免 link 搞混）：

```bash
npx vercel deploy --prod --token="$VERCEL_TOKEN"
# 搭配環境變數 VERCEL_ORG_ID + VERCEL_PROJECT_ID
```

## First-time Dashboard setup

1. `npx vercel login`
2. **New Project** → 連到此 GitHub repo → 名稱 `<name>-resume`
   - Root Directory: `doc/resume`
   - 使用 `doc/resume/vercel.json` 或手動設履歷 build
3. 綁定網域（例：`resume.example.com`）

## CI checklist

- [ ] `VERCEL_TOKEN` in CI secrets
- [ ] `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID` 指向履歷 project

## Safety

- Never commit `.vercel/` unless the team agrees — or gitignore it.
- Confirm `outputDirectory` and linked project before `--prod`.
