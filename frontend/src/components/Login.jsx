// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/login.css';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', {
//         username,
//         password,
//       });

//       const { token, role } = response.data;

//       // Store the token in localStorage
//       localStorage.setItem('token', token);

//       // Redirect based on role
//       if (role === 'admin') {
//         navigate('/admin-dashboard');
//       } else if (role === 'faculty') {
//         navigate('/faculty-dashboard');
//       } else if (role === 'student') {
//         navigate('/student-dashboard');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       {error && <p className="error">{error}</p>}
//       <form onSubmit={handleLogin}>
//         <div>
//           <label>Username:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;

//up one is more needed


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/login.css';
// import studentImage from '../images/student.jpg';
// import facultyImage from '../images/faculty.jpg';
// import adminImage from '../images/admin.jpg';
// import vignanLogo from '../images/vignanlogo.jpg';

// const Login = () => {
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log('selectedRole:', selectedRole);
//   }, [selectedRole]);

//   const handleRoleSelect = (role) => {
//     console.log('Role selected:', role);
//     setSelectedRole(role);
//     if (role === 'admin') {
//       setUsername('admin');
//       setPassword('admin123');
//     } else if (role === 'student') {
//       setUsername('student1');
//       setPassword('student1');
//     } else if (role === 'faculty') {
//       setUsername('faculty1');
//       setPassword('faculty1');
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', {
//         username,
//         password,
//       });

//       const { token, role: userRole } = response.data;

//       localStorage.setItem('token', token);

//       if (userRole === 'admin') {
//         navigate('/admin-dashboard');
//       } else if (userRole === 'faculty') {
//         navigate('/faculty-dashboard');
//       } else if (userRole === 'student') {
//         navigate('/student-dashboard');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="login-page-container">
//       <div className="welcome-bar">
//         <img src={vignanLogo} alt="Vignan Logo" className="vignan-logo" />
//         <h1 className="welcome-message">VFSTR Student Counseling Management System</h1>
//       </div>
//       {selectedRole === null ? (
//         <>
//           <h2>Select Your Role to Login</h2>
//           <div className="login-grid">
//             <div className="login-box" onClick={() => handleRoleSelect('student')}>
//               <img src={studentImage} alt="Student Login" className="login-image" />
//             </div>
//             <div className="login-box" onClick={() => handleRoleSelect('faculty')}>
//               <img src={facultyImage} alt="Faculty Login" className="login-image" />
//             </div>
//             <div className="login-box" onClick={() => handleRoleSelect('admin')}>
//               <img src={adminImage} alt="Admin Login" className="login-image" />
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="login-container">
//           <h2>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login</h2>
//           {error && <p className="error">{error}</p>}
//           <form onSubmit={handleLogin}>
//             <div>
//               <label>Username:</label>
//               <input
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label>Password:</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <button type="submit">Login</button>
//             <button type="button" onClick={() => setSelectedRole(null)}>
//               Back to Role Selection
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;




// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/login.css';
// import vignanLogo from '../images/vignanlogo.jpg';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [usernameError, setUsernameError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   const selectedRole = location.state?.role || 'User';

//   const validateUsername = (value) => {
//     if (value.length < 3) {
//       setUsernameError('Username must be at least 3 characters long');
//     } else {
//       setUsernameError('');
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     // Validate username before submitting
//     if (username.length < 3) {
//       setUsernameError('Username must be at least 3 characters long');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', {
//         username,
//         password,
//       });

//       const { token, role } = response.data;

//       localStorage.setItem('token', token);

//       if (role === 'admin') {
//         navigate('/admin-dashboard');
//       } else if (role === 'faculty') {
//         navigate('/faculty-dashboard');
//       } else if (role === 'student') {
//         navigate('/student-dashboard');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   const handleBack = () => {
//     navigate('/');
//   };

//   return (
//     <div className="login-page-container">
//       <div className="welcome-bar">
//         <img src={vignanLogo} alt="Vignan Logo" className="vignan-logo" />
//         <h1 className="welcome-message">VFSTR Student Counseling Management System</h1>
//       </div>
//       <div className="login-container">
//         <h2>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login</h2>
//         {error && <p className="error">{error}</p>}
//         <form onSubmit={handleLogin}>
//           <div>
//             <label>Username:</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => {
//                 setUsername(e.target.value);
//                 validateUsername(e.target.value);
//               }}
//               required
//               placeholder="Enter username"
//               title="Username can contain any characters, numbers, or special characters"
//             />
//             {usernameError && <p className="error">{usernameError}</p>}
//           </div>
//           <div>
//             <label>Password:</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="Enter your password"
//             />
//           </div>
//           <button type="submit">Login</button>
//           <button type="button" onClick={handleBack}>
//             Back to Role Selection
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';
import vignanLogo from '../images/vignanlogo.jpg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get the selected role from the navigation state
  const selectedRole = location.state?.role?.toLowerCase();

  // Validate the role on component mount
  useEffect(() => {
    const validRoles = ['admin', 'student', 'faculty'];
    if (!selectedRole || !validRoles.includes(selectedRole)) {
      // Redirect to homepage if role is missing or invalid
      navigate('/', { replace: true });
    }
  }, [selectedRole, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Double-check the role before sending the request
    const validRoles = ['admin', 'student', 'faculty'];
    if (!selectedRole || !validRoles.includes(selectedRole)) {
      setError('Please select a valid role (admin, student, or faculty)');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
        role: selectedRole, // Send the validated role
      });

      const { token, role } = response.data;

      localStorage.setItem('token', token);

      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'faculty') {
        navigate('/faculty-dashboard');
      } else if (role === 'student') {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  // If role is invalid, the useEffect will redirect, so we can return null while redirecting
  if (!selectedRole) return null;

  return (
    <div className="login-page-container">
      <div className="welcome-bar">
        <img src={vignanLogo} alt="Vignan Logo" className="vignan-logo" />
        <h1 className="welcome-message">VFSTR Student Counseling Management System</h1>
      </div>
      <div className="login-container">
        <h2>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username (e.g., 221fa04471, john123)"
              title="Username can contain any characters, numbers, or special characters"
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit">Login</button>
          <button type="button" onClick={handleBack}>
            Back to Role Selection
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;