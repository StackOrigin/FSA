const SiteContent = require('../models/SiteContent');

// Get site content by key
exports.getContent = async (req, res) => {
  try {
    const { key } = req.params;
    const doc = await SiteContent.findOne({ key });

    if (!doc) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(doc.content);
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

    const doc = await SiteContent.findOneAndUpdate(
      { key },
      { content, updated_at: new Date() },
      { upsert: true, new: true }
    );

    res.json({ message: 'Content saved', key: doc.key, updated_at: doc.updated_at });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
};
