#!/usr/bin/env bash
# Install everything needed to build and debug the site locally.
# Safe to re-run; skips work that is already done.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Ruby gems (Jekyll)"
if [ ! -x "$(command -v bundle)" ]; then
  echo "!! bundler not found on PATH" >&2
  exit 1
fi
bundle config set --local path vendor/bundle >/dev/null
bundle check >/dev/null 2>&1 || bundle install

echo "==> Node packages (Playwright)"
if [ ! -d node_modules/playwright ]; then
  npm install --no-audit --no-fund
fi

echo "==> Done. Next: scripts/debug.sh"
