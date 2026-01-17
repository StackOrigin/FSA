# Image Upload Feature - Setup Complete ✅

## What's New
Admins can now upload images **directly from their computer** instead of only using URLs.

## How It Works

### For Events (Admin Panel → Events)
1. Click "Add Event" or edit an existing event
2. Scroll to the "Event Image" section
3. **Option 1:** Click "Choose File" and select an image from your computer (JPG, PNG, GIF, WEBP - max 5MB)
4. Preview appears automatically
5. Click "Create Event" or "Update Event"
6. Image is uploaded to server and event displays with the uploaded image

### For Gallery (Admin Panel → Gallery)
1. Click "Add Image"
2. **Option 1:** Upload from computer using the file input
3. **Option 2:** Provide an image URL (both options work)
4. Select category and add title/description
5. Click "Add to Gallery"

## Technical Details

### Backend Changes
- **Multer middleware** installed for handling file uploads
- Upload directories created:
  - `backend/uploads/events/`
  - `backend/uploads/gallery/`
- Images served statically at `/uploads/events/filename.jpg` and `/uploads/gallery/filename.jpg`
- Routes updated to accept `multipart/form-data`:
  - `POST /api/events` (with file upload)
  - `PUT /api/events/:id` (with file upload)
  - `POST /api/gallery` (with file upload)
- Controllers updated to save uploaded file paths to database

### Frontend Changes
- **EventsManagement.tsx**: Added file input + preview
- **GalleryManagement.tsx**: Added file input + URL input (either/or)
- Form data sent as `FormData` instead of JSON when files are present
- Vite proxy configured to serve `/uploads/*` from backend during development

### Storage
- Uploaded files stored in `backend/uploads/` (gitignored)
- Database stores relative path: `/uploads/events/event-1234567890.jpg`
- Files served by Express static middleware

## File Limits
- **Max size:** 5MB per image
- **Allowed types:** JPEG, JPG, PNG, GIF, WEBP

## How Images Display on Website
- Events page featured carousel: Uses `image_url` from database
- Gallery page: Uses `image_url` from database
- Both support URLs AND uploaded file paths seamlessly

## Next Steps (if needed)
- Set up cloud storage (AWS S3, Cloudinary) for production instead of local disk
- Add image resizing/optimization before saving
- Add bulk upload support
