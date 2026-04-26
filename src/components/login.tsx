import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

interface User {
  name: string;
  email: string;
  password: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email.includes("@")) {
      setError("Enter valid email");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setError("No account found ❌");
      return;
    }

    let user: User;

    try {
      user = JSON.parse(storedUser);
    } catch (err) {
      setError("Data corrupted ❌");
      return;
    }

    // ✅ مقارنة الإيميل والباسورد (الجديد بعد الريسيت)
    if (user.email === email && user.password === password) {
      localStorage.setItem("currentUser", user.name);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      navigate("/dashboard");
    } else {
      setError("Wrong email or password ❌");
    }
  };

  return (
    <div className="login-page">
      <div className="top-bar">
        <div className="logo">
          <img
            src="/Photo/WhatsApp Image 2026-03-15 at 4.13.20 PM.jpeg"
            alt="School Logo"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/60x60?text=School";
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
          />
        </div>

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

        <div className="row">
          <label className="remember-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember me
          </label>

          <span
            className="forgot-link"
            onClick={() => navigate("/forgetpassword")}
          >
            Forgot password?
          </span>
        </div>

        <button className="btn" type="submit">
          Sign in
        </button>

        {error && <p className="form-message error-text">{error}</p>}

        <p className="signup-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>
            Sign up for free!
          </span>
        </p>
      </form>
    </div>
  );
}