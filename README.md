# Taller App – Seguimiento de trabajos

Aplicación web simple para un taller de mecánica. El personal registra órdenes de trabajo, cambia su estado y sube fotos. El cliente consulta el avance desde un enlace único, sin necesidad de cuenta.

> Reglas para trabajar con Claude: ver [`CLAUDE.md`](./CLAUDE.md).

---

## 1. Stack y entorno

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite (JavaScript) |
| UI | A definir: Mantine **o** Tailwind + shadcn/ui (elegir una sola y no mezclar) |
| Base de datos | PostgreSQL en Supabase |
| Autenticación | Supabase Auth (correo y contraseña, registro público desactivado) |
| Fotos | Supabase Storage (bucket `fotos`) |
| Hosting | Cloudflare Workers (assets estáticos; despliegue automático desde GitHub) |
| Control de versiones | Git + GitHub |

**Requisitos locales**
- Node.js LTS (≥ 20) y npm
- Git
- VS Code (recomendado)
- Cuenta en GitHub, Supabase y Cloudflare

**Entornos**
- `local`: `npm run dev` en tu máquina, conectado al proyecto de Supabase de desarrollo.
- `preview`: Cloudflare genera una URL de prueba por cada rama.
- `producción`: rama `main` desplegada en Cloudflare Workers.

> Recomendado: usar **dos proyectos de Supabase** (uno `dev` y otro `prod`) apenas haya datos reales. Mientras tanto, nunca hacer pruebas destructivas sobre datos de clientes reales.

---

## 2. Estructura del proyecto

```
taller-app/
├── public/
├── wrangler.jsonc          # Configuración de Cloudflare (carpeta dist + modo SPA)
├── src/
│   ├── lib/supabase.js     # Cliente de Supabase (único lugar donde se crea)
│   ├── pages/              # Pantallas (Login, Ordenes, Detalle, Seguimiento)
│   ├── components/         # Componentes reutilizables
│   └── main.jsx
├── db/
│   └── migrations/         # Scripts SQL numerados (001_tablas.sql, 002_rls.sql...)
├── .claude/
│   └── settings.json       # Permisos de Claude Code (bloquea lectura de secretos)
├── .env.example            # Plantilla de variables (sin valores reales)
├── .env.local              # Variables reales (NO se sube a Git)
├── .gitignore
├── CLAUDE.md
├── README.md
└── package.json
```

---

## 3. Puesta en marcha

```bash
git clone <url-del-repo>
cd taller-app
npm install
cp .env.example .env.local      # luego completar con los valores reales
npm run dev                      # http://localhost:5173
```

Comandos útiles:

| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor local |
| `npm run build` | Compilar (genera `dist/`) |
| `npm run lint` | Revisar estilo y errores |
| `npm audit` | Revisar vulnerabilidades en dependencias |

---

## 4. Variables de entorno

Archivo `.env.local` (nunca se sube a Git):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

- Las variables `VITE_*` quedan **visibles en el navegador**. Por eso solo se usa la `anon key`.
- En Cloudflare se cargan en *Settings → Variables and Secrets* (sección Build).

---

## 5. Políticas de seguridad (obligatorias)

1. **Secretos**
   - Nunca subir `.env`, `.env.local` ni ningún token/contraseña a Git.
   - La clave `service_role` de Supabase **nunca** va en el frontend, en el repositorio ni se comparte en chats.
   - Nunca pegar tokens, contraseñas o claves en conversaciones con Claude u otras herramientas.
   - Si un secreto se filtra: rotarlo de inmediato en Supabase/GitHub/Cloudflare y revisar el historial de Git.
2. **Base de datos**
   - **RLS activado en todas las tablas**, sin excepciones.
   - El público solo accede a los datos mediante la función `get_order_by_token`, nunca leyendo tablas directamente.
   - Nunca exponer `client_phone` ni datos personales en la página pública.
   - Todo cambio de esquema se escribe como archivo SQL en `db/migrations/` y se revisa antes de ejecutarse.
   - Prohibido ejecutar `DROP`, `TRUNCATE` o `DELETE` sin `WHERE` sobre datos reales sin respaldo previo.
3. **Autenticación**
   - Registro público desactivado en Supabase Auth.
   - Las cuentas del taller se crean manualmente.
4. **Enlaces de clientes**
   - Siempre con token aleatorio largo. Nunca usar solo la placa ni un ID incremental.
5. **Fotos**
   - Comprimir en el navegador antes de subir (objetivo ≈ 300 KB).
   - Nombres de archivo con UUID aleatorio.
   - Solo usuarios autenticados pueden subir.
6. **Dependencias**
   - Instalar solo paquetes necesarios y conocidos. Ejecutar `npm audit` antes de cada despliegue importante.
7. **Respaldos**
   - Exportar la base de datos periódicamente (mínimo una vez al mes) y guardarla fuera de Supabase.

---

## 6. Flujo de trabajo con Git

**Regla principal: no se trabaja ni se hace commit directo en `main`.** `main` representa producción y se despliega automáticamente.

1. Actualizar: `git checkout main && git pull`
2. Crear una rama por cambio:
   - `feature/nombre-corto` → funcionalidad nueva
   - `fix/nombre-corto` → corrección de error
   - `chore/nombre-corto` → configuración, documentación, dependencias
3. Hacer commits pequeños y descriptivos (en español, en imperativo):
   - `feat: agregar subida de fotos a la orden`
   - `fix: corregir enlace de seguimiento`
   - `chore: actualizar dependencias`
4. Subir la rama: `git push -u origin feature/nombre-corto`
5. Revisar la URL de *preview* que genera Cloudflare y probar desde un celular.
6. Abrir un Pull Request hacia `main`, revisar los cambios y recién entonces hacer merge.
7. Borrar la rama ya fusionada.

Reglas adicionales:
- Prohibido `git push --force` sobre `main`.
- Activar protección de la rama `main` en GitHub (*Settings → Branches / Rulesets*), si el plan lo permite. Si no, aplicar la regla por disciplina.
- Antes de cada commit revisar `git status` y `git diff` para confirmar que no se cuela ningún secreto.

---

## 7. Convenciones de código

- Idioma del código (variables, funciones, archivos): **inglés**. Textos de interfaz y comentarios: **español**.
- Componentes en `PascalCase`, funciones y variables en `camelCase`, archivos de utilidades en `camelCase.js`.
- El cliente de Supabase se crea en un solo archivo (`src/lib/supabase.js`) y se importa desde allí.
- Diseño **mobile first**: probar siempre en pantalla de celular antes que en escritorio.
- Manejar siempre estados de carga y error al llamar a Supabase.
- No dejar `console.log` con datos de usuarios ni tokens.

---

## 8. Despliegue

1. Subir el cambio a una rama y revisar el *preview* de Cloudflare.
2. Fusionar a `main` mediante Pull Request.
3. Cloudflare despliega automáticamente.
4. Si se cambió la base de datos, ejecutar primero el SQL de `db/migrations/` en Supabase y luego fusionar.
5. Verificar en producción: login, crear orden, subir foto y abrir el enlace público desde un celular.

Configuración en Cloudflare Workers:
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy` (la carpeta `dist` se define en `wrangler.jsonc`)
- Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

En Supabase → Authentication → URL Configuration: registrar la URL de producción como *Site URL*.

---

## 9. Alcance (MVP)

Incluido:
- Login del personal
- Crear y listar órdenes
- Cambiar estado, agregar notas y subir fotos
- Página pública de seguimiento por enlace/QR
- Botón para compartir el enlace por WhatsApp

Fuera de alcance por ahora: facturación, inventario, múltiples talleres, notificaciones automáticas, app móvil nativa.
