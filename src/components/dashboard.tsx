import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import AIAssistant from "./AIAssistant";
import "./dashboard.css";

// Types
interface ScheduleItem {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

interface Grade {
  subject: string;
  exam: string;
  grade: number;
  max: number;
}

interface NewsItem {
  id: number;
  date: string;
  title: string;
  isNew: boolean;
}

interface HomeworkItem {
  id: number;
  subject: string;
  description: string;
  dueDate: string;
}

interface StudentData {
  name: string;
  grades: Grade[];
  schedule: ScheduleItem[];
  news: NewsItem[];
  homework: HomeworkItem[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [studentData, setStudentData] = useState<StudentData>({
    name: "Ahmed",
    grades: [
      { subject: "Mathematics", exam: "Chapter 4 Test", grade: 91, max: 100 },
      { subject: "Physics", exam: "Quiz 2", grade: 63, max: 100 },
    ],
    schedule: [
      { time: "10:00AM-11:00AM", subject: "Mathematics", teacher: "Mr.Ahmed", room: "101" },
      { time: "13:00PM-14:00PM", subject: "English", teacher: "Mr.Ali", room: "109" },
    ],
    news: [
      { id: 1, date: "Nov 20", title: "Midterm exam will start next week", isNew: true },
      { id: 2, date: "Nov 25", title: "School will be closed on Thursday", isNew: true },
    ],
    homework: [
      { id: 1, subject: "Math", description: "Solve exercises page 25", dueDate: "Tomorrow" },
    ],
  });

  // Get user name from localStorage
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setStudentData(prev => ({ ...prev, name: currentUser }));
    }
  }, []);

  // Generate daily notifications
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const savedNotifications = localStorage.getItem(`notifications_${today}`);
    
    if (!savedNotifications) {
      const newNotifications = [
        `📅 Today's Schedule: ${studentData.schedule.length} classes`,
        `📰 Latest News: ${studentData.news.filter(n => n.isNew).length} new items`,
        `✏️ Homework: ${studentData.homework.length} pending`,
      ];
      setNotifications(newNotifications);
      localStorage.setItem(`notifications_${today}`, JSON.stringify(newNotifications));
    } else {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, [studentData]);

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const searchResults = () => {
    if (!searchQuery) return [];
    
    const results: { type: string; title: string; link: string }[] = [];
    
    // Search in schedule
    studentData.schedule.forEach(item => {
      if (item.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: "Schedule", title: item.subject, link: "/schedule" });
      }
    });
    
    // Search in grades
    studentData.grades.forEach(item => {
      if (item.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: "Grades", title: item.subject, link: "/grades" });
      }
    });
    
    // Search in news
    studentData.news.forEach(item => {
      if (item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: "News", title: item.title, link: "/news" });
      }
    });
    
    // Search in homework
    studentData.homework.forEach(item => {
      if (item.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: "Homework", title: item.subject, link: "/homework" });
      }
    });
    
    return results;
  };

  // Calculate average
  const average = studentData.grades.length > 0
    ? Math.round(studentData.grades.reduce((acc, g) => acc + g.grade, 0) / studentData.grades.length)
    : 0;

  // Get grade color
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "excellent";
    if (grade >= 70) return "good";
    return "warning";
  };

  return (
    
    <div className="dashboard-layout">
      <Sidebar activePage="dashboard" />
      
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <h1>Hello, {studentData.name}</h1>
          <div className="header-actions">
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <span className="search-icon">🔍</span>
              </div>
              
              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className="search-dropdown">
                  {searchResults().length > 0 ? (
                    searchResults().map((result, i) => (
                      <div 
                        key={i} 
                        className="search-result"
                        onClick={() => {
                          navigate(result.link);
                          setSearchQuery("");
                        }}
                      >
                        <span className="result-type">{result.type}</span>
                        <span className="result-title">{result.title}</span>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">No results found</div>
                  )}
                </div>
              )}
            </div>
            <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
      <div className="circle circle-4"></div>

            {/* Notification Bell */}
            <div className="notification-container">
              <div 
                className="notification-bell"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </div>
              
              {/* Notifications Dropdown */}
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

            {/* User Profile */}
            <div className="user-profile" onClick={() => navigate("/profile")}>
              <div className="avatar">{studentData.name[0]}</div>
              <div className="user-info">
                <span className="user-name">{studentData.name}</span>
                <span className="user-role">Student</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Grades Average Card */}
          <div className="dashboard-card grades-card">
            <div className="card-icon">⭐</div>
            <h3>Grades Average</h3>
            <div className="grade-value">{average}%</div>
            <span className="view-link" onClick={() => navigate("/grades")}>View details</span>
          </div>

          {/* Today's Schedule */}
          <div className="dashboard-card schedule-card">
            <div className="card-header">
              <h3>📅 Today's Schedule</h3>
              <span className="view-link" onClick={() => navigate("/schedule")}>View Full Schedule</span>
            </div>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody>
                {studentData.schedule.map((item, i) => (
                  <tr key={i}>
                    <td>{item.time}</td>
                    <td>{item.subject}</td>
                    <td>{item.teacher}</td>
                    <td>{item.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Grades */}
          <div className="dashboard-card recent-grades">
            <div className="card-header">
              <h3>⭐ Recent Grades</h3>
              <span className="view-link" onClick={() => navigate("/grades")}>View All Grades</span>
            </div>
            {studentData.grades.map((grade, i) => (
              <div key={i} className="grade-item">
                <div>
                  <div className="grade-subject">{grade.subject}</div>
                  <div className="grade-exam">{grade.exam}</div>
                </div>
                <div className={`grade-score ${getGradeColor(grade.grade)}`}>
                  {grade.grade}/{grade.max}
                </div>
              </div>
            ))}
          </div>

          {/* Latest News */}
          <div className="dashboard-card news-card">
            <div className="card-header">
              <h3>🔔 Latest News</h3>
              <span className="view-link" onClick={() => navigate("/news")}>View All News</span>
            </div>
            {studentData.news.map((news) => (
              <div key={news.id} className="news-item">
                <div className="news-date">{news.date}</div>
                <p className="news-text">{news.title}</p>
                <button className="view-btn" onClick={() => navigate("/news")}>View</button>
              </div>
            ))}
          </div>
        </div>

        {/* 🤖 AI Study Assistant */}
        <div style={{ marginTop: "40px", marginBottom: "20px" }}>
          <AIAssistant />
        </div>
      </main>
    </div>
  );
}