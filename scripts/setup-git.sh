#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

chmod +x scripts/git-hooks/prepare-commit-msg

git config --local core.hooksPath scripts/git-hooks
git config --local user.name "곽한승"
git config --local user.email "116946770+a4file@users.noreply.github.com"

echo "Git hooks enabled (scripts/git-hooks)."
echo "Commit author: $(git config --local user.name) <$(git config --local user.email)>"
echo "Co-authored-by trailers from Cursor/a4file-ai are removed automatically."
