const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  event_date: { type: Date, required: true },
  event_time: { type: String, default: 'TBA' },
  location: { type: String, default: 'TBA' },
  category: { type: String, default: 'Community' },
  image_url: { type: String, default: null },
  gradient: { type: String, default: null },
  is_featured: { type: Boolean, default: false },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => { ret.id = ret._id; delete ret.__v; return ret; }
  }
});

module.exports = mongoose.model('Event', eventSchema);
