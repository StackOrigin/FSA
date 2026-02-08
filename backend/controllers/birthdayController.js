const db = require('../config/db');

// Get all birthdays
exports.getBirthdays = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM birthdays ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching birthdays:', error);
    res.status(500).json({ error: 'Failed to fetch birthdays' });
  }
};

// Get today's birthdays (matches month and day regardless of year)
exports.getTodayBirthdays = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM birthdays
       WHERE EXTRACT(MONTH FROM birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(DAY FROM birth_date) = EXTRACT(DAY FROM CURRENT_DATE)
       ORDER BY name ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching today birthdays:', error);
    res.status(500).json({ error: 'Failed to fetch today birthdays' });
  }
};

// Create a birthday entry
exports.createBirthday = async (req, res) => {
  try {
    const { name, role, birth_date } = req.body;

    if (!name || !role || !birth_date) {
      return res.status(400).json({ error: 'Name, role, and birth date are required' });
    }

    const imagePath = req.file
      ? `/uploads/birthdays/${req.file.filename}`
      : null;

    const result = await db.query(
      'INSERT INTO birthdays (name, role, birth_date, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, role, birth_date, imagePath]
    );

    res.status(201).json({
      message: 'Birthday added successfully',
      birthday: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating birthday:', error);
    res.status(500).json({ error: 'Failed to create birthday' });
  }
};

// Update a birthday entry
exports.updateBirthday = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, birth_date } = req.body;

    if (!name || !role || !birth_date) {
      return res.status(400).json({ error: 'Name, role, and birth date are required' });
    }

    const imagePath = req.file
      ? `/uploads/birthdays/${req.file.filename}`
      : undefined;

    let result;
    if (imagePath) {
      result = await db.query(
        'UPDATE birthdays SET name = $1, role = $2, birth_date = $3, image_url = $4 WHERE id = $5 RETURNING *',
        [name, role, birth_date, imagePath, id]
      );
    } else {
      result = await db.query(
        'UPDATE birthdays SET name = $1, role = $2, birth_date = $3 WHERE id = $4 RETURNING *',
        [name, role, birth_date, id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Birthday not found' });
    }

    res.json({
      message: 'Birthday updated successfully',
      birthday: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating birthday:', error);
    res.status(500).json({ error: 'Failed to update birthday' });
  }
};

// Delete a birthday entry
exports.deleteBirthday = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM birthdays WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Birthday not found' });
    }

    res.json({ message: 'Birthday deleted successfully' });
  } catch (error) {
    console.error('Error deleting birthday:', error);
    res.status(500).json({ error: 'Failed to delete birthday' });
  }
};
