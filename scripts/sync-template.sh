#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ROBOTICS_DIR="$ROOT_DIR/robotics"
TEMPLATES_DIR="$ROOT_DIR/templates/club"

usage() {
  echo "Usage: $0 [--from-robotics | --to-robotics | --check]"
  echo ""
  echo "Options:"
  echo "  --from-robotics   Sync changes from robotics/ into templates/club/ (applies generic branding)"
  echo "  --to-robotics     Sync changes from templates/club/ into robotics/ (applies robotics branding)"
  echo "  --check           Run check-template-sync.sh to verify sync status"
  exit 1
}

copy_dir() {
  local src="$1"
  local dst="$2"
  mkdir -p "$dst"
  (cd "$src" && tar --exclude='node_modules' --exclude='.next' --exclude='.env*' --exclude='tsconfig.tsbuildinfo' --exclude='next-env.d.ts' -cf - .) | (cd "$dst" && tar -xf -)
}

if [ $# -ne 1 ]; then
  usage
fi

ACTION="$1"

if [ "$ACTION" = "--check" ]; then
  exec bash "$ROOT_DIR/scripts/check-template-sync.sh"
elif [ "$ACTION" = "--from-robotics" ]; then
  echo "Syncing code from robotics/ -> templates/club/..."
  for sub in client admin; do
    for dir in app components lib public; do
      if [ -d "$ROBOTICS_DIR/$sub/$dir" ]; then
        copy_dir "$ROBOTICS_DIR/$sub/$dir" "$TEMPLATES_DIR/$sub/$dir"
      fi
    done
    for cfg in postcss.config.mjs tailwind.config.ts tsconfig.json; do
      if [ -f "$ROBOTICS_DIR/$sub/$cfg" ]; then
        cp "$ROBOTICS_DIR/$sub/$cfg" "$TEMPLATES_DIR/$sub/$cfg"
      fi
    done
  done

  # Apply generic replacements to templates
  sed -i "s/Robotics Club/Club Admin/g" "$TEMPLATES_DIR/admin/app/layout.tsx" 2>/dev/null || true
  sed -i "s/admin@robotics\.test/admin@club.test/g" "$TEMPLATES_DIR/admin/app/login/page.tsx" 2>/dev/null || true
  sed -i "s/Autonomous Robotics Workshop/Annual Workshop 2026/g" "$TEMPLATES_DIR/admin/components/EventsManager.tsx" 2>/dev/null || true
  sed -i "s/1st Place - National Robotics Challenge 2026/1st Place - National Challenge 2026/g" "$TEMPLATES_DIR/admin/components/AchievementsManager.tsx" 2>/dev/null || true

  echo "✓ Completed sync from robotics to templates/club."
  echo "Running verification..."
  bash "$ROOT_DIR/scripts/check-template-sync.sh"

elif [ "$ACTION" = "--to-robotics" ]; then
  echo "Syncing code from templates/club/ -> robotics/..."
  for sub in client admin; do
    for dir in app components lib public; do
      if [ -d "$TEMPLATES_DIR/$sub/$dir" ]; then
        copy_dir "$TEMPLATES_DIR/$sub/$dir" "$ROBOTICS_DIR/$sub/$dir"
      fi
    done
    for cfg in postcss.config.mjs tailwind.config.ts tsconfig.json; do
      if [ -f "$TEMPLATES_DIR/$sub/$cfg" ]; then
        cp "$TEMPLATES_DIR/$sub/$cfg" "$ROBOTICS_DIR/$sub/$cfg"
      fi
    done
  done

  # Restore robotics branding
  sed -i "s/Club Admin/Robotics Club/g" "$ROBOTICS_DIR/admin/app/layout.tsx" 2>/dev/null || true
  sed -i "s/admin@club\.test/admin@robotics.test/g" "$ROBOTICS_DIR/admin/app/login/page.tsx" 2>/dev/null || true
  sed -i "s/Annual Workshop 2026/Autonomous Robotics Workshop/g" "$ROBOTICS_DIR/admin/components/EventsManager.tsx" 2>/dev/null || true
  sed -i "s/1st Place - National Challenge 2026/1st Place - National Robotics Challenge 2026/g" "$ROBOTICS_DIR/admin/components/AchievementsManager.tsx" 2>/dev/null || true

  echo "✓ Completed sync from templates/club to robotics."
  echo "Running verification..."
  bash "$ROOT_DIR/scripts/check-template-sync.sh"

else
  usage
fi
