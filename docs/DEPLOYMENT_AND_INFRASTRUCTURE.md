# ☁️ Cloud Infrastructure & Deployment Runbook

This document details the production infrastructure, network architecture, process supervision, reverse proxy rules, and DNS routing for **eRentKarar**.

---

## 🌐 Production Environment Specification

| Component | Provider / Configuration | Details |
| :--- | :--- | :--- |
| **Domain Registrar** | GoDaddy | `erentkarar.com` & `www.erentkarar.com` |
| **Cloud Provider** | AWS (Amazon Web Services) | Region: `eu-north-1` (Stockholm) |
| **Compute Instance** | AWS EC2 Instance (`t3.medium` / Ubuntu 24.04 LTS) | Instance ID: `i-03d181910757473fb` |
| **Elastic / Public IPv4** | AWS Public IP | `16.170.201.75` |
| **Web Server & Proxy** | Nginx 1.24+ with Gzip & Proxy Buffering | Ports: `80` (HTTP) & `443` (HTTPS) |
| **SSL / TLS Certificate** | Let's Encrypt (Certbot Automated) | Auto-renewal via systemd timer |
| **Process Manager** | PM2 Runtime Engine | `erentkarar-frontend` (Port 3000) & `erentkarar-backend` (Port 8000) |
| **WSGI Application Server** | Gunicorn 23.0+ (3 sync workers) | Bound to `127.0.0.1:8000` |
| **Database Engine** | SQLite (File-backed) / PostgreSQL 16 ready | Location: `/home/ubuntu/erentkarar/backend/db.sqlite3` |

---

## 🗺️ Network & Routing Architecture

```
                                  [ Internet Traffic ]
                                           │
                                    (DNS Resolution)
                                           │
                                           ▼
                              [ GoDaddy DNS A Record ]
                             (erentkarar.com ➔ 16.170.201.75)
                                           │
                                           ▼
                         [ AWS Security Group Firewall ]
                               (Ports 80, 443, 22)
                                           │
                                           ▼
                            [ Nginx Reverse Proxy (443) ]
                         (SSL Termination / Gzip / Caching)
                                           │
            ┌──────────────────────────────┴──────────────────────────────┐
            │ (Path: /api/*, /admin/*, /static/*, /media/*)              │ (Path: /* Default)
            ▼                                                             ▼
  [ Django Gunicorn Server ]                                   [ Next.js 14 App Server ]
   (127.0.0.1:8000 via PM2)                                     (127.0.0.1:3000 via PM2)
            │                                                             │
            ▼                                                             ▼
  [ SQLite / Media Storage ]                                   [ React SSR / Static Chunks ]
```

---

## ⚙️ Nginx Production Configuration (`/etc/nginx/sites-available/erentkarar`)

```nginx
server {
    listen 80;
    server_name erentkarar.com www.erentkarar.com 16.170.201.75;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name erentkarar.com www.erentkarar.com;

    ssl_certificate /etc/letsencrypt/live/erentkarar.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/erentkarar.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 50M;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Static & Media Asset Caching
    location /static/ {
        alias /home/ubuntu/erentkarar/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location /media/ {
        alias /home/ubuntu/erentkarar/backend/media/;
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }

    # Django API & Admin Portal
    location ~ ^/(api|admin)/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    # Next.js Frontend Application
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🛠️ Operational Commands (SSH Cheatsheet)

### Service Management:
```bash
# Check running PM2 processes
pm2 status

# View live system logs
pm2 logs

# Restart all services
pm2 restart all

# Restart Nginx
sudo nginx -t && sudo systemctl reload nginx
```

### Deploying New Updates:
```bash
cd /home/ubuntu/erentkarar
git pull origin main

# Backend Update
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Frontend Update
cd ../frontend
npm install
npm run build

# Restart Processes
pm2 restart all
```
