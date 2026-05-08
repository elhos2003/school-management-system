// src/components/Schedule.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import "./Schedule.css";

interface Lesson {
  id: number;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  color: string;
  day: string;
}

interface DaySchedule {
  day: string;
  date: string;
  lessons: Lesson[];
}

const subjectColors: { [key: string]: string } = {
  "Math": "#93c5fd",
  "Arabic": "#86efac",
  "English": "#fcd34d",
  "Science": "#c4b5fd",
  "Social Studies": "#fca5a5",
  "PE": "#67e8f9",
  "Art": "#f9a8d4",
  "Religion": "#a5b4fc",
  "Physics": "#c4b5fd",
  "Chemistry": "#a5b4fc",
  "Biology": "#86efac",
  "History": "#fca5a5",
};

const days = [
  { id: "Mon", name: "Monday", date: "" },
  { id: "Tue", name: "Tuesday", date: "" },
  { id: "Wed", name: "Wednesday", date: "" },
  { id: "Thu", name: "Thursday", date: "" },
  { id: "Fri", name: "Friday", date: "" },
  { id: "Sat", name: "Saturday", date: "" },
  { id: "Sun", name: "Sunday", date: "" },
];

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00"
];

const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay + 1);
  
  return days.map((day, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return {
      ...day,
      date: date.getDate().toString()
    };
  });
};

export default function Schedule() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState("Mon");
  const [weekDays, setWeekDays] = useState(days);
  const [userName, setUserName] = useState("Student");
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setUserName(user.name || "Student");
      } catch (e) {}
    }
    
    setWeekDays(getCurrentWeekDates());
    
    const savedSchedule = localStorage.getItem("admin_schedule");
    if (savedSchedule) {
      try {
        const parsedSchedule = JSON.parse(savedSchedule);
        const groupedSchedule: DaySchedule[] = days.map(day => ({
          day: day.id,
          date: day.date,
          lessons: parsedSchedule.filter((l: any) => l.day === day.name).map((l: any) => ({
            id: l.id,
            day: day.id,
            subject: l.subject,
            teacher: l.teacher,
            room: l.room,
            startTime: l.time.split('-')[0],
            endTime: l.time.split('-')[1] || `${parseInt(l.time.split('-')[0]) + 1}:00`,
            color: subjectColors[l.subject] || "#93c5fd"
          }))
        }));
        setSchedule(groupedSchedule);
      } catch (e) {
        setDefaultSchedule();
      }
    } else {
      setDefaultSchedule();
    }
  }, []);

  const setDefaultSchedule = () => {
    const defaultSchedule: DaySchedule[] = [
      { day: "Mon", date: "", lessons: [] },
      { day: "Tue", date: "", lessons: [] },
      { day: "Wed", date: "", lessons: [] },
      { day: "Thu", date: "", lessons: [] },
      { day: "Fri", date: "", lessons: [] },
      { day: "Sat", date: "", lessons: [] },
      { day: "Sun", date: "", lessons: [] },
    ];
    setSchedule(defaultSchedule);
  };

  const currentDayData = schedule.find(d => d.day === activeDay);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  const searchResults = () => {
    if (!searchQuery) return [];
    const results: { type: string; title: string; link: string }[] = [];
    schedule.forEach(day => {
      day.lessons.forEach(lesson => {
        if (lesson.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ type: "Schedule", title: `${lesson.subject} - ${day.day}`, link: "/schedule" });
        }
        if (lesson.teacher.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ type: "Teacher", title: `${lesson.teacher} - ${lesson.subject}`, link: "/schedule" });
        }
      });
    });
    return results;
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="schedule" />
      
      <main className="main-content schedule-page">
        <header className="dashboard-header">
          <h1>Hello, {userName}</h1>
          <div className="header-actions">
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
                      <div key={i} className="search-result" onClick={() => { navigate(result.link); setSearchQuery(""); setShowSearchResults(false); }}>
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

        <div className="schedule-wrapper">
          <h2 className="page-title">WEEKLY COURSE SCHEDULE</h2>

          <div className="calendar-grid">
            <div className="calendar-header">
              <div className="header-cell time-col">Week</div>
              {weekDays.map(day => (
                <div key={day.id} className={`header-cell day-col ${activeDay === day.id ? 'active' : ''}`} onClick={() => setActiveDay(day.id)}>
                  <span className="header-date">{day.date}</span>
                  <span className="header-day">{day.name}</span>
                </div>
              ))}
            </div>

            {timeSlots.map(time => (
              <div key={time} className="calendar-row">
                <div className="time-cell">{time}</div>
                {weekDays.map(day => {
                  const lesson = schedule.find(d => d.day === day.id)?.lessons.find(l => l.startTime === time);
                  if (lesson) {
                    return (
                      <div key={`${day.id}-${time}`} className={`lesson-cell ${activeDay === day.id ? 'active-day' : ''}`} style={{ borderColor: lesson.color, background: activeDay === day.id ? lesson.color : `${lesson.color}40` }}>
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

          <div className="day-summary">
            <h3>{activeDay} - {currentDayData?.lessons.length || 0} Classes</h3>
            {currentDayData && currentDayData.lessons.length > 0 ? (
              <div className="lessons-list">
                {currentDayData.lessons.map(lesson => (
                  <div key={lesson.id} className="summary-lesson" style={{ borderLeftColor: lesson.color }}>
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