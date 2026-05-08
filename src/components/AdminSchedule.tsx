// src/components/AdminSchedule.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminSchedule.css";

interface Lesson {
  id: number;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

export default function AdminSchedule() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    day: "Monday",
    time: "08:00",
    subject: "",
    teacher: "",
    room: ""
  });
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [adminName, setAdminName] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setAdminName(user.name);
      } catch (e) {}
    }
    loadSchedule();
  }, []);

  const loadSchedule = () => {
    const saved = localStorage.getItem("admin_schedule");
    if (saved) {
      setLessons(JSON.parse(saved));
    } else {
      const defaultLessons: Lesson[] = [
        { id: 1, day: "Monday", time: "08:00", subject: "Mathematics", teacher: "Mr. Ahmed", room: "101" },
        { id: 2, day: "Monday", time: "09:00", subject: "English", teacher: "Mr. John", room: "102" },
        { id: 3, day: "Tuesday", time: "08:00", subject: "Physics", teacher: "Dr. Nour", room: "203" },
      ];
      setLessons(defaultLessons);
      localStorage.setItem("admin_schedule", JSON.stringify(defaultLessons));
    }
  };

  const showToastMsg = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedSchedule = lessons.map(lesson => ({
      day: lesson.day,
      date: "",
      lessons: lessons.filter(l => l.day === lesson.day).map(l => ({
        id: l.id,
        subject: l.subject,
        teacher: l.teacher,
        room: l.room,
        startTime: l.time.split('-')[0],
        endTime: l.time.split('-')[1] || `${parseInt(l.time.split('-')[0]) + 1}:00`,
        color: "#93c5fd"
      }))
    }));
    
    if (editingItem) {
      const updated = lessons.map(item =>
        item.id === editingItem.id ? { ...item, ...formData } : item
      );
      setLessons(updated);
      localStorage.setItem("admin_schedule", JSON.stringify(updated));
      showToastMsg("Schedule updated successfully!", "success");
    } else {
      const newItem: Lesson = { id: Date.now(), ...formData };
      const updated = [...lessons, newItem];
      setLessons(updated);
      localStorage.setItem("admin_schedule", JSON.stringify(updated));
      showToastMsg("Lesson added successfully!", "success");
      
      // إرسال إشعارات لجميع الطلاب
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const students = users.filter((u: any) => u.role === "student");
      students.forEach((student: any) => {
        const existingNotifs = localStorage.getItem(`notifications_${student.email}`);
        const notifications = existingNotifs ? JSON.parse(existingNotifs) : [];
        const newNotification = {
          id: Date.now(),
          message: `📅 New lesson added: ${formData.subject} on ${formData.day} at ${formData.time}`,
          type: "schedule",
          read: false,
          createdAt: new Date().toLocaleString(),
          link: "/schedule"
        };
        notifications.unshift(newNotification);
        localStorage.setItem(`notifications_${student.email}`, JSON.stringify(notifications.slice(0, 50)));
      });
    }
    
    setShowModal(false);
    setEditingItem(null);
    setFormData({ day: "Monday", time: "08:00", subject: "", teacher: "", room: "" });
  };

  const handleEdit = (item: Lesson) => {
    setEditingItem(item);
    setFormData({
      day: item.day,
      time: item.time,
      subject: item.subject,
      teacher: item.teacher,
      room: item.room
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      const filtered = lessons.filter(item => item.id !== id);
      setLessons(filtered);
      localStorage.setItem("admin_schedule", JSON.stringify(filtered));
      showToastMsg("Lesson deleted successfully!", "success");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="admin-schedule" />
      
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Manage Schedule</h1>
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

        <div className="admin-table-container">
          <button className="add-btn" onClick={() => { setEditingItem(null); setFormData({ day: "Monday", time: "08:00", subject: "", teacher: "", room: "" }); setShowModal(true); }}>
            + Add Lesson
          </button>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Room</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.length === 0 ? (
                <tr><td colSpan={6} className="no-data">No lessons found</td></tr>
              ) : (
                lessons.map((item) => (
                  <tr key={item.id}>
                    <td>{item.day}</td>
                    <td>{item.time}</td>
                    <td><strong>{item.subject}</strong></td>
                    <td>{item.teacher}</td>
                    <td>{item.room}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(item)}>✏️</button>
                      <button className="delete-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingItem ? "Edit Lesson" : "Add Lesson"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group half">
                    <label>Day</label>
                    <select value={formData.day} onChange={(e) => setFormData({...formData, day: e.target.value})}>
                      {days.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group half">
                    <label>Time</label>
                    <select value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}>
                      {times.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <label>Teacher</label>
                    <input type="text" required value={formData.teacher} onChange={(e) => setFormData({...formData, teacher: e.target.value})} />
                  </div>
                  <div className="form-group half">
                    <label>Room</label>
                    <input type="text" required value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="save-btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {toast && (
          <div className={`toast-notification ${toast.type}`}>
            <span className="toast-icon">✅</span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)}>✕</button>
          </div>
        )}
      </main>
    </div>
  );
}