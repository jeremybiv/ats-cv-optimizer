#!/usr/bin/env bash
# Matrice de tests API — usage: ./artifacts/api-matrix.sh <label>
# Envoie des requêtes SANS cookie de session, puis avec un cookie de session invalide.
set -u
PORT="${PORT:-3311}"
LABEL="${1:-run}"
BASE="http://localhost:$PORT"
OUT="$(dirname "$0")/curls-$LABEL.txt"
: > "$OUT"

hit() { # name method path body cookie?
  local name="$1" path="$2" body="$3" cookie="${4:-}"
  local args=(-s -o "${OUT}.body" -w '%{http_code}' -X POST "$BASE$path"
              -H 'Content-Type: application/json' --data "$body")
  [ -n "$cookie" ] && args+=(-H "Cookie: $cookie")
  local code
  code=$(curl "${args[@]}")
  printf '%-46s HTTP %s  %s\n' "$name" "$code" "$(head -c 220 "${OUT}.body")" | tee -a "$OUT"
  rm -f "${OUT}.body"
}

echo "=== $LABEL — POST sans cookie de session ===" | tee -a "$OUT"
hit "POST /api/cover-letter (body vide {})"  /api/cover-letter      '{}'
hit "POST /api/interview-prep (body vide {})" /api/interview-prep   '{}'
hit "POST /api/linkedin-fetch (body vide {})" /api/linkedin-fetch   '{}'
hit "POST /api/cover-letter"      /api/cover-letter      '{"cvText":"Jean Dupont, developpeur web 5 ans","jobText":"Developpeur web senior"}'
hit "POST /api/interview-prep"    /api/interview-prep    '{"cvText":"Jean Dupont, developpeur web 5 ans","jobText":"Developpeur web senior"}'
hit "POST /api/linkedin-fetch"    /api/linkedin-fetch    '{"url":"https://www.linkedin.com/in/prospecho-inexistant"}'
hit "POST /api/newsletter (email invalide)" /api/newsletter '{"email":"pas-un-email"}'
hit "POST /api/newsletter (email valide, BREVO absent)" /api/newsletter '{"email":"qa-cycle6@example.com"}'

echo | tee -a "$OUT"
echo "=== $LABEL — cookie de session invalide ===" | tee -a "$OUT"
BAD='next-auth.session-token=invalid-session-token-cycle6'
hit "POST /api/cover-letter + cookie bidon"   /api/cover-letter   '{"cvText":"a","jobText":"b"}' "$BAD"
hit "POST /api/interview-prep + cookie bidon" /api/interview-prep '{"cvText":"a","jobText":"b"}' "$BAD"

echo | tee -a "$OUT"
echo "=== $LABEL — middleware /api/optimize (anonyme) ===" | tee -a "$OUT"
curl -s -o /dev/null -w "POST /api/optimize anonyme                  HTTP %{http_code} (redirect: %{redirect_url})\n" \
  -X POST "$BASE/api/optimize" -H 'Content-Type: application/json' --data '{}' | tee -a "$OUT"
