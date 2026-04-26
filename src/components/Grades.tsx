// src/components/Grades.tsx
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
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
  const [userName, setUserName] = useState("Ahmed");
  const [grades, setGrades] = useState<GradeItem[]>([
    { id: 1, subject: "Mathematics", examName: "Chapter 4 Test", grade: 91, maxGrade: 100, date: "2025-11-15", teacher: "Mr.Ahmed" },
    { id: 2, subject: "Physics", examName: "Quiz 2", grade: 63, maxGrade: 100, date: "2025-11-10", teacher: "Dr.Nour" },
    { id: 3, subject: "English", examName: "Midterm", grade: 88, maxGrade: 100, date: "2025-11-05", teacher: "Mr.John" },
    { id: 4, subject: "Arabic", examName: "Essay", grade: 92, maxGrade: 100, date: "2025-11-01", teacher: "Ms.Fatima" },
    { id: 5, subject: "Science", examName: "Lab Report", grade: 78, maxGrade: 100, date: "2025-10-28", teacher: "Mr.Ali" },
  ]);

  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "grade">("date");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) setUserName(currentUser);
  }, []);

  const filteredGrades = grades.filter(g => 
    selectedSubject === "all" || g.subject === selectedSubject
  );

  const sortedGrades = [...filteredGrades].sort((a, b) => {
    if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
    return b.grade - a.grade;
  });

  const average = Math.round(grades.reduce((acc, g) => acc + (g.grade / g.maxGrade) * 100, 0) / grades.length);
  
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
            <div className="user-profile">
              <div className="avatar">{userName[0]}</div>
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-role">Student</span>
              </div>
            </div>
          </div>
        </header>

        {/* Average Card */}
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

        {/* Filters */}
        <div className="filters-bar">
          <div className="subject-filters">
            {subjects.map(s => (
              <button 
                key={s}
                className={`filter-btn ${selectedSubject === s ? "active" : ""}`}
                onClick={() => setSelectedSubject(s)}
              >
                {s === "all" ? "All Subjects" : s}
              </button>
            ))}
          </div>
          <div className="sort-buttons">
            <button 
              className={`sort-btn ${sortBy === "date" ? "active" : ""}`}
              onClick={() => setSortBy("date")}
            >
              📅 By Date
            </button>
            <button 
              className={`sort-btn ${sortBy === "grade" ? "active" : ""}`}
              onClick={() => setSortBy("grade")}
            >
              ⭐ By Grade
            </button>
          </div>
        </div>

        {/* Grades Table */}
        <div className="grades-table-container">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Exam</th>
                <th>Grade</th>
                <th>Teacher</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedGrades.map(grade => {
                const percent = (grade.grade / grade.maxGrade) * 100;
                return (
                  <tr key={grade.id}>
                    <td className="subject-cell">{grade.subject}</td>
                    <td>{grade.examName}</td>
                    <td>
                      <span className={`grade-badge ${getGradeColor(percent)}`}>
                        {grade.grade}/{grade.maxGrade}
                      </span>
                    </td>
                    <td>{grade.teacher}</td>
                    <td>{new Date(grade.date).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}