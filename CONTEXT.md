# CONTEXT.md — Contexto persistente del proyecto

Este archivo es la memoria técnica persistente de este proyecto para agentes de IA como Claude Code, Codex y otros asistentes de desarrollo.

Su objetivo es permitir que una nueva sesión pueda comprender rápidamente el proyecto sin tener que volver a analizar todo el repositorio ni depender del historial de conversaciones anteriores.

---

# INTEGRACIÓN CON AGENTES

Este archivo debe ser utilizado como contexto persistente tanto por Claude Code como por Codex.

## AGENTS.md

Si existe `AGENTS.md`:

- No elimines ni reemplaces su contenido actual.
- Conserva todas sus instrucciones existentes.
- Verifica que incluya una instrucción para leer y respetar `CONTEXT.md` antes de iniciar cualquier tarea.
- Si esa instrucción no existe, agrégala.

La instrucción puede ser equivalente a:

> Antes de iniciar cualquier tarea, lee `CONTEXT.md` y sigue sus instrucciones. Al finalizar, actualízalo únicamente cuando los cambios realizados afecten información relevante para futuras sesiones.

Si `AGENTS.md` no existe, puede crearse únicamente si Codex lo necesita como archivo de instrucciones persistentes.

---

## CLAUDE.md

Si existe `CLAUDE.md`:

- No elimines ni reemplaces su contenido actual.
- Conserva todas sus instrucciones existentes.
- Verifica que incluya una instrucción para leer y respetar `CONTEXT.md` antes de iniciar cualquier tarea.
- Si esa instrucción no existe, agrégala.

La instrucción puede ser equivalente a:

> Antes de iniciar cualquier tarea, lee `CONTEXT.md` y sigue sus instrucciones. Al finalizar, actualízalo únicamente cuando los cambios realizados afecten información relevante para futuras sesiones.

Si `CLAUDE.md` no existe, puede crearse únicamente si Claude Code lo necesita como archivo de instrucciones persistentes.

---

# REGLAS PARA EL AGENTE

## Al iniciar cualquier tarea

Antes de modificar código:

1. Lee este archivo completo.
2. Utilízalo para comprender:
   - propósito del proyecto;
   - estado actual;
   - arquitectura;
   - stack tecnológico;
   - módulos;
   - reglas de negocio;
   - convenciones;
   - decisiones técnicas;
   - integraciones;
   - pendientes relevantes.
3. Después inspecciona únicamente los archivos del proyecto necesarios para resolver la tarea actual.
4. No recorras todo el repositorio innecesariamente si este contexto ya indica dónde se encuentra la información relevante.
5. Cuando necesites conocer el comportamiento exacto de una funcionalidad, verifica siempre el código real.

El código y la configuración actual son la fuente de verdad.

Si este archivo contradice claramente al código actual, verifica cuál es el comportamiento correcto y actualiza este documento.

---

# MANTENIMIENTO AUTOMÁTICO DEL CONTEXTO

Al finalizar cada tarea, evalúa obligatoriamente si los cambios realizados afectan información que sería útil para una futura sesión.

Actualiza este archivo solamente cuando sea necesario.

Debe actualizarse cuando ocurra alguno de estos casos:

- Se crea un módulo importante.
- Se completa una funcionalidad importante.
- Cambia significativamente el estado de un módulo.
- Cambia la arquitectura.
- Cambia el stack tecnológico.
- Se incorpora o elimina una integración.
- Se introduce una regla de negocio importante.
- Cambia autenticación, autorización o seguridad.
- Se adopta una nueva convención técnica.
- Se toma una decisión técnica importante.
- Cambia de forma relevante la estructura del proyecto.
- Aparece un nuevo pendiente importante.
- Se resuelve un pendiente registrado aquí.
- Se descubre que alguna información de este archivo está desactualizada.

No debe actualizarse por:

- Correcciones menores.
- Cambios visuales pequeños.
- Ajustes triviales.
- Renombrados sin impacto.
- Refactors internos que no cambien arquitectura ni comportamiento relevante.
- Bugs pequeños cuya solución no afecte cómo debe entenderse el proyecto.
- Cambios que ya están correctamente representados por el contexto existente.

Antes de terminar cada tarea, haz internamente esta comprobación:

> ¿Lo que acabo de hacer es algo que otra sesión de IA necesitaría conocer para continuar trabajando correctamente en este proyecto?

Si la respuesta es sí, actualiza este archivo.

Si la respuesta es no, no lo modifiques.

---

# REGLAS DE CALIDAD DEL CONTEXTO

Este archivo NO debe convertirse en:

- un changelog;
- un historial de cada tarea realizada;
- una copia del código;
- una lista de todos los archivos;
- documentación exhaustiva;
- un registro de cada endpoint, clase o método.

Debe mantenerse:

- breve;
- útil;
- actualizado;
- fácil de escanear;
- orientado a decisiones y contexto;
- sin información redundante.

Prioriza información que permita a una futura sesión trabajar correctamente sin tener que reconstruir todo el contexto desde cero.

Cuando una sección deje de ser válida, corrígela o elimínala en lugar de acumular información histórica innecesaria.

---

# CONTEXTO DEL PROYECTO

## 1. Resumen

Panel de administración a medida para el estudio de arquitectura Studio Kreando (Laravel 13 + Inertia.js v2 + React 18). Reemplaza un backend previo en Next.js/PayloadCMS. Expone además una API JSON pública de solo lectura (`/api/v1/*`, salvo el alta de consultas) consumida por el sitio público `studio-kreando-website` (repo hermano, Next.js).

## 2. Estado actual

Funcional y en desarrollo activo. CRUD de proyectos/categorías/medios/usuarios, contenido singleton (home/about/contact/ajustes), gestión de consultas de contacto con pipeline de 3 estados y respuesta por WhatsApp, dashboard con estadísticas, y documentación OpenAPI de la API pública. Rama única `main` (sin remoto configurado). Identidad visual (logo + paleta de marca) aplicada en todo el panel.

## 3. Stack tecnológico

- PHP 8.3, Laravel 13, Breeze (auth base: login/reset/verify, sin auto-registro público).
- Inertia.js v2 + React 18 (`resources/js`), Ziggy para rutas nombradas en JS.
- Tailwind CSS v4 vía `@tailwindcss/vite`, config nativa en `resources/css/app.css` (`@theme`, tokens oklch, sin `tailwind.config.js`/`postcss.config.js`).
- shadcn/ui-style components sobre Radix UI (`resources/js/Components/ui`), lucide-react para iconos, sonner para toasts.
- PostgreSQL 17 en desarrollo; SQLite en memoria en tests (`phpunit.xml`).
- `dedoc/scramble` para OpenAPI/Swagger de la API pública.
- Vite 8 + `laravel-vite-plugin` para el build de frontend.

## 4. Arquitectura

- Backend clásico Laravel MVC + Inertia (sin SPA API separada para el panel): controladores devuelven `Inertia::render(...)`.
- API pública desacoplada en `routes/api.php` / `app/Http/Controllers/Api/*`, todas las respuestas envueltas por `App\Http\Responses\ApiResponse::build()` (`{success, message, data, errors, meta}`).
- `App\Services\*` concentra integraciones externas (subida de medios, WhatsApp, revalidación ISR del sitio público) para no acoplarlas a los controladores.
- Un solo repo cubre panel admin + API pública; el consumidor de la API (`studio-kreando-website`) es un proyecto Next.js aparte.

## 5. Estructura relevante

- `routes/web.php` — rutas del panel (`admin.*`, prefijo `/admin`, middleware `auth`+`verified`). Fuente de verdad de nombres de ruta, consumidos por `resources/js/Layouts/AppSidebar.jsx`.
- `routes/api.php` — API pública bajo `v1` (ver sección 10).
- `app/Http/Controllers/Admin/*` — un controlador por recurso del panel.
- `app/Http/Controllers/Api/*` — un controlador por endpoint público.
- `app/Models/*` — `Category`, `Project`, `Consulta`, `ConsultaWhatsappMessage`, `Media`, `User`, `ContactFormOption`, y singletons `HomeContent`/`AboutContent`/`ContactContent`/`SiteSetting`.
- `app/Services/*` — `MediaUploadService`, `WhatsAppService`, `RevalidateService`.
- `resources/js/Pages/Admin/*` — páginas Inertia del panel; `resources/js/Layouts/*` — `AdminLayout`, `AppSidebar`, `TopNav`, `GuestLayout`; `resources/js/Components/ui/*` — componentes reutilizables (modales, cards, chart, etc.).
- `config/scramble.php` — config de la documentación OpenAPI.
- `tests/Feature/Admin/*ControllerTest.php`, `tests/Feature/Api/*Test.php`, `tests/Feature/Auth/*Test.php`.

## 6. Módulos y estado

| Módulo | Estado |
|---|---|
| Auth (Breeze) | Completo. Sin auto-registro; solo un admin autenticado crea usuarios. |
| Categorías / Proyectos | CRUD completo, soft delete, con galería vía `Media`. |
| Consultas (contacto) | Completo. Renombrado desde "Messages"; pipeline de 3 estados (`nuevo` → `contactado` al responder por WhatsApp → cerrado vía `closed_at`), sin paginación server-side (lista completa con filtros en cliente). |
| Medios | CRUD completo, con dimensiones (`width`/`height`) calculadas al subir. |
| Usuarios | CRUD completo; un usuario no puede eliminarse a sí mismo. |
| Contenido singleton (home/about/contact/ajustes) | Completo; formularios agrupados en tabs. Incluye `ContactFormOption` (opciones del formulario público, CRUD propio). |
| Dashboard | Completo: cards de estadísticas + gráfico de consultas por mes (SVG propio, sin librería). |
| Documentación API (Scramble) | Completa; UI en `/docs/api`, spec en `/docs/api.json`, gate `viewApiDocs` fuera de `local`. |
| Identidad visual | Completa: logo + paleta de marca (oklch, derivada del navy `#113959` del logo) aplicados en sidebar, topnav, guest layout, favicon y dashboard. |
| Notificación por email de nuevas consultas | No implementado. El form de contacto solo persiste en BD (`Consulta`); no envía correo. `MAIL_MAILER=log` en dev (no entrega real). |

## 7. Reglas de negocio importantes

- Sin auto-registro público de usuarios del panel; solo un admin ya autenticado puede crear otros usuarios.
- Un usuario no puede eliminarse a sí mismo.
- Los singletons de contenido (home/about/contact/settings) son una sola fila cada uno, sin soft delete.
- `Category`, `Project`, `Consulta`, `Media`, `User` sí usan `SoftDeletes`.
- Consultas: estado `nuevo` por defecto; pasa a `contactado` al enviar WhatsApp (`responded_at` se registra); se puede cerrar explícitamente (`closed_at`). Cada envío de WhatsApp queda registrado en `ConsultaWhatsappMessage`.
- API pública: solo lectura de contenido publicado, sin autenticación; única escritura pública es `POST /api/v1/consultas` (antes `/messages`), limitada a `throttle:10,1`.
- Documentación OpenAPI abierta en entorno `local`; en cualquier otro entorno requiere el gate `viewApiDocs` (cualquier usuario del panel autenticado).

## 8. Convenciones técnicas

- Todo CRUD del panel ocurre en modales (`FormModal.jsx`, `ConfirmModal.jsx`, `Modal.jsx` como primitivo base).
- Interfaz en español; código (nombres, comentarios si se piden, commits) en las convenciones normales del lenguaje/repo.
- Subidas de archivo en updates usan `router.post(...)` con `_method` spoofing y `forceFormData: true` (Inertia no soporta multipart nativo en PUT/PATCH).
- Paleta de marca definida como tokens oklch en `resources/css/app.css` (`:root` claro / `.dark` oscuro); componente `<Logo variant tone height>` reutilizable para mostrar el logo en cualquier layout.
- Layout admin sin ancho máximo global (`AdminLayout`: contenedor `w-full`, sin `max-w-7xl mx-auto`) para respetar zoom reducido del navegador del usuario.
- Atributos de Scramble (`#[Group]`, `#[QueryParameter]`, `#[PathParameter]`, `#[Response]`) solo se añaden en `Api/*Controller` cuando la inferencia automática no basta.
- No usar el plugin/skills `superpowers` en este repo; no instalar Laravel Boost ni otros plugins/skills de agente (instrucción explícita y recurrente del usuario, ver `CLAUDE.md`).

## 9. Autenticación y seguridad

- Breeze: login, reset y verificación de email; sin registro público.
- Middleware `auth`+`verified` en todas las rutas `/admin/*`.
- API pública sin autenticación (solo lectura + un endpoint de escritura con throttle).
- Documentación OpenAPI protegida fuera de `local` por el gate `viewApiDocs` (`AppServiceProvider`).

## 10. Integraciones externas

- **API pública** (`routes/api.php`, prefijo `v1`): `categories`, `projects` (+ `projects/{slug}`), `home`, `about`, `contact`, `site-settings`, `POST consultas` (throttle 10/min). Consumida por `studio-kreando-website`.
- **WhatsApp** (`App\Services\WhatsAppService`): envía texto vía Evolution API (`POST {WHATSAPP_URL}/message/sendText/{WHATSAPP_INSTANCE}`, header `apikey`). Normaliza teléfonos de 9 dígitos a `51XXXXXXXXX`. Config en `config/services.php` (`whatsapp`), env vars `WHATSAPP_URL`/`WHATSAPP_INSTANCE`/`WHATSAPP_API_KEY`/`WHATSAPP_VERIFY_SSL`.
- **Revalidación ISR** (`App\Services\RevalidateService::trigger($tag)`): webhook firmado hacia `studio-kreando-website` (`/api/revalidate`, `REVALIDATE_URL`/`REVALIDATE_SECRET`). Fallos de red no son fatales, solo `WARNING` en log. Cada controlador de escritura debe llamarlo con el tag correspondiente antes del `return`.
- **Email**: sin proveedor configurado. `MAIL_MAILER=log` (escribe en `storage/logs/laravel.log`, no entrega real). Ningún flujo actual envía correo (las consultas de contacto solo se persisten en BD).
- **Scramble** (`dedoc/scramble`): genera OpenAPI de `/api/v1/*` por análisis estático, sin anotaciones obligatorias.

## 11. Decisiones técnicas importantes

- Despliegue en Dokploy vía `Dockerfile` (multi-stage: assets con node,
  dependencias con composer, runtime final `php:8.3-fpm-alpine` + nginx
  + supervisord en un solo contenedor, config en `docker/`). `APP_KEY`
  y demás env deben fijarse en Dokploy (no se generan en el contenedor).
  `docker/entrypoint.sh` corre `migrate --force` (controlable con
  `AUTORUN_MIGRATIONS=false`) y cachea config/rutas/vistas en cada boot.
  `bootstrap/cache/*.php` va en `.dockerignore`: son cache de paquetes
  generada en local con dependencias de dev (p. ej. `laravel/pail`) y
  rompen el contenedor si se copian, porque el build de imagen usa
  `composer install --no-dev`.


- Un solo branch de trabajo: `main` (se hizo merge/rename desde `master` + `laravel-rewrite`, sin remoto).
- Tailwind v4 sin archivo de config; toda la paleta/tema vive en `resources/css/app.css`.
- Envelope de respuesta uniforme (`ApiResponse`) en toda la API pública; Scramble lo infiere sin anotaciones extra.
- Gráfico del dashboard implementado en SVG puro (sin librería de charts) para no sumar dependencias.
- Paleta de marca derivada matemáticamente del navy del logo (`#113959` ≈ `oklch(0.28 0.06 255)`), reutilizada en `--primary`, `--brand`, `--sidebar*`, `--gradient-brand`.

## 12. Pendientes relevantes

- Decidir si se agrega notificación por email al llegar una consulta nueva (requiere elegir proveedor: Resend, SMTP de Gmail, etc. — ninguno instalado aún).
- Unificar naming de marca: textos usan "Studio Kreando", el logo dice "KreanDDO Arquitectos" (sin resolver).
- Evaluar si páginas de contenido/formularios necesitan su propio `max-w` ahora que el cap global del layout admin se quitó.

## 13. Último estado relevante

CONTEXT.md inicializado (2026-09-13) a partir del código y configuración reales del repo en `main`, commit `0a8e8c2` ("Consultas: drop server pagination, always show the WhatsApp action"). Módulo de consultas ya migrado por completo de "Messages" a "Consultas" con pipeline de 3 estados y respuesta por WhatsApp; dashboard e identidad visual de marca ya implementados.

2026-10-12: agregado `Dockerfile` + `docker/` (nginx, supervisord, entrypoint) + `.dockerignore` para desplegar en Dokploy. Build y arranque verificados localmente end-to-end (migró, seedeó `ContentSeeder` y sirvió `/api/v1/*` con datos reales desde el contenedor). De paso se corrigió `resources/js/Components/ui/Badge.jsx` → `badge.jsx`: en Windows el casing distinto del import (`@/Components/ui/badge`) no daba error, pero en Linux (y por tanto en el build de Docker) sí, por case-sensitivity del filesystem.
