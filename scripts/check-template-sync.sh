#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ROBOTICS_DIR="$ROOT_DIR/robotics"
TEMPLATES_DIR="$ROOT_DIR/templates/club"

echo "=== MITS Template Sync Check ==="

ERRORS=0

# 1. Check for literal "robotics" in templates/club (excluding comments)
echo "Checking for 'robotics' occurrences in templates/club/..."
HITS=$(grep -rIn --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git -i "robotics" "$TEMPLATES_DIR" 2>/dev/null || true)

if [ -n "$HITS" ]; then
  NON_COMMENT_HITS=""
  while IFS= read -r line; do
    content=$(echo "$line" | cut -d: -f3-)
    if ! echo "$content" | grep -Eq '^[[:space:]]*(\/\/|\*|\/\*|#)'; then
      NON_COMMENT_HITS+="$line"$'\n'
    fi
  done <<< "$HITS"

  if [ -n "$NON_COMMENT_HITS" ]; then
    echo "ERROR: Found 'robotics' string in templates/club/ outside of comments:"
    echo "$NON_COMMENT_HITS"
    ERRORS=$((ERRORS + 1))
  fi
fi

# 2. Normalize function to ignore known branding differences
normalize() {
  sed \
    -e "s/Robotics Club/NORMALIZED_ORG_NAME/g" \
    -e "s/Club Admin/NORMALIZED_ORG_NAME/g" \
    -e "s/admin@robotics.test/NORMALIZED_ADMIN_EMAIL/g" \
    -e "s/admin@club.test/NORMALIZED_ADMIN_EMAIL/g" \
    -e "s/Autonomous Robotics Workshop/NORMALIZED_WORKSHOP/g" \
    -e "s/Annual Workshop 2026/NORMALIZED_WORKSHOP/g" \
    -e "s/1st Place - National Robotics Challenge 2026/NORMALIZED_ACHIEVEMENT/g" \
    -e "s/1st Place - National Challenge 2026/NORMALIZED_ACHIEVEMENT/g" \
    "$1"
}

# 3. Check shared directories for divergence
echo "Checking file equivalence between robotics/ and templates/club/..."

CHECKED=0
for sub in client admin; do
  for dir in app components lib public; do
    r_dir="$ROBOTICS_DIR/$sub/$dir"
    t_dir="$TEMPLATES_DIR/$sub/$dir"

    if [ -d "$r_dir" ]; then
      while IFS= read -r r_file; do
        rel="${r_file#$ROBOTICS_DIR/}"
        t_file="$TEMPLATES_DIR/$rel"
        CHECKED=$((CHECKED + 1))

        if [ ! -f "$t_file" ]; then
          echo "ERROR: Missing in template: $rel"
          ERRORS=$((ERRORS + 1))
          continue
        fi

        if ! diff -u <(normalize "$r_file") <(normalize "$t_file") > /dev/null 2>&1; then
          echo "ERROR: Divergence found in $rel:"
          diff -u <(normalize "$r_file") <(normalize "$t_file")
          ERRORS=$((ERRORS + 1))
        fi
      done < <(find "$r_dir" -type f | sort)
    fi

    if [ -d "$t_dir" ]; then
      while IFS= read -r t_file; do
        rel="${t_file#$TEMPLATES_DIR/}"
        r_file="$ROBOTICS_DIR/$rel"
        if [ ! -f "$r_file" ]; then
          echo "ERROR: File in template does not exist in robotics: $rel"
          ERRORS=$((ERRORS + 1))
        fi
      done < <(find "$t_dir" -type f | sort)
    fi
  done

  # Check config files
  for cfg in postcss.config.mjs tailwind.config.ts tsconfig.json; do
    r_cfg="$ROBOTICS_DIR/$sub/$cfg"
    t_cfg="$TEMPLATES_DIR/$sub/$cfg"
    if [ -f "$r_cfg" ] && [ -f "$t_cfg" ]; then
      CHECKED=$((CHECKED + 1))
      if ! diff -u "$r_cfg" "$t_cfg" > /dev/null 2>&1; then
        echo "ERROR: Divergence found in $sub/$cfg:"
        diff -u "$r_cfg" "$t_cfg"
        ERRORS=$((ERRORS + 1))
      fi
    fi
  done
done

echo "Checked $CHECKED shared files."

if [ "$ERRORS" -gt 0 ]; then
  echo "FAILED: Template drift or branding leak detected ($ERRORS issues found)."
  exit 1
fi

echo "SUCCESS: templates/club and robotics reference are in sync and generic."
exit 0
