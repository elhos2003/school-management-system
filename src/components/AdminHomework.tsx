// src/components/AdminHomework.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminHomework.css";

interface HomeworkItem {
  id: number;
  subject: string;
  description: string;
  dueDate: string;
}

export default function AdminHomework() {
  const navigate = useNavigate();
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<HomeworkItem | null>(null);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    dueDate: ""
  });
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setAdminName(user.name);
      } catch (e) {}
    }
    loadHomework();
  }, []);

  const loadHomework = () => {
    const saved = localStorage.getItem("admin_homework");
    if (saved) {
      setHomework(JSON.parse(saved));
    } else {
      const defaultHomework = [
        { id: 1, subject: "Math", description: "Solve exercises page 25", dueDate: "Tomorrow" },
        { id: 2, subject: "Physics", description: "Write report about motion", dueDate: "Next Week" },
      ];
      setHomework(defaultHomework);
      localStorage.setItem("admin_homework", JSON.stringify(defaultHomework));
    }
  };

  const showToastMsg = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      const updated = homework.map(item =>
        item.id === editingItem.id ? { ...item, ...formData } : item
      );
      setHomework(updated);
      localStorage.setItem("admin_homework", JSON.stringify(updated));
      showToastMsg("Homework updated successfully!", "success");
    } else {
      const newItem: HomeworkItem = {
        id: Date.now(),
        ...formData
      };
      const updated = [newItem, ...homework];
      setHomework(updated);
      localStorage.setItem("admin_homework", JSON.stringify(updated));
      showToastMsg("Homework added successfully!", "success");
    }
    
    setShowModal(false);
    setEditingItem(null);
    setFormData({ subject: "", description: "", dueDate: "" });
  };

  const handleEdit = (item: HomeworkItem) => {
    setEditingItem(item);
    setFormData({
      subject: item.subject,
      description: item.description,
      dueDate: item.dueDate
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this homework?")) {
      const filtered = homework.filter(item => item.id !== id);
      setHomework(filtered);
      localStorage.setItem("admin_homework", JSON.stringify(filtered));
      showToastMsg("Homework deleted successfully!", "success");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="admin-homework" />
      
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Manage Homework</h1>
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
          <button className="add-btn" onClick={() => { setEditingItem(null); setFormData({ subject: "", description: "", dueDate: "" }); setShowModal(true); }}>
            + Add Homework
          </button>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {homework.length === 0 ? (
                <tr><td colSpan={4} className="no-data">No homework found</td></tr>
              ) : (
                homework.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.subject}</strong></td>
                    <td>{item.description}</td>
                    <td>{item.dueDate}</td>
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
              <h2>{editingItem ? "Edit Homework" : "Add Homework"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Subject *</label>
                  <input type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea rows={3} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Due Date *</label>
                  <input type="text" required value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} placeholder="e.g., Tomorrow, Friday, 2026-05-20" />
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
            <span className="toast-icon">{toast.type === "success" ? "✅" : "❌"}</span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)}>✕</button>
          </div>
        )}
      </main>
    </div>
  );
}