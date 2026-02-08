const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Get all notices
exports.getNotices = async (req, res) => {
  try {
    const { category, priority, search, limit } = req.query;

    const where = [];
    const params = [];

    if (category && category !== 'all') {
      params.push(String(category));
      where.push(`category = $${params.length}`);
    }

    if (priority) {
      params.push(String(priority));
      where.push(`priority = $${params.length}`);
    }

    if (search) {
      params.push(`%${String(search)}%`);
      where.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }

    let query = 'SELECT * FROM notices';
    if (where.length > 0) query += ` WHERE ${where.join(' AND ')}`;
    query += ' ORDER BY created_at DESC';

    const parsedLimit = limit ? Number(limit) : undefined;
    if (parsedLimit && Number.isFinite(parsedLimit) && parsedLimit > 0) {
      params.push(parsedLimit);
      query += ` LIMIT $${params.length}`;
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
};

// Get single notice by ID
exports.getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM notices WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    
    res.json(result.rows[0]);
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
        // Also allow downloading the image if no other download link
        if (!download_url) download_url = filePath;
      } else {
        // It's a document (PDF, etc.)
        download_url = filePath;
      }
    }
    
    const result = await db.query(
      `INSERT INTO notices (title, description, category, priority, image_url, download_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [title, description, category || 'General', priority || 'medium', image_url, download_url]
    );
    
    res.status(201).json(result.rows[0]);
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
    
    // Check if notice exists
    const existingNotice = await db.query('SELECT * FROM notices WHERE id = $1', [id]);
    if (existingNotice.rows.length === 0) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    
    let image_url = existingNotice.rows[0].image_url;
    let download_url = manual_download_url || existingNotice.rows[0].download_url;

    if (req.file) {
      // Determine if file is image or doc
      const filePath = `/uploads/notices/${req.file.filename}`;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

      if (imageExts.includes(ext)) {
        // It's an image
        // Delete old image if it exists
        if (image_url) {
          try {
            const oldImagePath = path.join(__dirname, '..', image_url);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
          } catch(e) { console.error("Error deleting old image", e); }
        }
        image_url = filePath;
        // Optionally update download_url if it was pointing to the old image or empty
        if (!download_url) download_url = filePath;
      } else {
        // It's a document
        // Just update download_url. 
        // Should we delete old image? Maybe not, maybe they want to keep the image and change the doc.
        // But the previous logic deleted the old file.
        // Let's safe update download_url.
        download_url = filePath;
      }
    }
    
    const result = await db.query(
      `UPDATE notices 
       SET title = $1, description = $2, category = $3, priority = $4, 
           image_url = $5, download_url = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [title, description, category, priority, image_url, download_url, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({ error: 'Failed to update notice' });
  }
};

// Delete notice
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get notice to delete image
    const notice = await db.query('SELECT image_url FROM notices WHERE id = $1', [id]);
    if (notice.rows.length === 0) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    
    // Delete associated image if it exists
    if (notice.rows[0].image_url) {
      const imagePath = path.join(__dirname, '..', notice.rows[0].image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete notice from database
    await db.query('DELETE FROM notices WHERE id = $1', [id]);
    
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ error: 'Failed to delete notice' });
  }
};
