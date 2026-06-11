# Debug — Problema de Autenticación / Creación de Usuarios

## Problema
Al intentar crear usuario en `/sign-up`, se devuelve error `400 Bad Request` con mensaje "Database error saving new user".

- ✅ Supabase Auth funciona (usuario se crea en `auth.users`)
- ❌ Tabla `public.User` no se sincroniza
- ❌ Prisma/SQL falla al insertar en `public.User`

## Pasos de Debug (Hacer en ORDEN)

### Paso 1: Verificar que el servidor está corriendo
```bash
pnpm dev
```
- Debe mostrar: `✓ Ready in XXXms`
- Abre http://localhost:3000/sign-up

### Paso 2: Crear usuario de prueba e intentar signup
1. Ingresa cualquier email (ej: `test@example.com`)
2. Password: `testpass123`
3. Click "Sign up"
4. **Observa la consola del servidor** donde está `pnpm dev`

### Paso 3: Leer los LOGS exactos
En la consola del servidor, deberías ver algo como:
```
Creating user in DB: { id: 'xxx', email: 'test@example.com' }
Database error creating user: { message: '...', code: '...', ... }
```

**Copia EXACTAMENTE el error que ves.**

### Paso 4: Verificar tabla en Supabase
En **Supabase SQL Editor**, ejecuta:
```sql
SELECT * FROM public."User";
```
¿Hay filas? ¿O está vacía?

### Paso 5: Probar INSERT manual en Supabase
En **Supabase SQL Editor**:
```sql
INSERT INTO public."User" (id, email, "createdAt")
VALUES ('manual-test-' || now()::text, 'manual@test.com', NOW());

SELECT * FROM public."User" WHERE email = 'manual@test.com';
```
¿Funciona? ¿O da error?

### Paso 6: Verificar RLS en tabla User
En **Supabase SQL Editor**:
```sql
SELECT relname, row_security 
FROM pg_class 
WHERE relname = 'User';
```
¿`row_security` es `t` (true) o `f` (false)?

Si es `true`, ejecuta:
```sql
ALTER TABLE public."User" DISABLE ROW LEVEL SECURITY;
```

### Paso 7: Si RLS estaba enabled
Repite Paso 2-3 y verifica si ahora funciona.

### Paso 8: Verificar políticas RLS (si sigue fallando)
```sql
SELECT * FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'User';
```
¿Hay políticas que bloqueen INSERT?

## Archivos Importantes
- **API Route:** `src/app/api/auth/sign-up/route.ts` (línea 20+ tiene logging)
- **Schema:** `prisma/schema.prisma` (modelo User)
- **Trigger:** `.claude/sql-trigger-user-sync.sql`

## Posibles Soluciones

### Si error es sobre RLS:
```sql
ALTER TABLE public."User" DISABLE ROW LEVEL SECURITY;
```
Luego intenta sign-up de nuevo.

### Si error es sobre constraint:
```sql
\d public."User"
```
Verifica columnas y constraints. El id debe ser UUID, email UNIQUE.

### Si error es sobre permisos:
El usuario de BD puede no tener permisos de INSERT. Verificar con:
```sql
GRANT ALL PRIVILEGES ON public."User" TO postgres;
```

## Próximos Pasos
1. ✅ Ejecuta los pasos 1-8 arriba
2. 📝 Copia EXACTAMENTE:
   - El error que ves en consola del servidor
   - El resultado de `SELECT * FROM public."User"`
   - El resultado de `row_security` check
3. 💬 Comparte esto mañana y continuamos con la solución exacta
