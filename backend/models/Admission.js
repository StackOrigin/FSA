const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  student_name: { type: String, required: true },
  parent_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  grade_applying: { type: String, required: true },
  message: { type: String, default: '' },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'under_review'] },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => { ret.id = ret._id; delete ret.__v; return ret; }
  }
});

module.exports = mongoose.model('Admission', admissionSchema);
