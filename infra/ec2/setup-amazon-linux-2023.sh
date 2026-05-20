#!/usr/bin/env bash
set -euo pipefail

sudo dnf update -y
sudo dnf install -y docker nginx git docker-compose-plugin || sudo dnf install -y docker nginx git

sudo systemctl enable --now docker
sudo systemctl enable --now nginx

sudo mkdir -p /opt/gymin/server /opt/gymin/secrets
sudo chmod 750 /opt/gymin/secrets

if ! sudo docker compose version >/dev/null 2>&1; then
  echo "docker compose plugin is not available. Install Docker Compose before running server deploy."
  exit 1
fi

echo "EC2 base setup completed."
echo "Next: create /opt/gymin/server/.env and /opt/gymin/secrets/firebase-service-account.json."
