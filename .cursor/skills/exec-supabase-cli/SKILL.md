---
name: exec-supabase-cli
description: >-
  使用 Supabase CLI 管理 PostgreSQL、Auth、Edge Functions 與本地 Docker 開發環境。
  有後端或資料庫需求時使用。Use when the user mentions supabase, migrations,
  supabase start, db push, or gen types.
---

# Supabase CLI

**有後端 / 資料庫**時才需要。管理 schema migration、本地 Postgres、型別產生。

## 安裝

```bash
npm install -g supabase
supabase login
supabase --version
```

需要 Docker Desktop 才能跑 `supabase start`。

## 初始化專案

```bash
supabase init
supabase start       # 本地 stack（API、DB、Studio）
supabase status      # 印出 local URL 與 keys
```

## Migration

```bash
supabase migration new <name>
supabase db push     # 推到 linked remote project
supabase db reset    # 本地重跑所有 migration（會清資料）
```

## 連結 remote project

```bash
supabase link --project-ref <PROJECT_REF>
supabase db pull     # 從 remote 拉 schema
```

## TypeScript 型別

```bash
supabase gen types typescript --local > src/types/supabase.ts
```

## Edge Functions

```bash
supabase functions new <name>
supabase functions serve
supabase functions deploy <name>
```

## Agent workflow

1. `supabase start` 前確認 Docker 在跑。
2. `db reset` / `db push` 等會改資料的操作先跟使用者確認。
3. 勿 commit `supabase/.env` 或 service role key。
4. migration 檔名用 snake_case，一個 migration 一個 logical change。

## Troubleshooting

| Symptom | Action |
|---------|--------|
| `supabase: command not found` | `npm install -g supabase` |
| Docker not running | 啟動 Docker Desktop 後重試 `supabase start` |
| Link failed | `supabase login` 後 `supabase link` |
| Port conflict | `supabase stop` 後重啟，或改 `config.toml` ports |
