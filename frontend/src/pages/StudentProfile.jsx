import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StudentProfile = () => {
  const { regdNo } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        const response = await axios.get(
          `http://localhost:5000/api/students/search?query=${encodeURIComponent(regdNo)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.length === 0) {
          throw new Error("Student not found");
        }

        // Take the first result (REGD.NO should be unique)
        setStudent(response.data[0]);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [regdNo]);

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  // Extract subject fields (all fields except REGD.NO, NAME, TOTAL%, PhoneNumber, ParentNumber)
  const subjectFields = Object.keys(student).filter(
    (key) =>
      ![
        "REGD.NO",
        "NAME",
        "TOTAL%",
        "PhoneNumber",
        "ParentNumber",
      ].includes(key)
  );

  return (
    <div style={styles.container}>
      <div style={styles.profileBox}>
        <h2 style={styles.heading}>Student Profile</h2>
        <div style={styles.detailsContainer}>
          <p style={styles.detailItem}>
            <strong>Name:</strong> {student.NAME}
          </p>
          <p style={styles.detailItem}>
            <strong>Registration No:</strong> {student["REGD.NO"]}
          </p>
          <p style={styles.detailItem}>
            <strong>Phone Number:</strong> {student.PhoneNumber}
          </p>
          <p style={styles.detailItem}>
            <strong>Parent's Number:</strong> {student.ParentNumber}
          </p>
          <p style={styles.detailItem}>
            <strong>Total Percentage:</strong> {student["TOTAL%"]}%
          </p>
        </div>
        <h3 style={styles.subjectHeading}>Subjects:</h3>
        <ul style={styles.subjectList}>
          {subjectFields.map((subject) => (
            <li key={subject} style={styles.subjectItem}>
              <strong>{subject}:</strong> {student[subject]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundImage: "url('https://source.unsplash.com/1600x900/?education,students')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "20px",
    overflowY: "auto",
    scrollBehavior: "smooth",
  },
  profileBox: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.4)",
    maxWidth: "90%",
    width: "800px",
    textAlign: "center",
    transition: "all 0.3s ease",
    animation: "fadeIn 0.5s ease-in-out",
  },
  heading: {
    fontSize: "34px",
    fontWeight: "bold",
    color: "#222",
    marginBottom: "20px",
    position: "sticky",
    top: "0",
    background: "rgba(255, 255, 255, 0.9)",
    padding: "15px",
    zIndex: "1000",
    width: "100%",
    borderRadius: "10px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
  },
  detailsContainer: {
    textAlign: "left",
    fontSize: "18px",
    marginBottom: "20px",
    lineHeight: "1.8",
    background: "#f4f4f4",
    padding: "20px",
    borderRadius: "10px",
  },
  detailItem: {
    background: "#eaeaea",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    fontSize: "16px",
    fontWeight: "500",
  },
  subjectHeading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "20px",
    textAlign: "center",
  },
  subjectList: {
    listStyleType: "none",
    padding: "0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },
  subjectItem: {
    background: "#d1ecf1",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "16px",
    textAlign: "center",
    transition: "all 0.3s ease",
    fontWeight: "bold",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
  },
  subjectItemHover: {
    transform: "scale(1.05)",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
  },
  loading: {
    fontSize: "22px",
    color: "#555",
    textAlign: "center",
  },
  error: {
    fontSize: "22px",
    color: "red",
    textAlign: "center",
  },
};

// Global styles for smooth scrolling
const globalStyle = `
  html {
    scroll-behavior: smooth;
  }
  .subjectItem:hover {
    transform: scale(1.05);
    boxShadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

// Inject global styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = globalStyle;
document.head.appendChild(styleSheet);

export default StudentProfile;