import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { 
    type: String, 
    unique: true, 
    required: true,
    trim: true
  },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "faculty", "student"], required: true },
  profilePhoto: { type: String, default: "" },
  phone: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);