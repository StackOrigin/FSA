const mongoose = require('mongoose');

const schoolLeaderSchema = new mongoose.Schema({
  role: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  color: { type: String, required: true, default: '#6366F1' },
  sort_order: { type: Number, default: 0 },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => { ret.id = ret._id; delete ret.__v; return ret; }
  }
});

module.exports = mongoose.model('SchoolLeader', schoolLeaderSchema);
