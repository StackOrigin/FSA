const db = require('../config/db');

// Get all school houses
exports.getSchoolHouses = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM school_houses ORDER BY sort_order ASC, created_at ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching school houses:', error);
    res.status(500).json({ error: 'Failed to fetch school houses' });
  }
};

// Create a school house
exports.createSchoolHouse = async (req, res) => {
  try {
    const { name, color, border, captain_name, vice_captain_name, sort_order } = req.body;

    if (!name || !color) {
      return res.status(400).json({ error: 'Name and color are required' });
    }

    const files = req.files || {};
    const captainImage = files.captain_image
      ? `/uploads/houses/${files.captain_image[0].filename}`
      : '';
    const viceCaptainImage = files.vice_captain_image
      ? `/uploads/houses/${files.vice_captain_image[0].filename}`
      : '';

    const result = await db.query(
      `INSERT INTO school_houses (name, color, border, captain_name, captain_image, vice_captain_name, vice_captain_image, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, color, border || `rgba(0,0,0,0.3)`, captain_name || '', captainImage, vice_captain_name || '', viceCaptainImage, sort_order || 0]
    );

    res.status(201).json({
      message: 'School house created successfully',
      house: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating school house:', error);
    res.status(500).json({ error: 'Failed to create school house' });
  }
};

// Update a school house
exports.updateSchoolHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, border, captain_name, vice_captain_name, sort_order } = req.body;

    if (!name || !color) {
      return res.status(400).json({ error: 'Name and color are required' });
    }

    const files = req.files || {};
    const captainImage = files.captain_image
      ? `/uploads/houses/${files.captain_image[0].filename}`
      : undefined;
    const viceCaptainImage = files.vice_captain_image
      ? `/uploads/houses/${files.vice_captain_image[0].filename}`
      : undefined;

    let query, params;
    if (captainImage && viceCaptainImage) {
      query = `UPDATE school_houses SET name=$1, color=$2, border=$3, captain_name=$4, captain_image=$5, vice_captain_name=$6, vice_captain_image=$7, sort_order=$8 WHERE id=$9 RETURNING *`;
      params = [name, color, border, captain_name, captainImage, vice_captain_name, viceCaptainImage, sort_order || 0, id];
    } else if (captainImage) {
      query = `UPDATE school_houses SET name=$1, color=$2, border=$3, captain_name=$4, captain_image=$5, vice_captain_name=$6, sort_order=$7 WHERE id=$8 RETURNING *`;
      params = [name, color, border, captain_name, captainImage, vice_captain_name, sort_order || 0, id];
    } else if (viceCaptainImage) {
      query = `UPDATE school_houses SET name=$1, color=$2, border=$3, captain_name=$4, vice_captain_name=$5, vice_captain_image=$6, sort_order=$7 WHERE id=$8 RETURNING *`;
      params = [name, color, border, captain_name, vice_captain_name, viceCaptainImage, sort_order || 0, id];
    } else {
      query = `UPDATE school_houses SET name=$1, color=$2, border=$3, captain_name=$4, vice_captain_name=$5, sort_order=$6 WHERE id=$7 RETURNING *`;
      params = [name, color, border, captain_name, vice_captain_name, sort_order || 0, id];
    }

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'School house not found' });
    }

    res.json({
      message: 'School house updated successfully',
      house: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating school house:', error);
    res.status(500).json({ error: 'Failed to update school house' });
  }
};

// Delete a school house
exports.deleteSchoolHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM school_houses WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'School house not found' });
    }

    res.json({ message: 'School house deleted successfully' });
  } catch (error) {
    console.error('Error deleting school house:', error);
    res.status(500).json({ error: 'Failed to delete school house' });
  }
};
