// src/components/Grades.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import "./Grades.css";

interface GradeItem {
  id: number;
  subject: string;
  examName: string;
  grade: number;
  maxGrade: number;
  date: string;
  teacher: string;
}

export default function Grades() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Student");
  const [userEmail, setUserEmail] = useState("");
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "grade">("date");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setUserName(user.name || "Student");
        setUserEmail(user.email || "");
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      const savedGrades = localStorage.getItem(`grades_${userEmail}`);
      if (savedGrades) {
        try {
          setGrades(JSON.parse(savedGrades));
        } catch (e) {}
      }
    }
  }, [userEmail]);

  const filteredGrades = grades.filter(g => selectedSubject === "all" || g.subject === selectedSubject);
  const sortedGrades = [...filteredGrades].sort((a, b) => {
    if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
    return b.grade - a.grade;
  });

  const average = grades.length > 0 ? Math.round(grades.reduce((acc, g) => acc + (g.grade / g.maxGrade) * 100, 0) / grades.length) : 0;
  const subjects = ["all", ...new Set(grades.map(g => g.subject))];

  const getGradeColor = (percent: number) => {
    if (percent >= 85) return "excellent";
    if (percent >= 70) return "good";
    if (percent >= 50) return "average";
    return "warning";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="grades" />
      
      <main className="main-content grades-page">
        <header className="dashboard-header">
          <h1>Hello, {userName}</h1>
          <div className="header-actions">
            <NotificationBell />
            <div className="user-profile" onClick={() => navigate("/profile")}>
              <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-role">Student</span>
              </div>
            </div>
          </div>
        </header>

        <div className="average-card">
          <div className="average-icon">🎓</div>
          <div className="average-info">
            <h3>Overall Average</h3>
            <div className="average-value">{average}%</div>
          </div>
          <div className="average-progress">
            <div className="progress-bar" style={{ width: `${average}%` }}></div>
          </div>
        </div>

        <div className="filters-bar">
          <div className="subject-filters">
            {subjects.map(s => (
              <button key={s} className={`filter-btn ${selectedSubject === s ? "active" : ""}`} onClick={() => setSelectedSubject(s)}>
                {s === "all" ? "All Subjects" : s}
              </button>
            ))}
          </div>
          <div className="sort-buttons">
            <button className={`sort-btn ${sortBy === "date" ? "active" : ""}`} onClick={() => setSortBy("date")}>📅 By Date</button>
            <button className={`sort-btn ${sortBy === "grade" ? "active" : ""}`} onClick={() => setSortBy("grade")}>⭐ By Grade</button>
          </div>
        </div>

        <div className="grades-table-container">
          {grades.length === 0 ? (
            <div className="no-grades"><span className="no-grades-icon">📊</span><h3>No grades available</h3><p>Your teacher hasn't added any grades yet.</p></div>
          ) : (
            <table className="grades-table">
              <thead><tr><th>Subject</th><th>Exam</th><th>Grade</th><th>Teacher</th><th>Date</th></tr></thead>
              <tbody>
                {sortedGrades.map(grade => {
                  const percent = (grade.grade / grade.maxGrade) * 100;
                  return (
                    <tr key={grade.id}>
                      <td className="subject-cell">{grade.subject}</td>
                      <td>{grade.examName}</td>
                      <td><span className={`grade-badge ${getGradeColor(percent)}`}>{grade.grade}/{grade.maxGrade}</span></td>
                      <td>{grade.teacher}</td>
                      <td>{new Date(grade.date).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}