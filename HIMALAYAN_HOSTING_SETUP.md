# Himalayan Hosting: PostgreSQL + Full App Setup

This guide is tailored to your actual panel menu:
- Database -> Add Database
- Database -> Add Database User
- Database -> Add User To Database
- Database -> Manage PostgreSQL
- Database -> pgAdmin4

Assumptions:
- Frontend and backend are both hosted on Himalayan Hosting
- Domain is already pointed to hosting nameservers

## Webuzo quick route (based on your dashboard)

Use these exact sections from your panel:
- Database
- Applications -> node
- Server Utilities -> File Manager
- Domain -> Subdomains (optional)

Recommended architecture for your current codebase:
- Frontend static files in `public_html`
- Backend Node app running from `backend/`
- Same domain routing with reverse proxy for `/api` and `/uploads`

## 1) Create PostgreSQL database in your panel (exact clicks)

1. Go to Database -> Add Database
   - Create DB name (example: school_website)
2. Go to Database -> Add Database User
   - Create DB user (example: school_user)
   - Set strong password and save it
3. Go to Database -> Add User To Database
   - Select the user + database you just created
   - Grant all privileges
4. Go to Database -> Manage PostgreSQL
   - Confirm PostgreSQL service is running
5. Open Database -> pgAdmin4
   - Verify you can connect and see the new database

Collect these values for backend `.env`:
- DB_HOST (usually `localhost` on same host)
- DB_PORT (usually `5432`)
- DB_NAME
- DB_USER
- DB_PASSWORD
- SSL requirement (some hosts require SSL for external connections)

## 2) Configure backend environment

Set these environment variables in your Node app panel (or backend .env):

PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false

If provider says SSL is not required, use:
- DB_SSL=false

### Example production `.env` (backend)

```env
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_website
DB_USER=school_user
DB_PASSWORD=replace_with_real_password
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true
```

## 3) Start backend and initialize tables

Inside backend folder:

npm ci
npm run db:init
npm start

Expected result:
- Tables are created automatically
- Seed data is inserted if tables are empty
- Health endpoint works on / (API process)

Webuzo note:
- Your backend `server.js` already auto-runs DB init on startup, so even if you cannot run `npm run db:init` manually, first boot still creates tables.
- In `Applications -> node`, set:
   - App directory: your uploaded `backend` folder
   - Startup file: `server.js`
   - Node version: 18+
   - Start command: `npm start`

## 4) Connect frontend to backend on same domain

Your frontend code calls /api and /uploads paths. Keep this behavior.

Configure web server reverse proxy so that:
- /api -> Node backend on localhost:5000/api
- /uploads -> Node backend on localhost:5000/uploads

This avoids CORS headaches and keeps URLs clean.

## 5) If backend is on subdomain instead

If backend runs on api.yourdomain.com instead of same domain:
- Keep CORS_ORIGIN as frontend domain(s)
- Add frontend rewrites/proxy OR update frontend fetch base URL strategy

Preferred for current codebase: same domain with reverse proxy.

### `.htaccess` (public_html) for SPA + proxy

If your plan uses Apache/LiteSpeed with proxy modules enabled, use this in `public_html/.htaccess`:

```apache
RewriteEngine On

# Proxy API and uploads to Node backend
RewriteRule ^api/(.*)$ http://127.0.0.1:5000/api/$1 [P,L]
RewriteRule ^uploads/(.*)$ http://127.0.0.1:5000/uploads/$1 [P,L]

# SPA fallback
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

If proxy rules are blocked by host policy, create a subdomain (e.g. `api.yourdomain.com`) for Node and ask support to map it to port 5000.

## 6) Verify after deployment

Check these in order:

1. https://yourdomain.com loads frontend.
2. https://yourdomain.com/api/events returns JSON.
3. Image URLs under /uploads are reachable.
4. Admin login works.
5. Create/edit/delete for events/notices/gallery works.
6. Contact and admissions forms submit to DB.

## 6.1) Webuzo publish order (exact)

1. Upload full project via `Server Utilities -> File Manager` (or GitTM).
2. Configure DB from `Database` section.
3. Edit backend `.env` with real values.
4. Start backend from `Applications -> node`.
5. Build frontend locally (`npm run build`) and upload `build/` contents into `public_html/`.
6. Add `.htaccess` in `public_html`.
7. Test `/api/events`, then full site.

## 7) Common fixes

- Connection refused: wrong DB_HOST or DB_PORT
- Authentication failed: wrong DB_USER/DB_PASSWORD
- no pg_hba entry / SSL error: turn on DB_SSL and set DB_SSL_REJECT_UNAUTHORIZED=false
- CORS blocked: include exact domain in CORS_ORIGIN
- 404 on /api from frontend: reverse proxy not configured

## 9) Quick SQL test in pgAdmin4 (recommended)

Run this query in your new DB:

```sql
SELECT NOW();
```

If it returns a timestamp, connection is fine.

Then after backend deploy, run:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see tables like `events`, `contacts`, `admissions`, `gallery`, `notices`, `birthdays`, `school_houses`, `school_leaders`, `site_content`.

## 8) Security checklist

- Use strong DB password
- Keep NODE_ENV=production
- Restrict CORS_ORIGIN to real domains only
- Enable HTTPS for domain and www
- Keep database backups enabled in hosting panel
