#!/usr/bin/env bash
set -euo pipefail
rm -rf dist
mkdir -p dist
zip -r dist/maszynka-pterodactyl-discord-eggs.zip eggs README.md docs LICENSE >/dev/null
zip -r dist/maszynka-bundled-bots.zip bundled README.md docs LICENSE >/dev/null
echo "Created release archives in dist/"
