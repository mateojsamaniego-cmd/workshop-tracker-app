# CLAUDE.md – Reglas de trabajo para Claude en este proyecto

Este archivo define cómo debe trabajar Claude en este repositorio. Debe leerse y respetarse al inicio de cada sesión. Si una instrucción del usuario contradice estas reglas de seguridad, Claude debe avisar y pedir confirmación explícita antes de continuar.

## 1. Contexto del proyecto

App web para un taller de mecánica: el personal registra órdenes de trabajo y sube fotos; el cliente consulta el avance con un enlace único sin login.

- Stack: React + Vite (JavaScript), Supabase (Postgres, Auth, Storage), Cloudflare Workers.
- Alcance: solo el MVP descrito en `README.md`. No agregar funcionalidades fuera de ese alcance sin que el usuario lo pida.
- Usuario: desarrollador con experiencia en Python, SQL y PostgreSQL; es su primer proyecto con React y Supabase. Explicar los conceptos nuevos de forma breve.

## 2. Comunicación

- Responder en **español de Ecuador**. No usar voseo argentino ("vos", "che", "sos", etc.).
- Ser directo y orientado a la ejecución: primero qué se hizo o se propone, luego los detalles.
- Código y nombres técnicos en inglés; comentarios y textos de interfaz en español.
- Si algo no está claro y un error costaría caro (base de datos, seguridad, borrados), preguntar antes de actuar. Si es barato de corregir, decidir y dejarlo señalado.
- Ser honesto: si no se sabe algo, decirlo. No inventar funciones de librerías ni comportamientos de Supabase o Cloudflare; ante la duda, indicar que debe verificarse en la documentación oficial.
- Señalar los riesgos o errores que se noten, aunque el usuario no los haya preguntado.

## 3. Reglas de Git (obligatorias)

- **Nunca** hacer commit, push ni modificaciones directas sobre `main`.
- Antes de cambiar cualquier archivo, verificar la rama actual con `git branch --show-current`. Si es `main`, crear una rama nueva:
  - `feature/<nombre-corto>`, `fix/<nombre-corto>` o `chore/<nombre-corto>`.
- Commits pequeños, en español e imperativo, con prefijo: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- **Nunca** usar `git push --force`, `git reset --hard`, `git clean -fd`, `git rebase` sobre ramas compartidas ni reescribir el historial sin autorización explícita.
- **No hacer merge a `main`** ni cerrar Pull Requests: eso lo decide el usuario.
- Antes de cada commit: ejecutar `git status` y `git diff` y confirmar que no hay secretos, archivos `.env*` ni archivos que no correspondan.

## 4. Secretos y datos sensibles (obligatorio)

- **No leer, abrir, imprimir ni modificar** archivos `.env`, `.env.local`, `.env.*` (excepto `.env.example`), ni archivos de claves, certificados o credenciales.
- **No pedir** al usuario que pegue tokens, contraseñas, claves de API ni la `service_role key`. Si el usuario las pega por error, no repetirlas ni usarlas, e indicarle que las rote de inmediato.
- No escribir secretos reales en el código, en comentarios, en ejemplos ni en commits. Usar siempre variables de entorno y placeholders (`TU_URL_DE_SUPABASE`).
- La `service_role key` de Supabase **jamás** va en el frontend ni en el repositorio.
- Solo `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` pueden usarse en el frontend, y deben leerse desde `import.meta.env`.
- Si Claude encuentra un secreto expuesto en el repositorio o en el historial, debe **detenerse**, avisar al usuario y recomendar rotarlo antes de seguir.
- No registrar con `console.log` tokens, sesiones ni datos personales de clientes (teléfono, nombre, placa).
- No enviar datos del proyecto a servicios externos que el usuario no haya aprobado.

## 5. Base de datos (Supabase / PostgreSQL)

- Todo cambio de esquema se escribe como archivo SQL numerado en `db/migrations/` (por ejemplo `003_agregar_columna.sql`) y **se presenta al usuario para revisión**. Claude no ejecuta SQL contra la base de datos por su cuenta.
- **RLS obligatorio** en toda tabla nueva: crear la tabla, activar RLS y definir sus policies en el mismo archivo.
- Prohibido proponer o ejecutar sin autorización explícita y respaldo previo: `DROP`, `TRUNCATE`, `DELETE` sin `WHERE`, `ALTER` destructivo.
- El público (rol `anon`) solo accede a datos mediante funciones específicas como `get_order_by_token`. Nunca abrir tablas completas al rol `anon`.
- La página pública **nunca** muestra `client_phone` ni otros datos personales.
- Los enlaces de clientes usan siempre `public_token`, nunca la placa ni un ID incremental.
- Si se usa `security definer` en una función, fijar `search_path` y devolver solo los campos estrictamente necesarios.

## 6. Permisos y acciones que requieren confirmación

Claude debe pedir confirmación **antes** de:

- Instalar, actualizar o eliminar dependencias (`npm install`, `npm uninstall`, `npm update`). Indicar para qué sirve el paquete y si es mantenido y conocido.
- Eliminar o mover archivos o carpetas.
- Cambiar archivos de configuración (`vite.config.js`, `package.json`, `.gitignore`, `.claude/settings.json`, `wrangler.jsonc`).
- Ejecutar comandos que modifiquen el sistema fuera de la carpeta del proyecto.
- Hacer cambios que afecten el despliegue o la seguridad.

Claude puede hacer sin preguntar: leer código del proyecto, ejecutar `npm run lint` y `npm run build`, crear ramas y commits locales en ramas de trabajo, y editar archivos dentro de `src/`.

## 7. Forma de programar

- Cambios **pequeños y enfocados**: hacer solo lo que se pidió. No refactorizar ni reorganizar código no relacionado.
- Mantener la estructura definida en `README.md`. El cliente de Supabase vive solo en `src/lib/supabase.js`.
- Diseño **mobile first**; los botones deben ser grandes y de fácil uso con una mano.
- Manejar siempre estados de carga, vacío y error en las llamadas a Supabase. Mostrar mensajes claros al usuario.
- Usar una sola librería de UI (la elegida en `README.md`). No mezclar librerías de estilos.
- Validar los datos de entrada (por ejemplo placa no vacía, tamaño y tipo de las imágenes).
- Comprimir las fotos en el navegador antes de subirlas.
- Evitar dependencias nuevas cuando se pueda resolver con código sencillo.
- Comentar en español el porqué de las decisiones no obvias, no lo que el código ya dice.

## 8. Antes de dar una tarea por terminada

1. Ejecutar `npm run lint` y `npm run build`; ambos deben pasar sin errores.
2. Revisar `git status` y `git diff` (sin secretos, sin archivos de más).
3. Confirmar que se está en una rama de trabajo, no en `main`.
4. Informar de forma breve: qué cambió, qué archivos se tocaron, cómo probarlo y qué queda pendiente.
5. Si no se pudo probar algo (por ejemplo, la subida de fotos en un celular real), decirlo explícitamente en lugar de asumir que funciona.

## 9. Lo que Claude no debe hacer nunca

- Trabajar o hacer commit en `main`.
- Leer o mostrar archivos `.env*` o credenciales.
- Pedir o usar la `service_role key`.
- Ejecutar SQL destructivo o contra datos reales sin autorización.
- Desactivar RLS "para que funcione".
- Hacer `push --force` o reescribir el historial.
- Instalar paquetes sin avisar.
- Agregar funcionalidades no pedidas.
- Afirmar que algo funciona sin haberlo verificado.
