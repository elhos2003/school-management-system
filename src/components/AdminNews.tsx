// src/components/AdminNews.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminNews.css";


interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
}

export default function AdminNews() {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    type: "general"
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
    loadNews();
  }, []);

  const loadNews = () => {
    const saved = localStorage.getItem("admin_news");
    if (saved) {
      setNews(JSON.parse(saved));
    } else {
      // بيانات تجريبية
      const defaultNews = [
        { id: 1, title: "Midterm exams start next week", description: "Please prepare well for your exams", date: "2026-05-15", type: "exam" },
        { id: 2, title: "School field trip", description: "Trip to the museum on Friday", date: "2026-05-20", type: "trip" },
      ];
      setNews(defaultNews);
      localStorage.setItem("admin_news", JSON.stringify(defaultNews));
    }
  };

  const showToastMsg = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      const updated = news.map(item =>
        item.id === editingItem.id ? { ...item, ...formData } : item
      );
      setNews(updated);
      localStorage.setItem("admin_news", JSON.stringify(updated));
      showToastMsg("News updated successfully!", "success");
    } else {
      const newItem: NewsItem = {
        id: Date.now(),
        ...formData,
        date: formData.date || new Date().toISOString().split('T')[0]
      };
      const updated = [newItem, ...news];
      setNews(updated);
      localStorage.setItem("admin_news", JSON.stringify(updated));
      showToastMsg("News added successfully!", "success");
    }
    
    setShowModal(false);
    setEditingItem(null);
    setFormData({ title: "", description: "", date: "", type: "general" });
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      date: item.date,
      type: item.type
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      const filtered = news.filter(item => item.id !== id);
      setNews(filtered);
      localStorage.setItem("admin_news", JSON.stringify(filtered));
      showToastMsg("News deleted successfully!", "success");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="admin-news" />
      
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Manage News</h1>
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
          <button className="add-btn" onClick={() => { setEditingItem(null); setFormData({ title: "", description: "", date: "", type: "general" }); setShowModal(true); }}>
            + Add News
          </button>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.length === 0 ? (
                <tr><td colSpan={5} className="no-data">No news found</td></tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.title}</strong></td>
                    <td>{item.description.substring(0, 50)}...</td>
                    <td>{item.date}</td>
                    <td><span className={`type-badge ${item.type}`}>{item.type}</span></td>
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
              <h2>{editingItem ? "Edit News" : "Add News"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <label>Date</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div className="form-group half">
                    <label>Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                      <option value="general">General</option>
                      <option value="exam">Exam</option>
                      <option value="trip">Trip</option>
                      <option value="sports">Sports</option>
                    </select>
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
            <span className="toast-icon">{toast.type === "success" ? "✅" : "❌"}</span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)}>✕</button>
          </div>
        )}
      </main>
    </div>
  );
}