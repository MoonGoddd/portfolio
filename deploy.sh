#!/usr/bin/env bash
# Met le portfolio en ligne sur regniezleo.fr (hébergement OVH, dossier www).
# Usage : ./deploy.sh                → construit, refait les PDF du CV, puis envoie le site
#         ./deploy.sh --sans-build   → envoie le dist/ existant sans reconstruire
# Le mot de passe FTP est demandé une seule fois, au début, sans s'afficher.
set -euo pipefail

HOTE="ftp.cluster129.hosting.ovh.net"
UTILISATEUR="regnieo"
DOSSIER_DISTANT="www"
URL="https://regniezleo.fr"

cd "$(dirname "$0")"

# ---------------------------------------------------------------- mot de passe (masqué)
# On le demande tout de suite : la construction prend un moment, et la saisie ne doit
# jamais tomber dans le terminal en clair.
trap 'stty echo 2>/dev/null || true' EXIT INT TERM
read -rsp "Mot de passe FTP de « $UTILISATEUR » : " MDP
echo
[[ -n "$MDP" ]] || { echo "Mot de passe vide : envoi annulé." >&2; exit 1; }

# ---------------------------------------------------------------- construction
if [[ "${1:-}" != "--sans-build" ]]; then
  echo "→ Construction du site…"
  npm run build
  # Les PDF du CV sont refaits à partir de cv.html, donc des mêmes données que le portfolio
  echo "→ PDF du CV…"
  npm run cv:pdf || echo "⚠ PDF du CV non régénérés (voir ci-dessus) : les précédents sont envoyés."
fi
[[ -f dist/index.html ]] || { echo "dist/index.html introuvable : lance d'abord npm run build." >&2; exit 1; }

# Le serveur web doit pouvoir lire chaque fichier : 644 pour les fichiers, 755 pour les dossiers.
# (sftp recopie les droits locaux : un fichier en 600 donnerait une erreur 403 en ligne.)
find dist -type d -exec chmod 755 {} +
find dist -type f -exec chmod 644 {} +

# ---------------------------------------------------------------- envoi
echo "→ Envoi de dist/ vers $UTILISATEUR@$HOTE:$DOSSIER_DISTANT"

# Le port 22 (SFTP) est parfois bloqué (réseau d'école ou d'entreprise, ou blocage temporaire
# d'OVH après des mots de passe refusés). Dans ce cas, on passe par FTP chiffré (FTPS, port 21).
port_ouvert() { timeout 8 bash -c "</dev/tcp/$HOTE/$1" 2>/dev/null; }

envoi_ftps() {
  echo "  Port 22 injoignable : envoi par FTP chiffré (FTPS, port 21)."
  command -v curl >/dev/null || { echo "curl est introuvable : sudo pacman -S curl" >&2; return 1; }
  # Identifiants dans un fichier de configuration curl temporaire, lisible par toi seul :
  # le mot de passe n'apparaît ni à l'écran ni dans la liste des processus.
  local conf
  conf=$(mktemp)
  chmod 600 "$conf"
  local mdp_echappe=${MDP//\\/\\\\}
  mdp_echappe=${mdp_echappe//\"/\\\"}
  printf 'user = "%s:%s"\n' "$UTILISATEUR" "$mdp_echappe" > "$conf"
  # Une seule commande curl pour tous les fichiers : la connexion est réutilisée.
  local args=() f
  while IFS= read -r -d '' f; do
    args+=(-T "$f" "ftp://$HOTE/$DOSSIER_DISTANT/${f#dist/}")
  done < <(find dist -type f -print0)
  local commun=(--ssl-reqd --fail --show-error --silent --connect-timeout 15 -K "$conf")
  # D'abord, supprimer l'éventuelle page d'attente d'OVH (verrouillée en écriture) ;
  # « * » : pas d'erreur si elle n'existe plus. Appel séparé, sinon curl la rejouerait avant chaque fichier.
  curl "${commun[@]}" --list-only -Q "*DELE $DOSSIER_DISTANT/index.html" "ftp://$HOTE/" >/dev/null
  local code=$?
  if [[ $code -eq 0 ]]; then
    curl "${commun[@]}" --ftp-create-dirs "${args[@]}"
    code=$?
  fi
  rm -f "$conf"
  [[ $code -eq 0 ]] && echo "  $(( ${#args[@]} / 3 )) fichiers envoyés." || echo "✗ Envoi FTPS échoué (code curl $code)." >&2
  return $code
}

if ! port_ouvert 22; then
  port_ouvert 21 || {
    echo "✗ Le serveur $HOTE ne répond ni sur le port 22 (SFTP) ni sur le port 21 (FTP)." >&2
    echo "  Vérifie ta connexion, ou réessaie depuis un autre réseau (partage de connexion du téléphone)." >&2
    exit 1
  }
  envoi_ftps || exit 1
elif command -v lftp >/dev/null 2>&1; then
  # lftp : envoie seulement ce qui a changé et supprime les anciens fichiers de assets/
  LFTP_PASSWORD="$MDP" lftp --env-password -u "$UTILISATEUR" "sftp://$HOTE" <<LFTP
set sftp:auto-confirm yes
set net:max-retries 2
cd $DOSSIER_DISTANT
rm -f index.html
lcd dist
mirror --reverse --verbose --exclude-glob assets/ ./ ./
mirror --reverse --verbose --delete assets/ assets/
chmod 644 index.html .htaccess
bye
LFTP
else
  # Sans lftp : sftp (fourni avec OpenSSH). Le mot de passe lui est donné par un petit
  # programme « askpass » temporaire, qui le lit dans une variable d'environnement
  # (il n'est jamais écrit sur le disque ni affiché).
  ASKPASS=$(mktemp)
  trap 'rm -f "$ASKPASS"; stty echo 2>/dev/null || true' EXIT INT TERM
  printf '#!/bin/sh\nprintf "%%s\\n" "$DEPLOY_MDP"\n' > "$ASKPASS"
  chmod 700 "$ASKPASS"
  DEPLOY_MDP="$MDP" SSH_ASKPASS="$ASKPASS" SSH_ASKPASS_REQUIRE=force DISPLAY="${DISPLAY:-:0}" \
    sftp -o StrictHostKeyChecking=accept-new \
         -o PreferredAuthentications=password,keyboard-interactive \
         -o NumberOfPasswordPrompts=1 \
         -o ConnectTimeout=15 \
         "$UTILISATEUR@$HOTE" <<SFTP
cd $DOSSIER_DISTANT
-rm index.html
lcd dist
put -r *
put .htaccess
-chmod 644 *.html
-chmod 644 *.png
-chmod 644 *.svg
-chmod 644 *.txt
-chmod 644 *.xml
-chmod 644 .htaccess
-chmod 644 cv/*
-chmod 644 assets/*
bye
SFTP
fi
unset MDP

# ---------------------------------------------------------------- vérification
# La page en ligne doit être celle qu'on vient d'envoyer
echo "→ Vérification de $URL"
attendu=$(grep -o 'assets/[a-z]*-[^"]*\.js' dist/index.html | head -1)
if curl -fsS -H 'Cache-Control: no-cache' "$URL/?deploiement=$(date +%s)" | grep -q "$attendu" \
  && curl -fsSI "$URL/cv/CV_Regniez_Leo_FR.pdf" | head -1 | grep -q ' 200' \
  && curl -fsSI "$URL/cv.html" | head -1 | grep -q ' 200'; then
  echo "✓ En ligne : $URL"
else
  echo "✗ La page en ligne ne correspond pas encore à dist/ (ou le CV n'est pas accessible)." >&2
  echo "  Si le mot de passe a été refusé, relance ./deploy.sh --sans-build." >&2
  exit 1
fi
