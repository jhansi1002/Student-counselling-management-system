// // import express from 'express';
// // import Student from '../models/Student.js';

// // const router = express.Router();

// // // GET student data
// // router.get('/student', async (req, res) => {
// //   try {
// //     // For simplicity, fetching the first student; in production, use authentication
// //     const student = await Student.findOne();
// //     if (!student) {
// //       return res.status(404).json({ error: 'Student not found' });
// //     }
// //     res.json(student);
// //   } catch (error) {
// //     console.error('Error fetching student:', error);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // });

// // export default router;

// import express from 'express';
// import Student from '../models/Student.js';

// const router = express.Router();

// const requireAuth = (req, res, next) => {
//   if (!req.session || !req.session.userId) {
//     return res.status(401).json({ error: 'Login failed. Please log in.' });
//   }
//   next();
// };

// router.get('/student', requireAuth, async (req, res) => {
//   try {
//     const students = await Student.find(); // Or filter by user: Student.findOne({ _id: req.session.studentId })
//     if (!students.length) return res.status(404).json({ error: 'No students found' });
//     res.json(students);
//   } catch (error) {
//     console.error('Error fetching students:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// export default router;


import express from 'express';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import User from '../models/User.js';

const router = express.Router();

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'your-jwt-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/student', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    if (user.role === 'student') {
      const student = await Student.findOne({ email: user.username });
      if (!student) return res.status(404).json({ message: 'Student data not found' });
      res.json(student);
    } else {
      const students = await Student.find();
      res.json(students);
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;