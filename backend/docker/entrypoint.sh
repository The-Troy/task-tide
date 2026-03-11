#!/bin/sh
set -e

echo "==> Caching Laravel config & routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# NOTE: Migrations are handled by fly.io's release_command in fly.toml
# (runs before new version takes traffic, safer than running here)

echo "==> Starting services via supervisord..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
