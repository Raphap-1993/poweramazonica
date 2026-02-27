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
