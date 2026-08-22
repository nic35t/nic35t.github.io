#!/usr/bin/env bash
# Full local debug pass: static checks, build, then browser diagnostics.
#
#   scripts/debug.sh                     # everything
#   scripts/debug.sh --skip-build        # reuse the existing _site
#   scripts/debug.sh --viewport mobile   # one viewport only
#
# Extra arguments are forwarded to scripts/diagnose.mjs.
set -uo pipefail

cd "$(dirname "$0")/.."

PORT="${PORT:-4000}"
SKIP_BUILD=0
DIAGNOSE_ARGS=()

while [ $# -gt 0 ]; do
  case "$1" in
    --skip-build) SKIP_BUILD=1; shift ;;
    *) DIAGNOSE_ARGS+=("$1"); shift ;;
  esac
done

STATUS=0

echo "=== 1/3  static checks ==="
bundle exec ruby scripts/doctor.rb || STATUS=1

echo
echo "=== 2/3  jekyll build ==="
if [ "$SKIP_BUILD" -eq 1 ]; then
  echo "skipped (--skip-build)"
else
  # Deprecation noise from the vendored Susy/Sass drowns out real errors.
  if ! bundle exec jekyll build --quiet 2>build.log; then
    echo "!! build failed:"
    grep -v -i "deprecat\|^\s*$\|^\s*[╷│╵^]\|More info and automated migrator\|repetitive deprecation" build.log | head -20
    rm -f build.log
    exit 1
  fi
  grep -i "liquid warning\|error\|warn" build.log | grep -v -i "deprecat" | head -10
  rm -f build.log
  echo "build ok"
fi

echo
echo "=== 3/3  browser diagnostics ==="
python3 -m http.server "$PORT" --directory _site --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null' EXIT

for _ in $(seq 1 40); do
  curl -sf -o /dev/null "http://127.0.0.1:${PORT}/" && break
  sleep 0.25
done

node scripts/diagnose.mjs --url "http://127.0.0.1:${PORT}" "${DIAGNOSE_ARGS[@]}" || STATUS=1

exit "$STATUS"
