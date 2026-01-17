const express = require('express');
const router = express.Router();

// Import controllers
const contactController = require('../controllers/contactController');
const eventsController = require('../controllers/eventsController');
const admissionsController = require('../controllers/admissionsController');
const galleryController = require('../controllers/galleryController');
const contentController = require('../controllers/contentController');

// Import upload middleware
const { uploadEvent, uploadGallery } = require('../middleware/upload');

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

// Admissions routes
router.post('/admissions', admissionsController.submitApplication);
router.get('/admissions', admissionsController.getApplications);
router.patch('/admissions/:id/status', admissionsController.updateStatus);

// Gallery routes
router.get('/gallery', galleryController.getGallery);
router.post('/gallery', uploadGallery, galleryController.addImage);
router.delete('/gallery/:id', galleryController.deleteImage);

module.exports = router;
