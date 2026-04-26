import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-logo">
          <img 
            src="/Photo/WhatsApp Image 2026-03-15 at 4.13.20 PM.jpeg" 
            alt="School Logo" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/40x40?text=S";
            }}
          />
          <span className="header-logo-text">EduCore</span>
        </div>
        <button className="sign-in-btn" onClick={() => navigate("/login")}>
          Sign in
        </button>
      </header>
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
      <div className="circle circle-4"></div>
      <div className="bg-circle circle-5"></div>  {/* جديد */}
      <div className="bg-circle circle-6"></div>  {/* جديد */}
      <div className="bg-circle circle-8"></div>  {/* جديد */}
      <div className="bg-circle circle-9"></div>  {/* جديد */}
  
      
      

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Manage Your School Smarter</h1>
          <p>
            A comprehensive management system for tracking students,
            Schedule, grades, classes, and Profile — all in one place.
          </p>
          <button className="get-started-btn" onClick={() => navigate("/signup")}>
            Get Started
          </button>
          
        </div>
        
        <div className="hero-image">
          <img 
            src="/Photo/Снимок экрана 2026-03-17 124244.png" 
            alt="School Illustration"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        
      </section>
      {/* Features Section */}
      <section className="features">
        <h2>Everything You Need</h2>
        <p className="features-subtitle">Powerful tools designed for students.</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Student Management</h3>
            <p>Track student records, class assignments, and guardian information in one place.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Grade Management</h3>
            <p>Enter and manage grades across subjects, exams, and terms with ease.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏫</div>
            <h3>Class Organization</h3>
            <p>Create classes, assign teachers, and organize students efficiently.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Dashboards</h3>
            <p>Role-based dashboards with insights for admins, teachers, and students.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <img 
            src="/photo/WhatsApp Image 2026-03-15 at 4.13.20 PM.jpeg" 
            alt="School Logo"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/30x30?text=S";
            }}
          />
        </div>
        <p>© 2026 EduCore. All rights reserved.</p>
      </footer>
    </div>
  );
}