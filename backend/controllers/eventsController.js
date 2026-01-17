const db = require('../config/db');

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const { featured, category, limit } = req.query;

    const where = [];
    const params = [];

    if (String(featured).toLowerCase() === 'true') {
      params.push(true);
      where.push(`is_featured = $${params.length}`);
    }

    if (category) {
      params.push(String(category));
      where.push(`category = $${params.length}`);
    }

    let query = 'SELECT * FROM events';
    if (where.length > 0) query += ` WHERE ${where.join(' AND ')}`;
    query += ' ORDER BY event_date ASC';

    const parsedLimit = limit ? Number(limit) : undefined;
    if (parsedLimit && Number.isFinite(parsedLimit) && parsedLimit > 0) {
      params.push(parsedLimit);
      query += ` LIMIT $${params.length}`;
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(result.rows[0]);
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

    const result = await db.query(
      'INSERT INTO events (title, description, event_date, event_time, location, category, image_url, gradient, is_featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        title,
        description || '',
        date,
        time || 'TBA',
        location || 'TBA',
        category || 'Community',
        imagePath,
        gradient || null,
        Boolean(isFeatured),
      ]
    );
    
    res.status(201).json({ 
      message: 'Event created successfully', 
      event: result.rows[0] 
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
    let imagePath = imageUrl || null;
    if (req.file) {
      imagePath = `/uploads/events/${req.file.filename}`;
    }
    
    const result = await db.query(
      'UPDATE events SET title = $1, description = $2, event_date = $3, event_time = $4, location = $5, category = $6, image_url = COALESCE($7, image_url), gradient = $8, is_featured = $9 WHERE id = $10 RETURNING *',
      [
        title,
        description,
        date,
        time,
        location,
        category,
        imagePath,
        gradient || null,
        Boolean(isFeatured),
        id,
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event updated successfully', event: result.rows[0] });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
