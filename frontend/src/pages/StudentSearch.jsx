import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const StudentSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a name or registration number");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await axios.get(
        `http://localhost:5000/api/students/search?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.length === 0) {
        setError("No students found matching the query");
      } else {
        setResults(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (regdNo) => {
    navigate(`/student-profile/${regdNo}`);
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navItems}>
          <button onClick={() => navigate("/faculty-dashboard")} style={styles.navButton}>
            Dashboard
          </button>
          <button onClick={() => navigate("/faculty-dashboard")} style={styles.navButtonLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Search Box */}
      <div style={styles.searchBox}>
        <h2 style={styles.heading}>Search Student</h2>
        <form onSubmit={handleSearch} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Enter NAME or REGD.NO"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={styles.input}
              disabled={loading}
            />
            <button type="submit" style={styles.button} disabled={loading}>
              <FaSearch style={styles.icon} /> {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        {results.length > 0 && (
          <div style={styles.resultsContainer}>
            <h3 style={styles.resultsHeading}>Search Results</h3>
            <ul style={styles.resultsList}>
              {results.map((student) => (
                <li
                  key={student["REGD.NO"]}
                  style={styles.resultItem}
                  onClick={() => handleResultClick(student["REGD.NO"])}
                >
                  <p>
                    <strong>{student.NAME}</strong> ({student["REGD.NO"]})
                  </p>
                  <p>Total: {student["TOTAL%"]}%</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/src/Images/studentsSearch.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  navbar: {
    position: "fixed",
    top: "0",
    right: "0",
    width: "100%",
    background: "rgba(0, 0, 0, 0.9)",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    zIndex: "1000",
  },
  navItems: {
    display: "flex",
    gap: "10px",
  },
  navButton: {
    padding: "10px 15px",
    border: "none",
    background: "#007bff",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "0.3s",
  },
  navButtonLogout: {
    padding: "10px 15px",
    border: "none",
    background: "#dc3545",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "0.3s",
  },
  searchBox: {
    background: "rgba(255, 255, 255, 0.9)",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "100%",
    maxWidth: "600px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    display: "flex",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    border: "none",
    outline: "none",
  },
  button: {
    display: "flex",
    alignItems: "center",
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    transition: "0.3s",
  },
  icon: {
    marginRight: "8px",
  },
  error: {
    color: "red",
    fontSize: "16px",
    marginTop: "10px",
  },
  resultsContainer: {
    marginTop: "20px",
    textAlign: "left",
  },
  resultsHeading: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  resultsList: {
    listStyleType: "none",
    padding: "0",
    maxHeight: "300px",
    overflowY: "auto",
  },
  resultItem: {
    background: "#f4f4f4",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "0.3s",
  },
  resultItemHover: {
    background: "#e0e0e0",
    transform: "scale(1.02)",
  },
};

// Global styles for hover effects
const globalStyle = `
  .resultItem:hover {
    background: #e0e0e0;
    transform: scale(1.02);
  }
`;

// Inject global styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = globalStyle;
document.head.appendChild(styleSheet);

// Remove scrollbars
document.documentElement.style.overflow = "hidden";
document.body.style.overflow = "hidden";

export default StudentSearch;