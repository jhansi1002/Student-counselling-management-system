
// import React, { useState } from 'react';
// import '../../styles/facultydashboard.css';

// const FacultyDashboard = () => {
//   const [activeSection, setActiveSection] = useState('Dashboard');

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'Dashboard':
//         return (
//           <section className="card">
//             <h3 className="card-title">Welcome, Dr. John</h3>
//             <p>Scheduled Sessions: 12 | Students Assigned: 34 | Pending Feedbacks: 3</p>
//           </section>
//         );
//       case 'My Sessions':
//         return (
//           <section className="card">
//             <h3 className="card-title">Upcoming Sessions</h3>
//             <ul className="report-list">
//               <li>March 25 - CSE Batch A - 10:00 AM</li>
//               <li>March 27 - ECE Batch B - 02:00 PM</li>
//               <li>March 30 - IT Batch D - 09:00 AM</li>
//             </ul>
//           </section>
//         );
//       case 'Submit Feedback':
//         return (
//           <section className="card">
//             <h3 className="card-title">Feedback Submission</h3>
//             <form className="feedback-form">
//               <label>
//                 Student Name:
//                 <input type="text" placeholder="Enter name" />
//               </label>
//               <label>
//                 Feedback:
//                 <textarea placeholder="Enter feedback" rows="4"></textarea>
//               </label>
//               <button className="btn submit-btn">Submit</button>
//             </form>
//           </section>
//         );
//       case 'Notifications':
//         return (
//           <section className="card">
//             <h3 className="card-title">Recent Notifications</h3>
//             <ul className="report-list">
//               <li>New counseling format shared - March 21</li>
//               <li>Submit reports by March 25</li>
//               <li>Faculty meeting - March 23 at 4PM</li>
//             </ul>
//           </section>
//         );
//       case 'Resources':
//         return (
//           <section className="card">
//             <h3 className="card-title">Resources</h3>
//             <p>Upload new material or download shared files:</p>
//             <input type="file" />
//             <ul className="report-list">
//               <li><a href="#">Semester Guidelines.pdf</a></li>
//               <li><a href="#">Counseling Notes.docx</a></li>
//             </ul>
//           </section>
//         );
//       case 'Performance':
//         return (
//           <section className="card">
//             <h3 className="card-title">Student Performance Summary</h3>
//             <p>Avg Attendance: 89% | Avg Score: 78%</p>
//             <p>Top Performers: Riya, Manoj, Akash</p>
//           </section>
//         );
//       case 'Session History':
//         return (
//           <section className="card">
//             <h3 className="card-title">Session History</h3>
//             <table className="session-table">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Batch</th>
//                   <th>Topic</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>March 15</td>
//                   <td>CSE-A</td>
//                   <td>Goal Setting</td>
//                 </tr>
//                 <tr>
//                   <td>March 10</td>
//                   <td>ECE-B</td>
//                   <td>Time Management</td>
//                 </tr>
//               </tbody>
//             </table>
//           </section>
//         );
//       case 'Student List':
//         return (
//           <section className="card">
//             <h3 className="card-title">Student List</h3>
//             <ul className="report-list">
//               <li>Riya Sharma - CSE-A</li>
//               <li>Manoj Kumar - ECE-B</li>
//               <li>Akash Mehta - IT-C</li>
//             </ul>
//           </section>
//         );
//       case 'Profile':
//         return (
//           <section className="card">
//             <h3 className="card-title">Faculty Profile</h3>
//             <p><strong>Name:</strong> Dr. John Doe</p>
//             <p><strong>Email:</strong> john.doe@univ.edu</p>
//             <p><strong>Department:</strong> Computer Science</p>
//           </section>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="faculty-dashboard">
//       {/* Header */}
//       <header className="dashboard-header">
//         <h1 className="dashboard-title">Faculty Dashboard</h1>
//         <div className="header-buttons">
//           <button className="btn settings-btn">Settings</button>
//           <button className="btn logout-btn">Logout</button>
//         </div>
//       </header>

//       <div className="dashboard-container">
//         {/* Sidebar */}
//         <aside className="sidebar">
//           <h2 className="sidebar-heading">Navigation</h2>
//           <ul className="sidebar-menu">
//             {[
//               'Dashboard',
//               'My Sessions',
//               'Student List',
//               'Submit Feedback',
//               'Notifications',
//               'Resources',
//               'Performance',
//               'Session History',
//               'Profile'
//             ].map((item) => (
//               <li
//                 key={item}
//                 className={activeSection === item ? 'active' : ''}
//                 onClick={() => setActiveSection(item)}
//               >
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </aside>

//         {/* Main Content */}
//         <main className="dashboard-content">
//           {renderContent()}
//           <footer className="dashboard-footer">
//             Faculty Guidelines | Support | Feedback
//           </footer>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default FacultyDashboard;

import { useState } from "react";
import '../../styles/facultydashboard.css';

function FacultyDashboard() {
  const [user] = useState({ name: "Dr. Smith" });
  const [stats] = useState({ assignedStudents: 25, upcomingSessions: 3, urgentAlerts: 2 });
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", major: "CS", year: "Sophomore", status: "On Track", gpa: 3.5, attendance: 85, flags: [] },
    { id: 2, name: "Jane Smith", major: "EE", year: "Junior", status: "At Risk", gpa: 2.8, attendance: 70, flags: ["Missed Assignments"] },
    { id: 3, name: "Alex Lee", major: "Math", year: "Freshman", status: "Critical", gpa: 2.0, attendance: 60, flags: ["Disciplinary Issue"] },
  ]);
  const [sessions, setSessions] = useState([
    { id: 1, date: "2025-03-25", title: "Counseling with John Doe", notes: "Discussed time management", type: "In-Person" },
    { id: 2, date: "2025-03-26", title: "Counseling with Jane Smith", notes: "Set academic goals", type: "Virtual" },
  ]);
  const [tasks] = useState([
    { id: 1, title: "Review John Doe’s progress report", priority: "High", due: "2025-03-24" },
    { id: 2, title: "Follow up with Jane Smith", priority: "Medium", due: "2025-03-27" },
  ]);
  const [messages, setMessages] = useState([]);
  const [announcements] = useState(["Study Skills Workshop this Friday"]);
  const [resources] = useState(["Mental Health Referral Guide", "Academic Probation Policy"]);
  const [newSession, setNewSession] = useState({ date: "", title: "", type: "In-Person" });
  const [newMessage, setNewMessage] = useState("");
  const [newTask, setNewTask] = useState({ title: "", priority: "Medium" });
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceThreshold, setAttendanceThreshold] = useState(75);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [feedbacks] = useState(["Jane Smith: Can we discuss my grades?"]);

  const messageTemplates = [
    "Reminder: Counseling Session Tomorrow",
    "Please submit your pending assignments",
    "Follow-up on recent session",
  ];

  const handleAddSession = () => {
    const newId = sessions.length + 1;
    setSessions([...sessions, { id: newId, ...newSession, notes: "" }]);
    setNewSession({ date: "", title: "", type: "In-Person" });
  };

  const handleRescheduleSession = (id) => {
    const session = sessions.find(s => s.id === id);
    setNewSession({ date: session.date, title: session.title, type: session.type });
    setSessions(sessions.filter(s => s.id !== id));
  };

  const handleCancelSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const handleSendMessage = () => {
    setMessages([...messages, { text: newMessage || selectedTemplate, date: new Date().toLocaleDateString() }]);
    setNewMessage("");
    setSelectedTemplate("");
  };

  const handleAddTask = () => {
    console.log("New Task:", newTask);
    setNewTask({ title: "", priority: "Medium" });
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="faculty-dashboard">
      <div className="sidebar">
        <h2>Faculty Dashboard</h2>
        <nav>
          <ul>
            <li>Home</li>
            <li>Students</li>
            <li>Calendar</li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        {/* 1. Counselor Dashboard Home */}
        <section>
          <h1>Welcome, {user.name}</h1>
          <p>You have {stats.upcomingSessions} counseling sessions scheduled today.</p>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Assigned Students</h3>
              <p>{stats.assignedStudents}</p>
            </div>
            <div className="stat-card">
              <h3>Upcoming Sessions</h3>
              <p>{stats.upcomingSessions}</p>
            </div>
            <div className="stat-card">
              <h3>Urgent Alerts</h3>
              <p>{stats.urgentAlerts}</p>
            </div>
          </div>
          <div className="button-group">
            <button className="btn btn-blue">Schedule a Session</button>
            <button className="btn btn-green">Send Message</button>
            <button className="btn btn-purple">View Student List</button>
          </div>
        </section>

        {/* 2. Student Overview Panel */}
        <section>
          <h2>Assigned Students</h2>
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Major</th>
                <th>Year</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td><span className="student-link">{student.name}</span></td>
                  <td>{student.major}</td>
                  <td>{student.year}</td>
                  <td>
                    <span className={`status ${student.status.toLowerCase().replace(" ", "-")}`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 3. Counseling Session Management */}
        <section>
          <h2>Calendar</h2>
          <div className="calendar-card">
            <h3>Upcoming Sessions</h3>
            <ul>
              {sessions.map((session) => (
                <li key={session.id}>
                  <span>{session.date}</span>: {session.title} ({session.type})
                  <div className="session-notes">{session.notes}</div>
                  <button className="btn btn-small btn-blue" onClick={() => handleRescheduleSession(session.id)}>Reschedule</button>
                  <button className="btn btn-small btn-red" onClick={() => handleCancelSession(session.id)}>Cancel</button>
                </li>
              ))}
            </ul>
            <div className="form-group">
              <input
                type="date"
                value={newSession.date}
                onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
              />
              <input
                type="text"
                value={newSession.title}
                onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                placeholder="Session Title"
              />
              <select
                value={newSession.type}
                onChange={(e) => setNewSession({ ...newSession, type: e.target.value })}
              >
                <option value="In-Person">In-Person</option>
                <option value="Virtual">Virtual</option>
              </select>
              <button className="btn btn-blue" onClick={handleAddSession}>Add Session</button>
            </div>
          </div>
        </section>

        {/* 4. Student Progress Tracking */}
        <section>
          <h2>Student Progress</h2>
          <div className="threshold-input">
            <label>Attendance Threshold (%): </label>
            <input
              type="number"
              value={attendanceThreshold}
              onChange={(e) => setAttendanceThreshold(e.target.value)}
              min="0"
              max="100"
            />
          </div>
          <div className="progress-grid">
            {students.map((student) => (
              <div key={student.id} className="progress-card">
                <h3>{student.name}</h3>
                <p>GPA: {student.gpa}</p>
                <p>Attendance: {student.attendance}% {student.attendance < attendanceThreshold && <span className="alert">Low</span>}</p>
                <p>Flags: {student.flags.length ? student.flags.join(", ") : "None"}</p>
                <div className="chart-placeholder">Chart Placeholder</div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Communication Tools */}
        <section>
          <h2>Communication</h2>
          <div className="communication-card">
            <h3>Send Message</h3>
            <select
              value={selectedTemplate}
              onChange={(e) => setNewMessage(e.target.value)}
              className="template-select"
            >
              <option value="">Select a template</option>
              {messageTemplates.map((template, index) => (
                <option key={index} value={template}>{template}</option>
              ))}
            </select>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button className="btn btn-green" onClick={handleSendMessage}>Send</button>
            <h3>Announcements</h3>
            <ul>
              {announcements.map((announcement, index) => (
                <li key={index}>{announcement}</li>
              ))}
            </ul>
            <h3>Student Feedback</h3>
            <ul>
              {feedbacks.map((feedback, index) => (
                <li key={index}>{feedback}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 6. Resource Library */}
        <section>
          <h2>Resource Library</h2>
          <div className="resource-card">
            <ul>
              {resources.map((resource, index) => (
                <li key={index}>{resource}</li>
              ))}
            </ul>
            <input type="file" />
          </div>
        </section>

        {/* 7. Analytics and Insights */}
        <section>
          <h2>Analytics</h2>
          <div className="analytics-card">
            <p>80% of students improved grades after counseling.</p>
            <button className="btn btn-gray">Download At-Risk Report</button>
          </div>
        </section>

        {/* 8. Task Management */}
        <section>
          <h2>Tasks</h2>
          <div className="task-card">
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  <span className={`priority-${task.priority.toLowerCase()}`}>{task.priority}</span> - {task.title} (Due: {task.due})
                </li>
              ))}
            </ul>
            <div className="form-group">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="New Task"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button className="btn btn-blue" onClick={handleAddTask}>Add Task</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default FacultyDashboard;









