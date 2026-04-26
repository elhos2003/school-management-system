import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.length < 3 || /^[0-9]/.test(name)) {
      setError("Invalid name");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email");
      return;
    }

    if (password.length < 8) {
      setError("Weak password");
      return;
    }

    if (!terms) {
      setError("You must accept terms");
      return;
    }

    localStorage.setItem("user", JSON.stringify({ name, email, password }));
    navigate("/login");
  };

  return (
    <div className="signup-page">
      {/* Top Bar with Logo */}
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

      {/* Background Circles */}
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>
      <div className="circle circle-4"></div>

      {/* Signup Card */}
      <form className="signup-card" onSubmit={handleSignup}>
        <h1 className="title">Get Started Now</h1>

        {/* Name */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <small className="error"></small>

        {/* Email */}
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <small className="error"></small>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <small className="error"></small>

        {/* Terms */}
        <label className="terms-label">
          <input 
            type="checkbox" 
            checked={terms}
            onChange={() => setTerms(!terms)}
          />
          I agree to the terms & policy
        </label>

        {/* Button */}
        <button className="btn" type="submit">Sign Up</button>
        
        {error && <p className="form-message error-text">{error}</p>}

        {/* Login Link */}
        <p className="login-text">
          Have an account? <span onClick={() => navigate("/login")}>Sign in</span>
        </p>
      </form>
    </div>
  );
}