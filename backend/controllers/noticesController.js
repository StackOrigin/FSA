const Notice = require('../models/Notice');
const fs = require('fs');
const path = require('path');

// Get all notices
exports.getNotices = async (req, res) => {
  try {
    const { category, priority, search, limit } = req.query;

    const filter = {};

    if (category && category !== 'all') {
      filter.category = String(category);
    }

    if (priority) {
      filter.priority = String(priority);
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    let query = Notice.find(filter).sort({ created_at: -1 });

    const parsedLimit = limit ? Number(limit) : undefined;
    if (parsedLimit && Number.isFinite(parsedLimit) && parsedLimit > 0) {
      query = query.limit(parsedLimit);
    }

    const notices = await query;
    res.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
};

// Get single notice by ID
exports.getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id);
    
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    
    res.json(notice);
  } catch (error) {
    console.error('Error fetching notice:', error);
    res.status(500).json({ error: 'Failed to fetch notice' });
  }
};

// Create new notice
exports.createNotice = async (req, res) => {
  try {
    const { title, description, category, priority, download_url: manual_download_url } = req.body;
    
    let image_url = null;
    let download_url = manual_download_url || null;

    if (req.file) {
      const filePath = `/uploads/notices/${req.file.filename}`;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      
      if (imageExts.includes(ext)) {
        image_url = filePath;
        if (!download_url) download_url = filePath;
      } else {
        download_url = filePath;
      }
    }
    
    const notice = await Notice.create({
      title,
      description,
      category: category || 'General',
      priority: priority || 'medium',
      image_url,
      download_url,
    });
    
    res.status(201).json(notice);
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ error: 'Failed to create notice' });
  }
};

// Update notice
exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, priority, download_url: manual_download_url } = req.body;
    
    const existingNotice = await Notice.findById(id);
    if (!existingNotice) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    
    let image_url = existingNotice.image_url;
    let download_url = manual_download_url || existingNotice.download_url;

    if (req.file) {
      const filePath = `/uploads/notices/${req.file.filename}`;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

      if (imageExts.includes(ext)) {
        if (image_url) {
          try {
            const oldImagePath = path.join(__dirname, '..', image_url);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
          } catch(e) { console.error("Error deleting old image", e); }
        }
        image_url = filePath;
        if (!download_url) download_url = filePath;
      } else {
        download_url = filePath;
      }
    }
    
    const notice = await Notice.findByIdAndUpdate(
      id,
      { title, description, category, priority, image_url, download_url },
      { new: true }
    );
    
    res.json(notice);
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({ error: 'Failed to update notice' });
  }
};

// Delete notice
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    
    // Delete associated image if it exists
    if (notice.image_url) {
      const imagePath = path.join(__dirname, '..', notice.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Notice.findByIdAndDelete(id);
    
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ error: 'Failed to delete notice' });
  }
};
