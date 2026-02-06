# Notices API Documentation

## Overview
The Notices API allows you to manage school notices and announcements. It supports CRUD operations with image uploads and filtering capabilities.

## Base URL
```
/api/notices
```

## Endpoints

### 1. Get All Notices
**GET** `/api/notices`

Retrieve all notices with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category (Academic, Administrative, Event, Exam, Holiday, General)
- `priority` (optional): Filter by priority (high, medium, low)
- `search` (optional): Search in title and description
- `limit` (optional): Limit number of results

**Example:**
```
GET /api/notices?category=Exam&priority=high
GET /api/notices?search=examination&limit=10
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Mid-Term Examination Schedule",
    "description": "The mid-term examinations will commence from March 1st, 2026...",
    "category": "Exam",
    "priority": "high",
    "image_url": "/uploads/notices/notice-1234567890.jpg",
    "download_url": "#",
    "created_at": "2026-02-05T00:00:00.000Z",
    "updated_at": "2026-02-05T00:00:00.000Z"
  }
]
```

### 2. Get Notice by ID
**GET** `/api/notices/:id`

Retrieve a specific notice by its ID.

**Example:**
```
GET /api/notices/1
```

**Response:**
```json
{
  "id": 1,
  "title": "Mid-Term Examination Schedule",
  "description": "The mid-term examinations will commence from March 1st, 2026...",
  "category": "Exam",
  "priority": "high",
  "image_url": "/uploads/notices/notice-1234567890.jpg",
  "download_url": "#",
  "created_at": "2026-02-05T00:00:00.000Z",
  "updated_at": "2026-02-05T00:00:00.000Z"
}
```

### 3. Create Notice
**POST** `/api/notices`

Create a new notice with optional image upload.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `title` (required): Notice title
- `description` (required): Notice description
- `category` (optional): Category (default: "General")
- `priority` (optional): Priority level (default: "medium")
- `download_url` (optional): URL for downloadable document
- `image` (optional): Image file (jpg, jpeg, png, gif, webp - max 5MB)

**Example using cURL:**
```bash
curl -X POST http://localhost:5000/api/notices \
  -F "title=New Exam Schedule" \
  -F "description=Updated examination dates" \
  -F "category=Exam" \
  -F "priority=high" \
  -F "image=@/path/to/image.jpg"
```

**Response:**
```json
{
  "id": 7,
  "title": "New Exam Schedule",
  "description": "Updated examination dates",
  "category": "Exam",
  "priority": "high",
  "image_url": "/uploads/notices/notice-1234567890.jpg",
  "download_url": null,
  "created_at": "2026-02-06T00:00:00.000Z",
  "updated_at": "2026-02-06T00:00:00.000Z"
}
```

### 4. Update Notice
**PUT** `/api/notices/:id`

Update an existing notice. Can include new image upload.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `title` (required): Notice title
- `description` (required): Notice description
- `category` (optional): Category
- `priority` (optional): Priority level
- `download_url` (optional): URL for downloadable document
- `image` (optional): New image file (replaces existing)

**Example:**
```bash
curl -X PUT http://localhost:5000/api/notices/1 \
  -F "title=Updated Exam Schedule" \
  -F "description=Revised examination dates" \
  -F "category=Exam" \
  -F "priority=high"
```

**Response:**
```json
{
  "id": 1,
  "title": "Updated Exam Schedule",
  "description": "Revised examination dates",
  "category": "Exam",
  "priority": "high",
  "image_url": "/uploads/notices/notice-1234567890.jpg",
  "download_url": null,
  "created_at": "2026-02-05T00:00:00.000Z",
  "updated_at": "2026-02-06T10:30:00.000Z"
}
```

### 5. Delete Notice
**DELETE** `/api/notices/:id`

Delete a notice and its associated image.

**Example:**
```
DELETE /api/notices/1
```

**Response:**
```json
{
  "message": "Notice deleted successfully"
}
```

## Categories
- `Academic`: Academic-related notices
- `Administrative`: School administration announcements
- `Event`: School events and activities
- `Exam`: Examination schedules and results
- `Holiday`: Holiday announcements
- `General`: General notices

## Priority Levels
- `high`: Urgent/important notices
- `medium`: Regular notices
- `low`: Informational notices

## Error Responses

**404 Not Found:**
```json
{
  "error": "Notice not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to fetch notices"
}
```

**400 Bad Request (File Upload):**
```json
{
  "error": "Only image files are allowed (jpeg, jpg, png, gif, webp)"
}
```

## Frontend Integration

### Fetching Notices
```typescript
const fetchNotices = async () => {
  const response = await fetch('/api/notices');
  const notices = await response.json();
  return notices;
};
```

### Creating a Notice (with image)
```typescript
const createNotice = async (formData: FormData) => {
  const response = await fetch('/api/notices', {
    method: 'POST',
    body: formData
  });
  return response.json();
};
```

### Filtering Notices
```typescript
const fetchFilteredNotices = async (category: string, search: string) => {
  const params = new URLSearchParams();
  if (category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  
  const response = await fetch(`/api/notices?${params}`);
  return response.json();
};
```
