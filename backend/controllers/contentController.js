const db = require('../config/db');

// Get site content by key
exports.getContent = async (req, res) => {
  try {
    const { key } = req.params;
    const result = await db.query('SELECT content FROM site_content WHERE key = $1', [key]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(result.rows[0].content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
};

// Upsert content by key (admin use)
exports.upsertContent = async (req, res) => {
  try {
    const { key } = req.params;
    const content = req.body;

    if (!content || typeof content !== 'object') {
      return res.status(400).json({ error: 'Content must be a JSON object' });
    }

    const result = await db.query(
      `INSERT INTO site_content (key, content, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (key)
       DO UPDATE SET content = EXCLUDED.content, updated_at = CURRENT_TIMESTAMP
       RETURNING key, content, updated_at`,
      [key, content]
    );

    res.json({ message: 'Content saved', key: result.rows[0].key, updated_at: result.rows[0].updated_at });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
};
