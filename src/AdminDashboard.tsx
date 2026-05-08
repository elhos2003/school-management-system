// src/components/AdminDashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import Sidebar from "./components/Sidebar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalNews: 0,
    totalHomework: 0
  });

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setAdminName(user.name);
    }
    
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const students = users.filter((u: any) => u.role === "student");
    const news = JSON.parse(localStorage.getItem("news") || "[]");
    const homework = JSON.parse(localStorage.getItem("homework") || "[]");
    
    setStats({
      totalStudents: students.length,
      totalNews: news.length,
      totalHomework: homework.length
    });
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="admin" />
      
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <div className="user-profile" onClick={() => navigate("/profile")}>
              <div className="avatar">{adminName.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name">{adminName}</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card" onClick={() => navigate("/admin/users")}>
            <div className="stat-icon">👨‍🎓</div>
            <div className="stat-info">
              <h3>{stats.totalStudents}</h3>
              <p>Total Students</p>
            </div>
          </div>
          <div className="stat-card" onClick={() => navigate("/admin/news")}>
            <div className="stat-icon">📰</div>
            <div className="stat-info">
              <h3>{stats.totalNews}</h3>
              <p>News Articles</p>
            </div>
          </div>
          <div className="stat-card" onClick={() => navigate("/admin/homework")}>
            <div className="stat-icon">✏️</div>
            <div className="stat-info">
              <h3>{stats.totalHomework}</h3>
              <p>Homework Tasks</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="admin-actions">
            <button className="admin-btn" onClick={() => navigate("/admin/users")}>👨‍🎓 Manage Students</button>
            <button className="admin-btn" onClick={() => navigate("/admin/news")}>📰 Manage News</button>
            <button className="admin-btn" onClick={() => navigate("/admin/homework")}>✏️ Manage Homework</button>
            <button className="admin-btn" onClick={() => navigate("/admin/behavior")}>🎯 Manage Behavior Tracker</button>
          </div>
        </div>
      </main>
    </div>
  );
}