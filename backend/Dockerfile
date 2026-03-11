# ─── Stage 1: PHP dependencies ───────────────────────────────────────────────
FROM php:8.2-fpm-alpine AS vendor

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    git curl zip unzip \
    libpng-dev oniguruma-dev libxml2-dev \
    postgresql-dev

# Install PHP extensions
RUN docker-php-ext-install \
    pdo pdo_pgsql pgsql \
    mbstring exif pcntl bcmath gd opcache

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Copy only files needed for composer install (layer-cache friendly)
COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --optimize-autoloader

# Copy the full app source then generate optimised autoloader
COPY . .

RUN composer dump-autoload --optimize --no-dev


# ─── Stage 2: Production image ───────────────────────────────────────────────
FROM php:8.2-fpm-alpine AS production

WORKDIR /var/www

# Runtime system deps
RUN apk add --no-cache \
    nginx \
    supervisor \
    postgresql-dev \
    libpng-dev oniguruma-dev libxml2-dev \
    && rm -rf /var/cache/apk/*

# PHP extensions (same set as build stage)
RUN docker-php-ext-install \
    pdo pdo_pgsql pgsql \
    mbstring exif pcntl bcmath gd opcache

# PHP-FPM config — listen on unix socket for nginx
RUN sed -i 's|listen = 127.0.0.1:9000|listen = /run/php-fpm.sock|' /usr/local/etc/php-fpm.d/www.conf \
    && sed -i 's|;listen.owner = nobody|listen.owner = nginx|' /usr/local/etc/php-fpm.d/www.conf \
    && sed -i 's|;listen.group = nobody|listen.group = nginx|' /usr/local/etc/php-fpm.d/www.conf

# PHP opcache settings for production
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.validate_timestamps=0'; \
    echo 'opcache.save_comments=1'; \
} > /usr/local/etc/php/conf.d/opcache.ini

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy supervisord config (manages nginx + php-fpm in one container)
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy app from vendor stage
COPY --from=vendor /app /var/www

# Ensure storage & cache dirs exist, fix permissions
RUN mkdir -p storage/logs storage/framework/{cache,sessions,views} bootstrap/cache \
    && chown -R nginx:nginx /var/www \
    && chmod -R 775 storage bootstrap/cache

# Expose HTTP port
EXPOSE 8000

# Entrypoint: run migrations + cache config, then start services
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
