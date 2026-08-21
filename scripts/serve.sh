#!/usr/bin/env bash
# Build and serve the site with live reload, for eyeballing changes.
#   scripts/serve.sh            # http://127.0.0.1:4000
set -euo pipefail
cd "$(dirname "$0")/.."
exec bundle exec jekyll serve --host 127.0.0.1 --port "${PORT:-4000}" --livereload "$@"
