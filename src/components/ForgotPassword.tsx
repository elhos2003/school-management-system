// src/components/ForgetPassword.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // التحقق من وجود الإيميل في localStorage
  const checkEmailExists = (email: string): boolean => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      return userData.email === email;
    }
    return false;
  };

  // تحديث الباسورد في localStorage
  const updatePassword = (email: string, newPassword: string): boolean => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        if (userData.email === email) {
          userData.password = newPassword;
          localStorage.setItem("user", JSON.stringify(userData));
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error("Error updating password:", err);
      return false;
    }
  };

  // Step 1: Send code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      // التحقق من وجود الإيميل
      if (!email || !email.includes("@")) {
        setError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      if (!checkEmailExists(email)) {
        setError("No account found with this email address");
        setIsLoading(false);
        return;
      }

      // لو الإيميل موجود
      setStep(2);
      setSuccess(`Reset code sent to ${email}! (Use code: 123456 for demo)`);
      setResendTimer(60);
      
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setIsLoading(false);
    }, 1500);
  };

  // Step 2: Verify code
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const enteredCode = code.join("");
    if (enteredCode.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      // Demo code: 123456
      if (enteredCode === "123456") {
        setStep(3);
        setSuccess("Code verified! Set your new password.");
      } else {
        setError("Invalid verification code. Please try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Step 3: Reset password - حفظ الباسورد الجديد
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // حفظ الباسورد الجديد في localStorage
      const updated = updatePassword(email, newPassword);
      
      if (updated) {
        setSuccess("Password reset successful! Redirecting to login...");
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError("Something went wrong. Please try again.");
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    
    setSuccess("New code sent! Use: 123456");
    setResendTimer(60);
    
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="card-header">
          <div className="logo">🔐</div>
          <h1>Forgot Password?</h1>
          <p>Enter your email and we'll send you a reset code.</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-icon">
                <span className="icon">📧</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <div className="input-group">
              <label>Verification Code</label>
              <p className="code-instruction">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
              <p className="demo-hint">(Demo: Use code <strong>123456</strong>)</p>
              <div className="code-inputs">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    className="code-input"
                  />
                ))}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>

            <div className="resend-section">
              {resendTimer > 0 ? (
                <p className="resend-timer">Resend code in {resendTimer}s</p>
              ) : (
                <button type="button" className="resend-btn" onClick={handleResendCode}>
                  Resend Code
                </button>
              )}
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="input-group">
              <label>New Password</label>
              <div className="input-icon">
                <span className="icon">🔒</span>
                <input
                  type="password"
                  placeholder="Enter new password (min 8 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-icon">
                <span className="icon">🔒</span>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="card-footer">
          <button className="back-to-login" onClick={() => navigate("/login")}>
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}