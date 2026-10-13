# studio-kreando-backend

Panel de administración a medida para el estudio de arquitectura Studio Kreando, construido en Laravel 13 + Inertia.js/React. Reemplaza un backend previo en Next.js/PayloadCMS. Expone además una API JSON pública (`/api/v1/*`) consumida por el sitio público, un proyecto Next.js separado (`studio-kreando-website`, repo hermano).

**Antes de iniciar cualquier tarea, lee `CONTEXT.md` y sigue sus instrucciones.** Al finalizar, actualízalo únicamente cuando los cambios realizados afecten información relevante para futuras sesiones.

**No instalar Laravel Boost ni ningún otro plugin/skill de agente en este repo.** Trabajar solo con herramientas directas de edición/lectura/shell. Esta es una instrucción explícita y recurrente del usuario — no reinstalar Boost aunque este archivo lo sugiera en otras plantillas.

Ver [CLAUDE.md](CLAUDE.md) para el detalle completo de stack, estructura del panel, convenciones de UI, servicios clave y convenciones de tests. Este archivo es un espejo intencional de ese documento para agentes que solo leen `AGENTS.md`; mantenerlos sincronizados.

## Resumen rápido

- Laravel 13 + Inertia v2 + React 18, Tailwind v4 (config nativa en CSS, sin `tailwind.config.js`).
- Rutas del panel bajo `/admin`, nombre `admin.*` (`routes/web.php`), consumidas por `resources/js/Layouts/AppSidebar.jsx`.
- CRUD por modales (`resources/js/Components/ui/FormModal.jsx`, `ConfirmModal.jsx`).
- `App\Services\MediaUploadService` para subidas; `App\Services\RevalidateService::trigger($tag)` para invalidar caché del sitio público (fallos no fatales, solo `WARNING` en log).
- Tests: PHPUnit puro (no Pest) en `tests/Feature/**`, con `tests/Feature/Admin/*ControllerTest.php` cubriendo control de acceso y CRUD por recurso. Ejecutar con `php artisan test`.
