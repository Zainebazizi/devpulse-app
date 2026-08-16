import mongoose from 'mongoose';

const BugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  session: { type: String, default: '' },
  originalError: { type: String, default: '' },
  solution: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open',
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Bug', BugSchema);