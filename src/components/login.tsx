// src/components/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email.includes("@")) {
      setError("Enter valid email");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    const foundUser = users.find(
      (user: any) => user.email === email && user.password === password
    );

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify({
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role || "student"
      }));
      
      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }
      
      if (foundUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError("Wrong email or password");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="top-bar">
        <div className="logo">
          <img 
            src="/Photo/WhatsApp Image 2026-03-15 at 4.13.20 PM.jpeg" 
            alt="School Logo" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/60x60?text=School";
            }}
          />
        </div>
      </div>

      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
      <div className="circle circle-4"></div>

      <form className="login-card" onSubmit={handleLogin}>
        <h1 className="title">Welcome Back!</h1>
        <p className="subtitle">
          Please enter your credentials to access your school dashboard.
        </p>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="row">
          <label className="remember-label">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            /> 
            Remember me
          </label>
          <a 
            href="#" 
            className="forgot-link" 
            onClick={(e) => {
              e.preventDefault();
              navigate("/forgetpassword");
            }}
          >
            Forgot password?
          </a>
        </div>

        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
        
        {error && <p className="form-message error-text">{error}</p>}

        <p className="signup-text">
          Don't have an account? <span onClick={() => navigate("/signup")}>Sign up for free!</span>
        </p>
      </form>
    </div>
  );
}