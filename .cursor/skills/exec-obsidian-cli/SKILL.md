---
name: exec-obsidian-cli
description: >-
  用 obsidian-cli 或 obsidian:// URI 操作 Obsidian vault。個人知識庫應在
  **獨立 repo**（SSOT），與本教學專案分離。Use when the user mentions Obsidian,
  obsidian-cli, vault, personal notes, or knowledge base outside this repo.
---

# Obsidian CLI

> **架構原則**：課程筆記、面試紀錄、履歷草稿放 **Obsidian vault（獨立 repo）**；PRD、mock、Storybook 放 **本教學 repo**。Vault 是你的 SSOT，不要混進 `doc/`。

Obsidian **桌面版必須開啟**，CLI 才能生效。

## 安裝

```bash
npm install -g obsidian-cli
obsidian --help

# macOS：若 app 未開，先啟動
open -a Obsidian
```

## 常用操作

將 `<VAULT_NAME>`、`<NOTE_PATH>` 換成使用者自己的 vault（勿寫死個人路徑到本 repo）。

### 開啟 vault

```bash
obsidian open --vault <VAULT_NAME>
open "obsidian://open?vault=<VAULT_NAME>"
```

### 開啟筆記

```bash
obsidian open --vault <VAULT_NAME> --path "<NOTE_PATH>"
```

### 搜尋

```bash
obsidian search --vault <VAULT_NAME> --query "<QUERY>"
```

### 建立筆記

```bash
obsidian new --vault <VAULT_NAME> --path "<NOTE_PATH>" --content "<MARKDOWN>"
```

## 獨立知識庫 repo 建議

```bash
# 另開 repo（不在本教學專案內）
gh repo create my-obsidian-vault --private
cd my-obsidian-vault
git init && echo "# Knowledge Base" > README.md
# 將 Obsidian vault 資料夾設在此 repo 內，用 git 版控
```

本 repo 只放產品規格；個人學習與職涯筆記放 vault repo。

## Agent workflow

1. 確認 Obsidian 在跑；向使用者確認 `<VAULT_NAME>`。
2. 讀筆記內容供 PRD / 履歷 skill 使用，但**不要**把 vault 檔案 copy 進本 repo。
3. 批次建筆記用 `obsidian new`；URI 需 URL encode。

## Troubleshooting

| Symptom | Action |
|---------|--------|
| 指令無反應 | 開啟 Obsidian app |
| vault not found | 名稱大小寫須完全一致 |
| `command not found: obsidian` | `npm install -g obsidian-cli` |
