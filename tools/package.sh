#!/bin/bash
# Build dist/<skill>.skill (a zip of the skill folder) for each skill.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p dist
for d in skills/*/; do
  name=$(basename "$d")
  rm -f "dist/$name.skill"
  (cd skills && zip -qr "../dist/$name.skill" "$name" -x "*/.DS_Store")
  echo "built dist/$name.skill"
done
