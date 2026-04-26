import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Schedule.css";
import Sidebar from "./Sidebar";

interface Lesson {
  id: number;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface DaySchedule {
  day: string;
  date: string;
  lessons: Lesson[];
}

// ألوان هادية - Pastel
const subjectColors: { [key: string]: string } = {
  "Math": "#93c5fd",
  "Arabic": "#86efac",
  "English": "#fcd34d",
  "Science": "#c4b5fd",
  "Social Studies": "#fca5a5",
  "PE": "#67e8f9",
  "Art": "#f9a8d4",
  "Religion": "#a5b4fc",
};

const days = [
  { id: "Mon", name: "Mon", date: "14" },
  { id: "Tue", name: "Tue", date: "15" },
  { id: "Wed", name: "Wed", date: "16" },
  { id: "Thu", name: "Thu", date: "17" },
  { id: "Fri", name: "Fri", date: "18" },
  { id: "Sat", name: "Sat", date: "19" },
  { id: "Sun", name: "Sun", date: "20" },
];

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00"
];

// 5 حصص في اليوم - منطقي للإعدادية
const weekSchedule: DaySchedule[] = [
  {
    day: "Mon",
    date: "14",
    lessons: [
      { id: 1, subject: "Math", teacher: "Mr. Ahmed", room: "101", startTime: "08:00", endTime: "09:00", color: subjectColors["Math"] },
      { id: 2, subject: "Arabic", teacher: "Ms. Fatima", room: "205", startTime: "09:00", endTime: "10:00", color: subjectColors["Arabic"] },
      { id: 3, subject: "English", teacher: "Mr. John", room: "102", startTime: "10:00", endTime: "11:00", color: subjectColors["English"] },
      { id: 4, subject: "Science", teacher: "Mr. Ali", room: "301", startTime: "11:00", endTime: "12:00", color: subjectColors["Science"] },
      { id: 5, subject: "Social Studies", teacher: "Ms. Laila", room: "202", startTime: "13:00", endTime: "14:00", color: subjectColors["Social Studies"] },
    ]
  },
  {
    day: "Tue",
    date: "15",
    lessons: [
      { id: 6, subject: "Arabic", teacher: "Ms. Fatima", room: "205", startTime: "08:00", endTime: "09:00", color: subjectColors["Arabic"] },
      { id: 7, subject: "Math", teacher: "Mr. Ahmed", room: "101", startTime: "09:00", endTime: "10:00", color: subjectColors["Math"] },
      { id: 8, subject: "PE", teacher: "Mr. Omar", room: "Gym", startTime: "10:00", endTime: "11:00", color: subjectColors["PE"] },
      { id: 9, subject: "English", teacher: "Mr. John", room: "102", startTime: "11:00", endTime: "12:00", color: subjectColors["English"] },
      { id: 10, subject: "Art", teacher: "Ms. Sara", room: "401", startTime: "13:00", endTime: "14:00", color: subjectColors["Art"] },
    ]
  },
  {
    day: "Wed",
    date: "16",
    lessons: [
      { id: 11, subject: "Science", teacher: "Mr. Ali", room: "301", startTime: "08:00", endTime: "09:00", color: subjectColors["Science"] },
      { id: 12, subject: "Math", teacher: "Mr. Ahmed", room: "101", startTime: "09:00", endTime: "10:00", color: subjectColors["Math"] },
      { id: 13, subject: "Arabic", teacher: "Ms. Fatima", room: "205", startTime: "10:00", endTime: "11:00", color: subjectColors["Arabic"] },
      { id: 14, subject: "Religion", teacher: "Sheikh Hassan", room: "103", startTime: "11:00", endTime: "12:00", color: subjectColors["Religion"] },
      { id: 15, subject: "English", teacher: "Mr. John", room: "102", startTime: "13:00", endTime: "14:00", color: subjectColors["English"] },
    ]
  },
  {
    day: "Thu",
    date: "17",
    lessons: [
      { id: 16, subject: "English", teacher: "Mr. John", room: "102", startTime: "08:00", endTime: "09:00", color: subjectColors["English"] },
      { id: 17, subject: "Science", teacher: "Mr. Ali", room: "301", startTime: "09:00", endTime: "10:00", color: subjectColors["Science"] },
      { id: 18, subject: "Math", teacher: "Mr. Ahmed", room: "101", startTime: "10:00", endTime: "11:00", color: subjectColors["Math"] },
      { id: 19, subject: "Social Studies", teacher: "Ms. Laila", room: "202", startTime: "11:00", endTime: "12:00", color: subjectColors["Social Studies"] },
      { id: 20, subject: "Arabic", teacher: "Ms. Fatima", room: "205", startTime: "13:00", endTime: "14:00", color: subjectColors["Arabic"] },
    ]
  },
  {
    day: "Fri",
    date: "18",
    lessons: [
      { id: 21, subject: "Religion", teacher: "Sheikh Hassan", room: "103", startTime: "08:00", endTime: "09:00", color: subjectColors["Religion"] },
      { id: 22, subject: "Arabic", teacher: "Ms. Fatima", room: "205", startTime: "09:00", endTime: "10:00", color: subjectColors["Arabic"] },
      { id: 23, subject: "Math", teacher: "Mr. Ahmed", room: "101", startTime: "10:00", endTime: "11:00", color: subjectColors["Math"] },
      { id: 24, subject: "PE", teacher: "Mr. Omar", room: "Gym", startTime: "11:00", endTime: "12:00", color: subjectColors["PE"] },
      { id: 25, subject: "Science", teacher: "Mr. Ali", room: "301", startTime: "13:00", endTime: "14:00", color: subjectColors["Science"] },
    ]
  },
  {
    day: "Sat",
    date: "19",
    lessons: [
      { id: 26, subject: "Math", teacher: "Mr. Ahmed", room: "101", startTime: "08:00", endTime: "09:00", color: subjectColors["Math"] },
      { id: 27, subject: "English", teacher: "Mr. John", room: "102", startTime: "09:00", endTime: "10:00", color: subjectColors["English"] },
      { id: 28, subject: "Arabic", teacher: "Ms. Fatima", room: "205", startTime: "10:00", endTime: "11:00", color: subjectColors["Arabic"] },
      { id: 29, subject: "Art", teacher: "Ms. Sara", room: "401", startTime: "11:00", endTime: "12:00", color: subjectColors["Art"] },
      { id: 30, subject: "Social Studies", teacher: "Ms. Laila", room: "202", startTime: "13:00", endTime: "14:00", color: subjectColors["Social Studies"] },
    ]
  },
  {
    day: "Sun",
    date: "20",
    lessons: []
  },
];

export default function Schedule() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState("Mon");
  const [currentWeek, setCurrentWeek] = useState(1);
  
  // Get user name from localStorage
  const [userName, setUserName] = useState("Ahmed");
  
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUserName(currentUser);
    }
  }, []);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    "📅 Today: 5 classes scheduled",
    "📰 New exam timetable published",
    "✏️ Math homework due tomorrow"
  ]);

  // Get current day lessons
  const currentDayData = weekSchedule.find(d => d.day === activeDay);
  
  // Get lesson for specific time slot
  const getLessonAtTime = (time: string) => {
    return currentDayData?.lessons.find(l => l.startTime === time);
  };

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  const searchResults = () => {
    if (!searchQuery) return [];
    
    const results: { type: string; title: string; link: string }[] = [];
    
    weekSchedule.forEach(day => {
      day.lessons.forEach(lesson => {
        if (lesson.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ 
            type: "Schedule", 
            title: `${lesson.subject} - ${day.day}`, 
            link: "/schedule" 
          });
        }
        if (lesson.teacher.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ 
            type: "Teacher", 
            title: `${lesson.teacher} - ${lesson.subject}`, 
            link: "/schedule" 
          });
        }
      });
    });
    
    return results;
  };

  // Week navigation
  const nextWeek = () => setCurrentWeek(prev => prev + 1);
  const prevWeek = () => setCurrentWeek(prev => Math.max(1, prev - 1));

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="schedule" />
      
      <main className="main-content schedule-page">
        {/* Header */}
        <header className="dashboard-header">
          <h1>Hello, {userName}</h1>
          <div className="header-actions">
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search ..." 
                  value={searchQuery}
                  onChange={handleSearch}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                />
                <span className="search-icon">🔍</span>
              </div>
              
              {showSearchResults && (
                <div className="search-dropdown">
                  {searchResults().length > 0 ? (
                    searchResults().map((result, i) => (
                      <div 
                        key={i} 
                        className="search-result"
                        onClick={() => {
                          navigate(result.link);
                          setSearchQuery("");
                          setShowSearchResults(false);
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
            <div className="user-profile">
              <div className="avatar">{userName[0]}</div>
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-role">Student</span>
              </div>
            </div>
          </div>
        </header>

        {/* Schedule Content */}
        <div className="schedule-wrapper">
          <h2 className="page-title">WEEKLY COURSE SCHEDULE</h2>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {/* Header Row */}
            <div className="calendar-header">
              <div className="header-cell time-col">Week</div>
              {days.map(day => (
                <div 
                  key={day.id}
                  className={`header-cell day-col ${activeDay === day.id ? 'active' : ''}`}
                  onClick={() => setActiveDay(day.id)}
                >
                  <span className="header-date">{day.date}</span>
                  <span className="header-day">{day.name}</span>
                </div>
              ))}
            </div>

            {/* Time Rows */}
            {timeSlots.map(time => (
              <div key={time} className="calendar-row">
                <div className="time-cell">{time}</div>
                
                {days.map(day => {
                  const lesson = weekSchedule
                    .find(d => d.day === day.id)
                    ?.lessons.find(l => l.startTime === time);
                  
                  if (lesson) {
                    return (
                      <div 
                        key={`${day.id}-${time}`}
                        className={`lesson-cell ${activeDay === day.id ? 'active-day' : ''}`}
                        style={{ 
                          borderColor: lesson.color,
                          background: activeDay === day.id ? lesson.color : `${lesson.color}40`
                        }}
                      >
                        <span className="cell-subject">{lesson.subject}</span>
                        <span className="cell-time">⏱ {lesson.startTime} - {lesson.endTime}</span>
                      </div>
                    );
                  }
                  
                  return <div key={`${day.id}-${time}`} className="empty-cell"></div>;
                })}
              </div>
            ))}
          </div>

          {/* Day Summary */}
          <div className="day-summary">
            <h3>
              {activeDay} - {currentDayData?.lessons.length || 0} Classes
            </h3>
            {currentDayData && currentDayData.lessons.length > 0 ? (
              <div className="lessons-list">
                {currentDayData.lessons.map(lesson => (
                  <div 
                    key={lesson.id} 
                    className="summary-lesson"
                    style={{ borderLeftColor: lesson.color }}
                  >
                    <div className="summary-info">
                      <span className="summary-subject">{lesson.subject}</span>
                      <span className="summary-time">{lesson.startTime} - {lesson.endTime}</span>
                    </div>
                    <div className="summary-meta">
                      <span>👤 {lesson.teacher}</span>
                      <span>📍 {lesson.room}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-lessons">No classes today - Enjoy your day off! 🎉</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}