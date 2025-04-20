// src/components/AdminDashboard.js
import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/admindashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 680,
    totalFaculty: 100,
    activeSessions: 9,
    urgentAlerts: 0,
  });
  const [facultyList, setFacultyList] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [resources, setResources] = useState([]); // Add state for resources
  const [activityLogs, setActivityLogs] = useState([]); // Add state for activity logs
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // Add filter for student status
  const [filterMajor, setFilterMajor] = useState(""); // Add filter for student major
  const [newFaculty, setNewFaculty] = useState({ name: "", email: "", password: "" }); // Add state for adding faculty
  const [analytics, setAnalytics] = useState({ studentProgress: 0, facultyPerformance: {} }); // Add state for analytics

  // Fetch data on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchFaculty = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/faculty", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFacultyList(response.data);
      } catch (error) {
        console.error("Error fetching faculty:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/sessions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/announcements", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    const fetchResources = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/resources", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResources(response.data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    const fetchActivityLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/activity-logs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivityLogs(response.data);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchStats();
    fetchFaculty();
    fetchStudents();
    fetchSessions();
    fetchAnnouncements();
    fetchResources();
    fetchActivityLogs();
    fetchAnalytics();
  }, []);

  const handleAddFaculty = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/admin/faculty",
        newFaculty,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFacultyList([...facultyList, response.data]);
      setNewFaculty({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Error adding faculty:", error);
    }
  };

  const handleRemoveFaculty = async (facultyId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/faculty/${facultyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFacultyList(facultyList.filter((faculty) => faculty.id !== facultyId));
    } catch (error) {
      console.error("Error removing faculty:", error);
    }
  };

  const handleReassignStudent = async (studentId, newFacultyId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/admin/students/${studentId}/reassign`,
        { facultyId: newFacultyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(
        students.map((student) =>
          student.id === studentId ? { ...student, facultyName: response.data.facultyName } : student
        )
      );
    } catch (error) {
      console.error("Error reassigning student:", error);
    }
  };

  const handleAddAnnouncement = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/admin/announcements",
        { text: newAnnouncement },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnnouncements([...announcements, response.data]);
      setNewAnnouncement("");
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus ? student.status === filterStatus : true;
    const matchesMajor = filterMajor ? student.major === filterMajor : true;
    return matchesSearch && matchesStatus && matchesMajor;
  });

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li><a href="#dashboard-overview">Home</a></li>
            <li><a href="#faculty-management">Faculty Management</a></li>
            <li><a href="#student-management">Student Management</a></li>
            <li><a href="#counseling-sessions">Counseling Sessions</a></li>
            <li><a href="#resource-library">Resource Library</a></li>
            <li><a href="#announcements">Announcements</a></li>
            <li><a href="#analytics">Analytics</a></li>
            <li><a href="#activity-logs">Activity Logs</a></li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        {/* 1. Dashboard Overview */}
        <section id="dashboard-overview">
          <h1>Welcome, Admin</h1>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Students</h3>
              <p>{stats.totalStudents}</p>
            </div>
            <div className="stat-card">
              <h3>Total Faculty</h3>
              <p>{stats.totalFaculty}</p>
            </div>
            <div className="stat-card">
              <h3>Active Sessions</h3>
              <p>{stats.activeSessions}</p>
            </div>
            <div className="stat-card">
              <h3>Urgent Alerts</h3>
              <p>{stats.urgentAlerts}</p>
            </div>
          </div>
        </section>

        {/* 2. Faculty Management */}
        <section id="faculty-management">
          <h2>Faculty Management</h2>
          <div className="add-faculty-form">
            <input
              type="text"
              placeholder="Name"
              value={newFaculty.name}
              onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newFaculty.email}
              onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={newFaculty.password}
              onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })}
            />
            <button className="btn btn-green" onClick={handleAddFaculty}>
              Add Faculty
            </button>
          </div>
          <table className="faculty-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Assigned Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facultyList.map((faculty) => (
                <tr key={faculty.id}>
                  <td>{faculty.name}</td>
                  <td>{faculty.email}</td>
                  <td>{faculty.assignedStudents}</td>
                  <td>
                    <button className="btn btn-blue">Edit</button>
                    <button
                      className="btn btn-red"
                      onClick={() => handleRemoveFaculty(faculty.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 3. Student Management */}
        <section id="student-management">
          <h2>Student Management</h2>
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Critical">Critical</option>
            </select>
            <input
              type="text"
              placeholder="Filter by Major"
              value={filterMajor}
              onChange={(e) => setFilterMajor(e.target.value)}
            />
          </div>
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Major</th>
                <th>Year</th>
                <th>Status</th>
                <th>GPA</th>
                <th>Assigned Faculty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.major}</td>
                  <td>{student.year}</td>
                  <td>
                    <span className={`status ${student.status.toLowerCase().replace(" ", "-")}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>{student.gpa}</td>
                  <td>{student.facultyName}</td>
                  <td>
                    <select
                      onChange={(e) => handleReassignStudent(student.id, e.target.value)}
                    >
                      <option value="">Select Faculty</option>
                      {facultyList.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 4. Counseling Session Oversight */}
        <section id="counseling-sessions">
          <h2>Counseling Sessions</h2>
          <table className="session-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Faculty</th>
                <th>Student</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.date}</td>
                  <td>{session.title}</td>
                  <td>{session.facultyName}</td>
                  <td>{session.studentName}</td>
                  <td>{session.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 5. Resource Library Management */}
        <section id="resource-library">
          <h2>Resource Library</h2>
          <div className="resource-form">
            <input type="text" placeholder="Resource Name" />
            <input type="file" />
            <button className="btn btn-green">Upload Resource</button>
          </div>
          <table className="resource-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td>{resource.name}</td>
                  <td><a href={resource.url} target="_blank" rel="noopener noreferrer">View</a></td>
                  <td>
                    <button className="btn btn-blue">Edit</button>
                    <button className="btn btn-red">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 6. System-Wide Announcements */}
        <section id="announcements">
          <h2>Announcements</h2>
          <div className="announcement-form">
            <textarea
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              placeholder="Type your announcement..."
            />
            <button className="btn btn-green" onClick={handleAddAnnouncement}>
              Publish Announcement
            </button>
          </div>
          <ul>
            {announcements.map((announcement) => (
              <li key={announcement._id}>
                {announcement.text} (Created: {new Date(announcement.createdAt).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </section>

        {/* 7. Analytics and Reports */}
        <section id="analytics">
          <h2>Analytics</h2>
          <div className="analytics-card">
            <p>{analytics.studentProgress}% of students improved grades after counseling.</p>
            <button className="btn btn-gray">Download Faculty Performance Report</button>
            <button className="btn btn-gray">Download Student Progress Report</button>
          </div>
        </section>

        {/* 8. User Activity Logs */}
        <section id="activity-logs">
          <h2>Activity Logs</h2>
          <table className="activity-log-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;