---
name: exec-vercel-cli
description: >-
  使用 Vercel CLI 部署前端 preview / production。有 Next.js、Storybook 靜態站
  或前端專案時使用。Use when the user mentions vercel, Vercel CLI, frontend
  deploy, preview URL, or vercel env.
---

# Vercel CLI

**有前端專案時**才需要。用來部署 preview、管理環境變數、本機模擬 Vercel 環境。

## 安裝

```bash
npm install -g vercel
vercel login
vercel whoami
```

## 首次連結專案

在 frontend 根目錄（例如 `storybook/` 或 Next.js app）：

```bash
vercel link          # 連到既有 Vercel project 或新建
vercel               # 部署 preview
vercel --prod        # 部署 production
```

## 本機開發

```bash
vercel dev           # 模擬 Vercel serverless / edge 行為（依 framework）
```

## 環境變數

```bash
vercel env ls
vercel env add <NAME> production
vercel env pull .env.local   # 拉 development env 到本機
```

## Storybook 靜態站

```bash
cd storybook
npm run build-storybook    # 或專案內 sb build
vercel deploy storybook-static --prebuilt
```

## Agent workflow

1. 確認使用者在正確的前端目錄（有 `package.json` / framework 設定）。
2. 首次部署前先 `vercel link` 或確認 `.vercel/project.json` 存在。
3. `--prod` 部署前先跟使用者確認。
4. 勿 commit `.env`、`.vercel` 內含 secret 的內容。

## Troubleshooting

| Symptom | Action |
|---------|--------|
| `vercel: command not found` | `npm install -g vercel` |
| Not logged in | `vercel login` |
| Wrong team/project | `vercel link` 重新選 project |
| Build fails | 本機先跑 `npm run build` 確認 |
