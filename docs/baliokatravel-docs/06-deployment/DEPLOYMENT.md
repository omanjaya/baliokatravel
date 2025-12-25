# 🚀 Deployment Guide - BaliokaTravel

## Ubuntu VPS + Nginx + Laravel Octane

---

## Server Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 1 GB | 2 GB |
| CPU | 1 Core | 2 Cores |
| Storage | 20 GB SSD | 40 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |

---

## Step 1: Server Initial Setup

```bash
# Login as root
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Create deployment user
adduser deploy
usermod -aG sudo deploy

# Setup SSH key
su - deploy
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys  # paste your public key
chmod 600 ~/.ssh/authorized_keys

# Setup Firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## Step 2: Install Required Software

### PHP 8.3

```bash
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

sudo apt install -y php8.3-fpm php8.3-cli php8.3-common \
    php8.3-pgsql php8.3-mbstring php8.3-xml php8.3-curl \
    php8.3-zip php8.3-gd php8.3-bcmath php8.3-intl \
    php8.3-readline php8.3-redis

php -v
```

### Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql << EOF
CREATE USER baliokatravel WITH PASSWORD 'your_secure_password';
CREATE DATABASE baliokatravel OWNER baliokatravel;
GRANT ALL PRIVILEGES ON DATABASE baliokatravel TO baliokatravel;
EOF
```

### Redis

```bash
sudo apt install -y redis-server
sudo systemctl enable redis-server

# Secure Redis
sudo nano /etc/redis/redis.conf
# Set: supervised systemd
# Set: bind 127.0.0.1 ::1

sudo systemctl restart redis-server
```

### Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

---

## Step 3: Deploy Application

### Clone Repository

```bash
sudo mkdir -p /var/www/baliokatravel
sudo chown deploy:deploy /var/www/baliokatravel
cd /var/www/baliokatravel

git clone git@github.com:yourusername/baliokatravel.git .
```

### Install Dependencies

```bash
# PHP dependencies
composer install --no-dev --optimize-autoloader

# Node dependencies & build
npm ci
npm run build
```

### Configure Environment

```bash
cp .env.example .env
nano .env
```

```env
APP_NAME=BaliokaTravel
APP_ENV=production
APP_DEBUG=false
APP_URL=https://baliokatravel.com

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=baliokatravel
DB_USERNAME=baliokatravel
DB_PASSWORD=your_secure_password

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=resend
RESEND_API_KEY=re_xxxx

STRIPE_KEY=pk_live_xxxx
STRIPE_SECRET=sk_live_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

OCTANE_SERVER=frankenphp
```

### Setup Application

```bash
# Generate key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Seed data
php artisan db:seed --class=BaliAreaSeeder
php artisan db:seed --class=CategorySeeder

# Storage link
php artisan storage:link

# Optimize
php artisan optimize
php artisan filament:optimize
php artisan view:cache
php artisan route:cache
php artisan config:cache

# Set permissions
sudo chown -R deploy:www-data /var/www/baliokatravel
sudo chmod -R 755 /var/www/baliokatravel
sudo chmod -R 775 /var/www/baliokatravel/storage
sudo chmod -R 775 /var/www/baliokatravel/bootstrap/cache
```

---

## Step 4: Install Laravel Octane (FrankenPHP)

```bash
# Install Octane
composer require laravel/octane

# Install FrankenPHP
php artisan octane:install --server=frankenphp

# Download FrankenPHP binary
cd /var/www/baliokatravel
curl -L https://github.com/dunglas/frankenphp/releases/latest/download/frankenphp-linux-x86_64 -o frankenphp
chmod +x frankenphp
```

---

## Step 5: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/baliokatravel
```

```nginx
upstream octane {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    listen [::]:80;
    server_name baliokatravel.com www.baliokatravel.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name baliokatravel.com www.baliokatravel.com;

    root /var/www/baliokatravel/public;
    index index.php;

    # SSL (akan diisi Certbot)
    ssl_certificate /etc/letsencrypt/live/baliokatravel.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/baliokatravel.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Static files
    location /build/ {
        alias /var/www/baliokatravel/public/build/;
        expires 1y;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    location /storage/ {
        alias /var/www/baliokatravel/storage/app/public/;
        expires 7d;
        access_log off;
    }

    # Proxy to Octane
    location / {
        proxy_pass http://octane;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/baliokatravel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 6: SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx

sudo certbot --nginx -d baliokatravel.com -d www.baliokatravel.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Step 7: Supervisor (Process Manager)

```bash
sudo apt install -y supervisor
```

### Octane Service

```bash
sudo nano /etc/supervisor/conf.d/octane.conf
```

```ini
[program:octane]
command=/var/www/baliokatravel/frankenphp php-server --worker /var/www/baliokatravel/public/index.php --listen 127.0.0.1:8000
directory=/var/www/baliokatravel
user=deploy
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
redirect_stderr=true
stdout_logfile=/var/www/baliokatravel/storage/logs/octane.log
stopwaitsecs=60
```

### Queue Worker

```bash
sudo nano /etc/supervisor/conf.d/queue.conf
```

```ini
[program:queue-worker]
command=php /var/www/baliokatravel/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
directory=/var/www/baliokatravel
user=deploy
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/baliokatravel/storage/logs/queue.log
stopwaitsecs=60
```

### Scheduler (Cron)

```bash
sudo nano /etc/supervisor/conf.d/scheduler.conf
```

```ini
[program:scheduler]
command=php /var/www/baliokatravel/artisan schedule:work
directory=/var/www/baliokatravel
user=deploy
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/www/baliokatravel/storage/logs/scheduler.log
```

```bash
# Start supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
sudo supervisorctl status
```

---

## Step 8: Create Deploy Script

```bash
nano /var/www/baliokatravel/deploy.sh
```

```bash
#!/bin/bash
set -e

echo "🚀 Deploying BaliokaTravel..."

cd /var/www/baliokatravel

# Pull latest
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
composer install --no-dev --optimize-autoloader
npm ci && npm run build

# Run migrations
echo "🗄️ Running migrations..."
php artisan migrate --force

# Clear & rebuild cache
echo "🔄 Clearing cache..."
php artisan optimize:clear
php artisan optimize
php artisan filament:optimize
php artisan view:cache
php artisan route:cache
php artisan config:cache

# Restart services
echo "🔁 Restarting services..."
sudo supervisorctl restart octane
sudo supervisorctl restart queue-worker

echo "✅ Deployment complete!"
```

```bash
chmod +x /var/www/baliokatravel/deploy.sh
```

**Usage:**
```bash
./deploy.sh
```

---

## Step 9: Backup Strategy

### Database Backup Script

```bash
sudo nano /home/deploy/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
pg_dump -U baliokatravel baliokatravel | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: db_$DATE.sql.gz"
```

```bash
chmod +x /home/deploy/backup.sh

# Add to cron (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/deploy/backup.sh
```

---

## Step 10: Monitoring

### Basic Monitoring with htop

```bash
sudo apt install -y htop
htop
```

### Log Monitoring

```bash
# Octane logs
tail -f /var/www/baliokatravel/storage/logs/octane.log

# Laravel logs
tail -f /var/www/baliokatravel/storage/logs/laravel.log

# Queue logs
tail -f /var/www/baliokatravel/storage/logs/queue.log

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## Quick Commands

```bash
# Start all services
sudo supervisorctl start all

# Restart Octane
sudo supervisorctl restart octane

# Restart Queue
sudo supervisorctl restart queue-worker

# Check status
sudo supervisorctl status

# View logs
tail -f /var/www/baliokatravel/storage/logs/laravel.log

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# Deploy
cd /var/www/baliokatravel && ./deploy.sh
```

---

## Checklist Production

- [ ] Environment set to `production`
- [ ] `APP_DEBUG` set to `false`
- [ ] Strong database password
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Redis secured
- [ ] Backup script running
- [ ] Supervisor processes running
- [ ] Queue workers active
- [ ] Stripe webhook configured
- [ ] Email service tested
- [ ] Admin user created
- [ ] DNS configured

---

## Performance Tips

1. **Enable OPcache** - Already included in PHP
2. **Redis for sessions** - Faster than file
3. **Queue emails** - Don't block requests
4. **CDN for static** - Use Cloudflare
5. **Image optimization** - Compress uploads
6. **Database indexes** - Already in migrations

---

## Troubleshooting

### Octane not starting
```bash
# Check logs
tail -f /var/www/baliokatravel/storage/logs/octane.log

# Manual start for debugging
cd /var/www/baliokatravel
./frankenphp php-server --worker public/index.php --listen 127.0.0.1:8000
```

### 502 Bad Gateway
```bash
# Check if Octane is running
sudo supervisorctl status octane

# Check Nginx config
sudo nginx -t
```

### Permission errors
```bash
sudo chown -R deploy:www-data /var/www/baliokatravel
sudo chmod -R 775 storage bootstrap/cache
```

---

## 🎉 Done!

Your BaliokaTravel is now live at:
- **Website:** https://baliokatravel.com
- **Admin:** https://baliokatravel.com/admin
- **Supplier:** https://baliokatravel.com/supplier
