# VPS E-commerce Setup Reference Guide

## 🖥️ Server Information

- **VPS IP:** 147.93.153.136
- **OS:** Ubuntu
- **Provider:** Contabo

## 📂 Directory Structure

```
/var/www/
├── E-com-backend/          # Node.js Express backend
├── user-frontend/          # React user frontend (Vite)
├── E-com_admin_frontend/   # React admin frontend (Vite)
└── html/                   # Default nginx directory
```

## 🔧 Services Setup

### PM2 (Process Manager)

- **Purpose:** Manages Node.js backend process
- **Process Name:** `ecom-backend`
- **Backend Port:** 3000

### PostgreSQL Database

- **Database Name:** `your_ecom_db`
- **Username:** `your_db_user`
- **Connection:** localhost:5432

### Nginx (Web Server)

- **Purpose:** Reverse proxy, serves static files
- **Ports:** 80 (HTTP), 443 (HTTPS)
- **Config File:** `/etc/nginx/sites-available/ecom-site`

### UFW Firewall

- **SSH:** Port 22 ✅
- **HTTP/HTTPS:** Ports 80/443 ✅
- **All other ports:** ❌ Blocked

## 🌐 URL Structure

```
http://147.93.153.136/          → User Frontend
http://147.93.153.136/admin/    → Admin Frontend
http://147.93.153.136/api/*     → Backend API
```

## ⚡ Essential Commands

### Check Service Status

```bash
# Check all services
pm2 status
systemctl status nginx
systemctl status postgresql
ufw status

# Check what's running on ports
ss -tuln
```

### PM2 Backend Management

```bash
# View backend status
pm2 status

# View backend logs
pm2 logs ecom-backend

# Restart backend
pm2 restart ecom-backend

# Stop backend
pm2 stop ecom-backend

# Start backend
pm2 start server.js --name "ecom-backend"
```

### Nginx Management

```bash
# Edit main config
nano /etc/nginx/sites-available/ecom-site

# Test config
nginx -t

# Reload config (without stopping)
systemctl reload nginx

# Restart nginx
systemctl restart nginx

# View error logs
tail -f /var/log/nginx/error.log

# View access logs
tail -f /var/log/nginx/access.log
```

### Database Management

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Connect to your database
sudo -u postgres psql -d your_ecom_db

# Restart PostgreSQL
systemctl restart postgresql
```

### Firewall Management

```bash
# Check firewall status
ufw status

# Allow new port
ufw allow [port_number]

# Deny port
ufw deny [port_number]

# Disable firewall (careful!)
ufw disable
```

## 🚀 Deployment Commands

### Quick Deploy Backend

```bash
/var/www/deploy-backend.sh
```

### Quick Deploy Frontends

```bash
/var/www/deploy-frontends.sh
```

### Manual Backend Deploy

```bash
cd /var/www/E-com-backend
git pull origin main
npm install
npx prisma generate
npx prisma db push
pm2 restart ecom-backend
```

### Manual Frontend Deploy

```bash
# User Frontend
cd /var/www/user-frontend
git pull origin main
npm install
npm run build

# Admin Frontend
cd /var/www/E-com_admin_frontend
git pull origin main
npm install
npm run build

# Reload nginx
systemctl reload nginx
```

## 🐛 Troubleshooting

### Site Not Loading

```bash
# Check if services are running
pm2 status
systemctl status nginx

# Check nginx config
nginx -t

# Check logs
pm2 logs ecom-backend
tail -f /var/log/nginx/error.log
```

### API Not Working

```bash
# Test API directly
curl http://localhost:3000/api/health

# Check backend logs
pm2 logs ecom-backend

# Restart backend
pm2 restart ecom-backend
```

### Database Issues

```bash
# Check PostgreSQL status
systemctl status postgresql

# Test database connection
sudo -u postgres psql -d your_ecom_db -U your_db_user -h localhost

# Check Prisma connection
cd /var/www/E-com-backend
npx prisma db push
```

### Assets Not Loading (404 errors)

```bash
# Check if build files exist
ls -la /var/www/user-frontend/dist/assets/
ls -la /var/www/E-com_admin_frontend/dist/assets/

# Rebuild frontends
cd /var/www/user-frontend && npm run build
cd /var/www/E-com_admin_frontend && npm run build

# Reload nginx
systemctl reload nginx
```

## 📁 Important File Locations

### Configuration Files

```bash
# Nginx site config
/etc/nginx/sites-available/ecom-site

# Backend environment
/var/www/E-com-backend/.env

# Deployment scripts
/var/www/deploy-backend.sh
/var/www/deploy-frontends.sh
```

### Log Files

```bash
# Nginx logs
/var/log/nginx/access.log
/var/log/nginx/error.log

# PM2 logs
/root/.pm2/logs/ecom-backend-out.log
/root/.pm2/logs/ecom-backend-error.log

# PostgreSQL logs
/var/log/postgresql/
```

## 🔄 Common Workflows

### After Code Changes

1. Push changes to GitHub
2. SSH into VPS: `ssh root@147.93.153.136`
3. Run deployment script: `/var/www/deploy-backend.sh` or `/var/www/deploy-frontends.sh`
4. Test: `curl http://147.93.153.136/api/health`

### Adding New Environment Variables

1. Edit: `nano /var/www/E-com-backend/.env`
2. Restart: `pm2 restart ecom-backend`

### Checking Site Health

```bash
# Full health check
pm2 status && systemctl status nginx && curl -I http://147.93.153.136/
```

## 🔐 Security Notes

- Database is only accessible locally (not exposed to internet)
- Backend API is only accessible through Nginx reverse proxy
- SSH access on port 22 (consider key-based auth)
- All other ports blocked by UFW firewall

## 📝 Environment Variables Template

```env
DATABASE_URL="postgresql://your_db_user:your_strong_password@localhost:5432/your_ecom_db"
PORT=3000
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
```

---

**Last Updated:** July 29, 2025  
**Server:** Contabo VPS (147.93.153.136)
