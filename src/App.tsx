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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Schedule" element={<Schedule/>}/>
        <Route path="/Grades" element={<Grades />} />
        <Route path="/News" element={<News />} />
        <Route path="/homework" element={<Homework />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Forgetpassword" element={<ForgotPassword />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;