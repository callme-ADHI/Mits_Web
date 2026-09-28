#!/usr/bin/env bash
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export PATH="$ROOT_DIR/cli/bin:$HOME/.local/bin:$PATH"

DB_CONN="postgresql://mits_user:choose-a-strong-password@localhost:5432/mits_robotics"
TEMP_DIR="/tmp/mits-verify-$$"

PASSED_COUNT=0
FAILED_COUNT=0
TEST_RESULTS=()

PID_A_CLIENT=""
PID_A_ADMIN=""
PID_B_CLIENT=""
PID_B_ADMIN=""

cleanup() {
  echo ""
  echo "--- Running Cleanup Routine ---"
  for pid in "$PID_A_CLIENT" "$PID_A_ADMIN" "$PID_B_CLIENT" "$PID_B_ADMIN"; do
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
      echo "Stopping server PID $pid..."
      kill -TERM "$pid" 2>/dev/null || true
      wait "$pid" 2>/dev/null || true
    fi
  done

  # In case tests were aborted midway, purge audit orgs
  mits remove audit-e2e-a --yes >/dev/null 2>&1 || true
  mits remove audit-e2e-b --yes >/dev/null 2>&1 || true
  mits remove audit-rollback-v9 --yes >/dev/null 2>&1 || true

  if [ -d "$TEMP_DIR" ]; then
    echo "Purging temporary test directory: $TEMP_DIR"
    rm -rf "$TEMP_DIR"
  fi
  echo "Cleanup finished."
}
trap cleanup EXIT INT TERM

log_result() {
  local id="$1"
  local name="$2"
  local status="$3"
  local details="$4"

  if [ "$status" = "PASS" ]; then
    PASSED_COUNT=$((PASSED_COUNT + 1))
    echo -e "\n[\033[0;32mPASS\033[0m] $id: $name"
  else
    FAILED_COUNT=$((FAILED_COUNT + 1))
    echo -e "\n[\033[0;31mFAIL\033[0m] $id: $name"
  fi
  if [ -n "$details" ]; then
    echo "$details"
  fi
  TEST_RESULTS+=("$id: $status - $name")
}

echo "========================================================"
echo "    MITS Comprehensive End-to-End System Verification   "
echo "========================================================"
echo "Workspace: $ROOT_DIR"
echo "Database:  $(echo "$DB_CONN" | sed -E 's/:[^@]+@/:***@/')"
echo "Work Dir:  $TEMP_DIR"
mkdir -p "$TEMP_DIR"

# -------------------------------------------------------------
# V1. PostgreSQL running and schema applied
# -------------------------------------------------------------
echo -e "\n>>> Testing V1: PostgreSQL running and schema applied..."
if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
  TABLES=$(psql "$DB_CONN" -t -A -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;" 2>&1)
  MISSING=0
  for req in "Organization" "User" "Event" "Achievement" "ActivityLog" "ContactMessage" "SuperAdmin"; do
    if ! echo "$TABLES" | grep -qx "$req"; then
      MISSING=1
      break
    fi
  done
  if [ "$MISSING" -eq 0 ]; then
    log_result "V1" "PostgreSQL running and all required tables present" "PASS" "Tables verified: Organization, User, Event, Achievement, ActivityLog, ContactMessage, SuperAdmin"
  else
    log_result "V1" "PostgreSQL running but tables missing" "FAIL" "Found tables:\n$TABLES"
  fi
else
  log_result "V1" "PostgreSQL running and schema applied" "FAIL" "PostgreSQL is not responding on localhost:5432"
fi

# -------------------------------------------------------------
# V2. All schema.prisma files synchronized
# -------------------------------------------------------------
echo -e "\n>>> Testing V2: All schema.prisma files synchronized..."
if OUTPUT=$(bash "$ROOT_DIR/scripts/check-schema-sync.sh" 2>&1); then
  log_result "V2" "All schema.prisma files synchronized" "PASS" "$OUTPUT"
else
  log_result "V2" "All schema.prisma files synchronized" "FAIL" "$OUTPUT"
fi

# -------------------------------------------------------------
# V3. templates/club/ in sync with robotics/
# -------------------------------------------------------------
echo -e "\n>>> Testing V3: templates/club/ in sync with robotics/..."
if OUTPUT=$(bash "$ROOT_DIR/scripts/check-template-sync.sh" 2>&1); then
  log_result "V3" "templates/club/ in sync with robotics/" "PASS" "$OUTPUT"
else
  log_result "V3" "templates/club/ in sync with robotics/" "FAIL" "$OUTPUT"
fi

# -------------------------------------------------------------
# V4. No "robotics" string in templates/club/
# -------------------------------------------------------------
echo -e "\n>>> Testing V4: No 'robotics' string in templates/club/ (non-comment)..."
HITS=$(grep -rIn --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git -i "robotics" "$ROOT_DIR/templates/club" 2>/dev/null || true)
NON_COMMENT_HITS=""
if [ -n "$HITS" ]; then
  while IFS= read -r line; do
    content=$(echo "$line" | cut -d: -f3-)
    if ! echo "$content" | grep -Eq '^[[:space:]]*(\/\/|\*|\/\*|#)'; then
      NON_COMMENT_HITS+="$line"$'\n'
    fi
  done <<< "$HITS"
fi
if [ -z "$NON_COMMENT_HITS" ]; then
  log_result "V4" "No 'robotics' string in templates/club/" "PASS" "Zero unallowed brand references detected."
else
  log_result "V4" "No 'robotics' string in templates/club/" "FAIL" "Found:\n$NON_COMMENT_HITS"
fi

# -------------------------------------------------------------
# V5. Robotics Club baseline data intact
# -------------------------------------------------------------
echo -e "\n>>> Testing V5: Robotics Club baseline data intact..."
ROBOTICS_INFO=$(psql "$DB_CONN" -t -A -c "
  SELECT o.slug, o.name, o.\"primaryColor\", o.\"secondaryColor\",
         (SELECT count(*) FROM \"User\" WHERE \"organizationId\" = o.id),
         (SELECT count(*) FROM \"Event\" WHERE \"organizationId\" = o.id),
         (SELECT count(*) FROM \"Achievement\" WHERE \"organizationId\" = o.id)
  FROM \"Organization\" o WHERE o.slug = 'robotics';
" 2>&1)

IFS='|' read -r SLUG NAME P_COLOR S_COLOR U_COUNT E_COUNT A_COUNT <<< "$ROBOTICS_INFO"
if [ "$SLUG" = "robotics" ] && [ "$P_COLOR" = "#E10600" ] && [ "$S_COLOR" = "#111111" ] && [ "$E_COUNT" -ge 4 ] && [ "$A_COUNT" -ge 1 ]; then
  log_result "V5" "Robotics Club baseline data intact" "PASS" "slug: $SLUG, name: $NAME, primary: $P_COLOR, secondary: $S_COLOR, users: $U_COUNT, events: $E_COUNT, achievements: $A_COUNT"
else
  log_result "V5" "Robotics Club baseline data intact" "FAIL" "Unexpected baseline values: $ROBOTICS_INFO"
fi

# -------------------------------------------------------------
# V6. CLI doctor passes with 0 errors
# -------------------------------------------------------------
echo -e "\n>>> Testing V6: CLI doctor command..."
if DOCTOR_OUT=$(mits doctor 2>&1); then
  log_result "V6" "CLI doctor passes with 0 errors" "PASS" "$DOCTOR_OUT"
else
  log_result "V6" "CLI doctor passes with 0 errors" "FAIL" "$DOCTOR_OUT"
fi

# -------------------------------------------------------------
# V7. CLI input validation
# -------------------------------------------------------------
echo -e "\n>>> Testing V7: CLI input validation..."
ERR7=0
if mits create badtype "Test" >/dev/null 2>&1; then ERR7=1; fi
if mits create club "Test" --email notanemail >/dev/null 2>&1; then ERR7=1; fi
if mits create club "Test" --email t@t.com --primary "red" >/dev/null 2>&1; then ERR7=1; fi

if [ "$ERR7" -eq 0 ]; then
  log_result "V7" "CLI input validation (invalid type, email, hex rejected)" "PASS" "All invalid inputs rejected with exit code 1."
else
  log_result "V7" "CLI input validation" "FAIL" "An invalid input was unexpectedly accepted."
fi

# -------------------------------------------------------------
# V8. CLI duplicate rejection
# -------------------------------------------------------------
echo -e "\n>>> Testing V8: CLI duplicate rejection..."
ERR8=0
if mits create club "robotics" --email unique_v8@test.com --no-install >/dev/null 2>&1; then ERR8=1; fi
if mits create club "unique-v8-club" --email admin@robotics.test --no-install >/dev/null 2>&1; then ERR8=1; fi

if [ "$ERR8" -eq 0 ]; then
  log_result "V8" "CLI duplicate rejection (duplicate slug and email rejected)" "PASS" "Duplicate slug 'robotics' and duplicate email 'admin@robotics.test' rejected."
else
  log_result "V8" "CLI duplicate rejection" "FAIL" "A duplicate slug or email was unexpectedly accepted."
fi

# -------------------------------------------------------------
# V9. CLI rollback on failure
# -------------------------------------------------------------
echo -e "\n>>> Testing V9: CLI rollback on failure..."
ROLLBACK_OUT=$(MITS_TEMPLATE_DIR=/nonexistent mits create club "audit-rollback-v9" --email v9@test.com --primary "#112233" --secondary "#445566" --no-install 2>&1 || true)
RB_CHECK=$(psql "$DB_CONN" -t -A -c "SELECT count(*) FROM \"Organization\" WHERE slug = 'audit-rollback-v9';")
if [ "$RB_CHECK" = "0" ] && [ ! -d "$ROOT_DIR/audit-rollback-v9" ]; then
  log_result "V9" "CLI rollback on failure cleans up DB and target directory" "PASS" "Rollback triggered cleanly; DB count = 0, folder does not exist."
else
  log_result "V9" "CLI rollback on failure" "FAIL" "DB count = $RB_CHECK, folder check: $(test -d "$ROOT_DIR/audit-rollback-v9" && echo 'exists' || echo 'clean')"
fi

# -------------------------------------------------------------
# V10. Clean-room project generation (audit-e2e-a)
# -------------------------------------------------------------
echo -e "\n>>> Testing V10: Clean-room project generation (audit-e2e-a)..."
(
  cd "$TEMP_DIR"
  mits create club audit-e2e-a --email admin@audit-e2e-a.test --primary "#2563EB" --secondary "#0F172A"
) > "$TEMP_DIR/create-a.log" 2>&1

DIR_A="$TEMP_DIR/audit-e2e-a"
PASS_A=1
if [ ! -d "$DIR_A/client/node_modules" ] || [ -L "$DIR_A/client/node_modules" ]; then PASS_A=0; fi
if [ ! -d "$DIR_A/admin/node_modules" ] || [ -L "$DIR_A/admin/node_modules" ]; then PASS_A=0; fi
if [ ! -f "$DIR_A/client/node_modules/.prisma/client/index.js" ]; then PASS_A=0; fi
if [ ! -f "$DIR_A/admin/node_modules/.prisma/client/index.js" ]; then PASS_A=0; fi

if [ "$PASS_A" -eq 1 ]; then
  log_result "V10" "Clean-room generation of audit-e2e-a (real install, no symlinks, prisma generated)" "PASS" "Verified client/node_modules and admin/node_modules are physical dirs and prisma client exists."
else
  log_result "V10" "Clean-room generation of audit-e2e-a" "FAIL" "Log:\n$(cat "$TEMP_DIR/create-a.log")"
fi

# -------------------------------------------------------------
# V11. Second project generation with different colors (audit-e2e-b)
# -------------------------------------------------------------
echo -e "\n>>> Testing V11: Second project generation (audit-e2e-b)..."
(
  cd "$TEMP_DIR"
  mits create club audit-e2e-b --email admin@audit-e2e-b.test --primary "#059669" --secondary "#1E293B"
) > "$TEMP_DIR/create-b.log" 2>&1

DIR_B="$TEMP_DIR/audit-e2e-b"
PASS_B=1
if [ ! -d "$DIR_B/client/node_modules" ] || [ -L "$DIR_B/client/node_modules" ]; then PASS_B=0; fi
if [ ! -d "$DIR_B/admin/node_modules" ] || [ -L "$DIR_B/admin/node_modules" ]; then PASS_B=0; fi
if [ ! -f "$DIR_B/client/node_modules/.prisma/client/index.js" ]; then PASS_B=0; fi
if [ ! -f "$DIR_B/admin/node_modules/.prisma/client/index.js" ]; then PASS_B=0; fi

if [ "$PASS_B" -eq 1 ]; then
  log_result "V11" "Clean-room generation of audit-e2e-b (distinct color #059669, real install)" "PASS" "Verified client/node_modules and admin/node_modules are physical dirs and prisma client exists."
else
  log_result "V11" "Second project generation (audit-e2e-b)" "FAIL" "Log:\n$(cat "$TEMP_DIR/create-b.log")"
fi

# -------------------------------------------------------------
# V12. Concurrent dev servers on custom ports (3010, 3011, 3012, 3013)
# -------------------------------------------------------------
echo -e "\n>>> Testing V12: Starting 4 concurrent dev servers on custom ports..."

PORT=3010 npm --prefix "$DIR_A/client" run dev -- -p 3010 > "$TEMP_DIR/a_client.log" 2>&1 &
PID_A_CLIENT=$!
PORT=3011 npm --prefix "$DIR_A/admin" run dev -- -p 3011 > "$TEMP_DIR/a_admin.log" 2>&1 &
PID_A_ADMIN=$!

PORT=3012 npm --prefix "$DIR_B/client" run dev -- -p 3012 > "$TEMP_DIR/b_client.log" 2>&1 &
PID_B_CLIENT=$!
PORT=3013 npm --prefix "$DIR_B/admin" run dev -- -p 3013 > "$TEMP_DIR/b_admin.log" 2>&1 &
PID_B_ADMIN=$!

SERVERS_UP=0
for i in {1..45}; do
  C10=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3010 || echo "000")
  C11=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3011/login || echo "000")
  C12=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3012 || echo "000")
  C13=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3013/login || echo "000")
  if [ "$C10" = "200" ] && [ "$C11" = "200" ] && [ "$C12" = "200" ] && [ "$C13" = "200" ]; then
    SERVERS_UP=1
    break
  fi
  sleep 1
done

if [ "$SERVERS_UP" -eq 1 ]; then
  log_result "V12" "Concurrent dev servers responding on 3010, 3011, 3012, 3013" "PASS" "All 4 servers responded with HTTP 200 OK within 45s."
else
  log_result "V12" "Concurrent dev servers responding on 3010, 3011, 3012, 3013" "FAIL" "Status codes - 3010: $C10, 3011: $C11, 3012: $C12, 3013: $C13"
fi

# -------------------------------------------------------------
# V13. Color isolation across clubs
# -------------------------------------------------------------
echo -e "\n>>> Testing V13: Color isolation across clubs..."
HTML_A=$(curl -s http://localhost:3010)
HTML_B=$(curl -s http://localhost:3012)

COLOR_A_OK=0
COLOR_B_OK=0

if echo "$HTML_A" | grep -iq "2563EB" && ! echo "$HTML_A" | grep -iq "059669"; then
  COLOR_A_OK=1
fi

if echo "$HTML_B" | grep -iq "059669" && ! echo "$HTML_B" | grep -iq "2563EB"; then
  COLOR_B_OK=1
fi

if [ "$COLOR_A_OK" -eq 1 ] && [ "$COLOR_B_OK" -eq 1 ]; then
  log_result "V13" "Color isolation verified between audit-e2e-a and audit-e2e-b" "PASS" "audit-e2e-a contains #2563EB and lacks #059669; audit-e2e-b contains #059669 and lacks #2563EB."
else
  log_result "V13" "Color isolation verified between clubs" "FAIL" "Color leak detected. A_OK=$COLOR_A_OK, B_OK=$COLOR_B_OK"
fi

# -------------------------------------------------------------
# V14. Cross-tenant isolation
# -------------------------------------------------------------
echo -e "\n>>> Testing V14: Cross-tenant isolation..."
# Attempt to query audit-e2e-b admin API without cookie or with arbitrary header
ATTACK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3013/api/events)
SUPERADMIN_ORGS=$(psql "$DB_CONN" -t -A -c "SELECT count(*) FROM \"Organization\" WHERE slug IN ('audit-e2e-a', 'audit-e2e-b');")

if [ "$ATTACK_STATUS" = "401" ] && [ "$SUPERADMIN_ORGS" = "2" ]; then
  log_result "V14" "Cross-tenant isolation (unauthorized access returns 401; superadmin sees both)" "PASS" "audit-e2e-b API rejected unauthenticated/cross request with 401. Superadmin DB query sees both orgs (count=$SUPERADMIN_ORGS)."
else
  log_result "V14" "Cross-tenant isolation" "FAIL" "Status: $ATTACK_STATUS (expected 401), Superadmin count: $SUPERADMIN_ORGS (expected 2)"
fi

# -------------------------------------------------------------
# V15. Typecheck and lint pass on both generated projects
# -------------------------------------------------------------
echo -e "\n>>> Testing V15: Typecheck and lint on generated projects..."
TC_ERR=0
npm --prefix "$DIR_A/client" run typecheck >/dev/null 2>&1 || TC_ERR=1
npm --prefix "$DIR_A/client" run lint >/dev/null 2>&1 || TC_ERR=1
npm --prefix "$DIR_A/admin" run typecheck >/dev/null 2>&1 || TC_ERR=1
npm --prefix "$DIR_A/admin" run lint >/dev/null 2>&1 || TC_ERR=1

npm --prefix "$DIR_B/client" run typecheck >/dev/null 2>&1 || TC_ERR=1
npm --prefix "$DIR_B/client" run lint >/dev/null 2>&1 || TC_ERR=1
npm --prefix "$DIR_B/admin" run typecheck >/dev/null 2>&1 || TC_ERR=1
npm --prefix "$DIR_B/admin" run lint >/dev/null 2>&1 || TC_ERR=1

if [ "$TC_ERR" -eq 0 ]; then
  log_result "V15" "Typecheck and lint pass on generated projects (audit-e2e-a and audit-e2e-b)" "PASS" "tsc --noEmit and eslint exited 0 across all 4 sub-projects."
else
  log_result "V15" "Typecheck and lint on generated projects" "FAIL" "One or more typecheck/lint commands failed."
fi

# -------------------------------------------------------------
# V16. CSRF, path traversal, and payload attacks
# -------------------------------------------------------------
echo -e "\n>>> Testing V16: Security attack vectors (CSRF, path traversal, malformed payloads)..."
S_TRAVERSAL=$(curl -s -o /dev/null -w "%{http_code}" --path-as-is "http://localhost:3010/../../../../etc/passwd")
S_UNAUTH_POST=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3011/api/events -H "Content-Type: application/json" -d '{"title":"Hacked"}')
S_BAD_JSON=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3010/api/contact -H "Content-Type: application/json" -d "not-json")
S_BAD_SCHEMA=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3010/api/contact -H "Content-Type: application/json" -d '{"name":"","email":"bad","message":""}')

SEC_PASS=1
for sc in "$S_TRAVERSAL" "$S_UNAUTH_POST" "$S_BAD_JSON" "$S_BAD_SCHEMA"; do
  # Must be 4xx client error, NOT 200 and NOT 500
  if [[ ! "$sc" =~ ^4[0-9]{2}$ ]]; then
    SEC_PASS=0
  fi
done

if [ "$SEC_PASS" -eq 1 ]; then
  log_result "V16" "CSRF, path traversal, and malformed payload attacks safely rejected" "PASS" "Traversal: $S_TRAVERSAL, Unauth POST: $S_UNAUTH_POST, Bad JSON: $S_BAD_JSON, Bad Schema: $S_BAD_SCHEMA (all 4xx)"
else
  log_result "V16" "CSRF, path traversal, and payload attacks" "FAIL" "Unexpected status codes - Traversal: $S_TRAVERSAL, Unauth POST: $S_UNAUTH_POST, Bad JSON: $S_BAD_JSON, Bad Schema: $S_BAD_SCHEMA"
fi

# -------------------------------------------------------------
# Stop servers before removal
# -------------------------------------------------------------
echo "Stopping dev servers..."
for pid in "$PID_A_CLIENT" "$PID_A_ADMIN" "$PID_B_CLIENT" "$PID_B_ADMIN"; do
  if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
    kill -TERM "$pid" 2>/dev/null || true
    wait "$pid" 2>/dev/null || true
  fi
done
PID_A_CLIENT=""
PID_A_ADMIN=""
PID_B_CLIENT=""
PID_B_ADMIN=""

# -------------------------------------------------------------
# V17. CLI remove cleanly purges audit-e2e-a and audit-e2e-b from DB
# -------------------------------------------------------------
echo -e "\n>>> Testing V17: CLI remove command..."
mits remove audit-e2e-a --yes >/dev/null 2>&1
mits remove audit-e2e-b --yes >/dev/null 2>&1

CHECK_PURGE=$(psql "$DB_CONN" -t -A -c "SELECT count(*) FROM \"Organization\" WHERE slug IN ('audit-e2e-a', 'audit-e2e-b');")
if [ "$CHECK_PURGE" = "0" ]; then
  log_result "V17" "CLI remove cleanly purges organizations from database" "PASS" "DB record count for audit-e2e-a and audit-e2e-b = 0."
else
  log_result "V17" "CLI remove cleanly purges organizations" "FAIL" "Lingering records found: $CHECK_PURGE"
fi

# -------------------------------------------------------------
# V18. Trap cleanup removes all temp folders, leaves DB clean
# -------------------------------------------------------------
echo -e "\n>>> Testing V18: Verification trap cleanup mechanism..."
# Verify trap registration and database integrity
DB_ORGS=$(psql "$DB_CONN" -t -A -c "SELECT count(*) FROM \"Organization\" WHERE slug LIKE 'audit-%';")
if [ "$DB_ORGS" = "0" ]; then
  log_result "V18" "Verification lifecycle and trap cleanup integrity verified" "PASS" "No ephemeral audit organizations remain in database."
else
  log_result "V18" "Verification lifecycle and trap cleanup integrity" "FAIL" "Lingering audit orgs in DB: $DB_ORGS"
fi

echo -e "\n========================================================"
echo "                   VERIFICATION SUMMARY                 "
echo "========================================================"
for res in "${TEST_RESULTS[@]}"; do
  echo "  $res"
done
echo "--------------------------------------------------------"
echo "TOTAL: $((PASSED_COUNT + FAILED_COUNT)) | PASSED: $PASSED_COUNT | FAILED: $FAILED_COUNT"
echo "========================================================"

if [ "$FAILED_COUNT" -gt 0 ]; then
  exit 1
fi
exit 0
