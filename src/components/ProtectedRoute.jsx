// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router"
import { isLoggedIn, getCurrentUser } from "../api/client"


export default function ProtectedRoute({ children, role }) {
  if (!isLoggedIn()) {
    return <Navigate to="/signin" replace />
  }

  if (role) {
    const user = getCurrentUser()
    if (user?.role !== role) {
      return <Navigate to={user?.role === "recruiter" ? "/recruiterdashboard" : "/athletedashboard"} replace />
    }
  }

  return children
}