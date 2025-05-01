
// import { useState, useEffect } from 'react';
// import { Navbar, Nav, Container, Dropdown, Button, Table, Form, Card, Col, Row, Spinner, Alert } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../styles/facultydashboard.css';

// function FacultyDashboard() {
//   const [students, setStudents] = useState([]);
//   const [sessions, setSessions] = useState([]);
//   const [notes, setNotes] = useState({ sessionId: '', content: '', followUpDate: '' });
//   const [resources, setResources] = useState([]);
//   const [calendarDate, setCalendarDate] = useState(new Date());
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [sessionForm, setSessionForm] = useState({ studentId: '', date: '', mode: 'offline', notes: '', sessionId: '' });
//   const [file, setFile] = useState(null);
//   const [defaulters, setDefaulters] = useState([]);
//   const [activeSection, setActiveSection] = useState('dashboard-overview');
//   const ATTENDANCE_THRESHOLD = 75; // 75% attendance

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [studentsRes, sessionsRes, resourcesRes] = await Promise.all([
//           axios.get('/api/faculty/students'),
//           axios.get('/api/faculty/sessions'),
//           axios.get('/api/faculty/resources'),
//         ]);
//         const studentsData = studentsRes.data || [];
//         setStudents(studentsData);
//         setSessions(sessionsRes.data || []);
//         setResources(resourcesRes.data || []);
//         // Calculate defaulters
//         const defaultersList = studentsData
//           .filter(student => student.attendance < ATTENDANCE_THRESHOLD && student.user?.phoneNumber);
//         setDefaulters(defaultersList);
//         setError('');
//       } catch (err) {
//         setError('Failed to fetch data. Please check the backend.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleSessionInput = (e) => {
//     setSessionForm({ ...sessionForm, [e.target.name]: e.target.value });
//   };

//   const addSession = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/faculty/sessions', sessionForm);
//       setSessionForm({ studentId: '', date: '', mode: 'offline', notes: '', sessionId: '' });
//       const sessionsRes = await axios.get('/api/faculty/sessions');
//       setSessions(sessionsRes.data || []);
//     } catch (err) {
//       setError('Failed to add session');
//     }
//   };

//   const handleNotesInput = (e) => {
//     setNotes({ ...notes, [e.target.name]: e.target.value });
//   };

//   const addNotes = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/faculty/notes', notes);
//       setNotes({ sessionId: '', content: '', followUpDate: '' });
//     } catch (err) {
//       setError('Failed to add notes');
//     }
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const uploadResource = async (e) => {
//     e.preventDefault();
//     if (!file || !sessionForm.sessionId) {
//       setError('Please select a file and session ID');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('sessionId', sessionForm.sessionId);
//     try {
//       await axios.post('/api/faculty/resources', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setFile(null);
//       setSessionForm({ ...sessionForm, sessionId: '' });
//       const resourcesRes = await axios.get('/api/faculty/resources');
//       setResources(resourcesRes.data || []);
//     } catch (err) {
//       setError('Failed to upload resource');
//     }
//   };

//   const sendDefaulterNotifications = async () => {
//     try {
//       await Promise.all(
//         defaulters.map(student =>
//           axios.post('/api/faculty/notifications/sms', {
//             studentId: student._id,
//             phoneNumber: student.user.phoneNumber,
//             message: `Dear ${student.user.name}, your attendance is below ${ATTENDANCE_THRESHOLD}%. Please attend upcoming sessions.`,
//           })
//         )
//       );
//       setError('');
//       alert('SMS notifications sent to defaulters');
//     } catch (err) {
//       setError('Failed to send SMS notifications');
//       console.error(err);
//     }
//   };

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text('Counselling Report', 10, 10);
//     let yOffset = 20;
//     sessions.forEach((session, index) => {
//       doc.text(`Session ${index + 1}: ${session.studentId} - ${session.date} - ${session.notes || 'No notes'}`, 10, yOffset);
//       yOffset += 10;
//     });
//     doc.text('Attendance Defaulters:', 10, yOffset);
//     yOffset += 10;
//     defaulters.forEach((student, index) => {
//       doc.text(`Student ${index + 1}: ${student.user.name} (${student.regNo}) - ${Math.round(student.attendance)}%`, 10, yOffset);
//       yOffset += 10;
//     });
//     doc.save('counselling_report.pdf');
//   };

//   const markAttendance = async (studentId, sessionId, status) => {
//     try {
//       await axios.post('/api/faculty/attendance', { studentId, sessionId, status });
//       const studentsRes = await axios.get('/api/faculty/students');
//       const studentsData = studentsRes.data || [];
//       const updatedDefaulters = studentsData
//         .filter(student => student.attendance < ATTENDANCE_THRESHOLD && student.user?.phoneNumber);
//       setStudents(studentsData);
//       setDefaulters(updatedDefaulters);
//     } catch (err) {
//       setError('Failed to mark attendance');
//     }
//   };

//   const scrollToSection = (sectionId) => {
//     setActiveSection(sectionId);
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Loading...</p>
//       </Container>
//     );
//   }

//   return (
//     <div className="dashboard">
//       <Navbar bg="primary" variant="dark" expand="lg">
//         <Container>
//           <Navbar.Brand as={Link} to="/">Counselling System</Navbar.Brand>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="me-auto">
//               <Nav.Link as={Link} to="/search">Search Students</Nav.Link>
//             </Nav>
//             <Nav>
//               <Nav.Item className="faculty-info">Faculty: John Doe (ID: F123)</Nav.Item>
//               <Dropdown>
//                 <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
//                   Settings
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   <Dropdown.Item href="#">Change Password</Dropdown.Item>
//                   <Dropdown.Item href="#">Logout</Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       <div className="dashboard-content">
//         <div className="sidebar">
//           <Nav className="flex-column">
//             <Nav.Link
//               className={activeSection === 'dashboard-overview' ? 'active' : ''}
//               onClick={() => scrollToSection('dashboard-overview')}
//             >
//               Dashboard Overview
//             </Nav.Link>
//             <Nav.Link
//               className={activeSection === 'my-students' ? 'active' : ''}
//               onClick={() => scrollToSection('my-students')}
//             >
//               My Students
//             </Nav.Link>
//             <Nav.Link
//               className={activeSection === 'attendance-defaulters' ? 'active' : ''}
//               onClick={() => scrollToSection('attendance-defaulters')}
//             >
//               Attendance Defaulters
//             </Nav.Link>
//             <Nav.Link
//               className={activeSection === 'counseling-sessions' ? 'active' : ''}
//               onClick={() => scrollToSection('counseling-sessions')}
//             >
//               Counseling Sessions
//             </Nav.Link>
//             <Nav.Link
//               className={activeSection === 'notes-reports' ? 'active' : ''}
//               onClick={() => scrollToSection('notes-reports')}
//             >
//               Notes & Reports
//             </Nav.Link>
//             <Nav.Link
//               className={activeSection === 'upload-resources' ? 'active' : ''}
//               onClick={() => scrollToSection('upload-resources')}
//             >
//               Upload Resources
//             </Nav.Link>
//             <Nav.Link
//               className={activeSection === 'attendance-tracker' ? 'active' : ''}
//               onClick={() => scrollToSection('attendance-tracker')}
//             >
//               Attendance Tracker
//             </Nav.Link>
//             <Nav.Link
//               className={activeSection === 'messages' ? 'active' : ''}
//               onClick={() => scrollToSection('messages')}
//             >
//               Messages/Alerts
//             </Nav.Link>
//             <Nav.Link
//               className={activeSection === 'settings' ? 'active' : ''}
//               onClick={() => scrollToSection('settings')}
//             >
//               Settings
//             </Nav.Link>
//           </Nav>
//         </div>

//         <div className="main-content">
//           {error && <Alert variant="danger">{error}</Alert>}

//           <div id="dashboard-overview" className="section">
//             <h2>Dashboard Overview</h2>
//             <Row className="mb-4">
//               <Col md={3}>
//                 <Card>
//                   <Card.Body>
//                     <Card.Title>Total Students</Card.Title>
//                     <Card.Text>{students.length}</Card.Text>
//                   </Card.Body>
//                 </Card>
//               </Col>
//               <Col md={3}>
//                 <Card>
//                   <Card.Body>
//                     <Card.Title>Upcoming Sessions</Card.Title>
//                     <Card.Text>
//                       {sessions.filter(s => new Date(s.date) >= new Date()).length}
//                     </Card.Text>
//                   </Card.Body>
//                 </Card>
//               </Col>
//               <Col md={3}>
//                 <Card>
//                   <Card.Body>
//                     <Card.Title>Notes Pending</Card.Title>
//                     <Card.Text>0</Card.Text>
//                   </Card.Body>
//                 </Card>
//               </Col>
//               <Col md={3}>
//                 <Card>
//                   <Card.Body>
//                     <Card.Title>Issues Raised</Card.Title>
//                     <Card.Text>0</Card.Text>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>
//           </div>

//           <div id="my-students" className="section">
//             <h2>My Students</h2>
//             {students.length > 0 ? (
//               <Table striped bordered hover>
//                 <thead>
//                   <tr>
//                     <th>Reg No</th>
//                     <th>Name</th>
//                     <th>Contact</th>
//                     <th>Department</th>
//                     <th>Year</th>
//                     <th>Major</th>
//                     <th>GPA</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.map(student => (
//                     <tr key={student._id}>
//                       <td>{student.regNo || 'N/A'}</td>
//                       <td>{student.user?.name || 'N/A'}</td>
//                       <td>{student.user?.phoneNumber || 'N/A'}</td>
//                       <td>{student.department || 'N/A'}</td>
//                       <td>{student.year || 'N/A'}</td>
//                       <td>{student.major || 'N/A'}</td>
//                       <td>{student.gpa.toFixed(2)}</td>
//                       <td>{student.status}</td>
//                       <td>
//                         <Button variant="info" size="sm" className="me-2">View History</Button>
//                         <Button
//                           variant="primary"
//                           size="sm"
//                           className="me-2"
//                           onClick={() => setSessionForm({ ...sessionForm, studentId: student._id })}
//                         >
//                           Schedule
//                         </Button>
//                         <Button variant="success" size="sm">Message</Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             ) : (
//               <p>No students found.</p>
//             )}
//           </div>

//           <div id="attendance-defaulters" className="section">
//             <h2>Attendance Defaulters</h2>
//             {defaulters.length > 0 ? (
//               <>
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Reg No</th>
//                       <th>Name</th>
//                       <th>Contact</th>
//                       <th>Attendance (%)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {defaulters.map(student => (
//                       <tr key={student._id}>
//                         <td>{student.regNo}</td>
//                         <td>{student.user?.name}</td>
//                         <td>{student.user?.phoneNumber}</td>
//                         <td>{Math.round(student.attendance)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//                 <Button variant="warning" onClick={sendDefaulterNotifications}>
//                   Send SMS to Defaulters
//                 </Button>
//               </>
//             ) : (
//               <p>No defaulters found.</p>
//             )}
//           </div>

//           <div id="counseling-sessions" className="section">
//             <h2>Counseling Sessions</h2>
//             <Calendar onChange={setCalendarDate} value={calendarDate} />
//             <Form onSubmit={addSession} className="mt-3">
//               <Form.Group className="mb-3">
//                 <Form.Label>Student ID</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="studentId"
//                   value={sessionForm.studentId}
//                   onChange={handleSessionInput}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   name="date"
//                   value={sessionForm.date}
//                   onChange={handleSessionInput}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Mode</Form.Label>
//                 <Form.Select name="mode" value={sessionForm.mode} onChange={handleSessionInput}>
//                   <option value="offline">Offline</option>
//                   <option value="online">Online</option>
//                 </Form.Select>
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Notes</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   name="notes"
//                   value={sessionForm.notes}
//                   onChange={handleSessionInput}
//                   rows={3}
//                 />
//               </Form.Group>
//               <Button type="submit" variant="primary">Add Session</Button>
//             </Form>
//           </div>

//           <div id="notes-reports" className="section">
//             <h2>Session Notes & Reports</h2>
//             <Form onSubmit={addNotes}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Session ID</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="sessionId"
//                   value={notes.sessionId}
//                   onChange={handleNotesInput}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group className=".mb-3">
//                 <Form.Label>Notes</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   name="content"
//                   value={notes.content}
//                   onChange={handleNotesInput}
//                   rows={4}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Follow-Up Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   name="followUpDate"
//                   value={notes.followUpDate}
//                   onChange={handleNotesInput}
//                 />
//               </Form.Group>
//               <Button type="submit" variant="primary" className="me-2">Save Notes</Button>
//               <Button variant="success" onClick={generatePDF}>Generate PDF</Button>
//             </Form>
//           </div>

//           <div id="upload-resources" className="section">
//             <h2>Upload Resources</h2>
//             <Form onSubmit={uploadResource}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Session ID</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="sessionId"
//                   value={sessionForm.sessionId}
//                   onChange={e => setSessionForm({ ...sessionForm, sessionId: e.target.value })}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Resource File</Form.Label>
//                 <Form.Control type="file" onChange={handleFileChange} required />
//               </Form.Group>
//               <Button type="submit" variant="primary">Upload Resource</Button>
//             </Form>
//             {resources.length > 0 && (
//               <>
//                 <h3 className="mt-4">Uploaded Resources</h3>
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>File Name</th>
//                       <th>Session ID</th>
//                       <th>Uploaded At</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {resources.map(resource => (
//                       <tr key={resource._id}>
//                         <td>{resource.fileName}</td>
//                         <td>{resource.sessionId}</td>
//                         <td>{new Date(resource.uploadedAt).toLocaleDateString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </>
//             )}
//           </div>

//           <div id="attendance-tracker" className="section">
//             <h2>Attendance Tracker</h2>
//             {sessions.length > 0 ? (
//               <Table striped bordered hover>
//                 <thead>
//                   <tr>
//                     <th>Student</th>
//                     <th>Session Date</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sessions.map(session => (
//                     <tr key={session._id}>
//                       <td>{session.studentId}</td>
//                       <td>{session.date ? session.date.split('T')[0] : 'N/A'}</td>
//                       <td>
//                         <Button
//                           variant="outline-primary"
//                           size="sm"
//                           onClick={() => markAttendance(session.studentId, session._id, 'present')}
//                         >
//                           Present
//                         </Button>
//                         <Button
//                           variant="outline-danger"
//                           size="sm"
//                           onClick={() => markAttendance(session.studentId, session._id, 'absent')}
//                         >
//                           Absent
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             ) : (
//               <p>No sessions found.</p>
//             )}
//           </div>

//           <div id="messages" className="section">
//             <h2>Messages/Alerts</h2>
//             <p>Placeholder for messages and alerts functionality.</p>
//           </div>

//           <div id="settings" className="section">
//             <h2>Settings</h2>
//             <p>Placeholder for settings functionality.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FacultyDashboard;

import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown, Button, Table, Form, Card, Col, Row, Spinner, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/facultydashboard.css';

function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [notes, setNotes] = useState({ sessionId: '', content: '', followUpDate: '' });
  const [resources, setResources] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionForm, setSessionForm] = useState({ studentId: '', date: '', mode: 'offline', notes: '', sessionId: '' });
  const [file, setFile] = useState(null);
  const [defaulters, setDefaulters] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard-overview');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSessions, setStudentSessions] = useState([]);
  const [messageForm, setMessageForm] = useState({ studentId: '', phoneNumber: '', message: '' });
  const ATTENDANCE_THRESHOLD = 75; // 75% attendance

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, sessionsRes, resourcesRes] = await Promise.all([
          axios.get('/api/faculty/students'),
          axios.get('/api/faculty/sessions'),
          axios.get('/api/faculty/resources'),
        ]);
        const studentsData = studentsRes.data || [];
        setStudents(studentsData);
        setSessions(sessionsRes.data || []);
        setResources(resourcesRes.data || []);
        // Calculate defaulters
        const defaultersList = studentsData
          .filter(student => student.attendance < ATTENDANCE_THRESHOLD && student.user?.phoneNumber);
        setDefaulters(defaultersList);
        setError('');
      } catch (err) {
        setError('Failed to fetch data. Please check the backend.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSessionInput = (e) => {
    setSessionForm({ ...sessionForm, [e.target.name]: e.target.value });
  };

  const addSession = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/faculty/sessions', sessionForm);
      setSessionForm({ studentId: '', date: '', mode: 'offline', notes: '', sessionId: '' });
      const sessionsRes = await axios.get('/api/faculty/sessions');
      setSessions(sessionsRes.data || []);
      setModalMessage('Session added successfully');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      setError('');
    } catch (err) {
      setError('Failed to add session');
    }
  };

  const handleNotesInput = (e) => {
    setNotes({ ...notes, [e.target.name]: e.target.value });
  };

  const addNotes = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/faculty/notes', notes);
      setNotes({ sessionId: '', content: '', followUpDate: '' });
      setModalMessage('Notes saved successfully');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      setError('');
    } catch (err) {
      setError('Failed to add notes');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadResource = async (e) => {
    e.preventDefault();
    if (!file || !sessionForm.sessionId) {
      setError('Please select a file and session ID');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', sessionForm.sessionId);
    try {
      await axios.post('/api/faculty/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      setSessionForm({ ...sessionForm, sessionId: '' });
      const resourcesRes = await axios.get('/api/faculty/resources');
      setResources(resourcesRes.data || []);
      setModalMessage('Resource uploaded successfully');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      setError('');
    } catch (err) {
      setError('Failed to upload resource');
    }
  };

  const sendDefaulterNotifications = async () => {
    try {
      await Promise.all(
        defaulters.map(student =>
          axios.post('/api/faculty/notifications/sms', {
            studentId: student._id,
            phoneNumber: student.user.phoneNumber,
            message: `Dear ${student.user.name}, your attendance is below ${ATTENDANCE_THRESHOLD}%. Please attend upcoming sessions.`,
          })
        )
      );
      setModalMessage('SMS notifications sent successfully');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      setError('');
    } catch (err) {
      setError('Failed to send SMS notifications');
      console.error(err);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Counselling Report', 10, 10);
    let yOffset = 20;
    sessions.forEach((session, index) => {
      doc.text(`Session ${index + 1}: ${session.studentId} - ${session.date} - ${session.notes || 'No notes'}`, 10, yOffset);
      yOffset += 10;
    });
    doc.text('Attendance Defaulters:', 10, yOffset);
    yOffset += 10;
    defaulters.forEach((student, index) => {
      doc.text(`Student ${index + 1}: ${student.user.name} (${student.regNo}) - ${Math.round(student.attendance)}%`, 10, yOffset);
      yOffset += 10;
    });
    doc.save('counselling_report.pdf');
    setModalMessage('PDF generated successfully');
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000);
  };

  const markAttendance = async (studentId, sessionId, status) => {
    try {
      await axios.post('/api/faculty/attendance', { studentId, sessionId, status });
      const studentsRes = await axios.get('/api/faculty/students');
      const studentsData = studentsRes.data || [];
      const updatedDefaulters = studentsData
        .filter(student => student.attendance < ATTENDANCE_THRESHOLD && student.user?.phoneNumber);
      setStudents(studentsData);
      setDefaulters(updatedDefaulters);
      setModalMessage(`Attendance marked as ${status} successfully`);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      setError('');
    } catch (err) {
      setError('Failed to mark attendance');
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const viewStudentHistory = (student) => {
    setSelectedStudent(student);
    // Filter sessions for the selected student
    const filteredSessions = sessions.filter(session => session.studentId === student._id);
    setStudentSessions(filteredSessions);
    setShowHistoryModal(true);
  };

  const handleMessageInput = (e) => {
    setMessageForm({ ...messageForm, [e.target.name]: e.target.value });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/faculty/notifications/sms', messageForm);
      setMessageForm({ studentId: '', phoneNumber: '', message: '' });
      setModalMessage('SMS sent successfully');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      setError('');
    } catch (err) {
      setError('Failed to send SMS');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <div className="dashboard">
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Counselling System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/search">Search Students</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Item className="faculty-info">Faculty: John Doe (ID: F123)</Nav.Item>
              <Dropdown>
                <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                  Settings
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#">Change Password</Dropdown.Item>
                  <Nav.Link as={Link} to="/login">Logout</Nav.Link>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center">{modalMessage}</Modal.Body>
      </Modal>

      <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Student History: {selectedStudent?.user?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <>
              <h5>Student Details</h5>
              <Table striped bordered>
                <tbody>
                  <tr>
                    <td><strong>Registration No</strong></td>
                    <td>{selectedStudent.regNo || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Name</strong></td>
                    <td>{selectedStudent.user?.name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Contact</strong></td>
                    <td>{selectedStudent.user?.phoneNumber || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Department</strong></td>
                    <td>{selectedStudent.department || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Year</strong></td>
                    <td>{selectedStudent.year || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Major</strong></td>
                    <td>{selectedStudent.major || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>GPA</strong></td>
                    <td>{selectedStudent.gpa.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td><strong>Attendance</strong></td>
                    <td>{Math.round(selectedStudent.attendance)}%</td>
                  </tr>
                  <tr>
                    <td><strong>Status</strong></td>
                    <td>{selectedStudent.status}</td>
                  </tr>
                </tbody>
              </Table>

              <h5>Counseling Sessions</h5>
              {studentSessions.length > 0 ? (
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Mode</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentSessions.map(session => (
                      <tr key={session._id}>
                        <td>{session.date ? session.date.split('T')[0] : 'N/A'}</td>
                        <td>{session.mode || 'N/A'}</td>
                        <td>{session.notes || 'No notes'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No counseling sessions found.</p>
              )}

              <h5>Session Notes</h5>
              {selectedStudent.sessionNotes?.length > 0 ? (
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Content</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.sessionNotes.map((note, index) => (
                      <tr key={index}>
                        <td>{note.date ? new Date(note.date).toLocaleDateString() : 'N/A'}</td>
                        <td>{note.content || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No session notes found.</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="dashboard-content">
        <div className="sidebar">
          <Nav className="flex-column">
            <Nav.Link
              className={activeSection === 'dashboard-overview' ? 'active' : ''}
              onClick={() => scrollToSection('dashboard-overview')}
            >
              Dashboard Overview
            </Nav.Link>
            <Nav.Link
              className={activeSection === 'my-students' ? 'active' : ''}
              onClick={() => scrollToSection('my-students')}
            >
              My Students
            </Nav.Link>
            <Nav.Link
              className={activeSection === 'attendance-defaulters' ? 'active' : ''}
              onClick={() => scrollToSection('attendance-defaulters')}
            >
              Attendance Defaulters
            </Nav.Link>
            <Nav.Link
              className={activeSection === 'counseling-sessions' ? 'active' : ''}
              onClick={() => scrollToSection('counseling-sessions')}
            >
              Counseling Sessions
            </Nav.Link>
            <Nav.Link
              className={activeSection === 'notes-reports' ? 'active' : ''}
              onClick={() => scrollToSection('notes-reports')}
            >
              Notes & Reports
            </Nav.Link>
            <Nav.Link
              className={activeSection === 'upload-resources' ? 'active' : ''}
              onClick={() => scrollToSection('upload-resources')}
            >
              Upload Resources
            </Nav.Link>
            <Nav.Link
              className={activeSection === 'attendance-tracker' ? 'active' : ''}
              onClick={() => scrollToSection('attendance-tracker')}
            >
              Attendance Tracker
            </Nav.Link>
            <Nav.Link
              className={activeSection === 'messages' ? 'active' : ''}
              onClick={() => scrollToSection('messages')}
            >
              Messages/Alerts
            </Nav.Link>
            <Nav.Link
              className={activeSection === 'settings' ? 'active' : ''}
              onClick={() => scrollToSection('settings')}
            >
              Settings
            </Nav.Link>
          </Nav>
        </div>

        <div className="main-content">
          {error && <Alert variant="danger">{error}</Alert>}

          <div id="dashboard-overview" className="section">
            <h2>Dashboard Overview</h2>
            <Row className="mb-4">
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Total Students</Card.Title>
                    <Card.Text>{students.length}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Upcoming Sessions</Card.Title>
                    <Card.Text>
                      {sessions.filter(s => new Date(s.date) >= new Date()).length}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Notes Pending</Card.Title>
                    <Card.Text>0</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Issues Raised</Card.Title>
                    <Card.Text>0</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          <div id="my-students" className="section">
            <h2>My Students</h2>
            {students.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Reg No</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>Major</th>
                    <th>GPA</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student._id}>
                      <td>{student.regNo || 'N/A'}</td>
                      <td>{student.user?.name || 'N/A'}</td>
                      <td>{student.user?.phoneNumber || 'N/A'}</td>
                      <td>{student.department || 'N/A'}</td>
                      <td>{student.year || 'N/A'}</td>
                      <td>{student.major || 'N/A'}</td>
                      <td>{student.gpa.toFixed(2)}</td>
                      <td>{student.status}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => viewStudentHistory(student)}
                        >
                          View History
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setSessionForm({ ...sessionForm, studentId: student._id });
                            scrollToSection('counseling-sessions');
                          }}
                        >
                          Schedule
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => {
                            setMessageForm({
                              studentId: student._id,
                              phoneNumber: student.user?.phoneNumber || '',
                              message: '',
                            });
                            scrollToSection('messages');
                          }}
                        >
                          Message
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No students found.</p>
            )}
          </div>

          <div id="attendance-defaulters" className="section">
            <h2>Attendance Defaulters</h2>
            {defaulters.length > 0 ? (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Reg No</th>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Attendance (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defaulters.map(student => (
                      <tr key={student._id}>
                        <td>{student.regNo}</td>
                        <td>{student.user?.name}</td>
                        <td>{student.user?.phoneNumber}</td>
                        <td>{Math.round(student.attendance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button variant="warning" onClick={sendDefaulterNotifications}>
                  Send SMS to Defaulters
                </Button>
              </>
            ) : (
              <p>No defaulters found.</p>
            )}
          </div>

          <div id="counseling-sessions" className="section">
            <h2>Counseling Sessions</h2>
            <Calendar onChange={setCalendarDate} value={calendarDate} />
            <Form onSubmit={addSession} className="mt-3">
              <Form.Group className="mb-3">
                <Form.Label>Student ID</Form.Label>
                <Form.Control
                  type="text"
                  name="studentId"
                  value={sessionForm.studentId}
                  onChange={handleSessionInput}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={sessionForm.date}
                  onChange={handleSessionInput}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mode</Form.Label>
                <Form.Select name="mode" value={sessionForm.mode} onChange={handleSessionInput}>
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  value={sessionForm.notes}
                  onChange={handleSessionInput}
                  rows={3}
                />
              </Form.Group>
              <Button type="submit" variant="primary">Add Session</Button>
            </Form>
          </div>

          <div id="notes-reports" className="section">
            <h2>Session Notes & Reports</h2>
            <Form onSubmit={addNotes}>
              <Form.Group className="mb-3">
                <Form.Label>Session ID</Form.Label>
                <Form.Control
                  type="text"
                  name="sessionId"
                  value={notes.sessionId}
                  onChange={handleNotesInput}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  name="content"
                  value={notes.content}
                  onChange={handleNotesInput}
                  rows={4}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Follow-Up Date</Form.Label>
                <Form.Control
                  type="date"
                  name="followUpDate"
                  value={notes.followUpDate}
                  onChange={handleNotesInput}
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="me-2">Save Notes</Button>
              <Button variant="success" onClick={generatePDF}>Generate PDF</Button>
            </Form>
          </div>

          <div id="upload-resources" className="section">
            <h2>Upload Resources</h2>
            <Form onSubmit={uploadResource}>
              <Form.Group className="mb-3">
                <Form.Label>Session ID</Form.Label>
                <Form.Control
                  type="text"
                  name="sessionId"
                  value={sessionForm.sessionId}
                  onChange={e => setSessionForm({ ...sessionForm, sessionId: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Resource File</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} required />
              </Form.Group>
              <Button type="submit" variant="primary">Upload Resource</Button>
            </Form>
            {resources.length > 0 && (
              <>
                <h3 className="mt-4">Uploaded Resources</h3>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Session ID</th>
                      <th>Uploaded At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map(resource => (
                      <tr key={resource._id}>
                        <td>{resource.fileName}</td>
                        <td>{resource.sessionId}</td>
                        <td>{new Date(resource.uploadedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </div>

          <div id="attendance-tracker" className="section">
            <h2>Attendance Tracker</h2>
            {sessions.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Session Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(session => (
                    <tr key={session._id}>
                      <td>{session.studentId}</td>
                      <td>{session.date ? session.date.split('T')[0] : 'N/A'}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => markAttendance(session.studentId, session._id, 'present')}
                        >
                          Present
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => markAttendance(session.studentId, session._id, 'absent')}
                        >
                          Absent
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No sessions found.</p>
            )}
          </div>

          <div id="messages" className="section">
            <h2>Messages/Alerts</h2>
            <Form onSubmit={sendMessage}>
              <Form.Group className="mb-3">
                <Form.Label>Student ID</Form.Label>
                <Form.Control
                  type="text"
                  name="studentId"
                  value={messageForm.studentId}
                  onChange={handleMessageInput}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={messageForm.phoneNumber}
                  onChange={handleMessageInput}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  value={messageForm.message}
                  onChange={handleMessageInput}
                  rows={4}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary">Send SMS</Button>
            </Form>
          </div>

          <div id="settings" className="section">
            <h2>Settings</h2>
            <p>Placeholder for settings functionality.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;







