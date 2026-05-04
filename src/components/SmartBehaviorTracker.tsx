// src/components/SmartBehaviorTracker.tsx
import { useState, useEffect } from "react";
import "./SmartBehaviorTracker.css";

export default function SmartBehaviorTracker({ userName }: { userName: string }) {
  const [behaviorHistory, setBehaviorHistory] = useState<any[]>([]);
  const [currentBehavior, setCurrentBehavior] = useState("acceptable");
  const [totalPoints, setTotalPoints] = useState(0);
  const [lastTeacherComment, setLastTeacherComment] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`behaviorTracker_${userName}`);
    if (saved) {
      const data = JSON.parse(saved);
      setBehaviorHistory(data.history || []);
      setTotalPoints(data.points || 0);
      setLastTeacherComment(data.lastComment || "Great job! Keep up the good work! 👏");
      if (data.history && data.history.length > 0) {
        setCurrentBehavior(data.history[0].grade);
      }
    } else {
      // بيانات تجريبية لو مفيش
      setBehaviorHistory([
        { date: new Date().toISOString().split('T')[0], grade: "acceptable", points: 5 }
      ]);
      setTotalPoints(5);
      setLastTeacherComment("Welcome! Start building good habits today! 🌟");
    }
  }, [userName]);

  const getBehaviorColor = (grade: string) => {
    switch(grade) {
      case "exemplary": return "#10b981";
      case "acceptable": return "#f59e0b";
      case "unacceptable": return "#ef4444";
      default: return "#64748b";
    }
  };

  const getBehaviorIcon = (grade: string) => {
    switch(grade) {
      case "exemplary": return "🌟";
      case "acceptable": return "👍";
      case "unacceptable": return "⚠️";
      default: return "❓";
    }
  };

  const getBehaviorText = (grade: string) => {
    switch(grade) {
      case "exemplary": return "Exemplary";
      case "acceptable": return "Acceptable";
      case "unacceptable": return "Unacceptable";
      default: return "";
    }
  };

  const getWeekStreak = () => {
    let streak = 0;
    for (let i = 0; i < behaviorHistory.length; i++) {
      if (behaviorHistory[i].grade === "exemplary") streak++;
      else break;
    }
    return streak;
  };

  return (
    <div className="behavior-tracker-container">
      {/* Welcome Section */}
      <div className="behavior-welcome">
        <div>
          <h2>👋 Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {userName}!</h2>
          <p>Here's your behavior report from your teacher</p>
        </div>
        <div className="welcome-badge">📋 {new Date().toLocaleDateString()}</div>
      </div>

      {/* Stats Grid زي Dashboard */}
      <div className="behavior-stats">
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <h3>{totalPoints}</h3>
            <p>Total Points</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <h3>{getWeekStreak()}</h3>
            <p>Day Streak</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{behaviorHistory.length}</h3>
            <p>Days Tracked</p>
          </div>
        </div>
      </div>

      {/* Current Status Card */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>📊 Current Behavior Status</h3>
        </div>
        <div className="current-status-content">
          <div className="status-badge" style={{ background: getBehaviorColor(currentBehavior) }}>
            {getBehaviorIcon(currentBehavior)} {getBehaviorText(currentBehavior)}
          </div>
          <div className="status-message">
            {currentBehavior === "exemplary" && "Excellent work! Keep shining! ✨"}
            {currentBehavior === "acceptable" && "Good job! Aim for exemplary next time! 💪"}
            {currentBehavior === "unacceptable" && "You can do better! Let's improve tomorrow! 📚"}
          </div>
        </div>
      </div>

      {/* Teacher Message */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>👩‍🏫 Teacher's Note</h3>
        </div>
        <div className="teacher-message">
          <div className="teacher-message-icon">💬</div>
          <div>
            <div className="teacher-message-label">Message from your teacher</div>
            <div className="teacher-message-text">{lastTeacherComment}</div>
          </div>
        </div>
      </div>

      {/* Quick Guide - من غير ارتفاع كبير */}
      <div className="info-grid">
        <div className="info-item exemplary">
          <span>🌟</span>
          <strong>Exemplary</strong>
          <small>Excellent behavior</small>
        </div>
        <div className="info-item acceptable">
          <span>👍</span>
          <strong>Acceptable</strong>
          <small>Meets expectations</small>
        </div>
        <div className="info-item unacceptable">
          <span>⚠️</span>
          <strong>Unacceptable</strong>
          <small>Needs improvement</small>
        </div>
      </div>

      {/* History Chart - قصيرة */}
      <div className="history-chart">
        <h3>📈 Weekly History</h3>
        <div className="history-bars">
          {behaviorHistory.slice(0, 7).map((record, i) => (
            <div key={i} className="history-bar-item">
              <div 
                className="history-bar" 
                style={{ 
                  height: `${record.grade === "exemplary" ? 60 : record.grade === "acceptable" ? 40 : 20}px`,
                  background: getBehaviorColor(record.grade)
                }}
              ></div>
              <span className="history-date">{record.date.slice(5)}</span>
            </div>
          ))}
          {behaviorHistory.length === 0 && (
            <div className="no-history">No data yet. Check back tomorrow!</div>
          )}
        </div>
        
      </div>
    </div>
  );
}