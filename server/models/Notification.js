import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
});

export default mongoose.model('Notification', notificationSchema);