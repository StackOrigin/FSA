const Gallery = require('../models/Gallery');

// Get all gallery images
exports.getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    const images = await Gallery.find(filter).sort({ created_at: -1 });
    res.json(images);
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

    const image = await Gallery.create({
      title: title || 'Untitled',
      image_url: imagePath,
      category: category || 'classroom activity',
      description: description || '',
    });
    
    res.status(201).json({ 
      message: 'Image added successfully', 
      image 
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
    const image = await Gallery.findByIdAndDelete(id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};
