// src/components/AdminBehavior.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminBehavior.css";

interface Student {
  id: string;
  name: string;
  email: string;
  behaviorGrade: string;
  behaviorPoints: number;
  teacherComment: string;
}

export default function AdminBehavior() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    behaviorGrade: "acceptable",
    behaviorPoints: 5,
    teacherComment: ""
  });
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setAdminName(user.name);
      } catch (e) {}
    }
    loadStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const loadStudents = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const studentsList = users.filter((u: any) => u.role === "student").map((s: any) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      behaviorGrade: localStorage.getItem(`behavior_grade_${s.email}`) || "acceptable",
      behaviorPoints: parseInt(localStorage.getItem(`behavior_points_${s.email}`) || "5"),
      teacherComment: localStorage.getItem(`behavior_comment_${s.email}`) || "No comment yet"
    }));
    setStudents(studentsList);
    setFilteredStudents(studentsList);
  };

  const showToastMsg = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      behaviorGrade: student.behaviorGrade,
      behaviorPoints: student.behaviorPoints,
      teacherComment: student.teacherComment
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (selectedStudent) {
      localStorage.setItem(`behavior_grade_${selectedStudent.email}`, formData.behaviorGrade);
      localStorage.setItem(`behavior_points_${selectedStudent.email}`, formData.behaviorPoints.toString());
      localStorage.setItem(`behavior_comment_${selectedStudent.email}`, formData.teacherComment);
      
      setStudents(students.map(s =>
        s.id === selectedStudent.id
          ? { ...s, behaviorGrade: formData.behaviorGrade, behaviorPoints: formData.behaviorPoints, teacherComment: formData.teacherComment }
          : s
      ));
      setFilteredStudents(filteredStudents.map(s =>
        s.id === selectedStudent.id
          ? { ...s, behaviorGrade: formData.behaviorGrade, behaviorPoints: formData.behaviorPoints, teacherComment: formData.teacherComment }
          : s
      ));
      
      // إرسال إشعار للطالب
      const existingNotifs = localStorage.getItem(`notifications_${selectedStudent.email}`);
      const notifications = existingNotifs ? JSON.parse(existingNotifs) : [];
      const newNotification = {
        id: Date.now(),
        message: `🎯 Behavior updated: ${formData.behaviorGrade} - ${formData.teacherComment.substring(0, 50)}`,
        type: "behavior",
        read: false,
        createdAt: new Date().toLocaleString(),
        link: "/behavior-tracker"
      };
      notifications.unshift(newNotification);
      localStorage.setItem(`notifications_${selectedStudent.email}`, JSON.stringify(notifications.slice(0, 50)));
      
      showToastMsg(`Behavior updated for ${selectedStudent.name}!`, "success");
      setShowModal(false);
      setSelectedStudent(null);
    }
  };

  const getGradeBadge = (grade: string) => {
    switch(grade) {
      case "exemplary": return <span className="grade-badge exemplary">🌟 Exemplary</span>;
      case "acceptable": return <span className="grade-badge acceptable">👍 Acceptable</span>;
      case "unacceptable": return <span className="grade-badge unacceptable">⚠️ Unacceptable</span>;
      default: return <span className="grade-badge acceptable">👍 Acceptable</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="admin-behavior" />
      
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Manage Behavior Tracker</h1>
          <div className="header-actions">
            <div className="user-profile" onClick={() => navigate("/profile")}>
              <div className="avatar">{adminName.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name">{adminName}</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-table-container">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="🔍 Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Behavior Grade</th>
                <th>Points</th>
                <th>Teacher Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr><td colSpan={6} className="no-data">No students found</td></tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td><strong>{student.name}</strong></td>
                    <td>{student.email}</td>
                    <td>{getGradeBadge(student.behaviorGrade)}</td>
                    <td className="points">{student.behaviorPoints}</td>
                    <td className="comment-cell">{student.teacherComment.substring(0, 40)}...</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(student)}>✏️ Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && selectedStudent && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Edit Behavior: {selectedStudent.name}</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="form-group">
                  <label>Behavior Grade</label>
                  <select value={formData.behaviorGrade} onChange={(e) => {
                    let points = 5;
                    if (e.target.value === "exemplary") points = 10;
                    if (e.target.value === "unacceptable") points = 0;
                    setFormData({ ...formData, behaviorGrade: e.target.value, behaviorPoints: points });
                  }}>
                    <option value="exemplary">🌟 Exemplary (+10 points)</option>
                    <option value="acceptable">👍 Acceptable (+5 points)</option>
                    <option value="unacceptable">⚠️ Unacceptable (0 points)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Points</label>
                  <input type="number" value={formData.behaviorPoints} onChange={(e) => setFormData({...formData, behaviorPoints: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label>Teacher Comment</label>
                  <textarea rows={3} value={formData.teacherComment} onChange={(e) => setFormData({...formData, teacherComment: e.target.value})} placeholder="Write a comment for the student..." />
                </div>
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="save-btn">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {toast && (
          <div className={`toast-notification ${toast.type}`}>
            <span className="toast-icon">✅</span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)}>✕</button>
          </div>
        )}
      </main>
    </div>
  );
}