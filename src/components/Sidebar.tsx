// src/components/Sidebar.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ activePage }: { activePage: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState("student");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setUserRole(user.role || "student");
      } catch (e) {
        console.error("Error parsing currentUser:", e);
      }
    }
  }, []);

  const studentMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠", path: "/dashboard" },
    { id: "schedule", label: "Schedule", icon: "📅", path: "/schedule" },
    { id: "grades", label: "Grades", icon: "⭐", path: "/grades" },
    { id: "news", label: "News", icon: "📰", path: "/news" },
    { id: "homework", label: "Home Work", icon: "✏️", path: "/homework" },
    { id: "behavior-tracker", label: "Behavior Tracker", icon: "🎯", path: "/behavior-tracker" },
    { id: "profile", label: "Profile", icon: "👤", path: "/profile" },
  ];

  const adminMenuItems = [
    { id: "admin", label: "Admin Dashboard", icon: "🛡️", path: "/admin" },
    { id: "admin-users", label: "Manage Students", icon: "👨‍🎓", path: "/admin/users" },
    { id: "admin-grades", label: "Manage Grades", icon: "📊", path: "/admin/grades" },
    { id: "admin-news", label: "Manage News", icon: "📰", path: "/admin/news" },
    { id: "admin-homework", label: "Manage Homework", icon: "✏️", path: "/admin/homework" },
    { id: "admin-behavior", label: "Manage Behavior", icon: "🎯", path: "/admin/behavior" },
    { id: "admin-schedule", label: "Manage Schedule", icon: "📅", path: "/admin/schedule" },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : studentMenuItems;

  const handleNavigation = (path: string, event?: React.MouseEvent) => {
    // لو ضغط Ctrl/Cmd + Click يفتح في تبويب جديد
    if (event && (event.ctrlKey || event.metaKey)) {
      window.open(path, "_blank");
      return;
    }
    
    // لو ضغط ضغط عادي
    if (location.pathname === path) return;
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("savedEmail");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img 
          src="/Photo/WhatsApp Image 2026-03-15 at 4.13.20 PM.jpeg" 
          alt="School Logo" 
          className="logo-img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/60x60?text=School";
          }}
        />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={(e) => handleNavigation(item.path, e)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </nav>

      <button className="sign-out-btn" onClick={handleLogout}>
        Sign out
      </button>
    </aside>
  );
}