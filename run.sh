#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "→ Installing dependencies (public npm registry)…"
  npm install --registry https://registry.npmjs.org/
  npm rebuild esbuild >/dev/null 2>&1 || true
fi

echo "→ Starting dev server at http://localhost:3000"
npm run dev -- --open
