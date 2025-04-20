// controllers/facultyController.js
import { Student, Session, Task, Message, Announcement, Resource, Feedback } from '../models/index.js';

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const assignedStudents = await Student.countDocuments({ faculty: req.user.id });
    const upcomingSessions = await Session.countDocuments({
      faculty: req.user.id,
      date: { $gte: new Date().toISOString().split('T')[0] },
    });
    const urgentAlerts = await Student.countDocuments({
      faculty: req.user.id,
      status: 'Critical',
    });

    res.json({ assignedStudents, upcomingSessions, urgentAlerts });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students for the faculty
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ faculty: req.user.id });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all sessions for the faculty
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ faculty: req.user.id });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new session
export const addSession = async (req, res) => {
  const { date, title, type } = req.body;

  try {
    const session = new Session({
      date,
      title,
      type,
      notes: '',
      faculty: req.user.id,
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Reschedule a session
export const rescheduleSession = async (req, res) => {
  const { id } = req.params;
  const { date, title, type } = req.body;

  try {
    const session = await Session.findById(id);
    if (!session || session.faculty.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.date = date;
    session.title = title;
    session.type = type;

    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel a session
export const cancelSession = async (req, res) => {
  const { id } = req.params;

  try {
    const session = await Session.findById(id);
    if (!session || session.faculty.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.remove();
    res.json({ message: 'Session canceled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all tasks for the faculty
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ faculty: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new task
export const addTask = async (req, res) => {
  const { title, priority, due } = req.body;

  try {
    const task = new Task({
      title,
      priority,
      due,
      faculty: req.user.id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all messages for the faculty
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ faculty: req.user.id });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  const { text } = req.body;

  try {
    const message = new Message({
      text,
      date: new Date().toLocaleDateString(),
      faculty: req.user.id,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all announcements for the faculty
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ faculty: req.user.id });
    res.json(announcements.map(a => a.text));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all resources for the faculty
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ faculty: req.user.id });
    res.json(resources.map(r => r.name));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all feedbacks for the faculty
export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ faculty: req.user.id }).populate('student', 'name');
    res.json(feedbacks.map(f => `${f.student.name}: ${f.text}`));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};