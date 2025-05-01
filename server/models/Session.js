import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  date: { type: String, required: true },
  mode: { type: String, enum: ['online', 'offline'], default: 'offline' },
  notes: { type: String },
});

export default mongoose.model('Session', sessionSchema);