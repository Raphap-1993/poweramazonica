# Power Amazonica - Architecture Baseline (v1)

## 1) Decision Summary

- Frontend: Next.js 16 (App Router) + React 19 + Tailwind 4 + shadcn/ui.
- CMS Backoffice: Directus (self-hosted).
- Database: MariaDB (managed in Hestia/VPS).
- Public site domain: `poweramazonica.com`.
- CMS admin domain: `cms.poweramazonica.com`.
- Deploy model:
  - Frontend deploy by GitHub Actions to VPS.
  - Directus deploy/upgrade via VPS runbook.
- Content publishing:
  - Editor changes content in Directus.
  - Publish action triggers webhook to revalidate frontend cache.

## 2) Why This Stack

- MariaDB is already available and operational in Hestia.
- Directus supports MariaDB and provides a ready backoffice UI for non-technical editors.
- Next.js keeps full control over premium design and conversion UX.
- Separation of concerns:
  - CMS handles content governance.
  - Frontend handles performance, brand, and conversion behavior.

## 3) Architecture (High Level)

```text
[Webmaster/Editor]
        |
        v
cms.poweramazonica.com (Directus Admin/API)
        |
        v
MariaDB (content + users + media metadata)
        |
        | Publish webhook (revalidate)
        v
poweramazonica.com (Next.js frontend)
        |
        v
Visitor (SEO + landing + CTA)
```

## 4) Deployment Topology

- VPS services:
  - Reverse proxy (Nginx/Apache managed by Hestia).
  - Node process for Next.js app (PM2).
  - Directus service (PM2 or container service).
  - MariaDB service (existing).
- TLS:
  - Separate certificates for `poweramazonica.com` and `cms.poweramazonica.com`.
- Isolation:
  - Dedicated MariaDB database and user for Directus.
  - Frontend and CMS runtime env vars separated.

## 5) Content Model (MVP)

- `home_page` (singleton):
  - Hero: title, subtitle, description, CTA labels/links.
  - About section text blocks.
  - Location/advantages content.
  - Final CTA block.
  - Footer fields (address, phone, email).
- `slides` (collection):
  - title, subtitle, image, badge, order, active flag.
- `project_features` (collection):
  - title, icon_name (optional), order, active flag.
- `payment_options` (collection):
  - title, order, active flag.
- `faqs` (collection):
  - question, answer, order, active flag.

## 6) Editorial Workflow

- Roles:
  - `Admin`: full access, schema and users.
  - `Editor`: content only, no schema changes.
- Publish process:
  - Editor updates fields in Directus.
  - Editor reviews preview/staging view.
  - Editor publishes.
  - Webhook triggers frontend cache revalidation.
- Auditability:
  - Keep `updated_by`, `updated_at`, and revision history enabled.

## 7) Security and Operations Baseline

- Never commit `.env` secrets to git.
- Restrict Directus admin access:
  - strong passwords + optional IP allowlist.
  - 2FA for admin users.
- Backups:
  - Daily MariaDB dump.
  - Media backup schedule.
  - Retention policy (minimum 7 daily + 4 weekly).
- Monitoring:
  - PM2 process status.
  - HTTP health checks for frontend and CMS.

## 8) Frontend Integration Contract

- Data access:
  - server-side fetch from Directus API using read-only token.
  - fallback content if CMS is temporarily unavailable.
- Revalidation:
  - On publish, Directus webhook calls a protected Next.js revalidate endpoint.
- Performance:
  - Optimize images and lazy-load non-critical sections.
  - Keep LCP section (Hero) lean.

## 9) Non-Goals (Current Scope)

- No free-form drag-and-drop builder (Elementor-style full canvas) in this phase.
- No multi-language support in MVP.
- No transactional CRM pipeline in MVP.

## 10) Architecture Acceptance Criteria

- `cms.poweramazonica.com` available with login and role separation.
- Frontend home content reads from Directus without hardcoded business copy.
- Editor can update Hero, Slider, FAQ, CTA, Footer without developer assistance.
- Publish action updates public site within agreed delay window.
- Backup and rollback procedure documented and tested once.
