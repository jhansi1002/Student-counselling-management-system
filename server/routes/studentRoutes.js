import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Session from '../models/Session.js';
import Message from '../models/Message.js';
import Upload from '../models/Upload.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// GET /api/students/list
// Fetch all students with populated user and faculty data (admin/faculty)
router.get('/list', auth(['faculty', 'admin']), async (req, res) => {
  try {
    const students = await Student.find({})
      .populate('user', 'username name phone profilePhoto')
      .populate('assignedFaculty', 'username name profilePhoto')
      .select('regNo name totalPercentage phoneNumber parentNumber department year major gpa attendance status se padcom cns clsa tdfsdiii iic seLab cnsLab adsLab ajpLab qalr ads ajp npteloe idpii cepb csevac library counseling');
    
    if (!students.length) {
      console.log('No students found');
      return res.status(404).json({ message: 'No students found' });
    }
    
    console.log('Fetched students:', students.length);
    res.json(students);
  } catch (error) {
    console.error('Error listing students:', error);
    res.status(500).json({ message: 'Error listing students', error: error.message });
  }
});

// POST /api/students/register-student
// Create a new student (admin/faculty)
router.post('/register-student', auth(['faculty', 'admin']), async (req, res) => {
  const {
    username,
    regNo,
    name,
    phoneNumber,
    parentNumber,
    department,
    year,
    major,
    gpa,
    attendance,
    status,
    marks,
    goals,
    sessionNotes,
    facultyUsername,
    // Additional fields from the schema
    se,
    padcom,
    cns,
    clsa,
    tdfsdiii,
    iic,
    seLab,
    cnsLab,
    adsLab,
    ajpLab,
    qalr,
    ads,
    ajp,
    npteloe,
    idpii,
    cepb,
    csevac,
    library,
    counseling,
    totalPercentage
  } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(400).json({ message: 'User not found' });
    }
    
    const assignedFaculty = await User.findOne({ username: facultyUsername });
    if (!assignedFaculty) {
      console.log('Faculty not found:', facultyUsername);
      return res.status(400).json({ message: 'Faculty not found' });
    }
    
    let student = await Student.findOne({ regNo });
    if (student) {
      console.log('Student already exists:', regNo);
      return res.status(400).json({ message: 'Student already exists' });
    }
    
    student = new Student({
      user: user._id,
      regNo,
      name,
      phoneNumber,
      parentNumber,
      department,
      year,
      major,
      gpa,
      attendance,
      status,
      marks,
      goals,
      sessionNotes,
      assignedFaculty: assignedFaculty._id,
      flags: [],
      // Additional fields
      se,
      padcom,
      cns,
      clsa,
      tdfsdiii,
      iic,
      seLab,
      cnsLab,
      adsLab,
      ajpLab,
      qalr,
      ads,
      ajp,
      npteloe,
      idpii,
      cepb,
      csevac,
      library,
      counseling,
      totalPercentage
    });
    
    await student.save();
    console.log('Student created:', { regNo, userId: user._id });
    res.status(201).json({ message: 'Student created' });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
});

// GET /api/students
// Fetch logged-in student's details (student only)
router.get('/', auth(['student']), async (req, res) => {
  try {
    console.log('Fetching student for user:', req.user);
    const student = await Student.findOne({ user: req.user.id })
      .populate('user', 'name username profilePhoto phone')
      .populate('assignedFaculty', 'name username profilePhoto');
      
    if (!student) {
      console.log('Student not found for user ID:', req.user.id);
      return res.status(404).json({ message: 'Student not found' });
    }
    
    console.log('Found student:', {
      regNo: student.regNo,
      userId: student.user._id,
      username: student.user.username,
    });
    
    const appointments = await Session.find({ student: req.user.id })
      .populate('faculty', 'name');
      
    const unreadMessages = await Message.countDocuments({
      recipient: req.user.id,
      read: false,
    });
    
    res.json({
      name: student.user.name,
      username: student.user.username,
      profilePhoto: student.user.profilePhoto,
      phone: student.user.phone,
      regNo: student.regNo,
      department: student.department,
      year: student.year,
      major: student.major,
      gpa: student.gpa,
      attendance: student.attendance,
      status: student.status,
      totalPercentage: student.totalPercentage,
      marks: student.marks,
      goals: student.goals,
      sessionNotes: student.sessionNotes,
      assignedFaculty: {
        name: student.assignedFaculty?.name || '',
        username: student.assignedFaculty?.username || '',
        profilePhoto: student.assignedFaculty?.profilePhoto || '',
      },
      // Additional fields
      se: student.se,
      padcom: student.padcom,
      cns: student.cns,
      clsa: student.clsa,
      tdfsdiii: student.tdfsdiii,
      iic: student.iic,
      seLab: student.seLab,
      cnsLab: student.cnsLab,
      adsLab: student.adsLab,
      ajpLab: student.ajpLab,
      qalr: student.qalr,
      ads: student.ads,
      ajp: student.ajp,
      npteloe: student.npteloe,
      idpii: student.idpii,
      cepb: student.cepb,
      csevac: student.csevac,
      library: student.library,
      counseling: student.counseling,
      parentNumber: student.parentNumber,
      appointments: appointments.map((a) => ({
        id: a._id,
        date: a.date.toISOString().split('T')[0],
        time: a.date.toTimeString().split(' ')[0],
        counselor: a.faculty?.name || 'Unknown',
        location: a.location,
      })),
      unreadMessages,
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'Error fetching student data', error: error.message });
  }
});

// GET /api/students/search
// Search students by regNo or name (student/faculty/admin)
router.get('/search', auth(['student', 'faculty', 'admin']), async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const students = await Student.find({
      $or: [
        { regNo: { $regex: query, $options: 'i' } }, // Case-insensitive search
        { name: { $regex: query, $options: 'i' } },
      ],
    })
    .populate('user assignedFaculty');

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    res.json(students);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/students/:regNo
// Fetch detailed student data by regNo (faculty/admin)
router.get('/:regNo', auth(['faculty', 'admin']), async (req, res) => {
  try {
    const { regNo } = req.params;
    const student = await Student.findOne({ regNo })
      .populate('user', 'name username phone profilePhoto')
      .populate('assignedFaculty', 'name username profilePhoto');
      
    if (!student) {
      console.log('Student not found:', regNo);
      return res.status(404).json({ message: `Student with regNo ${regNo} not found` });
    }
    
    console.log('Fetched student:', { regNo, userId: student.user._id });
    res.json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/students/upload
// Upload a file (student/faculty/admin)
router.post('/upload', auth(['student', 'faculty', 'admin']), upload.single('file'), async (req, res) => {
  try {
    const { regNo } = req.body;
    const file = req.file;
    
    if (!file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const student = await Student.findOne({ regNo });
    if (!student) {
      console.log('Student not found:', regNo);
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const uploadRecord = new Upload({
      studentId: student._id,
      fileName: file.filename,
      filePath: file.path,
    });
    
    await uploadRecord.save();
    console.log('File uploaded:', { fileName: file.filename, regNo });
    res.json({ message: 'File uploaded successfully', filePath: file.path });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Failed to upload file', error: error.message });
  }
});

export default router;