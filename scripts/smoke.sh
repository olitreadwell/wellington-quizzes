#!/usr/bin/env bash
# Serves the static export from out/ and curls the key routes.
set -euo pipefail

PORT="${SMOKE_PORT:-3521}"
BASE="http://localhost:$PORT"

if [ ! -d out ]; then
  echo "building..."
  npm run build >/dev/null
fi

echo "serving out/ on port $PORT..."
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory out &
pid=$!
trap 'kill "$pid" 2>/dev/null || true' EXIT

for _ in $(seq 1 40); do
  if curl -fsS "$BASE/" >/dev/null 2>&1; then
    break
  fi
  sleep 0.25
done

check() {
  local label="$1" expected="$2" actual="$3"
  if [ "$actual" != "$expected" ]; then
    echo "FAIL: $label: got $actual, want $expected"
    exit 1
  fi
  echo "ok: $label"
}

check "site root status" "200" "$(curl -s -o /dev/null -w '%{http_code}' "$BASE/")"
check "page mentions quizzes" "Wellington Quizzes" "$(curl -s "$BASE/" | grep -o 'Wellington Quizzes' | head -1)"

echo "smoke: all green"
