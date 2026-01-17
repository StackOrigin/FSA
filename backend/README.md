# School Website Backend

## Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure PostgreSQL:
   - Make sure PostgreSQL is installed and running
   - Create a database named `school_website`
   - Update `.env` file with your database credentials

4. Initialize the database:
   ```bash
   npm run db:init
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Contact
- `POST /api/contact` - Submit a contact form
- `GET /api/contact` - Get all contacts (admin)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### Admissions
- `POST /api/admissions` - Submit admission application
- `GET /api/admissions` - Get all applications (admin)
- `PATCH /api/admissions/:id/status` - Update application status

### Gallery
- `GET /api/gallery` - Get all gallery images (optional: ?category=sports)
- `POST /api/gallery` - Add image to gallery
- `DELETE /api/gallery/:id` - Delete image from gallery

## Environment Variables

Create a `.env` file with:
```
PORT=5000
NODE_ENV=development

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_website
DB_USER=postgres
DB_PASSWORD=your_password_here
```

## Database Tables

- **contacts** - Contact form submissions
- **events** - School events
- **admissions** - Admission applications
- **gallery** - Gallery images
