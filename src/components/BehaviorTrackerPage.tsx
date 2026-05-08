// src/components/BehaviorTrackerPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SmartBehaviorTracker from "./SmartBehaviorTracker";
import NotificationBell from "./NotificationBell";
import "./BehaviorTrackerPage.css";

export default function BehaviorTrackerPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Student");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setUserName(user.name || "Student");
        setUserEmail(user.email || "");
      } catch (e) {
        setUserName(currentUser);
      }
    }
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="behavior-tracker" />
      <main className="main-content behavior-page">
        <header className="dashboard-header">
          <h1>Behavior Report</h1>
          <div className="header-actions">
            <NotificationBell />
            <div className="user-profile" onClick={() => navigate("/profile")}>
              <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
              <div className="user-info"><span className="user-name">{userName}</span><span className="user-role">Student</span></div>
            </div>
          </div>
        </header>
        <SmartBehaviorTracker userName={userName} userEmail={userEmail} />
      </main>
    </div>
  );
}