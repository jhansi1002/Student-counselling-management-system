import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  content: { type: String, required: true },
  followUpDate: { type: String },
});

export default mongoose.model('Note', noteSchema);