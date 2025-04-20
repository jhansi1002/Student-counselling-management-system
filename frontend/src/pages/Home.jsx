
// import React from "react";
// import { Link } from "react-router-dom";
// import "../styles/home.css";
// import studentImage from "../images/student.jpg";
// import facultyImage from "../images/faculty.jpg";
// import adminImage from "../images/admin.jpg";
// import vignanLogo from "../images/vignanlogo.jpg";

// const Home = () => {
//   return (
//     <div className="home-container">
//       {/* Welcome Bar with Logo and Title */}
//       <div className="welcome-bar">
//         <img src={vignanLogo} alt="Vignan Logo" className="vignan-logo" />
//         <h1 className="welcome-message">VFSTR Student Counseling Management System</h1>
//       </div>

//       {/* Login Grid */}
//       <div className="login-grid">
//         <Link to="/login" className="login-box">
//           <img src={studentImage} alt="Student Login" className="login-image" />
//         </Link>
//         <Link to="/login" className="login-box">
//           <img src={facultyImage} alt="Faculty Login" className="login-image" />
//         </Link>
//         <Link to="/login" className="login-box">
//           <img src={adminImage} alt="Admin Login" className="login-image" />
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Home;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import studentImage from '../images/student.jpg';
import facultyImage from '../images/faculty.jpg';
import adminImage from '../images/admin.jpg';
import vignanLogo from '../images/vignanlogo.jpg';

const Home = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    // Redirect to /login with the selected role as state
    navigate('/login', { state: { role } });
  };

  return (
    <div className="home-container">
      <div className="welcome-bar">
        <img src={vignanLogo} alt="Vignan Logo" className="vignan-logo" />
        <h1 className="welcome-message">VFSTR Student Counseling Management System</h1>
      </div>
      <h2>Select Your Role</h2>
      <div className="login-grid">
        <div className="login-box" onClick={() => handleRoleSelect('student')}>
          <img src={studentImage} alt="Student Login" className="login-image" />
          
        </div>
        <div className="login-box" onClick={() => handleRoleSelect('faculty')}>
          <img src={facultyImage} alt="Faculty Login" className="login-image" />
          
        </div>
        <div className="login-box" onClick={() => handleRoleSelect('admin')}>
          <img src={adminImage} alt="Admin Login" className="login-image" />
          
        </div>
      </div>
    </div>
  );
};

export default Home;