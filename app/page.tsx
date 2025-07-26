"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import LoadingScreen from "@/components/loading-screen"
import LoginForm from "@/components/auth/login-form"
import LandingPage from "@/components/customer/landing-page"
import AdminDashboard from "@/components/admin/admin-dashboard"
import FirebaseErrorHandler from "@/components/firebase-error-handler"
import { AuthProvider, useAuth } from "@/lib/auth-context"

function AppContent() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const { user, loading } = useAuth()

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false)
  }

  // Check if Firebase is configured
  const isFirebaseConfigured = () => {
    const requiredVars = [
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    ]

    return requiredVars.every((variable) => variable && variable !== "undefined" && variable.trim() !== "")
  }

  // Show Firebase error if not configured
  if (!isFirebaseConfigured()) {
    return <FirebaseErrorHandler />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">INSTA BITE</h2>
          <p className="text-gray-600 font-roboto">Loading your delicious experience...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence>{showLoadingScreen && <LoadingScreen onComplete={handleLoadingComplete} />}</AnimatePresence>

      {!showLoadingScreen && (
        <>{!user ? <LoginForm /> : user.role === "customer" ? <LandingPage /> : <AdminDashboard />}</>
      )}
    </>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
