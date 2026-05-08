// src/components/News.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import "./News.css";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
  isNew: boolean;
  author: string;
}

export default function News() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [userName, setUserName] = useState("Student");
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setUserName(user.name || "Student");
      } catch (e) {}
    }
    
    const savedNews = localStorage.getItem("admin_news");
    if (savedNews) {
      try {
        const parsed = JSON.parse(savedNews);
        const formatted = parsed.map((item: any, index: number) => ({
          id: item.id || index + 1,
          title: item.title,
          description: item.description || "",
          date: item.date || new Date().toLocaleDateString(),
          type: item.type || "general",
          isNew: true,
          author: item.author || "Administration"
        }));
        setNews(formatted);
      } catch (e) {}
    }
  }, []);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = { exam: "📝 Exam", schedule: "📅 Schedule", rules: "⚖️ Rules", trip: "🚌 Trip", sports: "🏆 Sports", general: "📢 General" };
    return types[type] || "📢 General";
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = { exam: "#ef4444", schedule: "#3b82f6", rules: "#f59e0b", trip: "#10b981", sports: "#8b5cf6", general: "#64748b" };
    return colors[type] || "#64748b";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="news" />
      <main className="main-content news-page">
        <header className="dashboard-header">
          <h1>News & Announcements</h1>
          <div className="header-actions">
            <div className="search-container">
              <div className="search-box">
                <input type="text" placeholder="Search news..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <span className="search-icon">🔍</span>
              </div>
            </div>
            <NotificationBell />
            <div className="user-profile" onClick={() => navigate("/profile")}>
              <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
              <div className="user-info"><span className="user-name">{userName}</span><span className="user-role">Student</span></div>
            </div>
          </div>
        </header>

        <div className="news-filters">
          {["all", "exam", "schedule", "rules", "trip", "sports"].map(type => (
            <button key={type} className={`filter-btn-news ${selectedType === type ? "active" : ""}`} onClick={() => setSelectedType(type)}>
              {type === "all" ? "All" : getTypeLabel(type)}
            </button>
          ))}
        </div>

        <div className="news-grid">
          {filteredNews.length === 0 ? (
            <div className="no-results-news"><span className="no-results-emoji">🔍</span><h3>No news found</h3><p>Try searching for something else</p></div>
          ) : (
            filteredNews.map(item => (
              <div key={item.id} className="news-card" onClick={() => setSelectedNews(item)}>
                <div className="news-card-badge" style={{ backgroundColor: getTypeColor(item.type) }}>{getTypeLabel(item.type)}</div>
                <h3 className="news-card-title">{item.title}</h3>
                <p className="news-card-description">{item.description.substring(0, 100)}...</p>
                <div className="news-card-footer"><span className="news-date">📅 {item.date}</span><span className="news-author">👤 {item.author}</span></div>
              </div>
            ))
          )}
        </div>

        {selectedNews && (
          <div className="modal-overlay" onClick={() => setSelectedNews(null)}>
            <div className="modal news-modal" onClick={(e) => e.stopPropagation()}>
              <div className="news-modal-header" style={{ borderTopColor: getTypeColor(selectedNews.type) }}><h2>{selectedNews.title}</h2><button className="modal-close" onClick={() => setSelectedNews(null)}>✕</button></div>
              <div className="news-modal-body"><p className="news-full-description">{selectedNews.description}</p></div>
              <div className="news-modal-footer"><button className="close-btn" onClick={() => setSelectedNews(null)}>Close</button></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}