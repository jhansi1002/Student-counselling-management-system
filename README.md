🎓 Student Counseling Management System A web-based application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) to streamline and digitize the student counseling process at VFSTR. This system provides dedicated dashboards for Students, Faculty Counselors, and Admins with secure login and efficient student data management.
---
🔍 Overview The Student Counseling Management System is designed to help faculty manage counseling sessions, monitor student progress, track attendance, and facilitate better student support. It provides a centralized platform to maintain records and communication between students and faculty.
---
🚀 Features 🔐 Authentication

Secure login for Students, Faculty, and Admins

Role-based dashboard access

🧑‍🎓 Student Dashboard

View personal details

Track attendance and counseling status

Submit feedback or queries

👩‍🏫 Faculty Dashboard

View list of assigned students

Record counseling session details

Mark attendance and progress

Search student records

🛠 Admin Dashboard

Manage faculty and student data

Oversee counseling performance

Handle user access and permissions

🛠 Tech Stack MongoDB – NoSQL database to store student and session records

Express.js – Backend framework to build RESTful APIs

React.js – Frontend library for dynamic UI

Node.js – JavaScript runtime for server-side logic

Bootstrap / CSS – For responsive and clean UI
---
📁 Folder Structure /backend ├── models/ ├── routes/ └── controllers/

/frontend ├── src/ │ ├── components/ │ ├── pages/ │ └── App.jsx

.env package.json
---
🧑‍💻 Setup Instructions Clone the repository:
```bash
git clone https://github.com/jhansi1002/Student-counselling-management-system.git

Navigate into the project folder:

cd Student-counselling-management-system

Install Backend Dependencies:

cd backend
npm install

Install Frontend Dependencies:

cd ../frontend
npm install

Set up .env file Add MongoDB URI, PORT, and any necessary secrets.

Run the app:- Backend: npm start

Frontend: npm run dev
