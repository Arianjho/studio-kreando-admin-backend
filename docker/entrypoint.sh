#!/bin/sh
set -e

cd /var/www/html

# APP_KEY debe venir fijo por variable de entorno en Dokploy (no generarlo
# aquí: regenerarlo en cada deploy invalidaría sesiones/cookies cifradas).
if [ -z "$APP_KEY" ]; then
    echo "ADVERTENCIA: APP_KEY no está definida. Configúrala en las variables de entorno de Dokploy."
fi

php artisan storage:link || true

if [ "${AUTORUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache

exec "$@"
