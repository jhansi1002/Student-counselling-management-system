// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './components/Login';
// import AdminDashboard from './components/Dashboard/AdminDashboard';
// import FacultyDashboard from './components/Dashboard/FacultyDashboard';
// import StudentDashboard from './components/Dashboard/StudentDashboard';
// import Home from './pages/Home';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />
//         <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
//         <Route path="/student-dashboard" element={<StudentDashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import FacultyDashboard from './components/Dashboard/FacultyDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import StudentSearch from "./pages/StudentSearch";
import StudentProfile from "./pages/StudentProfile";
import Home from './pages/Home';
import './App.css';

// ProtectedRoute component to check authentication
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('token'); // Example: Check for a token
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin-dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} />}
        />
        <Route
          path="/faculty-dashboard"
          element={<ProtectedRoute element={<FacultyDashboard />} />}
        />
        <Route
          path="/student-dashboard"
          element={<ProtectedRoute element={<StudentDashboard />} />}
        />
        <Route path="/search" element={<StudentSearch />} />
        <Route path="/student-profile/:regdNo" element={<StudentProfile />} />
      </Routes>
    </Router>
  );
}

export default App;