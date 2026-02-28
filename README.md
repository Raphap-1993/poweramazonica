# Power Amazonica Web

Landing frontend built with Next.js App Router + Tailwind + shadcn/ui.

## Stack

- Next.js 16
- React 19
- Tailwind 4
- shadcn/ui
- Deploy target: VPS (GitHub Actions + SSH)

## Team Workflow

Operational team rules are defined in [AGENTS.md](./AGENTS.md).

Architecture and delivery docs:

- [Architecture Baseline](./docs/architecture.md)
- [Implementation Roadmap](./docs/implementation-roadmap.md)
- [CMS Editor Guide](./docs/cms-editor-guide.md)
- [Directus VPS Setup](./docs/directus-vps-setup.md)

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Validation Commands

```bash
pnpm lint
pnpm build
```

## Deployment

- Push to `main` triggers `.github/workflows/deploy.yml`.
- VPS deploy is executed through `/home/poweramazonica/apps/poweramazonica.com/deploy.sh`.

## Notes

- Do not commit `.env*` files.
- Keep commits small and focused (one topic per commit).

## Uploads (Admin)

- Admin upload endpoint: `POST /api/admin/upload` (authenticated).
- Files are optimized to WebP with `sharp` before storage.
- Public delivery route: `/uploads/<tenant>/<yyyy>/<mm>/<file>.webp`.

Recommended env vars:

- `UPLOAD_STORAGE_DIR` (production persistent path, e.g. shared volume)
- `UPLOAD_MAX_FILE_MB` (default `8`)
- `UPLOAD_IMAGE_QUALITY` (default `76`)

Performance note:

- New uploads are resized/compressed more aggressively (hero up to `1600x900`, generic up to `1280x1280`).
- Existing images already uploaded keep their original optimized size; re-upload them from admin if you need lower weight.

## Leads API

- Public endpoint: `POST /api/leads`
- Validates payload with Zod (`name`, `phone`, `email?`, `message`, `source?`)
- Stores lead in PostgreSQL (`Lead` model in Prisma)

Required env vars in production:

- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `AUTH_SECRET`
