"use client"

import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { ThemeProvider } from "./context/ThemeContext"

// Pages
import HomePage from "./pages/Home"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import CreatePostPage from "./pages/posts/CreatePostPage"
import EditPostPage from "./pages/posts/EditPostPage"
import PostDetailPage from "./pages/posts/PostDetailPage"
import ProfilePage from "./pages/ProfilePage"
import NotFoundPage from "./pages/NotFoundPage"

// Services
import { getUserProfile } from "./services/authService"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      getUserProfile(userId)
        .then((data) => {
          setUser(data)
          setLoading(false)
        })
        .catch(() => {
          localStorage.removeItem("userId")
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  // Auth protection wrapper
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
    return user ? children : <Navigate to="/login" />
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
          <Navbar user={user} setUser={setUser} />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage user={user} />} />
              <Route path="/login" element={<LoginPage setUser={setUser} />} />
              <Route path="/register" element={<RegisterPage setUser={setUser} />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage user={user} setUser={setUser} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/new"
                element={
                  <ProtectedRoute>
                    <CreatePostPage user={user} />
                  </ProtectedRoute>
                }
              />
              <Route path="/posts/:id" element={<PostDetailPage user={user} />} />
              <Route
                path="/posts/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditPostPage user={user} />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="bottom-right" theme="colored" />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App