import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  sessionId: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
});

export default mongoose.model('Attendance', attendanceSchema);