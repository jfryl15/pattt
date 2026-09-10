# Deploy SoftEther Manager + SoftEther VPN Server on Railway

This image runs both the management panel and a SoftEther VPN Server in the same Railway service.

## Railway variables

Set this required secret variable:

- `SOFTETHER_ADMIN_PASSWORD` = a strong SoftEther administrator password

Optional:

- `SEM_DATA_DIR=/data`

## Volume

Create one Railway Volume and mount it at:

`/data`

This persists the SQLite database, encryption/session keys, and the SoftEther configuration.

## Networking

Generate a normal Railway HTTP domain for the panel. Railway supplies the public `PORT`; the container passes it to Uvicorn.

For VPN clients, create a Railway TCP Proxy for internal port `443`. Railway will give you a public TCP hostname and port. Use that hostname/port in SoftEther VPN clients.

The panel itself connects internally to SoftEther at `127.0.0.1:5555`, so the management port does not need to be public.

Railway supports HTTP and TCP public networking on the same service.

## First login

Open the generated Railway HTTPS domain. The panel will show its normal first-run account setup screen.

The SoftEther connection is automatically configured to localhost:5555 using `SOFTETHER_ADMIN_PASSWORD`.
