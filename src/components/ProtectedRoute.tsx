// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const currentUser = localStorage.getItem("currentUser");
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  try {
    const user = JSON.parse(currentUser);
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <Navigate to="/login" />;
    }
    
    return <>{children}</>;
  } catch (e) {
    return <Navigate to="/login" />;
  }
}