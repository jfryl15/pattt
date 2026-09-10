#!/bin/sh
set -eu

DATA_DIR="${SEM_DATA_DIR:-/data}"
SE_DIR="/opt/vpnserver"
SE_DATA_DIR="$DATA_DIR/vpnserver"
SE_PASSWORD="${SOFTETHER_ADMIN_PASSWORD:-}"

if [ -z "$SE_PASSWORD" ]; then
  echo "ERROR: SOFTETHER_ADMIN_PASSWORD is required."
  exit 1
fi

mkdir -p "$SE_DATA_DIR"

# Keep the SoftEther installation and configuration on the Railway Volume.
# The first boot copies the immutable binaries from the image; later boots
# reuse the persistent configuration and certificates.
if [ ! -x "$SE_DATA_DIR/vpnserver" ]; then
  cp -a "$SE_DIR/." "$SE_DATA_DIR/"
fi
chmod 700 "$SE_DATA_DIR/vpnserver" "$SE_DATA_DIR/vpncmd" 2>/dev/null || true

# SoftEther stores its configuration in vpn_server.config inside its working
# directory. Starting it from the persistent directory makes that file survive
# redeploys/restarts when /data is mounted as a Railway Volume.
cd "$SE_DATA_DIR"
./vpnserver start

# Wait for the management listener.
i=0
while ! (command -v nc >/dev/null 2>&1 && nc -z 127.0.0.1 5555) && [ "$i" -lt 30 ]; do
  i=$((i + 1))
  sleep 1
done

if ! (command -v nc >/dev/null 2>&1 && nc -z 127.0.0.1 5555); then
  echo "ERROR: SoftEther did not start on 127.0.0.1:5555"
  exit 1
fi

# Make the SoftEther administrator password deterministic from the Railway
# secret, then point the panel at its local SoftEther instance.
./vpncmd 127.0.0.1:5555 /SERVER /CMD ServerPasswordSet "$SE_PASSWORD" >/dev/null 2>&1 || true

cd /app
python -m app.manage connect --host 127.0.0.1 --port 5555 --password "$SE_PASSWORD"

exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
