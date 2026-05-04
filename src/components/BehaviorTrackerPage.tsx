// src/components/BehaviorTrackerPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SmartBehaviorTracker from "./SmartBehaviorTracker";
import "./BehaviorTrackerPage.css";

export default function BehaviorTrackerPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    // طريقة 1: من currentUser
    let name = localStorage.getItem("currentUser");
    
    // طريقة 2: لو مش موجود، جيب من usersarray بالإيميل
    if (!name) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const currentUserEmail = localStorage.getItem("currentUserEmail");
      if (currentUserEmail) {
        const user = users.find((u: any) => u.email === currentUserEmail);
        if (user) name = user.name;
      }
    }
    
    // طريقة 3: لو لسه مش موجود، جيب من savedEmail
    if (!name) {
      const savedEmail = localStorage.getItem("savedEmail");
      if (savedEmail) {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((u: any) => u.email === savedEmail);
        if (user) name = user.name;
      }
    }
    
    // طريقة 4: لو لسه مش موجود، استخدم "Guest"
    if (!name) {
      name = "Guest";
    }
    
    setUserName(name);
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="behavior-tracker" />
      
      <main className="main-content behavior-page">
<header className="dashboard-header">
  <h1>📋 Behavior Report</h1>
  <div className="header-actions">
    <div className="user-profile" onClick={() => navigate("/profile")}>
      <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
      <div className="user-info">
        <span className="user-name">{userName}</span>
        <span className="user-role">Student</span>
      </div>
    </div>
  </div>
</header>

        <SmartBehaviorTracker userName={userName} />
      </main>
    </div>
  );
}