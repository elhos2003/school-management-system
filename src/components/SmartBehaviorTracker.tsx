// src/components/SmartBehaviorTracker.tsx
import { useState, useEffect } from "react";
import "./SmartBehaviorTracker.css";

export default function SmartBehaviorTracker({ userName, userEmail }: { userName: string; userEmail: string }) {
  const [behaviorHistory, setBehaviorHistory] = useState<any[]>([]);
  const [currentBehavior, setCurrentBehavior] = useState("acceptable");
  const [totalPoints, setTotalPoints] = useState(0);
  const [lastTeacherComment, setLastTeacherComment] = useState("");

  useEffect(() => {
    if (!userEmail) return;
    const savedGrade = localStorage.getItem(`behavior_grade_${userEmail}`);
    const savedPoints = localStorage.getItem(`behavior_points_${userEmail}`);
    const savedComment = localStorage.getItem(`behavior_comment_${userEmail}`);
    if (savedGrade) setCurrentBehavior(savedGrade);
    if (savedPoints) setTotalPoints(parseInt(savedPoints));
    setLastTeacherComment(savedComment || "No comment yet. Check back later!");
    const today = new Date().toISOString().split('T')[0];
    setBehaviorHistory([{ date: today, grade: savedGrade || "acceptable", points: parseInt(savedPoints || "5") }]);
  }, [userEmail]);

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

  return (
    <div className="behavior-tracker-container">
      <div className="behavior-welcome"><div><h2>👋 Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {userName}!</h2><p>Here's your behavior report from your teacher</p></div><div className="welcome-badge">📋 {new Date().toLocaleDateString()}</div></div>
      
      <div className="behavior-stats">
        <div className="stat-card"><div className="stat-icon">🏆</div><div className="stat-info"><h3>{totalPoints}</h3><p>Total Points</p></div></div>
        <div className="stat-card"><div className="stat-icon">🔥</div><div className="stat-info"><h3>0</h3><p>Day Streak</p></div></div>
        <div className="stat-card"><div className="stat-icon">📅</div><div className="stat-info"><h3>{behaviorHistory.length}</h3><p>Days Tracked</p></div></div>
      </div>

      <div className="dashboard-card"><div className="card-header"><h3>📊 Current Behavior Status</h3></div><div className="current-status-content"><div className="status-badge" style={{ background: getBehaviorColor(currentBehavior) }}>{getBehaviorIcon(currentBehavior)} {getBehaviorText(currentBehavior)}</div><div className="status-message">{currentBehavior === "exemplary" && "Excellent work! Keep shining! ✨"}{currentBehavior === "acceptable" && "Good job! Aim for exemplary next time! 💪"}{currentBehavior === "unacceptable" && "You can do better! Let's improve tomorrow! 📚"}</div></div></div>

      <div className="dashboard-card"><div className="card-header"><h3>👩‍🏫 Teacher's Note</h3></div><div className="teacher-message"><div className="teacher-message-icon">💬</div><div><div className="teacher-message-label">Message from your teacher</div><div className="teacher-message-text">{lastTeacherComment}</div></div></div></div>

      <div className="info-grid"><div className="info-item exemplary"><span>🌟</span><strong>Exemplary</strong><small>Excellent behavior</small></div><div className="info-item acceptable"><span>👍</span><strong>Acceptable</strong><small>Meets expectations</small></div><div className="info-item unacceptable"><span>⚠️</span><strong>Unacceptable</strong><small>Needs improvement</small></div></div>
    </div>
  );
}