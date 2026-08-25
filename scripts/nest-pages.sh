#!/usr/bin/env bash
# Nest the static export under the base path directory so GitHub Pages
# project URLs (/wellington-quizzes/...) resolve correctly.
set -euo pipefail

if [ ! -d out ]; then
  echo "no out/ directory — run npm run build first" >&2
  exit 1
fi

if [ -d "out/wellington-quizzes" ]; then
  exit 0
fi

mkdir -p "out/wellington-quizzes"
shopt -s dotglob
for item in out/*; do
  name="$(basename "$item")"
  if [ "$name" = "wellington-quizzes" ]; then
    continue
  fi
  mv "$item" "out/wellington-quizzes/"
done
shopt -u dotglob

echo "export nested under out/wellington-quizzes/"
