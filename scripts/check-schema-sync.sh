#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Checking schema.prisma files under $ROOT_DIR..."

FILES=$(find "$ROOT_DIR" -name "schema.prisma" -not -path "*/node_modules/*" -not -path "*/.next/*" | sort)

if [ -z "$FILES" ]; then
  echo "Error: No schema.prisma files found."
  exit 1
fi

DISTINCT_HASHES=()

while IFS= read -r file; do
  HASH=$(md5sum "$file" | awk '{print $1}')
  echo "$HASH  $file"
  if [[ ! " ${DISTINCT_HASHES[*]:-} " =~ " ${HASH} " ]]; then
    DISTINCT_HASHES+=("$HASH")
  fi
done <<< "$FILES"

if [ ${#DISTINCT_HASHES[@]} -gt 1 ]; then
  echo "ERROR: Schema drift detected! Found ${#DISTINCT_HASHES[@]} different schema versions."
  exit 1
fi

echo "SUCCESS: All schema.prisma files are synchronized."
exit 0
