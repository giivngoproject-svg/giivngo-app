# GoFounder — Documentación y Planes

## Contenido

### Especificaciones de Producto
- **[spec-phase1.md](spec-phase1.md)** — Requerimientos originales de Phase 1 MVP y visión Phase 2 (incluye data models, key flows, tech stack)

### Plan de Construcción
- **[plan.md](plan.md)** — Plan detallado paso a paso (17 pasos en 7 fases) para construir Phase 1 MVPDetalle completo de:
  - Scaffold del proyecto con pnpm
  - Configuración de Supabase Auth (no Clerk) + todas las integraciones
  - Schema de Prisma con todos los modelos
  - Implementación por página/feature (landing, dashboard, wizard, public campaign, profile, etc.)
  - Webhooks y background jobs (BullMQ)
  - Seguridad, observabilidad y deployment
  - Estimado: ~20 días

## Diferencias: Requerimientos vs Plan

| Aspecto | Spec Original | Plan Final |
|---------|---------------|-----------|
| Package Manager | No especificado | **pnpm** (seguridad) |
| Auth Provider | Clerk | **Supabase Auth** (consolidado) |
| Sync de usuarios | Webhook Clerk | **Trigger PostgreSQL** (atómico) |
| Estructura | General | Paso a paso ejecutable |

## Pasos Completados (Día 1)

✅ **PASO 1** — Scaffold del proyecto con Next.js + pnpm
✅ **PASO 2** — Credenciales de todos los servicios configuradas
✅ **PASO 3** — Schema de Prisma creado e **MIGRACIÓN COMPLETADA** ✓
✅ **PASO 4 (Parcial)** — Auth con Supabase:
  - Clientes Supabase (browser y server)
  - Middleware de sesiones
  - Páginas: Sign-up, Sign-in, Forgot-password, Update-password
  - OAuth callback route para Google Sign-In

## Próximo Paso CRÍTICO

⚠️ **EJECUTAR TRIGGER EN SUPABASE**:
1. Abre Supabase Dashboard → tu proyecto
2. Ve a **SQL Editor** (izquierda)
3. Crea una nueva query
4. Copia todo el contenido de `sql-trigger-user-sync.sql`
5. Ejecuta (ícono play)

Este trigger sincroniza automáticamente `auth.users` → `public.User` cuando alguien se registra.

## 🔴 BLOQUEADOR ACTUAL

**Auth no funciona**: Creación de usuarios falla con "Database error saving new user"
- Supabase Auth ✅ (usuario se crea en auth.users)
- Prisma INSERT ❌ (falla al crear en public.User)

**Ver:** [`DEBUG-AUTH.md`](DEBUG-AUTH.md) — Guía paso a paso para resolver mañana

## Próximos Pasos

1. **Mañana Primero:** Ejecutar guía de debug en `DEBUG-AUTH.md` (Opción A)
2. Si se resuelve: PASO 6 (Dashboard)
3. Si no: Opción B — Simplificar (eliminar tabla User)
