// src/components/dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import AIAssistant from "./AIAssistant";
import NotificationBell from "./NotificationBell";
import "./dashboard.css";

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
  description?: string;
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
  const [userName, setUserName] = useState("Student");
  const [userEmail, setUserEmail] = useState("");
  
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
    news: [],
    homework: [],
  });

  // جلب بيانات المستخدم والمحتوى
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setUserName(user.name || "Student");
        setUserEmail(user.email || "");
      } catch (e) {
        console.error("Error parsing currentUser:", e);
      }
    }
    
    // جلب الأخبار من localStorage
    const savedNews = localStorage.getItem("admin_news");
    if (savedNews) {
      try {
        const parsedNews = JSON.parse(savedNews);
        const formattedNews = parsedNews.map((item: any, index: number) => ({
          id: item.id || index + 1,
          date: item.date || new Date().toLocaleDateString(),
          title: item.title,
          description: item.description || "",
          isNew: true
        }));
        setStudentData(prev => ({ ...prev, news: formattedNews }));
      } catch (e) {}
    }
    
    // جلب الواجبات
    const savedHomework = localStorage.getItem("admin_homework");
    if (savedHomework) {
      try {
        const parsedHomework = JSON.parse(savedHomework);
        setStudentData(prev => ({ ...prev, homework: parsedHomework }));
      } catch (e) {}
    }
    
    // جلب الدرجات الخاصة بالطالب
    if (userEmail) {
      const savedGrades = localStorage.getItem(`grades_${userEmail}`);
      if (savedGrades) {
        try {
          const parsedGrades = JSON.parse(savedGrades);
          if (parsedGrades.length > 0) {
            const formattedGrades = parsedGrades.map((g: any) => ({
              subject: g.subject,
              exam: g.examName,
              grade: g.grade,
              max: g.maxGrade
            }));
            setStudentData(prev => ({ ...prev, grades: formattedGrades }));
          }
        } catch (e) {}
      }
    }
    
    // جلب الجدول
    const savedSchedule = localStorage.getItem("admin_schedule");
    if (savedSchedule) {
      try {
        const parsedSchedule = JSON.parse(savedSchedule);
        const formattedSchedule: ScheduleItem[] = [];
        parsedSchedule.forEach((day: any) => {
          day.lessons.forEach((lesson: any) => {
            formattedSchedule.push({
              time: `${lesson.startTime}-${lesson.endTime}`,
              subject: lesson.subject,
              teacher: lesson.teacher,
              room: lesson.room
            });
          });
        });
        setStudentData(prev => ({ ...prev, schedule: formattedSchedule.slice(0, 3) }));
      } catch (e) {}
    }
  }, [userEmail]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const searchResults = () => {
    if (!searchQuery) return [];
    
    const results: { type: string; title: string; link: string }[] = [];
    
    studentData.schedule.forEach(item => {
      if (item.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: "Schedule", title: item.subject, link: "/schedule" });
      }
    });
    
    studentData.grades.forEach(item => {
      if (item.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: "Grades", title: item.subject, link: "/grades" });
      }
    });
    
    studentData.news.forEach(item => {
      if (item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: "News", title: item.title, link: "/news" });
      }
    });
    
    studentData.homework.forEach(item => {
      if (item.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: "Homework", title: item.subject, link: "/homework" });
      }
    });
    
    return results;
  };

  const average = studentData.grades.length > 0
    ? Math.round(studentData.grades.reduce((acc, g) => acc + g.grade, 0) / studentData.grades.length)
    : 0;

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "excellent";
    if (grade >= 70) return "good";
    return "warning";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="dashboard" />
      
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Hello, {userName}</h1>
          <div className="header-actions">
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

        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>

        <div className="dashboard-grid">
          <div className="dashboard-card grades-card">
            <div className="card-icon">⭐</div>
            <h3>Grades Average</h3>
            <div className="grade-value">{average}%</div>
            <span className="view-link" onClick={() => navigate("/grades")}>View details</span>
          </div>

          <div className="dashboard-card schedule-card">
            <div className="card-header">
              <h3>📅 Today's Schedule</h3>
              <span className="view-link" onClick={() => navigate("/schedule")}>View Full Schedule</span>
            </div>
            {studentData.schedule.length > 0 ? (
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
            ) : (
              <p className="no-data-schedule">No schedule available</p>
            )}
          </div>

          <div className="dashboard-card recent-grades">
            <div className="card-header">
              <h3>⭐ Recent Grades</h3>
              <span className="view-link" onClick={() => navigate("/grades")}>View All Grades</span>
            </div>
            {studentData.grades.length > 0 ? (
              studentData.grades.map((grade, i) => (
                <div key={i} className="grade-item">
                  <div>
                    <div className="grade-subject">{grade.subject}</div>
                    <div className="grade-exam">{grade.exam}</div>
                  </div>
                  <div className={`grade-score ${getGradeColor(grade.grade)}`}>
                    {grade.grade}/{grade.max}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data-grades">No grades available</p>
            )}
          </div>

          <div className="dashboard-card news-card">
            <div className="card-header">
              <h3>🔔 Latest News</h3>
              <span className="view-link" onClick={() => navigate("/news")}>View All News</span>
            </div>
            {studentData.news.length > 0 ? (
              studentData.news.slice(0, 3).map((news) => (
                <div key={news.id} className="news-item">
                  <div className="news-date">{news.date}</div>
                  <p className="news-text">{news.title}</p>
                  <button className="view-btn" onClick={() => navigate("/news")}>View</button>
                </div>
              ))
            ) : (
              <p className="no-data-news">No news available</p>
            )}
          </div>
        </div>

        <div style={{ marginTop: "30px" }}>
          <AIAssistant />
        </div>
      </main>
    </div>
  );
}