const Birthday = require('../models/Birthday');

// Get all birthdays
exports.getBirthdays = async (req, res) => {
  try {
    const birthdays = await Birthday.find().sort({ created_at: -1 });
    res.json(birthdays);
  } catch (error) {
    console.error('Error fetching birthdays:', error);
    res.status(500).json({ error: 'Failed to fetch birthdays' });
  }
};

// Get today's birthdays (matches month and day regardless of year)
exports.getTodayBirthdays = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();

    const birthdays = await Birthday.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: '$birth_date' }, month] },
              { $eq: [{ $dayOfMonth: '$birth_date' }, day] },
            ],
          },
        },
      },
      { $sort: { name: 1 } },
    ]);

    // Add id field for API compatibility
    const result = birthdays.map(b => ({ ...b, id: b._id }));
    res.json(result);
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

    const birthday = await Birthday.create({
      name,
      role,
      birth_date,
      image_url: imagePath,
    });

    res.status(201).json({
      message: 'Birthday added successfully',
      birthday,
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

    const updateData = { name, role, birth_date };

    if (req.file) {
      updateData.image_url = `/uploads/birthdays/${req.file.filename}`;
    }

    const birthday = await Birthday.findByIdAndUpdate(id, updateData, { new: true });

    if (!birthday) {
      return res.status(404).json({ error: 'Birthday not found' });
    }

    res.json({
      message: 'Birthday updated successfully',
      birthday,
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
    const birthday = await Birthday.findByIdAndDelete(id);

    if (!birthday) {
      return res.status(404).json({ error: 'Birthday not found' });
    }

    res.json({ message: 'Birthday deleted successfully' });
  } catch (error) {
    console.error('Error deleting birthday:', error);
    res.status(500).json({ error: 'Failed to delete birthday' });
  }
};
