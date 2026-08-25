# Studio Kreando — Backend

Panel de administración a medida para el estudio de arquitectura Studio Kreando, construido en Laravel 13 + Inertia.js/React. Expone también una API JSON pública (`/api/v1/*`) consumida por el sitio público (`studio-kreando-website`, repo Next.js separado).

Ver [CLAUDE.md](CLAUDE.md) / [AGENTS.md](AGENTS.md) para el detalle de stack, estructura del panel, convenciones de UI y servicios clave.

## Requisitos

- PHP ^8.3, Composer
- Node.js + npm
- PostgreSQL 17 (desarrollo). Los tests usan SQLite en memoria y no requieren Postgres.

## Puesta en marcha

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

En dos terminales:

```bash
php artisan serve
```

```bash
npm run dev
```

## Tests

```bash
php artisan test
```

## Licencia

Proyecto privado. Basado en el framework [Laravel](https://laravel.com), licenciado bajo [MIT](https://opensource.org/licenses/MIT).
