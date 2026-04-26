// src/components/News.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./News.css";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  type: "exam" | "schedule" | "rules" | "trip" | "sports" | "general";
  isNew: boolean;
  image?: string;
  author: string;
}

export default function News() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [userName, setUserName] = useState("Ahmed");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: 1,
      title: "📝 Surprise Math Exam!",
      description: "There will be a surprise exam in Mathematics this Sunday. Please prepare and review previous lessons. The exam will cover chapters 4-6.",
      date: "2026-04-25T08:00:00",
      type: "exam",
      isNew: true,
      author: "Mr. Khalid",
      image: "📝"
    },
    {
      id: 2,
      title: "📅 Midterm Exam Schedule Released",
      description: "The midterm exam schedule for the first semester has been approved. Exams will start on May 15th and continue until May 30th. Check the schedule board for your class timings.",
      date: "2026-04-24T10:30:00",
      type: "schedule",
      isNew: true,
      author: "School Administration",
      image: "📅"
    },
    {
      id: 3,
      title: "⚖️ New Attendance Policy",
      description: "A new policy requires 85% attendance minimum. This will be applied starting next week. Students below this percentage will receive a warning.",
      date: "2026-04-23T14:15:00",
      type: "rules",
      isNew: true,
      author: "Student Affairs",
      image: "⚖️"
    },
    {
      id: 4,
      title: "🚌 Field Trip to the Pyramids",
      description: "The school is organizing a field trip to the Pyramids next Thursday. Ticket price is 250 EGP including transportation and meals. Permission slips are available at the office.",
      date: "2026-04-22T09:00:00",
      type: "trip",
      isNew: false,
      author: "Student Activities",
      image: "🚌"
    },
    {
      id: 5,
      title: "🏆 Football Tournament",
      description: "A football tournament will be held between school classes. Registration is open until the end of the week. Great prizes for winners!",
      date: "2026-04-21T13:45:00",
      type: "sports",
      isNew: false,
      author: "Sports Committee",
      image: "🏆"
    }
  ]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUserName(currentUser);
    }
    
    const today = new Date().toLocaleDateString();
    const savedNotifications = localStorage.getItem(`notifications_news_${today}`);
    
    if (!savedNotifications) {
      const newNotifications = [
        `📰 ${news.filter(n => n.isNew).length} new announcements`,
        `📝 Upcoming exams next week`,
        `🚌 Field trip registration open`,
      ];
      setNotifications(newNotifications);
      localStorage.setItem(`notifications_news_${today}`, JSON.stringify(newNotifications));
    } else {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const markAsRead = (id: number) => {
    setNews(news.map(item => 
      item.id === id ? { ...item, isNew: false } : item
    ));
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      exam: "📝 Exam",
      schedule: "📅 Schedule",
      rules: "⚖️ Rules",
      trip: "🚌 Trip",
      sports: "🏆 Sports",
      general: "📢 General"
    };
    return types[type] || "📢 General";
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      exam: "#ef4444",
      schedule: "#3b82f6",
      rules: "#f59e0b",
      trip: "#10b981",
      sports: "#8b5cf6",
      general: "#64748b"
    };
    return colors[type] || "#64748b";
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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
                <input 
                  type="text" 
                  placeholder="Search news..." 
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>

            <div className="notification-container">
              <div 
                className="notification-bell"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔
                {news.filter(n => n.isNew).length > 0 && (
                  <span className="notification-badge">{news.filter(n => n.isNew).length}</span>
                )}
              </div>
              
              {showNotifications && (
                <div className="notifications-dropdown">
                  <h4>Notifications</h4>
                  {notifications.map((notif, i) => (
                    <div key={i} className="notification-item">
                      {notif}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="user-profile" onClick={() => navigate("/profile")}>
              <div className="avatar">{userName[0]}</div>
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-role">Student</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="news-stats">
          <div className="stat-card-news">
            <span className="stat-emoji">📰</span>
            <div className="stat-info-news">
              <h3>{news.length}</h3>
              <p>Total News</p>
            </div>
          </div>
          <div className="stat-card-news">
            <span className="stat-emoji">🆕</span>
            <div className="stat-info-news">
              <h3>{news.filter(n => n.isNew).length}</h3>
              <p>New Updates</p>
            </div>
          </div>
          <div className="stat-card-news">
            <span className="stat-emoji">📝</span>
            <div className="stat-info-news">
              <h3>{news.filter(n => n.type === "exam").length}</h3>
              <p>Exams</p>
            </div>
          </div>
          <div className="stat-card-news">
            <span className="stat-emoji">🚀</span>
            <div className="stat-info-news">
              <h3>{news.filter(n => n.type === "trip" || n.type === "sports").length}</h3>
              <p>Events</p>
            </div>
          </div>
        </div>

        {/* Type Filters */}
        <div className="news-filters">
          <button 
            className={`filter-btn-news ${selectedType === "all" ? "active" : ""}`}
            onClick={() => setSelectedType("all")}
          >
            All
          </button>
          <button 
            className={`filter-btn-news ${selectedType === "exam" ? "active" : ""}`}
            onClick={() => setSelectedType("exam")}
          >
            📝 Exams
          </button>
          <button 
            className={`filter-btn-news ${selectedType === "schedule" ? "active" : ""}`}
            onClick={() => setSelectedType("schedule")}
          >
            📅 Schedules
          </button>
          <button 
            className={`filter-btn-news ${selectedType === "rules" ? "active" : ""}`}
            onClick={() => setSelectedType("rules")}
          >
            ⚖️ Rules
          </button>
          <button 
            className={`filter-btn-news ${selectedType === "trip" ? "active" : ""}`}
            onClick={() => setSelectedType("trip")}
          >
            🚌 Trips
          </button>
          <button 
            className={`filter-btn-news ${selectedType === "sports" ? "active" : ""}`}
            onClick={() => setSelectedType("sports")}
          >
            🏆 Sports
          </button>
        </div>

        {/* News Grid */}
        <div className="news-grid">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <div 
                key={item.id} 
                className={`news-card ${item.isNew ? "new" : ""}`}
                onClick={() => {
                  setSelectedNews(item);
                  markAsRead(item.id);
                }}
              >
                <div className="news-card-badge" style={{ backgroundColor: getTypeColor(item.type) }}>
                  {getTypeLabel(item.type)}
                </div>
                {item.isNew && <div className="new-badge">NEW</div>}
                <div className="news-card-emoji">{item.image}</div>
                <h3 className="news-card-title">{item.title}</h3>
                <p className="news-card-description">{item.description.substring(0, 100)}...</p>
                <div className="news-card-footer">
                  <span className="news-date">📅 {formatDate(item.date)}</span>
                  <span className="news-author">👤 {item.author}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results-news">
              <span className="no-results-emoji">🔍</span>
              <h3>No news found</h3>
              <p>Try searching for something else</p>
            </div>
          )}
        </div>

        {/* News Detail Modal */}
        {selectedNews && (
          <div className="modal-overlay" onClick={() => setSelectedNews(null)}>
            <div className="modal news-modal" onClick={(e) => e.stopPropagation()}>
              <div className="news-modal-header" style={{ borderTopColor: getTypeColor(selectedNews.type) }}>
                <span className="news-modal-emoji">{selectedNews.image}</span>
                <h2>{selectedNews.title}</h2>
                <button className="modal-close" onClick={() => setSelectedNews(null)}>✕</button>
              </div>
              <div className="news-modal-body">
                <div className="news-meta">
                  <span className="news-type-badge" style={{ backgroundColor: getTypeColor(selectedNews.type) }}>
                    {getTypeLabel(selectedNews.type)}
                  </span>
                  <span className="news-date-full">📅 {new Date(selectedNews.date).toLocaleString()}</span>
                  <span className="news-author-full">✍️ {selectedNews.author}</span>
                </div>
                <p className="news-full-description">{selectedNews.description}</p>
              </div>
              <div className="news-modal-footer">
                <button className="close-btn" onClick={() => setSelectedNews(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}