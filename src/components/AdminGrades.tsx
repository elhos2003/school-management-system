// src/components/AdminGrades.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminGrades.css";

interface GradeItem {
  id: number;
  subject: string;
  examName: string;
  grade: number;
  maxGrade: number;
  date: string;
  teacher: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  class: string;
}

export default function AdminGrades() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeItem | null>(null);
  const [formData, setFormData] = useState({
    subject: "",
    examName: "",
    grade: 0,
    maxGrade: 100,
    date: new Date().toISOString().split('T')[0],
    teacher: ""
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
      grade: s.grade || "Grade 10",
      class: s.class || "Class A"
    }));
    setStudents(studentsList);
    setFilteredStudents(studentsList);
  };

  const loadStudentGrades = (studentEmail: string) => {
    const savedGrades = localStorage.getItem(`grades_${studentEmail}`);
    if (savedGrades) {
      setGrades(JSON.parse(savedGrades));
    } else {
      setGrades([]);
    }
  };

  const showToastMsg = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    loadStudentGrades(student.email);
  };

  const handleAddGrade = () => {
    setEditingGrade(null);
    setFormData({
      subject: "",
      examName: "",
      grade: 0,
      maxGrade: 100,
      date: new Date().toISOString().split('T')[0],
      teacher: adminName
    });
    setShowModal(true);
  };

  const handleEditGrade = (grade: GradeItem) => {
    setEditingGrade(grade);
    setFormData({
      subject: grade.subject,
      examName: grade.examName,
      grade: grade.grade,
      maxGrade: grade.maxGrade,
      date: grade.date,
      teacher: grade.teacher
    });
    setShowModal(true);
  };

  const handleDeleteGrade = (id: number) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      const updatedGrades = grades.filter(g => g.id !== id);
      setGrades(updatedGrades);
      if (selectedStudent) {
        localStorage.setItem(`grades_${selectedStudent.email}`, JSON.stringify(updatedGrades));
      }
      showToastMsg("Grade deleted successfully!", "success");
    }
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent) return;
    
    const gradePercent = (formData.grade / formData.maxGrade) * 100;
    let updatedGrades: GradeItem[];
    
    if (editingGrade) {
      updatedGrades = grades.map(g =>
        g.id === editingGrade.id ? { ...g, ...formData } : g
      );
      showToastMsg("Grade updated successfully!", "success");
    } else {
      const newGrade: GradeItem = {
        id: Date.now(),
        ...formData
      };
      updatedGrades = [newGrade, ...grades];
      showToastMsg("Grade added successfully!", "success");
    }
    
    setGrades(updatedGrades);
    localStorage.setItem(`grades_${selectedStudent.email}`, JSON.stringify(updatedGrades));
    
    // إرسال إشعار للطالب
    const existingNotifs = localStorage.getItem(`notifications_${selectedStudent.email}`);
    const notifications = existingNotifs ? JSON.parse(existingNotifs) : [];
    const newNotification = {
      id: Date.now(),
      message: `📊 New grade: ${formData.subject} - ${formData.grade}/${formData.maxGrade} (${Math.round(gradePercent)}%)`,
      type: "grade",
      read: false,
      createdAt: new Date().toLocaleString(),
      link: "/grades"
    };
    notifications.unshift(newNotification);
    localStorage.setItem(`notifications_${selectedStudent.email}`, JSON.stringify(notifications.slice(0, 50)));
    
    setShowModal(false);
  };

  const calculateAverage = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((acc, g) => acc + (g.grade / g.maxGrade) * 100, 0);
    return Math.round(total / grades.length);
  };

  const getGradeColor = (percent: number) => {
    if (percent >= 85) return "excellent";
    if (percent >= 70) return "good";
    if (percent >= 50) return "average";
    return "warning";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="admin-grades" />
      
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Manage Student Grades</h1>
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

        <div className="admin-grades-container">
          <div className="students-list">
            <h3>📋 Students List</h3>
            <div className="search-box">
              <input 
                type="text" 
                placeholder="🔍 Search by name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="students-scroll">
              {filteredStudents.length === 0 ? (
                <p className="no-students">No students found</p>
              ) : (
                filteredStudents.map(student => (
                  <div
                    key={student.id}
                    className={`student-item ${selectedStudent?.id === student.id ? 'active' : ''}`}
                    onClick={() => handleSelectStudent(student)}
                  >
                    <div className="student-avatar">{student.name.charAt(0).toUpperCase()}</div>
                    <div className="student-info">
                      <div className="student-name">{student.name}</div>
                      <div className="student-email">{student.email}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grades-panel">
            {selectedStudent ? (
              <>
                <div className="grades-header">
                  <div>
                    <h2>{selectedStudent.name}</h2>
                    <p className="student-class">{selectedStudent.grade} - {selectedStudent.class}</p>
                  </div>
                  <div className="average-box">
                    <span className="average-label">Average</span>
                    <span className="average-value">{calculateAverage()}%</span>
                  </div>
                </div>

                <button className="add-grade-btn" onClick={handleAddGrade}>
                  + Add Grade
                </button>

                <div className="grades-table-container">
                  {grades.length === 0 ? (
                    <div className="no-grades">
                      <span>📝</span>
                      <p>No grades yet. Click "Add Grade" to add.</p>
                    </div>
                  ) : (
                    <table className="grades-table">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Exam</th>
                          <th>Grade</th>
                          <th>Teacher</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map(grade => {
                          const percent = (grade.grade / grade.maxGrade) * 100;
                          return (
                            <tr key={grade.id}>
                              <td>{grade.subject}</td>
                              <td>{grade.examName}</td>
                              <td>
                                <span className={`grade-badge ${getGradeColor(percent)}`}>
                                  {grade.grade}/{grade.maxGrade}
                                </span>
                              </td>
                              <td>{grade.teacher}</td>
                              <td>{new Date(grade.date).toLocaleDateString()}</td>
                              <td>
                                <button className="edit-btn" onClick={() => handleEditGrade(grade)}>✏️</button>
                                <button className="delete-btn" onClick={() => handleDeleteGrade(grade.id)}>🗑️</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            ) : (
              <div className="no-selection">
                <span>👈</span>
                <h3>Select a student</h3>
                <p>Choose a student from the left panel to manage their grades</p>
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingGrade ? "Edit Grade" : "Add Grade"}</h2>
              <form onSubmit={handleSaveGrade}>
                <div className="form-group">
                  <label>Subject *</label>
                  <input type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Exam Name *</label>
                  <input type="text" required value={formData.examName} onChange={(e) => setFormData({...formData, examName: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <label>Grade *</label>
                    <input type="number" required min="0" max={formData.maxGrade} value={formData.grade} onChange={(e) => setFormData({...formData, grade: parseInt(e.target.value)})} />
                  </div>
                  <div className="form-group half">
                    <label>Max Grade</label>
                    <input type="number" min="1" value={formData.maxGrade} onChange={(e) => setFormData({...formData, maxGrade: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <label>Date</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div className="form-group half">
                    <label>Teacher</label>
                    <input type="text" value={formData.teacher} onChange={(e) => setFormData({...formData, teacher: e.target.value})} />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="save-btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {toast && (
          <div className={`toast-notification ${toast.type}`}>
            <span className="toast-icon">{toast.type === "success" ? "✅" : "❌"}</span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)}>✕</button>
          </div>
        )}
      </main>
    </div>
  );
}