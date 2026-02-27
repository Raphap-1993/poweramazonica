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
