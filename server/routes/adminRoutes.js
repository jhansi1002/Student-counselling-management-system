import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Session from "../models/Session.js";
import Announcement from "../models/Announcement.js";
import Resource from "../models/Resource.js";
import ActivityLog from "../models/ActivityLog.js";
import Message from "../models/Message.js";
import Task from "../models/Task.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Admin-only routes
router.use(auth(["admin"]));

// Stats
router.get("/stats", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await User.countDocuments({ role: "faculty" });
    const activeSessions = await Session.countDocuments({ date: { $gte: new Date() } });
    const urgentAlerts = await Student.countDocuments({ status: "Critical" });

    res.json({
      totalStudents,
      totalFaculty,
      activeSessions,
      urgentAlerts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// Faculty Management
router.get("/faculty", async (req, res) => {
  try {
    const faculty = await User.find({ role: "faculty" }).select("-password");
    const facultyWithStudents = await Promise.all(
      faculty.map(async (f) => {
        const assignedStudents = await Student.countDocuments({ assignedFaculty: f._id });
        return { ...f.toObject(), assignedStudents };
      })
    );
    res.json(facultyWithStudents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty" });
  }
});

router.post("/faculty", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const faculty = new User({
      name,
      email,
      password: hashedPassword,
      role: "faculty",
    });
    await faculty.save();

    await ActivityLog.create({
      user: req.user.id,
      action: "Added Faculty",
      details: `Faculty: ${name} (${email})`,
    });

    res.status(201).json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error adding faculty" });
  }
});

router.delete("/faculty/:id", async (req, res) => {
  try {
    const faculty = await User.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    await Student.updateMany({ assignedFaculty: req.params.id }, { $unset: { assignedFaculty: "" } });
    await ActivityLog.create({
      user: req.user.id,
      action: "Removed Faculty",
      details: `Faculty: ${faculty.name} (${faculty.email})`,
    });

    res.json({ message: "Faculty removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing faculty" });
  }
});

// Student Management
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find().populate("user", "name email").populate("assignedFaculty", "name");
    res.json(
      students.map((s) => ({
        id: s._id,
        name: s.user.name,
        major: s.major,
        year: s.year,
        status: s.status,
        gpa: s.gpa,
        facultyName: s.assignedFaculty?.name || "Unassigned",
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

router.put("/students/:id/reassign", async (req, res) => {
  const { facultyId } = req.body;
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role !== "faculty") {
      return res.status(404).json({ message: "Faculty not found" });
    }

    student.assignedFaculty = facultyId;
    await student.save();

    await ActivityLog.create({
      user: req.user.id,
      action: "Reassigned Student",
      details: `Student: ${student.user.name} to Faculty: ${faculty.name}`,
    });

    res.json({ facultyName: faculty.name });
  } catch (error) {
    res.status(500).json({ message: "Error reassigning student" });
  }
});

// Sessions
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("faculty", "name")
      .populate("student", "name");
    res.json(
      sessions.map((s) => ({
        id: s._id,
        date: s.date.toISOString().split("T")[0],
        title: s.title,
        facultyName: s.faculty.name,
        studentName: s.student.name,
        type: s.type,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching sessions" });
  }
});

// Announcements
router.get("/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find().populate("createdBy", "name");
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching announcements" });
  }
});

router.post("/announcements", async (req, res) => {
  const { text } = req.body;
  try {
    const announcement = new Announcement({
      text,
      createdBy: req.user.id,
    });
    await announcement.save();

    await ActivityLog.create({
      user: req.user.id,
      action: "Posted Announcement",
      details: `Text: ${text}`,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: "Error posting announcement" });
  }
});

// Resources
router.get("/resources", async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resources" });
  }
});

router.post("/resources", upload.single("file"), async (req, res) => {
  try {
    const resource = new Resource({
      name: req.body.name,
      url: `/uploads/${req.file.filename}`,
      createdBy: req.user.id,
    });
    await resource.save();

    await ActivityLog.create({
      user: req.user.id,
      action: "Uploaded Resource",
      details: `Resource: ${req.body.name}`,
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: "Error uploading resource" });
  }
});

// Activity Logs
router.get("/activity-logs", async (req, res) => {
  try {
    const logs = await ActivityLog.find().populate("user", "name email");
    res.json(
      logs.map((log) => ({
        id: log._id,
        timestamp: log.timestamp,
        user: log.user.name,
        action: log.action,
        details: log.details,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching activity logs" });
  }
});

// Analytics
router.get("/analytics", async (req, res) => {
  try {
    const studentProgress = await Student.aggregate([
      { $match: { gpa: { $gt: 2.5 } } },
      { $count: "improved" },
    ]);
    const facultyPerformance = await Session.aggregate([
      { $group: { _id: "$faculty", totalSessions: { $sum: 1 } } },
      { $lookupbib: { from: "users", localField: "_id", foreignField: "_id", as: "faculty" } },
      { $project: { name: "$faculty.name", totalSessions: 1 } },
    ]);

    res.json({
      studentProgress: studentProgress[0]?.improved || 0,
      facultyPerformance: facultyPerformance.reduce((acc, f) => {
        acc[f.name[0]] = f.totalSessions;
        return acc;
      }, {}),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

export default router;