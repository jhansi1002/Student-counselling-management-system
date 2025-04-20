
// import React, { useState, useEffect } from 'react';
// import '../../styles/dashboard.css'; // Link to the CSS file

// // Main Dashboard Component
// const StudentDashboard = () => {
//   const [studentData, setStudentData] = useState({
//     name: '',
//     profilePhoto: '',
//     email: '',
//     phone: '',
//     rollNo: '',
//     marks: [],
//     attendance: 0,
//     appointments: [],
//     messages: 0,
//     counselor: { name: '', photo: '', specialization: '', role: '', email: '' },
//     goals: [],
//     sessionNotes: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);

//   // Fetch student data from MongoDB via API
//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         const response = await fetch('/api/student', {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include',
//         });
//         const data = await response.json();
//         setStudentData({
//           name: data.name || 'Student',
//           profilePhoto: data.profilePhoto || 'default-photo-url',
//           email: data.email || '',
//           phone: data.phone || '',
//           rollNo: data.rollNo || '',
//           marks: data.marks || [],
//           attendance: data.attendance || 0,
//           appointments: data.appointments || [],
//           messages: data.unreadMessages || 0,
//           counselor: data.counselor || { name: '', photo: '', specialization: '', role: '', email: '' },
//           goals: data.goals || [],
//           sessionNotes: data.sessionNotes || [],
//         });
//       } catch (error) {
//         console.error('Error fetching student data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStudentData();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
//       {/* Top Bar */}
//       <TopBar studentName={studentData.name} toggleDarkMode={() => setDarkMode(!darkMode)} />

//       {/* Main Layout */}
//       <div className="main-layout">
//         {/* Left Sidebar */}
//         <Sidebar />

//         {/* Main Content */}
//         <div className="main-content">
//           <WelcomeSection
//             studentName={studentData.name}
//             appointments={studentData.appointments}
//             messages={studentData.messages}
//           />
//           <StudentProfile
//             photo={studentData.profilePhoto}
//             name={studentData.name}
//             email={studentData.email}
//             phone={studentData.phone}
//             rollNo={studentData.rollNo}
//           />
//           <AcademicIntegration marks={studentData.marks} attendance={studentData.attendance} />
//           <AppointmentManagement appointments={studentData.appointments} />
//           <SelfHelpResources />
//           <ProgressTracking goals={studentData.goals} sessionNotes={studentData.sessionNotes} />
//           <FeedbackAndSurveys />
//           <Notifications messages={studentData.messages} />
//           <Gamification />
//         </div>

//         {/* Right Sidebar */}
//         <RightSidebar counselor={studentData.counselor} />
//       </div>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// // Top Bar Component
// const TopBar = ({ studentName, toggleDarkMode }) => (
//   <div className="top-bar">
//     <h2>Welcome, {studentName}!</h2>
//     <div>
//       <button className="top-button" onClick={toggleDarkMode}>Toggle Dark Mode</button>
//       <button className="top-button">Settings</button>
//       <button className="top-button">Logout</button>
//     </div>
//   </div>
// );

// // Left Sidebar Component
// const Sidebar = () => (
//   <div className="sidebar">
//     <h3>Navigation</h3>
//     <ul>
//       <li><a href="#appointments">Appointments</a></li>
//       <li><a href="#messages">Messages</a></li>
//       <li><a href="#resources">Resources</a></li>
//       <li><a href="#goals">Goals</a></li>
//       <li><a href="#academic">Academic</a></li>
//       <li><a href="#feedback">Feedback</a></li>
//     </ul>
//   </div>
// );

// // Welcome Section Component
// const WelcomeSection = ({ studentName, appointments, messages }) => (
//   <div className="welcome-section">
//     <p>Quick Stats: You have {appointments.length} upcoming appointment(s) and {messages} unread messages.</p>
//     <p className="motivational-quote">"You are enough, just as you are." – Daily Motivation</p>
//   </div>
// );

// // Student Profile Component
// const StudentProfile = ({ photo, name, email, phone, rollNo }) => (
//   <div className="student-profile">
//     <h3>Profile</h3>
//     <img src={photo} alt="Student Profile" className="profile-photo" />
//     <p><strong>Name:</strong> {name}</p>
//     <p><strong>Email:</strong> {email}</p>
//     <p><strong>Phone:</strong> {phone}</p>
//     <p><strong>Roll No:</strong> {rollNo}</p>
//   </div>
// );

// // Academic Integration Component
// const AcademicIntegration = ({ marks, attendance }) => (
//   <div className="academic-integration">
//     <h3>Academic Overview</h3>
//     <p><strong>Attendance:</strong> {attendance}%</p>
//     <h4>Marks</h4>
//     <ul>
//       {marks.map((mark, index) => (
//         <li key={index}>{mark.subject}: {mark.score}</li>
//       ))}
//     </ul>
//   </div>
// );

// // Appointment Management Component
// const AppointmentManagement = ({ appointments }) => {
//   const [showBooking, setShowBooking] = useState(false);
//   return (
//     <div className="appointment-management">
//       <h3>Upcoming Appointments</h3>
//       {appointments.map((appt) => (
//         <div key={appt.id} className="appointment-item">
//           <p>{appt.date} at {appt.time} with {appt.counselor} ({appt.location})</p>
//           <button className="action-button">Reschedule</button>
//           <button className="action-button">Cancel</button>
//         </div>
//       ))}
//       <button className="book-button" onClick={() => setShowBooking(!showBooking)}>
//         {showBooking ? 'Close Booking' : 'Book New Appointment'}
//       </button>
//       {showBooking && <div className="booking-form">Booking form placeholder</div>}
//     </div>
//   );
// };

// // Self-Help Resources Component
// const SelfHelpResources = () => (
//   <div className="self-help-resources">
//     <h3>Self-Help Resources</h3>
//     <ul>
//       <li><a href="#">Stress Management Guide</a></li>
//       <li><a href="#">Breathing Exercise Tool</a></li>
//       <li><a href="#">Mood Tracker</a></li>
//     </ul>
//     <button className="emergency-button">Emergency Contacts</button>
//   </div>
// );

// // Progress Tracking Component
// const ProgressTracking = ({ goals, sessionNotes }) => (
//   <div className="progress-tracking">
//     <h3>Progress Tracking</h3>
//     {goals.map((goal, index) => (
//       <div key={index}>
//         <p>{goal.description}</p>
//         <div className="progress-bar">
//           <div className="progress-fill" style={{ width: `${goal.progress}%` }}></div>
//         </div>
//         <p>{goal.progress}% Complete</p>
//       </div>
//     ))}
//     <h4>Session Notes</h4>
//     <ul>
//       {sessionNotes.map((note, index) => (
//         <li key={index}>{note.date}: {note.content}</li>
//       ))}
//     </ul>
//   </div>
// );

// // Feedback and Surveys Component
// const FeedbackAndSurveys = () => (
//   <div className="feedback-surveys">
//     <h3>Feedback & Wellness</h3>
//     <button className="action-button">Submit Session Feedback</button>
//     <button className="action-button">Weekly Wellness Check-In</button>
//   </div>
// );

// // Notifications Component
// const Notifications = ({ messages }) => (
//   <div className="notifications">
//     <h3>Notifications</h3>
//     <p>You have {messages} unread messages.</p>
//     <button className="action-button">View Inbox</button>
//   </div>
// );

// // Gamification Component
// const Gamification = () => (
//   <div className="gamification">
//     <h3>Achievements</h3>
//     <p>Badges: Stress Buster</p>
//     <p>Streak: 5 days logged in</p>
//   </div>
// );

// // Right Sidebar Component
// const RightSidebar = ({ counselor }) => (
//   <div className="right-sidebar">
//     <h3>Counselor Info</h3>
//     <img src={counselor.photo} alt="Counselor" className="counselor-photo" />
//     <p><strong>Name:</strong> {counselor.name}</p>
//     <p><strong>Specialization:</strong> {counselor.specialization}</p>
//     <p><strong>Role:</strong> {counselor.role}</p>
//     <p><strong>Phone:</strong> {counselor.phone}</p>
//     <p><strong>Email:</strong> {counselor.email}</p>
//     <button className="contact-button">Message Counselor</button>
//     <h4>Emergency Contacts</h4>
//     <p>Campus Hotline: 1-800-555-1234</p>
//   </div>
// );

// // Footer Component
// const Footer = () => (
//   <div className="footer">
//     <p>
//       <a href="#">University Policies</a> |
//       <a href="#">Support</a> |
//       <a href="#">Feedback</a>
//     </p>
//   </div>
// );

// export default StudentDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../styles/dashboard.css'; // Link to the CSS file

// Main Dashboard Component
const StudentDashboard = () => {
  const [studentData, setStudentData] = useState({
    name: '',
    profilePhoto: '',
    email: '',
    phone: '',
    rollNo: '',
    marks: [],
    attendance: 0,
    appointments: [],
    messages: 0,
    counselor: { name: '', photo: '', specialization: '', role: '', email: '' },
    goals: [],
    sessionNotes: [],
  });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch('/api/student', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data = await response.json();
        setStudentData({
          name: data.name || 'Student',
          profilePhoto: data.profilePhoto || 'default-photo-url',
          email: data.email || '',
          phone: data.phone || '',
          rollNo: data.rollNo || '',
          marks: data.marks || [],
          attendance: data.attendance || 0,
          appointments: data.appointments || [],
          messages: data.unreadMessages || 0,
          counselor: data.counselor || { name: '', photo: '', specialization: '', role: '', email: '' },
          goals: data.goals || [],
          sessionNotes: data.sessionNotes || [],
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* Top Bar */}
      <TopBar studentName={studentData.name} toggleDarkMode={() => setDarkMode(!darkMode)} />

      {/* Main Layout */}
      <div className="main-layout">
        <Sidebar />
        <div className="main-content">
          <WelcomeSection
            studentName={studentData.name}
            appointments={studentData.appointments}
            messages={studentData.messages}
          />
          <StudentProfile
            photo={studentData.profilePhoto}
            name={studentData.name}
            email={studentData.email}
            phone={studentData.phone}
            rollNo={studentData.rollNo}
          />
          <AcademicIntegration marks={studentData.marks} attendance={studentData.attendance} />
          <AppointmentManagement appointments={studentData.appointments} />
          <SelfHelpResources />
          <ProgressTracking goals={studentData.goals} sessionNotes={studentData.sessionNotes} />
          <FeedbackAndSurveys />
          <Notifications messages={studentData.messages} />
          <Gamification />
        </div>
        <RightSidebar counselor={studentData.counselor} />
      </div>
      <Footer />
    </div>
  );
};

// Top Bar Component
const TopBar = ({ studentName, toggleDarkMode }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = async () => {
    try {
      // Optional: Make an API call to log out on the server
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies if using sessions
      });

      if (response.ok) {
        // Clear any client-side authentication data (e.g., localStorage)
        localStorage.removeItem('token'); // Adjust based on your auth method
        // Redirect to the homepage
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="top-bar">
      <h2>Welcome, {studentName}!</h2>
      <div>
        <button className="top-button" onClick={toggleDarkMode}>
          Toggle Dark Mode
        </button>
        <button className="top-button">Settings</button>
        <button className="top-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

// Other components remain unchanged...

const Sidebar = () => (
  <div className="sidebar">
    <h3>Navigation</h3>
    <ul>
      <li><a href="#appointments">Appointments</a></li>
      <li><a href="#messages">Messages</a></li>
      <li><a href="#resources">Resources</a></li>
      <li><a href="#goals">Goals</a></li>
      <li><a href="#academic">Academic</a></li>
      <li><a href="#feedback">Feedback</a></li>
    </ul>
  </div>
);

const WelcomeSection = ({ studentName, appointments, messages }) => (
  <div className="welcome-section">
    <p>Quick Stats: You have {appointments.length} upcoming appointment(s) and {messages} unread messages.</p>
    <p className="motivational-quote">"You are enough, just as you are." – Daily Motivation</p>
  </div>
);

const StudentProfile = ({ photo, name, email, phone, rollNo }) => (
  <div className="student-profile">
    <h3>Profile</h3>
    <img src={photo} alt="Student Profile" className="profile-photo" />
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Phone:</strong> {phone}</p>
    <p><strong>Roll No:</strong> {rollNo}</p>
  </div>
);

const AcademicIntegration = ({ marks, attendance }) => (
  <div className="academic-integration">
    <h3>Academic Overview</h3>
    <p><strong>Attendance:</strong> {attendance}%</p>
    <h4>Marks</h4>
    <ul>
      {marks.map((mark, index) => (
        <li key={index}>{mark.subject}: {mark.score}</li>
      ))}
    </ul>
  </div>
);

const AppointmentManagement = ({ appointments }) => {
  const [showBooking, setShowBooking] = useState(false);
  return (
    <div className="appointment-management">
      <h3>Upcoming Appointments</h3>
      {appointments.map((appt) => (
        <div key={appt.id} className="appointment-item">
          <p>{appt.date} at {appt.time} with {appt.counselor} ({appt.location})</p>
          <button className="action-button">Reschedule</button>
          <button className="action-button">Cancel</button>
        </div>
      ))}
      <button className="book-button" onClick={() => setShowBooking(!showBooking)}>
        {showBooking ? 'Close Booking' : 'Book New Appointment'}
      </button>
      {showBooking && <div className="booking-form">Booking form placeholder</div>}
    </div>
  );
};

const SelfHelpResources = () => (
  <div className="self-help-resources">
    <h3>Self-Help Resources</h3>
    <ul>
      <li><a href="#">Stress Management Guide</a></li>
      <li><a href="#">Breathing Exercise Tool</a></li>
      <li><a href="#">Mood Tracker</a></li>
    </ul>
    <button className="emergency-button">Emergency Contacts</button>
  </div>
);

const ProgressTracking = ({ goals, sessionNotes }) => (
  <div className="progress-tracking">
    <h3>Progress Tracking</h3>
    {goals.map((goal, index) => (
      <div key={index}>
        <p>{goal.description}</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${goal.progress}%` }}></div>
        </div>
        <p>{goal.progress}% Complete</p>
      </div>
    ))}
    <h4>Session Notes</h4>
    <ul>
      {sessionNotes.map((note, index) => (
        <li key={index}>{note.date}: {note.content}</li>
      ))}
    </ul>
  </div>
);

const FeedbackAndSurveys = () => (
  <div className="feedback-surveys">
    <h3>Feedback & Wellness</h3>
    <button className="action-button">Submit Session Feedback</button>
    <button className="action-button">Weekly Wellness Check-In</button>
  </div>
);

const Notifications = ({ messages }) => (
  <div className="notifications">
    <h3>Notifications</h3>
    <p>You have {messages} unread messages.</p>
    <button className="action-button">View Inbox</button>
  </div>
);

const Gamification = () => (
  <div className="gamification">
    <h3>Achievements</h3>
    <p>Badges: Stress Buster</p>
    <p>Streak: 5 days logged in</p>
  </div>
);

const RightSidebar = ({ counselor }) => (
  <div className="right-sidebar">
    <h3>Counselor Info</h3>
    <img src={counselor.photo} alt="Counselor" className="counselor-photo" />
    <p><strong>Name:</strong> {counselor.name}</p>
    <p><strong>Specialization:</strong> {counselor.specialization}</p>
    <p><strong>Role:</strong> {counselor.role}</p>
    <p><strong>Email:</strong> {counselor.email}</p>
    <button className="contact-button">Message Counselor</button>
    <h4>Emergency Contacts</h4>
    <p>Campus Hotline: 1-800-555-1234</p>
  </div>
);

const Footer = () => (
  <div className="footer">
    <p>
      <a href="#">University Policies</a> | <a href="#">Support</a> | <a href="#">Feedback</a>
    </p>
  </div>
);

export default StudentDashboard;