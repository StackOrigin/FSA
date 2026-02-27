const mongoose = require('mongoose');

const schoolHouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true, default: '#3B82F6' },
  border: { type: String, default: 'rgba(59, 130, 246, 0.3)' },
  captain_name: { type: String, default: '' },
  captain_image: { type: String, default: '' },
  vice_captain_name: { type: String, default: '' },
  vice_captain_image: { type: String, default: '' },
  sort_order: { type: Number, default: 0 },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => { ret.id = ret._id; delete ret.__v; return ret; }
  }
});

module.exports = mongoose.model('SchoolHouse', schoolHouseSchema);
