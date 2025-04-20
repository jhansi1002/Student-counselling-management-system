import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const login = async (req, res) => {
  const { username, password, role } = req.body;

  // Validate that role is provided and is valid
  if (!role) {
    console.error('Login attempt failed: Role is missing in the request body');
    return res.status(400).json({ message: 'Role is required. Please select a role (admin, student, or faculty)' });
  }

  const validRoles = ['admin', 'student', 'faculty'];
  if (!validRoles.includes(role)) {
    console.error(`Login attempt failed: Invalid role provided - ${role}`);
    return res.status(400).json({ message: `Invalid role. Role must be one of: ${validRoles.join(', ')}` });
  }

  try {
    // Hardcoded admin credentials
    const adminUsername = 'admin';
    const adminPassword = 'admin123';

    // Check if the user is trying to log in as admin
    if (username === adminUsername && password === adminPassword) {
      let adminUser = await User.findOne({ username: adminUsername });
      if (!adminUser) {
        // Create admin user if it doesn't exist
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        adminUser = new User({
          username: adminUsername,
          password: hashedPassword,
          role: 'admin',
          name: 'Admin User',
        });
        await adminUser.save();
      }

      const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      return res.json({ token, role: adminUser.role });
    }

    // Check for student or faculty (username === password)
    if (username === password) {
      let user = await User.findOne({ username });

      if (!user) {
        // Create new user if they don't exist
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
          username,
          password: hashedPassword,
          role, // Use the role from the request body
          name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        });
        await user.save();
      }

      // Verify the role matches the user's role in the database
      if (user.role !== role) {
        return res.status(400).json({ message: 'Role does not match the user’s assigned role' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      return res.json({ token, role: user.role });
    }

    // If username and password don't match, check for existing user
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Verify the role matches
    if (user.role !== role) {
      return res.status(400).json({ message: 'Role does not match the user’s assigned role' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { login };