import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "🏠", path: "/dashboard" },
  { id: "schedule", label: "Schedule", icon: "📅", path: "/schedule" },
  { id: "grades", label: "Grades", icon: "⭐", path: "/grades" },
  { id: "news", label: "News", icon: "📰", path: "/news" },
  { id: "homework", label: "Home Work", icon: "✏️", path: "/homework" },
  { id: "behavior-tracker", label: "Behavior Tracker", icon: "🎯", path: "/behavior-tracker" },
  { id: "Profile", label: "Profile", icon: "👤", path: "/Profile" },
];

export default function Sidebar({ activePage }: { activePage: string }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/Photo/WhatsApp Image 2026-03-15 at 4.13.20 PM.jpeg" alt="School" className="logo-img" />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
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