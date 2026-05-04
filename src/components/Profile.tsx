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
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("profileDarkMode") === "true";
  });
  // أضف ده مع الـ states التانية
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "moxamed axmed",
    email: "ahmed@school.com",
    phone: "+20 123 456 789",
    grade: "Grade 10",
    class: "Class A",
    studentId: "STU-2024-001",
    birthDate: "2010-05-15",
    address: "123 School Street, Cairo",
    parentName: "Mohamed Ahmed",
    parentPhone: "+20 987 654 321",
    profileImage: localStorage.getItem("profileImage") || "",
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

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUserName(currentUser);
      setProfile(prev => ({ ...prev, name: currentUser }));
    }
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfile(prev => ({ ...prev, profileImage: savedImage }));
      setEditData(prev => ({ ...prev, profileImage: savedImage }));
    }
  }, []);

  // تشغيل الكاميرا - نسخة محسنة
  const startCamera = async () => {
    setCameraError(null);
    
    // التحقق من توفر الكاميرا
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Your browser does not support camera access");
      return;
    }

    try {
      // إيقاف أي كاميرا شغالة قبل تشغيل جديدة
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.setAttribute("playsinline", "true");
        
        // تأكد من تشغيل الفيديو
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.log("Video play error:", e));
        };
      }
      
      setShowCamera(true);
    } catch (err: any) {
      console.error("Camera error:", err);
      
      if (err.name === "NotAllowedError") {
        setCameraError("Camera permission denied. Please allow camera access in your browser settings.");
      } else if (err.name === "NotFoundError") {
        setCameraError("No camera found on your device.");
      } else {
        setCameraError("Cannot access camera. Please check your permissions.");
      }
    }
  };

  // إغلاق الكاميرا
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setCameraError(null);
  };

  // التقاط الصورة
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      // استخدم نفس أبعاد الفيديو
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.9); // استخدم jpeg عشان حجم أصغر
        
        setProfile(prev => ({ ...prev, profileImage: imageData }));
        setEditData(prev => ({ ...prev, profileImage: imageData }));
        localStorage.setItem("profileImage", imageData);
        
        // إغلاق الكاميرا بعد التصوير
        stopCamera();
      }
    }
  };

  // مسح الصورة
  const deletePhoto = () => {
    setProfile(prev => ({ ...prev, profileImage: "" }));
    setEditData(prev => ({ ...prev, profileImage: "" }));
    localStorage.removeItem("profileImage");
  };

  const handleSave = () => {
  setProfile(editData);
  setIsEditing(false);
  localStorage.setItem("userProfile", JSON.stringify(editData));
  
  // Show success message
  setToast({ message: "Profile saved successfully!", type: "success" });
  
  // Auto hide after 3 seconds
  setTimeout(() => setToast(null), 3000);
};

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
    stopCamera();
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
                  userName[0]
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
                <div className="avatar-large">{profile.name[0]?.toUpperCase() || "A"}</div>
              )}
              <div className="avatar-actions">
                <button className="edit-avatar-btn" onClick={startCamera} title="Take photo">📷</button>
                {profile.profileImage && (
                  <button className="delete-avatar-btn" onClick={deletePhoto} title="Delete photo">🗑️</button>
                )}
              </div>
            </div>
            <div className="profile-title">
              <h2>{profile.name}</h2>
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
              <div className="info-row"><span className="info-label">Full Name:</span><span className="info-value">{profile.name}</span></div>
              <div className="info-row"><span className="info-label">Email:</span><span className="info-value">{profile.email}</span></div>
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

        {/* Camera Modal - محسنة */}
        {showCamera && (
          <div className="modal-overlay" onClick={stopCamera}>
            <div className="modal camera-modal" onClick={(e) => e.stopPropagation()}>
              <h2>📸 Take a Photo</h2>
              
              {cameraError ? (
                <div className="camera-error">
                  <span className="error-icon">⚠️</span>
                  <p>{cameraError}</p>
                  <button className="retry-btn" onClick={() => { setCameraError(null); startCamera(); }}>
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <div className="camera-preview">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted
                      className="camera-video"
                    />
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                  </div>
                  <div className="camera-actions">
                    <button className="cancel-btn" onClick={stopCamera}>Cancel</button>
                    <button className="capture-btn" onClick={capturePhoto}>📸 Capture</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

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