import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Resource', resourceSchema);