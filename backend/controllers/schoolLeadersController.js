const SchoolLeader = require('../models/SchoolLeader');

// Get all school leaders
exports.getSchoolLeaders = async (req, res) => {
  try {
    const leaders = await SchoolLeader.find().sort({ sort_order: 1, created_at: 1 });
    res.json(leaders);
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

    const leader = await SchoolLeader.create({
      role,
      name,
      image: imagePath,
      color: color || '#6366F1',
      sort_order: sort_order || 0,
    });

    res.status(201).json({
      message: 'School leader created successfully',
      leader,
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

    const updateData = {
      role,
      name,
      color: color || '#6366F1',
      sort_order: sort_order || 0,
    };

    if (req.file) {
      updateData.image = `/uploads/leaders/${req.file.filename}`;
    }

    const leader = await SchoolLeader.findByIdAndUpdate(id, updateData, { new: true });

    if (!leader) {
      return res.status(404).json({ error: 'School leader not found' });
    }

    res.json({
      message: 'School leader updated successfully',
      leader,
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
    const leader = await SchoolLeader.findByIdAndDelete(id);

    if (!leader) {
      return res.status(404).json({ error: 'School leader not found' });
    }

    res.json({ message: 'School leader deleted successfully' });
  } catch (error) {
    console.error('Error deleting school leader:', error);
    res.status(500).json({ error: 'Failed to delete school leader' });
  }
};
