const SchoolHouse = require('../models/SchoolHouse');

// Get all school houses
exports.getSchoolHouses = async (req, res) => {
  try {
    const houses = await SchoolHouse.find().sort({ sort_order: 1, created_at: 1 });
    res.json(houses);
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

    const house = await SchoolHouse.create({
      name,
      color,
      border: border || 'rgba(0,0,0,0.3)',
      captain_name: captain_name || '',
      captain_image: captainImage,
      vice_captain_name: vice_captain_name || '',
      vice_captain_image: viceCaptainImage,
      sort_order: sort_order || 0,
    });

    res.status(201).json({
      message: 'School house created successfully',
      house,
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
    const updateData = {
      name,
      color,
      border,
      captain_name,
      vice_captain_name,
      sort_order: sort_order || 0,
    };

    if (files.captain_image) {
      updateData.captain_image = `/uploads/houses/${files.captain_image[0].filename}`;
    }
    if (files.vice_captain_image) {
      updateData.vice_captain_image = `/uploads/houses/${files.vice_captain_image[0].filename}`;
    }

    const house = await SchoolHouse.findByIdAndUpdate(id, updateData, { new: true });

    if (!house) {
      return res.status(404).json({ error: 'School house not found' });
    }

    res.json({
      message: 'School house updated successfully',
      house,
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
    const house = await SchoolHouse.findByIdAndDelete(id);

    if (!house) {
      return res.status(404).json({ error: 'School house not found' });
    }

    res.json({ message: 'School house deleted successfully' });
  } catch (error) {
    console.error('Error deleting school house:', error);
    res.status(500).json({ error: 'Failed to delete school house' });
  }
};
