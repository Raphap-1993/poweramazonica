# Directus VPS Setup (MariaDB + Hestia)

This runbook installs Directus for `cms.poweramazonica.com` using Docker Compose and an existing MariaDB service.

## 1) Prerequisites

- VPS with Hestia and HTTPS for `cms.poweramazonica.com`.
- MariaDB running on VPS (or reachable from VPS).
- Docker and Docker Compose plugin installed.
- A dedicated MariaDB database and user for Directus.

## 2) Create DB and User (MariaDB)

Run in VPS shell:

```bash
mysql -u root -p
```

Then:

```sql
CREATE DATABASE poweramazonica_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'poweramazonica_cms'@'127.0.0.1' IDENTIFIED BY 'REPLACE_DB_PASSWORD';
GRANT ALL PRIVILEGES ON poweramazonica_cms.* TO 'poweramazonica_cms'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

## 3) Prepare CMS directory

```bash
sudo mkdir -p /home/poweramazonica/apps/poweramazonica-cms
sudo chown -R poweramazonica:poweramazonica /home/poweramazonica/apps/poweramazonica-cms
cd /home/poweramazonica/apps/poweramazonica-cms
```

Copy these repo files into that VPS directory:

- `ops/directus/docker-compose.yml`
- `ops/directus/env.example` as `.env`

Example from your Mac:

```bash
scp /Users/rapha/Projects/poweramazonica-web/ops/directus/docker-compose.yml poweramazonica@<VPS_HOST>:/home/poweramazonica/apps/poweramazonica-cms/
scp /Users/rapha/Projects/poweramazonica-web/ops/directus/env.example poweramazonica@<VPS_HOST>:/home/poweramazonica/apps/poweramazonica-cms/.env
```

## 4) Configure .env

Edit `/home/poweramazonica/apps/poweramazonica-cms/.env`:

- Replace `KEY`, `SECRET`, `ADMIN_PASSWORD`, `DB_PASSWORD`.
- Keep:
  - `PUBLIC_URL=https://cms.poweramazonica.com`
  - `DB_CLIENT=mysql`

Generate random values:

```bash
openssl rand -base64 48
```

## 5) Start Directus

```bash
cd /home/poweramazonica/apps/poweramazonica-cms
docker compose pull
docker compose up -d
docker compose logs -f --tail=100
```

## 6) Configure reverse proxy

Proxy `cms.poweramazonica.com` to `127.0.0.1:8055`.

If your Hestia template already supports reverse proxy to local apps, point it to port `8055`.

## 7) Smoke checks

From VPS:

```bash
curl -I http://127.0.0.1:8055/server/health
curl -I https://cms.poweramazonica.com/server/health
```

Expected: HTTP `200` in both checks.

## 8) First login

- Open `https://cms.poweramazonica.com/admin`
- Login with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Create editor user and disable daily use of the bootstrap admin account.

## 9) Operational commands

```bash
cd /home/poweramazonica/apps/poweramazonica-cms
docker compose ps
docker compose logs -f --tail=200
docker compose restart
docker compose pull && docker compose up -d
```

## 10) Backup baseline

- MariaDB dump (daily cron):

```bash
mysqldump -u poweramazonica_cms -p poweramazonica_cms > /home/poweramazonica/backups/poweramazonica_cms_$(date +%F).sql
```

- Uploads backup (daily/weekly):
  - `/home/poweramazonica/apps/poweramazonica-cms/uploads`

## 11) Rollback

If Directus update fails:

1. Roll back image tag in `docker-compose.yml`.
2. `docker compose up -d`.
3. Restore latest valid DB dump if required.

## 12) Next integration (next phase)

- Frontend will consume Directus API read-only.
- Publish events in Directus will call a protected Next revalidate endpoint.

---

Reference docs:

- Directus Docker deployment:
  - https://docs.directus.io/self-hosted/docker-guide
- Directus configuration options:
  - https://docs.directus.io/self-hosted/config-options
