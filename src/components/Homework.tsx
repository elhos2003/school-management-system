// src/components/Homework.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import "./Homework.css";

interface HomeworkItem {
  id: number;
  subject: string;
  description: string;
  dueDate: string;
  file?: string;
}

export default function Homework() {
  const navigate = useNavigate();
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [selectedHW, setSelectedHW] = useState<HomeworkItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("Student");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setUserName(user.name || "Student");
      } catch (e) {}
    }
    
    const savedHomework = localStorage.getItem("admin_homework");
    if (savedHomework) {
      try {
        setHomework(JSON.parse(savedHomework));
      } catch (e) {}
    } else {
      setHomework([{ id: 1, subject: "Math", description: "Solve exercises page 25", dueDate: "Tomorrow" }]);
    }
  }, []);

  const handleFileUpload = (id: number, file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: "File size must be less than 5MB", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    const updated = homework.map(hw => hw.id === id ? { ...hw, file: file.name } : hw);
    setHomework(updated);
    setToast({ message: `File "${file.name}" uploaded successfully!`, type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="homework" />
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Hello, {userName}</h1>
          <div className="header-actions">
            <NotificationBell />
            <div className="user-profile" onClick={() => navigate("/profile")}>
              <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
              <div className="user-info"><span className="user-name">{userName}</span><span className="user-role">Student</span></div>
            </div>
          </div>
        </header>

        <div className="homework-grid">
          {homework.map(hw => (
            <div key={hw.id} className="hw-card">
              <h3>{hw.subject}</h3>
              <p>{hw.description}</p>
              <span className="due">Due: {hw.dueDate}</span>
              <label className="upload-btn">📎 Upload File<input type="file" hidden onChange={(e) => handleFileUpload(hw.id, e.target.files?.[0] || null)} /></label>
              {hw.file && <span className="file-name">✅ {hw.file}</span>}
              <button className="view-btn" onClick={() => { setSelectedHW(hw); setShowModal(true); }}>View</button>
            </div>
          ))}
        </div>

        {showModal && selectedHW && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{selectedHW.subject}</h2><p>{selectedHW.description}</p><p className="due">Due: {selectedHW.dueDate}</p>
              {selectedHW.file ? <p className="file-name">📄 {selectedHW.file}</p> : <p>No file uploaded</p>}
              <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}

        {toast && (
          <div className={`toast-notification ${toast.type}`}>
            <span className="toast-icon">{toast.type === "success" ? "✅" : "❌"}</span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)}>✕</button>
          </div>
        )}
      </main>
    </div>
  );
}