# AGENTS.md

## 1) Estructura del equipo

- PM (Product Manager): define alcance y prioridades, acepta entregables, decide cortes MVP.
- Arquitecto de Software: define estructura del proyecto, patrones, convenciones tecnicas y controles de seguridad.
- Analista de Sistemas: define requisitos funcionales/no funcionales, flujos y criterios de aceptacion.
- Devs (Frontend/Fullstack): implementan cambios en Next.js App Router con Tailwind y componentes shadcn/ui.
- QA Testing: ejecuta checklist funcional, pruebas manuales y smoke tests antes de merge/deploy.
- DevOps/Deploy: valida pipeline, despliegue, monitoreo, estado de servicios y rollback.

## 2) Reglas operativas para Codex

- Flujo obligatorio: `Plan -> Cambios -> Verificacion -> Commit`.
- Commits pequenos: 1 tema por commit.
- Nunca versionar secretos ni tocar `.env` en git.
- No modificar `deploy.sh` del VPS desde este repo; solo codigo de la app.
- Mantener estilo consistente con ESLint/Prettier del proyecto.
- Antes de push a `main`, ejecutar como minimo `pnpm build`.
- Si falla `build` o `lint`, no avanzar a deploy hasta corregir.
- Para cambios de backoffice/DB: ejecutar `npx prisma generate` y aplicar migraciones en entorno local antes de merge.

## 3) Definition of Done (DoD)

- `pnpm build` en verde.
- UI no se rompe en Home ni en componentes compartidos.
- Componentes shadcn/ui solicitados funcionando.
- Estructura base generada y documentada.
- Checklist de QA completado.

## 4) Checklist QA (minimo)

- Home renderiza correctamente.
- Header/CTA son clickeables.
- Responsive validado en mobile/tablet/desktop.
- Links `WhatsApp`, `tel` y `mailto` funcionan.
- Lighthouse basico ejecutado (sin umbrales estrictos).
- Revision visual de tipografias y espaciado.

## 5) Checklist DevOps y rollback

- Push a `main` dispara GitHub Actions de deploy.
- Se valida nueva release en VPS con `ls -la releases` (ruta del proyecto en servidor).
- PM2 queda online despues de deploy (`pm2 status`).
- Validar salud rapida del servicio (`curl -I http://127.0.0.1:<PUERTO>` o endpoint healthcheck si existe).

### Rollback rapido (VPS)

1. Entrar al directorio de despliegue del proyecto.
2. Listar releases disponibles y elegir la ultima estable:
   - `ls -1 releases`
3. Reapuntar `current` a release estable:
   - `ln -sfn releases/<release_estable> current`
4. Recargar proceso:
   - `pm2 reload <app-name> --update-env`
5. Verificar estado:
   - `pm2 status`
   - `curl -I http://127.0.0.1:<PUERTO>`

## 6) Backoffice landing (Prisma + Postgres)

- Credenciales admin via variables de entorno:
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD_HASH` (recomendado para produccion)
  - `ADMIN_PASSWORD_PLAIN` solo en desarrollo (`NODE_ENV !== production`)
  - `AUTH_SECRET` para firmar cookie de sesion admin
- DB obligatoria:
  - `DATABASE_URL` apuntando a PostgreSQL
- Modelo MVP:
  - `Tenant`, `AdminUser`, `LandingPage`, `LandingPublish`
- Flujo:
  - Se edita `DRAFT` en `/admin/landing`
  - `Publicar` copia a `PUBLISHED` y crea snapshot en `LandingPublish`

## 7) Comandos de inicializacion y migracion

- Desarrollo local:
  - `pnpm install`
  - `npx prisma generate`
  - `npx prisma migrate dev --name <descripcion>`
  - `pnpm db:seed` (o `npx prisma db seed`)
- Produccion (VPS release/current):
  - `npx prisma migrate deploy`
  - `npx prisma db seed` (solo si aplica en arranque inicial)
- Validacion minima pre-deploy:
  - `pnpm lint`
  - `pnpm build`
