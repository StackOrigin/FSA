const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: null },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => { ret.id = ret._id; delete ret.__v; return ret; }
  }
});

module.exports = mongoose.model('Contact', contactSchema);
