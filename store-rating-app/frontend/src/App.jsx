"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

// Pages
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminStores from "./pages/admin/Stores"
import AdminUsers from "./pages/admin/Users"
import UserDashboard from "./pages/user/Dashboard"
import StoreOwnerDashboard from "./pages/store/Dashboard"
import ChangePassword from "./pages/ChangePassword"
import NotFound from "./pages/NotFound"

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" />
    } else if (user.role === "user") {
      return <Navigate to="/user/dashboard" />
    } else if (user.role === "store") {
      return <Navigate to="/store/dashboard" />
    }
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminStores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          {/* User routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Store owner routes */}
          <Route
            path="/store/dashboard"
            element={
              <ProtectedRoute allowedRoles={["store"]}>
                <StoreOwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Common protected routes */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute allowedRoles={["admin", "user", "store"]}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
