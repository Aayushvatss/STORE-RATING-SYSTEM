"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "../services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const response = await api.get("/auth/me")
          setUser(response.data)
        }
      } catch (error) {
        console.error("Authentication error:", error)
        localStorage.removeItem("token")
        delete api.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)

      return user
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed")
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await api.put("/auth/change-password", { currentPassword, newPassword })
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update password")
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
