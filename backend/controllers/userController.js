import User from '../models/User.js';

const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Example: Return role-specific data
    let dashboardData = {};
    if (user.role === 'admin') {
      dashboardData = { message: 'Welcome Admin', stats: { users: 100, courses: 50 } };
    } else if (user.role === 'faculty') {
      dashboardData = { message: 'Welcome Faculty', courses: ['Math', 'Science'] };
    } else if (user.role === 'student') {
      dashboardData = { message: 'Welcome Student', grades: { Math: 'A', Science: 'B' } };
    }

    res.json({ user, dashboardData });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getUserData };