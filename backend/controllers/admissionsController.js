const db = require('../config/db');

// Submit admission application
exports.submitApplication = async (req, res) => {
  try {
    const { studentName, parentName, email, phone, gradeApplying, message } = req.body;
    
    if (!studentName || !parentName || !email || !phone || !gradeApplying) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const result = await db.query(
      'INSERT INTO admissions (student_name, parent_name, email, phone, grade_applying, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [studentName, parentName, email, phone, gradeApplying, message || '']
    );
    
    res.status(201).json({ 
      message: 'Application submitted successfully', 
      application: result.rows[0] 
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

// Get all applications (admin use)
exports.getApplications = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM admissions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Update application status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'under_review'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await db.query(
      'UPDATE admissions SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({ message: 'Status updated successfully', application: result.rows[0] });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};
