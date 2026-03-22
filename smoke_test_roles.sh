#!/bin/zsh
set +e
BASE='http://localhost:8080/api'
TS=$(date +%s)
STUDENT_EMAIL="student${TS}@example.com"
STAFF_EMAIL="staff${TS}@example.com"
ADMIN_EMAIL='admin@gmail.com'
ADMIN_PASS='admin123'
PASS=0
FAIL=0

extract_json_field() {
  local json="$1"
  local key="$2"
  echo "$json" | sed -n "s/.*\"${key}\":\"\{0,1\}\([^\",}]*\).*/\1/p" | head -n1
}

http_call() {
  local method="$1"
  local url="$2"
  local body="$3"
  local auth="$4"
  if [[ -n "$body" ]]; then
    if [[ -n "$auth" ]]; then
      curl -s -i -X "$method" "$url" -H 'Content-Type: application/json' -H "Authorization: Bearer $auth" -d "$body"
    else
      curl -s -i -X "$method" "$url" -H 'Content-Type: application/json' -d "$body"
    fi
  else
    if [[ -n "$auth" ]]; then
      curl -s -i -X "$method" "$url" -H "Authorization: Bearer $auth"
    else
      curl -s -i -X "$method" "$url"
    fi
  fi
}

status_code() {
  echo "$1" | head -n1 | awk '{print $2}'
}

body_text() {
  echo "$1" | awk 'BEGIN{p=0} /^\r?$/{p=1; next} p{print}' | tr -d '\r'
}

check() {
  local name="$1"
  local ok="$2"
  if [[ "$ok" == "1" ]]; then
    echo "PASS: $name"
    PASS=$((PASS+1))
  else
    echo "FAIL: $name"
    FAIL=$((FAIL+1))
  fi
}

# 1) Admin login
RES=$(http_call POST "$BASE/auth/login" '{"email":"'"$ADMIN_EMAIL"'","password":"'"$ADMIN_PASS"'"}' '' )
CODE=$(status_code "$RES")
BODY=$(body_text "$RES")
ADMIN_TOKEN=$(extract_json_field "$BODY" token)
check 'Admin login' $([[ "$CODE" == "200" && -n "$ADMIN_TOKEN" ]] && echo 1 || echo 0)

# 2) Student self register
RES=$(http_call POST "$BASE/auth/register" '{"fullName":"Smoke Student","email":"'"$STUDENT_EMAIL"'","password":"stud123","role":"STUDENT"}' '' )
CODE=$(status_code "$RES")
check 'Student register' $([[ "$CODE" == "200" ]] && echo 1 || echo 0)

# 3) Student login
RES=$(http_call POST "$BASE/auth/login" '{"email":"'"$STUDENT_EMAIL"'","password":"stud123"}' '' )
CODE=$(status_code "$RES")
BODY=$(body_text "$RES")
STUDENT_TOKEN=$(extract_json_field "$BODY" token)
check 'Student login' $([[ "$CODE" == "200" && -n "$STUDENT_TOKEN" ]] && echo 1 || echo 0)

# 4) Admin create staff
RES=$(http_call POST "$BASE/admin/users" '{"fullName":"Smoke Staff","email":"'"$STAFF_EMAIL"'","password":"staff123","role":"STAFF"}' "$ADMIN_TOKEN")
CODE=$(status_code "$RES")
BODY=$(body_text "$RES")
STAFF_ID=$(extract_json_field "$BODY" userId)
check 'Admin create staff' $([[ "$CODE" == "200" && -n "$STAFF_ID" ]] && echo 1 || echo 0)

# 5) Staff login
RES=$(http_call POST "$BASE/auth/login" '{"email":"'"$STAFF_EMAIL"'","password":"staff123"}' '' )
CODE=$(status_code "$RES")
BODY=$(body_text "$RES")
STAFF_TOKEN=$(extract_json_field "$BODY" token)
check 'Staff login' $([[ "$CODE" == "200" && -n "$STAFF_TOKEN" ]] && echo 1 || echo 0)

# 6) Admin list users
RES=$(http_call GET "$BASE/admin/users" '' "$ADMIN_TOKEN")
CODE=$(status_code "$RES")
check 'Admin list users GET' $([[ "$CODE" == "200" ]] && echo 1 || echo 0)

# 7) Admin update staff details
RES=$(http_call PUT "$BASE/admin/users/$STAFF_ID" '{"fullName":"Smoke Staff Updated","email":"'"$STAFF_EMAIL"'"}' "$ADMIN_TOKEN")
CODE=$(status_code "$RES")
check 'Admin update staff details' $([[ "$CODE" == "200" ]] && echo 1 || echo 0)

# 8) Admin deactivate staff
RES=$(http_call PUT "$BASE/admin/users/$STAFF_ID/status" '{"active":false}' "$ADMIN_TOKEN")
CODE=$(status_code "$RES")
check 'Admin deactivate staff' $([[ "$CODE" == "200" ]] && echo 1 || echo 0)

# 9) Inactive staff cannot login
RES=$(http_call POST "$BASE/auth/login" '{"email":"'"$STAFF_EMAIL"'","password":"staff123"}' '' )
CODE=$(status_code "$RES")
BODY=$(body_text "$RES")
check 'Inactive staff blocked login' $([[ "$CODE" == "401" && "$BODY" == *"inactive"* ]] && echo 1 || echo 0)

# 10) Admin reactivate staff
RES=$(http_call PUT "$BASE/admin/users/$STAFF_ID/status" '{"active":true}' "$ADMIN_TOKEN")
CODE=$(status_code "$RES")
check 'Admin reactivate staff' $([[ "$CODE" == "200" ]] && echo 1 || echo 0)

# 11) Admin create facility
RES=$(http_call POST "$BASE/facilities" '{"name":"Lab-SMOKE-'"$TS"'","type":"LAB","location":"Block Z","capacity":25,"status":"AVAILABLE","description":"smoke"}' "$ADMIN_TOKEN")
CODE=$(status_code "$RES")
BODY=$(body_text "$RES")
FACILITY_ID=$(extract_json_field "$BODY" id)
FACILITY_NAME=$(extract_json_field "$BODY" name)
check 'Admin create facility' $([[ "$CODE" == "200" && -n "$FACILITY_ID" ]] && echo 1 || echo 0)

# 12) Student cannot create facility
RES=$(http_call POST "$BASE/facilities" '{"name":"FORBIDDEN-'"$TS"'","type":"LAB","location":"X","capacity":10,"status":"AVAILABLE"}' "$STUDENT_TOKEN")
CODE=$(status_code "$RES")
check 'Student forbidden to create facility' $([[ "$CODE" == "403" ]] && echo 1 || echo 0)

# 13) Staff can read facilities
RES=$(http_call GET "$BASE/facilities" '' "$STAFF_TOKEN")
CODE=$(status_code "$RES")
check 'Staff read facilities' $([[ "$CODE" == "200" ]] && echo 1 || echo 0)

# 14) Admin create asset
RES=$(http_call POST "$BASE/assets" '{"assetName":"Projector-'"$TS"'","category":"EQUIPMENT","serialNumber":"SN-'"$TS"'","condition":"GOOD","facilityId":'"$FACILITY_ID"'}' "$ADMIN_TOKEN")
CODE=$(status_code "$RES")
BODY=$(body_text "$RES")
ASSET_ID=$(extract_json_field "$BODY" id)
check 'Admin create asset' $([[ "$CODE" == "200" && -n "$ASSET_ID" ]] && echo 1 || echo 0)

# 15) Admin update asset
RES=$(http_call PUT "$BASE/assets/$ASSET_ID" '{"assetName":"Projector-'"$TS"'-U","category":"EQUIPMENT","serialNumber":"SN-'"$TS"'","condition":"NEEDS_REPAIR","facilityId":'"$FACILITY_ID"'}' "$ADMIN_TOKEN")
CODE=$(status_code "$RES")
check 'Admin update asset' $([[ "$CODE" == "200" ]] && echo 1 || echo 0)

# 16) Student read assets
RES=$(http_call GET "$BASE/assets" '' "$STUDENT_TOKEN")
CODE=$(status_code "$RES")
check 'Student read assets' $([[ "$CODE" == "200" ]] && echo 1 || echo 0)

# 17) Student create booking
RES=$(http_call POST "$BASE/bookings" '{"facilityName":"'"$FACILITY_NAME"'","startTime":"2030-01-01T10:00:00","endTime":"2030-01-01T11:00:00","notes":"smoke booking"}' "$STUDENT_TOKEN")
CODE=$(status_code "$RES")
BODY=$(body_text "$RES")
BOOKING_ID=$(extract_json_field "$BODY" bookingId)
check 'Student create booking' $([[ "$CODE" == "200" && -n "$BOOKING_ID" ]] && echo 1 || echo 0)

# 18) Staff forbidden to create booking
RES=$(http_call POST "$BASE/bookings" '{"facilityName":"'"$FACILITY_NAME"'","startTime":"2030-01-01T12:00:00","endTime":"2030-01-01T13:00:00","notes":"should fail"}' "$STAFF_TOKEN")
CODE=$(status_code "$RES")
check 'Staff forbidden create booking' $([[ "$CODE" == "403" ]] && echo 1 || echo 0)

# 19) Admin confirm booking
RES=$(http_call PUT "$BASE/bookings/$BOOKING_ID/confirm" '' "$ADMIN_TOKEN")
CODE=$(status_code "$RES")
check 'Admin confirm booking' $([[ "$CODE" == "200" ]] && echo 1 || echo 0)

# 20) Student cancel own booking
RES=$(http_call PUT "$BASE/bookings/$BOOKING_ID/cancel" '' "$STUDENT_TOKEN")
CODE=$(status_code "$RES")
check 'Student cancel own booking' $([[ "$CODE" == "200" ]] && echo 1 || echo 0)

# 21) Admin delete asset
RES=$(http_call DELETE "$BASE/assets/$ASSET_ID" '' "$ADMIN_TOKEN")
CODE=$(status_code "$RES")
check 'Admin delete asset' $([[ "$CODE" == "200" ]] && echo 1 || echo 0)

# 22) Admin delete facility
RES=$(http_call DELETE "$BASE/facilities/$FACILITY_ID" '' "$ADMIN_TOKEN")
CODE=$(status_code "$RES")
check 'Admin delete facility' $([[ "$CODE" == "200" ]] && echo 1 || echo 0)

echo "SUMMARY: PASS=$PASS FAIL=$FAIL"
if [[ $FAIL -gt 0 ]]; then
  exit 1
fi
exit 0
