# Future Stars School Website - Backend

A Node.js + Express backend with PostgreSQL database that **automatically sets up everything** when you run it.

## 🚀 Quick Start (New Installation)

### Prerequisites
- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)

### Step 1: Create the Database
Open your PostgreSQL client (psql, pgAdmin, or any SQL tool) and run:
```sql
CREATE DATABASE school_website;
```
That's it! You only need to create the empty database. **All tables and initial data will be created automatically.**

### Step 2: Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and update your PostgreSQL password
# DB_PASSWORD=your_actual_password
```

### Step 3: Install & Run
```bash
# Install dependencies
npm install

# Start the server (tables auto-created on first run)
npm start

# Or for development with auto-reload
npm run dev
```

The server will:
1. ✅ Connect to PostgreSQL
2. ✅ Create all required tables automatically
3. ✅ Seed initial sample data (events, home page content, etc.)
4. ✅ Start listening on port 5000

## 📁 What Gets Auto-Created

### Database Tables
| Table | Purpose |
|-------|---------|
| `contacts` | Contact form submissions |
| `events` | School events calendar |
| `admissions` | Student admission applications |
| `gallery` | Image gallery |
| `site_content` | CMS content (home page, contact info, etc.) |

### Initial Seed Data
- Sample events (Sports Day, Science Fair, etc.)
- Home page content (stats, features, testimonials)
- Contact page information
- News items

## 🔧 Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
# Server
PORT=5000

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_website
DB_USER=postgres
DB_PASSWORD=your_password_here
```

## 📡 API Endpoints

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (admin)
- `DELETE /api/contact/:id` - Delete contact

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (with image upload)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Admissions
- `POST /api/admissions` - Submit application
- `GET /api/admissions` - Get all applications (admin)
- `PATCH /api/admissions/:id/status` - Update status

### Gallery
- `GET /api/gallery` - Get all images
- `POST /api/gallery` - Add image (with upload)
- `DELETE /api/gallery/:id` - Delete image

### Site Content (CMS)
- `GET /api/content/:key` - Get content by key
- `PUT /api/content/:key` - Update content

### Feature Images
- `POST /api/upload/feature` - Upload feature image

## 🗂️ Folder Structure

```
backend/
├── config/
│   ├── db.js          # Database connection
│   └── initDb.js      # Auto table creation & seeding
├── controllers/       # Route handlers
├── middleware/
│   └── upload.js      # File upload config (multer)
├── routes/
│   └── api.js         # All API routes
├── uploads/           # Uploaded files
│   ├── events/
│   ├── gallery/
│   └── features/
├── .env.example       # Environment template
├── package.json
├── server.js          # Entry point
└── README.md
```

## 🔄 Manual Database Init (Optional)

If you want to manually trigger database initialization:
```bash
npm run db:init
```

## 🐛 Troubleshooting

### "Connection refused" error
- Make sure PostgreSQL is running
- Check if the database `school_website` exists
- Verify your `.env` credentials

### "Permission denied" error
- Check your PostgreSQL user has permission to create tables
- Verify the database user/password in `.env`

### Tables not created
- Check the console output for specific errors
- Make sure PostgreSQL version is 12+
- Try running `npm run db:init` manually
