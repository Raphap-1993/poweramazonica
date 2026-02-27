# Power Amazonica - Delivery Roadmap

## Phase 0 - Baseline Alignment (Current)

- Confirm architecture decision:
  - Next.js frontend + Directus CMS + MariaDB.
- Define roles and release gates from `AGENTS.md`.
- Output:
  - `docs/architecture.md`
  - This roadmap.

## Phase 1 - CMS Infrastructure (VPS)

### Tasks

- Create `cms.poweramazonica.com` in Hestia.
- Provision Directus runtime service.
- Create MariaDB database/user with least privilege.
- Configure Directus env vars and admin bootstrap.
- Configure HTTPS certificate and reverse proxy.

### Acceptance Criteria

- CMS admin URL responds over HTTPS.
- Admin login works.
- Directus can read/write to MariaDB.

## Phase 2 - Content Schema and Roles

### Tasks

- Create collections/singleton:
  - `home_page`, `slides`, `project_features`, `payment_options`, `faqs`.
- Define field validations:
  - required fields, max lengths, order numeric.
- Create roles:
  - `Admin`, `Editor` with scoped permissions.

### Acceptance Criteria

- Editor can modify only allowed content.
- Admin can manage schema and users.
- Initial seed content mirrors current landing.

## Phase 3 - Next.js Integration

### Tasks

- Add Directus API client layer in frontend.
- Replace hardcoded home content with CMS-driven data.
- Implement slider section from `slides` collection.
- Implement resilient fallback if CMS endpoint fails.

### Acceptance Criteria

- Home fully renders using CMS data.
- If CMS is unavailable, safe fallback content is shown.
- `pnpm lint` and `pnpm build` pass.

## Phase 4 - Publish Flow and Cache Revalidation

### Tasks

- Add protected Next.js revalidate endpoint.
- Configure Directus webhook on publish events.
- Ensure only trusted webhook requests are accepted.

### Acceptance Criteria

- Publishing in CMS updates public site without manual redeploy.
- Revalidation endpoint rejects invalid signatures/tokens.

## Phase 5 - QA, Runbook, and Handover

### Tasks

- Execute QA checklist end-to-end.
- Document editor guide with screenshots/checklist.
- Document DevOps runbook:
  - deploy, verify, rollback.

### Acceptance Criteria

- QA sign-off completed.
- Webmaster can perform content updates independently.
- Rollback tested once on staging or low-risk window.

## Branch and Commit Policy

- One topic per commit.
- Suggested commit sequence:
  1. `docs: add cms architecture baseline`
  2. `chore: scaffold directus integration layer`
  3. `feat: render landing from cms content`
  4. `feat: add publish revalidation webhook`
  5. `docs: add cms editor and ops runbook`

## Mandatory Validation Before Push

```bash
pnpm install
pnpm lint
pnpm build
```

## Risks and Mitigations

- Risk: schema drift in CMS.
  - Mitigation: lock schema changes to Admin role and document migrations.
- Risk: stale content due to cache.
  - Mitigation: webhook revalidation + manual revalidate command.
- Risk: operational drift between repo and VPS scripts.
  - Mitigation: maintain runbook and periodic deploy rehearsal.
