import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import twilio from 'twilio';
import Student from '../models/Student.js';
import Session from '../models/Session.js';
import Note from '../models/Note.js';
import Attendance from '../models/Attendance.js';
import Notification from '../models/Notification.js';
import Resource from '../models/Resource.js';

const router = express.Router();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: './Uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Get all students (populate user for name and phoneNumber)
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'name phoneNumber');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a session
router.post('/sessions', async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Add notes (also update Student.sessionNotes)
router.post('/notes', async (req, res) => {
  try {
    const { sessionId, content, followUpDate } = req.body;
    const note = new Note({ sessionId, content, followUpDate });
    await note.save();
    // Find session to get studentId
    const session = await Session.findById(sessionId);
    if (session) {
      await Student.findByIdAndUpdate(session.studentId, {
        $push: { sessionNotes: { date: new Date(), content } },
      });
    }
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Mark attendance (update Student.attendance as percentage)
router.post('/attendance', async (req, res) => {
  try {
    const { studentId, sessionId, status } = req.body;
    const attendance = new Attendance({ studentId, sessionId, status });
    await attendance.save();
    // Calculate new attendance percentage
    const attendanceRecords = await Attendance.find({ studentId });
    const totalSessions = attendanceRecords.length;
    const presentSessions = attendanceRecords.filter(a => a.status === 'present').length;
    const attendancePercentage = totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 0;
    await Student.findByIdAndUpdate(studentId, {
      attendance: attendancePercentage,
    });
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Get all resources
router.get('/resources', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload a resource
router.post('/resources', upload.single('file'), async (req, res) => {
  try {
    const resource = new Resource({
      sessionId: req.body.sessionId,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ message: 'Failed to upload file' });
  }
});

// Send SMS notification
router.post('/notifications/sms', async (req, res) => {
  const { studentId, phoneNumber, message } = req.body;
  try {
    // Validate phone number format
    if (!phoneNumber || !/^\+\d{10,15}$/.test(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }
    // Send SMS via Twilio
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    // Save notification record
    const notification = new Notification({
      studentId,
      message,
      sentAt: new Date(),
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send SMS' });
  }
});

export default router;