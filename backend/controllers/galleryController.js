const db = require('../config/db');

// Get all gallery images
exports.getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM gallery ORDER BY created_at DESC';
    let params = [];
    
    if (category) {
      query = 'SELECT * FROM gallery WHERE category = $1 ORDER BY created_at DESC';
      params = [category];
    }
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};

// Add image to gallery
exports.addImage = async (req, res) => {
  try {
    const { title, imageUrl, category, description } = req.body;
    
    if (!title && !req.file) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Use uploaded file path if file was uploaded, otherwise use provided URL
    const imagePath = req.file 
      ? `/uploads/gallery/${req.file.filename}`
      : imageUrl;

    if (!imagePath) {
      return res.status(400).json({ error: 'Either upload a file or provide an image URL' });
    }

    const result = await db.query(
      'INSERT INTO gallery (title, image_url, category, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [title || 'Untitled', imagePath, category || 'classroom activity', description || '']
    );
    
    res.status(201).json({ 
      message: 'Image added successfully', 
      image: result.rows[0] 
    });
  } catch (error) {
    console.error('Error adding image:', error);
    res.status(500).json({ error: 'Failed to add image' });
  }
};

// Delete image from gallery
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM gallery WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};
