const Admission = require('../models/Admission');

// Submit admission application
exports.submitApplication = async (req, res) => {
  try {
    const { studentName, parentName, email, phone, gradeApplying, message } = req.body;
    
    if (!studentName || !parentName || !email || !phone || !gradeApplying) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const application = await Admission.create({
      student_name: studentName,
      parent_name: parentName,
      email,
      phone,
      grade_applying: gradeApplying,
      message: message || '',
    });
    
    res.status(201).json({ 
      message: 'Application submitted successfully', 
      application 
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

// Get all applications (admin use)
exports.getApplications = async (req, res) => {
  try {
    const applications = await Admission.find().sort({ created_at: -1 });
    res.json(applications);
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

    const application = await Admission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({ message: 'Status updated successfully', application });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};
