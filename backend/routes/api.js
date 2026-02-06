const express = require('express');
const router = express.Router();

// Import controllers
const contactController = require('../controllers/contactController');
const eventsController = require('../controllers/eventsController');
const admissionsController = require('../controllers/admissionsController');
const galleryController = require('../controllers/galleryController');
const contentController = require('../controllers/contentController');
const noticesController = require('../controllers/noticesController');

// Import upload middleware
const { uploadEvent, uploadGallery, uploadFeature, uploadNotice } = require('../middleware/upload');

// Contact routes
router.post('/contact', contactController.submitContact);
router.get('/contact', contactController.getContacts);
router.delete('/contact/:id', contactController.deleteContact);

// Events routes
router.get('/events', eventsController.getEvents);
router.get('/events/:id', eventsController.getEventById);
router.post('/events', uploadEvent, eventsController.createEvent);
router.put('/events/:id', uploadEvent, eventsController.updateEvent);
router.delete('/events/:id', eventsController.deleteEvent);

// Site content routes
router.get('/content/:key', contentController.getContent);
router.put('/content/:key', contentController.upsertContent);

// Feature image upload route
router.post('/upload/feature', uploadFeature, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  const imageUrl = `/uploads/features/${req.file.filename}`;
  res.json({ imageUrl });
});

// Admissions routes
router.post('/admissions', admissionsController.submitApplication);
router.get('/admissions', admissionsController.getApplications);
router.patch('/admissions/:id/status', admissionsController.updateStatus);

// Gallery routes
router.get('/gallery', galleryController.getGallery);
router.post('/gallery', uploadGallery, galleryController.addImage);
router.delete('/gallery/:id', galleryController.deleteImage);

// Notices routes
router.get('/notices', noticesController.getNotices);
router.get('/notices/:id', noticesController.getNoticeById);
router.post('/notices', uploadNotice, noticesController.createNotice);
router.put('/notices/:id', uploadNotice, noticesController.updateNotice);
router.delete('/notices/:id', noticesController.deleteNotice);

module.exports = router;
