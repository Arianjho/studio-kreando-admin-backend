# studio-kreando-backend

Panel de administración a medida para el estudio de arquitectura Studio Kreando, construido en Laravel 13 + Inertia.js/React. Reemplaza un backend previo en Next.js/PayloadCMS. Expone además una API JSON pública (`/api/v1/*`) consumida por el sitio público, un proyecto Next.js separado (`studio-kreando-website`, repo hermano).

**No instalar Laravel Boost ni ningún otro plugin/skill de agente en este repo.** Trabajar solo con herramientas directas (Read/Write/Edit/Bash/etc). Esta es una instrucción explícita y recurrente del usuario.

**No usar las skills de `superpowers` (brainstorming, systematic-debugging, writing-plans, etc.) en este repo.** Trabajar directo: explorar, proponer en el chat de forma breve, y ejecutar. Instrucción explícita del usuario.

## Stack

- Laravel 13 (PHP ^8.3), Breeze como scaffold de auth base (login/reset/verify, sin auto-registro público).
- Inertia.js v2 + React 18 para el panel (`resources/js`).
- Tailwind CSS v4 vía `@tailwindcss/vite` — configuración `@theme` nativa en CSS (`resources/css/app.css`), sin `tailwind.config.js` ni `postcss.config.js`. Paleta de marca en oklch (`--color-brand-25` … `--color-brand-950`).
- PostgreSQL 17 en desarrollo (`studio_kreando`, usuario `postgres`). Los tests usan SQLite en memoria (ver `phpunit.xml`), completamente aislado de la BD de desarrollo.
- Diseño visual inspirado en TailAdmin (referencia en repo hermano `tailadmin-ref`), con soporte claro/oscuro (por defecto sigue preferencia del SO).

## Estructura del panel admin

Todas las rutas del panel viven bajo el prefijo `/admin`, con nombre de ruta `admin.*`, middleware `auth`+`verified`. Ver `routes/web.php` como fuente de verdad; `resources/js/Layouts/AppSidebar.jsx` consume esos nombres de ruta directamente (`route().has(...)`).

Recursos CRUD y sus controladores (`app/Http/Controllers/Admin/`):

- `CategoryController` — categorías de proyectos.
- `ProjectController` — proyectos del portafolio (portada + galería vía `Media`).
- `MessageController` — mensajes del formulario de contacto público (solo lectura/marcar leído/eliminar).
- `MediaController` — biblioteca de medios.
- `UserController` — usuarios del panel (sin auto-registro; solo un admin ya autenticado puede crear usuarios; un usuario no puede eliminarse a sí mismo).
- `HomeContentController`, `AboutContentController`, `ContactContentController`, `SiteSettingController` — páginas de contenido singleton (una sola fila cada una, sin soft delete).

Modelos con `SoftDeletes`: `Category`, `Project`, `Message`, `Media`, `User`. Los singletons de contenido NO usan soft delete.

## Convenciones de UI

- Todo CRUD ocurre en modales: modal genérico de crear/editar (`resources/js/Components/ui/FormModal.jsx`), modal de confirmación genérico (`resources/js/Components/ui/ConfirmModal.jsx`, usado también para logout), y `Modal.jsx` como primitivo base.
- Interfaz en español; el código (nombres, comentarios si se piden, commits) sigue las convenciones normales del repo/lenguaje.
- Subidas de archivo en formularios PUT/PATCH usan `router.post(...)` con `_method` spoofing y `forceFormData: true` (Inertia no soporta multipart en PUT/PATCH nativos).

## Servicios clave

- `App\Services\MediaUploadService::store(UploadedFile $file, string $alt, string $disk = 'public'): Media` — helper compartido para toda subida de archivo.
- `App\Services\RevalidateService::trigger(string $tag)` — dispara un webhook firmado hacia `studio-kreando-website` (`/api/revalidate`) para invalidar caché ISR/SSG. Los fallos de red se capturan y solo generan un `WARNING` en `storage/logs/laravel.log`; nunca son fatales. Cada controlador de escritura (`store`/`update`/`destroy`) debe llamarlo con el tag correspondiente al final, antes del `return`.

## Documentación de la API (OpenAPI / Swagger)

- Generada con **Scramble** (`dedoc/scramble`), sin anotaciones obligatorias: infiere rutas, params, request (`FormRequest`) y response (API Resources + envelope `ApiResponse`) por análisis estático. UI en `/docs/api` (Stoplight Elements), spec JSON en `/docs/api.json`, export a archivo con `php artisan scramble:export`.
- Config en `config/scramble.php` (`api_path => 'api'` cubre `/api/v1/*`). Versión vía `API_VERSION` en `.env`.
- Acceso: abierta en entorno `local`; en cualquier otro entorno exige el gate `viewApiDocs` (definido en `AppServiceProvider`, cualquier usuario del panel autenticado).
- Retoques puntuales vía atributos de Scramble en `app/Http/Controllers/Api/*` (`#[Group]`, `#[QueryParameter]`, `#[PathParameter]`, `#[Response]`). Solo añadir cuando la inferencia se queda corta.
- Scramble cachea la spec **solo** si se corre `php artisan scramble:cache` (limpiar con `scramble:clear`); en dev/tests se regenera en cada request.

## Tests

- PHPUnit puro (no Pest, pese a que `pestphp/pest-plugin` aparece en `composer.json`), siguiendo la convención de `tests/Feature/ProfileTest.php`: `extends Tests\TestCase`, `use RefreshDatabase`, `actingAs()`, aserciones sobre sesión/BD.
- Tests de control de acceso por recurso admin en `tests/Feature/Admin/*ControllerTest.php` (Categories, Projects, Messages, Media, Users, Content singletons): verifican redirect a login para invitados, acceso autenticado, validación básica y comportamiento de soft delete donde aplica.
- `tests/Feature/Api/OpenApiDocsTest.php`: verifica el gate de `/docs/api`, que el documento OpenAPI liste los 8 endpoints públicos y que queden documentados los query params (`featured`, `category`) y respuestas de error (404, 422, 429).
- Ejecutar con `php artisan test` (usa SQLite en memoria vía `phpunit.xml`, no toca la BD de desarrollo).

## Notas de entorno de este agente

- En Windows, al probar en navegador vía `mcp__Claude_Browser__*`, el panel del navegador puede no compositar frames, por lo que `computer{action:"left_click"}` puede no registrar clics reales aunque la llamada reporte éxito. Workaround confiable: usar `form_input` para fijar valores de campos y `javascript_tool` (`dispatchEvent(new MouseEvent('click', ...))`) para disparar clics de botones.
