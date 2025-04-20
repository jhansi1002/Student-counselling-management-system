// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hash this in production
  role: { type: String, enum: ['student', 'faculty', 'admin'], required: true }
});

export default mongoose.model('User', userSchema);