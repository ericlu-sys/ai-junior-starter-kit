---
name: exec-wport-cli
description: >-
  操作 @wport/cli：搜尋職缺、檢視 JD、doctor 診斷。Use when the user mentions
  wport CLI, wport jobs, job search, enc_id, wport doctor, or wport config.
---

# exec-wport-cli

[wport 職航站](https://www.wport.me/) 終端機介面，查真實職缺給履歷客製化、面試準備使用。

Install: `npm install -g @wport/cli`（Node.js >= 18.17）

## 安裝與診斷

```bash
npm install -g @wport/cli
wport doctor
```

## 搜尋職缺

```bash
wport jobs search --keyword backend
wport jobs search --keyword backend --minimal --output json
wport jobs search --keyword backend --location 6001001000 --minimal --output json
```

## 檢視 JD

```bash
wport jobs view <enc_id> --output json
wport jobs view <enc_id> --field job_info.salary_display
```

## Config

```bash
wport config path
wport config set locale zh-TW
wport config set output json
```

## Agent workflow

1. 搜尋用 `--minimal --output json` 省 token。
2. 深度分析再 `wport jobs view <enc_id> --output json`。
3. 失敗時先 `wport doctor`（exit code 4 = 網路/server）。
4. 公開 API 限流 1200 req/min/IP，勿多 process 爬蟲。

## 與 wport Skills 搭配

| 下一步 | Skill |
|--------|-------|
| 寫履歷 | `gen-resume`（需先 `wport-agents-setup`） |
| 客製履歷 | `gen-resume-optimizer` |
| 職涯規劃 | `gen-career-mentor` |
| 模擬面試 | `interviewer-ai` |

完整指令參考：[npm @wport/cli](https://www.npmjs.com/package/@wport/cli)

## Troubleshooting

| Symptom | Action |
|---------|--------|
| `wport: command not found` | `npm install -g @wport/cli` |
| Exit code 4 | `wport doctor` |
| Empty results | 放寬 keyword 或檢查 location code |
