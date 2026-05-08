// src/components/Profile.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import Sidebar from "./Sidebar";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  grade: string;
  class: string;
  studentId: string;
  birthDate: string;
  address: string;
  parentName: string;
  parentPhone: string;
  profileImage?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("Ahmed");
  const [userEmail, setUserEmail] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("profileDarkMode") === "true";
  });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "+20 123 456 789",
    grade: "Grade 10",
    class: "Class A",
    studentId: "STU-2024-001",
    birthDate: "2010-05-15",
    address: "123 School Street, Cairo",
    parentName: "Mohamed Ahmed",
    parentPhone: "+20 987 654 321",
    profileImage: "",
  });

  const [editData, setEditData] = useState(profile);

  // Apply Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode-profile");
    } else {
      document.body.classList.remove("dark-mode-profile");
    }
    localStorage.setItem("profileDarkMode", String(isDarkMode));
  }, [isDarkMode]);

  // تحميل بيانات المستخدم من localStorage
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setUserName(user.name || "Ahmed");
        setUserEmail(user.email || "");
        
        setProfile(prev => ({ 
          ...prev, 
          name: user.name || prev.name,
          email: user.email || prev.email
        }));
        setEditData(prev => ({ 
          ...prev, 
          name: user.name || prev.name,
          email: user.email || prev.email
        }));
      } catch (e) {
        console.error("Error parsing currentUser:", e);
      }
    }
    
    // تحميل الصورة المحفوظة (باسم الإيميل)
    const currentUser2 = localStorage.getItem("currentUser");
    if (currentUser2) {
      try {
        const user = JSON.parse(currentUser2);
        if (user.email) {
          const savedImage = localStorage.getItem(`profileImage_${user.email}`);
          if (savedImage) {
            setProfile(prev => ({ ...prev, profileImage: savedImage }));
            setEditData(prev => ({ ...prev, profileImage: savedImage }));
          }
        }
      } catch (e) {}
    }
  }, []);

  // رفع صورة من الجهاز
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // التحقق من حجم الملف (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: "File size must be less than 5MB", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    // التحقق من نوع الملف
    if (!file.type.startsWith("image/")) {
      setToast({ message: "Please select an image file", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result as string;
      setProfile(prev => ({ ...prev, profileImage: imageData }));
      setEditData(prev => ({ ...prev, profileImage: imageData }));
      
      // حفظ الصورة باسم الإيميل
      if (userEmail) {
        localStorage.setItem(`profileImage_${userEmail}`, imageData);
      }
      
      setToast({ message: "Profile photo uploaded successfully!", type: "success" });
      setTimeout(() => setToast(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // مسح الصورة
  const deletePhoto = () => {
    setProfile(prev => ({ ...prev, profileImage: "" }));
    setEditData(prev => ({ ...prev, profileImage: "" }));
    if (userEmail) {
      localStorage.removeItem(`profileImage_${userEmail}`);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setToast({ message: "Profile photo deleted", type: "info" });
    setTimeout(() => setToast(null), 3000);
  };

  // فتح نافذة اختيار الملف
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
    localStorage.setItem("userProfile", JSON.stringify(editData));
    
    // تحديث currentUser لو تغير الاسم
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        user.name = editData.name;
        localStorage.setItem("currentUser", JSON.stringify(user));
        setUserName(editData.name);
      } catch (e) {}
    }
    
    setToast({ message: "Profile saved successfully!", type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="profile" />
      
      <main className="main-content profile-page">
        <header className="dashboard-header">
          <h1>My Profile</h1>
          <div className="header-actions">
            <div className="user-profile" onClick={() => navigate("/profile")}>
              <div className="avatar">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className="avatar-img" />
                ) : (
                  userName.charAt(0).toUpperCase() || "A"
                )}
              </div>
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-role">Student</span>
              </div>
            </div>
          </div>
        </header>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="avatar-large-img" />
              ) : (
                <div className="avatar-large">{userName.charAt(0).toUpperCase() || "A"}</div>
              )}
              <div className="avatar-actions">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <button className="edit-avatar-btn" onClick={triggerFileUpload} title="Upload photo">📷</button>
                {profile.profileImage && (
                  <button className="delete-avatar-btn" onClick={deletePhoto} title="Delete photo">🗑️</button>
                )}
              </div>
            </div>
            <div className="profile-title">
              <h2>{userName}</h2>
              <p>{profile.grade} - {profile.class}</p>
              <span className="student-id">ID: {profile.studentId}</span>
            </div>
            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          </div>

          <div className="profile-info-grid">
            <div className="info-section">
              <h3>📋 Personal Information</h3>
              <div className="info-row"><span className="info-label">Full Name:</span><span className="info-value">{userName}</span></div>
              <div className="info-row"><span className="info-label">Email:</span><span className="info-value">{userEmail || profile.email}</span></div>
              <div className="info-row"><span className="info-label">Phone:</span><span className="info-value">{profile.phone}</span></div>
              <div className="info-row"><span className="info-label">Birth Date:</span><span className="info-value">{new Date(profile.birthDate).toLocaleDateString()}</span></div>
              <div className="info-row"><span className="info-label">Address:</span><span className="info-value">{profile.address}</span></div>
            </div>

            <div className="info-section">
              <h3>📚 Academic Information</h3>
              <div className="info-row"><span className="info-label">Grade:</span><span className="info-value">{profile.grade}</span></div>
              <div className="info-row"><span className="info-label">Class:</span><span className="info-value">{profile.class}</span></div>
              <div className="info-row"><span className="info-label">Student ID:</span><span className="info-value">{profile.studentId}</span></div>
            </div>

            <div className="info-section">
              <h3>👨‍👩‍👦 Parent Information</h3>
              <div className="info-row"><span className="info-label">Parent Name:</span><span className="info-value">{profile.parentName}</span></div>
              <div className="info-row"><span className="info-label">Parent Phone:</span><span className="info-value">{profile.parentPhone}</span></div>
            </div>

            <div className="info-section stats-section">
              <h3>📊 Quick Stats</h3>
              <div className="stats-row">
                <div className="stat-item"><div className="stat-number">92%</div><div className="stat-label">Attendance</div></div>
                <div className="stat-item"><div className="stat-number">83.5</div><div className="stat-label">Average Grade</div></div>
                <div className="stat-item"><div className="stat-number">3</div><div className="stat-label">Pending HW</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dark Mode Toggle Button */}
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        {/* Edit Modal */}
        {isEditing && (
          <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal edit-modal" onClick={(e) => e.stopPropagation()}>
              <h2>✏️ Edit Profile</h2>
              <div className="edit-form">
                <div className="form-group"><label>Full Name</label><input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} /></div>
                <div className="form-group"><label>Email</label><input type="email" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} /></div>
                <div className="form-group"><label>Phone</label><input type="tel" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} /></div>
                <div className="form-group"><label>Address</label><input type="text" value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} /></div>
                <div className="form-group"><label>Parent Phone</label><input type="tel" value={editData.parentPhone} onChange={(e) => setEditData({...editData, parentPhone: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                <button className="save-btn" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className={`toast-notification ${toast.type}`}>
            <span className="toast-icon">
              {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : toast.type === "warning" ? "⚠️" : "ℹ️"}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)}>✕</button>
          </div>
        )}
      </main>
    </div>
  );
}