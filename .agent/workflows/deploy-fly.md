---
description: Deploy TaskTide (Next.js + Laravel) to fly.io
---

# Deploy TaskTide to fly.io

// turbo-all

## Prerequisites

1. Install flyctl:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Add to PATH (add to `~/.bashrc` or `~/.zshrc`):
```bash
export FLYCTL_INSTALL="/home/$USER/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
```

3. Log in:
```bash
fly auth login
```

---

## Step 1 — Create & configure the backend app

```bash
cd /home/munde/Development/task-tide/backend
fly apps create tasktide-api
```

### Create Managed Postgres

```bash
fly postgres create \
  --name tasktide-db \
  --region jnb \
  --initial-cluster-size 1 \
  --vm-size shared-cpu-1x \
  --volume-size 1
```

Attach it to the app:
```bash
fly postgres attach tasktide-db --app tasktide-api
```
> This automatically sets `DATABASE_URL` as a secret on `tasktide-api`.

### Create Upstash Redis

```bash
fly extensions upstash redis create \
  --name tasktide-redis \
  --region jnb \
  --app tasktide-api
```
> This automatically sets `REDIS_URL` as a secret.

### Set required secrets

Generate an APP_KEY locally first:
```bash
php artisan key:generate --show
```

Then set all secrets:
```bash
fly secrets set \
  APP_KEY="<paste output from above>" \
  APP_URL="https://tasktide-api.fly.dev" \
  FRONTEND_URL="https://tasktide-web.fly.dev" \
  REVERB_APP_ID="tasktide" \
  REVERB_APP_KEY="<generate a random string>" \
  REVERB_APP_SECRET="<generate a random string>" \
  GOOGLE_CLIENT_ID="<your google client id>" \
  GOOGLE_CLIENT_SECRET="<your google client secret>" \
  GOOGLE_REDIRECT_URI="https://tasktide-api.fly.dev/api/auth/google/callback" \
  --app tasktide-api
```

### Create storage volume

```bash
fly volumes create tasktide_storage --region jnb --size 1 --app tasktide-api
```

---

## Step 2 — Deploy the backend

```bash
cd /home/munde/Development/task-tide/backend
fly deploy --app tasktide-api
```

> Fly.io will build the Dockerfile, run `php artisan migrate --force` as a release command, then start traffic.

Verify:
```bash
fly logs -a tasktide-api
curl https://tasktide-api.fly.dev/api/health
```

---

## Step 3 — Create & configure the frontend app

```bash
cd /home/munde/Development/task-tide
fly apps create tasktide-web
```

### Set required secrets/env

If you use Firebase on the frontend, set public keys:
```bash
fly secrets set \
  NEXT_PUBLIC_FIREBASE_API_KEY="<your key>" \
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="<your domain>" \
  NEXT_PUBLIC_FIREBASE_PROJECT_ID="<your project id>" \
  NEXT_PUBLIC_FIREBASE_APP_ID="<your app id>" \
  --app tasktide-web
```

---

## Step 4 — Deploy the frontend

```bash
cd /home/munde/Development/task-tide
fly deploy --app tasktide-web
```

Verify:
```bash
fly logs -a tasktide-web
curl -I https://tasktide-web.fly.dev
```

---

## Useful commands

| Command | Description |
|---------|-------------|
| `fly logs -a tasktide-api` | Stream backend logs |
| `fly logs -a tasktide-web` | Stream frontend logs |
| `fly ssh console -a tasktide-api` | SSH into backend container |
| `fly scale count 2 -a tasktide-api` | Scale to 2 instances |
| `fly secrets list -a tasktide-api` | List set secrets |
| `fly status -a tasktide-api` | Show app status |
