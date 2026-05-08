// src/components/AdminUsers.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminUsers.css";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  grade: string;
  class: string;
  createdAt: string;
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    grade: "Grade 10",
    class: "Class A"
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
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const students = allUsers.filter((u: User) => u.role === "student");
    setUsers(students);
    setFilteredUsers(students);
  };

  const showToastMsg = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    
    if (editingUser) {
      const index = allUsers.findIndex((u: User) => u.id === editingUser.id);
      if (index !== -1) {
        allUsers[index] = {
          ...allUsers[index],
          name: formData.name,
          email: formData.email,
          grade: formData.grade,
          class: formData.class,
        };
        localStorage.setItem("users", JSON.stringify(allUsers));
        showToastMsg("Student updated successfully!", "success");
      }
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password || "12345678",
        role: "student",
        grade: formData.grade,
        class: formData.class,
        createdAt: new Date().toISOString(),
      };
      allUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(allUsers));
      showToastMsg("Student added successfully!", "success");
    }
    
    loadUsers();
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", grade: "Grade 10", class: "Class A" });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      grade: user.grade || "Grade 10",
      class: user.class || "Class A",
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const filtered = allUsers.filter((u: User) => u.id !== id);
      localStorage.setItem("users", JSON.stringify(filtered));
      loadUsers();
      showToastMsg("Student deleted successfully!", "success");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage="admin-users" />
      
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Manage Students</h1>
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
          
          <button className="add-btn" onClick={() => { 
            setEditingUser(null); 
            setFormData({ name: "", email: "", password: "", grade: "Grade 10", class: "Class A" }); 
            setShowModal(true); 
          }}>
            + Add New Student
          </button>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Grade</th>
                <th>Class</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data">No students found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.grade}</td>
                    <td>{user.class}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(user)}>✏️</button>
                      <button className="delete-btn" onClick={() => handleDelete(user.id)}>🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingUser ? "Edit Student" : "Add New Student"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                {!editingUser && (
                  <div className="form-group">
                    <label>Password (default: 12345678)</label>
                    <input type="text" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Leave empty for default" />
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group half">
                    <label>Grade</label>
                    <select value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})}>
                      <option>Grade 9</option>
                      <option>Grade 10</option>
                      <option>Grade 11</option>
                      <option>Grade 12</option>
                    </select>
                  </div>
                  <div className="form-group half">
                    <label>Class</label>
                    <select value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})}>
                      <option>Class A</option>
                      <option>Class B</option>
                      <option>Class C</option>
                    </select>
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