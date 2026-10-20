#!/usr/bin/env bash
set -euo pipefail
cd /workspace/Looksmaxx-coach
node -e 'if (Number(process.versions.node.split(".")[0]) < 24) { console.error("CHARETT setup expects Node 24 or newer; .nvmrc pins 24.19.0."); process.exit(1); }'
npm ci --cache /tmp/charett-npm-cache --no-audit --no-fund
npm run build
