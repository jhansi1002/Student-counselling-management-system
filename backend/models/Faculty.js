// models/index.js
const mongoose = require('mongoose');



// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  major: { type: String, required: true },
  year: { type: String, required: true },
  status: { type: String, enum: ['On Track', 'At Risk', 'Critical'], default: 'On Track' },
  gpa: { type: Number, required: true },
  attendance: { type: Number, required: true },
  flags: { type: [String], default: [] },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
});

// Session Schema
const sessionSchema = new mongoose.Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  notes: { type: String, default: '' },
  type: { type: String, enum: ['In-Person', 'Virtual'], required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
});

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  due: { type: String, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
});

// Message Schema
const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: String, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
});

// Announcement Schema
const announcementSchema = new mongoose.Schema({
  text: { type: String, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
});

// Resource Schema
const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
});

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  text: { type: String, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
});

const Faculty = mongoose.model('Faculty', facultySchema);
const Student = mongoose.model('Student', studentSchema);
const Session = mongoose.model('Session', sessionSchema);
const Task = mongoose.model('Task', taskSchema);
const Message = mongoose.model('Message', messageSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);
const Resource = mongoose.model('Resource', resourceSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = {
  Student,
  Session,
  Task,
  Message,
  Announcement,
  Resource,
  Feedback,
};