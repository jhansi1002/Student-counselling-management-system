// routes/facultyRoutes.js
import express from 'express';
import {
  getDashboardStats,
  getStudents,
  getSessions,
  addSession,
  rescheduleSession,
  cancelSession,
  getTasks,
  addTask,
  getMessages,
  sendMessage,
  getAnnouncements,
  getResources,
  getFeedbacks,
} from '../controllers/facultyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Dashboard stats
router.get('/stats', authMiddleware, getDashboardStats);

// Students
router.get('/students', authMiddleware, getStudents);

// Sessions
router.get('/sessions', authMiddleware, getSessions);
router.post('/sessions', authMiddleware, addSession);
router.put('/sessions/:id', authMiddleware, rescheduleSession);
router.delete('/sessions/:id', authMiddleware, cancelSession);

// Tasks
router.get('/tasks', authMiddleware, getTasks);
router.post('/tasks', authMiddleware, addTask);

// Messages
router.get('/messages', authMiddleware, getMessages);
router.post('/messages', authMiddleware, sendMessage);

// Announcements
router.get('/announcements', authMiddleware, getAnnouncements);

// Resources
router.get('/resources', authMiddleware, getResources);

// Feedbacks
router.get('/feedbacks', authMiddleware, getFeedbacks);

export default router;