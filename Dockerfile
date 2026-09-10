# syntax=docker/dockerfile:1
# SoftEther Manager + SoftEther VPN Server, Railway-ready.
FROM python:3.12-slim AS runtime
WORKDIR /app

ARG SOFTETHER_URL=https://github.com/SoftEtherVPN/SoftEtherVPN_Stable/releases/download/v4.44-9807-rtm/softether-vpnserver-v4.44-9807-rtm-2025.04.16-linux-x64-64bit.tar.gz

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    tar \
    build-essential \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Build the web UI first.
FROM node:20-alpine AS web-builder
WORKDIR /web
COPY app/web/package.json app/web/package-lock.json* ./
RUN npm ci --prefer-offline || npm install
COPY app/web/ ./
RUN npm run build

FROM runtime AS final
ARG SOFTETHER_URL
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install SoftEther VPN Server from the pinned stable release.
RUN mkdir -p /tmp/se \
    && curl -fL --retry 5 --retry-delay 2 "$SOFTETHER_URL" -o /tmp/se/vpnserver.tar.gz \
    && tar -xzf /tmp/se/vpnserver.tar.gz -C /tmp/se \
    && cd /tmp/se/vpnserver \
    && set +o pipefail; yes 1 | make >/tmp/se/make.log 2>&1; status=$?; set -o pipefail; \
       test -x vpnserver \
    && mkdir -p /opt/vpnserver \
    && cp -a /tmp/se/vpnserver/. /opt/vpnserver/ \
    && chmod 700 /opt/vpnserver/vpnserver /opt/vpnserver/vpncmd \
    && rm -rf /tmp/se

COPY . .
COPY --from=web-builder /web/out ./app/web/out
COPY entrypoint.sh /entrypoint.sh

ENV SEM_DATA_DIR=/data \
    SEM_BIND_HOST=0.0.0.0 \
    SEM_BIND_PORT=8000 \
    PYTHONUNBUFFERED=1

RUN mkdir -p /data && chmod 777 /data

# HTTP panel listens on Railway's PORT. SoftEther internally uses its normal
# management/VPN listener ports (5555/443/992); Railway TCP Proxy can expose
# those raw-TCP ports publicly when needed.
EXPOSE 8000 443 992 5555

CMD ["/entrypoint.sh"]
