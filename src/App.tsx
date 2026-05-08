// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/login";
import Signup from "./components/signup";
import Dashboard from "./components/dashboard";
import Schedule from "./components/Schedule ";
import Homework from "./components/Homework";
import Grades from "./components/Grades";
import News from "./components/News";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";
import BehaviorTrackerPage from "./components/BehaviorTrackerPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminUsers from "./components/AdminUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminNews from "./components/AdminNews";
import AdminHomework from "./components/AdminHomework";
import AdminBehavior from "./components/AdminBehavior";
import AdminSchedule from "./components/AdminSchedule";
import AdminGrades from "./components/AdminGrades";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Test Route - اضف هذا السطر هنا */}   
        <Route path="/test" element={<div style={{padding: "50px", textAlign: "center"}}><h1>✅ Test Page Works!</h1><p>Routing is working correctly.</p></div>} />

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpassword" element={<ForgotPassword />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/schedule" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Schedule />
          </ProtectedRoute>
        } />
        <Route path="/grades" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Grades />
          </ProtectedRoute>
        } />
        <Route path="/news" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <News />
          </ProtectedRoute>
        } />
        <Route path="/homework" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Homework />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/behavior-tracker" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <BehaviorTrackerPage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/news" element={<ProtectedRoute allowedRoles={["admin"]}><AdminNews /></ProtectedRoute>} />
<Route path="/admin/homework" element={<ProtectedRoute allowedRoles={["admin"]}><AdminHomework /></ProtectedRoute>} />
<Route path="/admin/behavior" element={<ProtectedRoute allowedRoles={["admin"]}><AdminBehavior /></ProtectedRoute>} />
<Route path="/admin/schedule" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSchedule /></ProtectedRoute>} />
<Route path="/admin/grades" element={
<ProtectedRoute allowedRoles={["admin"]}><AdminGrades /></ProtectedRoute>
} />

      </Routes>
      
    </BrowserRouter>
  );
}

export default App;