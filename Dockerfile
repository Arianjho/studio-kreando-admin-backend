# syntax=docker/dockerfile:1

# Imagen de producción para Dokploy: nginx + php-fpm + supervisord en un solo
# contenedor. Multi-stage para no arrastrar node/composer a la imagen final.

# ---- 1. Assets (Vite/React) ----
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- 2. Dependencias PHP (composer) ----
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev --no-interaction --no-progress --no-scripts --no-autoloader --prefer-dist
COPY . .
RUN composer dump-autoload --no-dev --optimize

# ---- 3. Runtime ----
FROM php:8.3-fpm-alpine AS production

# Extensiones PHP: pdo_pgsql (Postgres), mbstring/intl (Carbon::translatedFormat
# en el dashboard), bcmath/zip/opcache/pcntl de uso general.
RUN apk add --no-cache nginx supervisor libpq libzip icu-libs oniguruma \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS postgresql-dev libzip-dev icu-dev oniguruma-dev \
    && docker-php-ext-install pdo_pgsql mbstring intl bcmath zip opcache pcntl \
    && apk del .build-deps

WORKDIR /var/www/html

COPY --from=vendor /app/vendor ./vendor
COPY . .
COPY --from=frontend /app/public/build ./public/build

RUN addgroup -g 1000 www && adduser -D -G www -u 1000 www \
    && mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chown -R www:www /var/www/html \
    && chmod -R 775 storage bootstrap/cache

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
