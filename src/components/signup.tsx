// src/components/signup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!name || !email || !password) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    const emailExists = users.some((user: any) => user.email === email);
    if (emailExists) {
      setError("Email already registered");
      setIsLoading(false);
      return;
    }

    const isAdmin = secretCode === "ADMIN2026";
    
    const newUser = {
      id: Date.now().toString(),
      name: name,
      email: email,
      password: password,
      role: isAdmin ? "admin" : "student",
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    localStorage.setItem("currentUser", JSON.stringify({
      name: name,
      email: email,
      role: isAdmin ? "admin" : "student"
    }));
    
    setSuccess(isAdmin ? "Admin account created successfully!" : "Account created successfully!");
    
    setTimeout(() => {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }, 1500);
    
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

      <form className="login-card" onSubmit={handleSignup}>
        <h1 className="title">Create Account</h1>
        <p className="subtitle">
          Join our school system to access all features.
        </p>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
            placeholder="At least 8 characters"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Secret Code (for admin only)</label>
          <input
            type="password"
            placeholder="Enter secret code if you are admin"
            className="input"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
          />
        </div>

        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign up"}
        </button>
        
        {error && <p className="form-message error-text">{error}</p>}
        {success && <p className="form-message success-text">{success}</p>}

        <p className="signup-text">
          Already have an account? <span onClick={() => navigate("/login")}>Sign in</span>
        </p>
      </form>
    </div>
  );
}