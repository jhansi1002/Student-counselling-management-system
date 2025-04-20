import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profilePhoto: { type: String, default: 'default-photo-url' },
  email: { type: String, required: true },
  phone: String,
  rollNo: { type: String, unique: true },
  marks: [{ subject: String, score: Number }],
  attendance: { type: Number, default: 0 },
  appointments: [{
    id: { type: String, required: true },
    date: String,
    time: String,
    counselor: String,
    location: String,
  }],
  unreadMessages: { type: Number, default: 0 },
  counselor: {
    name: String,
    photo: String,
    specialization: String,
    role: String,
    email: String,
  },
  goals: [{
    description: String,
    progress: { type: Number, default: 0 },
  }],
  sessionNotes: [{
    date: String,
    content: String,
  }],
});

export default mongoose.model('Student', studentSchema);