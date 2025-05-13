"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Layout = ({ children, title }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const renderNavLinks = () => {
    if (!user) return null

    if (user.role === "admin") {
      return (
        <>
          <Link to="/admin/dashboard" className="px-4 py-2 hover:bg-gray-700 rounded">
            Dashboard
          </Link>
          <Link to="/admin/stores" className="px-4 py-2 hover:bg-gray-700 rounded">
            Stores
          </Link>
          <Link to="/admin/users" className="px-4 py-2 hover:bg-gray-700 rounded">
            Users
          </Link>
        </>
      )
    } else if (user.role === "user") {
      return (
        <Link to="/user/dashboard" className="px-4 py-2 hover:bg-gray-700 rounded">
          Dashboard
        </Link>
      )
    } else if (user.role === "store") {
      return (
        <Link to="/store/dashboard" className="px-4 py-2 hover:bg-gray-700 rounded">
          Dashboard
        </Link>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold">Store Rating System</div>
            {user && (
              <nav className="flex items-center space-x-4">
                {renderNavLinks()}
                <Link to="/change-password" className="px-4 py-2 hover:bg-gray-700 rounded">
                  Change Password
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded">
                  Logout
                </button>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Store Rating System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
