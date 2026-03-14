const Event = require('../models/Event');

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const { featured, category, limit } = req.query;

    const filter = {};

    if (String(featured).toLowerCase() === 'true') {
      filter.is_featured = true;
    }

    if (category) {
      filter.category = String(category);
    }

    let query = Event.find(filter).sort({ event_date: 1 });

    const parsedLimit = limit ? Number(limit) : undefined;
    if (parsedLimit && Number.isFinite(parsedLimit) && parsedLimit > 0) {
      query = query.limit(parsedLimit);
    }

    const events = await query;
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      imageUrl,
      gradient,
      isFeatured,
    } = req.body;
    
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    // Use uploaded file path if file was uploaded, otherwise use provided URL
    const imagePath = req.file 
      ? `/uploads/events/${req.file.filename}`
      : imageUrl || null;

    const event = await Event.create({
      title,
      description: description || '',
      event_date: date,
      event_time: time || 'TBA',
      location: location || 'TBA',
      category: category || 'Community',
      image_url: imagePath,
      gradient: gradient || null,
      is_featured: Boolean(isFeatured),
    });
    
    res.status(201).json({ 
      message: 'Event created successfully', 
      event 
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      imageUrl,
      gradient,
      isFeatured,
    } = req.body;
    
    // Use uploaded file path if file was uploaded, otherwise use provided URL or keep existing
    let imagePath = imageUrl || undefined;
    if (req.file) {
      imagePath = `/uploads/events/${req.file.filename}`;
    }

    const updateData = {
      title,
      description,
      event_date: date,
      event_time: time,
      location,
      category,
      gradient: gradient || null,
      is_featured: Boolean(isFeatured),
    };

    // Only update image_url if a new one is provided
    if (imagePath) {
      updateData.image_url = imagePath;
    }
    
    const event = await Event.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
