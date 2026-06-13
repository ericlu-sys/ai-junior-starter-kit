---
name: exec-github-cli
description: >-
  使用 GitHub CLI (gh) 做版控、PR、Issue、CI workflow。大專生必裝工具。
  Use when the user mentions gh, GitHub CLI, creating/reviewing PRs, listing
  issues, checking workflow runs, or managing releases from the terminal.
---

# GitHub CLI (gh)

本專案**必裝** CLI。Agent 用 `gh` 查 repo、開 PR、看 CI，而不是只在網頁上操作。

## 安裝

```bash
# macOS
brew install gh

gh auth login
gh auth status
```

## Auth

```bash
gh auth status
gh auth login        # GitHub.com → HTTPS → browser
gh auth refresh -s workflow,repo   # 需要看 CI 時加 scope
```

Token 存在本機 keychain；勿 commit `GH_TOKEN` 或貼 token 到 chat。

## Repo

```bash
gh repo view <OWNER>/<REPO>
gh repo clone <OWNER>/<REPO>
gh repo create <REPO> --private --source=. --remote=origin --push
```

## Pull requests

```bash
gh pr list --state open
gh pr view <PR_NUMBER> --comments
gh pr checkout <PR_NUMBER>
gh pr create --base <BASE_BRANCH> --title "<TITLE>" --body "<BODY>"
gh pr diff <PR_NUMBER>
gh pr review <PR_NUMBER> --approve
gh pr merge <PR_NUMBER> --squash --delete-branch
```

## Issues

```bash
gh issue list --state open --label <LABEL>
gh issue view <ISSUE_NUMBER>
gh issue create --title "<TITLE>" --body "<BODY>" --label <LABEL>
```

## Actions / workflow runs

```bash
gh run list --workflow=<WORKFLOW_FILE> --limit 10
gh run view <RUN_ID> --log
gh run watch <RUN_ID>
gh run rerun <RUN_ID> --failed
```

## Agent workflow

1. 寫入操作前先 `gh auth status`。
2. 用 `gh pr view --json` / `gh run view --log` 取 context，少貼 URL。
3. 破壞性操作（merge、delete repo）先跟使用者確認。

## Troubleshooting

| Symptom | Action |
|---------|--------|
| `gh: command not found` | `brew install gh` |
| 401 / token expired | `gh auth login` 或 `gh auth refresh` |
| Missing scope | `gh auth refresh -s workflow,repo` |
| Wrong account | `gh auth switch` |
