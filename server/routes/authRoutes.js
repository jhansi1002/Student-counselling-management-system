import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Student from "../models/Student.js";
import csv from "csv-parser";
import fs from "fs";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Temporary endpoint to drop email index (remove after use)
router.delete("/drop-email-index", async (req, res) => {
  try {
    await User.collection.dropIndex("email_1");
    res.json({ message: "Email index dropped" });
  } catch (error) {
    console.error("Error dropping email index:", error);
    res.status(500).json({ message: "Error dropping email index" });
  }
});

// Temporary endpoint to clear test data (remove after use)
router.delete("/clear-test-data", async (req, res) => {
  try {
    await User.deleteMany({
      username: { $in: ["john_doe", "faculty1", "admin_user"] },
    });
    await Student.deleteMany({ regNo: "STU001" });
    res.json({ message: "Test data cleared" });
  } catch (error) {
    console.error("Error clearing test data:", error);
    res.status(500).json({ message: "Error clearing test data" });
  }
});

// Temporary endpoint to list users (remove after use)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "username password role").lean();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Upload CSV to create users
router.post("/upload-users", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const users = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        if (["student", "faculty", "admin"].includes(row.role)) {
          users.push({
            name: row.name?.trim(),
            username: row.username?.trim(),
            password: row.password?.trim(),
            role: row.role?.trim(),
            profilePhoto: row.profilePhoto?.trim() || `default-${row.role}.jpg`,
            phone: row.phone?.trim() || "",
            createdAt: new Date(row.createdAt || Date.now()),
          });
        }
      })
      .on("end", async () => {
        try {
          await User.insertMany(users, { ordered: false });
          fs.unlinkSync(req.file.path);
          res.json({ message: `${users.length} users inserted` });
        } catch (error) {
          console.error("Error inserting users:", error);
          res.status(500).json({ message: "Error inserting users" });
        }
      });
  } catch (error) {
    console.error("Error processing CSV:", error);
    res.status(500).json({ message: "Error processing CSV" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  console.log("Login attempt:", { username, password, role }); // Debug log

  try {
    if (!["student", "faculty", "admin"].includes(role)) {
      console.log("Invalid role:", role);
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findOne({ username, role });
    if (!user) {
      console.log("User not found:", { username, role });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Stored user:", { username: user.username, password: user.password, role: user.role });
    if (password !== user.password) {
      console.log("Password mismatch:", { input: password, stored: user.password });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default router;