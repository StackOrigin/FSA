const db = require('../config/db');

// Get all school leaders
exports.getSchoolLeaders = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM school_leaders ORDER BY sort_order ASC, created_at ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching school leaders:', error);
    res.status(500).json({ error: 'Failed to fetch school leaders' });
  }
};

// Create a school leader
exports.createSchoolLeader = async (req, res) => {
  try {
    const { role, name, color, sort_order } = req.body;

    if (!role || !name) {
      return res.status(400).json({ error: 'Role and name are required' });
    }

    const imagePath = req.file
      ? `/uploads/leaders/${req.file.filename}`
      : '';

    const result = await db.query(
      'INSERT INTO school_leaders (role, name, image, color, sort_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [role, name, imagePath, color || '#6366F1', sort_order || 0]
    );

    res.status(201).json({
      message: 'School leader created successfully',
      leader: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating school leader:', error);
    res.status(500).json({ error: 'Failed to create school leader' });
  }
};

// Update a school leader
exports.updateSchoolLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, name, color, sort_order } = req.body;

    if (!role || !name) {
      return res.status(400).json({ error: 'Role and name are required' });
    }

    const imagePath = req.file
      ? `/uploads/leaders/${req.file.filename}`
      : undefined;

    let result;
    if (imagePath) {
      result = await db.query(
        'UPDATE school_leaders SET role=$1, name=$2, image=$3, color=$4, sort_order=$5 WHERE id=$6 RETURNING *',
        [role, name, imagePath, color || '#6366F1', sort_order || 0, id]
      );
    } else {
      result = await db.query(
        'UPDATE school_leaders SET role=$1, name=$2, color=$3, sort_order=$4 WHERE id=$5 RETURNING *',
        [role, name, color || '#6366F1', sort_order || 0, id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'School leader not found' });
    }

    res.json({
      message: 'School leader updated successfully',
      leader: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating school leader:', error);
    res.status(500).json({ error: 'Failed to update school leader' });
  }
};

// Delete a school leader
exports.deleteSchoolLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM school_leaders WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'School leader not found' });
    }

    res.json({ message: 'School leader deleted successfully' });
  } catch (error) {
    console.error('Error deleting school leader:', error);
    res.status(500).json({ error: 'Failed to delete school leader' });
  }
};
